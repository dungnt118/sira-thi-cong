import React, { useCallback, useEffect, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Col,
    Divider,
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
    BellOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { warrantyVisitService } from '../../../services/core-contracts/services/warrantyVisit.service';
import { warrantyReminderService } from '../../../services/core-contracts/services/warrantyReminder.service';
import {
    IWarrantyVisit,
    WarrantyVisitVisitStatusEnum,
} from '../../../services/core-contracts/types/warrantyVisit.types';
import {
    IWarrantyReminder,
    WarrantyReminderStatusEnum,
} from '../../../services/core-contracts/types/warrantyReminder.types';
import { buildFilter } from '@/utils/filterBuilder';

const { Text, Title } = Typography;

/* ─── Helpers ─────────────────────────────────────────────────── */

const formatDate = (d?: string | Date) => d ? dayjs(d).format('DD/MM/YYYY') : '—';

const isOverdue = (d?: string | Date) =>
    d ? dayjs(d).isBefore(dayjs(), 'day') : false;

const VISIT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    scheduled: { label: 'Đã lên lịch', color: 'blue' },
    in_progress: { label: 'Đang thực hiện', color: 'processing' },
    completed: { label: 'Hoàn thành', color: 'success' },
    rescheduled: { label: 'Dời lịch', color: 'warning' },
    cancelled: { label: 'Đã hủy', color: 'default' },
};

const REMINDER_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ gửi', color: 'default' },
    sent: { label: 'Đã gửi', color: 'success' },
    failed: { label: 'Thất bại', color: 'error' },
};

const CHANNEL_LABELS: Record<string, string> = {
    sms: 'SMS',
    zalo: 'Zalo',
};

/* ─── Component ──────────────────────────────────────────────── */

