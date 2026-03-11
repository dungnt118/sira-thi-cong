import React, { useState } from 'react';
import {
    Card, Button, Typography, Avatar, Tag, Modal, Form, Input
} from 'antd';
import { ArrowLeftOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPortalThreads, mockJourneys } from '../../../data/journeyMockData';

const { Title } = Typography;
const { TextArea } = Input;

const ThreadDetail: React.FC = () => {
    const { token, threadId } = useParams<{ token: string; threadId: string }>();
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.portal_token === token);
    const thread = mockPortalThreads.find(t => t.thread_id === threadId) || mockPortalThreads[0];
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyForm] = Form.useForm();

    if (!journey || !thread) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy dữ liệu.</div>;

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
            {/* Thread Header */}
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Button icon={<ArrowLeftOutlined />} type="text" size="small"
                            onClick={() => navigate(`/portal/${token}/threads`)} style={{ marginRight: 8 }} />
                        <Title level={5} style={{ display: 'inline', margin: 0 }}>{thread.context_label}</Title>
                        <Tag style={{ marginLeft: 8 }}>{thread.context_type}</Tag>
                    </div>
                    <Tag color={thread.status === 'open' ? 'processing' : thread.status === 'closed' ? 'default' : 'warning'}>
                        {thread.status === 'open' ? 'Đang mở' : thread.status === 'closed' ? 'Đã đóng' : 'Chờ phản hồi'}
                    </Tag>
                </div>
            </Card>

            {/* Messages */}
            <Card style={{ borderRadius: 12, marginBottom: 16, minHeight: 300 }}>
                {thread.messages.map(msg => (
                    <div key={msg.id} style={{
                        display: 'flex',
                        flexDirection: msg.sender_role === 'customer' ? 'row' : 'row-reverse',
                        gap: 8, marginBottom: 16,
                    }}>
                        <Avatar
                            size={32}
                            icon={<UserOutlined />}
                            style={{ background: msg.sender_role === 'customer' ? '#722ed1' : '#1976D2', flexShrink: 0 }}
                        />
                        <div>
                            <div style={{ fontSize: 11, color: '#999', marginBottom: 2,
                                textAlign: msg.sender_role === 'customer' ? 'left' : 'right' }}>
                                {msg.sender} · {msg.sent_at.split('T')[0]}
                                {msg.official_response && <Tag color="blue" style={{ marginLeft: 4, fontSize: 9 }}>Official</Tag>}
                            </div>
                            <div style={{
                                padding: '10px 14px', borderRadius: 12,
                                background: msg.sender_role === 'customer' ? '#f5f5f5' : '#e6f4ff',
                                maxWidth: 360, fontSize: 13,
                            }}>
                                {msg.message_body}
                            </div>
                        </div>
                    </div>
                ))}
            </Card>

            {/* Reply CTA */}
            {thread.status !== 'closed' && (
                <Button
                    type="primary"
                    block
                    icon={<SendOutlined />}
                    onClick={() => setShowReplyModal(true)}
                    style={{ borderRadius: 8, height: 44 }}
                >
                    Gửi phản hồi
                </Button>
            )}

            {/* Reply Modal */}
            <Modal title="Phản hồi" open={showReplyModal}
                onCancel={() => { setShowReplyModal(false); replyForm.resetFields(); }}
                onOk={() => replyForm.submit()} okText="Gửi" cancelText="Hủy">
                <Form form={replyForm} layout="vertical" onFinish={() => { setShowReplyModal(false); replyForm.resetFields(); }}>
                    <Form.Item label="Nội dung phản hồi" name="message_body" rules={[{ required: true }]}>
                        <TextArea rows={4} placeholder="Nhập nội dung..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ThreadDetail;
