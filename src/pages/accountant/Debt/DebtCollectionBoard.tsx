import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Col,
    Empty,
    Input,
    Popconfirm,
    Row,
    Space,
    Spin,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    BellOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    PhoneOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';

import { debtCollectionTaskService } from '../../../services/core-contracts/services/debtCollectionTask.service';
import {
    DebtCollectionTaskStatusEnum,
    DebtCollectionTaskTaskTypeEnum,
    IDebtCollectionTask,
} from '../../../services/core-contracts/types/debtCollectionTask.types';
import { buildFilter } from '@/utils/filterBuilder';
import CollectionTaskModal from './components/CollectionTaskModal';

const { Text, Title } = Typography;

/**
 * Wave 4 W4-05 — Debt Collection Board cho KT.
 *
 * Kanban-style: 6 columns ứng với 6 status. KT kéo thả (giả lập bằng action menu).
 * Có thể mở từ DebtConfirmationList với query param ?confirmation_id=X để pre-fill modal.
 */

const STATUS_COLUMNS: Array<{ key: DebtCollectionTaskStatusEnum; label: string; color: string; bgColor: string }> = [
    { key: 'open', label: 'Mới', color: '#8c8c8c', bgColor: '#f5f5f5' },
    { key: 'in_progress', label: 'Đang xử lý', color: '#1890ff', bgColor: '#e6f7ff' },
    { key: 'committed', label: 'Đã cam kết', color: '#722ed1', bgColor: '#f9f0ff' },
    { key: 'completed', label: 'Đã thu', color: '#52c41a', bgColor: '#f6ffed' },
    { key: 'overdue', label: 'Quá hạn', color: '#cf1322', bgColor: '#fff1f0' },
    { key: 'cancelled', label: 'Đã huỷ', color: '#bfbfbf', bgColor: '#fafafa' },
];

const TYPE_ICON: Record<DebtCollectionTaskTaskTypeEnum, React.ReactNode> = {
    reminder_call: <PhoneOutlined />,
    reminder_message: <MessageOutlined />,
    commitment_follow_up: <BellOutlined />,
    escalation: <WarningOutlined />,
};

const TYPE_LABEL: Record<DebtCollectionTaskTaskTypeEnum, string> = {
    reminder_call: 'Gọi nhắc',
    reminder_message: 'Gửi tin nhắn',
    commitment_follow_up: 'Theo dõi cam kết',
    escalation: 'Leo thang',
};

const NEXT_STATUS: Record<DebtCollectionTaskStatusEnum, DebtCollectionTaskStatusEnum | null> = {
    open: 'in_progress',
    in_progress: 'committed',
    committed: 'completed',
    completed: null,
    overdue: 'in_progress',
    cancelled: null,
};

