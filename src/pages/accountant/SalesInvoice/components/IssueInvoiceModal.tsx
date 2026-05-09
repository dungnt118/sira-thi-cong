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

import { salesInvoiceService } from '../../../../services/core-contracts/services/salesInvoice.service';
import { paymentReceiptService } from '../../../../services/core-contracts/services/paymentReceipt.service';
import {
    ICreateSalesInvoiceInput,
    ISalesInvoice,
    SalesInvoiceInvoiceTypeEnum2,
} from '../../../../services/core-contracts/types/salesInvoice.types';
import { IPaymentReceipt } from '../../../../services/core-contracts/types/paymentReceipt.types';
import { buildFilter } from '@/utils/filterBuilder';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * Wave 4 W4-04 — Modal xuất / chỉnh hoá đơn VAT.
 *
 * Flow:
 *  1. KT chọn PaymentReceipt (đã thu) — auto fill amount + journey + customer.
 *  2. Nhập MST + invoice_number + tax_amount (nếu type='vat_invoice').
 *  3. Submit → status='draft' (KT có thể phát hành sau ở list page).
 *
 * Edit: nếu invoice đã `issued`/`sent`/`cancelled` thì list page block không mở edit.
 */

const TYPE_OPTIONS: Array<{ value: SalesInvoiceInvoiceTypeEnum2; label: string }> = [
    { value: 'vat_invoice', label: 'Hoá đơn VAT' },
    { value: 'sales_invoice', label: 'Hoá đơn bán hàng (không VAT)' },
    { value: 'adjustment_invoice', label: 'Hoá đơn điều chỉnh' },
];

const DEFAULT_VAT_RATE = 0.08; // 8% — current VN VAT rate. Configurable in Wave 5+.

export interface IssueInvoiceModalProps {
    open: boolean;
    invoice: ISalesInvoice | null;
    onClose: () => void;
    onSuccess: (saved: ISalesInvoice) => void;
    /**
     * Optional — khi modal được mở từ Journey context (Step10Payment), filter receipts theo journey
     * để KT dễ chọn. Để trống để load all receipts (KT global flow).
     */
    journeyId?: string;
    /** Optional — pre-select receipt nếu KT click "Xuất hoá đơn" trên row receipt cụ thể. */
    initialReceiptId?: string;
}

interface FormValues {
    receipt_id?: string;
    invoice_type: SalesInvoiceInvoiceTypeEnum2;
    invoice_number?: string;
    invoice_date: dayjs.Dayjs;
    tax_code?: string;
    amount_before_tax: number;
    tax_amount: number;
    note?: string;
}

const IssueInvoiceModal: React.FC<IssueInvoiceModalProps> = ({
    open,
    invoice,
    onClose,
    onSuccess,
    journeyId,
    initialReceiptId,
}) => {
    const [form] = Form.useForm<FormValues>();
    const [receipts, setReceipts] = useState<IPaymentReceipt[]>([]);
    const [loadingReceipts, setLoadingReceipts] = useState(false);
    const [saving, setSaving] = useState(false);
    const isEdit = !!invoice;

    /* ─── Fetch eligible PaymentReceipts (chưa có invoice gắn) ─── */

    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            // Edit mode — không cần load list receipts. Pre-fill form từ invoice.
            form.setFieldsValue({
                invoice_type: (invoice?.invoice_type ?? 'vat_invoice') as SalesInvoiceInvoiceTypeEnum2,
                invoice_number: invoice?.invoice_number,
                invoice_date: invoice?.invoice_date ? dayjs(invoice.invoice_date) : dayjs(),
                tax_code: invoice?.tax_code,
                amount_before_tax: invoice?.amount_before_tax ?? 0,
                tax_amount: invoice?.tax_amount ?? 0,
                note: invoice?.note,
            });
            return;
        }

        // Create mode — load receipts. Filter theo journey nếu có journeyId.
        let cancelled = false;
        setLoadingReceipts(true);
        paymentReceiptService.queryPaymentReceiptsDto(buildFilter({
            where: journeyId ? { id: 'journey_id', value: journeyId } : undefined,
            sortBy: [{ id: 'receipt_date', desc: true }],
            limit: 100,
        }))
            .then(res => {
                if (!cancelled) setReceipts(res?.data || []);
            })
            .catch(() => { /* silent */ })
            .finally(() => { if (!cancelled) setLoadingReceipts(false); });

        // Reset form for new invoice + pre-select if requested.
        form.resetFields();
        form.setFieldsValue({
            invoice_type: 'vat_invoice',
            invoice_date: dayjs(),
            amount_before_tax: 0,
            tax_amount: 0,
            ...(initialReceiptId ? { receipt_id: initialReceiptId } : {}),
        });

        return () => { cancelled = true; };
    }, [open, isEdit, invoice, journeyId, initialReceiptId, form]);

    const selectedReceiptId = Form.useWatch('receipt_id', form);
    const invoiceType = Form.useWatch('invoice_type', form);
    const amountBeforeTax = Form.useWatch('amount_before_tax', form);

    /* ─── Auto-fill from selected receipt ─────────────────── */

    const selectedReceipt = useMemo(
        () => receipts.find(r => r._id === selectedReceiptId) ?? null,
        [receipts, selectedReceiptId],
    );

    useEffect(() => {
        if (!selectedReceipt) return;
        const amount = selectedReceipt.amount_received ?? 0;
        // Auto-split amount_before_tax + tax based on type
        const isVat = (form.getFieldValue('invoice_type') as string) === 'vat_invoice';
        const beforeTax = isVat
            ? Math.round(amount / (1 + DEFAULT_VAT_RATE))
            : amount;
        const tax = isVat ? amount - beforeTax : 0;
        form.setFieldsValue({
            amount_before_tax: beforeTax,
            tax_amount: tax,
        });
    }, [selectedReceipt, form]);

    /* ─── Auto-recalc tax when amount/type changes ────────── */

    useEffect(() => {
        if (isEdit) return;
        if (invoiceType === 'vat_invoice' && amountBeforeTax > 0) {
            const tax = Math.round(amountBeforeTax * DEFAULT_VAT_RATE);
            form.setFieldsValue({ tax_amount: tax });
        } else if (invoiceType !== 'vat_invoice') {
            form.setFieldsValue({ tax_amount: 0 });
        }
    }, [invoiceType, amountBeforeTax, isEdit, form]);

    /* ─── Handlers ─────────────────────────────────────────── */

    const handleFinish = async (values: FormValues) => {
        setSaving(true);
        try {
            const totalAmount = (values.amount_before_tax ?? 0) + (values.tax_amount ?? 0);

            if (isEdit && invoice) {
                const updated = await salesInvoiceService.updateSalesInvoice(invoice._id, {
                    invoice_type: values.invoice_type,
                    invoice_number: values.invoice_number || undefined,
                    invoice_date: values.invoice_date.toISOString(),
                    tax_code: values.tax_code || undefined,
                    amount_before_tax: values.amount_before_tax,
                    tax_amount: values.tax_amount,
                    total_amount: totalAmount,
                    note: values.note || undefined,
                });
                message.success('Đã cập nhật hoá đơn.');
                onSuccess(updated);
            } else {
                if (!selectedReceipt) {
                    message.error('Vui lòng chọn phiếu thu nguồn.');
                    setSaving(false);
                    return;
                }
                const input: ICreateSalesInvoiceInput = {
                    journey_id: selectedReceipt.journey_id,
                    journey_step_code: 'payment',
                    payment_milestone_id: selectedReceipt.payment_milestone_id,
                    payment_receipt_id: selectedReceipt._id,
                    customer_id: (selectedReceipt as any).customer_id ?? undefined,
                    invoice_type: values.invoice_type,
                    invoice_status: 'draft',
                    invoice_date: values.invoice_date.toISOString(),
                    invoice_number: values.invoice_number || undefined,
                    tax_code: values.tax_code || undefined,
                    amount_before_tax: values.amount_before_tax,
                    tax_amount: values.tax_amount,
                    total_amount: totalAmount,
                    note: values.note || undefined,
                };
                const created = await salesInvoiceService.createSalesInvoice(input);
                message.success('Đã tạo hoá đơn nháp. Bạn có thể phát hành ở danh sách.');
                onSuccess(created);
            }
        } catch (e: any) {
            message.error(e?.message || 'Không thể lưu hoá đơn.');
        } finally {
            setSaving(false);
        }
    };

    /* ─── Render ─────────────────────────────────────────────── */

    const receiptOptions = useMemo(
        () =>
            receipts.map(r => ({
                value: r._id,
                label: `${r.code ?? r._id.slice(-6).toUpperCase()} — ${(r.amount_received ?? 0).toLocaleString('vi-VN')}đ — ${r.receipt_date ? dayjs(r.receipt_date).format('DD/MM/YYYY') : ''}`,
            })),
        [receipts],
    );

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={saving}
            title={isEdit ? 'Chỉnh sửa hoá đơn' : 'Xuất hoá đơn từ phiếu thu'}
            width={680}
            destroyOnHidden
            okText={isEdit ? 'Cập nhật' : 'Tạo nháp'}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish} scrollToFirstError>
                {!isEdit && (
                    <Form.Item
                        name="receipt_id"
                        label="Phiếu thu nguồn"
                        rules={[{ required: true, message: 'Vui lòng chọn phiếu thu' }]}
                        extra="Chọn phiếu thu thực tế đã ghi nhận để xuất hoá đơn cho khách. Số tiền sẽ tự động được tách thành before-tax + VAT 8%."
                    >
                        <Select
                            placeholder="Chọn phiếu thu..."
                            showSearch
                            loading={loadingReceipts}
                            options={receiptOptions}
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                )}

                {selectedReceipt && !isEdit && (
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                        message="Thông tin phiếu thu nguồn"
                        description={
                            <Descriptions column={1} size="small" style={{ marginTop: 4 }}>
                                <Descriptions.Item label="Số tiền">
                                    <Text strong>{(selectedReceipt.amount_received ?? 0).toLocaleString('vi-VN')}đ</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày thu">
                                    {selectedReceipt.receipt_date ? dayjs(selectedReceipt.receipt_date).format('DD/MM/YYYY') : '—'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Hình thức">
                                    {selectedReceipt.receipt_method === 'bank_transfer' ? 'Chuyển khoản'
                                        : selectedReceipt.receipt_method === 'cash' ? 'Tiền mặt'
                                            : selectedReceipt.receipt_method === 'card' ? 'Thẻ'
                                                : selectedReceipt.receipt_method ?? '—'}
                                </Descriptions.Item>
                                {selectedReceipt.transaction_ref && (
                                    <Descriptions.Item label="Mã GD">
                                        {selectedReceipt.transaction_ref}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        }
                    />
                )}

                {loadingReceipts && !isEdit && (
                    <div style={{ textAlign: 'center', padding: 16 }}><Spin /></div>
                )}

                <Space.Compact style={{ width: '100%', display: 'flex', gap: 12 }}>
                    <Form.Item
                        name="invoice_type"
                        label="Loại hoá đơn"
                        rules={[{ required: true }]}
                        style={{ flex: 1 }}
                    >
                        <Select options={TYPE_OPTIONS} />
                    </Form.Item>
                    <Form.Item
                        name="invoice_number"
                        label="Số hoá đơn"
                        style={{ flex: 1 }}
                        extra="Có thể để trống lúc nháp; bắt buộc khi phát hành."
                    >
                        <Input placeholder="VD: 2026-001234" />
                    </Form.Item>
                </Space.Compact>

                <Space.Compact style={{ width: '100%', display: 'flex', gap: 12 }}>
                    <Form.Item
                        name="invoice_date"
                        label="Ngày hoá đơn"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                        style={{ flex: 1 }}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item
                        name="tax_code"
                        label="MST khách hàng"
                        style={{ flex: 1 }}
                        extra="Bắt buộc khi loại = VAT."
                    >
                        <Input placeholder="VD: 0123456789" />
                    </Form.Item>
                </Space.Compact>

                <Form.Item
                    name="amount_before_tax"
                    label="Tiền trước thuế (VND)"
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
                    name="tax_amount"
                    label="Tiền thuế VAT"
                    extra="Tự động tính 8% khi loại = VAT. Có thể chỉnh tay nếu cần."
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={((v: string | undefined) => Number((v ?? '').replace(/[^\d]/g, '')) || 0) as any}
                        addonAfter="đ"
                    />
                </Form.Item>

                <Form.Item label="Tổng tiền">
                    <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                        {(((Form.useWatch('amount_before_tax', form) ?? 0) + (Form.useWatch('tax_amount', form) ?? 0)) as number).toLocaleString('vi-VN')}đ
                    </Text>
                </Form.Item>

                <Form.Item name="note" label="Ghi chú">
                    <TextArea rows={2} placeholder="Ghi chú nội bộ (không in lên hoá đơn)..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default IssueInvoiceModal;
