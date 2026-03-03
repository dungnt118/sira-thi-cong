import React, { useState } from 'react';
import {
    Table, Card, Button, Tag, Input, Select, Space, Avatar,
    Row, Col, Statistic, Badge, Dropdown, Typography, Empty
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
    PlusOutlined, SearchOutlined, FilterOutlined, UserOutlined,
    PhoneOutlined, EnvironmentOutlined, EyeOutlined, EditOutlined,
    MoreOutlined, FunnelPlotOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockCustomers } from '../../../data/mockData';
import type { Customer, CustomerPipelineStatus } from '../../../types/v3';

const { Text } = Typography;

const STATUS_CONFIG: Record<CustomerPipelineStatus, { label: string; color: string }> = {
    NEW: { label: 'Khách mới', color: 'default' },
    SURVEYING: { label: 'Đang khảo sát', color: 'processing' },
    QUOTED: { label: 'Đã báo giá', color: 'warning' },
    NEGOTIATING: { label: 'Đàm phán', color: 'purple' },
    SIGNED: { label: 'Đã ký HĐ', color: 'success' },
    REJECTED: { label: 'Từ chối', color: 'error' },
};

const CustomerList: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<CustomerPipelineStatus | 'ALL'>('ALL');

    const filtered = mockCustomers.filter(c => {
        const matchSearch = !search ||
            c.fullName.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            c.code.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || c.pipelineStatus === filterStatus;
        return matchSearch && matchStatus;
    });

    // KPI counts
    const kpi = {
        total: mockCustomers.length,
        surveying: mockCustomers.filter(c => c.pipelineStatus === 'SURVEYING').length,
        quoted: mockCustomers.filter(c => c.pipelineStatus === 'QUOTED').length,
        signed: mockCustomers.filter(c => c.pipelineStatus === 'SIGNED').length,
    };

    const getRowActions = (record: Customer): MenuProps['items'] => [
        { key: 'view', icon: <EyeOutlined />, label: 'Xem chi tiết', onClick: () => navigate(`/pm/crm/customers/${record.id}`) },
        { key: 'edit', icon: <EditOutlined />, label: 'Chỉnh sửa', onClick: () => navigate(`/pm/crm/customers/${record.id}/edit`) },
        { key: 'survey', label: '📸 Khảo sát & Đo ẩm', onClick: () => navigate(`/pm/crm/customers/${record.id}/survey`) },
        { key: 'quote', label: '💰 Lập báo giá', onClick: () => navigate(`/pm/crm/customers/${record.id}/quotation`) },
        { type: 'divider' },
        { key: 'project', label: '🔨 Tạo dự án thi công', disabled: record.pipelineStatus !== 'SIGNED' },
    ];

    const columns: ColumnsType<Customer> = [
        {
            title: 'Khách hàng',
            key: 'customer',
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
            render: (name: string) => (
                <Space>
                    <Avatar size={24} style={{ background: '#52c41a' }} icon={<UserOutlined />} />
                    {name}
                </Space>
            ),
        },
        {
            title: 'Trạng thái Pipeline',
            key: 'status',
            render: (_, r) => {
                const s = STATUS_CONFIG[r.pipelineStatus];
                return <Tag color={s.color}>{s.label}</Tag>;
            },
            filters: Object.entries(STATUS_CONFIG).map(([k, v]) => ({ text: v.label, value: k })),
            onFilter: (value, r) => r.pipelineStatus === value,
        },
        {
            title: 'Báo giá',
            key: 'quotations',
            align: 'center',
            render: (_, r) => (
                r.quotations.length > 0
                    ? <Badge count={r.quotations.length} style={{ background: '#1976D2' }} />
                    : <Text type="secondary">-</Text>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        },
        {
            title: '',
            key: 'actions',
            width: 48,
            render: (_, r) => (
                <Dropdown menu={{ items: getRowActions(r) }} placement="bottomRight" trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ margin: 0 }}>Danh sách Khách hàng</h2>
                    <Text type="secondary">Quản lý toàn bộ khách hàng và CRM pipeline</Text>
                </div>
                <Space>
                    <Button icon={<FunnelPlotOutlined />} onClick={() => navigate('/pm/crm/pipeline')}>
                        Xem Pipeline
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/pm/crm/customers/new')}>
                        Thêm Khách hàng
                    </Button>
                </Space>
            </div>

            {/* KPI Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                {[
                    { label: 'Tổng KH', value: kpi.total, color: '#1976D2', onClick: () => setFilterStatus('ALL') },
                    { label: 'Đang khảo sát', value: kpi.surveying, color: '#fa8c16', onClick: () => setFilterStatus('SURVEYING') },
                    { label: 'Đã báo giá', value: kpi.quoted, color: '#722ed1', onClick: () => setFilterStatus('QUOTED') },
                    { label: 'Đã ký HĐ', value: kpi.signed, color: '#52c41a', onClick: () => setFilterStatus('SIGNED') },
                ].map((k, i) => (
                    <Col span={6} key={i}>
                        <Card hoverable onClick={k.onClick} style={{ cursor: 'pointer', borderLeft: `3px solid ${k.color}` }}>
                            <Statistic title={k.label} value={k.value} valueStyle={{ color: k.color, fontSize: 28 }} />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card>
                {/* Filter Bar */}
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    <Col flex="auto">
                        <Input
                            placeholder="Tìm kiếm tên, SĐT, mã KH..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col>
                        <Select
                            style={{ width: 180 }}
                            value={filterStatus}
                            onChange={setFilterStatus}
                            options={[
                                { value: 'ALL', label: 'Tất cả trạng thái' },
                                ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
                            ]}
                            suffixIcon={<FilterOutlined />}
                        />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `${t} khách hàng` }}
                    locale={{ emptyText: <Empty description="Không có khách hàng" /> }}
                    size="middle"
                />
            </Card>
        </div>
    );
};

export default CustomerList;
