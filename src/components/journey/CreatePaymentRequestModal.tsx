import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { paymentRequestService } from '../../services/core-contracts/services/paymentRequest.service';
import { paymentMilestoneService } from '../../services/core-contracts/services/paymentMilestone.service';
import {
    PaymentRequestPriorityEnum,
    PaymentRequestRequestTypeEnum,
} from '../../services/core-contracts/types/paymentRequest.types';
import { IPaymentMilestone } from '../../services/core-contracts/types/paymentMilestone.types';
import { UploadFiles } from '../files/UploadFiles';

const { TextArea } = Input;

/**
 * Wave 2 — W2-04. Header CTA "Đề nghị chi" cho KT trong Journey360.
 * Tạo PaymentRequest gắn với journey hiện tại, optional link tới một PaymentMilestone.
 */
export interface CreatePaymentRequestModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    journeyId: string;
    journeyName?: string;
    journeyCode?: string;
}

const REQUEST_TYPE_OPTIONS: Array<{ value: PaymentRequestRequestTypeEnum; label: string }> = [
    { value: 'supplier_payment', label: 'Thanh toán nhà cung cấp' },
    { value: 'expense_reimbursement', label: 'Hoàn ứng chi phí' },
    { value: 'salary_payment', label: 'Chi lương / công thợ' },
    { value: 'tax_payment', label: 'Nộp thuế' },
    { value: 'internal_transfer', label: 'Chuyển nội bộ' },
    { value: 'other', label: 'Khác' },
];

const PRIORITY_OPTIONS: Array<{ value: PaymentRequestPriorityEnum; label: string }> = [
    { value: 'normal', label: 'Thường' },
    { value: 'urgent', label: 'Khẩn' },
    { value: 'critical', label: 'Cực kỳ khẩn' },
];

export const CreatePaymentRequestModal: React.FC<CreatePaymentRequestModalProps> = ({
    open,
    onCancel,
    onSuccess,
    journeyId,
    journeyName,
    journeyCode,
}) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [milestones, setMilestones] = useState<IPaymentMilestone[]>([]);
    const [loadingMilestones, setLoadingMilestones] = useState(false);

    useEffect(() => {
        if (!open || !journeyId) return;
        let cancelled = false;
        setLoadingMilestones(true);
        paymentMilestoneService
            .queryPaymentMilestonesDto({
                fields: [{ field: 'journey_id', op: 'eq', value: journeyId }],
                sortFields: [{ field: 'round', sortType: 'asc' }],
                pageNumber: 1,
                pageSize: 100,
            } as any)
            .then((res) => {
                if (!cancelled) setMilestones(res?.data || []);
            })
            .catch(() => { /* silent — milestone là optional */ })
            .finally(() => { if (!cancelled) setLoadingMilestones(false); });
        return () => { cancelled = true; };
    }, [open, journeyId]);

    const milestoneOptions = useMemo(
        () =>
            milestones.map((m) => ({
                value: m._id,
                label: `Đợt #${m.round ?? '?'} — ${(m.amount ?? 0).toLocaleString('vi-VN')}đ — ${m.receipt_note || m.journey_step_code || ''}`,
            })),
        [milestones],
    );

    const handleFinish = async (values: any) => {
        setIsSubmitting(true);
        try {
            await paymentRequestService.createPaymentRequest({
                amount: values.amount,
                payment_content: values.payment_content,
                request_type: values.request_type || 'supplier_payment',
                priority: values.priority || 'normal',
                request_note: values.request_note,
                request_date: new Date(),
                supporting_files: values.supporting_files || [],
                reference_code: journeyCode,
                // Cảnh báo: payment_milestone_id chưa có trong schema PaymentRequest hiện tại (Wave 3 sẽ thêm).
                // Tạm gắn vào reference_code/request_note để KT trace ngược.
                ...(values.payment_milestone_id
                    ? { request_note: `${values.request_note || ''}\n[Milestone: ${values.payment_milestone_id}]`.trim() }
                    : {}),
                currency: 'vnd',
                status: 'pending_approval',
                submitted_at: new Date(),
            });
            message.success('Đã gửi đề nghị chi để KT/PM duyệt.');
            form.resetFields();
            onSuccess();
        } catch (e) {
            message.error('Không tạo được đề nghị chi: ' + (e instanceof Error ? e.message : 'lỗi không xác định'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title="Đề nghị chi"
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={isSubmitting}
            destroyOnClose
            width={680}
            okText="Gửi duyệt"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ request_type: 'supplier_payment', priority: 'normal' }}
            >
                <Alert
                    type="info"
                    showIcon
                    message={`Tạo đề nghị chi cho công trình "${journeyName || journeyCode || journeyId}".`}
                    description="Sau khi gửi, đề nghị sẽ vào pipeline duyệt của KT (≤ 50M) hoặc PM (> 50M)."
                    style={{ marginBottom: 16 }}
                />

                <Form.Item
                    label="Số tiền (VNĐ)"
                    name="amount"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền' }, { type: 'number', min: 1 }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={((v: string | undefined) => Number((v ?? '').replace(/[^\d]/g, '')) || 0) as any}
                        addonAfter="đ"
                    />
                </Form.Item>

                <Form.Item
                    label="Nội dung chi"
                    name="payment_content"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung chi' }]}
                >
                    <Input placeholder="VD: Thanh toán đợt 1 vật tư cho NCC ABC" />
                </Form.Item>

                <Form.Item label="Loại đề nghị" name="request_type">
                    <Select options={REQUEST_TYPE_OPTIONS} />
                </Form.Item>

                <Form.Item label="Mức ưu tiên" name="priority">
                    <Select options={PRIORITY_OPTIONS} />
                </Form.Item>

                <Form.Item
                    label="Liên kết đợt thu (tuỳ chọn)"
                    name="payment_milestone_id"
                    extra="Chọn đợt thu nếu khoản chi này phục vụ cho 1 đợt thu cụ thể của khách. KT có thể đối soát."
                >
                    <Select
                        allowClear
                        loading={loadingMilestones}
                        options={milestoneOptions}
                        placeholder="(không bắt buộc)"
                    />
                </Form.Item>

                <Form.Item label="Ghi chú" name="request_note">
                    <TextArea rows={3} placeholder="Bối cảnh, lý do, các thông tin bổ sung..." />
                </Form.Item>

                <Form.Item label="File chứng từ kèm theo" name="supporting_files">
                    <UploadFiles />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreatePaymentRequestModal;
