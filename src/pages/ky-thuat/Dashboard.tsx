import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Row, Col, Badge, Progress, List, Button, Spin } from 'antd';
import {
    CalendarOutlined,
    EnvironmentOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import { IJourney } from '@/services/core-contracts/types/journey.types';
import { buildJourneyDetailRoute } from '@/utils/adminRoutes';
import { HEADER_STEP_CONFIG } from '../shared/Journeys/components/JourneyHistoryModal';

const { Title, Text } = Typography;

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyJourneys = async () => {
        setIsLoading(true);
        try {
            // Fetch all journeys to match PM view behavior as requested
            const response = await journeyService.queryJourneysDto({});
            setJourneys(response.data || []);
        } catch (error) {
            console.error('Failed to fetch journeys:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJourneys();
    }, []);

    const stats = [
        {
            title: 'Khảo sát & Giải pháp',
            value: journeys.filter(j => ['lead_new', 'consult_contact', 'site_survey', 'solution_design'].includes(j.current_step || '')).length,
            color: '#faad14'
        },
        {
            title: 'Đang thi công',
            value: journeys.filter(j => ['execution'].includes(j.current_step || '')).length,
            color: '#1890ff'
        },
        {
            title: 'Hoàn tất / Bảo hành',
            value: journeys.filter(j => ['final_acceptance', 'payment', 'maintenance', 'warranty', 'after_sales'].includes(j.current_step || '')).length,
            color: '#52c41a'
        },
    ];

    const todayTasks = journeys.map(j => {
        const dateObj = j.last_activity_at ? new Date(j.last_activity_at) : new Date();
        return {
            id: j.journey_code || j._id.slice(-8),
            type: HEADER_STEP_CONFIG.find(s => s.key === j.current_step)?.label || j.current_step?.replace(/_/g, ' ').toUpperCase() || 'N/A',
            customer: j.customer_full_name || 'Khách hàng',
            phone: j.customer_phone || 'N/A',
            address: j.site_address || 'Địa chỉ công trình',
            time: dateObj.toLocaleDateString('vi-VN') + ' ' + dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            status: j.project_status === 'active' ? 'in-progress' : 'pending',
            progress_pct: j.progress_pct || 0,
            current_step: j.current_step || 'lead_new',
            request_title: j.request_title || 'Yêu cầu dịch vụ',
            route: buildJourneyDetailRoute('kyt', j._id)
        };
    });

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 24 }}>
            <Title level={4} className="ky-thuat-page-title">Xin chào, {user?.title || 'Kỹ thuật viên'}!</Title>

            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                {stats.map(stat => (
                    <Col span={8} key={stat.title}>
                        <Card
                            bodyStyle={{ padding: '12px 8px', textAlign: 'center' }}
                            className="ky-card"
                            style={{ borderTop: `3px solid ${stat.color}`, height: '100%' }}
                        >
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: 11, color: '#8c8c8c' }}>{stat.title}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 24 }} className="ky-card">
                <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
                    Tiến độ công việc tổng thể
                </Text>
                <Progress
                    percent={Math.round(journeys.filter(j => j.project_status === 'completed').length / (journeys.length || 1) * 100)}
                    strokeColor="#13a8a8"
                    status="active"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                    <span>Sắp hoàn thành: {journeys.filter(j => (j.progress_pct || 0) > 80).length}</span>
                    <span>Tổng công trình: {journeys.length}</span>
                </div>
            </div>

            <Title level={5} style={{ marginBottom: 16 }}>Danh sách công trình</Title>

            <List
                itemLayout="vertical"
                dataSource={todayTasks}
                renderItem={(item) => (
                    <Card className="ky-card" bodyStyle={{ padding: 16 }} onClick={() => navigate(item.route)} hoverable style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                            <Badge
                                color={item.status === 'pending' ? 'orange' : 'blue'}
                                text={<span style={{ fontWeight: 700, fontSize: 16, color: '#1890ff' }}>{
                                    (() => {
                                        const steps = HEADER_STEP_CONFIG.map(s => s.key);
                                        const idx = steps.indexOf(item.current_step);
                                        const label = item.type;
                                        return `${label} (${idx >= 0 ? idx + 1 : 1}/12)`;
                                    })()
                                }</span>}
                            />
                            <Text type="secondary" style={{ fontSize: 13, fontWeight: 600 }}>{item.id}</Text>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <div style={{ flex: 1 }}>
                                <Progress percent={item.progress_pct} size="small" showInfo={true} strokeColor="#52c41a" strokeWidth={6} />
                            </div>
                        </div>

                        <Title level={5} style={{ margin: '0 0 4px 0', color: '#434343' }}>{item.customer}</Title>
                        <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>{item.request_title}</Text>

                        <Space direction="vertical" size={2} style={{ width: '100%', marginBottom: 16 }}>
                            <Text type="secondary"><CalendarOutlined style={{ marginRight: 8 }} /> {item.time}</Text>
                            <Text type="secondary" ellipsis><EnvironmentOutlined style={{ marginRight: 8 }} /> {item.address}</Text>
                        </Space>

                        <Button
                            type="primary"
                            block
                            style={{ backgroundColor: item.status === 'pending' ? '#13a8a8' : '#1890ff' }}
                        >
                            Chuyển tới xử lý chi tiết
                        </Button>
                    </Card>
                )}
                locale={{ emptyText: <Text type="secondary">Không có công trình nào được tìm thấy trên hệ thống.</Text> }}
            />
        </div>
    );
};

export default Dashboard;
