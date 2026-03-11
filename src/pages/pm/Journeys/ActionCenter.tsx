import React, { useState } from 'react';
import {
    Card, Table, Tag, Badge, Select, Row, Col, Typography,
    Space, Button, Statistic, Tooltip
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    ClockCircleOutlined, ExclamationCircleOutlined, MessageOutlined,
    SendOutlined, StopOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockActionItems } from '../../../data/journeyMockData';
import type { ActionItem, ActionType, PriorityLevel } from '../../../types/journey';

const { Text } = Typography;

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
    const [filterType, setFilterType] = useState<string>('ALL');

    const bucketCounts = (Object.keys(ACTION_BUCKET_CONFIG) as ActionType[]).map(type => ({
        type,
        count: mockActionItems.filter(a => a.action_type === type).length,
    }));

    const filtered = mockActionItems.filter(a => filterType === 'ALL' || a.action_type === filterType);

    const columns: ColumnsType<ActionItem> = [
        {
            title: 'Loại hành động',
            key: 'type',
            render: (_, a) => {
                const cfg = ACTION_BUCKET_CONFIG[a.action_type];
                return (
                    <Space>
                        <span style={{ color: cfg.color }}>{cfg.icon}</span>
                        <Text style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</Text>
                    </Space>
                );
            },
        },
        {
            title: 'Mã hành trình',
            key: 'journey',
            render: (_, a) => (
                <div>
                    <div style={{ fontWeight: 600, color: '#1976D2', cursor: 'pointer' }}
                        onClick={() => navigate(`/pm/journeys/${a.journey_id}`)}>
                        {a.journey_code}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{a.customer_name}</Text>
                </div>
            ),
        },
        {
            title: 'Bước hiện tại',
            dataIndex: 'current_step',
            key: 'step',
        },
        {
            title: 'Ưu tiên',
            key: 'priority',
            render: (_, a) => {
                const p = PRIORITY_CONFIG[a.priority];
                return <Tag color={p.color}>{p.label}</Tag>;
            },
        },
        {
            title: 'Hạn xử lý',
            key: 'due',
            render: (_, a) => a.due_at
                ? <Text type={new Date(a.due_at) < new Date() ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>{a.due_at.split('T')[0]}</Text>
                : <Text type="secondary">—</Text>,
        },
        {
            title: 'Phụ trách',
            dataIndex: 'owner_user',
            key: 'owner',
            render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text>,
        },
        {
            title: 'Tab liên quan',
            dataIndex: 'source_tab',
            key: 'source',
            render: (v) => v ? <Tag>{v}</Tag> : null,
        },
        {
            title: '',
            key: 'action',
            render: (_, a) => (
                <Button size="small" type="primary" ghost onClick={() => navigate(`/pm/journeys/${a.journey_id}`)}>
                    Xử lý
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>Action Center</h2>
                <Text type="secondary">Tổng hợp các việc cần xử lý khẩn ngay hôm nay</Text>
            </div>

            {/* Bucket Cards */}
            <Row gutter={12} style={{ marginBottom: 20 }}>
                {bucketCounts.map(({ type, count }) => {
                    const cfg = ACTION_BUCKET_CONFIG[type];
                    return (
                        <Col xs={12} sm={8} lg={4} key={type}>
                            <Card
                                size="small"
                                style={{
                                    borderLeft: `4px solid ${cfg.color}`, borderRadius: 8,
                                    cursor: 'pointer',
                                    background: filterType === type ? `${cfg.color}10` : '#fff',
                                }}
                                onClick={() => setFilterType(prev => prev === type ? 'ALL' : type)}
                            >
                                <div style={{ color: cfg.color, fontSize: 20, marginBottom: 4 }}>{cfg.icon}</div>
                                <Statistic
                                    title={<Text style={{ fontSize: 11 }}>{cfg.label}</Text>}
                                    value={count}
                                    valueStyle={{ color: cfg.color, fontSize: 22 }}
                                />
                                <Text type="secondary" style={{ fontSize: 10 }}>{cfg.desc}</Text>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Filter + Table */}
            <Card>
                <Row style={{ marginBottom: 16 }} justify="space-between" align="middle">
                    <Col>
                        <Text strong>Danh sách cần xử lý</Text>
                        <Badge count={filtered.length} style={{ marginLeft: 8, background: '#1976D2' }} />
                    </Col>
                    <Col>
                        <Select
                            style={{ width: 200 }}
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
                    size="small"
                    pagination={{ pageSize: 10, showTotal: t => `${t} việc cần xử lý` }}
                />
            </Card>
        </div>
    );
};

export default ActionCenter;
