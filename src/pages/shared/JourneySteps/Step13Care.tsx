import React, { useCallback, useEffect, useState } from 'react';
import {
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
    Typography,
    message,
} from 'antd';
import {
    BellOutlined,
    CheckCircleOutlined,
    CustomerServiceOutlined,
    HeartOutlined,
    MessageOutlined,
    PlusOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { workTaskService } from '../../../services/core-contracts/services/workTask.service';
import { warrantyReminderService } from '../../../services/core-contracts/services/warrantyReminder.service';
import {
    ICreateWorkTaskInput,
    IWorkTask,
    WorkTaskStatusEnum2,
} from '../../../services/core-contracts/types/workTask.types';
import {
    ICreateWarrantyReminderInput,
    IWarrantyReminder,
    WarrantyReminderChannelEnum2,
} from '../../../services/core-contracts/types/warrantyReminder.types';
import { buildFilter } from '@/utils/filterBuilder';

const { TextArea } = Input;
const { Text } = Typography;

/* ─── Constants ──────────────────────────────────────────────── */

const TASK_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ thực hiện', color: 'default' },
    finished: { label: 'Hoàn thành', color: 'success' },
    skipped: { label: 'Bỏ qua', color: 'warning' },
};

const REMINDER_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ gửi', color: 'default' },
    sent: { label: 'Đã gửi', color: 'success' },
    failed: { label: 'Thất bại', color: 'error' },
};

const CHANNEL_OPTIONS = [
    { value: 'sms', label: 'SMS' },
    { value: 'zalo', label: 'Zalo' },
];

/* ─── Component ──────────────────────────────────────────────── */

export interface Step13CareProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

interface TaskFormValues {
    title: string;
    description?: string;
    due_time: dayjs.Dayjs;
}

interface ReminderFormValues {
    customer_name: string;
    customer_phone: string;
    channel: WarrantyReminderChannelEnum2;
    scheduled_at: dayjs.Dayjs;
    message?: string;
}

