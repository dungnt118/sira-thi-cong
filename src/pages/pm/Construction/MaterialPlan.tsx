import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Typography, InputNumber, Alert,
    Table, Tag, Statistic, Divider, Space, Progress, Modal, Input, Grid, Select
} from 'antd';
import {
    ArrowLeftOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
    PlusOutlined, DeleteOutlined, SendOutlined, BulbOutlined,
    ClockCircleOutlined, SyncOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import {
    mockProjects as defaultProjects,
    mockMaterials as defaultMaterials,
    mockStandards as defaultStandards,
    mockStockRequests as defaultStockRequests
} from '../../../data/mockData';
import type { Material, MaterialStandard, StockRequest, StockRequestItem } from '../../../types/v3';
import type { Project } from '../../../types/legacy-project';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

type RequestRow = StockRequestItem & { key: string };

const STATUS_CFG = {
    PENDING: { label: '⏳ Chờ KT duyệt', color: 'warning' },
    APPROVED: { label: '✅ Đã duyệt', color: 'success' },
    CONVERTED: { label: '🔄 Đã tạo phiếu XK', color: 'processing' },
    REJECTED: { label: '❌ Từ chối', color: 'error' },
} as const;

const MaterialPlan: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const screens = useBreakpoint();
    const isMobile = !screens.sm;

    const [mockProjects] = useLocalStorageData<Project[]>(demoDataService.KEYS.PROJECTS, defaultProjects);
    const [mockMaterials] = useLocalStorageData<Material[]>(demoDataService.KEYS.MATERIALS, defaultMaterials);
    const [mockStandards] = useLocalStorageData<MaterialStandard[]>(demoDataService.KEYS.STANDARDS, defaultStandards);
    const [mockStockRequests, setMockStockRequests] = useLocalStorageData<StockRequest[]>(demoDataService.KEYS.STOCK_REQUESTS, defaultStockRequests);

    const project = mockProjects.find(p => p.id === id);

    const [saved, setSaved] = useState(false);

    // ── Section 1: Material standards ──────────────────────────
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    if (!project) return <div style={{ padding: 24, textAlign: 'center' }}><Alert message="Không tìm thấy dự án" type="error" /></div>;

    const standards = mockStandards.filter(s => s.constructionType === project.type);
    
    // Khởi tạo quantities nếu chưa có
    const getQty = (materialId: string, usagePerM2: number) => {
        if (quantities[materialId] !== undefined) return quantities[materialId];
        return Math.ceil((project.areaM2 || 0) * (usagePerM2 ?? 0));
    };

    const items = standards.map(s => {
        const mat = mockMaterials.find(m => m.id === s.materialId);
        const needed = getQty(s.materialId, s.usagePerM2 || 0);
        const stock = mat?.currentStock ?? 0;
        const enough = stock >= needed;
        const unit = mat ? (mat.name.includes('lít') ? 'lít' : mat.unit) : 'kg';
        
        return {
            materialId: s.materialId,
            materialName: s.materialName || '',
            unit,
            standard: s.usagePerM2 || 0,
            standardQty: Math.ceil((project.areaM2 || 0) * (s.usagePerM2 || 0)),
            qty: needed,
            stock,
            enough,
            shortage: enough ? 0 : needed - stock,
            unitCost: mat?.unitCost ?? 0,
            totalCost: (mat?.unitCost ?? 0) * needed,
        };
    });

    const totalCost = items.reduce((sum, i) => sum + i.totalCost, 0);
    const hasShortage = items.some(i => !i.enough);
    const shortageItems = items.filter(i => !i.enough);

    const handleConfirm = () => {
        Modal.confirm({
            title: '✅ Xác nhận định mức?',
            content: (
                <div style={{ marginTop: 12 }}>
                    <p>Định mức sau khi xác nhận sẽ được gửi cho <strong>Kế toán</strong> để tạo phiếu xuất kho.</p>
                    {hasShortage && (
                        <Alert message="⚠️ Một số vật tư tồn kho không đủ. Kế toán sẽ xử lý bổ sung." type="warning" showIcon style={{ marginTop: 8 }} />
                    )}
                </div>
            ),
            onOk: () => setSaved(true),
            okText: 'Xác nhận',
            cancelText: 'Hủy'
        });
    };

    // ── Section 2: Stock-out request ────────────────────────────
    const [reqRows, setReqRows] = useState<RequestRow[]>([]);
    const [reqReason, setReqReason] = useState('');
    const [reqSubmitting, setReqSubmitting] = useState(false);
    const [reqSubmitted, setReqSubmitted] = useState(false);

    // Lọc lịch sử yêu cầu của dự án này
    const projectRequests = mockStockRequests.filter(r => r.type === 'REQUEST_OUT' && r.projectId === project.id);

    const handleAutoFillRequest = () => {
        if (shortageItems.length === 0) {
            Modal.info({ title: '✅ Đủ vật tư', content: 'Tồn kho hiện tại đủ cho định mức dự án này.' });
            return;
        }
        const rows: RequestRow[] = shortageItems.map(i => ({
            key: i.materialId,
            materialId: i.materialId,
            materialName: i.materialName,
            unit: i.unit as StockRequestItem['unit'],
            requested: i.shortage,
            note: `Thiếu: cần ${i.qty} – tồn ${i.stock}`,
        }));
        setReqRows(rows);
        setReqReason(`Đề nghị xuất VT còn thiếu theo định mức ${project.code} – ${project.name}`);
    };

    const handleAddRow = () => setReqRows(prev => [...prev, {
        key: `row-${Date.now()}`,
        materialId: '', materialName: '', unit: 'kg', requested: 0, note: 'Thêm thủ công'
    }]);

    const handleRemoveRow = (key: string) => setReqRows(prev => prev.filter(r => r.key !== key));

    const handleSubmitRequest = async () => {
        if (reqRows.length === 0 || reqRows.some(r => !r.materialId)) {
            Modal.warning({ title: 'Chưa đủ thông tin', content: 'Vui lòng chọn vật tư cho tất cả các dòng.' });
            return;
        }
        if (!reqReason.trim()) {
            Modal.warning({ title: 'Thiếu lý do', content: 'Vui lòng nhập lý do yêu cầu.' });
            return;
        }
        setReqSubmitting(true);
        await new Promise(r => setTimeout(r, 800));
        setReqSubmitting(false);

        const newReq: StockRequest = {
            id: `YCR-LOCAL-${Date.now()}`,
            code: `YC-OUT-${String(mockStockRequests.length + 1).padStart(3, '0')}-NEW`,
            type: 'REQUEST_OUT',
            requestedBy: 'Nguyễn Văn PM',
            projectId: project.id,
            projectName: project.name || '',
            items: reqRows.map(({ key: _k, ...rest }) => rest),
            reason: reqReason,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
        };
        setMockStockRequests([newReq, ...mockStockRequests]);
        setReqSubmitted(true);

        Modal.success({
            title: '✅ Đã gửi yêu cầu xuất kho!',
            content: (
                <div style={{ marginTop: 12 }}>
                    <p>Yêu cầu đã được gửi đến <strong>Kế toán Phạm Thị A</strong>.</p>
                    <p>Kế toán sẽ kiểm tra tồn kho và tạo Phiếu Xuất chính thức.</p>
                </div>
            ),
            onOk: () => { setReqRows([]); setReqReason(''); setReqSubmitted(false); },
        });
    };

    // ── Columns ─────────────────────────────────────────────────
    const stdColumns = [
        {
            title: 'Vật tư',
            dataIndex: 'materialName',
            key: 'materialName',
            width: isMobile ? 120 : 200,
            render: (name: string) => <Text strong>{name}</Text>,
        },
        {
            title: 'Định mức chuẩn',
            key: 'standard',
            width: isMobile ? 150 : 220,
            render: (_: unknown, r: typeof items[0]) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {(project.areaM2 || 0)}m² × {r.standard} = <strong>{r.standardQty} {r.unit}</strong>
                </Text>
            ),
        },
        {
            title: 'Số lượng đề xuất',
            key: 'qty',
            width: 160,
            render: (_: unknown, r: typeof items[0]) => (
                <InputNumber
                    value={r.qty} 
                    min={0} 
                    addonAfter={r.unit} 
                    style={{ width: '100%' }}
                    onChange={v => setQuantities(prev => ({ ...prev, [r.materialId]: v ?? 0 }))}
                />
            ),
        },
        {
            title: 'Khả dụng trong kho',
            key: 'stock',
            width: 180,
            render: (_: unknown, r: typeof items[0]) => (
                <div>
                    <Text style={{ color: r.enough ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}>{r.stock} {r.unit}</Text>
                    <Tag color={r.enough ? 'success' : 'error'} style={{ marginLeft: 8, fontSize: 10 }}>
                        {r.enough ? '✅ Đủ kho' : `⚠️ Thiếu ${r.shortage}`}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Chi phí dự kiến',
            key: 'totalCost',
            width: 140,
            render: (_: unknown, r: typeof items[0]) => (
                <Text strong style={{ color: '#1890ff' }}>{r.totalCost.toLocaleString('vi-VN')} đ</Text>
            ),
        },
    ];

    const reqRowColumns = [
        {
            title: 'Vật tư yêu cầu',
            key: 'materialName',
            render: (_: unknown, r: RequestRow) => {
                // Nếu dòng được thêm thủ công thì hiển thị Dropdown Select vật tư
                if (r.key.startsWith('row-')) {
                    return (
                        <Select
                            style={{ width: '100%', minWidth: 160 }}
                            placeholder="Chọn vật tư..."
                            value={r.materialId || undefined}
                            onChange={(val) => {
                                const mat = mockMaterials.find(m => m.id === val);
                                if (mat) {
                                    setReqRows(prev => prev.map(i => i.key === r.key ? {
                                        ...i,
                                        materialId: mat.id,
                                        materialName: mat.name,
                                        unit: (mat.name.includes('lít') ? 'lít' : mat.unit) as any,
                                        note: `Kho còn: ${mat.currentStock} ${mat.unit}`
                                    } : i));
                                }
                            }}
                        >
                            {mockMaterials.map(m => (
                                <Select.Option key={m.id} value={m.id}>
                                    {m.name} (Tồn: {m.currentStock})
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }
                return <Text strong>{r.materialName || '—'}</Text>;
            },
        },
        {
            title: 'SL yêu cầu',
            key: 'requested',
            width: 150,
            render: (_: unknown, r: RequestRow) => (
                <InputNumber
                    value={r.requested} 
                    min={0} 
                    addonAfter={r.unit} 
                    style={{ width: '100%' }}
                    disabled={!r.materialId}
                    onChange={v => setReqRows(prev => prev.map(i => i.key === r.key ? { ...i, requested: v ?? 0 } : i))}
                />
            ),
        },
        {
            title: 'Ghi chú / Tình trạng',
            key: 'note',
            render: (_: unknown, r: RequestRow) => (
                <Text type="secondary" style={{ fontSize: 12 }}>{r.note}</Text>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            width: 50,
            render: (_: unknown, r: RequestRow) => (
                <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveRow(r.key)} />
            ),
        },
    ];

    const historyColumns = [
        {
            title: 'Mã YC',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (v: string) => <Text strong>{v}</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (v: keyof typeof STATUS_CFG) => (
                <Tag color={STATUS_CFG[v].color}
                    icon={v === 'PENDING' ? <ClockCircleOutlined /> : v === 'CONVERTED' ? <SyncOutlined spin /> : <CheckCircleOutlined />}>
                    {STATUS_CFG[v].label}
                </Tag>
            ),
        },
        {
            title: 'Vật tư yêu cầu',
            key: 'items',
            render: (_: unknown, r: typeof projectRequests[0]) => (
                <Space wrap size={4}>
                    {r.items.map((i, index) => (
                        <Tag key={`${i.materialId}-${index}`} style={{ fontSize: 11 }}>
                            {i.materialName}: {i.requested} {i.unit}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Mã Phiếu XK',
            key: 'convertedOrderId',
            width: 130,
            render: (_: unknown, r: typeof projectRequests[0]) =>
                r.convertedOrderId
                    ? <Tag color="blue">{r.convertedOrderId}</Tag>
                    : <Text type="secondary" style={{ fontSize: 11 }}>—</Text>,
        },
        {
            title: 'KT phản hồi',
            key: 'reviewNote',
            width: 160,
            render: (_: unknown, r: typeof projectRequests[0]) => (
                <Text style={{ fontSize: 11, color: r.reviewNote ? '#52c41a' : '#555' }}>
                    {r.reviewNote ?? '—'}
                </Text>
            ),
        },
        {
            title: 'Ngày tạo',
            key: 'createdAt',
            width: 100,
            render: (_: unknown, r: typeof projectRequests[0]) => (
                <Text type="secondary" style={{ fontSize: 11 }}>{(r.createdAt || '').split('T')[0]}</Text>
            ),
        },
    ];

    return (
        <div style={{ padding: isMobile ? '8px' : '0' }}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 16, marginBottom: 20 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
                <div style={{ flex: 1 }}>
                    <Title level={4} style={{ margin: 0, fontSize: isMobile ? 18 : 20 }}>📦 Định mức Vật tư Dự án</Title>
                    <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>{project.code} – {project.name}</Text>
                </div>
                <Space style={{ width: isMobile ? '100%' : 'auto', marginTop: isMobile ? 8 : 0 }}>
                    {saved ? (
                        <Tag color="success" style={{ padding: '6px 16px', fontSize: 12, borderRadius: 6, margin: 0 }}>
                            ✅ Đã xác nhận – Kế toán đang xử lý
                        </Tag>
                    ) : (
                        <Button 
                            type="primary" 
                            icon={<CheckCircleOutlined />} 
                            onClick={handleConfirm}
                            style={{ height: 36, borderRadius: 6, width: isMobile ? '100%' : 'auto' }}
                        >
                            Xác nhận định mức
                        </Button>
                    )}
                </Space>
            </div>

            {/* KPI Banner */}
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <Statistic title="Diện tích" value={project.areaM2} suffix="m²" valueStyle={{ color: '#1890ff', fontSize: isMobile ? 18 : 22, fontWeight: 700 }} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <Statistic title="Loại thi công" value={project.type} valueStyle={{ fontSize: isMobile ? 13 : 15, fontWeight: 600 }} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <Statistic
                            title="Chi phí ước tính"
                            value={totalCost}
                            formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                            valueStyle={{ color: '#1890ff', fontSize: isMobile ? 14 : 16, fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderColor: hasShortage ? '#ff4d4f' : '#52c41a', borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        {hasShortage ? (
                            <Statistic title="Tình trạng kho" value="Thiếu vật tư"
                                prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#ff4d4f', fontSize: isMobile ? 13 : 15, fontWeight: 600 }} />
                        ) : (
                            <Statistic title="Tình trạng kho" value="Đủ vật tư"
                                prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a', fontSize: isMobile ? 13 : 15, fontWeight: 600 }} />
                        )}
                    </Card>
                </Col>
            </Row>

            {hasShortage && (
                <Alert
                    message={`Tồn kho đang thiếu ${shortageItems.length} loại vật tư theo định mức. Hãy gửi Đề nghị Xuất kho bên dưới.`}
                    type="warning" 
                    showIcon 
                    style={{ marginBottom: 16, borderRadius: 6 }}
                />
            )}

            {/* Material standards table */}
            <Card 
                title="📋 Bảng định mức vật tư" 
                style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                bodyStyle={{ padding: isMobile ? 8 : 16 }}
            >
                <Alert
                    message="Định mức tự động tính = Diện tích × Hệ số định mức. Bạn có thể tự điền điều chỉnh cột Đề xuất."
                    type="info" 
                    showIcon 
                    style={{ marginBottom: 12, borderRadius: 6 }}
                />
                <Table
                    dataSource={items} 
                    columns={stdColumns} 
                    rowKey="materialId"
                    pagination={false} 
                    size={isMobile ? "small" : "middle"}
                    scroll={{ x: 'max-content' }}
                    rowClassName={r => r.enough ? '' : 'ant-table-row-selected'}
                />
            </Card>

            {/* Stock comparison visual */}
            <Card title="📊 So sánh Định mức vs Tồn kho" style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                {items.map(item => (
                    <div key={item.materialId} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                            <Text strong style={{ fontSize: isMobile ? 12 : 14 }}>{item.materialName}</Text>
                            <Space wrap size={4}>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    Định mức: {item.qty} {item.unit} | Kho: {item.stock} {item.unit}
                                </Text>
                                <Tag color={item.enough ? 'success' : 'error'} style={{ fontSize: 10, margin: 0 }}>
                                    {item.enough ? 'Đủ kho' : `Thiếu ${item.shortage}`}
                                </Tag>
                            </Space>
                        </div>
                        <Progress
                            percent={Math.min(100, Math.round((item.stock / item.qty) * 100))}
                            status={item.enough ? 'success' : 'exception'} 
                            size="small"
                            format={() => `${item.stock}/${item.qty} ${item.unit}`}
                        />
                    </div>
                ))}
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ textAlign: 'right' }}>
                    <Text type="secondary">Tổng chi phí vật tư dự kiến: </Text>
                    <Text strong style={{ fontSize: isMobile ? 16 : 20, color: '#1890ff' }}>
                        {totalCost.toLocaleString('vi-VN')} VNĐ
                    </Text>
                </div>
            </Card>

            {/* SECTION 2 – Yêu cầu Xuất kho */}
            <Divider orientation="left" style={{ fontWeight: 700, color: '#1890ff', borderColor: '#1890ff', margin: '24px 0 16px' }}>
                📤 Yêu cầu Xuất kho bổ sung
            </Divider>

            <Alert
                type="info" 
                showIcon 
                style={{ marginBottom: 16, borderRadius: 6 }}
                message="Quy trình: PM tạo yêu cầu -> Kế toán phê duyệt & xuất kho -> Thợ ký nhận trên ứng dụng."
            />

            <Card
                title="➕ Đề xuất vật tư xuất kho"
                extra={
                    <Space size={isMobile ? 'small' : 'middle'} wrap>
                        <Button
                            type="dashed"
                            icon={<BulbOutlined />}
                            onClick={handleAutoFillRequest}
                            disabled={shortageItems.length === 0}
                            style={{ height: 32, borderRadius: 6 }}
                        >
                            {isMobile ? 'Tự điền' : `💡 Tự điền thiếu (${shortageItems.length})`}
                        </Button>
                        <Button icon={<PlusOutlined />} onClick={handleAddRow} style={{ height: 32, borderRadius: 6 }}>
                            Thêm dòng
                        </Button>
                    </Space>
                }
                style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                bodyStyle={{ padding: isMobile ? 8 : 16 }}
            >
                {reqSubmitted && (
                    <Alert type="success" showIcon message="Yêu cầu gửi đi thành công" style={{ marginBottom: 12, borderRadius: 6 }} />
                )}

                {reqRows.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#8c8c8c' }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Chưa có vật tư yêu cầu. Nhấp <strong>"Tự điền thiếu"</strong> hoặc <strong>"Thêm dòng"</strong>.
                        </Text>
                    </div>
                ) : (
                    <Table
                        dataSource={reqRows} 
                        columns={reqRowColumns}
                        rowKey="key" 
                        pagination={false} 
                        size="small"
                        scroll={{ x: 'max-content' }}
                        style={{ marginBottom: 12 }}
                    />
                )}

                <Divider style={{ margin: '16px 0' }} />
                <Row gutter={[12, 12]} align="bottom">
                    <Col xs={24} md={18}>
                        <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>Lý do yêu cầu xuất kho *</Text>
                        <Input.TextArea
                            rows={isMobile ? 2 : 3} 
                            value={reqReason} 
                            onChange={e => setReqReason(e.target.value)}
                            placeholder="Nhập lý do chi tiết (Ví dụ: Cần xuất cho giai đoạn mài sàn bê tông tuần này...)"
                            style={{ borderRadius: 6 }}
                        />
                    </Col>
                    <Col xs={24} md={6}>
                        <Button
                            type="primary" 
                            icon={<SendOutlined />}
                            loading={reqSubmitting} 
                            onClick={handleSubmitRequest}
                            disabled={reqRows.length === 0}
                            style={{ width: '100%', height: 40, borderRadius: 6 }}
                        >
                            Gửi yêu cầu (Kế toán)
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* History of requests */}
            <Card
                title={
                    <Space wrap>
                        <span>📋 Lịch sử Yêu cầu Xuất kho dự án</span>
                        {projectRequests.filter(r => r.status === 'PENDING').length > 0 && (
                            <Tag color="warning" style={{ margin: 0 }}>
                                {projectRequests.filter(r => r.status === 'PENDING').length} đang chờ xử lý
                            </Tag>
                        )}
                    </Space>
                }
                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                bodyStyle={{ padding: isMobile ? 8 : 16 }}
            >
                {projectRequests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <Text type="secondary" italic>Chưa có yêu cầu xuất kho nào.</Text>
                    </div>
                ) : (
                    <Table
                        dataSource={projectRequests} 
                        columns={historyColumns}
                        rowKey="id" 
                        pagination={{ pageSize: 5, size: 'small' }} 
                        size="small"
                        scroll={{ x: 'max-content' }}
                    />
                )}
            </Card>
        </div>
    );
};

export default MaterialPlan;
