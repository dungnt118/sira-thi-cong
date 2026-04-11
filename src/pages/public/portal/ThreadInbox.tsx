import React, { useState } from 'react';
import {
    Card, List, Tag, Button, Typography, Space, Badge, Modal, Form, Input, Select, Spin
} from 'antd';
import { PlusOutlined, MessageOutlined, FileSearchOutlined, BuildOutlined, DollarOutlined, QuestionCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import PortalPageHeader from '../../../components/portal/PortalPageHeader';
import { usePortalJourney } from '../../../hooks/usePortalJourney';
import { usePortalThreads } from '../../../hooks/usePortalThreads';
import { IPortalThread } from '../../../services/core-contracts/types/portalThread.types';
import dayjs from 'dayjs';

const { Text } = Typography;
const { TextArea } = Input;

const STATUS_COLOR: Record<string, string> = { open: 'processing', waiting: 'warning', closed: 'default' };
const STATUS_LABEL: Record<string, string> = { open: 'Đang mở', waiting: 'Chờ phản hồi', closed: 'Đã đóng' };

const ThreadInbox: React.FC = () => {
    const { journeyId, token } = useParams<{ journeyId?: string; token?: string }>();
    const portalKey = journeyId || token;
    const navigate = useNavigate();
    const { journey, isLoading: isLoadingJourney } = usePortalJourney(portalKey);
    const { threads, isLoading: isLoadingThreads } = usePortalThreads(journey?._id);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm] = Form.useForm();
    const [filterContext, setFilterContext] = useState<string>('all');

    const isLoading = isLoadingJourney || (journey && isLoadingThreads);

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#38bdf8' }} spin />} />
            </div>
        );
    }

    if (!journey) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy dữ liệu.</div>;

    const filteredThreads = threads.filter(t => filterContext === 'all' || t.context_type === filterContext);

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
            <PortalPageHeader 
                title="Hội thoại & Câu hỏi" 
                subtitle={journey.customer_full_name || journey.customer_id || ''}
                token={journey._id || portalKey || ''}
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
                renderItem={(thread: IPortalThread) => (
                    <Card
                        key={thread._id}
                        size="small"
                        hoverable
                        style={{ marginBottom: 10, borderRadius: 10, cursor: 'pointer' }}
                        onClick={() => navigate(`/portal/journeys/${journey.journey_code || portalKey}/threads/${thread._id}`)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Space>
                                    <MessageOutlined style={{ color: '#38bdf8' }} />
                                    <Text strong>{thread.context_label}</Text>
                                    {(thread.unread_count || 0) > 0 && <Badge count={thread.unread_count} size="small" />}
                                </Space>
                                <div style={{ marginTop: 4 }}>
                                    <Tag color={STATUS_COLOR[thread.status || 'open']} style={{ fontSize: 11 }}>
                                        {STATUS_LABEL[thread.status || 'open']}
                                    </Tag>
                                    <Tag style={{ fontSize: 11 }}>{thread.context_type}</Tag>
                                </div>
                            </div>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {thread.last_message_at ? dayjs(thread.last_message_at).format('DD/MM/YYYY') : ''}
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
