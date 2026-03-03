import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Typography, InputNumber, Select,
    Table, Tag, Alert, Space, Modal, Input, Divider, Tabs,
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, BulbOutlined, SendOutlined,
    CheckCircleOutlined, ClockCircleOutlined,
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

const StockRequestIn: React.FC = () => {
    const [mode, setMode] = useState<'manual' | 'auto'>('manual');
    const [items, setItems] = useState<RequestItem[]>([]);
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const existingRequests = mockStockRequests.filter(r => r.type === 'REQUEST_IN');

    // Auto-suggest: aggregate shortage across all active projects
    const handleAutoSuggest = () => {
        const activeProjects = mockProjects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'SCHEDULED');
        const shortageMap: Record<string, { materialId: string; materialName: string; unit: string; totalNeeded: number; stock: number }> = {};

        activeProjects.forEach(p => {
            const standards = mockStandards.filter(s => s.constructionType === p.type);
            standards.forEach(s => {
                const mat = mockMaterials.find(m => m.id === s.materialId);
                const needed = Math.ceil(p.areaM2 * s.usagePerM2);
                if (!shortageMap[s.materialId]) {
                    shortageMap[s.materialId] = {
                        materialId: s.materialId, materialName: s.materialName,
                        unit: mat?.unit ?? 'kg', totalNeeded: 0, stock: mat?.currentStock ?? 0,
                    };
                }
                shortageMap[s.materialId].totalNeeded += needed;
            });
        });

        const autoItems: RequestItem[] = Object.values(shortageMap)
            .filter(s => s.totalNeeded > s.stock)
            .map(s => ({
                key: s.materialId,
                materialId: s.materialId,
                materialName: s.materialName,
                unit: s.unit as StockRequestItem['unit'],
                requested: s.totalNeeded - s.stock,
                note: `Tổng cần ${s.totalNeeded} – tồn ${s.stock} = còn thiếu ${s.totalNeeded - s.stock}`,
            }));

        if (autoItems.length === 0) {
            Modal.info({ title: '✅ Tồn kho đủ', content: 'Không có vật tư nào thiếu cho các dự án hiện tại.' });
            return;
        }
        setItems(autoItems);
        setReason(`Nhập bổ sung VT thiếu cho ${activeProjects.length} dự án đang thi công`);
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
                    <p>Yêu cầu nhập kho đã gửi đến <strong>Kế toán</strong>.</p>
                    <p>Kế toán sẽ liên hệ nhà cung cấp và tạo Phiếu Nhập khi hàng về.</p>
                </div>
            ),
            onOk: () => { setItems([]); setReason(''); },
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
            title: 'SL cần nhập',
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
                <Title level={4} style={{ margin: 0 }}>📥 Yêu cầu Nhập kho</Title>
                <Text type="secondary">PM tạo yêu cầu → Kế toán đặt hàng NCC và tạo Phiếu Nhập khi hàng về</Text>
            </div>

            <Alert
                type="info" showIcon
                message="📌 Yêu cầu này KHÔNG tự động nhập kho. Kế toán sẽ liên hệ nhà cung cấp và tạo Phiếu Nhập chính thức."
                style={{ marginBottom: 16 }}
            />

            <Tabs
                activeKey={mode}
                onChange={k => { setMode(k as 'manual' | 'auto'); setItems([]); }}
                items={[
                    {
                        key: 'auto',
                        label: <><BulbOutlined /> Auto – Gợi ý từ tình trạng kho</>,
                        children: (
                            <Card style={{ marginBottom: 16 }}>
                                <Alert type="success" showIcon
                                    message="Hệ thống tính tổng VT thiếu qua tất cả dự án đang hoạt động → gợi ý số lượng cần nhập."
                                    style={{ marginBottom: 12 }}
                                />
                                <Button
                                    type="primary"
                                    icon={<BulbOutlined />}
                                    onClick={handleAutoSuggest}
                                    size="large"
                                >
                                    💡 Gợi ý tự động từ tình trạng thiếu kho
                                </Button>
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Tính toán dựa trên: định mức × diện tích − tồn kho hiện tại, tổng hợp qua tất cả dự án active.
                                    </Text>
                                </div>
                            </Card>
                        ),
                    },
                    {
                        key: 'manual',
                        label: <><PlusOutlined /> Manual</>,
                        children: (
                            <Card style={{ marginBottom: 16 }}>
                                <Alert type="info" showIcon
                                    message="Nhập thủ công từng loại vật tư và số lượng cần nhập kho."
                                    style={{ marginBottom: 12 }}
                                />
                            </Card>
                        ),
                    },
                ]}
            />

            <Card
                title="📋 Danh sách vật tư yêu cầu nhập"
                extra={<Button icon={<PlusOutlined />} onClick={handleAddRow}>Thêm dòng</Button>}
                style={{ marginBottom: 16 }}
            >
                {items.length === 0
                    ? <Text type="secondary">{mode === 'auto' ? 'Nhấn nút Gợi ý tự động ở trên.' : 'Nhấn "+ Thêm dòng".'}</Text>
                    : <Table dataSource={items} columns={itemColumns} rowKey="key" pagination={false} size="small" />
                }
            </Card>

            <Card title="📝 Lý do yêu cầu nhập" style={{ marginBottom: 16 }}>
                <Input.TextArea
                    rows={2}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="VD: Tồn kho SIRA PU sắp hết, cần nhập cho 3 dự án triển khai tháng 3..."
                />
            </Card>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 32 }}>
                <Button size="large">Hủy</Button>
                <Button size="large" type="primary" icon={<SendOutlined />} loading={submitting} onClick={handleSubmit}>
                    📥 Gửi yêu cầu đến Kế toán
                </Button>
            </div>

            {/* History */}
            <Divider>📋 Lịch sử Yêu cầu Nhập kho</Divider>
            {existingRequests.map(r => (
                <Card key={r.id} size="small" style={{ marginBottom: 8 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space>
                                <Text strong>{r.code}</Text>
                                <Tag color={STATUS_MAP[r.status].color as string}
                                    icon={r.status === 'PENDING' ? <ClockCircleOutlined /> : <CheckCircleOutlined />}>
                                    {STATUS_MAP[r.status].label}
                                </Tag>
                            </Space>
                            <div style={{ fontSize: 12, color: '#555' }}>{r.reason}</div>
                            {r.reviewNote && (
                                <div style={{ fontSize: 11, color: '#52c41a' }}>💬 KT: {r.reviewNote}</div>
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

export default StockRequestIn;
