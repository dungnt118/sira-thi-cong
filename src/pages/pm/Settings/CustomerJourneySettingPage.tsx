import React, { useState, useEffect, useMemo } from 'react';
import {
    Card, Button, Space, Typography, Row, Col, Descriptions,
    Tag, Badge, List, message, Spin, Divider,
    Form, Input, Switch, Select, Table, Collapse
} from 'antd';
import {
    SettingOutlined, EditOutlined,
    SaveOutlined, ReloadOutlined, InfoCircleOutlined,
    CheckCircleOutlined, PlusOutlined, DeleteOutlined,
    CaretRightFilled, GlobalOutlined
} from '@ant-design/icons';
import { useAppDispatch } from '@/store/hooks';
import { find_setting, save_setting } from '@/store/actions/data/data.action';
import type { ICustomerJourneySetting, IRolesItem, IChecklistItem } from '@/services/core-contracts/types/customerJourneySetting.types';
import IndexedSelect from '../../../components/common/Form/IndexedSelect';
import IndexedView from '../../../components/common/Form/IndexedView';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

const FIXED_STEPS = [
    { code: 'lead_intake', name: 'Bước 01 - Tiếp nhận lead' },
    { code: 'qualification', name: 'Bước 02 - Sàng lọc nhu cầu' },
    { code: 'survey_planning', name: 'Bước 03 - Lập lịch khảo sát' },
    { code: 'site_survey', name: 'Bước 04 - Khảo sát hiện trạng' },
    { code: 'survey_review', name: 'Bước 05 - Review khảo sát' },
    { code: 'estimate_preparation', name: 'Bước 06 - Lập dự toán nội bộ' },
    { code: 'quotation_preparation', name: 'Bước 07 - Soạn báo giá' },
    { code: 'quotation_sent', name: 'Bước 08 - Gửi báo giá' },
    { code: 'quotation_approved', name: 'Bước 09 - Chốt báo giá' },
    { code: 'contract_signing', name: 'Bước 10 - Ký hợp đồng' },
    { code: 'project_execution', name: 'Bước 11 - Triển khai thi công' },
    { code: 'handover_acceptance', name: 'Bước 12 - Nghiệm thu / bàn giao' },
    { code: 'warranty_aftercare', name: 'Bước 13 - Bảo hành / chăm sóc sau bàn giao' },
];

const PERMISSION_OPTIONS = [
    { label: 'Chỉ xem', value: 'view' },
    { label: 'Sửa', value: 'edit' },
    { label: 'Chịu trách nhiệm', value: 'commit' },
];

const CustomerJourneySettingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [setting, setSetting] = useState<ICustomerJourneySetting | null>(null);
    const [selectedStepCode, setSelectedStepCode] = useState<string>(FIXED_STEPS[0].code);
    const [isEditing, setIsEditing] = useState(false);

    const SCHEMA = 'CustomerJourneySetting';

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await find_setting<ICustomerJourneySetting>({ schema: SCHEMA }, dispatch);
            if (res?.data) {
                setSetting(res.data);
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

    const stepList = useMemo(() => {
        if (!setting) return FIXED_STEPS.map((s, idx) => ({ 
            step_code: s.code, 
            step_name: s.name, 
            step_order: idx + 1,
            is_enabled: true 
        }));

        return FIXED_STEPS.map((stepDef, idx) => {
            const fieldData = (setting as any)[stepDef.code];
            const stepData = Array.isArray(fieldData) 
                ? (fieldData.length > 0 ? fieldData[0] : null)
                : (fieldData || null);
            
            if (!stepData) {
                return { step_code: stepDef.code, step_name: stepDef.name, step_order: idx + 1, is_enabled: true };
            }

            return {
                ...stepData,
                step_code: stepDef.code,
                step_name: stepDef.name,
                step_order: idx + 1
            };
        });
    }, [setting]);

    const selectedStep = useMemo(() => {
        return stepList.find(s => s.step_code === selectedStepCode);
    }, [stepList, selectedStepCode]);

    useEffect(() => {
        if (isEditing && selectedStep) {
            form.setFieldsValue({
                ...selectedStep,
                is_enabled: selectedStep.is_enabled !== false,
                portal_visible: selectedStep.portal_visible !== false,
                handoff_required: selectedStep.handoff_required === true,
                roles: selectedStep.roles || [],
                checklist: selectedStep.checklist || []
            });
        }
    }, [isEditing, selectedStepCode, form]);

    const handleSaveStep = async () => {
        const values = await form.validateFields();
        const currentSetting = setting || { _id: '' };
        
        // Remove transient fields if any exist
        const { ...cleanStep } = values;
        
        const payload: ICustomerJourneySetting = {
            ...currentSetting,
            setting_key: 'default_journey',
            setting_name: 'Hành trình khách hàng chuẩn',
            is_active: true,
            [selectedStepCode]: cleanStep
        };

        setSetting(payload);
        setSaving(true);
        try {
            const res = await save_setting({ schema: SCHEMA, data: payload }, dispatch);
            if (res?.code === 0) {
                message.success(`Đã cập nhật cấu hình ${selectedStep?.step_name}`);
                setIsEditing(false);
                loadData();
            } else {
                message.error(res?.message || 'Lỗi khi lưu cấu hình');
            }
        } catch (error) {
            message.error('Lỗi kết nối khi lưu cấu hình');
        } finally {
            setSaving(false);
        }
    };

    const handleGlobalSave = async () => {
        if (!setting) return;
        setSaving(true);
        try {
            const res = await save_setting({ schema: SCHEMA, data: setting }, dispatch);
            if (res?.code === 0) {
                message.success('Đã lưu toàn bộ cấu hình');
                loadData();
            }
        } catch (error) {
            message.error('Lỗi khi lưu cấu hình');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ padding: 100, textAlign: 'center' }}><Spin size="large" /></div>;
    }

    return (
        <div style={{ padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Cấu hình Customer Journey</Title>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={loadData} disabled={saving}>Làm mới</Button>
                    <Button icon={<SaveOutlined />} type="primary" onClick={handleGlobalSave} loading={saving}>Lưu Cấu hình</Button>
                </Space>
            </div>

            <Card style={{ marginBottom: 16, background: '#f0f2f5', border: 'none', borderRadius: 12 }}>
                <Paragraph style={{ margin: 0, color: '#595959' }}>
                    Quy trình chuẩn gồm 13 giai đoạn cố định. Thiết lập Roles, Checklist và các quyền vận hành chi tiết dựa trên lược đồ mới.
                </Paragraph>
            </Card>

            <Row gutter={24}>
                <Col span={9}>
                    <Card 
                        title={<Space><SettingOutlined /> Các giai đoạn quy trình</Space>}
                        style={{ borderRadius: 12 }}
                        bodyStyle={{ padding: '12px' }}
                    >
                        <List
                            dataSource={stepList}
                            renderItem={(step: any, idx) => (
                                <List.Item
                                    className={`step-item ${selectedStepCode === step.step_code ? 'active' : ''}`}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: 8,
                                        padding: '12px 16px',
                                        marginBottom: 8,
                                        border: '1px solid #f0f0f0',
                                        background: selectedStepCode === step.step_code ? '#e6f7ff' : '#fff',
                                        borderColor: selectedStepCode === step.step_code ? '#91d5ff' : '#f0f0f0',
                                        transition: 'all 0.3s'
                                    }}
                                    onClick={() => {
                                        setSelectedStepCode(step.step_code);
                                        setIsEditing(false);
                                    }}
                                >
                                    <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
                                        <Space>
                                            <Badge count={idx + 1} style={{ backgroundColor: step.is_enabled !== false ? '#1890ff' : '#d9d9d9' }} />
                                            <Text strong style={{ color: step.is_enabled !== false ? '#262626' : '#bfbfbf' }}>{step.step_name}</Text>
                                            {step.sla_hours > 0 && (
                                                <Tag 
                                                    color={step.is_enabled !== false ? "cyan" : "default"} 
                                                    style={{ marginLeft: 8, borderRadius: 10, fontSize: 10 }}
                                                >
                                                    {step.sla_hours}h
                                                </Tag>
                                            )}
                                            {step.portal_visible !== false && (
                                                <Tag 
                                                    color="blue" 
                                                    style={{ marginLeft: 4, borderRadius: 10, fontSize: 10 }}
                                                    icon={<GlobalOutlined />}
                                                >
                                                    Portal
                                                </Tag>
                                            )}
                                        </Space>
                                        {selectedStepCode === step.step_code && <Text style={{ color: '#1890ff', fontSize: 12 }}>Đang chọn</Text>}
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={15}>
                    <Card
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Space>
                                    {isEditing ? <EditOutlined style={{ color: '#1890ff' }} /> : <InfoCircleOutlined style={{ color: '#52c41a' }} />}
                                    <Title level={5} style={{ margin: 0 }}>{selectedStep?.step_name}</Title>
                                </Space>
                                {!isEditing ? (
                                    <Button icon={<EditOutlined />} size="small" onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                                ) : (
                                    <Space>
                                        <Button size="small" onClick={() => setIsEditing(false)}>Hủy</Button>
                                        <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={handleSaveStep} loading={saving}>Cập nhật</Button>
                                    </Space>
                                )}
                            </div>
                        }
                        style={{ borderRadius: 12, minHeight: 600 }}
                    >
                        {/* Edit Mode Content */}
                        <div style={{ display: isEditing ? 'block' : 'none' }}>
                            <Form form={form} layout="vertical" initialValues={selectedStep}>
                                <Row gutter={16}>
                                    <Col span={10}>
                                        <Form.Item label="Mã Giai đoạn" name="step_code">
                                            <Input disabled variant="filled" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item label="SLA Xử lý (Giờ)" name="sla_hours">
                                            <Input type="number" suffix="Giờ" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item label="Kích hoạt" name="is_enabled" valuePropName="checked">
                                            <Switch />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Mục tiêu Giai đoạn (Goal)" name="goal" rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]}>
                                    <TextArea rows={2} />
                                </Form.Item>

                                <Divider orientation="left" style={{ margin: '16px 0' }}>Phân Quyền Vai Trò (Roles)</Divider>

                                <Form.List name="roles">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Row key={key} gutter={16} style={{ marginBottom: 12, alignItems: 'center' }}>
                                                    <Col span={10}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'role']}
                                                            rules={[{ required: true, message: 'Chọn vai trò' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <IndexedSelect schema="Role" propType="Lookup" placeholder="Chọn vai trò..." />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'permissions']}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select 
                                                                mode="multiple" 
                                                                placeholder="Chọn quyền..." 
                                                                options={PERMISSION_OPTIONS}
                                                                allowClear
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={2}>
                                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Thêm Vai trò tham gia
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>

                                <Divider orientation="left" style={{ margin: '16px 0' }}>Danh sách Checklist</Divider>

                                <Form.List name="checklist">
                                    {(fields, { add, remove }) => (
                                        <>
                                            <Collapse 
                                                defaultActiveKey={[]} 
                                                size="small" 
                                                ghost={false}
                                                expandIcon={({ isActive }) => (
                                                    <CaretRightFilled 
                                                        rotate={isActive ? 90 : 0} 
                                                        style={{ fontSize: 12, position: 'relative', top: '12px' }} 
                                                    />
                                                )}
                                                style={{ marginBottom: 16, background: 'transparent' }}
                                            >
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Collapse.Panel 
                                                        key={key} 
                                                        header={
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', minHeight: 32 }}>
                                                                <Space align="center" size="small">
                                                                    <Badge count={name + 1} style={{ backgroundColor: '#52c41a' }} size="small" />
                                                                    <Text strong style={{ fontSize: 13 }}>
                                                                        {form.getFieldValue(['checklist', name, 'name']) || `Nhiệm vụ #${name + 1}`}
                                                                    </Text>
                                                                </Space>
                                                                <Space onClick={e => e.stopPropagation()} align="center">
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'is_required']}
                                                                        valuePropName="checked"
                                                                        initialValue={true}
                                                                        style={{ marginBottom: 0 }}
                                                                        label={<span style={{ fontSize: 11 }}>Bắt buộc?</span>}
                                                                    >
                                                                        <Switch size="small" />
                                                                    </Form.Item>
                                                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} size="small" />
                                                                </Space>
                                                            </div>
                                                        }
                                                        style={{ background: '#fff', marginBottom: 8, borderRadius: 8, border: '1px solid #f0f0f0' }}
                                                    >
                                                        <Row gutter={12}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    label={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Tên nhiệm vụ</span>}
                                                                    name={[name, 'name']}
                                                                    rules={[{ required: true, message: 'Bắt buộc' }]}
                                                                    style={{ marginBottom: 12 }}
                                                                >
                                                                    <Input placeholder="Nhập tên nhiệm vụ..." />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    label={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Mô tả chi tiết</span>}
                                                                    name={[name, 'description']}
                                                                    style={{ marginBottom: 0 }}
                                                                >
                                                                    <TextArea 
                                                                        autoSize={{ minRows: 2, maxRows: 4 }} 
                                                                        placeholder="Hướng dẫn thực hiện cho nhân viên..." 
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    </Collapse.Panel>
                                                ))}
                                            </Collapse>
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Thêm Nhiệm vụ Checklist
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>

                                <Divider orientation="left" style={{ margin: '16px 0' }}>Tiêu chuẩn & Hướng dẫn</Divider>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Tiêu chí Bắt đầu" name="entry_criteria">
                                            <TextArea rows={2} placeholder="Yêu cầu để bắt đầu..." />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Tiêu chí Hoàn tất" name="exit_criteria">
                                            <TextArea rows={2} placeholder="Yêu cầu để kết thúc..." />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Hướng dẫn thực hiện" name="instruction_note">
                                    <TextArea rows={3} placeholder="Ghi chú hướng dẫn cho nhân viên..." />
                                </Form.Item>

                                <Space size="large" wrap>
                                    <Form.Item label="Hiện trên Portal" name="portal_visible" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item label="Cho phép bỏ qua" name="allow_skip" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item label="Tự động mở tiếp" name="auto_open_next" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item label="Yêu cầu ký bàn giao" name="handoff_required" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </Space>
                            </Form>
                        </div>

                        {/* View Mode Content */}
                        <div style={{ display: !isEditing ? 'block' : 'none' }}>
                            <div className="step-detail-view">
                                <Descriptions bordered column={1} labelStyle={{ width: '220px', background: '#fafafa', fontWeight: 600 }}>
                                    <Descriptions.Item label="Mã Giai đoạn">
                                        <Tag color="blue">{selectedStep?.step_code}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái vận hành">
                                        {selectedStep?.is_enabled !== false ? <Badge status="success" text="Đang kích hoạt" /> : <Badge status="default" text="Đang tắt" />}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Mục tiêu (Goal)">
                                        <Paragraph style={{ margin: 0 }}>{selectedStep?.goal || '—'}</Paragraph>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Phân Quyền Vai Trò (Roles)">
                                        {selectedStep?.roles && selectedStep.roles.length > 0 ? (
                                            <List
                                                size="small"
                                                dataSource={selectedStep.roles}
                                                renderItem={(r: IRolesItem) => (
                                                    <List.Item>
                                                        <Space>
                                                            <IndexedView schema="Role" propType="Lookup" value={r.role} idxValue={r.idx_role} color="orange" />
                                                            {r.permissions?.map((p: string) => {
                                                                const label = PERMISSION_OPTIONS.find(opt => opt.value === p)?.label || p;
                                                                return <Tag key={p} color="blue">{label}</Tag>;
                                                            })}
                                                        </Space>
                                                    </List.Item>
                                                )}
                                            />
                                        ) : <Text type="secondary">Chưa cấu hình</Text>}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Checklist">
                                        {selectedStep?.checklist && selectedStep.checklist.length > 0 ? (
                                            <Table
                                                dataSource={selectedStep.checklist}
                                                pagination={false}
                                                size="small"
                                                rowKey="name"
                                                columns={[
                                                    { 
                                                        title: '#', 
                                                        width: 50,
                                                        align: 'center',
                                                        render: (_: any, __: any, index: number) => <Badge count={index + 1} size="small" style={{ backgroundColor: '#52c41a' }} /> 
                                                    },
                                                    { 
                                                        title: 'Tên hạng mục', 
                                                        dataIndex: 'name',
                                                        render: (name: string, record: IChecklistItem) => (
                                                            <Space>
                                                                <Text strong>{name}</Text>
                                                                {record.is_required && <Tag color="red">Bắt buộc</Tag>}
                                                            </Space>
                                                        )
                                                    },
                                                    { title: 'Mô tả', dataIndex: 'description' }
                                                ]}
                                            />
                                        ) : <Text type="secondary">Chưa cấu hình</Text>}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Cấu hình SLA">
                                        <Badge count={`${selectedStep?.sla_hours || 0} giờ`} style={{ backgroundColor: '#1890ff' }} />
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Tiêu chí Bắt đầu">
                                        <Text type="secondary">{selectedStep?.entry_criteria || 'Không yêu cầu'}</Text>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Tiêu chí Hoàn tất">
                                        <Text type="secondary">{selectedStep?.exit_criteria || 'Không yêu cầu'}</Text>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Hướng dẫn thực hiện">
                                        <Paragraph style={{ fontStyle: 'italic', margin: 0 }}>{selectedStep?.instruction_note || 'Chưa cập nhật'}</Paragraph>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Cấu hình nâng cao">
                                        <Space wrap>
                                            <Tag color={selectedStep?.portal_visible ? 'blue' : 'default'}>PORTAL: {selectedStep?.portal_visible ? 'HIỆN' : 'ẨN'}</Tag>
                                            <Tag color={selectedStep?.allow_skip ? 'orange' : 'default'}>BỎ QUA: {selectedStep?.allow_skip ? 'CHO PHÉP' : 'CẤM'}</Tag>
                                            <Tag color={selectedStep?.auto_open_next ? 'green' : 'default'}>AUTO NEXT: {selectedStep?.auto_open_next ? 'BẬT' : 'TẮT'}</Tag>
                                            <Tag color={selectedStep?.handoff_required ? 'red' : 'default'}>BÀN GIAO KÝ: {selectedStep?.handoff_required ? 'BẮT BUỘC' : 'KHÔNG'}</Tag>
                                        </Space>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerJourneySettingPage;
