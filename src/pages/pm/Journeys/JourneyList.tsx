import React, { useState } from 'react';
import {
    Table, Card, Button, Tag, Input, Select, Space, Row, Col,
    Statistic, Badge, Avatar, Typography, Tooltip, Grid, Empty
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined, AppstoreOutlined, UnorderedListOutlined,
    AlertOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
    MessageOutlined, ReloadOutlined, UserOutlined, FireOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockJourneys, getJourneyKPIs } from '../../../data/journeyMockData';
import type { Journey, PriorityLevel, SlaStatus } from '../../../types/journey';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const PRIORITY_CONFIG: Record<PriorityLevel, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'default' },
    medium: { label: 'Trung bình', color: 'blue' },
    high: { label: 'Cao', color: 'orange' },
    critical: { label: 'Khẩn cấp', color: 'red' },
};

const SLA_CONFIG: Record<SlaStatus, { label: string; color: string }> = {
    ontime: { label: 'Đúng hạn', color: 'success' },
    at_risk: { label: 'Có rủi ro', color: 'warning' },
    overdue: { label: 'Quá hạn', color: 'error' },
};

const STEP_COLORS: Record<string, string> = {
    INTAKE: 'cyan',
    SURVEY: 'blue',
    QUOTATION: 'purple',
    CONTRACT: 'geekblue',
    CONSTRUCTION: 'orange',
    PAYMENT: 'green',
};

