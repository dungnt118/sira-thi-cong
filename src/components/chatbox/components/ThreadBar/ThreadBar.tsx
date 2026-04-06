import { BoxPlotOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Tabs, Tooltip } from 'antd';
import type { IConversationThread, IUnreadBadge } from '../../contentConversation.types';
import { ThreadStatus } from '../../contentConversation.types';
import { getThreadTypeIconComponent } from '../../utils/iconComponents';
import { formatRelativeTime, getStatusLabel, getVisibilityLabel } from '../../utils/chatboxUtils';
import './ThreadBar.less';

interface IThreadBarProps {
    threads: IConversationThread[];
    unreadBadges: IUnreadBadge[];
    activeThreadId: string;
    onThreadChange: (threadId: string) => void;
    onCreateSubThread?: () => void;
}

export default function ThreadBar({
    threads,
    unreadBadges,
    activeThreadId,
    onThreadChange,
    onCreateSubThread,
}: IThreadBarProps) {
    const getUnreadCount = (threadId: string): number =>
        unreadBadges.find((item) => item.threadId === threadId)?.count || 0;

    const items = [
        ...threads.map((thread) => {
            const unreadCount = getUnreadCount(thread._id);
            const label = thread.is_main_thread ? 'Main' : thread.title;

            const tooltip = (
                <div className="thread-tab-tooltip">
                    <div className="tooltip-title">{thread.title}</div>
                    <div className="tooltip-row"><span>Trạng thái:</span> {getStatusLabel(thread.status)}</div>
                    <div className="tooltip-row"><span>Phạm vi:</span> {getVisibilityLabel(thread.visibility)}</div>
                    {thread.last_message_at && (
                        <div className="tooltip-row"><span>Cập nhật:</span> {formatRelativeTime(thread.last_message_at)}</div>
                    )}
                </div>
            );

            return {
                key: thread._id,
                label: (
                    <Tooltip title={tooltip} placement="bottom">
                        <span className="thread-tab-label">
                            <span className="thread-tab-icon">{getThreadTypeIconComponent(thread.thread_type)}</span>
                            <span className="thread-tab-title">
                                {label}
                                {unreadCount > 0 && (
                                    <Badge
                                        count={unreadCount}
                                        className="thread-tab-badge"
                                        style={{ backgroundColor: '#ff4d4f' }}
                                    />
                                )}
                            </span>
                            {thread.status === ThreadStatus.Locked && <LockOutlined className="thread-tab-status-icon" />}
                            {thread.status === ThreadStatus.Archived && <BoxPlotOutlined className="thread-tab-status-icon" />}
                        </span>
                    </Tooltip>
                ),
                children: null,
            };
        }),
        ...(onCreateSubThread ? [{
            key: '__add_thread__',
            label: (
                <Button
                    type="text"
                    size="small"
                    icon={<PlusOutlined />}
                    className="thread-add-button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onCreateSubThread();
                    }}
                />
            ),
            children: null,
        }] : []),
    ];

    return (
        <div className="chatbox-thread-bar">
            <Tabs
                activeKey={activeThreadId}
                onChange={(key) => {
                    if (key === '__add_thread__') {
                        return;
                    }

                    onThreadChange(key);
                }}
                items={items}
                className="thread-tabs"
                tabBarStyle={{ marginBottom: 0 }}
            />
        </div>
    );
}
