import React from 'react';
import {
    Card, Row, Col, Table, Tag, Button, Statistic, Progress, Alert,
    Typography, Space, Tabs
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    WarningOutlined, PlusOutlined, MinusOutlined, HistoryOutlined
} from '@ant-design/icons';
import { mockMaterials, mockStockOrders } from '../../../data/mockData';
import type { Material } from '../../../types/v3';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const InventoryDashboard: React.FC = () => {
    const navigate = useNavigate();
    const lowStock = mockMaterials.filter(m => m.currentStock <= m.minStockAlert);

    const totalValue = mockMaterials.reduce((s, m) => s + m.currentStock * m.unitCost, 0);

    const matColumns: ColumnsType<Material> = [
        { title: 'Mã VT', dataIndex: 'code', key: 'code', width: 80 },
        {
            title: 'Vật tư',
            key: 'name',
            render: (_, m) => (
                <div>
                    <Text strong>{m.name}</Text>
                    <div style={{ fontSize: 11, color: '#999' }}>{m.category}</div>
                </div>
            ),
        },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 60 },
        {
            title: 'Tồn kho',
            key: 'stock',
            width: 180,
            render: (_, m) => {
                const pct = Math.min(100, Math.round((m.currentStock / (m.minStockAlert * 3)) * 100));
                const isLow = m.currentStock <= m.minStockAlert;
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                            <Text strong style={{ color: isLow ? '#ff4d4f' : '#333' }}>
                                {m.currentStock} {m.unit}
                            </Text>
                            {isLow && <Tag color="error">⚠️ Thấp</Tag>}
                        </div>
                        <Progress
                            percent={pct}
                            size="small"
                            showInfo={false}
                            strokeColor={isLow ? '#ff4d4f' : '#52c41a'}
                        />
                        <Text type="secondary" style={{ fontSize: 10 }}>Cảnh báo: {m.minStockAlert} {m.unit}</Text>
                    </div>
                );
            },
        },
        {
            title: 'Giá trị',
            key: 'value',
            align: 'right',
            render: (_, m) => <Text>{(m.currentStock * m.unitCost).toLocaleString('vi-VN')}đ</Text>,
        },
        {
            title: '',
            key: 'actions',
            width: 120,
            render: (_: unknown, _m: Material) => (
                <Space>
                    <Button size="small" icon={<PlusOutlined />} onClick={() => navigate('/accountant/inventory/stock-in')}>
                        Nhập
                    </Button>
                    <Button size="small" icon={<MinusOutlined />} onClick={() => navigate('/accountant/inventory/stock-out')}>
                        Xuất
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Kho Vật tư</Title>
                <Space>
                    <Button icon={<HistoryOutlined />} onClick={() => navigate('/accountant/inventory/history')}>Lịch sử</Button>
                    <Button icon={<MinusOutlined />} onClick={() => navigate('/accountant/inventory/stock-out')}>Tạo phiếu xuất</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/accountant/inventory/stock-in')}>Tạo phiếu nhập</Button>
                </Space>
            </div>

            {/* KPI Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card><Statistic title="Tổng danh mục" value={mockMaterials.length} valueStyle={{ color: '#1976D2' }} /></Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Cần nhập bổ sung"
                            value={lowStock.length}
                            valueStyle={{ color: lowStock.length > 0 ? '#ff4d4f' : '#52c41a' }}
                            prefix={lowStock.length > 0 ? <WarningOutlined /> : undefined}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Phiếu xuất tháng này" value={mockStockOrders.filter(o => o.type === 'OUT').length} /></Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Giá trị kho"
                            value={Math.round(totalValue / 1000000)}
                            suffix="triệu"
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Low stock alert */}
            {lowStock.length > 0 && (
                <Alert
                    message={<>⚠️ <strong>{lowStock.length} vật tư</strong> dưới ngưỡng cảnh báo: {lowStock.map(m => m.name).join(', ')}</>}
                    type="warning"
                    showIcon
                    action={<Button type="primary" size="small" onClick={() => navigate('/accountant/inventory/stock-in')}>Nhập kho ngay</Button>}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Tabs
                items={[
                    {
                        key: 'materials',
                        label: 'Danh mục vật tư',
                        children: (
                            <Card>
                                <Table
                                    columns={matColumns}
                                    dataSource={mockMaterials}
                                    rowKey="id"
                                    size="middle"
                                    pagination={false}
                                    rowClassName={r => r.currentStock <= r.minStockAlert ? 'ant-table-row-warning' : ''}
                                />
                            </Card>
                        ),
                    },
                    {
                        key: 'orders',
                        label: 'Phiếu xuất/nhập gần đây',
                        children: (
                            <Card>
                                <Table
                                    rowKey="id"
                                    dataSource={mockStockOrders}
                                    size="small"
                                    columns={[
                                        { title: 'Mã phiếu', dataIndex: 'code', key: 'code', render: c => <Text strong>{c}</Text> },
                                        { title: 'Loại', dataIndex: 'type', key: 'type', render: t => <Tag color={t === 'OUT' ? 'orange' : 'green'}>{t === 'OUT' ? 'Xuất kho' : 'Nhập kho'}</Tag> },
                                        { title: 'Dự án', dataIndex: 'projectName', key: 'proj', render: v => v || '—' },
                                        { title: 'Giá trị', dataIndex: 'totalValue', key: 'val', render: v => `${v.toLocaleString('vi-VN')}đ` },
                                        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => <Tag color={s === 'SIGNED' ? 'success' : 'warning'}>{s === 'SIGNED' ? '✅ Đã ký' : '⏳ Chờ ký'}</Tag> },
                                        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'date' },
                                    ]}
                                    pagination={false}
                                />
                            </Card>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default InventoryDashboard;