const JourneyList: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [keyword, setKeyword] = useState('');
    const [filterSla, setFilterSla] = useState<string>('ALL');
    const [filterPriority, setFilterPriority] = useState<string>('ALL');
    const [filterStep, setFilterStep] = useState<string>('ALL');

    const kpis = getJourneyKPIs();

    const filtered = mockJourneys.filter(j => {
        const matchKeyword = !keyword || [j.journey_code, j.customer_name, j.customer_phone, j.request_title]
            .some(f => f?.toLowerCase().includes(keyword.toLowerCase()));
        const matchSla = filterSla === 'ALL' || j.sla_status === filterSla;
        const matchPriority = filterPriority === 'ALL' || j.priority === filterPriority;
        const matchStep = filterStep === 'ALL' || j.current_step_code === filterStep;
        return matchKeyword && matchSla && matchPriority && matchStep;
    });

    const columns: ColumnsType<Journey> = [
        {
            title: 'Hành trình',
            key: 'journey',
            render: (_, j) => (
                <div>
                    <div
                        style={{ fontWeight: 600, color: '#1976D2', cursor: 'pointer', marginBottom: 2 }}
                        onClick={() => navigate(`/pm/journeys/${j.id}`)}
                    >
                        {j.journey_code}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{j.customer_name} · {j.customer_phone}</Text>
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
            render: (_, j) => (
                <Tag color={STEP_COLORS[j.current_step_code] || 'default'}>{j.current_step}</Tag>
            ),
        },
        {
            title: 'Phụ trách',
            key: 'owner',
            render: (_, j) => (
                <Space>
                    <Avatar size={22} style={{ background: '#52c41a' }} icon={<UserOutlined />} />
                    <Text style={{ fontSize: 12 }}>{j.owner_user}</Text>
                </Space>
            ),
        },
        {
            title: 'Khảo sát',
            key: 'survey',
            render: (_, j) => {
                const cfg = { not_started: { color: 'default', label: 'Chưa' }, scheduled: { color: 'blue', label: 'Đã lịch' }, in_progress: { color: 'processing', label: 'Đang KS' }, completed: { color: 'success', label: 'Xong' } };
                const c = cfg[j.survey_status];
                return <Tag color={c.color}>{c.label}</Tag>;
            },
        },
        {
            title: 'Dự toán',
            key: 'estimate',
            render: (_, j) => {
                const cfg = { not_started: 'default', draft: 'orange', ready: 'green' };
                return <Tag color={cfg[j.estimate_status]}>{j.estimate_status === 'not_started' ? 'Chưa' : j.estimate_status === 'draft' ? 'Nháp' : 'Sẵn'}</Tag>;
            },
        },
        {
            title: 'SLA',
            key: 'sla',
            render: (_, j) => {
                const s = SLA_CONFIG[j.sla_status];
                return <Badge status={s.color as any} text={s.label} />;
            },
        },
        {
            title: 'Ưu tiên',
            key: 'priority',
            render: (_, j) => {
                const p = PRIORITY_CONFIG[j.priority];
                return <Tag color={p.color}>{p.label}</Tag>;
            },
        },
        {
            title: 'Portal',
            key: 'portal',
            render: (_, j) => j.unread_portal_threads > 0
                ? <Badge count={j.unread_portal_threads} size="small"><MessageOutlined style={{ color: '#1976D2' }} /></Badge>
                : <MessageOutlined style={{ color: '#ccc' }} />,
            align: 'center',
        },
        {
            title: 'Cập nhật',
            key: 'updated',
            render: (_, j) => <Text type="secondary" style={{ fontSize: 11 }}>{j.last_activity_at.split('T')[0]}</Text>,
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h2 style={{ margin: 0 }}>Danh sách Hành trình Khách hàng</h2>
                    <Text type="secondary">Quản lý toàn bộ hành trình dịch vụ theo vai trò PM</Text>
                </div>
                <Space>
                    <Tooltip title="Xem dạng Board">
                        <Button icon={<AppstoreOutlined />} onClick={() => navigate('/pm/journeys/board')}>Board</Button>
                    </Tooltip>
                    <Tooltip title="Action Center">
                        <Button icon={<AlertOutlined />} onClick={() => navigate('/pm/journeys/action-center')}>Action Center</Button>
                    </Tooltip>
                    <Button icon={<ReloadOutlined />}>Làm mới</Button>
                </Space>
            </div>

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
                            title="Có blocker"
                            value={kpis.blocked}
                            prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderLeft: '4px solid #52c41a', borderRadius: 8 }}>
                        <Statistic
                            title="Cần phản hồi Portal"
                            value={kpis.needs_portal_reply}
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
                            placeholder="Tìm theo mã HT, tên KH, số ĐT..."
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
                                { value: 'INTAKE', label: 'Tiếp nhận' },
                                { value: 'SURVEY', label: 'Khảo sát' },
                                { value: 'QUOTATION', label: 'Dự toán' },
                                { value: 'CONTRACT', label: 'Ký kết' },
                                { value: 'CONSTRUCTION', label: 'Thi công' },
                                { value: 'PAYMENT', label: 'Thanh toán' },
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
                                { value: 'ontime', label: 'Đúng hạn' },
                                { value: 'at_risk', label: 'Có rủi ro' },
                                { value: 'overdue', label: 'Quá hạn' },
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
                                { value: 'critical', label: '🔴 Khẩn cấp' },
                                { value: 'high', label: '🟠 Cao' },
                                { value: 'medium', label: '🔵 Trung bình' },
                                { value: 'low', label: '⚪ Thấp' },
                            ]}
                        />
                    </Col>
                    <Col>
                        <Button onClick={() => { setKeyword(''); setFilterSla('ALL'); setFilterPriority('ALL'); setFilterStep('ALL'); }}>Xóa lọc</Button>
                    </Col>
                </Row>

                {isMobile ? (
                    /* Mobile Card List */
                    <div>
                        {filtered.map(j => (
                            <Card
                                key={j.id}
                                size="small"
                                style={{ marginBottom: 12, cursor: 'pointer', borderRadius: 8 }}
                                onClick={() => navigate(`/pm/journeys/${j.id}`)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <Text strong style={{ color: '#1976D2' }}>{j.journey_code}</Text>
                                        <div style={{ fontWeight: 500, marginTop: 2 }}>{j.customer_name}</div>
                                        <Text type="secondary" style={{ fontSize: 11 }}>{j.request_title}</Text>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Tag color={STEP_COLORS[j.current_step_code]}>{j.current_step}</Tag>
                                        <div style={{ marginTop: 4 }}><Badge status={SLA_CONFIG[j.sla_status].color as any} text={SLA_CONFIG[j.sla_status].label} /></div>
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
                        rowKey="id"
                        pagination={{ pageSize: 10, showTotal: (t) => `${t} hành trình` }}
                        locale={{ emptyText: <Empty description="Không có hành trình nào phù hợp bộ lọc" /> }}
                        size="middle"
                        onRow={(j) => ({ onClick: () => navigate(`/pm/journeys/${j.id}`), style: { cursor: 'pointer' } })}
                    />
                )}
            </Card>
        </div>
    );
};

export default JourneyList;
