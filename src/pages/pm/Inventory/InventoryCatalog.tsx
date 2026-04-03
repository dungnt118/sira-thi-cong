// @ts-nocheck
import React from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Table,
    Progress, Statistic, Alert, Space, Divider,
} from 'antd';
import {
    ExclamationCircleOutlined, CheckCircleOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockMaterials, mockProjects, mockStandards } from '../../../data/mockData';
import type { Material } from '../../../types/v3';

const { Title, Text } = Typography;

const InventoryCatalog: React.FC = () => {
    const navigate = useNavigate();

    const totalValue = mockMaterials.reduce((s, m) => s + m.currentStock * m.unitCost, 0);
    const lowStock = mockMaterials.filter(m => m.currentStock <= m.minStockAlert);

    // Compute per-material which active projects need it
    const projectNeeds: Record<string, { projectCode: string; needed: number; enough: boolean }[]> = {};
    mockProjects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'SCHEDULED').forEach(p => {
        const standards = mockStandards.filter(s => s.constructionType === p.type);
        standards.forEach(s => {
            if (!projectNeeds[s.materialId]) projectNeeds[s.materialId] = [];
            const needed = Math.ceil(p.areaM2 * s.usagePerM2);
            const mat = mockMaterials.find(m => m.id === s.materialId);
            projectNeeds[s.materialId].push({
                projectCode: p.code,
                needed,
                enough: (mat?.currentStock ?? 0) >= needed,
            });
        });
    });

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'code',
            width: 80,
            render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text>,
        },
        {
            title: 'Vật tư',
            dataIndex: 'name',
            render: (name: string, r: Material) => (
                <div>
                    <Text strong>{name}</Text>
                    <div style={{ fontSize: 11, color: '#999' }}>{r.category}</div>
                </div>
            ),
        },
        {
            title: 'ĐVT',
            dataIndex: 'unit',
            width: 60,
        },
        {
            title: 'Tồn kho',
            render: (_: unknown, r: Material) => {
                const pct = Math.min(100, Math.round((r.currentStock / (r.minStockAlert * 5)) * 100));
                const isLow = r.currentStock <= r.minStockAlert;
                return (
                    <div style={{ minWidth: 130 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text strong style={{ color: isLow ? '#ff4d4f' : '#333' }}>
                                {r.currentStock} {r.unit}
                            </Text>
                            {isLow && <Tag color="error" style={{ fontSize: 10 }}>⚠️ Thấp</Tag>}
                        </div>
                        <Progress percent={pct} size="small" status={isLow ? 'exception' : 'normal'} showInfo={false} />
                        <Text type="secondary" style={{ fontSize: 10 }}>Ngưỡng cảnh báo: {r.minStockAlert} {r.unit}</Text>
                    </div>
                );
            },
        },
        {
            title: 'Giá trị',
            render: (_: unknown, r: Material) => (
                <Text>{(r.currentStock * r.unitCost).toLocaleString('vi-VN')} đ</Text>
            ),
        },
        {
            title: 'Dự án đang dùng',
            render: (_: unknown, r: Material) => {
                const needs = projectNeeds[r.id] ?? [];
                if (needs.length === 0) return <Text type="secondary" style={{ fontSize: 11 }}>–</Text>;
                return (
                    <Space wrap size={4}>
                        {needs.map(n => (
                            <Tag key={n.projectCode} color={n.enough ? 'default' : 'error'} style={{ fontSize: 10 }}>
                                {n.projectCode}: {n.needed} {r.unit} {!n.enough && '⚠️'}
                            </Tag>
                        ))}
                    </Space>
                );
            },
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>📦 Danh mục Vật tư (PM – Chỉ xem)</Title>
                    <Text type="secondary">Tổng quan kho vật tư phục vụ các dự án đang thi công</Text>
                </div>
                <Space>
                    <Button onClick={() => navigate('/ql/inventory/request-out')}>📤 Yêu cầu Xuất kho</Button>
                    <Button type="primary" onClick={() => navigate('/ql/inventory/request-in')}>📥 Yêu cầu Nhập kho</Button>
                </Space>
            </div>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={6}>
                    <Card size="small" style={{ borderTop: '3px solid #1976D2' }}>
                        <Statistic title="Tổng danh mục" value={mockMaterials.length} suffix="loại" valueStyle={{ color: '#1976D2' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small" style={{ borderTop: '3px solid #ff4d4f' }}>
                        <Statistic title="⚠️ Cần nhập thêm" value={lowStock.length} suffix="loại" valueStyle={{ color: '#ff4d4f' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small" style={{ borderTop: '3px solid #52c41a' }}>
                        <Statistic title="✅ Tồn kho đủ" value={mockMaterials.length - lowStock.length} suffix="loại" valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small" style={{ borderTop: '3px solid #fa8c16' }}>
                        <Statistic
                            title="Giá trị kho ước tính"
                            value={totalValue}
                            formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                            valueStyle={{ color: '#fa8c16', fontSize: 15 }}
                        />
                    </Card>
                </Col>
            </Row>

            {lowStock.length > 0 && (
                <Alert
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    message={
                        <span>
                            <strong>{lowStock.length} vật tư</strong> dưới ngưỡng cảnh báo: {lowStock.map(m => m.name).join(', ')}.
                            {' '}<Button size="small" type="link" icon={<ArrowRightOutlined />}
                                onClick={() => navigate('/ql/inventory/request-in')}>
                                Tạo yêu cầu nhập kho ngay
                            </Button>
                        </span>
                    }
                    style={{ marginBottom: 16 }}
                />
            )}

            <Alert
                type="info"
                showIcon
                icon={<CheckCircleOutlined />}
                message="PM chỉ xem tồn kho. Để xuất/nhập vật tư, vui lòng tạo Yêu cầu để Kế toán xử lý."
                style={{ marginBottom: 16 }}
            />

            <Card title="📋 Bảng Vật tư">
                <Table
                    dataSource={mockMaterials}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    rowClassName={r => r.currentStock <= r.minStockAlert ? 'ant-table-row-selected' : ''}
                />
                <Divider />
                <Row justify="end">
                    <Col>
                        <Text>Tổng giá trị kho: </Text>
                        <Text strong style={{ fontSize: 16, color: '#1976D2' }}>
                            {totalValue.toLocaleString('vi-VN')} VNĐ
                        </Text>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default InventoryCatalog;
