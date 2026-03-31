import React, { useState, useEffect, useMemo } from 'react';
import {
    Table, Card, Button, Tag, Input, Select, Space, Row, Col,
    Statistic, Badge, Avatar, Typography, Tooltip, Grid, Empty, Drawer
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined, AppstoreOutlined, UnorderedListOutlined,
    AlertOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
    MessageOutlined, ReloadOutlined, UserOutlined, FilterOutlined,
    StopOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { search_indexed_content } from '@/store/actions/schemas/schemas.action';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'default' },
    medium: { label: 'Trung bình', color: 'blue' },
    high: { label: 'Cao', color: 'orange' },
    critical: { label: 'Khẩn cấp', color: 'red' },
};

const SLA_CONFIG: Record<string, { label: string; color: string }> = {
    on_time: { label: 'Đúng hạn', color: 'success' },
    at_risk: { label: 'Có rủi ro', color: 'warning' },
    overdue: { label: 'Quá hạn', color: 'error' },
};

const JOURNEY_STEPS_CONFIG = [
    { key: 'lead_intake', label: 'Tiếp nhận', color: 'cyan' },
    { key: 'qualification', label: 'Thẩm định', color: 'blue' },
    { key: 'survey_planning', label: 'Lập lịch KS', color: 'geekblue' },
    { key: 'site_survey', label: 'Khảo sát', color: 'purple' },
    { key: 'survey_review', label: 'Duyệt KS', color: 'magenta' },
    { key: 'estimate_preparation', label: 'Lập dự toán', color: 'gold' },
    { key: 'quotation_preparation', label: 'Lập báo giá', color: 'orange' },
    { key: 'quotation_sent', label: 'Gửi báo giá', color: 'volcano' },
    { key: 'quotation_approved', label: 'Duyệt báo giá', color: 'green' },
    { key: 'contract_signing', label: 'Ký kết', color: 'lime' },
    { key: 'project_execution', label: 'Thi công', color: 'processing' },
    { key: 'handover_acceptance', label: 'Nghiệm thu', color: 'success' },
    { key: 'warranty_aftercare', label: 'Bảo hành', color: 'default' },
];

