import React from 'react';
import { Card, Typography, Space, Row, Col, Badge, Progress, List, Button } from 'antd';
import { 
    CalendarOutlined, 
    EnvironmentOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const stats = [
        { title: 'Chưa khảo sát', value: 2, color: '#faad14' },
        { title: 'Đang thi công', value: 1, color: '#1890ff' },
        { title: 'Hoàn thành', value: 15, color: '#52c41a' },
    ];

    const todayTasks = [
        {
            id: 'SR-2026-001',
            type: 'Khảo sát',
            customer: 'Nguyễn Văn A',
            phone: '0901234567',
            address: '123 Nguyễn Thị Minh Khai, Q3, TP.HCM',
            time: '14:00 - 15:30 Hôm nay',
            status: 'pending',
            route: '/ky-thuat/survey/SR-2026-001'
        },
        {
            id: 'PRJ-2026-005',
            type: 'Thi công',
            customer: 'Biệt thự Bác Nam',
            phone: '0987654321',
            address: 'Khu biệt thự Thảo Điền, Q2',
            time: '08:00 - 17:00 Hôm nay',
            status: 'in-progress',
            route: '/ky-thuat/execution'
        }
    ];

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
                            {item.status === 'pending' ? 'Bắt đầu Khảo sát' : 'Nhật ký Thi công'}
                        </Button>
                    </Card>
                )}
            />
        </div>
    );
};

export default Dashboard;
