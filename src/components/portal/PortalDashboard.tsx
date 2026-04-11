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
import { AppBrandLogo } from '../common/AppBrandLogo';
import { mockJourneyTemplates } from '../../data/journeyMockData';

const { Title, Text } = Typography;

interface PortalDashboardProps {
    journey: Journey;
    token?: string;
    onNavigate?: (path: string) => void;
    isPreview?: boolean;
}

const PortalDashboard: React.FC<PortalDashboardProps> = ({ journey, token, onNavigate, isPreview }) => {
    // Resolve dynamic steps from template
    const template = mockJourneyTemplates.find(t => t.id === journey.template_id) || mockJourneyTemplates[0];
    const allSteps = template?.steps || [];
    
    // Filter steps where publish_flag is true
    const publishedSteps = allSteps.filter(s => s.publish_flag);
    
    // Find index of current step in the sequence of published steps
    // Note: We need to find where the technical current_step situates relative to published steps
    const currentStepCode = (journey as any).current_step || journey.current_step_code;
    const currentStepIndexInAll = allSteps.findIndex(s => s.step_code === currentStepCode);
    
    const steps = publishedSteps.map((s) => {
        const stepIndexInAll = allSteps.findIndex(as => as.step_code === s.step_code);
        
        let status: 'finish' | 'process' | 'wait' = 'wait';
        let description = 'Chưa bắt đầu';
        
        if (stepIndexInAll < currentStepIndexInAll) {
            status = 'finish';
            description = 'Hoàn thành';
        } else if (stepIndexInAll === currentStepIndexInAll) {
            status = 'process';
            description = 'Đang thực hiện';
        }
        
        // Special case: if project is completed, all steps are finished
        if (journey.project_status === 'completed') {
            status = 'finish';
            description = 'Hoàn thành';
        }

        return {
            title: s.step_name,
            description,
            status
        };
    });

    const currentStepInPublished = steps.findIndex(s => s.status === 'process');
    // If no 'process' step, it's either all 'finish' or all 'wait'
    const finalCurrent = currentStepInPublished !== -1 
        ? currentStepInPublished 
        : (steps.every(s => s.status === 'finish') ? steps.length : 0);

    // Mock progress calculation
    const progress = journey.progress_pct || (currentStepIndexInAll >= 0 ? Math.round((currentStepIndexInAll / allSteps.length) * 100) : 0);

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
                background: '#fff',
                borderBottom: '1px solid #e2e8f0',
                padding: isPreview ? '12px 16px 32px' : '24px 24px 50px',
                color: '#1e293b',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <Title level={isPreview ? 4 : 2} style={{ color: '#0f172a', margin: '0 0 12px' }}>
                        {journey.request_title || 'Chi tiết công trình'}
                    </Title>
                    <Space size="middle" style={{ color: '#475569' }}>
                        <Text style={{ color: '#475569', fontSize: 12 }}>Mã: {journey.journey_code}</Text>
                        <Tag color="blue" style={{ border: 'none', fontSize: 10 }}>{journey.idx_serviceTypeId?.title}</Tag>
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
                                Bước hiện tại: <strong>{currentStepCode || 'Khởi tạo'}</strong>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card size="small" style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 16 }}>
                            <Statistic 
                                title={<span style={{ fontSize: 12 }}>Tài liệu dự án</span>}
                                value={journey.document_count ?? 0} 
                                valueStyle={{ color: '#52c41a', fontWeight: 600, fontSize: 20 }}
                                prefix={<FileTextOutlined style={{ marginRight: 8, color: '#b7eb8f' }} />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Button size="small" type="link" style={{ padding: 0, fontSize: 12 }} onClick={() => onNavigate?.(`/portal/journeys/${token}/documents`)}>
                                    Xem tài liệu <RightOutlined style={{ fontSize: 10 }} />
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card size="small" style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 16 }}>
                            <Statistic 
                                title={<span style={{ fontSize: 12 }}>Tin nhắn / Phản hồi</span>}
                                value={journey.thread_count || 0} 
                                valueStyle={{ color: '#fa8c16', fontWeight: 600, fontSize: 20 }}
                                prefix={<MessageOutlined style={{ marginRight: 8, color: '#ffd591' }} />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Button size="small" type="link" style={{ padding: 0, fontSize: 12 }} onClick={() => onNavigate?.(`/portal/journeys/${token}/threads`)}>
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
                    extra={<Button type="link" size="small" onClick={() => onNavigate?.(`/portal/journeys/${token}/timeline`)}>Xem chi tiết</Button>}
                >
                    <Steps 
                        direction="vertical" 
                        size="small"
                        current={finalCurrent} 
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
                            <Text strong style={{ fontSize: 14 }}>PM: {journey.owner_user || journey.idx_owner_user?.title || 'Quản lý dự án'}</Text>
                            <div style={{ color: '#666', fontSize: 11 }}>
                                Cần hỗ trợ khẩn cấp? Vui lòng gọi Hotline.
                            </div>
                        </div>
                        <Button type="primary" size="small" shape="round" icon={<MessageOutlined />} onClick={() => onNavigate?.(`/portal/journeys/${token}/threads`)}>
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
