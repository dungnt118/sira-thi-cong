import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Typography, Select, InputNumber,
    Table, Tag, Alert, Space, Modal, Input, Divider, Tabs,
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, BulbOutlined, SendOutlined,
    CheckCircleOutlined, ClockCircleOutlined, SyncOutlined,
} from '@ant-design/icons';
import { mockMaterials, mockProjects, mockStandards, mockStockRequests } from '../../../data/mockData';
import type { StockRequestItem } from '../../../types/v3';

const { Title, Text } = Typography;

type RequestItem = StockRequestItem & { key: string };

const STATUS_MAP = {
    PENDING: { label: '⏳ Chờ duyệt', color: 'warning' },
    APPROVED: { label: '✅ Đã duyệt', color: 'success' },
    CONVERTED: { label: '🔄 Đã tạo phiếu', color: 'processing' },
    REJECTED: { label: '❌ Từ chối', color: 'error' },
} as const;

const StockRequestOut: React.FC = () => {
    const [mode, setMode] = useState<'manual' | 'auto'>('manual');
    const [selectedProject, setSelectedProject] = useState<string | undefined>();
    const [items, setItems] = useState<RequestItem[]>([]);
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const activeProjects = mockProjects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'SCHEDULED');
    const existingRequests = mockStockRequests.filter(r => r.type === 'REQUEST_OUT');

    const handleAutoFill = () => {
        if (!selectedProject) return;
        const project = mockProjects.find(p => p.id === selectedProject);
        if (!project) return;

        const standards = mockStandards.filter(s => s.constructionType === project.type);
        const autoItems: RequestItem[] = standards
            .map(s => {
                const mat = mockMaterials.find(m => m.id === s.materialId);
                const needed = Math.ceil(project.areaM2 * s.usagePerM2);
                const stock = mat?.currentStock ?? 0;
                const shortage = needed - stock;
                return shortage > 0 ? {
                    key: s.materialId,
                    materialId: s.materialId,
                    materialName: s.materialName,
                    unit: (mat?.unit ?? 'kg') as StockRequestItem['unit'],
                    requested: shortage,
                    note: `Thiếu: định mức ${needed} – tồn ${stock}`,
                } : null;
            })
            .filter(Boolean) as RequestItem[];

        if (autoItems.length === 0) {
            Modal.info({ title: '✅ Đủ vật tư', content: 'Tồn kho đã đủ cho dự án này, không cần xuất thêm.' });
            return;
        }
        setItems(autoItems);
        setReason(`Xuất vật tư còn thiếu cho ${project.code} – ${project.name}`);
    };

    const handleAddRow = () => {
        setItems(prev => [...prev, {
            key: `row-${Date.now()}`,
            materialId: '',
            materialName: '',
            unit: 'kg',
            requested: 0,
        }]);
    };

    const handleRemoveRow = (key: string) => setItems(prev => prev.filter(i => i.key !== key));

    const handleChangeMaterial = (key: string, matId: string) => {
        const mat = mockMaterials.find(m => m.id === matId);
        setItems(prev => prev.map(i => i.key === key
            ? { ...i, materialId: matId, materialName: mat?.name ?? '', unit: (mat?.unit ?? 'kg') as StockRequestItem['unit'] }
            : i
        ));
    };

    const handleChangeQty = (key: string, qty: number) =>
        setItems(prev => prev.map(i => i.key === key ? { ...i, requested: qty } : i));

    const handleSubmit = async () => {
        if (items.length === 0) { Modal.warning({ title: 'Chưa có vật tư', content: 'Vui lòng thêm ít nhất 1 loại vật tư.' }); return; }
        if (!reason.trim()) { Modal.warning({ title: 'Thiếu lý do', content: 'Vui lòng nhập lý do yêu cầu.' }); return; }
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 800));
        setSubmitting(false);
        Modal.success({
            title: '✅ Yêu cầu đã gửi!',
            content: (
                <div>
                    <p>Yêu cầu xuất kho đã được gửi đến <strong>Kế toán</strong>.</p>
                    <p>Kế toán sẽ xem xét và tạo phiếu xuất chính thức.</p>
                </div>
            ),
            onOk: () => { setItems([]); setReason(''); setSelectedProject(undefined); },
        });
    };

    const itemColumns = [
        {
            title: 'Vật tư',
            render: (_: unknown, r: RequestItem) => (
                <Select
                    value={r.materialId || undefined}
                    placeholder="Chọn vật tư"
                    style={{ width: '100%' }}
                    options={mockMaterials.map(m => ({
                        value: m.id,
                        label: `${m.name} (tồn: ${m.currentStock} ${m.unit})`,
                    }))}
                    onChange={v => handleChangeMaterial(r.key, v)}
                />
            ),
        },
        {
            title: 'SL cần xuất',
            width: 160,
            render: (_: unknown, r: RequestItem) => (
                <InputNumber
                    value={r.requested}
                    min={0}
                    addonAfter={r.unit}
                    style={{ width: '100%' }}
                    onChange={v => handleChangeQty(r.key, v ?? 0)}
                />
            ),
        },
        {
            title: 'Ghi chú',
            render: (_: unknown, r: RequestItem) => (
                <Text type="secondary" style={{ fontSize: 12 }}>{r.note}</Text>
            ),
        },
        {
            title: '',
            width: 40,
            render: (_: unknown, r: RequestItem) => (
                <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveRow(r.key)} />
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <Title level={4} style={{ margin: 0 }}>📤 Yêu cầu Xuất kho</Title>
                <Text type="secondary">PM tạo yêu cầu → Kế toán duyệt và tạo Phiếu Xuất chính thức</Text>
            </div>

            <Alert
                type="info" showIcon
                message="📌 Yêu cầu này KHÔNG tự động xuất kho. Kế toán sẽ kiểm tra và tạo Phiếu Xuất sau khi duyệt."
                style={{ marginBottom: 16 }}
            />

            <Tabs
                activeKey={mode}
                onChange={k => { setMode(k as 'manual' | 'auto'); setItems([]); }}
                items={[
                    {
                        key: 'auto',
                        label: <><BulbOutlined /> Auto – Theo dự án</>,
                        children: (
                            <Card style={{ marginBottom: 16 }}>
                                <Alert type="success" showIcon
                                    message="Chọn dự án → Hệ thống tự tính VT còn thiếu (định mức − tồn kho) và điền vào bảng."
                                    style={{ marginBottom: 12 }}
                                />
                                <Space wrap>
                                    <Select
                                        placeholder="Chọn dự án cần xuất vật tư"
                                        style={{ width: 360 }}
                                        value={selectedProject}
                                        onChange={setSelectedProject}
                                        options={activeProjects.map(p => ({
                                            value: p.id,
                                            label: `${p.code} – ${p.name} (${p.areaM2}m²)`,
                                        }))}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<BulbOutlined />}
                                        disabled={!selectedProject}
                                        onClick={handleAutoFill}
                                    >
                                        💡 Gợi ý tự động
                                    </Button>
                                </Space>
                            </Card>
                        ),
                    },
                    {
                        key: 'manual',
                        label: <><PlusOutlined /> Manual</>,
                        children: (
                            <Card style={{ marginBottom: 16 }}>
                                <Alert type="info" showIcon
                                    message="Thêm từng loại vật tư và số lượng cần xuất thủ công."
                                    style={{ marginBottom: 12 }}
                                />
                            </Card>
                        ),
                    },
                ]}
            />

            <Card
                title="📋 Danh sách vật tư yêu cầu xuất"
                extra={<Button icon={<PlusOutlined />} onClick={handleAddRow}>Thêm dòng</Button>}
                style={{ marginBottom: 16 }}
            >
                {items.length === 0
                    ? <Text type="secondary">Chưa có vật tư. {mode === 'auto' ? 'Chọn dự án và nhấn Gợi ý tự động.' : 'Nhấn "+ Thêm dòng".'}</Text>
                    : <Table dataSource={items} columns={itemColumns} rowKey="key" pagination={false} size="small" />
                }
            </Card>

            <Card title="📝 Lý do yêu cầu" style={{ marginBottom: 16 }}>
                <Input.TextArea
                    rows={2}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="VD: Chuẩn bị thi công DA-001 từ ngày 10/03, cần xuất vật tư trước 2 ngày..."
                />
            </Card>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 32 }}>
                <Button size="large">Hủy</Button>
                <Button size="large" type="primary" icon={<SendOutlined />} loading={submitting} onClick={handleSubmit}>
                    📤 Gửi yêu cầu đến Kế toán
                </Button>
            </div>

            {/* History */}
            <Divider>📋 Lịch sử Yêu cầu Xuất kho</Divider>
            {existingRequests.map(r => (
                <Card key={r.id} size="small" style={{ marginBottom: 8 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space>
                                <Text strong>{r.code}</Text>
                                <Tag color={STATUS_MAP[r.status].color as string}
                                    icon={r.status === 'PENDING' ? <ClockCircleOutlined /> : r.status === 'CONVERTED' ? <SyncOutlined spin /> : <CheckCircleOutlined />}>
                                    {STATUS_MAP[r.status].label}
                                </Tag>
                            </Space>
                            <div style={{ fontSize: 12, color: '#555' }}>{r.projectName}</div>
                            <div style={{ fontSize: 11, color: '#999' }}>{r.reason}</div>
                            {r.convertedOrderId && (
                                <Tag color="blue" style={{ fontSize: 10 }}>Phiếu: {r.convertedOrderId}</Tag>
                            )}
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>{r.createdAt.split('T')[0]}</Text>
                            {r.reviewedBy && (
                                <div style={{ fontSize: 11, color: '#999' }}>KT: {r.reviewedBy}</div>
                            )}
                        </Col>
                    </Row>
                </Card>
            ))}
        </div>
    );
};

export default StockRequestOut;
