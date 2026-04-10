import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { get_schema_by_name } from '@/store/actions/schemas/schemas.action';
import type { IChatboxSettings } from './contentConversation.types';
import type { IContentConversationPanelProps } from './contentConversation.types';
import ChatPanel from './components/ChatPanel/ChatPanel';

const normalizeSettings = (settings?: IChatboxSettings | null): IChatboxSettings | undefined => {
    if (!settings) {
        return undefined;
    }

    return {
        ...settings,
        enable_file_sharing: settings.enable_file_sharing !== false,
        enable_mentions: settings.enable_mentions !== false,
        enable_sub_threads: settings.enable_sub_threads !== false,
    };
};

export default function ContentConversationPanel({
    schemaName,
    contentId,
    title,
    subtitle,
    settings,
    onClose,
    onLayoutModeChange,
    className,
    style,
}: IContentConversationPanelProps) {
    const dispatch = useAppDispatch();
    const [resolvedSettings, setResolvedSettings] = useState<IChatboxSettings | undefined>(() => normalizeSettings(settings));

    useEffect(() => {
        if (settings) {
            setResolvedSettings(normalizeSettings(settings));
            return;
        }

        let cancelled = false;

        const run = async () => {
            try {
                const schemaDefinition = await dispatch(get_schema_by_name(schemaName));
                if (!cancelled) {
                    setResolvedSettings(normalizeSettings(schemaDefinition?.chatboxSetting));
                }
            } catch (error) {
                if (!cancelled) {
                    console.warn('Không tải được chatboxSetting của schema:', error);
                    setResolvedSettings(undefined);
                }
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [dispatch, schemaName, settings]);

    return (
        <ChatPanel
            schemaName={schemaName}
            contentId={contentId}
            title={title}
            subtitle={subtitle}
            settings={resolvedSettings}
            onClose={onClose}
            onLayoutModeChange={onLayoutModeChange}
            className={className}
            style={style}
        />
    );
}
