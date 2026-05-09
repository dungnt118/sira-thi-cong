import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    DatePicker,
    Form,
    Input,
    Modal,
    Popconfirm,
    Result,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Typography,
    message,
} from 'antd';
import {
    PlusOutlined,
    ReloadOutlined,
    SafetyCertificateOutlined,
    SafetyOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { warrantyCaseService } from '../../../services/core-contracts/services/warrantyCase.service';
import { warrantyCardService } from '../../../services/core-contracts/services/warrantyCard.service';
import {
    ICreateWarrantyCaseInput,
    IWarrantyCase,
    WarrantyCaseSeverityEnum2,
    WarrantyCaseStatusEnum,
    WarrantyCaseStatusEnum2,
} from '../../../services/core-contracts/types/warrantyCase.types';
import { IWarrantyCard } from '../../../services/core-contracts/types/warrantyCard.types';
import { buildFilter } from '@/utils/filterBuilder';

const { TextArea } = Input;
const { Text } = Typography;

/* ─── Constants ──────────────────────────────────────────────── */

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'default' },
    medium: { label: 'Trung bình', color: 'orange' },
    high: { label: 'Cao', color: 'volcano' },
    critical: { label: 'Nghiêm trọng', color: 'red' },
};

const CASE_STATUS_CONFIG: Record<WarrantyCaseStatusEnum, { label: string; color: string }> = {
    new: { label: 'Mới', color: 'default' },
    assigned: { label: 'Đã phân công', color: 'blue' },
    in_progress: { label: 'Đang xử lý', color: 'processing' },
    resolved: { label: 'Đã xử lý', color: 'success' },
    closed: { label: 'Đóng', color: 'default' },
};

/* ─── Component ──────────────────────────────────────────────── */

export interface Step12WarrantyProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

interface CaseFormValues {
    issue_title: string;
    severity: WarrantyCaseSeverityEnum2;
    issue_detail?: string;
    reported_at: dayjs.Dayjs;
}

