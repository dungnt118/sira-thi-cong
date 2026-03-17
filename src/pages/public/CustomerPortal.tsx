import React from 'react';
import {
    Card, Row, Col, Progress, Tag, Typography, Steps,
    Space, Button, Statistic
} from 'antd';
import {
    SafetyOutlined, FileTextOutlined, MessageOutlined, ClockCircleOutlined, RightOutlined,
    SearchOutlined, UserOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { mockJourneys } from '../../data/journeyMockData';

const { Title, Text } = Typography;

const CustomerPortal: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    // Find journey by portal token
    // For demo purposes, if no token or token not found, default to first journey that has a token
    const journey = mockJourneys.find(j => j.portal_token === token) || mockJourneys.find(j => j.portal_token);

    if (!journey) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: 24,
            }}>
                <Card style={{ textAlign: 'center', borderRadius: 16, maxWidth: 400, width: '100%' }}>
                    <div style={{ fontSize: 64, color: '#bfbfbf' }}><SearchOutlined /></div>
                    <Title level={3} style={{ color: '#ff4d4f' }}>Không tìm thấy</Title>
                    <Text type="secondary">Link portal không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ nhà thầu để được cấp link mới.</Text>
                </Card>
            </div>
        );
    }

    // Mock progress calculation based on some logic or fixed for demo
    const progress = journey.progress_pct || 35;
    
    // Mock steps for timeline preview
    const steps: any[] = [
        { title: 'Tiếp nhận yêu cầu', description: 'Hoàn thành', status: 'finish' },
        { title: 'Khảo sát hiện trường', description: 'Hoàn thành', status: 'finish' },
        { title: 'Báo giá & Hợp đồng', description: 'Đang thực hiện', status: 'process' },
        { title: 'Thi công', description: 'Chưa bắt đầu', status: 'wait' },
        { title: 'Nghiệm thu', description: 'Chưa bắt đầu', status: 'wait' },
    ];

    return (
        <div style={{ background: '#f5f7fb', minHeight: '100vh', paddingBottom: 40 }}>
            {/* Header / Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #001529 0%, #0050b3 100%)',
                padding: '40px 24px 60px',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{
                            width: 32, height: 32, background: 'rgba(255,255,255,0.2)',
                            borderRadius: 8, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 16, fontWeight: 700,
                        }}>
                            S
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Cổng Thông Tin Dịch Vụ - SIRA
                        </div>
                    </div>
                    
                    <Title level={2} style={{ color: '#fff', margin: '0 0 12px', fontSize: 28 }}>
                        {journey.request_title}
                    </Title>
                    <Space size="middle" style={{ opacity: 0.9 }}>
                        <Text style={{ color: '#fff', fontSize: 14 }}>Mã dịch vụ: {journey.journey_code}</Text>
                        <Tag color="blue" style={{ border: 'none' }}>{journey.requested_service}</Tag>
                    </Space>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: 800, margin: '-40px auto 0', padding: '0 16px', position: 'relative', zIndex: 2 }}>
                
                {/* Stats Overview */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} md={8}>
                        <Card style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 20 }}>
                            <Statistic 
                                title="Tiến độ tổng thể" 
                                value={progress} 
                                suffix="%" 
                                valueStyle={{ color: '#1890ff', fontWeight: 600 }}
                            />
                            <Progress percent={progress} showInfo={false} strokeColor="#1890ff" size="small" />
                            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                                Bước hiện tại: <strong>{journey.current_step}</strong>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8} style={{ marginTop: window.innerWidth < 768 ? 16 : 0 }}>
                        <Card style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 20 }}>
                            <Statistic 
                                title="Tài liệu dự án" 
                                value={journey.document_count || 3} 
                                valueStyle={{ color: '#52c41a', fontWeight: 600 }}
                                prefix={<FileTextOutlined style={{ marginRight: 8, color: '#b7eb8f' }} />}
                            />
                            <div style={{ marginTop: 12 }}>
                                <Button size="small" type="link" style={{ padding: 0 }} onClick={() => navigate(`/p/${token}/documents`)}>
                                    Xem tài liệu <RightOutlined style={{ fontSize: 10 }} />
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8} style={{ marginTop: window.innerWidth < 768 ? 16 : 0 }}>
                        <Card style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 20 }}>
                            <Statistic 
                                title="Tin nhắn / Phản hồi" 
                                value={journey.thread_count || 2} 
                                valueStyle={{ color: '#fa8c16', fontWeight: 600 }}
                                prefix={<MessageOutlined style={{ marginRight: 8, color: '#ffd591' }} />}
                            />
                            <div style={{ marginTop: 12 }}>
                                <Button size="small" type="link" style={{ padding: 0 }} onClick={() => navigate(`/p/${token}/threads`)}>
                                    Mở hộp thư <RightOutlined style={{ fontSize: 10 }} />
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Timeline Preview */}
                <Card title={<><ClockCircleOutlined style={{ color: '#1890ff' }} /> Lộ trình dịch vụ</>} 
                      style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      extra={<Button type="link" onClick={() => navigate(`/p/${token}/timeline`)}>Xem chi tiết</Button>}
                >
                    <Steps 
                        direction="vertical" 
                        size="small"
                        current={2} 
                        items={steps}
                    />
                    <div style={{ marginTop: 16, padding: '12px 16px', background: '#e6f7ff', borderRadius: 8, borderLeft: '4px solid #1890ff' }}>
                        <Text strong style={{ color: '#0050b3' }}>Cập nhật tiếp theo dự kiến:</Text>
                        <div style={{ fontSize: 13, color: '#0050b3', marginTop: 4 }}>
                            {journey.next_milestone_due || 'Sẽ báo giá sau khi hoàn thành khảo sát.'}
                        </div>
                    </div>
                </Card>

                {/* Support Contact */}
                <Card style={{ borderRadius: 12, background: '#fafafa', border: '1px solid #e8e8e8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ 
                            width: 48, height: 48, background: '#e6f7ff', borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 
                        }}>
                            <UserOutlined />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Text strong style={{ fontSize: 16 }}>PM Phụ trách: {journey.owner_user}</Text>
                            <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>
                                Cần hỗ trợ khẩn cấp? Vui lòng gọi Hotline.
                            </div>
                        </div>
                        <Button type="primary" shape="round" icon={<MessageOutlined />} onClick={() => navigate(`/p/${token}/threads`)}>
                            Nhắn tin
                        </Button>
                    </div>
                </Card>

                <div style={{ textAlign: 'center', marginTop: 40, color: '#999', fontSize: 12 }}>
                    <SafetyOutlined /> Kết nối bảo mật. Dữ liệu của bạn được mã hóa an toàn.<br/>
                    © 2026 Lam Bac Group
                </div>
            </div>
        </div>
    );
};

export default CustomerPortal;
