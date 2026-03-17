import React, { useState } from 'react';
import {
    Card, Table, Tag, Button, Progress, Space, Typography, Row, Col,
    Select, Input, Tooltip, Dropdown, Statistic, Avatar
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
    PlusOutlined, EyeOutlined, MoreOutlined,
    UserOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProjectProgress } from '../../../data/mockData';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { mockProjects as defaultProjects } from '../../../data/mockData';
import type { Project, ProjectStatus } from '../../../types/v3';

const { Text, Title } = Typography;

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
    SCHEDULED: { label: 'Đã lên lịch', color: 'blue' },
    WAITING_MATERIALS: { label: '⚠️ Chờ vật tư', color: 'warning' },
    IN_PROGRESS: { label: 'Đang thi công', color: 'processing' },
    AWAITING_APPROVAL: { label: 'Chờ nghiệm thu', color: 'purple' },
    COMPLETED: { label: 'Hoàn thành', color: 'success' },
    CANCELLED: { label: 'Đã hủy', color: 'error' },
};

const PMProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [mockProjects] = useLocalStorageData<Project[]>(demoDataService.KEYS.PROJECTS, defaultProjects);

    const filtered = mockProjects.filter(p => {
        const matchSearch = !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.code.toLowerCase().includes(search.toLowerCase()) ||
            p.customerName.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // KPI stats
    const kpi = {
        total: mockProjects.length,
        inProgress: mockProjects.filter(p => p.status === 'IN_PROGRESS').length,
        waitingMaterials: mockProjects.filter(p => p.status === 'WAITING_MATERIALS').length,
        completed: mockProjects.filter(p => p.status === 'COMPLETED').length,
    };

    const getRowActions = (p: Project): MenuProps['items'] => [
        { key: 'view', icon: <EyeOutlined />, label: 'Xem chi tiết', onClick: () => navigate(`/pm/construction/projects/${p.id}`) },
        { key: 'edit', label: '✏️ Chỉnh sửa', onClick: () => navigate(`/pm/construction/projects/${p.id}/edit`) },
        { key: 'portal', label: '🔗 Portal KH', onClick: () => navigate(`/pm/construction/projects/${p.id}/portal`) },
        { type: 'divider' },
        { key: 'cancel', label: '🚫 Hủy dự án', danger: true },
    ];

    const columns: ColumnsType<Project> = [
        {
            title: 'Dự án',
            key: 'project',
            render: (_, p) => (
                <div>
                    <a onClick={() => navigate(`/pm/construction/projects/${p.id}`)} style={{ fontWeight: 600 }}>
                        {p.code}
                    </a>
                    <div style={{ fontSize: 12, color: '#666' }}>{p.name}</div>
                    <Space size={4} style={{ marginTop: 2 }}>
                        <Tag style={{ fontSize: 10 }}>{p.type}</Tag>
                        <Text type="secondary" style={{ fontSize: 11 }}>{p.areaM2}m²</Text>
                    </Space>
                </div>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, p) => (
                <div>
                    <Text>{p.customerName}</Text>
                    <div style={{ fontSize: 11, color: '#999' }}>{p.address.split(',').slice(-2).join(',').trim()}</div>
                </div>
            ),
        },
        {
            title: 'Thợ phụ trách',
            key: 'workers',
            render: (_, p) => (
                <Space>
                    {p.workerNames.map((n, i) => (
                        <Tooltip key={i} title={n}>
                            <Avatar size={28} style={{ background: '#fa8c16' }} icon={<UserOutlined />} />
                        </Tooltip>
                    ))}
                    {p.workerNames.length === 0 && <Text type="secondary" style={{ fontSize: 12 }}>Chưa giao</Text>}
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, p) => {
                const s = STATUS_CONFIG[p.status];
                return (
                    <div>
                        <Tag color={s.color}>{s.label}</Tag>
                        {p.incidents.filter(i => !i.isResolved).length > 0 && (
                            <Tooltip title="Có sự cố chưa xử lý">
                                <ExclamationCircleOutlined style={{ color: '#fa8c16', marginLeft: 4 }} />
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Tiến độ',
            key: 'progress',
            width: 160,
            render: (_, p) => {
                const pct = getProjectProgress(p);
                return (
                    <div>
                        <Progress
                            percent={pct}
                            size="small"
                            status={p.status === 'CANCELLED' ? 'exception' : pct === 100 ? 'success' : 'active'}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {p.steps.filter(s => s.status === 'APPROVED').length}/{p.steps.length} bước
                        </Text>
                    </div>
                );
            },
        },
        {
            title: 'Thời gian',
            key: 'dates',
            render: (_, p) => (
                <div style={{ fontSize: 12 }}>
                    <div><ClockCircleOutlined /> {p.startDate}</div>
                    <div style={{ color: '#999' }}>→ {p.plannedEndDate}</div>
                </div>
            ),
        },
        {
            title: '',
            key: 'actions',
            width: 48,
            render: (_, p) => (
                <Dropdown menu={{ items: getRowActions(p) }} placement="bottomRight" trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Danh sách Dự án Thi công</Title>
                    <Text type="secondary">PM: Nguyễn Văn PM – {mockProjects.length} dự án</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/pm/construction/projects/create')}>
                    Tạo Dự án
                </Button>
            </div>

            {/* KPI Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                {[
                    { label: 'Tổng dự án', value: kpi.total, color: '#1976D2', filter: 'ALL' as const },
                    { label: 'Đang thi công', value: kpi.inProgress, color: '#fa8c16', filter: 'IN_PROGRESS' as ProjectStatus },
                    { label: '⚠️ Chờ vật tư', value: kpi.waitingMaterials, color: '#ff7b00', filter: 'WAITING_MATERIALS' as ProjectStatus },
                    { label: 'Hoàn thành', value: kpi.completed, color: '#52c41a', filter: 'COMPLETED' as ProjectStatus },
                ].map((k, i) => (
                    <Col span={6} key={i}>
                        <Card hoverable onClick={() => setFilterStatus(k.filter as any)} style={{ borderLeft: `3px solid ${k.color}`, cursor: 'pointer' }}>
                            <Statistic title={k.label} value={k.value} valueStyle={{ color: k.color }} />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card>
                {/* Filter Bar */}
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    <Col flex="auto">
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Tìm dự án, KH, mã DA..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col>
                        <Select
                            style={{ width: 200 }}
                            value={filterStatus}
                            onChange={setFilterStatus}
                            options={[
                                { value: 'ALL', label: 'Tất cả trạng thái' },
                                ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
                            ]}
                        />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={{ pageSize: 10, showTotal: t => `${t} dự án` }}
                    size="middle"
                    scroll={{ x: 900 }}
                />
            </Card>
        </div>
    );
};

export default PMProjectList;
