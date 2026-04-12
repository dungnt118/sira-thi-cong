import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space, Typography, message } from 'antd';
import { AuthorizedUserSelect } from '../authorizedusers/AuthorizedUser';
import { journeyService } from '../../services/core-contracts/services/journey.service';
import { workTaskService } from '../../services/core-contracts/services/workTask.service';
import type { IJourney } from '../../services/core-contracts/types/journey.types';
import type { IActionsItem } from '../../services/core-contracts/types/workTask.types';
import type { IWorkTask } from '../../services/core-contracts/types/workTask.types';
import { resolveJourneyTabForWorkTaskAction, resolveTargetFieldFromAction } from '../../constants/workTaskActionUx';
import { journeyDocumentService } from '../../services/core-contracts/services/journeyDocument.service';
import type { IJourneyDocument } from '../../services/core-contracts/types/journeyDocument.types';
import { WorkTaskDocumentGroupModal } from './WorkTaskDocumentGroupModal';

const { Paragraph } = Typography;

export type WorkTaskActionDialogContext =
    | { mode: 'field_batch'; task: IWorkTask; actions: IActionsItem[] }
    | { mode: 'document_batch'; task: IWorkTask; actions: IActionsItem[] }
    | { mode: 'single'; task: IWorkTask; action: IActionsItem }
    | null;

/** Giữ import cũ từ nơi khác: re-export từ constants. */
export { resolveTargetFieldFromAction } from '../../constants/workTaskActionUx';

const GO_NO_GO_OPTIONS = [
    { value: 'draft', label: 'Nháp' },
    { value: 'go', label: 'Tiếp tục' },
    { value: 'no_go', label: 'Dừng' },
    { value: 'on_hold', label: 'Tạm hoãn' },
    { value: 'pending', label: 'Chờ duyệt' },
];

const SURVEY_STATUS_OPTIONS = [
    { value: 'not_started', label: 'Chưa bắt đầu' },
    { value: 'scheduled', label: 'Đã hẹn' },
    { value: 'in_progress', label: 'Đang thực hiện' },
    { value: 'completed', label: 'Hoàn thành' },
];

const QUOTE_STATUS_OPTIONS = [
    { value: 'not_started', label: 'Chưa bắt đầu' },
    { value: 'draft', label: 'Nháp' },
    { value: 'sent', label: 'Đã gửi' },
    { value: 'approved', label: 'Đã chốt' },
];

const PROJECT_STATUS_OPTIONS = [
    { value: 'not_started', label: 'Chưa bắt đầu' },
    { value: 'active', label: 'Đang triển khai' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
];

const PORTAL_PUBLISH_OPTIONS = [
    { value: 'hidden', label: 'Ẩn' },
    { value: 'partial', label: 'Một phần' },
    { value: 'published', label: 'Đã publish' },
];

const JOURNEY_KIND_OPTIONS = [
    { value: 'main', label: 'Chính' },
    { value: 'maintenance', label: 'Bảo trì' },
    { value: 'warranty', label: 'Bảo hành' },
];

const FIELD_LABELS: Record<string, string> = {
    request_title: 'Tiêu đề yêu cầu',
    customer_id: 'Khách hàng (ID)',
    owner_user: 'Người phụ trách',
    site_address: 'Địa chỉ công trình',
    serviceTypeId: 'Loại dịch vụ (ID)',
    go_no_go_status: 'Go / No-Go',
    survey_status: 'Trạng thái khảo sát',
    quote_status: 'Trạng thái báo giá',
    project_status: 'Trạng thái triển khai',
    portal_publish_status: 'Trạng thái portal',
    journey_kind: 'Loại journey',
    origin_journey_id: 'Journey gốc (ID)',
};

function selectOptionsForField(field: string): { value: string; label: string }[] | null {
    switch (field) {
        case 'go_no_go_status':
            return GO_NO_GO_OPTIONS;
        case 'survey_status':
            return SURVEY_STATUS_OPTIONS;
        case 'quote_status':
            return QUOTE_STATUS_OPTIONS;
        case 'project_status':
            return PROJECT_STATUS_OPTIONS;
        case 'portal_publish_status':
            return PORTAL_PUBLISH_OPTIONS;
        case 'journey_kind':
            return JOURNEY_KIND_OPTIONS;
        default:
            return null;
    }
}

function snakeToCamelKey(field: string): string {
    return field.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());
}

