import React, { useState } from 'react';
import {
    Card, Descriptions, Tag, Button, Row, Col, Statistic, Space, Table,
    Timeline, Divider, Grid, Typography, Modal, Input, InputNumber,
    Select, message,
} from 'antd';
import {
    ArrowLeftOutlined, DollarOutlined, CheckCircleOutlined,
    UserOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, ToolOutlined,
    CalendarOutlined, ExclamationCircleOutlined, BugOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { useBreakpoint } = Grid;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

/* ====== HELPERS ====== */
const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

/* ====== MOCK DATA ====== */
const mockRequest = {
    key: '1',
    code: 'BT-001',
    contractCode: 'HD-2025-001',
    contractName: 'HĐ Sửa chữa tầng 5 Sunrise City',
    issue: 'Thấm nước trần khu vực A3',
    description: 'Phát hiện thấm nước nghiêm trọng tại khu vực trần A3, nước rỉ từ mối nối giữa sàn tầng 6 và trần tầng 5. Cần xử lý chống thấm bằng phương pháp bơm keo PU và phủ lại lớp chống thấm bề mặt.',
    reporter: 'Ban quản lý tòa nhà',
    reporterPhone: '028-3456-7890',
    reportDate: '2025-07-10',
    severity: 'Cao' as string,
    status: 'resolved' as string,
    assignee: 'Nguyễn Văn Hùng',
    assigneePhone: '0901-234-567',
    resolvedDate: '2025-07-15',
    notes: 'Xử lý bằng phương pháp bơm keo PU. Kiểm tra lại sau 1 tuần — không tái phát.',
    location: 'Tầng 5, Khu vực A3, Tòa nhà Sunrise City',
    warrantyStatus: 'Trong bảo hành',
};

const mockCosts = [
    { key: '1', name: 'Keo PU chống thấm Sika', category: 'Vật tư', unit: 'bộ', quantity: 3, unitPrice: 1200000, total: 3600000, addedBy: 'Nguyễn Văn Hùng', addedDate: '2025-07-12' },
    { key: '2', name: 'Nhân công bơm keo', category: 'Nhân công', unit: 'ngày công', quantity: 2, unitPrice: 800000, total: 1600000, addedBy: 'Nguyễn Văn Hùng', addedDate: '2025-07-12' },
    { key: '3', name: 'Máy bơm keo áp lực', category: 'Thiết bị', unit: 'ca', quantity: 1, unitPrice: 500000, total: 500000, addedBy: 'Nguyễn Văn Hùng', addedDate: '2025-07-12' },
    { key: '4', name: 'Vật tư phụ (băng keo, keo trám…)', category: 'Vật tư', unit: 'bộ', quantity: 1, unitPrice: 350000, total: 350000, addedBy: 'Nguyễn Văn Hùng', addedDate: '2025-07-13' },
];

const mockEvents = [
    { time: '2025-07-15 16:30', action: 'Đóng yêu cầu — Kiểm tra lại sau 5 ngày, không tái phát thấm', type: 'resolved', user: 'Nguyễn Văn Hùng' },
    { time: '2025-07-13 14:00', action: 'Hoàn thành bơm keo PU, phủ lớp chống thấm bề mặt', type: 'progress', user: 'Nguyễn Văn Hùng' },
    { time: '2025-07-13 08:00', action: 'Thêm chi phí vật tư phụ — 350,000₫', type: 'cost', user: 'Nguyễn Văn Hùng' },
    { time: '2025-07-12 14:00', action: 'Bắt đầu thi công bơm keo PU tại khu vực A3', type: 'progress', user: 'Nguyễn Văn Hùng' },
    { time: '2025-07-12 09:00', action: 'Thêm chi phí phát sinh: Keo PU + Nhân công + Thiết bị — 5,700,000₫', type: 'cost', user: 'Nguyễn Văn Hùng' },
    { time: '2025-07-11 15:00', action: 'Phân công xử lý cho Nguyễn Văn Hùng', type: 'assign', user: 'Trần Minh (PM)' },
    { time: '2025-07-11 10:00', action: 'Khảo sát hiện trường — xác định nguyên nhân do mối nối sàn bị nứt', type: 'progress', user: 'Nguyễn Văn Hùng' },
    { time: '2025-07-10 09:30', action: 'Tiếp nhận yêu cầu bảo trì từ Ban quản lý tòa nhà', type: 'new', user: 'Hệ thống' },
];

/* ====== COMPONENT ====== */
const MaintenanceDetail: React.FC = () => {
    const navigate = useNavigate();
    const { contractId, maintenanceId: _maintenanceId } = useParams();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [addCostOpen, setAddCostOpen] = useState(false);
    const [costs, setCosts] = useState(mockCosts);

    const sevTagColor: Record<string, string> = { 'Cao': 'red', 'Trung bình': 'orange', 'Thấp': 'green' };
    const maintStatusTag: Record<string, { color: string; label: string }> = {
        resolved: { color: 'success', label: 'Đã xử lý' },
        in_progress: { color: 'processing', label: 'Đang xử lý' },
        pending: { color: 'warning', label: 'Chờ xử lý' },
    };

    const totalCost = costs.reduce((sum, c) => sum + c.total, 0);
    const materialCost = costs.filter(c => c.category === 'Vật tư').reduce((s, c) => s + c.total, 0);
    const laborCost = costs.filter(c => c.category === 'Nhân công').reduce((s, c) => s + c.total, 0);
    const equipmentCost = costs.filter(c => c.category === 'Thiết bị').reduce((s, c) => s + c.total, 0);

    const handleAddCost = (values: any) => {
        const newCost = {
            key: String(costs.length + 1),
            name: values.name,
            category: values.category,
            unit: values.unit,
            quantity: values.quantity,
            unitPrice: values.unitPrice,
            total: values.quantity * values.unitPrice,
            addedBy: 'Người dùng hiện tại',
            addedDate: new Date().toISOString().slice(0, 10),
        };
        setCosts([...costs, newCost]);
        setAddCostOpen(false);
        message.success('Đã thêm chi phí phát sinh');
    };

    const costColumns = [
        {
            title: 'Hạng mục', dataIndex: 'name', key: 'name',
            render: (v: string) => <Text strong>{v}</Text>,
        },
        {
            title: 'Loại', dataIndex: 'category', key: 'category', width: 100,
            render: (v: string) => {
                const catColor: Record<string, string> = { 'Vật tư': 'blue', 'Nhân công': 'green', 'Thiết bị': 'orange' };
                return <Tag color={catColor[v] || 'default'}>{v}</Tag>;
            },
        },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 90 },
        { title: 'SL', dataIndex: 'quantity', key: 'quantity', width: 60, align: 'center' as const },
        { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', width: 120, render: (v: number) => formatCurrency(v), responsive: ['md' as const] },
        { title: 'Thành tiền', dataIndex: 'total', key: 'total', width: 130, render: (v: number) => <Text strong style={{ color: '#f5222d' }}>{formatCurrency(v)}</Text> },
        { title: 'Người thêm', dataIndex: 'addedBy', key: 'addedBy', width: 130, responsive: ['lg' as const] },
        { title: 'Ngày', dataIndex: 'addedDate', key: 'addedDate', width: 100, responsive: ['lg' as const] },
        {
            title: '', key: 'actions', width: 80,
            render: () => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} size="small" />
                    <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }} wrap>
                <Space wrap>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/ql/contracts/${contractId}`)}>
                        {!isMobile && 'Quay lại HĐ'}
                    </Button>
                    <Title level={4} style={{ margin: 0 }}>
                        {mockRequest.code} — {isMobile ? 'Chi tiết BT' : 'Chi tiết Yêu cầu Bảo trì'}
                    </Title>
                    <Tag color={sevTagColor[mockRequest.severity]}>{mockRequest.severity}</Tag>
                    <Tag color={maintStatusTag[mockRequest.status]?.color}>
                        {maintStatusTag[mockRequest.status]?.label}
                    </Tag>
                </Space>
                <Space wrap>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddCostOpen(true)}>
                        Thêm chi phí phát sinh
                    </Button>
                </Space>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Left Column — Info & Costs */}
                <Col xs={24} lg={16}>
                    {/* Basic Info Card */}
                    <Card title={<Space><BugOutlined /> Thông tin Yêu cầu</Space>} style={{ marginBottom: 16 }}>
                        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                            <Descriptions.Item label="Mã yêu cầu"><Text strong>{mockRequest.code}</Text></Descriptions.Item>
                            <Descriptions.Item label="Hợp đồng">
                                <a onClick={() => navigate(`/ql/contracts/${contractId}`)}>{mockRequest.contractCode}</a>
                            </Descriptions.Item>
                            <Descriptions.Item label="Vấn đề" span={2}>{mockRequest.issue}</Descriptions.Item>
                            <Descriptions.Item label="Vị trí" span={2}><Text>{mockRequest.location}</Text></Descriptions.Item>
                            <Descriptions.Item label="Mô tả chi tiết" span={2}>
                                <Paragraph style={{ margin: 0 }}>{mockRequest.description}</Paragraph>
                            </Descriptions.Item>
                            <Descriptions.Item label="Người báo cáo">
                                <UserOutlined /> {mockRequest.reporter}
                            </Descriptions.Item>
                            <Descriptions.Item label="SĐT liên hệ">{mockRequest.reporterPhone}</Descriptions.Item>
                            <Descriptions.Item label="Ngày báo"><CalendarOutlined /> {mockRequest.reportDate}</Descriptions.Item>
                            <Descriptions.Item label="Mức độ"><Tag color={sevTagColor[mockRequest.severity]}>{mockRequest.severity}</Tag></Descriptions.Item>
                            <Descriptions.Item label="Người xử lý">
                                <UserOutlined /> {mockRequest.assignee || <Text type="secondary">Chưa phân công</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label="SĐT xử lý">{mockRequest.assigneePhone || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày xử lý xong"><CalendarOutlined /> {mockRequest.resolvedDate || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Bảo hành">
                                <Tag color="purple">{mockRequest.warrantyStatus}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú xử lý" span={2}>
                                <Paragraph style={{ margin: 0, color: '#666' }}>{mockRequest.notes || '—'}</Paragraph>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Cost Section */}
                    <Card
                        title={<Space><DollarOutlined /> Chi phí Phát sinh</Space>}
                        extra={
                            <Button type="primary" icon={<PlusOutlined />} size="small"
                                onClick={() => setAddCostOpen(true)}>
                                Thêm chi phí
                            </Button>
                        }
                    >
                        {/* Cost Summary Stats */}
                        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                            <Col xs={12} sm={6}>
                                <Card size="small" style={{ background: '#fff7e6', border: '1px solid #ffe58f' }}>
                                    <Statistic title="Tổng CP" value={totalCost / 1e6} suffix="tr" precision={1}
                                        valueStyle={{ color: '#d4380d', fontSize: 20 }} prefix={<DollarOutlined />} />
                                </Card>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Card size="small">
                                    <Statistic title="Vật tư" value={materialCost / 1e6} suffix="tr" precision={1}
                                        valueStyle={{ fontSize: 16, color: '#1890ff' }} />
                                </Card>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Card size="small">
                                    <Statistic title="Nhân công" value={laborCost / 1e6} suffix="tr" precision={1}
                                        valueStyle={{ fontSize: 16, color: '#52c41a' }} />
                                </Card>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Card size="small">
                                    <Statistic title="Thiết bị" value={equipmentCost / 1e6} suffix="tr" precision={1}
                                        valueStyle={{ fontSize: 16, color: '#fa8c16' }} />
                                </Card>
                            </Col>
                        </Row>

                        {/* Cost Table */}
                        <Table
                            dataSource={costs}
                            columns={costColumns}
                            rowKey="key"
                            pagination={false}
                            size="small"
                            scroll={{ x: 700 }}
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 600 }}>
                                        <Table.Summary.Cell index={0} colSpan={5}>
                                            <Text strong>TỔNG CHI PHÍ PHÁT SINH</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={5}>
                                            <Text strong style={{ color: '#d4380d', fontSize: 15 }}>
                                                {formatCurrency(totalCost)}
                                            </Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={6} colSpan={3} />
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                    </Card>
                </Col>

                {/* Right Column — Timeline */}
                <Col xs={24} lg={8}>
                    <Card title={<Space><CalendarOutlined /> Dòng sự kiện</Space>}
                        bodyStyle={{ maxHeight: 700, overflowY: 'auto' }}>
                        <Timeline
                            items={mockEvents.map((ev) => {
                                const colorMap: Record<string, string> = {
                                    resolved: 'green', new: 'blue', assign: 'purple',
                                    progress: 'cyan', cost: 'red',
                                };
                                const iconMap: Record<string, React.ReactNode> = {
                                    resolved: <CheckCircleOutlined />,
                                    cost: <DollarOutlined />,
                                    assign: <UserOutlined />,
                                    progress: <ToolOutlined />,
                                    new: <ExclamationCircleOutlined />,
                                };
                                return {
                                    color: colorMap[ev.type] || 'gray',
                                    dot: iconMap[ev.type],
                                    children: (
                                        <div>
                                            <div style={{ fontWeight: 500, marginBottom: 2 }}>{ev.action}</div>
                                            <Space size="small" style={{ fontSize: 12, color: '#999' }}>
                                                <span>{ev.time}</span>
                                                <Divider type="vertical" style={{ margin: 0 }} />
                                                <span>{ev.user}</span>
                                            </Space>
                                        </div>
                                    ),
                                };
                            })}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ─── Add Cost Modal ─── */}
            <AddCostModal
                open={addCostOpen}
                onCancel={() => setAddCostOpen(false)}
                onSubmit={handleAddCost}
            />
        </div>
    );
};

/* ====== ADD COST MODAL ====== */
interface AddCostModalProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
}

const AddCostModal: React.FC<AddCostModalProps> = ({ open, onCancel, onSubmit }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Vật tư');
    const [unit, setUnit] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [note, setNote] = useState('');

    const reset = () => { setName(''); setCategory('Vật tư'); setUnit(''); setQuantity(1); setUnitPrice(0); setNote(''); };

    const handleOk = () => {
        if (!name.trim()) { message.warning('Vui lòng nhập tên hạng mục'); return; }
        if (!unit.trim()) { message.warning('Vui lòng nhập đơn vị tính'); return; }
        if (quantity <= 0 || unitPrice <= 0) { message.warning('Số lượng và đơn giá phải > 0'); return; }
        onSubmit({ name, category, unit, quantity, unitPrice, note });
        reset();
    };

    return (
        <Modal
            title={<Space><DollarOutlined style={{ color: '#faad14' }} /> Thêm Chi phí Phát sinh</Space>}
            open={open}
            onCancel={() => { onCancel(); reset(); }}
            onOk={handleOk}
            okText="Thêm chi phí"
            cancelText="Hủy"
            width={520}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                <div>
                    <Text strong>Tên hạng mục <Text type="danger">*</Text></Text>
                    <Input placeholder="VD: Keo PU chống thấm…" value={name} onChange={e => setName(e.target.value)} style={{ marginTop: 4 }} />
                </div>
                <Row gutter={12}>
                    <Col span={12}>
                        <Text strong>Loại chi phí</Text>
                        <Select value={category} onChange={setCategory} style={{ width: '100%', marginTop: 4 }}
                            options={[
                                { value: 'Vật tư', label: 'Vật tư' },
                                { value: 'Nhân công', label: 'Nhân công' },
                                { value: 'Thiết bị', label: 'Thiết bị' },
                                { value: 'Khác', label: 'Khác' },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <Text strong>Đơn vị tính <Text type="danger">*</Text></Text>
                        <Input placeholder="bộ, kg, ngày công…" value={unit} onChange={e => setUnit(e.target.value)} style={{ marginTop: 4 }} />
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <Text strong>Số lượng <Text type="danger">*</Text></Text>
                        <InputNumber min={1} value={quantity} onChange={v => setQuantity(v ?? 1)} style={{ width: '100%', marginTop: 4 }} />
                    </Col>
                    <Col span={12}>
                        <Text strong>Đơn giá (VNĐ) <Text type="danger">*</Text></Text>
                        <InputNumber
                            min={0} value={unitPrice}
                            onChange={v => setUnitPrice(v ?? 0)}
                            style={{ width: '100%', marginTop: 4 }}
                            formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={v => Number(v?.replace(/,/g, '') || 0)}
                        />
                    </Col>
                </Row>
                <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, padding: '8px 12px' }}>
                    <Text>Thành tiền: </Text>
                    <Text strong style={{ color: '#d4380d', fontSize: 16 }}>
                        {formatCurrency(quantity * unitPrice)}
                    </Text>
                </div>
                <div>
                    <Text strong>Ghi chú</Text>
                    <TextArea rows={2} placeholder="Ghi chú thêm…" value={note} onChange={e => setNote(e.target.value)} style={{ marginTop: 4 }} />
                </div>
            </div>
        </Modal>
    );
};

export default MaintenanceDetail;
