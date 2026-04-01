import React, { useState, useEffect, useMemo } from 'react';
import { 
    Button, Card, Typography, Space, Row, Col, 
    Badge, Spin, Steps, Tag, Divider, Grid, Result, Breadcrumb
} from 'antd';
import { 
    ArrowLeftOutlined, 
    PhoneOutlined, 
    EnvironmentOutlined,
    LoadingOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import { IJourney } from '@/services/core-contracts/types/journey.types';
import { JourneyStepRenderer } from '../shared/JourneySteps';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const STATUS_CONFIG = {
    sla: {
        on_time: { color: 'success', label: 'Đúng hạn' },
        at_risk: { color: 'warning', label: 'Rủi ro' },
        overdue: { color: 'error', label: 'Quá hạn' },
    },
    priority: {
        low: { color: 'default', label: 'Thấp' },
        medium: { color: 'blue', label: 'Vừa' },
        high: { color: 'orange', label: 'Cao' },
        critical: { color: 'red', label: 'Gấp' },
    }
};

const TECH_MILESTONES = [
    { title: 'Tiếp nhận', steps: ['lead_intake', 'qualification', 'survey_planning'] },
    { title: 'Khảo sát', steps: ['site_survey', 'survey_review'] },
    { title: 'Báo giá', steps: ['estimate_preparation', 'quotation_preparation', 'quotation_sent', 'quotation_approved', 'contract_signing'] },
    { title: 'Thi công', steps: ['project_execution'] },
    { title: 'Nghiệm thu', steps: ['handover_acceptance'] },
    { title: 'Hoàn tất', steps: ['warranty_aftercare'] },
];

export const JourneyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [journey, setJourney] = useState<IJourney | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchJourney = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await journeyService.findJourneyDto(id);
            setJourney(data);
        } catch (err) {
            console.error('Failed to fetch journey:', err);
            setError('Không thể tải thông tin hành trình. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJourney();
    }, [id]);

    const currentMilestoneIndex = useMemo(() => {
        if (!journey?.current_step) return 0;
        return TECH_MILESTONES.findIndex(m => m.steps.includes(journey.current_step!));
    }, [journey?.current_step]);

    const isEditable = useMemo(() => {
        if (!journey || !user?._id) return false;
        // Technical staff can edit if they are the owner or supervisor
        return journey.owner_user_id === user._id || journey.delivery_supervisor_user === user._id;
    }, [journey, user?._id]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} tip="Đang tải chi tiết..." />
            </div>
        );
    }

    if (error || !journey) {
        return (
            <Result
                status="error"
                title="Lỗi tải dữ liệu"
                subTitle={error || "Không tìm thấy thông tin hành trình này."}
                extra={<Button type="primary" onClick={() => navigate('/ky-thuat/dashboard')}>Quay về trang chủ</Button>}
            />
        );
    }

    return (
        <div style={{ padding: isMobile ? '0 12px 32px 12px' : '0 16px 32px 16px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
                <Breadcrumb.Item>
                    <a onClick={() => navigate('/ky-thuat/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
            </Breadcrumb>

            {/* Action Bar */}
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate(-1)}
                    style={{ fontSize: 16 }}
                >
                    {isMobile ? '' : 'Quay lại'}
                </Button>
                <Space>
                    <Tag color={STATUS_CONFIG.priority[journey.priority as keyof typeof STATUS_CONFIG.priority]?.color}>
                        {STATUS_CONFIG.priority[journey.priority as keyof typeof STATUS_CONFIG.priority]?.label.toUpperCase()}
                    </Tag>
                    <Tag color={STATUS_CONFIG.sla[journey.sla_status as keyof typeof STATUS_CONFIG.sla]?.color}>
                        {STATUS_CONFIG.sla[journey.sla_status as keyof typeof STATUS_CONFIG.sla]?.label}
                    </Tag>
                </Space>
            </div>

            {/* Premium Header */}
            <Card 
                bodyStyle={{ padding: 20 }} 
                style={{ 
                    marginBottom: 16, 
                    borderRadius: 12, 
                    background: 'linear-gradient(135deg, #001529 0%, #1677ff 100%)', 
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                <div>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                        Mã hành trình: <Text strong style={{ color: '#fff' }}>{journey.journey_code || journey._id.slice(-8)}</Text>
                    </Text>
                    <Title level={4} style={{ color: '#fff', margin: '8px 0 4px 0' }}>{journey.customer_full_name || 'Khách hàng'}</Title>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', fontSize: 13 }}>
                        <ThunderboltOutlined style={{ marginRight: 8, color: '#ffd666' }} /> {journey.request_title || 'Yêu cầu dịch vụ'}
                    </Text>
                </div>

                <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

                <Row gutter={16}>
                    <Col span={12}>
                        <Space direction="vertical" size={0}>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Dịch vụ</Text>
                            <Text strong style={{ color: '#fff', fontSize: 13 }}>{journey.requested_service || 'N/A'}</Text>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical" size={0}>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Giám sát</Text>
                            <Text strong style={{ color: '#fff', fontSize: 13 }}>{journey.supervisor_name || 'Chưa gán'}</Text>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Quick Actions for Mobile */}
            <Row gutter={12} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <Button 
                        block 
                        icon={<PhoneOutlined />} 
                        href={`tel:${journey.customer_phone}`}
                        style={{ height: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Gọi khách
                    </Button>
                </Col>
                <Col span={12}>
                    <Button 
                        block 
                        type="primary"
                        icon={<EnvironmentOutlined />} 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(journey.site_address || '')}`}
                        target="_blank"
                        style={{ height: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Chỉ đường
                    </Button>
                </Col>
            </Row>

            {/* Step Progress */}
            <Card style={{ marginBottom: 16, borderRadius: 12 }} bodyStyle={{ padding: '16px 12px' }}>
                <Steps
                    current={currentMilestoneIndex >= 0 ? currentMilestoneIndex : 0}
                    size="small"
                    items={TECH_MILESTONES.map(m => ({ title: m.title }))}
                />
            </Card>

            {/* Main Content Area */}
            <div style={{ minHeight: 400 }}>
                <JourneyStepRenderer 
                    stepCode={journey.current_step || 'lead_intake'} 
                    journeyId={journey._id} 
                    isEditable={isEditable} 
                    onRefresh={fetchJourney}
                />
            </div>

            {/* Site Info Summary */}
            <Card style={{ marginTop: 24, borderRadius: 12 }} bodyStyle={{ padding: 16 }}>
                <Title level={5} style={{ marginBottom: 16 }}><InfoCircleOutlined /> Thông tin công trình</Title>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Địa chỉ</Text>
                        <div style={{ fontWeight: 500 }}>{journey.site_address || 'N/A'}</div>
                    </div>
                    {journey.request_description && (
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>Ghi chú yêu cầu</Text>
                            <div style={{ fontSize: 13 }}>{journey.request_description}</div>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>Cập nhật lần cuối</Text>
                            <div style={{ fontSize: 12 }}>
                                <ClockCircleOutlined /> {journey.last_activity_at ? new Date(journey.last_activity_at).toLocaleString('vi-VN') : 'N/A'}
                            </div>
                        </div>
                        {journey.progress_pct !== undefined && (
                            <div style={{ textAlign: 'right' }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Tiến độ</Text>
                                <div style={{ fontWeight: 'bold', color: '#1677ff' }}>{journey.progress_pct}%</div>
                            </div>
                        )}
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default JourneyDetail;
