import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Badge, Radio, Spin, Empty } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import { IJourney } from '@/services/core-contracts/types/journey.types';

const { Title, Text } = Typography;

export const Schedule: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [filter, setFilter] = useState('upcoming');
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyJourneys = async () => {
        setIsLoading(true);
        try {
            const response = await journeyService.queryJourneysDto({});
            setJourneys(response.data || []);
        } catch (error) {
            console.error('Failed to fetch schedules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJourneys();
    }, []);

    const mappedSchedules = journeys.map(j => {
        const dateObj = j.last_activity_at ? new Date(j.last_activity_at) : new Date();
        const type = j.current_step?.includes('survey') ? 'Khảo sát' :
            j.current_step?.includes('execution') ? 'Thi công' :
                j.current_step?.includes('warranty') ? 'Bảo trì' : 'Khác';

        let status: 'upcoming' | 'in-progress' | 'completed' = 'upcoming';
        if (j.project_status === 'completed') status = 'completed';
        else if (j.project_status === 'active') status = 'in-progress';

        return {
            id: j._id,
            code: j.journey_code || j._id.slice(-8),
            type,
            customer: j.customer_full_name || 'Khách hàng',
            time: dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            date: dateObj.toLocaleDateString('vi-VN'),
            address: j.site_address || 'N/A',
            status
        };
    });

    const filteredSchedules = mappedSchedules.filter(s =>
        filter === 'all' ? true :
            filter === 'upcoming' ? (s.status === 'upcoming' || s.status === 'in-progress') :
                s.status === 'completed'
    );

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Đang tải lịch trình..." />
            </div>
        );
    }

    return (
        <div>
            <Title level={4} className="ky-thuat-page-title">Lịch trình làm việc</Title>

            <div style={{ marginBottom: 16 }}>
                <Radio.Group value={filter} onChange={e => setFilter(e.target.value)} buttonStyle="solid" style={{ width: '100%', display: 'flex' }}>
                    <Radio.Button value="upcoming" style={{ flex: 1, textAlign: 'center' }}>Sắp tới</Radio.Button>
                    <Radio.Button value="completed" style={{ flex: 1, textAlign: 'center' }}>Hoàn thành</Radio.Button>
                    <Radio.Button value="all" style={{ flex: 1, textAlign: 'center' }}>Tất cả</Radio.Button>
                </Radio.Group>
            </div>

            <List
                dataSource={filteredSchedules}
                locale={{ emptyText: <Empty description="Không có lịch trình phù hợp" /> }}
                renderItem={item => (
                    <Card
                        className="ky-card"
                        size="small"
                        style={{ marginBottom: 12 }}
                        onClick={() => navigate(`/kyt/journeys/${item.id}`)}
                        hoverable
                    >
                        <div style={{ display: 'flex' }}>
                            <div style={{
                                width: 4,
                                backgroundColor: item.type === 'Khảo sát' ? '#faad14' : item.type === 'Thi công' ? '#1890ff' : '#eb2f96',
                                borderRadius: 4,
                                marginRight: 12
                            }}></div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text strong>{item.customer}</Text>
                                    <Badge status={item.status === 'completed' ? 'success' : item.status === 'in-progress' ? 'processing' : 'warning'} />
                                </div>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>
                                    <ClockCircleOutlined /> {item.time} | <CalendarOutlined /> {item.date}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                                    <EnvironmentOutlined /> {item.address}
                                </Text>
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>Mã: {item.code}</Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            />
        </div>
    );
};

export default Schedule;
