import React from 'react';
import { List, Typography, Space, Tag, Select, Badge, Empty, Button, Tooltip, message, Popconfirm } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    AuditOutlined,
    UserOutlined,
    FormOutlined,
    FileTextOutlined,
    PlusOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { labelForWorkTaskActionKey } from '../../constants/workTaskActionUx';
import type { IActionsItem } from '../../services/core-contracts/types/workTask.types';
import { IWorkTask } from '../../services/core-contracts/types/workTask.types';
import { splitTaskActionsForUi, type TaskActionClickPayload } from '../../utils/workTaskActionGroups';

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

function actionButtonIcon(actionType?: string | null) {
    if (actionType === 'require_document') return <FileTextOutlined />;
    if (actionType === 'require_status_equals') return <CheckCircleOutlined />;
    return <FormOutlined />;
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
    /** Bấm nút thao tác gợi ý (gom theo loại: field batch, document batch, hoặc single). */
    onTaskActionClick?: (payload: TaskActionClickPayload) => void;
    readOnly?: boolean;
    /** Quản lý (QL / PM theo app): thêm / xóa công việc tại bước đang xem. */
    canManageWorkTasks?: boolean;
    onAddWorkTask?: () => void;
    onDeleteWorkTask?: (task: IWorkTask) => void;
}

export const StepWorkTaskList: React.FC<StepWorkTaskListProps> = ({
    tasks,
    loading = false,
    reportCounts = {},
    currentUserId,
    onStatusUpdate,
    onCreateReport,
    onViewReports,
    onTaskActionClick,
    readOnly = false,
    canManageWorkTasks = false,
    onAddWorkTask,
    onDeleteWorkTask,
}) => {
    return (
        <>
        {canManageWorkTasks && onAddWorkTask ? (
            <div style={{ marginBottom: 12 }}>
                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => onAddWorkTask()}>
                    Thêm công việc
                </Button>
            </div>
        ) : null}
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
                        ),
                        canManageWorkTasks && onDeleteWorkTask ? (
                            <Popconfirm
                                key="delete"
                                title="Xóa công việc này?"
                                description={task.title || task._id}
                                okText="Xóa"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                                onConfirm={() => onDeleteWorkTask(task)}
                            >
                                <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                                    Xóa
                                </Button>
                            </Popconfirm>
                        ) : null,
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
                                {task.actions && task.actions.length > 0 ? (
                                    <div style={{ marginTop: 6 }}>
                                        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>
                                            Thao tác gợi ý
                                        </Text>
                                        <Space wrap size={[8, 8]}>
                                            {splitTaskActionsForUi(task.actions).map((batch, idx) => {
                                                if (batch.kind === 'field_batch') {
                                                    const n = batch.actions.length;
                                                    const tip = batch.actions
                                                        .map(
                                                            (a) =>
                                                                a.note ||
                                                                [a.action_key && labelForWorkTaskActionKey(a.action_key), a.target_field]
                                                                    .filter(Boolean)
                                                                    .join(' · ')
                                                        )
                                                        .filter(Boolean)
                                                        .join('\n');
                                                    const btn = (
                                                        <Button
                                                            size="small"
                                                            type="default"
                                                            icon={<FormOutlined />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (onTaskActionClick) {
                                                                    onTaskActionClick({ type: 'field_batch', task, actions: batch.actions });
                                                                } else {
                                                                    message.info('Chưa cấu hình điều hướng cho thao tác này.');
                                                                }
                                                            }}
                                                        >
                                                            Cập nhật công trình ({n})
                                                        </Button>
                                                    );
                                                    return (
                                                        <Tooltip key={`${task._id}-field-batch-${idx}`} title={tip || 'Cập nhật nhiều thuộc tính công trình'}>
                                                            <span>{btn}</span>
                                                        </Tooltip>
                                                    );
                                                }
                                                if (batch.kind === 'document_batch') {
                                                    const n = batch.actions.length;
                                                    const tip = batch.actions
                                                        .map((a) => a.note || [a.doc_type, a.min_count != null ? `tối thiểu ${a.min_count}` : ''].filter(Boolean).join(' · '))
                                                        .filter(Boolean)
                                                        .join('\n');
                                                    const btn = (
                                                        <Button
                                                            size="small"
                                                            type="default"
                                                            icon={<FileTextOutlined />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (onTaskActionClick) {
                                                                    onTaskActionClick({ type: 'document_batch', task, actions: batch.actions });
                                                                } else {
                                                                    message.info('Chưa cấu hình điều hướng cho thao tác này.');
                                                                }
                                                            }}
                                                        >
                                                            Tài liệu ({n})
                                                        </Button>
                                                    );
                                                    return (
                                                        <Tooltip key={`${task._id}-doc-batch-${idx}`} title={tip || 'Tải tài liệu theo nhiều loại'}>
                                                            <span>{btn}</span>
                                                        </Tooltip>
                                                    );
                                                }
                                                const act = batch.action;
                                                const label =
                                                    (act.action_key && labelForWorkTaskActionKey(act.action_key)) ||
                                                    act.note ||
                                                    act.target_field ||
                                                    act.doc_type ||
                                                    'Thao tác';
                                                const tip =
                                                    act.note ||
                                                    [act.action_type, act.target_field, act.doc_type]
                                                        .filter(Boolean)
                                                        .join(' · ') ||
                                                    label;
                                                const btn = (
                                                    <Button
                                                        size="small"
                                                        type="default"
                                                        icon={actionButtonIcon(act.action_type)}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (onTaskActionClick) {
                                                                onTaskActionClick({ type: 'single', task, action: act });
                                                            } else {
                                                                message.info('Chưa cấu hình điều hướng cho thao tác này.');
                                                            }
                                                        }}
                                                    >
                                                        {label}
                                                    </Button>
                                                );
                                                return (
                                                    <Tooltip key={`${task._id}-action-single-${idx}`} title={tip}>
                                                        <span>{btn}</span>
                                                    </Tooltip>
                                                );
                                            })}
                                        </Space>
                                    </div>
                                ) : null}
                            </Space>
                        )}
                    />
                </List.Item>
                );
            }}
        />
        </>
    );
};
