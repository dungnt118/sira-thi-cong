import {
    CopyOutlined,
    DeleteOutlined,
    DragOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Card,
    Col,
    Form, Input, InputNumber,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch, Table,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { mockTemplates as defaultTemplates } from '../../../data/mockData';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import type { ChecklistTemplate } from '../../../types/v3';

const { Title, Text } = Typography;

type TemplateStep = ChecklistTemplate['steps'][0];

const CONSTRUCTION_TYPES = [
    'Chống thấm sàn',
    'Chống thấm tường',
    'Chống thấm mái',
    'Chống thấm nhà vệ sinh',
    'Phức hợp',
];

const TemplateChecklist: React.FC = () => {
    const [templates, setTemplates] = useLocalStorageData<ChecklistTemplate[]>(demoDataService.KEYS.TEMPLATES, defaultTemplates);
    const [viewTemplate, setViewTemplate] = useState<ChecklistTemplate | null>(null);
    const [editTemplate, setEditTemplate] = useState<ChecklistTemplate | null>(null);
    const [stepModalOpen, setStepModalOpen] = useState(false);
    const [editStep, setEditStep] = useState<TemplateStep | null>(null);
    const [stepForm] = Form.useForm();
    const [templateForm] = Form.useForm();

    const handleCopy = (tpl: ChecklistTemplate) => {
        const newTpl: ChecklistTemplate = {
            ...tpl,
            id: `TPL-COPY-${Date.now()}`,
            name: `${tpl.name} (bản sao)`,
            isDefault: false,
            usedInProjects: 0,
        };
        setTemplates(prev => [...prev, newTpl]);
    };

    const handleDelete = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    const openEdit = (tpl: ChecklistTemplate) => {
        setEditTemplate({ ...tpl, steps: [...tpl.steps] });
        templateForm.setFieldsValue({ name: tpl.name, description: tpl.description, category: tpl.category });
    };

    const openAddStep = () => {
        setEditStep(null);
        stepForm.resetFields();
        setStepModalOpen(true);
    };

    const openEditStep = (step: TemplateStep) => {
        setEditStep(step);
        stepForm.setFieldsValue(step);
        setStepModalOpen(true);
    };

    const saveStep = () => {
        stepForm.validateFields().then(values => {
            if (!editTemplate) return;
            if (editStep) {
                // Edit existing
                setEditTemplate(prev => prev ? {
                    ...prev,
                    steps: prev.steps.map(s => s.id === editStep.id ? { ...s, ...values } : s),
                } : prev);
            } else {
                // Add new
                const newStep: TemplateStep = {
                    id: `step-${Date.now()}`,
                    order: (editTemplate.steps.length || 0) + 1,
                    ...values,
                };
                setEditTemplate(prev => prev ? { ...prev, steps: [...prev.steps, newStep] } : prev);
            }
            setStepModalOpen(false);
        });
    };

    const deleteStep = (stepId: string) => {
        setEditTemplate(prev => prev ? {
            ...prev,
            steps: prev.steps.filter(s => s.id !== stepId).map((s, i) => ({ ...s, order: i + 1 })),
        } : prev);
    };

    const saveTemplate = () => {
        if (!editTemplate) return;
        const values = templateForm.getFieldsValue();
        const updated = { ...editTemplate, ...values };
        setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
        setEditTemplate(null);
    };

    const stepColumns: ColumnsType<TemplateStep> = [
        {
            title: '', width: 32,
            render: () => <DragOutlined style={{ color: '#bbb', cursor: 'grab' }} />,
        },
        { title: '#', dataIndex: 'order', width: 36 },
        {
            title: 'Tên bước',
            render: (_, s) => (
                <div>
                    <Text strong style={{ fontSize: 13 }}>{s.name}</Text>
                    <div style={{ fontSize: 11, color: '#999' }}>{s.description}</div>
                </div>
            ),
        },
        {
            title: 'Ảnh tối thiểu', dataIndex: 'minPhotos', width: 110,
            render: v => <Tag>≥ {v} ảnh</Tag>,
        },
        {
            title: 'Video', dataIndex: 'allowVideo', width: 70,
            render: v => <Tag color={v ? 'blue' : 'default'}>{v ? 'Có' : 'Không'}</Tag>,
        },
        {
            title: '', width: 90,
            render: (_, s) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button size="small" icon={<EditOutlined />} onClick={() => openEditStep(s)} />
                    </Tooltip>
                    <Popconfirm title="Xóa bước này?" onConfirm={() => deleteStep(s.id)}>
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // =================== EDITOR VIEW ===================
    if (editTemplate) {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <Button onClick={() => setEditTemplate(null)}>← Danh sách</Button>
                    <Title level={4} style={{ margin: 0, flex: 1 }}>
                        ✏️ Sửa Template: {editTemplate.name}
                    </Title>
                    <Space>
                        <Button onClick={() => setEditTemplate(null)}>Hủy</Button>
                        <Button type="primary" icon={<SaveOutlined />} onClick={saveTemplate}>
                            Lưu template
                        </Button>
                    </Space>
                </div>

                <Card style={{ marginBottom: 16 }}>
                    <Form form={templateForm} layout="vertical">
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="name" label="Tên template *" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="category" label="Loại hình thi công">
                                    <Select options={CONSTRUCTION_TYPES.map(t => ({ value: t, label: t }))} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="description" label="Mô tả">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </Form>
                </Card>

                <Card
                    title={`📋 Các bước thi công (${editTemplate.steps.length} bước)`}
                    extra={<Button icon={<PlusOutlined />} type="primary" onClick={openAddStep}>Thêm bước</Button>}
                >
                    <Alert
                        message="💡 Kéo thả dòng (ký hiệu ≡) để sắp xếp thứ tự các bước"
                        type="info" showIcon style={{ marginBottom: 12 }}
                    />
                    <Table
                        dataSource={editTemplate.steps}
                        columns={stepColumns}
                        rowKey="id"
                        pagination={false}
                        size="middle"
                    />
                </Card>

                {/* Step Add/Edit Modal */}
                <Modal
                    title={editStep ? 'Sửa bước' : 'Thêm bước mới'}
                    open={stepModalOpen}
                    onCancel={() => setStepModalOpen(false)}
                    onOk={saveStep}
                    okText="Lưu bước"
                >
                    <Form form={stepForm} layout="vertical">
                        <Form.Item name="name" label="Tên bước *" rules={[{ required: true }]}>
                            <Input placeholder="VD: Quét BACPU lớp lót lần 1" />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả / Hướng dẫn cho thợ">
                            <Input.TextArea rows={3} placeholder="Quét đều tay, không để bọt khí..." />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="minPhotos" label="Ảnh tối thiểu" initialValue={2}>
                                    <InputNumber min={1} max={10} addonAfter="ảnh" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="allowVideo" label="Cho phép upload video" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }

    // =================== LIST VIEW ===================
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>📑 Quản lý Template Checklist</Title>
                    <Text type="secondary">Tạo và quản lý các quy trình thi công tiêu chuẩn</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        const newTpl: ChecklistTemplate = {
                            id: `TPL-NEW-${Date.now()}`,
                            name: 'Template mới',
                            description: '',
                            category: 'Chống thấm sàn',
                            isDefault: false,
                            usedInProjects: 0,
                            steps: [],
                        };
                        setTemplates(prev => [...prev, newTpl]);
                        openEdit(newTpl);
                    }}
                >
                    + Tạo template mới
                </Button>
            </div>

            <Alert
                message="Template được dùng khi tạo dự án (WF-07). Template đang được dùng bởi dự án active không thể xóa."
                type="info" showIcon style={{ marginBottom: 16 }}
            />

            {templates.map(tpl => (
                <Card
                    key={tpl.id}
                    style={{ marginBottom: 12, border: tpl.isDefault ? '1px solid #1976D2' : undefined }}
                >
                    <Row justify="space-between" align="middle">
                        <Col flex="auto">
                            <Space align="start">
                                <div>
                                    <Space>
                                        <Text strong style={{ fontSize: 15 }}>
                                            {tpl.isDefault ? '🌟 ' : ''}{tpl.name}
                                        </Text>
                                        {tpl.isDefault && <Tag color="blue">Mặc định</Tag>}
                                        <Tag>{tpl.steps.length} bước</Tag>
                                        <Tag color="purple">{tpl.category}</Tag>
                                    </Space>
                                    <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                                        {tpl.description}
                                        {tpl.usedInProjects > 0 && ` · Dùng trong ${tpl.usedInProjects} dự án`}
                                    </div>
                                </div>
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <Tooltip title="Xem trước">
                                    <Button icon={<EyeOutlined />} onClick={() => setViewTemplate(tpl)} />
                                </Tooltip>
                                <Tooltip title="Sao chép">
                                    <Button icon={<CopyOutlined />} onClick={() => handleCopy(tpl)} />
                                </Tooltip>
                                {tpl.isDefault ? (
                                    <Tooltip title="Template mặc định không thể sửa trực tiếp. Hãy sao chép và sửa bản copy.">
                                        <Button disabled icon={<EditOutlined />} />
                                    </Tooltip>
                                ) : (
                                    <Button icon={<EditOutlined />} onClick={() => openEdit(tpl)}>Sửa</Button>
                                )}
                                {!tpl.isDefault && (
                                    <Popconfirm
                                        title="Xóa template này?"
                                        disabled={tpl.usedInProjects > 0}
                                        onConfirm={() => handleDelete(tpl.id)}
                                    >
                                        <Tooltip title={tpl.usedInProjects > 0 ? 'Đang được dùng, không thể xóa' : 'Xóa'}>
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                disabled={tpl.usedInProjects > 0}
                                            />
                                        </Tooltip>
                                    </Popconfirm>
                                )}
                            </Space>
                        </Col>
                    </Row>
                </Card>
            ))}

            {/* Template Preview Modal */}
            <Modal
                title={`👁 ${viewTemplate?.name} – ${viewTemplate?.steps.length} bước`}
                open={!!viewTemplate}
                onCancel={() => setViewTemplate(null)}
                footer={<Button onClick={() => setViewTemplate(null)}>Đóng</Button>}
                width={560}
            >
                {viewTemplate?.steps.map(s => (
                    <div key={s.id} style={{ marginBottom: 10, padding: '8px 12px', borderRadius: 6, background: '#fafafa' }}>
                        <Text strong style={{ fontSize: 13 }}>{s.order}. {s.name}</Text>
                        <div style={{ fontSize: 12, color: '#999' }}>{s.description}</div>
                        <Space style={{ marginTop: 4 }}>
                            <Tag style={{ fontSize: 10 }}>≥ {s.minPhotos} ảnh</Tag>
                            {s.allowVideo && <Tag color="blue" style={{ fontSize: 10 }}>Video</Tag>}
                        </Space>
                    </div>
                ))}
            </Modal>
        </div>
    );
};

export default TemplateChecklist;
