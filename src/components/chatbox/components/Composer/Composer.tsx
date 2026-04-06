import {
    BulbOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    FolderOutlined,
    LinkOutlined,
    LockOutlined,
    MessageOutlined,
    PaperClipOutlined,
    PictureOutlined,
    PlusOutlined,
    SendOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Dropdown, Input, InputNumber, Radio, Select, Space, Tooltip } from 'antd';
import type { Dayjs } from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import IndexedSelect from '@/components/common/Form/IndexedSelect';
import { get_indexed_content } from '@/store/actions/schemas/schemas.action';
import { useAppDispatch } from '@/store/hooks';
import {
    ComposerMode,
    type IContentChatboxMessage,
    type IConversationParticipant,
    type IHeadlessFileUpload,
    type ILinkedContentSchemaOption,
    type IMessageLinkedContentPayload,
    type IMessageSchedulePayload,
    ThreadStatus,
} from '../../contentConversation.types';
import { getMessagePreviewText } from '../../utils/chatboxUtils';
import './Composer.less';

type SendStatus = 'idle' | 'sending' | 'success' | 'error';
type AttachmentMenuType = 'file' | 'image' | 'link';

interface IMentionState {
    open: boolean;
    query: string;
    startOffset: number;
    selectedIndex: number;
    position?: { x: number; y: number };
}

interface ILinkedContentDraft extends IMessageLinkedContentPayload {
    key: string;
    loadingTitle: boolean;
    lookupError: string | null;
}

export interface IComposerProps {
    schemaName: string;
    threadStatus: ThreadStatus;
    onSendMessage: (
        content: string,
        mode: ComposerMode,
        schedulePayload?: IMessageSchedulePayload,
        attachments?: IHeadlessFileUpload[],
        linkedContents?: IMessageLinkedContentPayload[],
    ) => void | Promise<void>;
    onAttach?: (type: AttachmentMenuType) => void;
    onReActivate?: () => void;
    disabled?: boolean;
    disabledReason?: string;
    enableFileSharing?: boolean;
    enableMentions?: boolean;
    attachments?: IHeadlessFileUpload[];
    participants?: IConversationParticipant[];
    replyTo?: IContentChatboxMessage | null;
    onCancelReply?: () => void;
    linkedContentSchemaOptions?: ILinkedContentSchemaOption[];
    linkedContentSchemaLoading?: boolean;
    defaultLinkedContentSchema?: string;
}

export interface IComposerRef {
    insertText: (text: string) => void;
}

const MENTION_REGEX = /@([^\s]*)$/;

