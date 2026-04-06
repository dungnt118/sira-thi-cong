import type { CSSProperties } from 'react';
import type { IChatboxSettings } from '../../types/chatbox/ChatboxShared';

export * from '../../types/chatbox/ChatboxShared';

export interface IContentConversationPanelProps {
    schemaName: string;
    contentId: string;
    title?: string;
    subtitle?: string;
    settings?: IChatboxSettings;
    onClose?: () => void;
    className?: string;
    style?: CSSProperties;
}
