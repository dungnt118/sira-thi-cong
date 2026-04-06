import {
    CommentOutlined,
    FileTextOutlined,
    GlobalOutlined,
    InboxOutlined,
    LockOutlined,
    MessageOutlined,
    PushpinOutlined,
    SafetyCertificateOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import { ConversationVisibility, ThreadType } from '../contentConversation.types';

export const getThreadTypeIconComponent = (type: ThreadType): ReactNode => {
    switch (type) {
        case ThreadType.Main:
            return <FileTextOutlined />;
        case ThreadType.Discussion:
            return <CommentOutlined />;
        case ThreadType.Escalation:
            return <WarningOutlined />;
        case ThreadType.Private:
            return <LockOutlined />;
        case ThreadType.External:
            return <GlobalOutlined />;
        default:
            return <MessageOutlined />;
    }
};

export const getSchemaIconComponent = (schema?: string | null): ReactNode => {
    if (!schema) {
        return <FileTextOutlined />;
    }

    const normalized = schema.toLowerCase();
    if (normalized.includes('journey')) {
        return <PushpinOutlined />;
    }
    if (normalized.includes('ticket')) {
        return <FileTextOutlined />;
    }
    if (normalized.includes('task')) {
        return <PushpinOutlined />;
    }
    if (normalized.includes('order')) {
        return <InboxOutlined />;
    }

    return <FileTextOutlined />;
};

export const getVisibilityIconComponent = (visibility?: ConversationVisibility | null): ReactNode => {
    switch (visibility) {
        case ConversationVisibility.Private:
            return <LockOutlined />;
        case ConversationVisibility.Public:
            return <GlobalOutlined />;
        case ConversationVisibility.Restricted:
            return <SafetyCertificateOutlined />;
        case ConversationVisibility.Internal:
        default:
            return <FileTextOutlined />;
    }
};
