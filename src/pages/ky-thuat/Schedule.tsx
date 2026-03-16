import React, { useState } from 'react';
import { Card, Typography, List, Badge, Radio } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const Schedule: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('upcoming');

    const schedules = [
        {
            id: 'SR-2026-001',
            type: 'Khảo sát',
            customer: 'Nguyễn Văn A',
            time: '14:00',
            date: 'Hôm nay, 16/03/2026',
            address: '123 Nguyễn Thị Minh Khai, Q3',
            status: 'upcoming'
        },
        {
            id: 'PRJ-2026-005',
            type: 'Thi công',
            customer: 'Biệt thự Bác Nam (Ngày 3)',
            time: '08:00 - 17:00',
            date: 'Hôm nay, 16/03/2026',
            address: 'Khu biệt thự Thảo Điền, Q2',
            status: 'in-progress'
        },
        {
            id: 'MAINT-2026-012',
            type: 'Bảo trì',
            customer: 'Chị Lan - Chống thấm mái',
            time: '09:00 - 10:00',
            date: 'Ngày mai, 17/03/2026',
            address: '45 Lê Lợi, Q1',
            status: 'upcoming'
        },
        {
            id: 'SR-2026-008',
            type: 'Khảo sát',
            customer: 'Công ty ABC',
            time: '15:00',
            date: '15/03/2026',
            address: 'Tòa nhà Bitexco, Q1',
            status: 'completed'
        }
    ];

    const filteredSchedules = schedules.filter(s => 
        filter === 'all' ? true : 
        filter === 'upcoming' ? (s.status === 'upcoming' || s.status === 'in-progress') : 
        s.status === 'completed'
    );

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
                renderItem={item => (
                    <Card 
                        className="ky-card" 
                        size="small"
                        onClick={() => {
                            if (item.type === 'Khảo sát' && item.status !== 'completed') {
                                navigate(`/ky-thuat/survey/${item.id}`);
                            } else if (item.type === 'Thi công') {
                                navigate(`/ky-thuat/execution`);
                            }
                        }}
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
                            </div>
                        </div>
                    </Card>
                )}
            />
        </div>
    );
};

export default Schedule;
