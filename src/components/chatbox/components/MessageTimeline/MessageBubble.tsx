import { CommentOutlined, CopyOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { formatMessageTime, getAvatarColor, getInitials, getMessagePreviewText, highlightMentions } from '../../utils/chatboxUtils';
import type { IContentChatboxMessage } from '../../contentConversation.types';
import AttachmentList from './AttachmentList';
import './MessageBubble.less';

interface IMessageBubbleProps {
    message: IContentChatboxMessage;
    repliedToMessage?: IContentChatboxMessage | null;
    isFirstOfGroup: boolean;
    currentUsername?: string;
    onReply?: () => void;
}

const getDisplayContent = (content?: string): string => {
    if (!content) return '';
    const processed = content.includes('<') ? content : content.replace(/\n/g, ' ');
    return highlightMentions(processed);
};

export default function MessageBubble({
    message,
    repliedToMessage,
    isFirstOfGroup,
    currentUsername,
    onReply,
}: IMessageBubbleProps) {
    const isOwnMessage = message.createdBy === currentUsername;
    const menuItems = [
        ...(onReply ? [{
            key: 'reply',
            icon: <CommentOutlined />,
            label: 'Trả lời',
            onClick: onReply,
        }] : []),
        {
            key: 'copy',
            icon: <CopyOutlined />,
            label: 'Sao chép nội dung',
            onClick: async () => {
                const plainText = getMessagePreviewText(message, 5000);
                if (plainText) await navigator.clipboard.writeText(plainText);
            },
        },
    ];

    return (
        <div className={`message-bubble-container ${isOwnMessage ? 'own-message' : 'other-message'}`}>
            {!isOwnMessage && isFirstOfGroup && (
                <div className="message-avatar" style={{ backgroundColor: getAvatarColor(message.createdBy || '') }} title={message.createdBy}>
                    {getInitials(message.createdBy || 'Unknown')}
                </div>
            )}
            {!isOwnMessage && !isFirstOfGroup && <div className="message-avatar-spacer" />}

            <div className="message-bubble-content">
                <div className="message-bubble">
                    {repliedToMessage && (
                        <div className="message-reply-preview">
                            <span className="reply-preview-label">↩ Trả lời {repliedToMessage.createdBy}:</span>
                            <span className="reply-preview-text">"{getMessagePreviewText(repliedToMessage, 60)}"</span>
                        </div>
                    )}

                    <div className="message-text" dangerouslySetInnerHTML={{ __html: getDisplayContent(message.content) }} />

                    {Array.isArray(message.payload?.attachments) && message.payload.attachments.length > 0 && (
                        <AttachmentList attachments={message.payload.attachments} />
                    )}

                    <div className="message-meta">
                        <span className="message-time">{message.createdBy} • {formatMessageTime(message.createdAt)}</span>
                    </div>
                </div>

                <div className="message-actions-slot">
                    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                        <Button
                            type="text"
                            size="small"
                            icon={<EllipsisOutlined />}
                            className="message-actions-button visible"
                            aria-label="Tác vụ tin nhắn"
                        />
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}
