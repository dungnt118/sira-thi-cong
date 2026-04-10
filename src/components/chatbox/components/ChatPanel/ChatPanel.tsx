import { ArrowLeftOutlined, LinkOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List, Modal, Spin, message } from 'antd';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { get_schema_by_name } from '@/store/actions/schemas/schemas.action';
import { useAppDispatch } from '@/store/hooks';
import { IUploadFilesEditRef, UploadFilesEdit } from '@/components/files/UploadFiles';
import { IUploadImageEditRef, UploadImageEdit } from '@/components/files/UploadImage';
import { contentConversationService } from '../../contentConversation.service';
import {
    ComposerMode,
    ConversationVisibility,
    type ChatPanelLayoutMode,
    type IChatboxSettings,
    type IContentChatboxMessage,
    type IConversationParticipant,
    type IConversationThread,
    type ICreateSubThreadInput,
    type IHeadlessFileUpload,
    type ILinkedContentSchemaOption,
    type IMessageLinkedContentPayload,
    type IMessageSchedulePayload,
    type IThreadHierarchyResponse,
    MessageTypeEnum,
    ThreadStatus,
    ThreadType,
} from '../../contentConversation.types';
import { getAvatarColor, getInitials } from '../../utils/chatboxUtils';
import AddThreadMembersModal from '../AddThreadMembersModal/AddThreadMembersModal';
import Composer, { type IComposerRef } from '../Composer/Composer';
import CreateSubThreadDrawer from '../CreateSubThreadDrawer/CreateSubThreadDrawer';
import MessageTimeline from '../MessageTimeline/MessageTimeline';
import PanelHeader from '../PanelHeader/PanelHeader';
import ThreadBar from '../ThreadBar/ThreadBar';
import TimelineFilterBar, { filterMessages, type ICreatorOption, type ITimelineFilterState } from '../TimelineFilterBar/TimelineFilterBar';
import './ChatPanel.less';

interface IChatPanelProps {
    schemaName: string;
    contentId: string;
    title?: string;
    subtitle?: string;
    settings?: IChatboxSettings;
    onClose?: () => void;
    onLayoutModeChange?: (mode: ChatPanelLayoutMode) => void;
    className?: string;
    style?: CSSProperties;
}

const DEFAULT_FILTER_STATE: ITimelineFilterState = {
    searchText: '',
    messageType: '',
    changeType: '',
    from: null,
    to: null,
    createdBy: '',
    attachmentsOnly: false,
};

const DEFAULT_ALLOWED_THREAD_TYPES: ThreadType[] = [
    ThreadType.Discussion,
    ThreadType.Private,
    ThreadType.Escalation,
    ThreadType.External,
];

const getMessageTypeFromComposerMode = (mode: ComposerMode): MessageTypeEnum => {
    switch (mode) {
        case ComposerMode.Note:
            return MessageTypeEnum.Note;
        case ComposerMode.Schedule:
            return MessageTypeEnum.Schedule;
        case ComposerMode.LinkedContent:
            return MessageTypeEnum.LinkedContent;
        case ComposerMode.Message:
        default:
            return MessageTypeEnum.Message;
    }
};

const extractMentions = (content: string): string[] => {
    const matches = Array.from(content.matchAll(/@(\w+(?:\.\w+)*)/g));
    return Array.from(new Set(matches.map((match) => match[1]).filter(Boolean)));
};

