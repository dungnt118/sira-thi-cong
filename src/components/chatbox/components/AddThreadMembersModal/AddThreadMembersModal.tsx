import { DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Empty, List, Modal, Typography, message } from 'antd';
import { useState } from 'react';
import { AuthorizedUserSelect } from '@/components/authorizedusers/AuthorizedUser';
import { contentConversationService } from '../../contentConversation.service';
import './AddThreadMembersModal.less';

const { Text } = Typography;

export interface IAddThreadMembersModalProps {
    open: boolean;
    onClose: () => void;
    threadId: string;
    onInviteSuccess?: () => void | Promise<void>;
}

export default function AddThreadMembersModal({
    open,
    onClose,
    threadId,
    onInviteSuccess,
}: IAddThreadMembersModalProps) {
    const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleClose = () => {
        setSelectedUsernames([]);
        onClose();
    };

    const handleSubmit = async () => {
        if (!threadId) {
            message.error('Không xác định được luồng hội thoại.');
            return;
        }

        if (selectedUsernames.length === 0) {
            message.warning('Vui lòng chọn ít nhất một thành viên.');
            return;
        }

        setSubmitting(true);
        try {
            await contentConversationService.inviteThreadUsers(threadId, selectedUsernames);
            await onInviteSuccess?.();
            message.success('Đã mời thêm thành viên vào luồng.');
            handleClose();
        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Mời thành viên thất bại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Thêm thành viên"
            open={open}
            onCancel={handleClose}
            onOk={() => void handleSubmit()}
            okText="Gửi lời mời"
            cancelText="Hủy"
            confirmLoading={submitting}
            destroyOnClose
            width={560}
            className="add-thread-members-modal"
        >
            <div className="add-thread-members-modal-body">
                <div className="add-thread-members-modal-intro">
                    <TeamOutlined />
                    <span>Tìm theo họ tên hoặc username để mời thêm thành viên vào luồng hiện tại.</span>
                </div>

                <AuthorizedUserSelect
                    value={selectedUsernames}
                    onChange={(value) => setSelectedUsernames(Array.isArray(value) ? value : [])}
                    allowMultiple
                    placeholder="Tìm theo tên, email, username..."
                />

                <div className="add-thread-members-modal-section-title">
                    Danh sách chờ ({selectedUsernames.length})
                </div>

                {selectedUsernames.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<Text type="secondary">Chưa chọn thành viên nào.</Text>}
                    />
                ) : (
                    <List
                        size="small"
                        className="add-thread-members-modal-list"
                        dataSource={selectedUsernames}
                        renderItem={(username) => (
                            <List.Item
                                actions={[
                                    <Button
                                        key="remove"
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={() => setSelectedUsernames((current) => current.filter((item) => item !== username))}
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    title={username}
                                    description={`@${username}`}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </Modal>
    );
}
