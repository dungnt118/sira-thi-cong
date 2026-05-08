import React, { useState } from 'react';
import {
    Alert,
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Typography,
    message,
} from 'antd';

const { TextArea } = Input;
import {
    DollarOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { paymentReceiptService } from '../../services/core-contracts/services/paymentReceipt.service';
import { IPaymentMilestone, PaymentMilestoneStatusEnum } from '../../services/core-contracts/types/paymentMilestone.types';
import {
    ICreatePaymentReceiptInput,
    PaymentReceiptReceiptMethodEnum2,
} from '../../services/core-contracts/types/paymentReceipt.types';

const { Text } = Typography;

const RECEIPT_METHOD_OPTIONS: Array<{ value: PaymentReceiptReceiptMethodEnum2; label: string }> = [
    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'card', label: 'Thẻ' },
    { value: 'other', label: 'Khác' },
];

const formatVND = (val: number | undefined): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val ?? 0);

/**
 * Tính trạng thái milestone sau khi ghi nhận thêm receipt.
 * Backend trigger script cũng tính lại, nhưng client làm optimistic update ngay.
 */
const deriveNextStatus = (
    milestoneAmount: number,
    currentReceived: number,
    newAmount: number,
): PaymentMilestoneStatusEnum => {
    const total = currentReceived + newAmount;
    if (total >= milestoneAmount) return 'paid';
    if (total > 0) return 'partially_paid';
    return 'pending';
};

export interface RecordReceiptModalProps {
    open: boolean;
    onClose: () => void;
    /** Milestone đang ghi nhận thu */
    milestone: IPaymentMilestone;
    journeyId: string;
    /**
     * Callback sau khi tạo receipt thành công.
     * Trả về partial update để caller cập nhật milestone trong state.
     */
    onSuccess: (milestoneId: string, patch: Partial<IPaymentMilestone>) => void;
}

interface ReceiptFormValues {
    amount_received: number;
    receipt_date: dayjs.Dayjs;
    receipt_method: PaymentReceiptReceiptMethodEnum2;
    transaction_ref?: string;
    note?: string;
}

export const RecordReceiptModal: React.FC<RecordReceiptModalProps> = ({
    open,
    onClose,
    milestone,
    journeyId,
    onSuccess,
}) => {
    const [form] = Form.useForm<ReceiptFormValues>();
    const [saving, setSaving] = useState(false);

    const remaining = milestone.remaining_amount
        ?? Math.max(0, (milestone.amount ?? 0) - (milestone.amount_received_total ?? 0));

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const handleFinish = async (values: ReceiptFormValues) => {
        if (!milestone._id) return;
        setSaving(true);
        try {
            const input: ICreatePaymentReceiptInput = {
                journey_id: journeyId,
                payment_milestone_id: milestone._id,
                journey_step_code: 'payment',
                receipt_date: values.receipt_date.toISOString(),
                receipt_method: values.receipt_method,
                amount_received: values.amount_received,
                transaction_ref: values.transaction_ref || undefined,
                note: values.note || undefined,
            };
            await paymentReceiptService.createPaymentReceipt(input);

            const newTotal = (milestone.amount_received_total ?? 0) + values.amount_received;
            const nextStatus = deriveNextStatus(
                milestone.amount ?? 0,
                milestone.amount_received_total ?? 0,
                values.amount_received,
            );

            message.success('Đã ghi nhận phiếu thu thành công!');
            onSuccess(milestone._id, {
                amount_received_total: newTotal,
                remaining_amount: Math.max(0, (milestone.amount ?? 0) - newTotal),
                receipt_count: (milestone.receipt_count ?? 0) + 1,
                status: nextStatus,
                last_receipt_date: values.receipt_date.toISOString(),
            });
            handleClose();
        } catch (e: any) {
            message.error(e?.message || 'Không thể ghi nhận phiếu thu. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    const milestoneLabel = [
        milestone.round != null ? `#${milestone.round}` : null,
        milestone.receipt_note || milestone.journey_name,
    ]
        .filter(Boolean)
        .join(' — ') || 'đợt này';

    return (
        <Modal
            open={open}
            title={
                <Space>
                    <DollarOutlined style={{ color: '#52c41a' }} />
                    <span>Ghi nhận phiếu thu — {milestoneLabel}</span>
                </Space>
            }
            onCancel={handleClose}
            footer={null}
            width={520}
            destroyOnClose
        >
            {/* Tóm tắt milestone */}
            <Alert
                type="info"
                style={{ marginBottom: 20 }}
                message={
                    <Space direction="vertical" size={2}>
                        <Text>
                            <strong>Giá trị đợt:</strong> {formatVND(milestone.amount)}
                        </Text>
                        <Text>
                            <strong>Đã thu:</strong> {formatVND(milestone.amount_received_total ?? 0)}
                        </Text>
                        <Text style={{ color: remaining <= 0 ? '#52c41a' : '#cf1322' }}>
                            <strong>Còn lại:</strong> {formatVND(remaining)}
                        </Text>
                        {milestone.receipt_count != null && milestone.receipt_count > 0 && (
                            <Text type="secondary">
                                Đã có {milestone.receipt_count} phiếu thu trước đó.
                            </Text>
                        )}
                    </Space>
                }
            />

            {remaining <= 0 && (
                <Alert
                    type="warning"
                    showIcon
                    message="Đợt thanh toán này đã được thu đủ."
                    description="Bạn vẫn có thể ghi nhận thêm nếu cần điều chỉnh (vd. bổ sung biên lai, ghi nhận lại)."
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    receipt_date: dayjs(),
                    receipt_method: 'bank_transfer',
                    amount_received: remaining > 0 ? remaining : undefined,
                }}
            >
                <Form.Item
                    label="Số tiền thu"
                    name="amount_received"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số tiền thu' },
                        {
                            validator: (_, value) =>
                                value != null && value > 0
                                    ? Promise.resolve()
                                    : Promise.reject('Số tiền phải lớn hơn 0'),
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={((v: string | undefined) => Number((v ?? '').replace(/[^\d]/g, '')) || 0) as any}
                        addonAfter="VND"
                        placeholder="Nhập số tiền thực thu..."
                    />
                </Form.Item>

                <Form.Item
                    label="Ngày thu"
                    name="receipt_date"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày thu' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày thu tiền"
                    />
                </Form.Item>

                <Form.Item
                    label="Hình thức thanh toán"
                    name="receipt_method"
                    rules={[{ required: true, message: 'Vui lòng chọn hình thức thanh toán' }]}
                >
                    <Select
                        options={RECEIPT_METHOD_OPTIONS}
                        placeholder="Chọn hình thức..."
                    />
                </Form.Item>

                <Form.Item
                    label="Mã giao dịch / Số biên lai"
                    name="transaction_ref"
                >
                    <Input placeholder="Số tham chiếu ngân hàng hoặc số biên lai tiền mặt..." />
                </Form.Item>

                <Form.Item label="Ghi chú" name="note">
                    <TextArea rows={3} placeholder="Ghi chú thêm (tuỳ chọn)..." />
                </Form.Item>

                <div style={{ textAlign: 'right', marginTop: 8 }}>
                    <Space>
                        <Button onClick={handleClose} disabled={saving}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={saving}
                        >
                            Ghi nhận thu
                        </Button>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
};

export default RecordReceiptModal;
