import React from 'react';
import {
    Card, Row, Col, Progress, Tag, Image, Typography, Steps,
    Space, Alert, Button
} from 'antd';
import {
    SafetyOutlined, LinkOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProjects, getProjectProgress } from '../../data/mockData';

const { Title, Text } = Typography;

const CustomerPortal: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    // Find project by token
    const project = mockProjects.find(p => p.portalToken === token);

    if (!project) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: 24,
            }}>
                <Card style={{ textAlign: 'center', borderRadius: 16, maxWidth: 400, width: '100%' }}>
                    <div style={{ fontSize: 64 }}>🔍</div>
                    <Title level={3} style={{ color: '#ff4d4f' }}>Không tìm thấy</Title>
                    <Text type="secondary">Link portal không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ nhà thầu để được cấp link mới.</Text>
                </Card>
            </div>
        );
    }

    const progress = getProjectProgress(project);
    const approvedSteps = project.steps.filter(s => s.status === 'APPROVED');
    const approvedImages = project.steps.flatMap(s => s.evidences.filter(e => e.status === 'APPROVED'));

    const paidMilestones = project.paymentMilestones.filter(m => m.status === 'PAID');
    const totalPaid = paidMilestones.reduce((s, m) => s + m.amount, 0);

    return (
        <div style={{ background: '#f5f7fb', minHeight: '100vh' }}>
            {/* Header Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1976D2 0%, #42a5f5 100%)',
                padding: '40px 24px 32px',
                color: '#fff',
            }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{
                            width: 48, height: 48, background: 'rgba(255,255,255,0.2)',
                            borderRadius: 12, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 24, fontWeight: 700,
                        }}>
                            S
                        </div>
                        <div>
                            <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>Lam Bac Group – SIRA</div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>Cổng Theo dõi Thi công</div>
                        </div>
                    </div>
                    <Title level={3} style={{ color: '#fff', margin: '0 0 8px' }}>{project.name}</Title>
                    <Space>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>📍 {project.address}</Text>
                        <Tag style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}>{project.type}</Tag>
                    </Space>

                    {/* Progress circle in header */}
                    <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
                        <Progress
                            type="circle"
                            percent={progress}
                            width={80}
                            strokeColor={{ from: '#fff', to: '#a8edea' }}
                            trailColor="rgba(255,255,255,0.2)"
                            format={p => <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{p}%</span>}
                        />
                        <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Tiến độ tổng thể</div>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                                {approvedSteps.length}/{project.steps.length} bước đã hoàn thành
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>
                                📅 {project.startDate} → {project.plannedEndDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>

                {/* Progress Milestones */}
                <Card style={{ borderRadius: 16, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                    <Title level={5} style={{ margin: '0 0 16px', color: '#1976D2' }}>
                        📋 Tiến độ các bước thi công
                    </Title>
                    <Steps
                        direction="vertical"
                        size="small"
                        current={approvedSteps.length}
                        items={project.steps.map(step => ({
                            title: (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: step.status === 'APPROVED' ? 600 : 400, fontSize: 13 }}>
                                        {step.name}
                                    </Text>
                                    <Tag
                                        color={
                                            step.status === 'APPROVED' ? 'success' :
                                                step.status === 'IN_PROGRESS' ? 'processing' :
                                                    step.status === 'LOCKED' ? 'default' : 'warning'
                                        }
                                        style={{ fontSize: 10 }}
                                    >
                                        {step.status === 'APPROVED' ? '✅ Hoàn thành' :
                                            step.status === 'IN_PROGRESS' ? '🔨 Đang làm' :
                                                step.status === 'AWAITING_REVIEW' ? '⏳ Kiểm tra' : ''}
                                    </Tag>
                                </div>
                            ),
                            status: step.status === 'APPROVED' ? 'finish' :
                                step.status === 'IN_PROGRESS' || step.status === 'AWAITING_REVIEW' ? 'process' : 'wait',
                            description: step.status === 'APPROVED' && step.completedAt
                                ? <Text type="secondary" style={{ fontSize: 11 }}>Hoàn thành: {step.completedAt.split('T')[0]}</Text>
                                : null,
                        }))}
                    />
                </Card>

                {/* Evidence Gallery (Approved photos only) */}
                {approvedImages.length > 0 && (
                    <Card style={{ borderRadius: 16, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                        <Title level={5} style={{ margin: '0 0 16px', color: '#1976D2' }}>
                            📸 Hình ảnh thi công ({approvedImages.length} ảnh)
                        </Title>
                        <Alert
                            message="Tất cả ảnh đã được kiểm tra và phê duyệt bởi PM trước khi hiển thị tại đây"
                            type="success"
                            showIcon
                            style={{ marginBottom: 12, fontSize: 12 }}
                        />
                        <Image.PreviewGroup>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                {approvedImages.map(img => (
                                    <Image
                                        key={img.id}
                                        src={img.url}
                                        style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 8 }}
                                    />
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    </Card>
                )}

                {/* Payment Status */}
                <Card style={{ borderRadius: 16, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                    <Title level={5} style={{ margin: '0 0 16px', color: '#1976D2' }}>
                        💰 Lịch thanh toán
                    </Title>
                    {project.paymentMilestones.map(m => (
                        <Row key={m.id} justify="space-between" align="middle" style={{
                            padding: '12px 0', borderBottom: '1px solid #f0f0f0',
                        }}>
                            <Col>
                                <Text strong>Đợt {m.round}: </Text>
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    {m.round === 1 ? 'Khi ký hợp đồng' : m.round === 2 ? 'Sau khi hoàn thành' : 'Sau nghiệm thu'}
                                </Text>
                                <div style={{ fontSize: 11, color: '#999' }}>Hạn: {m.dueDate}</div>
                            </Col>
                            <Col style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, fontSize: 16, color: m.status === 'PAID' ? '#52c41a' : '#1976D2' }}>
                                    {m.amount.toLocaleString('vi-VN')}đ
                                </div>
                                <Tag color={m.status === 'PAID' ? 'success' : m.status === 'OVERDUE' ? 'error' : 'warning'}>
                                    {m.status === 'PAID' ? '✅ Đã thanh toán' : m.status === 'OVERDUE' ? '⚠️ Quá hạn' : '⏳ Chờ thanh toán'}
                                </Tag>
                            </Col>
                        </Row>
                    ))}
                    <Row justify="end" style={{ padding: '12px 0', fontSize: 14 }}>
                        <Col>
                            <Text>Đã thanh toán: </Text>
                            <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                                {totalPaid.toLocaleString('vi-VN')}đ
                            </Text>
                        </Col>
                    </Row>
                </Card>

                {/* Contact */}
                <Card style={{ borderRadius: 16, background: '#f0f5ff', border: '1px solid #1976D2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 36 }}>📞</div>
                        <div>
                            <Text strong>Cần hỗ trợ?</Text>
                            <div style={{ fontSize: 13, color: '#666' }}>Liên hệ PM phụ trách: {project.pmName}</div>
                            <Text style={{ color: '#1976D2', fontWeight: 600 }}>0901-234-567</Text>
                        </div>
                    </div>
                </Card>

                {/* Footer */}
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#999', fontSize: 12 }}>
                    <SafetyOutlined /> Trang này chỉ dành cho chủ công trình. Dữ liệu được bảo mật.
                    <br />
                    © 2026 Lam Bac Group – SIRA
                    <br style={{ marginBottom: 8 }} />
                    <Button
                        size="small"
                        icon={<LinkOutlined />}
                        style={{ marginTop: 8, opacity: 0.6 }}
                        onClick={() => navigate(`/pm/construction/projects/${project.id}`)}
                    >
                        PM: Quay lại dự án
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomerPortal;
