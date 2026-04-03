import React, { useState, useEffect, useMemo } from 'react';
import {
    Card, Table, Tag, Badge, Select, Row, Col, Typography,
    Space, Button, Statistic, Grid, message, Empty
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    ClockCircleOutlined, MessageOutlined,
    SendOutlined, StopOutlined, EyeOutlined, ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';
import type { ActionItem, ActionType, PriorityLevel } from '../../../types/journey';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const ACTION_BUCKET_CONFIG: Record<ActionType, { label: string; desc: string; color: string; icon: React.ReactNode }> = {
    step_overdue: { label: 'Step Quá hạn', desc: 'Các bước đã vượt SLA', color: '#ff4d4f', icon: <ClockCircleOutlined /> },
    survey_waiting: { label: 'Khảo sát chờ review', desc: 'Đã nộp, chưa phê duyệt', color: '#fa8c16', icon: <EyeOutlined /> },
    portal_unread: { label: 'Portal chưa đọc', desc: 'Thread cần phản hồi', color: '#1890ff', icon: <MessageOutlined /> },
    publish_pending: { label: 'Chờ publish', desc: 'Sẵn sàng publish portal', color: '#722ed1', icon: <SendOutlined /> },
    blocked: { label: 'Hành trình bị block', desc: 'Blocker chưa xử lý', color: '#d4380d', icon: <StopOutlined /> },
};

const PRIORITY_CONFIG: Record<PriorityLevel, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'default' },
    medium: { label: 'TB', color: 'blue' },
    high: { label: 'Cao', color: 'orange' },
    critical: { label: 'Khẩn', color: 'red' },
};

