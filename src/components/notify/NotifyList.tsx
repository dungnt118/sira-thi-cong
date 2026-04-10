import * as AntIcons from '@ant-design/icons';
import history from '@history';
import { Avatar, Badge, Button, Col, List, Modal, Row, Space, Spin, Typography } from 'antd';
import { showMessage } from 'app/store/actions/fuse/message.actions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import React, { useState } from 'react';
import { sanitizeNotificationHtml } from './utils/sanitizeNotificationHtml';

dayjs.extend(relativeTime);
dayjs.locale('vi');
import { useDispatch } from 'react-redux';
import { NotificationAction, UserNotificationItem } from './types/notification.types';

interface PanelCategorySummary {
    categoryId: string;
    categoryIcon?: string;
    categoryColor?: string;
}

interface NotificationPanelState {
    notifications: UserNotificationItem[];
    loading: boolean;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    handleMarkRead: (id: string) => Promise<void>;
    summary?: {
        categories?: PanelCategorySummary[];
    } | null;
}

interface NotifyListProps {
    panel: NotificationPanelState;
    onClose?: () => void;
    /** Chiều cao vùng cuộn danh sách (mặc định 400px; mobile nên dùng calc theo viewport) */
    listScrollHeight?: string | number;
}

type ResolvedLinkTarget =
    | {
        kind: 'internal';
        value: string;
        isDefaultDetail: boolean;
    }
    | {
        kind: 'external';
        value: string;
        isDefaultDetail: boolean;
    };

const DEFAULT_NOTIFICATION_HTML = '<p>Không có nội dung chi tiết.</p>';
type AntdIconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
const antIconMap = AntIcons as unknown as Record<string, AntdIconComponent>;

const normalizeActionType = (type?: string): string => String(type || '').trim().toUpperCase();

const hasHtmlMarkup = (value?: string): boolean => /<\/?[a-z][\s\S]*>/i.test(String(value || ''));

const resolveHtmlContent = (item: UserNotificationItem): { html?: string; text?: string } => {
    const fullContent =
        item.customData?.__fullContent
        || item.customData?.templateData?.__fullContent
        || item.templateData?.__fullContent
        || item.customData?.fullContent;

    if (typeof fullContent === 'string' && fullContent.trim()) {
        if (hasHtmlMarkup(fullContent)) {
            return {
                html: sanitizeNotificationHtml(fullContent)
            };
        }

        return {
            text: fullContent
        };
    }

    if (hasHtmlMarkup(item.body)) {
        return {
            html: sanitizeNotificationHtml(item.body || DEFAULT_NOTIFICATION_HTML)
        };
    }

    return {
        text: item.body || 'Không có nội dung chi tiết.'
    };
};

const resolvePathLikeLink = (rawValue: string): ResolvedLinkTarget | null => {
    const trimmed = rawValue.trim();
    if (!trimmed) {
        return null;
    }

    if (/^https?:\/\//i.test(trimmed)) {
        return {
            kind: 'external',
            value: trimmed,
            isDefaultDetail: false
        };
    }

    if (trimmed.startsWith('/')) {
        return {
            kind: 'internal',
            value: trimmed,
            isDefaultDetail: false
        };
    }

    return null;
};

const resolveDeepLink = (rawValue?: string): ResolvedLinkTarget | null => {
    if (!rawValue) {
        return null;
    }

    const directLink = resolvePathLikeLink(rawValue);
    if (directLink) {
        return directLink;
    }

    try {
        const parsed = new URL(rawValue);
        if (parsed.protocol === 'headless:' && parsed.hostname === 'schema') {
            const segments = parsed.pathname.split('/').filter(Boolean);
            const [schemaName, actionName, recordId] = segments;

            if (schemaName && actionName === 'detail' && recordId) {
                return {
                    kind: 'internal',
                    value: `/apps/anydata/detail/${schemaName}/${recordId}`,
                    isDefaultDetail: true
                };
            }

            return null;
        }

        if (/^https?:$/i.test(parsed.protocol)) {
            const sameOrigin = typeof window !== 'undefined' && parsed.origin === window.location.origin;
            return {
                kind: sameOrigin ? 'internal' : 'external',
                value: sameOrigin ? `${parsed.pathname}${parsed.search}${parsed.hash}` : parsed.toString(),
                isDefaultDetail: false
            };
        }
    } catch (error) {
        return null;
    }

    return null;
};