const resolveLinkedContentOptions = async (
    dispatch: ReturnType<typeof useAppDispatch>,
    schemaName: string,
    settings?: IChatboxSettings,
): Promise<ILinkedContentSchemaOption[]> => {
    const currentSchema = await dispatch(get_schema_by_name(schemaName));
    const optionSeed = new Map<string, string>();

    optionSeed.set(schemaName.toLowerCase(), currentSchema?.label?.trim() || schemaName);

    (settings?.related_schema_policies || []).forEach((policy) => {
        const targetSchema = policy?.target_schema?.trim();
        if (!targetSchema) {
            return;
        }

        optionSeed.set(targetSchema.toLowerCase(), policy.label?.trim() || targetSchema);
    });

    const resolved = await Promise.all(
        Array.from(optionSeed.entries()).map(async ([normalizedSchema, fallbackLabel]) => {
            const schemaKey = Array.from(optionSeed.keys()).find((item) => item === normalizedSchema);
            const schemaValue = schemaKey
                ? Array.from(optionSeed.entries()).find(([key]) => key === schemaKey)?.[0]
                : normalizedSchema;
            const originalSchemaName = Array.from([schemaName, ...(settings?.related_schema_policies || []).map((item) => item.target_schema || '')])
                .find((item) => item?.trim().toLowerCase() === normalizedSchema)
                || schemaValue
                || normalizedSchema;

            try {
                const schemaDefinition = await dispatch(get_schema_by_name(originalSchemaName));
                return {
                    value: originalSchemaName,
                    label: schemaDefinition?.label?.trim() || fallbackLabel,
                };
            } catch {
                return {
                    value: originalSchemaName,
                    label: fallbackLabel,
                };
            }
        }),
    );

    return resolved.filter((item, index, array) =>
        array.findIndex((candidate) => candidate.value.trim().toLowerCase() === item.value.trim().toLowerCase()) === index,
    );
};

