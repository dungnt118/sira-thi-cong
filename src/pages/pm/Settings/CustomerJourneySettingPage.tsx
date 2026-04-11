import React, { useState, useEffect, useMemo } from 'react';
import {
    Card, Button, Space, Typography, Row, Col, Descriptions,
    Tag, Badge, List, message, Spin, Divider,
    Form, Input, Switch, Select, Collapse,
    Grid, Drawer, FloatButton, Tooltip,
} from 'antd';
import {
    SettingOutlined, EditOutlined,
    SaveOutlined, ReloadOutlined, InfoCircleOutlined,
    CheckCircleOutlined, PlusOutlined, DeleteOutlined,
    CaretRightFilled, GlobalOutlined, UnorderedListOutlined,
    CheckSquareOutlined, TeamOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '@/store/hooks';
import { find_setting, save_setting } from '@/store/actions/data/data.action';
import type { ICustomerJourneySetting, IStepsItem, IRolesItem, IChecklistItem, IActionsItem } from '@/services/core-contracts/types/customerJourneySetting.types';
import './CustomerJourneySettingPage.css';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

type StepCode = NonNullable<IStepsItem['step_code']>;

interface StepDefinition {
    code: StepCode;
    name: string;
}

interface StepViewModel extends Omit<IStepsItem, 'step_code'> {
    step_code: StepCode;
    step_name: string;
    step_order: number;
}

const FIXED_STEPS: StepDefinition[] = [
    { code: 'lead_new', name: 'Bước 01 - Lead mới' },
    { code: 'consult_contact', name: 'Bước 02 - Tư vấn / liên hệ' },
    { code: 'site_survey', name: 'Bước 03 - Khảo sát hiện trạng' },
    { code: 'solution_design', name: 'Bước 04 - Thiết kế giải pháp' },
    { code: 'quotation', name: 'Bước 05 - Báo giá' },
    { code: 'contract', name: 'Bước 06 - Hợp đồng' },
    { code: 'execution', name: 'Bước 07 - Triển khai' },
    { code: 'final_acceptance', name: 'Bước 08 - Nghiệm thu cuối' },
    { code: 'payment', name: 'Bước 09 - Thanh toán' },
    { code: 'maintenance', name: 'Bước 10 - Bảo trì' },
    { code: 'warranty', name: 'Bước 11 - Bảo hành' },
    { code: 'after_sales', name: 'Bước 12 - Chăm sóc sau bán' },
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
    { value: 'GS', label: 'Giám sát' },
    { value: 'KYT', label: 'Kỹ thuật' },
    { value: 'KT', label: 'Kế toán' },
    { value: 'HC', label: 'Hành chính' },
    { value: 'KD', label: 'Kinh doanh' },
    { value: 'ADMIN', label: 'Admin' },
] as const;

const JOURNEY_ROLE_LABEL_MAP: Record<string, string> = Object.fromEntries(
    CUSTOMER_JOURNEY_ROLE_OPTIONS.map((o) => [o.value, o.label]),
);

function formatJourneyRoleDisplay(roleValue?: string): string {
    if (!roleValue) return '—';
    return JOURNEY_ROLE_LABEL_MAP[roleValue] || roleValue;
}

/** Đếm số mã vai trò khác nhau gán trên các nhiệm vụ checklist (bỏ trống) */
function countUniqueChecklistRoles(checklist?: IChecklistItem[]): number {
    if (!checklist?.length) return 0;
    const roles = new Set<string>();
    for (const item of checklist) {
        const r = item.role;
        if (r == null) continue;
        const s = String(r).trim();
        if (s) roles.add(s);
    }
    return roles.size;
}

const ACTION_PRESETS: Record<string, { label: string; type: string; target_field?: string; doc_type?: string }> = {
    fill_site_address: { label: 'Điền địa chỉ công trình', type: 'require_journey_field', target_field: 'site_address' },
    assign_owner_user: { label: 'Gán người phụ trách', type: 'require_journey_field', target_field: 'owner_user' },
    link_origin_journey: { label: 'Liên kết Journey gốc', type: 'require_journey_field', target_field: 'origin_journey_id' },

    upload_survey_report: { label: 'Tải biên bản khảo sát', type: 'require_document', doc_type: 'survey_report' },
    upload_site_photos: { label: 'Tải ảnh hiện trạng', type: 'require_document', doc_type: 'site_photos' },
    upload_solution_doc: { label: 'Tải hồ sơ giải pháp', type: 'require_document', doc_type: 'solution_doc' },
    upload_business_plan: { label: 'Tải kế hoạch kinh doanh', type: 'require_document', doc_type: 'business_plan' },
    upload_customer_quotation: { label: 'Tải báo giá khách hàng', type: 'require_document', doc_type: 'quotation' },
    upload_contract: { label: 'Tải hợp đồng', type: 'require_document', doc_type: 'contract' },
    upload_payment_receipt: { label: 'Tải chứng từ thanh toán', type: 'require_document', doc_type: 'payment_receipt' },

    confirm_quote_approved: { label: 'Xác nhận chốt báo giá', type: 'require_status_equals', target_field: 'quote_status' },
    confirm_final_acceptance: { label: 'Xác nhận nghiệm thu cuối', type: 'require_status_equals', target_field: 'project_status' },
};

const CHECKLIST_ACTION_OPTIONS = Object.entries(ACTION_PRESETS).map(([value, { label }]) => ({ value, label }));

const ACTION_TYPE_OPTIONS = [
    { value: 'require_journey_field', label: 'Bắt buộc điền thông tin' },
    { value: 'require_document', label: 'Bắt buộc tài liệu' },
    { value: 'require_status_equals', label: 'Bắt buộc trạng thái' },
];

const ACTION_TARGET_FIELD_OPTIONS = [
    { value: 'request_title', label: 'Tiêu đề yêu cầu' },
    { value: 'customer_id', label: 'Khách hàng' },
    { value: 'owner_user', label: 'Người phụ trách' },
    { value: 'site_address', label: 'Địa chỉ công trình' },
    { value: 'serviceTypeId', label: 'Loại dịch vụ' },
    { value: 'go_no_go_status', label: 'Go/No-Go' },
    { value: 'survey_status', label: 'Trạng thái khảo sát' },
    { value: 'quote_status', label: 'Trạng thái báo giá' },
    { value: 'project_status', label: 'Trạng thái triển khai' },
    { value: 'portal_publish_status', label: 'Trạng thái portal' },
    { value: 'journey_kind', label: 'Loại journey' },
    { value: 'origin_journey_id', label: 'Journey gốc' },
];

const ACTION_DOC_TYPE_OPTIONS = [
    { value: 'survey_report', label: 'Biên bản khảo sát' },
    { value: 'site_photos', label: 'Ảnh hiện trạng' },
    { value: 'solution_doc', label: 'Hồ sơ giải pháp' },
    { value: 'business_plan', label: 'Kế hoạch kinh doanh' },
    { value: 'quotation', label: 'Báo giá' },
    { value: 'contract', label: 'Hợp đồng' },
    { value: 'advance_request', label: 'Đề nghị tạm ứng' },
    { value: 'stage_acceptance', label: 'Nghiệm thu giai đoạn' },
    { value: 'stage_payment_proof', label: 'Chứng từ thanh toán giai đoạn' },
    { value: 'final_acceptance', label: 'Nghiệm thu cuối' },
    { value: 'payment_receipt', label: 'Phiếu thu / chứng từ thanh toán' },
    { value: 'maintenance_record', label: 'Biên bản bảo trì' },
    { value: 'warranty_record', label: 'Biên bản bảo hành' },
    { value: 'after_sales_note', label: 'Ghi chú sau bán' },
];

const createDefaultStep = (stepDef: StepDefinition, idx: number): StepViewModel => ({
    step_code: stepDef.code,
    step_name: stepDef.name,
    step_order: idx + 1,
    is_enabled: true,
    portal_visible: true,
    allow_skip: false,
    auto_open_next: false,
    roles: [],
    checklist: [],
});

const normalizeRoles = (roles?: IRolesItem[]): IRolesItem[] =>
    (roles || []).map((r) => ({
        role: r.role,
        permissions: r.permissions || [],
    }));

const normalizeActions = (actions?: IActionsItem[]): IActionsItem[] =>
    (actions || []).map((action) => ({
        action_key: action.action_key,
        action_type: action.action_type,
        target_field: action.target_field,
        doc_type: action.doc_type,
        min_count: action.min_count,
        note: action.note,
    }));

const normalizeChecklist = (items?: IChecklistItem[]): IChecklistItem[] =>
    (items || []).map((item) => ({
        name: item.name,
        is_required: item.is_required !== false,
        role: item.role,
        description: item.description,
        actions: normalizeActions(item.actions),
    }));

/**
 * Lúc submit: bắt buộc mà không có action → ép is_required false (tránh UI "Bắt buộc" + "Không có action").
 * Gọi sau normalizeChecklist.
 */
const coerceChecklistRequiredWhenHasActions = (items: IChecklistItem[]): IChecklistItem[] =>
    items.map((item) => ({
        ...item,
        is_required: item.is_required === true && (item.actions?.length ?? 0) > 0,
    }));

/**
 * Chế độ xem checklist: chỉ hiển thị đúng phần tương ứng form Edit (Hành động = preset + Ghi chú).
 * Không ghép loại kiểm chứng, doc_type, min_count, target, expected_value — các trường đó phục vụ backend / đã gói trong preset.
 */
const formatChecklistActionSummary = (action?: IActionsItem): string => {
    if (!action) return '—';

    const keyLabel =
        CHECKLIST_ACTION_OPTIONS.find((o) => o.value === action.action_key)?.label ||
        action.action_key ||
        'Action';

    return [keyLabel, action.note].filter(Boolean).join(' | ');
};

const { useBreakpoint } = Grid;

/** Component con để xử lý logic phức tạp cho từng Action Validation */
const ActionValidationItem: React.FC<{
    checklistIndex: number;
    actionIndex: number;
    restField: any;
    form: any;
    removeAction: (index: number) => void;
}> = ({ checklistIndex, actionIndex, restField, form, removeAction }) => {
    // Watch action_type và action_key của action hiện tại
    const actionType = Form.useWatch(['checklist', checklistIndex, 'actions', actionIndex, 'action_type'], form);

    // Lọc danh sách action_key theo type đã chọn
    const filteredActionKeys = useMemo(() => {
        return Object.entries(ACTION_PRESETS)
            .filter(([_, config]) => !actionType || config.type === actionType)
            .map(([value, config]) => ({ value, label: config.label }));
    }, [actionType]);

    const onActionKeyChange = (val: string) => {
        const preset = ACTION_PRESETS[val];
        if (preset) {
            form.setFieldValue(['checklist', checklistIndex, 'actions', actionIndex, 'target_field'], preset.target_field);
            form.setFieldValue(['checklist', checklistIndex, 'actions', actionIndex, 'doc_type'], preset.doc_type);
        }
    };

    const onActionTypeChange = () => {
        // Reset các trường liên quan khi đổi loại
        form.setFieldValue(['checklist', checklistIndex, 'actions', actionIndex, 'action_key'], undefined);
        form.setFieldValue(['checklist', checklistIndex, 'actions', actionIndex, 'target_field'], undefined);
        form.setFieldValue(['checklist', checklistIndex, 'actions', actionIndex, 'doc_type'], undefined);
    };

    return (
        <Card size="small" style={{ background: '#fafafa', borderRadius: 8, marginBottom: 8, border: '1px solid #f0f0f0' }}>
            <Row gutter={[12, 12]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        {...restField}
                        label={<span style={{ fontSize: 12 }}>Loại kiểm chứng</span>}
                        name={[actionIndex, 'action_type']}
                        rules={[{ required: true, message: 'Bắt buộc' }]}
                        style={{ marginBottom: 0 }}
                    >
                        <Select
                            placeholder="Chọn loại action..."
                            options={ACTION_TYPE_OPTIONS}
                            allowClear
                            onChange={onActionTypeChange}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        {...restField}
                        label={<span style={{ fontSize: 12 }}>Hành động</span>}
                        name={[actionIndex, 'action_key']}
                        rules={[{ required: true, message: 'Bắt buộc' }]}
                        style={{ marginBottom: 0 }}
                    >
                        <Select
                            placeholder={actionType ? "Chọn hành động..." : "Vui lòng chọn loại trước"}
                            options={filteredActionKeys}
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            onChange={onActionKeyChange}
                            disabled={!actionType}
                        />
                    </Form.Item>
                </Col>

                {/* Hiển thị thêm cấu hình cho tài liệu */}
                {actionType === 'require_document' && (
                    <>
                        <Col xs={24} md={12}>
                            <Form.Item
                                {...restField}
                                label={<span style={{ fontSize: 12 }}>Loại tài liệu</span>}
                                name={[actionIndex, 'doc_type']}
                                style={{ marginBottom: 0 }}
                                tooltip="Tự động điền theo hành động đã chọn"
                            >
                                <Select
                                    placeholder="Loại tài liệu..."
                                    options={ACTION_DOC_TYPE_OPTIONS}
                                    disabled
                                    variant="filled"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                {...restField}
                                label={<span style={{ fontSize: 12 }}>Số lượng tối thiểu</span>}
                                name={[actionIndex, 'min_count']}
                                style={{ marginBottom: 0 }}
                            >
                                <Input type="number" min={1} placeholder="1" />
                            </Form.Item>
                        </Col>
                    </>
                )}

                {/* Các trường ẩn để đảm bảo dữ liệu submit đúng schema */}
                <Form.Item name={[actionIndex, 'target_field']} noStyle hidden><Input /></Form.Item>

                <Col span={24}>
                    <Form.Item
                        {...restField}
                        label={<span style={{ fontSize: 12 }}>Ghi chú</span>}
                        name={[actionIndex, 'note']}
                        style={{ marginBottom: 0 }}
                    >
                        <TextArea rows={2} placeholder="Mô tả thêm cho action này (nếu có)..." />
                    </Form.Item>
                </Col>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeAction(actionIndex)} size="small" style={{ padding: 0 }}>
                        Xóa action
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

/** Chỉ hiển thị Action validation khi nhiệm vụ được bật "Bắt buộc" */
const ChecklistActionValidationSection: React.FC<{
    checklistIndex: number;
    form: ReturnType<typeof Form.useForm>[0];
}> = ({ checklistIndex, form }) => {
    const isRequired = Form.useWatch(['checklist', checklistIndex, 'is_required'], form);
    if (isRequired === false) return null;

    return (
        <Col span={24}>
            <Divider orientation="left" plain style={{ margin: '8px 0 12px' }}>Action validation</Divider>
            <Form.List name={[checklistIndex, 'actions']}>
                {(actionFields, { add: addAction, remove: removeAction }) => (
                    <>
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                            {actionFields.map(({ key: actionKey, name: actionName, ...actionRestField }) => (
                                <ActionValidationItem
                                    key={actionKey}
                                    checklistIndex={checklistIndex}
                                    actionIndex={actionName}
                                    restField={actionRestField}
                                    form={form}
                                    removeAction={removeAction}
                                />
                            ))}
                        </Space>
                        <Form.Item style={{ marginTop: 12, marginBottom: 0 }}>
                            <Button type="dashed" onClick={() => addAction({ min_count: 1 })} block icon={<PlusOutlined />}>
                                Thêm action
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Col>
    );
};

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

    const stepList = useMemo<StepViewModel[]>(() => {
        const storedSteps = setting?.steps || [];

        return FIXED_STEPS.map((stepDef, idx) => {
            const matchedStep = storedSteps.find((step) => step.step_code === stepDef.code);
            const baseStep = createDefaultStep(stepDef, idx);

            if (!matchedStep) {
                return baseStep;
            }

            return {
                ...baseStep,
                ...matchedStep,
                roles: normalizeRoles(matchedStep.roles),
                checklist: normalizeChecklist(matchedStep.checklist),
            };
        });
    }, [setting]);

    const selectedStep = useMemo(() => {
        return stepList.find((step) => step.step_code === selectedStepCode);
    }, [stepList, selectedStepCode]);

    useEffect(() => {
        if (isEditing && selectedStep) {
            form.setFieldsValue({
                ...selectedStep,
                is_enabled: selectedStep.is_enabled !== false,
                portal_visible: selectedStep.portal_visible !== false,
                allow_skip: selectedStep.allow_skip === true,
                auto_open_next: selectedStep.auto_open_next === true,
                roles: normalizeRoles(selectedStep.roles),
                checklist: normalizeChecklist(selectedStep.checklist),
            });
        }
    }, [isEditing, selectedStep, selectedStepCode, form]);

    const handleSaveStep = async () => {
        const values = await form.validateFields();
        const currentSetting = setting || ({ _id: '' } as ICustomerJourneySetting);

        const checklistForSave = coerceChecklistRequiredWhenHasActions(normalizeChecklist(values.checklist));

        const cleanStep: IStepsItem = {
            ...values,
            step_code: selectedStepCode as StepCode,
            roles: normalizeRoles(values.roles),
            checklist: checklistForSave,
        };

        const nextSteps = stepList.map((step) =>
            step.step_code === selectedStepCode
                ? {
                    ...step,
                    ...cleanStep,
                    roles: normalizeRoles(cleanStep.roles),
                    checklist: normalizeChecklist(cleanStep.checklist),
                }
                : step
        );

        const payload: ICustomerJourneySetting = {
            ...currentSetting,
            setting_key: currentSetting.setting_key || 'default_journey',
            setting_name: currentSetting.setting_name || 'Công trình khách hàng chuẩn',
            is_active: currentSetting.is_active !== false,
            version_label: currentSetting.version_label,
            note: currentSetting.note,
            steps: nextSteps.map(({ step_name, step_order, ...step }) => step),
        };

        setSetting(payload);
        setSaving(true);
        try {
            const res = await save_setting({ schema: SCHEMA, data: payload }, dispatch);
            if (res?.code === 0) {
                message.success('Đã Lưu cấu hình ' + (selectedStep?.step_name || 'giai đoạn'));
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
            renderItem={(step: StepViewModel, idx) => {
                const taskCount = step.checklist?.length ?? 0;
                const roleCount = countUniqueChecklistRoles(step.checklist);
                const tagBaseStyle: React.CSSProperties = {
                    borderRadius: 10,
                    fontSize: 10,
                    margin: 0,
                    lineHeight: '18px',
                    paddingInline: 7,
                };
                return (
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
                            <Space wrap size={[4, 4]} align="center">
                                {(step.sla_hours ?? 0) > 0 && (
                                    <Tag
                                        color={step.is_enabled !== false ? 'cyan' : 'default'}
                                        style={tagBaseStyle}
                                    >
                                        {step.sla_hours}h
                                    </Tag>
                                )}
                                {step.portal_visible !== false && (
                                    <Tag
                                        color="blue"
                                        style={tagBaseStyle}
                                        icon={<GlobalOutlined />}
                                    >
                                        Portal
                                    </Tag>
                                )}
                                <Tooltip title="Số nhiệm vụ checklist trong giai đoạn này">
                                    <span style={{ display: 'inline-flex' }}>
                                        <Tag
                                            color={step.is_enabled !== false ? 'purple' : 'default'}
                                            style={tagBaseStyle}
                                            icon={<CheckSquareOutlined />}
                                        >
                                            {taskCount}
                                        </Tag>
                                    </span>
                                </Tooltip>
                                <Tooltip title="Số vai trò khác nhau được gán trên các nhiệm vụ checklist">
                                    <span style={{ display: 'inline-flex' }}>
                                        <Tag
                                            color={step.is_enabled !== false ? 'orange' : 'default'}
                                            style={tagBaseStyle}
                                            icon={<TeamOutlined />}
                                        >
                                            {roleCount}
                                        </Tag>
                                    </span>
                                </Tooltip>
                            </Space>
                        </Space>
                    </div>
                </List.Item>
                );
            }}
        />
    );

    return (
        <div className="customer-journey-page">
            {/* Header trang cố định */}
            <div className="cj-page-header-sticky">
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <Title level={4} style={{ margin: 0 }}>Cấu hình Customer Journey</Title>
                    <Space wrap>
                        <Button icon={<ReloadOutlined />} onClick={loadData} disabled={loading || saving}>Làm mới</Button>
                    </Space>
                </div>
            </div>

            <div className="cj-content-layout">

                {/* Main Content Row với scroll độc lập */}
                <Row gutter={[16, 16]} className="cj-main-row" style={{ padding: '0 16px' }}>
                    {!isMobile && (
                        <Col xs={24} md={7} lg={6} xl={5} className="cj-scroll-col">
                            <Card
                                title={<Space><SettingOutlined /> Các giai đoạn quy trình</Space>}
                                style={{ borderRadius: 12 }}
                                styles={{ body: { padding: 10 } }}
                            >
                                {stepsListNode}
                            </Card>
                        </Col>
                    )}

                    <Col
                        xs={24}
                        md={isMobile ? 24 : 17}
                        lg={isMobile ? 24 : 18}
                        xl={isMobile ? 24 : 19}
                        className="cj-scroll-col"
                    >
                        <Card
                            className="cj-detail-card"
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
                                            <Button size="small" type="primary" icon={<SaveOutlined />} onClick={handleSaveStep} loading={saving}>Cập nhật & Lưu</Button>
                                        </Space>
                                    )}
                                </div>
                            }
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
                                                    <Button type="dashed" onClick={() => add({ is_required: true, actions: [] })} block icon={<PlusOutlined />}>
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
                                                            <Row gutter={[12, 12]}>
                                                                <Col xs={24} lg={12}>
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
                                                                <Col xs={24} lg={12}>
                                                                    <Form.Item
                                                                        {...restField}
                                                                        label={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Vai trò thực hiện</span>}
                                                                        name={[name, 'role']}
                                                                        style={{ marginBottom: 12 }}
                                                                    >
                                                                        <Select placeholder="Chọn vai trò..." options={[...CUSTOMER_JOURNEY_ROLE_OPTIONS]} allowClear showSearch optionFilterProp="label" />
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
                                                                <ChecklistActionValidationSection checklistIndex={name} form={form} />
                                                            </Row>
                                                        </Collapse.Panel>
                                                    ))}
                                                </Collapse>
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add({ is_required: true, actions: [] })} block icon={<PlusOutlined />}>
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

                                        <Descriptions.Item label="Phân Quyền Vai Trò">
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
                                                <List
                                                    className="cj-checklist-list"
                                                    size="small"
                                                    dataSource={selectedStep.checklist}
                                                    renderItem={(record: IChecklistItem, index: number) => (
                                                        <List.Item
                                                            className="cj-checklist-item"
                                                            style={{ paddingLeft: 0, paddingRight: 0, alignItems: 'flex-start' }}
                                                        >
                                                            <Badge
                                                                count={index + 1}
                                                                size="small"
                                                                style={{ backgroundColor: '#52c41a', flexShrink: 0 }}
                                                            />
                                                            <div style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
                                                                <Space wrap size={[8, 8]} style={{ width: '100%' }}>
                                                                    <Text strong className="cj-wrap-text">{record.name || '—'}</Text>
                                                                    {record.role ? (
                                                                        <Tag color="orange">{formatJourneyRoleDisplay(record.role)}</Tag>
                                                                    ) : (
                                                                        <Text type="secondary">—</Text>
                                                                    )}
                                                                </Space>
                                                                {record.description?.trim() ? (
                                                                    <blockquote className="cj-checklist-desc-quote cj-wrap-text">
                                                                        {record.description.trim()}
                                                                    </blockquote>
                                                                ) : null}
                                                                <div style={{ marginTop: 8 }}>
                                                                    {record.is_required ? (
                                                                        <div style={{ marginBottom: 6 }}>
                                                                            <Tag color="red">Bắt buộc</Tag>
                                                                        </div>
                                                                    ) : null}
                                                                    {record.actions && record.actions.length > 0 ? (
                                                                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                                                            {record.actions.map((action: IActionsItem, actionIdx: number) => (
                                                                                <Text key={(action.action_key || 'action') + '-' + actionIdx} className="cj-wrap-text">
                                                                                    {formatChecklistActionSummary(action)}
                                                                                </Text>
                                                                            ))}
                                                                        </Space>
                                                                    ) : (
                                                                        <Text type="secondary">Không có action</Text>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </List.Item>
                                                    )}
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
                                                <Tag color={(selectedStep?.checklist?.length ?? 0) > 0 ? 'purple' : 'default'}>CHECKLIST: {selectedStep?.checklist?.length ?? 0}</Tag>
                                            </Space>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

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
