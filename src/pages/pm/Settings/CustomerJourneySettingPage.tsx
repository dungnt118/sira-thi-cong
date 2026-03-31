import React, { useState, useEffect } from 'react';
import {
    Card, Button, Space, Typography, Row, Col, Descriptions,
    Tag, Badge, List, message, Spin, Empty
} from 'antd';
import {
    SettingOutlined, PlusOutlined, EditOutlined,
    SaveOutlined, ReloadOutlined, DeleteOutlined, StarFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { find_setting, save_setting } from '@/store/actions/data/data.action';
import type { ICustomerJourneySetting, IStepsItem } from '@/services/core-contracts/types/customerJourneySetting.types';
import StepConfigModal from '../Journeys/StepConfigModal';

const { Text, Title } = Typography;

const CustomerJourneySettingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [setting, setSetting] = useState<ICustomerJourneySetting | null>(null);
    const [steps, setSteps] = useState<any[]>([]); // Using any for compatibility with UI-rich steps
    const [selectedStep, setSelectedStep] = useState<any | null>(null);
    
    const [showStepModal, setShowStepModal] = useState(false);
    const [editingStep, setEditingStep] = useState<any | null>(null);

    const SCHEMA = 'CustomerJourneySetting';

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await find_setting<ICustomerJourneySetting>({ schema: SCHEMA }, dispatch);
            if (res?.data) {
                setSetting(res.data);
                // Extract steps from setting. In this schema, we might use the 'steps' array
                // Or map from individual fields if they are populated. 
                // For now, we prioritize the 'steps' array which matches the UI list.
                setSteps(res.data.steps || []);
                if (res.data.steps && res.data.steps.length > 0) {
                    setSelectedStep(res.data.steps[0]);
                }
            }
        } catch (error) {
            message.error('Không thể tải cấu hình Customer Journey');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async () => {
        if (!setting && !steps.length) return;
        
        setSaving(true);
        try {
            const dataToSave = {
                ...setting,
                setting_key: 'default_journey',
                setting_name: 'Hành trình khách hàng chuẩn',
                steps: steps.map((s, idx) => ({
                    ...s,
                    order: idx + 1,
                    is_enabled: true
                })),
                is_active: true
            };
            
            const res = await save_setting({ schema: SCHEMA, data: dataToSave }, dispatch);
            if (res?.code === 0) {
                message.success('Đã lưu cấu hình thành công');
                loadData(); // Reload to get IDs/updated state
            } else {
                message.error(res?.message || 'Lỗi khi lưu cấu hình');
            }
        } catch (error) {
            message.error('Lỗi kết nối khi lưu cấu hình');
        } finally {
            setSaving(false);
        }
    };

    const openEditStep = (step: any) => {
        setEditingStep(step);
        setShowStepModal(true);
    };

    const openAddStep = () => {
        setEditingStep(null);
        setShowStepModal(true);
    };

    if (loading) {
        return (
            <div style={{ padding: 100, textAlign: 'center' }}>
                <Spin size="large" tip="Đang tải cấu hình..." />
            </div>
        );
    }

    return (
        <div style={{ padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Cấu hình Customer Journey</Title>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={loadData} disabled={saving}>
                        Làm mới
                    </Button>
                    <Button 
                        icon={<SaveOutlined />} 
                        type="primary" 
                        onClick={handleSave} 
                        loading={saving}
                    >
                        Lưu Cấu hình
                    </Button>
                </Space>
            </div>

            {/* Header Info */}
            <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, #f5f7ff 0%, #e8f0ff 100%)', borderRadius: 10 }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Title level={5} style={{ margin: 0 }}>{setting?.setting_name || 'Hành trình Khách hàng chuẩn'}</Title>
                        <Space style={{ marginTop: 4 }}>
                            <Tag color="blue">Single Schema Setting</Tag>
                            <Tag>{setting?.version_label || 'v1.0'}</Tag>
                            {setting?.is_active && <Tag color="success">Đang hoạt động</Tag>}
                        </Space>
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">{setting?.note || 'Cấu hình quy trình chung cho hành trình khách hàng tại SIRA'}</Text>
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
                        {steps.length === 0 ? (
                            <Empty description="Chưa có bước nào trong quy trình" />
                        ) : (
                            <List
                                dataSource={steps}
                                renderItem={(step: any, idx) => (
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
                                                    const newSteps = steps.filter(s => s.step_code !== step.step_code);
                                                    setSteps(newSteps);
                                                    if (selectedStep?.step_code === step.step_code) {
                                                        setSelectedStep(newSteps.length > 0 ? newSteps[0] : null);
                                                    }
                                                }} />
                                            </Space>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Badge count={idx + 1} style={{ background: step.is_enabled !== false ? '#1976D2' : '#999' }} />}
                                            title={<Text strong style={{ fontSize: 13 }}>{step.step_name}</Text>}
                                            description={
                                                <Space size={2}>
                                                    <Text style={{ fontSize: 10 }}>{step.owner_role_id || step.owner_role || 'Chưa gán'}</Text>
                                                    <Tag style={{ fontSize: 9, padding: '0 3px', margin: 0 }}>
                                                        {step.sla_hours || 0}h
                                                    </Tag>
                                                    {step.portal_visible && <Tag color="blue" style={{ fontSize: 9, padding: '0 3px', margin: 0 }}>Portal</Tag>}
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
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
                                <Descriptions.Item label="Mục tiêu">{selectedStep.step_goal || selectedStep.goal || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Vai trò chính">
                                    <Tag color="orange">{selectedStep.owner_role_id || selectedStep.owner_role || 'N/A'}</Tag>
                                </Descriptions.Item>
                                {selectedStep.roleConfigurations && (
                                    <Descriptions.Item label="Cấu hình Vai trò chi tiết">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {selectedStep.roleConfigurations.map((r: any) => (
                                                <Card size="small" key={r.roleId}>
                                                    <Text strong>{r.roleId}</Text>
                                                    {r.isKeyRole && <Tag color="orange" style={{ marginLeft: 8 }}>Chốt Step</Tag>}
                                                    <Tag style={{ marginLeft: 8 }}>SLA: {r.slaHours}h</Tag>
                                                    {r.instructions && <div style={{ fontSize: 12, marginTop: 4 }}>- HD: {r.instructions}</div>}
                                                </Card>
                                            ))}
                                        </div>
                                    </Descriptions.Item>
                                )}
                                <Descriptions.Item label="Mô tả / Hướng dẫn">{selectedStep.instruction_note || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Publish lên Portal">
                                    <Tag color={selectedStep.portal_visible ? 'blue' : 'default'}>
                                        {selectedStep.portal_visible ? 'Có' : 'Không'}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Bỏ qua bước này?">
                                    {selectedStep.allow_skip ? 'Cho phép' : 'Bắt buộc'}
                                </Descriptions.Item>
                            </Descriptions>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                                <Empty description="Chọn 1 bước ở danh sách bên trái" />
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <StepConfigModal
                open={showStepModal}
                initialData={editingStep}
                onSave={(values) => {
                    // Normalize fields from Modal to ICustomerJourneySetting format
                    const normalizedValues = {
                        ...values,
                        portal_visible: values.publish_flag, // publish_flag in UI -> portal_visible in type
                    };
                    
                    if (editingStep) {
                        const newSteps = steps.map(s => s.step_code === editingStep.step_code ? { ...s, ...normalizedValues } : s);
                        setSteps(newSteps);
                        setSelectedStep({ ...editingStep, ...normalizedValues });
                    } else {
                        const newStep = {
                            ...normalizedValues,
                            step_order: steps.length + 1,
                        };
                        setSteps([...steps, newStep]);
                        if (steps.length === 0) setSelectedStep(newStep);
                    }
                    setShowStepModal(false);
                }}
                onCancel={() => setShowStepModal(false)}
            />
        </div>
    );
};

export default CustomerJourneySettingPage;
