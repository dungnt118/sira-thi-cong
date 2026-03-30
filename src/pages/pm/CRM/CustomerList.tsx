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
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import { mockCustomers as defaultCustomers, mockServiceRequests as defaultRequests } from '../../../data/mockData';
import type { Customer } from '../../../types/v3';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const CustomerList: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [mockCustomers] = useLocalStorageData<Customer[]>(demoDataService.KEYS.CUSTOMERS, defaultCustomers);
    const [mockServiceRequests] = useLocalStorageData<any[]>(demoDataService.KEYS.SERVICE_REQUESTS, defaultRequests);

    const filtered = mockCustomers.filter(c => {
        return !search ||
            c.fullName.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            c.code.toLowerCase().includes(search.toLowerCase());
    });

    const getRowActions = (record: Customer): MenuProps['items'] => [
        { key: 'view', icon: <EyeOutlined />, label: 'Xem chi tiết', onClick: () => navigate(`/pm/crm/customers/${record.id}`) },
        { key: 'edit', icon: <EditOutlined />, label: 'Chỉnh sửa', onClick: () => navigate(`/pm/crm/customers/${record.id}/edit`) },
        { type: 'divider' },
        { key: 'create-deal', icon: <PlusCircleOutlined />, label: 'Tạo Yêu cầu mới', onClick: () => navigate(`/pm/crm/service-requests/new?customerId=${record.id}`) },
        { key: 'delete', icon: <DeleteOutlined />, label: 'Xóa khách hàng', danger: true },
    ];

    const columns: ColumnsType<Customer> = [
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
                            onClick={() => navigate(`/pm/crm/customers/${r.id}`)}>
                            {r.fullName}
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
            title: 'Dịch vụ',
            key: 'deals',
            align: 'center',
            width: 100,
            render: (_, r) => {
                const count = mockServiceRequests.filter(req => req.customerId === r.id).length;
                return (
                    <div style={{ fontWeight: 500, color: count > 0 ? '#1976D2' : '#aaa' }}>
                        {count} YC
                    </div>
                )
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            responsive: ['lg'],
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (text) => text.split('T')[0]
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
                    onClick={() => navigate('/pm/crm/customers/new')}
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
                    rowKey="id"
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
