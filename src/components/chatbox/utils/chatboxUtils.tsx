import {
    AudioOutlined,
    FileExcelOutlined,
    FileOutlined,
    FilePdfOutlined,
    FilePptOutlined,
    FileTextOutlined,
    FileZipOutlined,
    PictureOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import {
    ConversationVisibility,
    type IContentChatboxMessage,
    type IHeadlessFileUpload,
    type IMessageGroup,
    type IMessageLinkedContentPayload,
    MessageTypeEnum,
    SystemChangeType,
    ThreadStatus,
} from '../contentConversation.types';

const FILE_ICON_MAP: Record<string, ReactNode> = {
    PictureOutlined: <PictureOutlined />,
    VideoCameraOutlined: <VideoCameraOutlined />,
    AudioOutlined: <AudioOutlined />,
    FilePdfOutlined: <FilePdfOutlined />,
    FileTextOutlined: <FileTextOutlined />,
    FileExcelOutlined: <FileExcelOutlined />,
    FilePptOutlined: <FilePptOutlined />,
    FileZipOutlined: <FileZipOutlined />,
    FileOutlined: <FileOutlined />,
};

export const stripHtmlTags = (html: string): string => {
    if (!html) {
        return '';
    }

    return html.replace(/<[^>]*>/g, '');
};

export const truncateText = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength)}...`;
};

export const getMessagePreview = (html: string, maxLength: number = 50): string => {
    const text = stripHtmlTags(html);
    return truncateText(text, maxLength);
};

export const getMessagePreviewText = (
    message?: Pick<IContentChatboxMessage, 'content' | 'payload'> | null,
    maxLength: number = 50,
): string => {
    const contentPreview = getMessagePreview(message?.content ?? '', maxLength).trim();
    if (contentPreview) {
        return contentPreview;
    }

    const linkedContentPreview = getLinkedContents(message)
        .map((item) => item.title.trim())
        .filter(Boolean)
        .join(', ');

    return truncateText(linkedContentPreview, maxLength);
};

export const getLinkedContents = (
    message?: Pick<IContentChatboxMessage, 'payload'> | null,
): IMessageLinkedContentPayload[] => {
    const linkedContents = message?.payload?.linked_contents;
    if (!Array.isArray(linkedContents)) {
        return [];
    }

    return linkedContents.filter(
        (item): item is IMessageLinkedContentPayload =>
            Boolean(item?.schema?.trim() && item?.ref_id?.trim() && item?.title?.trim()),
    );
};

export const formatMessageDate = (date: Date): string => {
    const now = new Date();
    const target = new Date(date);

    if (target.toDateString() === now.toDateString()) {
        return 'Hôm nay';
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (target.toDateString() === yesterday.toDateString()) {
        return 'Hôm qua';
    }

    const diffTime = now.getTime() - target.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
        return target.toLocaleDateString('en-US', { weekday: 'long' });
    }

    return target.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const formatMessageTime = (date: Date): string => new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
});

export const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 30) return `${diffDays} ngày trước`;

    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

export const getStatusLabel = (status: ThreadStatus): string => {
    switch (status) {
        case ThreadStatus.Active:
            return 'Đang mở';
        case ThreadStatus.Archived:
            return 'Lưu trữ';
        case ThreadStatus.Locked:
            return 'Khóa';
        case ThreadStatus.Deleted:
            return 'Đã xóa';
        default:
            return status;
    }
};

export const getVisibilityLabel = (visibility: ConversationVisibility): string => {
    switch (visibility) {
        case ConversationVisibility.Private:
            return 'Riêng tư';
        case ConversationVisibility.Internal:
            return 'Nội bộ';
        case ConversationVisibility.Public:
            return 'Công khai';
        case ConversationVisibility.Restricted:
            return 'Hạn chế';
        default:
            return visibility;
    }
};

export const groupMessagesByCreator = (messages: IContentChatboxMessage[]): IMessageGroup[] => {
    const groups: IMessageGroup[] = [];
    let currentGroup: IMessageGroup | null = null;

    messages.forEach((msg) => {
        const lastMessage = currentGroup?.messages[currentGroup.messages.length - 1];
        const timeDiff = currentGroup
            && lastMessage
            ? new Date(msg.createdAt).getTime() - new Date(lastMessage.createdAt).getTime()
            : Infinity;
        const shouldStartNewGroup = !currentGroup || currentGroup.createdBy !== msg.createdBy || timeDiff > 2 * 60 * 1000;

        if (shouldStartNewGroup) {
            if (currentGroup) {
                groups.push(currentGroup);
            }
            currentGroup = {
                createdBy: msg.createdBy || 'system',
                displayName: msg.createdBy || 'System',
                messages: [msg],
            };
            return;
        }

        if (currentGroup) {
            currentGroup.messages.push(msg);
        }
    });

    if (currentGroup) {
        groups.push(currentGroup);
    }

    return groups;
};

export const getInitials = (name: string): string => {
    if (!name) {
        return '?';
    }

    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
};

export const getAvatarColor = (username: string): string => {
    const colors = ['#7c3aed', '#2563eb', '#0891b2', '#ea580c', '#dc2626', '#16a34a'];
    let hash = 0;
    for (let index = 0; index < username.length; index += 1) {
        hash = username.charCodeAt(index) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

export const isMessageEditable = (message: IContentChatboxMessage, currentUsername?: string): boolean => {
    if (message.message_type !== MessageTypeEnum.Message && message.message_type !== MessageTypeEnum.Note) {
        return false;
    }

    if (message.createdBy !== currentUsername) {
        return false;
    }

    if (message.system?.change_type === SystemChangeType.Deleted) {
        return false;
    }

    return false;
};

export const isMessageDeletable = (
    message: IContentChatboxMessage,
    currentUsername?: string,
    isAdmin: boolean = false,
): boolean => {
    if (
        message.message_type !== MessageTypeEnum.Message
        && message.message_type !== MessageTypeEnum.Note
        && message.message_type !== MessageTypeEnum.LinkedContent
    ) {
        return false;
    }

    const isOwner = message.createdBy === currentUsername;

    if (message.message_type === MessageTypeEnum.Message) {
        return false;
    }

    return isOwner || isAdmin;
};

export const wasMessageEdited = (message: IContentChatboxMessage): boolean => {
    if (!message.updatedAt) {
        return false;
    }

    return new Date(message.updatedAt).getTime() > new Date(message.createdAt).getTime();
};

export const parseJsonSafe = <T = unknown>(json: string | undefined): T | null => {
    try {
        return json ? JSON.parse(json) as T : null;
    } catch {
        return null;
    }
};

export const highlightMentions = (content: string): string => {
    if (!content || typeof content !== 'string') {
        return '';
    }

    const mentionRegex = /@(\w+(?:\.\w+)*)/g;
    return content.replace(mentionRegex, '<span class="message-mention">$&</span>');
};

export const getFileIcon = (mimeType?: string, fileType?: string): ReactNode => {
    const type = mimeType || fileType || '';
    let key = 'FileOutlined';

    if (type.startsWith('image/')) key = 'PictureOutlined';
    else if (type.startsWith('video/')) key = 'VideoCameraOutlined';
    else if (type.startsWith('audio/')) key = 'AudioOutlined';
    else if (type.includes('pdf')) key = 'FilePdfOutlined';
    else if (type.includes('word') || type.includes('document')) key = 'FileTextOutlined';
    else if (type.includes('sheet') || type.includes('excel')) key = 'FileExcelOutlined';
    else if (type.includes('presentation') || type.includes('powerpoint')) key = 'FilePptOutlined';
    else if (type.includes('zip') || type.includes('archive')) key = 'FileZipOutlined';

    return FILE_ICON_MAP[key] ?? <FileOutlined />;
};

export const formatFileSize = (bytes?: number): string => {
    if (!bytes) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const buildLinkedContentDetailPath = (schema: string, refId: string): string => {
    const normalizedSchema = encodeURIComponent(schema.trim());
    const normalizedRefId = encodeURIComponent(refId.trim());
    return `/apps/anydata/detail/${normalizedSchema}/${normalizedRefId}`;
};

export const getAttachmentUrl = (attachment: IHeadlessFileUpload): string => attachment.url || attachment.file_path || '';
