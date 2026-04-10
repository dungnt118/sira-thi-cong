import React, { useState, useEffect, useRef } from 'react';
import {
    List, Tag, Button, Typography, Input, Select, Space,
    Modal, Form, Badge, Row, Col, Avatar, Switch, Spin, message, Empty,
    Grid
} from 'antd';
import { 
    MessageOutlined, PlusOutlined, SendOutlined, UserOutlined, 
    SearchOutlined, CheckCircleOutlined,
    MoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../../../components/common/SectionHeader';
import { portalThreadService } from '../../../services/core-contracts/services/portalThread.service';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;

const STATUS_COLOR: Record<string, string> = { open: 'processing', waiting: 'warning', closed: 'default' };
const STATUS_LABEL: Record<string, string> = { open: 'Đang mở', waiting: 'Chờ KH', closed: 'Đã đóng' };

const CommunicationsCenter: React.FC = () => {
    const navigate = useNavigate();
    const screens = Grid.useBreakpoint();
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedThread, setSelectedThread] = useState<any>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [createForm] = Form.useForm();
    const [replyForm] = Form.useForm();
    const [threads, setThreads] = useState<any[]>([]);
    const [keyword, setKeyword] = useState('');
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadThreads = async () => {
        setLoading(true);
        try {
            const res = await portalThreadService.queryContent();
            if (res && res.data) {
                setThreads(res.data);
                if (selectedThread) {
                    const updated = res.data.find((t: any) => t._id === selectedThread._id || t.thread_id === selectedThread.thread_id);
                    if (updated) setSelectedThread(updated);
                }
            }
        } catch (err) {
            message.error('Không thể tải danh sách hội thoại');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadThreads();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedThread?.messages]);

    const handleSendMessage = async (values: any) => {
        if (!selectedThread) return;
        setSending(true);
        try {
            // Mock API call to send message
            const newMessage = {
                id: Date.now().toString(),
                sender: 'Nguyễn Văn Sale',
                sender_role: 'KD',
                message_body: values.message_body,
                sent_at: new Date().toISOString(),
                official_response: values.official_response
            };
            
            // In real app: await portalThreadService.addMessage(...)
            const updatedThreads = threads.map(t => {
                if (t._id === selectedThread._id || t.thread_id === selectedThread.thread_id) {
                    return { ...t, messages: [...(t.messages || []), newMessage], last_message_at: new Date().toISOString() };
                }
                return t;
            });
            setThreads(updatedThreads);
            setSelectedThread({ ...selectedThread, messages: [...(selectedThread.messages || []), newMessage] });
            replyForm.resetFields();
            message.success('Đã gửi tin nhắn');
        } catch (err) {
            message.error('Lỗi khi gửi tin nhắn');
        } finally {
            setSending(false);
        }
    };

    const filtered = threads.filter(t => {
        const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
        const matchK = !keyword || t.context_label?.toLowerCase().includes(keyword.toLowerCase());
        return matchStatus && matchK;
    });

    return (
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <SectionHeader
                title="Communications Center"
                breadcrumb="Cổng Giao tiếp KH"
                actions={
                    <Button 
                        type="primary" 
                        size={!screens.md ? 'middle' : 'small'} 
                        shape="round" 
                        icon={<PlusOutlined />} 
                        onClick={() => setShowCreateModal(true)}
                    >
                        {!screens.md ? 'Tạo' : 'Tạo hội thoại mới'}
                    </Button>
                }
            />

            <Row gutter={0} style={{ flex: 1, overflow: 'hidden', background: '#fff', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                {/* Conversations List */}
                <Col xs={24} md={8} style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 16px', borderBottom: '1px solid #f0f0f0' }}>
                        <Input 
                            placeholder="Tìm kiếm hội thoại..." 
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            style={{ borderRadius: 10, background: '#f5f5f5', border: 'none' }}
                        />
                        <div style={{ marginTop: 12 }}>
                            <Select
                                style={{ width: '100%' }}
                                size="small"
                                value={filterStatus}
                                onChange={setFilterStatus}
                                bordered={false}
                                dropdownStyle={{ borderRadius: 8 }}
                                options={[
                                    { value: 'ALL', label: '⭐ Tất cả hội thoại' },
                                    { value: 'open', label: '🟢 Đang mở' },
                                    { value: 'waiting', label: '🟡 Chờ phản hồi' },
                                    { value: 'closed', label: '⚪ Đã đóng' },
                                ]}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
                        <Spin spinning={loading}>
                            {filtered.length === 0 && <Empty description="Không có hội thoại nào" style={{ marginTop: 40 }} />}
                            <List
                                dataSource={filtered}
                                renderItem={thread => (
                                    <div
                                        style={{
                                            cursor: 'pointer', borderRadius: 12, padding: '12px 16px',
                                            background: selectedThread?.thread_id === thread.thread_id ? '#f0f7ff' : 'transparent',
                                            transition: 'all 0.2s', marginBottom: 4
                                        }}
                                        onClick={() => setSelectedThread(thread)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text strong style={{ fontSize: 14, color: selectedThread?.thread_id === thread.thread_id ? '#1890ff' : '#262626' }}>
                                                {thread.context_label}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(thread.last_message_at).format('HH:mm')}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Space size={4}>
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: (STATUS_COLOR as any)[thread.status] === 'processing' ? '#1890ff' : (STATUS_COLOR as any)[thread.status] === 'warning' ? '#faad14' : '#d9d9d9' }} />
                                                <Text type="secondary" style={{ fontSize: 12 }}>{STATUS_LABEL[thread.status] || thread.status}</Text>
                                            </Space>
                                            {thread.unread_count > 0 && (
                                                <Badge count={thread.unread_count} style={{ backgroundColor: '#ff4d4f' }} size="small" />
                                            )}
                                        </div>
                                    </div>
                                )}
                            />
                        </Spin>
                    </div>
                </Col>

                {/* Chat Detail */}
                <Col xs={24} md={16} style={{ display: 'flex', flexDirection: 'column', background: '#fcfcfc' }}>
                    {selectedThread ? (
                        <>
                            <div style={{ padding: '16px 24px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space size={12}>
                                    <Avatar size={40} style={{ background: '#1890ff' }} icon={<MessageOutlined />} />
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>{selectedThread.context_label}</Title>
                                        <Text type="secondary" style={{ fontSize: 12 }}>ID: {selectedThread.thread_id} · {selectedThread.context_type}</Text>
                                    </div>
                                </Space>
                                <Button type="text" icon={<MoreOutlined />} />
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                                {selectedThread.messages?.length === 0 && (
                                    <div style={{ textAlign: 'center', marginTop: 40, color: '#bfbfbf' }}>Chưa có tin nhắn nào trong hội thoại này</div>
                                )}
                                {selectedThread.messages?.map((msg: any, idx: number) => {
                                    const isMe = msg.sender_role === 'KD' || msg.sender_role === 'QL';
                                    return (
                                        <div key={msg.id || idx} style={{ 
                                            marginBottom: 20, 
                                            display: 'flex', 
                                            flexDirection: isMe ? 'row-reverse' : 'row',
                                            alignItems: 'flex-start',
                                            gap: 12
                                        }}>
                                            <Avatar size={32} icon={isMe ? <UserOutlined /> : <UserOutlined />} 
                                                style={{ background: isMe ? '#1890ff' : '#722ed1', flexShrink: 0 }} />
                                            <div style={{ maxWidth: '70%' }}>
                                                <div style={{ 
                                                    padding: '12px 16px', 
                                                    borderRadius: isMe ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                                                    background: isMe ? '#1890ff' : '#fff',
                                                    color: isMe ? '#fff' : '#262626',
                                                    boxShadow: isMe ? '0 4px 12px rgba(24, 144, 255, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                                                }}>
                                                    <div style={{ fontSize: 14, lineHeight: '1.5' }}>{msg.message_body}</div>
                                                </div>
                                                <div style={{ 
                                                    fontSize: 11, 
                                                    color: '#bfbfbf', 
                                                    marginTop: 6, 
                                                    textAlign: isMe ? 'right' : 'left',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                                                    gap: 6
                                                }}>
                                                    {isMe ? 'Bạn' : msg.sender} · {dayjs(msg.sent_at).format('HH:mm')}
                                                    {msg.official_response && <Tag color="blue" bordered={false} style={{ fontSize: 9, margin: 0, padding: '0 4px' }}>OFFICIAL</Tag>}
                                                    {isMe && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div style={{ padding: '16px 24px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                                <Form form={replyForm} onFinish={handleSendMessage}>
                                    <Form.Item name="message_body" style={{ marginBottom: 12 }}>
                                        <TextArea 
                                            rows={2} 
                                            placeholder="Nhập nội dung tin nhắn hoặc phản hồi..." 
                                            autoSize={{ minRows: 2, maxRows: 6 }}
                                            style={{ borderRadius: 12, padding: '12px', border: '1px solid #f0f0f0', background: '#fcfcfc' }}
                                        />
                                    </Form.Item>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Form.Item name="official_response" valuePropName="checked" noStyle initialValue={false}>
                                            <Space>
                                                <Switch size="small" />
                                                <Text type="secondary" style={{ fontSize: 12 }}>Phản hồi chính thức (Official)</Text>
                                            </Space>
                                        </Form.Item>
                                        <Button 
                                            type="primary" 
                                            size="large"
                                            shape="round"
                                            icon={<SendOutlined />} 
                                            htmlType="submit"
                                            loading={sending}
                                        >
                                            Gửi tin nhắn
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#bfbfbf' }}>
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                <MessageOutlined style={{ fontSize: 32 }} />
                            </div>
                            <Title level={5} style={{ color: '#8c8c8c' }}>Bắt đầu hội thoại</Title>
                            <Text type="secondary">Chọn một khách hàng từ danh sách bên trái để xem nội dung trao đổi.</Text>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Create Thread Modal */}
            <Modal title="Khởi tạo hội thoại Portal mới" open={showCreateModal}
                onCancel={() => { setShowCreateModal(false); createForm.resetFields(); }}
                onOk={() => createForm.submit()} okText="Tạo Thread" cancelText="Hủy" centered>
                <Form form={createForm} layout="vertical"
                    onFinish={() => { setShowCreateModal(false); createForm.resetFields(); message.success('Đã tạo hội thoại mới'); }}>
                    <Form.Item label="Chủ đề / Ngữ cảnh" name="context_type" rules={[{ required: true }]}>
                        <Select placeholder="Chọn lĩnh vực trao đổi" options={[
                            { value: 'survey', label: 'Khảo sát hiện trường' },
                            { value: 'progress', label: 'Tiến độ thi công' },
                            { value: 'payment', label: 'Thanh toán & Hợp đồng' },
                            { value: 'general', label: 'Trao đổi chung' },
                        ]} />
                    </Form.Item>
                    <Form.Item label="Tiêu đề hiển thị (Portal KH)" name="context_label" rules={[{ required: true }]}>
                        <Input placeholder="VD: Báo cáo kết quả khảo sát chi tiết" />
                    </Form.Item>
                    <Form.Item label="Tin nhắn đầu tiên" name="message_body" rules={[{ required: true }]}>
                        <TextArea rows={4} placeholder="Nhập nội dung bắt đầu trao đổi với khách hàng..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default CommunicationsCenter;
