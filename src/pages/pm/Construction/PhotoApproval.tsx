// @ts-nocheck
import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Image, Modal,
    Tabs, Alert, Badge, Radio, Input, Space, Avatar, Divider, Empty
} from 'antd';
import {
    ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined,
    EyeOutlined, UserOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { mockProjects as defaultProjects } from '../../../data/mockData';
import type { Project, StepStatus } from '../../../types/legacy-project';
import { message } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

type FilterType = 'ALL' | 'AWAITING' | 'APPROVED' | 'REJECTED';

const REJECT_REASONS = [
    'Ảnh không rõ nét',
    'Không đúng vị trí yêu cầu',
    'Sai giai đoạn thi công',
    'Bề mặt chưa đạt tiêu chuẩn',
    'Khác',
];

const STATUS_COLOR: Partial<Record<StepStatus, string>> = {
    AWAITING_REVIEW: 'orange',
    APPROVED: 'success',
    REJECTED: 'error',
    IN_PROGRESS: 'processing',
};

const PhotoApproval: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [mockProjects, setMockProjects] = useLocalStorageData<Project[]>(demoDataService.KEYS.PROJECTS, defaultProjects);
    const project = mockProjects.find(p => p.id === id);

    const [filter, setFilter] = useState<FilterType>('AWAITING');
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<{ stepId: string; evidenceId?: string } | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [saving, setSaving] = useState(false);

    if (!project) return <div>Không tìm thấy dự án</div>;

    const stepsWithPhotos = project.steps.filter(s => s.evidences.length > 0);
    const allEvidences = stepsWithPhotos.flatMap(s => s.evidences.map(e => ({ ...e, stepName: s.name, stepOrder: s.order })));

    const totalEvidence = allEvidences.length;
    const totalApproved = allEvidences.filter(e => e.status === 'APPROVED').length;
    const totalRejected = allEvidences.filter(e => e.status === 'REJECTED').length;
    const totalAwaiting = allEvidences.filter(e => e.status === 'PENDING').length;

    const filteredSteps = stepsWithPhotos.filter(s => {
        if (filter === 'ALL') return true;
        if (filter === 'AWAITING') return s.status === 'AWAITING_REVIEW' || s.status === 'IN_PROGRESS';
        if (filter === 'APPROVED') return s.status === 'APPROVED';
        if (filter === 'REJECTED') return s.status === 'REJECTED';
        return true;
    });

    const handleApprove = (stepId: string, evidenceId: string) => {
        if (!project) return;
        const updatedSteps = project.steps.map(s => {
            if (s.id !== stepId) return s;
            const updatedEvidences = s.evidences.map(ev => 
                ev.id === evidenceId ? { ...ev, status: 'APPROVED' as const } : ev
            );
            
            // Auto-approve step if all evidences are approved
            const allApproved = updatedEvidences.every(ev => ev.status === 'APPROVED');
            return { 
                ...s, 
                evidences: updatedEvidences, 
                status: allApproved ? 'APPROVED' as StepStatus : s.status 
            };
        });

        const updatedProjects = mockProjects.map(p => 
            p.id === id ? { ...p, steps: updatedSteps } : p
        );
        setMockProjects(updatedProjects);
    };

    const handleApproveAll = (stepId: string) => {
        if (!project) return;
        const updatedSteps = project.steps.map(s => {
            if (s.id !== stepId) return s;
            const updatedEvidences = s.evidences.map(ev => ({ ...ev, status: 'APPROVED' as const }));
            return { ...s, evidences: updatedEvidences, status: 'APPROVED' as StepStatus };
        });

        const updatedProjects = mockProjects.map(p => 
            p.id === id ? { ...p, steps: updatedSteps } : p
        );
        setMockProjects(updatedProjects);
    };

    const openRejectModal = (stepId: string, evidenceId?: string) => {
        setRejectTarget({ stepId, evidenceId });
        setRejectReason('');
        setCustomReason('');
        setRejectModalOpen(true);
    };

    const confirmReject = () => {
        const reason = rejectReason === 'Khác' ? customReason : rejectReason;
        if (!rejectTarget || !reason || !project) return;
        
        const updatedSteps = project.steps.map(s => {
            if (s.id !== rejectTarget.stepId) return s;
            const updatedEvidences = s.evidences.map(ev => {
                if (rejectTarget.evidenceId) {
                    return ev.id === rejectTarget.evidenceId ? { ...ev, status: 'REJECTED' as const, pmFeedback: reason } : ev;
                }
                return { ...ev, status: 'REJECTED' as const, pmFeedback: reason };
            });
            return { ...s, evidences: updatedEvidences, status: 'REJECTED' as StepStatus, pmFeedback: reason };
        });

        const updatedProjects = mockProjects.map(p => 
            p.id === id ? { ...p, steps: updatedSteps } : p
        );
        setMockProjects(updatedProjects);
        setRejectModalOpen(false);
    };

    const tabItems = [
        {
            key: 'review',
            label: (
                <Space>
                    Duyệt theo bước
                    {totalAwaiting > 0 && <Badge count={totalAwaiting} size="small" />}
                </Space>
            ),
            children: (
                <div>
                    {/* Filter bar */}
                    <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        {([
                            { key: 'AWAITING', label: `⏰ Chờ duyệt (${totalAwaiting})` },
                            { key: 'APPROVED', label: `✅ Đã duyệt (${totalApproved})` },
                            { key: 'REJECTED', label: `❌ Đã từ chối (${totalRejected})` },
                            { key: 'ALL', label: `Tất cả (${totalEvidence})` },
                        ] as { key: FilterType; label: string }[]).map(f => (
                            <Button
                                key={f.key}
                                type={filter === f.key ? 'primary' : 'default'}
                                size="small"
                                onClick={() => setFilter(f.key)}
                            >{f.label}</Button>
                        ))}
                    </div>

                    {filteredSteps.length === 0 && (
                        <Empty description="Không có ảnh nào trong bộ lọc này" />
                    )}

                    {filteredSteps.map(step => (
                        <Card
                            key={step.id}
                            size="small"
                            style={{ marginBottom: 16 }}
                            title={
                                <Space>
                                    <Text strong>
                                        Bước {step.order}. {step.name}
                                    </Text>
                                    <Tag color={STATUS_COLOR[step.status] || 'default'} style={{ fontSize: 10 }}>
                                        {step.status === 'AWAITING_REVIEW' ? '⏰ Chờ duyệt'
                                            : step.status === 'APPROVED' ? '✅ Đã duyệt'
                                                : step.status === 'REJECTED' ? '❌ Từ chối'
                                                    : step.status}
                                    </Tag>
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        {step.completedBy && <>Thợ: {step.completedBy}</>}
                                        {step.completedAt && <> · {step.completedAt.split('T')[0]}</>}
                                    </Text>
                                </Space>
                            }
                            extra={step.status === 'AWAITING_REVIEW' && (
                                <Space>
                                    <Button size="small" type="primary" icon={<CheckCircleOutlined />}
                                        onClick={() => handleApproveAll(step.id)}>
                                        Approve tất cả
                                    </Button>
                                    <Button size="small" danger icon={<CloseCircleOutlined />}
                                        onClick={() => openRejectModal(step.id)}>
                                        Reject tất cả
                                    </Button>
                                </Space>
                            )}
                        >
                            <Image.PreviewGroup>
                                <Row gutter={[12, 12]}>
                                    {step.evidences.map(ev => {
                                        const isApproved = ev.status === 'APPROVED';
                                        const isRejected = ev.status === 'REJECTED';
                                        return (
                                            <Col key={ev.id} xs={12} sm={8} md={6}>
                                                <div style={{
                                                    border: `2px solid ${isApproved ? '#52c41a' : isRejected ? '#ff4d4f' : '#d9d9d9'}`,
                                                    borderRadius: 8, overflow: 'hidden',
                                                    background: isRejected ? '#fff1f0' : '#fff',
                                                }}>
                                                    <div style={{ position: 'relative' }}>
                                                        <Image
                                                            src={ev.url}
                                                            style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
                                                            preview={{ mask: <EyeOutlined /> }}
                                                        />
                                                        {isApproved && (
                                                            <div style={{
                                                                position: 'absolute', top: 4, right: 4,
                                                                background: '#52c41a', borderRadius: '50%', width: 20, height: 20,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            }}>
                                                                <CheckCircleOutlined style={{ color: '#fff', fontSize: 12 }} />
                                                            </div>
                                                        )}
                                                        {isRejected && (
                                                            <div style={{
                                                                position: 'absolute', top: 4, right: 4,
                                                                background: '#ff4d4f', borderRadius: '50%', width: 20, height: 20,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            }}>
                                                                <CloseCircleOutlined style={{ color: '#fff', fontSize: 12 }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ padding: '6px 8px' }}>
                                                        <Text style={{ fontSize: 11, color: '#666', display: 'block' }}>
                                                            📅 {ev.uploadedAt.replace('T', ' ').slice(0, 16)}
                                                        </Text>
                                                        {ev.pmFeedback && (
                                                            <Text style={{ fontSize: 10, color: '#ff4d4f', display: 'block' }}>
                                                                ❌ {ev.pmFeedback}
                                                            </Text>
                                                        )}
                                                        {!isApproved && !isRejected && (
                                                            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                                                <Button size="small" type="primary" style={{ flex: 1, fontSize: 11 }}
                                                                    onClick={() => handleApprove(step.id, ev.id)}>✅</Button>
                                                                <Button size="small" danger style={{ flex: 1, fontSize: 11 }}
                                                                    onClick={() => openRejectModal(step.id, ev.id)}>❌</Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Image.PreviewGroup>
                        </Card>
                    ))}
                </div>
            ),
        },
        {
            key: 'summary',
            label: 'Tổng quan',
            children: (
                <div>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        {[
                            { label: 'Tổng ảnh', value: totalEvidence, color: '#1976D2' },
                            { label: '✅ Đã duyệt', value: totalApproved, color: '#52c41a' },
                            { label: '⏰ Chờ duyệt', value: totalAwaiting, color: '#fa8c16' },
                            { label: '❌ Từ chối', value: totalRejected, color: '#ff4d4f' },
                        ].map(k => (
                            <Col span={6} key={k.label}>
                                <Card size="small" style={{ textAlign: 'center', borderTop: `3px solid ${k.color}` }}>
                                    <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{k.label}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Divider />
                    {project.steps.map(s => (
                        <Row key={s.id} justify="space-between" align="middle" style={{ marginBottom: 8, padding: '6px 0' }}>
                            <Col>
                                <Text>Bước {s.order}. {s.name}</Text>
                            </Col>
                            <Col>
                                <Space>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{s.evidences.length} ảnh</Text>
                                    <Tag color={STATUS_COLOR[s.status] || 'default'} style={{ fontSize: 10 }}>
                                        {s.status === 'AWAITING_REVIEW' ? '⏰ Chờ' : s.status === 'APPROVED' ? '✅' : s.status}
                                    </Tag>
                                    {s.completedBy && (
                                        <Avatar size={20} icon={<UserOutlined />} style={{ background: '#fa8c16' }} />
                                    )}
                                </Space>
                            </Col>
                        </Row>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(`/pm/construction/projects/${project.id}`)}>
                    Chi tiết dự án
                </Button>
                <div style={{ flex: 1 }}>
                    <Title level={4} style={{ margin: 0 }}>📸 Duyệt Ảnh/Video thi công</Title>
                    <Text type="secondary">{project.code} – {project.customerName}</Text>
                </div>
                <Space>
                    <Tag color="processing">{totalAwaiting} chờ duyệt</Tag>
                    <Button type="primary" icon={<CheckCircleOutlined />}
                        loading={saving}
                        onClick={async () => {
                            if (!project) return;
                            setSaving(true);
                            const updatedSteps = project.steps.map(s => ({
                                ...s,
                                status: 'APPROVED' as StepStatus,
                                evidences: s.evidences.map(ev => ({ ...ev, status: 'APPROVED' as const }))
                            }));
                            const updatedProjects = mockProjects.map(p => 
                                p.id === id ? { ...p, steps: updatedSteps } : p
                            );
                            setMockProjects(updatedProjects);
                            await new Promise(r => setTimeout(r, 800));
                            setSaving(false);
                            message.success('Đã duyệt toàn bộ ảnh dự án');
                        }}>
                        Approve tất cả
                    </Button>
                </Space>
            </div>

            {totalAwaiting > 0 && (
                <Alert
                    message={`⏰ Có ${totalAwaiting} ảnh đang chờ bạn duyệt`}
                    type="warning" showIcon style={{ marginBottom: 16 }}
                />
            )}

            <Tabs items={tabItems} />

            {/* Reject Modal */}
            <Modal
                title="❌ Lý do từ chối ảnh"
                open={rejectModalOpen}
                onCancel={() => setRejectModalOpen(false)}
                onOk={confirmReject}
                okText="Xác nhận từ chối"
                okType="danger"
                okButtonProps={{ disabled: !rejectReason }}
            >
                <Radio.Group
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                    {REJECT_REASONS.map(r => (
                        <Radio key={r} value={r}>{r}</Radio>
                    ))}
                </Radio.Group>
                {rejectReason === 'Khác' && (
                    <TextArea
                        style={{ marginTop: 12 }}
                        rows={2}
                        placeholder="Nhập lý do cụ thể..."
                        value={customReason}
                        onChange={e => setCustomReason(e.target.value)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default PhotoApproval;
