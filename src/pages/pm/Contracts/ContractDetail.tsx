import React, { useState } from 'react';
import {
    Card, Descriptions, Tag, Button, Row, Col, Statistic, Space, Table,
    Progress, Timeline, Divider, Tabs, Grid, Typography, Upload, Steps,
    Modal, Input, message, Badge,
} from 'antd';
import {
    ArrowLeftOutlined, EditOutlined, PrinterOutlined,
    FileTextOutlined, DollarOutlined, ProjectOutlined, CheckCircleOutlined,
    ClockCircleOutlined, UserOutlined, UploadOutlined, SettingOutlined,
    LockOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
    SafetyCertificateOutlined, ToolOutlined, BugOutlined,
    CalendarOutlined, PhoneOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;
const { TextArea } = Input;

/* ====== STATUS CONFIG ====== */
type ContractStatus = 'draft' | 'active' | 'acceptance' | 'warranty' | 'completed' | 'cancelled';

const CONTRACT_STEPS: { key: ContractStatus; label: string }[] = [
    { key: 'draft', label: 'Bản nháp' },
    { key: 'active', label: 'Đang thực hiện' },
    { key: 'acceptance', label: 'Nghiệm thu' },
    { key: 'warranty', label: 'Bảo hành' },
    { key: 'completed', label: 'Hoàn thành' },
];

const statusTagMap: Record<ContractStatus, { color: string; label: string }> = {
    draft: { color: 'default', label: 'Bản nháp' },
    active: { color: 'processing', label: 'Đang thực hiện' },
    acceptance: { color: 'warning', label: 'Nghiệm thu' },
    warranty: { color: 'purple', label: 'Bảo hành' },
    completed: { color: 'success', label: 'Hoàn thành' },
    cancelled: { color: 'error', label: 'Đã hủy' },
};

const getStepCurrent = (s: ContractStatus) => {
    const idx = CONTRACT_STEPS.findIndex((st) => st.key === s);
    return idx >= 0 ? idx : -1;
};

/* ====== PROJECT SCALE ====== */
const PROJECT_SCALES = [
    { level: 1, label: 'Sửa chữa nhỏ', desc: 'Sửa nhỏ lẻ dưới 50m², ≤100 triệu', color: '#87d068' },
    { level: 2, label: 'Sửa chữa vừa', desc: '50–200m², 100–500 triệu', color: '#87d068' },
    { level: 3, label: 'Cải tạo nhỏ', desc: 'Cải tạo 1–2 phòng, 500tr–1 tỷ', color: '#52c41a' },
    { level: 4, label: 'Cải tạo vừa', desc: '1 tầng/khu vực, 1–3 tỷ', color: '#1890ff' },
    { level: 5, label: 'Cải tạo lớn', desc: 'Nhiều tầng/toàn bộ nội thất, 3–5 tỷ', color: '#1890ff' },
    { level: 6, label: 'Thi công nhỏ', desc: 'Nhà phố ≤3 tầng, 5–10 tỷ', color: '#722ed1' },
    { level: 7, label: 'Thi công vừa', desc: 'Biệt thự/nhà 4–7 tầng, 10–30 tỷ', color: '#722ed1' },
    { level: 8, label: 'Thi công lớn', desc: 'Tòa nhà 8+ tầng, 30–100 tỷ', color: '#eb2f96' },
    { level: 9, label: 'Dự án phức hợp', desc: 'Khu phức hợp/resort, 100–500 tỷ', color: '#f5222d' },
    { level: 10, label: 'Mega Project', desc: 'Khu đô thị/hạ tầng lớn, >500 tỷ', color: '#f5222d' },
];

/* ====== MOCK DATA ====== */
const mockContract = {
    id: '1',
    code: 'HD-2025-001',
    name: 'HĐ Sửa chữa tầng 5 Sunrise City',
    customer: 'Sunshine Group',
    customerPhone: '028-1234-5678',
    customerEmail: 'contact@sunshine.vn',
    type: 'Trọn gói',
    status: 'draft' as ContractStatus,
    projectScale: 5,
    value: 1500000000,
    paid: 450000000,
    signDate: '2025-01-10',
    startDate: '2025-01-15',
    endDate: '2025-06-15',
    scope: 'Sửa chữa và chống thấm toàn bộ tầng 5 tòa nhà Sunrise City, bao gồm khảo sát, thi công, nghiệm thu và bảo hành.',
    warranty: '12 tháng kể từ ngày nghiệm thu hoàn công',
    warrantyStartDate: '2025-06-16',
    warrantyEndDate: '2026-06-16',
    deliverables: 'Báo cáo khảo sát, Bản vẽ thi công, Biên bản nghiệm thu, Chứng nhận bảo hành',
    exclusions: 'Công tác phá dỡ cải tạo ngoài phạm vi tầng 5, thay thế thiết bị PCCC',
    penaltyClause: 'Phạt 0.1% giá trị HĐ mỗi ngày chậm trễ, tối đa 8%.',
    notes: 'Ưu tiên thi công ngoài giờ hành chính để không ảnh hưởng cư dân.',
};

const mockMilestones = [
    { key: '1', name: 'Tạm ứng', percentage: 30, amount: 450000000, status: 'paid', date: '2025-01-15', description: 'Sau khi ký hợp đồng' },
    { key: '2', name: 'Nghiệm thu GĐ 1', percentage: 30, amount: 450000000, status: 'pending', date: '2025-03-15', description: 'Sau khi hoàn thành chống thấm' },
    { key: '3', name: 'Thanh toán cuối', percentage: 40, amount: 600000000, status: 'pending', date: '2025-06-15', description: 'Sau nghiệm thu hoàn công' },
];

const mockLinkedProjects = [
    { id: 'p1', code: 'DA-2025-001', name: 'Sửa chữa tầng 5 Sunrise', status: 'in_progress', startDate: '2025-01-15', progress: 45 },
];

const mockDocuments = [
    { id: 'd1', name: 'Bản vẽ thi công.pdf', size: '2.5 MB', uploadedBy: 'Trần Minh', uploadedAt: '2025-01-12', type: 'PDF' },
    { id: 'd2', name: 'Biên bản thỏa thuận.docx', size: '1.2 MB', uploadedBy: 'Nguyễn Hồng', uploadedAt: '2025-01-10', type: 'DOCX' },
    { id: 'd3', name: 'Ảnh khảo sát.zip', size: '15.3 MB', uploadedBy: 'Lê Quang', uploadedAt: '2025-01-08', type: 'ZIP' },
];

const mockMaintenanceRequests = [
    { key: '1', code: 'BT-001', issue: 'Thấm nước trần khu vực A3', reporter: 'Ban quản lý tòa nhà', reportDate: '2025-07-10', severity: 'Cao', status: 'resolved', assignee: 'Nguyễn Văn Hùng', resolvedDate: '2025-07-15', cost: 6050000, costItems: 4, notes: 'Xử lý bằng phương pháp bơm keo PU. Kiểm tra lại sau 1 tuần — không tái phát.' },
    { key: '2', code: 'BT-002', issue: 'Nứt sơn tường hành lang tầng 5', reporter: 'Cư dân P.503', reportDate: '2025-08-22', severity: 'Trung bình', status: 'in_progress', assignee: 'Trần Minh Đức', resolvedDate: '', cost: 1200000, costItems: 1, notes: 'Đã khảo sát, đang chờ vật tư sơn chống thấm.' },
    { key: '3', code: 'BT-003', issue: 'Ẩm mốc góc tường phòng kỹ thuật', reporter: 'Ban quản lý tòa nhà', reportDate: '2025-09-05', severity: 'Thấp', status: 'pending', assignee: '', resolvedDate: '', cost: 0, costItems: 0, notes: '' },
    { key: '4', code: 'BT-004', issue: 'Rò rỉ nước tại mối nối ống thoát', reporter: 'Ban quản lý tòa nhà', reportDate: '2025-10-12', severity: 'Cao', status: 'resolved', assignee: 'Lê Văn Phong', resolvedDate: '2025-10-14', cost: 2350000, costItems: 2, notes: 'Thay thế mối nối và bọc lớp chống thấm mới. Hoàn thành trong 2 ngày.' },
];

const mockMaintenanceLog = [
    { time: '2025-10-14', action: 'Đóng yêu cầu BT-004: Rò rỉ nước — đã sửa xong', type: 'resolved' },
    { time: '2025-10-12', action: 'Tiếp nhận BT-004: Rò rỉ nước tại mối nối ống thoát', type: 'new' },
    { time: '2025-09-05', action: 'Tiếp nhận BT-003: Ẩm mốc góc tường phòng kỹ thuật', type: 'new' },
    { time: '2025-08-25', action: 'Khảo sát BT-002: Nứt sơn tường — chờ vật tư', type: 'progress' },
    { time: '2025-08-22', action: 'Tiếp nhận BT-002: Nứt sơn tường hành lang tầng 5', type: 'new' },
    { time: '2025-07-15', action: 'Đóng yêu cầu BT-001: Thấm nước trần A3 — đã xử lý', type: 'resolved' },
    { time: '2025-07-11', action: 'Phân công Nguyễn Văn Hùng xử lý BT-001', type: 'assign' },
    { time: '2025-07-10', action: 'Tiếp nhận BT-001: Thấm nước trần khu vực A3', type: 'new' },
];

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

/* ====== COMPONENT ====== */
const ContractDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id: _id } = useParams();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    /* Status state */
    const [contractStatus, setContractStatus] = useState<ContractStatus>(mockContract.status);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const isDraft = contractStatus === 'draft';
    const isActive = contractStatus === 'active';
    const isAcceptance = contractStatus === 'acceptance';
    const isWarranty = contractStatus === 'warranty';
    const isCancelled = contractStatus === 'cancelled';
    const isCompleted = contractStatus === 'completed';

    const sevTagColor: Record<string, string> = { 'Cao': 'red', 'Trung bình': 'orange', 'Thấp': 'green' };
    const maintStatusTag: Record<string, { color: string; label: string }> = {
        resolved: { color: 'success', label: 'Đã xử lý' },
        in_progress: { color: 'processing', label: 'Đang xử lý' },
        pending: { color: 'warning', label: 'Chờ xử lý' },
    };

    /* Maintenance stats */
    const totalMaint = mockMaintenanceRequests.length;
    const resolvedMaint = mockMaintenanceRequests.filter(r => r.status === 'resolved').length;
    const pendingMaint = mockMaintenanceRequests.filter(r => r.status === 'pending').length;
    const inProgressMaint = mockMaintenanceRequests.filter(r => r.status === 'in_progress').length;
    const totalMaintCost = mockMaintenanceRequests.reduce((s, r) => s + r.cost, 0);

    /* Scale info */
    const scaleInfo = PROJECT_SCALES.find(s => s.level === mockContract.projectScale);

    /* ─── Action Handlers ─── */
    const handleLock = () => {
        Modal.confirm({
            title: 'Xác nhận Khóa Hợp đồng',
            icon: <LockOutlined style={{ color: '#faad14' }} />,
            content: 'Sau khi khóa, hợp đồng sẽ chuyển sang trạng thái "Đang thực hiện". Bạn có chắc chắn?',
            okText: 'Khóa HĐ',
            cancelText: 'Hủy',
            onOk: () => { setContractStatus('active'); message.success('Hợp đồng đã được khóa → Đang thực hiện'); },
        });
    };

    const handleAcceptance = () => {
        Modal.confirm({
            title: 'Chuyển sang Nghiệm thu',
            icon: <CheckCircleOutlined style={{ color: '#faad14' }} />,
            content: 'Xác nhận hợp đồng đã sẵn sàng để nghiệm thu?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => { setContractStatus('acceptance'); message.success('Hợp đồng chuyển sang Nghiệm thu'); },
        });
    };

    const handleWarranty = () => {
        Modal.confirm({
            title: 'Chuyển sang Bảo hành',
            icon: <SafetyCertificateOutlined style={{ color: '#722ed1' }} />,
            content: 'Xác nhận nghiệm thu thành công và bắt đầu giai đoạn bảo hành?',
            okText: 'Bắt đầu BH',
            cancelText: 'Hủy',
            onOk: () => { setContractStatus('warranty'); message.success('Hợp đồng chuyển sang giai đoạn Bảo hành'); },
        });
    };

    const handleComplete = () => {
        Modal.confirm({
            title: 'Hoàn thành Hợp đồng',
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            content: 'Xác nhận hợp đồng đã hoàn tất mọi nghĩa vụ (bao gồm bảo hành)?',
            okText: 'Hoàn thành',
            cancelText: 'Hủy',
            onOk: () => { setContractStatus('completed'); message.success('Hợp đồng đã Hoàn thành'); },
        });
    };

    const handleCancelSubmit = () => {
        if (!cancelReason.trim()) { message.warning('Vui lòng nhập lý do hủy'); return; }
        setContractStatus('cancelled');
        setCancelModalOpen(false);
        setCancelReason('');
        message.success('Hợp đồng đã bị hủy');
    };

    // ─── Tab: Tổng quan ──────────────────────────────────────────────
    const renderOverview = () => (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Giá trị HĐ" value={mockContract.value / 1e6} suffix="tr" prefix={<DollarOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Đã thanh toán" value={mockContract.paid / 1e6} suffix="tr" valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Còn lại" value={(mockContract.value - mockContract.paid) / 1e6} suffix="tr" valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Tiến độ TT" value={Math.round((mockContract.paid / mockContract.value) * 100)} suffix="%" /></Card>
                </Col>
            </Row>

            <Card title="Thông Tin Hợp Đồng" style={{ marginBottom: 16 }}>
                <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                    <Descriptions.Item label="Mã HĐ">{mockContract.code}</Descriptions.Item>
                    <Descriptions.Item label="Tên HĐ">{mockContract.name}</Descriptions.Item>
                    <Descriptions.Item label="Khách hàng"><UserOutlined /> {mockContract.customer}</Descriptions.Item>
                    <Descriptions.Item label="Loại HĐ">{mockContract.type}</Descriptions.Item>
                    <Descriptions.Item label="SĐT"><PhoneOutlined /> {mockContract.customerPhone}</Descriptions.Item>
                    <Descriptions.Item label="Email">{mockContract.customerEmail}</Descriptions.Item>
                    <Descriptions.Item label="Ngày ký"><CalendarOutlined /> {mockContract.signDate}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={statusTagMap[contractStatus]?.color}>{statusTagMap[contractStatus]?.label}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu"><CalendarOutlined /> {mockContract.startDate}</Descriptions.Item>
                    <Descriptions.Item label="Ngày kết thúc"><CalendarOutlined /> {mockContract.endDate}</Descriptions.Item>
                    <Descriptions.Item label="Giá trị" span={2}>
                        <span style={{ fontWeight: 600, fontSize: 16, color: '#1890ff' }}>{formatCurrency(mockContract.value)}</span>
                    </Descriptions.Item>
                    {/* Project Scale */}
                    <Descriptions.Item label="Quy mô dự án" span={2}>
                        <Space>
                            <Tag color={scaleInfo?.color} style={{ fontWeight: 600 }}>
                                Cấp {mockContract.projectScale} — {scaleInfo?.label}
                            </Tag>
                            <Text type="secondary" style={{ fontSize: 12 }}>{scaleInfo?.desc}</Text>
                        </Space>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Scale Reference Table */}
            <Card title="Bảng Quy mô Dự án (Tham khảo)" size="small" style={{ marginBottom: 16 }}>
                <Table
                    dataSource={PROJECT_SCALES}
                    rowKey="level"
                    pagination={false}
                    size="small"
                    columns={[
                        { title: 'Cấp', dataIndex: 'level', key: 'level', width: 60, align: 'center' as const, render: (v: number) => <Tag color={PROJECT_SCALES.find(s => s.level === v)?.color}>{v}</Tag> },
                        { title: 'Tên', dataIndex: 'label', key: 'label', width: 140 },
                        { title: 'Mô tả', dataIndex: 'desc', key: 'desc' },
                    ]}
                    rowClassName={(rec) => rec.level === mockContract.projectScale ? 'ant-table-row-selected' : ''}
                />
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Phạm Vi Công Việc" size="small">
                        <p style={{ whiteSpace: 'pre-wrap' }}>{mockContract.scope}</p>
                        <Divider style={{ margin: '12px 0' }} />
                        <strong>Bàn giao:</strong>
                        <p style={{ color: '#666' }}>{mockContract.deliverables}</p>
                        <strong>Ngoại trừ:</strong>
                        <p style={{ color: '#666' }}>{mockContract.exclusions}</p>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Điều Khoản" size="small">
                        <strong>Bảo hành:</strong>
                        <p style={{ color: '#666' }}>{mockContract.warranty}</p>
                        <Divider style={{ margin: '12px 0' }} />
                        <strong>Điều khoản phạt:</strong>
                        <p style={{ color: '#666' }}>{mockContract.penaltyClause}</p>
                        <Divider style={{ margin: '12px 0' }} />
                        <strong>Ghi chú:</strong>
                        <p style={{ color: '#666' }}>{mockContract.notes}</p>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    // ─── Tab: Thanh toán ─────────────────────────────────────────────
    const renderPayments = () => {
        const milestoneColumns = [
            { title: 'Đợt TT', dataIndex: 'name', key: 'name' },
            { title: '%', dataIndex: 'percentage', key: 'percentage', render: (v: number) => `${v}%`, width: 70 },
            { title: 'Số tiền', dataIndex: 'amount', key: 'amount', render: (v: number) => formatCurrency(v), responsive: ['md' as const] },
            {
                title: 'Trạng thái', dataIndex: 'status', key: 'status',
                render: (s: string) => <Tag color={s === 'paid' ? 'success' : 'default'}>{s === 'paid' ? 'Đã TT' : 'Chưa TT'}</Tag>,
            },
            { title: 'Ngày dự kiến', dataIndex: 'date', key: 'date', responsive: ['md' as const] },
            { title: 'Mô tả', dataIndex: 'description', key: 'description', responsive: ['lg' as const] },
        ];

        return (
            <div>
                <Card title={<Space><DollarOutlined /> Tiến Độ Thanh Toán</Space>} style={{ marginBottom: 16 }}>
                    <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
                        <Col xs={24} sm={12}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span>Đã thanh toán: {formatCurrency(mockContract.paid)}</span>
                                <span>{formatCurrency(mockContract.value)}</span>
                            </div>
                            <Progress percent={Math.round((mockContract.paid / mockContract.value) * 100)} status="active" />
                        </Col>
                    </Row>
                </Card>

                <Card title="Mốc Thanh Toán">
                    <Table dataSource={mockMilestones} columns={milestoneColumns} rowKey="key" pagination={false} scroll={{ x: 500 }} />
                </Card>

                <Card title="Lịch Sử Thanh Toán" style={{ marginTop: 16 }}>
                    <Timeline
                        items={[
                            { color: 'green', children: <><strong>Tạm ứng</strong> — {formatCurrency(450000000)}<br /><span style={{ color: '#888', fontSize: 12 }}>15/01/2025 — CK qua VCB</span></> },
                        ]}
                    />
                </Card>
            </div>
        );
    };

    // ─── Tab: Dự án liên kết ─────────────────────────────────────────
    const renderLinkedProjects = () => {
        const projectColumns = [
            { title: 'Mã DA', dataIndex: 'code', key: 'code', render: (c: string, rec: typeof mockLinkedProjects[0]) => <a onClick={() => navigate(`/pm/projects/${rec.id}`)}>{c}</a> },
            { title: 'Tên DA', dataIndex: 'name', key: 'name' },
            {
                title: 'Trạng thái', dataIndex: 'status', key: 'status',
                render: (s: string) => <Tag color={s === 'in_progress' ? 'processing' : 'success'}>{s === 'in_progress' ? 'Đang TH' : 'Hoàn thành'}</Tag>,
            },
            {
                title: 'Tiến độ', dataIndex: 'progress', key: 'progress',
                render: (p: number) => <Progress percent={p} size="small" />,
                responsive: ['md' as const],
            },
        ];

        return (
            <Card title={<Space><ProjectOutlined /> Dự Án Liên Kết ({mockLinkedProjects.length})</Space>}>
                <Table dataSource={mockLinkedProjects} columns={projectColumns} rowKey="id" pagination={false} />
            </Card>
        );
    };

    // ─── Tab: Tài liệu ──────────────────────────────────────────────
    const renderDocuments = () => {
        const docColumns = [
            { title: 'Tên file', dataIndex: 'name', key: 'name', render: (n: string) => <a><FileTextOutlined /> {n}</a> },
            { title: 'Loại', dataIndex: 'type', key: 'type', width: 80, render: (t: string) => <Tag>{t}</Tag> },
            { title: 'Kích thước', dataIndex: 'size', key: 'size', responsive: ['md' as const] },
            { title: 'Người tải', dataIndex: 'uploadedBy', key: 'uploadedBy', responsive: ['md' as const] },
            { title: 'Ngày tải', dataIndex: 'uploadedAt', key: 'uploadedAt', responsive: ['lg' as const] },
        ];

        return (
            <Card
                title={<Space><FileTextOutlined /> Tài Liệu ({mockDocuments.length})</Space>}
                extra={<Upload><Button icon={<UploadOutlined />} size="small">Tải lên</Button></Upload>}
            >
                <Table dataSource={mockDocuments} columns={docColumns} rowKey="id" pagination={false} />
            </Card>
        );
    };

    // ─── Tab: Bảo hành & Bảo trì ────────────────────────────────────
    const renderWarrantyMaintenance = () => (
        <div>
            {/* Warranty Summary */}
            <Card title={<Space><SafetyCertificateOutlined /> Thông tin Bảo hành</Space>} style={{ marginBottom: 16 }}>
                <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                    <Descriptions.Item label="Thời hạn BH">{mockContract.warranty}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color="purple">Đang trong thời hạn BH</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu BH"><CalendarOutlined /> {mockContract.warrantyStartDate}</Descriptions.Item>
                    <Descriptions.Item label="Ngày kết thúc BH"><CalendarOutlined /> {mockContract.warrantyEndDate}</Descriptions.Item>
                    <Descriptions.Item label="Điều kiện" span={2}>
                        Bảo hành miễn phí các lỗi phát sinh do thi công. Không bảo hành thiệt hại do thiên tai, sử dụng sai mục đích.
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Maintenance Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={12} sm={6} lg={4}>
                    <Card size="small"><Statistic title="Tổng yêu cầu" value={totalMaint} prefix={<BugOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6} lg={4}>
                    <Card size="small"><Statistic title="Đã xử lý" value={resolvedMaint} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6} lg={4}>
                    <Card size="small"><Statistic title="Đang xử lý" value={inProgressMaint} valueStyle={{ color: '#1890ff' }} prefix={<ToolOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6} lg={4}>
                    <Card size="small"><Statistic title="Chờ xử lý" value={pendingMaint} valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} /></Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card size="small" style={{ background: '#fff7e6', border: '1px solid #ffe58f' }}>
                        <Statistic title="Tổng CP phát sinh" value={totalMaintCost / 1e6} suffix="tr" precision={1}
                            valueStyle={{ color: '#d4380d', fontWeight: 600 }} prefix={<DollarOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Maintenance Requests Table */}
            <Card
                title={<Space><ToolOutlined /> Danh sách Yêu cầu Bảo trì</Space>}
                style={{ marginBottom: 16 }}
                extra={<Button type="primary" size="small">+ Thêm yêu cầu</Button>}
            >
                <Table
                    dataSource={mockMaintenanceRequests}
                    rowKey="key"
                    pagination={false}
                    size="small"
                    scroll={{ x: 800 }}
                    expandable={{
                        expandedRowRender: (rec) => (
                            <div style={{ padding: '8px 0' }}>
                                <Text strong>Ghi chú xử lý:</Text>
                                <p style={{ color: '#666', margin: '4px 0 0' }}>{rec.notes || '—'}</p>
                            </div>
                        ),
                    }}
                    columns={[
                        {
                            title: 'Mã', dataIndex: 'code', key: 'code', width: 80,
                            render: (c: string, rec: typeof mockMaintenanceRequests[0]) => (
                                <a onClick={() => navigate(`/pm/contracts/${_id}/maintenance/${rec.key}`)} style={{ fontWeight: 600 }}>{c}</a>
                            ),
                        },
                        { title: 'Vấn đề', dataIndex: 'issue', key: 'issue' },
                        {
                            title: 'Mức độ', dataIndex: 'severity', key: 'severity', width: 100,
                            render: (s: string) => <Tag color={sevTagColor[s]}>{s}</Tag>,
                        },
                        {
                            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 110,
                            render: (s: string) => <Tag color={maintStatusTag[s]?.color}>{maintStatusTag[s]?.label}</Tag>,
                        },
                        {
                            title: 'Chi phí PS', dataIndex: 'cost', key: 'cost', width: 130,
                            render: (v: number) => v > 0
                                ? <Text strong style={{ color: '#d4380d' }}>{formatCurrency(v)}</Text>
                                : <Text type="secondary">—</Text>,
                        },
                        { title: 'Người xử lý', dataIndex: 'assignee', key: 'assignee', width: 130, render: (v: string) => v || <Text type="secondary">Chưa PC</Text>, responsive: ['md' as const] },
                        { title: 'Ngày báo', dataIndex: 'reportDate', key: 'reportDate', width: 100, responsive: ['md' as const] },
                        {
                            title: 'Thao tác', key: 'actions', width: 150, align: 'center' as const,
                            render: (_: any, rec: typeof mockMaintenanceRequests[0]) => (
                                <Space size="small">
                                    <Button size="small" icon={<DollarOutlined />}
                                        onClick={() => navigate(`/pm/contracts/${_id}/maintenance/${rec.key}`)}>Thêm CP</Button>
                                    <Button size="small" type="link"
                                        onClick={() => navigate(`/pm/contracts/${_id}/maintenance/${rec.key}`)}>Xem</Button>
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>

            {/* Maintenance Activity Log */}
            <Card title={<Space><CalendarOutlined /> Nhật ký Bảo trì</Space>}>
                <Timeline
                    items={mockMaintenanceLog.map((log) => ({
                        color:
                            log.type === 'resolved' ? 'green' :
                                log.type === 'new' ? 'blue' :
                                    log.type === 'assign' ? 'purple' :
                                        'gray',
                        children: (
                            <div>
                                <div style={{ fontWeight: 500 }}>{log.action}</div>
                                <div style={{ fontSize: 12, color: '#999' }}>{log.time}</div>
                            </div>
                        ),
                    }))}
                />
            </Card>
        </div>
    );

    return (
        <div>
            {/* ─── Status Steps Bar ─── */}
            <Card size="small" style={{ marginBottom: 16 }}>
                {isCancelled ? (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                        <Tag color="error" icon={<CloseCircleOutlined />} style={{ fontSize: 14, padding: '4px 16px' }}>
                            Hợp đồng đã bị HỦY
                        </Tag>
                    </div>
                ) : (
                    <Steps
                        current={getStepCurrent(contractStatus)}
                        size="small"
                        items={CONTRACT_STEPS.map((s) => ({
                            title: s.label,
                            status:
                                s.key === contractStatus ? 'process' :
                                    getStepCurrent(s.key) < getStepCurrent(contractStatus) ? 'finish' : 'wait',
                        }))}
                    />
                )}
            </Card>

            {/* ─── Header ─── */}
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <Space wrap>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pm/contracts/all')}>
                        {!isMobile && 'Quay lại'}
                    </Button>
                    <Title level={4} style={{ margin: 0 }}>
                        {mockContract.code} — {isMobile ? '' : mockContract.name}
                    </Title>
                    <Tag color={statusTagMap[contractStatus]?.color}>
                        {statusTagMap[contractStatus]?.label}
                    </Tag>
                </Space>
                <Space wrap>
                    {/* Action Buttons */}
                    {isDraft && (
                        <Button icon={<LockOutlined />} onClick={handleLock}>Khóa HĐ</Button>
                    )}
                    {isActive && (
                        <Button icon={<CheckCircleOutlined />} onClick={handleAcceptance}>Nghiệm thu</Button>
                    )}
                    {isAcceptance && (
                        <Button icon={<SafetyCertificateOutlined />} onClick={handleWarranty} style={{ color: '#722ed1', borderColor: '#722ed1' }}>Chuyển BH</Button>
                    )}
                    {isWarranty && (
                        <Button type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} icon={<CheckCircleOutlined />} onClick={handleComplete}>Hoàn thành</Button>
                    )}
                    {(isDraft || isActive) && !isCancelled && !isCompleted && (
                        <Button danger icon={<CloseCircleOutlined />} onClick={() => setCancelModalOpen(true)}>Hủy HĐ</Button>
                    )}
                    <Button icon={<PrinterOutlined />}>{!isMobile && 'In'}</Button>
                    {isDraft ? (
                        <Button type="primary" icon={<EditOutlined />}
                            onClick={() => navigate(`/pm/contracts/edit/${_id}`)}>
                            {!isMobile && 'Chỉnh sửa'}
                        </Button>
                    ) : (
                        <Button type="primary" icon={<EditOutlined />} disabled>{!isMobile && 'Chỉnh sửa'}</Button>
                    )}
                </Space>
            </Row>

            {/* ─── Tabs ─── */}
            <Tabs
                defaultActiveKey="overview"
                type="card"
                items={[
                    { key: 'overview', label: 'Tổng quan', icon: <SettingOutlined />, children: renderOverview() },
                    { key: 'payments', label: 'Thanh toán', icon: <DollarOutlined />, children: renderPayments() },
                    { key: 'projects', label: 'Dự án', icon: <ProjectOutlined />, children: renderLinkedProjects() },
                    { key: 'documents', label: 'Tài liệu', icon: <FileTextOutlined />, children: renderDocuments() },
                    {
                        key: 'warranty',
                        label: <Badge count={pendingMaint + inProgressMaint} offset={[10, 0]}>
                            <Space><SafetyCertificateOutlined /> Bảo hành & Bảo trì</Space>
                        </Badge>,
                        children: renderWarrantyMaintenance(),
                    },
                ]}
            />

            {/* ─── Cancel Modal ─── */}
            <Modal
                title={<Space><ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /> Hủy Hợp đồng</Space>}
                open={cancelModalOpen}
                onCancel={() => { setCancelModalOpen(false); setCancelReason(''); }}
                onOk={handleCancelSubmit}
                okText="Xác nhận Hủy"
                okButtonProps={{ danger: true }}
                cancelText="Đóng"
            >
                <p>Bạn đang yêu cầu hủy hợp đồng <Text strong>{mockContract.code}</Text>. Hành động này không thể hoàn tác.</p>
                <Text strong>Lý do hủy <Text type="danger">*</Text></Text>
                <TextArea
                    rows={3}
                    placeholder="Nhập lý do hủy hợp đồng..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    style={{ marginTop: 8 }}
                />
            </Modal>
        </div>
    );
};

export default ContractDetail;