const JourneyList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [filterSla, setFilterSla] = useState<string>('ALL');
    const [filterPriority, setFilterPriority] = useState<string>('ALL');
    const [filterStep, setFilterStep] = useState<string>('ALL');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // Fetch journeys from live backend
    const fetchJourneys = async () => {
        setIsLoading(true);
        try {
            const res = await dispatch(search_indexed_content({
                schemas: ['Journey'],
                key: keyword,
                limit: 100
            }));
            
            if (res.code === 0 && res.data) {
                // Map indexed content to IJourney structure if needed, 
                // but usually search_indexed_content returns available fields directly
                setJourneys(res.data as any);
            }
        } catch (error) {
            console.error('Failed to fetch journeys:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJourneys();
    }, [keyword]); // Refetch on keyword change (can debounced later if needed)

    const handleRefresh = () => {
        fetchJourneys();
    };



    const filtered = useMemo(() => {
        return journeys.filter(j => {
            const matchSla = filterSla === 'ALL' || j.sla_status === filterSla;
            const matchPriority = filterPriority === 'ALL' || j.priority === filterPriority;
            const matchStep = filterStep === 'ALL' || j.current_step === filterStep;
            return matchSla && matchPriority && matchStep;
        });
    }, [journeys, filterSla, filterPriority, filterStep]);

    const kpis = useMemo(() => ({
        total_open: filtered.length,
        overdue_sla: filtered.filter(j => j.sla_status === 'overdue').length,
        blocked: filtered.filter(j => (j.blocked_task_count || 0) > 0).length,
        unread_threads: filtered.reduce((acc, j) => acc + (j.unread_thread_count || 0), 0),
    }), [filtered]);

    const columns: ColumnsType<IJourney> = [
        {
            title: 'Hành trình',
            key: 'journey',
            render: (_, j) => (
                <div>
                    <div
                        style={{ fontWeight: 600, color: '#1976D2', cursor: 'pointer', marginBottom: 2 }}
                        onClick={() => navigate(`/pm/journeys/${j._id}`)}
                    >
                        {j.journey_code || 'N/A'}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{j.idx_customer_id?.title || 'Khách hàng ẩn danh'}</Text>
                </div>
            ),
        },
        {
            title: 'Yêu cầu / Dịch vụ',
            key: 'request',
            render: (_, j) => (
                <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{j.request_title}</div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{j.requested_service}</Text>
                </div>
            ),
        },
        {
            title: 'Bước hiện tại',
            key: 'step',
            render: (_, j) => {
                const config = JOURNEY_STEPS_CONFIG.find(c => c.key === j.current_step);
                return (
                    <Tag color={config?.color || 'default'}>
                        {config?.label || j.current_step || 'Khởi tạo'}
                    </Tag>
                );
            },
        },
        {
            title: 'Phụ trách',
            key: 'owner',
            render: (_, j) => (
                <Space>
                    <Avatar size={22} style={{ background: '#52c41a' }} icon={<UserOutlined />} />
                    <Text style={{ fontSize: 12 }}>{j.supervisor_name || 'Chưa gán'}</Text>
                </Space>
            ),
        },
        {
            title: 'SLA',
            key: 'sla',
            render: (_, j) => {
                const s = SLA_CONFIG[j.sla_status || 'on_time'];
                return <Badge status={s.color as any} text={s.label} />;
            },
        },
        {
            title: 'Ưu tiên',
            key: 'priority',
            render: (_, j) => {
                const p = PRIORITY_CONFIG[j.priority || 'low'];
                return <Tag color={p.color}>{p.label}</Tag>;
            },
        },
        {
            title: 'Blocker',
            key: 'blocker',
            render: (_, j) => (j.blocked_task_count || 0) > 0
                ? <Badge count={j.blocked_task_count} size="small" color="red"><StopOutlined style={{ color: '#ff4d4f' }} /></Badge>
                : <StopOutlined style={{ color: '#ccc' }} />,
            align: 'center',
        },
        {
            title: 'Cập nhật',
            key: 'updated',
            render: (_, j) => {
                const date = j.last_activity_at ? new Date(j.last_activity_at).toLocaleDateString('vi-VN') : 'N/A';
                return <Text type="secondary" style={{ fontSize: 11 }}>{date}</Text>;
            },
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={12}>
                    <h2 style={{ margin: 0 }}>Danh sách Hành trình Khách hàng</h2>
                    <Text type="secondary">Quản lý toàn bộ hành trình dịch vụ theo cấu hình chuẩn 13 bước</Text>
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <Space wrap>
                        <Tooltip title="Xem dạng Board">
                            <Button icon={<AppstoreOutlined />} onClick={() => navigate('/pm/journeys/board')}>{isMobile ? '' : 'Board'}</Button>
                        </Tooltip>
                        <Tooltip title="Action Center">
                            <Button icon={<AlertOutlined />} onClick={() => navigate('/pm/journeys/action-center')}>{isMobile ? '' : 'Action Center'}</Button>
                        </Tooltip>
                        <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading}>Làm mới</Button>
                    </Space>
                </Col>
            </Row>

            {/* KPI Row */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderLeft: '4px solid #1976D2', borderRadius: 8 }}>
                        <Statistic
                            title="Đang mở"
                            value={kpis.total_open}
                            prefix={<UnorderedListOutlined style={{ color: '#1976D2' }} />}
                            valueStyle={{ color: '#1976D2', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderLeft: '4px solid #ff4d4f', borderRadius: 8 }}>
                        <Statistic
                            title="Quá SLA"
                            value={kpis.overdue_sla}
                            prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderLeft: '4px solid #fa8c16', borderRadius: 8 }}>
                        <Statistic
                            title="Có Blocker"
                            value={kpis.blocked}
                            prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderLeft: '4px solid #52c41a', borderRadius: 8 }}>
                        <Statistic
                            title="Tin nhắn Portal"
                            value={kpis.unread_threads}
                            prefix={<MessageOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a', fontSize: 24 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                {/* Filter Bar */}
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    <Col flex="auto">
                        <Input
                            placeholder="Tìm kiếm hành trình..."
                            prefix={<SearchOutlined />}
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col>
                        <Select
                            style={{ width: 150 }}
                            value={filterStep}
                            onChange={setFilterStep}
                            options={[
                                { value: 'ALL', label: 'Tất cả bước' },
                                ...JOURNEY_STEPS_CONFIG.map(s => ({ value: s.key, label: s.label }))
                            ]}
                        />
                    </Col>
                    <Col>
                        <Select
                            style={{ width: 140 }}
                            value={filterSla}
                            onChange={setFilterSla}
                            options={[
                                { value: 'ALL', label: 'Tất cả SLA' },
                                ...Object.entries(SLA_CONFIG).map(([val, cfg]) => ({ value: val, label: cfg.label }))
                            ]}
                        />
                    </Col>
                    <Col>
                        <Select
                            style={{ width: 140 }}
                            value={filterPriority}
                            onChange={setFilterPriority}
                            options={[
                                { value: 'ALL', label: 'Tất cả ưu tiên' },
                                ...Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => ({ 
                                    value: val, 
                                    label: <span><Badge status={cfg.color as any} /> {cfg.label}</span> 
                                }))
                            ]}
                        />
                    </Col>
                    <Col>
                        <Button onClick={() => { setKeyword(''); setFilterSla('ALL'); setFilterPriority('ALL'); setFilterStep('ALL'); }}>Xóa lọc</Button>
                    </Col>
                    {isMobile && (
                        <Col>
                            <Button icon={<FilterOutlined />} onClick={() => setIsFilterVisible(true)}>Bộ lọc</Button>
                        </Col>
                    )}
                </Row>

                {isMobile ? (
                    /* Mobile Card List */
                    <div>
                        {filtered.map(j => (
                            <Card
                                key={j._id}
                                size="small"
                                style={{ marginBottom: 12, cursor: 'pointer', borderRadius: 8 }}
                                onClick={() => navigate(`/pm/journeys/${j._id}`)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <Text strong style={{ color: '#1976D2' }}>{j.journey_code || 'N/A'}</Text>
                                        <div style={{ fontWeight: 500, marginTop: 2 }}>{j.idx_customer_id?.title || 'N/A'}</div>
                                        <Text type="secondary" style={{ fontSize: 11 }}>{j.request_title}</Text>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Tag color={JOURNEY_STEPS_CONFIG.find(c => c.key === j.current_step)?.color}>
                                            {JOURNEY_STEPS_CONFIG.find(c => c.key === j.current_step)?.label || j.current_step}
                                        </Tag>
                                        <div style={{ marginTop: 4 }}>
                                            <Badge status={SLA_CONFIG[j.sla_status || 'on_time'].color as any} text={SLA_CONFIG[j.sla_status || 'on_time'].label} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {filtered.length === 0 && <Empty description="Không có hành trình nào" />}
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        rowKey="_id"
                        pagination={{ pageSize: 10, showTotal: (t) => `${t} hành trình` }}
                        locale={{ emptyText: <Empty description="Không có hành trình nào phù hợp bộ lọc" /> }}
                        size="middle"
                        loading={isLoading}
                        onRow={(j) => ({ onClick: () => navigate(`/pm/journeys/${j._id}`), style: { cursor: 'pointer' } })}
                    />
                )}
            </Card>

            {/* DLG-01 Filter Drawer (Mobile) */}
            <Drawer
                title="Bộ lọc hành trình"
                placement="right"
                onClose={() => setIsFilterVisible(false)}
                open={isFilterVisible}
                width={300}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <Text strong>Bước hiện tại</Text>
                        <Select
                            style={{ width: '100%', marginTop: 8 }}
                            value={filterStep}
                            onChange={(v) => { setFilterStep(v); setIsFilterVisible(false); }}
                            options={[
                                { value: 'ALL', label: 'Tất cả bước' },
                                ...JOURNEY_STEPS_CONFIG.map(s => ({ value: s.key, label: s.label }))
                            ]}
                        />
                    </div>
                    <div>
                        <Text strong>Trạng thái SLA</Text>
                        <Select
                            style={{ width: '100%', marginTop: 8 }}
                            value={filterSla}
                            onChange={(v) => { setFilterSla(v); setIsFilterVisible(false); }}
                            options={[
                                { value: 'ALL', label: 'Tất cả SLA' },
                                ...Object.entries(SLA_CONFIG).map(([val, cfg]) => ({ value: val, label: cfg.label }))
                            ]}
                        />
                    </div>
                    <div>
                        <Text strong>Độ ưu tiên</Text>
                        <Select
                            style={{ width: '100%', marginTop: 8 }}
                            value={filterPriority}
                            onChange={(v) => { setFilterPriority(v); setIsFilterVisible(false); }}
                            options={[
                                { value: 'ALL', label: 'Tất cả ưu tiên' },
                                ...Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => ({ value: val, label: cfg.label }))
                            ]}
                        />
                    </div>
                    <Button block onClick={() => { setKeyword(''); setFilterSla('ALL'); setFilterPriority('ALL'); setFilterStep('ALL'); setIsFilterVisible(false); }}>Xóa bộ lọc</Button>
                </div>
            </Drawer>
        </div>
    );
};

export default JourneyList;
