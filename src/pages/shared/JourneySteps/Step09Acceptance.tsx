import React, { useEffect, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    DatePicker,
    Descriptions,
    Divider,
    Form,
    Input,
    Modal,
    Popconfirm,
    Result,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    CheckCircleFilled,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    ReloadOutlined,
    SafetyCertificateOutlined,
    SaveOutlined,
    ToolOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { handoverAcceptanceService } from '../../../services/core-contracts/services/handoverAcceptance.service';
import { handoverIssueService } from '../../../services/core-contracts/services/handoverIssue.service';
import { warrantyCardService } from '../../../services/core-contracts/services/warrantyCard.service';
import { workTaskService } from '../../../services/core-contracts/services/workTask.service';
import {
    HandoverAcceptanceAcceptanceStatusEnum,
    ICreateHandoverAcceptanceInput,
    IHandoverAcceptance,
} from '../../../services/core-contracts/types/handoverAcceptance.types';
import {
    HandoverIssueSeverityEnum2,
    HandoverIssueStatusEnum,
    ICreateHandoverIssueInput,
    IHandoverIssue,
} from '../../../services/core-contracts/types/handoverIssue.types';
import { IWorkTask } from '../../../services/core-contracts/types/workTask.types';
import { buildFilter } from '@/utils/filterBuilder';

const { Text, Title } = Typography;
const { TextArea } = Input;

/**
 * W3-02 (Wave 3 — gap-analysis 2026-05-08, UX-J360-07):
 * Step09Acceptance — Số hoá Nghiệm thu & Bàn giao.
 *
 * - Fetch HandoverAcceptance cho journey.
 * - Cập nhật acceptance_status: draft → partially_accepted | accepted | rework_required.
 * - Khi status = 'accepted' → tự động tạo WarrantyCard (FE-driven, idempotent check).
 * - Ghi nhận HandoverIssue (tồn đọng bàn giao) với phân loại + severity.
 */

const ACCEPTANCE_STATUS_CONFIG: Record<HandoverAcceptanceAcceptanceStatusEnum, { label: string; color: string }> = {
    draft: { label: 'Nháp', color: 'default' },
    partially_accepted: { label: 'Nghiệm thu có điều kiện', color: 'warning' },
    accepted: { label: 'Đã nghiệm thu', color: 'success' },
    rework_required: { label: 'Cần xử lý lại', color: 'error' },
};

const ISSUE_CATEGORY_LABELS: Record<string, string> = {
    quality: 'Chất lượng hoàn thiện',
    material: 'Vật tư / Thiết bị',
    cleaning: 'Vệ sinh / Hoàn trả mặt bằng',
    document: 'Hồ sơ / Tài liệu',
    other: 'Khác',
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'default' },
    medium: { label: 'Trung bình', color: 'warning' },
    high: { label: 'Cao', color: 'orange' },
    critical: { label: 'Khẩn cấp', color: 'error' },
};

const ISSUE_STATUS_CONFIG: Record<HandoverIssueStatusEnum, { label: string; color: string }> = {
    open: { label: 'Mới ghi nhận', color: 'processing' },
    assigned: { label: 'Đã phân công', color: 'blue' },
    in_progress: { label: 'Đang xử lý', color: 'warning' },
    awaiting_confirmation: { label: 'Chờ xác nhận đóng', color: 'purple' },
    resolved: { label: 'Đã xử lý', color: 'success' },
    closed: { label: 'Đã đóng', color: 'default' },
};

const formatDate = (val: string | Date | undefined): string => {
    if (!val) return '—';
    const d = typeof val === 'string' ? new Date(val) : val;
    return Number.isNaN(d.getTime()) ? String(val) : d.toLocaleDateString('vi-VN');
};

