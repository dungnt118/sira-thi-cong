import {
    CommentOutlined,
    ExclamationCircleOutlined,
    GlobalOutlined,
    LockOutlined,
    MessageOutlined,
    PaperClipOutlined,
    PlusOutlined,
    ReloadOutlined,
    SafetyCertificateOutlined,
    SendOutlined,
    TeamOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import {
    Avatar,
    Badge,
    Button,
    Card,
    Empty,
    Form,
    Grid,
    Input,
    Modal,
    Segmented,
    Select,
    Space,
    Spin,
    Tag,
    Typography,
    message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthorizedUserSelect } from '../authorizedusers/AuthorizedUser';
import { useAuth } from '../../hooks/useAuth';
import { getFileLink } from '../../services/storeService';
import { contentConversationService } from './contentConversation.service';
import {
    ConversationVisibility,
    IContentConversationPanelProps,
    IContentChatboxMessage,
    IConversationThread,
    MessageTypeEnum,
    ThreadStatus,
    ThreadType,
} from './contentConversation.types';

const { Text, Title } = Typography;
const { TextArea } = Input;

const THREAD_TYPE_LABEL: Record<ThreadType, string> = {
    [ThreadType.Main]: 'Luồng chính',
    [ThreadType.Discussion]: 'Thảo luận',
    [ThreadType.Escalation]: 'Escalation',
    [ThreadType.Private]: 'Riêng tư',
    [ThreadType.External]: 'External',
};

const THREAD_STATUS_LABEL: Record<ThreadStatus, string> = {
    [ThreadStatus.Active]: 'Đang mở',
    [ThreadStatus.Archived]: 'Lưu trữ',
    [ThreadStatus.Locked]: 'Khóa',
    [ThreadStatus.Deleted]: 'Đã xóa',
};

const THREAD_STATUS_COLOR: Record<ThreadStatus, string> = {
    [ThreadStatus.Active]: 'success',
    [ThreadStatus.Archived]: 'default',
    [ThreadStatus.Locked]: 'warning',
    [ThreadStatus.Deleted]: 'error',
};

const VISIBILITY_LABEL: Record<ConversationVisibility, string> = {
    [ConversationVisibility.Private]: 'Riêng tư',
    [ConversationVisibility.Internal]: 'Nội bộ',
    [ConversationVisibility.Public]: 'Công khai',
    [ConversationVisibility.Restricted]: 'Hạn chế',
};

const composerModeOptions = [
    { label: 'Tin nhắn', value: MessageTypeEnum.Message },
    { label: 'Ghi chú', value: MessageTypeEnum.Note },
];

const getThreadIcon = (threadType?: ThreadType) => {
    switch (threadType) {
        case ThreadType.Discussion:
            return <CommentOutlined />;
        case ThreadType.Escalation:
            return <ExclamationCircleOutlined />;
        case ThreadType.Private:
            return <LockOutlined />;
        case ThreadType.External:
            return <GlobalOutlined />;
        case ThreadType.Main:
        default:
            return <MessageOutlined />;
    }
};

const getVisibilityIcon = (visibility?: ConversationVisibility) => {
    switch (visibility) {
        case ConversationVisibility.Private:
            return <LockOutlined />;
        case ConversationVisibility.Public:
            return <GlobalOutlined />;
        case ConversationVisibility.Restricted:
            return <SafetyCertificateOutlined />;
        case ConversationVisibility.Internal:
        default:
            return <TeamOutlined />;
    }
};

const parseDateValue = (value: unknown): dayjs.Dayjs | null => {
    if (!value) {
        return null;
    }

    const parsed = dayjs(value as any);
    return parsed.isValid() ? parsed : null;
};

const getAvatarColor = (value?: string) => {
    const palette = ['#1d4ed8', '#7c3aed', '#0f766e', '#d97706', '#be123c', '#2563eb'];
    const seed = (value || '').split('').reduce((total, char) => total + char.charCodeAt(0), 0);
    return palette[seed % palette.length];
};

const getAttachmentLink = (attachment: {
    file_id?: string;
    url?: string;
    file_path?: string;
}) => {
    if (attachment.url) {
        return attachment.url;
    }

    if (attachment.file_id) {
        return getFileLink(attachment.file_id);
    }

    if (attachment.file_path) {
        return getFileLink(attachment.file_path);
    }

    return undefined;
};

const getMessageDisplayText = (messageItem: IContentChatboxMessage) => {
    const trimmedContent = messageItem.content?.trim();
    if (trimmedContent) {
        return trimmedContent;
    }

    switch (messageItem.message_type) {
        case MessageTypeEnum.ContentChanged:
            return 'Hệ thống đã ghi nhận thay đổi dữ liệu.';
        case MessageTypeEnum.Schedule:
            return 'Hệ thống đã cập nhật lịch nhắc.';
        case MessageTypeEnum.LinkedContent:
            return 'Hệ thống đã liên kết dữ liệu liên quan.';
        default:
            return 'Tin nhắn không có nội dung văn bản.';
    }
};

const renderHtmlMessage = (messageItem: IContentChatboxMessage) => (
    <div
        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        dangerouslySetInnerHTML={{ __html: getMessageDisplayText(messageItem) }}
    />
);

const MessageBubble: React.FC<{ item: IContentChatboxMessage; isMine: boolean }> = ({ item, isMine }) => {
    const createdAt = parseDateValue(item.createdAt);
    const attachments = Array.isArray(item.payload?.attachments) ? item.payload.attachments : [];
    const linkedContents = Array.isArray(item.payload?.linked_contents) ? item.payload.linked_contents : [];
    const changes = Array.isArray(item.system?.changes) ? item.system.changes : [];

    const isSystemCard = ![MessageTypeEnum.Message, MessageTypeEnum.Note].includes(item.message_type);
    const cardBackground = item.message_type === MessageTypeEnum.Note
        ? '#fffbe6'
        : isMine
            ? '#1677ff'
            : '#ffffff';
    const cardColor = item.message_type === MessageTypeEnum.Note
        ? '#593815'
        : isMine
            ? '#ffffff'
            : '#1f2937';

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: isSystemCard ? 'center' : isMine ? 'flex-end' : 'flex-start',
                marginBottom: 12,
            }}
        >
            <div style={{ maxWidth: isSystemCard ? '100%' : '78%', minWidth: isSystemCard ? '100%' : undefined }}>
                <div
                    style={{
                        borderRadius: 16,
                        padding: isSystemCard ? 14 : 12,
                        background: isSystemCard ? '#f6f8fb' : cardBackground,
                        color: cardColor,
                        border: isSystemCard ? '1px solid #e5e7eb' : '1px solid rgba(15, 23, 42, 0.06)',
                        boxShadow: isSystemCard ? 'none' : '0 8px 24px rgba(15, 23, 42, 0.08)',
                    }}
                >
                    {item.message_type === MessageTypeEnum.Note && <Tag color="gold" style={{ marginBottom: 8 }}>Ghi chú nội bộ</Tag>}
                    {item.message_type === MessageTypeEnum.ContentChanged && <Tag color="blue" style={{ marginBottom: 8 }}>Cập nhật dữ liệu</Tag>}
                    {item.message_type === MessageTypeEnum.Schedule && <Tag color="cyan" style={{ marginBottom: 8 }}>Lịch nhắc</Tag>}
                    {item.message_type === MessageTypeEnum.LinkedContent && <Tag color="purple" style={{ marginBottom: 8 }}>Liên kết dữ liệu</Tag>}
                    {renderHtmlMessage(item)}

                    {changes.length > 0 && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(15, 23, 42, 0.12)', display: 'grid', gap: 8 }}>
                            {changes.map((change) => (
                                <div key={`${change.id}-${change.label}`} style={{ borderRadius: 10, background: '#ffffff', padding: '8px 10px', border: '1px solid #e5e7eb' }}>
                                    <Text strong>{change.label}</Text>
                                    <div style={{ marginTop: 4, display: 'grid', gap: 4 }}>
                                        <Text type="secondary">Trước: {change.ori || '—'}</Text>
                                        <Text>Sau: {change.current || '—'}</Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {linkedContents.length > 0 && (
                        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {linkedContents.map((linkedItem) => (
                                <Tag key={`${linkedItem.schema}-${linkedItem.ref_id}`} color="purple" style={{ marginInlineEnd: 0 }}>
                                    {linkedItem.title}
                                </Tag>
                            ))}
                        </div>
                    )}

                    {attachments.length > 0 && (
                        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {attachments.map((attachment, index) => {
                                const href = getAttachmentLink(attachment);
                                const label = attachment.name || attachment.file_path || `Tệp ${index + 1}`;

                                return (
                                    <a
                                        key={`${label}-${index}`}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '6px 10px',
                                            borderRadius: 999,
                                            background: isMine ? 'rgba(255,255,255,0.18)' : '#eef2ff',
                                            color: isMine ? '#ffffff' : '#1d4ed8',
                                        }}
                                    >
                                        <PaperClipOutlined />
                                        <span>{label}</span>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 6, display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {(item.createdBy || 'Hệ thống')}
                        {createdAt ? ` • ${createdAt.format('HH:mm DD/MM/YYYY')}` : ''}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default function ContentConversationPanel({
    schemaName,
    contentId,
    title = 'Trao đổi nhóm',
    subtitle = 'Thảo luận nội bộ theo từng luồng công việc',
    className,
    style,
}: IContentConversationPanelProps) {
    const { user } = useAuth();
    const currentUsername = user?.username || '';
    const screens = Grid.useBreakpoint();
    const isCompact = !screens.lg;

    const [hierarchyLoading, setHierarchyLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [hierarchy, setHierarchy] = useState<any>(null);
    const [messages, setMessages] = useState<IContentChatboxMessage[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [composerMode, setComposerMode] = useState<MessageTypeEnum>(MessageTypeEnum.Message);
    const [composerValue, setComposerValue] = useState('');
    const [sendLoading, setSendLoading] = useState(false);
    const [createThreadOpen, setCreateThreadOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [createThreadLoading, setCreateThreadLoading] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [createThreadForm] = Form.useForm();
    const [inviteForm] = Form.useForm();

    const allThreads = useMemo<IConversationThread[]>(() => {
        if (!hierarchy) {
            return [];
        }

        return [
            hierarchy.mainThread,
            ...(Array.isArray(hierarchy.autoThreads) ? hierarchy.autoThreads : []),
            ...(Array.isArray(hierarchy.subThreads) ? hierarchy.subThreads : []),
        ].filter((item): item is IConversationThread => Boolean(item?._id));
    }, [hierarchy]);

    const unreadMap = useMemo(() => {
        const nextMap = new Map<string, number>();
        const items = Array.isArray(hierarchy?.unreadByThread) ? hierarchy.unreadByThread : [];
        items.forEach((item: { threadId?: string; count?: number }) => {
            if (item?.threadId) {
                nextMap.set(item.threadId, Number(item.count || 0));
            }
        });
        return nextMap;
    }, [hierarchy]);

    const activeThread = useMemo(
        () => allThreads.find((item) => item._id === activeThreadId) ?? null,
        [activeThreadId, allThreads],
    );

    const timelineItems = useMemo(
        () => [...messages].sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime()),
        [messages],
    );

    const loadHierarchy = useCallback(async (preferredThreadId?: string) => {
        setHierarchyLoading(true);
        try {
            const response = await contentConversationService.getThreadHierarchy(schemaName, contentId, true);
            setHierarchy(response);

            const availableThreadIds = [
                response.mainThread?._id,
                ...(response.autoThreads || []).map((item) => item._id),
                ...(response.subThreads || []).map((item) => item._id),
            ].filter(Boolean);

            const nextThreadId = preferredThreadId && availableThreadIds.includes(preferredThreadId)
                ? preferredThreadId
                : activeThreadId && availableThreadIds.includes(activeThreadId)
                    ? activeThreadId
                    : availableThreadIds[0] || null;

            setActiveThreadId(nextThreadId);
        } catch (error) {
            console.error('Không tải được hierarchy chatbox:', error);
            message.error(error instanceof Error ? error.message : 'Không tải được luồng thảo luận.');
        } finally {
            setHierarchyLoading(false);
        }
    }, [activeThreadId, contentId, schemaName]);

    const loadMessages = useCallback(async (threadId: string) => {
        setMessagesLoading(true);
        try {
            const response = await contentConversationService.getMessagesByThread(threadId);
            setMessages(response);
        } catch (error) {
            console.error('Không tải được tin nhắn:', error);
            message.error(error instanceof Error ? error.message : 'Không tải được tin nhắn.');
        } finally {
            setMessagesLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHierarchy();
    }, [loadHierarchy]);

    useEffect(() => {
        if (!activeThreadId) {
            setMessages([]);
            return;
        }

        loadMessages(activeThreadId);
    }, [activeThreadId, loadMessages]);

    const handleSendMessage = async () => {
        if (!activeThreadId || !composerValue.trim()) {
            return;
        }

        setSendLoading(true);
        try {
            await contentConversationService.sendMessage(activeThreadId, composerValue.trim(), composerMode, null);
            setComposerValue('');
            await Promise.all([loadMessages(activeThreadId), loadHierarchy(activeThreadId)]);
            message.success(composerMode === MessageTypeEnum.Note ? 'Đã gửi ghi chú.' : 'Đã gửi tin nhắn.');
        } catch (error) {
            console.error('Không gửi được tin nhắn:', error);
            message.error(error instanceof Error ? error.message : 'Không gửi được tin nhắn.');
        } finally {
            setSendLoading(false);
        }
    };

    const handleCreateThread = async (values: {
        title: string;
        thread_type: ThreadType;
        visibility: ConversationVisibility;
        invite_users?: string[];
    }) => {
        const parentThreadId = activeThread?._id || hierarchy?.mainThread?._id;
        if (!parentThreadId) {
            message.warning('Chưa xác định được luồng cha để tạo thảo luận mới.');
            return;
        }

        setCreateThreadLoading(true);
        try {
            const createdThread = await contentConversationService.createSubThread(parentThreadId, {
                title: values.title.trim(),
                thread_type: values.thread_type,
                visibility: values.visibility,
                invite_users: values.invite_users || [],
            });

            setCreateThreadOpen(false);
            createThreadForm.resetFields();
            await loadHierarchy(createdThread._id);
            message.success('Đã tạo luồng thảo luận mới.');
        } catch (error) {
            console.error('Không tạo được sub-thread:', error);
            message.error(error instanceof Error ? error.message : 'Không tạo được luồng thảo luận.');
        } finally {
            setCreateThreadLoading(false);
        }
    };

    const handleInviteMembers = async (values: { usernames?: string[] }) => {
        if (!activeThread?._id) {
            message.warning('Vui lòng chọn một luồng thảo luận trước.');
            return;
        }

        setInviteLoading(true);
        try {
            await contentConversationService.inviteThreadUsers(activeThread._id, values.usernames || []);
            setInviteOpen(false);
            inviteForm.resetFields();
            await loadHierarchy(activeThread._id);
            message.success('Đã mời thêm thành viên vào luồng.');
        } catch (error) {
            console.error('Không mời được thành viên:', error);
            message.error(error instanceof Error ? error.message : 'Không mời được thành viên.');
        } finally {
            setInviteLoading(false);
        }
    };

    const isComposerDisabled = !activeThread
        || [ThreadStatus.Archived, ThreadStatus.Locked, ThreadStatus.Deleted].includes(activeThread.status);

    return (
        <Card
            className={className}
            style={{
                borderRadius: 20,
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                ...style,
            }}
            bodyStyle={{ padding: 0 }}
        >
            <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 16,
                        flexWrap: 'wrap',
                    }}
                >
                    <div>
                        <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            Chatbox dùng chung
                        </Text>
                        <Title level={4} style={{ margin: '6px 0 4px' }}>
                            {title}
                        </Title>
                        <Text type="secondary">{subtitle}</Text>
                    </div>

                    <Space wrap>
                        <Button icon={<ReloadOutlined />} onClick={() => loadHierarchy(activeThreadId || undefined)} loading={hierarchyLoading}>
                            Tải lại
                        </Button>
                        <Button icon={<UserAddOutlined />} disabled={!activeThread?._id} onClick={() => setInviteOpen(true)}>
                            Mời thành viên
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} disabled={!hierarchy?.mainThread?._id} onClick={() => setCreateThreadOpen(true)}>
                            Tạo luồng
                        </Button>
                    </Space>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '320px minmax(0, 1fr)', minHeight: 640 }}>
                <div
                    style={{
                        borderRight: isCompact ? 'none' : '1px solid #f1f5f9',
                        borderBottom: isCompact ? '1px solid #f1f5f9' : 'none',
                        background: '#fbfdff',
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
                        <Card size="small" bodyStyle={{ padding: 12 }}>
                            <Text type="secondary">Tổng luồng</Text>
                            <Title level={4} style={{ margin: '6px 0 0' }}>{allThreads.length}</Title>
                        </Card>
                        <Card size="small" bodyStyle={{ padding: 12 }}>
                            <Text type="secondary">Chưa đọc</Text>
                            <Title level={4} style={{ margin: '6px 0 0' }}>{hierarchy?.totalUnread ?? 0}</Title>
                        </Card>
                        <Card size="small" bodyStyle={{ padding: 12 }}>
                            <Text type="secondary">Đang chọn</Text>
                            <Title level={5} style={{ margin: '6px 0 0' }}>
                                {activeThread ? THREAD_TYPE_LABEL[activeThread.thread_type] : '—'}
                            </Title>
                        </Card>
                    </div>

                    <div style={{ display: 'grid', gap: 8, overflowY: 'auto', paddingRight: 4, maxHeight: isCompact ? 320 : undefined }}>
                        {hierarchyLoading && allThreads.length === 0 ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                                <Spin />
                            </div>
                        ) : allThreads.length === 0 ? (
                            <Empty description="Chưa có luồng thảo luận" />
                        ) : (
                            allThreads.map((thread) => {
                                const isActive = thread._id === activeThreadId;
                                const lastMessageAt = parseDateValue(thread.last_message_at);

                                return (
                                    <button
                                        key={thread._id}
                                        type="button"
                                        onClick={() => setActiveThreadId(thread._id)}
                                        style={{
                                            textAlign: 'left',
                                            borderRadius: 16,
                                            border: isActive ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
                                            background: isActive ? '#eff6ff' : '#ffffff',
                                            padding: 14,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                gap: 10,
                                            }}
                                        >
                                            <Space align="start" size={10}>
                                                <Avatar size={36} style={{ background: getAvatarColor(thread.title) }} icon={getThreadIcon(thread.thread_type)} />
                                                <div style={{ minWidth: 0 }}>
                                                    <Text strong style={{ display: 'block' }}>
                                                        {thread.title}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {THREAD_TYPE_LABEL[thread.thread_type]}
                                                    </Text>
                                                </div>
                                            </Space>

                                            <Badge count={unreadMap.get(thread._id) || 0} />
                                        </div>

                                        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            <Tag color={THREAD_STATUS_COLOR[thread.status]} style={{ marginInlineEnd: 0 }}>
                                                {THREAD_STATUS_LABEL[thread.status]}
                                            </Tag>
                                            <Tag icon={getVisibilityIcon(thread.visibility)} style={{ marginInlineEnd: 0 }}>
                                                {VISIBILITY_LABEL[thread.visibility]}
                                            </Tag>
                                            <Tag style={{ marginInlineEnd: 0 }}>
                                                {thread.participants?.length || 0} thành viên
                                            </Tag>
                                        </div>

                                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {thread.last_message_preview || 'Chưa có tin nhắn'}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                                                {lastMessageAt ? lastMessageAt.format('DD/MM HH:mm') : '—'}
                                            </Text>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div
                        style={{
                            padding: 18,
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 16,
                            flexWrap: 'wrap',
                        }}
                    >
                        {activeThread ? (
                            <>
                                <div>
                                    <Space align="center" size={10}>
                                        <Avatar size={42} style={{ background: getAvatarColor(activeThread.title) }} icon={getThreadIcon(activeThread.thread_type)} />
                                        <div>
                                            <Title level={4} style={{ margin: 0 }}>
                                                {activeThread.title}
                                            </Title>
                                            <Space size={8} wrap style={{ marginTop: 6 }}>
                                                <Tag color={THREAD_STATUS_COLOR[activeThread.status]} style={{ marginInlineEnd: 0 }}>
                                                    {THREAD_STATUS_LABEL[activeThread.status]}
                                                </Tag>
                                                <Tag icon={getVisibilityIcon(activeThread.visibility)} style={{ marginInlineEnd: 0 }}>
                                                    {VISIBILITY_LABEL[activeThread.visibility]}
                                                </Tag>
                                                <Tag style={{ marginInlineEnd: 0 }}>
                                                    {activeThread.participants?.length || 0} thành viên
                                                </Tag>
                                            </Space>
                                        </div>
                                    </Space>
                                </div>

                                <div style={{ minWidth: isCompact ? '100%' : 260 }}>
                                    <Text strong style={{ display: 'block', marginBottom: 8 }}>
                                        Thành viên
                                    </Text>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {(activeThread.participants || []).slice(0, 8).map((participant) => (
                                            <Tag key={participant.username} style={{ marginInlineEnd: 0 }}>
                                                {participant.display_name || participant.username}
                                            </Tag>
                                        ))}
                                        {(activeThread.participants || []).length === 0 && (
                                            <Text type="secondary">Chưa có danh sách thành viên.</Text>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Empty description="Vui lòng chọn một luồng thảo luận" />
                        )}
                    </div>

                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: 20,
                            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                        }}
                    >
                        {messagesLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                                <Spin />
                            </div>
                        ) : !activeThread ? (
                            <Empty description="Chưa có luồng nào được chọn" />
                        ) : timelineItems.length === 0 ? (
                            <Empty description="Luồng này chưa có tin nhắn nào" />
                        ) : (
                            timelineItems.map((item, index) => {
                                const currentDate = parseDateValue(item.createdAt);
                                const previousDate = index > 0 ? parseDateValue(timelineItems[index - 1].createdAt) : null;
                                const shouldShowDateSeparator = !currentDate
                                    ? false
                                    : !previousDate || previousDate.format('YYYY-MM-DD') !== currentDate.format('YYYY-MM-DD');
                                const isMine = Boolean(currentUsername) && item.createdBy === currentUsername;

                                return (
                                    <React.Fragment key={item._id || `${item.createdBy}-${index}`}>
                                        {shouldShowDateSeparator && currentDate && (
                                            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 18px' }}>
                                                <Tag style={{ padding: '4px 12px', borderRadius: 999 }}>
                                                    {currentDate.format('dddd, DD/MM/YYYY')}
                                                </Tag>
                                            </div>
                                        )}
                                        <MessageBubble item={item} isMine={isMine} />
                                    </React.Fragment>
                                );
                            })
                        )}
                    </div>

                    <div style={{ padding: 18, borderTop: '1px solid #f1f5f9', background: '#ffffff' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 12,
                                flexWrap: 'wrap',
                                marginBottom: 12,
                            }}
                        >
                            <Segmented
                                options={composerModeOptions}
                                value={composerMode}
                                onChange={(value) => setComposerMode(value as MessageTypeEnum)}
                            />

                            {isComposerDisabled && (
                                <Tag color="warning" style={{ marginInlineEnd: 0 }}>
                                    Luồng hiện tại không cho phép gửi thêm tin nhắn
                                </Tag>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12, alignItems: 'end' }}>
                            <TextArea
                                autoSize={{ minRows: 3, maxRows: 6 }}
                                value={composerValue}
                                disabled={isComposerDisabled}
                                onChange={(event) => setComposerValue(event.target.value)}
                                placeholder={composerMode === MessageTypeEnum.Note
                                    ? 'Nhập ghi chú nội bộ cho luồng này...'
                                    : 'Nhập nội dung trao đổi...'}
                            />
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                loading={sendLoading}
                                disabled={isComposerDisabled || !composerValue.trim()}
                                onClick={handleSendMessage}
                            >
                                Gửi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Tạo luồng thảo luận mới"
                open={createThreadOpen}
                onCancel={() => setCreateThreadOpen(false)}
                onOk={() => createThreadForm.submit()}
                okText="Tạo luồng"
                cancelText="Hủy"
                confirmLoading={createThreadLoading}
                destroyOnClose
            >
                <Form
                    form={createThreadForm}
                    layout="vertical"
                    initialValues={{
                        thread_type: ThreadType.Discussion,
                        visibility: ConversationVisibility.Internal,
                        invite_users: [],
                    }}
                    onFinish={handleCreateThread}
                >
                    <Form.Item name="title" label="Tên luồng" rules={[{ required: true, message: 'Vui lòng nhập tên luồng.' }]}>
                        <Input placeholder="Ví dụ: Chốt phương án khảo sát mái" />
                    </Form.Item>

                    <Form.Item name="thread_type" label="Loại luồng">
                        <Select
                            options={Object.values(ThreadType).map((value) => ({
                                value,
                                label: THREAD_TYPE_LABEL[value],
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="visibility" label="Phạm vi hiển thị">
                        <Select
                            options={Object.values(ConversationVisibility).map((value) => ({
                                value,
                                label: VISIBILITY_LABEL[value],
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="invite_users" label="Mời thành viên ban đầu">
                        <AuthorizedUserSelect allowMultiple size="middle" placeholder="Chọn username để mời vào luồng" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Mời thêm thành viên"
                open={inviteOpen}
                onCancel={() => setInviteOpen(false)}
                onOk={() => inviteForm.submit()}
                okText="Mời thành viên"
                cancelText="Hủy"
                confirmLoading={inviteLoading}
                destroyOnClose
            >
                <Form form={inviteForm} layout="vertical" onFinish={handleInviteMembers}>
                    <Form.Item
                        name="usernames"
                        label="Danh sách username"
                        rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thành viên.' }]}
                    >
                        <AuthorizedUserSelect allowMultiple size="middle" placeholder="Chọn người cần mời vào luồng hiện tại" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
