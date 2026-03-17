import React from 'react';
import {
    Card, Row, Col, Progress, Tag, Typography, Steps,
    Space, Button, Statistic
} from 'antd';
import {
    SafetyOutlined, FileTextOutlined, MessageOutlined, ClockCircleOutlined, RightOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Journey } from '../../types/journey';

const { Title, Text } = Typography;

interface PortalDashboardProps {
    journey: Journey;
    token?: string;
    onNavigate?: (path: string) => void;
    isPreview?: boolean;
}

const PortalDashboard: React.FC<PortalDashboardProps> = ({ journey, token, onNavigate, isPreview }) => {
    // Mock progress calculation
    const progress = journey.progress_pct || 35;
    
    // Mock steps for timeline preview
    const steps: any[] = [
        { title: 'Tiếp nhận yêu cầu', description: 'Hoàn thành', status: 'finish' },
        { title: 'Khảo sát hiện trường', description: 'Hoàn thành', status: 'finish' },
        { title: 'Báo giá & Hợp đồng', description: 'Đang thực hiện', status: 'process' },
        { title: 'Thi công', description: 'Chưa bắt đầu', status: 'wait' },
        { title: 'Nghiệm thu', description: 'Chưa bắt đầu', status: 'wait' },
    ];

    const containerStyle: React.CSSProperties = isPreview ? {
        background: '#f5f7fb',
        paddingBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #e8e8e8'
    } : {
        background: '#f5f7fb',
        minHeight: '100vh',
        paddingBottom: 40
    };

    return (
        <div style={containerStyle}>
            {/* Header / Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #001529 0%, #0050b3 100%)',
                padding: isPreview ? '24px 16px 40px' : '40px 24px 60px',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isPreview ? 16 : 24 }}>
                        <div style={{
                            width: 32, height: 32, background: 'rgba(255,255,255,0.2)',
                            borderRadius: 8, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 16, fontWeight: 700,
                        }}>
                            S
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Cổng Thông Tin Dịch Vụ - SIRA
                        </div>
                    </div>
                    
                    <Title level={isPreview ? 4 : 2} style={{ color: '#fff', margin: '0 0 12px' }}>
                        {journey.request_title}
                    </Title>
                    <Space size="middle" style={{ opacity: 0.9 }}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>Mã: {journey.journey_code}</Text>
                        <Tag color="blue" style={{ border: 'none', fontSize: 10 }}>{journey.requested_service}</Tag>
                    </Space>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ 
                maxWidth: 800, 
                margin: '-30px auto 0', 
                padding: '0 16px', 
                position: 'relative', 
                zIndex: 2 
            }}>
                
                {/* Stats Overview */}
                <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                    <Col xs={24} md={8}>
                        <Card size="small" style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 16 }}>
                            <Statistic 
                                title={<span style={{ fontSize: 12 }}>Tiến độ tổng thể</span>}
                                value={progress} 
                                suffix="%" 
                                valueStyle={{ color: '#1890ff', fontWeight: 600, fontSize: 20 }}
                            />
                            <Progress percent={progress} showInfo={false} strokeColor="#1890ff" size="small" />
                            <div style={{ marginTop: 8, fontSize: 11, color: '#666' }}>
                                Bước hiện tại: <strong>{journey.current_step}</strong>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card size="small" style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 16 }}>
                            <Statistic 
                                title={<span style={{ fontSize: 12 }}>Tài liệu dự án</span>}
                                value={journey.document_count || 3} 
                                valueStyle={{ color: '#52c41a', fontWeight: 600, fontSize: 20 }}
                                prefix={<FileTextOutlined style={{ marginRight: 8, color: '#b7eb8f' }} />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Button size="small" type="link" style={{ padding: 0, fontSize: 12 }} onClick={() => onNavigate?.(`/p/${token}/documents`)}>
                                    Xem tài liệu <RightOutlined style={{ fontSize: 10 }} />
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card size="small" style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 16 }}>
                            <Statistic 
                                title={<span style={{ fontSize: 12 }}>Tin nhắn / Phản hồi</span>}
                                value={journey.thread_count || 2} 
                                valueStyle={{ color: '#fa8c16', fontWeight: 600, fontSize: 20 }}
                                prefix={<MessageOutlined style={{ marginRight: 8, color: '#ffd591' }} />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Button size="small" type="link" style={{ padding: 0, fontSize: 12 }} onClick={() => onNavigate?.(`/p/${token}/threads`)}>
                                    Mở hộp thư <RightOutlined style={{ fontSize: 10 }} />
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Timeline Preview */}
                <Card 
                    title={<><ClockCircleOutlined style={{ color: '#1890ff' }} /> Lộ trình dịch vụ</>} 
                    size="small"
                    style={{ borderRadius: 12, marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    headStyle={{ fontSize: 14 }}
                    extra={<Button type="link" size="small" onClick={() => onNavigate?.(`/p/${token}/timeline`)}>Xem chi tiết</Button>}
                >
                    <Steps 
                        direction="vertical" 
                        size="small"
                        current={2} 
                        items={steps}
                    />
                    <div style={{ marginTop: 16, padding: '12px 16px', background: '#e6f7ff', borderRadius: 8, borderLeft: '4px solid #1890ff' }}>
                        <Text strong style={{ color: '#0050b3', fontSize: 12 }}>Cập nhật tiếp theo dự kiến:</Text>
                        <div style={{ fontSize: 12, color: '#0050b3', marginTop: 4 }}>
                            {journey.next_milestone_due || 'Sẽ báo giá sau khi hoàn thành khảo sát.'}
                        </div>
                    </div>
                </Card>

                {/* Support Contact */}
                <Card size="small" style={{ borderRadius: 12, background: '#fafafa', border: '1px solid #e8e8e8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                            width: 40, height: 40, background: '#e6f7ff', borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 
                        }}>
                            <UserOutlined />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Text strong style={{ fontSize: 14 }}>PM: {journey.owner_user}</Text>
                            <div style={{ color: '#666', fontSize: 11 }}>
                                Cần hỗ trợ khẩn cấp? Vui lòng gọi Hotline.
                            </div>
                        </div>
                        <Button type="primary" size="small" shape="round" icon={<MessageOutlined />} onClick={() => onNavigate?.(`/p/${token}/threads`)}>
                            Chat
                        </Button>
                    </div>
                </Card>

                <div style={{ textAlign: 'center', marginTop: 32, color: '#999', fontSize: 10 }}>
                    <SafetyOutlined /> Kết nối bảo mật. Dữ liệu mã hóa.<br/>
                    © 2026 Lam Bac Group
                </div>
            </div>
        </div>
    );
};

export default PortalDashboard;
