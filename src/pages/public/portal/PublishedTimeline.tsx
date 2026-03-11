import React, { useState } from 'react';
import {
    Card, Steps, Button, Tag, Typography, Row, Col,
    Space, Modal, Form, Input, Select
} from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, MessageOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { mockJourneys } from '../../../data/journeyMockData';
import { mockJourneyTemplates } from '../../../data/journeyMockData';

const { Text, Title } = Typography;
const { TextArea } = Input;

const PublishedTimeline: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.portal_token === token);
    const template = mockJourneyTemplates.find(t => t.id === journey?.template_id);
    const steps = template?.steps || [];

    const [showThreadModal, setShowThreadModal] = useState(false);
    const [threadForm] = Form.useForm();

    if (!journey) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy dữ liệu.</div>;

    const publishedSteps = steps.filter(s => s.publish_flag);
    const currentIdx = publishedSteps.findIndex(s => s.step_code === journey.current_step_code);

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={5} style={{ margin: 0 }}>📋 Tiến độ hành trình</Title>
                        <Text type="secondary">{journey.customer_name} · {journey.requested_service}</Text>
                    </Col>
                    <Col>
                        <Space>
                            <Button size="small" onClick={() => navigate(`/portal/${token}`)}>Tổng quan</Button>
                            <Button size="small" onClick={() => navigate(`/portal/${token}/threads`)}>Chat</Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                <Steps
                    direction="vertical"
                    current={currentIdx}
                    items={publishedSteps.map((step, idx) => ({
                        title: (
                            <Row justify="space-between" align="middle">
                                <Col><Text strong>{step.step_name}</Text></Col>
                                <Col>
                                    {idx < currentIdx && <Tag color="success">✅ Hoàn thành</Tag>}
                                    {idx === currentIdx && <Tag color="processing">🔄 Đang thực hiện</Tag>}
                                    {idx > currentIdx && <Tag color="default">⏳ Sắp tới</Tag>}
                                </Col>
                            </Row>
                        ),
                        description: (
                            <div style={{ marginTop: 4 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>{step.step_goal}</Text>
                                {idx <= currentIdx && (
                                    <div style={{ marginTop: 6 }}>
                                        <Button
                                            size="small"
                                            type="link"
                                            icon={<MessageOutlined />}
                                            onClick={() => { setShowThreadModal(true); threadForm.setFieldValue('context_label', `Hỏi về: ${step.step_name}`); }}
                                        >
                                            Hỏi về bước này
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ),
                        icon: idx < currentIdx ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                            idx === currentIdx ? <ClockCircleOutlined style={{ color: '#1890ff' }} /> : undefined,
                    }))}
                />
            </Card>

            <Modal title="Đặt câu hỏi" open={showThreadModal}
                onCancel={() => { setShowThreadModal(false); threadForm.resetFields(); }}
                onOk={() => threadForm.submit()} okText="Gửi" cancelText="Hủy">
                <Form form={threadForm} layout="vertical" onFinish={() => { setShowThreadModal(false); threadForm.resetFields(); }}>
                    <Form.Item label="Chủ đề" name="context_label" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Loại câu hỏi" name="context_type" initialValue="survey">
                        <Select options={[
                            { value: 'survey', label: 'Về khảo sát' },
                            { value: 'progress', label: 'Về tiến độ' },
                            { value: 'payment', label: 'Về thanh toán' },
                            { value: 'general', label: 'Câu hỏi chung' },
                        ]} />
                    </Form.Item>
                    <Form.Item label="Nội dung" name="message_body" rules={[{ required: true }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PublishedTimeline;
