import React, { useState, useEffect, useMemo } from 'react';
import {
    Card, Button, Progress, Typography, Avatar, Row, Col, Badge, 
    List, Empty, Spin, message, Space, Statistic, Tag
} from 'antd';
import {
    UserOutlined, ClockCircleOutlined, SmileOutlined,
    InboxOutlined, WarningOutlined, NotificationOutlined,
    RightOutlined, BuildOutlined, DeploymentUnitOutlined,
    CalendarOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import { IJourney } from '@/services/core-contracts/types/journey.types';

const { Title, Text } = Typography;

const SupervisorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const response = await journeyService.queryJourneysDto({});
            setJourneys(response.data || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            message.error('Không thể tải dữ liệu dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Filter journeys for this supervisor
    const myJourneys = useMemo(() => {
        if (!user?._id) return [];
        return journeys.filter(j => 
            j.delivery_supervisor_user === user._id || j.owner_user_id === user._id
        );
    }, [journeys, user?._id]);

    const stats = useMemo(() => {
        return {
            inProgress: myJourneys.filter(j => j.project_status === 'active').length,
            surveys: myJourneys.filter(j => ['site_survey', 'survey_review'].includes(j.current_step || '')).length,
            urgent: myJourneys.filter(j => j.priority === 'critical' || j.priority === 'high').length,
            pendingMaterials: 0, // In real app, fetch from materialService
        };
    }, [myJourneys]);

    const urgentJourneys = useMemo(() => {
        return [...myJourneys]
            .sort((a, b) => {
                const priorityMap: any = { critical: 4, high: 3, medium: 2, low: 1 };
                return (priorityMap[b.priority || 'low'] - priorityMap[a.priority || 'low']);
            })
            .slice(0, 3);
    }, [myJourneys]);

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin indicator={<DeploymentUnitOutlined spin style={{ fontSize: 32, color: '#fa8c16' }} />} tip="Đang chuẩn bị bảng điều khiển..." />
            </div>
        );
    }

    return (
        <div className="supervisor-dashboard" style={{ paddingBottom: 80 }}>
            {/* Premium Header Greeting */}
            <Card 
                bodyStyle={{ padding: '24px 20px' }} 
                style={{ 
                    marginBottom: 20, 
                    borderRadius: 16, 
                    background: 'linear-gradient(135deg, #fa8c16 0%, #ffbb96 100%)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(250, 140, 22, 0.2)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid #fff' }} />
                    <div style={{ flex: 1 }}>
                        <Title level={4} style={{ margin: 0, color: '#fff' }}>
                            Chào buổi sáng, {user?.title?.split(' ').pop() || 'Giám sát'}! <SmileOutlined />
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                            Bạn đang phụ trách {stats.inProgress} công trình đang thi công.
                        </Text>
                    </div>
                </div>
            </Card>

            {/* Quick Stats Grid */}
            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card size="small" style={{ borderRadius: 12, textAlign: 'center', borderTop: '3px solid #fa8c16' }}>
                        <Statistic title="Thi công" value={stats.inProgress} valueStyle={{ color: '#fa8c16', fontSize: 20, fontWeight: 'bold' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" style={{ borderRadius: 12, textAlign: 'center', borderTop: '3px solid #13c2c2' }}>
                        <Statistic title="Khảo sát" value={stats.surveys} valueStyle={{ color: '#13c2c2', fontSize: 20, fontWeight: 'bold' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" style={{ borderRadius: 12, textAlign: 'center', borderTop: '3px solid #ff4d4f' }}>
                        <Statistic title="Gấp/SLA" value={stats.urgent} valueStyle={{ color: '#ff4d4f', fontSize: 20, fontWeight: 'bold' }} />
                    </Card>
                </Col>
            </Row>

            {/* Action Cards */}
            <Row gutter={12} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card 
                        hoverable 
                        bodyStyle={{ padding: 16 }} 
                        style={{ borderRadius: 12, height: '100%' }}
                        onClick={() => navigate('/supervisor/materials')}
                    >
                        <Space size={12}>
                            <div style={{ padding: 8, backgroundColor: '#fff7e6', borderRadius: 8 }}>
                                <InboxOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>Vật tư</div>
                                <Text type="secondary" style={{ fontSize: 11 }}>{stats.pendingMaterials} phiếu chờ</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card 
                        hoverable 
                        bodyStyle={{ padding: 16 }} 
                        style={{ borderRadius: 12, height: '100%' }}
                        onClick={() => navigate('/supervisor/incident')}
                    >
                        <Space size={12}>
                            <div style={{ padding: 8, backgroundColor: '#fff2f0', borderRadius: 8 }}>
                                <WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>Sự cố</div>
                                <Text type="secondary" style={{ fontSize: 11 }}>Báo cáo mới</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Urgent Task Queue */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Title level={5} style={{ margin: 0 }}><NotificationOutlined /> Việc cần ưu tiên</Title>
                    <Button type="link" size="small" onClick={() => navigate('/supervisor/projects')}>
                        Xem tất cả hành trình <RightOutlined style={{ fontSize: 10 }} />
                    </Button>
                </div>

                {urgentJourneys.length === 0 ? (
                    <Empty description="Tất cả đã hoàn tất!" style={{ padding: '20px 0' }} />
                ) : (
                    urgentJourneys.map(j => (
                        <Card
                            key={j._id}
                            className="gs-premium-card"
                            hoverable
                            style={{ marginBottom: 12, borderRadius: 12 }}
                            bodyStyle={{ padding: '16px' }}
                            onClick={() => navigate(`/supervisor/journeys/${j._id}`)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <Badge status={j.priority === 'critical' ? 'error' : (j.priority === 'high' ? 'warning' : 'processing')} />
                                        <Text strong>{j.journey_code || j._id.slice(-8)}</Text>
                                        <Tag color={j.priority === 'critical' ? 'red' : 'orange'} style={{ margin: 0, fontSize: 10 }}>
                                            {j.priority?.toUpperCase() || 'MEDIUM'}
                                        </Tag>
                                    </div>
                                    <Title level={5} style={{ margin: '4px 0 8px 0', fontSize: 15 }}>{j.customer_full_name || 'Khách hàng'}</Title>
                                    <Space direction="vertical" size={2}>
                                        <Text type="secondary" style={{ fontSize: 12 }}><CalendarOutlined /> Cập nhật: {j.last_activity_at ? new Date(j.last_activity_at).toLocaleDateString('vi-VN') : 'N/A'}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }} ellipsis><ThunderboltOutlined /> Hiện tại: {j.current_step?.replace(/_/g, ' ')}</Text>
                                    </Space>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fa8c16' }}>{j.progress_pct || 0}%</div>
                                    <Progress 
                                        percent={j.progress_pct || 0} 
                                        showInfo={false} 
                                        strokeColor="#fa8c16" 
                                        size="small" 
                                        style={{ width: 60 }} 
                                    />
                                    <div style={{ marginTop: 8 }}>
                                        <Button size="small" type="primary" style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}>Xử lý</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Quick Summary Card */}
            <Card 
                title={<span style={{ fontSize: 14 }}><ClockCircleOutlined /> Lịch sử vận hành gần đây</span>} 
                size="small" 
                style={{ borderRadius: 12 }}
            >
                <List
                    size="small"
                    dataSource={myJourneys.slice(0, 4)}
                    renderItem={j => (
                        <List.Item style={{ padding: '10px 0' }} onClick={() => navigate(`/supervisor/journeys/${j._id}`)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', cursor: 'pointer' }}>
                                <Avatar size="small" src={null} icon={<BuildOutlined />} style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }} />
                                <div style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 13 }}>Cập nhật trạng thái: <Text strong>{j.journey_code}</Text></Text>
                                    <div style={{ fontSize: 11, color: '#999' }}>{j.last_activity_at ? new Date(j.last_activity_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'} - {j.current_step}</div>
                                </div>
                                <RightOutlined style={{ fontSize: 10, color: '#ccc' }} />
                            </div>
                        </List.Item>
                    )}
                    locale={{ emptyText: <Text type="secondary" style={{ fontSize: 12 }}>Chưa có hoạt động mới</Text> }}
                />
            </Card>
        </div>
    );
};

export default SupervisorDashboard;
