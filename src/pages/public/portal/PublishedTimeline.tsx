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
    const [selectedStepIdx, setSelectedStepIdx] = useState<number | null>(currentIdx >= 0 ? currentIdx : 0);

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
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

            <Row gutter={[24, 24]}>
                <Col xs={24} md={14}>
                    <Card style={{ borderRadius: 12 }}>
                        <Steps
                            direction="vertical"
                            current={currentIdx}
                            onChange={setSelectedStepIdx}
                            items={publishedSteps.map((step, idx) => ({
                                title: (
                                    <Row justify="space-between" align="middle" style={{ cursor: 'pointer' }}>
                                        <Col><Text strong style={{ color: selectedStepIdx === idx ? '#1890ff' : 'inherit' }}>{step.step_name}</Text></Col>
                                        <Col>
                                            {idx < currentIdx && <Tag color="success">✅ Hoàn thành</Tag>}
                                            {idx === currentIdx && <Tag color="processing">🔄 Đang thực hiện</Tag>}
                                            {idx > currentIdx && <Tag color="default">⏳ Sắp tới</Tag>}
                                        </Col>
                                    </Row>
                                ),
                                description: (
                                    <div style={{ marginTop: 4, cursor: 'pointer' }} onClick={() => setSelectedStepIdx(idx)}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>{step.step_goal}</Text>
                                        <div style={{ marginTop: 8, marginBottom: 8 }}>
                                            <Tag color="cyan">{idx * 3 + 2} Hình ảnh</Tag>
                                            <Tag color="blue">{idx * 2 + 1} Tài liệu</Tag>
                                        </div>
                                    </div>
                                ),
                                icon: idx < currentIdx ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                                    idx === currentIdx ? <ClockCircleOutlined style={{ color: '#1890ff' }} /> : undefined,
                            }))}
                        />
                    </Card>
                </Col>

                {/* Selected Step Detail Panel */}
                <Col xs={24} md={10}>
                    {selectedStepIdx !== null && publishedSteps[selectedStepIdx] ? (
                        <Card title={`Chi tiết: ${publishedSteps[selectedStepIdx].step_name}`} 
                              style={{ borderRadius: 12, position: 'sticky', top: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ marginBottom: 16 }}>
                                <Text strong>Mục tiêu:</Text>
                                <p style={{ marginTop: 4 }}>{publishedSteps[selectedStepIdx].step_goal}</p>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <Text strong>Tài liệu ({selectedStepIdx * 2 + 1})</Text>
                                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                                    <li>Biên bản nghiệm thu phần {selectedStepIdx + 1}.pdf</li>
                                    {selectedStepIdx > 0 && <li>Bản vẽ kỹ thuật chi tiết.dwg</li>}
                                </ul>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <Text strong>Hình ảnh hiện trường ({selectedStepIdx * 3 + 2})</Text>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                                    <div style={{ background: '#f5f5f5', borderRadius: 8, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>📸 Ảnh 1</div>
                                    <div style={{ background: '#f5f5f5', borderRadius: 8, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>📸 Ảnh 2</div>
                                </div>
                            </div>
                            <Button type="primary" block icon={<MessageOutlined />} 
                                    onClick={() => { setShowThreadModal(true); threadForm.setFieldValue('context_label', `Hỏi về: ${publishedSteps[selectedStepIdx].step_name}`); }}>
                                Gửi thắc mắc về bước này
                            </Button>
                        </Card>
                    ) : (
                        <Card style={{ borderRadius: 12, textAlign: 'center', padding: '40px 0' }}>
                            <Text type="secondary">Nhấp vào một bước để xem chi tiết</Text>
                        </Card>
                    )}
                </Col>
            </Row>

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