export default function ChatPanel({
    schemaName,
    contentId,
    title,
    subtitle,
    settings,
    onClose,
    onLayoutModeChange,
    className,
    style,
}: IChatPanelProps) {
    const dispatch = useAppDispatch();
    const { user, isAdmin } = useAuth();
    const currentUsername = user?.username || '';
    const composerRef = useRef<IComposerRef>(null);
    const uploadFilesRef = useRef<IUploadFilesEditRef | null>(null);
    const uploadImageRef = useRef<IUploadImageEditRef | null>(null);

    const [panelWidth, setPanelWidth] = useState<ChatPanelLayoutMode>('expanded');

    useEffect(() => {
        onLayoutModeChange?.(panelWidth);
    }, [panelWidth, onLayoutModeChange]);
    const [loadingHierarchy, setLoadingHierarchy] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [hierarchy, setHierarchy] = useState<IThreadHierarchyResponse | null>(null);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [messages, setMessages] = useState<IContentChatboxMessage[]>([]);
    const [replyToMessage, setReplyToMessage] = useState<IContentChatboxMessage | null>(null);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showFilterToolbar, setShowFilterToolbar] = useState(false);
    const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
    const [addMembersModalOpen, setAddMembersModalOpen] = useState(false);
    const [showCreateSubThreadDrawer, setShowCreateSubThreadDrawer] = useState(false);
    const [pendingAttachments, setPendingAttachments] = useState<IHeadlessFileUpload[]>([]);
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkedContentSchemaOptions, setLinkedContentSchemaOptions] = useState<ILinkedContentSchemaOption[]>([]);
    const [linkedContentSchemaLoading, setLinkedContentSchemaLoading] = useState(false);
    const [filterState, setFilterState] = useState<ITimelineFilterState>(DEFAULT_FILTER_STATE);

    const allThreads = useMemo<IConversationThread[]>(
        () => hierarchy ? [hierarchy.mainThread, ...(hierarchy.autoThreads || []), ...(hierarchy.subThreads || [])] : [],
        [hierarchy],
    );

    const threadMap = useMemo(
        () => new Map(allThreads.map((thread) => [thread._id, thread])),
        [allThreads],
    );

    const unreadBadges = hierarchy?.unreadByThread || [];

    const activeThread = useMemo(
        () => (activeThreadId ? allThreads.find((thread) => thread._id === activeThreadId) || null : hierarchy?.mainThread || null),
        [activeThreadId, allThreads, hierarchy],
    );

    const activeParticipant = useMemo(
        () => activeThread?.participants?.find((participant) => participant.username === currentUsername) || null,
        [activeThread, currentUsername],
    );

    const currentThreadDepth = useMemo(() => {
        let depth = 0;
        let cursor = activeThread;

        while (cursor) {
            depth += 1;
            cursor = cursor.parent_thread_id ? threadMap.get(cursor.parent_thread_id) || null : null;
        }

        return depth;
    }, [activeThread, threadMap]);

    const allowedThreadTypes = settings?.allowed_thread_types?.length
        ? settings.allowed_thread_types
        : DEFAULT_ALLOWED_THREAD_TYPES;
    const defaultVisibility = (settings?.default_visibility as ConversationVisibility) || ConversationVisibility.Internal;
    const maxThreadDepth = typeof settings?.max_thread_depth === 'number' ? settings.max_thread_depth : 2;
    const enableMentions = settings?.enable_mentions !== false;
    const enableFileSharing = settings?.enable_file_sharing !== false;
    const canSendMessage = activeParticipant?.permissions?.can_send_message ?? (settings?.enable_comment !== false);
    const canInviteMembers = isAdmin || (activeParticipant?.permissions?.can_invite ?? true);
    const canCreateSubThread = Boolean(
        activeThread
        && settings?.enable_sub_threads !== false
        && activeThread.status === ThreadStatus.Active
        && (maxThreadDepth === 0 || currentThreadDepth < maxThreadDepth),
    );

    const createdByOptions = useMemo<ICreatorOption[]>(() => {
        const usernames = Array.from(new Set(messages.map((item) => item.createdBy?.trim()).filter(Boolean) as string[]));
        return usernames
            .sort((left, right) => left.localeCompare(right))
            .map((username) => ({ value: username, label: username }));
    }, [messages]);

    const filteredMessages = useMemo(
        () => filterMessages(messages, filterState),
        [filterState, messages],
    );

    const hasActiveFilter = useMemo(
        () => Boolean(
            filterState.searchText.trim()
            || filterState.messageType
            || filterState.changeType
            || filterState.from
            || filterState.to
            || filterState.createdBy
            || filterState.attachmentsOnly,
        ),
        [filterState],
    );

    const loadHierarchy = useCallback(async (preferredThreadId?: string) => {
        setLoadingHierarchy(true);
        try {
            const nextHierarchy = await contentConversationService.getThreadHierarchy(schemaName, contentId, true);
            setHierarchy(nextHierarchy);

            const availableThreadIds = [
                nextHierarchy.mainThread?._id,
                ...(nextHierarchy.autoThreads || []).map((thread) => thread._id),
                ...(nextHierarchy.subThreads || []).map((thread) => thread._id),
            ].filter(Boolean);

            setActiveThreadId((currentActiveThreadId) => {
                if (preferredThreadId && availableThreadIds.includes(preferredThreadId)) {
                    return preferredThreadId;
                }

                if (currentActiveThreadId && availableThreadIds.includes(currentActiveThreadId)) {
                    return currentActiveThreadId;
                }

                return availableThreadIds[0] || null;
            });
        } catch (error) {
            console.error('Không tải được cấu trúc chatbox:', error);
            message.error(error instanceof Error ? error.message : 'Không tải được dữ liệu chatbox.');
        } finally {
            setLoadingHierarchy(false);
        }
    }, [contentId, schemaName]);

    const loadMessages = useCallback(async (threadId: string) => {
        setLoadingMessages(true);
        try {
            const nextMessages = await contentConversationService.getMessagesByThread(threadId, {
                skip: 0,
                limit: 100,
            });
            setMessages(nextMessages);
        } catch (error) {
            console.error('Không tải được danh sách tin nhắn:', error);
            message.error(error instanceof Error ? error.message : 'Không tải được danh sách tin nhắn.');
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    const reloadChatboxData = useCallback(async (notify: boolean = false) => {
        try {
            await loadHierarchy(activeThreadId || undefined);
            if (activeThreadId) {
                await loadMessages(activeThreadId);
            }
            if (notify) {
                message.success('Đã tải lại hội thoại.');
            }
        } catch {
            if (notify) {
                message.error('Tải lại hội thoại thất bại.');
            }
        }
    }, [activeThreadId, loadHierarchy, loadMessages]);

    useEffect(() => {
        void loadHierarchy();
    }, [loadHierarchy]);

    useEffect(() => {
        if (!activeThreadId) {
            setMessages([]);
            return;
        }

        setReplyToMessage(null);
        setFilterState(DEFAULT_FILTER_STATE);
        void loadMessages(activeThreadId);
    }, [activeThreadId, loadMessages]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            setLinkedContentSchemaLoading(true);
            try {
                const options = await resolveLinkedContentOptions(dispatch, schemaName, settings);
                if (!cancelled) {
                    setLinkedContentSchemaOptions(options.length > 0 ? options : [{ value: schemaName, label: schemaName }]);
                }
            } catch (error) {
                if (!cancelled) {
                    console.warn('Không tải được cấu hình nội dung liên kết:', error);
                    setLinkedContentSchemaOptions([{ value: schemaName, label: schemaName }]);
                }
            } finally {
                if (!cancelled) {
                    setLinkedContentSchemaLoading(false);
                }
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [dispatch, schemaName, settings]);

    const handleSendMessage = async (
        content: string,
        mode: ComposerMode,
        schedulePayload?: IMessageSchedulePayload,
        attachments?: IHeadlessFileUpload[],
        linkedContents?: IMessageLinkedContentPayload[],
    ) => {
        if (!activeThreadId || !activeThread) {
            message.error('Không xác định được luồng hội thoại.');
            return;
        }

        const payload: Record<string, unknown> = {};
        const mentions = enableMentions ? extractMentions(content) : [];

        if (attachments?.length) {
            payload.attachments = attachments;
        }

        if (mode === ComposerMode.Schedule && schedulePayload) {
            payload.schedule = schedulePayload;
        }

        if (mode === ComposerMode.LinkedContent && linkedContents?.length) {
            payload.linked_contents = linkedContents;
        }

        if (mentions.length > 0) {
            payload.mentions = mentions;
        }

        const normalizedContent = content.trim()
            || (mode === ComposerMode.LinkedContent ? 'Nội dung liên kết' : '')
            || (attachments?.length ? 'Đính kèm tệp' : '');

        try {
            await contentConversationService.sendMessage(
                activeThreadId,
                normalizedContent,
                getMessageTypeFromComposerMode(mode),
                Object.keys(payload).length > 0 ? payload as any : null,
            );

            setPendingAttachments([]);
            setReplyToMessage(null);
            await Promise.all([loadMessages(activeThreadId), loadHierarchy(activeThreadId)]);
            message.success('Đã gửi nội dung trao đổi.');
        } catch (error) {
            console.error('Gửi nội dung trao đổi thất bại:', error);
            message.error(error instanceof Error ? error.message : 'Gửi nội dung trao đổi thất bại.');
            throw error;
        }
    };

    const handleCreateSubThread = async (input: ICreateSubThreadInput) => {
        if (!activeThread?._id) {
            message.error('Không xác định được luồng cha để tạo luồng mới.');
            return;
        }

        try {
            const createdThread = await contentConversationService.createSubThread(activeThread._id, input);
            setShowCreateSubThreadDrawer(false);
            await loadHierarchy(createdThread._id);
            message.success('Đã tạo luồng thảo luận mới.');
        } catch (error) {
            console.error('Tạo luồng thảo luận thất bại:', error);
            message.error(error instanceof Error ? error.message : 'Tạo luồng thảo luận thất bại.');
        }
    };

    const handleAttach = (type: 'file' | 'image' | 'link') => {
        if (type === 'file') {
            uploadFilesRef.current?.showModal();
            return;
        }

        if (type === 'image') {
            uploadImageRef.current?.showModal();
            return;
        }

        setLinkUrl('');
        setLinkModalOpen(true);
    };

    const handleConfirmInsertLink = () => {
        const normalizedUrl = linkUrl.trim();
        if (!normalizedUrl) {
            return;
        }

        composerRef.current?.insertText(normalizedUrl.startsWith('http') ? normalizedUrl : `https://${normalizedUrl}`);
        setLinkModalOpen(false);
        setLinkUrl('');
    };

    if (loadingHierarchy && !hierarchy) {
        return (
            <div className={`chatbox-panel ${className || ''}`.trim()} style={style}>
                <div className="chatbox-panel-loading">
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    if (!hierarchy || !activeThread) {
        return (
            <div className={`chatbox-panel ${className || ''}`.trim()} style={style}>
                <div className="chatbox-panel-error">
                    <div className="chatbox-panel-error-content">
                        <p className="chatbox-panel-error-message">Không tìm thấy luồng chat phù hợp.</p>
                        {hierarchy?.mainThread?._id ? (
                            <Button
                                type="primary"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => setActiveThreadId(hierarchy.mainThread._id)}
                            >
                                Về luồng chính
                            </Button>
                        ) : onClose ? (
                            <Button type="primary" onClick={onClose}>
                                Đóng chatbox
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`chatbox-panel ${className || ''}`.trim()} style={style}>
            <PanelHeader
                thread={activeThread}
                totalUnread={hierarchy.totalUnread}
                title={title}
                subtitle={subtitle}
                onClose={onClose}
                layoutWidthMode={panelWidth}
                onToggleWidth={() => setPanelWidth((currentValue) => (currentValue === 'compact' ? 'expanded' : 'compact'))}
                onRefresh={() => void reloadChatboxData(true)}
                onSearchClick={() => {
                    setShowSearchBar((currentValue) => !currentValue);
                    if (!showSearchBar) {
                        setShowFilterToolbar(false);
                    }
                }}
                onFilterClick={() => {
                    setShowFilterToolbar((currentValue) => !currentValue);
                    if (!showFilterToolbar) {
                        setShowSearchBar(false);
                    }
                }}
                searchBarVisible={showSearchBar}
                filterToolbarVisible={showFilterToolbar}
                hasActiveFilter={hasActiveFilter}
                onParticipantsClick={() => setParticipantsModalOpen(true)}
            />

            <ThreadBar
                threads={allThreads}
                unreadBadges={unreadBadges}
                activeThreadId={activeThreadId || ''}
                onThreadChange={(threadId) => setActiveThreadId(threadId)}
                onCreateSubThread={canCreateSubThread ? () => setShowCreateSubThreadDrawer(true) : undefined}
            />

            {(showSearchBar || showFilterToolbar) && (
                <TimelineFilterBar
                    searchOnly={showSearchBar && !showFilterToolbar}
                    showFilterToolbar={showFilterToolbar}
                    createdByOptions={createdByOptions}
                    value={filterState}
                    onChange={setFilterState}
                    onClose={() => {
                        setShowSearchBar(false);
                        setShowFilterToolbar(false);
                    }}
                />
            )}

            <div className="chatbox-panel-main">
                {loadingMessages ? (
                    <div className="chatbox-panel-loading chatbox-panel-loading-messages">
                        <Spin />
                    </div>
                ) : (
                    <MessageTimeline
                        messages={filteredMessages}
                        currentUsername={currentUsername}
                        isAdmin={isAdmin}
                        onReply={(messageId) => {
                            const selectedMessage = messages.find((item) => item._id === messageId) || null;
                            setReplyToMessage(selectedMessage);
                        }}
                        emptyDescription={hasActiveFilter ? 'Không có tin nhắn phù hợp với bộ lọc hiện tại.' : undefined}
                    />
                )}

                <Composer
                    ref={composerRef}
                    schemaName={schemaName}
                    threadStatus={activeThread.status}
                    onSendMessage={handleSendMessage}
                    onAttach={handleAttach}
                    disabled={!canSendMessage || activeThread.status !== ThreadStatus.Active}
                    disabledReason={!canSendMessage ? 'Bạn không có quyền gửi nội dung trong luồng này.' : undefined}
                    enableFileSharing={enableFileSharing}
                    enableMentions={enableMentions}
                    attachments={pendingAttachments}
                    participants={activeThread.participants || []}
                    replyTo={replyToMessage}
                    onCancelReply={() => setReplyToMessage(null)}
                    linkedContentSchemaOptions={linkedContentSchemaOptions}
                    linkedContentSchemaLoading={linkedContentSchemaLoading}
                    defaultLinkedContentSchema={linkedContentSchemaOptions[0]?.value || schemaName}
                />
            </div>

            <Modal
                title="Danh sách thành viên"
                open={participantsModalOpen}
                onCancel={() => setParticipantsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setParticipantsModalOpen(false)}>
                        Đóng
                    </Button>,
                    <Button
                        key="invite"
                        type="primary"
                        disabled={!canInviteMembers || !activeThread._id}
                        onClick={() => {
                            setParticipantsModalOpen(false);
                            setAddMembersModalOpen(true);
                        }}
                    >
                        Thêm thành viên
                    </Button>,
                ]}
                destroyOnClose
                width={460}
            >
                <List
                    dataSource={activeThread.participants || []}
                    locale={{ emptyText: 'Chưa có thành viên nào trong luồng này.' }}
                    renderItem={(participant: IConversationParticipant) => {
                        const displayName = participant.display_name || participant.username;
                        return (
                            <List.Item className="chatbox-participants-modal-item">
                                <div className="chatbox-participants-modal-row">
                                    <Avatar style={{ backgroundColor: getAvatarColor(participant.username) }} size={40}>
                                        {getInitials(displayName)}
                                    </Avatar>
                                    <div className="chatbox-participants-modal-text">
                                        <div className="chatbox-participants-modal-name">{displayName}</div>
                                        <div className="chatbox-participants-modal-meta">
                                            @{participant.username}
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        );
                    }}
                />
            </Modal>

            <AddThreadMembersModal
                open={addMembersModalOpen}
                onClose={() => setAddMembersModalOpen(false)}
                threadId={activeThread._id}
                onInviteSuccess={async () => {
                    await reloadChatboxData(false);
                    setParticipantsModalOpen(true);
                }}
            />

            <CreateSubThreadDrawer
                open={showCreateSubThreadDrawer}
                onClose={() => setShowCreateSubThreadDrawer(false)}
                onSubmit={(input) => void handleCreateSubThread(input)}
                parentThread={activeThread}
                allowedThreadTypes={allowedThreadTypes}
                defaultVisibility={defaultVisibility}
            />

            <div className="chatbox-panel-hidden-uploaders" aria-hidden>
                <UploadFilesEdit
                    ref={uploadFilesRef}
                    value={pendingAttachments as any}
                    onChange={(value) => setPendingAttachments((value || []) as unknown as IHeadlessFileUpload[])}
                />
                <UploadImageEdit
                    ref={uploadImageRef}
                    value={null}
                    onChange={(value) => {
                        if (!value) {
                            return;
                        }

                        setPendingAttachments((currentValue) => [
                            ...currentValue,
                            {
                                name: 'Ảnh đính kèm',
                                url: value,
                                file_path: value,
                                mime_type: 'image/*',
                                file_type: 'image',
                            },
                        ]);
                    }}
                    att={{ id: 'chatbox_image', name: 'chatbox_image', propType: 'Text' } as any}
                />
            </div>

            <Modal
                title="Thêm liên kết"
                open={linkModalOpen}
                onOk={handleConfirmInsertLink}
                onCancel={() => {
                    setLinkModalOpen(false);
                    setLinkUrl('');
                }}
                okText="Chèn vào nội dung"
                cancelText="Hủy"
                okButtonProps={{ disabled: !linkUrl.trim() }}
                destroyOnClose
            >
                <Input
                    prefix={<LinkOutlined />}
                    placeholder="Nhập URL cần chèn"
                    value={linkUrl}
                    onChange={(event) => setLinkUrl(event.target.value)}
                    onPressEnter={handleConfirmInsertLink}
                />
            </Modal>
        </div>
    );
}
