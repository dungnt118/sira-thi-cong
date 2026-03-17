import React, { useState } from 'react';
import {
    Card, Form, Input, InputNumber, Button, Table, Select, Space, Divider,
    Row, Col, Typography, Tag, Alert, Modal, Steps, message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined, DeleteOutlined, ArrowLeftOutlined, FilePdfOutlined,
    CheckCircleOutlined, CalendarOutlined, SaveOutlined, ThunderboltOutlined,
    DollarCircleOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { 
    mockServiceRequests as defaultServiceRequests, 
    mockCustomers as defaultCustomers, 
    mockStandards as defaultStandards 
} from '../../../data/mockData';
import type { QuotationItem, ServiceRequest, Customer, MaterialStandard } from '../../../types/v3';

const { Title, Text } = Typography;

const SERVICE_OPTIONS = [
    { value: 'mai_san', label: 'Mài sàn', unit: 'm²', defaultPrice: 30000 },
    { value: 've_sinh', label: 'Vệ sinh bề mặt', unit: 'm²', defaultPrice: 10000 },
    { value: 'sira_pu_lot', label: 'SIRA PU (lót)', unit: 'kg', defaultPrice: 45000 },
    { value: 'sira_pu_phu', label: 'SIRA PU (phủ)', unit: 'kg', defaultPrice: 48000 },
    { value: 'primer', label: 'Primer (lót nền)', unit: 'lít', defaultPrice: 35000 },
    { value: 'bam_vat', label: 'Băng chống thấm Sika', unit: 'm', defaultPrice: 85000 },
];

const CONSTRUCTION_TYPES = [
    { value: 'Chống thấm sàn', label: 'Chống thấm sàn' },
    { value: 'Chống thấm tường', label: 'Chống thấm tường' },
    { value: 'Chống thấm mái', label: 'Chống thấm mái' },
];

interface TableRow extends QuotationItem { _isNew?: boolean; }

const Quotation: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    const [mockCustomers] = useLocalStorageData<Customer[]>(demoDataService.KEYS.CUSTOMERS, defaultCustomers);
    const [mockStandards] = useLocalStorageData<MaterialStandard[]>(demoDataService.KEYS.STANDARDS, defaultStandards);
    const [mockServiceRequests, setMockServiceRequests] = useLocalStorageData<ServiceRequest[]>(demoDataService.KEYS.SERVICE_REQUESTS, defaultServiceRequests);

    const serviceRequest = mockServiceRequests.find(sr => sr.id === id);
    const customer = mockCustomers.find(c => c.id === serviceRequest?.customerId);
    const existingQuote = serviceRequest?.quotations?.[0];

    const [items, setItems] = useState<TableRow[]>(existingQuote?.items || []);
    const [areaM2, setAreaM2] = useState(100);
    const [constructionType, setConstructionType] = useState('Chống thấm sàn');
    const [discount, setDiscount] = useState(existingQuote?.discount || 0);
    const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Gap #6: Auto-calc milestones from quotation total
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const total = subtotal - discount;
    const milestones = [
        { round: 1, pct: 50, amount: total * 0.5, label: 'Khi ký HĐ', due: dayjs().format('DD/MM/YYYY') },
        { round: 2, pct: 40, amount: total * 0.4, label: 'Hoàn thành thi công', due: dayjs().add(21, 'day').format('DD/MM/YYYY') },
        { round: 3, pct: 10, amount: total * 0.1, label: 'Sau nghiệm thu', due: dayjs().add(28, 'day').format('DD/MM/YYYY') },
    ];

    const handleAutoFill = () => {
        const standards = mockStandards.filter(s => s.constructionType === constructionType);
        const autoItems: TableRow[] = standards.map((s, i) => {
            const svc = SERVICE_OPTIONS.find(o => o.label.toLowerCase().includes(s.materialName.toLowerCase().split(' ')[0]));
            const qty = Math.ceil(areaM2 * s.usagePerM2);
            const price = svc?.defaultPrice || 45000;
            return {
                id: `auto_${i}`,
                name: s.materialName,
                unit: 'kg',
                quantity: qty,
                unitPrice: price,
                total: qty * price,
                isAuto: true,
            };
        });
        // Add manual services
        const manual: TableRow[] = [
            { id: 'man_1', name: 'Mài sàn', unit: 'm²', quantity: areaM2, unitPrice: 30000, total: areaM2 * 30000, isAuto: false },
            { id: 'man_2', name: 'Vệ sinh bề mặt', unit: 'm²', quantity: areaM2, unitPrice: 10000, total: areaM2 * 10000, isAuto: false },
        ];
        setItems([...manual, ...autoItems]);
        message.success(`Đã tự động tính ${autoItems.length + manual.length} hạng mục từ định mức ${areaM2}m²`);
    };

    const handleAddRow = () => {
        setItems(prev => [...prev, {
            id: Date.now().toString(),
            name: '', unit: 'm²', quantity: 1, unitPrice: 0, total: 0, isAuto: false, _isNew: true,
        }]);
    };

    const updateRow = (key: string, field: keyof TableRow, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id !== key) return item;
            const updated = { ...item, [field]: value };
            if (field === 'quantity' || field === 'unitPrice') {
                updated.total = (Number(updated.quantity) || 0) * (Number(updated.unitPrice) || 0);
            }
            return updated;
        }));
    };

    const removeRow = (key: string) => setItems(prev => prev.filter(i => i.id !== key));

    const columns: ColumnsType<TableRow> = [
        { title: '#', width: 40, render: (_, __, i) => i + 1 },
        {
            title: 'Hạng mục *',
            key: 'name',
            render: (_, r) => r.isAuto
                ? <><Tag color="blue" style={{ fontSize: 10 }}>Auto</Tag> {r.name}</>
                : <Input
                    value={r.name}
                    onChange={e => updateRow(r.id, 'name', e.target.value)}
                    placeholder="Tên hạng mục"
                    size="small"
                />,
        },
        {
            title: 'ĐVT', width: 70,
            render: (_, r) => <Input value={r.unit} onChange={e => updateRow(r.id, 'unit', e.target.value)} size="small" />,
        },
        {
            title: 'SL', width: 90,
            render: (_, r) => (
                <InputNumber
                    value={r.quantity}
                    onChange={v => updateRow(r.id, 'quantity', v)}
                    size="small"
                    style={{ width: '100%' }}
                    suffix={r.isAuto ? <Text type="secondary" style={{ fontSize: 10 }}>auto</Text> : undefined}
                />
            ),
        },
        {
            title: 'Đơn giá', width: 130,
            render: (_, r) => (
                <InputNumber
                    value={r.unitPrice}
                    onChange={v => updateRow(r.id, 'unitPrice', v)}
                    size="small"
                    formatter={v => v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Thành tiền', width: 130, align: 'right',
            render: (_, r) => <Text strong>{r.total.toLocaleString('vi-VN')}</Text>,
        },
        {
            title: '', width: 40,
            render: (_, r) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeRow(r.id)} size="small" />,
        },
    ];

    const handleSave = async (approve = false) => {
        if (!serviceRequest) return;
        setSaving(true);
        
        const newQuotation = {
            id: existingQuote?.id || `q-${Date.now()}`,
            code: existingQuote?.code || `BG-${dayjs().format('YYYYMMDD')}-${Math.floor(100 + Math.random() * 899)}`,
            items: items.map(i => ({
                id: i.id,
                name: i.name,
                unit: i.unit,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                total: i.total
            })),
            subtotal,
            discount,
            total,
            status: approve ? 'APPROVED' : 'DRAFT',
            createdAt: existingQuote?.createdAt || new Date().toISOString()
        };

        const updatedRequests = mockServiceRequests.map(sr => {
            if (sr.id !== id) return sr;
            
            // Replace or add quotation
            const existingQuotes = sr.quotations || [];
            const otherQuotes = existingQuotes.filter(q => q.id !== newQuotation.id);
            
            return { 
                ...sr, 
                quotations: [...otherQuotes, newQuotation as any],
                status: approve ? 'WON' : sr.status 
            };
        });

        setMockServiceRequests(updatedRequests);
        
        await new Promise(r => setTimeout(r, 600));
        setSaving(false);
        
        if (approve) {
            setMilestoneModalOpen(true);
        } else {
            message.success('Đã lưu báo giá thành công');
        }
    };

    if (!serviceRequest || !customer) return <div>Không tìm thấy yêu cầu dịch vụ hoặc khách hàng</div>;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/pm/crm/service-requests/${id}`)}>Quay lại</Button>
                <div>
                    <Title level={4} style={{ margin: 0 }}><DollarCircleOutlined /> Lập Báo giá: {serviceRequest.name}</Title>
                    <Text type="secondary">KH: {customer.fullName} | Mã BG: BG-2026-{String(Date.now()).slice(-4)}</Text>
                </div>
            </div>

            {/* Auto-fill config */}
            <Card size="small" style={{ marginBottom: 16, background: '#f0f5ff', border: '1px solid #1976D2' }}>
                <Row gutter={16} align="middle">
                    <Col>
                        <Text strong>Tự động tính theo định mức:</Text>
                    </Col>
                    <Col>
                        <Space>
                            <InputNumber
                                addonBefore="Diện tích"
                                addonAfter="m²"
                                value={areaM2}
                                onChange={v => setAreaM2(v || 100)}
                                min={1} max={10000}
                            />
                            <Select
                                value={constructionType}
                                onChange={setConstructionType}
                                options={CONSTRUCTION_TYPES}
                                style={{ width: 200 }}
                            />
                            <Button type="primary" ghost icon={<ThunderboltOutlined />} onClick={handleAutoFill}>
                                Tự động điền
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Items Table */}
            <Card title="Hạng mục thi công" extra={<Button icon={<PlusOutlined />} onClick={handleAddRow}>Thêm hạng mục</Button>}>
                <Table
                    columns={columns}
                    dataSource={items}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    footer={() => (
                        <div>
                            <Row justify="end">
                                <Col>
                                    <Space direction="vertical" style={{ textAlign: 'right' }}>
                                        <Text>Tạm tính: <Text strong>{subtotal.toLocaleString('vi-VN')}</Text> VNĐ</Text>
                                        <Space>
                                            <Text>Chiết khấu:</Text>
                                            <InputNumber
                                                value={discount}
                                                onChange={v => setDiscount(v || 0)}
                                                formatter={v => v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                                addonAfter="VNĐ"
                                                style={{ width: 180 }}
                                            />
                                        </Space>
                                        <Text style={{ fontSize: 18 }}>
                                            <DollarCircleOutlined /> TỔNG CỘNG: <Text strong style={{ fontSize: 22, color: '#1976D2' }}>
                                                {total.toLocaleString('vi-VN')} VNĐ
                                            </Text>
                                        </Text>
                                    </Space>
                                </Col>
                            </Row>
                        </div>
                    )}
                />
            </Card>

            {/* Payment Preview */}
            <Card title="Đợt thanh toán (50% – 40% – 10%)" style={{ marginTop: 16 }}>
                <Row gutter={16}>
                    {milestones.map(m => (
                        <Col span={8} key={m.round}>
                            <Card size="small" style={{ textAlign: 'center', border: '1px solid #f0f0f0' }}>
                                <div style={{ fontSize: 13, color: '#666' }}>Đợt {m.round} ({m.pct}%)</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#1976D2' }}>
                                    {m.amount.toLocaleString('vi-VN')}đ
                                </div>
                                <div style={{ fontSize: 12, color: '#999' }}>
                                    <CalendarOutlined /> {m.label}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Alert
                    style={{ marginTop: 12 }}
                    message={<span><CheckCircleOutlined /> <strong>Gap #6 – Xác nhận:</strong> Khi PM click [KH chấp nhận], hệ thống tự động tạo 3 milestone từ tổng báo giá này.</span>}
                    type="info"
                    showIcon={false}
                />
            </Card>

            {/* Ghi chú */}
            <Card style={{ marginTop: 16 }}>
                <Form.Item label="Ghi chú cho KH">
                    <Input.TextArea
                        rows={3}
                        defaultValue="Bảo hành 24 tháng theo tiêu chuẩn SIRA. Cam kết thi công đúng quy trình."
                    />
                </Form.Item>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                <Button size="large">Hủy</Button>
                <Button size="large" icon={<FilePdfOutlined />} onClick={() => message.info('Chức năng xuất PDF đang phát triển')}>
                    Xem trước PDF
                </Button>
                <Button size="large" icon={<SaveOutlined />} onClick={() => handleSave(false)} loading={saving}>
                    Lưu bản nháp
                </Button>
                <Button type="primary" size="large" icon={<ArrowRightOutlined />}
                    onClick={() => handleSave(true)} loading={saving}>
                    KH Chấp nhận – Tạo milestone
                </Button>
            </div>

            {/* Gap #6: Milestone Creation Confirmation Modal */}
            <Modal
                title={<span><CheckCircleOutlined style={{ color: '#52c41a' }} /> KH đã chấp nhận báo giá – Tạo Milestone</span>}
                open={milestoneModalOpen}
                onCancel={() => setMilestoneModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setMilestoneModalOpen(false)}>Hủy</Button>,
                    <Button key="confirm" type="primary" icon={<CheckCircleOutlined />}
                        onClick={() => {
                            setMilestoneModalOpen(false);
                            message.success('Đã tạo 3 đợt thanh toán tự động!');
                            navigate(`/pm/crm/service-requests/${id}`);
                        }}
                    >
                        Xác nhận tạo Milestone
                    </Button>,
                ]}
                width={560}
            >
                <Steps
                    direction="vertical"
                    size="small"
                    style={{ marginBottom: 16 }}
                    items={[
                        { title: 'Báo giá được duyệt', status: 'finish', description: `Tổng: ${total.toLocaleString('vi-VN')} VNĐ` },
                        { title: 'Tự động tạo 3 đợt thanh toán', status: 'process', description: `50% / 40% / 10% từ tổng báo giá` },
                        { title: 'Pipeline KH → "Đã ký HĐ"', status: 'wait', description: 'Sẵn sàng tạo dự án thi công' },
                    ]}
                />
                <Divider />
                {milestones.map(m => (
                    <Row key={m.round} justify="space-between" style={{ marginBottom: 8 }}>
                        <Col><Text>Đợt {m.round} ({m.label}):</Text></Col>
                        <Col><Text strong style={{ color: '#1976D2' }}>{m.amount.toLocaleString('vi-VN')} VNĐ</Text></Col>
                    </Row>
                ))}
            </Modal>
        </div>
    );
};

export default Quotation;
