import React, { useState } from 'react';
import {
    Table, Card, Button, Input, Space, Avatar,
    Row, Col, Dropdown, Typography, Empty, Grid
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
    PlusOutlined, SearchOutlined, UserOutlined,
    PhoneOutlined, EnvironmentOutlined, EyeOutlined, EditOutlined,
    MoreOutlined, PlusCircleOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { customerService } from '../../../services/core-contracts/services/customer.service';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { mockServiceRequests as defaultRequests } from '../../../data/mockData';
import type { ICustomer } from '../../../services/core-contracts/types/customer.types';
import type { Customer } from '../../../types/v3';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const CustomerList: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [mockServiceRequests] = useState<any[]>(defaultRequests);
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [journeyCounts, setJourneyCounts] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const res = await customerService.queryCustomersDto({});
            if (res.code === 0 && res.data) {
                setCustomers(res.data);

                // Fetch all journeys to map counts
                const jRes = await journeyService.queryJourneysDto({});
                if (jRes.code === 0 && jRes.data) {
                    const counts: Record<string, number> = {};
                    jRes.data.forEach(j => {
                        const phone = j.customer_phone;
                        if (phone) {
                            counts[phone] = (counts[phone] || 0) + 1;
                        }
                    });
                    setJourneyCounts(counts);
                }
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            message.error('Không thể tải danh sách khách hàng');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCustomers();
    }, []);

    const filtered = customers.filter(c => {
        return !search ||
            c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            c.phone?.includes(search) ||
            c.code?.toLowerCase().includes(search.toLowerCase());
    });

    const getRowActions = (record: ICustomer): MenuProps['items'] => [
        { key: 'view', icon: <EyeOutlined />, label: 'Xem chi tiết', onClick: () => navigate(`/admin/ql/crm/customers/${record._id}`) },
        { key: 'edit', icon: <EditOutlined />, label: 'Chỉnh sửa', onClick: () => navigate(`/admin/ql/crm/customers/${record._id}/edit`) },
        { type: 'divider' },
        { key: 'create-deal', icon: <PlusCircleOutlined />, label: 'Tạo Yêu cầu mới', onClick: () => navigate(`/admin/ql/crm/service-requests/new?customerId=${record._id}`) },
        { key: 'delete', icon: <DeleteOutlined />, label: 'Xóa khách hàng', danger: true },
    ];

    const columns: ColumnsType<ICustomer> = [
        {
            title: 'Khách hàng',
            key: 'customer',
            fixed: isMobile ? 'left' : undefined,
            width: isMobile ? 200 : undefined,
            render: (_, r) => (
                <Space>
                    <Avatar size={36} icon={<UserOutlined />} style={{ background: '#1976D2' }} />
                    <div>
                        <div style={{ fontWeight: 600, cursor: 'pointer', color: '#1976D2' }}
                            onClick={() => navigate(`/admin/ql/crm/customers/${r._id}`)}>
                            {r.full_name}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{r.code}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            width: 180,
            render: (_, r) => (
                <div>
                    <div><PhoneOutlined style={{ marginRight: 4 }} />{r.phone}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <EnvironmentOutlined style={{ marginRight: 4 }} />{r.district}, {r.city}
                    </Text>
                </div>
            ),
        },
        {
            title: 'PM phụ trách',
            dataIndex: 'assignedPmName',
            key: 'pm',
            responsive: ['md'],
            render: (name: string) => (
                <Space>
                    <Avatar size={24} style={{ background: '#52c41a' }} icon={<UserOutlined />} />
                    {name}
                </Space>
            ),
        },
        {
            title: 'Công trình',
            key: 'deals',
            align: 'center',
            width: 100,
            render: (_, r) => {
                const count = journeyCounts[r.phone || ''] || 0;
                return (
                    <div style={{ fontWeight: 500, color: count > 0 ? '#1976D2' : '#aaa' }}>
                        {count} HT
                    </div>
                )
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            responsive: ['lg'],
            sorter: (a, b) => String(a.createdAt).localeCompare(String(b.createdAt)),
            render: (text) => text ? String(text).split('T')[0] : '—'
        },
        {
            title: '',
            key: 'actions',
            width: 48,
            fixed: 'right',
            render: (_, r) => (
                <Dropdown menu={{ items: getRowActions(r) }} placement="bottomRight" trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: isMobile ? 16 : 24,
                gap: 12
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: isMobile ? 20 : 24 }}>Danh sách Khách hàng</h2>
                    <Text type="secondary">Quản lý cơ sở dữ liệu liên hệ khách hàng</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/admin/ql/crm/customers/new')}
                    block={isMobile}
                >
                    Thêm Khách hàng
                </Button>
            </div>

            <Card bodyStyle={{ padding: isMobile ? 8 : 24 }}>
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    <Col flex="auto">
                        <Input
                            placeholder="Tìm kiếm..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: !isMobile,
                        showTotal: isMobile ? undefined : (t) => `${t} khách hàng`,
                        size: isMobile ? 'small' : 'default'
                    }}
                    locale={{ emptyText: <Empty description="Không có khách hàng" /> }}
                    size={isMobile ? 'small' : 'middle'}
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </div>
    );
};

export default CustomerList;
