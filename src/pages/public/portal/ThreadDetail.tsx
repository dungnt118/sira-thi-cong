import React from 'react';
import {
    Card, Button, Typography, Avatar, Tag, Form, Input, Upload, message, Tooltip, Spin
} from 'antd';
import { SendOutlined, UserOutlined, PaperClipOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import PortalPageHeader from '../../../components/portal/PortalPageHeader';
import { usePortalJourney } from '../../../hooks/usePortalJourney';
import { usePortalThreadDetail, usePortalMessages } from '../../../hooks/usePortalThreads';
import dayjs from 'dayjs';


const { TextArea } = Input;

const ThreadDetail: React.FC = () => {
    const { journeyId, token, threadId } = useParams<{ journeyId?: string; token?: string; threadId: string }>();
    const portalKey = journeyId || token;
    const navigate = useNavigate();
    const { journey, isLoading: isLoadingJourney } = usePortalJourney(portalKey);
    const { thread, isLoading: isLoadingThread } = usePortalThreadDetail(threadId);
    const { messages, isLoading: isLoadingMessages } = usePortalMessages(threadId);
    const [replyForm] = Form.useForm();

    const isLoading = isLoadingJourney || isLoadingThread || isLoadingMessages;

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#38bdf8' }} spin />} />
            </div>
        );
    }

    if (!journey || !thread) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy dữ liệu.</div>;

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
            {/* Thread Header */}
            <PortalPageHeader 
                title={thread.context_label}
                subtitle={thread.context_type}
                onBack={() => navigate(`/portal/journeys/${journey._id || portalKey}/threads`)}
                token={journey._id || portalKey || ''}
                extra={
                    <Tag color={thread.status === 'open' ? 'processing' : thread.status === 'closed' ? 'default' : 'warning'}>
                        {thread.status === 'open' ? 'Đang mở' : thread.status === 'closed' ? 'Đã đóng' : 'Chờ phản hồi'}
                    </Tag>
                }
            />

            {/* Messages */}
            <Card style={{ borderRadius: 12, marginBottom: 16, minHeight: 300 }}>
                {messages.length === 0 ? (
                    <div style={{ padding: '40px 0', textAlign: 'center' }}>
                        <Typography.Text type="secondary">Chưa có tin nhắn nào trong hội thoại này.</Typography.Text>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg._id} style={{
                            display: 'flex',
                            flexDirection: msg.sender_role === 'customer' ? 'row' : 'row-reverse',
                            gap: 8, marginBottom: 16,
                        }}>
                            <Avatar
                                size={32}
                                icon={<UserOutlined />}
                                style={{ background: msg.sender_role === 'customer' ? '#722ed1' : '#38bdf8', flexShrink: 0 }}
                            />
                            <div>
                                <div style={{ fontSize: 11, color: '#999', marginBottom: 2,
                                    textAlign: msg.sender_role === 'customer' ? 'left' : 'right' }}>
                                    {msg.sender || 'Người dùng'} · {msg.sent_at ? dayjs(msg.sent_at).format('DD/MM/YYYY') : ''}
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
                    ))
                )}
            </Card>

            {/* Inline Reply Composer */}
            {thread.status !== 'closed' ? (
                <Card style={{ borderRadius: 12 }}>
                    <Form form={replyForm} layout="vertical" onFinish={() => { message.success('Đã gửi phản hồi'); replyForm.resetFields(); }}>
                        <Form.Item name="message_body" style={{ marginBottom: 12 }} rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                            <TextArea rows={3} placeholder="Nhập nội dung phản hồi..." />
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Tooltip title="Chưa hỗ trợ tải lên">
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
