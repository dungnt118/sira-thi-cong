import { CopyOutlined, EllipsisOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { formatMessageTime } from '../../utils/chatboxUtils';
import type { IContentChatboxMessage } from '../../contentConversation.types';
import './NoteCard.less';

interface INoteCardProps {
    message: IContentChatboxMessage;
}

export default function NoteCard({ message }: INoteCardProps) {
    const menuItems = [{
        key: 'copy',
        icon: <CopyOutlined />,
        label: 'Sao chép nội dung',
        onClick: async () => {
            await navigator.clipboard.writeText(message.content || '');
        },
    }];

    return (
        <div className="note-card">
            <div className="note-card-header">
                <span className="note-card-title"><FileTextOutlined /> Internal Note</span>
                <span className="note-card-badge">Only Staff</span>
            </div>

            <div className="note-card-content" dangerouslySetInnerHTML={{ __html: message.content }} />

            <div className="note-card-footer">
                <span className="note-card-meta">{message.createdBy} • {formatMessageTime(message.createdAt)}</span>
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                    <Button type="text" size="small" icon={<EllipsisOutlined />} className="note-card-actions" />
                </Dropdown>
            </div>
        </div>
    );
}
