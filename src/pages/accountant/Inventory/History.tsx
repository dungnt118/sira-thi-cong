import React, { useState, useMemo } from 'react';
import { Typography, Table, Button, Tag, Card, Row, Col, Statistic, Tabs, Input, Steps, Space, Badge } from 'antd';
import { 
    FileTextOutlined, ClockCircleOutlined, 
    ImportOutlined, ExportOutlined, SearchOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import type { StockOrder, StockOrderStatus } from '../../../types/v3';
import mockStockOrdersData from '../../../data/mock/stockOrders.json';

const { Title, Text } = Typography;

const InventoryHistory: React.FC = () => {
    const navigate = useNavigate();
    
    // Use LocalStorage for state management
    const [stockOrders] = useLocalStorageData<StockOrder[]>('STOCK_ORDERS', mockStockOrdersData as StockOrder[]);
    
    const [activeTabType, setActiveTabType] = useState('OUT'); // IN, OUT
    const [activeStep, setActiveStep] = useState('REQUESTED'); // Default to Requested
    const [searchText, setSearchText] = useState('');

    const stats = useMemo(() => {
        let totalIn = 0;
        let valIn = 0;
        let totalOut = 0;
        let valOut = 0;
        let pending = 0;

        stockOrders.forEach(o => {
            if (o.type === 'IN') {
                totalIn++;
                valIn += o.totalValue || 0;
            } else if (o.type === 'OUT') {
                totalOut++;
                valOut += o.totalValue || 0;
            }
            if (o.status === 'REQUESTED') {
                pending++;
            }
        });

        return {
            total: stockOrders.length,
            totalIn,
            valIn,
            totalOut,
            valOut,
            pending
        };
    }, [stockOrders]);

    // 1. Lọc dữ liệu theo Loại Phiếu (Tab)
    const typeFilteredOrders = useMemo(() => {
        return stockOrders.filter(o => o.type === activeTabType);
    }, [stockOrders, activeTabType]);

    // 2. Tính số lượng hiển thị trên Steps
    const stepCounts = useMemo(() => {
        const counts: Record<string, number> = {
            DRAFT: 0,
            REQUESTED: 0,
            APPROVED: 0,
            COMPLETED: 0,
            CANCELLED: 0
        };
        typeFilteredOrders.forEach(o => {
            if (o.status === 'DRAFT') counts.DRAFT++;
            else if (o.status === 'REQUESTED') counts.REQUESTED++;
            else if (['APPROVED', 'DISPATCHED', 'RECEIVED'].includes(o.status)) counts.APPROVED++;
            else if (o.status === 'COMPLETED') counts.COMPLETED++;
            else if (['CANCELLED', 'DISCREPANCY'].includes(o.status)) counts.CANCELLED++;
        });
        return counts;
    }, [typeFilteredOrders]);

    // 3. Lọc dữ liệu theo Search và Step Status
    const finalList = useMemo(() => {
        if (searchText) {
            const lower = searchText.toLowerCase();
            return stockOrders.filter(o => 
                (o.code && o.code.toLowerCase().includes(lower)) ||
                (o.source && o.source.toLowerCase().includes(lower)) ||
                (o.projectName && o.projectName.toLowerCase().includes(lower)) ||
                (o.journeyCode && o.journeyCode.toLowerCase().includes(lower)) ||
                (o.journeyId && o.journeyId.toLowerCase().includes(lower))
            );
        }

        let list = typeFilteredOrders;

        if (activeStep !== 'ALL') {
            if (activeStep === 'APPROVED') {
                list = list.filter(o => ['APPROVED', 'DISPATCHED', 'RECEIVED'].includes(o.status));
            } else if (activeStep === 'CANCELLED') {
                list = list.filter(o => ['CANCELLED', 'DISCREPANCY'].includes(o.status));
            } else {
                list = list.filter(o => o.status === activeStep);
            }
        }

        return list;
    }, [stockOrders, typeFilteredOrders, activeStep, searchText]);

    const columns = [
        { 
            title: 'Mã phiếu', 
            dataIndex: 'code', 
            key: 'code', 
            fixed: 'left' as const, 
            width: 120, 
            render: (c: string, record: StockOrder) => (
                <Button type="link" onClick={() => navigate(`/accountant/inventory/order/${record.id}`)} style={{ padding: 0 }}>
                    <Text strong>{c}</Text>
                </Button>
            ) 
        },
        { title: 'Loại', dataIndex: 'type', key: 'type', width: 100, render: (t: string) => <Tag color={t === 'OUT' ? 'orange' : 'green'}>{t === 'OUT' ? 'Xuất kho' : 'Nhập kho'}</Tag> },
        { title: 'Nguồn', dataIndex: 'source', key: 'source', width: 120 },
        { 
            title: 'Hành trình', 
            key: 'journey', 
            minWidth: 150, 
            render: (_: any, record: StockOrder) => {
                if (record.journeyCode) {
                    return <Tag color="blue">{record.journeyCode}</Tag>;
                }
                if (record.projectName) {
                    return <span style={{color: '#8c8c8c', fontSize: 12}}>{record.projectName}</span>;
                }
                return <span style={{color: '#bfbfbf'}}>—</span>;
            }
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'st', 
            width: 130,
            render: (s: StockOrderStatus) => {
                const colors: Record<string, string> = {
                    'DRAFT': 'default',
                    'REQUESTED': 'processing',
                    'APPROVED': 'cyan',
                    'DISPATCHED': 'purple',
                    'RECEIVED': 'blue',
                    'COMPLETED': 'success',
                    'DISCREPANCY': 'error',
                    'CANCELLED': 'error'
                };
                return <Tag color={colors[s] || 'default'}>{s}</Tag>;
            }
        },
        { title: 'Giá trị', dataIndex: 'totalValue', key: 'val', width: 120, render: (v: number) => `${(v || 0).toLocaleString('vi-VN')}đ` },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'date', width: 110 },
    ];

    const tabTypes = [
        { key: 'OUT', label: `Phiếu xuất kho (${stats.totalOut})` },
        { key: 'IN', label: `Phiếu nhập kho (${stats.totalIn})` }
    ];

    const STATUS_STEPS = [
        { key: 'DRAFT', title: 'Nháp' },
        { key: 'REQUESTED', title: 'Cần duyệt' },
        { key: 'APPROVED', title: 'Đang xử lý' },
        { key: 'COMPLETED', title: 'Hoàn thành' },
        { key: 'CANCELLED', title: 'Đã hủy/Lỗi' }
    ];

    const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === activeStep);

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 24 
            }}>
                <Title level={4} style={{ margin: 0 }}>⏱️ Lịch sử xuất/nhập kho</Title>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic 
                            title="Tổng số phiếu" 
                            value={stats.total} 
                            prefix={<FileTextOutlined style={{ color: '#1890ff' }} />} 
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                            (Nhập: {stats.totalIn} - Xuất: {stats.totalOut})
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic 
                            title="Giá trị Nhập kho" 
                            value={stats.valIn} 
                            valueStyle={{ color: '#52c41a' }} 
                            prefix={<ImportOutlined />} 
                            suffix="đ"
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                            Phiếu Nhập thành công
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic 
                            title="Giá trị Xuất kho" 
                            value={stats.valOut} 
                            valueStyle={{ color: '#fa8c16' }} 
                            prefix={<ExportOutlined />} 
                            suffix="đ"
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                            Tất cả Phiếu Xuất
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic 
                            title="Cần duyệt / Chờ xử lý" 
                            value={stats.pending} 
                            valueStyle={{ color: '#eb2f96' }} 
                            prefix={<ClockCircleOutlined />} 
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                            Yêu cầu chờ thủ kho xác nhận
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card bodyStyle={{ padding: '0 0 16px 0' }} style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Tabs
                    activeKey={activeTabType}
                    onChange={(k) => {
                        setActiveTabType(k);
                        setActiveStep('ALL'); // Reset step khi đổi tab
                    }}
                    items={tabTypes}
                    style={{ padding: '0 24px', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}
                />

                <div style={{ padding: '20px 24px' }}>
                    <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                        <Col flex="1">
                            <Steps 
                                type="navigation"
                                size="small"
                                current={currentStepIndex !== -1 ? currentStepIndex : 0}
                                onChange={idx => setActiveStep(STATUS_STEPS[idx].key)}
                                style={{
                                    // Custom style to hide the circle/index if icon is null
                                    borderBottom: 'none'
                                }}
                                items={STATUS_STEPS.map((s, index) => {
                                    const count = stepCounts[s.key] || 0;
                                    const isActive = currentStepIndex === index;
                                    return { 
                                        title: (
                                            <Space size="small">
                                                {s.title}
                                                <Badge 
                                                    count={count} 
                                                    showZero 
                                                    style={{ 
                                                        backgroundColor: isActive ? '#1890ff' : '#f0f0f0',
                                                        color: isActive ? '#fff' : '#8c8c8c',
                                                        boxShadow: 'none'
                                                    }} 
                                                />
                                            </Space>
                                        ),
                                        icon: <div style={{ width: 0, overflow: 'hidden' }} /> // Hide indices
                                    };
                                })}
                            />
                        </Col>
                        <Col>
                            <Input
                                placeholder="Tìm mã phiếu, đối tượng..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                                allowClear
                            />
                        </Col>
                    </Row>

                    <Table
                        rowKey="id"
                        dataSource={finalList}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        pagination={{ pageSize: 15 }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default InventoryHistory;
