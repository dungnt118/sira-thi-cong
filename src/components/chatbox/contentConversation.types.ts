export enum ThreadType {
    Main = 'Main',
    Discussion = 'Discussion',
    Escalation = 'Escalation',
    Private = 'Private',
    External = 'External',
}

export enum ThreadStatus {
    Active = 'Active',
    Archived = 'Archived',
    Locked = 'Locked',
    Deleted = 'Deleted',
}

export enum ConversationVisibility {
    Private = 'Private',
    Internal = 'Internal',
    Public = 'Public',
    Restricted = 'Restricted',
}

export enum MessageTypeEnum {
    Message = 'message',
    Note = 'note',
    ContentChanged = 'contentchanged',
    Schedule = 'schedule',
    LinkedContent = 'linkedcontent',
}

export enum SystemChangeType {
    Created = 'created',
    Updated = 'updated',
    Deleted = 'deleted',
}

export interface IParticipantPermission {
    can_send_message?: boolean;
    can_invite?: boolean;
    can_edit_thread?: boolean;
    can_remove_participant?: boolean;
    can_delete_message?: boolean;
    can_see_history?: boolean;
}

export interface IConversationParticipant {
    _id?: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
    permissions?: IParticipantPermission;
}

export interface IDataChangedDetail {
    id: string;
    label: string;
    ori?: string;
    current?: string;
}

export interface IHeadlessFileUpload {
    file_id?: string;
    name?: string;
    mime_type?: string;
    alt?: string;
    url?: string;
    file_type?: string;
    file_path?: string;
    size?: number;
}

export interface IMessageContext {
    target_schema?: string;
    content_id?: string;
    content_title?: string;
}

export interface IMessageSchedulePayload {
    scheduled_at?: unknown;
    timezone?: string | null;
    remind_before_minutes?: number | null;
    recurrence?: string | null;
}

export interface IMessageLinkedContentPayload {
    schema: string;
    ref_id: string;
    title: string;
}

export interface IMessagePayload {
    metadata?: string | null;
    attachments?: IHeadlessFileUpload[] | null;
    schedule?: IMessageSchedulePayload | null;
    mentions?: string[] | null;
    linked_contents?: IMessageLinkedContentPayload[] | null;
}

export interface ISystemPayload {
    change_type?: SystemChangeType;
    changes?: IDataChangedDetail[];
    oridata?: string | null;
}

export interface IChatboxMessageDto {
    _id?: string;
    content: string;
    message_type: MessageTypeEnum;
    thread_id?: string;
    reply_to_id?: string | null;
    createdAt: Date | string;
    createdBy?: string;
    context?: IMessageContext;
    payload?: IMessagePayload;
    system_change_type?: SystemChangeType | null;
    changes_count?: number;
}

export interface IContentChatboxMessage {
    _id?: string;
    content: string;
    message_type: MessageTypeEnum;
    thread_id?: string;
    reply_to_id?: string;
    context?: IMessageContext;
    payload?: IMessagePayload;
    system?: ISystemPayload;
    system_change_type?: SystemChangeType | null;
    changes_count?: number;
    date?: Date;
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface IConversationAccessPolicy {
    allowed_users?: string[];
    allowed_roles?: string[];
    allowed_schemas?: string[];
    blocked_users?: string[];
    user_permissions?: Record<string, IParticipantPermission>;
    allow_anonymous?: boolean;
    require_approval?: boolean;
    max_participants?: number;
}

export interface IConversationThread {
    _id: string;
    title: string;
    owner: string;
    is_main_thread: boolean;
    parent_thread_id?: string;
    thread_type: ThreadType;
    visibility: ConversationVisibility;
    access_policy?: IConversationAccessPolicy;
    source_schema?: string;
    source_content_id?: string;
    source_content_title?: string;
    metadata?: Record<string, any>;
    participants: IConversationParticipant[];
    tags?: string[];
    merged_thread_ids?: string[];
    last_message_at?: Date;
    message_count?: number;
    unread_counts?: Record<string, number>;
    status: ThreadStatus;
    share_token?: string;
    share_expires_at?: Date;
    sub_thread_count?: number;
    shared_with_count?: number;
    last_message_preview?: string;
    last_message_author?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface IThreadHierarchyResponse {
    mainThread: IConversationThread;
    autoThreads: IConversationThread[];
    subThreads: IConversationThread[];
    totalUnread: number;
    unreadByThread: Array<{
        threadId: string;
        threadCode?: string;
        count: number;
    }>;
}

export interface ICreateSubThreadInput {
    title: string;
    thread_type: ThreadType;
    visibility?: ConversationVisibility;
    invite_users?: string[];
    tags?: string[];
    metadata?: Record<string, any>;
    merged_thread_ids?: string[];
}

export interface IContentConversationPanelProps {
    schemaName: string;
    contentId: string;
    title?: string;
    subtitle?: string;
    className?: string;
    style?: React.CSSProperties;
}
