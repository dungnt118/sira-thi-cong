import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    DatePicker,
    Descriptions,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Spin,
    Typography,
    message,
} from 'antd';
import dayjs from 'dayjs';

import { debtConfirmationService } from '../../../../services/core-contracts/services/debtConfirmation.service';
import { paymentMilestoneService } from '../../../../services/core-contracts/services/paymentMilestone.service';
import {
    ICreateDebtConfirmationInput,
    IDebtConfirmation,
} from '../../../../services/core-contracts/types/debtConfirmation.types';
import { IPaymentMilestone } from '../../../../services/core-contracts/types/paymentMilestone.types';
import { buildFilter } from '@/utils/filterBuilder';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * Wave 4 W4-05 — Modal tạo / chỉnh xác nhận công nợ.
 *
 * Flow:
 *  1. KT chọn PaymentMilestone (chưa thu đủ → nợ).
 *  2. Auto fill debt_amount = remaining_amount.
 *  3. Submit → status='draft' (gửi KH ở list page).
 *  4. Khi KH xác nhận, KT update qua list (transition Confirmed/Disputed).
 */

export interface SendConfirmationModalProps {
    open: boolean;
    confirmation: IDebtConfirmation | null;
    onClose: () => void;
    onSuccess: (saved: IDebtConfirmation) => void;
    /** Nếu mở từ Step10Payment, pre-select milestone. */
    initialMilestoneId?: string;
    /** Filter milestones theo journey. */
    journeyId?: string;
}

interface FormValues {
    milestone_id?: string;
    confirmation_date: dayjs.Dayjs;
    debt_amount: number;
    amount_confirmed_by_customer?: number;
    confirmed_by_customer_name?: string;
    payment_commitment_date?: dayjs.Dayjs;
    reason?: string;
}

