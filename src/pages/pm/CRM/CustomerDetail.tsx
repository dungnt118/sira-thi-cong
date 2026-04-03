import React from 'react';
import {
    Card, Tabs, Tag, Button, Row, Col, Progress, Space,
    Typography, Avatar, Divider, Table
} from 'antd';
import {
    UserOutlined, ProjectOutlined, ArrowLeftOutlined, EyeOutlined,
    IdcardOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined,
    CalendarOutlined, FileTextOutlined, PlusCircleOutlined, SolutionOutlined,
    BuildOutlined, EditOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import {
    mockCustomers as defaultCustomers,
    mockServiceRequests as defaultServiceRequests
} from '../../../data/mockData';
import { mockJourneys as defaultJourneys } from '../../../data/journeyMockData';
import type { Customer, ServiceRequest } from '../../../types/v3';
import type { Journey } from '../../../types/journey';

const { Title, Text } = Typography;

const CustomerDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [mockCustomers] = useLocalStorageData<Customer[]>(demoDataService.KEYS.CUSTOMERS, defaultCustomers);
    const [mockJourneys] = useLocalStorageData<Journey[]>(demoDataService.KEYS.JOURNEYS, defaultJourneys);
    const [mockServiceRequests] = useLocalStorageData<ServiceRequest[]>(demoDataService.KEYS.SERVICE_REQUESTS, defaultServiceRequests);

    const customer = mockCustomers.find(c => c.id === id);
    const serviceRequests = mockServiceRequests.filter(sr => sr.customerId === id);
    const customerJourneys = mockJourneys.filter(j => j.customer_phone === customer?.phone);

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
                <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/ql/crm/service-requests/${r.id}`)}>
                    Xem
                </Button>
            )
        }
    ];

    const tabItems = [
        {
            key: 'info',
            label: <span><IdcardOutlined /> Thông tin KH</span>,
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
                                { id: 'phone', label: <span><PhoneOutlined /> Điện thoại</span>, value: customer.phone },
                                { id: 'email', label: <span><MailOutlined /> Email</span>, value: customer.email || '—' },
                                { id: 'address', label: <span><EnvironmentOutlined /> Địa chỉ</span>, value: `${customer.address}, ${customer.district}, ${customer.city}` },
                                { id: 'pm', label: <span><UserOutlined /> Người phụ trách</span>, value: customer.assignedPmName },
                                { id: 'date', label: <span><CalendarOutlined /> Ngày tham gia</span>, value: customer.createdAt.split('T')[0] },
                            ].map(({ id: keyId, label, value }) => (
                                <Row key={keyId} style={{ marginBottom: 12 }}>
                                    <Col span={8}><Text type="secondary">{label}</Text></Col>
                                    <Col span={16}><Text strong>{value}</Text></Col>
                                </Row>
                            ))}
                            {customer.notes && (
                                <div style={{ marginTop: 12, padding: 12, background: '#fffbe6', borderRadius: 6, border: '1px solid #ffe58f' }}>
                                    <Text strong><FileTextOutlined /> Ghi chú:</Text>
                                    <div style={{ marginTop: 8 }}>{customer.notes}</div>
                                </div>
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card size="small" title="Thao tác nhanh">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button block type="primary" icon={<PlusCircleOutlined />} onClick={() => navigate(`/ql/crm/service-requests/new?customerId=${id}`)}>
                                    Tạo Yêu cầu (Deal) mới
                                </Button>
                                <Button block icon={<EditOutlined />} onClick={() => navigate(`/ql/crm/customers/${id}/edit`)}>
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
            label: <span><SolutionOutlined /> Yêu cầu Dịch vụ ({serviceRequests.length})</span>,
            children: (
                <Card size="small" extra={<Button type="primary" size="small" onClick={() => navigate(`/ql/crm/service-requests/new?customerId=${id}`)}>Tạo Deal</Button>}>
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
            key: 'journeys',
            label: <span><BuildOutlined /> Hành trình KH ({customerJourneys.length})</span>,
            children: (
                <div>
                    {customerJourneys.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Text type="secondary">Khách hàng này chưa có hành trình nào</Text>
                            <br />
                            <Button type="primary" style={{ marginTop: 12 }}
                                onClick={() => navigate('/ql/journeys')}>
                                Đi tới danh sách Hành trình
                            </Button>
                        </div>
                    ) : (
                        customerJourneys.map(j => {
                            const progress = 50; // Giả lập tiến độ
                            return (
                                <Card
                                    key={j.id}
                                    size="small"
                                    style={{ marginBottom: 12 }}
                                    hoverable
                                    onClick={() => navigate(`/ql/journeys/${j.id}`)}
                                    extra={
                                        <Button type="link" icon={<ProjectOutlined />}>Chi tiết</Button>
                                    }
                                >
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Text strong>{j.journey_code}</Text>
                                            <Tag style={{ marginLeft: 8 }} color={j.project_status === 'active' ? 'processing' : 'default'}>
                                                {j.project_status}
                                            </Tag>
                                            <div style={{ marginTop: 4, color: '#666' }}>{j.request_title}</div>
                                        </Col>
                                        <Col style={{ textAlign: 'right' }}>
                                            <Progress percent={progress} size="small" status={'active'} style={{ marginTop: 8, width: 120, display: 'block' }} />
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
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/ql/crm/customers')}>Danh bạ</Button>
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