function snakeToPascalKey(field: string): string {
    const c = snakeToCamelKey(field);
    return c.charAt(0).toUpperCase() + c.slice(1);
}

/**
 * Đọc giá trị từ object Journey trả về API (GraphQL có thể snake_case, camelCase hoặc PascalCase).
 */
function readJourneyFieldValue(journey: IJourney, field: string): unknown {
    const r = journey as unknown as Record<string, unknown>;
    const keyCandidates = [field, snakeToCamelKey(field), snakeToPascalKey(field)];

    const tryIndexed = (): unknown => {
        switch (field) {
            case 'customer_id':
                return (
                    readScalarFromRecord(r, keyCandidates) ??
                    journey.idx_customer_id?.itemId ??
                    (journey.idx_customer_id as { _id?: string } | undefined)?._id
                );
            case 'origin_journey_id':
                return (
                    readScalarFromRecord(r, keyCandidates) ??
                    journey.idx_origin_journey_id?.itemId ??
                    (journey.idx_origin_journey_id as { _id?: string } | undefined)?._id
                );
            case 'serviceTypeId':
                return readScalarFromRecord(r, keyCandidates) ?? journey.idx_serviceTypeId?.itemId ?? '';
            default:
                return readScalarFromRecord(r, keyCandidates);
        }
    };

    const v = tryIndexed();
    if (v !== undefined && v !== null) return v;
    return '';
}

function readScalarFromRecord(r: Record<string, unknown>, keys: string[]): unknown {
    for (const k of keys) {
        if (k in r && r[k] !== undefined && r[k] !== null) {
            return r[k];
        }
    }
    return undefined;
}

function isJourneyFieldValueFilled(_field: string, value: unknown): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number' || typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') {
        const o = value as Record<string, unknown>;
        return Boolean(o._id ?? o.itemId ?? o.username ?? o.id ?? o.code);
    }
    return false;
}

/**
 * Kiểm tra Journey (sau khi gán giá trị mới) có thỏa tiêu chí của đúng `action` đang xử lý hay không — dùng để auto hoàn thành WorkTask.
 */
function doesDocumentActionSatisfy(
    action: IActionsItem,
    docs: IJourneyDocument[],
    taskStepCode?: string | null
): boolean {
    if (action.action_type !== 'require_document') return true;
    const dt = action.doc_type ? String(action.doc_type) : '';
    const min = typeof action.min_count === 'number' && action.min_count > 0 ? action.min_count : 1;
    const step = taskStepCode ? String(taskStepCode) : '';
    const relevant = docs.filter((d) => {
        if (dt && String(d.doc_type || '') !== dt) return false;
        if (step && d.journey_step_code && String(d.journey_step_code) !== step) return false;
        return (d.files?.length ?? 0) > 0;
    });
    return relevant.length >= min;
}

/** Đủ mọi tiêu chí trên `task.actions` (field/status + tài liệu) theo Journey và danh sách JourneyDocument hiện có. */
export function areAllTaskActionsSatisfied(
    journey: IJourney,
    task: IWorkTask,
    docs: IJourneyDocument[]
): boolean {
    const actions = task.actions ?? [];
    if (!actions.length) return false;
    for (const a of actions) {
        if (a.action_type === 'require_document') {
            if (!doesDocumentActionSatisfy(a, docs, task.journey_step_code)) return false;
            continue;
        }
        if (a.action_type === 'require_journey_field' || a.action_type === 'require_status_equals') {
            const f = resolveTargetFieldFromAction(a);
            if (!f) return false;
            if (!doesJourneySatisfyWorkTaskAction(journey, a, f)) return false;
            continue;
        }
        return false;
    }
    return true;
}

/**
 * Đủ điều kiện field/status khi giá trị Journey tại `resolvedField` đã được điền hợp lệ.
 * (Không dùng `expected_value` — cấu hình này được coi là deprecated.)
 */
export function doesJourneySatisfyWorkTaskAction(
    journey: IJourney,
    action: IActionsItem,
    resolvedField: string
): boolean {
    const current = readJourneyFieldValue(journey, resolvedField);
    switch (action.action_type) {
        case 'require_status_equals':
        case 'require_journey_field':
            return isJourneyFieldValueFilled(resolvedField, current);
        default:
            return false;
    }
}

