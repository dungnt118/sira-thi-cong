import { mutate, query, queryList } from '../../services/graphqlService';
import {
    CREATE_CB_SUB_THREAD,
    GET_CB_THREAD_HIERARCHY,
    INVITE_CB_THREAD_USERS,
    QUERY_CB_BY_THREAD,
    SEND_CB_MESSAGE,
} from './contentConversation.graphql';
import {
    IChatboxMessageDto,
    IContentChatboxMessage,
    IConversationParticipant,
    IConversationThread,
    ICreateSubThreadInput,
    IMessagePayload,
    IThreadHierarchyResponse,
    MessageTypeEnum,
} from './contentConversation.types';

interface IMessageFilterOptions {
    key?: string;
    createdBy?: string;
    skip?: number;
    limit?: number;
    message_type?: MessageTypeEnum | '';
    change_type?: string | null;
    from?: Date | null;
    to?: Date | null;
}

const parseDateValue = (value: unknown): Date | undefined => {
    if (!value) {
        return undefined;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? undefined : value;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }

    if (typeof value === 'object') {
        const source = value as Record<string, unknown>;
        if (source.Date) {
            return parseDateValue(source.Date);
        }
    }

    return undefined;
};

const normalizeParticipant = (value: unknown): IConversationParticipant | null => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const source = value as Record<string, unknown>;
    const username = typeof source.username === 'string' ? source.username : '';
    if (!username.trim()) {
        return null;
    }

    return {
        _id: typeof source._id === 'string' ? source._id : undefined,
        username,
        display_name: typeof source.display_name === 'string'
            ? source.display_name
            : typeof source.displayName === 'string'
                ? source.displayName
                : undefined,
        avatar_url: typeof source.avatar_url === 'string' ? source.avatar_url : undefined,
        permissions: typeof source.permissions === 'object' ? (source.permissions as any) : undefined,
    };
};

const normalizeThread = (value: unknown): IConversationThread | null => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const source = value as Record<string, unknown>;
    const id = typeof source._id === 'string' ? source._id : '';
    if (!id) {
        return null;
    }

    const participants = Array.isArray(source.participants)
        ? source.participants
            .map((item) => normalizeParticipant(item))
            .filter((item): item is IConversationParticipant => item !== null)
        : [];

    return {
        _id: id,
        title: typeof source.title === 'string' ? source.title : 'Luồng thảo luận',
        owner: typeof source.owner === 'string' ? source.owner : '',
        is_main_thread: Boolean(source.is_main_thread),
        parent_thread_id: typeof source.parent_thread_id === 'string' ? source.parent_thread_id : undefined,
        thread_type: source.thread_type as any,
        visibility: source.visibility as any,
        access_policy: typeof source.access_policy === 'object' ? (source.access_policy as any) : undefined,
        source_schema: typeof source.source_schema === 'string' ? source.source_schema : undefined,
        source_content_id: typeof source.source_content_id === 'string' ? source.source_content_id : undefined,
        source_content_title: typeof source.source_content_title === 'string' ? source.source_content_title : undefined,
        metadata: typeof source.metadata === 'object' ? (source.metadata as Record<string, any>) : undefined,
        participants,
        tags: Array.isArray(source.tags) ? source.tags.filter((item): item is string => typeof item === 'string') : undefined,
        merged_thread_ids: Array.isArray(source.merged_thread_ids)
            ? source.merged_thread_ids.filter((item): item is string => typeof item === 'string')
            : undefined,
        last_message_at: parseDateValue(source.last_message_at),
        message_count: typeof source.message_count === 'number' ? source.message_count : undefined,
        unread_counts: typeof source.unread_counts === 'object' ? (source.unread_counts as Record<string, number>) : undefined,
        status: source.status as any,
        share_token: typeof source.share_token === 'string' ? source.share_token : undefined,
        share_expires_at: parseDateValue(source.share_expires_at),
        sub_thread_count: typeof source.sub_thread_count === 'number' ? source.sub_thread_count : undefined,
        shared_with_count: typeof source.shared_with_count === 'number' ? source.shared_with_count : undefined,
        last_message_preview: typeof source.last_message_preview === 'string' ? source.last_message_preview : undefined,
        last_message_author: typeof source.last_message_author === 'string' ? source.last_message_author : undefined,
        createdAt: parseDateValue(source.createdAt) ?? new Date(),
        updatedAt: parseDateValue(source.updatedAt),
    };
};

const normalizeMessage = (
    message?: IChatboxMessageDto | IContentChatboxMessage | null,
): IContentChatboxMessage | null => {
    if (!message || typeof message.content !== 'string' || !message.message_type || !message.createdAt) {
        return null;
    }

    const entityMessage = message as IContentChatboxMessage;
    const normalizedSystemChangeType =
        entityMessage.system?.change_type ?? message.system_change_type ?? undefined;
    const normalizedChanges = Array.isArray(entityMessage.system?.changes)
        ? entityMessage.system.changes
        : [];

    return {
        ...message,
        reply_to_id: message.reply_to_id ?? undefined,
        context: message.context ?? undefined,
        payload: (message.payload ?? undefined) as IMessagePayload | undefined,
        system: normalizedSystemChangeType || normalizedChanges.length > 0 || entityMessage.system?.oridata
            ? {
                ...entityMessage.system,
                change_type: normalizedSystemChangeType,
                changes: normalizedChanges,
                oridata: entityMessage.system?.oridata ?? null,
            }
            : undefined,
        system_change_type: normalizedSystemChangeType ?? null,
        changes_count:
            typeof message.changes_count === 'number'
                ? message.changes_count
                : normalizedChanges.length,
        createdAt: parseDateValue(message.createdAt) ?? new Date(),
        updatedAt: entityMessage.updatedAt ? parseDateValue(entityMessage.updatedAt) : undefined,
    };
};

