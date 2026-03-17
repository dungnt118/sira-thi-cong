import React, { useState } from 'react';
import {
    Card, Button, Tag, Space, Typography, Row, Col, Descriptions,
    Modal, Form, Input, List, Badge, message
} from 'antd';
import {
    ArrowLeftOutlined, PlusOutlined, EditOutlined,
    SaveOutlined, ReloadOutlined, SettingOutlined, DeleteOutlined, StarFilled
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { mockJourneyTemplates as defaultTemplates } from '../../../data/journeyMockData';
import type { JourneyStepDef, JourneyTemplate } from '../../../types/journey';
import StepConfigModal from './StepConfigModal';

const { Text, Title } = Typography;

const TemplateDetail: React.FC = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();
    const [mockJourneyTemplates, setMockJourneyTemplates] = useLocalStorageData<JourneyTemplate[]>(demoDataService.KEYS.JOURNEY_TEMPLATES, defaultTemplates);
    const template = mockJourneyTemplates.find(t => t.id === templateId);

    const [steps, setSteps] = useState<JourneyStepDef[]>(template?.steps || []);
    const [selectedStep, setSelectedStep] = useState<JourneyStepDef | null>(steps[0] || null);
    const [showStepModal, setShowStepModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [editingStep, setEditingStep] = useState<JourneyStepDef | null>(null);
    const [stepForm] = Form.useForm();
    const [resetForm] = Form.useForm();

    if (!template) {
        return (
            <div style={{ padding: 40 }}>
                <Button onClick={() => navigate('/pm/journeys/templates')}>Quay lại</Button>
                <div style={{ marginTop: 16 }}>Không tìm thấy template</div>
            </div>
        );
    }

    const openEditStep = (step: JourneyStepDef) => {
        setEditingStep(step);
        stepForm.setFieldsValue({
            ...step,
            participant_roles: step.participant_roles,
            publish_flag: step.publish_flag,
        });
        setShowStepModal(true);
    };

    const openAddStep = () => {
        setEditingStep(null);
        stepForm.resetFields();
        setShowStepModal(true);
    };
    const handleSaveTemplate = () => {
        if (!template) return;
        const updatedTemplates = mockJourneyTemplates.map(t => 
            t.id === templateId ? { ...t, steps, updated_at: new Date().toISOString() } : t
        );
        setMockJourneyTemplates(updatedTemplates);
        message.success('Đã lưu template thành công');
    };

    const handleResetToDefault = () => {
        if (!template) return;
        const defaultTpl = defaultTemplates.find(t => t.id === templateId);
        if (defaultTpl) {
            setSteps(defaultTpl.steps);
            handleSaveTemplate();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/pm/journeys/templates')}>
                    Danh sách Template
                </Button>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={() => setShowResetModal(true)} danger>
                        Reset về mặc định
                    </Button>
                    <Button icon={<SaveOutlined />} type="primary" onClick={handleSaveTemplate}>
                        Lưu Template
                    </Button>
                </Space>
            </div>

            {/* Template Header */}
            <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, #f5f7ff 0%, #e8f0ff 100%)', borderRadius: 10 }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Title level={4} style={{ margin: 0 }}>{template.template_name}</Title>
                        <Space style={{ marginTop: 4 }}>
                            <Tag>{template.template_code}</Tag>
                            <Tag color="blue">{template.service_type}</Tag>
                            <Tag color={template.status === 'active' ? 'success' : 'warning'}>{template.status}</Tag>
                            <Tag>{template.version_label}</Tag>
                            {template.is_default && <Tag color="gold" icon={<StarFilled />}>Mặc định</Tag>}
                        </Space>
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">{template.description}</Text>
                        </div>
                    </Col>
                    <Col>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 32, fontWeight: 700, color: '#1976D2' }}>{steps.length}</div>
                            <Text type="secondary">Bước</Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Row gutter={16}>
                {/* Step List */}
                <Col xs={24} md={10}>
                    <Card
                        title={<Space><SettingOutlined /> Danh sách bước</Space>}
                        extra={<Button size="small" icon={<PlusOutlined />} onClick={openAddStep}>Thêm bước</Button>}
                        style={{ borderRadius: 10 }}
                    >
                        <List
                            dataSource={steps}
                            renderItem={(step: JourneyStepDef, idx) => (
                                <List.Item
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: 6,
                                        padding: '8px 12px',
                                        background: selectedStep?.step_code === step.step_code ? '#e6f4ff' : 'transparent',
                                        border: selectedStep?.step_code === step.step_code ? '1px solid #91caff' : '1px solid transparent',
                                        marginBottom: 4,
                                    }}
                                    onClick={() => setSelectedStep(step)}
                                    actions={[
                                        <Space key="actions" size={4}>
                                            <Button size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); openEditStep(step); }} />
                                            <Button size="small" danger type="text" icon={<DeleteOutlined />} onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setSteps(prev => prev.filter(s => s.step_code !== step.step_code));
                                                if (selectedStep?.step_code === step.step_code) setSelectedStep(null);
                                            }} />
                                        </Space>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Badge count={idx + 1} style={{ background: step.publish_flag ? '#1976D2' : '#999' }} />}
                                        title={<Text strong style={{ fontSize: 13 }}>{step.step_name}</Text>}
                                        description={
                                            <Space size={2}>
                                                <Text style={{ fontSize: 10 }}>{step.roleConfigurations?.map(r => r.roleId).join(', ') || step.owner_role}</Text>
                                                <Tag style={{ fontSize: 9, padding: '0 3px', margin: 0 }}>
                                                    {step.roleConfigurations ? Math.max(...step.roleConfigurations.map(r => r.slaHours)) : (step.sla_hours || 0)}h
                                                </Tag>
                                                {step.publish_flag && <Tag color="blue" style={{ fontSize: 9, padding: '0 3px', margin: 0 }}>Portal</Tag>}
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Step Detail Panel */}
                <Col xs={24} md={14}>
                    <Card
                        title={selectedStep ? `Chi tiết: ${selectedStep.step_name}` : 'Chọn bước để xem chi tiết'}
                        style={{ borderRadius: 10 }}
                    >
                        {selectedStep ? (
                            <Descriptions bordered size="small" column={1}>
                                <Descriptions.Item label="Mã step">{selectedStep.step_code}</Descriptions.Item>
                                <Descriptions.Item label="Thứ tự">{selectedStep.step_order}</Descriptions.Item>
                                <Descriptions.Item label="Mục tiêu">{selectedStep.step_goal}</Descriptions.Item>
                                {selectedStep.standardProcedureGroupCd && (
                                    <Descriptions.Item label="Nhóm quy trình chuẩn">
                                        <Tag color="purple">{selectedStep.standardProcedureGroupCd}</Tag>
                                    </Descriptions.Item>
                                )}
                                <Descriptions.Item label="Cấu hình Vai trò">
                                    {selectedStep.roleConfigurations ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {selectedStep.roleConfigurations.map(r => (
                                                <Card size="small" key={r.roleId}>
                                                    <div>
                                                        <Text strong>{r.roleId}</Text>
                                                        {r.isKeyRole && <Tag color="orange" style={{ marginLeft: 8 }}>Chốt Step</Tag>}
                                                        {r.isEditable && <Tag color="green" style={{ marginLeft: 8 }}>Có quyền sửa</Tag>}
                                                        <Tag style={{ marginLeft: 8 }}>SLA: {r.slaHours}h</Tag>
                                                        {r.dependencyRole && <Tag>Sau: {r.dependencyRole}</Tag>}
                                                    </div>
                                                    {r.instructions && <div style={{ fontSize: 12, marginTop: 4 }}>- HD: {r.instructions}</div>}
                                                    {r.checklists && r.checklists.length > 0 && (
                                                        <div style={{ fontSize: 12, marginTop: 4 }}>
                                                            - Checklist:
                                                            <ul>
                                                                {r.checklists.map((c, i) => <li key={i}>{c}</li>)}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <Space>
                                            {(selectedStep.participant_roles || []).map(r => <Tag key={r}>{r}</Tag>)}
                                            <Tag color="orange">Key: {selectedStep.owner_role}</Tag>
                                        </Space>
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Điều kiện vào">{selectedStep.entry_criteria || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Điều kiện hoàn tất">{selectedStep.exit_criteria || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Publish lên Portal">
                                    <Tag color={selectedStep.publish_flag ? 'blue' : 'default'}>
                                        {selectedStep.publish_flag ? 'Có' : 'Không'}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                                Chọn 1 bước ở danh sách bên trái
                            </div>
                        )}
                    </Card>

                    <Card title="Lịch sử phiên bản" size="small" style={{ marginTop: 12, borderRadius: 10 }}>
                        <Descriptions size="small" column={2}>
                            <Descriptions.Item label="Phiên bản hiện tại">{template.version_label}</Descriptions.Item>
                            <Descriptions.Item label="Cập nhật lúc">{template.updated_at.split('T')[0]}</Descriptions.Item>
                            <Descriptions.Item label="Tạo lúc">{template.created_at.split('T')[0]}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            <StepConfigModal
                open={showStepModal}
                initialData={editingStep}
                onSave={(values) => {
                    if (editingStep) {
                        setSteps(prev => prev.map(s => s.step_code === editingStep.step_code ? { ...s, ...values } : s));
                        setSelectedStep({ ...editingStep, ...values });
                    } else {
                        const newStep: JourneyStepDef = {
                            ...values,
                            step_order: steps.length + 1,
                        };
                        setSteps(prev => [...prev, newStep]);
                    }
                    setShowStepModal(false);
                }}
                onCancel={() => setShowStepModal(false)}
            />

            {/* Reset to Default Confirm (DLG-10) */}
            <Modal
                title="Reset về mặc định"
                open={showResetModal}
                onCancel={() => { setShowResetModal(false); resetForm.resetFields(); }}
                onOk={() => {
                    resetForm.validateFields().then(() => {
                        handleResetToDefault();
                        setShowResetModal(false);
                        resetForm.resetFields();
                    }).catch(info => {
                        console.log('Validate Failed:', info);
                    });
                }}
                okText="Xác nhận Reset"
                okButtonProps={{ danger: true }}
                cancelText="Hủy"
            >
                <Form form={resetForm} layout="vertical">
                    <p style={{ color: '#fa8c16' }}>⚠ Hành động này sẽ xóa tất cả thay đổi và khôi phục template về phiên bản gốc.</p>
                    <Form.Item
                        label="Gõ 'RESET' để xác nhận"
                        name="confirm_text"
                        rules={[{ required: true, message: 'Vui lòng gõ RESET', validator: async (_, value) => {
                            if (value !== 'RESET') {
                                return Promise.reject(new Error('Vui lòng gõ đúng chữ RESET viết hoa'));
                            }
                            return Promise.resolve();
                        }}]}
                    >
                        <Input placeholder="RESET" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TemplateDetail;
