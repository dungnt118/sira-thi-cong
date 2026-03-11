import React, { useState } from 'react';
import {
    Card, Button, Tag, Typography, Row, Col, Space, Modal,
    Form, Input, DatePicker, Select, List, Badge, Tabs
} from 'antd';
import {
    CalendarOutlined, PlusOutlined, EditOutlined, PhoneOutlined
} from '@ant-design/icons';
import { mockSurveys } from '../../../data/journeyMockData';
import { mockJourneys } from '../../../data/journeyMockData';

const { Text } = Typography;
const { TextArea } = Input;

const SurveyCoordination: React.FC = () => {
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleForm] = Form.useForm();

    const scheduled = mockSurveys.filter(s => s.scheduled_date && !s.submitted_at);
    const unscheduled = mockJourneys.filter(j => j.survey_status === 'not_started');

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h2 style={{ margin: 0 }}>Điều phối Khảo sát</h2>
                    <Text type="secondary">Lên lịch và theo dõi khảo sát hiện trường</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowScheduleModal(true)}>
                    Đặt lịch khảo sát
                </Button>
            </div>

            <Tabs
                items={[
                    {
                        key: 'scheduled',
                        label: <span><CalendarOutlined /> Đã lên lịch ({scheduled.length})</span>,
                        children: (
                            <div>
                                {scheduled.map(s => (
                                    <Card key={s.id} size="small" style={{ marginBottom: 10, borderRadius: 8, borderLeft: '4px solid #1890ff' }}>
                                        <Row gutter={16} align="middle">
                                            <Col flex="auto">
                                                <Space style={{ marginBottom: 4 }}>
                                                    <Tag color="blue"><CalendarOutlined /> {s.scheduled_date} {s.scheduled_time}</Tag>
                                                    <Tag>{s.giam_sat_user}</Tag>
                                                </Space>
                                                <div style={{ fontWeight: 600 }}>{s.customer_name}</div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>{s.site_address}</Text>
                                                <div style={{ marginTop: 4, fontSize: 12 }}>
                                                    Liên hệ: <strong>{s.contact_name}</strong> · <a href={`tel:${s.contact_phone}`}>{s.contact_phone}</a>
                                                </div>
                                            </Col>
                                            <Col>
                                                <Space direction="vertical" size={4}>
                                                    <Button size="small" icon={<EditOutlined />}>Đổi lịch</Button>
                                                    <Button size="small" icon={<PhoneOutlined />}>Gọi</Button>
                                                </Space>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </div>
                        ),
                    },
                    {
                        key: 'unscheduled',
                        label: <span>Chưa lên lịch ({unscheduled.length})</span>,
                        children: (
                            <div>
                                {unscheduled.map(j => (
                                    <Card key={j.id} size="small" style={{ marginBottom: 10, borderRadius: 8, borderLeft: '4px solid #fa8c16' }}>
                                        <Row gutter={16} align="middle">
                                            <Col flex="auto">
                                                <Text strong style={{ color: '#1976D2' }}>{j.journey_code}</Text>
                                                <div style={{ fontWeight: 600 }}>{j.customer_name}</div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>{j.requested_service}</Text>
                                            </Col>
                                            <Col>
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    ghost
                                                    icon={<CalendarOutlined />}
                                                    onClick={() => setShowScheduleModal(true)}
                                                >
                                                    Lên lịch
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </div>
                        ),
                    },
                ]}
            />

            <Modal
                title="Đặt lịch khảo sát"
                open={showScheduleModal}
                onCancel={() => { setShowScheduleModal(false); scheduleForm.resetFields(); }}
                onOk={() => scheduleForm.submit()}
                okText="Đặt lịch"
                cancelText="Hủy"
            >
                <Form form={scheduleForm} layout="vertical" onFinish={() => { setShowScheduleModal(false); scheduleForm.resetFields(); }}>
                    <Form.Item label="Ngày khảo sát" name="scheduled_date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Giám sát phụ trách" name="giam_sat_user" rules={[{ required: true }]}>
                        <Select options={[
                            { value: 'gs-01', label: 'Lê Văn Giám sát' },
                            { value: 'gs-02', label: 'Nguyễn Văn Giám sát' },
                        ]} />
                    </Form.Item>
                    <Form.Item label="Địa điểm gặp" name="meeting_address" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Người liên hệ" name="contact_name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Số liên hệ" name="contact_phone" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Ghi chú" name="note">
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SurveyCoordination;
