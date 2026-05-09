import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    Result,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Timeline,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    EditOutlined,
    EyeOutlined,
    FileDoneOutlined,
    FileOutlined,
    HistoryOutlined,
    PlusOutlined,
    SaveOutlined,
    SendOutlined,
} from '@ant-design/icons';

import { quotationService } from '../../../services/core-contracts/services/quotation.service';
import { buildFilter } from '@/utils/filterBuilder';
import {
    ICreateQuotationInput,
    IQuotation,
    QuotationStatusEnum,
} from '../../../services/core-contracts/types/quotation.types';

const { Text, Title } = Typography;
const { TextArea } = Input;

/**
 * W3-01 (Wave 3 — gap-analysis 2026-05-08, UX-J360-05):
 * Step06Contract — số hoá Hợp đồng.
 *
 * Architecture discovery: Backend KHÔNG có schema "Contract" riêng.
 * "Hợp đồng" = Quotation với status='approved'. Quotation có version_no
 * để theo dõi lịch sử sửa đổi.
 *
 * Luồng:
 *  draft → sent (gửi KH) → approved (KH đồng ý / ký) | rejected (KH từ chối)
 */

const formatVND = (val: number | undefined): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val ?? 0);

const formatDate = (val: string | Date | undefined): string => {
    if (!val) return '—';
    const d = typeof val === 'string' ? new Date(val) : val;
    if (Number.isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString('vi-VN');
};

const STATUS_CONFIG: Record<QuotationStatusEnum, { label: string; color: string; icon: React.ReactNode }> = {
    draft: { label: 'Nháp', color: 'default', icon: <FileOutlined /> },
    sent: { label: 'Đã gửi KH', color: 'processing', icon: <SendOutlined /> },
    approved: { label: 'KH đồng ý (Hợp đồng)', color: 'success', icon: <CheckCircleOutlined /> },
    rejected: { label: 'KH từ chối', color: 'error', icon: <ClockCircleOutlined /> },
};

const renderStatusTag = (status: QuotationStatusEnum | undefined): React.ReactNode => {
    const cfg = STATUS_CONFIG[status ?? 'draft'];
    return <Tag color={cfg.color} icon={cfg.icon}>{cfg.label}</Tag>;
};

export interface Step06ContractProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

interface QuotationFormValues {
    code?: string;
    version_no?: number;
    subtotal?: number;
    discount?: number;
    total?: number;
    notes?: string;
}

export const Step06Contract: React.FC<Step06ContractProps> = ({
    journeyId,
    isEditable = false,
    onSave,
    onEditStateChange,
}) => {
    const [quotations, setQuotations] = useState<IQuotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingStatus, setSavingStatus] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createForm] = Form.useForm<QuotationFormValues>();
    const [creating, setCreating] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const fetchQuotations = async () => {
        if (!journeyId) { setLoading(false); return; }
        setLoading(true);
        setError(null);
        try {
            const res = await quotationService.queryQuotationsDto(buildFilter({
                where: { id: 'journey_id', value: journeyId },
                sortBy: [{ id: 'version_no', desc: true }],
                limit: 50,
            }));
            setQuotations(res?.data || []);
        } catch (e: any) {
            setError(e?.message || 'Không tải được hợp đồng / báo giá.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchQuotations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journeyId]);

    /** Quotation mới nhất (version_no lớn nhất) = bản hợp đồng hiện hành */
    const latest = useMemo(() => (quotations.length > 0 ? quotations[0] : null), [quotations]);

    const handleStatusChange = async (q: IQuotation, next: QuotationStatusEnum) => {
        if (!q._id) return;
        setSavingStatus(true);
        try {
            await quotationService.updateQuotation(q._id, {
                status: next,
                ...(next === 'approved' ? { approved_at: new Date().toISOString() } : {}),
            });
            message.success(
                next === 'approved'
                    ? 'Hợp đồng đã được ký duyệt!'
                    : next === 'sent'
                    ? 'Đã gửi báo giá cho khách hàng.'
                    : 'Đã cập nhật trạng thái.',
            );
            setQuotations((prev) =>
                prev.map((item) =>
                    item._id === q._id
                        ? {
                              ...item,
                              status: next,
                              ...(next === 'approved' ? { approved_at: new Date().toISOString() } : {}),
                          }
                        : item,
                ),
            );
            if (onSave) onSave({ id: q._id, status: next });
        } catch (e: any) {
            message.error(e?.message || 'Không cập nhật được trạng thái.');
        } finally {
            setSavingStatus(false);
        }
    };

    const handleCreate = async (values: QuotationFormValues) => {
        setCreating(true);
        try {
            const maxVersion = quotations.reduce((m, q) => Math.max(m, q.version_no ?? 0), 0);
            const input: ICreateQuotationInput = {
                journey_id: journeyId,
                code: values.code,
                version_no: values.version_no ?? maxVersion + 1,
                subtotal: values.subtotal,
                discount: values.discount,
                total: values.total ?? (values.subtotal ?? 0) - (values.discount ?? 0),
                notes: values.notes,
                status: 'draft',
            };
            const created = await quotationService.createQuotation(input);
            message.success('Đã tạo phiên bản hợp đồng mới.');
            // Re-insert and re-sort by version_no desc
            setQuotations((prev) =>
                [created, ...prev].sort((a, b) => (b.version_no ?? 0) - (a.version_no ?? 0)),
            );
            setCreateModalOpen(false);
            createForm.resetFields();
        } catch (e: any) {
            message.error(e?.message || 'Không tạo được phiên bản hợp đồng.');
        } finally {
            setCreating(false);
        }
    };

    const renderActions = (q: IQuotation) => {
        if (!isEditable) return null;
        const status = q.status ?? 'draft';
        return (
            <Space wrap size={6}>
                {status === 'draft' && (
                    <Tooltip title="Gửi cho khách hàng để xem xét">
                        <Button
                            size="small"
                            icon={<SendOutlined />}
                            loading={savingStatus}
                            onClick={() => void handleStatusChange(q, 'sent')}
                        >
                            Gửi KH
                        </Button>
                    </Tooltip>
                )}
                {(status === 'draft' || status === 'sent') && (
                    <Tooltip title="Đánh dấu khách hàng đã đồng ý / ký hợp đồng">
                        <Button
                            size="small"
                            type="primary"
                            icon={<FileDoneOutlined />}
                            loading={savingStatus}
                            onClick={() => void handleStatusChange(q, 'approved')}
                        >
                            Ký duyệt
                        </Button>
                    </Tooltip>
                )}
                {(status === 'draft' || status === 'sent') && (
                    <Button
                        size="small"
                        danger
                        loading={savingStatus}
                        onClick={() => void handleStatusChange(q, 'rejected')}
                    >
                        Từ chối
                    </Button>
                )}
                {(status === 'rejected') && (
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        loading={savingStatus}
                        onClick={() => void handleStatusChange(q, 'draft')}
                    >
                        Soạn lại
                    </Button>
                )}
            </Space>
        );
    };

    const renderLatestContract = () => {
        if (!latest) return null;
        const isApproved = latest.status === 'approved';
        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 20,
                        flexWrap: 'wrap',
                        gap: 12,
                    }}
                >
                    <div>
                        <Title level={4} style={{ margin: '0 0 6px' }}>
                            {latest.code ? `Số HĐ/BG: ${latest.code}` : 'Báo giá / Hợp đồng'}{' '}
                            <Text type="secondary" style={{ fontSize: 14 }}>
                                (v{latest.version_no ?? 1})
                            </Text>
                        </Title>
                        <Space wrap>
                            {renderStatusTag(latest.status)}
                            {isApproved && (
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    Ngày ký: {formatDate(latest.approved_at)}
                                </Text>
                            )}
                        </Space>
                    </div>
                    <Space wrap>{renderActions(latest)}</Space>
                </div>

                <Descriptions bordered column={2} size="small" style={{ marginBottom: 20 }}>
                    <Descriptions.Item label="Tạm tính (trước chiết khấu)" span={1}>
                        {formatVND(latest.subtotal)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Chiết khấu" span={1}>
                        {formatVND(latest.discount)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá trị hợp đồng" span={2}>
                        <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                            {formatVND(latest.total)}
                        </Text>
                    </Descriptions.Item>
                    {latest.notes && (
                        <Descriptions.Item label="Điều kiện / Ghi chú" span={2}>
                            {latest.notes}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Ngày tạo" span={1}>
                        {formatDate(latest.createdAt)}
                    </Descriptions.Item>
                </Descriptions>

                {isApproved && (
                    <Alert
                        type="success"
                        showIcon
                        icon={<FileDoneOutlined />}
                        message="Hợp đồng đã có hiệu lực"
                        description="Khách hàng đã đồng ý và ký kết. Hành trình tiếp tục sang giai đoạn triển khai thi công."
                        style={{ marginBottom: 16 }}
                    />
                )}

                {quotations.length > 1 && (
                    <Button
                        type="link"
                        icon={<HistoryOutlined />}
                        onClick={() => setShowHistory((v) => !v)}
                        style={{ padding: 0, marginTop: 8 }}
                    >
                        {showHistory ? 'Ẩn lịch sử phiên bản' : `Xem lịch sử (${quotations.length} phiên bản)`}
                    </Button>
                )}

                {showHistory && quotations.length > 1 && (
                    <div style={{ marginTop: 16 }}>
                        <Divider orientation="left">Lịch sử phiên bản báo giá / hợp đồng</Divider>
                        <Timeline
                            items={quotations.map((q, idx) => ({
                                color:
                                    q.status === 'approved'
                                        ? 'green'
                                        : q.status === 'rejected'
                                        ? 'red'
                                        : idx === 0
                                        ? 'blue'
                                        : 'gray',
                                children: (
                                    <Space direction="vertical" size={2}>
                                        <Space>
                                            <Text strong>
                                                v{q.version_no ?? idx + 1}
                                                {q.code ? ` — ${q.code}` : ''}
                                            </Text>
                                            {renderStatusTag(q.status)}
                                        </Space>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {formatVND(q.total)} • Tạo: {formatDate(q.createdAt)}
                                            {q.approved_at ? ` • Ký: ${formatDate(q.approved_at)}` : ''}
                                        </Text>
                                        {q.notes && (
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {q.notes.slice(0, 80)}
                                                {q.notes.length > 80 ? '...' : ''}
                                            </Text>
                                        )}
                                    </Space>
                                ),
                            }))}
                        />
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: 48 }}>
                    <Spin tip="Đang tải hợp đồng / báo giá..." />
                </div>
            );
        }

        if (error) {
            return <Alert type="error" showIcon message="Không tải được dữ liệu" description={error} />;
        }

        if (!latest) {
            return (
                <Result
                    status="info"
                    icon={<FileOutlined style={{ color: '#9CA3AF' }} />}
                    title="Chưa có hợp đồng / báo giá"
                    subTitle="Báo giá chưa được tạo cho hành trình này, hoặc chưa gắn journey_id."
                    extra={
                        isEditable && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setCreateModalOpen(true)}
                            >
                                Tạo báo giá mới
                            </Button>
                        )
                    }
                />
            );
        }

        return renderLatestContract();
    };

    const maxVersion = quotations.reduce((m, q) => Math.max(m, q.version_no ?? 0), 0);

    return (
        <>
            <Card
                title="Hợp đồng / Báo giá"
                variant="borderless"
                className="ky-card"
                extra={
                    isEditable && latest && (
                        <Space>
                            <Tooltip title="Tạo phiên bản hợp đồng / báo giá mới (khi cần sửa đổi)">
                                <Button
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        createForm.setFieldsValue({ version_no: maxVersion + 1 });
                                        setCreateModalOpen(true);
                                    }}
                                >
                                    Phiên bản mới
                                </Button>
                            </Tooltip>
                        </Space>
                    )
                }
            >
                {!isEditable && (
                    <div style={{ marginBottom: 12 }}>
                        <Text type="secondary">
                            Bạn đang ở chế độ Chỉ đọc. Chỉ Quản lý dự án và Kế toán có thể cập nhật trạng thái hợp đồng.
                        </Text>
                    </div>
                )}
                <Divider />
                {renderContent()}
            </Card>

            {/* Modal tạo phiên bản hợp đồng mới */}
            <Modal
                open={createModalOpen}
                title={
                    <Space>
                        <PlusOutlined />
                        {latest ? `Tạo phiên bản mới (v${maxVersion + 1})` : 'Tạo báo giá / hợp đồng'}
                    </Space>
                }
                onCancel={() => {
                    setCreateModalOpen(false);
                    createForm.resetFields();
                }}
                footer={null}
                width={560}
                destroyOnHidden
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreate}
                    initialValues={{ version_no: maxVersion + 1 }}
                >
                    <Row gutter={16}>
                        <Col span={14}>
                            <Form.Item label="Số hợp đồng / mã báo giá" name="code">
                                <Input placeholder="VD: BAC-2026-HĐ-001" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Phiên bản" name="version_no">
                                <InputNumber style={{ width: '100%' }} min={1} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="Tạm tính (VNĐ)" name="subtotal">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={((v: string | undefined) => Number((v ?? '').replace(/[^\d]/g, '')) || 0) as any}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Chiết khấu (VNĐ)" name="discount">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={((v: string | undefined) => Number((v ?? '').replace(/[^\d]/g, '')) || 0) as any}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Tổng giá trị (VNĐ)" name="total">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={((v: string | undefined) => Number((v ?? '').replace(/[^\d]/g, '')) || 0) as any}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Điều kiện / Ghi chú hợp đồng" name="notes">
                        <TextArea rows={4} placeholder="Phạm vi công việc, điều kiện thanh toán, thời hạn thực hiện..." />
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button
                                onClick={() => {
                                    setCreateModalOpen(false);
                                    createForm.resetFields();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={creating}>
                                Lưu (Nháp)
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default Step06Contract;
