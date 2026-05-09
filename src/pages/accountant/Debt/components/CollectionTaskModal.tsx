import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Spin,
    message,
} from 'antd';
import dayjs from 'dayjs';

import { debtCollectionTaskService } from '../../../../services/core-contracts/services/debtCollectionTask.service';
import { debtConfirmationService } from '../../../../services/core-contracts/services/debtConfirmation.service';
import {
    DebtCollectionTaskTaskTypeEnum2,
    ICreateDebtCollectionTaskInput,
    IDebtCollectionTask,
} from '../../../../services/core-contracts/types/debtCollectionTask.types';
import { IDebtConfirmation } from '../../../../services/core-contracts/types/debtConfirmation.types';
import { buildFilter } from '@/utils/filterBuilder';

const { TextArea } = Input;

/**
 * Wave 4 W4-05 — Modal tạo / chỉnh task nhắc nợ.
 *
 * Source: 1 DebtConfirmation status='confirmed' (KH đã ký, có cam kết trả).
 * Lifecycle task: open → in_progress → committed → completed.
 */

const TASK_TYPE_OPTIONS: Array<{ value: DebtCollectionTaskTaskTypeEnum2; label: string }> = [
    { value: 'reminder_call', label: 'Gọi điện nhắc' },
    { value: 'reminder_message', label: 'Gửi tin nhắn / email' },
    { value: 'commitment_follow_up', label: 'Theo dõi cam kết' },
    { value: 'escalation', label: 'Leo thang (cấp cao)' },
];

export interface CollectionTaskModalProps {
    open: boolean;
    task: IDebtCollectionTask | null;
    /** Nếu navigate từ DebtConfirmationList (?confirmation_id=X), pre-fill source. */
    debtConfirmationId?: string;
    onClose: () => void;
    onSuccess: (saved: IDebtCollectionTask) => void;
}

interface FormValues {
    debt_confirmation_id?: string;
    task_type: DebtCollectionTaskTaskTypeEnum2;
    scheduled_at: dayjs.Dayjs;
    debt_amount: number;
    customer_commitment_date?: dayjs.Dayjs;
    next_action?: string;
    result_note?: string;
}

