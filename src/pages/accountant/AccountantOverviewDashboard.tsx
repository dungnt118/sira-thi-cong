import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button, Alert } from 'antd';
import {
    InboxOutlined,
    ToolOutlined,
    BankOutlined,
    ArrowRightOutlined,
    DashboardOutlined,
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

    return (
        <div style={{ padding: 24 }}>
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

                <Card title="Điều hướng nhanh">
                    <Space wrap>
                        <Button type="primary" icon={<InboxOutlined />} onClick={() => navigate('/kt/inventory/materials')}>
                            Danh mục vật tư
                        </Button>
                        <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/kt/inventory/distributors')}>
                            Nhà phân phối
                        </Button>
                        <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/kt/inventory/history')}>
                            Lịch sử xuất/nhập
                        </Button>
                        <Button icon={<ToolOutlined />} onClick={() => navigate('/kt/assets/list')}>
                            Danh mục tài sản
                        </Button>
                        <Button icon={<BankOutlined />} onClick={() => navigate('/kt/expenditures/payment-requests')}>
                            Yêu cầu chi
                        </Button>
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default AccountantOverviewDashboard;
