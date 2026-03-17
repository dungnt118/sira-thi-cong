import React, { useState } from 'react';
import {
    Card, List, Tag, Button, Typography, Space, Badge, Modal, Form, Input, Select
} from 'antd';
import { PlusOutlined, MessageOutlined, FileSearchOutlined, BuildOutlined, DollarOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPortalThreads, mockJourneys } from '../../../data/journeyMockData';
import type { PortalThread } from '../../../types/journey';
import PortalPageHeader from '../../../components/portal/PortalPageHeader';

const { Text } = Typography;
const { TextArea } = Input;

const STATUS_COLOR: Record<string, string> = { open: 'processing', waiting: 'warning', closed: 'default' };
const STATUS_LABEL: Record<string, string> = { open: 'Đang mở', waiting: 'Chờ phản hồi', closed: 'Đã đóng' };

const ThreadInbox: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.portal_token === token || j.journey_code === token);
    const threads = mockPortalThreads.filter(t => t.journey_id === journey?.id);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm] = Form.useForm();
    const [filterContext, setFilterContext] = useState<string>('all');

    if (!journey) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy dữ liệu.</div>;

    const filteredThreads = threads.filter(t => filterContext === 'all' || t.context_type === filterContext);

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
            <PortalPageHeader 
                title="Hội thoại & Câu hỏi" 
                subtitle={journey.customer_name}
                token={token || ''}
                icon={<MessageOutlined />}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => setShowCreateModal(true)}>
                        Tạo thread
                    </Button>
                }
            />

            <div style={{ marginBottom: 16 }}>
                <Select
                    value={filterContext}
                    onChange={setFilterContext}
                    style={{ width: 160 }}
                    options={[
                        { value: 'all', label: 'Tất cả chủ đề' },
                        { value: 'survey', label: 'Về khảo sát' },
                        { value: 'progress', label: 'Về tiến độ' },
                        { value: 'payment', label: 'Về thanh toán' },
                        { value: 'general', label: 'Câu hỏi chung' },
                    ]}
                />
            </div>

            <List
                dataSource={filteredThreads}
                locale={{ emptyText: 'Chưa có hội thoại nào. Nhấn "Tạo thread" để bắt đầu.' }}
                renderItem={(thread: PortalThread) => (
                    <Card
                        key={thread.thread_id}
                        size="small"
                        hoverable
                        style={{ marginBottom: 10, borderRadius: 10, cursor: 'pointer' }}
                        onClick={() => navigate(`/portal/${token}/threads/${thread.thread_id}`)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Space>
                                    <MessageOutlined style={{ color: '#1976D2' }} />
                                    <Text strong>{thread.context_label}</Text>
                                    {thread.unread_count > 0 && <Badge count={thread.unread_count} size="small" />}
                                </Space>
                                <div style={{ marginTop: 4 }}>
                                    <Tag color={STATUS_COLOR[thread.status]} style={{ fontSize: 11 }}>
                                        {STATUS_LABEL[thread.status]}
                                    </Tag>
                                    <Tag style={{ fontSize: 11 }}>{thread.context_type}</Tag>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                                    {thread.messages[thread.messages.length - 1]?.message_body?.slice(0, 60)}...
                                </Text>
                            </div>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {thread.last_message_at?.split('T')[0]}
                            </Text>
                        </div>
                    </Card>
                )}
            />

            <Modal title="Tạo hội thoại mới" open={showCreateModal}
                onCancel={() => { setShowCreateModal(false); createForm.resetFields(); }}
                onOk={() => createForm.submit()} okText="Gửi" cancelText="Hủy">
                <Form form={createForm} layout="vertical" onFinish={() => { setShowCreateModal(false); createForm.resetFields(); }}>
                    <Form.Item label="Loại câu hỏi" name="context_type" rules={[{ required: true }]}>
                        <Select options={[
                            { value: 'survey', label: <span><FileSearchOutlined /> Về khảo sát</span> },
                            { value: 'progress', label: <span><BuildOutlined /> Về tiến độ</span> },
                            { value: 'payment', label: <span><DollarOutlined /> Về thanh toán</span> },
                            { value: 'general', label: <span><QuestionCircleOutlined /> Câu hỏi chung</span> },
                        ]} />
                    </Form.Item>
                    <Form.Item label="Tiêu đề" name="context_label" rules={[{ required: true }]}>
                        <Input placeholder="Tóm tắt câu hỏi..." />
                    </Form.Item>
                    <Form.Item label="Nội dung" name="message_body" rules={[{ required: true }]}>
                        <TextArea rows={4} placeholder="Ghi câu hỏi chi tiết..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ThreadInbox;