const SendConfirmationModal: React.FC<SendConfirmationModalProps> = ({
    open,
    confirmation,
    onClose,
    onSuccess,
    initialMilestoneId,
    journeyId,
}) => {
    const [form] = Form.useForm<FormValues>();
    const [milestones, setMilestones] = useState<IPaymentMilestone[]>([]);
    const [loadingMilestones, setLoadingMilestones] = useState(false);
    const [saving, setSaving] = useState(false);
    const isEdit = !!confirmation;

    /* ─── Fetch milestones có nợ ─────────────────────────── */

    useEffect(() => {
        if (!open) return;

        if (isEdit) {
            form.setFieldsValue({
                confirmation_date: confirmation?.confirmation_date ? dayjs(confirmation.confirmation_date) : dayjs(),
                debt_amount: confirmation?.debt_amount ?? 0,
                amount_confirmed_by_customer: confirmation?.amount_confirmed_by_customer,
                confirmed_by_customer_name: confirmation?.confirmed_by_customer_name,
                payment_commitment_date: confirmation?.payment_commitment_date ? dayjs(confirmation.payment_commitment_date) : undefined,
                reason: confirmation?.reason,
            });
            return;
        }

        let cancelled = false;
        setLoadingMilestones(true);
        paymentMilestoneService.queryPaymentMilestonesDto(buildFilter({
            where: journeyId ? { id: 'journey_id', value: journeyId } : undefined,
            sortBy: [{ id: 'due_date', desc: false }],
            limit: 200,
        }))
            .then(res => {
                if (!cancelled) {
                    // Filter các milestone có còn nợ (remaining > 0)
                    const withDebt = (res?.data || []).filter(m => {
                        const remaining = m.remaining_amount ?? Math.max(0, (m.amount ?? 0) - (m.amount_received_total ?? 0));
                        return remaining > 0 && m.status !== 'paid';
                    });
                    setMilestones(withDebt);
                }
            })
            .catch(() => { /* silent */ })
            .finally(() => { if (!cancelled) setLoadingMilestones(false); });

        form.resetFields();
        form.setFieldsValue({
            confirmation_date: dayjs(),
            debt_amount: 0,
            ...(initialMilestoneId ? { milestone_id: initialMilestoneId } : {}),
        });

        return () => { cancelled = true; };
    }, [open, isEdit, confirmation, journeyId, initialMilestoneId, form]);

    const selectedMilestoneId = Form.useWatch('milestone_id', form);
    const debtAmount = Form.useWatch('debt_amount', form);
    const customerAmount = Form.useWatch('amount_confirmed_by_customer', form);

    const selectedMilestone = useMemo(
        () => milestones.find(m => m._id === selectedMilestoneId) ?? null,
        [milestones, selectedMilestoneId],
    );

    /* ─── Auto-fill from milestone ────────────────────────── */

    useEffect(() => {
        if (!selectedMilestone) return;
        const remaining = selectedMilestone.remaining_amount
            ?? Math.max(0, (selectedMilestone.amount ?? 0) - (selectedMilestone.amount_received_total ?? 0));
        form.setFieldsValue({ debt_amount: remaining });
    }, [selectedMilestone, form]);

    /* ─── Compute difference ─────────────────────────────── */

    const difference = useMemo(() => {
        if (customerAmount == null || debtAmount == null) return 0;
        return debtAmount - customerAmount;
    }, [debtAmount, customerAmount]);

    /* ─── Handlers ───────────────────────────────────────── */

    const handleFinish = async (values: FormValues) => {
        setSaving(true);
        try {
            const diff = (values.debt_amount ?? 0) - (values.amount_confirmed_by_customer ?? 0);

            if (isEdit && confirmation) {
                const updated = await debtConfirmationService.updateDebtConfirmation(confirmation._id, {
                    confirmation_date: values.confirmation_date.toISOString(),
                    debt_amount: values.debt_amount,
                    amount_confirmed_by_customer: values.amount_confirmed_by_customer,
                    difference_amount: diff,
                    confirmed_by_customer_name: values.confirmed_by_customer_name || undefined,
                    payment_commitment_date: values.payment_commitment_date?.toISOString() ?? undefined,
                    reason: values.reason || undefined,
                });
                message.success('Đã cập nhật biên bản công nợ.');
                onSuccess(updated);
            } else {
                if (!selectedMilestone) {
                    message.error('Vui lòng chọn đợt thanh toán.');
                    setSaving(false);
                    return;
                }
                const input: ICreateDebtConfirmationInput = {
                    journey_id: selectedMilestone.journey_id,
                    journey_step_code: 'payment',
                    payment_milestone_id: selectedMilestone._id,
                    customer_id: (selectedMilestone as any).customer_id,
                    confirmation_date: values.confirmation_date.toISOString(),
                    status: 'draft',
                    debt_amount: values.debt_amount,
                    amount_confirmed_by_customer: values.amount_confirmed_by_customer,
                    difference_amount: diff,
                    confirmed_by_customer_name: values.confirmed_by_customer_name || undefined,
                    payment_commitment_date: values.payment_commitment_date?.toISOString() ?? undefined,
                    reason: values.reason || undefined,
                };
                const created = await debtConfirmationService.createDebtConfirmation(input);
                message.success('Đã tạo biên bản công nợ ở trạng thái nháp.');
                onSuccess(created);
            }
        } catch (e: any) {
            message.error(e?.message || 'Không thể lưu biên bản công nợ.');
        } finally {
            setSaving(false);
        }
    };

    /* ─── Render ───────────────────────────────────────────── */

    const milestoneOptions = useMemo(
        () =>
            milestones.map(m => {
                const remaining = m.remaining_amount ?? Math.max(0, (m.amount ?? 0) - (m.amount_received_total ?? 0));
                const overdue = m.due_date && dayjs(m.due_date).isBefore(dayjs(), 'day');
                return {
                    value: m._id,
                    label: `Đợt #${m.round ?? '?'} — Còn nợ ${remaining.toLocaleString('vi-VN')}đ${overdue ? ' (QUÁ HẠN)' : ''} — ${m.journey_name ?? ''}`,
                };
            }),
        [milestones],
    );

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={saving}
            title={isEdit ? 'Chỉnh sửa biên bản công nợ' : 'Tạo biên bản xác nhận công nợ'}
            width={680}
            destroyOnHidden
            okText={isEdit ? 'Cập nhật' : 'Tạo nháp'}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish} scrollToFirstError>
                {!isEdit && (
                    <Form.Item
                        name="milestone_id"
                        label="Đợt thanh toán còn nợ"
                        rules={[{ required: true, message: 'Vui lòng chọn đợt thanh toán' }]}
                        extra="Chỉ hiển thị các đợt còn dư nợ (chưa thu đủ)."
                    >
                        <Select
                            placeholder="Chọn đợt thanh toán..."
                            showSearch
                            loading={loadingMilestones}
                            options={milestoneOptions}
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                )}

                {selectedMilestone && !isEdit && (
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                        message="Thông tin đợt"
                        description={
                            <Descriptions column={1} size="small" style={{ marginTop: 4 }}>
                                <Descriptions.Item label="Giá trị đợt">
                                    {(selectedMilestone.amount ?? 0).toLocaleString('vi-VN')}đ
                                </Descriptions.Item>
                                <Descriptions.Item label="Đã thu">
                                    {(selectedMilestone.amount_received_total ?? 0).toLocaleString('vi-VN')}đ
                                </Descriptions.Item>
                                <Descriptions.Item label="Hạn thu">
                                    {selectedMilestone.due_date ? dayjs(selectedMilestone.due_date).format('DD/MM/YYYY') : '—'}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                    />
                )}

                {loadingMilestones && !isEdit && (
                    <div style={{ textAlign: 'center', padding: 16 }}><Spin /></div>
                )}

                <Form.Item
                    name="confirmation_date"
                    label="Ngày lập biên bản"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    name="debt_amount"
                    label="Số tiền nợ (theo công ty)"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền nợ' }]}
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
                    name="amount_confirmed_by_customer"
                    label="Số tiền KH xác nhận (nếu có)"
                    extra="Để trống nếu KH chưa phản hồi. KT có thể cập nhật khi nhận lại biên bản đã ký."
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={((v: string | undefined) => Number((v ?? '').replace(/[^\d]/g, '')) || 0) as any}
                        addonAfter="đ"
                    />
                </Form.Item>

                {customerAmount != null && difference !== 0 && (
                    <Alert
                        type={Math.abs(difference) > 1000 ? 'warning' : 'info'}
                        showIcon
                        message={`Chênh lệch: ${difference > 0 ? '+' : ''}${difference.toLocaleString('vi-VN')}đ`}
                        description={
                            difference > 0
                                ? 'KH xác nhận thấp hơn số liệu công ty. Cần làm rõ.'
                                : 'KH xác nhận cao hơn số liệu công ty (lạ — kiểm tra dữ liệu).'
                        }
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Form.Item name="confirmed_by_customer_name" label="Người KH ký xác nhận">
                    <Input placeholder="Tên người đại diện KH ký biên bản..." />
                </Form.Item>

                <Form.Item
                    name="payment_commitment_date"
                    label="KH cam kết trả vào ngày"
                    extra="Nếu KH cam kết deadline mới, ghi vào đây để KT tracking."
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item name="reason" label="Lý do / Ghi chú">
                    <TextArea rows={3} placeholder="Lý do phát sinh nợ, ghi chú đặc biệt..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SendConfirmationModal;
