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
        { title: 'Mã VT', dataIndex: 'code', key: 'code', width: 80, fixed: 'left' },
        {
            title: 'Vật tư',
            key: 'name',
            width: 150,
            render: (_, m) => (
                <div>
                    <Text strong>{m.name}</Text>
                    <div style={{ fontSize: 11, color: '#999' }}>{m.category}</div>
                </div>
            ),
        },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 80 },
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
            width: 120,
            render: (_, m) => <Text>{(m.currentStock * m.unitCost).toLocaleString('vi-VN')}đ</Text>,
        },
        {
            title: '',
            key: 'actions',
            width: 150,
            fixed: 'right',
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
        <div style={{ padding: '0 4px' }}>
            <div style={{ 
                display: 'flex', 
                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: window.innerWidth < 640 ? 'flex-start' : 'center', 
                marginBottom: 24,
                gap: 12
            }}>
                <Title level={4} style={{ margin: 0 }}>📦 Kho Vật tư</Title>
                <Space wrap={true} size={[8, 8]}>
                    <Button icon={<HistoryOutlined />} onClick={() => navigate('/accountant/inventory/history')}>Lịch sử</Button>
                    <Button size={window.innerWidth < 640 ? 'small' : 'middle'} icon={<MinusOutlined />} onClick={() => navigate('/accountant/inventory/stock-out')}>Xuất kho</Button>
                    <Button type="primary" size={window.innerWidth < 640 ? 'small' : 'middle'} icon={<PlusOutlined />} onClick={() => navigate('/accountant/inventory/stock-in')}>Nhập kho</Button>
                </Space>
            </div>

            {/* KPI Row */}
            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" bordered={false} style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Tổng danh mục</Text>} 
                            value={mockMaterials.length} 
                            valueStyle={{ color: '#1976D2', fontSize: 20 }} 
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" bordered={false} style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Cần bổ sung</Text>}
                            value={lowStock.length}
                            valueStyle={{ color: lowStock.length > 0 ? '#ff4d4f' : '#52c41a', fontSize: 20 }}
                            prefix={lowStock.length > 0 ? <WarningOutlined /> : undefined}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" bordered={false} style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Phiếu xuất tháng</Text>} 
                            value={mockStockOrders.filter(o => o.type === 'OUT').length} 
                            valueStyle={{ fontSize: 20 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" bordered={false} style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Giá trị kho</Text>}
                            value={Math.round(totalValue / 1000000)}
                            suffix={<span style={{ fontSize: 12 }}>tr</span>}
                            valueStyle={{ color: '#52c41a', fontSize: 20 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Low stock alert */}
            {lowStock.length > 0 && (
                <Alert
                    message={
                        <div style={{ fontSize: 12 }}>
                            ⚠️ <strong>{lowStock.length} vật tư</strong> thấp: {lowStock.map(m => m.name).join(', ')}
                        </div>
                    }
                    type="warning"
                    showIcon
                    action={
                        <Button type="primary" size="small" style={{ fontSize: 12 }} onClick={() => navigate('/accountant/inventory/stock-in')}>
                            Nhập ngay
                        </Button>
                    }
                    style={{ marginBottom: 16, borderRadius: 8 }}
                />
            )}

            <Tabs
                items={[
                    {
                        key: 'materials',
                        label: 'Danh mục vật tư',
                        children: (
                            <div style={{ background: '#fff', borderRadius: 8, padding: 4 }}>
                                <Table
                                    columns={matColumns}
                                    dataSource={mockMaterials}
                                    rowKey="id"
                                    size="small"
                                    pagination={false}
                                    scroll={{ x: 'max-content' }}
                                    rowClassName={r => r.currentStock <= r.minStockAlert ? 'ant-table-row-warning' : ''}
                                />
                            </div>
                        ),
                    },
                    {
                        key: 'orders',
                        label: 'Lịch sử kho',
                        children: (
                            <div style={{ background: '#fff', borderRadius: 8, padding: 4 }}>
                                <Table
                                    rowKey="id"
                                    dataSource={mockStockOrders}
                                    size="small"
                                    scroll={{ x: 'max-content' }}
                                    columns={[
                                        { title: 'Mã phiếu', dataIndex: 'code', key: 'code', fixed: 'left', width: 100, render: c => <Text strong>{c}</Text> },
                                        { title: 'Loại', dataIndex: 'type', key: 'type', width: 100, render: t => <Tag color={t === 'OUT' ? 'orange' : 'green'}>{t === 'OUT' ? 'Xuất kho' : 'Nhập kho'}</Tag> },
                                        { title: 'Dự án', dataIndex: 'projectName', key: 'proj', minWidth: 150, render: v => v || '—' },
                                        { title: 'Giá trị', dataIndex: 'totalValue', key: 'val', width: 120, render: v => `${v.toLocaleString('vi-VN')}đ` },
                                        { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 100, render: s => <Tag color={s === 'SIGNED' ? 'success' : 'warning'}>{s === 'SIGNED' ? '✅ Đã ký' : '⏳ Chờ ký'}</Tag> },
                                        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'date', width: 110 },
                                    ]}
                                    pagination={false}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default InventoryDashboard;
