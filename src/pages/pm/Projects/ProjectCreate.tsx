import React, { useState, useMemo } from 'react';
import {
    Card, Form, Input, Select, DatePicker, Steps, Button, Row, Col,
    message, InputNumber, Upload, Space, Typography, Grid, Radio, Table,
    Divider, Descriptions, Tag, Popconfirm, Tabs, Segmented, Image, Empty,
} from 'antd';
import {
    ArrowLeftOutlined, SaveOutlined, ProjectOutlined,
    EnvironmentOutlined, TeamOutlined, UploadOutlined,
    FileTextOutlined, PlusOutlined, DeleteOutlined,
    ToolOutlined, AppstoreOutlined, FolderOpenOutlined,
    PictureOutlined, VideoCameraOutlined, FileOutlined,
    UnorderedListOutlined, AppstoreAddOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { mockProjects as defaultProjects } from '../../../data/mockData';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

/* ───────── Steps ───────── */
const steps = [
    { title: 'Thông tin cơ bản', icon: <ProjectOutlined /> },
    { title: 'Hợp đồng & Địa điểm', icon: <EnvironmentOutlined /> },
    { title: 'Phân công & Vật tư', icon: <TeamOutlined /> },
    { title: 'Thư viện Tài liệu', icon: <FolderOpenOutlined /> },
];

/* ───────── Mock Data ───────── */
const mockContracts = [
    {
        id: 'c1', code: 'HD-2025-001', name: 'Hợp đồng sửa chữa tầng 5',
        customerName: 'Chung cư Sunrise City', value: 1200000000,
        startDate: '01/03/2025', endDate: '30/06/2025',
    },
    {
        id: 'c2', code: 'HD-2025-002', name: 'Hợp đồng chống thấm',
        customerName: 'Chung cư Sunrise City', value: 450000000,
        startDate: '15/02/2025', endDate: '15/04/2025',
    },
    {
        id: 'c3', code: 'HD-2025-003', name: 'Bảo trì định kỳ Q1',
        customerName: 'Vinhomes Central Park', value: 800000000,
        startDate: '01/01/2025', endDate: '31/03/2025',
    },
];

const mockInternalStaff = [
    { id: 's1', name: 'Lê Văn C', phone: '0901111222', skill: 'Điện', role: 'Thợ điện' },
    { id: 's2', name: 'Phạm Thị D', phone: '0903333444', skill: 'Kết cấu', role: 'Giám sát' },
    { id: 's3', name: 'Hoàng Văn E', phone: '0905555666', skill: 'Hoàn thiện', role: 'Thợ chính' },
    { id: 's4', name: 'Vũ Minh Tuấn', phone: '0907777888', skill: 'Cơ khí', role: 'Kỹ thuật' },
    { id: 's5', name: 'Đỗ Thị Hương', phone: '0909999000', skill: 'Nước', role: 'Thợ nước' },
];

const mockCollaborators = [
    { id: 'co1', name: 'Cty TNHH Xây dựng Phú Thành' },
    { id: 'co2', name: 'Đội thợ Minh Đức' },
];

const mockCollaboratorWorkers: Record<string, typeof mockInternalStaff> = {
    co1: [
        { id: 'cw1', name: 'Trần Minh Hoàng', phone: '0912345001', skill: 'Xây dựng', role: 'Tổ trưởng' },
        { id: 'cw2', name: 'Nguyễn Đức Phong', phone: '0912345002', skill: 'Chống thấm', role: 'Thợ chính' },
        { id: 'cw3', name: 'Lý Thanh Sơn', phone: '0912345003', skill: 'Ốp lát', role: 'Thợ phụ' },
    ],
    co2: [
        { id: 'cw4', name: 'Bùi Văn Khánh', phone: '0912345004', skill: 'Điện dân dụng', role: 'Thợ điện' },
        { id: 'cw5', name: 'Phan Ngọc Trí', phone: '0912345005', skill: 'Nước', role: 'Thợ nước' },
    ],
};

const mockSupervisors = [
    { id: 'sv1', name: 'Lê Văn C' },
    { id: 'sv2', name: 'Phạm Thị D' },
    { id: 'sv3', name: 'Nguyễn Hữu Quang' },
];

/* ───────── Material Row Type ───────── */
interface MaterialRow {
    key: string;
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    note: string;
}

/* ───────── Team Member Row Type ───────── */
interface TeamMemberRow {
    key: string;
    id: string;
    name: string;
    phone: string;
    skill: string;
    role: string;
}

/* ───────── Helpers ───────── */
const vndFormatter = (v: number | undefined) =>
    `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const vndParser = (v: string | undefined) =>
    (v?.replace(/,/g, '') ?? '') as unknown as number;

/* ========================================================= */
const ProjectCreate: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [mockProjects, setMockProjects] = useLocalStorageData<any[]>(demoDataService.KEYS.PROJECTS, defaultProjects);

    /* ─── Contract ─── */
    const [selectedContract, setSelectedContract] = useState<string>('');
    const contractInfo = mockContracts.find((c) => c.id === selectedContract);

    /* ─── Assignment ─── */
    const [constructionSource, setConstructionSource] = useState<'internal' | 'collaborator'>('internal');
    const [selectedCollaborator, setSelectedCollaborator] = useState<string>('');
    const [teamMembers, setTeamMembers] = useState<TeamMemberRow[]>([]);

    const availableWorkers = useMemo(() => {
        if (constructionSource === 'internal') return mockInternalStaff;
        return mockCollaboratorWorkers[selectedCollaborator] ?? [];
    }, [constructionSource, selectedCollaborator]);

    const addableWorkers = useMemo(
        () => availableWorkers.filter((w) => !teamMembers.some((m) => m.id === w.id)),
        [availableWorkers, teamMembers],
    );

    /* ─── Materials ─── */
    const [materials, setMaterials] = useState<MaterialRow[]>([
        { key: '1', name: 'Xi măng PCB40', unit: 'Bao', quantity: 50, unitPrice: 120000, note: '' },
        { key: '2', name: 'Sơn chống thấm', unit: 'Thùng', quantity: 10, unitPrice: 850000, note: '' },
    ]);

    const totalMaterialCost = useMemo(
        () => materials.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0),
        [materials],
    );

    const [laborCost, setLaborCost] = useState<number>(0);
    const [otherCost, setOtherCost] = useState<number>(0);
    const totalBudget = totalMaterialCost + laborCost + otherCost;

    /* ─── Map query ─── */
    const [mapQuery, setMapQuery] = useState('');

    /* ─── Handlers ─── */
    const handleFinish = (values: any) => {
        const newProject = {
            id: values.projectCode || `DA-${Date.now()}`,
            code: values.projectCode,
            name: values.projectName,
            type: values.projectType,
            status: 'SCHEDULED',
            customerName: contractInfo?.customerName || 'Khách hàng mới',
            startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : '',
            endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : '',
            budget: totalBudget,
            progress: 0,
            qualityScore: 0,
            steps: [], // Initialize steps
            address: values.address,
            description: values.description,
        };

        const updatedProjects = [...mockProjects, newProject];
        setMockProjects(updatedProjects);

        message.success('Dự án đã được tạo thành công!');
        navigate('/pm/projects/all');
    };

    const handleSaveDraft = () => {
        message.info('Đã lưu bản nháp.');
    };

    const handleAddMaterial = () => {
        setMaterials((prev) => [
            ...prev,
            { key: Date.now().toString(), name: '', unit: '', quantity: 0, unitPrice: 0, note: '' },
        ]);
    };

    const handleRemoveMaterial = (key: string) => {
        setMaterials((prev) => prev.filter((m) => m.key !== key));
    };

    const handleMaterialChange = (key: string, field: keyof MaterialRow, value: string | number) => {
        setMaterials((prev) =>
            prev.map((m) => (m.key === key ? { ...m, [field]: value } : m)),
        );
    };

    const handleAddTeamMember = (workerId: string) => {
        const worker = availableWorkers.find((w) => w.id === workerId);
        if (!worker) return;
        setTeamMembers((prev) => [
            ...prev,
            { key: worker.id, id: worker.id, name: worker.name, phone: worker.phone, skill: worker.skill, role: worker.role },
        ]);
    };

    const handleRemoveTeamMember = (id: string) => {
        setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    };

    const handleUpdateMapPreview = () => {
        const province = form.getFieldValue('province');
        const district = form.getFieldValue('district');
        const address = form.getFieldValue('address');
        const parts = [address, district, province].filter(Boolean);
        if (parts.length > 0) setMapQuery(parts.join(', '));
    };

    /* ═══════════════════════════════════════════════════════ */
    /*  STEP 0 — Thông tin cơ bản                             */
    /* ═══════════════════════════════════════════════════════ */
    const renderStep0 = () => (
        <Card
            title={<Space><ProjectOutlined /> Thông tin dự án</Space>}
            bordered={false}
            style={{ marginBottom: 24 }}
        >
            <Row gutter={[16, 0]}>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item
                        name="projectCode" label="Mã dự án"
                        rules={[{ required: true, message: 'Vui lòng nhập mã dự án' }]}
                    >
                        <Input placeholder="VD: DA-2025-001" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item
                        name="projectName" label="Tên dự án"
                        rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}
                    >
                        <Input placeholder="VD: Sửa chữa tầng 5 - Block A" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item
                        name="projectType" label="Loại dự án"
                        rules={[{ required: true, message: 'Vui lòng chọn' }]}
                    >
                        <Select placeholder="Chọn loại dự án">
                            <Option value="repair">Sửa chữa</Option>
                            <Option value="construction">Thi công mới</Option>
                            <Option value="maintenance">Bảo trì</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item name="priority" label="Mức độ ưu tiên">
                        <Select placeholder="Chọn mức độ">
                            <Option value="high">Cao</Option>
                            <Option value="medium">Trung bình</Option>
                            <Option value="low">Thấp</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item name="endDate" label="Ngày kết thúc">
                        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item name="description" label="Mô tả dự án">
                        <TextArea rows={3} placeholder="Mô tả tổng quan về dự án..." />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );

    /* ═══════════════════════════════════════════════════════ */
    /*  STEP 1 — Hợp đồng & Địa điểm                         */
    /* ═══════════════════════════════════════════════════════ */
    const renderStep1 = () => (
        <>
            {/* ── Contract Picker ── */}
            <Card
                title={<Space><FileTextOutlined /> Hợp đồng liên kết</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="contractId" label="Chọn hợp đồng"
                            rules={[{ required: true, message: 'Vui lòng chọn hợp đồng' }]}
                        >
                            <Select
                                placeholder="Tìm theo mã hoặc tên hợp đồng"
                                showSearch
                                optionFilterProp="children"
                                onChange={(val: string) => setSelectedContract(val)}
                            >
                                {mockContracts.map((c) => (
                                    <Option key={c.id} value={c.id}>
                                        {c.code} — {c.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Contract summary after selection */}
                {contractInfo && (
                    <Descriptions
                        bordered size="small" column={{ xs: 1, md: 2 }}
                        style={{ marginTop: 8 }}
                    >
                        <Descriptions.Item label="Mã HĐ">
                            <Tag color="blue">{contractInfo.code}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Khách hàng">
                            {contractInfo.customerName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá trị HĐ">
                            <Text strong style={{ color: '#1890ff' }}>
                                {contractInfo.value.toLocaleString('vi-VN')} VNĐ
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian">
                            {contractInfo.startDate} — {contractInfo.endDate}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Card>

            {/* ── Location ── */}
            <Card
                title={<Space><EnvironmentOutlined /> Địa điểm thi công</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
                            <Select placeholder="Chọn tỉnh/thành" showSearch onChange={handleUpdateMapPreview}>
                                <Option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</Option>
                                <Option value="Hà Nội">Hà Nội</Option>
                                <Option value="Đà Nẵng">Đà Nẵng</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item name="district" label="Quận/Huyện">
                            <Select placeholder="Chọn quận/huyện" showSearch onChange={handleUpdateMapPreview}>
                                <Option value="Quận 1">Quận 1</Option>
                                <Option value="Quận 7">Quận 7</Option>
                                <Option value="Bình Thạnh">Bình Thạnh</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item name="ward" label="Phường/Xã">
                            <Select placeholder="Chọn phường/xã" showSearch>
                                <Option value="Phường 1">Phường 1</Option>
                                <Option value="Phường 2">Phường 2</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="address" label="Địa chỉ chi tiết" rules={[{ required: true }]}>
                            <Input
                                placeholder="VD: 123 Nguyễn Huệ, Q.1, TP.HCM"
                                onBlur={handleUpdateMapPreview}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ── Map Preview ── */}
                <Divider dashed style={{ margin: '12px 0' }} />
                <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
                    <EnvironmentOutlined /> Xem trước vị trí trên bản đồ
                </Text>
                <div
                    style={{
                        width: '100%', height: isMobile ? 200 : 300,
                        borderRadius: 8, overflow: 'hidden',
                        border: '1px solid #d9d9d9', background: '#f5f5f5',
                    }}
                >
                    {mapQuery ? (
                        <iframe
                            title="map-preview"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                        />
                    ) : (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            height: '100%', color: '#999',
                        }}>
                            <Space direction="vertical" align="center">
                                <EnvironmentOutlined style={{ fontSize: 36 }} />
                                <Text type="secondary">Nhập địa chỉ để xem vị trí trên bản đồ</Text>
                            </Space>
                        </div>
                    )}
                </div>
            </Card>
        </>
    );

    /* ═══════════════════════════════════════════════════════ */
    /*  STEP 2 — Phân công & Vật tư                           */
    /* ═══════════════════════════════════════════════════════ */

    /* ─ Team members table columns ─ */
    const teamColumns = [
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        ...(!isMobile ? [
            { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
            { title: 'Chuyên môn', dataIndex: 'skill', key: 'skill' },
        ] : []),
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        {
            title: '', key: 'action', width: 50,
            render: (_: unknown, rec: TeamMemberRow) => (
                <Popconfirm title="Xóa thành viên này?" onConfirm={() => handleRemoveTeamMember(rec.id)}>
                    <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    /* ─ Material table columns ─ */
    const materialColumns = [
        {
            title: 'Tên vật tư', dataIndex: 'name', key: 'name',
            render: (v: string, rec: MaterialRow) => (
                <Input size="small" value={v} placeholder="VD: Xi măng"
                    onChange={(e) => handleMaterialChange(rec.key, 'name', e.target.value)} />
            ),
        },
        {
            title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: isMobile ? 70 : 100,
            render: (v: string, rec: MaterialRow) => (
                <Input size="small" value={v} placeholder="Bao"
                    onChange={(e) => handleMaterialChange(rec.key, 'unit', e.target.value)} />
            ),
        },
        {
            title: 'SL', dataIndex: 'quantity', key: 'quantity', width: isMobile ? 70 : 90,
            render: (v: number, rec: MaterialRow) => (
                <InputNumber size="small" min={0} value={v} style={{ width: '100%' }}
                    onChange={(val) => handleMaterialChange(rec.key, 'quantity', val ?? 0)} />
            ),
        },
        ...(!isMobile ? [{
            title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', width: 140,
            render: (v: number, rec: MaterialRow) => (
                <InputNumber size="small" min={0} value={v} style={{ width: '100%' }}
                    formatter={vndFormatter} parser={vndParser}
                    onChange={(val) => handleMaterialChange(rec.key, 'unitPrice', val ?? 0)} />
            ),
        }] : []),
        {
            title: 'Thành tiền', key: 'total', width: isMobile ? 100 : 140,
            render: (_: unknown, rec: MaterialRow) => (
                <Text strong>{(rec.quantity * rec.unitPrice).toLocaleString('vi-VN')}</Text>
            ),
        },
        {
            title: '', key: 'action', width: 40,
            render: (_: unknown, rec: MaterialRow) => (
                <Button type="text" danger size="small" icon={<DeleteOutlined />}
                    onClick={() => handleRemoveMaterial(rec.key)} />
            ),
        },
    ];

    const renderStep2 = () => (
        <>
            {/* ── Assignment ── */}
            <Card
                title={<Space><TeamOutlined /> Phân công nhân sự</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Row gutter={[16, 0]}>
                    {/* Construction Source */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="constructionSource" label="Nguồn thi công"
                            rules={[{ required: true, message: 'Vui lòng chọn' }]}
                            initialValue="internal"
                        >
                            <Radio.Group
                                onChange={(e) => {
                                    setConstructionSource(e.target.value);
                                    setSelectedCollaborator('');
                                    setTeamMembers([]);
                                }}
                            >
                                <Radio.Button value="internal">Nội bộ</Radio.Button>
                                <Radio.Button value="collaborator">Cộng tác viên</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    {/* Collaborator picker (conditional) */}
                    {constructionSource === 'collaborator' && (
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="collaboratorId" label="Chọn Cộng tác viên"
                                rules={[{ required: true, message: 'Vui lòng chọn CTV' }]}
                            >
                                <Select
                                    placeholder="Chọn đơn vị cộng tác"
                                    showSearch optionFilterProp="children"
                                    onChange={(val: string) => {
                                        setSelectedCollaborator(val);
                                        setTeamMembers([]);
                                    }}
                                >
                                    {mockCollaborators.map((c) => (
                                        <Option key={c.id} value={c.id}>{c.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}

                    {/* Supervisor (always internal) */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="supervisorId" label="Giám sát hiện trường (Nội bộ)"
                            rules={[{ required: true, message: 'Vui lòng chọn giám sát' }]}
                        >
                            <Select placeholder="Chọn giám sát">
                                {mockSupervisors.map((s) => (
                                    <Option key={s.id} value={s.id}>{s.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider dashed style={{ margin: '12px 0' }} />

                {/* Team Members Table */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                    <Text strong>
                        Thành viên đội thi công
                        {constructionSource === 'internal'
                            ? ' (Nhân sự nội bộ)'
                            : selectedCollaborator
                                ? ` (Thợ của ${mockCollaborators.find((c) => c.id === selectedCollaborator)?.name})`
                                : ' (Chọn CTV trước)'}
                    </Text>
                    <Select
                        style={{ width: isMobile ? 180 : 260 }}
                        placeholder="+ Thêm thành viên"
                        showSearch optionFilterProp="children"
                        value={undefined}
                        onChange={handleAddTeamMember}
                        disabled={constructionSource === 'collaborator' && !selectedCollaborator}
                    >
                        {addableWorkers.map((w) => (
                            <Option key={w.id} value={w.id}>{w.name} — {w.skill}</Option>
                        ))}
                    </Select>
                </Row>

                <Table
                    dataSource={teamMembers}
                    columns={teamColumns}
                    pagination={false}
                    size="small"
                    locale={{ emptyText: 'Chưa thêm thành viên nào' }}
                />
            </Card>

            {/* ── Material Builder ── */}
            <Card
                title={<Space><ToolOutlined /> Dự trù Vật tư</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
                extra={
                    <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={handleAddMaterial}>
                        Thêm hàng
                    </Button>
                }
            >
                <Table
                    dataSource={materials}
                    columns={materialColumns}
                    pagination={false}
                    size="small"
                    scroll={{ x: isMobile ? 500 : undefined }}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={isMobile ? 3 : 4}>
                                <Text strong>Tổng chi phí vật tư</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                <Text strong style={{ color: '#1890ff' }}>
                                    {totalMaterialCost.toLocaleString('vi-VN')}
                                </Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2} />
                        </Table.Summary.Row>
                    )}
                />
            </Card>

            {/* ── Budget Summary ── */}
            <Card
                title={<Space><AppstoreOutlined /> Ngân sách dự kiến</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={8}>
                        <Form.Item label="Tổng vật tư">
                            <InputNumber
                                style={{ width: '100%' }} disabled
                                value={totalMaterialCost}
                                formatter={vndFormatter}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Chi phí nhân công">
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                value={laborCost}
                                formatter={vndFormatter}
                                parser={vndParser}
                                onChange={(val) => setLaborCost(val ?? 0)}
                                placeholder="0"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Chi phí khác">
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                value={otherCost}
                                formatter={vndFormatter}
                                parser={vndParser}
                                onChange={(val) => setOtherCost(val ?? 0)}
                                placeholder="0"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider style={{ margin: '8px 0 16px' }} />
                <Row justify="end">
                    <Space>
                        <Text>Tổng ngân sách dự kiến:</Text>
                        <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                            {totalBudget.toLocaleString('vi-VN')} VNĐ
                        </Title>
                    </Space>
                </Row>
            </Card>

        </>
    );

    /* ═══════════════════════════════════════════════════════ */
    /*  STEP 3 — Thư viện Tài liệu                            */
    /* ═══════════════════════════════════════════════════════ */
    const [docViewMode, setDocViewMode] = useState<'grid' | 'list'>('grid');
    const [docCategory, setDocCategory] = useState('all');

    const mockDocuments = [
        { key: '1', name: 'Bản vẽ mặt bằng tầng 5.pdf', type: 'document', size: '2.4 MB', date: '01/03/2025', category: 'Bản vẽ' },
        { key: '2', name: 'Hiện trạng sảnh chính.jpg', type: 'image', size: '1.8 MB', date: '02/03/2025', category: 'Khảo sát' },
        { key: '3', name: 'Video khảo sát thực tế.mp4', type: 'video', size: '45 MB', date: '02/03/2025', category: 'Khảo sát' },
        { key: '4', name: 'Hợp đồng ký scan.pdf', type: 'document', size: '3.1 MB', date: '28/02/2025', category: 'Hợp đồng' },
        { key: '5', name: 'Ảnh vết nứt tường B2.jpg', type: 'image', size: '2.1 MB', date: '03/03/2025', category: 'Khảo sát' },
        { key: '6', name: 'Tiến độ thi công dự kiến.xlsx', type: 'document', size: '0.8 MB', date: '01/03/2025', category: 'Kế hoạch' },
        { key: '7', name: 'Drone overview block A.mp4', type: 'video', size: '120 MB', date: '03/03/2025', category: 'Khảo sát' },
        { key: '8', name: 'Chi tiết kết cấu sàn.jpg', type: 'image', size: '1.5 MB', date: '03/03/2025', category: 'Bản vẽ' },
    ];

    const filteredDocs = docCategory === 'all'
        ? mockDocuments
        : mockDocuments.filter((d) => d.type === docCategory);

    const docTabItems = [
        { key: 'all', label: 'Tất cả', icon: <FolderOpenOutlined /> },
        { key: 'image', label: `Ảnh (${mockDocuments.filter((d) => d.type === 'image').length})`, icon: <PictureOutlined /> },
        { key: 'video', label: `Video (${mockDocuments.filter((d) => d.type === 'video').length})`, icon: <VideoCameraOutlined /> },
        { key: 'document', label: `Tài liệu (${mockDocuments.filter((d) => d.type === 'document').length})`, icon: <FileOutlined /> },
    ];

    const getDocIcon = (type: string) => {
        if (type === 'image') return <PictureOutlined style={{ fontSize: 28, color: '#52c41a' }} />;
        if (type === 'video') return <VideoCameraOutlined style={{ fontSize: 28, color: '#fa8c16' }} />;
        return <FileOutlined style={{ fontSize: 28, color: '#1890ff' }} />;
    };

    const getDocTag = (type: string) => {
        if (type === 'image') return <Tag color="green">Ảnh</Tag>;
        if (type === 'video') return <Tag color="orange">Video</Tag>;
        return <Tag color="blue">Tài liệu</Tag>;
    };

    const docListColumns = [
        {
            title: 'Tên file', dataIndex: 'name', key: 'name',
            render: (name: string, rec: typeof mockDocuments[0]) => (
                <Space>{getDocIcon(rec.type)}<Text>{name}</Text></Space>
            ),
        },
        { title: 'Loại', dataIndex: 'type', key: 'type', width: 90, render: (t: string) => getDocTag(t) },
        ...(!isMobile ? [
            { title: 'Danh mục', dataIndex: 'category', key: 'category', width: 110 },
            { title: 'Kích thước', dataIndex: 'size', key: 'size', width: 100 },
            { title: 'Ngày tải', dataIndex: 'date', key: 'date', width: 110 },
        ] : []),
        {
            title: '', key: 'action', width: 40,
            render: () => (
                <Button type="text" danger size="small" icon={<DeleteOutlined />} />
            ),
        },
    ];

    const renderStep3 = () => (
        <>
            <Card
                title={<Space><FolderOpenOutlined /> Thư viện Tài liệu Dự án</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
                extra={
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
                            <Button type="primary" size="small" icon={<UploadOutlined />}>
                                Tải lên
                            </Button>
                        </Upload>
                    </Space>
                }
            >
                <Tabs
                    activeKey={docCategory}
                    onChange={setDocCategory}
                    items={docTabItems.map((t) => ({ key: t.key, label: <Space size={4}>{t.icon}{t.label}</Space> }))}
                    size="small"
                    style={{ marginBottom: 16 }}
                />

                {docViewMode === 'list' ? (
                    <Table
                        dataSource={filteredDocs}
                        columns={docListColumns}
                        pagination={false}
                        size="small"
                        locale={{ emptyText: <Empty description="Chưa có tài liệu" /> }}
                    />
                ) : (
                    <Row gutter={[12, 12]}>
                        {filteredDocs.length === 0 && (
                            <Col span={24}><Empty description="Chưa có tài liệu" /></Col>
                        )}
                        {filteredDocs.map((doc) => (
                            <Col xs={12} sm={8} md={6} key={doc.key}>
                                <Card
                                    hoverable size="small"
                                    style={{ textAlign: 'center' }}
                                    cover={
                                        doc.type === 'image' ? (
                                            <div style={{ height: 100, background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Image
                                                    src="https://placehold.co/200x100/e6f4ff/1890ff?text=Preview"
                                                    alt={doc.name}
                                                    style={{ maxHeight: 100, objectFit: 'cover' }}
                                                    preview={false}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ height: 100, background: doc.type === 'video' ? '#fff7e6' : '#f6ffed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {getDocIcon(doc.type)}
                                            </div>
                                        )
                                    }
                                >
                                    <Card.Meta
                                        title={<Text style={{ fontSize: 12 }} ellipsis={{ tooltip: doc.name }}>{doc.name}</Text>}
                                        description={<Space size={4}>{getDocTag(doc.type)}<Text type="secondary" style={{ fontSize: 11 }}>{doc.size}</Text></Space>}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                <Divider dashed style={{ margin: '16px 0 12px' }} />
                <Upload.Dragger style={{ padding: '12px 0' }}>
                    <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 28, color: '#1890ff' }} /></p>
                    <p className="ant-upload-text" style={{ fontSize: 13 }}>Kéo thả file hoặc bấm để tải lên</p>
                    <p className="ant-upload-hint" style={{ fontSize: 12 }}>Hỗ trợ Ảnh, Video, PDF, Word, Excel (tối đa 50MB)</p>
                </Upload.Dragger>
            </Card>
        </>
    );

    /* ═══════════════════════════════════════════════════════ */
    /*  MAIN RENDER                                           */
    /* ═══════════════════════════════════════════════════════ */
    const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3];

    return (
        <div>
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                        {!isMobile && 'Quay lại'}
                    </Button>
                    <Title level={4} style={{ margin: 0 }}>Tạo Dự Án Mới</Title>
                </Space>
                <Space>
                    <Button icon={<SaveOutlined />} onClick={handleSaveDraft}>
                        {!isMobile && 'Lưu nháp'}
                    </Button>
                </Space>
            </Row>

            <Steps
                current={currentStep}
                items={steps}
                style={{ marginBottom: 32 }}
                size={isMobile ? 'small' : 'default'}
                direction={isMobile ? 'vertical' : 'horizontal'}
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ projectType: 'repair', priority: 'medium' }}
            >
                {stepRenderers[currentStep]()}

                <Row justify="space-between" style={{ marginTop: 16 }}>
                    <Button disabled={currentStep === 0} onClick={() => setCurrentStep((s) => s - 1)}>
                        Quay lại
                    </Button>
                    {currentStep < steps.length - 1 ? (
                        <Button type="primary" onClick={() => setCurrentStep((s) => s + 1)}>
                            Tiếp theo
                        </Button>
                    ) : (
                        <Button type="primary" htmlType="submit">
                            Tạo dự án
                        </Button>
                    )}
                </Row>
            </Form>
        </div>
    );
};

export default ProjectCreate;
