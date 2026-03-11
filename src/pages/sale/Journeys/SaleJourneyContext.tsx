import React, { useState } from 'react';
import {
    Card, Tag, Button, Typography, Row, Col, Descriptions, Space,
    Modal, Form, Input, DatePicker, Timeline, Badge, Divider
} from 'antd';
import { ArrowLeftOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockJourneys } from '../../../data/journeyMockData';

const { Text, Title } = Typography;
const { TextArea } = Input;

const SaleJourneyContext: React.FC = () => {
    const { journeyId } = useParams<{ journeyId: string }>();
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.id === journeyId) || mockJourneys[0];

    const [showLogModal, setShowLogModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [logForm] = Form.useForm();
    const [followForm] = Form.useForm();

    if (!journey) return <div>Không tìm thấy hành trình</div>;

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/sale/journeys')} style={{ marginBottom: 12 }}>
                Quay lại
            </Button>

            {/* Compact Header */}
            <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, #f0fff4 0%, #d6f5e3 100%)', borderRadius: 10 }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Space>
                            <Tag color="blue">{journey.journey_code}</Tag>
                            <Tag>{journey.current_step}</Tag>
                            <Badge status={journey.sla_status === 'overdue' ? 'error' : journey.sla_status === 'at_risk' ? 'warning' : 'success'} text={journey.sla_status} />
                        </Space>
                        <Title level={4} style={{ margin: '6px 0 2px' }}>{journey.customer_name}</Title>
                        <Text type="secondary">{journey.request_title}</Text>
                    </Col>
                    <Col>
                        <Space>
                            <Button onClick={() => setShowLogModal(true)}>Ghi log tư vấn</Button>
                            <Button type="primary" ghost onClick={() => setShowFollowUpModal(true)}>Follow-up</Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Row gutter={16}>
                {/* Commercial Summary */}
                <Col xs={24} md={12}>
                    <Card title="📊 Tóm tắt thương mại" size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
                        <Descriptions size="small" column={1}>
                            <Descriptions.Item label="Khảo sát">
                                <Tag color={journey.survey_status === 'completed' ? 'success' : 'default'}>
                                    {journey.survey_status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Dự toán">
                                <Tag color={journey.estimate_status === 'ready' ? 'success' : 'default'}>
                                    {journey.estimate_status} {journey.estimated_cost_total ? `· ${journey.estimated_cost_total.toLocaleString('vi-VN')}đ` : ''}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Go/No-Go">
                                <Tag color={journey.go_no_go_status === 'go' ? 'success' : 'default'}>
                                    {journey.go_no_go_status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Báo giá">
                                <Tag color={journey.quote_status === 'approved' ? 'success' : journey.quote_status === 'sent' ? 'blue' : 'default'}>
                                    {journey.quote_status}
                                    {journey.quotation_total ? ` · ${journey.quotation_total.toLocaleString('vi-VN')}đ` : ''}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Hợp đồng">
                                <Tag color={journey.contract_status === 'signed' ? 'success' : 'default'}>
                                    {journey.contract_status || '—'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Cọc">{journey.deposit_status || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Follow-up tới">{journey.next_milestone_due || '—'}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Activity log */}
                <Col xs={24} md={12}>
                    <Card title={<span><ClockCircleOutlined /> Lịch sử hoạt động</span>} size="small" style={{ borderRadius: 8 }}>
                        <Timeline
                            items={journey.activities.slice(0, 4).map(a => ({
                                children: (
                                    <div>
                                        <Text strong style={{ fontSize: 12 }}>{a.activity_action}</Text>
                                        <div style={{ fontSize: 11, color: '#999' }}>{a.activity_time.split('T')[0]} · {a.activity_actor}</div>
                                        <div style={{ fontSize: 12, color: '#555' }}>{a.activity_summary}</div>
                                    </div>
                                ),
                            }))}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Consultation Log Modal */}
            <Modal
                title="Ghi log tư vấn"
                open={showLogModal}
                onCancel={() => { setShowLogModal(false); logForm.resetFields(); }}
                onOk={() => logForm.submit()}
                okText="Lưu log" cancelText="Hủy"
            >
                <Form form={logForm} layout="vertical" onFinish={() => { setShowLogModal(false); logForm.resetFields(); }}>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Thời điểm" name="interaction_at" rules={[{ required: true }]}>
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Kênh" name="channel" rules={[{ required: true }]}>
                                <Input.Group compact>
                                    <span></span>
                                </Input.Group>
                                <select style={{ width: '100%', padding: 6, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                                    <option value="call">📞 Điện thoại</option>
                                    <option value="zalo">💬 Zalo</option>
                                    <option value="email">📧 Email</option>
                                    <option value="meeting">🤝 Gặp mặt</option>
                                </select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Kết quả" name="outcome" rules={[{ required: true }]}>
                        <Input placeholder="Kết quả cuộc liên hệ..." />
                    </Form.Item>
                    <Form.Item label="Tóm tắt" name="summary" rules={[{ required: true }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="Hành động tiếp theo" name="next_action">
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Follow-up Modal */}
            <Modal
                title="Ghi chú Follow-up KH"
                open={showFollowUpModal}
                onCancel={() => { setShowFollowUpModal(false); followForm.resetFields(); }}
                onOk={() => followForm.submit()}
                okText="Lưu" cancelText="Hủy"
            >
                <Form form={followForm} layout="vertical" onFinish={() => { setShowFollowUpModal(false); followForm.resetFields(); }}>
                    <Form.Item label="Thời điểm follow-up" name="follow_up_at" rules={[{ required: true }]}>
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Phản hồi của khách" name="customer_response" rules={[{ required: true }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="Cam kết tiếp theo" name="next_commitment">
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SaleJourneyContext;