const createLinkedContentDraft = (defaultSchema: string = ''): ILinkedContentDraft => ({
    key: `linked-content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    schema: defaultSchema,
    ref_id: '',
    title: '',
    loadingTitle: false,
    lookupError: null,
});

const Composer = forwardRef<IComposerRef, IComposerProps>(({
    schemaName,
    threadStatus,
    onSendMessage,
    onAttach,
    onReActivate,
    disabled = false,
    disabledReason,
    enableFileSharing = true,
    enableMentions = true,
    attachments = [],
    participants = [],
    replyTo,
    onCancelReply,
    linkedContentSchemaOptions = [],
    linkedContentSchemaLoading = false,
    defaultLinkedContentSchema = '',
}, ref) => {
    const dispatch = useAppDispatch();
    const [content, setContent] = useState('');
    const [mode, setMode] = useState<ComposerMode>(ComposerMode.Message);
    const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
    const [scheduledAtDayjs, setScheduledAtDayjs] = useState<Dayjs | null>(null);
    const [schedulePayload, setSchedulePayload] = useState<Omit<IMessageSchedulePayload, 'scheduled_at'>>({
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Bangkok',
        remind_before_minutes: null,
        recurrence: null,
    });
    const [linkedContents, setLinkedContents] = useState<ILinkedContentDraft[]>([]);
    const [mention, setMention] = useState<IMentionState>({
        open: false,
        query: '',
        startOffset: 0,
        selectedIndex: 0,
        position: undefined,
    });
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const linkedContentLookupRef = useRef<Record<string, number>>({});

    useImperativeHandle(ref, () => ({
        insertText(text: string) {
            setContent((prev) => prev + text);
        },
    }), []);

    const isDisabled = disabled || threadStatus === ThreadStatus.Locked || threadStatus === ThreadStatus.Archived;

    const normalizedLinkedContents = linkedContents.map((item) => ({
        key: item.key,
        schema: item.schema.trim(),
        ref_id: item.ref_id.trim(),
        title: item.title.trim(),
        loadingTitle: item.loadingTitle,
        lookupError: item.lookupError,
    }));

    const validLinkedContents = normalizedLinkedContents.filter(
        (item) => item.schema && item.ref_id && item.title,
    );

    const hasIncompleteLinkedContent = normalizedLinkedContents.some((item) => {
        const hasAnyField = item.schema || item.ref_id;
        const hasRequiredFields = item.schema && item.ref_id;
        return Boolean(
            (hasAnyField && !hasRequiredFields)
            || (hasRequiredFields && (item.loadingTitle || !item.title || item.lookupError)),
        );
    });

    const canSendLinkedContent = validLinkedContents.length > 0 && !hasIncompleteLinkedContent;

    const mentionCandidates = useMemo(() => {
        if (!enableMentions) {
            return [];
        }

        if (!mention.query.trim()) {
            return participants.slice(0, 20);
        }

        const query = mention.query.toLowerCase();
        return participants
            .filter((participant) =>
                (participant.username || '').toLowerCase().includes(query)
                || (participant.display_name || '').toLowerCase().includes(query),
            )
            .slice(0, 20);
    }, [enableMentions, mention.query, participants]);

    useEffect(() => {
        if (mode === ComposerMode.LinkedContent && linkedContents.length === 0) {
            setLinkedContents([createLinkedContentDraft(defaultLinkedContentSchema)]);
        }
    }, [defaultLinkedContentSchema, linkedContents.length, mode]);

    useEffect(() => {
        if (mode !== ComposerMode.LinkedContent || !defaultLinkedContentSchema) {
            return;
        }

        setLinkedContents((prev) => prev.map((item) => (
            item.schema || item.ref_id || item.title
                ? item
                : { ...item, schema: defaultLinkedContentSchema }
        )));
    }, [defaultLinkedContentSchema, mode]);

    useEffect(() => {
        if (!mention.open || !textareaRef.current) {
            return;
        }

        const updatePosition = () => {
            const textarea = textareaRef.current;
            if (!textarea || !mention.open) {
                return;
            }

            const rect = textarea.getBoundingClientRect();
            const estimatedHeight = Math.min(30 + mentionCandidates.length * 36, 260);
            setMention((prev) => ({
                ...prev,
                position: {
                    x: rect.left,
                    y: rect.top - estimatedHeight - 4,
                },
            }));
        };

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [mention.open, mentionCandidates.length]);

    const closeMention = () => {
        setMention((prev) => ({ ...prev, open: false, position: undefined }));
    };

    const updateMentionFromCaret = (text: string, caretOffset: number) => {
        if (!enableMentions) {
            closeMention();
            return;
        }

        const before = text.slice(0, caretOffset);
        const match = before.match(MENTION_REGEX);
        const textarea = textareaRef.current;

        if (match && textarea) {
            const rect = textarea.getBoundingClientRect();
            const query = match[1].toLowerCase();
            const candidates = query.trim()
                ? participants
                    .filter((participant) =>
                        (participant.username || '').toLowerCase().includes(query)
                        || (participant.display_name || '').toLowerCase().includes(query),
                    )
                    .slice(0, 20)
                : participants.slice(0, 20);
            const estimatedHeight = Math.min(30 + candidates.length * 36, 260);

            setMention({
                open: true,
                query: match[1],
                startOffset: caretOffset - match[0].length,
                selectedIndex: 0,
                position: {
                    x: rect.left,
                    y: rect.top - estimatedHeight - 4,
                },
            });
            return;
        }

        closeMention();
    };

    const commitMention = (participant: IConversationParticipant) => {
        const textarea = textareaRef.current;
        if (!textarea) {
            return;
        }

        const before = content.slice(0, mention.startOffset);
        const after = content.slice(textarea.selectionStart);
        const insertedValue = `@${participant.username} `;
        const nextContent = before + insertedValue + after;

        setContent(nextContent);
        closeMention();

        setTimeout(() => {
            textarea.focus();
            const nextCursorPosition = before.length + insertedValue.length;
            textarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
        }, 0);
    };

    const updateLinkedContentRow = (
        rowKey: string,
        updater: (item: ILinkedContentDraft) => ILinkedContentDraft,
    ) => {
        setLinkedContents((prev) => prev.map((item) => (
            item.key === rowKey ? updater(item) : item
        )));
    };

    const resolveLinkedContentTitle = async (rowKey: string, schema: string, refId: string) => {
        const normalizedSchema = schema.trim();
        const normalizedRefId = refId.trim();

        if (!normalizedSchema || !normalizedRefId) {
            linkedContentLookupRef.current[rowKey] = (linkedContentLookupRef.current[rowKey] || 0) + 1;
            updateLinkedContentRow(rowKey, (item) => ({
                ...item,
                title: '',
                loadingTitle: false,
                lookupError: null,
            }));
            return;
        }

        const nextLookupId = (linkedContentLookupRef.current[rowKey] || 0) + 1;
        linkedContentLookupRef.current[rowKey] = nextLookupId;

        updateLinkedContentRow(rowKey, (item) => ({
            ...item,
            title: '',
            loadingTitle: true,
            lookupError: null,
        }));

        try {
            const response = await dispatch(get_indexed_content(normalizedSchema, normalizedRefId, true));
            const matchedContent = response?.data?.find?.((item) => String(item?.itemId || '') === normalizedRefId)
                || response?.data?.[0];

            if (linkedContentLookupRef.current[rowKey] !== nextLookupId) {
                return;
            }

            const resolvedTitle = typeof matchedContent?.title === 'string' ? matchedContent.title.trim() : '';
            if (!resolvedTitle) {
                updateLinkedContentRow(rowKey, (item) => ({
                    ...item,
                    title: '',
                    loadingTitle: false,
                    lookupError: 'Không lấy được tiêu đề của dữ liệu đã chọn.',
                }));
                return;
            }

            updateLinkedContentRow(rowKey, (item) => ({
                ...item,
                title: resolvedTitle,
                loadingTitle: false,
                lookupError: null,
            }));
        } catch (error) {
            if (linkedContentLookupRef.current[rowKey] !== nextLookupId) {
                return;
            }

            console.warn('Không lấy được tiêu đề nội dung liên kết:', error);
            updateLinkedContentRow(rowKey, (item) => ({
                ...item,
                title: '',
                loadingTitle: false,
                lookupError: 'Không tìm thấy dữ liệu phù hợp. Vui lòng chọn lại.',
            }));
        }
    };

    const handleLinkedContentSchemaChange = (rowKey: string, value: string) => {
        linkedContentLookupRef.current[rowKey] = (linkedContentLookupRef.current[rowKey] || 0) + 1;
        updateLinkedContentRow(rowKey, (item) => ({
            ...item,
            schema: value,
            ref_id: '',
            title: '',
            loadingTitle: false,
            lookupError: null,
        }));
    };

    const handleLinkedContentRefChange = (rowKey: string, value: string | null) => {
        const normalizedValue = value ? String(value) : '';
        const currentRow = linkedContents.find((item) => item.key === rowKey);
        const nextSchema = currentRow?.schema?.trim() || '';

        linkedContentLookupRef.current[rowKey] = (linkedContentLookupRef.current[rowKey] || 0) + 1;
        updateLinkedContentRow(rowKey, (item) => ({
            ...item,
            ref_id: normalizedValue,
            title: '',
            loadingTitle: Boolean(nextSchema && normalizedValue),
            lookupError: null,
        }));

        if (nextSchema && normalizedValue) {
            void resolveLinkedContentTitle(rowKey, nextSchema, normalizedValue);
        }
    };

    const addLinkedContentRow = () => {
        setLinkedContents((prev) => [...prev, createLinkedContentDraft(defaultLinkedContentSchema)]);
    };

    const removeLinkedContentRow = (rowKey: string) => {
        setLinkedContents((prev) => {
            const next = prev.filter((item) => item.key !== rowKey);
            return next.length > 0 ? next : [createLinkedContentDraft(defaultLinkedContentSchema)];
        });
    };

    const handleSend = async () => {
        const hasContent = content.trim().length > 0;
        const hasAttachments = attachments.length > 0;

        if (mode === ComposerMode.LinkedContent) {
            if (!canSendLinkedContent) {
                return;
            }
        } else if (!hasContent && !hasAttachments) {
            return;
        }

        if (mode === ComposerMode.Schedule && !scheduledAtDayjs) {
            return;
        }

        const text = content;
        const linkedContentSnapshot = linkedContents.map((item) => ({ ...item }));
        const linkedContentPayload: IMessageLinkedContentPayload[] | undefined =
            mode === ComposerMode.LinkedContent
                ? validLinkedContents.map((item) => ({
                    schema: item.schema,
                    ref_id: item.ref_id,
                    title: item.title,
                }))
                : undefined;

        const schedule: IMessageSchedulePayload | undefined = mode === ComposerMode.Schedule
            ? {
                scheduled_at: scheduledAtDayjs ? scheduledAtDayjs.toDate() : null,
                timezone: schedulePayload.timezone,
                remind_before_minutes: schedulePayload.remind_before_minutes,
                recurrence: schedulePayload.recurrence,
            }
            : undefined;

        setContent('');
        closeMention();

        if (mode === ComposerMode.Schedule) {
            setScheduledAtDayjs(null);
            setSchedulePayload({
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Bangkok',
                remind_before_minutes: null,
                recurrence: null,
            });
        }

        if (mode === ComposerMode.LinkedContent) {
            setLinkedContents([]);
        }

        setSendStatus('sending');

        try {
            await Promise.resolve(
                onSendMessage(
                    text,
                    mode,
                    schedule,
                    attachments.length > 0 ? attachments : undefined,
                    linkedContentPayload,
                ),
            );
            setSendStatus('success');
            setMode(ComposerMode.Message);
            window.setTimeout(() => setSendStatus('idle'), 200);
        } catch {
            setContent(text);
            if (mode === ComposerMode.LinkedContent) {
                setLinkedContents(
                    linkedContentSnapshot.length > 0
                        ? linkedContentSnapshot
                        : [createLinkedContentDraft(defaultLinkedContentSchema)],
                );
            }
            setSendStatus('error');
            window.setTimeout(() => setSendStatus('idle'), 3000);
        }
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const nextValue = event.target.value;
        setContent(nextValue);
        updateMentionFromCaret(nextValue, event.target.selectionStart);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (mention.open) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setMention((prev) => ({
                    ...prev,
                    selectedIndex: Math.min(prev.selectedIndex + 1, mentionCandidates.length - 1),
                }));
                return;
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setMention((prev) => ({
                    ...prev,
                    selectedIndex: Math.max(prev.selectedIndex - 1, 0),
                }));
                return;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                closeMention();
                return;
            }

            if (event.key === 'Enter' || event.key === 'Tab') {
                if (mentionCandidates.length > 0) {
                    event.preventDefault();
                    const selectedCandidate = mentionCandidates[mention.selectedIndex];
                    if (selectedCandidate) {
                        commitMention(selectedCandidate);
                    }
                }
                return;
            }
        }

        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            void handleSend();
        }
    };

    const attachmentMenuItems = [
        {
            key: 'file',
            icon: <PaperClipOutlined />,
            label: 'Tải tệp lên',
            onClick: () => onAttach?.('file'),
        },
        {
            key: 'image',
            icon: <PictureOutlined />,
            label: 'Chèn ảnh',
            onClick: () => onAttach?.('image'),
        },
        {
            key: 'link',
            icon: <LinkOutlined />,
            label: 'Thêm liên kết',
            onClick: () => onAttach?.('link'),
        },
    ];

    const sendIcon = sendStatus === 'success'
        ? <CheckCircleOutlined />
        : sendStatus === 'error'
            ? <CloseCircleOutlined />
            : <SendOutlined />;

    const statusMessage = () => {
        if (threadStatus === ThreadStatus.Locked) {
            return (
                <>
                    <LockOutlined /> Luồng hội thoại đang bị khóa. Chỉ quản trị viên mới có thể mở khóa.
                </>
            );
        }

        if (threadStatus === ThreadStatus.Archived) {
            return (
                <div className="composer-status-with-action">
                    <span><FolderOutlined /> Luồng hội thoại đã lưu trữ.</span>
                    {onReActivate && (
                        <Button type="link" size="small" onClick={onReActivate} className="composer-reactivate-btn">
                            Kích hoạt lại
                        </Button>
                    )}
                </div>
            );
        }

        if (disabledReason) {
            return disabledReason;
        }

        return null;
    };

    const statusNode = statusMessage();

    return (
        <div className={`composer ${isDisabled ? 'disabled' : ''}`}>
            {statusNode && <div className="composer-status-message">{statusNode}</div>}

            {replyTo && onCancelReply && (
                <div className="composer-reply-preview">
                    <span className="composer-reply-label">↩ Đang trả lời {replyTo.createdBy}:</span>
                    <span className="composer-reply-text">"{getMessagePreviewText(replyTo, 60)}"</span>
                    <Button type="text" size="small" onClick={onCancelReply} className="composer-reply-cancel">
                        Hủy
                    </Button>
                </div>
            )}

            {attachments.length > 0 && (
                <div className="composer-attachments-badge">
                    <PaperClipOutlined /> {attachments.length} tệp đính kèm
                </div>
            )}

            {!isDisabled && (
                <>
                    <div className="composer-mode-selector">
                        <Radio.Group value={mode} onChange={(event) => setMode(event.target.value)}>
                            <Radio.Button value={ComposerMode.Message}><MessageOutlined style={{ marginRight: 4 }} />Tin nhắn</Radio.Button>
                            <Radio.Button value={ComposerMode.Note}><FileTextOutlined style={{ marginRight: 4 }} />Ghi chú</Radio.Button>
                            <Radio.Button value={ComposerMode.Schedule}><CalendarOutlined style={{ marginRight: 4 }} />Lịch</Radio.Button>
                            <Radio.Button value={ComposerMode.LinkedContent}><LinkOutlined style={{ marginRight: 4 }} />Nội dung liên kết</Radio.Button>
                        </Radio.Group>
                    </div>

                    {mode === ComposerMode.Note && (
                        <div className="composer-note-warning">
                            <ExclamationCircleOutlined /> Ghi chú nội bộ, chỉ nhân sự nội bộ mới nhìn thấy.
                        </div>
                    )}

                    {mode === ComposerMode.Schedule && (
                        <div className="composer-schedule-form">
                            <div className="composer-schedule-form-title"><CalendarOutlined /> Cấu hình lịch nhắc nhở</div>
                            <div className="composer-schedule-form-fields">
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <div className="composer-schedule-field">
                                        <span className="composer-schedule-label">Thời gian nhắc *</span>
                                        <DatePicker showTime value={scheduledAtDayjs} onChange={(date) => setScheduledAtDayjs(date)} placeholder="Chọn thời gian nhắc" style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
                                    </div>
                                    <div className="composer-schedule-field">
                                        <span className="composer-schedule-label">Múi giờ</span>
                                        <Select
                                            value={schedulePayload.timezone || undefined}
                                            onChange={(value) => setSchedulePayload((prev) => ({ ...prev, timezone: value || null }))}
                                            placeholder="Chọn múi giờ"
                                            style={{ width: '100%' }}
                                            allowClear
                                            options={[
                                                { value: 'Asia/Bangkok', label: 'Asia/Bangkok' },
                                                { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh' },
                                                { value: 'UTC', label: 'UTC' },
                                                { value: 'America/New_York', label: 'America/New_York' },
                                                { value: 'Europe/London', label: 'Europe/London' },
                                            ]}
                                        />
                                    </div>
                                    <div className="composer-schedule-field">
                                        <span className="composer-schedule-label">Nhắc trước (phút)</span>
                                        <InputNumber value={schedulePayload.remind_before_minutes ?? undefined} onChange={(value) => setSchedulePayload((prev) => ({ ...prev, remind_before_minutes: typeof value === 'number' ? value : null }))} placeholder="Ví dụ: 15" min={0} style={{ width: '100%' }} />
                                    </div>
                                    <div className="composer-schedule-field">
                                        <span className="composer-schedule-label">Lịch lặp lại (cron/rrule)</span>
                                        <Input value={schedulePayload.recurrence || ''} onChange={(event) => setSchedulePayload((prev) => ({ ...prev, recurrence: event.target.value || null }))} placeholder="Ví dụ: 0 9 * * MON (mỗi thứ 2 lúc 9h)" />
                                    </div>
                                </Space>
                            </div>
                        </div>
                    )}

                    {mode === ComposerMode.LinkedContent && (
                        <div className="composer-linked-content-form">
                            <div className="composer-linked-content-form-title"><LinkOutlined /> Danh sách nội dung liên kết</div>
                            <div className="composer-linked-content-form-hint">Chọn loại nội dung và dữ liệu cần liên kết. Caption vẫn là phần mô tả tùy chọn ở ô nhập bên dưới.</div>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                {linkedContents.map((item, index) => (
                                    <div key={item.key} className="composer-linked-content-row">
                                        <div className="composer-linked-content-field">
                                            <span className="composer-linked-content-label">Loại nội dung</span>
                                            <Select value={item.schema || undefined} onChange={(value) => handleLinkedContentSchemaChange(item.key, value)} placeholder={linkedContentSchemaLoading ? 'Đang tải loại nội dung...' : 'Chọn loại nội dung'} loading={linkedContentSchemaLoading} options={linkedContentSchemaOptions.map((option) => ({ value: option.value, label: option.label }))} />
                                        </div>
                                        <div className="composer-linked-content-field">
                                            <span className="composer-linked-content-label">Chọn thông tin</span>
                                            {item.schema ? (
                                                <IndexedSelect
                                                    schema={item.schema}
                                                    propType="ObjectId"
                                                    value={item.ref_id || undefined}
                                                    onChange={(value) => handleLinkedContentRefChange(item.key, typeof value === 'string' ? value : null)}
                                                    placeholder="Tìm kiếm dữ liệu liên kết"
                                                    style={{ width: '100%' }}
                                                />
                                            ) : (
                                                <Input disabled placeholder="Chọn loại nội dung trước" />
                                            )}
                                        </div>
                                        <div className="composer-linked-content-row-action">
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeLinkedContentRow(item.key)} aria-label={`Xóa nội dung liên kết ${index + 1}`} />
                                        </div>
                                        {(item.loadingTitle || item.lookupError || item.title) && (
                                            <div className={`composer-linked-content-preview ${item.lookupError ? 'is-error' : ''}`}>
                                                {item.lookupError ? item.lookupError : item.loadingTitle ? 'Đang lấy tiêu đề dữ liệu đã chọn...' : `Đã chọn: ${item.title}`}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </Space>
                            <div className="composer-linked-content-actions">
                                <Button type="dashed" icon={<PlusOutlined />} onClick={addLinkedContentRow}>Thêm nội dung liên kết</Button>
                            </div>
                            {hasIncompleteLinkedContent && (
                                <div className="composer-linked-content-error">Vui lòng chọn đầy đủ loại nội dung và thông tin cho các dòng đang nhập dở.</div>
                            )}
                        </div>
                    )}
                </>
            )}

            <div className="composer-input-wrapper">
                <div className="composer-input-area">
                    {enableFileSharing && (
                        <Tooltip title="Tải tệp lên" placement="top">
                            <Dropdown menu={{ items: attachmentMenuItems }} trigger={['click']} disabled={isDisabled}>
                                <Button type="text" icon={<PaperClipOutlined />} disabled={isDisabled} className="composer-attachment-button" />
                            </Dropdown>
                        </Tooltip>
                    )}
                    <textarea
                        ref={textareaRef}
                        className="composer-textarea"
                        placeholder={
                            mode === ComposerMode.Note
                                ? 'Nhập ghi chú nội bộ...'
                                : mode === ComposerMode.LinkedContent
                                    ? 'Nhập caption cho danh sách nội dung liên kết... (không bắt buộc)'
                                    : mode === ComposerMode.Schedule
                                        ? enableMentions ? 'Nhập nội dung lịch nhắc nhở... (gõ @ để nhắc thành viên)' : 'Nhập nội dung lịch nhắc nhở...'
                                        : enableMentions ? 'Nhập nội dung tin nhắn... (gõ @ để nhắc thành viên)' : 'Nhập nội dung tin nhắn...'
                        }
                        value={content}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        onMouseUp={() => {
                            const textarea = textareaRef.current;
                            if (textarea) {
                                updateMentionFromCaret(content, textarea.selectionStart);
                            }
                        }}
                        disabled={isDisabled}
                        rows={1}
                    />
                    <Button
                        type="primary"
                        icon={sendIcon}
                        onClick={() => void handleSend()}
                        disabled={(mode === ComposerMode.LinkedContent ? !canSendLinkedContent : (!content.trim() && attachments.length === 0)) || isDisabled || sendStatus === 'sending' || (mode === ComposerMode.Schedule && !scheduledAtDayjs)}
                        loading={sendStatus === 'sending'}
                        className={`composer-send-button send-status-${sendStatus}`}
                    />
                </div>

                {mention.open && mention.position && mentionCandidates.length > 0 && (
                    <div className="composer-mention-dropdown" style={{ position: 'fixed', left: `${mention.position.x}px`, top: `${mention.position.y}px` }}>
                        <div className="composer-mention-dropdown-title"><UserOutlined /> Nhắc thành viên</div>
                        {mentionCandidates.map((participant, index) => (
                            <div
                                key={participant.username}
                                role="option"
                                aria-selected={index === mention.selectedIndex}
                                className={`composer-mention-item ${index === mention.selectedIndex ? 'composer-mention-item-active' : ''}`}
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    commitMention(participant);
                                }}
                                onMouseEnter={() => setMention((prev) => ({ ...prev, selectedIndex: index }))}
                            >
                                <span className="composer-mention-item-label">{participant.display_name || participant.username}</span>
                                {participant.display_name && participant.display_name !== participant.username && (
                                    <span className="composer-mention-item-username">@{participant.username}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!isDisabled && (
                <div className="composer-hint"><BulbOutlined /> Gợi ý: Enter để gửi, Shift+Enter để xuống dòng.</div>
            )}
        </div>
    );
});

Composer.displayName = 'Composer';

export type { AttachmentMenuType };
export default Composer;
