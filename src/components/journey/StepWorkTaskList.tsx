import React from 'react';
import { List, Typography, Space, Tag, Select, Badge, Empty, Button, Tooltip } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    AuditOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { IWorkTask } from '../../services/core-contracts/types/workTask.types';

const { Text } = Typography;

/** Nhãn hiển thị cho mã assignee_role (đồng bộ Customer Journey). */
const ASSIGNEE_ROLE_LABELS: Record<string, string> = {
    QL: 'Quản lý dự án',
    GS: 'Giám sát',
    KYT: 'Kỹ thuật',
    KT: 'Kế toán',
    HC: 'Hành chính',
    KD: 'Kinh doanh',
    ADMIN: 'Admin',
};

function getAssigneeId(assignee: unknown): string | undefined {
    if (assignee == null) return undefined;
    if (typeof assignee === 'string') {
        const s = assignee.trim();
        return s || undefined;
    }
    if (typeof assignee === 'object' && assignee !== null) {
        const o = assignee as Record<string, unknown>;
        const id = o._id ?? o.id ?? o.itemId;
        if (id != null && String(id).trim()) return String(id);
    }
    return undefined;
}

function formatAssigneeDisplay(assignee: unknown): string {
    if (assignee == null) return '—';
    if (typeof assignee === 'string') {
        const s = assignee.trim();
        return s || '—';
    }
    if (typeof assignee === 'object' && assignee !== null) {
        const o = assignee as Record<string, unknown>;
        const label =
            o.display_name ??
            o.displayName ??
            o.title ??
            o.name ??
            o.full_name ??
            o.fullName ??
            o.username ??
            o.email;
        if (label != null && String(label).trim()) return String(label);
        const id = o._id ?? o.id ?? o.itemId;
        if (id != null) return String(id);
    }
    return '—';
}

function isCurrentUserAssignee(currentUserId: string | undefined, assignee: unknown): boolean {
    if (!currentUserId) return false;
    const aid = getAssigneeId(assignee);
    if (!aid) return false;
    return String(currentUserId) === String(aid);
}

export interface StepWorkTaskListProps {
    tasks: IWorkTask[];
    loading?: boolean;
    reportCounts?: Record<string, number>;
    /** `_id` user đăng nhập — dùng để chỉ cho phép đổi trạng thái khi trùng assignee */
    currentUserId?: string;
    onStatusUpdate?: (taskId: string, status: string) => void;
    onCreateReport?: (task: IWorkTask) => void;
    onViewReports?: (task: IWorkTask) => void;
    readOnly?: boolean;
}

export const StepWorkTaskList: React.FC<StepWorkTaskListProps> = ({
    tasks,
    loading = false,
    reportCounts = {},
    currentUserId,
    onStatusUpdate,
    onCreateReport,
    onViewReports,
    readOnly = false,
}) => {
    return (
        <List
            loading={loading}
            dataSource={tasks}
            locale={{ emptyText: <Empty description="Chưa có công việc nào ở bước này" /> }}
            renderItem={(task) => {
                const isAssignee = isCurrentUserAssignee(currentUserId, task.assignee);
                const statusLockedByAssignee = readOnly || !isAssignee;
                const statusTooltip = readOnly
                    ? 'Chỉ xem — không đổi trạng thái tại bước này.'
                    : !currentUserId
                      ? 'Đăng nhập để thao tác trạng thái.'
                      : !getAssigneeId(task.assignee)
                        ? 'Chưa có người được giao — không đổi được trạng thái.'
                        : !isAssignee
                          ? 'Chỉ người được giao mới đổi được trạng thái.'
                          : undefined;

                const statusSelect = onStatusUpdate ? (
                    <Select
                        size="small"
                        value={task.status || 'pending'}
                        onChange={(val) => onStatusUpdate(task._id, val)}
                        style={{ minWidth: 80 }}
                        onClick={(e) => e.stopPropagation()}
                        disabled={statusLockedByAssignee}
                        options={[
                            { label: 'Chờ', value: 'pending' },
                            { label: 'Xong', value: 'finished' },
                            { label: 'Bỏ qua', value: 'skipped' },
                        ]}
                    />
                ) : null;

                return (
                <List.Item
                    actions={[
                        onCreateReport && (
                            <Button 
                                key="report"
                                type="link" 
                                icon={<AuditOutlined />} 
                                size="small"
                                onClick={() => onCreateReport(task)}
                            >
                                Báo cáo
                            </Button>
                        )
                    ].filter(Boolean)}
                >
                    <List.Item.Meta
                        avatar={
                            task.status === 'finished' ? (
                                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                            ) : task.status === 'skipped' ? (
                                <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                            ) : (
                                <ClockCircleOutlined style={{ color: '#faad14', fontSize: 18 }} />
                            )
                        }
                        title={(
                            <Space wrap align="center">
                                <Text strong>{task.title || 'Công việc chưa đặt tên'}</Text>
                                {task.is_required && <Tag color="red" style={{ fontSize: 10 }}>Bắt buộc</Tag>}
                                {statusSelect &&
                                    (statusLockedByAssignee && statusTooltip ? (
                                        <Tooltip title={statusTooltip}>
                                            <span style={{ display: 'inline-block' }}>{statusSelect}</span>
                                        </Tooltip>
                                    ) : (
                                        statusSelect
                                    ))}
                                {reportCounts[task._id] > 0 && (
                                    <Badge 
                                        count={reportCounts[task._id]} 
                                        style={{ backgroundColor: '#1890ff', cursor: onViewReports ? 'pointer' : 'default' }}
                                        onClick={(e) => {
                                            if (onViewReports) {
                                                e.stopPropagation();
                                                onViewReports(task);
                                            }
                                        }}
                                        title="Xem báo cáo"
                                    />
                                )}
                            </Space>
                        )}
                        description={(
                            <Space direction="vertical" size={2}>
                                {(task.assignee != null && task.assignee !== '') || task.assignee_role ? (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        <UserOutlined style={{ marginRight: 6 }} />
                                        Người được giao: <Text strong>{formatAssigneeDisplay(task.assignee)}</Text>
                                        {task.assignee_role ? (
                                            <>
                                                {' '}
                                                · Vai trò:{' '}
                                                <Tag style={{ marginInlineEnd: 0 }}>
                                                    {ASSIGNEE_ROLE_LABELS[String(task.assignee_role)] || task.assignee_role}
                                                </Tag>
                                            </>
                                        ) : null}
                                    </Text>
                                ) : null}
                                <Text type="secondary" style={{ fontSize: 13 }}>{task.description || 'Chưa có mô tả'}</Text>
                                {task.note && <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>Ghi chú: {task.note}</Text>}
                            </Space>
                        )}
                    />
                </List.Item>
                );
            }}
        />
    );
};
