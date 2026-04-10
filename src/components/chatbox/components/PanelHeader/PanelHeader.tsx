import {
    CloseOutlined,
    CopyOutlined,
    DownloadOutlined,
    EllipsisOutlined,
    ExpandOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    ReloadOutlined,
    SearchOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Drawer, Dropdown, Space, Tooltip, message } from 'antd';
import { useMemo, useState } from 'react';
import type { ChatPanelLayoutMode, IConversationThread } from '../../contentConversation.types';
import ThreadInfoDrawer from '../ThreadInfoDrawer/ThreadInfoDrawer';
import './PanelHeader.less';

interface IPanelHeaderProps {
    thread: IConversationThread;
    totalUnread: number;
    title?: string;
    subtitle?: string;
    onClose?: () => void;
    layoutWidthMode?: ChatPanelLayoutMode;
    onToggleWidth?: () => void;
    onRefresh?: () => void;
    onSearchClick?: () => void;
    onFilterClick?: () => void;
    onParticipantsClick?: () => void;
    searchBarVisible?: boolean;
    filterToolbarVisible?: boolean;
    hasActiveFilter?: boolean;
}

export default function PanelHeader({
    thread,
    totalUnread,
    title,
    subtitle,
    onClose,
    layoutWidthMode = 'expanded',
    onToggleWidth,
    onRefresh,
    onSearchClick,
    onFilterClick,
    onParticipantsClick,
    searchBarVisible,
    filterToolbarVisible,
    hasActiveFilter,
}: IPanelHeaderProps) {
    const [showThreadInfo, setShowThreadInfo] = useState(false);
    const primaryText = title || thread.source_content_title || thread.title || 'Trao đổi';
    const secondaryText = useMemo(() => {
        if (subtitle !== undefined) {
            return subtitle.trim();
        }

        const parts = [thread.source_schema, thread.source_content_id].filter(Boolean);
        return parts.join(' • ');
    }, [subtitle, thread.source_content_id, thread.source_schema]);

    const headerMenuItems = [
        {
            key: 'copy-link',
            icon: <CopyOutlined />,
            label: 'Sao chép liên kết luồng',
            onClick: async () => {
                try {
                    const link = `${window.location.origin}/threads/${thread._id}`;
                    await navigator.clipboard.writeText(link);
                    message.success('Đã sao chép liên kết luồng.');
                } catch {
                    message.error('Không sao chép được liên kết luồng.');
                }
            },
        },
        {
            key: 'thread-info',
            icon: <InfoCircleOutlined />,
            label: 'Xem thông tin luồng',
            onClick: () => setShowThreadInfo(true),
        },
        {
            key: 'refresh',
            icon: <ReloadOutlined />,
            label: 'Tải lại',
            onClick: () => onRefresh?.(),
        },
        { type: 'divider' as const },
        {
            key: 'export',
            icon: <DownloadOutlined />,
            label: 'Xuất hội thoại',
            onClick: () => message.info('Chức năng xuất hội thoại sẽ được bổ sung ở bước sau.'),
        },
        {
            key: 'share',
            label: 'Chia sẻ luồng',
            disabled: true,
        },
        {
            key: 'archive',
            label: 'Lưu trữ luồng',
            disabled: true,
        },
    ];

    return (
        <>
            <div className="chatbox-panel-header">
                <div className="header-row header-row-primary">
                    <div className="header-title-section">
                        <Tooltip title={primaryText}>
                            <div className="header-primary">{primaryText}</div>
                        </Tooltip>
                    </div>

                    <Space size={0} className="header-actions">
                        {onSearchClick && (
                            <Tooltip title={searchBarVisible ? 'Đóng tìm kiếm' : 'Tìm trong luồng'}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<SearchOutlined />}
                                    onClick={onSearchClick}
                                    className={searchBarVisible ? 'header-action-active' : undefined}
                                />
                            </Tooltip>
                        )}

                        {onFilterClick && (
                            <Tooltip title={filterToolbarVisible ? 'Đóng bộ lọc' : 'Bộ lọc nâng cao'}>
                                <Badge dot={hasActiveFilter} offset={[-2, 2]}>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<FilterOutlined />}
                                        onClick={onFilterClick}
                                        className={filterToolbarVisible ? 'header-action-active' : undefined}
                                    />
                                </Badge>
                            </Tooltip>
                        )}

                        <Tooltip title={layoutWidthMode === 'expanded' ? 'Thu gọn drawer' : 'Mở rộng drawer'}>
                            <Button type="text" size="small" icon={<ExpandOutlined />} onClick={onToggleWidth} />
                        </Tooltip>

                        <Dropdown menu={{ items: headerMenuItems }} trigger={['click']}>
                            <Button type="text" size="small" icon={<EllipsisOutlined />} />
                        </Dropdown>

                        <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
                    </Space>
                </div>

                <div
                    className={`header-row header-row-secondary${secondaryText ? '' : ' header-row-secondary--solo-meta'}`.trim()}
                >
                    {secondaryText ? (
                        <div className="header-secondary">{secondaryText}</div>
                    ) : (
                        <div className="header-secondary header-secondary--empty" aria-hidden />
                    )}
                    <div className="header-meta">
                        <Tooltip title={`${thread.participants?.length ?? 0} thành viên`}>
                            <Button type="text" size="small" className="header-participants-trigger" onClick={onParticipantsClick}>
                                <UserOutlined className="header-participants-icon" />
                                <span className="header-participants-count">{thread.participants?.length ?? 0}</span>
                            </Button>
                        </Tooltip>

                        {totalUnread > 0 && (
                            <span className="header-unread">
                                <span className="header-unread-count">{totalUnread}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Drawer
                title="Thông tin luồng"
                placement="right"
                onClose={() => setShowThreadInfo(false)}
                open={showThreadInfo}
                width={420}
            >
                <ThreadInfoDrawer thread={thread} onClose={() => setShowThreadInfo(false)} />
            </Drawer>
        </>
    );
}
