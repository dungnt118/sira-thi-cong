import React from 'react';
import {
    Card, Tabs, Tag, Button, Row, Col, Progress, Space,
    Typography, Avatar, Divider, Table
} from 'antd';
import {
    UserOutlined, ProjectOutlined, ArrowLeftOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockCustomers, mockProjects, mockServiceRequests } from '../../../data/mockData';

const { Title, Text } = Typography;

const CustomerDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const customer = mockCustomers.find(c => c.id === id);
    const serviceRequests = mockServiceRequests.filter(sr => sr.customerId === id);
    const customerProjects = mockProjects.filter(p => p.customerId === id);

    if (!customer) return <div>Không tìm thấy khách hàng</div>;

    const dealColumns = [
        { title: 'Mã YC', dataIndex: 'code', key: 'code', render: (t: string) => <Text strong>{t}</Text> },
        { title: 'Tên Yêu cầu', dataIndex: 'name', key: 'name' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => {
                const map: any = { NEW: 'blue', IN_PROGRESS: 'gold', WON: 'green', LOST: 'red' };
                return <Tag color={map[s]}>{s}</Tag>;
            }
        },
        {
            title: 'Báo giá',
            key: 'quotes',
            render: (_: any, r: any) => `${r.quotations?.length || 0} báo giá`
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (t: string) => t.split('T')[0]
        },
        {
            title: '',
            key: 'action',
            render: (_: any, r: any) => (
                <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pm/crm/service-requests/${r.id}`)}>
                    Xem
                </Button>
            )
        }
    ];

    const tabItems = [
        {
            key: 'info',
            label: '📋 Thông tin KH',
            children: (
                <Row gutter={16}>
                    <Col xs={24} md={16}>
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                                <Avatar size={64} style={{ background: '#1976D2' }} icon={<UserOutlined />} />
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>{customer.fullName}</Title>
                                    <Text type="secondary">{customer.code}</Text>
                                </div>
                            </div>
                            <Divider style={{ margin: '8px 0' }} />
                            {[
                                { label: '📞 Điện thoại', value: customer.phone },
                                { label: '📧 Email', value: customer.email || '—' },
                                { label: '📍 Địa chỉ', value: `${customer.address}, ${customer.district}, ${customer.city}` },
                                { label: '👤 Người phụ trách', value: customer.assignedPmName },
                                { label: '📅 Ngày tham gia', value: customer.createdAt.split('T')[0] },
                            ].map(({ label, value }) => (
                                <Row key={label} style={{ marginBottom: 12 }}>
                                    <Col span={8}><Text type="secondary">{label}</Text></Col>
                                    <Col span={16}><Text strong>{value}</Text></Col>
                                </Row>
                            ))}
                            {customer.notes && (
                                <div style={{ marginTop: 12, padding: 12, background: '#fffbe6', borderRadius: 6, border: '1px solid #ffe58f' }}>
                                    <Text strong>📝 Ghi chú:</Text>
                                    <div style={{ marginTop: 8 }}>{customer.notes}</div>
                                </div>
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card size="small" title="Thao tác nhanh">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button block type="primary" onClick={() => navigate(`/pm/crm/service-requests/new?customerId=${id}`)}>
                                    ✚ Tạo Yêu cầu (Deal) mới
                                </Button>
                                <Button block onClick={() => navigate(`/pm/crm/customers/${id}/edit`)}>
                                    Chỉnh sửa thông tin KH
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'deals',
            label: `💼 Yêu cầu Dịch vụ (${serviceRequests.length})`,
            children: (
                <Card size="small" extra={<Button type="primary" size="small" onClick={() => navigate(`/pm/crm/service-requests/new?customerId=${id}`)}>Tạo Deal</Button>}>
                    <Table
                        columns={dealColumns}
                        dataSource={serviceRequests}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </Card>
            )
        },
        {
            key: 'projects',
            label: `🔨 Dự án Thi công (${customerProjects.length})`,
            children: (
                <div>
                    {customerProjects.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Text type="secondary">Khách hàng này chưa có dự án thi công nào</Text>
                            <br />
                            <Button type="primary" style={{ marginTop: 12 }}
                                onClick={() => navigate('/pm/construction/projects/create')}>
                                Tạo dự án mới
                            </Button>
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
                                    extra={
                                        <Button type="link" icon={<ProjectOutlined />}>Chi tiết</Button>
                                    }
                                >
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Text strong>{p.code}</Text>
                                            <Tag style={{ marginLeft: 8 }} color={p.status === 'IN_PROGRESS' ? 'processing' : 'default'}>
                                                {p.status === 'IN_PROGRESS' ? 'Đang thi công' : p.status}
                                            </Tag>
                                            <div style={{ marginTop: 4, color: '#666' }}>{p.name}</div>
                                        </Col>
                                        <Col style={{ textAlign: 'right' }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>{p.startDate} → {p.plannedEndDate}</Text>
                                            <Progress percent={progress} size="small" status={progress === 100 ? 'success' : 'active'} style={{ marginTop: 8, width: 120, display: 'block' }} />
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })
                    )}
                </div>
            ),
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pm/crm/customers')}>Danh bạ</Button>
                <div>
                    <Title level={4} style={{ margin: 0 }}>{customer.fullName}</Title>
                    <Text type="secondary">Mã KH: {customer.code}</Text>
                </div>
            </div>
            <Tabs items={tabItems} defaultActiveKey="info" />
        </div>
    );
};

export default CustomerDetail;
