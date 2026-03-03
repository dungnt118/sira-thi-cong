import React from 'react';
import {
    Card, Tabs, Tag, Button, Timeline, Image, Row, Col, Progress, Space,
    Typography, Avatar, Divider
} from 'antd';
import {
    UserOutlined, ProjectOutlined,
    DollarOutlined, EditOutlined, ArrowLeftOutlined,
    CameraOutlined, CheckCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockCustomers, mockProjects } from '../../../data/mockData';
import type { CustomerPipelineStatus } from '../../../types/v3';

const { Title, Text } = Typography;

const STATUS_COLORS: Record<CustomerPipelineStatus, string> = {
    NEW: 'default', SURVEYING: 'processing', QUOTED: 'warning',
    NEGOTIATING: 'purple', SIGNED: 'success', REJECTED: 'error',
};
const STATUS_LABELS: Record<CustomerPipelineStatus, string> = {
    NEW: 'Khách mới', SURVEYING: 'Đang khảo sát', QUOTED: 'Đã báo giá',
    NEGOTIATING: 'Đang đàm phán', SIGNED: 'Đã ký HĐ', REJECTED: 'Từ chối',
};

const CustomerDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const customer = mockCustomers.find(c => c.id === id);
    const customerProjects = mockProjects.filter(p => p.customerId === id);

    if (!customer) return <div>Không tìm thấy khách hàng</div>;

    const latestQuote = customer.quotations[customer.quotations.length - 1];

    const tabItems = [
        {
            key: 'info',
            label: '📋 Thông tin',
            children: (
                <Row gutter={16}>
                    <Col xs={24} md={14}>
                        <Card size="small" style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                                <Avatar size={64} style={{ background: '#1976D2' }} icon={<UserOutlined />} />
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>{customer.fullName}</Title>
                                    <Tag color={STATUS_COLORS[customer.pipelineStatus]}>
                                        {STATUS_LABELS[customer.pipelineStatus]}
                                    </Tag>
                                </div>
                            </div>
                            <Divider style={{ margin: '8px 0' }} />
                            {[
                                { label: '📞 SĐT', value: customer.phone },
                                { label: '📧 Email', value: customer.email || '—' },
                                { label: '📍 Địa chỉ', value: `${customer.address}, ${customer.district}, ${customer.city}` },
                                { label: '👤 PM phụ trách', value: customer.assignedPmName },
                                { label: '📅 Ngày thêm', value: customer.createdAt },
                            ].map(({ label, value }) => (
                                <Row key={label} style={{ marginBottom: 8 }}>
                                    <Col span={8}><Text type="secondary">{label}</Text></Col>
                                    <Col span={16}><Text strong>{value}</Text></Col>
                                </Row>
                            ))}
                            {customer.notes && (
                                <div style={{ marginTop: 12, padding: 8, background: '#fffbe6', borderRadius: 6 }}>
                                    <Text>📝 {customer.notes}</Text>
                                </div>
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} md={10}>
                        <Card size="small" title="Thao tác nhanh">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button block icon={<CameraOutlined />} onClick={() => navigate(`/pm/crm/customers/${id}/survey`)}>
                                    Khảo sát & Đo ẩm
                                </Button>
                                <Button block icon={<DollarOutlined />} onClick={() => navigate(`/pm/crm/customers/${id}/quotation`)}>
                                    Lập báo giá
                                </Button>
                                {customer.pipelineStatus === 'SIGNED' && (
                                    <Button block type="primary" icon={<ProjectOutlined />}
                                        onClick={() => navigate('/pm/construction/projects/create')}>
                                        Tạo dự án thi công
                                    </Button>
                                )}
                                <Button block icon={<EditOutlined />} onClick={() => navigate(`/pm/crm/customers/${id}/edit`)}>
                                    Chỉnh sửa
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'survey',
            label: `📸 Khảo sát (${customer.surveyImages.length})`,
            children: (
                <div>
                    {customer.surveyImages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Text type="secondary">Chưa có ảnh khảo sát</Text>
                            <br />
                            <Button type="primary" style={{ marginTop: 12 }} onClick={() => navigate(`/pm/crm/customers/${id}/survey`)}>
                                Thêm ảnh khảo sát
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Image.PreviewGroup>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                                    {customer.surveyImages.map((img, i) => (
                                        <div key={i} style={{ position: 'relative' }}>
                                            <Image
                                                src={img.url}
                                                alt={img.caption}
                                                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }}
                                            />
                                            {img.caption && (
                                                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{img.caption}</div>
                                            )}
                                            <Text type="secondary" style={{ fontSize: 11 }}>{img.takenAt.split('T')[0]}</Text>
                                        </div>
                                    ))}
                                </div>
                            </Image.PreviewGroup>
                            {customer.moistureReadings.length > 0 && (
                                <Card size="small" title="💧 Kết quả đo độ ẩm" style={{ marginTop: 16 }}>
                                    {customer.moistureReadings.map((m, i) => (
                                        <Row key={i} justify="space-between" style={{ marginBottom: 8 }}>
                                            <Col>{m.location}</Col>
                                            <Col>
                                                <Tag color={m.value > 12 ? 'red' : m.value > 8 ? 'orange' : 'green'}>
                                                    {m.value}%
                                                </Tag>
                                            </Col>
                                        </Row>
                                    ))}
                                </Card>
                            )}
                        </>
                    )}
                </div>
            ),
        },
        {
            key: 'quotation',
            label: `💰 Báo giá (${customer.quotations.length})`,
            children: (
                <div>
                    {customer.quotations.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Text type="secondary">Chưa có báo giá nào</Text>
                            <br />
                            <Button type="primary" style={{ marginTop: 12 }} onClick={() => navigate(`/pm/crm/customers/${id}/quotation`)}>
                                Lập báo giá đầu tiên
                            </Button>
                        </div>
                    ) : (
                        customer.quotations.map(q => (
                            <Card key={q.id} size="small" style={{ marginBottom: 12 }}>
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Text strong>{q.code}</Text>
                                        <Tag style={{ marginLeft: 8 }} color={q.status === 'APPROVED' ? 'success' : q.status === 'SENT' ? 'warning' : 'default'}>
                                            {q.status === 'APPROVED' ? '✅ KH chấp nhận' : q.status === 'SENT' ? '⏳ Đã gửi KH' : 'Bản nháp'}
                                        </Tag>
                                    </Col>
                                    <Col>
                                        <Text strong style={{ fontSize: 18, color: '#1976D2' }}>
                                            {q.total.toLocaleString('vi-VN')} VNĐ
                                        </Text>
                                    </Col>
                                    <Col>
                                        <Button size="small" onClick={() => navigate(`/pm/crm/customers/${id}/quotation`)}>
                                            Xem / Sửa
                                        </Button>
                                    </Col>
                                </Row>
                                <Divider style={{ margin: '8px 0' }} />
                                {q.items.slice(0, 3).map(item => (
                                    <Row key={item.id} justify="space-between" style={{ fontSize: 12, marginBottom: 4 }}>
                                        <Col>{item.name}</Col>
                                        <Col>{item.quantity} {item.unit}</Col>
                                        <Col>{item.total.toLocaleString('vi-VN')}đ</Col>
                                    </Row>
                                ))}
                                {q.items.length > 3 && <Text type="secondary" style={{ fontSize: 12 }}>...và {q.items.length - 3} hạng mục khác</Text>}
                            </Card>
                        ))
                    )}
                </div>
            ),
        },
        {
            key: 'projects',
            label: `🔨 Dự án (${customerProjects.length})`,
            children: (
                <div>
                    {customerProjects.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Text type="secondary">Chưa có dự án thi công nào</Text>
                            {customer.pipelineStatus === 'SIGNED' && (
                                <>
                                    <br />
                                    <Button type="primary" style={{ marginTop: 12 }}
                                        onClick={() => navigate('/pm/construction/projects/create')}>
                                        Tạo dự án thi công
                                    </Button>
                                </>
                            )}
                        </div>
                    ) : (
                        customerProjects.map(p => {
                            const progress = Math.round((p.steps.filter(s => s.status === 'APPROVED').length / p.steps.length) * 100);
                            return (
                                <Card
                                    key={p.id}
                                    size="small"
                                    style={{ marginBottom: 12 }}
                                    hoverable
                                    onClick={() => navigate(`/pm/construction/projects/${p.id}`)}
                                >
                                    <Row justify="space-between">
                                        <Col>
                                            <Text strong>{p.code}</Text>
                                            <Tag style={{ marginLeft: 8 }} color={p.status === 'IN_PROGRESS' ? 'processing' : 'default'}>
                                                {p.status === 'IN_PROGRESS' ? 'Đang thi công' : p.status}
                                            </Tag>
                                        </Col>
                                        <Col><Text type="secondary">{p.startDate} → {p.plannedEndDate}</Text></Col>
                                    </Row>
                                    <Progress percent={progress} status={progress === 100 ? 'success' : 'active'} style={{ marginTop: 8 }} />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {p.steps.filter(s => s.status === 'APPROVED').length}/{p.steps.length} bước | Thợ: {p.workerNames.join(', ')}
                                    </Text>
                                </Card>
                            );
                        })
                    )}
                </div>
            ),
        },
        {
            key: 'timeline',
            label: '📅 Lịch sử',
            children: (
                <Timeline
                    items={[
                        { color: 'green', children: <>Thêm vào hệ thống <Text type="secondary">({customer.createdAt})</Text></> },
                        ...(customer.surveyImages.length > 0 ? [{ color: 'blue', children: <>Khảo sát & đo ẩm hoàn thành ({customer.surveyImages.length} ảnh)</> }] : []),
                        ...(customer.quotations.length > 0 ? [{ color: 'gold', children: <>Lập báo giá: {latestQuote?.total.toLocaleString('vi-VN')} VNĐ</> }] : []),
                        ...(customer.pipelineStatus === 'SIGNED' ? [{ color: 'green', dot: <CheckCircleOutlined />, children: <><Text strong>Ký HĐ thành công</Text></> }] : []),
                        ...(customerProjects.length > 0 ? [{ color: 'blue', dot: <ClockCircleOutlined />, children: <>Tạo dự án thi công {customerProjects[0].code}</> }] : []),
                    ]}
                />
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pm/crm/customers')}>Quay lại</Button>
                <Avatar size={40} style={{ background: '#1976D2' }} icon={<UserOutlined />} />
                <div>
                    <Title level={4} style={{ margin: 0 }}>{customer.fullName}</Title>
                    <Space>
                        <Text type="secondary">{customer.code}</Text>
                        <Tag color={STATUS_COLORS[customer.pipelineStatus]}>{STATUS_LABELS[customer.pipelineStatus]}</Tag>
                    </Space>
                </div>
            </div>
            <Tabs items={tabItems} defaultActiveKey="info" />
        </div>
    );
};

export default CustomerDetail;
