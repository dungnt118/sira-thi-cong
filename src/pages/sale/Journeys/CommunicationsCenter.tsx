import React, { useState } from 'react';
import {
    Card, List, Tag, Button, Typography, Input, Select, Space,
    Modal, Form, Badge, Row, Col, Avatar, Switch
} from 'antd';
import { MessageOutlined, PlusOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { mockPortalThreads } from '../../../data/journeyMockData';
import type { PortalThread } from '../../../types/journey';

const { Text } = Typography;
const { TextArea } = Input;

const STATUS_COLOR: Record<string, string> = { open: 'processing', waiting: 'warning', closed: 'default' };
const STATUS_LABEL: Record<string, string> = { open: 'Đang mở', waiting: 'Chờ phản hồi', closed: 'Đã đóng' };

const CommunicationsCenter: React.FC = () => {
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedThread, setSelectedThread] = useState<PortalThread | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm] = Form.useForm();
    const [replyForm] = Form.useForm();

    const filtered = mockPortalThreads.filter(t => filterStatus === 'ALL' || t.status === filterStatus);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h2 style={{ margin: 0 }}>Trung tâm Giao tiếp</h2>
                    <Text type="secondary">Quản lý thread Portal và follow-up khách hàng</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
                    Tạo Thread
                </Button>
            </div>

            <Row gutter={16}>
                {/* Thread List */}
                <Col xs={24} md={10}>
                    <Card style={{ borderRadius: 10 }}>
                        <Row style={{ marginBottom: 12 }} gutter={8}>
                            <Col flex="auto">
                                <Select
                                    size="small" style={{ width: '100%' }}
                                    value={filterStatus} onChange={setFilterStatus}
                                    options={[
                                        { value: 'ALL', label: 'Tất cả' },
                                        { value: 'open', label: 'Đang mở' },
                                        { value: 'waiting', label: 'Chờ phản hồi' },
                                        { value: 'closed', label: 'Đã đóng' },
                                    ]}
                                />
                            </Col>
                        </Row>
                        <List
                            dataSource={filtered}
                            renderItem={thread => (
                                <List.Item
                                    style={{
                                        cursor: 'pointer', borderRadius: 8, padding: '8px 12px',
                                        background: selectedThread?.thread_id === thread.thread_id ? '#e6f4ff' : 'transparent',
                                        border: selectedThread?.thread_id === thread.thread_id ? '1px solid #91caff' : '1px solid transparent',
                                        marginBottom: 4,
                                    }}
                                    onClick={() => setSelectedThread(thread)}
                                >
                                    <List.Item.Meta
                                        avatar={<MessageOutlined style={{ color: '#1976D2', fontSize: 18 }} />}
                                        title={
                                            <Space>
                                                <Text strong style={{ fontSize: 13 }}>{thread.context_label}</Text>
                                                {thread.unread_count > 0 && <Badge count={thread.unread_count} size="small" />}
                                            </Space>
                                        }
                                        description={
                                            <Space size={4}>
                                                <Badge status={STATUS_COLOR[thread.status] as any} text={STATUS_LABEL[thread.status]} />
                                                <Tag style={{ fontSize: 10, margin: 0 }}>{thread.context_type}</Tag>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Thread Messages */}
                <Col xs={24} md={14}>
                    <Card
                        title={selectedThread ? selectedThread.context_label : 'Chọn thread để xem'}
                        style={{ borderRadius: 10, height: '100%', display: 'flex', flexDirection: 'column' }}
                        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
                    >
                        {selectedThread ? (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
                                    {selectedThread.messages.map(msg => (
                                        <div key={msg.id} style={{
                                            marginBottom: 12,
                                            display: 'flex',
                                            flexDirection: msg.sender_role === 'pm' || msg.sender_role === 'sale' ? 'row-reverse' : 'row',
                                            gap: 8,
                                        }}>
                                            <Avatar size={28} icon={<UserOutlined />}
                                                style={{ background: msg.sender_role === 'customer' ? '#722ed1' : '#1976D2', flexShrink: 0 }} />
                                            <div>
                                                <div style={{
                                                    padding: '8px 12px', borderRadius: 10,
                                                    background: msg.sender_role === 'pm' || msg.sender_role === 'sale' ? '#e6f4ff' : '#f5f5f5',
                                                    maxWidth: '100%',
                                                }}>
                                                    <div style={{ fontSize: 13 }}>{msg.message_body}</div>
                                                </div>
                                                <div style={{ fontSize: 11, color: '#999', marginTop: 4, textAlign: msg.sender_role === 'pm' || msg.sender_role === 'sale' ? 'right' : 'left' }}>
                                                    {msg.sender} · {msg.sent_at.split('T')[0]}
                                                    {msg.official_response && <Tag color="blue" style={{ marginLeft: 4, fontSize: 9 }}>Official</Tag>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Inline Reply Composer */}
                                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                                    <Form form={replyForm} layout="vertical" onFinish={() => replyForm.resetFields()}>
                                        <Form.Item name="message_body" style={{ marginBottom: 8 }}>
                                            <TextArea rows={3} placeholder="Nhập câu trả lời..." />
                                        </Form.Item>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Form.Item name="official_response" valuePropName="checked" style={{ marginBottom: 0 }}>
                                                <Space>
                                                    <Switch size="small" />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>Phản hồi chính thức</Text>
                                                </Space>
                                            </Form.Item>
                                            <Button type="primary" icon={<SendOutlined />} htmlType="submit">Gửi phản hồi</Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 60, color: '#999', flex: 1 }}>
                                <MessageOutlined style={{ fontSize: 40, marginBottom: 8 }} />
                                <div>Chọn 1 thread để xem tin nhắn</div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Create Thread Modal */}
            <Modal title="Tạo Thread mới" open={showCreateModal}
                onCancel={() => { setShowCreateModal(false); createForm.resetFields(); }}
                onOk={() => createForm.submit()} okText="Tạo" cancelText="Hủy">
                <Form form={createForm} layout="vertical"
                    onFinish={() => { setShowCreateModal(false); createForm.resetFields(); }}>
                    <Form.Item label="Loại ngữ cảnh" name="context_type" rules={[{ required: true }]}>
                        <Select options={[
                            { value: 'survey', label: 'Khảo sát' },
                            { value: 'progress', label: 'Tiến độ' },
                            { value: 'payment', label: 'Thanh toán' },
                            { value: 'general', label: 'Chung' },
                        ]} />
                    </Form.Item>
                    <Form.Item label="Nhãn ngữ cảnh" name="context_label" rules={[{ required: true }]}>
                        <Input placeholder="VD: Kết quả khảo sát ngày 15/03" />
                    </Form.Item>
                    <Form.Item label="Nội dung mở thread" name="message_body" rules={[{ required: true }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CommunicationsCenter;
