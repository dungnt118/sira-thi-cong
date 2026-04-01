import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Tag, Space, List, Spin, Empty } from 'antd';
import { LoadingOutlined, RocketOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import { IJourney } from '@/services/core-contracts/types/journey.types';

const { Title, Text } = Typography;

export const Execution: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeJourneys, setActiveJourneys] = useState<IJourney[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchActiveExecutions = async () => {
        setIsLoading(true);
        try {
            // Fetch all journeys to match PM view behavior as requested
            const response = await journeyService.queryJourneysDto({});
            
            const filtered = (response.data || []).filter(j => j.current_step === 'project_execution');
            setActiveJourneys(filtered);
        } catch (error) {
            console.error('Failed to fetch active executions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveExecutions();
    }, []);

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Đang tải danh sách thi công..." />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 24 }}>
            <Title level={4} className="ky-thuat-page-title">Công trình đang thi công</Title>

            <List
                dataSource={activeJourneys}
                locale={{ emptyText: <Empty description="Hiện không có công trình nào đang trong giai đoạn thi công trên hệ thống." /> }}
                renderItem={item => (
                    <Card key={item._id} className="ky-card" bodyStyle={{ padding: 16 }} style={{ marginBottom: 16 }} hoverable>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-start' }}>
                            <Title level={5} style={{ margin: 0, flex: 1, paddingRight: 8 }}>{item.customer_full_name || 'Khách hàng'} - {item.request_title || 'N/A'}</Title>
                            <Tag color="processing">Thi công</Tag>
                        </div>
                        
                        <Space direction="vertical" size={2} style={{ width: '100%', marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 13 }}>Mã: {item.journey_code || item._id.slice(-8)}</Text>
                            <Text type="secondary" ellipsis style={{ fontSize: 13 }}>Địa chỉ: {item.site_address || 'N/A'}</Text>
                        </Space>

                        <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: 8, marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text type="secondary">Tiến độ hiện tại</Text>
                                <Text strong style={{ color: '#1890ff' }}>{item.progress_pct || 0}%</Text>
                            </div>
                            <div style={{ height: 6, background: '#e8e8e8', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${item.progress_pct || 0}%`, height: '100%', background: '#1890ff', transition: 'width 0.3s ease' }}></div>
                            </div>
                        </div>

                        <Button 
                            type="primary" 
                            block 
                            icon={<RocketOutlined />} 
                            onClick={() => navigate(`/ky-thuat/journeys/${item._id}`)}
                            style={{ height: 40, borderRadius: 8 }}
                        >
                            Cập nhật Nhật ký thi công <ArrowRightOutlined />
                        </Button>
                    </Card>
                )}
            />
            
            <div style={{ marginTop: 24, padding: 16, background: '#e6f7ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
                <Text style={{ fontSize: 13, color: '#0050b3' }}>
                    <strong>Ghi chú:</strong> Chỉ những hành trình đang ở bước "Thi công" mới hiển thị tại đây. Để xem các bước khác, vui lòng kiểm tra tại "Tổng quan" hoặc "Lịch trình".
                </Text>
            </div>
        </div>
    );
};

export default Execution;
