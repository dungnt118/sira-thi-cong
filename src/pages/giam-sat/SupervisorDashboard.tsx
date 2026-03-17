import React from 'react';
import {
    Card, Button, Progress, Tag, Typography, Avatar, Row, Col, Badge, List, Empty
} from 'antd';
import {
    UserOutlined, ClockCircleOutlined, SmileOutlined,
    InboxOutlined, WarningOutlined, NotificationOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockProjects, getProjectProgress } from '../../data/mockData';

const { Title, Text } = Typography;

const MY_SUPERVISOR_ID = 'U002'; // Current supervisor mock (GS Trần Văn Tuấn)

const SupervisorDashboard: React.FC = () => {
    const navigate = useNavigate();

    const myProjects = mockProjects.filter(p => p.workerIds.includes(MY_SUPERVISOR_ID));
    const inProgress = myProjects.filter(p => p.status === 'IN_PROGRESS');
    
    // For Dashboard, we focus on URGENT or DAILY actions
    const pendingMaterialsCount = 1; // Mocked
    const activeIncidents = myProjects.flatMap(p => p.incidents).filter(i => !i.isResolved);

    return (
        <div className="supervisor-dashboard">
            {/* Header Greeting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Avatar size={48} style={{ background: '#fa8c16' }} icon={<UserOutlined />} />
                <div>
                    <Title level={4} style={{ margin: 0 }}>Xin chào, GS Tuấn! <SmileOutlined style={{ color: '#faad14' }} /></Title>
                    <Text type="secondary">Hôm nay bạn có {inProgress.length} công trình đang thi công</Text>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <Row gutter={12} style={{ marginBottom: 20 }}>
                <Col span={12}>
                    <Card 
                        size="small" 
                        style={{ background: '#fff7e6', borderColor: '#ffd591' }}
                        onClick={() => navigate('/supervisor/materials')}
                        hoverable
                    >
                        <Badge count={pendingMaterialsCount} size="small">
                            <InboxOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                        </Badge>
                        <div style={{ marginTop: 8, fontWeight: 600 }}>Vật tư chờ ký</div>
                        <Text type="secondary" style={{ fontSize: 11 }}>{pendingMaterialsCount} phiếu mới</Text>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card 
                        size="small" 
                        style={{ background: '#fff2f0', borderColor: '#ffccc7' }}
                        onClick={() => navigate('/supervisor/incident')}
                        hoverable
                    >
                        <Badge count={activeIncidents.length} size="small">
                            <WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                        </Badge>
                        <div style={{ marginTop: 8, fontWeight: 600 }}>Sự cố hiện trường</div>
                        <Text type="secondary" style={{ fontSize: 11 }}>{activeIncidents.length} case chưa xong</Text>
                    </Card>
                </Col>
            </Row>

            {/* Daily Queue / Focused Projects */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Title level={5} style={{ margin: 0 }}><NotificationOutlined /> Việc cần xử lý ngay</Title>
                    <Button type="link" size="small" onClick={() => navigate('/supervisor/projects')}>Xem tất cả</Button>
                </div>

                {inProgress.length === 0 ? (
                    <Empty description="Không có việc khẩn cấp" />
                ) : (
                    inProgress.slice(0, 3).map(p => {
                        const pct = getProjectProgress(p);
                        return (
                            <Card
                                key={p.id}
                                className="gs-card"
                                style={{ marginBottom: 12 }}
                                bodyStyle={{ padding: '12px 16px' }}
                                hoverable
                                onClick={() => navigate(`/supervisor/checklist/${p.id}`)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Text strong style={{ fontSize: 14 }}>{p.code}</Text>
                                        <div style={{ fontSize: 12, color: '#666' }}>{p.name}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Text style={{ color: '#fa8c16', fontWeight: 600 }}>{pct}%</Text>
                                        <div style={{ fontSize: 10, color: '#999' }}>Tiến độ</div>
                                    </div>
                                </div>
                                <Progress percent={pct} size="small" status="active" strokeColor="#fa8c16" style={{ marginTop: 8 }} />
                                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                    <Button size="small" type="primary" style={{ background: '#fa8c16', border: 'none' }}>Cập nhật</Button>
                                    <Button size="small" onClick={(e) => { e.stopPropagation(); navigate(`/supervisor/diary/${p.id}`); }}>Nhật ký</Button>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Recent Activities Shortcut */}
            <Card title={<span style={{ fontSize: 14 }}><ClockCircleOutlined /> Hoạt động gần đây</span>} size="small" className="gs-card">
                <List
                    size="small"
                    dataSource={[
                        { text: 'Đã cập nhật nhật ký DA-001', time: '10:30' },
                        { text: 'PM đã duyệt ảnh bước 5 DA-002', time: '09:15' },
                    ]}
                    renderItem={item => (
                        <List.Item style={{ padding: '8px 0' }}>
                            <Text style={{ fontSize: 13 }}>{item.text}</Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default SupervisorDashboard;
