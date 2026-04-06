import { CheckCircleOutlined, CloseOutlined, GlobalOutlined, LockOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, List, Select, Space, Tag } from 'antd';
import { ConversationVisibility, ThreadStatus, type IConversationThread } from '../../contentConversation.types';
import { getAvatarColor, getInitials } from '../../utils/chatboxUtils';
import './ThreadInfoDrawer.less';

interface IThreadInfoDrawerProps {
    thread: IConversationThread;
    onClose: () => void;
}

export default function ThreadInfoDrawer({ thread, onClose }: IThreadInfoDrawerProps) {
    return (
        <div className="thread-info-drawer">
            <Form layout="vertical">
                <Form.Item label="Tiêu đề" className="form-item-large">
                    <Input value={thread.title} disabled />
                </Form.Item>

                <div className="thread-info-section">
                    <div className="info-row"><span className="info-label">Owner:</span><span className="info-value">{thread.owner}</span></div>
                    <div className="info-row"><span className="info-label">Loại:</span><span className="info-value">{thread.thread_type}</span></div>
                    <div className="info-row"><span className="info-label">Tạo lúc:</span><span className="info-value">{new Date(thread.createdAt).toLocaleString('vi-VN')}</span></div>
                    <div className="info-row"><span className="info-label">Cập nhật:</span><span className="info-value">{thread.updatedAt ? new Date(thread.updatedAt).toLocaleString('vi-VN') : '—'}</span></div>
                </div>

                <Form.Item label="Trạng thái">
                    <Select
                        disabled
                        value={thread.status}
                        options={[
                            { label: <><CheckCircleOutlined /> Đang mở</>, value: ThreadStatus.Active },
                            { label: <><LockOutlined /> Khóa</>, value: ThreadStatus.Locked },
                            { label: 'Lưu trữ', value: ThreadStatus.Archived },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Visibility">
                    <Select
                        disabled
                        value={thread.visibility}
                        options={[
                            { label: <><LockOutlined /> Riêng tư</>, value: ConversationVisibility.Private },
                            { label: 'Nội bộ', value: ConversationVisibility.Internal },
                            { label: <><GlobalOutlined /> Công khai</>, value: ConversationVisibility.Public },
                            { label: 'Hạn chế', value: ConversationVisibility.Restricted },
                        ]}
                    />
                </Form.Item>

                {Array.isArray(thread.tags) && thread.tags.length > 0 && (
                    <Form.Item label="Tags">
                        <Space wrap>
                            {thread.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                        </Space>
                    </Form.Item>
                )}

                <Form.Item label={`Thành viên (${thread.participants.length})`}>
                    <List
                        dataSource={thread.participants}
                        renderItem={(participant) => (
                            <List.Item className="participant-item">
                                <div className="participant-info">
                                    <Avatar style={{ backgroundColor: getAvatarColor(participant.username) }} size="small">
                                        {getInitials(participant.display_name || participant.username)}
                                    </Avatar>
                                    <div className="participant-details">
                                        <div className="participant-name">{participant.display_name || participant.username}</div>
                                        <div className="participant-meta">{participant.role || 'Member'} • {participant.status || 'Active'}</div>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Form.Item>
            </Form>

            <div className="drawer-actions">
                <Button onClick={onClose} icon={<CloseOutlined />}>Đóng</Button>
            </div>
        </div>
    );
}
