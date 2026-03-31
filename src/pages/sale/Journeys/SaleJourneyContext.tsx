import React, { useState, useEffect } from 'react';
import {
    Card, Tag, Button, Typography, Row, Col, Space, Tabs,
    Modal, Form, Badge, Input, DatePicker, Descriptions, Timeline, message, Spin, Empty, Avatar, Select
} from 'antd';
import { 
    ArrowLeftOutlined, ClockCircleOutlined, InfoCircleOutlined, 
    SearchOutlined, DollarOutlined, FileTextOutlined, CheckCircleOutlined,
    UserOutlined, PlusOutlined, BellOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;

const SaleJourneyDetail: React.FC = () => {
    const { journeyId } = useParams<{ journeyId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'general';
    const navigate = useNavigate();

    const [journey, setJourney] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [showLogModal, setShowLogModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [showSurveyModal, setShowSurveyModal] = useState(false);
    const [followForm] = Form.useForm();
    const [surveyForm] = Form.useForm();

    const loadJourney = async () => {
        if (!journeyId) return;
        setLoading(true);
        try {
            const res = await journeyService.findContent(journeyId);
            setJourney(res);
        } catch (err) {
            message.error('Không thể tải thông tin hành trình');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJourney();
    }, [journeyId]);

    if (loading) return (
        <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" tip="Đang tải thông tin hành trình..." />
        </div>
    );
    
    if (!journey) return (
        <Card style={{ marginTop: 40, textAlign: 'center', borderRadius: 20 }}>
            <Empty description="Không tìm thấy hành trình" />
            <Button onClick={() => navigate('/sale/dashboard')}>Quay lại danh sách</Button>
        </Card>
    );

    const tabItems = [
        {
            key: 'general',
            label: <span><InfoCircleOutlined /> Tổng quan</span>,
            children: (
                <Row gutter={[20, 20]}>
                    <Col xs={24} md={14}>
                        <Card title={<Space><UserOutlined /> Thông tin khách hàng & Yêu cầu</Space>} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <Descriptions size="small" column={1} bordered>
                                <Descriptions.Item label="Khách hàng"><Text strong>{journey.idx_customer_id?.primary_text || journey.customer_name}</Text></Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">{journey.idx_customer_id?.secondary_text || journey.customer_phone}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ thi công"><Text type="secondary">{journey.site_address || '—'}</Text></Descriptions.Item>
                                <Descriptions.Item label="Yêu cầu cụ thể">{journey.request_description || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Nguồn đến">{journey.source_channel || 'Hotline'}</Descriptions.Item>
                                <Descriptions.Item label="Thời gian nhận">{dayjs(journey.created_at).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col xs={24} md={10}>
                        <Card title={<Space><CheckCircleOutlined /> Sẵn sàng khảo sát</Space>} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ padding: '8px 0' }}>
                                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Thông tin liên hệ</Text>
                                        {journey.customer_phone ? <Tag color="success">Sẵn sàng</Tag> : <Tag color="error">Thiếu</Tag>}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Địa chỉ thi công</Text>
                                        {journey.site_address ? <Tag color="success">Rõ ràng</Tag> : <Tag color="warning">Cần cập nhật</Tag>}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Tình trạng hiện trường</Text>
                                        <Tag color="processing">Chưa xác định</Tag>
                                    </div>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'survey',
            label: <span><SearchOutlined /> Khảo sát</span>,
            children: (
                <div>
                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Text type="secondary">Trạng thái:</Text>
                            <Tag color={journey.survey_status === 'completed' ? 'success' : 'processing'} style={{ marginLeft: 8 }}>
                                {journey.survey_status || 'Chưa thực hiện'}
                            </Tag>
                        </div>
                        <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={() => setShowSurveyModal(true)}>Đặt lịch khảo sát</Button>
                    </div>
                    
                    <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <Empty description="Chưa có dữ liệu khảo sát hiện trường" />
                    </Card>
                </div>
            )
        },
        {
            key: 'finance',
            label: <span><DollarOutlined /> Báo giá & Thanh toán</span>,
            children: (
                <Row gutter={[20, 20]}>
                    <Col xs={24} md={12}>
                        <Card title="Dự toán & Báo giá" style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <Descriptions size="small" column={1}>
                                <Descriptions.Item label="Trạng thái báo giá">
                                    <Tag color={journey.quote_status === 'sent' ? 'blue' : 'default'}>{journey.quote_status || 'Chưa gửi'}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Giá trị dự kiến">{journey.estimated_cost_total?.toLocaleString('vi-VN') || '0'} đ</Descriptions.Item>
                                <Descriptions.Item label="Duyệt thi công (PM)">
                                    <Tag color={journey.pm_approval === 'approved' ? 'success' : 'default'}>{journey.pm_approval || 'Chờ duyệt'}</Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Tình hình thanh toán" style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(24, 144, 255, 0.05)' }}>
                            <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                <Row>
                                    <Col span={12}>
                                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Đã thu</Text>
                                        <Title level={3} style={{ margin: 0, color: '#52c41a' }}>{journey.collected_amount?.toLocaleString('vi-VN') || '0'}</Title>
                                    </Col>
                                    <Col span={12}>
                                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Còn nợ</Text>
                                        <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>{journey.outstanding_amount?.toLocaleString('vi-VN') || '0'}</Title>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )
        },
        {
            key: 'timeline',
            label: <span><ClockCircleOutlined /> Lịch sử & Hoạt động</span>,
            children: (
                <Row gutter={[20, 20]}>
                    <Col xs={24} md={16}>
                        <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            {(journey.activities || []).length > 0 ? (
                                <Timeline
                                    mode="left"
                                    items={journey.activities.map((a: any) => ({
                                        color: a.activity_action?.includes('Hoàn thành') ? 'green' : 'blue',
                                        children: (
                                            <div style={{ marginBottom: 12 }}>
                                                <Text strong style={{ fontSize: 14 }}>{a.activity_action}</Text>
                                                <div style={{ fontSize: 11, color: '#bfbfbf' }}>{dayjs(a.activity_time).format('DD/MM/YYYY HH:mm')} · {a.activity_actor}</div>
                                                <div style={{ 
                                                    marginTop: 8, padding: '10px 14px', background: '#f5f5f5', 
                                                    borderRadius: 8, fontSize: 13, color: '#595959' 
                                                }}>
                                                    {a.activity_summary}
                                                </div>
                                            </div>
                                        ),
                                    }))}
                                />
                            ) : (
                                <Empty description="Chưa có lịch sử hoạt động" style={{ padding: '40px 0' }} />
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Space direction="vertical" style={{ width: '100%' }} size={12}>
                            <Button type="primary" block size="large" shape="round" icon={<FileTextOutlined />} onClick={() => setShowLogModal(true)}>
                                Ghi log tư vấn
                            </Button>
                            <Button block size="large" shape="round" icon={<BellOutlined />} onClick={() => setShowFollowUpModal(true)}>
                                Theo dõi (Follow-up)
                            </Button>
                            <Card size="small" title="Ghi chú quan trọng" style={{ borderRadius: 12, marginTop: 8 }}>
                                <Text type="secondary" style={{ fontSize: 13 }}>Không có ghi chú nào được đánh dấu.</Text>
                            </Card>
                        </Space>
                    </Col>
                </Row>
            )
        }
    ];

    const HeaderGradient = {
        background: journey.sla_status === 'overdue' 
            ? 'linear-gradient(135deg, #fff1f0 0%, #ffa39e 100%)' 
            : journey.sla_status === 'at_risk'
            ? 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)'
            : 'linear-gradient(135deg, #f6ffed 0%, #b7eb8f 100%)',
        color: journey.sla_status === 'overdue' ? '#a8071a' : journey.sla_status === 'at_risk' ? '#ad4e00' : '#237804'
    };

    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ marginBottom: 16 }}>
                <Button 
                    type="link" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/sale/dashboard')}
                    style={{ padding: 0, color: '#595959' }}
                >
                    Quay lại Inbox
                </Button>
            </div>

            <Card style={{ marginBottom: 24, borderRadius: 20, border: 'none', background: HeaderGradient.background }}>
                <Row gutter={24} align="middle">
                    <Col flex="auto">
                        <Space size={12}>
                            <Tag style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 4, border: 'none', fontWeight: 700, color: HeaderGradient.color }}>
                                {journey.journey_code}
                            </Tag>
                            <Tag color="processing" style={{ borderRadius: 4, border: 'none' }}>{journey.current_step_display || journey.current_step}</Tag>
                            <Badge status={journey.sla_status === 'overdue' ? 'error' : journey.sla_status === 'at_risk' ? 'warning' : 'success'} text={<span style={{ color: HeaderGradient.color, fontWeight: 500 }}>{journey.sla_status === 'overdue' ? 'Quá hạn SLA' : 'Đúng hạn'}</span>} />
                        </Space>
                        <Title level={3} style={{ margin: '12px 0 4px', color: HeaderGradient.color }}>{journey.idx_customer_id?.primary_text || journey.customer_name}</Title>
                        <Text style={{ fontSize: 16, opacity: 0.8, color: HeaderGradient.color }}>{journey.request_title}</Text>
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
                        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.3)', borderRadius: 12 }}>
                            <Text type="secondary" style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>Sale phụ trách</Text>
                            <Space>
                                <Avatar size={24} icon={<UserOutlined />} />
                                <Text strong style={{ color: HeaderGradient.color }}>{journey.owner_user || 'Nguyễn Văn Sale'}</Text>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            <div className="detail-tabs-wrapper">
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setSearchParams({ tab: key })}
                    items={tabItems}
                    size="large"
                    type="line"
                    style={{ background: '#fff', padding: '0 24px 24px', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
                />
            </div>

            <Modal title="Ghi log tư vấn khách hàng" open={showLogModal} onCancel={() => setShowLogModal(false)} footer={null} width={600} centered>
                <ConsultationLogForm onSubmit={() => { message.success('Đã lưu log tư vấn'); setShowLogModal(false); }} onCancel={() => setShowLogModal(false)} />
            </Modal>

            <Modal 
                title="Lên lịch khảo sát hiện trường" 
                open={showSurveyModal} 
                onCancel={() => setShowSurveyModal(false)}
                onOk={() => { message.success('Đã lên lịch khảo sát'); setShowSurveyModal(false); }}
                okText="Xác nhận lịch"
                cancelText="Hủy"
                centered
            >
                <Form form={surveyForm} layout="vertical" style={{ paddingTop: 16 }}>
                    <Form.Item label="Thời gian khảo sát" name="survey_at" rules={[{ required: true }]}>
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Nhân sự kỹ thuật" name="surveyor" initialValue="Chưa phân công">
                        <Select options={[{ value: 'unassigned', label: 'Chờ phân công' }]} />
                    </Form.Item>
                    <Form.Item label="Địa điểm gặp" name="address" initialValue={journey.site_address}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ghi chú từ Sale" name="note">
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
            {/* Follow-up Modal */}
            <Modal 
                title="Ghi chú Follow-up KH" 
                open={showFollowUpModal} 
                onCancel={() => { setShowFollowUpModal(false); followForm.resetFields(); }}
                onOk={() => { message.success('Đã lưu follow-up'); setShowFollowUpModal(false); followForm.resetFields(); }} 
                okText="Lưu" 
                cancelText="Hủy"
                centered
            >
                <Form form={followForm} layout="vertical" style={{ paddingTop: 16 }}>
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

export default SaleJourneyDetail;
