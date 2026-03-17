import React, { useState } from 'react';
import {
    Card, Tag, Button, Typography, Row, Col, Space, Tabs,
    Modal, Form, Badge, Input, DatePicker, Descriptions, Timeline, message
} from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, InfoCircleOutlined, SearchOutlined, DollarOutlined, MessageOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { mockJourneys } from '../../../data/journeyMockData';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';

const { Text, Title } = Typography;
const { TextArea } = Input;

const SaleJourneyContext: React.FC = () => {
    const { journeyId } = useParams<{ journeyId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'general';
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.id === journeyId) || mockJourneys[0];

    const [showLogModal, setShowLogModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [showSurveyModal, setShowSurveyModal] = useState(false);
    const [followForm] = Form.useForm();
    const [surveyForm] = Form.useForm();

    if (!journey) return <div>Không tìm thấy hành trình</div>;

    const tabItems = [
        {
            key: 'general',
            label: <span><InfoCircleOutlined /> Thông tin chung</span>,
            children: (
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Card title="Khách hàng & Yêu cầu" size="small" style={{ borderRadius: 8, marginBottom: 16 }}>
                            <Descriptions size="small" column={1} bordered>
                                <Descriptions.Item label="Mã YC">{journey.service_request_code}</Descriptions.Item>
                                <Descriptions.Item label="Khách hàng">{journey.customer_name}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">{journey.customer_phone}</Descriptions.Item>
                                <Descriptions.Item label="Email">{journey.customer_email || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ thi công">{journey.site_address || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Loại dịch vụ">{journey.requested_service}</Descriptions.Item>
                                <Descriptions.Item label="Mô tả yêu cầu">{journey.request_description || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Nguồn khách">{journey.source_channel}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title={<span><CheckCircleOutlined style={{ color: '#52c41a' }} /> Survey Readiness (Mức độ sẵn sàng Khảo sát)</span>} size="small" style={{ borderRadius: 8 }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Thông tin KH cơ bản</Text>
                                    {journey.customer_phone ? <Tag color="success">Đạt</Tag> : <Tag color="error">Thiếu SĐT</Tag>}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Địa chỉ thi công</Text>
                                    {journey.site_address ? <Tag color="success">Đạt</Tag> : <Tag color="error">Thiếu địa chỉ</Tag>}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Mô tả tình trạng</Text>
                                    {journey.request_description ? <Tag color="success">Đạt</Tag> : <Tag color="warning">Nên làm rõ thêm</Tag>}
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'survey',
            label: <span><SearchOutlined /> Quản lý Khảo sát</span>,
            children: (
                <div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>Trạng thái Khảo sát hiện tại: <Tag color={journey.survey_status === 'completed' ? 'success' : 'default'}>{journey.survey_status}</Tag></Text>
                        <Button type="primary" onClick={() => setShowSurveyModal(true)}>+ Tạo lịch khảo sát</Button>
                    </div>
                    {/* Fake Survey History List */}
                    <Card size="small" style={{ marginBottom: 12, borderRadius: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Khảo sát Lần 1 (Chống thấm Sân thượng)</Text><br />
                                <Text type="secondary" style={{ fontSize: 12 }}>Ngày hẹn: {journey.latest_survey_at?.split('T')[0] || '2023-11-20'} · Kỹ thuật: {journey.surveyor_name || 'Chưa phân công'}</Text>
                            </div>
                            <Space>
                                <Tag color="success">Đã hoàn thành</Tag>
                                <Button size="small" onClick={() => navigate(`/sale/dashboard/${journey.id}/surveys/1`)}>Xem chi tiết</Button>
                            </Space>
                        </div>
                    </Card>
                </div>
            )
        },
        {
            key: 'contract',
            label: <span><DollarOutlined /> Báo giá & Hợp đồng</span>,
            children: (
                <Card size="small" style={{ borderRadius: 8 }}>
                    <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label="Trạng thái Dự toán">
                            <Tag color={journey.estimate_status === 'ready' ? 'success' : 'default'}>{journey.estimate_status}</Tag>
                            {journey.estimated_cost_total ? ` ${journey.estimated_cost_total.toLocaleString('vi-VN')}đ` : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái Báo giá">
                            <Tag color={journey.quote_status === 'approved' ? 'success' : journey.quote_status === 'sent' ? 'blue' : 'default'}>{journey.quote_status}</Tag>
                            {journey.quotation_total ? ` ${journey.quotation_total.toLocaleString('vi-VN')}đ` : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="PM duyệt Cấp tiến (Go/No-Go)">
                            <Tag color={journey.go_no_go_status === 'go' ? 'success' : 'default'}>{journey.go_no_go_status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái HĐ">
                            <Tag color={journey.contract_status === 'signed' ? 'success' : 'default'}>{journey.contract_status || 'Chưa có'}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Đã thu cọc">{journey.deposit_status || '—'}</Descriptions.Item>
                    </Descriptions>
                </Card>
            )
        },
        {
            key: 'payment',
            label: <span><DollarOutlined /> Thanh toán</span>,
            children: (
                <Card size="small" style={{ borderRadius: 8 }}>
                    <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label="Tổng Giá trị HĐ">{journey.total_contract_value?.toLocaleString('vi-VN') || '0'} đ</Descriptions.Item>
                        <Descriptions.Item label="Đã thu">
                            <Text type="success" strong>{journey.collected_amount?.toLocaleString('vi-VN') || '0'} đ</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Còn nợ">
                            <Text type="danger" strong>{journey.outstanding_amount?.toLocaleString('vi-VN') || '0'} đ</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mốc TT tiếp theo">{journey.next_milestone_name || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Hạn TT tiếp theo">{journey.next_milestone_due || '—'}</Descriptions.Item>
                    </Descriptions>
                </Card>
            )
        },
        {
            key: 'activity',
            label: <span><ClockCircleOutlined /> Lịch sử chăm sóc</span>,
            children: (
                <Row gutter={16}>
                    <Col xs={24} md={16}>
                        <Card size="small" style={{ borderRadius: 8, minHeight: 400 }}>
                            <Timeline
                                items={journey.activities.map(a => ({
                                    children: (
                                        <div>
                                            <Text strong>{a.activity_action}</Text>
                                            <div style={{ fontSize: 11, color: '#999' }}>{a.activity_time.split('T')[0]} · {a.activity_actor}</div>
                                            <div style={{ fontSize: 13, marginTop: 4 }}>{a.activity_summary}</div>
                                            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{a.activity_context}</div>
                                        </div>
                                    ),
                                }))}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Button type="primary" block icon={<MessageOutlined />} onClick={() => setShowLogModal(true)} style={{ marginBottom: 12 }}>
                            Ghi Log Tư vấn Mới
                        </Button>
                        <Button block onClick={() => setShowFollowUpModal(true)} style={{ marginBottom: 16 }}>
                            Tồn đọng & Follow-up
                        </Button>
                        <Card title="Ghi chú Follow-up gần nhất" size="small" style={{ borderRadius: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>Chưa có ghi chú tồn đọng nào.</Text>
                        </Card>
                    </Col>
                </Row>
            )
        }
    ];

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/sale/dashboard')} style={{ marginBottom: 12 }}>
                Quay lại Inbox
            </Button>

            {/* Compact Header */}
            <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, #fff0f6 0%, #ffadd2 100%)', borderRadius: 10, border: 'none' }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Space>
                            <Tag style={{ background: 'rgba(255,255,255,0.4)', border: 'none', color: '#c41d7f', fontWeight: 600 }}>{journey.journey_code}</Tag>
                            <Tag color="magenta">{journey.current_step}</Tag>
                            <Badge status={journey.sla_status === 'overdue' ? 'error' : journey.sla_status === 'at_risk' ? 'warning' : 'success'} text={journey.sla_status} />
                        </Space>
                        <Title level={4} style={{ margin: '6px 0 2px', color: '#780650' }}>{journey.customer_name}</Title>
                        <Text style={{ color: '#9e1068' }}>{journey.request_title}</Text>
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
                        <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>Sale: {journey.owner_user}</Text>
                        {journey.unread_portal_threads > 0 && <Tag color="red" style={{ marginTop: 8 }}>{journey.unread_portal_threads} Tin nhắn Portal</Tag>}
                    </Col>
                </Row>
            </Card>

            <Card style={{ borderRadius: 10, height: '100%' }} bodyStyle={{ padding: '0 16px 16px' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setSearchParams({ tab: key })}
                    items={tabItems}
                    size="middle"
                />
            </Card>

            {/* Consultation Log Modal */}
            <Modal title="Ghi log tư vấn" open={showLogModal} onCancel={() => setShowLogModal(false)} footer={null} width={600}>
                <ConsultationLogForm onSubmit={() => setShowLogModal(false)} onCancel={() => setShowLogModal(false)} />
            </Modal>

            {/* Follow-up Modal */}
            <Modal title="Ghi chú Follow-up KH" open={showFollowUpModal} onCancel={() => { setShowFollowUpModal(false); followForm.resetFields(); }}
                onOk={() => { message.success('Đã lưu follow-up'); setShowFollowUpModal(false); followForm.resetFields(); }} okText="Lưu" cancelText="Hủy">
                <Form form={followForm} layout="vertical">
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

            {/* Tạo Lịch Khảo Sát Modal */}
            <Modal title="Tạo Lịch Khảo Sát Mới" open={showSurveyModal} onCancel={() => { setShowSurveyModal(false); surveyForm.resetFields(); }}
                onOk={() => {
                    surveyForm.validateFields().then(() => {
                        message.success('Đã lên lịch khảo sát!');
                        setShowSurveyModal(false);
                        surveyForm.resetFields();
                        // Theo luồng, sau khi tạo xong sẽ điều hướng luôn qua trang chi tiết khảo sát mới tạo
                        navigate(`/sale/dashboard/${journey.id}/surveys/new-${Date.now()}`);
                    });
                }} okText="Khởi tạo Lịch" cancelText="Hủy">
                <Form form={surveyForm} layout="vertical">
                    <Form.Item label="Kỹ thuật phụ trách" name="surveyor_name" rules={[{ required: true }]} initialValue="Nguyễn Văn Kỹ Thuật (Demo)">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Thời gian dự kiến" name="survey_date" rules={[{ required: true }]}>
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Ghi chú thêm" name="notes">
                        <TextArea rows={2} placeholder="Nhập yêu cầu từ khách hàng cho KTV..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SaleJourneyContext;
