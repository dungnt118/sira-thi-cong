import type { CSSProperties } from 'react';
import type { IChatboxSettings } from '../../types/chatbox/ChatboxShared';

export * from '../../types/chatbox/ChatboxShared';

export type ChatPanelLayoutMode = 'compact' | 'expanded';

export interface IContentConversationPanelProps {
    schemaName: string;
    contentId: string;
    title?: string;
    subtitle?: string;
    settings?: IChatboxSettings;
    onClose?: () => void;
    /** Đồng bộ thu/mở rộng với container bên ngoài (vd. width Drawer). */
    onLayoutModeChange?: (mode: ChatPanelLayoutMode) => void;
    className?: string;
    style?: CSSProperties;
}
