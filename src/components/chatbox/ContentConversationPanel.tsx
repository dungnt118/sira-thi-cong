import {
    CloseOutlined,
    CommentOutlined,
    DeleteOutlined,
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
import { Avatar, Badge, Button, Card, Empty, Form, Grid, Input, Modal, Segmented, Select, Space, Spin, Tag, Tooltip, Typography, message } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { query as runQuery } from '../../services/graphqlService';
import { getFileLink } from '../../services/storeService';
import { FIND_SCHEMA_BY_NAME } from '../../store/actions/schemas/query';
import { useAuth } from '../../hooks/useAuth';
import { AuthorizedUserSelect } from '../authorizedusers/AuthorizedUser';
import { IUploadFilesEditRef, UploadFilesEdit } from '../files/UploadFiles';
import { contentConversationService } from './contentConversation.service';
import { ConversationVisibility, IChatboxSettings, IContentConversationPanelProps, IContentChatboxMessage, IConversationParticipant, IConversationThread, IHeadlessFileUpload, MessageTypeEnum, ThreadStatus, ThreadType } from './contentConversation.types';

const { Text, Title } = Typography;
const { TextArea } = Input;
const MANUAL_THREAD_TYPES: ThreadType[] = [ThreadType.Discussion, ThreadType.Escalation, ThreadType.Private, ThreadType.External];
const composerModeOptions = [{ label: 'Tin nhắn', value: MessageTypeEnum.Message }, { label: 'Ghi chú', value: MessageTypeEnum.Note }];
const THREAD_TYPE_LABEL: Record<ThreadType, string> = { Main: 'Luồng chính', Discussion: 'Thảo luận', Escalation: 'Escalation', Private: 'Riêng tư', External: 'External' };
const THREAD_STATUS_LABEL: Record<ThreadStatus, string> = { Active: 'Đang mở', Archived: 'Lưu trữ', Locked: 'Khóa', Deleted: 'Đã xóa' };
const THREAD_STATUS_COLOR: Record<ThreadStatus, string> = { Active: 'success', Archived: 'default', Locked: 'warning', Deleted: 'error' };
const VISIBILITY_LABEL: Record<ConversationVisibility, string> = { Private: 'Riêng tư', Internal: 'Nội bộ', Public: 'Công khai', Restricted: 'Hạn chế' };
const isThreadType = (value: unknown): value is ThreadType => typeof value === 'string' && Object.values(ThreadType).includes(value as ThreadType);
const isVisibility = (value: unknown): value is ConversationVisibility => typeof value === 'string' && Object.values(ConversationVisibility).includes(value as ConversationVisibility);
const parseDateValue = (value: unknown) => { const parsed = dayjs(value as any); return parsed.isValid() ? parsed : null; };
const getAvatarColor = (value?: string) => ['#1d4ed8', '#7c3aed', '#0f766e', '#d97706', '#be123c', '#2563eb'][(value || '').split('').reduce((t, c) => t + c.charCodeAt(0), 0) % 6];
const getAttachmentLink = (attachment: { file_id?: string; url?: string; file_path?: string }) => attachment.url || getFileLink(attachment.file_id || attachment.file_path);
const getThreadIcon = (type?: ThreadType) => type === ThreadType.Discussion ? <CommentOutlined /> : type === ThreadType.Escalation ? <ExclamationCircleOutlined /> : type === ThreadType.Private ? <LockOutlined /> : type === ThreadType.External ? <GlobalOutlined /> : <MessageOutlined />;
const getVisibilityIcon = (visibility?: ConversationVisibility) => visibility === ConversationVisibility.Private ? <LockOutlined /> : visibility === ConversationVisibility.Public ? <GlobalOutlined /> : visibility === ConversationVisibility.Restricted ? <SafetyCertificateOutlined /> : <TeamOutlined />;
const normalizeChatboxSettings = (value: unknown): IChatboxSettings | undefined => {
    if (!value || typeof value !== 'object') return undefined;
    const source = value as Record<string, unknown>;
    return {
        ...source,
        enable_file_sharing: typeof source.enable_file_sharing === 'boolean' ? source.enable_file_sharing : true,
        enable_mentions: typeof source.enable_mentions === 'boolean' ? source.enable_mentions : true,
        enable_sub_threads: typeof source.enable_sub_threads === 'boolean' ? source.enable_sub_threads : true,
        enable_comment: typeof source.enable_comment === 'boolean' ? source.enable_comment : undefined,
        default_visibility: isVisibility(source.default_visibility) ? source.default_visibility : ConversationVisibility.Internal,
        max_thread_depth: typeof source.max_thread_depth === 'number' ? source.max_thread_depth : 2,
        allowed_thread_types: Array.isArray(source.allowed_thread_types) ? source.allowed_thread_types.filter(isThreadType) : undefined,
    };
};
const getMessageDisplayText = (item: IContentChatboxMessage) => item.content?.trim() || (item.message_type === MessageTypeEnum.ContentChanged ? 'Hệ thống đã ghi nhận thay đổi dữ liệu.' : 'Tin nhắn không có nội dung văn bản.');

const MessageBubble: React.FC<{ item: IContentChatboxMessage; isMine: boolean }> = ({ item, isMine }) => {
    const createdAt = parseDateValue(item.createdAt);
    const attachments = Array.isArray(item.payload?.attachments) ? item.payload.attachments : [];
    return (
        <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            <div style={{ maxWidth: '78%' }}>
                <div style={{ borderRadius: 16, padding: 12, background: isMine ? '#1677ff' : '#fff', color: isMine ? '#fff' : '#1f2937', border: '1px solid rgba(15,23,42,.08)' }}>
                    {item.message_type === MessageTypeEnum.Note && <Tag color="gold" style={{ marginBottom: 8 }}>Ghi chú nội bộ</Tag>}
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: getMessageDisplayText(item) }} />
                    {attachments.length > 0 && <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>{attachments.map((attachment, index) => <a key={index} href={getAttachmentLink(attachment)} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: isMine ? 'rgba(255,255,255,.18)' : '#eef2ff', color: isMine ? '#fff' : '#1d4ed8' }}><PaperClipOutlined /><span>{attachment.name || attachment.file_path || `Tệp ${index + 1}`}</span></a>)}</div>}
                </div>
                <div style={{ marginTop: 6 }}><Text type="secondary" style={{ fontSize: 12 }}>{item.createdBy || 'Hệ thống'}{createdAt ? ` • ${createdAt.format('HH:mm DD/MM/YYYY')}` : ''}</Text></div>
            </div>
        </div>
    );
};

