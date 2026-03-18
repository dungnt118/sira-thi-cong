import React, { useState } from 'react';
import {
    Card, Tabs, Row, Col, Progress, Tag, Button, Steps, Image, Typography,
    Space, Alert, Timeline, Modal, Input, Statistic, Badge, Drawer,
    Divider, message
} from 'antd';
import {
    ArrowLeftOutlined, EyeOutlined, CheckOutlined,
    CloseOutlined, CheckCircleOutlined,
    ClockCircleOutlined, LockOutlined, LinkOutlined,
    EditOutlined, BoxPlotOutlined, DollarOutlined,
    ProfileOutlined, BellOutlined, WarningOutlined, MessageOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { mockProjects as defaultProjects, getProjectProgress } from '../../../data/mockData';
import type { Project, StepStatus } from '../../../types/legacy-project';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const STEP_STATUS_CONFIG: Record<StepStatus, { color: string; icon: React.ReactNode; label: string }> = {
    LOCKED: { color: '#d9d9d9', icon: <LockOutlined />, label: 'Chưa mở khóa' },
    OPEN: { color: '#1890ff', icon: <ClockCircleOutlined />, label: 'Đã mở khóa' },
    IN_PROGRESS: { color: '#fa8c16', icon: <ClockCircleOutlined />, label: 'Đang thực hiện' },
    AWAITING_REVIEW: { color: '#722ed1', icon: <EyeOutlined />, label: 'Chờ PM duyệt' },
    APPROVED: { color: '#52c41a', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
    REJECTED: { color: '#ff4d4f', icon: <CloseOutlined />, label: 'Từ chối – Làm lại' },
};

const PMProjectDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [mockProjects, setMockProjects] = useLocalStorageData<Project[]>(demoDataService.KEYS.PROJECTS, defaultProjects);
    
    const project = mockProjects.find(p => p.id === id);

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectStepId, setRejectStepId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [portalDrawer, setPortalDrawer] = useState(false);

    if (!project) return <div>Không tìm thấy dự án</div>;

    const progress = getProjectProgress(project);
    const approvedSteps = project.steps.filter(s => s.status === 'APPROVED').length;
    const pendingReview = project.steps.filter(s => s.status === 'AWAITING_REVIEW').length;
    const hasOpenIncidents = project.incidents.filter(i => !i.isResolved).length;

    const handleApproveStep = (stepId: string) => {
        Modal.confirm({
            title: 'Duyệt bước thi công',
            content: 'Xác nhận duyệt tất cả ảnh của bước này?',
            okText: 'Duyệt',
            okType: 'primary',
            onOk: () => {
                if (!project) return;
                const nextStepIndex = project.steps.findIndex(s => s.id === stepId) + 1;
                
                const updatedSteps = project.steps.map((s, idx) => {
                    if (s.id === stepId) {
                        return { ...s, status: 'APPROVED' as StepStatus };
                    }
                    if (idx === nextStepIndex && s.status === 'LOCKED') {
                        return { ...s, status: 'OPEN' as StepStatus };
                    }
                    return s;
                });

                const updatedProjects = mockProjects.map(p => 
                    p.id === project.id ? { ...p, steps: updatedSteps } : p
                );
                setMockProjects(updatedProjects);
                message.success('Đã duyệt bước thi công');
            },
        });
    };

    const handleRejectStep = (stepId: string) => {
        setRejectStepId(stepId);
        setRejectModalOpen(true);
    };

    const confirmReject = () => {
        if (!project || !rejectStepId) return;
        
        const updatedSteps = project.steps.map(s => 
            s.id === rejectStepId ? { ...s, status: 'REJECTED' as StepStatus, pmFeedback: rejectReason } : s
        );

        const updatedProjects = mockProjects.map(p => 
            p.id === project.id ? { ...p, steps: updatedSteps } : p
        );
        
        setMockProjects(updatedProjects);
        setRejectModalOpen(false);
        setRejectStepId(null);
        setRejectReason('');
        message.info('Đã từ chối bước thi công');
    };

    const tabItems = [
        {
            key: 'checklist',
            label: (
                <Space>
                    Checklist ({approvedSteps}/{project.steps.length})
                    {pendingReview > 0 && <Badge count={pendingReview} size="small" />}
                </Space>
            ),
            children: (
                <div>
                    {pendingReview > 0 && (
                        <Alert
                            message={<span><BellOutlined /> Có {pendingReview} bước đang chờ bạn duyệt ảnh</span>}
                            type="warning"
                            showIcon
                            style={{ marginBottom: 16 }}
                            action={
                                <Button size="small" type="primary"
                                    onClick={() => navigate(`/pm/construction/evidence/${project.id}`)}>
                                    Duyệt ngay
                                </Button>
                            }
                        />
                    )}

                    <Steps
                        direction="vertical"
                        size="small"
                        current={approvedSteps}
                        style={{ paddingLeft: 8 }}
                        items={project.steps.map((step) => {
                            const statusCfg = STEP_STATUS_CONFIG[step.status];
                            return {
                                title: (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Space>
                                            <Text strong style={{ fontSize: 13 }}>
                                                {step.order}. {step.name}
                                            </Text>
                                            <Tag color={statusCfg.color} style={{ fontSize: 10 }}>
                                                {statusCfg.icon} {statusCfg.label}
                                            </Tag>
                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                (min {step.minPhotos} ảnh)
                                            </Text>
                                        </Space>
                                        {step.status === 'AWAITING_REVIEW' && (
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    icon={<CheckOutlined />}
                                                    onClick={() => handleApproveStep(step.id)}
                                                >
                                                    Duyệt
                                                </Button>
                                                <Button
                                                    danger
                                                    size="small"
                                                    icon={<CloseOutlined />}
                                                    onClick={() => handleRejectStep(step.id)}
                                                >
                                                    Từ chối
                                                </Button>
                                            </Space>
                                        )}
                                    </div>
                                ),
                                status: step.status === 'APPROVED' ? 'finish'
                                    : step.status === 'REJECTED' ? 'error'
                                        : step.status === 'IN_PROGRESS' || step.status === 'AWAITING_REVIEW' ? 'process'
                                            : 'wait',
                                description: step.evidences.length > 0 ? (
                                    <div style={{ marginTop: 8, marginBottom: 16 }}>
                                        <Image.PreviewGroup>
                                            <Space size={8} wrap>
                                                {step.evidences.map(ev => (
                                                    <div key={ev.id} style={{ position: 'relative' }}>
                                                        <Image
                                                            src={ev.url}
                                                            style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 6 }}
                                                        />
                                                        <div style={{
                                                            position: 'absolute', top: 2, right: 2,
                                                            width: 16, height: 16, borderRadius: '50%',
                                                            background: ev.status === 'APPROVED' ? '#52c41a' : ev.status === 'REJECTED' ? '#ff4d4f' : '#fa8c16',
                                                        }} />
                                                    </div>
                                                ))}
                                            </Space>
                                        </Image.PreviewGroup>
                                        {step.completedAt && (
                                            <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
                                                <CheckCircleOutlined style={{ color: '#52c41a' }} /> Hoàn thành bởi {step.completedBy} lúc {step.completedAt.split('T')[1]?.slice(0, 5)} ngày {step.completedAt.split('T')[0]}
                                            </Text>
                                        )}
                                    </div>
                                ) : step.status !== 'LOCKED' ? (
                                    <Text type="secondary" style={{ fontSize: 11, margin: '4px 0 12px', display: 'block' }}>
                                        {step.description} – Chưa có ảnh
                                    </Text>
                                ) : null,
                            };
                        })}
                    />
                </div>
            ),
        },
        {
            key: 'incidents',
            label: (
                <Space>
                    Sự cố ({project.incidents.length})
                    {hasOpenIncidents > 0 && <Badge count={hasOpenIncidents} size="small" color="red" />}
                </Space>
            ),
            children: (
                <div>
                    {project.incidents.length === 0 ? (
                        <Alert message="Không có sự cố nào" type="success" showIcon />
                    ) : (
                        project.incidents.map(inc => (
                            <Card
                                key={inc.id}
                                size="small"
                                style={{ marginBottom: 12, borderLeft: `3px solid ${inc.severity === 'URGENT' ? '#ff4d4f' : '#fa8c16'}` }}
                            >
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Tag color={inc.severity === 'URGENT' ? 'error' : 'warning'}>
                                            {inc.severity === 'URGENT' ? <BellOutlined /> : <WarningOutlined />} {inc.severity === 'URGENT' ? 'Khẩn cấp' : 'Bình thường'}
                                        </Tag>
                                        <Tag>{inc.type}</Tag>
                                        {inc.isResolved && <Tag color="success"><CheckCircleOutlined /> Đã xử lý</Tag>}
                                    </Col>
                                    <Col><Text type="secondary" style={{ fontSize: 12 }}>{inc.reportedAt.split('T')[0]}</Text></Col>
                                </Row>
                                <Paragraph style={{ margin: '8px 0', fontSize: 13 }}>{inc.description}</Paragraph>
                                {inc.pmReply && (
                                    <div style={{ background: '#f6ffed', padding: 8, borderRadius: 6, fontSize: 12 }}>
                                        <MessageOutlined /> PM phản hồi: {inc.pmReply}
                                    </div>
                                )}
                                {!inc.pmReply && (
                                    <Button type="primary" size="small" style={{ marginTop: 8 }}>
                                        Phản hồi sự cố
                                    </Button>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            ),
        },
        {
            key: 'finance',
            label: <span><DollarOutlined /> Thanh toán</span>,
            children: (
                <div>
                    {project.paymentMilestones.map(m => (
                        <Card key={m.id} size="small" style={{ marginBottom: 8 }}>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Text strong>Đợt {m.round} ({m.percentage}%)</Text>
                                    <Tag style={{ marginLeft: 8 }} color={m.status === 'PAID' ? 'success' : m.status === 'OVERDUE' ? 'error' : 'warning'}>
                                        {m.status === 'PAID' ? <CheckCircleOutlined /> : <WarningOutlined />} {m.status === 'PAID' ? 'Đã thu' : m.status === 'OVERDUE' ? 'Quá hạn' : 'Chờ thu'}
                                    </Tag>
                                </Col>
                                <Col>
                                    <Text strong style={{ fontSize: 16, color: '#1976D2' }}>
                                        {m.amount.toLocaleString('vi-VN')} VNĐ
                                    </Text>
                                </Col>
                                <Col>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Hạn: {m.dueDate}</Text>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            ),
        },
        {
            key: 'activity',
            label: 'Hoạt động',
            children: (
                <Timeline
                    items={project.activityLog.map(log => ({
                        color: log.action.includes('APPROVE') ? 'green' : log.action.includes('REJECT') ? 'red' : 'blue',
                        children: (
                            <div>
                                <Text strong style={{ fontSize: 12 }}>{log.actor}</Text>
                                <Text style={{ fontSize: 12 }}> – {log.detail}</Text>
                                <div style={{ fontSize: 11, color: '#999' }}>
                                    {log.timestamp.replace('T', ' ').slice(0, 16)}
                                </div>
                            </div>
                        ),
                    }))}
                />
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pm/construction/projects')}>Quay lại</Button>
                <div style={{ flex: 1 }}>
                    <Title level={4} style={{ margin: 0 }}>{project.code}</Title>
                    <Space>
                        <Text type="secondary">{project.name}</Text>
                        <Tag color="processing">Đang thi công</Tag>
                    </Space>
                </div>
                <Space wrap>
                    <Button icon={<EditOutlined />} onClick={() => navigate(`/pm/construction/projects/${project.id}/edit`)}>Chỉnh sửa</Button>
                    <Button icon={<LinkOutlined />} onClick={() => setPortalDrawer(true)}>Portal KH</Button>
                    <Button icon={<BoxPlotOutlined />} onClick={() => navigate(`/pm/construction/projects/${project.id}/materials`)}>Định mức</Button>
                    <Button icon={<DollarOutlined />} onClick={() => navigate(`/pm/construction/projects/${project.id}/finance`)}>Tài chính</Button>
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/pm/construction/evidence/${project.id}`)}>
                        Duyệt ảnh
                    </Button>
                </Space>
            </div>

            {/* KPI Row */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                        <Progress type="circle" percent={progress} width={60} />
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Tiến độ tổng</div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Bước hoàn thành" value={approvedSteps} suffix={`/${project.steps.length}`} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Chờ duyệt ảnh" value={pendingReview} valueStyle={{ color: pendingReview > 0 ? '#fa8c16' : '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Sự cố mở" value={hasOpenIncidents} valueStyle={{ color: hasOpenIncidents > 0 ? '#ff4d4f' : '#52c41a' }} />
                    </Card>
                </Col>
            </Row>

            {/* Project Info Banner */}
            <Card title={<><ProfileOutlined style={{ fontSize: 13 }} /> Thông tin Dự án</>} size="small" style={{ marginBottom: 16, background: '#f5f8ff' }}>
                <Row gutter={24}>
                    <Col xs={24} sm={8}><Text type="secondary">KH: </Text><Text strong>{project.customerName}</Text></Col>
                    <Col xs={24} sm={8}><Text type="secondary">Thợ: </Text><Text strong>{project.workerNames.join(', ')}</Text></Col>
                    <Col xs={24} sm={8}><Text type="secondary">KH: </Text><Text strong>{project.startDate} → {project.plannedEndDate}</Text></Col>
                </Row>
            </Card>

            <Tabs items={tabItems} />

            {/* Reject Modal */}
            <Modal
                title="Từ chối ảnh – Yêu cầu chụp lại"
                open={rejectModalOpen}
                onCancel={() => {
                    setRejectModalOpen(false);
                    setRejectStepId(null);
                    setRejectReason('');
                }}
                onOk={confirmReject}
                okText="Gửi phản hồi"
                okType="danger"
            >
                <TextArea
                    rows={3}
                    placeholder="Lý do từ chối (VD: ảnh mờ, không đúng góc, cần chụp rõ hơn mối nối...)"
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                />
            </Modal>

            {/* Customer Portal Drawer */}
            <Drawer
                title="🔗 Portal Khách hàng"
                placement="right"
                onClose={() => setPortalDrawer(false)}
                open={portalDrawer}
                width={380}
            >
                {project.portalToken ? (
                    <div>
                        <Alert message="Portal đang hoạt động" type="success" showIcon style={{ marginBottom: 16 }} />
                        <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>
                            https://dltech.vn/portal/{project.portalToken}
                        </div>
                        <Space style={{ marginTop: 12 }} wrap>
                            <Button
                                icon={<LinkOutlined />}
                                onClick={() => navigator.clipboard.writeText(`https://dltech.vn/portal/${project.portalToken}`)}
                            >
                                Copy link
                            </Button>
                            <Button
                                type="primary"
                                icon={<LinkOutlined />}
                                onClick={() => window.open(`/portal/${project.portalToken}`, '_blank')}
                            >
                                🔗 Mở trang Portal
                            </Button>
                            <Button danger>Thu hồi link</Button>
                        </Space>
                        <Divider />
                        <Text type="secondary" style={{ fontSize: 12 }}>Hết hạn: {project.portalExpiry}</Text>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', paddingTop: 40 }}>
                        <Text type="secondary">Chưa có portal link</Text>
                        <br />
                        <Button type="primary" style={{ marginTop: 12 }} icon={<LinkOutlined />}>
                            Tạo Portal Link
                        </Button>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default PMProjectDetail;
