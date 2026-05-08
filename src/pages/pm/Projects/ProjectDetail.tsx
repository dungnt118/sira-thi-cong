// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Descriptions, Tag, Tabs, Table, Progress, Statistic,
    Button, Space, Timeline, Badge, Typography, Divider, Segmented, Empty,
    Upload, Image, Steps, Modal, Input, message,
} from 'antd';
import {
    ArrowLeftOutlined, EditOutlined, TeamOutlined,
    EnvironmentOutlined, CalendarOutlined, FileTextOutlined,
    EyeOutlined, ToolOutlined,
    FolderOpenOutlined, PictureOutlined, VideoCameraOutlined,
    FileOutlined, UnorderedListOutlined, AppstoreAddOutlined,
    UploadOutlined, DeleteOutlined, LinkOutlined,
    LockOutlined, CloseCircleOutlined, CheckCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import { mockProjects as defaultProjects } from '../../../data/mockData';

const { Text, Title } = Typography;
const { TextArea } = Input;

/* ====== STATUS CONFIG ====== */
type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';

const PROJECT_STATUSES: { key: ProjectStatus; label: string }[] = [
    { key: 'draft', label: 'Bản nháp' },
    { key: 'in_progress', label: 'Đang thi công' },
    { key: 'completed', label: 'Hoàn thành' },
];

const statusTagMap: Record<ProjectStatus, { color: string; label: string }> = {
    draft: { color: 'default', label: 'Bản nháp' },
    in_progress: { color: 'processing', label: 'Đang thi công' },
    completed: { color: 'success', label: 'Hoàn thành' },
    cancelled: { color: 'error', label: 'Đã hủy' },
};

const getStepCurrent = (status: ProjectStatus) => {
    if (status === 'draft') return 0;
    if (status === 'in_progress') return 1;
    if (status === 'completed') return 2;
    return -1; // cancelled
};

/* ====== MOCK DATA ====== */
const defaultDetail = {
    id: 'DU-2026-001',
    code: 'DU-2026-001',
    name: 'Chống thấm Chung cư Sunrise',
    status: 'DRAFT',
    progress: 72, qualityScore: 82,
    contract: {
        id: 'c1', code: 'HD-2025-001', name: 'Hợp đồng sửa chữa tầng 5',
        customerName: 'Chung cư Sunrise City', value: 1200000000,
        startDate: '01/03/2025', endDate: '30/06/2025',
    },
    address: '123 Nguyễn Hữu Thọ, Quận 7, TP. Hồ Chí Minh',
    startDate: '2026-01-15', endDate: '2026-03-15',
    budget: 120000000, spent: 78000000,
    constructionSource: 'collaborator' as string,
    collaboratorName: 'Cty TNHH Xây dựng Phú Thành',
    supervisor: 'Trần Thị B',
    description: 'Dự án chống thấm toàn bộ khu vực tầng hầm và mái nhà Chung cư Sunrise City.',
};

const teamMembers = [
    { key: '1', name: 'Trần Minh Hoàng', phone: '0912345001', skill: 'Xây dựng', role: 'Tổ trưởng' },
    { key: '2', name: 'Nguyễn Đức Phong', phone: '0912345002', skill: 'Chống thấm', role: 'Thợ chính' },
    { key: '3', name: 'Lý Thanh Sơn', phone: '0912345003', skill: 'Ốp lát', role: 'Thợ phụ' },
];

const materialsList = [
    { key: '1', name: 'Xi măng PCB40', unit: 'Bao', quantity: 50, unitPrice: 120000 },
    { key: '2', name: 'Sơn chống thấm', unit: 'Thùng', quantity: 10, unitPrice: 850000 },
    { key: '3', name: 'Keo chống thấm PU', unit: 'Lít', quantity: 30, unitPrice: 350000 },
    { key: '4', name: 'Lưới chống nứt', unit: 'Cuộn', quantity: 5, unitPrice: 280000 },
];

const evidenceItems = [
    { key: '1', stage: 'Trước thi công', count: 12, approved: 10, rejected: 1, pending: 1 },
    { key: '2', stage: 'Trong thi công', count: 25, approved: 18, rejected: 2, pending: 5 },
    { key: '3', stage: 'Sau thi công', count: 0, approved: 0, rejected: 0, pending: 0 },
];

const qualityIssues = [
    { key: '1', title: 'Vết nứt bề mặt khu vực A3', severity: 'Trung bình', status: 'Đang xử lý', reportedBy: 'Trần Thị B', date: '2026-02-08' },
    { key: '2', title: 'Bóng khí dưới lớp chống thấm', severity: 'Nhẹ', status: 'Đã đóng', reportedBy: 'Trần Thị B', date: '2026-02-01' },
];

const activityLog = [
    { time: '2026-02-13 08:30', action: 'Giám sát Trần Thị B tải lên 5 tư liệu mới', type: 'evidence' },
    { time: '2026-02-12 16:00', action: 'CTV cập nhật tiến độ: 72%', type: 'progress' },
    { time: '2026-02-10 10:00', action: 'Cập nhật chi phí vật tư: +2.8 triệu', type: 'payment' },
    { time: '2026-02-08 14:00', action: 'Báo cáo vấn đề chất lượng: Vết nứt bề mặt A3', type: 'quality' },
    { time: '2026-02-05 09:00', action: 'Phân công Giám sát viên Trần Thị B', type: 'team' },
];

const mockDocuments = [
    { key: '1', name: 'Bản vẽ mặt bằng tầng 5.pdf', type: 'document', size: '2.4 MB', date: '01/03/2025', category: 'Bản vẽ' },
    { key: '2', name: 'Hiện trạng sảnh chính.jpg', type: 'image', size: '1.8 MB', date: '02/03/2025', category: 'Khảo sát' },
    { key: '3', name: 'Video khảo sát thực tế.mp4', type: 'video', size: '45 MB', date: '02/03/2025', category: 'Khảo sát' },
    { key: '4', name: 'Hợp đồng ký scan.pdf', type: 'document', size: '3.1 MB', date: '28/02/2025', category: 'Hợp đồng' },
    { key: '5', name: 'Ảnh vết nứt tường B2.jpg', type: 'image', size: '2.1 MB', date: '03/03/2025', category: 'Khảo sát' },
    { key: '6', name: 'Drone overview block A.mp4', type: 'video', size: '120 MB', date: '03/03/2025', category: 'Khảo sát' },
];

/* ====== HELPERS ====== */
const getDocIcon = (type: string) => {
    if (type === 'image') return <PictureOutlined style={{ fontSize: 24, color: '#52c41a' }} />;
    if (type === 'video') return <VideoCameraOutlined style={{ fontSize: 24, color: '#fa8c16' }} />;
    return <FileOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
};
const getDocTag = (type: string) => {
    if (type === 'image') return <Tag color="green">Ảnh</Tag>;
    if (type === 'video') return <Tag color="orange">Video</Tag>;
    return <Tag color="blue">Tài liệu</Tag>;
};

/* ====== COMPONENT ====== */
const ProjectDetail: React.FC = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [mockProjects, setMockProjects] = useLocalStorageData<any[]>(demoDataService.KEYS.PROJECTS, defaultProjects);

    const projectData = mockProjects.find(p => p.id === projectId || p.code === projectId) || defaultDetail;

    /* Status state */
    const initialStatus = (projectData.status || 'DRAFT').toLowerCase() as ProjectStatus;
    const [projectStatus, setProjectStatus] = useState<ProjectStatus>(initialStatus);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const updateProjectStatus = (newStatus: ProjectStatus) => {
        setProjectStatus(newStatus);
        const updatedProjects = mockProjects.map(p =>
            (p.id === projectData.id) ? { ...p, status: newStatus.toUpperCase() } : p
        );
        setMockProjects(updatedProjects);
    };

    const isDraft = projectStatus === 'draft';
    const isInProgress = projectStatus === 'in_progress';
    const isCancelled = projectStatus === 'cancelled';
    const isCompleted = projectStatus === 'completed';
    const isLocked = !isDraft; // any non-draft is considered locked

    const sevColor: Record<string, string> = { 'Nặng': 'red', 'Trung bình': 'orange', 'Nhẹ': 'green' };

    /* Materials totals */
    const totalMaterialCost = materialsList.reduce((s, m) => s + m.quantity * m.unitPrice, 0);
    const laborCost = 25000000;
    const otherCost = 5000000;
    const totalBudget = totalMaterialCost + laborCost + otherCost;

    /* Document library state */
    const [docViewMode, setDocViewMode] = useState<'grid' | 'list'>('grid');
    const [docCategory, setDocCategory] = useState('all');
    const filteredDocs = docCategory === 'all' ? mockDocuments : mockDocuments.filter((d) => d.type === docCategory);
    const docTabItems = [
        { key: 'all', label: 'Tất cả', icon: <FolderOpenOutlined /> },
        { key: 'image', label: `Ảnh (${mockDocuments.filter((d) => d.type === 'image').length})`, icon: <PictureOutlined /> },
        { key: 'video', label: `Video (${mockDocuments.filter((d) => d.type === 'video').length})`, icon: <VideoCameraOutlined /> },
        { key: 'document', label: `Tài liệu (${mockDocuments.filter((d) => d.type === 'document').length})`, icon: <FileOutlined /> },
    ];

    /* ─── Action Handlers ─── */
    const handleLock = () => {
        Modal.confirm({
            title: 'Xác nhận Khóa Dự án',
            icon: <LockOutlined style={{ color: '#faad14' }} />,
            content: 'Sau khi khóa, dự án sẽ chuyển sang trạng thái "Đang thi công" và không thể chỉnh sửa thông tin cơ bản. Bạn có chắc chắn?',
            okText: 'Khóa dự án',
            cancelText: 'Hủy',
            onOk: () => {
                updateProjectStatus('in_progress');
                message.success('Dự án đã được khóa và chuyển sang "Đang thi công"');
            },
        });
    };

    const handleComplete = () => {
        Modal.confirm({
            title: 'Xác nhận Hoàn thành Dự án',
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            content: 'Xác nhận rằng dự án đã hoàn thành mọi hạng mục và sẵn sàng nghiệm thu?',
            okText: 'Hoàn thành',
            cancelText: 'Hủy',
            onOk: () => {
                updateProjectStatus('completed');
                message.success('Dự án đã được đánh dấu Hoàn thành');
            },
        });
    };

    const handleCancelSubmit = () => {
        if (!cancelReason.trim()) {
            message.warning('Vui lòng nhập lý do hủy dự án');
            return;
        }
        updateProjectStatus('cancelled');
        setCancelModalOpen(false);
        setCancelReason('');
        message.success('Dự án đã bị hủy');
    };

    return (
        <div>
            {/* ─── Status Steps Bar ─── */}
            <Card size="small" style={{ marginBottom: 16 }}>
                {isCancelled ? (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                        <Tag color="error" icon={<CloseCircleOutlined />} style={{ fontSize: 14, padding: '4px 16px' }}>
                            Dự án đã bị HỦY
                        </Tag>
                    </div>
                ) : (
                    <Steps
                        current={getStepCurrent(projectStatus)}
                        size="small"
                        items={PROJECT_STATUSES.map((s) => ({
                            title: s.label,
                            status:
                                s.key === projectStatus ? 'process' :
                                    getStepCurrent(s.key) < getStepCurrent(projectStatus) ? 'finish' : 'wait',
                        }))}
                    />
                )}
            </Card>

            {/* ─── Header ─── */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Space wrap>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/ql/journeys')}>Quay lại</Button>
                    <Title level={4} style={{ margin: 0 }}>{projectData.code} — {projectData.name}</Title>
                    <Tag color={statusTagMap[projectStatus].color}>
                        {statusTagMap[projectStatus].label}
                    </Tag>
                    <Tag color={projectData.constructionSource === 'internal' ? 'blue' : 'purple'}>
                        {projectData.constructionSource === 'internal' ? 'Nội bộ' : 'Cộng tác viên'}
                    </Tag>
                </Space>
                <Space wrap>
                    {/* Action Buttons */}
                    {isDraft && (
                        <Button icon={<LockOutlined />} onClick={handleLock}>Khóa dự án</Button>
                    )}
                    {(isDraft || isInProgress) && !isCancelled && !isCompleted && (
                        <Button danger icon={<CloseCircleOutlined />} onClick={() => setCancelModalOpen(true)}>Hủy dự án</Button>
                    )}
                    {isInProgress && (
                        <Button type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} icon={<CheckCircleOutlined />} onClick={handleComplete}>Hoàn thành</Button>
                    )}
                    {/* Edit — only for draft */}
                    {isDraft && (
                        <Button type="primary" icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/ql/journeys/${projectId}`)}>
                            Chỉnh sửa
                        </Button>
                    )}
                    {isLocked && !isDraft && (
                        <Button type="primary" icon={<EditOutlined />} disabled>Chỉnh sửa</Button>
                    )}
                </Space>
            </Row>

            {/* ─── KPI Row ─── */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={12} md={6}>
                    <Card size="small"><Statistic title="Tiến độ" value={projectData.progress} suffix="%" valueStyle={{ color: '#1890ff' }} /></Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card size="small"><Statistic title="Chất lượng" value={projectData.qualityScore} suffix="/ 100" valueStyle={{ color: projectData.qualityScore >= 80 ? '#52c41a' : '#fa8c16' }} /></Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card size="small"><Statistic title="Đã chi" value={(projectData.spent || 0) / 1000000} suffix="triệu" valueStyle={{ color: '#722ed1' }} /></Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card size="small"><Statistic title="Ngân sách" value={(projectData.budget || totalBudget) / 1000000} suffix="triệu" valueStyle={{ color: '#3f8600' }} /></Card>
                </Col>
            </Row>

            {/* ─── Detail Tabs ─── */}
            <Card>
                <Tabs defaultActiveKey="info" items={[
                    /* Tab 1: Thông tin chung */
                    {
                        key: 'info',
                        label: 'Thông tin Chung',
                        children: (
                            <Row gutter={24}>
                                <Col xs={24} lg={14}>
                                    <Descriptions bordered column={{ xs: 1, md: 2 }} size="small">
                                        <Descriptions.Item label="Mã dự án">{projectData.code}</Descriptions.Item>
                                        <Descriptions.Item label="Nguồn thi công">
                                            <Tag color={projectData.constructionSource === 'internal' ? 'blue' : 'purple'}>
                                                {projectData.constructionSource === 'internal' ? 'Nội bộ' : 'Cộng tác viên'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ" span={2}><EnvironmentOutlined /> {projectData.address}</Descriptions.Item>
                                        <Descriptions.Item label="Ngày bắt đầu"><CalendarOutlined /> {projectData.startDate}</Descriptions.Item>
                                        <Descriptions.Item label="Ngày kết thúc"><CalendarOutlined /> {projectData.endDate}</Descriptions.Item>
                                        <Descriptions.Item label="Giám sát viên"><TeamOutlined /> {projectData.supervisor || 'Chưa phân công'}</Descriptions.Item>
                                        {projectData.constructionSource === 'collaborator' && (
                                            <Descriptions.Item label="Cộng tác viên"><TeamOutlined /> {projectData.collaboratorName}</Descriptions.Item>
                                        )}
                                        <Descriptions.Item label="Mô tả" span={2}>{projectData.description}</Descriptions.Item>
                                    </Descriptions>

                                    <Divider orientation="left" style={{ marginTop: 24 }}>
                                        <Space><TeamOutlined /> Đội thi công ({teamMembers.length} người)</Space>
                                    </Divider>
                                    <Table
                                        dataSource={teamMembers}
                                        pagination={false}
                                        size="small"
                                        columns={[
                                            { title: 'Tên', dataIndex: 'name', key: 'name' },
                                            { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
                                            { title: 'Chuyên môn', dataIndex: 'skill', key: 'skill' },
                                            { title: 'Vai trò', dataIndex: 'role', key: 'role' },
                                        ]}
                                    />
                                </Col>
                                <Col xs={24} lg={10}>
                                    {projectData.contract && (
                                        <Card
                                            title={<Space><FileTextOutlined /> Hợp đồng liên kết</Space>}
                                            size="small"
                                            extra={
                                                <Button type="link" size="small" icon={<LinkOutlined />}
                                                    onClick={() => navigate(`/admin/ql/contracts/${projectData.contract.id}`)}>
                                                    Xem HĐ
                                                </Button>
                                            }
                                        >
                                            <Descriptions column={1} size="small">
                                                <Descriptions.Item label="Mã HĐ"><Tag color="blue">{projectData.contract.code}</Tag></Descriptions.Item>
                                                <Descriptions.Item label="Tên HĐ">{projectData.contract.name}</Descriptions.Item>
                                                <Descriptions.Item label="Khách hàng">{projectData.contract.customerName}</Descriptions.Item>
                                                <Descriptions.Item label="Giá trị">
                                                    <Text strong style={{ color: '#1890ff' }}>{projectData.contract.value.toLocaleString('vi-VN')} VNĐ</Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Thời gian">{projectData.contract.startDate} — {projectData.contract.endDate}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    )}

                                    <Card title="Tiến độ Tổng quan" size="small" style={{ marginTop: 16 }}>
                                        <Progress percent={projectData.progress} strokeColor="#1890ff" />
                                        <Progress percent={Math.round(((projectData.spent || 0) / (projectData.budget || totalBudget)) * 100)} strokeColor="#722ed1"
                                            format={() => `Chi phí: ${Math.round(((projectData.spent || 0) / (projectData.budget || totalBudget)) * 100)}%`} style={{ marginTop: 8 }} />
                                    </Card>

                                    <Card title={<Space><EnvironmentOutlined /> Vị trí</Space>} size="small" style={{ marginTop: 16 }}>
                                        <div style={{ width: '100%', height: 180, borderRadius: 8, overflow: 'hidden' }}>
                                            <iframe
                                                title="map"
                                                width="100%" height="100%" style={{ border: 0 }}
                                                loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(projectData.address)}&output=embed`}
                                            />
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        )
                    },
                    /* Tab 2: Vật tư & Ngân sách */
                    {
                        key: 'materials',
                        label: <Space><ToolOutlined /> Vật tư & Ngân sách</Space>,
                        children: (
                            <div>
                                <Title level={5} style={{ marginBottom: 16 }}>Danh sách Vật tư Dự trù</Title>
                                <Table
                                    dataSource={materialsList}
                                    pagination={false}
                                    size="small"
                                    columns={[
                                        { title: 'Tên vật tư', dataIndex: 'name', key: 'name' },
                                        { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 80 },
                                        { title: 'SL', dataIndex: 'quantity', key: 'quantity', width: 70, align: 'right' as const },
                                        { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', width: 120, align: 'right' as const, render: (v: number) => v.toLocaleString('vi-VN') },
                                        { title: 'Thành tiền', key: 'total', width: 140, align: 'right' as const, render: (_: unknown, rec: typeof materialsList[0]) => <Text strong>{(rec.quantity * rec.unitPrice).toLocaleString('vi-VN')}</Text> },
                                    ]}
                                    summary={() => (
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={4}><Text strong>Tổng chi phí vật tư</Text></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1} align="right"><Text strong style={{ color: '#1890ff' }}>{totalMaterialCost.toLocaleString('vi-VN')}</Text></Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    )}
                                />
                                <Divider />
                                <Title level={5}>Ngân sách Tổng hợp</Title>
                                <Row gutter={16}>
                                    <Col xs={12} md={6}><Statistic title="Chi phí vật tư" value={totalMaterialCost / 1000000} suffix="triệu" valueStyle={{ color: '#1890ff' }} /></Col>
                                    <Col xs={12} md={6}><Statistic title="Chi phí nhân công" value={laborCost / 1000000} suffix="triệu" valueStyle={{ color: '#722ed1' }} /></Col>
                                    <Col xs={12} md={6}><Statistic title="Chi phí khác" value={otherCost / 1000000} suffix="triệu" /></Col>
                                    <Col xs={12} md={6}><Statistic title="Tổng ngân sách" value={totalBudget / 1000000} suffix="triệu" valueStyle={{ color: '#52c41a', fontWeight: 700 }} /></Col>
                                </Row>
                                <Divider dashed />
                                <Row justify="end">
                                    {projectData.contract && (
                                        <Button type="link" icon={<LinkOutlined />}
                                            onClick={() => navigate(`/admin/ql/contracts/${projectData.contract.id}`)}>
                                            Xem tài chính tại Hợp đồng {projectData.contract.code}
                                        </Button>
                                    )}
                                </Row>
                            </div>
                        )
                    },
                    /* Tab 3: Tư liệu */
                    {
                        key: 'evidence',
                        label: <Badge count={evidenceItems.reduce((a, b) => a + b.pending, 0)} offset={[10, 0]}>Tư liệu</Badge>,
                        children: (
                            <div>
                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    {evidenceItems.map((e) => (
                                        <Col xs={24} md={8} key={e.key}>
                                            <Card title={e.stage} size="small">
                                                <Statistic title="Tổng" value={e.count} />
                                                <Space style={{ marginTop: 8 }}>
                                                    <Tag color="green">{e.approved} đã duyệt</Tag>
                                                    <Tag color="red">{e.rejected} từ chối</Tag>
                                                    <Tag color="orange">{e.pending} chờ duyệt</Tag>
                                                </Space>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                <Button type="primary" icon={<EyeOutlined />}>Xem Thư viện Tư liệu</Button>
                            </div>
                        )
                    },
                    /* Tab 4: Chất lượng */
                    {
                        key: 'quality',
                        label: <Badge count={qualityIssues.filter(q => q.status !== 'Đã đóng').length} offset={[10, 0]}>Chất lượng</Badge>,
                        children: (
                            <Table
                                dataSource={qualityIssues}
                                pagination={false}
                                size="small"
                                columns={[
                                    { title: 'Vấn đề', dataIndex: 'title', key: 'title' },
                                    { title: 'Mức độ', dataIndex: 'severity', key: 'severity', render: (s: string) => <Tag color={sevColor[s]}>{s}</Tag>, width: 110 },
                                    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Đã đóng' ? 'default' : 'processing'}>{s}</Tag>, width: 120 },
                                    { title: 'Báo cáo bởi', dataIndex: 'reportedBy', key: 'reportedBy', width: 130 },
                                    { title: 'Ngày', dataIndex: 'date', key: 'date', width: 110 },
                                ]}
                            />
                        )
                    },
                    /* Tab 5: Thư viện Tài liệu */
                    {
                        key: 'documents',
                        label: <Space><FolderOpenOutlined /> Thư viện ({mockDocuments.length})</Space>,
                        children: (
                            <div>
                                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                                    <Tabs
                                        activeKey={docCategory}
                                        onChange={setDocCategory}
                                        items={docTabItems.map((t) => ({ key: t.key, label: <Space size={4}>{t.icon}{t.label}</Space> }))}
                                        size="small"
                                        style={{ marginBottom: 0 }}
                                    />
                                    <Space>
                                        <Segmented
                                            size="small"
                                            options={[
                                                { label: <UnorderedListOutlined />, value: 'list' },
                                                { label: <AppstoreAddOutlined />, value: 'grid' },
                                            ]}
                                            value={docViewMode}
                                            onChange={(v) => setDocViewMode(v as 'grid' | 'list')}
                                        />
                                        <Upload showUploadList={false}>
                                            <Button type="primary" size="small" icon={<UploadOutlined />}>Tải lên</Button>
                                        </Upload>
                                    </Space>
                                </Row>

                                {docViewMode === 'list' ? (
                                    <Table
                                        dataSource={filteredDocs}
                                        pagination={false}
                                        size="small"
                                        locale={{ emptyText: <Empty description="Chưa có tài liệu" /> }}
                                        columns={[
                                            {
                                                title: 'Tên file', dataIndex: 'name', key: 'name',
                                                render: (name: string, rec: any) => (
                                                    <Space>{getDocIcon(rec.type)}<Text>{name}</Text></Space>
                                                ),
                                            },
                                            { title: 'Loại', dataIndex: 'type', key: 'type', width: 90, render: (t: string) => getDocTag(t) },
                                            { title: 'Danh mục', dataIndex: 'category', key: 'category', width: 110 },
                                            { title: 'Kích thước', dataIndex: 'size', key: 'size', width: 100 },
                                            { title: 'Ngày tải', dataIndex: 'date', key: 'date', width: 110 },
                                            { title: '', key: 'action', width: 40, render: () => <Button type="text" danger size="small" icon={<DeleteOutlined />} /> },
                                        ]}
                                    />
                                ) : (
                                    <Row gutter={[12, 12]}>
                                        {filteredDocs.length === 0 && <Col span={24}><Empty description="Chưa có tài liệu" /></Col>}
                                        {filteredDocs.map((doc: any) => (
                                            <Col xs={12} sm={8} md={6} key={doc.key}>
                                                <Card
                                                    hoverable size="small"
                                                    style={{ textAlign: 'center' }}
                                                    cover={
                                                        doc.type === 'image' ? (
                                                            <div style={{ height: 90, background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Image
                                                                    src="https://placehold.co/200x90/e6f4ff/1890ff?text=Preview"
                                                                    alt={doc.name} style={{ maxHeight: 90, objectFit: 'cover' }}
                                                                    preview={false}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div style={{ height: 90, background: doc.type === 'video' ? '#fff7e6' : '#f6ffed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {getDocIcon(doc.type)}
                                                            </div>
                                                        )
                                                    }
                                                >
                                                    <Card.Meta
                                                        title={<Text style={{ fontSize: 11 }} ellipsis={{ tooltip: doc.name }}>{doc.name}</Text>}
                                                        description={<Space size={4}>{getDocTag(doc.type)}<Text type="secondary" style={{ fontSize: 11 }}>{doc.size}</Text></Space>}
                                                    />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </div>
                        )
                    },
                    /* Tab 6: Lịch sử */
                    {
                        key: 'activity',
                        label: 'Lịch sử',
                        children: (
                            <Timeline
                                items={activityLog.map((a) => ({
                                    color:
                                        a.type === 'evidence' ? 'blue' :
                                            a.type === 'payment' ? 'green' :
                                                a.type === 'quality' ? 'red' :
                                                    a.type === 'team' ? 'purple' : 'gray',
                                    children: (
                                        <div key={a.time}>
                                            <div style={{ fontWeight: 500 }}>{a.action}</div>
                                            <div style={{ fontSize: 12, color: '#999' }}>{a.time}</div>
                                        </div>
                                    ),
                                }))}
                            />
                        )
                    },
                ]} />
            </Card>

            {/* ─── Cancel Modal ─── */}
            <Modal
                title={<Space><ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /> Hủy Dự án</Space>}
                open={cancelModalOpen}
                onCancel={() => { setCancelModalOpen(false); setCancelReason(''); }}
                onOk={handleCancelSubmit}
                okText="Xác nhận Hủy"
                okButtonProps={{ danger: true }}
                cancelText="Đóng"
            >
                <p>Bạn đang yêu cầu hủy dự án <Text strong>{projectData.code}</Text>. Hành động này không thể hoàn tác.</p>
                <Text strong>Lý do hủy <Text type="danger">*</Text></Text>
                <TextArea
                    rows={3}
                    placeholder="Nhập lý do hủy dự án..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    style={{ marginTop: 8 }}
                />
            </Modal>
        </div>
    );
};

export default ProjectDetail;