const ActionCenter: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterType, setFilterType] = useState<string>('ALL');

    const fetchJourneys = async () => {
        setIsLoading(true);
        try {
            const res = await journeyService.queryJourneysDto({});
            if (res.code === 0 && res.data) {
                setJourneys(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch journeys for Action Center:', error);
            message.error('Không thể tải dữ liệu hành trình');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJourneys();
    }, []);

    const actionItems = useMemo(() => {
        const items: ActionItem[] = [];
        journeys.forEach(j => {
            // 1. Step Overdue
            if (j.sla_status === 'overdue') {
                items.push({
                    id: `${j._id}_overdue`,
                    action_type: 'step_overdue',
                    journey_id: j._id,
                    journey_code: j.journey_code || 'N/A',
                    customer_name: j.idx_customer_id?.title || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    due_at: j.next_milestone_due?.toString(),
                    owner_user: j.supervisor_name || 'Chưa gán',
                    source_tab: 'Yêu cầu'
                });
            }

            // 2. Survey Waiting Review
            if (j.current_step === 'survey_review') {
                items.push({
                    id: `${j._id}_survey`,
                    action_type: 'survey_waiting',
                    journey_id: j._id,
                    journey_code: j.journey_code || 'N/A',
                    customer_name: j.idx_customer_id?.title || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    owner_user: j.supervisor_name || 'Chưa gán',
                    source_tab: 'Khảo sát'
                });
            }

            // 3. Portal Unread
            if ((j.unread_thread_count || 0) > 0) {
                items.push({
                    id: `${j._id}_portal`,
                    action_type: 'portal_unread',
                    journey_id: j._id,
                    journey_code: j.journey_code || 'N/A',
                    customer_name: j.idx_customer_id?.title || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    owner_user: j.supervisor_name || 'Chưa gán',
                    source_tab: 'Portal/Chat'
                });
            }

            // 4. Publish Pending
            if (j.portal_publish_status !== 'published') {
                items.push({
                    id: `${j._id}_publish`,
                    action_type: 'publish_pending',
                    journey_id: j._id,
                    journey_code: j.journey_code || 'N/A',
                    customer_name: j.idx_customer_id?.title || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    owner_user: j.supervisor_name || 'Chưa gán',
                    source_tab: 'Portal/Chat'
                });
            }

            // 5. Blocked
            if ((j.blocked_task_count || 0) > 0) {
                items.push({
                    id: `${j._id}_blocked`,
                    action_type: 'blocked',
                    journey_id: j._id,
                    journey_code: j.journey_code || 'N/A',
                    customer_name: j.idx_customer_id?.title || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    owner_user: j.supervisor_name || 'Chưa gán',
                    source_tab: 'Hành trình'
                });
            }
        });
        return items;
    }, [journeys]);

    const bucketCounts = (Object.keys(ACTION_BUCKET_CONFIG) as ActionType[]).map(type => ({
        type,
        count: actionItems.filter(a => a.action_type === type).length,
    }));

    const filtered = actionItems.filter(a => filterType === 'ALL' || a.action_type === filterType);

    const columns: ColumnsType<ActionItem> = [
        {
            title: 'Loại hành động',
            key: 'type',
            fixed: isMobile ? 'left' : undefined,
            width: 150,
            render: (_, a) => {
                const cfg = ACTION_BUCKET_CONFIG[a.action_type];
                return (
                    <Space size={4}>
                        <span style={{ color: cfg.color }}>{cfg.icon}</span>
                        <Text style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</Text>
                    </Space>
                );
            },
        },
        {
            title: 'Mã hành trình',
            key: 'journey',
            width: 150,
            render: (_, a) => {
                const tabKey = a.source_tab === 'Khảo sát' ? 'survey' : a.source_tab === 'Portal/Chat' ? 'portal' : 'request';
                return (
                    <div>
                        <div style={{ fontWeight: 600, color: '#1976D2', cursor: 'pointer' }}
                            onClick={() => navigate(`/ql/journeys/${a.journey_id}?tab=${tabKey}`)}>
                            {a.journey_code}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{a.customer_name}</Text>
                    </div>
                );
            },
        },
        {
            title: 'Bước hiện tại',
            dataIndex: 'current_step',
            key: 'step',
            width: 150,
            render: (v) => <Tag>{v}</Tag>
        },
        {
            title: 'Ưu tiên',
            key: 'priority',
            width: 90,
            render: (_, a) => {
                const p = PRIORITY_CONFIG[a.priority];
                return <Tag color={p.color}>{p.label}</Tag>;
            },
        },
        {
            title: 'Hạn xử lý',
            key: 'due',
            width: 100,
            render: (_, a) => a.due_at
                ? <Text type={new Date(a.due_at) < new Date() ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>{a.due_at.split('T')[0]}</Text>
                : <Text type="secondary">—</Text>,
        },
        {
            title: 'Phụ trách',
            dataIndex: 'owner_user',
            key: 'owner',
            responsive: ['lg'],
            width: 120,
            render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text>,
        },
        {
            title: 'Tab',
            dataIndex: 'source_tab',
            key: 'source',
            width: 100,
            responsive: ['sm'],
            render: (v) => v ? <Tag>{v}</Tag> : null,
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            width: 80,
            render: (_, a) => {
                const tabKey = a.source_tab === 'Khảo sát' ? 'survey' : a.source_tab === 'Portal/Chat' ? 'portal' : 'request';
                return (
                    <Button size="small" type="primary" ghost onClick={() => navigate(`/ql/journeys/${a.journey_id}?tab=${tabKey}`)}>
                        Xử lý
                    </Button>
                );
            },
        },
    ];

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: isMobile ? 16 : 24 }}>
                <Col>
                    <h2 style={{ margin: 0, fontSize: isMobile ? 22 : 28 }}>Action Center</h2>
                    <Text type="secondary">Tổng hợp các việc cần xử lý khẩn ngay hôm nay</Text>
                </Col>
                <Col>
                    <Button icon={<ReloadOutlined />} onClick={fetchJourneys} loading={isLoading}>Làm mới</Button>
                </Col>
            </Row>

            {/* Bucket Cards */}
            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                {bucketCounts.map(({ type, count }) => {
                    const cfg = ACTION_BUCKET_CONFIG[type];
                    return (
                        <Col xs={12} sm={8} lg={4.8} style={{ flexBasis: isMobile ? '50%' : undefined, maxWidth: isMobile ? '50%' : undefined }} key={type}>
                            <Card
                                size="small"
                                style={{
                                    borderLeft: `4px solid ${cfg.color}`, borderRadius: 8,
                                    cursor: 'pointer',
                                    height: '100%',
                                    background: filterType === type ? `${cfg.color}10` : '#fff',
                                }}
                                bodyStyle={{ padding: 12 }}
                                onClick={() => setFilterType(prev => prev === type ? 'ALL' : type)}
                            >
                                <div style={{ color: cfg.color, fontSize: 20, marginBottom: 4 }}>{cfg.icon}</div>
                                <Statistic
                                    title={<Text style={{ fontSize: 11 }}>{cfg.label}</Text>}
                                    value={count}
                                    valueStyle={{ color: cfg.color, fontSize: 22 }}
                                    loading={isLoading}
                                />
                                <Text type="secondary" style={{ fontSize: 10 }}>{cfg.desc}</Text>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Filter + Table */}
            <Card bodyStyle={{ padding: isMobile ? 8 : 24 }}>
                <Row style={{ marginBottom: 16 }} gutter={[8, 8]} justify="space-between" align="middle">
                    <Col xs={24} sm={12}>
                        <Space>
                            <Text strong style={{ fontSize: isMobile ? 16 : 18 }}>Danh sách cần xử lý</Text>
                            <Badge count={filtered.length} style={{ background: '#1976D2' }} />
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Select
                            style={{ width: '100%', maxWidth: 200 }}
                            value={filterType}
                            onChange={setFilterType}
                            options={[
                                { value: 'ALL', label: 'Tất cả loại' },
                                ...Object.entries(ACTION_BUCKET_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
                            ]}
                        />
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    size={isMobile ? 'small' : 'middle'}
                    scroll={{ x: 'max-content' }}
                    loading={isLoading}
                    pagination={{
                        pageSize: 10,
                        showTotal: (t) => isMobile ? `${t} việc` : `${t} việc cần xử lý`,
                        size: isMobile ? 'small' : 'default'
                    }}
                    locale={{ emptyText: <Empty description="Chúc mừng! Bạn không còn việc nào tồn đọng." /> }}
                />
            </Card>
        </div>
    );
};

export default ActionCenter;