const DebtCollectionBoard: React.FC = () => {
    const [searchParams] = useSearchParams();
    const initialConfirmationId = searchParams.get('confirmation_id');

    const [tasks, setTasks] = useState<IDebtCollectionTask[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<IDebtCollectionTask | null>(null);
    const [prefillConfirmationId, setPrefillConfirmationId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await debtCollectionTaskService.queryDebtCollectionTasksDto(buildFilter({
                sortBy: [{ id: 'scheduled_at', desc: false }],
                limit: 300,
            }));
            setTasks(res?.data || []);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải danh sách task nhắc nợ.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Auto-open modal nếu có confirmation_id query param.
    useEffect(() => {
        if (initialConfirmationId && !modalOpen) {
            setPrefillConfirmationId(initialConfirmationId);
            setEditing(null);
            setModalOpen(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialConfirmationId]);

    /* ─── Filtering + grouping ──────────────────────────────── */

    const filteredTasks = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return tasks;
        return tasks.filter(t => {
            return (t.code ?? '').toLowerCase().includes(q)
                || ((t as any).idx_customer_id?.title ?? '').toLowerCase().includes(q)
                || (t.next_action ?? '').toLowerCase().includes(q)
                || (t.result_note ?? '').toLowerCase().includes(q);
        });
    }, [tasks, search]);

    const groupedTasks = useMemo(() => {
        const groups: Record<DebtCollectionTaskStatusEnum, IDebtCollectionTask[]> = {
            open: [], in_progress: [], committed: [], completed: [], overdue: [], cancelled: [],
        };
        filteredTasks.forEach(t => {
            const k = t.status ?? 'open';
            if (groups[k]) groups[k].push(t);
        });
        return groups;
    }, [filteredTasks]);

    /* ─── Handlers ──────────────────────────────────────────── */

    const handleOpenCreate = () => {
        setEditing(null);
        setPrefillConfirmationId(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (task: IDebtCollectionTask) => {
        setEditing(task);
        setPrefillConfirmationId(null);
        setModalOpen(true);
    };

    const handleStatusTransition = async (task: IDebtCollectionTask, next: DebtCollectionTaskStatusEnum) => {
        try {
            const patch: any = { status: next };
            if (next === 'completed') patch.completed_at = new Date().toISOString();
            const updated = await debtCollectionTaskService.updateDebtCollectionTask(task._id, patch);
            setTasks(prev => prev.map(x => x._id === updated._id ? updated : x));
            message.success(`Đã chuyển sang ${STATUS_COLUMNS.find(c => c.key === next)?.label ?? next}`);
        } catch (e: any) {
            message.error(e?.message || 'Cập nhật thất bại.');
        }
    };

    const handleSuccess = (saved: IDebtCollectionTask) => {
        setTasks(prev => {
            const idx = prev.findIndex(x => x._id === saved._id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = saved;
                return next;
            }
            return [saved, ...prev];
        });
        setModalOpen(false);
    };

    /* ─── Card render ───────────────────────────────────────── */

    const renderCard = (task: IDebtCollectionTask) => {
        const customer = (task as any).idx_customer_id;
        const isOverdue = task.scheduled_at
            && dayjs(task.scheduled_at).isBefore(dayjs(), 'day')
            && !['completed', 'cancelled'].includes(task.status ?? '');
        const next = NEXT_STATUS[task.status ?? 'open'];
        const taskType = task.task_type ?? 'reminder_call';

        return (
            <Card
                key={task._id}
                size="small"
                hoverable
                onClick={() => handleOpenEdit(task)}
                style={{
                    marginBottom: 8,
                    borderLeft: isOverdue ? '3px solid #cf1322' : '3px solid transparent',
                    cursor: 'pointer',
                }}
                styles={{ body: { padding: 10 } }}
            >
                <Space direction="vertical" size={2} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Tag color="blue" icon={TYPE_ICON[taskType]}>
                            {TYPE_LABEL[taskType]}
                        </Tag>
                        {isOverdue && <Tag color="error" style={{ fontSize: 10 }}>Trễ hạn</Tag>}
                    </div>
                    <Text strong style={{ fontSize: 13 }}>
                        {customer?.title ?? customer?.name ?? '(Khách hàng)'}
                    </Text>
                    {task.debt_amount ? (
                        <Text style={{ fontSize: 12, color: '#cf1322' }}>
                            Nợ: {task.debt_amount.toLocaleString('vi-VN')}đ
                        </Text>
                    ) : null}
                    {task.scheduled_at && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            <ClockCircleOutlined /> {dayjs(task.scheduled_at).format('DD/MM/YYYY')}
                        </Text>
                    )}
                    {task.customer_commitment_date && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            Cam kết: {dayjs(task.customer_commitment_date).format('DD/MM/YYYY')}
                        </Text>
                    )}
                    {task.next_action && (
                        <Text style={{ fontSize: 11, color: '#595959' }} ellipsis={{ tooltip: task.next_action }}>
                            → {task.next_action}
                        </Text>
                    )}
                    {next && (
                        <Popconfirm
                            title={`Chuyển sang ${STATUS_COLUMNS.find(c => c.key === next)?.label}?`}
                            onConfirm={(e) => {
                                e?.stopPropagation();
                                handleStatusTransition(task, next);
                            }}
                            onCancel={(e) => e?.stopPropagation()}
                        >
                            <Button
                                size="small"
                                type="link"
                                icon={<CheckCircleOutlined />}
                                onClick={(e) => e.stopPropagation()}
                                style={{ padding: 0, height: 'auto', fontSize: 11 }}
                            >
                                → {STATUS_COLUMNS.find(c => c.key === next)?.label}
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </Card>
        );
    };

    /* ─── Render ───────────────────────────────────────────── */

    return (
        <Card
            title={
                <Space>
                    <BellOutlined style={{ color: '#fa8c16' }} />
                    <span>Bảng nhắc thu hồi Công nợ</span>
                </Space>
            }
            extra={
                <Space>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Tìm theo mã, tên KH..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        allowClear
                        style={{ width: 240 }}
                    />
                    <Tooltip title="Làm mới">
                        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
                    </Tooltip>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
                        Tạo task mới
                    </Button>
                </Space>
            }
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>
            ) : tasks.length === 0 ? (
                <Empty description="Chưa có task nhắc thu hồi nào." />
            ) : (
                <Row gutter={[12, 12]} style={{ minHeight: 480 }}>
                    {STATUS_COLUMNS.map(col => {
                        const items = groupedTasks[col.key] ?? [];
                        return (
                            <Col key={col.key} xs={24} sm={12} md={8} lg={4}>
                                <div style={{
                                    background: col.bgColor,
                                    borderRadius: 8,
                                    padding: 8,
                                    minHeight: 400,
                                }}>
                                    <Title level={5} style={{ margin: 0, marginBottom: 8, color: col.color, fontSize: 13 }}>
                                        {col.label} <Badge count={items.length} style={{ backgroundColor: col.color }} />
                                    </Title>
                                    {items.length === 0 ? (
                                        <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
                                    ) : (
                                        items.map(renderCard)
                                    )}
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            )}

            <CollectionTaskModal
                open={modalOpen}
                task={editing}
                debtConfirmationId={prefillConfirmationId ?? undefined}
                onClose={() => setModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </Card>
    );
};

export default DebtCollectionBoard;