const normalizeHierarchy = (value: unknown): IThreadHierarchyResponse => {
    const source = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
    const mainThread = normalizeThread(source.mainThread) ?? {
        _id: '',
        title: 'Luồng chính',
        owner: '',
        is_main_thread: true,
        thread_type: 'Main' as any,
        visibility: 'Internal' as any,
        participants: [],
        status: 'Active' as any,
        createdAt: new Date(),
    };

    return {
        mainThread,
        autoThreads: Array.isArray(source.autoThreads)
            ? source.autoThreads
                .map((item) => normalizeThread(item))
                .filter((item): item is IConversationThread => item !== null)
            : [],
        subThreads: Array.isArray(source.subThreads)
            ? source.subThreads
                .map((item) => normalizeThread(item))
                .filter((item): item is IConversationThread => item !== null)
            : [],
        totalUnread: typeof source.totalUnread === 'number' ? source.totalUnread : 0,
        unreadByThread: Array.isArray(source.unreadByThread)
            ? source.unreadByThread.reduce<Array<{ threadId: string; threadCode?: string; count: number }>>((result, item) => {
                if (!item || typeof item !== 'object') {
                    return result;
                }

                const entry = item as Record<string, unknown>;
                const threadId = typeof entry.threadId === 'string' ? entry.threadId : '';
                if (!threadId) {
                    return result;
                }

                result.push({
                    threadId,
                    threadCode: typeof entry.threadCode === 'string' ? entry.threadCode : undefined,
                    count: typeof entry.count === 'number' ? entry.count : 0,
                });

                return result;
            }, [])
            : [],
    };
};

export const contentConversationService = {
    async getThreadHierarchy(
        schemaName: string,
        contentId: string,
        includeExternal: boolean = true,
    ): Promise<IThreadHierarchyResponse> {
        const response = await query<any>(
            GET_CB_THREAD_HIERARCHY,
            { schemaName, contentId, includeExternal },
        );

        if (!response?.data) {
            throw new Error('Không tải được danh sách luồng thảo luận.');
        }

        return normalizeHierarchy(response.data);
    },

    async getMessagesByThread(
        threadId: string,
        options?: IMessageFilterOptions,
    ): Promise<IContentChatboxMessage[]> {
        const response = await queryList<any>(
            QUERY_CB_BY_THREAD,
            {
                thread_id: threadId,
                key: options?.key || undefined,
                createdBy: options?.createdBy || undefined,
                skip: options?.skip ?? 0,
                limit: options?.limit ?? 100,
                message_type: options?.message_type || undefined,
                change_type: options?.change_type || undefined,
                from: options?.from || undefined,
                to: options?.to || undefined,
            },
        );

        if (!response?.data) {
            return [];
        }

        return (response.data as Array<IChatboxMessageDto | IContentChatboxMessage>)
            .map((item) => normalizeMessage(item))
            .filter((item): item is IContentChatboxMessage => item !== null)
            .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
    },

    async sendMessage(
        threadId: string,
        content: string,
        messageType: MessageTypeEnum,
        payload?: IMessagePayload | null,
    ): Promise<IContentChatboxMessage | null> {
        const response = await mutate<any>(
            SEND_CB_MESSAGE,
            {
                threadId,
                content,
                messageType,
                payload: payload ?? null,
            },
        );

        if (response?.code !== 0) {
            throw new Error(response?.message || 'Gửi tin nhắn thất bại.');
        }

        return normalizeMessage(response.data as IChatboxMessageDto | IContentChatboxMessage | null);
    },

    async createSubThread(
        parentThreadId: string,
        input: ICreateSubThreadInput,
    ): Promise<IConversationThread> {
        const response = await mutate<any>(
            CREATE_CB_SUB_THREAD,
            {
                parentThreadId,
                input,
            },
        );

        if (response?.code !== 0 || !response?.data) {
            throw new Error(response?.message || 'Tạo luồng thảo luận thất bại.');
        }

        const thread = normalizeThread(response.data);
        if (!thread) {
            throw new Error('Không đọc được dữ liệu luồng vừa tạo.');
        }

        return thread;
    },

    async inviteThreadUsers(threadId: string, usernames: string[]): Promise<void> {
        const normalized = Array.from(
            new Set(
                usernames
                    .map((username) => (typeof username === 'string' ? username.trim() : ''))
                    .filter(Boolean),
            ),
        );

        if (normalized.length === 0) {
            throw new Error('Vui lòng chọn ít nhất một thành viên.');
        }

        const response = await mutate<any>(
            INVITE_CB_THREAD_USERS,
            {
                threadId,
                usernames: normalized,
            },
        );

        if (response?.code !== 0) {
            throw new Error(response?.message || 'Mời thành viên thất bại.');
        }
    },
};
