import React, { useEffect, useMemo, useState } from 'react';
import { Alert, DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { paymentMilestoneService } from '../../services/core-contracts/services/paymentMilestone.service';
import { buildFilter } from '../../utils/filterBuilder';
import {
    PaymentMilestoneJourneyStepCodeEnum,
    PaymentMilestoneKindEnum,
} from '../../services/core-contracts/types/paymentMilestone.types';

const { TextArea } = Input;

/**
 * Wave 2 — W2-04. Header CTA "Tạo đợt thu" cho KT trong Journey360.
 * Tạo PaymentMilestone gắn với journey hiện tại với phân loại kind đầy đủ.
 */
export interface CreatePaymentMilestoneModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    journeyId: string;
    journeyName?: string;
    journeyCode?: string;
    journeyCurrentStep?: PaymentMilestoneJourneyStepCodeEnum;
    quotationId?: string;
}

const KIND_OPTIONS: Array<{ value: PaymentMilestoneKindEnum; label: string }> = [
    { value: 'advance_deposit', label: 'Tạm ứng / Đặt cọc' },
    { value: 'progress_payment', label: 'Theo tiến độ' },
    { value: 'retention', label: 'Giữ lại bảo hành' },
    { value: 'final_settlement', label: 'Quyết toán / Thanh lý' },
    { value: 'other', label: 'Khác' },
];

const STEP_OPTIONS: Array<{ value: PaymentMilestoneJourneyStepCodeEnum; label: string }> = [
    { value: 'lead_new', label: 'Lead mới' },
    { value: 'consult_contact', label: 'Liên hệ tư vấn' },
    { value: 'site_survey', label: 'Khảo sát thực tế' },
    { value: 'solution_design', label: 'Xây dựng giải pháp' },
    { value: 'quotation', label: 'Báo giá' },
    { value: 'contract', label: 'Hợp đồng' },
    { value: 'execution', label: 'Triển khai thi công' },
    { value: 'final_acceptance', label: 'Nghiệm thu cuối' },
    { value: 'payment', label: 'Thanh toán' },
    { value: 'maintenance', label: 'Bảo trì' },
    { value: 'warranty', label: 'Bảo hành' },
    { value: 'after_sales', label: 'CSKH sau bán' },
];

/** Heuristic — đoán kind mặc định theo step hiện tại (user vẫn có thể đổi). */
const guessDefaultKind = (
    step: PaymentMilestoneJourneyStepCodeEnum | undefined,
): PaymentMilestoneKindEnum => {
    if (!step) return 'progress_payment';
    if (step === 'contract' || step === 'quotation') return 'advance_deposit';
    if (step === 'final_acceptance' || step === 'payment') return 'final_settlement';
    if (step === 'maintenance' || step === 'warranty') return 'retention';
    return 'progress_payment';
};

export const CreatePaymentMilestoneModal: React.FC<CreatePaymentMilestoneModalProps> = ({
    open,
    onCancel,
    onSuccess,
    journeyId,
    journeyName,
    journeyCode,
    journeyCurrentStep,
    quotationId,
}) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nextRound, setNextRound] = useState(1);
    const [loading, setLoading] = useState(false);

    const defaultKind = useMemo(() => guessDefaultKind(journeyCurrentStep), [journeyCurrentStep]);

    useEffect(() => {
        if (!open || !journeyId) return;
        let cancelled = false;
        setLoading(true);
        paymentMilestoneService
            .queryPaymentMilestonesDto(buildFilter({
                where: { id: 'journey_id', value: journeyId },
                sortBy: [{ id: 'round', desc: true }],
                limit: 1,
            }))
            .then((res) => {
                if (cancelled) return;
                const top = res?.data?.[0];
                setNextRound((top?.round ?? 0) + 1);
            })
            .catch(() => { if (!cancelled) setNextRound(1); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [open, journeyId]);

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                round: nextRound,
                kind: defaultKind,
                journey_step_code: journeyCurrentStep || 'execution',
            });
        }
    }, [open, nextRound, defaultKind, journeyCurrentStep, form]);

    const handleFinish = async (values: any) => {
        setIsSubmitting(true);
        try {
            await paymentMilestoneService.createPaymentMilestone({
                journey_id: journeyId,
                journey_code: journeyCode,
                journey_name: journeyName,
                journey_step_code: values.journey_step_code,
                quotation_id: quotationId,
                round: values.round,
                kind: values.kind,
                percentage: values.percentage,
                amount: values.amount,
                due_date: values.due_date ? values.due_date.toDate() : undefined,
                status: 'pending',
                receipt_note: values.receipt_note,
            });
            message.success(`Đã tạo đợt thu #${values.round}.`);
            form.resetFields();
            onSuccess();
        } catch (e) {
            message.error('Không tạo được đợt thu: ' + (e instanceof Error ? e.message : 'lỗi không xác định'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title="Tạo đợt thu"
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={isSubmitting}
            destroyOnHidden
            width={640}
            okText="Tạo đợt"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    round: nextRound,
                    kind: defaultKind,
                    journey_step_code: journeyCurrentStep || 'execution',
                }}
            >
                <Alert
                    type="info"
                    showIcon
                    message={loading
                        ? 'Đang tải số đợt tiếp theo…'
                        : `Đợt thu mới sẽ là đợt #${nextRound} của công trình "${journeyName || journeyCode || journeyId}".`}
                    style={{ marginBottom: 16 }}
                />

                <Form.Item label="Số đợt" name="round" rules={[{ required: true, type: 'number', min: 1 }]}>
                    <InputNumber min={1} style={{ width: 150 }} />
                </Form.Item>

                <Form.Item
                    label="Loại đợt thanh toán"
                    name="kind"
                    rules={[{ required: true, message: 'Chọn loại đợt' }]}
                    extra="Tạm ứng có thể phát sinh ở nhiều bước theo lịch hợp đồng — không bị ràng buộc bởi step hiện tại."
                >
                    <Select options={KIND_OPTIONS} />
                </Form.Item>

                <Form.Item label="Bước hành trình áp dụng" name="journey_step_code">
                    <Select options={STEP_OPTIONS} />
                </Form.Item>

                <Form.Item label="Tỷ lệ (%)" name="percentage" rules={[{ type: 'number', min: 0, max: 100 }]}>
                    <InputNumber min={0} max={100} addonAfter="%" style={{ width: 180 }} />
                </Form.Item>

                <Form.Item
                    label="Số tiền (VNĐ)"
                    name="amount"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền', type: 'number', min: 1 }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={((v: string | undefined) => Number((v ?? '').replace(/[^\d]/g, '')) || 0) as any}
                        addonAfter="đ"
                    />
                </Form.Item>

                <Form.Item label="Hạn thu" name="due_date" rules={[{ required: true, message: 'Chọn hạn thu' }]}>
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabledDate={(d) => d && d.isBefore(dayjs().startOf('day'))} />
                </Form.Item>

                <Form.Item label="Ghi chú đợt" name="receipt_note">
                    <TextArea rows={3} placeholder="VD: Đợt 1 – Tạm ứng vật tư cấp 1" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreatePaymentMilestoneModal;
