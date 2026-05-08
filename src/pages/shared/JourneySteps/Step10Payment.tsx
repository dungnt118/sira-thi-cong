import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Form,
    Input,
    Result,
    Row,
    Segmented,
    Select,
    Space,
    Spin,
    Statistic,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    CheckCircleFilled,
    ClockCircleOutlined,
    DollarOutlined,
    EditOutlined,
    EyeOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    SaveOutlined,
    TagOutlined,
    UnorderedListOutlined,
    WalletOutlined,
} from '@ant-design/icons';

import { paymentMilestoneService } from '../../../services/core-contracts/services/paymentMilestone.service';
import { paymentReceiptService } from '../../../services/core-contracts/services/paymentReceipt.service';
import {
    IPaymentMilestone,
    PaymentMilestoneKindEnum,
    PaymentMilestoneStatusEnum,
} from '../../../services/core-contracts/types/paymentMilestone.types';
import { IPaymentReceipt } from '../../../services/core-contracts/types/paymentReceipt.types';
import { RecordReceiptModal } from '../../../components/journey/RecordReceiptModal';

const { TextArea } = Input;
const { Text, Title } = Typography;

/**
 * Wave 1 (gap-analysis 2026-05-08, UX-J360-06 + W1-07):
 * Step10Payment is now the SINGLE place that renders all PaymentMilestone records
 * for a journey, regardless of `kind`. Tạm ứng (advance_deposit) is no longer a
 * separate step/tab — it appears here as a section, alongside progress, retention
 * and final-settlement. Step07Advance has been removed.
 *
 * Backend schema upgrade (Wave 1 Phase A): `PaymentMilestone.kind` field added with
 * value_options { advance_deposit, progress_payment, retention, final_settlement, other }.
 * Existing rows with no `kind` are surfaced as "Khác / Chưa phân loại".
 */

const KIND_DEFINITIONS: Array<{
    value: PaymentMilestoneKindEnum;
    label: string;
    color: string;
}> = [
    { value: 'advance_deposit', label: 'Tạm ứng / Đặt cọc', color: '#f59e0b' },
    { value: 'progress_payment', label: 'Theo tiến độ', color: '#3b82f6' },
    { value: 'retention', label: 'Giữ lại bảo hành', color: '#8b5cf6' },
    { value: 'final_settlement', label: 'Quyết toán', color: '#10b981' },
    { value: 'other', label: 'Khác', color: '#64748b' },
];

const KIND_LABEL_MAP: Record<string, string> = KIND_DEFINITIONS.reduce(
    (acc, d) => ({ ...acc, [d.value]: d.label }),
    {},
);

const KIND_COLOR_MAP: Record<string, string> = KIND_DEFINITIONS.reduce(
    (acc, d) => ({ ...acc, [d.value]: d.color }),
    {},
);

type KindFilter = PaymentMilestoneKindEnum | 'all';

const formatVND = (val: number | undefined): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val ?? 0);

const formatDate = (val: string | Date | undefined): string => {
    if (!val) return '—';
    const d = typeof val === 'string' ? new Date(val) : val;
    if (Number.isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString('vi-VN');
};

const renderStatusTag = (status: PaymentMilestoneStatusEnum | undefined): React.ReactNode => {
    switch (status) {
        case 'paid':
            return <Tag color="success" icon={<CheckCircleFilled />}>Đã thu đủ</Tag>;
        case 'partially_paid':
            return <Tag color="processing" icon={<ClockCircleOutlined />}>Đã thu một phần</Tag>;
        case 'overdue':
            return <Tag color="error" icon={<ClockCircleOutlined />}>Quá hạn</Tag>;
        case 'pending':
        default:
            return <Tag color="warning" icon={<ClockCircleOutlined />}>Chờ thu</Tag>;
    }
};

const sumMilestones = (rows: IPaymentMilestone[]): { amount: number; received: number } => {
    return rows.reduce(
        (acc, r) => ({
            amount: acc.amount + (r.amount ?? 0),
            received: acc.received + (r.amount_received_total ?? 0),
        }),
        { amount: 0, received: 0 },
    );
};

export interface Step10PaymentProps {
    journeyId: string;
    isEditable?: boolean;
    /** Pre-select a kind segment when the tab opens. Used when external callers want to deeplink to advance/retention/etc. */
    initialKindFilter?: KindFilter;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step10Payment: React.FC<Step10PaymentProps> = ({
    journeyId,
    isEditable = false,
    initialKindFilter = 'all',
    onSave,
    onEditStateChange,
}) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [milestones, setMilestones] = useState<IPaymentMilestone[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [kindFilter, setKindFilter] = useState<KindFilter>(initialKindFilter);
    const [reTaggingId, setReTaggingId] = useState<string | null>(null);

    // W3-03 — Receipt state
    const [receiptModalMilestone, setReceiptModalMilestone] = useState<IPaymentMilestone | null>(null);
    /** Receipts per milestone _id — lazy loaded when row is expanded */
    const [receiptsMap, setReceiptsMap] = useState<Record<string, IPaymentReceipt[]>>({});
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const [receiptsLoading, setReceiptsLoading] = useState<Record<string, boolean>>({});

    const fetchReceiptsForMilestone = async (milestoneId: string) => {
        if (receiptsMap[milestoneId] !== undefined) return; // already loaded
        setReceiptsLoading((prev) => ({ ...prev, [milestoneId]: true }));
        try {
            const res = await paymentReceiptService.queryPaymentReceiptsDto({
                fields: [{ field: 'payment_milestone_id', op: 'eq', value: milestoneId }],
                sortFields: [{ field: 'receipt_date', sortType: 'desc' }],
                pageNumber: 1,
                pageSize: 50,
            } as any);
            setReceiptsMap((prev) => ({ ...prev, [milestoneId]: res?.data || [] }));
        } catch {
            setReceiptsMap((prev) => ({ ...prev, [milestoneId]: [] }));
        } finally {
            setReceiptsLoading((prev) => ({ ...prev, [milestoneId]: false }));
        }
    };

    const handleReceiptSuccess = (milestoneId: string, patch: Partial<IPaymentMilestone>) => {
        // Optimistic update of the milestone row
        setMilestones((prev) =>
            prev.map((m) => (m._id === milestoneId ? { ...m, ...patch } : m)),
        );
        // Invalidate the receipt cache so the row-expand re-fetches
        setReceiptsMap((prev) => {
            const next = { ...prev };
            delete next[milestoneId];
            return next;
        });
        // If row is expanded, re-fetch immediately
        if (expandedRowKeys.includes(milestoneId)) {
            void fetchReceiptsForMilestone(milestoneId);
        }
    };

    const fetchMilestones = async () => {
        if (!journeyId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await paymentMilestoneService.queryPaymentMilestonesDto({
                fields: [{ field: 'journey_id', op: 'eq', value: journeyId }],
                sortFields: [{ field: 'round', sortType: 'asc' }],
                pageNumber: 1,
                pageSize: 200,
            } as any);
            setMilestones(response?.data || []);
        } catch (e: any) {
            setError(e?.message || 'Không tải được danh sách đợt thanh toán.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchMilestones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journeyId]);

    const filteredMilestones = useMemo(() => {
        if (kindFilter === 'all') return milestones;
        return milestones.filter((m) => (m.kind ?? 'other') === kindFilter);
    }, [milestones, kindFilter]);

    const totals = useMemo(() => sumMilestones(filteredMilestones), [filteredMilestones]);
    const allTotals = useMemo(() => sumMilestones(milestones), [milestones]);

    /** Counts per kind, used to render badges on the segmented control. */
    const countsByKind = useMemo(() => {
        const acc: Record<string, number> = { all: milestones.length };
        for (const def of KIND_DEFINITIONS) acc[def.value] = 0;
        for (const m of milestones) {
            const k = m.kind ?? 'other';
            acc[k] = (acc[k] ?? 0) + 1;
        }
        return acc;
    }, [milestones]);

    const handleReTagKind = async (record: IPaymentMilestone, nextKind: PaymentMilestoneKindEnum) => {
        if (!record._id || record.kind === nextKind) return;
        setReTaggingId(record._id);
        try {
            await paymentMilestoneService.updatePaymentMilestone(record._id, { kind: nextKind });
            message.success(`Đã đổi loại đợt thành "${KIND_LABEL_MAP[nextKind]}"`);
            setMilestones((prev) =>
                prev.map((m) => (m._id === record._id ? { ...m, kind: nextKind } : m)),
            );
        } catch (e: any) {
            message.error(e?.message || 'Không cập nhật được loại đợt thanh toán.');
        } finally {
            setReTaggingId(null);
        }
    };

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
        if (onEditStateChange) onEditStateChange(false);
    };

    const segmentedOptions = useMemo(
        () => [
            { label: <span>Tất cả ({countsByKind.all ?? 0})</span>, value: 'all' as const },
            ...KIND_DEFINITIONS.map((d) => ({
                label: <span>{d.label} ({countsByKind[d.value] ?? 0})</span>,
                value: d.value,
            })),
        ],
        [countsByKind],
    );

    const columns = [
        {
            title: 'Đợt',
            dataIndex: 'round',
            key: 'round',
            width: 60,
            render: (val: number | undefined) => (val != null ? `#${val}` : '—'),
        },
        {
            title: 'Loại',
            dataIndex: 'kind',
            key: 'kind',
            width: 220,
            render: (kind: PaymentMilestoneKindEnum | undefined, record: IPaymentMilestone) => {
                const effectiveKind = (kind ?? 'other') as PaymentMilestoneKindEnum;
                const color = KIND_COLOR_MAP[effectiveKind];
                const label = KIND_LABEL_MAP[effectiveKind];
                if (!isEditable) {
                    return <Tag color={color}>{label}</Tag>;
                }
                return (
                    <Select
                        size="small"
                        value={effectiveKind}
                        loading={reTaggingId === record._id}
                        disabled={reTaggingId === record._id}
                        onChange={(next) => void handleReTagKind(record, next)}
                        style={{ minWidth: 200 }}
                        suffixIcon={<TagOutlined />}
                        options={KIND_DEFINITIONS.map((d) => ({ value: d.value, label: d.label }))}
                    />
                );
            },
        },
        {
            title: 'Mô tả / Bước hành trình',
            dataIndex: 'journey_step_code',
            key: 'journey_step_code',
            render: (val: string | undefined, record: IPaymentMilestone) => (
                <span>
                    {record.receipt_note || record.journey_name || '—'}
                    {val ? <Text type="secondary"> — {val}</Text> : null}
                </span>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right' as const,
            render: (val: number | undefined) => formatVND(val),
        },
        {
            title: 'Đã thu',
            dataIndex: 'amount_received_total',
            key: 'amount_received_total',
            align: 'right' as const,
            render: (val: number | undefined) => formatVND(val),
        },
        {
            title: 'Hạn thanh toán',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (val: string | Date | undefined) => formatDate(val),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (s: PaymentMilestoneStatusEnum | undefined) => renderStatusTag(s),
        },
        ...(isEditable
            ? [
                  {
                      title: '',
                      key: 'actions',
                      width: 130,
                      render: (_: any, record: IPaymentMilestone) => (
                          <Space size={4}>
                              <Tooltip title="Ghi nhận thu tiền cho đợt này">
                                  <Button
                                      size="small"
                                      type="primary"
                                      ghost
                                      icon={<PlusOutlined />}
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setReceiptModalMilestone(record);
                                      }}
                                      disabled={record.status === 'paid'}
                                  >
                                      Ghi nhận thu
                                  </Button>
                              </Tooltip>
                          </Space>
                      ),
                  },
              ]
            : []),
    ];

    const renderEmpty = () => (
        <Result
            status="info"
            icon={<WalletOutlined style={{ color: '#9CA3AF' }} />}
            title="Chưa có đợt thanh toán nào"
            subTitle="Các đợt sẽ được sinh ra từ Báo giá / Hợp đồng. Bao gồm cả Tạm ứng, Theo tiến độ, Giữ lại bảo hành và Quyết toán."
        />
    );

    const renderReadOnly = () => {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: 48 }}>
                    <Spin tip="Đang tải đợt thanh toán..." />
                </div>
            );
        }

        if (error) {
            return <Alert type="error" showIcon message="Không tải được dữ liệu" description={error} />;
        }

        if (milestones.length === 0) {
            return renderEmpty();
        }

        const balance = totals.amount - totals.received;

        return (
            <div style={{ padding: '0 12px' }}>
                <Segmented
                    options={segmentedOptions}
                    value={kindFilter}
                    onChange={(v) => setKindFilter(v as KindFilter)}
                    style={{ marginBottom: 16, flexWrap: 'wrap' }}
                />

                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card size="small" style={{ background: '#f6ffed' }}>
                            <Statistic
                                title={kindFilter === 'all' ? 'Đã thu (toàn bộ)' : `Đã thu (${KIND_LABEL_MAP[kindFilter] ?? kindFilter})`}
                                value={totals.received}
                                suffix="đ"
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small" style={{ background: '#fff7e6' }}>
                            <Statistic
                                title="Còn lại"
                                value={balance}
                                suffix="đ"
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small">
                            <Statistic title="Tổng giá trị" value={totals.amount} suffix="đ" />
                            {kindFilter !== 'all' && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Toàn bộ journey: {formatVND(allTotals.amount)}
                                </Text>
                            )}
                        </Card>
                    </Col>
                </Row>

                <Title level={5}>
                    <DollarOutlined /> Lịch trình thanh toán {kindFilter !== 'all' && `— ${KIND_LABEL_MAP[kindFilter]}`}
                </Title>

                {filteredMilestones.length === 0 ? (
                    <Empty
                        description={`Không có đợt thuộc loại "${KIND_LABEL_MAP[kindFilter] ?? kindFilter}".`}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <Table
                        dataSource={filteredMilestones}
                        columns={columns}
                        pagination={false}
                        size="small"
                        bordered
                        rowKey="_id"
                        expandable={{
                            expandedRowKeys,
                            onExpand: (expanded, record) => {
                                if (!record._id) return;
                                if (expanded) {
                                    setExpandedRowKeys((prev) => [...prev, record._id]);
                                    void fetchReceiptsForMilestone(record._id);
                                } else {
                                    setExpandedRowKeys((prev) => prev.filter((k) => k !== record._id));
                                }
                            },
                            expandIcon: ({ expanded, onExpand, record }) => (
                                <Tooltip title={expanded ? 'Ẩn phiếu thu' : 'Xem phiếu thu'}>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<UnorderedListOutlined />}
                                        onClick={(e) => onExpand(record, e)}
                                        style={{ color: expanded ? '#1890ff' : undefined }}
                                    />
                                </Tooltip>
                            ),
                            expandedRowRender: (record) => {
                                const id = record._id;
                                const receipts = receiptsMap[id] ?? [];
                                const isLoadingReceipts = receiptsLoading[id] ?? false;
                                if (isLoadingReceipts) {
                                    return <Spin style={{ padding: 16 }} />;
                                }
                                if (receipts.length === 0) {
                                    return (
                                        <Empty
                                            description="Chưa có phiếu thu nào cho đợt này."
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            style={{ margin: '8px 0' }}
                                        />
                                    );
                                }
                                return (
                                    <Table
                                        dataSource={receipts}
                                        rowKey="_id"
                                        size="small"
                                        pagination={false}
                                        style={{ margin: '4px 0' }}
                                        columns={[
                                            {
                                                title: 'Ngày thu',
                                                dataIndex: 'receipt_date',
                                                key: 'receipt_date',
                                                render: (v) => formatDate(v),
                                            },
                                            {
                                                title: 'Số tiền',
                                                dataIndex: 'amount_received',
                                                key: 'amount_received',
                                                align: 'right' as const,
                                                render: (v) => formatVND(v),
                                            },
                                            {
                                                title: 'Hình thức',
                                                dataIndex: 'receipt_method',
                                                key: 'receipt_method',
                                                render: (v: string) => {
                                                    const map: Record<string, string> = {
                                                        bank_transfer: 'Chuyển khoản',
                                                        cash: 'Tiền mặt',
                                                        card: 'Thẻ',
                                                        other: 'Khác',
                                                    };
                                                    return map[v] ?? v;
                                                },
                                            },
                                            {
                                                title: 'Mã giao dịch',
                                                dataIndex: 'transaction_ref',
                                                key: 'transaction_ref',
                                                render: (v) => v || <Text type="secondary">—</Text>,
                                            },
                                            {
                                                title: 'Ghi chú',
                                                dataIndex: 'note',
                                                key: 'note',
                                                render: (v) => v || <Text type="secondary">—</Text>,
                                            },
                                        ]}
                                    />
                                );
                            },
                        }}
                    />
                )}

                {isEditable && (
                    <Tooltip title="Bạn có thể đổi loại đợt thanh toán trực tiếp trên cột 'Loại'. Thay đổi được lưu ngay vào hệ thống.">
                        <Alert
                            style={{ marginTop: 24 }}
                            type="info"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            message="Phân loại lại đợt thanh toán"
                            description="Tạm ứng / Theo tiến độ / Giữ lại / Quyết toán có thể được đổi trên từng dòng. Thay đổi áp dụng ngay lập tức."
                        />
                    </Tooltip>
                )}
            </div>
        );
    };

    const renderEditable = () => (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
        >
            <Alert
                showIcon
                type="info"
                style={{ marginBottom: 16 }}
                message="Wave 1: trang này nhận đợt thanh toán từ Báo giá / Hợp đồng."
                description="Việc tạo / sửa đợt thanh toán đầy đủ là hạng mục Wave 3 (W3-03). Tạm thời chỉ ghi chú quyết toán; phân loại đợt được làm trực tiếp ở chế độ Xem."
            />
            <Form.Item label="Ghi chú quyết toán" name="notes">
                <TextArea rows={4} placeholder="Nhập ghi chú liên quan đến việc thanh lý hợp đồng..." />
            </Form.Item>
            <Space style={{ marginTop: 16 }}>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Lưu ghi chú
                </Button>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
            </Space>
        </Form>
    );

    return (
        <Card
            title={isEditing ? 'Thực hiện: Đợt thu / Quyết toán' : 'Đợt thu / Quyết toán'}
            variant="borderless"
            className="ky-card"
            extra={
                isEditable && (
                    <Button
                        type={isEditing ? 'default' : 'primary'}
                        icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                        onClick={() => {
                            const newEdit = !isEditing;
                            setIsEditing(newEdit);
                            if (onEditStateChange) onEditStateChange(newEdit);
                        }}
                    >
                        {isEditing ? 'Xem lại' : 'Cập nhật'}
                    </Button>
                )
            }
        >
            {!isEditable && (
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">
                        Bạn đang ở chế độ Chỉ đọc. Chỉ Quản lý dự án và Kế toán có thể phân loại lại đợt thanh toán.
                    </Text>
                </div>
            )}
            <Divider />
            {isEditing ? renderEditable() : renderReadOnly()}

            {/* W3-03 — Ghi nhận thu modal */}
            {receiptModalMilestone && (
                <RecordReceiptModal
                    open={receiptModalMilestone !== null}
                    milestone={receiptModalMilestone}
                    journeyId={journeyId}
                    onClose={() => setReceiptModalMilestone(null)}
                    onSuccess={handleReceiptSuccess}
                />
            )}
        </Card>
    );
};

export default Step10Payment;
