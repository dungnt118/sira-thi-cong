import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Empty,
    List,
    Segmented,
    Space,
    Spin,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import {
    CheckCircleFilled,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    ReloadOutlined,
    UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { workTaskService } from '../../../../services/core-contracts/services/workTask.service';
import { IWorkTask, WorkTaskStatusEnum } from '../../../../services/core-contracts/types/workTask.types';
import { buildFilter } from '../../../../utils/filterBuilder';

const { Text, Title } = Typography;

/**
 * Wave 2 — W2-05. Tab "Việc của tôi" trong Journey360.
 * Hiển thị WorkTask thuộc journey hiện tại mà current user (theo username/_id hoặc role)
 * là người được giao. Sort: overdue → due_soon → in_progress → finished.
 */
export interface MyTasksTabProps {
    journeyId: string;
    currentUserId?: string;
    currentUsername?: string;
    currentRole?: string;
}

type StatusFilter = 'pending_or_overdue' | 'all' | 'finished' | 'skipped';

/** Trích danh sách identifier (username / _id) từ field assignee đa hình. */
const extractAssigneeIds = (assignee: unknown): string[] => {
    if (!assignee) return [];
    const collect = (item: unknown): string[] => {
        if (item == null || item === '') return [];
        if (typeof item === 'string' || typeof item === 'number') return [String(item).trim()];
        if (typeof item === 'object') {
            const o = item as Record<string, unknown>;
            const candidates = [o.username, o.userName, o.code, o._id, o.id];
            return candidates
                .filter((c) => c != null && c !== '')
                .map((c) => String(c).trim());
        }
        return [];
    };
    if (Array.isArray(assignee)) return assignee.flatMap(collect);
    return collect(assignee);
};

const computeUrgency = (task: IWorkTask): { level: 'overdue' | 'due_soon' | 'normal'; hoursDiff: number } => {
    if (!task.due_time) return { level: 'normal', hoursDiff: Infinity };
    const due = dayjs(task.due_time);
    const now = dayjs();
    const diff = due.diff(now, 'hour');
    if (diff < 0) return { level: 'overdue', hoursDiff: diff };
    if (diff <= 24) return { level: 'due_soon', hoursDiff: diff };
    return { level: 'normal', hoursDiff: diff };
};

const renderStatusTag = (status: WorkTaskStatusEnum | undefined): React.ReactNode => {
    switch (status) {
        case 'finished':
            return <Tag color="success" icon={<CheckCircleFilled />}>Hoàn tất</Tag>;
        case 'skipped':
            return <Tag color="default">Bỏ qua</Tag>;
        case 'pending':
        default:
            return <Tag color="processing" icon={<ClockCircleOutlined />}>Đang xử lý</Tag>;
    }
};

const formatRelative = (iso: string | Date | undefined): string => {
    if (!iso) return '—';
    const d = dayjs(iso);
    return d.fromNow ? d.fromNow() : d.format('DD/MM/YYYY HH:mm');
};

export const MyTasksTab: React.FC<MyTasksTabProps> = ({
    journeyId,
    currentUserId,
    currentUsername,
    currentRole,
}) => {
    const [tasks, setTasks] = useState<IWorkTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending_or_overdue');

    const fetchTasks = async () => {
        if (!journeyId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await workTaskService.queryWorkTasksDto(buildFilter({
                where: { id: 'journey_id', value: journeyId },
                sortBy: [{ id: 'due_time', desc: false }],
                limit: 200,
            }));
            setTasks(res?.data || []);
        } catch (e: any) {
            setError(e?.message || 'Không tải được danh sách công việc.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journeyId]);

    /** Tasks gán cho current user — qua assignee identity HOẶC assignee_role. */
    const myTasks = useMemo(() => {
        const userKeys = new Set(
            [currentUserId, currentUsername]
                .filter(Boolean)
                .map((s) => String(s).trim().toLowerCase()),
        );
        return tasks.filter((t) => {
            const assignedIds = extractAssigneeIds(t.assignee).map((s) => s.toLowerCase());
            const assigneeMatch = assignedIds.some((id) => userKeys.has(id));
            const roleMatch = currentRole && t.assignee_role === currentRole;
            return assigneeMatch || roleMatch;
        });
    }, [tasks, currentUserId, currentUsername, currentRole]);

    const filteredTasks = useMemo(() => {
        if (statusFilter === 'all') return myTasks;
        if (statusFilter === 'finished') return myTasks.filter((t) => t.status === 'finished');
        if (statusFilter === 'skipped') return myTasks.filter((t) => t.status === 'skipped');
        return myTasks.filter((t) => !t.status || t.status === 'pending');
    }, [myTasks, statusFilter]);

    const sortedTasks = useMemo(() => {
        const copy = [...filteredTasks];
        copy.sort((a, b) => {
            // Pending/overdue first; finished/skipped last
            const aDone = a.status === 'finished' || a.status === 'skipped';
            const bDone = b.status === 'finished' || b.status === 'skipped';
            if (aDone !== bDone) return aDone ? 1 : -1;

            const aU = computeUrgency(a);
            const bU = computeUrgency(b);
            const order: Record<string, number> = { overdue: 0, due_soon: 1, normal: 2 };
            if (order[aU.level] !== order[bU.level]) return order[aU.level] - order[bU.level];
            return aU.hoursDiff - bU.hoursDiff;
        });
        return copy;
    }, [filteredTasks]);

    const counts = useMemo(() => {
        const pending = myTasks.filter((t) => !t.status || t.status === 'pending').length;
        const finished = myTasks.filter((t) => t.status === 'finished').length;
        const skipped = myTasks.filter((t) => t.status === 'skipped').length;
        const overdue = myTasks.filter((t) => {
            if (t.status === 'finished' || t.status === 'skipped') return false;
            return computeUrgency(t).level === 'overdue';
        }).length;
        return { pending, finished, skipped, overdue, total: myTasks.length };
    }, [myTasks]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 48 }}>
                <Spin tip="Đang tải công việc..." />
            </div>
        );
    }

    if (error) {
        return <Alert type="error" showIcon message="Không tải được dữ liệu" description={error} />;
    }

    if (myTasks.length === 0) {
        return (
            <Empty
                description={
                    <span>
                        Bạn không có công việc nào được giao trên công trình này.
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Hệ thống lọc theo username (<strong>{currentUsername || '(?)'}</strong>) và vai trò (<strong>{currentRole || '(?)'}</strong>).
                        </Text>
                    </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <div>
            <Space style={{ marginBottom: 16 }} wrap>
                <Title level={5} style={{ margin: 0 }}>
                    <UserOutlined /> Việc của tôi trên công trình này
                </Title>
                <Button icon={<ReloadOutlined />} size="small" onClick={() => void fetchTasks()}>
                    Tải lại
                </Button>
            </Space>

            {counts.overdue > 0 && (
                <Alert
                    style={{ marginBottom: 12 }}
                    type="error"
                    showIcon
                    message={`Bạn có ${counts.overdue} việc đã quá hạn cần xử lý ngay.`}
                />
            )}

            <Segmented
                style={{ marginBottom: 16 }}
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as StatusFilter)}
                options={[
                    { label: <span>Đang xử lý ({counts.pending})</span>, value: 'pending_or_overdue' },
                    { label: <span>Tất cả ({counts.total})</span>, value: 'all' },
                    { label: <span>Đã hoàn tất ({counts.finished})</span>, value: 'finished' },
                    { label: <span>Đã bỏ qua ({counts.skipped})</span>, value: 'skipped' },
                ]}
            />

            <List
                dataSource={sortedTasks}
                renderItem={(task) => {
                    const urgency = computeUrgency(task);
                    const dueText = task.due_time
                        ? `Hạn: ${dayjs(task.due_time).format('DD/MM/YYYY HH:mm')}`
                        : 'Chưa có hạn';
                    const cardStyle: React.CSSProperties = {
                        marginBottom: 8,
                        borderLeft:
                            urgency.level === 'overdue'
                                ? '4px solid #ef4444'
                                : urgency.level === 'due_soon'
                                ? '4px solid #f59e0b'
                                : '4px solid transparent',
                    };
                    return (
                        <Card size="small" style={cardStyle} hoverable>
                            <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                <Space wrap size={8}>
                                    <Text strong>{task.title || '(chưa đặt tên)'}</Text>
                                    {renderStatusTag(task.status)}
                                    {urgency.level === 'overdue' && (
                                        <Tag color="error" icon={<ExclamationCircleOutlined />}>
                                            Quá hạn {Math.abs(urgency.hoursDiff)}h
                                        </Tag>
                                    )}
                                    {urgency.level === 'due_soon' && (
                                        <Tag color="warning">Sắp đến hạn ({urgency.hoursDiff}h)</Tag>
                                    )}
                                    {task.assignee_role && <Tag>{task.assignee_role}</Tag>}
                                </Space>
                                {task.description && (
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        {task.description}
                                    </Text>
                                )}
                                <Space size={12}>
                                    <Tooltip title={task.due_time ? dayjs(task.due_time).toString() : ''}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            <ClockCircleOutlined /> {dueText}
                                        </Text>
                                    </Tooltip>
                                    {task.journey_step_code && (
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Bước: {task.journey_step_code}
                                        </Text>
                                    )}
                                    {task.finish_time && (
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Hoàn tất: {formatRelative(task.finish_time)}
                                        </Text>
                                    )}
                                </Space>
                            </Space>
                        </Card>
                    );
                }}
            />
        </div>
    );
};

export default MyTasksTab;
