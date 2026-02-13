import React, { useState } from 'react';
import {
    Card, Table, Tag, Button, Row, Col, Statistic, Input, Select, Space,
    Dropdown, Grid, Badge,
} from 'antd';
import type { MenuProps } from 'antd';
import {
    PlusOutlined, EyeOutlined,
    EditOutlined, DeleteOutlined, MoreOutlined, ProjectOutlined,
    FileTextOutlined, DollarOutlined, ClockCircleOutlined,
    ExportOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

// ─── Types ─────────────────────────────────────────────────────────
interface Contract {
    id: string;
    code: string;
    name: string;
    customer: string;
    type: 'fixed' | 'time_material' | 'maintenance';
    value: number;
    startDate: string;
    endDate: string;
    status: 'draft' | 'active' | 'completed' | 'expired' | 'cancelled';
    projectCount: number;
    paymentProgress: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────
const mockContracts: Contract[] = [
    { id: '1', code: 'HD-2025-001', name: 'HĐ Sửa chữa tầng 5 - Sunrise City', customer: 'Sunshine Group', type: 'fixed', value: 1500000000, startDate: '2025-01-15', endDate: '2025-06-15', status: 'active', projectCount: 3, paymentProgress: 45 },
    { id: '2', code: 'HD-2025-002', name: 'HĐ Chống thấm Block A', customer: 'Vinhomes', type: 'fixed', value: 800000000, startDate: '2025-02-01', endDate: '2025-05-30', status: 'active', projectCount: 2, paymentProgress: 30 },
    { id: '3', code: 'HD-2025-003', name: 'Bảo trì định kỳ 2025', customer: 'The Manor', type: 'maintenance', value: 2000000000, startDate: '2025-01-01', endDate: '2025-12-31', status: 'active', projectCount: 5, paymentProgress: 20 },
    { id: '4', code: 'HD-2024-015', name: 'HĐ Sơn Epoxy tầng hầm', customer: 'Landmark 81', type: 'time_material', value: 500000000, startDate: '2024-10-01', endDate: '2025-01-31', status: 'completed', projectCount: 1, paymentProgress: 100 },
    { id: '5', code: 'HD-2025-004', name: 'HĐ Gia cố kết cấu tòa nhà B', customer: 'Phú Mỹ Hưng', type: 'fixed', value: 3200000000, startDate: '2025-03-01', endDate: '2025-09-30', status: 'draft', projectCount: 0, paymentProgress: 0 },
    { id: '6', code: 'HD-2024-012', name: 'Sửa chữa nội thất VP', customer: 'TTC Land', type: 'fixed', value: 350000000, startDate: '2024-08-15', endDate: '2024-12-15', status: 'expired', projectCount: 1, paymentProgress: 80 },
];

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const statusConfig: Record<string, { color: string; label: string }> = {
    draft: { color: 'default', label: 'Bản nháp' },
    active: { color: 'processing', label: 'Đang thực hiện' },
    completed: { color: 'success', label: 'Hoàn thành' },
    expired: { color: 'warning', label: 'Hết hạn' },
    cancelled: { color: 'error', label: 'Đã hủy' },
};

const typeConfig: Record<string, string> = {
    fixed: 'Trọn gói',
    time_material: 'Theo thời gian',
    maintenance: 'Bảo trì',
};

const ContractList: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [contracts] = useState<Contract[]>(mockContracts);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchText, setSearchText] = useState('');

    const filteredContracts = contracts.filter((c) => {
        if (filterStatus !== 'all' && c.status !== filterStatus) return false;
        if (searchText && !c.name.toLowerCase().includes(searchText.toLowerCase()) && !c.code.toLowerCase().includes(searchText.toLowerCase())) return false;
        return true;
    });

    const activeContracts = contracts.filter((c) => c.status === 'active');
    const totalValue = activeContracts.reduce((sum, c) => sum + c.value, 0);
    const totalProjects = contracts.reduce((sum, c) => sum + c.projectCount, 0);

    const getActionMenu = (record: Contract): MenuProps['items'] => [
        { key: 'view', icon: <EyeOutlined />, label: 'Xem chi tiết', onClick: () => navigate(`/pm/contracts/${record.id}`) },
        { key: 'edit', icon: <EditOutlined />, label: 'Chỉnh sửa' },
        { key: 'create-project', icon: <ProjectOutlined />, label: 'Tạo dự án', onClick: () => navigate('/pm/projects/create') },
        { type: 'divider' },
        { key: 'delete', icon: <DeleteOutlined />, label: 'Xóa', danger: true },
    ];

    const columns = [
        {
            title: 'Mã HĐ', dataIndex: 'code', key: 'code', width: 130,
            render: (code: string, record: Contract) => (
                <a onClick={() => navigate(`/pm/contracts/${record.id}`)} style={{ fontWeight: 500 }}>{code}</a>
            ),
        },
        {
            title: 'Tên hợp đồng', dataIndex: 'name', key: 'name',
            ellipsis: true,
            render: (name: string, record: Contract) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{record.customer}</div>
                </div>
            ),
        },
        {
            title: 'Loại', dataIndex: 'type', key: 'type', width: 120,
            render: (t: string) => <Tag>{typeConfig[t]}</Tag>,
            responsive: ['lg' as const],
        },
        {
            title: 'Giá trị', dataIndex: 'value', key: 'value', width: 150,
            render: (v: number) => <span style={{ fontWeight: 500, color: '#1890ff' }}>{formatCurrency(v)}</span>,
            responsive: ['md' as const],
        },
        {
            title: 'Thời hạn', key: 'period', width: 180,
            render: (_: any, r: Contract) => (
                <span style={{ fontSize: 12 }}>{r.startDate} → {r.endDate}</span>
            ),
            responsive: ['lg' as const],
        },
        {
            title: 'Dự án', dataIndex: 'projectCount', key: 'projectCount', width: 80,
            render: (c: number) => <Badge count={c} showZero style={{ background: c > 0 ? '#1890ff' : '#d9d9d9' }} />,
            responsive: ['md' as const],
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 130,
            render: (s: string) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.label}</Tag>,
        },
        {
            title: '', key: 'action', width: 50,
            render: (_: any, record: Contract) => (
                <Dropdown menu={{ items: getActionMenu(record) }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>Quản Lý Hợp Đồng</h2>
                <Space>
                    <Button icon={<ExportOutlined />} disabled={isMobile}>
                        {!isMobile && 'Xuất báo cáo'}
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/pm/contracts/create')}>
                        {!isMobile && 'Tạo hợp đồng'}
                    </Button>
                </Space>
            </Row>

            {/* Summary Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic title="Tổng HĐ" value={contracts.length} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic title="Đang thực hiện" value={activeContracts.length} valueStyle={{ color: '#1890ff' }} prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic title="Tổng giá trị HĐ" value={totalValue / 1e9} suffix="tỷ" prefix={<DollarOutlined />} precision={1} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic title="Dự án liên kết" value={totalProjects} prefix={<ProjectOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 12]} align="middle">
                    <Col xs={24} sm={8} md={6}>
                        <Search
                            placeholder="Tìm mã hoặc tên HĐ..."
                            allowClear
                            onSearch={setSearchText}
                            onChange={(e) => !e.target.value && setSearchText('')}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select value={filterStatus} onChange={setFilterStatus} style={{ width: '100%' }}>
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="draft">Bản nháp</Option>
                            <Option value="active">Đang thực hiện</Option>
                            <Option value="completed">Hoàn thành</Option>
                            <Option value="expired">Hết hạn</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card>
                <Table
                    dataSource={filteredContracts}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `${t} hợp đồng` }}
                    scroll={{ x: 700 }}
                />
            </Card>
        </div>
    );
};

export default ContractList;
