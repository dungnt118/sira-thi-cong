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
    Timeline,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    CalendarOutlined,
    CheckCircleOutlined,
    PlusOutlined,
    ReloadOutlined,
    ToolOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { warrantyCaseService } from '../../../services/core-contracts/services/warrantyCase.service';
import { warrantyVisitService } from '../../../services/core-contracts/services/warrantyVisit.service';
import {
    ICreateWarrantyCaseInput,
    IWarrantyCase,
    WarrantyCaseSeverityEnum2,
    WarrantyCaseStatusEnum,
    WarrantyCaseStatusEnum2,
} from '../../../services/core-contracts/types/warrantyCase.types';
import {
    ICreateWarrantyVisitInput,
    IWarrantyVisit,
    WarrantyVisitVisitStatusEnum2,
} from '../../../services/core-contracts/types/warrantyVisit.types';

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

const VISIT_STATUS_NEXT: Record<string, WarrantyVisitVisitStatusEnum2 | null> = {
    scheduled: 'in_progress',
    in_progress: 'completed',
    completed: null,
    rescheduled: 'scheduled',
    cancelled: null,
};

/* ─── Component ──────────────────────────────────────────────── */

export interface Step11MaintainProps {
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

interface VisitFormValues {
    scheduled_at: dayjs.Dayjs;
    note?: string;
}

export const Step11Maintain: React.FC<Step11MaintainProps> = ({
    journeyId,
    isEditable = false,
}) => {
    const [cases, setCases] = useState<IWarrantyCase[]>([]);
    const [visits, setVisits] = useState<IWarrantyVisit[]>([]);
    const [loading, setLoading] = useState(false);
    const [addCaseOpen, setAddCaseOpen] = useState(false);
    const [addVisitOpen, setAddVisitOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<IWarrantyCase | null>(null);
    const [savingCase, setSavingCase] = useState(false);
    const [savingVisit, setSavingVisit] = useState(false);
    const [caseForm] = Form.useForm<CaseFormValues>();
    const [visitForm] = Form.useForm<VisitFormValues>();

    /* ─── Data fetching ─────────────────────────────────────── */

    const fetchData = useCallback(async () => {
        if (!journeyId) return;
        setLoading(true);
        try {
            const [casesRes, visitsRes] = await Promise.all([
                warrantyCaseService.queryWarrantyCasesDto({
                    fields: [
                        { field: 'journey_id', op: 'eq', value: journeyId },
                        { field: 'journey_step_code', op: 'eq', value: 'maintenance' },
                    ],
                    sortFields: [{ field: 'reported_at', sortType: 'desc' }],
                    pageNumber: 1,
                    pageSize: 50,
                } as any),
                warrantyVisitService.queryWarrantyVisitsDto({
                    fields: [
                        { field: 'journey_id', op: 'eq', value: journeyId },
                        { field: 'journey_step_code', op: 'eq', value: 'maintenance' },
                    ],
                    sortFields: [{ field: 'scheduled_at', sortType: 'desc' }],
                    pageNumber: 1,
                    pageSize: 50,
                } as any),
            ]);
            setCases(casesRes?.data || []);
            setVisits(visitsRes?.data || []);
        } catch {
            message.error('Không thể tải dữ liệu bảo trì.');
        } finally {
            setLoading(false);
        }
    }, [journeyId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Handlers ──────────────────────────────────────────── */

    const handleCaseStatusChange = async (c: IWarrantyCase, next: WarrantyCaseStatusEnum2) => {
        try {
            const updated = await warrantyCaseService.updateWarrantyCase(c._id, { status: next });
            setCases(prev => prev.map(x => x._id === updated._id ? { ...x, status: next } : x));
            message.success('Đã cập nhật trạng thái sự cố');
        } catch {
            message.error('Cập nhật thất bại.');
        }
    };

    const handleCreateCase = async (values: CaseFormValues) => {
        setSavingCase(true);
        try {
            const input: ICreateWarrantyCaseInput = {
                journey_id: journeyId,
                journey_step_code: 'maintenance',
                issue_title: values.issue_title,
                severity: values.severity,
                issue_detail: values.issue_detail || undefined,
                reported_at: values.reported_at.toISOString(),
                status: 'new',
            };
            const created = await warrantyCaseService.createWarrantyCase(input);
            setCases(prev => [created, ...prev]);
            message.success('Đã tạo sự cố bảo trì mới');
            caseForm.resetFields();
            setAddCaseOpen(false);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tạo sự cố.');
        } finally {
            setSavingCase(false);
        }
    };

    const handleCreateVisit = async (values: VisitFormValues) => {
        if (!selectedCase) return;
        setSavingVisit(true);
        try {
            const input: ICreateWarrantyVisitInput = {
                journey_id: journeyId,
                journey_step_code: 'maintenance',
                warranty_case_id: selectedCase._id,
                scheduled_at: values.scheduled_at.toISOString(),
                visit_status: 'scheduled',
                note: values.note || undefined,
            };
            const created = await warrantyVisitService.createWarrantyVisit(input);
            setVisits(prev => [created, ...prev]);
            message.success('Đã lên lịch bảo trì');
            visitForm.resetFields();
            setAddVisitOpen(false);
            setSelectedCase(null);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tạo lịch.');
        } finally {
            setSavingVisit(false);
        }
    };

    const handleVisitStatusChange = async (v: IWarrantyVisit) => {
        const next = VISIT_STATUS_NEXT[v.visit_status ?? 'scheduled'];
        if (!next) return;
        try {
            const updated = await warrantyVisitService.updateWarrantyVisit(v._id, {
                visit_status: next,
                ...(next === 'completed' ? { completed_at: new Date().toISOString() } : {}),
            });
            setVisits(prev => prev.map(x => x._id === updated._id ? { ...x, visit_status: next } : x));
            message.success('Đã cập nhật lịch bảo trì');
        } catch {
            message.error('Cập nhật thất bại.');
        }
    };

    /* ─── Table columns ─────────────────────────────────────── */

    const columns: ColumnsType<IWarrantyCase> = [
        {
            title: 'Vấn đề',
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
            width: 180,
            render: (_: any, r: IWarrantyCase) => {
                const status = r.status ?? 'new';
                const visitCount = visits.filter(v => v.warranty_case_id === r._id).length;
                return (
                    <Space size="small">
                        <Tooltip title="Lên lịch bảo trì">
                            <Button
                                size="small"
                                icon={<CalendarOutlined />}
                                onClick={() => { setSelectedCase(r); setAddVisitOpen(true); }}
                            />
                        </Tooltip>
                        {status === 'new' && (
                            <Button
                                size="small"
                                type="link"
                                onClick={() => handleCaseStatusChange(r, 'in_progress')}
                            >
                                Bắt đầu xử lý
                            </Button>
                        )}
                        {status === 'in_progress' && (
                            <Popconfirm
                                title="Xác nhận đã xử lý xong?"
                                onConfirm={() => handleCaseStatusChange(r, 'resolved')}
                            >
                                <Button size="small" type="link" style={{ color: '#52c41a' }}>
                                    Đánh dấu xong
                                </Button>
                            </Popconfirm>
                        )}
                        {visitCount > 0 && (
                            <Text type="secondary" style={{ fontSize: 11 }}>{visitCount} lịch</Text>
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
                    <ToolOutlined />
                    <span>Bảo trì định kỳ</span>
                    {openCaseCount > 0 && <Badge count={openCaseCount} style={{ backgroundColor: '#fa8c16' }} />}
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
                        Ghi nhận sự cố
                    </Button>
                </Space>
            )}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
            ) : cases.length === 0 ? (
                <>
                    <Result
                        status="info"
                        icon={<ToolOutlined />}
                        title="Chưa có sự cố bảo trì"
                        subTitle="Lịch bảo trì định kỳ sẽ được hệ thống nhắc nhở. Ghi nhận sự cố khi phát sinh."
                        extra={isEditable && (
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddCaseOpen(true)}>
                                Ghi nhận sự cố
                            </Button>
                        )}
                    />
                    <Alert
                        message="Chính sách bảo trì"
                        description="BAC cam kết bảo trì định kỳ miễn phí 2 lần/năm trong 2 năm đầu tiên."
                        type="info"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                </>
            ) : (
                <>
                    <Table
                        dataSource={cases}
                        columns={columns}
                        rowKey="_id"
                        size="small"
                        pagination={cases.length > 10 ? { pageSize: 10 } : false}
                        style={{ marginBottom: 24 }}
                    />

                    {visits.length > 0 && (
                        <>
                            <Text strong style={{ display: 'block', marginBottom: 12 }}>
                                <CalendarOutlined /> Lịch sử lịch bảo trì
                            </Text>
                            <Timeline mode="left">
                                {visits.map(v => {
                                    const relatedCase = cases.find(c => c._id === v.warranty_case_id);
                                    const isCompleted = v.visit_status === 'completed';
                                    const next = VISIT_STATUS_NEXT[v.visit_status ?? 'scheduled'];
                                    return (
                                        <Timeline.Item
                                            key={v._id}
                                            color={isCompleted ? 'green' : 'blue'}
                                            label={v.scheduled_at ? dayjs(v.scheduled_at).format('DD/MM/YYYY') : ''}
                                        >
                                            <Space direction="vertical" size={2}>
                                                <Text strong>{relatedCase?.issue_title ?? 'Bảo trì'}</Text>
                                                <Tag color={isCompleted ? 'success' : 'processing'}>
                                                    {isCompleted ? 'Hoàn thành' : v.visit_status === 'in_progress' ? 'Đang thực hiện' : 'Đã lên lịch'}
                                                </Tag>
                                                {v.note && <Text type="secondary" style={{ fontSize: 12 }}>{v.note}</Text>}
                                                {isEditable && next && (
                                                    <Button
                                                        size="small"
                                                        type="link"
                                                        icon={<CheckCircleOutlined />}
                                                        onClick={() => handleVisitStatusChange(v)}
                                                    >
                                                        {next === 'in_progress' ? 'Bắt đầu' : 'Hoàn thành'}
                                                    </Button>
                                                )}
                                            </Space>
                                        </Timeline.Item>
                                    );
                                })}
                            </Timeline>
                        </>
                    )}

                    <Alert
                        message="Chính sách bảo trì"
                        description="BAC cam kết bảo trì định kỳ miễn phí 2 lần/năm trong 2 năm đầu tiên."
                        type="info"
                        showIcon
                        style={{ marginTop: 8 }}
                    />
                </>
            )}

            {/* Modal: Ghi nhận sự cố */}
            <Modal
                open={addCaseOpen}
                title={<Space><ToolOutlined /><span>Ghi nhận sự cố bảo trì</span></Space>}
                onCancel={() => { caseForm.resetFields(); setAddCaseOpen(false); }}
                footer={null}
                width={480}
                destroyOnClose
            >
                <Form
                    form={caseForm}
                    layout="vertical"
                    onFinish={handleCreateCase}
                    initialValues={{ severity: 'medium', reported_at: dayjs() }}
                >
                    <Form.Item
                        label="Tiêu đề sự cố"
                        name="issue_title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input placeholder="Mô tả ngắn sự cố cần bảo trì..." />
                    </Form.Item>
                    <Form.Item label="Mức độ" name="severity" rules={[{ required: true }]}>
                        <Select
                            options={Object.entries(SEVERITY_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))}
                        />
                    </Form.Item>
                    <Form.Item label="Chi tiết" name="issue_detail">
                        <TextArea rows={3} placeholder="Mô tả chi tiết tình trạng cần bảo trì..." />
                    </Form.Item>
                    <Form.Item label="Ngày báo cáo" name="reported_at" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => { caseForm.resetFields(); setAddCaseOpen(false); }}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={savingCase}>Tạo sự cố</Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            {/* Modal: Lên lịch bảo trì */}
            <Modal
                open={addVisitOpen}
                title={
                    <Space>
                        <CalendarOutlined />
                        <span>Lên lịch bảo trì — {selectedCase?.issue_title}</span>
                    </Space>
                }
                onCancel={() => { visitForm.resetFields(); setAddVisitOpen(false); setSelectedCase(null); }}
                footer={null}
                width={440}
                destroyOnClose
            >
                <Form
                    form={visitForm}
                    layout="vertical"
                    onFinish={handleCreateVisit}
                    initialValues={{ scheduled_at: dayjs().add(1, 'day') }}
                >
                    <Form.Item
                        label="Ngày thực hiện dự kiến"
                        name="scheduled_at"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note">
                        <TextArea rows={2} placeholder="Ghi chú công việc cần thực hiện..." />
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => { visitForm.resetFields(); setAddVisitOpen(false); }}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={savingVisit} icon={<CalendarOutlined />}>
                                Lên lịch
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
};

export default Step11Maintain;