export const Step13Care: React.FC<Step13CareProps> = ({
    journeyId,
    isEditable = false,
}) => {
    const [tasks, setTasks] = useState<IWorkTask[]>([]);
    const [reminders, setReminders] = useState<IWarrantyReminder[]>([]);
    const [loading, setLoading] = useState(false);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [addReminderOpen, setAddReminderOpen] = useState(false);
    const [savingTask, setSavingTask] = useState(false);
    const [savingReminder, setSavingReminder] = useState(false);
    const [taskForm] = Form.useForm<TaskFormValues>();
    const [reminderForm] = Form.useForm<ReminderFormValues>();

    /* ─── Data fetching ─────────────────────────────────────── */

    const fetchData = useCallback(async () => {
        if (!journeyId) return;
        setLoading(true);
        try {
            const [tasksRes, remindersRes] = await Promise.all([
                workTaskService.queryWorkTasksDto(buildFilter({
                    where: [
                        { id: 'journey_id', value: journeyId },
                        { id: 'journey_step_code', value: 'after_sales' },
                    ],
                    sortBy: [{ id: 'due_time', desc: false }],
                    limit: 50,
                })),
                warrantyReminderService.queryWarrantyRemindersDto(buildFilter({
                    where: { id: 'journey_id', value: journeyId },
                    sortBy: [{ id: 'scheduled_at', desc: true }],
                    limit: 50,
                })),
            ]);
            setTasks(tasksRes?.data || []);
            setReminders(remindersRes?.data || []);
        } catch {
            message.error('Không thể tải dữ liệu chăm sóc khách hàng.');
        } finally {
            setLoading(false);
        }
    }, [journeyId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Handlers ──────────────────────────────────────────── */

    const handleTaskStatusChange = async (t: IWorkTask, next: WorkTaskStatusEnum2) => {
        try {
            const updated = await workTaskService.updateWorkTask(t._id, { status: next });
            setTasks(prev => prev.map(x => x._id === updated._id ? { ...x, status: next } : x));
            message.success('Đã cập nhật trạng thái hoạt động');
        } catch {
            message.error('Cập nhật thất bại.');
        }
    };

    const handleCreateTask = async (values: TaskFormValues) => {
        setSavingTask(true);
        try {
            const input: ICreateWorkTaskInput = {
                journey_id: journeyId,
                journey_step_code: 'after_sales',
                title: values.title,
                description: values.description || undefined,
                due_time: values.due_time.toISOString(),
                status: 'pending',
            };
            const created = await workTaskService.createWorkTask(input);
            setTasks(prev => [...prev, created]);
            message.success('Đã tạo hoạt động chăm sóc mới');
            taskForm.resetFields();
            setAddTaskOpen(false);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tạo hoạt động.');
        } finally {
            setSavingTask(false);
        }
    };

    const handleCreateReminder = async (values: ReminderFormValues) => {
        setSavingReminder(true);
        try {
            const input: ICreateWarrantyReminderInput = {
                journey_id: journeyId,
                journey_step_code: 'after_sales',
                customer_name: values.customer_name,
                customer_phone: values.customer_phone,
                channel: values.channel,
                scheduled_at: values.scheduled_at.toISOString(),
                status: 'pending',
                message: values.message || undefined,
            };
            const created = await warrantyReminderService.createWarrantyReminder(input);
            setReminders(prev => [created, ...prev]);
            message.success('Đã lên lịch nhắc nhở khách hàng');
            reminderForm.resetFields();
            setAddReminderOpen(false);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tạo lịch nhắc nhở.');
        } finally {
            setSavingReminder(false);
        }
    };

    /* ─── Table columns ─────────────────────────────────────── */

    const taskColumns: ColumnsType<IWorkTask> = [
        {
            title: 'Hoạt động chăm sóc',
            key: 'title',
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.title}</Text>
                    {r.description && <Text type="secondary" style={{ fontSize: 12 }}>{r.description}</Text>}
                </Space>
            ),
        },
        {
            title: 'Hạn',
            dataIndex: 'due_time',
            key: 'due_time',
            width: 110,
            render: (d) => {
                if (!d) return '—';
                const overdue = dayjs(d).isBefore(dayjs()) && true;
                return (
                    <Text style={{ color: overdue ? '#cf1322' : undefined }}>
                        {dayjs(d).format('DD/MM/YYYY')}
                    </Text>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (s) => {
                const cfg = TASK_STATUS_CONFIG[s] ?? { label: s, color: 'default' };
                return <Badge status={cfg.color as any} text={cfg.label} />;
            },
        },
        ...(isEditable ? [{
            title: '',
            key: 'actions',
            width: 140,
            render: (_: any, r: IWorkTask) => {
                const status = r.status ?? 'pending';
                return (
                    <Space size="small">
                        {status === 'pending' && (
                            <Popconfirm
                                title="Đánh dấu đã hoàn thành hoạt động này?"
                                onConfirm={() => handleTaskStatusChange(r, 'finished')}
                            >
                                <Button size="small" type="link" icon={<CheckCircleOutlined />} style={{ color: '#52c41a' }}>
                                    Xong
                                </Button>
                            </Popconfirm>
                        )}
                        {status === 'pending' && (
                            <Button
                                size="small"
                                type="link"
                                danger
                                onClick={() => handleTaskStatusChange(r, 'skipped')}
                            >
                                Bỏ qua
                            </Button>
                        )}
                    </Space>
                );
            },
        }] : []),
    ];

    /* ─── Reminder timeline ─────────────────────────────────── */

    const renderReminderTimeline = () => {
        if (reminders.length === 0) return null;
        return (
            <>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>
                    <BellOutlined /> Lịch nhắc nhở khách hàng
                </Text>
                <Timeline mode="left">
                    {reminders.map(r => {
                        const cfg = REMINDER_STATUS_CONFIG[r.status ?? 'pending'];
                        return (
                            <Timeline.Item
                                key={r._id}
                                color={r.status === 'sent' ? 'green' : r.status === 'failed' ? 'red' : 'blue'}
                                label={r.scheduled_at ? dayjs(r.scheduled_at).format('DD/MM/YYYY') : ''}
                            >
                                <Space direction="vertical" size={2}>
                                    <Space>
                                        <Tag>{r.channel === 'zalo' ? 'Zalo' : 'SMS'}</Tag>
                                        <Badge status={cfg.color as any} text={cfg.label} />
                                    </Space>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {r.customer_name} — {r.customer_phone}
                                    </Text>
                                    {r.message && (
                                        <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>
                                            {r.message}
                                        </Text>
                                    )}
                                </Space>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </>
        );
    };

    /* ─── Render ─────────────────────────────────────────────── */

    const pendingTaskCount = tasks.filter(t => t.status === 'pending').length;

    return (
        <Card
            title={
                <Space>
                    <HeartOutlined style={{ color: '#ff4d4f' }} />
                    <span>Chăm sóc khách hàng sau bán hàng</span>
                    {pendingTaskCount > 0 && <Badge count={pendingTaskCount} style={{ backgroundColor: '#ff4d4f' }} />}
                </Space>
            }
            variant="borderless"
            className="ky-card"
            extra={isEditable && (
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} size="small" />
                    <Button
                        icon={<BellOutlined />}
                        onClick={() => setAddReminderOpen(true)}
                        size="small"
                    >
                        Nhắc nhở KH
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setAddTaskOpen(true)}
                        size="small"
                    >
                        Thêm hoạt động
                    </Button>
                </Space>
            )}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
            ) : tasks.length === 0 && reminders.length === 0 ? (
                <Result
                    status="info"
                    icon={<CustomerServiceOutlined style={{ color: '#ff4d4f' }} />}
                    title="Chưa có hoạt động chăm sóc"
                    subTitle="Ghi nhận các hoạt động chăm sóc sau bàn giao: gọi điện thăm hỏi, gửi khảo sát, lên lịch nhắc nhở..."
                    extra={isEditable && (
                        <Space>
                            <Button icon={<BellOutlined />} onClick={() => setAddReminderOpen(true)}>
                                Lên lịch nhắc nhở
                            </Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddTaskOpen(true)}>
                                Tạo hoạt động chăm sóc
                            </Button>
                        </Space>
                    )}
                />
            ) : (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {tasks.length > 0 && (
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: 12 }}>
                                <MessageOutlined /> Nhật ký chăm sóc
                            </Text>
                            <Table
                                dataSource={tasks}
                                columns={taskColumns}
                                rowKey="_id"
                                size="small"
                                pagination={tasks.length > 10 ? { pageSize: 10 } : false}
                            />
                        </div>
                    )}

                    {renderReminderTimeline()}
                </Space>
            )}

            {/* Modal: Tạo hoạt động chăm sóc */}
            <Modal
                open={addTaskOpen}
                title={<Space><MessageOutlined /><span>Thêm hoạt động chăm sóc</span></Space>}
                onCancel={() => { taskForm.resetFields(); setAddTaskOpen(false); }}
                footer={null}
                width={460}
                destroyOnClose
            >
                <Form
                    form={taskForm}
                    layout="vertical"
                    onFinish={handleCreateTask}
                    initialValues={{ due_time: dayjs().add(1, 'day') }}
                >
                    <Form.Item
                        label="Hoạt động"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề hoạt động' }]}
                    >
                        <Input placeholder="VD: Gọi điện thăm hỏi sau 1 tuần bàn giao..." />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <TextArea rows={2} placeholder="Nội dung hoặc kết quả ghi nhận..." />
                    </Form.Item>
                    <Form.Item
                        label="Ngày thực hiện"
                        name="due_time"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => { taskForm.resetFields(); setAddTaskOpen(false); }}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={savingTask}>Tạo hoạt động</Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            {/* Modal: Lên lịch nhắc nhở */}
            <Modal
                open={addReminderOpen}
                title={<Space><BellOutlined /><span>Lên lịch nhắc nhở khách hàng</span></Space>}
                onCancel={() => { reminderForm.resetFields(); setAddReminderOpen(false); }}
                footer={null}
                width={460}
                destroyOnClose
            >
                <Form
                    form={reminderForm}
                    layout="vertical"
                    onFinish={handleCreateReminder}
                    initialValues={{ channel: 'zalo', scheduled_at: dayjs().add(7, 'day') }}
                >
                    <Form.Item
                        label="Tên khách hàng"
                        name="customer_name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                    >
                        <Input placeholder="Tên khách hàng..." />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="customer_phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input placeholder="0901234567" />
                    </Form.Item>
                    <Form.Item label="Kênh gửi" name="channel" rules={[{ required: true }]}>
                        <Select options={CHANNEL_OPTIONS} />
                    </Form.Item>
                    <Form.Item
                        label="Ngày gửi dự kiến"
                        name="scheduled_at"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item label="Nội dung tin nhắn" name="message">
                        <TextArea rows={3} placeholder="Nội dung tin nhắn sẽ gửi cho khách hàng..." />
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => { reminderForm.resetFields(); setAddReminderOpen(false); }}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={savingReminder} icon={<BellOutlined />}>
                                Lên lịch nhắc nhở
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
};

export default Step13Care;
