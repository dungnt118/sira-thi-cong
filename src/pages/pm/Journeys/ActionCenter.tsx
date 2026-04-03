import React, { useState, useEffect, useMemo } from 'react';
import {
    Card, Table, Tag, Badge, Select, Row, Col, Typography,
    Space, Button, Statistic, Grid, message, Empty
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    ClockCircleOutlined, MessageOutlined,
    SendOutlined, StopOutlined, EyeOutlined, ReloadOutlined,
    ProjectOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';
import type { ActionItem, ActionType, PriorityLevel } from '../../../types/journey';
import { FilterOperation } from '../../../types/filters/GroupQueryFilter';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const ACTION_BUCKET_CONFIG: Record<ActionType, { label: string; desc: string; color: string; icon: React.ReactNode }> = {
    step_overdue: { label: 'Bước Quá hạn', desc: 'Các bước đã vượt thỏa thuận SLA', color: '#ff4d4f', icon: <ClockCircleOutlined /> },
    survey_waiting: { label: 'Khảo sát chờ duyệt', desc: 'Đã nộp khảo sát, chưa phê duyệt', color: '#fa8c16', icon: <EyeOutlined /> },
    portal_unread: { label: 'Tin nhắn Portal', desc: 'Các trao đổi cần phản hồi', color: '#1890ff', icon: <MessageOutlined /> },
    publish_pending: { label: 'Chờ công khai', desc: 'Sẵn sàng đẩy thông tin Portal', color: '#722ed1', icon: <SendOutlined /> },
    blocked: { label: 'Hành trình bị lỗi', desc: 'Tồn đọng tác vụ chặn đứng', color: '#d4380d', icon: <StopOutlined /> },
    active_all: { label: 'Đang thực hiện', desc: 'Hành trình chưa đóng', color: '#13c2c2', icon: <ProjectOutlined /> },
};

const PRIORITY_CONFIG: Record<PriorityLevel, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'default' },
    medium: { label: 'Trung bình', color: 'blue' },
    high: { label: 'Cao', color: 'orange' },
    critical: { label: 'Khẩn cấp', color: 'red' },
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
            const res = await journeyService.queryJourneysDto({
                group: {
                    id: 'project_status',
                    operation: FilterOperation.NOT_IN,
                    value: ['completed', 'cancelled'],
                    children: []
                }
            });
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
                    customer_name: (Array.isArray(j.idx_customer_id) ? j.idx_customer_id[0]?.title : j.idx_customer_id?.title) || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    due_at: j.planned_end_date?.toString(),
                    start_at: j.planned_start_date?.toString(),
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
                    customer_name: (Array.isArray(j.idx_customer_id) ? j.idx_customer_id[0]?.title : j.idx_customer_id?.title) || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    due_at: j.planned_end_date?.toString(),
                    start_at: j.planned_start_date?.toString(),
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
                    customer_name: (Array.isArray(j.idx_customer_id) ? j.idx_customer_id[0]?.title : j.idx_customer_id?.title) || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    due_at: j.planned_end_date?.toString(),
                    start_at: j.planned_start_date?.toString(),
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
                    customer_name: (Array.isArray(j.idx_customer_id) ? j.idx_customer_id[0]?.title : j.idx_customer_id?.title) || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    due_at: j.planned_end_date?.toString(),
                    start_at: j.planned_start_date?.toString(),
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
                    customer_name: (Array.isArray(j.idx_customer_id) ? j.idx_customer_id[0]?.title : j.idx_customer_id?.title) || j.customer_full_name || 'N/A',
                    current_step: j.current_step || 'N/A',
                    priority: (j.priority as PriorityLevel) || 'low',
                    due_at: j.planned_end_date?.toString(),
                    start_at: j.planned_start_date?.toString(),
                    owner_user: j.supervisor_name || 'Chưa gán',
                    source_tab: 'Hành trình'
                });
            }

            // Always add to Action Center as a general item if it's open
            // (but only as 'active_all' if it hasn't metadata for other specific actions)
            // Wait, the user wants ALL 5 to show up, so we just add 'active_all' for everyone
            // to ensure they are at least listed once.
            items.push({
                id: `${j._id}_active`,
                action_type: 'active_all',
                journey_id: j._id,
                journey_code: j.journey_code || 'N/A',
                customer_name: (Array.isArray(j.idx_customer_id) ? j.idx_customer_id[0]?.title : j.idx_customer_id?.title) || j.customer_full_name || 'N/A',
                current_step: j.current_step || 'N/A',
                due_at: j.planned_end_date?.toString(),
                start_at: j.planned_start_date?.toString(),
                priority: (j.priority as PriorityLevel) || 'low',
                owner_user: j.supervisor_name || 'Chưa gán',
                source_tab: 'Hành trình'
            });
        });

        // If a journey has specific urgent actions, maybe we don't want to show the 'active_all' generic one?
        // Let's filter out 'active_all' for journeys that have other actions to keep the list clean.
        const finalItems: ActionItem[] = [];
        const journeysWithActions = new Set(items.filter(i => i.action_type !== 'active_all').map(i => i.journey_id));
        
        items.forEach(i => {
            if (i.action_type !== 'active_all' || !journeysWithActions.has(i.journey_id)) {
                finalItems.push(i);
            }
        });

        return finalItems;
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
                return (
                    <div>
                        <div style={{ fontWeight: 600, color: '#1976D2', cursor: 'pointer' }}
                            onClick={() => navigate(`/ql/journeys/${a.journey_id}`)}>
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
            render: (v) => {
                const config = JOURNEY_STEPS_CONFIG.find(c => c.key === v) || JOURNEY_STEPS_CONFIG[0];
                return (
                    <Tag color={config.color}>
                        {config.label}
                    </Tag>
                );
            }
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
            width: 140,
            render: (_, a) => {
                const startDateStr = a.start_at?.split('T')[0] || '—';
                
                if (!a.due_at) {
                    return (
                        <Space direction="vertical" size={0}>
                            <Text style={{ fontSize: 12, color: '#1890ff', fontWeight: 500 }}>BĐ: {startDateStr}</Text>
                            <Text type="danger" style={{ fontSize: 13, fontWeight: 700 }}>Chưa có hạn!</Text>
                        </Space>
                    );
                }
                
                const dueDate = new Date(a.due_at);
                const today = new Date();
                today.setHours(0, 0, 0, 0); 
                
                const diffTime = dueDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let textColor = '#52c41a'; // Default success green
                let statusLabel = '';
                let fontWeight = 600;
                
                if (diffDays < 0) {
                    textColor = '#ff4d4f'; // Danger red
                    statusLabel = '(Trễ)';
                    fontWeight = 700;
                } else if (diffDays <= 3) {
                    textColor = '#fa8c16'; // Warning orange
                    statusLabel = '(Sắp tới)';
                    fontWeight = 700;
                }
                
                return (
                    <Space direction="vertical" size={0}>
                        <Text style={{ fontSize: 12, color: '#1890ff', fontWeight: 500 }}>BĐ: {startDateStr}</Text>
                        <Space size={4}>
                            <Text style={{ fontSize: 13, color: textColor, fontWeight }}>
                                KT: {a.due_at.split('T')[0]}
                            </Text>
                            {statusLabel && (
                                <Text style={{ fontSize: 11, color: textColor, fontWeight: 700 }}>
                                    {statusLabel}
                                </Text>
                            )}
                        </Space>
                    </Space>
                );
            },
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
                return (
                    <Button size="small" type="primary" ghost onClick={() => navigate(`/ql/journeys/${a.journey_id}`)}>
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
                        showTotal: (t) => isMobile ? `${t} việc` : `${t} công việc cần xử lý`,
                        size: isMobile ? 'small' : 'default'
                    }}
                    locale={{ emptyText: <Empty description="Tuyệt vời! Bạn đã hoàn thành hết các việc cần xử lý." /> }}
                />
            </Card>
        </div>
    );
};

export default ActionCenter;

