import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button, Alert } from 'antd';
import {
    InboxOutlined,
    ToolOutlined,
    BankOutlined,
    ArrowRightOutlined,
    DashboardOutlined,
    ApartmentOutlined,
    ImportOutlined,
    ExportOutlined,
    HistoryOutlined,
    UsergroupAddOutlined,
    AuditOutlined,
    DollarOutlined,
    PieChartOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../hooks/useLocalStorageData';
import type { Material, MaterialGroup, Asset, AssetGroup } from '../../types/v3';
import type { StockOrder } from '../../types/v3';
import mockMaterialsData from '../../data/mock/materials.json';
import mockAssetsData from '../../data/mock/assets.json';

const { Title, Paragraph, Text } = Typography;

/**
 * Trang tổng quan kế toán: chỉ số tổng hợp và điều hướng nhanh.
 * Khác với Danh mục vật tư (`/kt/inventory/materials`).
 */
const AccountantOverviewDashboard: React.FC = () => {
    const navigate = useNavigate();
    // ...
    // Existing data fetching
    const [groups] = useLocalStorageData<MaterialGroup[]>('MATERIAL_GROUPS', (mockMaterialsData as any).groups);
    const [materials] = useLocalStorageData<Material[]>('MATERIALS', (mockMaterialsData as any).materials);
    const [assetGroups] = useLocalStorageData<AssetGroup[]>('ASSET_GROUPS', (mockAssetsData as any).groups);
    const [assets] = useLocalStorageData<Asset[]>('ASSETS', (mockAssetsData as any).assets);
    const [stockOrders] = useLocalStorageData<StockOrder[]>('STOCK_ORDERS', []);

    const materialStats = useMemo(() => {
        const lowStock = materials.filter(m => m.currentStock <= (m.minStockAlert ?? 0)).length;
        const totalSkus = materials.length;
        return { lowStock, totalSkus, groupCount: groups.length };
    }, [materials, groups]);

    const assetStats = useMemo(() => {
        const inUse = assets.filter(a => a.status === 'IN_USE').length;
        return { total: assets.length, inUse, groupCount: assetGroups.length };
    }, [assets, assetGroups]);

    const openOrders = useMemo(
        () => stockOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length,
        [stockOrders],
    );

    const FlowNode = ({ icon, label, path, color = '#1890ff' }: { icon: React.ReactNode, label: string, path: string, color?: string }) => (
        <Card 
            hoverable 
            size="small" 
            style={{ 
                width: 140, 
                textAlign: 'center', 
                border: `1px solid ${color}20`,
                borderRadius: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
            onClick={() => navigate(path)}
        >
            <div style={{ fontSize: 24, color, marginBottom: 8 }}>{icon}</div>
            <Text strong style={{ fontSize: 12 }}>{label}</Text>
        </Card>
    );

    const FlowArrow = () => (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', color: '#bfbfbf' }}>
            <ArrowRightOutlined />
        </div>
    );

    return (
        <div style={{ padding: '0 0 24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Title level={3}>
                        <DashboardOutlined style={{ marginRight: 8 }} />
                        Tổng quan kế toán
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                        Bảng điều khiển tổng hợp vật tư, tài sản và chứng từ gần đây. Chi tiết danh mục vật tư nằm tại{' '}
                        <Text strong>QL Vật tư → Danh mục vật tư</Text>.
                    </Paragraph>
                </div>

                <Alert
                    type="info"
                    showIcon
                    message="Dữ liệu demo (localStorage)"
                    description="Các số liệu dưới đây lấy từ mock/local cho đến khi nối API StockOrder & backend thống nhất."
                />

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic title="Nhóm vật tư" value={materialStats.groupCount} prefix={<InboxOutlined />} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic title="SKU vật tư" value={materialStats.totalSkus} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="SKU tồn thấp"
                                value={materialStats.lowStock}
                                valueStyle={materialStats.lowStock > 0 ? { color: '#cf1322' } : undefined}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic title="Phiếu kho chưa đóng (mock)" value={openOrders} />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic title="Tài sản" value={assetStats.total} prefix={<ToolOutlined />} />
                            <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                                Đang sử dụng: {assetStats.inUse} · Nhóm: {assetStats.groupCount}
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>

                <Card title={<><AuditOutlined /> Quy trình nghiệp vụ (Flow)</>} bodyStyle={{ padding: '24px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Warehouse Flow */}
                        <div>
                            <Text type="secondary" strong style={{ fontSize: 11, textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
                                <InboxOutlined /> Quản lý Kho & Vật tư
                            </Text>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                <FlowNode icon={<ApartmentOutlined />} label="Nhà phân phối" path="/kt/inventory/distributors" color="#52c41a" />
                                <FlowArrow />
                                <FlowNode icon={<ImportOutlined />} label="Nhập kho" path="/kt/inventory/stock-in" color="#52c41a" />
                                <FlowArrow />
                                <FlowNode icon={<InboxOutlined />} label="DM Vật tư" path="/kt/inventory/materials" color="#52c41a" />
                                <FlowArrow />
                                <FlowNode icon={<ExportOutlined />} label="Xuất kho" path="/kt/inventory/stock-out" color="#52c41a" />
                                <FlowArrow />
                                <FlowNode icon={<HistoryOutlined />} label="Lịch sử" path="/kt/inventory/history" color="#52c41a" />
                            </div>
                        </div>

                        {/* Expenditure Flow */}
                        <div>
                            <Text type="secondary" strong style={{ fontSize: 11, textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
                                <DollarOutlined /> Quản lý Khoản chi & Ngân hàng
                            </Text>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                <FlowNode icon={<BankOutlined />} label="Yêu cầu chi" path="/kt/expenditures/payment-requests" color="#1890ff" />
                                <FlowArrow />
                                <FlowNode icon={<SafetyCertificateOutlined />} label="Xác nhận" path="/kt/finance/milestones" color="#1890ff" />
                                <FlowArrow />
                                <FlowNode icon={<PieChartOutlined />} label="Báo cáo chi" path="/kt/finance/report" color="#1890ff" />
                            </div>
                        </div>

                        {/* Asset Flow */}
                        <div>
                            <Text type="secondary" strong style={{ fontSize: 11, textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
                                <ToolOutlined /> Quản lý Tài sản
                            </Text>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                <FlowNode icon={<ToolOutlined />} label="DM Tài sản" path="/kt/assets/list" color="#faad14" />
                                <FlowArrow />
                                <FlowNode icon={<UsergroupAddOutlined />} label="Cấp phát" path="/kt/assets/allocation" color="#faad14" />
                                <FlowArrow />
                                <FlowNode icon={<HistoryOutlined />} label="Bảo trì" path="/kt/assets/allocation-history" color="#faad14" />
                            </div>
                        </div>
                    </div>
                </Card>
            </Space>
        </div>
    );
};

export default AccountantOverviewDashboard;
