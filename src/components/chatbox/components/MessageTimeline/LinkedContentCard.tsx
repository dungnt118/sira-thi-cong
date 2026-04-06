import { DeleteOutlined, EllipsisOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Dropdown, message } from 'antd';
import { buildLinkedContentDetailPath, formatMessageTime, getLinkedContents, isMessageDeletable, stripHtmlTags } from '../../utils/chatboxUtils';
import type { IContentChatboxMessage } from '../../contentConversation.types';
import './LinkedContentCard.less';

interface ILinkedContentCardProps {
    message: IContentChatboxMessage;
    currentUsername?: string;
    isAdmin?: boolean;
    onDelete?: () => void;
}

const DEFAULT_VISIBLE_ITEM_COUNT = 3;

export default function LinkedContentCard({
    message: messageItem,
    currentUsername,
    isAdmin = false,
    onDelete,
}: ILinkedContentCardProps) {
    const linkedContents = getLinkedContents(messageItem);
    const canDelete = isMessageDeletable(messageItem, currentUsername, isAdmin);
    const caption = stripHtmlTags(messageItem.content ?? '').trim();
    const visibleLinkedContents = linkedContents.slice(0, DEFAULT_VISIBLE_ITEM_COUNT);

    const menuItems = canDelete && onDelete ? [{
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Xóa liên kết',
        danger: true,
        onClick: onDelete,
    }] : [];

    return (
        <div className="linked-content-card">
            <div className="linked-content-card-header">
                <div className="linked-content-card-heading">
                    <span className="linked-content-card-title">
                        <LinkOutlined />
                        Nội dung liên kết
                    </span>
                    <span className="linked-content-card-count">{linkedContents.length} mục</span>
                </div>

                {menuItems.length > 0 && (
                    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                        <Button type="text" size="small" icon={<EllipsisOutlined />} className="linked-content-card-actions" />
                    </Dropdown>
                )}
            </div>

            {caption && <div className="linked-content-card-caption">{caption}</div>}

            <div className="linked-content-card-list">
                {visibleLinkedContents.map((item) => (
                    <button
                        key={`${item.schema}-${item.ref_id}`}
                        type="button"
                        className="linked-content-card-item"
                        onClick={() => {
                            try {
                                const path = buildLinkedContentDetailPath(item.schema, item.ref_id);
                                window.open(path, '_blank', 'noopener,noreferrer');
                            } catch (error) {
                                console.error('Không thể mở nội dung liên kết:', error);
                                message.error('Không thể mở chi tiết nội dung liên kết.');
                            }
                        }}
                    >
                        <div className="linked-content-card-item-body">
                            <span className="linked-content-card-item-title">{item.title}</span>
                            <span className="linked-content-card-item-meta">{item.schema}</span>
                        </div>
                        <span className="linked-content-card-item-action">Mở</span>
                    </button>
                ))}
            </div>

            <div className="linked-content-card-footer">
                <span className="linked-content-card-meta">{messageItem.createdBy} • {formatMessageTime(messageItem.createdAt)}</span>
            </div>
        </div>
    );
}
