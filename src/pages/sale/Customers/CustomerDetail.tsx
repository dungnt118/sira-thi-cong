import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Card,
    Col,
    Descriptions,
    Empty,
    Popconfirm,
    Row,
    Space,
    Spin,
    Statistic,
    Table,
    Tabs,
    Tag,
    Typography,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    SolutionOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { customerService } from '../../../services/core-contracts/services/customer.service';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type {
    ICreateCustomerInput,
    ICustomer,
} from '../../../services/core-contracts/types/customer.types';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';
import CustomerUpsertDrawer from './components/CustomerUpsertDrawer';
import { formatJourneyDate, getJourneyStepLabel, getJourneySlaLabel } from '../Journeys/journeySaleMeta';

const { Text, Title } = Typography;

const CustomerDetail: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [customer, setCustomer] = useState<ICustomer | null>(null);
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const loadData = async () => {
        if (!customerId) {
            return;
        }

        setLoading(true);

        try {
            const [customerResponse, journeyResponse] = await Promise.all([
                customerService.findContent(customerId),
                journeyService.queryContent(),
            ]);

            setCustomer(customerResponse);
            setJourneys((journeyResponse?.data || []).filter((journey) => journey.customer_id === customerId));
        } catch (error) {
            console.error('Không thể tải hồ sơ khách hàng', error);
            message.error('Không thể tải hồ sơ khách hàng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [customerId]);

    const latestJourney = useMemo(
        () =>
            journeys
                .slice()
                .sort((left, right) =>
                    String(right.last_activity_at || '').localeCompare(
                        String(left.last_activity_at || ''),
                    ),
                )[0],
        [journeys],
    );

    const handleUpdate = async (payload: ICreateCustomerInput) => {
        if (!customerId) {
            return;
        }

        setSaving(true);

        try {
            await customerService.updateCustomer(customerId, payload);
            message.success('Đã cập nhật khách hàng.');
            setDrawerOpen(false);
            await loadData();
        } catch (error) {
            console.error('Không thể cập nhật khách hàng', error);
            message.error('Không thể cập nhật khách hàng.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!customerId || !customer) {
            return;
        }

        if (journeys.length > 0) {
            message.warning('Không thể xóa khách hàng đang còn liên kết với công trình.');
            return;
        }

        try {
            await customerService.deleteCustomer(customerId);
            message.success('Đã xóa khách hàng.');
            navigate('/admin/kd/customers');
        } catch (error) {
            console.error('Không thể xóa khách hàng', error);
            message.error('Không thể xóa khách hàng.');
        }
    };

    if (loading) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="large" tip="Đang tải hồ sơ khách hàng..." />
            </div>
        );
    }

    if (!customer) {
        return (
            <Card style={{ marginTop: 40, textAlign: 'center', borderRadius: 20 }}>
                <Empty description="Không tìm thấy hồ sơ khách hàng." />
                <Button onClick={() => navigate('/admin/kd/customers')}>Quay lại danh sách khách hàng</Button>
            </Card>
        );
    }

    const journeyColumns: ColumnsType<IJourney> = [
        {
            title: 'Mã công trình',
            dataIndex: 'journey_code',
            key: 'journey_code',
            render: (value: string, journey) => (
                <Button type="link" style={{ padding: 0 }} onClick={() => navigate(`/admin/kd/dashboard/${journey._id}`)}>
                    {value}
                </Button>
            ),
        },
        {
            title: 'Yêu cầu dịch vụ',
            dataIndex: 'request_title',
            key: 'request_title',
        },
        {
            title: 'Bước hiện tại',
            dataIndex: 'current_step',
            key: 'current_step',
            render: (value?: string) => getJourneyStepLabel(value),
        },
        {
            title: 'SLA',
            dataIndex: 'sla_status',
            key: 'sla_status',
            render: (value?: string) => <Tag>{getJourneySlaLabel(value)}</Tag>,
        },
        {
            title: 'Cập nhật gần nhất',
            dataIndex: 'last_activity_at',
            key: 'last_activity_at',
            render: (value?: string) => formatJourneyDate(value, true),
        },
    ];

    const tabItems = [
        {
            key: 'overview',
            label: 'Tổng quan',
            children: (
                <Row gutter={[20, 20]}>
                    <Col xs={24} xl={14}>
                        <Card bordered={false} style={{ borderRadius: 18 }}>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Mã khách hàng">{customer?.code || 'Chưa có mã'}</Descriptions.Item>
                                <Descriptions.Item label="Họ và tên">{customer?.full_name || 'Chưa cập nhật'}</Descriptions.Item>
                                <Descriptions.Item label="Điện thoại">{customer?.phone || 'Chưa cập nhật'}</Descriptions.Item>
                                <Descriptions.Item label="Email">{customer?.email || 'Chưa cập nhật'}</Descriptions.Item>
                                <Descriptions.Item label="Zalo">{customer?.zalo || 'Chưa cập nhật'}</Descriptions.Item>
                                <Descriptions.Item label="PM phụ trách">{customer?.assigned_pm_id || 'Chưa gán'}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">
                                    {[customer?.address, customer?.ward, customer?.province, customer?.city]
                                        .filter(Boolean)
                                        .join(', ') || 'Chưa cập nhật'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ghi chú CRM">{customer?.notes || 'Chưa có ghi chú'}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col xs={24} xl={10}>
                        <Card bordered={false} style={{ borderRadius: 18, marginBottom: 20 }}>
                            <Statistic title="Tổng yêu cầu dịch vụ" value={journeys.length} />
                            <div style={{ marginTop: 12 }}>
                                <Text type="secondary">Công trình gần nhất</Text>
                                <div style={{ marginTop: 4 }}>
                                    <Text strong>{latestJourney?.journey_code || 'Chưa có công trình'}</Text>
                                </div>
                            </div>
                        </Card>
                        <Card bordered={false} style={{ borderRadius: 18 }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button
                                    type="primary"
                                    icon={<SolutionOutlined />}
                                    onClick={() => navigate(`/admin/kd/dashboard?customerId=${customerId}`)}
                                >
                                    Tạo yêu cầu dịch vụ
                                </Button>
                                <Button icon={<EditOutlined />} onClick={() => setDrawerOpen(true)}>
                                    Cập nhật khách hàng
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'journeys',
            label: `Yêu cầu dịch vụ (${journeys.length})`,
            children: (
                <Card bordered={false} style={{ borderRadius: 18 }}>
                    <Table
                        rowKey="_id"
                        columns={journeyColumns}
                        dataSource={journeys}
                        pagination={{ pageSize: 8, showSizeChanger: false }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="Khách hàng này chưa có yêu cầu dịch vụ nào."
                                />
                            ),
                        }}
                    />
                </Card>
            ),
        },
    ];

    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/admin/kd/customers')}
                    style={{ padding: 0 }}
                >
                    Quay lại danh sách khách hàng
                </Button>
            </div>

            <Card bordered={false} style={{ marginBottom: 24, borderRadius: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} lg={16}>
                        <Space size={12}>
                            <Tag color="blue">{customer?.code || 'Chưa có mã'}</Tag>
                            <Tag color="processing">{journeys.length} công trình</Tag>
                        </Space>
                        <Title level={3} style={{ margin: '12px 0 4px' }}>
                            {customer?.full_name || 'Khách hàng chưa đặt tên'}
                        </Title>
                        <Space size={[16, 8]} wrap>
                            <Text>
                                <PhoneOutlined style={{ marginRight: 6 }} />
                                {customer?.phone || 'Chưa có số điện thoại'}
                            </Text>
                            <Text>
                                <MailOutlined style={{ marginRight: 6 }} />
                                {customer?.email || 'Chưa có email'}
                            </Text>
                            <Text>
                                <UserOutlined style={{ marginRight: 6 }} />
                                {customer?.assigned_pm_id || 'Chưa gán phụ trách'}
                            </Text>
                        </Space>
                    </Col>
                    <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                        <Space wrap>
                            <Button icon={<EditOutlined />} onClick={() => setDrawerOpen(true)}>
                                Cập nhật
                            </Button>
                            <Popconfirm
                                title="Xóa khách hàng"
                                description="Chỉ nên xóa khi khách hàng không còn công trình nào."
                                okText="Xóa"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                                onConfirm={handleDelete}
                            >
                                <Button danger icon={<DeleteOutlined />}>
                                    Xóa
                                </Button>
                            </Popconfirm>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Tabs
                items={tabItems}
                size="large"
                style={{ background: '#fff', padding: '0 24px 24px', borderRadius: 24 }}
            />

            <CustomerUpsertDrawer
                open={drawerOpen}
                mode="edit"
                customer={customer}
                saving={saving}
                onCancel={() => setDrawerOpen(false)}
                onSubmit={handleUpdate}
            />
        </div>
    );
};

export default CustomerDetail;
