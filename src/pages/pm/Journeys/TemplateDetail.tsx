import React, { useState } from 'react';
import {
    Card, Button, Tag, Space, Typography, Row, Col, Descriptions,
    Modal, Form, Input, Select, Switch, List, Badge
} from 'antd';
import {
    ArrowLeftOutlined, PlusOutlined, EditOutlined,
    SaveOutlined, ReloadOutlined, SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockJourneyTemplates } from '../../../data/journeyMockData';
import type { JourneyStepDef } from '../../../types/journey';

const { Text, Title } = Typography;
const { TextArea } = Input;

const TemplateDetail: React.FC = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();
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

    const handleSaveStep = () => {
        stepForm.validateFields().then(values => {
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
        });
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
                    <Button icon={<SaveOutlined />} type="primary">
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
                            {template.is_default && <Tag color="gold">⭐ Mặc định</Tag>}
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
                            renderItem={(step, idx) => (
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
                                        <Button key="edit" size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); openEditStep(step); }} />
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Badge count={idx + 1} style={{ background: step.publish_flag ? '#1976D2' : '#999' }} />}
                                        title={<Text strong style={{ fontSize: 13 }}>{step.step_name}</Text>}
                                        description={
                                            <Space size={2}>
                                                <Text style={{ fontSize: 10 }}>{step.owner_role}</Text>
                                                {step.sla_hours && <Tag style={{ fontSize: 9, padding: '0 3px', margin: 0 }}>{step.sla_hours}h</Tag>}
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
                                <Descriptions.Item label="Vai trò tham gia">
                                    {selectedStep.participant_roles.map(r => <Tag key={r}>{r}</Tag>)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Vai trò chính">{selectedStep.owner_role}</Descriptions.Item>
                                <Descriptions.Item label="SLA (giờ)">{selectedStep.sla_hours ?? '—'}</Descriptions.Item>
                                <Descriptions.Item label="Quy tắc leo thang">{selectedStep.escalation_rule || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Tài liệu/Quy trình (Ref)">{selectedStep.process_refs?.join(', ') || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Checklist (Ref)">{selectedStep.checklist_refs?.join(', ') || '—'}</Descriptions.Item>
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

            {/* Step Config Editor Modal */}
            <Modal
                title={editingStep ? 'Chỉnh sửa bước' : 'Thêm bước mới'}
                open={showStepModal}
                onCancel={() => { setShowStepModal(false); stepForm.resetFields(); }}
                onOk={handleSaveStep}
                okText="Lưu"
                cancelText="Hủy"
                width={600}
            >
                <Form form={stepForm} layout="vertical">
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Mã step" name="step_code" rules={[{ required: true }]}>
                                <Input placeholder="VD: HANDOVER" disabled={!!editingStep} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Tên bước" name="step_name" rules={[{ required: true }]}>
                                <Input placeholder="VD: Bàn giao công trình" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Mục tiêu bước" name="step_goal" rules={[{ required: true }]}>
                        <TextArea rows={2} />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Vai trò tham gia" name="participant_roles" rules={[{ required: true }]}>
                                <Select mode="multiple" options={[
                                    { value: 'PM', label: 'PM' },
                                    { value: 'Sale', label: 'Sale' },
                                    { value: 'Giám sát', label: 'Giám sát' },
                                    { value: 'Kế toán', label: 'Kế toán' },
                                ]} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Vai trò chủ chốt" name="owner_role" rules={[{ required: true }]}>
                                <Select options={[
                                    { value: 'PM', label: 'PM' },
                                    { value: 'Sale', label: 'Sale' },
                                    { value: 'Giám sát', label: 'Giám sát' },
                                ]} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="SLA (giờ)" name="sla_hours">
                                <Input type="number" placeholder="24" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Publish lên Portal" name="publish_flag" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Quy tắc leo thang (Escalation Rule)" name="escalation_rule">
                        <Input placeholder="VD: Báo quản lý sau 4h trễ SLA" />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Tài liệu/Quy trình" name="process_refs">
                                <Select mode="tags" placeholder="Link hoặc mã TL" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Checklist" name="checklist_refs">
                                <Select mode="tags" placeholder="Mã checklist" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Điều kiện vào" name="entry_criteria">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="Điều kiện hoàn tất" name="exit_criteria">
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Reset to Default Confirm (DLG-10) */}
            <Modal
                title="Reset về mặc định"
                open={showResetModal}
                onCancel={() => { setShowResetModal(false); resetForm.resetFields(); }}
                onOk={() => {
                    resetForm.validateFields().then(() => {
                        setSteps(template.steps);
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
