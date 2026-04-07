import React from 'react';
import {
    Card, Button, Progress, Tag, Typography, Avatar, Row, Col, Badge
} from 'antd';
import {
    UserOutlined, ClockCircleOutlined, RightOutlined,
    ExclamationCircleOutlined, SmileOutlined, BuildOutlined,
    EnvironmentOutlined, PushpinOutlined, CalendarOutlined, BookOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockJourneys as defaultJourneys } from '../../data/journeyMockData';
import type { Journey } from '../../types/journey';
import { useLocalStorageData } from '../../hooks/useLocalStorageData';
import { demoDataService } from '../../services/core-graphql/localstorage/demoDataService';

const { Title, Text } = Typography;

const MY_SUPERVISOR_NAME = 'Lê Văn Giám sát'; // Current supervisor mock

const WorkerHome: React.FC = () => {
    const navigate = useNavigate();

    const [mockJourneys] = useLocalStorageData<Journey[]>(demoDataService.KEYS.JOURNEYS, defaultJourneys);

    const myProjects = mockJourneys.filter(p => p.supervisor_name === MY_SUPERVISOR_NAME);
    const inProgress = myProjects.filter(p => p.project_status === 'active');
    const scheduled = myProjects.filter(p => p.project_status === 'not_started');
    const completed = myProjects.filter(p => p.project_status === 'completed');

    return (
        <div>
            {/* Worker greeting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Avatar size={48} style={{ background: '#1976D2' }} icon={<UserOutlined />} />
                <div>
                    <Title level={4} style={{ margin: 0 }}>Xin chào, {MY_SUPERVISOR_NAME}! <SmileOutlined style={{ color: '#faad14' }} /></Title>
                    <Text type="secondary">Thứ 3, {new Date().toLocaleDateString('vi-VN')}</Text>
                </div>
            </div>

            {/* KPI Mini */}
            <Row gutter={12} style={{ marginBottom: 20 }}>
                {[
                    { label: 'Đang làm', value: inProgress.length, color: '#fa8c16' },
                    { label: 'Sắp tới', value: scheduled.length, color: '#1890ff' },
                    { label: 'Hoàn thành', value: completed.length, color: '#52c41a' },
                ].map((k, i) => (
                    <Col span={8} key={i}>
                        <Card size="small" style={{ textAlign: 'center', borderTop: `3px solid ${k.color}` }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: k.color }}>{k.value}</div>
                            <Text type="secondary" style={{ fontSize: 11 }}>{k.label}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* In Progress Projects */}
            {inProgress.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <Text strong style={{ fontSize: 14, color: '#fa8c16', marginBottom: 8, display: 'block' }}>
                        <BuildOutlined /> Đang thi công
                    </Text>
                    {inProgress.map(p => {
                        const pct = p.progress_pct || 0;
                        const currentStepName = p.current_step || 'Đang thực hiện';
                        const pendingIncidents = p.blocked_task_count || 0;

                        return (
                            <Card
                                key={p.id}
                                style={{ marginBottom: 12, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                hoverable
                                onClick={() => navigate(`/gs/checklist/${p.id}`)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Text strong style={{ fontSize: 14 }}>{p.journey_code}</Text>
                                            <Tag color="processing" style={{ fontSize: 10 }}>Đang TC</Tag>
                                            {pendingIncidents > 0 && (
                                                <Badge count={pendingIncidents} style={{ background: '#ff4d4f' }} />
                                            )}
                                        </div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{p.idx_serviceTypeId?.title}</Text>
                                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                            <EnvironmentOutlined /> {p.site_address?.split(',').slice(0, 2).join(', ')}
                                        </div>
                                    </div>
                                    <RightOutlined style={{ color: '#bbb', marginTop: 4 }} />
                                </div>

                                <div style={{ marginTop: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                        <span>Tiến độ</span>
                                        <span style={{ fontWeight: 600 }}>{pct}%</span>
                                    </div>
                                    <Progress percent={pct} status="active" showInfo={false} strokeColor="#fa8c16" />
                                </div>

                                <div style={{ marginTop: 12, padding: '8px 12px', background: '#fff7e6', borderRadius: 8, border: '1px solid #ffd591' }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fa8c16' }}>
                                        <PushpinOutlined /> Bước hiện tại
                                    </div>
                                    <div style={{ fontSize: 12, color: '#666' }}>{currentStepName}</div>
                                </div>

                                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/gs/checklist/${p.id}`); }}
                                    >
                                        Tiếp tục thi công →
                                    </Button>
                                    <Button
                                        icon={<BookOutlined />}
                                        size="large"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/gs/diary/${p.id}`); }}
                                    >
                                        Nhật ký
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Scheduled Projects */}
            {scheduled.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <Text strong style={{ fontSize: 14, color: '#1890ff', marginBottom: 8, display: 'block' }}>
                        <CalendarOutlined /> Sắp tới
                    </Text>
                    {scheduled.map(p => (
                        <Card
                            key={p.id}
                            size="small"
                            style={{ marginBottom: 8, borderRadius: 10 }}
                            hoverable
                            onClick={() => navigate(`/gs/checklist/${p.id}`)}
                        >
                            <Row justify="space-between" align="middle">
                                <Col flex="auto">
                                    <Text strong style={{ fontSize: 13 }}>{p.journey_code}</Text>
                                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                                        {p.idx_serviceTypeId?.title}
                                    </Text>
                                </Col>
                                <Col>
                                    <Tag color="blue" style={{ fontSize: 11 }}>
                                        <ClockCircleOutlined /> {p.plan_start}
                                    </Tag>
                                </Col>
                                <Col><RightOutlined style={{ color: '#bbb' }} /></Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            )}

            {/* Quick Action: Incident Report */}
            <div style={{
                position: 'fixed', bottom: 76, right: 16, zIndex: 200,
            }}>
                <Button
                    type="primary"
                    danger
                    shape="circle"
                    size="large"
                    icon={<ExclamationCircleOutlined />}
                    style={{ width: 52, height: 52, fontSize: 22, boxShadow: '0 4px 14px rgba(255,77,79,0.4)' }}
                    onClick={() => navigate('/gs/incident')}
                />
            </div>
        </div>
    );
};

export default WorkerHome;