function buildFieldBatchEntries(actions: IActionsItem[]): { field: string; actions: IActionsItem[] }[] {
    const map = new Map<string, IActionsItem[]>();
    for (const a of actions) {
        if (a.action_type !== 'require_journey_field' && a.action_type !== 'require_status_equals') continue;
        const f = resolveTargetFieldFromAction(a);
        if (!f) continue;
        if (!map.has(f)) map.set(f, []);
        map.get(f)!.push(a);
    }
    return [...map.entries()].map(([field, acts]) => ({ field, actions: acts }));
}

function fieldEditorKind(field: string): 'user' | 'textarea' | 'select' | 'input' {
    if (field === 'owner_user') return 'user';
    if (field === 'site_address') return 'textarea';
    if (selectOptionsForField(field)) return 'select';
    return 'input';
}

export interface WorkTaskActionModalsProps {
    context: WorkTaskActionDialogContext;
    journey: IJourney | null;
    onClose: () => void;
    /** Sau khi cập nhật Journey thành công (để refetch parent). */
    onJourneyUpdated: () => void | Promise<void>;
    /** Điều hướng tab (JourneyDetail360 / event Step01Info). */
    onNavigateTab?: (tab: string) => void;
}

/**
 * Dialog theo loại action trên WorkTask: cập nhật thuộc tính Journey (chung một form theo target_field) hoặc hướng dẫn tài liệu.
 */
