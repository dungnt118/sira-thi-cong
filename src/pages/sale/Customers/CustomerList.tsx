import React, { useEffect, useMemo, useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    Col,
    Empty,
    Input,
    Popconfirm,
    Row,
    Space,
    Statistic,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PhoneOutlined,
    PlusOutlined,
    SearchOutlined,
    SolutionOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../../services/core-contracts/services/customer.service';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type {
    ICreateCustomerInput,
    ICustomer,
} from '../../../services/core-contracts/types/customer.types';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';
import CustomerUpsertDrawer from './components/CustomerUpsertDrawer';

const { Text, Title } = Typography;

const CustomerList: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [keyword, setKeyword] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);

    const loadData = async () => {
        setLoading(true);

        try {
            const [customerResponse, journeyResponse] = await Promise.all([
                customerService.queryContent(),
                journeyService.queryContent(),
            ]);

            setCustomers(customerResponse?.data || []);
            setJourneys(journeyResponse?.data || []);
        } catch (error) {
            console.error('Không thể tải dữ liệu khách hàng', error);
            message.error('Không thể tải dữ liệu khách hàng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const journeyMap = useMemo(() => {
        const counter = new Map<string, IJourney[]>();

        journeys.forEach((journey) => {
            if (!journey.customer_id) {
                return;
            }

            const items = counter.get(journey.customer_id) || [];
            items.push(journey);
            counter.set(journey.customer_id, items);
        });

        return counter;
    }, [journeys]);

    const filteredCustomers = customers.filter((customer) => {
        const haystacks = [
            customer.code,
            customer.full_name,
            customer.phone,
            customer.email,
            customer.zalo,
            customer.address,
            customer.ward,
            customer.district,
            customer.province,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return !keyword || haystacks.includes(keyword.toLowerCase());
    });

    const customersWithJourney = customers.filter((customer) => journeyMap.has(customer._id)).length;
    const customersWithoutJourney = customers.length - customersWithJourney;
    const activeJourneyCount = journeys.filter(
        (journey) =>
            journey.current_step &&
            !['handover_acceptance', 'warranty_aftercare'].includes(journey.current_step),
    ).length;

    const openCreateDrawer = () => {
        setDrawerMode('create');
        setSelectedCustomer(null);
        setDrawerOpen(true);
    };

    const openEditDrawer = (customer: ICustomer) => {
        setDrawerMode('edit');
        setSelectedCustomer(customer);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedCustomer(null);
    };

    const handleSubmit = async (payload: ICreateCustomerInput) => {
        setSaving(true);

        try {
            if (drawerMode === 'create') {
                await customerService.createCustomer(payload);
                message.success('Đã tạo khách hàng mới.');
            } else if (selectedCustomer?._id) {
                await customerService.updateCustomer(selectedCustomer._id, payload);
                message.success('Đã cập nhật khách hàng.');
            }

            closeDrawer();
            await loadData();
        } catch (error) {
            console.error('Không thể lưu khách hàng', error);
            message.error('Không thể lưu khách hàng.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (customer: ICustomer) => {
        if ((journeyMap.get(customer._id) || []).length > 0) {
            message.warning('Không thể xóa khách hàng đang còn liên kết với công trình.');
            return;
        }

        try {
            await customerService.deleteCustomer(customer._id);
            message.success('Đã xóa khách hàng.');
            await loadData();
        } catch (error) {
            console.error('Không thể xóa khách hàng', error);
            message.error('Không thể xóa khách hàng.');
        }
    };

    const columns: ColumnsType<ICustomer> = [
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, customer) => (
                <Space size={12}>
                    <Avatar icon={<UserOutlined />} style={{ background: '#1677ff' }} />
                    <div>
                        <div
                            style={{ fontWeight: 600, color: '#1677ff', cursor: 'pointer' }}
                            onClick={() => navigate(`/admin/kd/customers/${customer._id}`)}
                        >
                            {customer.full_name || 'Khách hàng chưa đặt tên'}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {customer.code || 'Chưa có mã khách hàng'}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            render: (_, customer) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <PhoneOutlined style={{ marginRight: 6 }} />
                        {customer.phone}
                    </div>
                    <Text type="secondary">{customer.email || customer.zalo || 'Chưa có email / Zalo'}</Text>
                </div>
            ),
        },
        {
            title: 'Địa bàn',
            key: 'address',
            render: (_, customer) => (
                <div>
                    <div>{customer.ward || '—'}</div>
                    <Text type="secondary">
                        {[customer.district, customer.province].filter(Boolean).join(', ') || 'Chưa cập nhật địa bàn'}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Phụ trách nội bộ',
            dataIndex: 'assigned_pm_id',
            key: 'assigned_pm_id',
            render: (value?: string) => value || 'Chưa gán',
        },
        {
            title: 'Công trình',
            key: 'journeys',
            render: (_, customer) => {
                const customerJourneys = journeyMap.get(customer._id) || [];
                const latestJourney = customerJourneys
                    .slice()
                    .sort((left, right) =>
                        String(right.last_activity_at || '').localeCompare(
                            String(left.last_activity_at || ''),
                        ),
                    )[0];

                return (
                    <Space direction="vertical" size={4}>
                        <Tag color={customerJourneys.length > 0 ? 'processing' : 'default'}>
                            {customerJourneys.length} yêu cầu dịch vụ
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Gần nhất: {latestJourney?.journey_code || 'Chưa có công trình'}
                        </Text>
                    </Space>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'right',
            render: (_, customer) => (
                <Space>
                    <Tooltip title="Mở hồ sơ khách hàng">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/admin/kd/customers/${customer._id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa khách hàng">
                        <Button icon={<EditOutlined />} onClick={() => openEditDrawer(customer)} />
                    </Tooltip>
                    <Tooltip title="Tạo yêu cầu dịch vụ">
                        <Button
                            type="primary"
                            ghost
                            icon={<SolutionOutlined />}
                            onClick={() => navigate(`/admin/kd/dashboard?customerId=${customer._id}`)}
                        >
                            Tạo yêu cầu
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="Xóa khách hàng"
                        description="Chỉ nên xóa khi khách hàng chưa phát sinh công trình nào."
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(customer)}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ paddingBottom: 32 }}>
            <Row justify="space-between" align="bottom" gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Hệ thống quản lý bán hàng
                    </Text>
                    <Title level={2} style={{ margin: '4px 0 8px' }}>
                        Khách hàng
                    </Title>
                    <Text type="secondary">
                        Quản lý danh sách khách hàng, thông tin liên hệ và điều hướng sang tạo yêu cầu dịch vụ mới.
                    </Text>
                </Col>
                <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>
                        Tạo khách hàng
                    </Button>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 18 }}>
                        <Statistic title="Tổng khách hàng" value={customers.length} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 18 }}>
                        <Statistic title="Đã có công trình" value={customersWithJourney} valueStyle={{ color: '#1677ff' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 18 }}>
                        <Statistic title="Đang theo dõi" value={activeJourneyCount} valueStyle={{ color: '#d48806' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 18 }}>
                        <Statistic title="Chưa có công trình" value={customersWithoutJourney} valueStyle={{ color: '#8c8c8c' }} />
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} style={{ borderRadius: 20, marginBottom: 24 }}>
                <Input
                    allowClear
                    size="large"
                    placeholder="Tìm theo mã khách hàng, họ tên, số điện thoại, email hoặc địa chỉ..."
                    prefix={<SearchOutlined />}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
            </Card>

            <Card bordered={false} style={{ borderRadius: 20 }}>
                <Table
                    rowKey="_id"
                    loading={loading}
                    columns={columns}
                    dataSource={filteredCustomers}
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Chưa có khách hàng phù hợp với bộ lọc hiện tại."
                            />
                        ),
                    }}
                />
            </Card>

            <CustomerUpsertDrawer
                open={drawerOpen}
                mode={drawerMode}
                customer={selectedCustomer}
                saving={saving}
                onCancel={closeDrawer}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default CustomerList;
