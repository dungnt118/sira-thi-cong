import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Card, Button, Progress, Typography, Avatar, Row, Col, Badge,
    List, Empty, Spin, message, Space, Statistic, Tag
} from 'antd';
import {
    UserOutlined, ClockCircleOutlined, SmileOutlined,
    InboxOutlined, WarningOutlined, NotificationOutlined,
    RightOutlined, BuildOutlined, DeploymentUnitOutlined,
    CalendarOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import { workTaskService } from '@/services/core-contracts/services/workTask.service';
import { siteReportService } from '@/services/core-contracts/services/siteReport.service';
import { customerJourneySettingService } from '@/services/core-contracts/services/customerJourneySetting.service';
import { IJourney } from '@/services/core-contracts/types/journey.types';
import { IWorkTask } from '@/services/core-contracts/types/workTask.types';
import { ISiteReport } from '@/services/core-contracts/types/siteReport.types';
import { ICustomerJourneySetting } from '@/services/core-contracts/types/customerJourneySetting.types';
import { FilterOperation } from '@/types/filters/GroupQueryFilter';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const SupervisorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [tasks, setTasks] = useState<IWorkTask[]>([]);
    const [reports, setReports] = useState<ISiteReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        if (!user?._id) return;
        
        setIsLoading(true);
        try {
            // 1. Fetch Customer Journey Setting FIRST to find GS roles
            const setting = await customerJourneySettingService.findSetting();
            
            // Determine steps where GS is involved
            const gsSteps = new Set<string>();
            const pmSteps = new Set<string>();
            
            if (setting) {
                const stepsCodes = [
                    'lead_intake', 'qualification', 'survey_planning', 'site_survey', 
                    'survey_review', 'estimate_preparation', 'quotation_preparation', 
                    'quotation_sent', 'quotation_approved', 'contract_signing', 
                    'project_execution', 'handover_acceptance', 'warranty_aftercare'
                ];
                
                stepsCodes.forEach(code => {
                    const step = (setting as any)[code];
                    if (step?.is_enabled) {
                        const roles = step.roles || [];
                        if (roles.some((r: any) => r.role === 'GS')) gsSteps.add(code);
                        if (roles.some((r: any) => r.role === 'PM' || r.role === 'QL')) pmSteps.add(code);
                    }
                });
            }

            // 2. Fetch active journeys specifically for this supervisor (Owner, GS, or PM)
            const journeyResponse = await journeyService.queryJourneysDto({
                group: {
                    op: 'AND',
                    children: [
                        {
                            id: 'project_status',
                            operation: FilterOperation.NOT_IN,
                            value: ['completed', 'cancelled'],
                            children: []
                        },
                        {
                            op: 'OR',
                            children: [
                                { id: 'supervisor_users', operation: FilterOperation.EQUAL, value: user?._id, children: [] },
                                { id: 'supervisor_users', operation: FilterOperation.EQUAL, value: user?.email, children: [] },
                                { id: 'owner_user', operation: FilterOperation.EQUAL, value: user?._id, children: [] },
                                { id: 'owner_user', operation: FilterOperation.EQUAL, value: user?.email, children: [] },
                                { id: 'pm_user', operation: FilterOperation.EQUAL, value: user?._id, children: [] },
                                { id: 'pm_user', operation: FilterOperation.EQUAL, value: user?.email, children: [] }
                            ]
                        }
                    ]
                },
                limit: 100
            });
            const filteredJourneys = journeyResponse.data || [];
            setJourneys(filteredJourneys);

            // 3. Fetch pending tasks for relevant journeys
            if (filteredJourneys.length > 0) {
                const journeyIds = filteredJourneys.map(j => j._id);
                const activeStepCodes = [...new Set(filteredJourneys.map(j => j.current_step).filter(Boolean))];
                
                // Only fetch tasks for steps that are both ACTIVE in journeys AND relevant to the user's role
                const relevantStepCodes = (activeStepCodes as string[]).filter(step => gsSteps.has(step) || pmSteps.has(step));

                const taskResponse = await workTaskService.queryWorkTasksDto({
                    group: {
                        op: 'AND',
                        children: [
                            {
                                id: 'journey_id',
                                operation: FilterOperation.IN,
                                value: journeyIds,
                                children: []
                            },
                            {
                                id: 'journey_step_code',
                                operation: FilterOperation.IN,
                                value: relevantStepCodes,
                                children: []
                            },
                            {
                                id: 'status',
                                operation: FilterOperation.EQUAL,
                                value: 'pending',
                                children: []
                            }
                        ]
                    },
                    limit: 100
                });

                const rawTasks = taskResponse.data || [];
                const relevantTasks = rawTasks.filter(task => {
                    // Find the journey this task belongs to
                    const journey = filteredJourneys.find(j => String(j._id) === String(task.journey_id));
                    if (!journey) return false;

                    // Task MUST belong to the current active step of the journey
                    const isCurrentStep = task.journey_step_code === journey.current_step;
                    if (!isCurrentStep) return false;

                    // Check if the user should see this task based on their assignment and step configuration
                    const isGSManaged = gsSteps.has(task.journey_step_code || '');
                    const isPMManaged = pmSteps.has(task.journey_step_code || '');

                    // Logic: 
                    // 1. If it's a GS step, GS should see it.
                    // 2. If the user is specifically the PM of this project, they should also see PM-relevant tasks.
                    const userIsPM = String(journey.pm_user) === String(user?._id) || String(journey.pm_user) === String(user?.email);
                    
                    return isGSManaged || (userIsPM && isPMManaged);
                });
                setTasks(relevantTasks);

                // 4. Fetch top 10 site reports for these journeys
                const reportResponse = await siteReportService.querySiteReportsDto({
                    group: {
                        id: 'journey_id',
                        operation: FilterOperation.IN,
                        value: journeyIds,
                        children: []
                    },
                    sorted: [{ id: 'createdAt', desc: true }],
                    limit: 10
                });
                setReports(reportResponse.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            message.error('Không thể tải dữ liệu dashboard');
        } finally {
            setIsLoading(false);
        }
    }, [user?._id, user?.email]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // myJourneys is now retrieved directly from fetch
    const myJourneys = journeys;

    const stats = useMemo(() => {
        return {
            inProgress: myJourneys.filter(j => j.project_status === 'active').length,
            surveys: myJourneys.filter(j => ['site_survey', 'survey_review'].includes(j.current_step || '')).length,
            urgent: myJourneys.filter(j => j.priority === 'critical' || j.priority === 'high').length,
            pendingMaterials: 0, // Placeholder
        };
    }, [myJourneys]);

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin indicator={<DeploymentUnitOutlined spin style={{ fontSize: 32, color: '#fa8c16' }} />} tip="Đang chuẩn bị bảng điều khiển..." />
            </div>
        );
    }

    return (
        <div className="supervisor-dashboard" style={{ paddingBottom: 80 }}>
            {/* Premium Header Greeting */}
            <Card
                bodyStyle={{ padding: '24px 20px' }}
                style={{
                    marginBottom: 20,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #fa8c16 0%, #ffbb96 100%)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(250, 140, 22, 0.2)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid #fff' }} />
                    <div style={{ flex: 1 }}>
                        <Title level={4} style={{ margin: 0, color: '#fff' }}>
                            Chào buổi sáng, {user?.title?.split(' ').pop() || 'Giám sát'}! <SmileOutlined />
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                            Bạn đang phụ trách {stats.inProgress} công trình đang thi công.
                        </Text>
                    </div>
                </div>
            </Card>

            {/* Quick Stats Grid */}
            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card size="small" style={{ borderRadius: 12, textAlign: 'center', borderTop: '3px solid #fa8c16' }}>
                        <Statistic title="Thi công" value={stats.inProgress} valueStyle={{ color: '#fa8c16', fontSize: 20, fontWeight: 'bold' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" style={{ borderRadius: 12, textAlign: 'center', borderTop: '3px solid #13c2c2' }}>
                        <Statistic title="Khảo sát" value={stats.surveys} valueStyle={{ color: '#13c2c2', fontSize: 20, fontWeight: 'bold' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" style={{ borderRadius: 12, textAlign: 'center', borderTop: '3px solid #ff4d4f' }}>
                        <Statistic title="Gấp/SLA" value={stats.urgent} valueStyle={{ color: '#ff4d4f', fontSize: 20, fontWeight: 'bold' }} />
                    </Card>
                </Col>
            </Row>

            {/* Action Cards */}
            <Row gutter={12} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card
                        hoverable
                        bodyStyle={{ padding: 16 }}
                        style={{ borderRadius: 12, height: '100%' }}
                        onClick={() => navigate('/gs/materials')}
                    >
                        <Space size={12}>
                            <div style={{ padding: 8, backgroundColor: '#fff7e6', borderRadius: 8 }}>
                                <InboxOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>Vật tư</div>
                                <Text type="secondary" style={{ fontSize: 11 }}>{stats.pendingMaterials} phiếu chờ</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        hoverable
                        bodyStyle={{ padding: 16 }}
                        style={{ borderRadius: 12, height: '100%' }}
                        onClick={() => navigate('/gs/incident')}
                    >
                        <Space size={12}>
                            <div style={{ padding: 8, backgroundColor: '#fff2f0', borderRadius: 8 }}>
                                <WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>Sự cố</div>
                                <Text type="secondary" style={{ fontSize: 11 }}>Báo cáo mới</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

             {/* Priority Tasks */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Title level={5} style={{ margin: 0 }}><NotificationOutlined /> Việc cần ưu tiên</Title>
                    <Button type="link" size="small" onClick={() => navigate('/gs/projects')}>
                        Xem tất cả công trình <RightOutlined style={{ fontSize: 10 }} />
                    </Button>
                </div>

                {tasks.length === 0 ? (
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Tất cả đã hoàn tất!" 
                        style={{ padding: '20px 0', background: '#fff', borderRadius: 12 }} 
                    />
                ) : (
                    tasks.map(t => {
                        const journey = journeys.find(j => j._id === t.journey_id);
                        return (
                            <Card
                                key={t._id}
                                className="gs-premium-card"
                                hoverable
                                style={{ marginBottom: 12, borderRadius: 12 }}
                                bodyStyle={{ padding: '16px' }}
                                onClick={() => navigate(`/gs/journeys/${t.journey_id}`)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <Badge status={journey?.priority === 'critical' ? 'error' : 'processing'} />
                                            <Text strong style={{ color: '#fa8c16' }}>{t.title}</Text>
                                        </div>
                                        <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
                                            Công trình: {journey?.journey_code || 'N/A'} - {journey?.customer_full_name}
                                        </Text>
                                        <Space direction="vertical" size={2}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                <CalendarOutlined /> Hạn xử lý: {t.due_time ? dayjs(t.due_time).format('DD/MM/YYYY HH:mm') : 'N/A'}
                                            </Text>
                                        </Space>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button size="small" type="primary" ghost style={{ borderRadius: 6 }}>Thực hiện</Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Recent Operations */}
            <Card
                title={<span style={{ fontSize: 14 }}><ClockCircleOutlined /> Lịch sử vận hành gần đây</span>}
                size="small"
                style={{ borderRadius: 12 }}
            >
                <List
                    size="small"
                    dataSource={reports}
                    renderItem={r => {
                        const journey = journeys.find(j => j._id === r.journey_id);
                        return (
                            <List.Item style={{ padding: '10px 0' }} onClick={() => navigate(`/gs/journeys/${r.journey_id}`)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', cursor: 'pointer' }}>
                                    <Avatar size="small" icon={<BuildOutlined />} style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text strong style={{ fontSize: 13 }}>{r.title || 'Báo cáo hiện trường'}</Text>
                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                {dayjs(r.createdAt).format('DD/MM HH:mm')}
                                            </Text>
                                        </div>
                                        <div style={{ fontSize: 11, color: '#999' }}>
                                            CT: {journey?.journey_code} - {journey?.customer_full_name} | Bởi: {r.createdBy?.title || 'GS'}
                                        </div>
                                    </div>
                                    <RightOutlined style={{ fontSize: 10, color: '#ccc' }} />
                                </div>
                            </List.Item>
                        );
                    }}
                    locale={{ emptyText: <Text type="secondary" style={{ fontSize: 12 }}>Chưa có hoạt động mới</Text> }}
                />
            </Card>
        </div>
    );
};

export default SupervisorDashboard;