const WarrantySchedule: React.FC = () => {
    const [visits, setVisits] = useState<IWarrantyVisit[]>([]);
    const [reminders, setReminders] = useState<IWarrantyReminder[]>([]);
    const [loading, setLoading] = useState(false);
    const [visitStatusFilter, setVisitStatusFilter] = useState<string>('all');
    const [reminderStatusFilter, setReminderStatusFilter] = useState<string>('all');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [visitsRes, remindersRes] = await Promise.all([
                warrantyVisitService.queryWarrantyVisitsDto(buildFilter({
                    sortBy: [{ id: 'scheduled_at', desc: false }],
                    limit: 100,
                })),
                warrantyReminderService.queryWarrantyRemindersDto(buildFilter({
                    sortBy: [{ id: 'scheduled_at', desc: false }],
                    limit: 100,
                })),
            ]);
            setVisits(visitsRes?.data || []);
            setReminders(remindersRes?.data || []);
        } catch {
            message.error('Không thể tải lịch bảo hành.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Filtered data ─────────────────────────────────────── */

    const filteredVisits = visits.filter(v =>
        visitStatusFilter === 'all' || v.visit_status === visitStatusFilter
    );

    const filteredReminders = reminders.filter(r =>
        reminderStatusFilter === 'all' || r.status === reminderStatusFilter
    );

    /* ─── Table columns ─────────────────────────────────────── */

    const visitColumns: ColumnsType<IWarrantyVisit> = [
        {
            title: 'Lịch hẹn',
            dataIndex: 'scheduled_at',
            key: 'scheduled_at',
            width: 110,
            render: (d, r) => {
                const overdue = isOverdue(d) && r.visit_status !== 'completed';
                return (
                    <Text style={{ color: overdue ? '#cf1322' : undefined }}>
                        {formatDate(d)}
                        {overdue && <Tag color="error" style={{ marginLeft: 4, fontSize: 10 }}>Trễ</Tag>}
                    </Text>
                );
            },
        },
        {
            title: 'Công trình',
            key: 'journey',
            render: (_, r) => (
                <Text>{(r as any).idx_journey_id?.name ?? r.journey_id ?? '—'}</Text>
            ),
        },
        {
            title: 'Nội dung',
            key: 'note',
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    {r.work_summary && <Text>{r.work_summary}</Text>}
                    {r.note && <Text type="secondary" style={{ fontSize: 12 }}>{r.note}</Text>}
                    {!r.work_summary && !r.note && <Text type="secondary">—</Text>}
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'visit_status',
            key: 'visit_status',
            width: 140,
            render: (s: WarrantyVisitVisitStatusEnum) => {
                const cfg = VISIT_STATUS_CONFIG[s] ?? { label: s, color: 'default' };
                return <Badge status={cfg.color as any} text={cfg.label} />;
            },
        },
        {
            title: 'Kết quả',
            dataIndex: 'result',
            key: 'result',
            width: 120,
            render: (r) => r
                ? <Tag>{r === 'fixed' ? 'Đã sửa' : r === 'follow_up_required' ? 'Cần theo dõi' : r}</Tag>
                : '—',
        },
    ];

    const reminderColumns: ColumnsType<IWarrantyReminder> = [
        {
            title: 'Ngày gửi dự kiến',
            dataIndex: 'scheduled_at',
            key: 'scheduled_at',
            width: 130,
            render: (d, r) => {
                const overdue = isOverdue(d) && r.status === 'pending';
                return (
                    <Text style={{ color: overdue ? '#cf1322' : undefined }}>
                        {formatDate(d)}
                        {overdue && <Tag color="error" style={{ marginLeft: 4, fontSize: 10 }}>Trễ</Tag>}
                    </Text>
                );
            },
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.customer_name ?? '—'}</Text>
                    {r.customer_phone && <Text type="secondary" style={{ fontSize: 12 }}>{r.customer_phone}</Text>}
                </Space>
            ),
        },
        {
            title: 'Công trình',
            dataIndex: 'journey_name',
            key: 'journey_name',
            render: (n) => <Text>{n ?? '—'}</Text>,
        },
        {
            title: 'Kênh',
            dataIndex: 'channel',
            key: 'channel',
            width: 80,
            render: (c) => <Tag>{CHANNEL_LABELS[c] ?? c ?? '—'}</Tag>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 110,
            render: (s: WarrantyReminderStatusEnum) => {
                const cfg = REMINDER_STATUS_CONFIG[s] ?? { label: s, color: 'default' };
                return <Badge status={cfg.color as any} text={cfg.label} />;
            },
        },
    ];

    /* ─── Upcoming timeline ─────────────────────────────────── */

    const upcomingVisits = visits
        .filter(v => !isOverdue(v.scheduled_at) && !['completed', 'cancelled'].includes(v.visit_status ?? ''))
        .slice(0, 5);

    const upcomingReminders = reminders
        .filter(r => !isOverdue(r.scheduled_at) && r.status === 'pending')
        .slice(0, 5);

    /* ─── Counts ─────────────────────────────────────────────── */

    const overdueVisitCount = visits.filter(v =>
        isOverdue(v.scheduled_at) && !['completed', 'cancelled'].includes(v.visit_status ?? '')
    ).length;

    const overdueReminderCount = reminders.filter(r =>
        isOverdue(r.scheduled_at) && r.status === 'pending'
    ).length;

    /* ─── Render ─────────────────────────────────────────────── */

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                    <CalendarOutlined /> Lịch Bảo hành & Nhắc nhở
                </Title>
                <Tooltip title="Làm mới">
                    <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
                </Tooltip>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>
            ) : (
                <Row gutter={[16, 16]}>
                    {/* Upcoming summary */}
                    {(upcomingVisits.length > 0 || upcomingReminders.length > 0) && (
                        <Col xs={24} lg={8}>
                            <Card
                                title={
                                    <Space>
                                        <CalendarOutlined />
                                        <span>Sắp tới</span>
                                    </Space>
                                }
                                size="small"
                            >
                                {upcomingVisits.length > 0 && (
                                    <>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Lịch bảo trì / bảo hành</Text>
                                        <Timeline style={{ marginTop: 8 }}>
                                            {upcomingVisits.map(v => (
                                                <Timeline.Item
                                                    key={v._id}
                                                    color="blue"
                                                    dot={<CheckCircleOutlined />}
                                                >
                                                    <Text>{formatDate(v.scheduled_at)}</Text>
                                                    <br />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {(v as any).idx_journey_id?.name ?? v.journey_id ?? ''}
                                                        {v.note ? ` — ${v.note}` : ''}
                                                    </Text>
                                                </Timeline.Item>
                                            ))}
                                        </Timeline>
                                    </>
                                )}

                                {upcomingReminders.length > 0 && (
                                    <>
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Text type="secondary" style={{ fontSize: 12 }}>Nhắc nhở khách hàng</Text>
                                        <Timeline style={{ marginTop: 8 }}>
                                            {upcomingReminders.map(r => (
                                                <Timeline.Item
                                                    key={r._id}
                                                    color="orange"
                                                    dot={<BellOutlined />}
                                                >
                                                    <Text>{formatDate(r.scheduled_at)}</Text>
                                                    <br />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {r.customer_name ?? ''} — {CHANNEL_LABELS[r.channel ?? ''] ?? r.channel ?? ''}
                                                    </Text>
                                                </Timeline.Item>
                                            ))}
                                        </Timeline>
                                    </>
                                )}
                            </Card>
                        </Col>
                    )}

                    <Col xs={24} lg={upcomingVisits.length > 0 || upcomingReminders.length > 0 ? 16 : 24}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {/* Visits table */}
                            <Card
                                title={
                                    <Space>
                                        <CalendarOutlined />
                                        <span>Lịch Thực hiện Bảo trì / Bảo hành</span>
                                        {overdueVisitCount > 0 && (
                                            <Tag color="error">{overdueVisitCount} trễ hạn</Tag>
                                        )}
                                    </Space>
                                }
                                size="small"
                                extra={
                                    <Select
                                        value={visitStatusFilter}
                                        onChange={setVisitStatusFilter}
                                        style={{ width: 140 }}
                                        options={[
                                            { value: 'all', label: 'Tất cả' },
                                            { value: 'scheduled', label: 'Đã lên lịch' },
                                            { value: 'in_progress', label: 'Đang thực hiện' },
                                            { value: 'completed', label: 'Hoàn thành' },
                                            { value: 'rescheduled', label: 'Dời lịch' },
                                        ]}
                                    />
                                }
                            >
                                <Table
                                    dataSource={filteredVisits}
                                    columns={visitColumns}
                                    rowKey="_id"
                                    size="small"
                                    pagination={{ pageSize: 10, showTotal: (t) => `${t} lịch` }}
                                    locale={{ emptyText: 'Chưa có lịch bảo trì / bảo hành.' }}
                                />
                            </Card>

                            {/* Reminders table */}
                            <Card
                                title={
                                    <Space>
                                        <BellOutlined />
                                        <span>Nhắc nhở Khách hàng</span>
                                        {overdueReminderCount > 0 && (
                                            <Tag color="warning">{overdueReminderCount} chưa gửi</Tag>
                                        )}
                                    </Space>
                                }
                                size="small"
                                extra={
                                    <Select
                                        value={reminderStatusFilter}
                                        onChange={setReminderStatusFilter}
                                        style={{ width: 120 }}
                                        options={[
                                            { value: 'all', label: 'Tất cả' },
                                            { value: 'pending', label: 'Chờ gửi' },
                                            { value: 'sent', label: 'Đã gửi' },
                                            { value: 'failed', label: 'Thất bại' },
                                        ]}
                                    />
                                }
                            >
                                <Table
                                    dataSource={filteredReminders}
                                    columns={reminderColumns}
                                    rowKey="_id"
                                    size="small"
                                    pagination={{ pageSize: 10, showTotal: (t) => `${t} nhắc nhở` }}
                                    locale={{ emptyText: 'Chưa có lịch nhắc nhở.' }}
                                />
                            </Card>
                        </Space>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default WarrantySchedule;
