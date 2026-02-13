import React, { useState } from 'react';
import {
    Card, Row, Col, Descriptions, Tag, Button, Space, Table, Statistic,
    Tabs, Rate, Avatar, Form, Input, Select, Modal, message, Divider,
    Popconfirm, Progress, Timeline, Grid,
} from 'antd';
import {
    ArrowLeftOutlined, EditOutlined, PlusOutlined, DeleteOutlined,
    PhoneOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined,
    ProjectOutlined, DollarOutlined, FileTextOutlined, UserOutlined,
    CheckCircleOutlined, ToolOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { useBreakpoint } = Grid;

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

    // ─── Tab: Thông tin cơ bản ─────────────────────────────────────
    const renderBasicInfo = () => (
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
                            <Form.Item name="name" label="Tên cộng tác viên" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="contact" label="Người liên hệ" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                                <Input prefix={<PhoneOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="email" label="Email">
                                <Input prefix={<MailOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="province" label="Tỉnh/Thành phố">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="district" label="Quận/Huyện">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="ward" label="Phường/Xã">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item name="address" label="Địa chỉ chi tiết">
                                <Input prefix={<EnvironmentOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="taxCode" label="Mã số thuế">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="bankAccount" label="Tài khoản ngân hàng">
                                <Input />
                            </Form.Item>
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
                            </Space>
                        </Card>
                    </Col>
                </Row>
            )}
        </Card>
    );

    // ─── Tab: Lịch sử công trình ──────────────────────────────────
    const renderProjectHistory = () => {
        const historyColumns = [
            {
                title: 'Mã DA', dataIndex: 'code', key: 'code', width: 120,
                render: (code: string) => <a style={{ fontWeight: 500 }}>{code}</a>,
            },
            {
                title: 'Tên DA', dataIndex: 'name', key: 'name', ellipsis: true,
                render: (name: string, record: ProjectHistory) => (
                    <div>
                        <div style={{ fontWeight: 500 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{record.role}</div>
                    </div>
                ),
            },
            {
                title: 'Hợp đồng', key: 'contract',
                render: (_: any, r: ProjectHistory) => (
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}><FileTextOutlined /> {r.contractCode}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{r.contractName}</div>
                    </div>
                ),
                responsive: ['md' as const],
            },
            {
                title: 'Thời gian', key: 'period',
                render: (_: any, r: ProjectHistory) => <span style={{ fontSize: 12 }}>{r.startDate} → {r.endDate}</span>,
                responsive: ['lg' as const],
            },
            {
                title: 'Giá trị', dataIndex: 'value', key: 'value',
                render: (v: number) => <span style={{ fontWeight: 500, color: '#1890ff' }}>{formatCurrency(v)}</span>,
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
        ];

        return (
            <Card title={<Space><ProjectOutlined /> Lịch Sử Công Trình</Space>}>
                <Table
                    dataSource={mockProjectHistory}
                    columns={historyColumns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 700 }}
                />
            </Card>
        );
    };

    // ─── Tab: Dashboard ────────────────────────────────────────────
    const renderDashboard = () => (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic title="Tổng dự án" value={collaborator.totalProjects} prefix={<ProjectOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic title="Hoàn thành" value={collaborator.completedProjects} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic title="Tổng doanh thu" value={collaborator.totalRevenue / 1e9} suffix="tỷ" precision={1} prefix={<DollarOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic title="Đã thanh toán" value={collaborator.totalPaid / 1e9} suffix="tỷ" precision={1} valueStyle={{ color: '#1890ff' }} prefix={<DollarOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Tiến độ thanh toán" size="small">
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span>Đã thanh toán</span>
                                <span>{formatCurrency(collaborator.totalPaid)}</span>
                            </div>
                            <Progress percent={Math.round((collaborator.totalPaid / collaborator.totalRevenue) * 100)} status="active" />
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span>Còn lại</span>
                                <span>{formatCurrency(collaborator.totalRevenue - collaborator.totalPaid)}</span>
                            </div>
                            <Progress percent={Math.round(((collaborator.totalRevenue - collaborator.totalPaid) / collaborator.totalRevenue) * 100)} strokeColor="#faad14" />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Hoạt động gần đây" size="small">
                        <Timeline
                            items={[
                                { color: 'green', children: <><strong>DA-2025-001</strong> — Nghiệm thu chống thấm tầng 5 <br /><span style={{ color: '#888', fontSize: 12 }}>2 ngày trước</span></> },
                                { color: 'blue', children: <><strong>DA-2025-001</strong> — Bổ sung 2 thợ thêm <br /><span style={{ color: '#888', fontSize: 12 }}>5 ngày trước</span></> },
                                { color: 'green', children: <><strong>Thanh toán</strong> — Nhận 120,000,000 VNĐ (đợt 2) <br /><span style={{ color: '#888', fontSize: 12 }}>1 tuần trước</span></> },
                                { color: 'blue', children: <><strong>Tài liệu</strong> — Nộp báo cáo tiến độ tháng 1 <br /><span style={{ color: '#888', fontSize: 12 }}>2 tuần trước</span></> },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

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

    // ─── Tab: Thông tin thợ ─────────────────────────────────────────
    const renderWorkers = () => {
        const workerColumns = [
            {
                title: 'Thợ',
                dataIndex: 'name',
                key: 'name',
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
                render: (_: any, record: Worker) => (
                    <Space>
                        <Button size="small" icon={<EditOutlined />} onClick={() => openWorkerModal(record)} />
                        <Popconfirm title="Xóa thợ này?" onConfirm={() => handleDeleteWorker(record.id)}>
                            <Button size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

        return (
            <Card
                title={<Space><ToolOutlined /> Thông Tin Thợ ({workers.length})</Space>}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openWorkerModal()}>
                        Thêm thợ
                    </Button>
                }
            >
                <Table
                    dataSource={workers}
                    columns={workerColumns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 600 }}
                />
            </Card>
        );
    };

    // ─── Render ────────────────────────────────────────────────────
    return (
        <div>
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pm/teams/outsource')}>
                        {!isMobile && 'Quay lại'}
                    </Button>
                    <h2 style={{ margin: 0 }}>Chi Tiết Cộng Tác Viên</h2>
                </Space>
                <Tag color={collaborator.status === 'active' ? 'green' : 'default'} style={{ fontSize: 14, padding: '4px 12px' }}>
                    {collaborator.status === 'active' ? 'Đang hoạt động' : 'Ngừng HĐ'}
                </Tag>
            </Row>

            <Tabs
                defaultActiveKey="info"
                type="card"
                items={[
                    { key: 'info', label: 'Thông tin', icon: <UserOutlined />, children: renderBasicInfo() },
                    { key: 'history', label: 'Lịch sử công trình', icon: <ProjectOutlined />, children: renderProjectHistory() },
                    { key: 'dashboard', label: 'Dashboard', icon: <DollarOutlined />, children: renderDashboard() },
                    { key: 'workers', label: 'Thông tin thợ', icon: <ToolOutlined />, children: renderWorkers() },
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