export default function ContentConversationPanel({ schemaName, contentId, title = 'Trao đổi nhóm', subtitle = 'Thảo luận nội bộ theo từng luồng công việc', settings, onClose, className, style }: IContentConversationPanelProps) {
    const { user } = useAuth();
    const currentUsername = user?.username || '';
    const screens = Grid.useBreakpoint();
    const isCompact = !screens.lg;
    const uploadFilesRef = useRef<IUploadFilesEditRef | null>(null);
    const [hierarchyLoading, setHierarchyLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [hierarchy, setHierarchy] = useState<any>(null);
    const [messages, setMessages] = useState<IContentChatboxMessage[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [composerMode, setComposerMode] = useState<MessageTypeEnum>(MessageTypeEnum.Message);
    const [composerValue, setComposerValue] = useState('');
    const [pendingAttachments, setPendingAttachments] = useState<IHeadlessFileUpload[]>([]);
    const [sendLoading, setSendLoading] = useState(false);
    const [createThreadOpen, setCreateThreadOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [createThreadLoading, setCreateThreadLoading] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [resolvedSettings, setResolvedSettings] = useState<IChatboxSettings | undefined>(settings);
    const [createThreadForm] = Form.useForm();
    const [inviteForm] = Form.useForm();

    const allThreads = useMemo<IConversationThread[]>(() => hierarchy ? [hierarchy.mainThread, ...(hierarchy.autoThreads || []), ...(hierarchy.subThreads || [])].filter((item): item is IConversationThread => Boolean(item?._id)) : [], [hierarchy]);
    const threadMap = useMemo(() => new Map(allThreads.map((thread) => [thread._id, thread])), [allThreads]);
    const unreadMap = useMemo(() => new Map((hierarchy?.unreadByThread || []).filter((item: any) => item?.threadId).map((item: any) => [item.threadId, Number(item.count || 0)])), [hierarchy]);
    const activeThread = useMemo(() => allThreads.find((item) => item._id === activeThreadId) ?? null, [activeThreadId, allThreads]);
    const activeParticipant = useMemo<IConversationParticipant | null>(() => activeThread?.participants?.find((item) => item.username === currentUsername) ?? null, [activeThread, currentUsername]);

    const enableComment = resolvedSettings?.enable_comment ?? true;
    const enableFileSharing = resolvedSettings?.enable_file_sharing ?? true;
    const enableMentions = resolvedSettings?.enable_mentions ?? true;
    const allowedThreadTypes = resolvedSettings?.allowed_thread_types?.length ? resolvedSettings.allowed_thread_types : MANUAL_THREAD_TYPES;
    const defaultVisibility = isVisibility(resolvedSettings?.default_visibility) ? resolvedSettings.default_visibility : ConversationVisibility.Internal;
    const maxThreadDepth = typeof resolvedSettings?.max_thread_depth === 'number' ? resolvedSettings.max_thread_depth : 2;
    const getThreadDepth = useCallback((thread: IConversationThread | null) => {
        let depth = 0;
        let cursor = thread;
        while (cursor) {
            depth += 1;
            cursor = cursor.parent_thread_id ? threadMap.get(cursor.parent_thread_id) ?? null : null;
        }
        return depth;
    }, [threadMap]);
    const canSendMessageToThread = activeParticipant?.permissions?.can_send_message ?? enableComment;
    const canInviteMember = activeParticipant?.permissions?.can_invite ?? true;
    const canCreateSubThread = (resolvedSettings?.enable_sub_threads ?? true) && (maxThreadDepth === 0 || getThreadDepth(activeThread) < maxThreadDepth);
    const isComposerDisabled = !activeThread || !canSendMessageToThread || [ThreadStatus.Archived, ThreadStatus.Locked, ThreadStatus.Deleted].includes(activeThread.status);
    const canSendCurrentPayload = Boolean(composerValue.trim()) || pendingAttachments.length > 0;

    useEffect(() => { setResolvedSettings(settings); }, [settings]);
    useEffect(() => {
        let cancelled = false;
        if (settings) return;
        runQuery<any>(FIND_SCHEMA_BY_NAME, { name: schemaName })
            .then((response) => { if (!cancelled) setResolvedSettings(normalizeChatboxSettings(response?.data?.chatboxSetting ?? response?.data?.chatbox_setting)); })
            .catch((error) => console.warn('Không tải được chatboxSetting của schema:', error));
        return () => { cancelled = true; };
    }, [schemaName, settings]);

    const loadHierarchy = useCallback(async (preferredThreadId?: string) => {
        setHierarchyLoading(true);
        try {
            const response = await contentConversationService.getThreadHierarchy(schemaName, contentId, true);
            setHierarchy(response);
            const availableThreadIds = [response.mainThread?._id, ...(response.autoThreads || []).map((item) => item._id), ...(response.subThreads || []).map((item) => item._id)].filter(Boolean);
            setActiveThreadId(preferredThreadId && availableThreadIds.includes(preferredThreadId) ? preferredThreadId : activeThreadId && availableThreadIds.includes(activeThreadId) ? activeThreadId : availableThreadIds[0] || null);
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
            setMessages(await contentConversationService.getMessagesByThread(threadId));
        } catch (error) {
            console.error('Không tải được tin nhắn:', error);
            message.error(error instanceof Error ? error.message : 'Không tải được tin nhắn.');
        } finally {
            setMessagesLoading(false);
        }
    }, []);

    useEffect(() => { loadHierarchy(); }, [loadHierarchy]);
    useEffect(() => { activeThreadId ? loadMessages(activeThreadId) : setMessages([]); }, [activeThreadId, loadMessages]);
    useEffect(() => { createThreadForm.setFieldsValue({ thread_type: allowedThreadTypes[0] || ThreadType.Discussion, visibility: defaultVisibility }); }, [allowedThreadTypes, createThreadForm, defaultVisibility]);

    const handleSendMessage = async () => {
        if (!activeThreadId || !canSendCurrentPayload) return;
        setSendLoading(true);
        try {
            await contentConversationService.sendMessage(activeThreadId, composerValue.trim() || 'Đính kèm tệp', composerMode, pendingAttachments.length ? { attachments: pendingAttachments } : null);
            setComposerValue('');
            setPendingAttachments([]);
            await Promise.all([loadMessages(activeThreadId), loadHierarchy(activeThreadId)]);
            message.success(composerMode === MessageTypeEnum.Note ? 'Đã gửi ghi chú.' : 'Đã gửi tin nhắn.');
        } catch (error) {
            console.error('Không gửi được tin nhắn:', error);
            message.error(error instanceof Error ? error.message : 'Không gửi được tin nhắn.');
        } finally {
            setSendLoading(false);
        }
    };

    const handleCreateThread = async (values: { title: string; thread_type: ThreadType; visibility: ConversationVisibility; invite_users?: string[] }) => {
        const parentThreadId = activeThread?._id || hierarchy?.mainThread?._id;
        if (!parentThreadId) return message.warning('Chưa xác định được luồng cha để tạo thảo luận mới.');
        setCreateThreadLoading(true);
        try {
            const createdThread = await contentConversationService.createSubThread(parentThreadId, { title: values.title.trim(), thread_type: values.thread_type, visibility: values.visibility, invite_users: values.invite_users || [] });
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
        if (!activeThread?._id) return message.warning('Vui lòng chọn một luồng thảo luận trước.');
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

    return (
        <Card className={className} style={{ borderRadius: 20, border: '1px solid #e5e7eb', overflow: 'hidden', ...style }} bodyStyle={{ padding: 0 }}>
            <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Chatbox dùng chung</Text>
                        <Title level={4} style={{ margin: '6px 0 4px' }}>{title}</Title>
                        <Text type="secondary">{subtitle}</Text>
                    </div>
                    <Space wrap>
                        {enableMentions && <Tooltip title="Có thể mention bằng cú pháp @username."><Tag style={{ marginInlineEnd: 0 }}>Hỗ trợ @mention</Tag></Tooltip>}
                        <Button icon={<ReloadOutlined />} onClick={() => loadHierarchy(activeThreadId || undefined)} loading={hierarchyLoading}>Tải lại</Button>
                        <Button icon={<UserAddOutlined />} disabled={!activeThread?._id || !canInviteMember} onClick={() => setInviteOpen(true)}>Mời thành viên</Button>
                        <Button type="primary" icon={<PlusOutlined />} disabled={!canCreateSubThread} onClick={() => setCreateThreadOpen(true)}>Tạo luồng</Button>
                        {onClose && <Button icon={<CloseOutlined />} onClick={onClose}>Đóng</Button>}
                    </Space>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '320px minmax(0, 1fr)', minHeight: 640 }}>
                <div style={{ borderRight: isCompact ? 'none' : '1px solid #f1f5f9', borderBottom: isCompact ? '1px solid #f1f9f9' : 'none', background: '#fbfdff', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
                        <Card size="small" bodyStyle={{ padding: 12 }}><Text type="secondary">Tổng luồng</Text><Title level={4} style={{ margin: '6px 0 0' }}>{allThreads.length}</Title></Card>
                        <Card size="small" bodyStyle={{ padding: 12 }}><Text type="secondary">Chưa đọc</Text><Title level={4} style={{ margin: '6px 0 0' }}>{hierarchy?.totalUnread ?? 0}</Title></Card>
                        <Card size="small" bodyStyle={{ padding: 12 }}><Text type="secondary">Đang chọn</Text><Title level={5} style={{ margin: '6px 0 0' }}>{activeThread ? THREAD_TYPE_LABEL[activeThread.thread_type] : '—'}</Title></Card>
                    </div>

                    <div style={{ display: 'grid', gap: 8, overflowY: 'auto', paddingRight: 4, maxHeight: isCompact ? 320 : undefined }}>
                        {hierarchyLoading && allThreads.length === 0 ? <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spin /></div> : allThreads.length === 0 ? <Empty description="Chưa có luồng thảo luận" /> : allThreads.map((thread) => {
                            const isActive = thread._id === activeThreadId;
                            const lastMessageAt = parseDateValue(thread.last_message_at);
                            return (
                                <button key={thread._id} type="button" onClick={() => setActiveThreadId(thread._id)} style={{ textAlign: 'left', borderRadius: 16, border: isActive ? '1px solid #bfdbfe' : '1px solid #e5e7eb', background: isActive ? '#eff6ff' : '#fff', padding: 14, cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                                        <Space align="start" size={10}><Avatar size={36} style={{ background: getAvatarColor(thread.title) }} icon={getThreadIcon(thread.thread_type)} /><div style={{ minWidth: 0 }}><Text strong style={{ display: 'block' }}>{thread.title}</Text><Text type="secondary" style={{ fontSize: 12 }}>{THREAD_TYPE_LABEL[thread.thread_type]}</Text></div></Space>
                                        <Badge count={unreadMap.get(thread._id) || 0} />
                                    </div>
                                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}><Tag color={THREAD_STATUS_COLOR[thread.status]} style={{ marginInlineEnd: 0 }}>{THREAD_STATUS_LABEL[thread.status]}</Tag><Tag icon={getVisibilityIcon(thread.visibility)} style={{ marginInlineEnd: 0 }}>{VISIBILITY_LABEL[thread.visibility]}</Tag></div>
                                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: 8 }}><Text type="secondary" style={{ fontSize: 12 }}>{thread.last_message_preview || 'Chưa có tin nhắn'}</Text><Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{lastMessageAt ? lastMessageAt.format('DD/MM HH:mm') : '—'}</Text></div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ padding: 18, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                        {activeThread ? (
                            <>
                                <div><Space align="center" size={10}><Avatar size={42} style={{ background: getAvatarColor(activeThread.title) }} icon={getThreadIcon(activeThread.thread_type)} /><div><Title level={4} style={{ margin: 0 }}>{activeThread.title}</Title><Space size={8} wrap style={{ marginTop: 6 }}><Tag color={THREAD_STATUS_COLOR[activeThread.status]} style={{ marginInlineEnd: 0 }}>{THREAD_STATUS_LABEL[activeThread.status]}</Tag><Tag icon={getVisibilityIcon(activeThread.visibility)} style={{ marginInlineEnd: 0 }}>{VISIBILITY_LABEL[activeThread.visibility]}</Tag><Tag style={{ marginInlineEnd: 0 }}>{activeThread.participants?.length || 0} thành viên</Tag></Space></div></Space></div>
                                <div style={{ minWidth: isCompact ? '100%' : 260 }}><Text strong style={{ display: 'block', marginBottom: 8 }}>Thành viên</Text><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{(activeThread.participants || []).slice(0, 8).map((participant) => <Tag key={participant.username} style={{ marginInlineEnd: 0 }}>{participant.display_name || participant.username}</Tag>)}</div></div>
                            </>
                        ) : <Empty description="Vui lòng chọn một luồng thảo luận" />}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
                        {messagesLoading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spin /></div> : !activeThread ? <Empty description="Chưa có luồng nào được chọn" /> : messages.length === 0 ? <Empty description="Luồng này chưa có tin nhắn nào" /> : messages.map((item, index) => {
                            const currentDate = parseDateValue(item.createdAt);
                            const previousDate = index > 0 ? parseDateValue(messages[index - 1].createdAt) : null;
                            const shouldShowDateSeparator = !currentDate ? false : !previousDate || previousDate.format('YYYY-MM-DD') !== currentDate.format('YYYY-MM-DD');
                            return (
                                <React.Fragment key={item._id || `${item.createdBy}-${index}`}>
                                    {shouldShowDateSeparator && currentDate && <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 18px' }}><Tag style={{ padding: '4px 12px', borderRadius: 999 }}>{currentDate.format('dddd, DD/MM/YYYY')}</Tag></div>}
                                    <MessageBubble item={item} isMine={Boolean(currentUsername) && item.createdBy === currentUsername} />
                                </React.Fragment>
                            );
                        })}
                    </div>

                    <div style={{ padding: 18, borderTop: '1px solid #f1f5f9', background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                            <Segmented options={composerModeOptions} value={composerMode} onChange={(value) => setComposerMode(value as MessageTypeEnum)} disabled={!enableComment} />
                            <Space wrap>{enableFileSharing && <Button icon={<PaperClipOutlined />} onClick={() => uploadFilesRef.current?.showModal()} disabled={isComposerDisabled}>Đính kèm</Button>}{isComposerDisabled && <Tag color="warning" style={{ marginInlineEnd: 0 }}>{canSendMessageToThread ? 'Luồng hiện tại không cho phép gửi thêm tin nhắn' : 'Bạn không có quyền gửi tin nhắn ở luồng này'}</Tag>}</Space>
                        </div>

                        {pendingAttachments.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>{pendingAttachments.map((attachment, index) => <div key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, border: '1px solid #dbeafe', background: '#eff6ff' }}><PaperClipOutlined style={{ color: '#2563eb' }} />{getAttachmentLink(attachment) ? <a href={getAttachmentLink(attachment)} target="_blank" rel="noreferrer">{attachment.name || attachment.file_path || `Tệp ${index + 1}`}</a> : <span>{attachment.name || attachment.file_path || `Tệp ${index + 1}`}</span>}<Button type="text" size="small" icon={<DeleteOutlined />} onClick={() => setPendingAttachments((current) => current.filter((_, currentIndex) => currentIndex !== index))} /></div>)}</div>}

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12, alignItems: 'end' }}>
                            <TextArea autoSize={{ minRows: 3, maxRows: 6 }} value={composerValue} disabled={isComposerDisabled} onChange={(event) => setComposerValue(event.target.value)} placeholder={composerMode === MessageTypeEnum.Note ? 'Nhập ghi chú nội bộ cho luồng này...' : 'Nhập nội dung trao đổi...'} />
                            <Button type="primary" icon={<SendOutlined />} loading={sendLoading} disabled={isComposerDisabled || !canSendCurrentPayload} onClick={handleSendMessage}>Gửi</Button>
                        </div>
                        {enableMentions && <Text type="secondary" style={{ display: 'block', marginTop: 10 }}>Mẹo: bạn có thể mention đồng nghiệp bằng cú pháp <Text code>@username</Text>.</Text>}
                    </div>
                </div>
            </div>

            <div style={{ display: 'none' }}>
                <UploadFilesEdit ref={uploadFilesRef} value={pendingAttachments as any} onChange={(value) => setPendingAttachments((value || []) as unknown as IHeadlessFileUpload[])} />
            </div>

            <Modal title="Tạo luồng thảo luận mới" open={createThreadOpen} onCancel={() => setCreateThreadOpen(false)} onOk={() => createThreadForm.submit()} okText="Tạo luồng" cancelText="Hủy" confirmLoading={createThreadLoading} destroyOnClose>
                <Form form={createThreadForm} layout="vertical" initialValues={{ thread_type: allowedThreadTypes[0] || ThreadType.Discussion, visibility: defaultVisibility, invite_users: [] }} onFinish={handleCreateThread}>
                    <Form.Item name="title" label="Tên luồng" rules={[{ required: true, message: 'Vui lòng nhập tên luồng.' }]}><Input placeholder="Ví dụ: Chốt phương án khảo sát mái" /></Form.Item>
                    <Form.Item name="thread_type" label="Loại luồng"><Select options={allowedThreadTypes.map((value) => ({ value, label: THREAD_TYPE_LABEL[value] }))} /></Form.Item>
                    <Form.Item name="visibility" label="Phạm vi hiển thị"><Select options={Object.values(ConversationVisibility).map((value) => ({ value, label: VISIBILITY_LABEL[value] }))} /></Form.Item>
                    <Form.Item name="invite_users" label="Mời thành viên ban đầu"><AuthorizedUserSelect allowMultiple size="middle" placeholder="Chọn username để mời vào luồng" /></Form.Item>
                </Form>
            </Modal>

            <Modal title="Mời thêm thành viên" open={inviteOpen} onCancel={() => setInviteOpen(false)} onOk={() => inviteForm.submit()} okText="Mời thành viên" cancelText="Hủy" confirmLoading={inviteLoading} destroyOnClose>
                <Form form={inviteForm} layout="vertical" onFinish={handleInviteMembers}>
                    <Form.Item name="usernames" label="Danh sách username" rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thành viên.' }]}>
                        <AuthorizedUserSelect allowMultiple size="middle" placeholder="Chọn người cần mời vào luồng hiện tại" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
