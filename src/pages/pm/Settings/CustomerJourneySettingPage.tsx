import React, { useState, useEffect, useMemo } from 'react';
import {
    Card, Button, Space, Typography, Row, Col, Descriptions,
    Tag, Badge, List, message, Spin, Divider,
    Form, Input, Switch, Select, Table, Collapse,
    Grid, Drawer, FloatButton,
} from 'antd';
import {
    SettingOutlined, EditOutlined,
    SaveOutlined, ReloadOutlined, InfoCircleOutlined,
    CheckCircleOutlined, PlusOutlined, DeleteOutlined,
    CaretRightFilled, GlobalOutlined, UnorderedListOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '@/store/hooks';
import { find_setting, save_setting } from '@/store/actions/data/data.action';
import type { ICustomerJourneySetting, IRolesItem, IChecklistItem } from '@/services/core-contracts/types/customerJourneySetting.types';
import './CustomerJourneySettingPage.css';

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

/** Option chuẩn (không dùng `read` — dữ liệu cũ `read` hiển thị raw + user chuyển sang "Chỉ xem" / view) */
const PERMISSION_OPTIONS = [
    { label: 'Chỉ xem', value: 'view' },
    { label: 'Sửa', value: 'edit' },
    { label: 'Chịu trách nhiệm', value: 'commit' },
];

const PERMISSION_KNOWN_VALUES = new Set(PERMISSION_OPTIONS.map((o) => o.value));

function formatPermissionLabel(value: string): string {
    return PERMISSION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

/** Vai trò cố định cho Customer Journey (mã lưu DB, không lấy từ schema Role) */
const CUSTOMER_JOURNEY_ROLE_OPTIONS = [
    { value: 'QL', label: 'Quản lý dự án' },
    { value: 'KYT', label: 'Kỹ thuật' },
    { value: 'KT', label: 'Kế toán' },
    { value: 'KD', label: 'Kinh doanh' },
    { value: 'GS', label: 'Giám sát' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'TENANT_ADMIN', label: 'Tenant Admin' },
] as const;

const JOURNEY_ROLE_LABEL_MAP: Record<string, string> = Object.fromEntries(
    CUSTOMER_JOURNEY_ROLE_OPTIONS.map((o) => [o.value, o.label]),
);

function formatJourneyRoleDisplay(roleValue?: string): string {
    if (!roleValue) return '—';
    return JOURNEY_ROLE_LABEL_MAP[roleValue] || roleValue;
}

const { useBreakpoint } = Grid;

const CustomerJourneySettingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [setting, setSetting] = useState<ICustomerJourneySetting | null>(null);
    const [selectedStepCode, setSelectedStepCode] = useState<string>(FIXED_STEPS[0].code);
    const [isEditing, setIsEditing] = useState(false);
    const [stepsDrawerOpen, setStepsDrawerOpen] = useState(false);

    const watchedRoles = Form.useWatch('roles', form);

    /** Gộp option chuẩn + mã đang lưu nhưng không còn trong danh sách (vd: read) để Select hiển thị đúng tag */
    const permissionSelectOptions = useMemo(() => {
        const extras = new Map<string, { label: string; value: string }>();
        (watchedRoles || []).forEach((row: { permissions?: string[] }) => {
            (row?.permissions || []).forEach((p: string) => {
                if (p && !PERMISSION_KNOWN_VALUES.has(p)) {
                    extras.set(p, { label: p, value: p });
                }
            });
        });
        return [...PERMISSION_OPTIONS, ...extras.values()];
    }, [watchedRoles]);

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
            const rolesNormalized = (selectedStep.roles || []).map((r: IRolesItem) => ({
                role: r.role,
                permissions: r.permissions,
            }));
            form.setFieldsValue({
                ...selectedStep,
                is_enabled: selectedStep.is_enabled !== false,
                portal_visible: selectedStep.portal_visible !== false,
                handoff_required: selectedStep.handoff_required === true,
                roles: rolesNormalized,
                checklist: selectedStep.checklist || [],
            });
        }
    }, [isEditing, selectedStep, selectedStepCode, form]);

    const handleSaveStep = async () => {
        const values = await form.validateFields();
        const currentSetting = setting || { _id: '' };

        const { ...cleanStep } = values;
        if (Array.isArray(cleanStep.roles)) {
            cleanStep.roles = cleanStep.roles.map((r: IRolesItem) => ({
                role: r.role,
                permissions: r.permissions,
            }));
        }

        const payload: ICustomerJourneySetting = {
            ...currentSetting,
            setting_key: 'default_journey',
            setting_name: 'Công trình khách hàng chuẩn',
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

    const onSelectStep = (stepCode: string) => {
        setSelectedStepCode(stepCode);
        setIsEditing(false);
        if (isMobile) {
            setStepsDrawerOpen(false);
        }
    };

    const stepsListNode = (
        <List
            dataSource={stepList}
            renderItem={(step: any, idx) => (
                <List.Item
                    className={`step-item ${selectedStepCode === step.step_code ? 'active' : ''}`}
                    style={{
                        cursor: 'pointer',
                        borderRadius: 8,
                        padding: isMobile ? '12px 16px' : '8px 10px',
                        marginBottom: 8,
                        border: '1px solid #f0f0f0',
                        background: selectedStepCode === step.step_code ? '#e6f7ff' : '#fff',
                        borderColor: selectedStepCode === step.step_code ? '#91d5ff' : '#f0f0f0',
                        transition: 'all 0.3s',
                    }}
                    onClick={() => onSelectStep(step.step_code)}
                >
                    <div style={{ width: '100%', minWidth: 0 }}>
                        <Space direction="vertical" size={6} style={{ width: '100%' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 8,
                                    width: '100%',
                                    minWidth: 0,
                                }}
                            >
                                <Badge count={idx + 1} style={{ backgroundColor: step.is_enabled !== false ? '#1890ff' : '#d9d9d9', flexShrink: 0 }} />
                                <Text
                                    strong
                                    ellipsis={{ tooltip: step.step_name }}
                                    style={{
                                        color: step.is_enabled !== false ? '#262626' : '#bfbfbf',
                                        flex: 1,
                                        minWidth: 0,
                                        margin: 0,
                                        display: 'block',
                                    }}
                                >
                                    {step.step_name}
                                </Text>
                            </div>
                            <Space wrap size={[4, 4]}>
                                {step.sla_hours > 0 && (
                                    <Tag
                                        color={step.is_enabled !== false ? 'cyan' : 'default'}
                                        style={{ borderRadius: 10, fontSize: 10, margin: 0 }}
                                    >
                                        {step.sla_hours}h
                                    </Tag>
                                )}
                                {step.portal_visible !== false && (
                                    <Tag
                                        color="blue"
                                        style={{ borderRadius: 10, fontSize: 10, margin: 0 }}
                                        icon={<GlobalOutlined />}
                                    >
                                        Portal
                                    </Tag>
                                )}
                                {selectedStepCode === step.step_code && (
                                    <Tag color="processing" style={{ margin: 0, fontSize: 11 }}>Đang chọn</Tag>
                                )}
                            </Space>
                        </Space>
                    </div>
                </List.Item>
            )}
        />
    );

    return (
        <div className="customer-journey-page" style={{ padding: isMobile ? '0 12px 88px' : '0 24px' }}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 16,
                }}
            >
                <Title level={4} style={{ margin: 0 }}>Cấu hình Customer Journey</Title>
                <Space wrap>
                    <Button icon={<ReloadOutlined />} onClick={loadData} disabled={saving}>Làm mới</Button>
                    <Button icon={<SaveOutlined />} type="primary" onClick={handleGlobalSave} loading={saving}>Lưu Cấu hình</Button>
                </Space>
            </div>

            <Card style={{ marginBottom: 16, background: '#f0f2f5', border: 'none', borderRadius: 12 }}>
                <Paragraph style={{ margin: 0, color: '#595959' }}>
                    Quy trình chuẩn gồm 13 giai đoạn cố định. Thiết lập Roles, Checklist và các quyền vận hành chi tiết dựa trên lược đồ mới.
                    {isMobile && (
                        <>
                            {' '}
                            <Text type="secondary">Trên điện thoại, mở danh sách giai đoạn bằng nút nổi góc phải.</Text>
                        </>
                    )}
                </Paragraph>
            </Card>

            {/* wrap=false: tránh 5+19 span + gutter >100% khiến cột chi tiết xuống dòng → nhìn như mất nội dung */}
            <Row gutter={[16, 16]} wrap={false}>
                {!isMobile && (
                    <Col xs={24} md={7} lg={6} xl={5} className="cj-steps-rail" style={{ maxWidth: '100%' }}>
                        <Card
                            title={<Space><SettingOutlined /> Các giai đoạn quy trình</Space>}
                            style={{ borderRadius: 12 }}
                            styles={{ body: { padding: 10 } }}
                        >
                            {stepsListNode}
                        </Card>
                    </Col>
                )}

                <Col xs={24} md={isMobile ? 24 : 17} lg={isMobile ? 24 : 18} xl={isMobile ? 24 : 19} style={{ maxWidth: '100%' }}>
                    <Card
                        title={
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                }}
                            >
                                <Space wrap>
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
                        style={{ borderRadius: 12, minHeight: 600, maxWidth: '100%' }}
                        styles={{ body: { maxWidth: '100%', minWidth: 0, overflowX: 'hidden' } }}
                    >
                        {/* Edit Mode Content */}
                        <div style={{ display: isEditing ? 'block' : 'none' }}>
                            <Form form={form} layout="vertical" initialValues={selectedStep}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12} md={10}>
                                        <Form.Item label="Mã Giai đoạn" name="step_code">
                                            <Input disabled variant="filled" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={10}>
                                        <Form.Item label="SLA Xử lý (Giờ)" name="sla_hours">
                                            <Input type="number" suffix="Giờ" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={4}>
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
                                                <Row key={key} gutter={[16, 12]} style={{ marginBottom: 12 }} align="middle">
                                                    <Col xs={24} md={10}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'role']}
                                                            rules={[{ required: true, message: 'Chọn vai trò' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                placeholder="Chọn vai trò..."
                                                                options={[...CUSTOMER_JOURNEY_ROLE_OPTIONS]}
                                                                showSearch
                                                                optionFilterProp="label"
                                                                allowClear
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'permissions']}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                mode="multiple"
                                                                placeholder="Chọn quyền..."
                                                                options={permissionSelectOptions}
                                                                allowClear
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={2} style={{ textAlign: isMobile ? 'left' : 'center' }}>
                                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} aria-label="Xóa vai trò" />
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

                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Tiêu chí Bắt đầu" name="entry_criteria">
                                            <TextArea rows={2} placeholder="Yêu cầu để bắt đầu..." />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
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
                                <Descriptions
                                    bordered
                                    column={1}
                                    layout={isMobile ? 'vertical' : 'horizontal'}
                                    labelStyle={
                                        isMobile
                                            ? { background: '#fafafa', fontWeight: 600 }
                                            : {
                                                minWidth: 200,
                                                width: 200,
                                                maxWidth: '28%',
                                                background: '#fafafa',
                                                fontWeight: 600,
                                            }
                                    }
                                    contentStyle={{
                                        minWidth: 0,
                                        wordBreak: 'break-word',
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    <Descriptions.Item label="Mã Giai đoạn">
                                        <Tag color="blue">{selectedStep?.step_code}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái vận hành">
                                        {selectedStep?.is_enabled !== false ? <Badge status="success" text="Đang kích hoạt" /> : <Badge status="default" text="Đang tắt" />}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Mục tiêu (Goal)">
                                        <Paragraph className="cj-wrap-text" style={{ margin: 0 }}>
                                            {selectedStep?.goal || '—'}
                                        </Paragraph>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Phân Quyền Vai Trò (Roles)">
                                        {selectedStep?.roles && selectedStep.roles.length > 0 ? (
                                            <List
                                                size="small"
                                                dataSource={selectedStep.roles}
                                                renderItem={(r: IRolesItem) => (
                                                    <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
                                                        <Space wrap size={[8, 8]} style={{ width: '100%' }}>
                                                            <Tag color="orange">{formatJourneyRoleDisplay(r.role)}</Tag>
                                                            {r.permissions?.map((p: string) => (
                                                                <Tag key={p} color="blue">{formatPermissionLabel(p)}</Tag>
                                                            ))}
                                                        </Space>
                                                    </List.Item>
                                                )}
                                            />
                                        ) : <Text type="secondary">Chưa cấu hình</Text>}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Checklist">
                                        {selectedStep?.checklist && selectedStep.checklist.length > 0 ? (
                                            <Table
                                                className="cj-checklist-table"
                                                dataSource={selectedStep.checklist}
                                                pagination={false}
                                                size="small"
                                                rowKey={(r, i) => `${r.name}-${i}`}
                                                tableLayout="fixed"
                                                columns={[
                                                    {
                                                        title: '#',
                                                        width: 44,
                                                        align: 'center',
                                                        render: (_: any, __: any, index: number) => <Badge count={index + 1} size="small" style={{ backgroundColor: '#52c41a' }} />
                                                    },
                                                    {
                                                        title: 'Tên hạng mục',
                                                        dataIndex: 'name',
                                                        width: '30%',
                                                        ellipsis: false,
                                                        render: (name: string, record: IChecklistItem) => (
                                                            <Space wrap size={[4, 4]}>
                                                                <Text strong className="cj-wrap-text">{name}</Text>
                                                                {record.is_required && <Tag color="red">Bắt buộc</Tag>}
                                                            </Space>
                                                        )
                                                    },
                                                    {
                                                        title: 'Mô tả',
                                                        dataIndex: 'description',
                                                        ellipsis: false,
                                                        render: (text: string) => (
                                                            <span className="cj-wrap-text">{text || '—'}</span>
                                                        ),
                                                    },
                                                ]}
                                            />
                                        ) : <Text type="secondary">Chưa cấu hình</Text>}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Cấu hình SLA">
                                        <Badge count={`${selectedStep?.sla_hours || 0} giờ`} style={{ backgroundColor: '#1890ff' }} />
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Tiêu chí Bắt đầu">
                                        <Text type="secondary" className="cj-wrap-text">{selectedStep?.entry_criteria || 'Không yêu cầu'}</Text>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Tiêu chí Hoàn tất">
                                        <Text type="secondary" className="cj-wrap-text">{selectedStep?.exit_criteria || 'Không yêu cầu'}</Text>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Hướng dẫn thực hiện">
                                        <Paragraph className="cj-wrap-text" style={{ fontStyle: 'italic', margin: 0 }}>
                                            {selectedStep?.instruction_note || 'Chưa cập nhật'}
                                        </Paragraph>
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

            {isMobile && (
                <>
                    <Drawer
                        title={<Space><SettingOutlined /> Các giai đoạn quy trình</Space>}
                        placement="right"
                        width="min(92vw, 360px)"
                        onClose={() => setStepsDrawerOpen(false)}
                        open={stepsDrawerOpen}
                        destroyOnClose={false}
                    >
                        <div style={{ paddingBottom: 16 }}>{stepsListNode}</div>
                    </Drawer>
                    <FloatButton
                        icon={<UnorderedListOutlined />}
                        type="primary"
                        tooltip="Danh sách giai đoạn"
                        onClick={() => setStepsDrawerOpen(true)}
                        style={{
                            right: 16,
                            bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default CustomerJourneySettingPage;
