import React, { useState } from 'react';
import {
    Card, Form, Input, InputNumber, Select, Button, Row, Col,
    Typography, DatePicker, Avatar, Tag, Modal, Steps, Alert,
    Divider, Radio, Space, Checkbox, message
} from 'antd';
import {
    UserOutlined, ArrowLeftOutlined, CheckCircleOutlined,
    EyeOutlined, TeamOutlined, EnvironmentOutlined, BulbOutlined,
    SaveOutlined, FileTextOutlined, BuildOutlined, ProfileOutlined,
    EditOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import {
    mockCustomers as defaultCustomers,
    mockUsers as defaultUsers,
    mockTemplates as defaultTemplates,
    mockStandards as defaultStandards,
    mockMaterials as defaultMaterials,
    mockProjects as defaultProjects
} from '../../../data/mockData';
import type { ChecklistStep } from '../../../types/v3';
import type { Project } from '../../../types/legacy-project';

const { Title, Text } = Typography;

const CONSTRUCTION_TYPES = [
    'Chống thấm sàn',
    'Chống thấm tường',
    'Chống thấm mái',
    'Chống thấm nhà vệ sinh',
    'Phức hợp',
];

const ProjectCreate: React.FC = () => {
    const navigate = useNavigate();
    const { customerId, id } = useParams<{ customerId: string, id: string }>();
    const isEdit = !!id;
    const [form] = Form.useForm();

    const [mockProjects, setMockProjects] = useLocalStorageData<Project[]>(demoDataService.KEYS.PROJECTS, defaultProjects);
    const [mockCustomers] = useLocalStorageData<any[]>(demoDataService.KEYS.CUSTOMERS, defaultCustomers);
    const [mockUsers] = useLocalStorageData<any[]>(demoDataService.KEYS.USERS, defaultUsers);
    const [mockTemplates] = useLocalStorageData<any[]>(demoDataService.KEYS.TEMPLATES, defaultTemplates);
    const [mockStandards] = useLocalStorageData<any[]>(demoDataService.KEYS.STANDARDS, defaultStandards);
    const [mockMaterials] = useLocalStorageData<any[]>(demoDataService.KEYS.MATERIALS, defaultMaterials);

    // Pre-fill from customer if coming from CRM
    const customer = mockCustomers.find(c => c.id === customerId);
    const workers = mockUsers.filter(u => u.role === 'supervisor' && u.isActive);

    const [constructionType, setConstructionType] = useState('Chống thấm sàn');
    const [areaM2, setAreaM2] = useState(100);
    const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0]?.id || '');
    const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
    const [templateModalOpen, setTemplateModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const existingProject = isEdit ? mockProjects.find(p => p.id === id) : null;

    // Pre-fill form if editing
    React.useEffect(() => {
        if (existingProject) {
            form.setFieldsValue({
                projectName: existingProject.name,
                address: existingProject.address,
                areaM2: existingProject.areaM2,
                templateId: existingProject.templateId,
                startDate: dayjs(existingProject.startDate),
                endDate: dayjs(existingProject.plannedEndDate),
                notes: existingProject.notes,
            });
            setConstructionType(existingProject.category);
            setAreaM2(existingProject.areaM2);
            setSelectedTemplate(existingProject.templateId);
            setSelectedWorkers(existingProject.workerIds);
        }
    }, [existingProject, form]);

    // Auto-calc material estimate
    const standards = mockStandards.filter(s => s.constructionType === constructionType);
    const materialEstimate = standards.map(s => ({
        ...s,
        qty: Math.ceil(areaM2 * s.usagePerM2),
        stockOk: (mockMaterials.find(m => m.id === s.materialId)?.currentStock || 0)
            >= Math.ceil(areaM2 * s.usagePerM2),
    }));

    const preview = mockTemplates.find(t => t.id === selectedTemplate);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);
            const hide = message.loading('Đang khởi tạo dự án thi công...', 0);
            
            // Artificial delay
            await new Promise(r => setTimeout(r, 800));

            const template = mockTemplates.find(t => t.id === values.templateId);
            const selectedWorkerNames = mockUsers
                .filter(u => selectedWorkers.includes(u.id))
                .map(u => u.fullName);

            if (isEdit && existingProject) {
                const updatedProjects = mockProjects.map(p => p.id === id ? {
                    ...p,
                    name: values.projectName,
                    address: values.address,
                    areaM2: values.areaM2,
                    category: constructionType,
                    templateId: values.templateId,
                    workerIds: selectedWorkers,
                    workerNames: selectedWorkerNames,
                    startDate: values.startDate.format('YYYY-MM-DD'),
                    plannedEndDate: values.endDate.format('YYYY-MM-DD'),
                    notes: values.notes,
                } : p);
                setMockProjects(updatedProjects);
                message.success('Cập nhật dự án thành công!');
            } else {
                const projectId = `DA-2026-${String(Date.now()).slice(-3)}`;
                
                const newProject: Project = {
                    id: projectId,
                    code: projectId,
                    name: values.projectName,
                    customerId: customer?.id || '',
                    customerName: customer?.fullName || 'Khách hàng mới',
                    address: values.address,
                    areaM2: values.areaM2,
                    category: constructionType,
                    type: 'Nội bộ',
                    templateId: values.templateId,
                    status: 'SCHEDULED',
                    pmId: 'U001', // Mock PM
                    pmName: 'Nguyễn Văn PM',
                    workerIds: selectedWorkers,
                    workerNames: selectedWorkerNames,
                    startDate: values.startDate.format('YYYY-MM-DD'),
                    plannedEndDate: values.endDate.format('YYYY-MM-DD'),
                    createdAt: dayjs().format('YYYY-MM-DD'),
                    notes: values.notes,
                    steps: template ? template.steps.map((s: any) => ({
                        id: `SP-${projectId}-${s.id}`,
                        templateStepId: s.id,
                        order: s.order,
                        name: s.name,
                        description: s.description,
                        minPhotos: s.minPhotos,
                        status: s.order === 1 ? 'OPEN' : 'LOCKED',
                        evidences: []
                    })) : [],
                    incidents: [],
                    activities: [
                        {
                            id: `AL-${Date.now()}`,
                            journeyId: projectId, // Temporarily use projectId as journeyId for legacy projects
                            category: 'GENERAL',
                            actor: 'Nguyễn Văn PM',
                            action: 'PROJECT_CREATE',
                            summary: 'Tạo dự án mới từ form thi công',
                            timestamp: dayjs().toISOString()
                        }
                    ],
                    paymentMilestones: [],
                    stockOrders: []
                };

                setMockProjects([newProject, ...mockProjects]);
                message.success('Dự án đã được tạo thành công!');
            }

            setSaving(false);
            hide();
            
            // Navigate after 1s to allow user to see success message
            setTimeout(() => {
                navigate('/pm/construction/projects');
            }, 1000);

        } catch (err) {
            console.error('Validation failed:', err);
            setSaving(false);
            message.error('Vui lòng kiểm tra lại thông tin form');
        }
    };

    return (
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />}
                    onClick={() => customer
                        ? navigate(`/pm/crm/customers/${customer.id}`)
                        : navigate('/pm/construction/projects')}>
                    Quay lại
                </Button>
                <div>
                    <Title level={4} style={{ margin: 0 }}>
                        {isEdit ? <EditOutlined /> : <BuildOutlined />} {isEdit ? ' Chỉnh sửa Dự án' : ' Tạo Dự án Thi công'}
                    </Title>
                    {existingProject && (
                        <Text type="secondary">Mã dự án: <strong>{existingProject.code}</strong></Text>
                    )}
                    {customer && (
                        <Text type="secondary">Khách hàng: <strong>{customer.fullName}</strong></Text>
                    )}
                </div>
            </div>

            <Form form={form} layout="vertical" initialValues={{
                projectName: customer ? `Chống thấm – ${customer.fullName}` : '',
                address: customer ? `${customer.address}, ${customer.district}, ${customer.city}` : '',
                areaM2: 100,
                templateId: selectedTemplate,
                startDate: dayjs().add(3, 'day'),
                endDate: dayjs().add(17, 'day'),
            }}>

                {/* Section 1: Project Info */}
                <Card title={<><ProfileOutlined /> Thông tin Dự án</>} style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Mã dự án">
                                <Input value={isEdit ? existingProject?.code : `DA-2026-${String(Date.now()).slice(-3)}`} disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Khách hàng">
                                <Input
                                    value={isEdit ? existingProject?.customerName : (customer ? `${customer.fullName} (${customer.phone})` : 'Chưa chọn KH')}
                                    disabled
                                    prefix={<UserOutlined />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="projectName" label="Tên dự án *"
                        rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}>
                        <Input placeholder="VD: Chống thấm sàn căn hộ tầng 3 – Nguyễn Văn A" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} sm={16}>
                            <Form.Item name="address" label="Địa chỉ thi công *"
                                rules={[{ required: true }]}>
                                <Input prefix={<EnvironmentOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="areaM2" label="Diện tích (m²) *"
                                rules={[{ required: true }]}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1} max={10000}
                                    addonAfter="m²"
                                    onChange={v => setAreaM2(v || 100)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {customer?.gpsLat && (
                        <Alert
                            message={<>📍 Tọa độ GPS từ hồ sơ KH: <strong>{customer.gpsLat}, {customer.gpsLng}</strong></>}
                            type="info" showIcon style={{ marginBottom: 16 }}
                        />
                    )}

                    <Form.Item label="Loại hình thi công *" required>
                        <Radio.Group
                            value={constructionType}
                            onChange={e => setConstructionType(e.target.value)}
                        >
                            <Row gutter={[8, 8]}>
                                {CONSTRUCTION_TYPES.map(t => (
                                    <Col key={t}>
                                        <Radio.Button value={t} style={{ borderRadius: 6 }}>{t}</Radio.Button>
                                    </Col>
                                ))}
                            </Row>
                        </Radio.Group>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Form.Item name="startDate" label="Ngày bắt đầu *" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="endDate" label="Ngày kết thúc dự kiến *" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Section 2: Template */}
                <Card title={<><FileTextOutlined /> Template Checklist</>}
                    extra={<Button icon={<EyeOutlined />} onClick={() => setTemplateModalOpen(true)}>Xem trước</Button>}
                    style={{ marginBottom: 16 }}>
                    <Form.Item name="templateId" label="Chọn template *" rules={[{ required: true }]}>
                        <Select
                            value={selectedTemplate}
                            onChange={v => setSelectedTemplate(v)}
                            options={mockTemplates.map(t => ({
                                value: t.id,
                                label: `${t.name} (${t.steps.length} bước) – ${t.category}`,
                            }))}
                        />
                    </Form.Item>
                    {preview && (
                        <Alert
                            message={<>Đã chọn: <strong>{preview.name}</strong> — {preview.description}</>}
                            type="success" showIcon
                        />
                    )}
                </Card>

                {/* Section 3: Worker Assignment */}
                <Card title={<><TeamOutlined /> Phân công Thợ</>} style={{ marginBottom: 16 }}>
                    <Alert
                        message="Chọn một hoặc nhiều thợ phụ trách dự án này. Thợ sẽ nhận thông báo ngay khi dự án được tạo."
                        type="info" showIcon style={{ marginBottom: 16 }}
                    />
                    {workers.map(w => {
                        const activeProjects = 1; // mock
                        return (
                            <div
                                key={w.id}
                                onClick={() => setSelectedWorkers(prev =>
                                    prev.includes(w.id)
                                        ? prev.filter(id => id !== w.id)
                                        : [...prev, w.id]
                                )}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '10px 16px', borderRadius: 8, cursor: 'pointer',
                                    marginBottom: 8,
                                    border: selectedWorkers.includes(w.id)
                                        ? '2px solid #1976D2'
                                        : '1px solid #f0f0f0',
                                    background: selectedWorkers.includes(w.id) ? '#f0f5ff' : '#fafafa',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Checkbox checked={selectedWorkers.includes(w.id)} />
                                <Avatar icon={<UserOutlined />} style={{ background: '#fa8c16' }} />
                                <div style={{ flex: 1 }}>
                                    <Text strong>{w.fullName}</Text>
                                    <div style={{ fontSize: 12, color: '#999' }}>{w.phone}</div>
                                </div>
                                <Tag color={activeProjects > 2 ? 'orange' : 'default'}>
                                    {activeProjects} dự án hiện tại
                                </Tag>
                            </div>
                        );
                    })}
                    {selectedWorkers.length > 0 && (
                        <Alert
                            message={<>Đã chọn: <strong>{selectedWorkers.length} thợ</strong></>}
                            type="success" showIcon style={{ marginTop: 8 }}
                        />
                    )}
                </Card>

                {/* Section 4: Material Estimate */}
                <Card title={<><BulbOutlined /> Vật tư dự kiến (tính từ định mức {areaM2}m²)</>}
                    style={{ marginBottom: 16 }}>
                    {materialEstimate.length === 0 ? (
                        <Text type="secondary">Chưa có định mức cho loại hình: {constructionType}</Text>
                    ) : (
                        materialEstimate.map((m, i) => (
                            <Row key={i} align="middle" gutter={16} style={{ marginBottom: 10 }}>
                                <Col flex="auto">
                                    <Text strong>{m.materialName}</Text>
                                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                                        {areaM2} × {m.usagePerM2} = {m.qty}
                                    </Text>
                                </Col>
                                <Col>
                                    <InputNumber
                                        value={m.qty}
                                        min={0}
                                        addonAfter={m.materialName.includes('lít') ? 'lít' : 'kg'}
                                        style={{ width: 160 }}
                                    />
                                </Col>
                                <Col>
                                    <Tag color={m.stockOk ? 'success' : 'error'}>
                                        {m.stockOk ? '✅ Đủ kho' : '⚠️ Thiếu kho'}
                                    </Tag>
                                </Col>
                            </Row>
                        ))
                    )}
                </Card>

                {/* Section 5: Notes */}
                <Card title={<><FileTextOutlined /> Ghi chú nội bộ</>} style={{ marginBottom: 24 }}>
                    <Form.Item name="notes">
                        <Input.TextArea rows={3} placeholder="Ghi chú đặc biệt từ KH, yêu cầu lịch thi công..." />
                    </Form.Item>
                </Card>

                <Divider />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <Button size="large" onClick={() => navigate(-1)}>Hủy</Button>
                     <Button
                        type="primary"
                        size="large"
                        icon={isEdit ? <SaveOutlined /> : <CheckCircleOutlined />}
                        loading={saving}
                        onClick={handleSubmit}
                    >
                        {isEdit ? 'Lưu thay đổi' : '🔨 Tạo dự án'}
                    </Button>
                </div>
            </Form>

            {/* Template Preview Modal */}
            <Modal
                title={`📑 ${preview?.name} – ${preview?.steps.length} bước`}
                open={templateModalOpen}
                onCancel={() => setTemplateModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setTemplateModalOpen(false)}>Đóng</Button>,
                    <Button key="use" type="primary" onClick={() => setTemplateModalOpen(false)}>
                        Dùng template này
                    </Button>,
                ]}
                width={560}
            >
                <Steps
                    direction="vertical"
                    size="small"
                    items={(preview?.steps ?? []).map((s: ChecklistStep) => ({
                        title: <Text strong style={{ fontSize: 13 }}>{s.order}. {s.name}</Text>,
                        description: (
                            <Space style={{ fontSize: 12, color: '#999' }}>
                                <span>{s.description}</span>
                                <Tag style={{ fontSize: 10 }}>≥ {s.minPhotos} ảnh</Tag>
                            </Space>
                        ),
                        status: 'wait' as const,
                    }))}
                />
            </Modal>
        </div>
    );
};

export default ProjectCreate;