export const Step12Warranty: React.FC<Step12WarrantyProps> = ({
    journeyId,
    isEditable = false,
}) => {
    const [warrantyCard, setWarrantyCard] = useState<IWarrantyCard | null>(null);
    const [cases, setCases] = useState<IWarrantyCase[]>([]);
    const [loading, setLoading] = useState(false);
    const [addCaseOpen, setAddCaseOpen] = useState(false);
    const [savingCase, setSavingCase] = useState(false);
    const [form] = Form.useForm<CaseFormValues>();

    /* ─── Data fetching ─────────────────────────────────────── */

    const fetchData = useCallback(async () => {
        if (!journeyId) return;
        setLoading(true);
        try {
            const [cardRes, casesRes] = await Promise.all([
                warrantyCardService.queryWarrantyCardsDto(buildFilter({
                    where: { id: 'journey_id', value: journeyId },
                    sortBy: [{ id: 'issued_at', desc: true }],
                    limit: 1,
                })),
                warrantyCaseService.queryWarrantyCasesDto(buildFilter({
                    where: [
                        { id: 'journey_id', value: journeyId },
                        { id: 'journey_step_code', value: 'warranty' },
                    ],
                    sortBy: [{ id: 'reported_at', desc: true }],
                    limit: 50,
                })),
            ]);
            setWarrantyCard(cardRes?.data?.[0] ?? null);
            setCases(casesRes?.data || []);
        } catch {
            message.error('Không thể tải dữ liệu bảo hành.');
        } finally {
            setLoading(false);
        }
    }, [journeyId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Handlers ──────────────────────────────────────────── */

    const handleCaseStatusChange = async (c: IWarrantyCase, next: WarrantyCaseStatusEnum2) => {
        try {
            const updated = await warrantyCaseService.updateWarrantyCase(c._id, {
                status: next,
                ...(next === 'resolved' ? { resolved_at: new Date().toISOString() } : {}),
            });
            setCases(prev => prev.map(x => x._id === updated._id ? { ...x, status: next } : x));
            message.success('Đã cập nhật trạng thái yêu cầu bảo hành');
        } catch {
            message.error('Cập nhật thất bại.');
        }
    };

    const handleCreateCase = async (values: CaseFormValues) => {
        setSavingCase(true);
        try {
            const input: ICreateWarrantyCaseInput = {
                journey_id: journeyId,
                journey_step_code: 'warranty',
                warranty_card_id: warrantyCard?._id,
                issue_title: values.issue_title,
                severity: values.severity,
                issue_detail: values.issue_detail || undefined,
                reported_at: values.reported_at.toISOString(),
                status: 'new',
            };
            const created = await warrantyCaseService.createWarrantyCase(input);
            setCases(prev => [created, ...prev]);
            message.success('Đã tạo yêu cầu bảo hành mới');
            form.resetFields();
            setAddCaseOpen(false);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tạo yêu cầu bảo hành.');
        } finally {
            setSavingCase(false);
        }
    };

    /* ─── Warranty card banner ──────────────────────────────── */

    const renderWarrantyCardBanner = () => {
        if (!warrantyCard) return null;
        const expiry = warrantyCard.expiry_date ? dayjs(warrantyCard.expiry_date) : null;
        const now = dayjs();
        const expired = expiry ? expiry.isBefore(now) : false;
        const daysLeft = expiry ? expiry.diff(now, 'day') : null;
        const almostExpired = daysLeft !== null && daysLeft <= 30 && !expired;

        return (
            <Alert
                type={expired ? 'error' : almostExpired ? 'warning' : 'success'}
                showIcon
                icon={expired ? <WarningOutlined /> : <SafetyCertificateOutlined />}
                message={`Thẻ bảo hành: ${warrantyCard.code ?? warrantyCard._id.slice(-6).toUpperCase()}`}
                description={
                    <Space wrap>
                        <Text>Bảo hành <strong>{warrantyCard.warranty_months ?? '—'} tháng</strong></Text>
                        {expiry && (
                            <Text>
                                — Hết hạn: <strong>{expiry.format('DD/MM/YYYY')}</strong>
                                {expired
                                    ? <Tag color="error" style={{ marginLeft: 8 }}>Đã hết hạn</Tag>
                                    : <Tag color={almostExpired ? 'warning' : 'success'} style={{ marginLeft: 8 }}>
                                        Còn {daysLeft} ngày
                                    </Tag>
                                }
                            </Text>
                        )}
                    </Space>
                }
                style={{ marginBottom: 20 }}
            />
        );
    };

    /* ─── Table columns ─────────────────────────────────────── */

    const columns: ColumnsType<IWarrantyCase> = [
        {
            title: 'Yêu cầu bảo hành',
            dataIndex: 'issue_title',
            key: 'issue_title',
            render: (t, r) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{t}</Text>
                    {r.issue_detail && <Text type="secondary" style={{ fontSize: 12 }}>{r.issue_detail}</Text>}
                </Space>
            ),
        },
        {
            title: 'Mức độ',
            dataIndex: 'severity',
            key: 'severity',
            width: 110,
            render: (s) => {
                const cfg = SEVERITY_CONFIG[s] ?? { label: s, color: 'default' };
                return <Tag color={cfg.color}>{cfg.label}</Tag>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (s: WarrantyCaseStatusEnum) => {
                const cfg = CASE_STATUS_CONFIG[s] ?? { label: s, color: 'default' };
                return <Badge status={cfg.color as any} text={cfg.label} />;
            },
        },
        {
            title: 'Ngày báo',
            dataIndex: 'reported_at',
            key: 'reported_at',
            width: 110,
            render: (d) => d ? dayjs(d).format('DD/MM/YYYY') : '—',
        },
        ...(isEditable ? [{
            title: '',
            key: 'actions',
            width: 160,
            render: (_: any, r: IWarrantyCase) => {
                const status = r.status ?? 'new';
                return (
                    <Space size="small">
                        {status === 'new' && (
                            <Button
                                size="small"
                                type="link"
                                onClick={() => handleCaseStatusChange(r, 'in_progress')}
                            >
                                Tiếp nhận xử lý
                            </Button>
                        )}
                        {status === 'in_progress' && (
                            <Popconfirm
                                title="Xác nhận đã xử lý xong yêu cầu bảo hành?"
                                onConfirm={() => handleCaseStatusChange(r, 'resolved')}
                            >
                                <Button size="small" type="link" style={{ color: '#52c41a' }}>
                                    Đánh dấu đã xử lý
                                </Button>
                            </Popconfirm>
                        )}
                        {status === 'resolved' && (
                            <Popconfirm
                                title="Đóng yêu cầu bảo hành này?"
                                onConfirm={() => handleCaseStatusChange(r, 'closed')}
                            >
                                <Button size="small" type="link" danger>Đóng</Button>
                            </Popconfirm>
                        )}
                    </Space>
                );
            },
        }] : []),
    ];

    /* ─── Render ─────────────────────────────────────────────── */

    const openCaseCount = cases.filter(c => !['resolved', 'closed'].includes(c.status ?? '')).length;

    return (
        <Card
            title={
                <Space>
                    <SafetyOutlined />
                    <span>Bảo hành / Sửa chữa</span>
                    {openCaseCount > 0 && <Badge count={openCaseCount} />}
                </Space>
            }
            variant="borderless"
            className="ky-card"
            extra={isEditable && (
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} size="small" />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setAddCaseOpen(true)}
                        size="small"
                    >
                        Ghi nhận bảo hành
                    </Button>
                </Space>
            )}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
            ) : (
                <>
                    {renderWarrantyCardBanner()}

                    {!warrantyCard && (
                        <Alert
                            type="warning"
                            showIcon
                            message="Chưa có thẻ bảo hành"
                            description="Thẻ bảo hành sẽ được tạo tự động khi hoàn tất nghiệm thu. Kiểm tra lại bước nghiệm thu."
                            style={{ marginBottom: 20 }}
                        />
                    )}

                    {cases.length === 0 ? (
                        <Result
                            status="info"
                            icon={<SafetyOutlined />}
                            title="Chưa ghi nhận yêu cầu bảo hành"
                            subTitle="Khách hàng liên hệ hotline hoặc trực tiếp để ghi nhận yêu cầu bảo hành."
                            extra={isEditable && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddCaseOpen(true)}>
                                    Ghi nhận bảo hành
                                </Button>
                            )}
                        />
                    ) : (
                        <Table
                            dataSource={cases}
                            columns={columns}
                            rowKey="_id"
                            size="small"
                            pagination={cases.length > 10 ? { pageSize: 10 } : false}
                        />
                    )}
                </>
            )}

            {/* Modal: Ghi nhận yêu cầu bảo hành */}
            <Modal
                open={addCaseOpen}
                title={<Space><SafetyOutlined /><span>Ghi nhận yêu cầu bảo hành</span></Space>}
                onCancel={() => { form.resetFields(); setAddCaseOpen(false); }}
                footer={null}
                width={480}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateCase}
                    initialValues={{ severity: 'medium', reported_at: dayjs() }}
                >
                    <Form.Item
                        label="Nội dung yêu cầu"
                        name="issue_title"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung yêu cầu' }]}
                    >
                        <Input placeholder="Mô tả ngắn vấn đề cần bảo hành..." />
                    </Form.Item>
                    <Form.Item label="Mức độ ưu tiên" name="severity" rules={[{ required: true }]}>
                        <Select
                            options={Object.entries(SEVERITY_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))}
                        />
                    </Form.Item>
                    <Form.Item label="Chi tiết vấn đề" name="issue_detail">
                        <TextArea rows={3} placeholder="Mô tả chi tiết tình trạng, vị trí phát sinh..." />
                    </Form.Item>
                    <Form.Item label="Ngày nhận yêu cầu" name="reported_at" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => { form.resetFields(); setAddCaseOpen(false); }}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={savingCase}>
                                Tạo yêu cầu bảo hành
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
};

export default Step12Warranty;
