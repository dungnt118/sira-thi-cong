import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    Col,
    Empty,
    Input,
    message,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Statistic,
    Tag,
    Typography,
    Grid,
    Modal,
    notification,
} from 'antd';
import {
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    FilterOutlined,
    HistoryOutlined,
    PhoneOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { customerService } from '../../../services/core-contracts/services/customer.service';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { pipelineStageService } from '../../../services/core-contracts/services/pipelineStage.service';
import { salesPipelineService } from '../../../services/core-contracts/services/salesPipeline.service';
import type { ICustomer } from '../../../services/core-contracts/types/customer.types';
import type { IJourney, ICreateJourneyInput } from '../../../services/core-contracts/types/journey.types';
import type { IPipelineStage } from '../../../services/core-contracts/types/pipelineStage.types';
import type { ISalesPipeline } from '../../../services/core-contracts/types/salesPipeline.types';
import JourneyUpsertDrawer from '../../../components/journey/JourneyUpsertDrawer';
import SectionHeader from '../../../components/common/SectionHeader';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';
import {
    formatJourneyDate,
    getJourneyPriorityLabel,
    getJourneySlaLabel,
    getJourneyStepLabel,
    getOptionLabel,
    JOURNEY_EMPTY_VALUE,
    JOURNEY_PRIORITY_META,
    JOURNEY_SLA_META,
    JOURNEY_SLA_OPTIONS,
    JOURNEY_SOURCE_CHANNEL_OPTIONS,
    JOURNEY_STEP_META,
    JOURNEY_STEP_OPTIONS,
} from './journeySaleMeta';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const SALE_MANAGED_STEPS = [
    'lead_new',
    'consult_contact',
    'quotation',
    'contract',
    'after_sales',
];


const JourneyInbox: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [pipelines, setPipelines] = useState<ISalesPipeline[]>([]);
    const [stages, setStages] = useState<IPipelineStage[]>([]);
    const [keyword, setKeyword] = useState('');
    const [filterSla, setFilterSla] = useState<string | undefined>();
    const [filterStep, setFilterStep] = useState<string | undefined>();
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState<IJourney | null>(null);
    const [prefillValues, setPrefillValues] = useState<Partial<ICreateJourneyInput>>();
    const [showLogModal, setShowLogModal] = useState(false);
    const [journeyForLog, setJourneyForLog] = useState<IJourney | null>(null);

    const loadData = async () => {
        setLoading(true);

        try {
            const [journeyRes, customerRes, pipelineRes, stageRes] = await Promise.all([
                journeyService.queryContent(),
                customerService.queryContent(),
                salesPipelineService.queryContent(),
                pipelineStageService.queryContent(),
            ]);

            setJourneys(journeyRes?.data || []);
            setCustomers(customerRes?.data || []);
            setPipelines(pipelineRes?.data || []);
            setStages(stageRes?.data || []);
        } catch (error) {
            console.error('Không thể tải dữ liệu yêu cầu', error);
            message.error('Không thể tải dữ liệu yêu cầu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const resolveCustomer = (journey: IJourney) =>
        customers.find((customer) => customer._id === journey.customer_id);

    const resolveCustomerName = (journey: IJourney) =>
        journey.idx_customer_id?.primary_text ||
        resolveCustomer(journey)?.full_name ||
        JOURNEY_EMPTY_VALUE;

    const resolveCustomerPhone = (journey: IJourney) =>
        journey.customer_phone ||
        journey.idx_customer_id?.secondary_text ||
        resolveCustomer(journey)?.phone ||
        JOURNEY_EMPTY_VALUE;

    const resolveCustomerAddress = (journey: IJourney) =>
        journey.site_address ||
        journey.customer_address ||
        resolveCustomer(journey)?.address ||
        JOURNEY_EMPTY_VALUE;

    const resolvePipelineName = (journey: IJourney) =>
        journey.idx_sales_pipeline_id?.primary_text ||
        pipelines.find((pipeline) => pipeline._id === journey.sales_pipeline_id)?.name ||
        JOURNEY_EMPTY_VALUE;

    const resolveStageName = (journey: IJourney) =>
        journey.idx_sales_stage_id?.primary_text ||
        stages.find((stage) => stage._id === journey.sales_stage_id)?.name ||
        JOURNEY_EMPTY_VALUE;

    const filteredJourneys = journeys.filter((journey) => {
        const haystacks = [
            journey.journey_code,
            journey.request_title,
            journey.request_description,
            journey.idx_serviceTypeId?.title,
            resolveCustomerName(journey),
            resolveCustomerPhone(journey),
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        const matchesKeyword = !keyword || haystacks.includes(keyword.toLowerCase());
        const matchesSla = !filterSla || journey.sla_status === filterSla;
        
        // Match step with fallback for null/empty to 'lead_new'
        const matchesStep = !filterStep || 
            (filterStep === 'lead_new' ? (!journey.current_step || journey.current_step === 'lead_new') : journey.current_step === filterStep);

        return matchesKeyword && matchesSla && matchesStep;
    });

    const stats = {
        total: journeys.length,
        overdue: journeys.filter((journey) => journey.sla_status === 'overdue').length,
        atRisk: journeys.filter((journey) => journey.sla_status === 'at_risk').length,
        waitingSurvey: journeys.filter(
            (journey) => journey.survey_status === 'not_started' || journey.survey_status === 'scheduled',
        ).length,
    };

    const openCreateDrawer = () => {
        setDrawerMode('create');
        setSelectedJourney(null);
        setPrefillValues(undefined);
        setDrawerOpen(true);
    };

    const openEditDrawer = (journey: IJourney, event?: React.MouseEvent<HTMLElement>) => {
        event?.stopPropagation();
        setDrawerMode('edit');
        setSelectedJourney(journey);
        setPrefillValues(undefined);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedJourney(null);
        setPrefillValues(undefined);
    };

    const clearCustomerDraftQuery = () => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('customerId');
        setSearchParams(nextParams);
    };

    useEffect(() => {
        const customerId = searchParams.get('customerId');

        if (!customerId || loading || drawerOpen || customers.length === 0) {
            return;
        }

        const customer = customers.find((item) => item._id === customerId);
        if (!customer) {
            clearCustomerDraftQuery();
            return;
        }

        setDrawerMode('create');
        setSelectedJourney(null);
        setPrefillValues({
            customer_id: customer._id,
            customer_phone: customer.phone,
            customer_email: customer.email,
            site_address: [customer.address, customer.ward, customer.city, customer.province]
                .filter(Boolean)
                .join(', '),
        });
        setDrawerOpen(true);
        clearCustomerDraftQuery();
    }, [customers, drawerOpen, loading, searchParams, setSearchParams]);

    const handleSubmit = async (payload: ICreateJourneyInput) => {
        setSaving(true);

        try {
            if (drawerMode === 'create') {
                await journeyService.createJourney(payload);
                message.success('Đã tạo yêu cầu mới.');
            } else if (selectedJourney?._id) {
                await journeyService.updateJourney(selectedJourney._id, payload);
                message.success('Đã cập nhật yêu cầu.');
            }

            closeDrawer();
            await loadData();
        } catch (error) {
            console.error('Không thể lưu yêu cầu dịch vụ', error);
            message.error('Không thể lưu yêu cầu dịch vụ.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (journey: IJourney, event?: React.MouseEvent<HTMLElement>) => {
        event?.stopPropagation();

        try {
            await journeyService.deleteJourney(journey._id);
            message.success(`Đã xóa ${journey.journey_code || 'yêu cầu'}.`);
            await loadData();
        } catch (error) {
            console.error('Không thể xóa Journey', error);
            message.error('Không thể xóa yêu cầu.');
        }
    };

    return (
        <div style={{ paddingBottom: 32 }}>
            <SectionHeader
                contentBleedPx={8}
                title="Yêu cầu"
                breadcrumb="Hệ thống quản lý bán hàng"
                description="Quản lý toàn bộ lead, nhu cầu khách hàng và trạng thái bán hàng trực tiếp trên Journey."
                actions={
                    <>
                        <Button 
                            icon={<ReloadOutlined />} 
                            onClick={loadData}
                            size={isMobile ? 'middle' : 'small'}
                        >
                            {!isMobile && 'Làm mới'}
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={openCreateDrawer}
                            size={isMobile ? 'middle' : 'small'}
                        >
                            {!isMobile ? 'Tạo yêu cầu' : 'Tạo'}
                        </Button>
                    </>
                }
            />

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} lg={6}>
                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 0 }}
                        styles={{ body: { paddingTop: 24, paddingLeft: 24, textAlign: 'center' } }}
                    >
                        <Statistic title="Tổng công trình" value={stats.total} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 0 }}
                        styles={{ body: { paddingTop: 24, paddingLeft: 24, textAlign: 'center' } }}
                    >
                        <Statistic
                            title="Trễ hạn"
                            value={stats.overdue}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 0 }}
                        styles={{ body: { paddingTop: 24, paddingLeft: 24, textAlign: 'center' } }}
                    >
                        <Statistic title="Có rủi ro" value={stats.atRisk} valueStyle={{ color: '#d48806' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 0 }}
                        styles={{ body: { paddingTop: 24, paddingLeft: 24, textAlign: 'center' } }}
                    >
                        <Statistic title="Chờ khảo sát" value={stats.waitingSurvey} valueStyle={{ color: '#1677ff' }} />
                    </Card>
                </Col>
            </Row>

            <Card
                variant="borderless"
                style={{ borderRadius: 20, marginBottom: 24 }}
                styles={{ body: { paddingBottom: 8 } }}
            >
                <Row gutter={[16, 16]} align="middle">
                    <Col flex="auto">
                        <Input
                            allowClear
                            size="large"
                            placeholder="Tìm theo mã, khách hàng, số điện thoại, nội dung yêu cầu..."
                            prefix={<SearchOutlined />}
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                        />
                    </Col>
                    <Col flex="none">
                        <Button
                            size="large"
                            icon={<FilterOutlined />}
                            type={showAdvancedFilters ? 'primary' : 'default'}
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        >
                            {isMobile ? '' : 'Bộ lọc'}
                        </Button>
                    </Col>
                </Row>
                
                {showAdvancedFilters && (
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} lg={12}>
                            <Select
                                allowClear
                                size="large"
                                style={{ width: '100%' }}
                                placeholder="Trạng thái SLA"
                                options={JOURNEY_SLA_OPTIONS}
                                value={filterSla}
                                onChange={setFilterSla}
                            />
                        </Col>
                        <Col xs={24} lg={12}>
                            <Select
                                allowClear
                                size="large"
                                style={{ width: '100%' }}
                                placeholder="Bước hiện tại"
                                options={JOURNEY_STEP_OPTIONS}
                                value={filterStep}
                                onChange={setFilterStep}
                            />
                        </Col>
                    </Row>
                )}

                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="link"
                        onClick={() => {
                            setKeyword('');
                            setFilterSla(undefined);
                            setFilterStep(undefined);
                        }}
                    >
                        Xóa bộ lọc
                    </Button>
                </div>
            </Card>

            <Spin spinning={loading}>
                {filteredJourneys.length === 0 ? (
                    <Card variant="borderless" style={{ borderRadius: 20, textAlign: 'center', padding: '48px 0' }}>
                        <Empty
                            description="Không có yêu cầu phù hợp với bộ lọc hiện tại."
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                        <Button type="primary" onClick={openCreateDrawer}>
                            Tạo yêu cầu đầu tiên
                        </Button>
                    </Card>
                ) : (
                    <Row gutter={[16, 16]}>
                        {filteredJourneys.map((journey) => {
                            const slaMeta = JOURNEY_SLA_META[journey.sla_status || ''] || {
                                label: getJourneySlaLabel(journey.sla_status),
                                color: '#8c8c8c',
                                background: '#fafafa',
                            };
                            const priorityMeta = JOURNEY_PRIORITY_META[journey.priority || ''] || {
                                label: getJourneyPriorityLabel(journey.priority),
                                color: '#8c8c8c',
                            };
                            
                            // Fallback to lead_new if current_step is null/empty
                            const effectiveStep = journey.current_step || 'lead_new';
                            const stepMeta = JOURNEY_STEP_META[effectiveStep] || {
                                label: getJourneyStepLabel(effectiveStep),
                                color: '#8c8c8c',
                            };

                            return (
                                <Col key={journey._id} xs={24}>
                                    <Card
                                        hoverable
                                        variant="borderless"
                                        onClick={() => navigate(`/admin/kd/journeys/${journey._id}`)}
                                        style={{ borderRadius: 20 }}
                                        styles={{ body: { padding: isMobile ? 40 : 24 } }}
                                    >
                                        <Row gutter={[16, 16]} align="top">
                                            <Col xs={24} lg={16}>
                                                {/* Header Row: Code, Tags and Actions */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    <Space size={[8, 8]} wrap>
                                                        <Text strong style={{ color: '#1677ff', fontSize: 16 }}>
                                                            {journey.journey_code}
                                                        </Text>
                                                        <Tag color={stepMeta.color}>{stepMeta.label}</Tag>
                                                        <Tag
                                                            style={{
                                                                color: slaMeta.color,
                                                                background: slaMeta.background,
                                                                border: `1px solid ${slaMeta.color}22`,
                                                            }}
                                                        >
                                                            {slaMeta.label}
                                                        </Tag>
                                                        <Tag color={priorityMeta.color}>{priorityMeta.label}</Tag>
                                                        {journey.sales_pipeline_id && (
                                                            <Tag>{resolvePipelineName(journey)}</Tag>
                                                        )}
                                                        {journey.sales_stage_id && (
                                                            <Tag>{resolveStageName(journey)}</Tag>
                                                        )}
                                                    </Space>

                                                    {SALE_MANAGED_STEPS.includes(effectiveStep) && (
                                                        <Button
                                                            type="primary"
                                                            size="small"
                                                            icon={<HistoryOutlined />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setJourneyForLog(journey);
                                                                setShowLogModal(true);
                                                            }}
                                                            style={{
                                                                borderRadius: 6,
                                                                boxShadow: '0 2px 4px rgba(22, 119, 255, 0.2)',
                                                            }}
                                                        >
                                                            Ghi log
                                                        </Button>
                                                    )}
                                                </div>

                                                <Title 
                                                    level={4} 
                                                    style={{ margin: '0 0 4px', color: '#262626' }}
                                                    ellipsis={{ tooltip: journey.request_title }}
                                                >
                                                    {journey.request_title || 'Yêu cầu không có tiêu đề'}
                                                </Title>

                                                <Text
                                                    type="secondary"
                                                    ellipsis={{ tooltip: journey.request_description || journey.idx_serviceTypeId?.title }}
                                                    style={{ display: 'block', fontSize: 14, marginBottom: 8 }}
                                                >
                                                    {journey.request_description ||
                                                        journey.idx_serviceTypeId?.title ||
                                                        'Chưa có mô tả chi tiết.'}
                                                </Text>

                                                <Space size={[20, 10]} wrap>
                                                    {/* Customer Info Group */}
                                                    <Space size={6}>
                                                        <UserOutlined style={{ color: '#8c8c8c' }} />
                                                        <Text strong style={{ fontSize: 14 }}>
                                                            {resolveCustomerName(journey)}
                                                        </Text>
                                                    </Space>

                                                    <a
                                                        href={`tel:${resolveCustomerPhone(journey)}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 6,
                                                            color: '#1677ff',
                                                        }}
                                                    >
                                                        <PhoneOutlined />
                                                        <Text strong style={{ color: 'inherit' }}>
                                                            {resolveCustomerPhone(journey)}
                                                        </Text>
                                                    </a>

                                                    <Space size={6}>
                                                        <Text type="secondary" style={{ fontSize: 13 }}>
                                                            Sale: {journey.sale_users || JOURNEY_EMPTY_VALUE}
                                                        </Text>
                                                    </Space>

                                                    <Space size={6}>
                                                        <ClockCircleOutlined style={{ color: '#bfbfbf', fontSize: 12 }} />
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {formatJourneyDate(journey.last_activity_at, true)}
                                                        </Text>
                                                    </Space>

                                                    <Tag color="cyan" style={{ margin: 0 }}>
                                                        {getOptionLabel(JOURNEY_SOURCE_CHANNEL_OPTIONS, journey.source_channel)}
                                                    </Tag>
                                                </Space>

                                                {resolveCustomerAddress(journey) !== JOURNEY_EMPTY_VALUE && (
                                                    <div 
                                                        style={{ 
                                                            marginTop: 8, 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            overflow: 'hidden' 
                                                        }}
                                                    >
                                                        <EnvironmentOutlined style={{ marginRight: 6, color: '#8c8c8c', flexShrink: 0 }} />
                                                        <a
                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resolveCustomerAddress(journey))}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{ 
                                                                fontSize: 13, 
                                                                color: '#595959', 
                                                                textDecoration: 'underline',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {resolveCustomerAddress(journey)}{' '}
                                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                                (Bản đồ)
                                                            </Text>
                                                        </a>
                                                    </div>
                                                )}
                                            </Col>

                                            {!isMobile && (
                                                <Col xs={24} lg={8}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 12,
                                                            alignItems: 'stretch',
                                                        }}
                                                    >
                                                        <Space wrap style={{ justifyContent: 'flex-end' }}>
                                                            <Button
                                                                icon={<EyeOutlined />}
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    navigate(`/admin/kd/journeys/${journey._id}`);
                                                                }}
                                                            >
                                                                Mở hồ sơ
                                                            </Button>
                                                            <Button
                                                                icon={<EditOutlined />}
                                                                onClick={(event) => openEditDrawer(journey, event)}
                                                            >
                                                                Sửa
                                                            </Button>
                                                            <Popconfirm
                                                                title="Xóa yêu cầu"
                                                                description="Thao tác này sẽ xóa trực tiếp Journey hiện tại."
                                                                okText="Xóa"
                                                                cancelText="Hủy"
                                                                okButtonProps={{ danger: true }}
                                                                onConfirm={(event) => handleDelete(journey, event as any)}
                                                                onPopupClick={(event) => event.stopPropagation()}
                                                            >
                                                                <Button
                                                                    danger
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={(event) => event.stopPropagation()}
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </Popconfirm>
                                                        </Space>
                                                    </div>
                                                </Col>
                                            )}
                                        </Row>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Spin>

            <JourneyUpsertDrawer
                open={drawerOpen}
                mode="sale"
                journey={selectedJourney}
                initialValues={prefillValues}
                saving={saving}
                currentUsername={user?.username || undefined}
                onCancel={closeDrawer}
                onSubmit={handleSubmit}
            />

            <Modal
                title={
                    <div style={{ paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                        <Title level={4} style={{ margin: 0 }}>
                            Ghi log tư vấn
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Khách hàng: {journeyForLog ? resolveCustomerName(journeyForLog) : 'Khách hàng ẩn'}
                        </Text>
                    </div>
                }
                open={showLogModal}
                onCancel={() => setShowLogModal(false)}
                footer={null}
                width={600}
                centered
                style={{ borderRadius: 12 }}
            >
                <div style={{ paddingTop: 16 }}>
                    <ConsultationLogForm
                        onSubmit={() => {
                            notification.success({
                                message: 'Thành công',
                                description: 'Đã lưu log tư vấn.',
                            });
                            setShowLogModal(false);
                            loadData();
                        }}
                        onCancel={() => setShowLogModal(false)}
                    />
                </div>
            </Modal>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Typography.Text type="secondary">
                    &copy; {new Date().getFullYear()} SIRA. All rights reserved.
                </Typography.Text>
            </div>
        </div>
    );
};

export default JourneyInbox;