export interface Step09AcceptanceProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step09Acceptance: React.FC<Step09AcceptanceProps> = ({
    journeyId,
    isEditable = false,
    onSave,
}) => {
    const [acceptance, setAcceptance] = useState<IHandoverAcceptance | null>(null);
    const [issues, setIssues] = useState<IHandoverIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingStatus, setSavingStatus] = useState(false);

    // Create acceptance modal
    const [createAcceptanceOpen, setCreateAcceptanceOpen] = useState(false);
    const [createAcceptanceForm] = Form.useForm();
    const [creatingAcceptance, setCreatingAcceptance] = useState(false);

    // Add issue modal
    const [addIssueOpen, setAddIssueOpen] = useState(false);
    const [addIssueForm] = Form.useForm();
    const [addingIssue, setAddingIssue] = useState(false);

    // WarrantyCard auto-create
    const [warrantyCard, setWarrantyCard] = useState<any>(null);
    const [creatingWarranty, setCreatingWarranty] = useState(false);

    // UX-01 (Wave 3.5) — block status='accepted' until all required WorkTasks for
    // step 'final_acceptance' are finished (biên bản, ảnh thực tế, …).
    const [stepWorkTasks, setStepWorkTasks] = useState<IWorkTask[]>([]);

    const fetchAcceptance = async () => {
        if (!journeyId) { setLoading(false); return; }
        setLoading(true);
        setError(null);
        try {
            const res = await handoverAcceptanceService.queryHandoverAcceptancesDto(buildFilter({
                where: { id: 'journey_id', value: journeyId },
                sortBy: [{ id: 'createdAt', desc: true }],
                limit: 10,
            }));
            const list: IHandoverAcceptance[] = res?.data || [];
            const latest = list[0] ?? null;
            setAcceptance(latest);
            if (latest?._id) {
                void fetchIssues(latest._id);
            }
        } catch (e: any) {
            setError(e?.message || 'Không tải được biên bản nghiệm thu.');
        } finally {
            setLoading(false);
        }
    };

    const fetchIssues = async (acceptanceId: string) => {
        try {
            const res = await handoverIssueService.queryHandoverIssuesDto(buildFilter({
                where: { id: 'handover_acceptance_id', value: acceptanceId },
                sortBy: [{ id: 'createdAt', desc: false }],
                limit: 100,
            }));
            setIssues(res?.data || []);
        } catch {
            setIssues([]);
        }
    };

    const fetchWarrantyCard = async () => {
        try {
            const res = await warrantyCardService.queryWarrantyCardsDto(buildFilter({
                where: { id: 'journey_id', value: journeyId },
                limit: 1,
            }));
            setWarrantyCard((res?.data || [])[0] ?? null);
        } catch {
            setWarrantyCard(null);
        }
    };

    // UX-01 (Wave 3.5) — fetch WorkTask của step `final_acceptance` để validate gating.
    const fetchStepWorkTasks = async () => {
        if (!journeyId) return;
        try {
            const res = await workTaskService.queryWorkTasksDto(buildFilter({
                where: [
                    { id: 'journey_id', value: journeyId },
                    { id: 'journey_step_code', value: 'final_acceptance' },
                ],
                limit: 100,
            }));
            setStepWorkTasks(res?.data || []);
        } catch {
            setStepWorkTasks([]);
        }
    };

    useEffect(() => {
        void fetchAcceptance();
        void fetchWarrantyCard();
        void fetchStepWorkTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journeyId]);

    /**
     * UX-01 (Wave 3.5) — Validation gate trước khi chấp nhận nghiệm thu.
     * Block status='accepted' nếu:
     *   1. Còn WorkTask `is_required && status !== 'finished'` cho step `final_acceptance`.
     *   2. Còn HandoverIssue ở severity 'critical' chưa đóng.
     */
    const validateAcceptedTransition = (): { allowed: boolean; blockers: string[] } => {
        const blockers: string[] = [];

        const requiredUnfinished = stepWorkTasks.filter(
            t => t.is_required && t.status !== 'finished',
        );
        requiredUnfinished.forEach(t => {
            blockers.push(`Việc bắt buộc chưa hoàn thành: ${t.title || '(không tên)'}`);
        });

        const criticalOpen = issues.filter(
            i => i.severity === 'critical' && !['resolved', 'closed'].includes(i.status ?? ''),
        );
        criticalOpen.forEach(i => {
            blockers.push(`Tồn đọng nghiêm trọng chưa xử lý: ${i.issue_title || '(không tiêu đề)'}`);
        });

        return { allowed: blockers.length === 0, blockers };
    };

    const handleStatusChange = async (next: HandoverAcceptanceAcceptanceStatusEnum) => {
        if (!acceptance?._id) return;

        // UX-01 (Wave 3.5) — Gate validation cho status='accepted'.
        if (next === 'accepted') {
            const { allowed, blockers } = validateAcceptedTransition();
            if (!allowed) {
                Modal.warning({
                    title: 'Chưa thể chấp nhận nghiệm thu',
                    content: (
                        <div>
                            <p>Vui lòng hoàn thành các điều kiện sau trước khi đánh dấu đã nghiệm thu:</p>
                            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                                {blockers.map((b, idx) => <li key={idx}>{b}</li>)}
                            </ul>
                            <p style={{ marginTop: 12, fontSize: 12, color: '#8c8c8c' }}>
                                Đảm bảo Biên bản nghiệm thu, ảnh hiện trường và xử lý mọi tồn đọng nghiêm trọng được ghi nhận đầy đủ.
                            </p>
                        </div>
                    ),
                    okText: 'Đã hiểu',
                });
                return;
            }
        }

        setSavingStatus(true);
        try {
            const updated = await handoverAcceptanceService.updateHandoverAcceptance(acceptance._id, {
                acceptance_status: next,
            });
            setAcceptance(updated);
            message.success('Đã cập nhật trạng thái nghiệm thu.');
            if (onSave) onSave({ id: acceptance._id, acceptance_status: next });

            // Auto-create WarrantyCard when accepted
            if (next === 'accepted' && !warrantyCard) {
                void autoCreateWarrantyCard(acceptance);
            }
        } catch (e: any) {
            message.error(e?.message || 'Không cập nhật được trạng thái.');
        } finally {
            setSavingStatus(false);
        }
    };

    const autoCreateWarrantyCard = async (acc: IHandoverAcceptance) => {
        setCreatingWarranty(true);
        try {
            const completedDate = acc.handover_date
                ? typeof acc.handover_date === 'string'
                    ? acc.handover_date
                    : acc.handover_date.toISOString()
                : new Date().toISOString();
            const expiryDate = new Date(completedDate);
            expiryDate.setMonth(expiryDate.getMonth() + 12);
            const card = await warrantyCardService.createWarrantyCard({
                journey_id: journeyId,
                journey_step_code: 'warranty',
                completed_date: completedDate,
                warranty_months: 12,
                expiry_date: expiryDate.toISOString(),
                issued_at: new Date().toISOString(),
            });
            setWarrantyCard(card);
            message.success('Thẻ bảo hành đã được tạo tự động!');
        } catch (e: any) {
            message.warning(`Không tự tạo được thẻ bảo hành: ${e?.message || ''}. Vui lòng tạo thủ công tại trang Bảo hành KT.`);
        } finally {
            setCreatingWarranty(false);
        }
    };

    const handleCreateAcceptance = async (values: any) => {
        setCreatingAcceptance(true);
        try {
            const input: ICreateHandoverAcceptanceInput = {
                journey_id: journeyId,
                journey_step_code: 'final_acceptance',
                handover_date: values.handover_date?.toISOString() ?? new Date().toISOString(),
                acceptance_status: 'draft',
                accepted_by_customer: values.accepted_by_customer,
                acceptance_note: values.acceptance_note,
            };
            const created = await handoverAcceptanceService.createHandoverAcceptance(input);
            setAcceptance(created);
            message.success('Đã tạo biên bản nghiệm thu.');
            setCreateAcceptanceOpen(false);
            createAcceptanceForm.resetFields();
            if (onSave) onSave(created);
        } catch (e: any) {
            message.error(e?.message || 'Không tạo được biên bản nghiệm thu.');
        } finally {
            setCreatingAcceptance(false);
        }
    };

    const handleAddIssue = async (values: any) => {
        if (!acceptance?._id) return;
        setAddingIssue(true);
        try {
            const input: ICreateHandoverIssueInput = {
                journey_id: journeyId,
                handover_acceptance_id: acceptance._id,
                journey_step_code: 'final_acceptance',
                issue_title: values.issue_title,
                issue_category: values.issue_category,
                severity: values.severity,
                status: 'open',
                issue_detail: values.issue_detail,
                due_date: values.due_date?.toISOString(),
            };
            const created = await handoverIssueService.createHandoverIssue(input);
            setIssues((prev) => [...prev, created]);
            message.success('Đã ghi nhận tồn đọng.');
            setAddIssueOpen(false);
            addIssueForm.resetFields();
        } catch (e: any) {
            message.error(e?.message || 'Không ghi nhận được tồn đọng.');
        } finally {
            setAddingIssue(false);
        }
    };

    const handleIssueStatusChange = async (issue: IHandoverIssue, next: HandoverIssueStatusEnum) => {
        if (!issue._id) return;
        try {
            await handoverIssueService.updateHandoverIssue(issue._id, { status: next });
            setIssues((prev) => prev.map((i) => (i._id === issue._id ? { ...i, status: next } : i)));
        } catch (e: any) {
            message.error(e?.message || 'Không cập nhật được trạng thái tồn đọng.');
        }
    };

    const issueColumns = [
        {
            title: 'Tồn đọng',
            dataIndex: 'issue_title',
            key: 'issue_title',
            render: (v: string, r: IHandoverIssue) => (
                <Space direction="vertical" size={2}>
                    <Text strong style={{ fontSize: 13 }}>{v || '(chưa đặt tên)'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{r.issue_detail?.slice(0, 60) ?? '—'}</Text>
                </Space>
            ),
        },
        {
            title: 'Nhóm',
            dataIndex: 'issue_category',
            key: 'issue_category',
            width: 160,
            render: (v: string) => <Text style={{ fontSize: 12 }}>{ISSUE_CATEGORY_LABELS[v] ?? v}</Text>,
        },
        {
            title: 'Mức độ',
            dataIndex: 'severity',
            key: 'severity',
            width: 110,
            render: (v: string) => {
                const cfg = SEVERITY_CONFIG[v] ?? { label: v, color: 'default' };
                return <Tag color={cfg.color} style={{ fontSize: 11 }}>{cfg.label}</Tag>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (v: HandoverIssueStatusEnum, r: IHandoverIssue) => {
                const cfg = ISSUE_STATUS_CONFIG[v] ?? { label: v, color: 'default' };
                if (!isEditable) return <Tag color={cfg.color} style={{ fontSize: 11 }}>{cfg.label}</Tag>;
                const nextMap: Partial<Record<HandoverIssueStatusEnum, HandoverIssueStatusEnum>> = {
                    open: 'in_progress',
                    in_progress: 'resolved',
                    resolved: 'closed',
                };
                const next = nextMap[v];
                return (
                    <Space size={4} wrap>
                        <Tag color={cfg.color} style={{ fontSize: 11 }}>{cfg.label}</Tag>
                        {next && (
                            <Button
                                size="small"
                                type="link"
                                style={{ padding: 0, fontSize: 11 }}
                                onClick={() => void handleIssueStatusChange(r, next)}
                            >
                                → {ISSUE_STATUS_CONFIG[next]?.label}
                            </Button>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Hạn',
            dataIndex: 'due_date',
            key: 'due_date',
            width: 100,
            render: (v: string | Date | undefined) => (
                <Text style={{ fontSize: 12 }}>{formatDate(v)}</Text>
            ),
        },
    ];

    if (loading) {
        return (
            <Card variant="borderless" className="ky-card" title="Nghiệm thu / Bàn giao">
                <div style={{ textAlign: 'center', padding: 48 }}>
                    <Spin tip="Đang tải biên bản nghiệm thu..." />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card variant="borderless" className="ky-card" title="Nghiệm thu / Bàn giao">
                <Alert type="error" showIcon message="Không tải được dữ liệu" description={error} />
            </Card>
        );
    }

    const statusCfg = acceptance
        ? ACCEPTANCE_STATUS_CONFIG[acceptance.acceptance_status ?? 'draft']
        : null;

    const openIssueCount = issues.filter((i) => !['resolved', 'closed'].includes(i.status ?? '')).length;

    return (
        <>
            <Card
                variant="borderless"
                className="ky-card"
                title={
                    <Space>
                        <SafetyCertificateOutlined />
                        Nghiệm thu / Bàn giao
                        {acceptance && (
                            <Tag color={statusCfg?.color}>{statusCfg?.label}</Tag>
                        )}
                        {openIssueCount > 0 && (
                            <Badge count={`${openIssueCount} tồn đọng`} style={{ backgroundColor: '#f97316' }} />
                        )}
                    </Space>
                }
                extra={
                    <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={() => { void fetchAcceptance(); void fetchWarrantyCard(); }}
                    >
                        Tải lại
                    </Button>
                }
            >
                {!isEditable && (
                    <Alert
                        type="info"
                        style={{ marginBottom: 12 }}
                        message="Bạn đang ở chế độ Chỉ đọc."
                        showIcon
                    />
                )}

                {/* No acceptance yet */}
                {!acceptance && (
                    <Result
                        status="info"
                        icon={<SafetyCertificateOutlined style={{ color: '#9CA3AF' }} />}
                        title="Chưa có biên bản nghiệm thu"
                        subTitle="Khi thi công hoàn thành, PM / GS tạo biên bản nghiệm thu bàn giao."
                        extra={
                            isEditable && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setCreateAcceptanceOpen(true)}
                                >
                                    Tạo biên bản nghiệm thu
                                </Button>
                            )
                        }
                    />
                )}

                {/* Acceptance exists */}
                {acceptance && (
                    <>
                        <Descriptions bordered column={2} size="small" style={{ marginBottom: 20 }}>
                            <Descriptions.Item label="Ngày bàn giao" span={1}>
                                {formatDate(acceptance.handover_date)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={1}>
                                {statusCfg && (
                                    <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
                                )}
                            </Descriptions.Item>
                            {acceptance.accepted_by_customer && (
                                <Descriptions.Item label="Đại diện khách hàng" span={1}>
                                    {acceptance.accepted_by_customer}
                                </Descriptions.Item>
                            )}
                            {acceptance.acceptance_note && (
                                <Descriptions.Item label="Ghi chú nghiệm thu" span={2}>
                                    {acceptance.acceptance_note}
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        {/* Status action buttons */}
                        {isEditable && acceptance.acceptance_status !== 'accepted' && (
                            <Space wrap style={{ marginBottom: 20 }}>
                                <Text type="secondary">Chuyển trạng thái:</Text>
                                {acceptance.acceptance_status !== 'partially_accepted' && (
                                    <Button
                                        icon={<ExclamationCircleOutlined />}
                                        loading={savingStatus}
                                        onClick={() => void handleStatusChange('partially_accepted')}
                                    >
                                        Nghiệm thu có điều kiện
                                    </Button>
                                )}
                                <Popconfirm
                                    title="Xác nhận nghiệm thu"
                                    description="Sau khi xác nhận, thẻ bảo hành sẽ được tạo tự động."
                                    onConfirm={() => void handleStatusChange('accepted')}
                                    okText="Xác nhận"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleFilled />}
                                        loading={savingStatus || creatingWarranty}
                                    >
                                        Xác nhận nghiệm thu
                                    </Button>
                                </Popconfirm>
                                <Button
                                    danger
                                    icon={<ToolOutlined />}
                                    loading={savingStatus}
                                    onClick={() => void handleStatusChange('rework_required')}
                                >
                                    Yêu cầu làm lại
                                </Button>
                            </Space>
                        )}

                        {/* Accepted — WarrantyCard info */}
                        {acceptance.acceptance_status === 'accepted' && (
                            <Alert
                                type="success"
                                showIcon
                                icon={<SafetyCertificateOutlined />}
                                style={{ marginBottom: 20 }}
                                message="Nghiệm thu hoàn tất"
                                description={
                                    warrantyCard ? (
                                        <Space>
                                            <Text>Thẻ bảo hành đã tạo:</Text>
                                            <Text strong>{warrantyCard.code || warrantyCard._id}</Text>
                                            <Text type="secondary">
                                                — Hạn đến: {formatDate(warrantyCard.expiry_date)}
                                            </Text>
                                        </Space>
                                    ) : (
                                        <Space>
                                            <Text>Chưa có thẻ bảo hành.</Text>
                                            {isEditable && (
                                                <Button
                                                    size="small"
                                                    loading={creatingWarranty}
                                                    onClick={() => void autoCreateWarrantyCard(acceptance)}
                                                >
                                                    Tạo thẻ bảo hành
                                                </Button>
                                            )}
                                        </Space>
                                    )
                                }
                            />
                        )}

                        {/* HandoverIssues section */}
                        <Divider orientation="left">
                            <Space>
                                <ExclamationCircleOutlined />
                                Tồn đọng bàn giao
                                {openIssueCount > 0 && <Badge count={openIssueCount} style={{ backgroundColor: '#f97316' }} />}
                            </Space>
                        </Divider>

                        {issues.length === 0 ? (
                            <Alert
                                type="success"
                                message="Không có tồn đọng — bàn giao hoàn toàn."
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        ) : (
                            <Table
                                dataSource={issues}
                                columns={issueColumns}
                                rowKey="_id"
                                size="small"
                                pagination={false}
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        {isEditable && (
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => setAddIssueOpen(true)}
                            >
                                Thêm tồn đọng
                            </Button>
                        )}
                    </>
                )}
            </Card>

            {/* Modal: Create acceptance */}
            <Modal
                open={createAcceptanceOpen}
                title={
                    <Space>
                        <SafetyCertificateOutlined />
                        Tạo biên bản nghiệm thu
                    </Space>
                }
                onCancel={() => { setCreateAcceptanceOpen(false); createAcceptanceForm.resetFields(); }}
                footer={null}
                width={560}
                destroyOnHidden
            >
                <Form
                    form={createAcceptanceForm}
                    layout="vertical"
                    onFinish={handleCreateAcceptance}
                    initialValues={{ handover_date: dayjs() }}
                >
                    <Form.Item
                        label="Ngày bàn giao"
                        name="handover_date"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bàn giao' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item label="Đại diện khách hàng" name="accepted_by_customer">
                        <Input placeholder="Họ tên đại diện khách hàng ký biên bản..." />
                    </Form.Item>
                    <Form.Item label="Ghi chú nghiệm thu" name="acceptance_note">
                        <TextArea rows={4} placeholder="Kết quả tổng quan, điều kiện nghiệm thu..." />
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => { setCreateAcceptanceOpen(false); createAcceptanceForm.resetFields(); }}>Hủy</Button>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={creatingAcceptance}>
                                Tạo biên bản
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            {/* Modal: Add issue */}
            <Modal
                open={addIssueOpen}
                title={
                    <Space>
                        <ExclamationCircleOutlined />
                        Ghi nhận tồn đọng bàn giao
                    </Space>
                }
                onCancel={() => { setAddIssueOpen(false); addIssueForm.resetFields(); }}
                footer={null}
                width={560}
                destroyOnHidden
            >
                <Form
                    form={addIssueForm}
                    layout="vertical"
                    onFinish={handleAddIssue}
                    initialValues={{ issue_category: 'quality', severity: 'medium' }}
                >
                    <Form.Item
                        label="Tiêu đề tồn đọng"
                        name="issue_title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tồn đọng' }]}
                    >
                        <Input placeholder="VD: Bong tróc sơn góc tường phòng ngủ..." />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Nhóm tồn đọng" name="issue_category">
                                <Select
                                    options={Object.entries(ISSUE_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Mức độ ưu tiên" name="severity">
                                <Select
                                    options={Object.entries(SEVERITY_CONFIG).map(([value, { label }]) => ({ value, label }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Mô tả chi tiết"
                        name="issue_detail"
                        rules={[{ required: true, message: 'Vui lòng mô tả chi tiết tồn đọng' }]}
                    >
                        <TextArea rows={3} placeholder="Mô tả vị trí, hiện trạng, hạng mục cần xử lý..." />
                    </Form.Item>
                    <Form.Item label="Hạn xử lý" name="due_date">
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => { setAddIssueOpen(false); addIssueForm.resetFields(); }}>Hủy</Button>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={addingIssue}>
                                Ghi nhận
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default Step09Acceptance;
