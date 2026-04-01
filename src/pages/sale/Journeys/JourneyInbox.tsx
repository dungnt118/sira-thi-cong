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
} from 'antd';
import {
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
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
import JourneyUpsertDrawer from './components/JourneyUpsertDrawer';
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

const JourneyInbox: React.FC = () => {
    const navigate = useNavigate();
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
    const [filterPipeline, setFilterPipeline] = useState<string | undefined>();
    const [filterStage, setFilterStage] = useState<string | undefined>();
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState<IJourney | null>(null);
    const [prefillValues, setPrefillValues] = useState<Partial<ICreateJourneyInput>>();

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
            journey.requested_service,
            resolveCustomerName(journey),
            resolveCustomerPhone(journey),
            resolvePipelineName(journey),
            resolveStageName(journey),
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        const matchesKeyword = !keyword || haystacks.includes(keyword.toLowerCase());
        const matchesSla = !filterSla || journey.sla_status === filterSla;
        const matchesStep = !filterStep || journey.current_step === filterStep;
        const matchesPipeline = !filterPipeline || journey.sales_pipeline_id === filterPipeline;
        const matchesStage = !filterStage || journey.sales_stage_id === filterStage;

        return matchesKeyword && matchesSla && matchesStep && matchesPipeline && matchesStage;
    });

    const stageFilterOptions = stages
        .filter((stage) => !filterPipeline || stage.pipeline_id === filterPipeline)
        .sort((left, right) => (left.order || 0) - (right.order || 0))
        .map((stage) => ({
            value: stage._id,
            label: stage.name || 'Không tên',
        }));

    const pipelineOptions = pipelines
        .slice()
        .sort((left, right) => (left.name || '').localeCompare(right.name || '', 'vi'))
        .map((pipeline) => ({
            value: pipeline._id,
            label: pipeline.name || 'Không tên',
        }));

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
            site_address: [customer.address, customer.ward, customer.district, customer.province]
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
            <Row justify="space-between" align="bottom" gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Hệ thống quản lý bán hàng
                    </Text>
                    <Title level={2} style={{ margin: '4px 0 8px' }}>
                        Yêu cầu
                    </Title>
                    <Text type="secondary">
                        Quản lý toàn bộ lead, nhu cầu khách hàng và trạng thái bán hàng trực tiếp trên Journey.
                    </Text>
                </Col>
                <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                    <Space wrap>
                        <Button icon={<ReloadOutlined />} onClick={loadData}>
                            Làm mới
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>
                            Tạo yêu cầu
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 18 }}>
                        <Statistic title="Tổng hành trình" value={stats.total} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 18 }}>
                        <Statistic
                            title="Trễ hạn"
                            value={stats.overdue}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 18 }}>
                        <Statistic title="Có rủi ro" value={stats.atRisk} valueStyle={{ color: '#d48806' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 18 }}>
                        <Statistic title="Chờ khảo sát" value={stats.waitingSurvey} valueStyle={{ color: '#1677ff' }} />
                    </Card>
                </Col>
            </Row>

            <Card
                bordered={false}
                style={{ borderRadius: 20, marginBottom: 24 }}
                bodyStyle={{ paddingBottom: 8 }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8}>
                        <Input
                            allowClear
                            size="large"
                            placeholder="Tìm theo mã, khách hàng, số điện thoại, nội dung yêu cầu..."
                            prefix={<SearchOutlined />}
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                        />
                    </Col>
                    <Col xs={12} lg={4}>
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
                    <Col xs={12} lg={4}>
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
                    <Col xs={12} lg={4}>
                        <Select
                            allowClear
                            size="large"
                            style={{ width: '100%' }}
                            placeholder="Quy trình bán hàng"
                            options={pipelineOptions}
                            value={filterPipeline}
                            onChange={(value) => {
                                setFilterPipeline(value);
                                setFilterStage(undefined);
                            }}
                        />
                    </Col>
                    <Col xs={12} lg={4}>
                        <Select
                            allowClear
                            size="large"
                            style={{ width: '100%' }}
                            placeholder="Giai đoạn bán hàng"
                            options={stageFilterOptions}
                            value={filterStage}
                            onChange={setFilterStage}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="link"
                        onClick={() => {
                            setKeyword('');
                            setFilterSla(undefined);
                            setFilterStep(undefined);
                            setFilterPipeline(undefined);
                            setFilterStage(undefined);
                        }}
                    >
                        Xóa bộ lọc
                    </Button>
                </div>
            </Card>

            <Spin spinning={loading}>
                {filteredJourneys.length === 0 ? (
                    <Card bordered={false} style={{ borderRadius: 20, textAlign: 'center', padding: '48px 0' }}>
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
                            const stepMeta = JOURNEY_STEP_META[journey.current_step || ''] || {
                                label: getJourneyStepLabel(journey.current_step),
                                color: '#8c8c8c',
                            };

                            return (
                                <Col xs={24} key={journey._id}>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        onClick={() => navigate(`/sale/dashboard/${journey._id}`)}
                                        style={{ borderRadius: 20 }}
                                        bodyStyle={{ padding: 24 }}
                                    >
                                        <Row gutter={[16, 16]} align="middle">
                                            <Col xs={24} lg={16}>
                                                <Space size={[8, 8]} wrap style={{ marginBottom: 12 }}>
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

                                                <Title level={4} style={{ margin: '0 0 6px' }}>
                                                    {resolveCustomerName(journey)}
                                                </Title>
                                                <Text style={{ fontSize: 15, display: 'block', marginBottom: 10 }}>
                                                    {journey.request_title || JOURNEY_EMPTY_VALUE}
                                                </Text>
                                                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                                                    {journey.request_description || journey.requested_service || 'Chưa có mô tả chi tiết.'}
                                                </Text>

                                                <Space size={[20, 10]} wrap>
                                                    <Space size={6}>
                                                        <PhoneOutlined />
                                                        <Text type="secondary">{resolveCustomerPhone(journey)}</Text>
                                                    </Space>
                                                    <Space size={6}>
                                                        <UserOutlined />
                                                        <Text type="secondary">
                                                            Sale: {journey.sales_owner_user || JOURNEY_EMPTY_VALUE}
                                                        </Text>
                                                    </Space>
                                                    <Space size={6}>
                                                        <ClockCircleOutlined />
                                                        <Text type="secondary">
                                                            Cập nhật: {formatJourneyDate(journey.last_activity_at, true)}
                                                        </Text>
                                                    </Space>
                                                </Space>
                                            </Col>

                                            <Col xs={24} lg={8}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 12,
                                                        alignItems: 'stretch',
                                                    }}
                                                >
                                                    <Card
                                                        size="small"
                                                        style={{
                                                            borderRadius: 16,
                                                            background: '#fafafa',
                                                            border: '1px solid #f0f0f0',
                                                        }}
                                                    >
                                                        <Space align="start">
                                                            <Avatar icon={<UserOutlined />} />
                                                            <div>
                                                                <Text type="secondary" style={{ display: 'block' }}>
                                                                    Chủ sở hữu
                                                                </Text>
                                                                <Text strong>
                                                                    {journey.owner_user_id || JOURNEY_EMPTY_VALUE}
                                                                </Text>
                                                            </div>
                                                        </Space>
                                                        <div style={{ marginTop: 12 }}>
                                                            <Text type="secondary" style={{ display: 'block' }}>
                                                                Kênh tiếp nhận
                                                            </Text>
                                                            <Text strong>
                                                                {getOptionLabel(
                                                                    JOURNEY_SOURCE_CHANNEL_OPTIONS,
                                                                    journey.source_channel,
                                                                )}
                                                            </Text>
                                                        </div>
                                                    </Card>

                                                    <Space wrap style={{ justifyContent: 'flex-end' }}>
                                                        <Button
                                                            icon={<EyeOutlined />}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                navigate(`/sale/dashboard/${journey._id}`);
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
                mode={drawerMode}
                journey={selectedJourney}
                initialValues={prefillValues}
                customers={customers}
                pipelines={pipelines}
                stages={stages}
                saving={saving}
                currentUsername={user?.username || undefined}
                onCancel={closeDrawer}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default JourneyInbox;