const openResolvedLink = (target: ResolvedLinkTarget) => {
    if (target.kind === 'internal') {
        history.push(target.value);
        return;
    }

    window.open(target.value, '_blank', 'noopener,noreferrer');
};

const renderActionIcon = (iconName?: string) => {
    if (!iconName) {
        return null;
    }

    const IconComponent = antIconMap[iconName];
    return IconComponent ? <IconComponent /> : null;
};

const NotifyList: React.FC<NotifyListProps> = ({ panel, onClose, listScrollHeight = 400 }) => {
    const dispatch = useDispatch();
    const { notifications, loading, page, setPage, totalPages, handleMarkRead } = panel;
    const [selectedNotification, setSelectedNotification] = useState<UserNotificationItem | null>(null);

    const executeNotificationAction = async (
        item: UserNotificationItem,
        action: NotificationAction
    ): Promise<boolean> => {
        if (!item.isRead) {
            await handleMarkRead(item._id);
        }

        const actionType = normalizeActionType(action.type);
        if (actionType === 'DISMISS') {
            setSelectedNotification(null);
            return true;
        }

        if (actionType === 'OPENURL') {
            const target = resolvePathLikeLink(action.url || '');
            if (!target) {
                return false;
            }

            openResolvedLink(target);
            setSelectedNotification(null);
            onClose?.();
            return true;
        }

        if (actionType === 'DEEPLINK') {
            const target = resolveDeepLink(action.deepLink || item.deepLink);
            if (!target) {
                return false;
            }

            openResolvedLink(target);
            setSelectedNotification(null);
            onClose?.();
            return true;
        }

        if (actionType === 'CALLAPI') {
            dispatch(showMessage({
                message: 'Hành động gọi API của thông báo hiện chưa có contract đủ rõ để thực thi tự động ở frontend.',
                variant: 'warning'
            }));
            return false;
        }

        return false;
    };

    const handleNotificationClick = async (item: UserNotificationItem) => {
        if (!item.isRead) {
            await handleMarkRead(item._id);
        }

        if ((item.actions || []).length > 0) {
            setSelectedNotification(item);
            return;
        }

        const resolvedLink = resolveDeepLink(item.deepLink);
        if (resolvedLink && !resolvedLink.isDefaultDetail) {
            openResolvedLink(resolvedLink);
            onClose?.();
            return;
        }

        setSelectedNotification(item);
    };

    const renderNotificationActions = (item: UserNotificationItem) => {
        if (!item.actions || item.actions.length === 0) {
            return null;
        }

        return (
            <Space wrap size={8}>
                {item.actions.map((action) => (
                    <Button
                        key={action.actionId}
                        size="small"
                        type="primary"
                        ghost
                        icon={renderActionIcon(action.icon)}
                        onClick={async (event) => {
                            event.stopPropagation();
                            const executed = await executeNotificationAction(item, action);
                            if (!executed) {
                                setSelectedNotification(item);
                            }
                        }}
                    >
                        {action.label}
                    </Button>
                ))}
            </Space>
        );
    };

    const selectedContent = selectedNotification ? resolveHtmlContent(selectedNotification) : null;

    return (
        <>
            <div style={{ height: typeof listScrollHeight === 'number' ? listScrollHeight : listScrollHeight, overflowY: 'auto' }}>
                <Spin spinning={loading}>
                    <List
                        itemLayout="vertical"
                        size="small"
                        dataSource={notifications}
                        renderItem={(item: UserNotificationItem) => {
                            const isRead = item.isRead;
                            const createdTime = dayjs(item.createdAt).fromNow();
                            const previewContent = resolveHtmlContent(item);

                            const catSummary = panel.summary?.categories?.find((category) => category.categoryId === item.categoryId);
                            const ActualIcon = catSummary?.categoryIcon
                                ? (antIconMap[catSummary.categoryIcon] ?? AntIcons.BellOutlined)
                                : AntIcons.BellOutlined;

                            return (
                                <List.Item
                                    style={{
                                        border: item.priority === 2 ? '1px solid red' : '1px solid transparent',
                                        backgroundColor: isRead ? 'transparent' : '#f0f5ff',
                                        borderRadius: 8,
                                        padding: '8px 12px',
                                        marginBottom: 8,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        void handleNotificationClick(item);
                                    }}
                                >
                                    <Row wrap={false} gutter={12}>
                                        <Col>
                                            <div style={{ position: 'relative' }}>
                                                <Avatar
                                                    icon={<ActualIcon />}
                                                    style={{ backgroundColor: catSummary?.categoryColor || '#1890ff' }}
                                                />
                                                {!isRead && (
                                                    <Badge
                                                        dot
                                                        color="red"
                                                        style={{ position: 'absolute', top: 0, right: 0 }}
                                                    />
                                                )}
                                            </div>
                                        </Col>
                                        <Col flex={1} style={{ overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Typography.Text strong ellipsis style={{ opacity: isRead ? 0.6 : 1, flex: 1 }}>
                                                    {item.subject}
                                                </Typography.Text>
                                                <Typography.Text type="secondary" style={{ fontSize: 12, marginLeft: 8, whiteSpace: 'nowrap' }}>
                                                    {createdTime}
                                                </Typography.Text>
                                            </div>
                                            {previewContent.html ? (
                                                <div
                                                    className="notify-item-preview-html"
                                                    style={{ opacity: isRead ? 0.6 : 1 }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: previewContent.html
                                                    }}
                                                />
                                            ) : (
                                                <Typography.Paragraph
                                                    ellipsis={{ rows: 2 }}
                                                    style={{ margin: 0, opacity: isRead ? 0.6 : 1, fontSize: 13 }}
                                                    type="secondary"
                                                >
                                                    {previewContent.text}
                                                </Typography.Paragraph>
                                            )}
                                            {item.imageUrl && (
                                                <div style={{ marginTop: 8 }}>
                                                    <img
                                                        src={item.imageUrl}
                                                        alt="attachment"
                                                        style={{ maxWidth: '100%', borderRadius: 6, maxHeight: 120, objectFit: 'cover' }}
                                                    />
                                                </div>
                                            )}
                                            {item.actions && item.actions.length > 0 && (
                                                <div style={{ marginTop: 8 }}>
                                                    {renderNotificationActions(item)}
                                                </div>
                                            )}
                                        </Col>
                                    </Row>
                                </List.Item>
                            );
                        }}
                    />
                </Spin>

                {totalPages > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #f0f0f0' }}>
                        <span style={{ fontSize: 12, marginRight: 16 }}>Mẹo: ESC để đóng</span>
                        <Button
                            size="small"
                            icon={<AntIcons.LeftOutlined />}
                            disabled={page <= 1}
                            onClick={() => setPage((previousPage: number) => Math.max(1, previousPage - 1))}
                        />
                        <span style={{ margin: '0 12px', fontSize: 13 }}>{page} / {totalPages}</span>
                        <Button
                            size="small"
                            icon={<AntIcons.RightOutlined />}
                            disabled={page >= totalPages}
                            onClick={() => setPage((previousPage: number) => Math.min(totalPages, previousPage + 1))}
                        />
                    </div>
                )}
            </div>

            <Modal
                open={Boolean(selectedNotification)}
                title={selectedNotification?.subject || 'Chi tiết thông báo'}
                onCancel={() => setSelectedNotification(null)}
                footer={[
                    <Button key="close" onClick={() => setSelectedNotification(null)}>
                        Đóng
                    </Button>
                ]}
                width={720}
                destroyOnHidden
            >
                {!selectedNotification ? null : (
                    <div>
                        <div style={{ marginBottom: 12 }}>
                            <Typography.Text type="secondary">
                                {dayjs(selectedNotification.createdAt).format('HH:mm DD/MM/YYYY')}
                            </Typography.Text>
                        </div>

                        {selectedNotification.imageUrl && (
                            <div style={{ marginBottom: 16 }}>
                                <img
                                    src={selectedNotification.imageUrl}
                                    alt="attachment"
                                    style={{ maxWidth: '100%', borderRadius: 8 }}
                                />
                            </div>
                        )}

                        {selectedContent?.html ? (
                            <div
                                style={{ marginBottom: 16, lineHeight: 1.6 }}
                                dangerouslySetInnerHTML={{
                                    __html: selectedContent.html || DEFAULT_NOTIFICATION_HTML
                                }}
                            />
                        ) : (
                            <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                                {selectedContent?.text || 'Không có nội dung chi tiết.'}
                            </Typography.Paragraph>
                        )}

                        {selectedNotification.actions && selectedNotification.actions.length > 0 && (
                            <div>
                                <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
                                    Hành động
                                </Typography.Text>
                                {renderNotificationActions(selectedNotification)}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
};

export default NotifyList;