export const WorkTaskActionModals: React.FC<WorkTaskActionModalsProps> = ({
    context,
    journey,
    onClose,
    onJourneyUpdated,
    onNavigateTab,
}) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const task = context?.task ?? null;
    const fieldActions = context?.mode === 'field_batch' ? context.actions : null;
    const documentActions = context?.mode === 'document_batch' ? context.actions : null;

    const fieldEntries = useMemo(
        () => (fieldActions?.length ? buildFieldBatchEntries(fieldActions) : []),
        [fieldActions]
    );

    const isFieldBatchModal = Boolean(context?.mode === 'field_batch' && journey && fieldEntries.length);
    const isDocumentBatchModal = Boolean(context?.mode === 'document_batch' && journey?._id && documentActions?.length);

    const syncFormFromJourney = useCallback(() => {
        if (!journey || !fieldEntries.length) return;
        const patch: Record<string, unknown> = {};
        for (const { field } of fieldEntries) {
            const initial = readJourneyFieldValue(journey, field);
            patch[field] = initial === undefined || initial === null ? '' : initial;
        }
        form.setFieldsValue(patch);
    }, [journey, fieldEntries, form]);

    useEffect(() => {
        if (!isFieldBatchModal) return;
        syncFormFromJourney();
    }, [isFieldBatchModal, syncFormFromJourney, context]);

    const tryAutoFinishTask = useCallback(
        async (taskToFinish: IWorkTask): Promise<boolean> => {
            if (!journey?._id || !taskToFinish._id || taskToFinish.status === 'finished') return false;
            let fresh: IJourney;
            try {
                fresh = await journeyService.findJourneyDto(journey._id);
            } catch (e) {
                console.error(e);
                fresh = journey as IJourney;
            }
            let docs: IJourneyDocument[] = [];
            try {
                const res = await journeyDocumentService.queryJourneyDocumentsDto({
                    group: { id: 'journey_id', operation: 'eq', value: journey._id },
                } as any);
                docs = res.data ?? [];
            } catch (e) {
                console.error(e);
            }
            if (!areAllTaskActionsSatisfied(fresh, taskToFinish, docs)) return false;
            try {
                await workTaskService.updateWorkTask(taskToFinish._id, { status: 'finished' });
                return true;
            } catch (wtErr) {
                console.error(wtErr);
                message.warning('Đủ điều kiện nhưng không thể cập nhật trạng thái nhiệm vụ.');
                return false;
            }
        },
        [journey]
    );

    const handleDocumentBatchChanged = useCallback(async () => {
        await onJourneyUpdated();
        if (task) {
            const finished = await tryAutoFinishTask(task);
            if (finished) {
                message.success('Đã hoàn thành nhiệm vụ (đủ mọi điều kiện trên công trình).');
                await onJourneyUpdated();
            }
        }
    }, [onJourneyUpdated, task, tryAutoFinishTask]);

    const fieldModalTitle = useMemo(() => {
        if (!task) return 'Cập nhật công trình';
        return `Cập nhật thông tin công trình — ${task.title || 'Nhiệm vụ'}`;
    }, [task]);

    const handleFieldBatchSubmit = useCallback(async () => {
        if (!journey?._id || !fieldActions?.length || !fieldEntries.length) return;
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            const payload: Partial<IJourney> = {};
            for (const { field } of fieldEntries) {
                let raw = values[field];
                if (typeof raw === 'string') raw = raw.trimEnd();
                (payload as Record<string, unknown>)[field] = raw;
            }
            await journeyService.updateJourney(journey._id, payload);
            await onJourneyUpdated();
            let autoFinished = false;
            if (task?._id) {
                autoFinished = await tryAutoFinishTask(task);
            }
            if (autoFinished) await onJourneyUpdated();
            message.success(
                autoFinished ? 'Đã cập nhật công trình và hoàn thành nhiệm vụ.' : 'Đã cập nhật công trình.'
            );
            onClose();
            for (const act of fieldActions) {
                const tab = resolveJourneyTabForWorkTaskAction(act);
                if (tab && onNavigateTab) {
                    onNavigateTab(tab);
                    break;
                }
            }
        } catch (e: unknown) {
            if (e && typeof e === 'object' && 'errorFields' in e) return;
            console.error(e);
            message.error(e instanceof Error ? e.message : 'Không thể cập nhật');
        } finally {
            setSubmitting(false);
        }
    }, [journey, fieldActions, fieldEntries, form, task, tryAutoFinishTask, onJourneyUpdated, onClose, onNavigateTab]);

    const renderFieldControlForField = (field: string) => {
        const label = FIELD_LABELS[field] || field;
        const kind = fieldEditorKind(field);
        const options = selectOptionsForField(field);

        if (kind === 'user') {
            return (
                <Form.Item
                    name={field}
                    label={label}
                    rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
                >
                    <AuthorizedUserSelect allowMultiple={false} placeholder="Chọn người phụ trách" />
                </Form.Item>
            );
        }
        if (kind === 'textarea') {
            return (
                <Form.Item
                    name={field}
                    label={label}
                    rules={[
                        {
                            validator: async (_, v) => {
                                if (v == null || (typeof v === 'string' && v.trim().length === 0)) {
                                    return Promise.reject(new Error('Vui lòng nhập nội dung'));
                                }
                            },
                        },
                    ]}
                >
                    <Input.TextArea rows={4} placeholder="Nhập địa chỉ / nội dung" allowClear />
                </Form.Item>
            );
        }
        if (kind === 'select' && options) {
            return (
                <Form.Item name={field} label={label} rules={[{ required: true, message: 'Vui lòng chọn giá trị' }]}>
                    <Select options={options} placeholder="Chọn" allowClear={false} />
                </Form.Item>
            );
        }
        return (
            <Form.Item name={field} label={label} rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}>
                <Input placeholder="Nhập giá trị" allowClear />
            </Form.Item>
        );
    };

    return (
        <>
            <Modal
                title={fieldModalTitle}
                open={isFieldBatchModal}
                onCancel={onClose}
                onOk={() => void handleFieldBatchSubmit()}
                okText="Lưu"
                cancelText="Hủy"
                confirmLoading={submitting}
                destroyOnClose
                width={560}
                afterOpenChange={(opened) => {
                    if (opened && journey && fieldEntries.length) {
                        window.requestAnimationFrame(() => {
                            form.resetFields();
                            syncFormFromJourney();
                        });
                    }
                    if (!opened) {
                        form.resetFields();
                    }
                }}
            >
                {isFieldBatchModal && fieldActions ? (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                            Gom các yêu cầu cập nhật thuộc tính công trình — lưu một lần.
                        </Paragraph>
                        <Form form={form} layout="vertical" preserve={false}>
                            {fieldEntries.map(({ field, actions }) => (
                                <React.Fragment key={field}>
                                    {actions.map((a, i) =>
                                        a.note ? (
                                            <Paragraph key={`n-${field}-${i}`} type="secondary" style={{ marginBottom: 0 }}>
                                                {a.note}
                                            </Paragraph>
                                        ) : null
                                    )}
                                    {renderFieldControlForField(field)}
                                </React.Fragment>
                            ))}
                        </Form>
                    </Space>
                ) : null}
            </Modal>

            {journey?._id && task ? (
                <WorkTaskDocumentGroupModal
                    open={Boolean(isDocumentBatchModal)}
                    onCancel={onClose}
                    journeyId={journey._id}
                    stepCode={task.journey_step_code}
                    actions={documentActions ?? []}
                    onDocumentsChanged={handleDocumentBatchChanged}
                />
            ) : null}
        </>
    );
};
