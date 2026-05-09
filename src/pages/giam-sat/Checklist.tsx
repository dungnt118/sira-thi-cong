import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Empty,
    Modal,
    Progress,
    Spin,
    Tag,
    Typography,
    message,
} from 'antd';
import {
    ArrowLeftOutlined,
    CameraOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    LockOutlined,
    PlayCircleOutlined,
    PushpinOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { workTaskService } from '@/services/core-contracts/services/workTask.service';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import {
    IWorkTask,
    WorkTaskReviewStatusEnum,
} from '@/services/core-contracts/types/workTask.types';
import { IJourney } from '@/services/core-contracts/types/journey.types';
import { buildFilter } from '@/utils/filterBuilder';

const { Title, Text } = Typography;

/**
 * Wave 6 W6-05 — Supervisor Checklist (rewire from mock).
 *
 * Source of truth: WorkTask records with `journey_step_code='execution'`.
 * Order steps: by `due_time` (asc), fallback `createdAt`.
 *
 * Fields used (Wave 6 W6-04 additions):
 *   - WorkTask.min_photos: ảnh tối thiểu cần upload (0 = không bắt buộc)
 *   - WorkTask.review_status: open | in_progress | awaiting_review | approved | rejected
 *
 * Status display priority:
 *   - review_status (Wave 6) > status (legacy 'pending'/'finished')
 *   - Falls back to status when review_status undefined.
 */

const STEP_STYLE: Record<WorkTaskReviewStatusEnum | 'locked', { color: string; bg: string; label: React.ReactNode }> = {
    locked: { color: '#bbb', bg: '#fafafa', label: <span><LockOutlined /> Khóa</span> },
    open: { color: '#1890ff', bg: '#e6f4ff', label: <span><PlayCircleOutlined /> Mở</span> },
    in_progress: { color: '#fa8c16', bg: '#fff7e6', label: <span><ClockCircleOutlined /> Đang làm</span> },
    awaiting_review: { color: '#722ed1', bg: '#f9f0ff', label: <span>Chờ PM duyệt</span> },
    approved: { color: '#52c41a', bg: '#f6ffed', label: <span><CheckCircleOutlined /> Duyệt</span> },
    rejected: { color: '#ff4d4f', bg: '#fff2f0', label: <span><CloseCircleOutlined /> Từ chối</span> },
};

const getEffectiveStatus = (task: IWorkTask): WorkTaskReviewStatusEnum => {
    if (task.review_status) return task.review_status;
    // Fallback từ legacy status
    if (task.status === 'finished') return 'approved';
    if (task.status === 'skipped') return 'rejected';
    return 'open';
};

const SupervisorChecklist: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [journey, setJourney] = useState<IJourney | null>(null);
    const [tasks, setTasks] = useState<IWorkTask[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState<IWorkTask | null>(null);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [journeyData, tasksRes] = await Promise.all([
                journeyService.findJourneyDto(id).catch(() => null),
                workTaskService.queryWorkTasksDto(buildFilter({
                    where: [
                        { id: 'journey_id', value: id },
                        { id: 'journey_step_code', value: 'execution' },
                    ],
                    sortBy: [{ id: 'due_time', desc: false }],
                    limit: 50,
                })),
            ]);
            setJourney(journeyData);
            setTasks(tasksRes?.data || []);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải checklist.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Handlers ───────────────────────────────────────────── */

    const handleStepClick = (task: IWorkTask) => {
        const status = getEffectiveStatus(task);
        if (status === 'approved') {
            // Already approved — no action
            return;
        }
        setSelectedTask(task);
        setUploadModalOpen(true);
    };

    const handleStartTask = async (task: IWorkTask) => {
        try {
            const updated = await workTaskService.updateWorkTask(task._id, {
                review_status: 'in_progress',
            });
            setTasks(prev => prev.map(t => t._id === updated._id ? { ...t, review_status: 'in_progress' } : t));
            message.success('Đã bắt đầu bước thi công');
        } catch (e: any) {
            message.error(e?.message || 'Cập nhật thất bại.');
        }
    };

    /* ─── Computed ───────────────────────────────────────────── */

    const approvedCount = tasks.filter(t => getEffectiveStatus(t) === 'approved').length;
    const progress = tasks.length > 0 ? Math.round((approvedCount / tasks.length) * 100) : 0;
    const currentTask = tasks.find(t => {
        const s = getEffectiveStatus(t);
        return s === 'open' || s === 'in_progress' || s === 'awaiting_review' || s === 'rejected';
    });

    /* ─── Render ─────────────────────────────────────────────── */

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>;
    }
    if (!journey) {
        return <Empty description="Không tìm thấy công trình" />;
    }
    if (tasks.length === 0) {
        return (
            <div style={{ padding: 16 }}>
                <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate('/admin/gs/dashboard')}>Quay lại</Button>
                <Empty description="Chưa có bước thi công nào cho công trình này. Tạo WorkTask với journey_step_code='execution' từ phía PM." style={{ marginTop: 24 }} />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate('/admin/gs/dashboard')} />
                <div style={{ flex: 1 }}>
                    <Title level={5} style={{ margin: 0 }}>{journey.journey_code ?? id?.slice(-6).toUpperCase()}</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>{(journey as any).name ?? (journey as any).journey_name ?? journey.customer_full_name ?? '—'}</Text>
                </div>
                <Button icon={<ReloadOutlined />} size="small" onClick={fetchData} />
            </div>

            {/* Progress Summary */}
            <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontWeight: 600 }}>Tiến độ tổng</Text>
                    <Text style={{ fontWeight: 700, color: '#1976D2', fontSize: 16 }}>{progress}%</Text>
                </div>
                <Progress percent={progress} status="active" strokeColor={{ from: '#1976D2', to: '#42a5f5' }} showInfo={false} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999', marginTop: 4 }}>
                    <span>Đã duyệt: {approvedCount}/{tasks.length} bước</span>
                </div>
            </Card>

            {/* Current Task Highlight */}
            {currentTask && (
                <div style={{
                    padding: '12px 16px', background: 'linear-gradient(135deg, #1976D2, #42a5f5)',
                    borderRadius: 12, color: '#fff', marginBottom: 12,
                    boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
                }}>
                    <div style={{ fontSize: 12, opacity: 0.8 }}><PushpinOutlined /> Bước đang thực hiện</div>
                    <div style={{ fontSize: 16, fontWeight: 700, margin: '4px 0' }}>{currentTask.title}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{currentTask.description}</div>
                    <Button
                        block
                        style={{ marginTop: 12, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', height: 40 }}
                        icon={<CameraOutlined />}
                        onClick={() => handleStepClick(currentTask)}
                    >
                        Tải lên ảnh bước này
                    </Button>
                </div>
            )}

            {/* Full Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tasks.map((task, index) => {
                    const status = getEffectiveStatus(task);
                    const style = STEP_STYLE[status];
                    const isClickable = status !== 'approved';
                    return (
                        <div
                            key={task._id}
                            onClick={() => handleStepClick(task)}
                            style={{
                                padding: '10px 12px',
                                background: style.bg,
                                borderRadius: 10,
                                border: `1px solid ${style.color}40`,
                                cursor: isClickable ? 'pointer' : 'default',
                                transition: 'all 0.15s',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: style.color, color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                                    }}>
                                        {status === 'approved' ? <CheckCircleOutlined /> : (index + 1)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                                            {task.title}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#999' }}>
                                            {task.min_photos ? `${task.min_photos} ảnh tối thiểu` : 'Không bắt buộc ảnh'}
                                        </div>
                                    </div>
                                </div>
                                <Tag style={{ fontSize: 10, border: `1px solid ${style.color}`, background: style.bg, color: style.color }}>
                                    {style.label}
                                </Tag>
                            </div>

                            {/* Rejection feedback */}
                            {status === 'rejected' && task.note && (
                                <div style={{ marginTop: 6, padding: '4px 8px', background: '#fff2f0', borderRadius: 6, fontSize: 11, color: '#ff4d4f' }}>
                                    <CloseCircleOutlined /> PM từ chối: {task.note}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Upload Evidence Modal */}
            <Modal
                title={selectedTask ? (<span><CameraOutlined /> {selectedTask.title}</span>) : 'Tải ảnh'}
                open={uploadModalOpen && !!selectedTask}
                onCancel={() => { setUploadModalOpen(false); setSelectedTask(null); }}
                footer={null}
                centered
                destroyOnHidden
            >
                {selectedTask && (
                    <div>
                        {selectedTask.description && (
                            <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                                {selectedTask.description}
                            </div>
                        )}
                        {selectedTask.min_photos != null && selectedTask.min_photos > 0 && (
                            <Alert
                                message={`Cần tải tối thiểu ${selectedTask.min_photos} ảnh cho bước này`}
                                type="info"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}
                        {getEffectiveStatus(selectedTask) === 'open' && (
                            <Button
                                type="default"
                                block
                                size="large"
                                icon={<PlayCircleOutlined />}
                                style={{ marginBottom: 8 }}
                                onClick={() => {
                                    handleStartTask(selectedTask);
                                    setUploadModalOpen(false);
                                    setSelectedTask(null);
                                }}
                            >
                                Bắt đầu bước này
                            </Button>
                        )}
                        <Button
                            type="primary"
                            block
                            size="large"
                            icon={<CameraOutlined />}
                            onClick={() => {
                                navigate(`/admin/gs/evidence/${id}/${selectedTask._id}`);
                                setUploadModalOpen(false);
                            }}
                        >
                            Mở màn hình tải ảnh
                        </Button>
                        <Button
                            block
                            style={{ marginTop: 8 }}
                            onClick={() => { setUploadModalOpen(false); setSelectedTask(null); }}
                        >
                            Đóng
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SupervisorChecklist;
