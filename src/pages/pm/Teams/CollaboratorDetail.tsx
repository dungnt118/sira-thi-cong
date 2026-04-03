import React, { useState } from 'react';
import {
    Card, Row, Col, Descriptions, Tag, Button, Space, Table, Statistic,
    Tabs, Rate, Avatar, Form, Input, Select, Modal, message, Divider,
    Popconfirm, Progress, Timeline, Grid, Segmented, Empty, Badge,
    Typography,
} from 'antd';
import {
    ArrowLeftOutlined, EditOutlined, PlusOutlined, DeleteOutlined,
    PhoneOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined,
    ProjectOutlined, DollarOutlined, FileTextOutlined, UserOutlined,
    CheckCircleOutlined, ToolOutlined, PictureOutlined,
    VideoCameraOutlined, FileOutlined, DownloadOutlined,
    CloudUploadOutlined, CreditCardOutlined, BankOutlined,
    EyeOutlined, PlayCircleOutlined, CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { useBreakpoint } = Grid;
const { Text } = Typography;

// ─── Types ─────────────────────────────────────────────────────────
interface Worker {
    id: string;
    name: string;
    phone: string;
    address: string;
    specialization: string;
    rating: number;
    status: 'active' | 'inactive';
    projectCount: number;
}

interface ProjectHistory {
    id: string;
    code: string;
    name: string;
    contractCode: string;
    contractName: string;
    role: string;
    startDate: string;
    endDate: string;
    status: 'completed' | 'in_progress' | 'pending';
    value: number;
    rating: number;
}

interface MediaResource {
    id: string;
    name: string;
    type: 'image' | 'video' | 'document';
    fileType: string;
    size: string;
    uploadDate: string;
    project: string;
    thumbnail?: string;
    duration?: string;
}

interface PaymentRecord {
    id: string;
    code: string;
    project: string;
    projectCode: string;
    batch: string;
    amount: number;
    date: string;
    method: string;
    status: 'paid' | 'processing' | 'pending' | 'rejected';
    note?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────
const mockCollaborator = {
    id: '1',
    name: 'NTC Construction',
    contact: 'Nguyễn Trung',
    phone: '0908-123-456',
    email: 'info@ntc.vn',
    address: '123 Nguyễn Huệ',
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    lat: 10.7769,
    lng: 106.7009,
    specializations: ['Chống thấm', 'Sửa chữa kết cấu'],
    taxCode: '0301234567',
    bankAccount: '1234567890 - Vietcombank',
    status: 'active' as const,
    rating: 4.5,
    joinDate: '2023-06-15',
    totalProjects: 12,
    completedProjects: 9,
    totalRevenue: 4500000000,
    totalPaid: 3800000000,
};

const mockWorkers: Worker[] = [
    { id: 'w1', name: 'Trần Văn Hùng', phone: '0901-111-222', address: 'Quận 1, TP.HCM', specialization: 'Chống thấm', rating: 4.5, status: 'active', projectCount: 8 },
    { id: 'w2', name: 'Lê Minh Đức', phone: '0901-222-333', address: 'Quận 7, TP.HCM', specialization: 'Sơn Epoxy', rating: 4.2, status: 'active', projectCount: 5 },
    { id: 'w3', name: 'Nguyễn Thành Nam', phone: '0901-333-444', address: 'Bình Thạnh, TP.HCM', specialization: 'Sửa chữa kết cấu', rating: 4.8, status: 'active', projectCount: 10 },
    { id: 'w4', name: 'Phạm Quốc Bảo', phone: '0901-444-555', address: 'Quận 3, TP.HCM', specialization: 'Thi công nội thất', rating: 3.9, status: 'inactive', projectCount: 3 },
    { id: 'w5', name: 'Võ Thanh Sơn', phone: '0901-555-666', address: 'Gò Vấp, TP.HCM', specialization: 'Chống thấm', rating: 4.0, status: 'active', projectCount: 6 },
];

const mockProjectHistory: ProjectHistory[] = [
    { id: 'p1', code: 'DA-2025-001', name: 'Sửa chữa tầng 5 Sunrise', contractCode: 'HD-2025-001', contractName: 'HĐ Sửa chữa tầng 5', role: 'Thầu phụ chống thấm', startDate: '2025-01-15', endDate: '2025-04-15', status: 'in_progress', value: 280000000, rating: 4.5 },
    { id: 'p2', code: 'DA-2024-018', name: 'Chống thấm Block A Vinhomes', contractCode: 'HD-2024-015', contractName: 'HĐ Chống thấm Block A', role: 'Thầu phụ chính', startDate: '2024-10-01', endDate: '2025-01-31', status: 'completed', value: 450000000, rating: 4.8 },
    { id: 'p3', code: 'DA-2024-012', name: 'Sửa chữa kết cấu The Manor', contractCode: 'HD-2024-010', contractName: 'HĐ Bảo trì The Manor', role: 'Thầu phụ kết cấu', startDate: '2024-06-01', endDate: '2024-09-30', status: 'completed', value: 320000000, rating: 4.2 },
    { id: 'p4', code: 'DA-2024-008', name: 'Sơn Epoxy tầng hầm LM81', contractCode: 'HD-2024-005', contractName: 'HĐ Sơn Epoxy', role: 'Thầu phụ sơn', startDate: '2024-03-15', endDate: '2024-06-15', status: 'completed', value: 200000000, rating: 4.0 },
];

const mockMediaResources: MediaResource[] = [
    { id: 'm1', name: 'hinh_chong_tham_tang5_01.jpg', type: 'image', fileType: 'JPG', size: '2.4 MB', uploadDate: '2025-02-10', project: 'DA-2025-001' },
    { id: 'm2', name: 'hinh_chong_tham_tang5_02.jpg', type: 'image', fileType: 'JPG', size: '3.1 MB', uploadDate: '2025-02-10', project: 'DA-2025-001' },
    { id: 'm3', name: 'hinh_nghiem_thu_block_a.jpg', type: 'image', fileType: 'JPG', size: '1.8 MB', uploadDate: '2025-01-28', project: 'DA-2024-018' },
    { id: 'm4', name: 'hinh_ket_cau_manor_before.jpg', type: 'image', fileType: 'JPG', size: '2.0 MB', uploadDate: '2024-09-15', project: 'DA-2024-012' },
    { id: 'm5', name: 'hinh_son_epoxy_finished.jpg', type: 'image', fileType: 'PNG', size: '4.2 MB', uploadDate: '2024-06-10', project: 'DA-2024-008' },
    { id: 'm6', name: 'video_thi_cong_chong_tham.mp4', type: 'video', fileType: 'MP4', size: '48.5 MB', uploadDate: '2025-02-08', project: 'DA-2025-001', duration: '3:24' },
    { id: 'm7', name: 'video_nghiem_thu_block_a.mp4', type: 'video', fileType: 'MP4', size: '62.1 MB', uploadDate: '2025-01-25', project: 'DA-2024-018', duration: '5:12' },
    { id: 'm8', name: 'video_son_epoxy_process.mov', type: 'video', fileType: 'MOV', size: '120 MB', uploadDate: '2024-06-08', project: 'DA-2024-008', duration: '8:45' },
    { id: 'm9', name: 'bao_cao_tien_do_T01_2025.pdf', type: 'document', fileType: 'PDF', size: '1.2 MB', uploadDate: '2025-02-01', project: 'DA-2025-001' },
    { id: 'm10', name: 'bien_ban_nghiem_thu_block_a.docx', type: 'document', fileType: 'DOCX', size: '856 KB', uploadDate: '2025-01-30', project: 'DA-2024-018' },
    { id: 'm11', name: 'hop_dong_CTV_NTC.pdf', type: 'document', fileType: 'PDF', size: '2.5 MB', uploadDate: '2023-06-15', project: '—' },
    { id: 'm12', name: 'bang_doi_chieu_vat_tu.xlsx', type: 'document', fileType: 'XLSX', size: '345 KB', uploadDate: '2025-01-20', project: 'DA-2024-018' },
];

const mockPayments: PaymentRecord[] = [
    { id: 'tt1', code: 'TT-2025-001', project: 'Sửa chữa tầng 5 Sunrise', projectCode: 'DA-2025-001', batch: 'Đợt 1 - Tạm ứng', amount: 100000000, date: '2025-01-20', method: 'Chuyển khoản', status: 'paid' },
    { id: 'tt2', code: 'TT-2025-002', project: 'Sửa chữa tầng 5 Sunrise', projectCode: 'DA-2025-001', batch: 'Đợt 2 - Tiến độ 50%', amount: 120000000, date: '2025-02-05', method: 'Chuyển khoản', status: 'paid' },
    { id: 'tt3', code: 'TT-2025-003', project: 'Sửa chữa tầng 5 Sunrise', projectCode: 'DA-2025-001', batch: 'Đợt 3 - Nghiệm thu', amount: 60000000, date: '2025-03-01', method: 'Chuyển khoản', status: 'processing', note: 'Đang chờ duyệt phòng kế toán' },
    { id: 'tt4', code: 'TT-2024-018', project: 'Chống thấm Block A Vinhomes', projectCode: 'DA-2024-018', batch: 'Đợt 1 - Tạm ứng', amount: 150000000, date: '2024-10-10', method: 'Chuyển khoản', status: 'paid' },
    { id: 'tt5', code: 'TT-2024-019', project: 'Chống thấm Block A Vinhomes', projectCode: 'DA-2024-018', batch: 'Đợt 2 - Tiến độ 60%', amount: 180000000, date: '2024-12-01', method: 'Chuyển khoản', status: 'paid' },
    { id: 'tt6', code: 'TT-2024-020', project: 'Chống thấm Block A Vinhomes', projectCode: 'DA-2024-018', batch: 'Đợt 3 - Quyết toán', amount: 120000000, date: '2025-02-10', method: 'Chuyển khoản', status: 'pending', note: 'Chờ chốt khối lượng' },
    { id: 'tt7', code: 'TT-2024-010', project: 'Sửa chữa kết cấu The Manor', projectCode: 'DA-2024-012', batch: 'Thanh toán trọn gói', amount: 320000000, date: '2024-10-15', method: 'Chuyển khoản', status: 'paid' },
    { id: 'tt8', code: 'TT-2024-005', project: 'Sơn Epoxy tầng hầm LM81', projectCode: 'DA-2024-008', batch: 'Thanh toán trọn gói', amount: 200000000, date: '2024-07-01', method: 'Tiền mặt', status: 'paid' },
];

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const CollaboratorDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id: _id } = useParams();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [isEditing, setIsEditing] = useState(false);
    const [editForm] = Form.useForm();
    const [workerModalOpen, setWorkerModalOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
    const [workerForm] = Form.useForm();
    const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
    const [mediaSection, setMediaSection] = useState<string>('all');

    const collaborator = mockCollaborator;

    // ─── Worker handlers ──────────────────────────────────────────
    const openWorkerModal = (worker?: Worker) => {
        if (worker) {
            setEditingWorker(worker);
            workerForm.setFieldsValue(worker);
        } else {
            setEditingWorker(null);
            workerForm.resetFields();
        }
        setWorkerModalOpen(true);
    };

    const handleSaveWorker = () => {
        workerForm.validateFields().then((values) => {
            if (editingWorker) {
                setWorkers((prev) => prev.map((w) => w.id === editingWorker.id ? { ...w, ...values } : w));
                message.success('Cập nhật thợ thành công!');
            } else {
                setWorkers((prev) => [...prev, { ...values, id: Date.now().toString(), rating: 0, projectCount: 0, status: 'active' }]);
                message.success('Thêm thợ mới thành công!');
            }
            setWorkerModalOpen(false);
        });
    };

    const handleDeleteWorker = (wId: string) => {
        setWorkers((prev) => prev.filter((w) => w.id !== wId));
        message.success('Đã xóa thợ!');
    };

    // ─── Helpers ─────────────────────────────────────────────────────
    const mediaImages = mockMediaResources.filter((r) => r.type === 'image');
    const mediaVideos = mockMediaResources.filter((r) => r.type === 'video');
    const mediaDocs = mockMediaResources.filter((r) => r.type === 'document');
    const filteredMedia = mediaSection === 'all' ? mockMediaResources
        : mockMediaResources.filter((r) => r.type === mediaSection);

    const totalPaid = mockPayments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const totalProcessing = mockPayments.filter((p) => p.status === 'processing').reduce((s, p) => s + p.amount, 0);
    const totalPending = mockPayments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
    const totalPayments = mockPayments.reduce((s, p) => s + p.amount, 0);

    // ═══════════════════════════════════════════════════════════════
    // TAB 1: THÔNG TIN
    // ═══════════════════════════════════════════════════════════════
    const renderInfoTab = () => (
        <div>
            {/* Basic Info + Profile Card */}
            <Card
                title="Thông Tin Cơ Bản"
                extra={
                    isEditing ? (
                        <Space>
                            <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                            <Button type="primary" onClick={() => { setIsEditing(false); message.success('Đã cập nhật!'); }}>
                                Lưu
                            </Button>
                        </Space>
                    ) : (
                        <Button icon={<EditOutlined />} onClick={() => { setIsEditing(true); editForm.setFieldsValue(collaborator); }}>
                            Chỉnh sửa
                        </Button>
                    )
                }
            >
                {isEditing ? (
                    <Form form={editForm} layout="vertical">
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item name="name" label="Tên cộng tác viên" rules={[{ required: true }]}><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="contact" label="Người liên hệ" rules={[{ required: true }]}><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}><Input prefix={<PhoneOutlined />} /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="email" label="Email"><Input prefix={<MailOutlined />} /></Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="province" label="Tỉnh/Thành phố"><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="district" label="Quận/Huyện"><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="ward" label="Phường/Xã"><Input /></Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item name="address" label="Địa chỉ chi tiết"><Input prefix={<EnvironmentOutlined />} /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="taxCode" label="Mã số thuế"><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="bankAccount" label="Tài khoản ngân hàng"><Input /></Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item name="specializations" label="Chuyên môn">
                                    <Select mode="tags" placeholder="Nhập chuyên môn" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                ) : (
                    <Row gutter={[24, 16]}>
                        <Col xs={24} lg={16}>
                            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                                <Descriptions.Item label="Tên">{collaborator.name}</Descriptions.Item>
                                <Descriptions.Item label="Người liên hệ">{collaborator.contact}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại"><PhoneOutlined /> {collaborator.phone}</Descriptions.Item>
                                <Descriptions.Item label="Email"><MailOutlined /> {collaborator.email}</Descriptions.Item>
                                <Descriptions.Item label="Khu vực">{collaborator.province}, {collaborator.district}</Descriptions.Item>
                                <Descriptions.Item label="Phường/Xã">{collaborator.ward}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ" span={2}><EnvironmentOutlined /> {collaborator.address}</Descriptions.Item>
                                <Descriptions.Item label="Mã số thuế">{collaborator.taxCode}</Descriptions.Item>
                                <Descriptions.Item label="Ngân hàng">{collaborator.bankAccount}</Descriptions.Item>
                                <Descriptions.Item label="Chuyên môn" span={2}>
                                    {collaborator.specializations.map((s) => <Tag key={s} color="blue">{s}</Tag>)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày tham gia">{collaborator.joinDate}</Descriptions.Item>
                                <Descriptions.Item label="Đánh giá">
                                    <Rate disabled value={collaborator.rating} allowHalf style={{ fontSize: 14 }} />
                                    <span style={{ marginLeft: 8 }}>{collaborator.rating}/5</span>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card size="small" style={{ background: '#f0f5ff', borderColor: '#d6e4ff' }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <Avatar size={64} icon={<TeamOutlined />} style={{ background: '#1890ff', marginBottom: 8 }} />
                                        <div style={{ fontWeight: 600, fontSize: 16 }}>{collaborator.name}</div>
                                        <Tag color={collaborator.status === 'active' ? 'green' : 'default'}>
                                            {collaborator.status === 'active' ? 'Đang hoạt động' : 'Ngừng HĐ'}
                                        </Tag>
                                    </div>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Tổng dự án</span><strong>{collaborator.totalProjects}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Hoàn thành</span><strong style={{ color: '#52c41a' }}>{collaborator.completedProjects}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Tỷ lệ HT</span>
                                        <strong>{Math.round((collaborator.completedProjects / collaborator.totalProjects) * 100)}%</strong>
                                    </div>
                                    <Progress
                                        percent={Math.round((collaborator.completedProjects / collaborator.totalProjects) * 100)}
                                        size="small"
                                        status="active"
                                    />
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Card>

            {/* Workers Sub-section */}
            <Card
                title={<Space><ToolOutlined /> Thông Tin Thợ ({workers.length})</Space>}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openWorkerModal()}>
                        Thêm thợ
                    </Button>
                }
                style={{ marginTop: 16 }}
            >
                <Table
                    dataSource={workers}
                    columns={[
                        {
                            title: 'Thợ', dataIndex: 'name', key: 'name',
                            render: (name: string, record: Worker) => (
                                <Space>
                                    <Avatar style={{ background: '#1890ff' }} icon={<ToolOutlined />} />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{name}</div>
                                        <div style={{ fontSize: 12, color: '#888' }}>{record.specialization}</div>
                                    </div>
                                </Space>
                            ),
                        },
                        { title: 'SĐT', dataIndex: 'phone', key: 'phone', responsive: ['md' as const] },
                        { title: 'Địa chỉ', dataIndex: 'address', key: 'address', responsive: ['lg' as const] },
                        {
                            title: 'Đánh giá', dataIndex: 'rating', key: 'rating',
                            render: (r: number) => <Rate disabled value={r} allowHalf style={{ fontSize: 12 }} />,
                            responsive: ['md' as const],
                        },
                        {
                            title: 'Dự án', dataIndex: 'projectCount', key: 'projectCount',
                            responsive: ['md' as const],
                        },
                        {
                            title: 'Trạng thái', dataIndex: 'status', key: 'status',
                            render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? 'Hoạt động' : 'Ngừng'}</Tag>,
                        },
                        {
                            title: 'Thao tác', key: 'action',
                            render: (_: unknown, record: Worker) => (
                                <Space>
                                    <Button size="small" icon={<EditOutlined />} onClick={() => openWorkerModal(record)} />
                                    <Popconfirm title="Xóa thợ này?" onConfirm={() => handleDeleteWorker(record.id)}>
                                        <Button size="small" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </Space>
                            ),
                        },
                    ]}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 600 }}
                />
            </Card>
        </div>
    );

    // ═══════════════════════════════════════════════════════════════
    // TAB 2: LỊCH SỬ DỰ ÁN & HỢP ĐỒNG
    // ═══════════════════════════════════════════════════════════════
    const renderProjectContractTab = () => (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Tổng dự án" value={collaborator.totalProjects} prefix={<ProjectOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Hoàn thành" value={collaborator.completedProjects} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Đang thực hiện" value={collaborator.totalProjects - collaborator.completedProjects} valueStyle={{ color: '#1890ff' }} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Tổng doanh thu" value={collaborator.totalRevenue / 1e9} suffix="tỷ" precision={1} prefix={<DollarOutlined />} /></Card>
                </Col>
            </Row>

            <Card title={<Space><ProjectOutlined /> Lịch Sử Dự Án & Hợp Đồng</Space>}>
                <Table
                    dataSource={mockProjectHistory}
                    columns={[
                        {
                            title: 'Mã DA', dataIndex: 'code', key: 'code', width: 130,
                            render: (code: string) => <a style={{ fontWeight: 500 }}>{code}</a>,
                        },
                        {
                            title: 'Dự án', dataIndex: 'name', key: 'name', ellipsis: true,
                            render: (name: string, record: ProjectHistory) => (
                                <div>
                                    <div style={{ fontWeight: 500 }}>{name}</div>
                                    <div style={{ fontSize: 12, color: '#888' }}>{record.role}</div>
                                </div>
                            ),
                        },
                        {
                            title: 'Hợp đồng', key: 'contract',
                            render: (_: unknown, r: ProjectHistory) => (
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}><FileTextOutlined /> {r.contractCode}</div>
                                    <div style={{ fontSize: 12, color: '#888' }}>{r.contractName}</div>
                                </div>
                            ),
                            responsive: ['md' as const],
                        },
                        {
                            title: 'Thời gian', key: 'period',
                            render: (_: unknown, r: ProjectHistory) => (
                                <span style={{ fontSize: 12 }}>{r.startDate} → {r.endDate}</span>
                            ),
                            responsive: ['lg' as const],
                        },
                        {
                            title: 'Giá trị', dataIndex: 'value', key: 'value',
                            render: (v: number) => <Text strong style={{ color: '#1890ff' }}>{formatCurrency(v)}</Text>,
                            responsive: ['md' as const],
                        },
                        {
                            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 130,
                            render: (s: string) => {
                                const map: Record<string, { color: string; label: string }> = {
                                    completed: { color: 'success', label: 'Hoàn thành' },
                                    in_progress: { color: 'processing', label: 'Đang thực hiện' },
                                    pending: { color: 'default', label: 'Chờ bắt đầu' },
                                };
                                return <Tag color={map[s]?.color}>{map[s]?.label}</Tag>;
                            },
                        },
                        {
                            title: 'Đánh giá', dataIndex: 'rating', key: 'rating',
                            render: (r: number) => <Rate disabled value={r} allowHalf style={{ fontSize: 12 }} />,
                            responsive: ['lg' as const],
                        },
                    ]}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 700 }}
                />
            </Card>

            {/* Performance breakdown */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                    <Card title="Phân bổ chuyên môn" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {[
                                { name: 'Chống thấm', count: 6, percent: 50 },
                                { name: 'Sửa chữa kết cấu', count: 3, percent: 25 },
                                { name: 'Sơn Epoxy', count: 2, percent: 17 },
                                { name: 'Thi công nội thất', count: 1, percent: 8 },
                            ].map((s) => (
                                <div key={s.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <span>{s.name}</span>
                                        <span>{s.count} dự án</span>
                                    </div>
                                    <Progress percent={s.percent} size="small" />
                                </div>
                            ))}
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Đánh giá theo dự án" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {mockProjectHistory.map((p) => (
                                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 13 }}>{p.code} – {p.name.substring(0, 25)}...</span>
                                    <Rate disabled value={p.rating} allowHalf style={{ fontSize: 12 }} />
                                </div>
                            ))}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    // ═══════════════════════════════════════════════════════════════
    // TAB 3: KHO TÀI NGUYÊN
    // ═══════════════════════════════════════════════════════════════
    const renderResourcesTab = () => (
        <div>
            {/* Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Tổng file" value={mockMediaResources.length} prefix={<FileOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Ảnh" value={mediaImages.length} prefix={<PictureOutlined />} valueStyle={{ color: '#1890ff' }} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Video" value={mediaVideos.length} prefix={<VideoCameraOutlined />} valueStyle={{ color: '#722ed1' }} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Tài liệu" value={mediaDocs.length} prefix={<FileTextOutlined />} valueStyle={{ color: '#fa8c16' }} /></Card>
                </Col>
            </Row>

            <Card
                title="Kho Tài Nguyên"
                extra={
                    <Button type="primary" icon={<CloudUploadOutlined />}>
                        Upload
                    </Button>
                }
            >
                <div style={{ marginBottom: 16 }}>
                    <Segmented
                        value={mediaSection}
                        onChange={(v) => setMediaSection(v as string)}
                        options={[
                            { label: `Tất cả (${mockMediaResources.length})`, value: 'all' },
                            { label: `Ảnh (${mediaImages.length})`, value: 'image', icon: <PictureOutlined /> },
                            { label: `Video (${mediaVideos.length})`, value: 'video', icon: <VideoCameraOutlined /> },
                            { label: `Tài liệu (${mediaDocs.length})`, value: 'document', icon: <FileTextOutlined /> },
                        ]}
                    />
                </div>

                {/* Image Grid */}
                {(mediaSection === 'all' || mediaSection === 'image') && mediaImages.length > 0 && (
                    <>
                        {mediaSection === 'all' && <Divider orientation="left" plain><PictureOutlined /> Ảnh</Divider>}
                        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                            {mediaImages.map((img) => (
                                <Col xs={12} sm={8} md={6} key={img.id}>
                                    <Card
                                        size="small"
                                        hoverable
                                        cover={
                                            <div style={{
                                                height: 120, background: 'linear-gradient(135deg, #e6f4ff, #d6e4ff)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <PictureOutlined style={{ fontSize: 36, color: '#1890ff' }} />
                                            </div>
                                        }
                                        actions={[
                                            <EyeOutlined key="view" />,
                                            <DownloadOutlined key="download" />,
                                        ]}
                                    >
                                        <Card.Meta
                                            title={<Text ellipsis style={{ fontSize: 12 }}>{img.name}</Text>}
                                            description={
                                                <div style={{ fontSize: 11, color: '#888' }}>
                                                    <div>{img.size} • {img.fileType}</div>
                                                    <div><CalendarOutlined /> {img.uploadDate}</div>
                                                    <Tag color="blue" style={{ fontSize: 10, marginTop: 2 }}>{img.project}</Tag>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}

                {/* Video List */}
                {(mediaSection === 'all' || mediaSection === 'video') && mediaVideos.length > 0 && (
                    <>
                        {mediaSection === 'all' && <Divider orientation="left" plain><VideoCameraOutlined /> Video</Divider>}
                        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                            {mediaVideos.map((vid) => (
                                <Col xs={24} sm={12} md={8} key={vid.id}>
                                    <Card size="small" hoverable>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <div style={{
                                                width: 80, height: 56, borderRadius: 6,
                                                background: 'linear-gradient(135deg, #f9f0ff, #efdbff)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <PlayCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <Text ellipsis style={{ fontWeight: 500, fontSize: 13, display: 'block' }}>{vid.name}</Text>
                                                <div style={{ fontSize: 11, color: '#888' }}>
                                                    {vid.duration} • {vid.size} • {vid.fileType}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#888' }}>
                                                    <CalendarOutlined /> {vid.uploadDate}
                                                    <Tag color="purple" style={{ fontSize: 10, marginLeft: 6 }}>{vid.project}</Tag>
                                                </div>
                                            </div>
                                            <Button size="small" icon={<DownloadOutlined />} />
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}

                {/* Document Table */}
                {(mediaSection === 'all' || mediaSection === 'document') && mediaDocs.length > 0 && (
                    <>
                        {mediaSection === 'all' && <Divider orientation="left" plain><FileTextOutlined /> Tài liệu</Divider>}
                        <Table
                            dataSource={mediaDocs}
                            columns={[
                                {
                                    title: 'Tên file', dataIndex: 'name', key: 'name',
                                    render: (name: string) => (
                                        <Space>
                                            <FileTextOutlined style={{ color: '#fa8c16' }} />
                                            <Text style={{ fontWeight: 500 }}>{name}</Text>
                                        </Space>
                                    ),
                                },
                                { title: 'Loại', dataIndex: 'fileType', key: 'fileType', width: 80 },
                                { title: 'Kích thước', dataIndex: 'size', key: 'size', width: 100, responsive: ['md' as const] },
                                { title: 'Ngày upload', dataIndex: 'uploadDate', key: 'uploadDate', width: 120 },
                                {
                                    title: 'Dự án', dataIndex: 'project', key: 'project', width: 130,
                                    render: (p: string) => p !== '—' ? <Tag color="orange">{p}</Tag> : <Text type="secondary">—</Text>,
                                    responsive: ['md' as const],
                                },
                                {
                                    title: '', key: 'action', width: 50,
                                    render: () => <Button size="small" icon={<DownloadOutlined />} type="link" />,
                                },
                            ]}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </>
                )}

                {filteredMedia.length === 0 && <Empty description="Chưa có tài nguyên" />}
            </Card>
        </div>
    );

    // ═══════════════════════════════════════════════════════════════
    // TAB 4: LỊCH SỬ THANH TOÁN
    // ═══════════════════════════════════════════════════════════════
    const renderPaymentTab = () => (
        <div>
            {/* Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Tổng tiền" value={totalPayments / 1e9} suffix="tỷ" precision={2} prefix={<DollarOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Đã thanh toán" value={totalPaid / 1e9} suffix="tỷ" precision={2} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small"><Statistic title="Đang xử lý" value={totalProcessing / 1e6} suffix="tr" precision={0} valueStyle={{ color: '#fa8c16' }} prefix={<CreditCardOutlined />} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderColor: totalPending > 0 ? '#ff4d4f' : undefined }}>
                        <Statistic title="Công nợ" value={totalPending / 1e6} suffix="tr" precision={0} valueStyle={{ color: '#ff4d4f' }} prefix={<BankOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Payment Progress */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Tiến độ thanh toán tổng</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(totalPaid)} / {formatCurrency(totalPayments)}</span>
                </div>
                <Progress
                    percent={Math.round((totalPaid / totalPayments) * 100)}
                    status="active"
                    strokeColor={{ '0%': '#108ee9', '100%': '#52c41a' }}
                />
            </Card>

            {/* Payment Table */}
            <Card title={<Space><DollarOutlined /> Lịch Sử Thanh Toán</Space>}>
                <Table
                    dataSource={mockPayments}
                    columns={[
                        {
                            title: 'Mã TT', dataIndex: 'code', key: 'code', width: 130,
                            render: (code: string) => <Text strong style={{ color: '#1890ff' }}>{code}</Text>,
                        },
                        {
                            title: 'Dự án', key: 'project',
                            render: (_: unknown, r: PaymentRecord) => (
                                <div>
                                    <div style={{ fontWeight: 500, fontSize: 13 }}>{r.projectCode}</div>
                                    <div style={{ fontSize: 12, color: '#888' }}>{r.project}</div>
                                </div>
                            ),
                        },
                        {
                            title: 'Đợt TT', dataIndex: 'batch', key: 'batch',
                            responsive: ['md' as const],
                        },
                        {
                            title: 'Số tiền', dataIndex: 'amount', key: 'amount',
                            render: (v: number) => <Text strong>{formatCurrency(v)}</Text>,
                        },
                        {
                            title: 'Ngày TT', dataIndex: 'date', key: 'date', width: 110,
                            responsive: ['md' as const],
                        },
                        {
                            title: 'Phương thức', dataIndex: 'method', key: 'method', width: 120,
                            responsive: ['lg' as const],
                        },
                        {
                            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 130,
                            render: (s: string) => {
                                const map: Record<string, { color: string; label: string }> = {
                                    paid: { color: 'success', label: 'Đã thanh toán' },
                                    processing: { color: 'warning', label: 'Đang xử lý' },
                                    pending: { color: 'default', label: 'Chờ duyệt' },
                                    rejected: { color: 'error', label: 'Từ chối' },
                                };
                                return <Tag color={map[s]?.color}>{map[s]?.label}</Tag>;
                            },
                        },
                    ]}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 700 }}
                    expandable={{
                        expandedRowRender: (record) => record.note ? (
                            <div style={{ padding: '4px 0', color: '#666', fontSize: 13 }}>
                                📝 {record.note}
                            </div>
                        ) : null,
                        rowExpandable: (record) => !!record.note,
                    }}
                />
            </Card>

            {/* Recent Activity */}
            <Card title="Hoạt động thanh toán gần đây" size="small" style={{ marginTop: 16 }}>
                <Timeline
                    items={[
                        { color: 'green', children: <><strong>TT-2025-002</strong> — Thanh toán 120,000,000 VNĐ (Đợt 2 - DA-2025-001) <br /><span style={{ color: '#888', fontSize: 12 }}>05/02/2025</span></> },
                        { color: 'orange', children: <><strong>TT-2025-003</strong> — Chờ duyệt 60,000,000 VNĐ (Đợt 3 - DA-2025-001) <br /><span style={{ color: '#888', fontSize: 12 }}>01/03/2025</span></> },
                        { color: 'green', children: <><strong>TT-2024-020</strong> — Chờ chốt khối lượng 120,000,000 VNĐ (DA-2024-018) <br /><span style={{ color: '#888', fontSize: 12 }}>10/02/2025</span></> },
                        { color: 'green', children: <><strong>TT-2024-010</strong> — Thanh toán trọn gói 320,000,000 VNĐ (DA-2024-012) <br /><span style={{ color: '#888', fontSize: 12 }}>15/10/2024</span></> },
                    ]}
                />
            </Card>
        </div>
    );

    // ─── Render ────────────────────────────────────────────────────
    return (
        <div>
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/ql/teams/outsource')}>
                        {!isMobile && 'Quay lại'}
                    </Button>
                    <h2 style={{ margin: 0 }}>Hồ Sơ Cộng Tác Viên</h2>
                </Space>
                <Tag color={collaborator.status === 'active' ? 'green' : 'default'} style={{ fontSize: 14, padding: '4px 12px' }}>
                    {collaborator.status === 'active' ? 'Đang hoạt động' : 'Ngừng HĐ'}
                </Tag>
            </Row>

            <Tabs
                defaultActiveKey="info"
                type="card"
                items={[
                    {
                        key: 'info',
                        label: 'Thông tin',
                        icon: <UserOutlined />,
                        children: renderInfoTab(),
                    },
                    {
                        key: 'history',
                        label: 'Lịch sử DA & HĐ',
                        icon: <ProjectOutlined />,
                        children: renderProjectContractTab(),
                    },
                    {
                        key: 'resources',
                        label: (
                            <Badge count={mockMediaResources.length} size="small" offset={[8, -2]}>
                                Kho tài nguyên
                            </Badge>
                        ),
                        icon: <FileOutlined />,
                        children: renderResourcesTab(),
                    },
                    {
                        key: 'payments',
                        label: (
                            <Badge count={totalPending > 0 ? '!' : 0} size="small" offset={[8, -2]}>
                                Lịch sử thanh toán
                            </Badge>
                        ),
                        icon: <DollarOutlined />,
                        children: renderPaymentTab(),
                    },
                ]}
            />

            {/* ═══ Worker Modal ═══ */}
            <Modal
                title={editingWorker ? 'Chỉnh Sửa Thợ' : 'Thêm Thợ Mới'}
                open={workerModalOpen}
                onCancel={() => setWorkerModalOpen(false)}
                onOk={handleSaveWorker}
                okText={editingWorker ? 'Cập nhật' : 'Thêm'}
                cancelText="Hủy"
                width={500}
                destroyOnClose
            >
                <Form form={workerForm} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                                <Input placeholder="VD: Nguyễn Văn A" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                                <Input placeholder="VD: 0901-234-567" prefix={<PhoneOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="address" label="Địa chỉ">
                        <Input placeholder="VD: Quận 1, TP.HCM" prefix={<EnvironmentOutlined />} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="specialization" label="Chuyên môn" rules={[{ required: true }]}>
                                <Select placeholder="Chọn chuyên môn">
                                    <Option value="Chống thấm">Chống thấm</Option>
                                    <Option value="Sửa chữa kết cấu">Sửa chữa kết cấu</Option>
                                    <Option value="Sơn Epoxy">Sơn Epoxy</Option>
                                    <Option value="Thi công nội thất">Thi công nội thất</Option>
                                    <Option value="Điện">Điện</Option>
                                    <Option value="Nước">Nước</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="status" label="Trạng thái" initialValue="active">
                                <Select>
                                    <Option value="active">Hoạt động</Option>
                                    <Option value="inactive">Ngừng hoạt động</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default CollaboratorDetail;