const CollectionTaskModal: React.FC<CollectionTaskModalProps> = ({
    open,
    task,
    debtConfirmationId,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm<FormValues>();
    const [confirmations, setConfirmations] = useState<IDebtConfirmation[]>([]);
    const [loadingConfirmations, setLoadingConfirmations] = useState(false);
    const [saving, setSaving] = useState(false);
    const isEdit = !!task;

    /* ─── Fetch debt confirmations (status='confirmed') ─── */

    useEffect(() => {
        if (!open) return;

        if (isEdit) {
            form.setFieldsValue({
                task_type: (task?.task_type ?? 'reminder_call') as DebtCollectionTaskTaskTypeEnum2,
                scheduled_at: task?.scheduled_at ? dayjs(task.scheduled_at) : dayjs(),
                debt_amount: task?.debt_amount ?? 0,
                customer_commitment_date: task?.customer_commitment_date ? dayjs(task.customer_commitment_date) : undefined,
                next_action: task?.next_action,
                result_note: task?.result_note,
            });
            return;
        }

        let cancelled = false;
        setLoadingConfirmations(true);
        debtConfirmationService.queryDebtConfirmationsDto(buildFilter({
            where: { id: 'status', value: 'confirmed' },
            sortBy: [{ id: 'confirmed_at', desc: true }],
            limit: 100,
        }))
            .then(res => {
                if (!cancelled) setConfirmations(res?.data || []);
            })
            .catch(() => { /* silent */ })
            .finally(() => { if (!cancelled) setLoadingConfirmations(false); });

        form.resetFields();
        form.setFieldsValue({
            task_type: 'reminder_call',
            scheduled_at: dayjs().add(1, 'day'),
            debt_amount: 0,
            ...(debtConfirmationId ? { debt_confirmation_id: debtConfirmationId } : {}),
        });

        return () => { cancelled = true; };
    }, [open, isEdit, task, debtConfirmationId, form]);

    const selectedConfirmationId = Form.useWatch('debt_confirmation_id', form);

    const selectedConfirmation = useMemo(
        () => confirmations.find(c => c._id === selectedConfirmationId) ?? null,
        [confirmations, selectedConfirmationId],
    );

    /* ─── Auto-fill from confirmation ───────────────────── */

    useEffect(() => {
        if (!selectedConfirmation) return;
        const debt = selectedConfirmation.amount_confirmed_by_customer ?? selectedConfirmation.debt_amount ?? 0;
        const commitment = selectedConfirmation.payment_commitment_date
            ? dayjs(selectedConfirmation.payment_commitment_date)
            : undefined;
        form.setFieldsValue({
            debt_amount: debt,
            customer_commitment_date: commitment,
        });
    }, [selectedConfirmation, form]);

    /* ─── Handlers ───────────────────────────────────────── */

    const handleFinish = async (values: FormValues) => {
        setSaving(true);
        try {
            if (isEdit && task) {
                const updated = await debtCollectionTaskService.updateDebtCollectionTask(task._id, {
                    task_type: values.task_type,
                    scheduled_at: values.scheduled_at.toISOString(),
                    debt_amount: values.debt_amount,
                    customer_commitment_date: values.customer_commitment_date?.toISOString(),
                    next_action: values.next_action || undefined,
                    result_note: values.result_note || undefined,
                });
                message.success('Đã cập nhật task.');
                onSuccess(updated);
            } else {
                if (!selectedConfirmation) {
                    message.error('Vui lòng chọn biên bản công nợ.');
                    setSaving(false);
                    return;
                }
                const input: ICreateDebtCollectionTaskInput = {
                    journey_id: selectedConfirmation.journey_id,
                    journey_step_code: 'payment',
                    payment_milestone_id: selectedConfirmation.payment_milestone_id,
                    debt_confirmation_id: selectedConfirmation._id,
                    customer_id: selectedConfirmation.customer_id,
                    task_type: values.task_type,
                    status: 'open',
                    scheduled_at: values.scheduled_at.toISOString(),
                    debt_amount: values.debt_amount,
                    customer_commitment_date: values.customer_commitment_date?.toISOString(),
                    next_action: values.next_action || undefined,
                    result_note: values.result_note || undefined,
                };
                const created = await debtCollectionTaskService.createDebtCollectionTask(input);
                message.success('Đã tạo task nhắc nợ.');
                onSuccess(created);
            }
        } catch (e: any) {
            message.error(e?.message || 'Không thể lưu task.');
        } finally {
            setSaving(false);
        }
    };

    /* ─── Render ─────────────────────────────────────────── */

    const confirmationOptions = useMemo(
        () =>
            confirmations.map(c => ({
                value: c._id,
                label: `${c.code ?? c._id.slice(-6).toUpperCase()} — ${c.confirmed_by_customer_name ?? '(KH)'} — Nợ ${(c.amount_confirmed_by_customer ?? c.debt_amount ?? 0).toLocaleString('vi-VN')}đ`,
            })),
        [confirmations],
    );

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={saving}
            title={isEdit ? 'Chỉnh sửa task nhắc nợ' : 'Tạo task nhắc thu hồi công nợ'}
            width={640}
            destroyOnHidden
            okText={isEdit ? 'Cập nhật' : 'Tạo task'}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish} scrollToFirstError>
                {!isEdit && (
                    <Form.Item
                        name="debt_confirmation_id"
                        label="Biên bản công nợ nguồn"
                        rules={[{ required: true, message: 'Vui lòng chọn biên bản' }]}
                        extra="Chỉ hiển thị các biên bản đã được KH xác nhận (status='confirmed')."
                    >
                        <Select
                            placeholder="Chọn biên bản công nợ..."
                            showSearch
                            loading={loadingConfirmations}
                            options={confirmationOptions}
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                )}

                {selectedConfirmation && !isEdit && (
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                        message={`Khách hàng: ${selectedConfirmation.confirmed_by_customer_name ?? '—'}`}
                        description={
                            selectedConfirmation.payment_commitment_date
                                ? `Đã cam kết trả ngày ${dayjs(selectedConfirmation.payment_commitment_date).format('DD/MM/YYYY')}.`
                                : 'Chưa có cam kết deadline cụ thể.'
                        }
                    />
                )}

                {loadingConfirmations && !isEdit && (
                    <div style={{ textAlign: 'center', padding: 16 }}><Spin /></div>
                )}

                <Form.Item
                    name="task_type"
                    label="Loại task"
                    rules={[{ required: true, message: 'Vui lòng chọn loại task' }]}
                >
                    <Select options={TASK_TYPE_OPTIONS} />
                </Form.Item>

                <Form.Item
                    name="scheduled_at"
                    label="Hạn thực hiện"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    name="debt_amount"
                    label="Số tiền cần thu"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={((v: string | undefined) => Number((v ?? '').replace(/[^\d]/g, '')) || 0) as any}
                        addonAfter="đ"
                    />
                </Form.Item>

                <Form.Item
                    name="customer_commitment_date"
                    label="KH cam kết trả ngày"
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item name="next_action" label="Hành động tiếp theo">
                    <Input placeholder="VD: Gọi xác nhận trước 10h sáng mai..." />
                </Form.Item>

                <Form.Item name="result_note" label="Ghi chú kết quả">
                    <TextArea rows={3} placeholder="Ghi nhận kết quả gọi/nhắc, phản ứng KH..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CollectionTaskModal;
