// @ts-nocheck
import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Typography, InputNumber, Alert,
    Table, Tag, Statistic, Divider, Space, Progress, Modal, Input,
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

    const [mockProjects] = useLocalStorageData<Project[]>(demoDataService.KEYS.PROJECTS, defaultProjects);
    const [mockMaterials] = useLocalStorageData<Material[]>(demoDataService.KEYS.MATERIALS, defaultMaterials);
    const [mockStandards] = useLocalStorageData<MaterialStandard[]>(demoDataService.KEYS.STANDARDS, defaultStandards);
    const [mockStockRequests, setMockStockRequests] = useLocalStorageData<StockRequest[]>(demoDataService.KEYS.STOCK_REQUESTS, defaultStockRequests);

    const project = mockProjects.find(p => p.id === id);

    const [saved, setSaved] = useState(false);

    // ── Section 1: Material standards ──────────────────────────
    if (!project) return <div>Không tìm thấy dự án</div>;

    const standards = mockStandards.filter(s => s.constructionType === project.type);
    const [quantities, setQuantities] = useState<Record<string, number>>(
        Object.fromEntries(
            standards.map(s => [s.materialId, Math.ceil(project.areaM2 * s.usagePerM2)])
        )
    );

    const items = standards.map(s => {
        const mat = mockMaterials.find(m => m.id === s.materialId);
        const needed = quantities[s.materialId] ?? Math.ceil(project.areaM2 * s.usagePerM2);
        const stock = mat?.currentStock ?? 0;
        const enough = stock >= needed;
        return {
            materialId: s.materialId,
            materialName: s.materialName,
            unit: mat ? (mat.name.includes('lít') ? 'lít' : mat.unit) : 'kg',
            standard: s.usagePerM2,
            standardQty: Math.ceil(project.areaM2 * s.usagePerM2),
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
                <div>
                    <p>Định mức sau khi xác nhận sẽ được gửi cho <strong>Kế toán</strong> để tạo phiếu xuất kho.</p>
                    {hasShortage && (
                        <Alert message="⚠️ Một số vật tư tồn kho không đủ. Kế toán sẽ xử lý bổ sung." type="warning" showIcon />
                    )}
                </div>
            ),
            onOk: () => setSaved(true),
            okText: 'Xác nhận',
        });
    };

    // ── Section 2: Stock-out request ────────────────────────────
    const [reqRows, setReqRows] = useState<RequestRow[]>([]);
    const [reqReason, setReqReason] = useState('');
    const [reqSubmitting, setReqSubmitting] = useState(false);
    const [reqSubmitted, setReqSubmitted] = useState(false);

    // Combine mock data + locally submitted requests for this project
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
        materialId: '', materialName: '', unit: 'kg', requested: 0,
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

        // Build a new local request record and prepend to history immediately
        const newReq: StockRequest = {
            id: `YCR-LOCAL-${Date.now()}`,
            code: `YC-OUT-${String(mockStockRequests.length + 1).padStart(3, '0')}-NEW`,
            type: 'REQUEST_OUT',
            requestedBy: 'Nguyễn Văn PM',
            projectId: project.id,
            projectName: project.name,
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
                <div>
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
            render: (name: string) => <Text strong>{name}</Text>,
        },
        {
            title: 'Định mức',
            render: (_: unknown, r: typeof items[0]) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {project.areaM2}m² × {r.standard} = <strong>{r.standardQty} {r.unit}</strong>
                </Text>
            ),
        },
        {
            title: 'Số lượng (có thể điều chỉnh)',
            render: (_: unknown, r: typeof items[0]) => (
                <InputNumber
                    value={r.qty} min={0} addonAfter={r.unit} style={{ width: 150 }}
                    onChange={v => setQuantities(prev => ({ ...prev, [r.materialId]: v ?? 0 }))}
                />
            ),
        },
        {
            title: 'Tồn kho',
            render: (_: unknown, r: typeof items[0]) => (
                <div>
                    <Text style={{ color: r.enough ? '#52c41a' : '#ff4d4f' }}>{r.stock} {r.unit}</Text>
                    <Tag color={r.enough ? 'success' : 'error'} style={{ marginLeft: 8, fontSize: 10 }}>
                        {r.enough ? '✅ Đủ kho' : `⚠️ Thiếu ${r.shortage} ${r.unit}`}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Chi phí ước tính',
            render: (_: unknown, r: typeof items[0]) => (
                <Text strong style={{ color: '#1976D2' }}>{r.totalCost.toLocaleString('vi-VN')} đ</Text>
            ),
        },
    ];

    const reqRowColumns = [
        {
            title: 'Vật tư',
            render: (_: unknown, r: RequestRow) => (
                <Text strong>{r.materialName || '—'}</Text>
            ),
        },
        {
            title: 'SL yêu cầu',
            width: 160,
            render: (_: unknown, r: RequestRow) => (
                <InputNumber
                    value={r.requested} min={0} addonAfter={r.unit} style={{ width: '100%' }}
                    onChange={v => setReqRows(prev => prev.map(i => i.key === r.key ? { ...i, requested: v ?? 0 } : i))}
                />
            ),
        },
        {
            title: 'Ghi chú',
            render: (_: unknown, r: RequestRow) => (
                <Text type="secondary" style={{ fontSize: 12 }}>{r.note}</Text>
            ),
        },
        {
            title: '',
            width: 40,
            render: (_: unknown, r: RequestRow) => (
                <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveRow(r.key)} />
            ),
        },
    ];

    const historyColumns = [
        {
            title: 'Mã YC',
            dataIndex: 'code',
            render: (v: string) => <Text strong>{v}</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v: keyof typeof STATUS_CFG) => (
                <Tag color={STATUS_CFG[v].color as string}
                    icon={v === 'PENDING' ? <ClockCircleOutlined /> : v === 'CONVERTED' ? <SyncOutlined spin /> : <CheckCircleOutlined />}>
                    {STATUS_CFG[v].label}
                </Tag>
            ),
        },
        {
            title: 'Vật tư yêu cầu',
            render: (_: unknown, r: typeof projectRequests[0]) => (
                <Space wrap size={4}>
                    {r.items.map(i => (
                        <Tag key={i.materialId} style={{ fontSize: 11 }}>
                            {i.materialName}: {i.requested} {i.unit}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Phiếu XK',
            render: (_: unknown, r: typeof projectRequests[0]) =>
                r.convertedOrderId
                    ? <Tag color="blue">{r.convertedOrderId}</Tag>
                    : <Text type="secondary" style={{ fontSize: 11 }}>—</Text>,
        },
        {
            title: 'Kế toán phản hồi',
            render: (_: unknown, r: typeof projectRequests[0]) => (
                <Text style={{ fontSize: 11, color: r.reviewNote ? '#52c41a' : '#999' }}>
                    {r.reviewNote ?? '—'}
                </Text>
            ),
        },
        {
            title: 'Ngày tạo',
            render: (_: unknown, r: typeof projectRequests[0]) => (
                <Text type="secondary" style={{ fontSize: 11 }}>{r.createdAt.split('T')[0]}</Text>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/pm/construction/projects/${project.id}`)}>
                    Chi tiết dự án
                </Button>
                <div style={{ flex: 1 }}>
                    <Title level={4} style={{ margin: 0 }}>📦 Định mức Vật tư Dự án</Title>
                    <Text type="secondary">{project.code} – {project.name}</Text>
                </div>
                <Space>
                    {saved
                        ? <Tag color="success" style={{ padding: '4px 12px' }}>✅ Đã xác nhận – Kế toán đang xử lý</Tag>
                        : <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleConfirm}>
                            ✅ Xác nhận định mức
                        </Button>
                    }
                </Space>
            </div>

            {/* KPI Banner */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Diện tích" value={project.areaM2} suffix="m²" valueStyle={{ color: '#1976D2' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Loại thi công" value={project.type} valueStyle={{ fontSize: 14 }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Chi phí VT ước tính"
                            value={totalCost}
                            formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                            valueStyle={{ color: '#1976D2', fontSize: 16 }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ borderColor: hasShortage ? '#ff4d4f' : '#52c41a' }}>
                        {hasShortage ? (
                            <Statistic title="Tình trạng kho" value="Thiếu vật tư"
                                prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#ff4d4f', fontSize: 14 }} />
                        ) : (
                            <Statistic title="Tình trạng kho" value="Đủ vật tư"
                                prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a', fontSize: 14 }} />
                        )}
                        {projectRequests.some(r => r.status === 'PENDING') && (
                            <Tag color="warning" style={{ fontSize: 10, marginTop: 4 }}>
                                <ClockCircleOutlined /> {projectRequests.filter(r => r.status === 'PENDING').length} YC đang chờ KT
                            </Tag>
                        )}
                    </Card>
                </Col>
            </Row>

            {hasShortage && (
                <Alert
                    message={`⚠️ ${shortageItems.length} vật tư tồn kho không đủ cho định mức dự án. Hãy tạo Yêu cầu Xuất kho bên dưới.`}
                    type="warning" showIcon style={{ marginBottom: 16 }}
                />
            )}

            {/* Material standards table */}
            <Card title="📋 Bảng định mức vật tư" style={{ marginBottom: 16 }}>
                <Alert
                    message="💡 Định mức tự động tính từ diện tích × hệ số chuẩn. Bạn có thể điều chỉnh số lượng thủ công nếu cần."
                    type="info" showIcon style={{ marginBottom: 12 }}
                />
                <Table
                    dataSource={items} columns={stdColumns} rowKey="materialId"
                    pagination={false} size="middle"
                    rowClassName={r => r.enough ? '' : 'ant-table-row-selected'}
                />
            </Card>

            {/* Stock comparison visual */}
            <Card title="📊 So sánh Định mức vs Tồn kho" style={{ marginBottom: 16 }}>
                {items.map(item => (
                    <div key={item.materialId} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text strong>{item.materialName}</Text>
                            <Space>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Cần: {item.qty} {item.unit} | Kho: {item.stock} {item.unit}
                                </Text>
                                <Tag color={item.enough ? 'success' : 'error'} style={{ fontSize: 10 }}>
                                    {item.enough ? '✅ OK' : '⚠️ Thiếu'}
                                </Tag>
                            </Space>
                        </div>
                        <Progress
                            percent={Math.min(100, Math.round((item.stock / item.qty) * 100))}
                            status={item.enough ? 'success' : 'exception'} size="small"
                            format={pct => `${pct}%`}
                        />
                    </div>
                ))}
                <Divider />
                <Row justify="end">
                    <Col>
                        <Text>Tổng chi phí vật tư dự kiến: </Text>
                        <Text strong style={{ fontSize: 18, color: '#1976D2' }}>
                            {totalCost.toLocaleString('vi-VN')} VNĐ
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* ════════════════════════════════════════════════════════
                SECTION 2 – Yêu cầu Xuất kho cho dự án này
            ════════════════════════════════════════════════════════ */}
            <Divider orientation="left" style={{ fontWeight: 700, color: '#1976D2', borderColor: '#1976D2' }}>
                📤 Yêu cầu Xuất kho
            </Divider>

            <Alert
                type="info" showIcon style={{ marginBottom: 16 }}
                message="PM tạo yêu cầu tại đây → Kế toán nhận, xét duyệt và tạo Phiếu Xuất chính thức → Thợ ký nhận → Tồn kho trừ."
            />

            <Card
                title="➕ Tạo Yêu cầu Xuất kho mới"
                extra={
                    <Space>
                        <Button
                            icon={<BulbOutlined />}
                            onClick={handleAutoFillRequest}
                            disabled={shortageItems.length === 0}
                            title={shortageItems.length === 0 ? 'Tồn kho đủ, không cần yêu cầu' : ''}
                        >
                            💡 Tự động điền VT còn thiếu ({shortageItems.length} loại)
                        </Button>
                        <Button icon={<PlusOutlined />} onClick={handleAddRow}>Thêm thủ công</Button>
                    </Space>
                }
                style={{ marginBottom: 16 }}
            >
                {reqSubmitted && (
                    <Alert type="success" showIcon message="✅ Yêu cầu đã gửi thành công!" style={{ marginBottom: 12 }} />
                )}

                {reqRows.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
                        <Text type="secondary">
                            Nhấn <strong>"💡 Tự động điền"</strong> để điền các VT đang thiếu, hoặc{' '}
                            <strong>"Thêm thủ công"</strong> để tự chọn.
                        </Text>
                    </div>
                ) : (
                    <Table
                        dataSource={reqRows} columns={reqRowColumns}
                        rowKey="key" pagination={false} size="small"
                        style={{ marginBottom: 12 }}
                    />
                )}

                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={12} align="bottom">
                    <Col flex="auto">
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>Lý do yêu cầu *</Text>
                        <Input.TextArea
                            rows={2} value={reqReason} onChange={e => setReqReason(e.target.value)}
                            placeholder="VD: Cần xuất vật tư cho bước 7 tuần này, hiện kho thiếu Primer..."
                        />
                    </Col>
                    <Col>
                        <Button
                            type="primary" size="large" icon={<SendOutlined />}
                            loading={reqSubmitting} onClick={handleSubmitRequest}
                            disabled={reqRows.length === 0}
                        >
                            📤 Gửi đến Kế toán
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* History of requests for this project */}
            <Card
                title={
                    <Space>
                        <span>📋 Lịch sử Yêu cầu Xuất kho của dự án</span>
                        {projectRequests.filter(r => r.status === 'PENDING').length > 0 && (
                            <Tag color="warning">
                                {projectRequests.filter(r => r.status === 'PENDING').length} đang chờ KT duyệt
                            </Tag>
                        )}
                    </Space>
                }
            >
                {projectRequests.length === 0 ? (
                    <Text type="secondary">Chưa có yêu cầu xuất kho nào cho dự án này.</Text>
                ) : (
                    <Table
                        dataSource={projectRequests} columns={historyColumns}
                        rowKey="id" pagination={false} size="small"
                    />
                )}
            </Card>
        </div>
    );
};

export default MaterialPlan;
