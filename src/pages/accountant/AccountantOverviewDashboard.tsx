import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button, Alert, Spin } from 'antd';
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
    ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { materialService } from '../../services/core-contracts/services/material.service';
import { materialGroupService } from '../../services/core-contracts/services/materialGroup.service';
import { assetService } from '../../services/core-contracts/services/asset.service';
import { assetGroupService } from '../../services/core-contracts/services/assetGroup.service';
import { stockOrderService } from '../../services/core-contracts/services/stockOrder.service';
import type { StockOrderStatusEnum } from '../../services/core-contracts/types/stockOrder.types';

const { Title, Paragraph, Text } = Typography;

const STOCK_ORDER_CLOSED: StockOrderStatusEnum[] = ['completed', 'cancelled'];

const DASHBOARD_QUERY_LIMIT = 10000;

/**
 * Trang tổng quan kế toán: chỉ số từ API (core-contracts / schema BAC).
 * Khác với Danh mục vật tư (`/kt/inventory/materials`).
 */
const AccountantOverviewDashboard: React.FC = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [materialStats, setMaterialStats] = useState({ groupCount: 0, totalSkus: 0, lowStock: 0 });
    const [assetStats, setAssetStats] = useState({ total: 0, inUse: 0, groupCount: 0 });
    const [openOrders, setOpenOrders] = useState(0);

    const loadOverview = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const filter = { limit: DASHBOARD_QUERY_LIMIT };
            const [mgRes, matRes, agRes, astRes, soRes] = await Promise.all([
                materialGroupService.queryMaterialGroupsDto(filter),
                materialService.queryMaterialsDto(filter),
                assetGroupService.queryAssetGroupsDto(filter),
                assetService.queryAssetsDto(filter),
                stockOrderService.queryStockOrdersDto(filter),
            ]);

            const groups = mgRes.data ?? [];
            const materials = matRes.data ?? [];
            const assetGroups = agRes.data ?? [];
            const assets = astRes.data ?? [];
            const orders = soRes.data ?? [];

            const lowStock = materials.filter(
                (m) => (m.current_stock ?? 0) <= (m.min_stock_alert ?? 0),
            ).length;
            const inUse = assets.filter((a) => a.status === 'in_use').length;
            const open = orders.filter(
                (o) => o.status && !STOCK_ORDER_CLOSED.includes(o.status as StockOrderStatusEnum),
            ).length;

            setMaterialStats({
                groupCount: groups.length,
                totalSkus: materials.length,
                lowStock,
            });
            setAssetStats({
                total: assets.length,
                inUse,
                groupCount: assetGroups.length,
            });
            setOpenOrders(open);
        } catch {
            setError('Không tải được dữ liệu tổng quan. Kiểm tra kết nối hoặc quyền truy cập.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOverview();
    }, [loadOverview]);

    const FlowNode = ({
        icon,
        label,
        path,
        color = '#1890ff',
    }: {
        icon: React.ReactNode;
        label: string;
        path: string;
        color?: string;
    }) => (
        <Card
            hoverable
            size="small"
            style={{
                width: 140,
                textAlign: 'center',
                border: `1px solid ${color}20`,
                borderRadius: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
            onClick={() => navigate(path)}
        >
            <div style={{ fontSize: 24, color, marginBottom: 8 }}>{icon}</div>
            <Text strong style={{ fontSize: 12 }}>
                {label}
            </Text>
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
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                        <Title level={3} style={{ marginBottom: 8 }}>
                            <DashboardOutlined style={{ marginRight: 8 }} />
                            Tổng quan kế toán
                        </Title>
                        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                            Bảng điều khiển tổng hợp vật tư, tài sản và phiếu kho từ hệ thống. Chi tiết danh mục vật tư tại{' '}
                            <Text strong>QL Vật tư → Danh mục vật tư</Text>.
                        </Paragraph>
                    </div>
                    <Button icon={<ReloadOutlined />} onClick={loadOverview} loading={loading}>
                        Làm mới
                    </Button>
                </div>

                {error ? (
                    <Alert type="error" showIcon message={error} action={<Button onClick={loadOverview}>Thử lại</Button>} />
                ) : null}

                <Spin spinning={loading}>
                    <>
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
                                <Statistic title="Phiếu kho chưa đóng" value={openOrders} />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: 0 }}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card>
                                <Statistic title="Tài sản" value={assetStats.total} prefix={<ToolOutlined />} />
                                <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                                    Đang sử dụng: {assetStats.inUse} · Nhóm: {assetStats.groupCount}
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                    </>
                </Spin>

                <Card title={<><AuditOutlined /> Quy trình nghiệp vụ (Flow)</>} bodyStyle={{ padding: '24px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
