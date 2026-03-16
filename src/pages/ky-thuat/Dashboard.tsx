import React from 'react';
import { Card, Typography, Space, Row, Col, Badge, Progress, List, Button } from 'antd';
import { 
    CalendarOutlined, 
    EnvironmentOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockJourneys } from '../../data/journeyMockData';

const { Title, Text } = Typography;

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const myTasks = mockJourneys.filter(j => j.owner_user_id === 'u-kt-01');

    const stats = [
        { title: 'Cần xử lý mới', value: myTasks.filter(j => ['S03_SURVEY', 'S04_SOLUTION'].includes(j.current_step_code)).length, color: '#faad14' },
        { title: 'Đang triển khai', value: myTasks.filter(j => ['S08_CONSTRUCT', 'S09_ACCEPTANCE'].includes(j.current_step_code)).length, color: '#1890ff' },
        { title: 'Bảo trì / Bảo hành', value: myTasks.filter(j => ['S11_MAINTAIN', 'S12_WARRANTY'].includes(j.current_step_code)).length, color: '#52c41a' },
    ];

    const todayTasks = myTasks.map(j => ({
        id: j.journey_code,
        type: j.current_step,
        customer: j.customer_name,
        phone: j.customer_phone,
        address: j.site_address,
        time: j.created_at.replace('T', ' '),
        status: j.project_status === 'active' ? 'in-progress' : 'pending',
        route: `/ky-thuat/journeys/${j.id}`
    }));

    return (
        <div style={{ paddingBottom: 24 }}>
            <Title level={4} className="ky-thuat-page-title">Xin chào, Kỹ thuật viên!</Title>
            
            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                {stats.map(stat => (
                    <Col span={8} key={stat.title}>
                        <Card 
                            bodyStyle={{ padding: '12px 8px', textAlign: 'center' }} 
                            className="ky-card"
                            style={{ borderTop: `3px solid ${stat.color}` }}
                        >
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: 11, color: '#8c8c8c' }}>{stat.title}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 24 }} className="ky-card">
                <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
                    Tiến độ công việc tuần
                </Text>
                <Progress percent={65} strokeColor="#13a8a8" status="active" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                    <span>Đã hoàn thành: 15</span>
                    <span>Mục tiêu: 23</span>
                </div>
            </div>

            <Title level={5} style={{ marginBottom: 16 }}>Lịch trình hôm nay</Title>
            
            <List
                itemLayout="vertical"
                dataSource={todayTasks}
                renderItem={(item) => (
                    <Card className="ky-card" bodyStyle={{ padding: 16 }} onClick={() => navigate(item.route)} hoverable>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Badge 
                                color={item.status === 'pending' ? 'orange' : 'blue'} 
                                text={<span style={{ fontWeight: 600 }}>{item.type}</span>} 
                            />
                            <Text type="secondary">{item.id}</Text>
                        </div>
                        
                        <Title level={5} style={{ margin: '0 0 8px 0' }}>{item.customer}</Title>
                        
                        <Space direction="vertical" size={2} style={{ width: '100%', marginBottom: 16 }}>
                            <Text type="secondary"><CalendarOutlined style={{ marginRight: 8 }}/> {item.time}</Text>
                            <Text type="secondary" ellipsis><EnvironmentOutlined style={{ marginRight: 8 }}/> {item.address}</Text>
                        </Space>
                        
                        <Button 
                            type="primary" 
                            block 
                            style={{ backgroundColor: item.status === 'pending' ? '#13a8a8' : '#1890ff' }}
                        >
                            Chuyển tới xử lý {item.type}
                        </Button>
                    </Card>
                )}
            />
        </div>
    );
};

export default Dashboard;
