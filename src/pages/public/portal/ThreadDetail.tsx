import React from 'react';
import {
    Card, Button, Typography, Avatar, Tag, Form, Input, Upload, message, Tooltip
} from 'antd';
import { SendOutlined, UserOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPortalThreads, mockJourneys } from '../../../data/journeyMockData';
import PortalPageHeader from '../../../components/portal/PortalPageHeader';


const { TextArea } = Input;

const ThreadDetail: React.FC = () => {
    const { token, threadId } = useParams<{ token: string; threadId: string }>();
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.portal_token === token || j.journey_code === token);
    const thread = mockPortalThreads.find(t => t.thread_id === threadId) || mockPortalThreads[0];
    const [replyForm] = Form.useForm();

    if (!journey || !thread) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy dữ liệu.</div>;

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
            {/* Thread Header */}
            <PortalPageHeader 
                title={thread.context_label}
                subtitle={thread.context_type}
                onBack={() => navigate(`/portal/${token}/threads`)}
                token={token || ''}
                extra={
                    <Tag color={thread.status === 'open' ? 'processing' : thread.status === 'closed' ? 'default' : 'warning'}>
                        {thread.status === 'open' ? 'Đang mở' : thread.status === 'closed' ? 'Đã đóng' : 'Chờ phản hồi'}
                    </Tag>
                }
            />

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

            {/* Inline Reply Composer */}
            {thread.status !== 'closed' ? (
                <Card style={{ borderRadius: 12 }}>
                    <Form form={replyForm} layout="vertical" onFinish={() => { message.success('Đã gửi phản hồi'); replyForm.resetFields(); }}>
                        <Form.Item name="message_body" style={{ marginBottom: 12 }} rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                            <TextArea rows={3} placeholder="Nhập nội dung phản hồi..." />
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Tooltip title="Chưa hỗ trợ tải lên trong bản demo">
                                <Upload showUploadList={false}>
                                    <Button icon={<PaperClipOutlined />} type="dashed">Đính kèm</Button>
                                </Upload>
                            </Tooltip>
                            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                                Gửi
                            </Button>
                        </div>
                    </Form>
                </Card>
            ) : (
                <div style={{ padding: 24, textAlign: 'center', background: '#f5f5f5', borderRadius: 12 }}>
                    <Typography.Text type="secondary">Hội thoại này đã được đóng.</Typography.Text>
                </div>
            )}
        </div>
    );
};

export default ThreadDetail;
