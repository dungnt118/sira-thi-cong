import React, { useState, useEffect, useMemo } from 'react';
import {
    Card, Input, Tag, Typography, List, Row, Col, Select, Space, Button, 
    Progress, Spin, Empty, message, Badge
} from 'antd';
import {
    SearchOutlined, FilterOutlined, EnvironmentOutlined,
    RightOutlined, BuildOutlined, BookOutlined,
    ClockCircleOutlined, UserOutlined, DeploymentUnitOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import { IJourney } from '@/services/core-contracts/types/journey.types';

const { Title, Text } = Typography;
const { Search } = Input;

export const SupervisorJourneyList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchJourneys = async () => {
        setIsLoading(true);
        try {
            // Fetch all journeys to allow supervisor to see broader context if needed, 
            // but we'll focus on their supervised ones in the UI
            const response = await journeyService.queryJourneysDto({});
            setJourneys(response.data || []);
        } catch (error) {
            console.error('Failed to fetch journeys:', error);
            message.error('Không thể tải danh sách hành trình');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJourneys();
    }, []);

    const filteredJourneys = useMemo(() => {
        return journeys.filter(j => {
            const matchesSearch = 
                (j.journey_code?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (j.customer_full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (j.site_address?.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesStatus = statusFilter === 'ALL' || 
                (statusFilter === 'IN_PROGRESS' && j.project_status === 'active') ||
                (statusFilter === 'COMPLETED' && j.project_status === 'completed') ||
                (statusFilter === 'SURVEY' && ['site_survey', 'survey_review'].includes(j.current_step || ''));
            
            return matchesSearch && matchesStatus;
        });
    }, [journeys, searchTerm, statusFilter]);

    const myJourneys = useMemo(() => {
        if (!user?._id) return [];
        return filteredJourneys.filter(j => 
            j.delivery_supervisor_user === user._id || j.owner_user_id === user._id
        );
    }, [filteredJourneys, user?._id]);

    const otherJourneys = useMemo(() => {
        if (!user?._id) return filteredJourneys;
        return filteredJourneys.filter(j => 
            j.delivery_supervisor_user !== user._id && j.owner_user_id !== user._id
        );
    }, [filteredJourneys, user?._id]);

    const renderJourneyCard = (j: IJourney, isOwn: boolean) => {
        const progress = j.progress_pct || 0;
        const statusColor = j.project_status === 'completed' ? 'green' : (j.project_status === 'active' ? 'orange' : 'default');
        
        return (
            <Card
                key={j._id}
                className="gs-premium-card"
                style={{ 
                    marginBottom: 16, 
                    borderRadius: 12,
                    borderLeft: `5px solid ${isOwn ? '#fa8c16' : '#d9d9d9'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }}
                hoverable
                onClick={() => navigate(`/supervisor/journeys/${j._id}`)}
                bodyStyle={{ padding: '16px' }}
            >
                <Row gutter={16} align="middle">
                    <Col xs={18} sm={20}>
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <Text strong style={{ fontSize: 13, color: '#8c8c8c' }}>{j.journey_code || j._id.slice(-8)}</Text>
                                <Tag color={statusColor}>
                                    {(j.current_step || 'Unknown').replace(/_/g, ' ').toUpperCase()}
                                </Tag>
                                {isOwn && <Tag color="gold" icon={<UserOutlined />}>Phụ trách</Tag>}
                            </div>
                            <Title level={5} style={{ margin: 0, fontSize: 16 }}>{j.customer_full_name || 'Khách hàng'}</Title>
                            <Text type="secondary" ellipsis style={{ fontSize: 13, display: 'block', maxWidth: '90%' }}>
                                <EnvironmentOutlined style={{ marginRight: 6 }} /> {j.site_address || 'N/A'}
                            </Text>
                        </Space>
                    </Col>
                    <Col xs={6} sm={4} style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Progress 
                                type="circle" 
                                percent={progress} 
                                size={45} 
                                strokeColor={progress >= 100 ? '#52c41a' : '#fa8c16'} 
                            />
                        </div>
                    </Col>
                </Row>

                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={16}>
                        <div>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Cập nhật</Text>
                            <Text style={{ fontSize: 12 }}><ClockCircleOutlined /> {j.last_activity_at ? new Date(j.last_activity_at).toLocaleDateString('vi-VN') : 'N/A'}</Text>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Dịch vụ</Text>
                            <Text strong style={{ fontSize: 12 }}>{j.requested_service || 'Dịch vụ lẻ'}</Text>
                        </div>
                    </Space>
                    <Space>
                        <Button 
                            size="small" 
                            icon={<BookOutlined />}
                            onClick={(e) => { e.stopPropagation(); navigate(`/supervisor/journeys/${j._id}`); }}
                        >
                            Nhật ký
                        </Button>
                        <Button 
                            type="primary" 
                            size="small" 
                            icon={<BuildOutlined />}
                            style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/supervisor/journeys/${j._id}`); }}
                        >
                            Chi tiết
                        </Button>
                    </Space>
                </div>
            </Card>
        );
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin indicator={<DeploymentUnitOutlined spin style={{ fontSize: 32, color: '#fa8c16' }} />} tip="Đang tải dữ liệu hành trình..." />
            </div>
        );
    }

    return (
        <div className="supervisor-journey-list" style={{ paddingBottom: 80 }}>
            {/* Header Section */}
            <div style={{ marginBottom: 24 }}>
                <Title level={4}>Hành trình công việc</Title>
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    <Search
                        placeholder="Tìm theo mã, khách hàng hoặc địa chỉ..."
                        onChange={e => setSearchTerm(e.target.value)}
                        allowClear
                        size="large"
                        enterButton={<SearchOutlined />}
                        style={{ borderRadius: 8, overflow: 'hidden' }}
                    />
                    
                    <Row gutter={8}>
                        <Col span={24}>
                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
                                <Button 
                                    shape="round" 
                                    type={statusFilter === 'ALL' ? 'primary' : 'default'}
                                    onClick={() => setStatusFilter('ALL')}
                                    style={statusFilter === 'ALL' ? { backgroundColor: '#fa8c16', borderColor: '#fa8c16' } : {}}
                                >
                                    Tất cả
                                </Button>
                                <Button 
                                    shape="round" 
                                    type={statusFilter === 'IN_PROGRESS' ? 'primary' : 'default'}
                                    onClick={() => setStatusFilter('IN_PROGRESS')}
                                    style={statusFilter === 'IN_PROGRESS' ? { backgroundColor: '#fa8c16', borderColor: '#fa8c16' } : {}}
                                >
                                    Đang thi công
                                </Button>
                                <Button 
                                    shape="round" 
                                    type={statusFilter === 'SURVEY' ? 'primary' : 'default'}
                                    onClick={() => setStatusFilter('SURVEY')}
                                    style={statusFilter === 'SURVEY' ? { backgroundColor: '#fa8c16', borderColor: '#fa8c16' } : {}}
                                >
                                    Khảo sát
                                </Button>
                                <Button 
                                    shape="round" 
                                    type={statusFilter === 'COMPLETED' ? 'primary' : 'default'}
                                    onClick={() => setStatusFilter('COMPLETED')}
                                    style={statusFilter === 'COMPLETED' ? { backgroundColor: '#fa8c16', borderColor: '#fa8c16' } : {}}
                                >
                                    Đã hoàn thành
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Space>
            </div>

            {/* List Section */}
            {myJourneys.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <Divider orientation="left" style={{ margin: '0 0 16px 0' }}>
                        <Text strong style={{ color: '#fa8c16' }}>DỰ ÁN PHỤ TRÁCH ({myJourneys.length})</Text>
                    </Divider>
                    {myJourneys.map(j => renderJourneyCard(j, true))}
                </div>
            )}

            {otherJourneys.length > 0 && (
                <div>
                    <Divider orientation="left" style={{ margin: '0 0 16px 0' }}>
                        <Text type="secondary" strong>CÁC DỰ ÁN KHÁC ({otherJourneys.length})</Text>
                    </Divider>
                    {otherJourneys.map(j => renderJourneyCard(j, false))}
                </div>
            )}

            {myJourneys.length === 0 && otherJourneys.length === 0 && (
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={
                        <Space direction="vertical">
                            <Text type="secondary">Không tìm thấy hành trình nào phù hợp</Text>
                            <Button type="link" onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}>Xóa bộ lọc</Button>
                        </Space>
                    } 
                />
            )}
        </div>
    );
};

const Divider = ({ orientation, style, children }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', ...style }}>
        {orientation === 'left' ? (
            <>
                <div style={{ paddingRight: 12 }}>{children}</div>
                <div style={{ flex: 1, height: 1, backgroundColor: '#f0f0f0' }}></div>
            </>
        ) : (
            <>
                <div style={{ flex: 1, height: 1, backgroundColor: '#f0f0f0' }}></div>
                <div style={{ padding: '0 12px' }}>{children}</div>
                <div style={{ flex: 1, height: 1, backgroundColor: '#f0f0f0' }}></div>
            </>
        )}
    </div>
);

export default SupervisorJourneyList;
