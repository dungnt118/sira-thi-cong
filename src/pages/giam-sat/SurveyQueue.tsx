import React from 'react';
import {
    Card, Button, Tag, Typography, Space, Row, Col, Badge
} from 'antd';
import {
    CalendarOutlined, PhoneOutlined, FormOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockSurveys } from '../../data/journeyMockData';

const { Text, Title } = Typography;

const SurveyQueue: React.FC = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    const todayItems = mockSurveys.filter(s => s.scheduled_date === today && !s.submitted_at);
    const upcomingItems = mockSurveys.filter(s => s.scheduled_date && s.scheduled_date > today && !s.submitted_at);

    const renderCard = (s: typeof mockSurveys[0]) => (
        <Card
            key={s.id}
            size="small"
            style={{ marginBottom: 12, borderRadius: 10, borderLeft: '4px solid #fa8c16', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
            <Row align="middle" gutter={16}>
                <Col flex="auto">
                    <Space style={{ marginBottom: 4 }}>
                        <Tag color="orange"><CalendarOutlined /> {s.scheduled_date} {s.scheduled_time}</Tag>
                        <Tag>{s.giam_sat_user || 'Chưa phân công'}</Tag>
                    </Space>
                    <Title level={5} style={{ margin: '2px 0' }}>{s.customer_name}</Title>
                    <Space>
                        <EnvironmentOutlined style={{ color: '#fa8c16' }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>{s.site_address}</Text>
                    </Space>
                    <div style={{ marginTop: 4, fontSize: 12 }}>
                        Liên hệ: <strong>{s.contact_name}</strong> · <Text style={{ color: '#1976D2' }}>{s.contact_phone}</Text>
                    </div>
                </Col>
                <Col>
                    <Space direction="vertical" size={4}>
                        <Button
                            type="primary"
                            icon={<FormOutlined />}
                            size="small"
                            onClick={() => navigate(`/giam-sat/surveys/${s.journey_id}`)}
                        >
                            Mở Form KS
                        </Button>
                        <Button icon={<PhoneOutlined />} size="small">
                            Gọi
                        </Button>
                        <Button icon={<EnvironmentOutlined />} size="small">
                            Bản đồ
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Lịch Khảo sát</Title>
                <Text type="secondary">Danh sách khảo sát được giao cho Giám sát</Text>
            </div>

            <div>
                <div style={{ marginBottom: 12 }}>
                    <Space>
                        <Badge count={todayItems.length} style={{ background: '#fa8c16' }}>
                            <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>Hôm nay</Tag>
                        </Badge>
                    </Space>
                </div>
                {todayItems.length === 0 ? (
                    <Card style={{ borderRadius: 8, textAlign: 'center', padding: '20px', color: '#999' }}>
                        Không có khảo sát hôm nay
                    </Card>
                ) : todayItems.map(renderCard)}
            </div>

            <div style={{ marginTop: 20 }}>
                <div style={{ marginBottom: 12 }}>
                    <Space>
                        <Badge count={upcomingItems.length} style={{ background: '#1976D2' }}>
                            <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>Sắp tới</Tag>
                        </Badge>
                    </Space>
                </div>
                {upcomingItems.length === 0 ? (
                    <Card style={{ borderRadius: 8, textAlign: 'center', padding: '20px', color: '#999' }}>
                        Không có lịch sắp tới
                    </Card>
                ) : upcomingItems.map(renderCard)}
            </div>
        </div>
    );
};

export default SurveyQueue;
