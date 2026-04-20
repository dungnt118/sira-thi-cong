import React, { useState, useEffect, useMemo } from 'react';
import {
    Table, Card, Button, Tag, Input, Select, Space, Row, Col,
    Statistic, Badge, Avatar, Typography, Tooltip, Grid, Empty, Drawer,
    Modal, message, Popconfirm, Dropdown, Menu, Progress
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined, AppstoreOutlined, UnorderedListOutlined,
    AlertOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
    MessageOutlined, ReloadOutlined, UserOutlined, FilterOutlined,
    StopOutlined, PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined,
    EyeOutlined, LayoutOutlined, DashboardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import type { IJourney, ICreateJourneyInput } from '../../../services/core-contracts/types/journey.types';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { useAuth } from '../../../hooks/useAuth';
import JourneyUpsertDrawer from '../../../components/journey/JourneyUpsertDrawer';
import { buildJourneyBoardRoute, buildJourneyDetailRoute } from '@/utils/adminRoutes';

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
    { key: 'lead_new', label: 'Tiếp nhận', color: 'cyan' },
    { key: 'consult_contact', label: 'Tư vấn', color: 'blue' },
    { key: 'site_survey', label: 'Khảo sát', color: 'geekblue' },
    { key: 'solution_design', label: 'Giải pháp', color: 'purple' },
    { key: 'quotation', label: 'Báo giá', color: 'magenta' },
    { key: 'contract', label: 'Hợp đồng', color: 'gold' },
    { key: 'execution', label: 'Thi công', color: 'orange' },
    { key: 'final_acceptance', label: 'Nghiệm thu', color: 'volcano' },
    { key: 'payment', label: 'Thanh toán', color: 'green' },
    { key: 'maintenance', label: 'Bảo trì', color: 'lime' },
    { key: 'warranty', label: 'Bảo hành', color: 'processing' },
    { key: 'after_sales', label: 'Hậu mãi', color: 'default' },
];


const JourneyList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const { user } = useAuth();

    const renderUserGroupNames = (users: any) => {
        if (!users) return [];
        const userList = Array.isArray(users) ? users : [users];
        return userList.map(u => {
            if (typeof u === 'string') return u;
            return u.title || u.name || u.full_name || u.username || 'N/A';
        }).filter(Boolean);
    };

    const renderPersonnelMobile = (j: IJourney) => {
        const kd = renderUserGroupNames(j.sale_users);
        const gs = renderUserGroupNames(j.supervisor_users);
        const kt = renderUserGroupNames(j.technical_users);

        if (kd.length === 0 && gs.length === 0 && kt.length === 0) return null;

        return (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {kd.length > 0 && <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>KD: {kd[0]}{kd.length > 1 ? '...' : ''}</Tag>}
                {gs.length > 0 && <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>GS: {gs[0]}{gs.length > 1 ? '...' : ''}</Tag>}
                {kt.length > 0 && <Tag color="cyan" style={{ fontSize: 10, margin: 0 }}>KT: {kt[0]}{kt.length > 1 ? '...' : ''}</Tag>}
            </div>
        );
    };

    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [filterSla, setFilterSla] = useState<string>('ALL');
    const [filterPriority, setFilterPriority] = useState<string>('ALL');
    const [filterStep, setFilterStep] = useState<string>('ALL');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // CRUD state
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingJourney, setEditingJourney] = useState<IJourney | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch journeys from real backend
    const fetchJourneys = async () => {
        setIsLoading(true);
        try {
            const filter: any = {};
            if (keyword) filter.keyword = keyword;
            if (filterSla !== 'ALL') filter.sla_status = filterSla;
            if (filterPriority !== 'ALL') filter.priority = filterPriority;
            if (filterStep !== 'ALL') filter.current_step = filterStep;

            const res = await journeyService.queryJourneysDto(filter);

            if (res.code === 0 && res.data) {
                setJourneys(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch journeys:', error);
            message.error('Không thể tải danh sách công trình');
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

    const handleCreate = () => {
        setEditingJourney(null);
        setIsFormVisible(true);
    };

    const handleEdit = (record: IJourney) => {
        setEditingJourney(record);
        setIsFormVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const success = await journeyService.deleteJourney(id);
            if (success) {
                message.success('Đã xóa công trình');
                fetchJourneys();
            }
        } catch (error) {
            message.error('Lỗi khi xóa công trình');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRowKeys.length === 0) return;
        Modal.confirm({
            title: `Xác nhận xóa ${selectedRowKeys.length} công trình?`,
            onOk: async () => {
                try {
                    const success = await journeyService.deleteMultiJourney(selectedRowKeys as string[]);
                    if (success) {
                        message.success('Đã xóa các công trình đã chọn');
                        setSelectedRowKeys([]);
                        fetchJourneys();
                    }
                } catch (error) {
                    message.error('Lỗi khi xóa hàng loạt');
                }
            }
        });
    };

    const handleFormSubmit = async (values: ICreateJourneyInput) => {
        setIsSubmitting(true);
        try {
            if (editingJourney) {
                await journeyService.updateJourney(editingJourney._id, values);
                message.success('Đã cập nhật công trình');
            } else {
                await journeyService.createJourney(values);
                message.success('Đã tạo công trình mới');
            }
            setIsFormVisible(false);
            fetchJourneys();
        } catch (error) {
            console.error('Submit error:', error);
            message.error(editingJourney ? 'Lỗi khi cập nhật' : 'Lỗi khi tạo mới');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filtered = useMemo(() => {
        // queryJourneysDto already applies server-side filters if we use them, 
        // but for keyword search specifically, we might need to refetch.
        // Current implementation refetches on keyword change in useEffect.
        return journeys;
    }, [journeys]);

    const kpis = useMemo(() => ({
        total_open: journeys.length,
        overdue_sla: journeys.filter(j => j.sla_status === 'overdue').length,
        blocked: journeys.filter(j => (j.blocked_task_count || 0) > 0).length,
        unread_threads: journeys.reduce((acc, j) => acc + (j.unread_thread_count || 0), 0),
    }), [journeys]);

    const columns: ColumnsType<IJourney> = [
        {
            title: 'Công trình',
            key: 'journey',
            render: (_, j) => (
                <div>
                    <div
                        style={{ fontWeight: 600, color: '#1976D2', cursor: 'pointer', marginBottom: 2 }}
                        onClick={() => navigate(buildJourneyDetailRoute('ql', j._id))}
                    >
                        {j.journey_code || 'N/A'}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{j.idx_customer_id?.title || j.customer_full_name || 'Khách hàng ẩn danh'}</Text>
                </div>
            ),
        },
        {
            title: 'Yêu cầu / Dịch vụ',
            key: 'request',
            render: (_, j) => (
                <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{j.request_title}</div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{j.idx_serviceTypeId?.title}</Text>
                </div>
            ),
        },
        {
            title: 'Bước hiện tại',
            key: 'step',
            render: (_, j) => {
                const index = JOURNEY_STEPS_CONFIG.findIndex(c => c.key === j.current_step);
                const config = JOURNEY_STEPS_CONFIG[index];
                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={config?.color || 'default'} style={{ margin: 0 }}>
                            {config?.label || j.current_step || 'Khởi tạo'}
                        </Tag>
                        {index >= 0 && (
                            <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                                Giai đoạn: <span style={{ color: '#1890ff', fontWeight: 600 }}>{index + 1}</span>/{JOURNEY_STEPS_CONFIG.length}
                            </Text>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Tiến độ',
            key: 'progress',
            width: 140,
            render: (_, j) => (
                <div style={{ width: 100 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Text style={{ fontSize: 11 }}>Hoàn thành</Text>
                        <Text strong style={{ fontSize: 11 }}>{j.progress_pct || 0}%</Text>
                    </div>
                    <Progress 
                        percent={j.progress_pct || 0} 
                        size="small" 
                        showInfo={false} 
                        strokeColor="#52c41a"
                        strokeWidth={6}
                    />
                </div>
            ),
        },
        {
            title: 'Nhân sự',
            key: 'personnel',
            width: 220,
            render: (_, j) => {
                const renderUserGroup = (label: string, users: any, color: string) => {
                    const names = renderUserGroupNames(users);
                    if (names.length === 0) return null;
                    
                    return (
                        <div style={{ marginBottom: 2, display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                            <Tag color={color} style={{ margin: 0, fontSize: 9, padding: '0 4px', height: 16, lineHeight: '14px' }}>{label}</Tag>
                            <Text style={{ fontSize: 11, lineHeight: '16px' }} ellipsis={{ tooltip: names.join(', ') }}>
                                {names.join(', ')}
                            </Text>
                        </div>
                    );
                };

                const hasPersonnel = j.sale_users || j.supervisor_users || j.technical_users;

                return (
                    <div style={{ minWidth: 150 }}>
                        {renderUserGroup('KD', j.sale_users, 'blue')}
                        {renderUserGroup('GS', j.supervisor_users, 'orange')}
                        {renderUserGroup('KT', j.technical_users, 'cyan')}
                        {!hasPersonnel && (
                            <Space>
                                <Avatar size={20} icon={<UserOutlined />} />
                                <Text type="secondary" style={{ fontSize: 12 }}>Chưa gán</Text>
                            </Space>
                        )}
                    </div>
                );
            },
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
            title: 'Cập nhật',
            key: 'updated',
            render: (_, j) => {
                const date = j.last_activity_at ? new Date(j.last_activity_at).toLocaleDateString('vi-VN') : 'N/A';
                return <Text type="secondary" style={{ fontSize: 11 }}>{date}</Text>;
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 80,
            fixed: 'right',
            render: (_, j) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="view" icon={<EyeOutlined />} onClick={(e) => { e.domEvent.stopPropagation(); navigate(buildJourneyDetailRoute('ql', j._id)); }}>Chi tiết</Menu.Item>
                            <Menu.Item key="edit" icon={<EditOutlined />} onClick={(e) => { e.domEvent.stopPropagation(); handleEdit(j); }}>Chỉnh sửa</Menu.Item>
                            <Menu.Item key="board" icon={<LayoutOutlined />} onClick={(e) => { e.domEvent.stopPropagation(); navigate(buildJourneyBoardRoute('ql', `id=${j._id}`)); }}>Kanban</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                                <Popconfirm
                                    title="Xóa công trình này?"
                                    onConfirm={(e) => {
                                        e?.stopPropagation();
                                        handleDelete(j._id);
                                    }}
                                    onCancel={(e) => e?.stopPropagation()}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                >
                                    <span onClick={(e) => e.stopPropagation()} style={{ display: 'block' }}>Xóa</span>
                                </Popconfirm>
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={12}>
                    <h2 style={{ margin: 0 }}>Danh sách công trình Khách hàng</h2>
                    <Text type="secondary">Quản lý toàn bộ công trình dịch vụ theo cấu hình chuẩn 12 bước</Text>
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <Space wrap>
                        <Tooltip title="Thêm công trình mới">
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>Tạo yêu cầu</Button>
                        </Tooltip>
                        <Tooltip title="Xem dạng Board">
                            <Button icon={<LayoutOutlined />} onClick={() => navigate('/admin/ql/journeys/board')}>{isMobile ? '' : 'Board'}</Button>
                        </Tooltip>
                        <Tooltip title="Action Center">
                            <Button icon={<AlertOutlined />} onClick={() => navigate('/admin/ql/journeys/action-center')}>{isMobile ? '' : 'Action'}</Button>
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
                            placeholder="Tìm kiếm công trình..."
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
                    <Col>
                        {selectedRowKeys.length > 0 && (
                            <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete}>
                                Xóa {selectedRowKeys.length}
                            </Button>
                        )}
                    </Col>
                </Row>

                {isMobile ? (
                    /* Mobile Card List */
                    <div>
                        {filtered.map(j => (
                            <Card
                                key={j._id}
                                size="small"
                                style={{ marginBottom: 12, cursor: 'pointer', borderRadius: 8 }}
                                onClick={() => navigate(buildJourneyDetailRoute('ql', j._id))}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <Text strong style={{ color: '#1976D2' }}>{j.journey_code || 'N/A'}</Text>
                                        <div style={{ fontWeight: 500, marginTop: 2 }}>{j.idx_customer_id?.title || j.customer_full_name || 'N/A'}</div>
                                        <Text type="secondary" style={{ fontSize: 11 }}>{j.request_title}</Text>
                                        <div style={{ marginTop: 4 }}>
                                            <Tag color="cyan">{j.idx_serviceTypeId?.title || 'Dịch vụ lẻ'}</Tag>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Tag color={JOURNEY_STEPS_CONFIG.find(c => c.key === j.current_step)?.color}>
                                            {JOURNEY_STEPS_CONFIG.find(c => c.key === j.current_step)?.label || j.current_step}
                                        </Tag>
                                        <div style={{ marginTop: 4 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                                <Text style={{ fontSize: 10 }}>Tiến độ</Text>
                                                <Text strong style={{ fontSize: 10 }}>{j.progress_pct || 0}%</Text>
                                            </div>
                                            <Progress percent={j.progress_pct || 0} size="small" showInfo={false} strokeColor="#52c41a" strokeWidth={4} />
                                        </div>
                                        <div style={{ marginTop: 4 }}>
                                            <Badge status={SLA_CONFIG[j.sla_status || 'on_time'].color as any} text={SLA_CONFIG[j.sla_status || 'on_time'].label} />
                                        </div>
                                    </div>
                                </div>
                                {renderPersonnelMobile(j)}
                            </Card>
                        ))}
                        {filtered.length === 0 && <Empty description="Không có công trình nào" />}
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        rowKey="_id"
                        pagination={{ pageSize: 15, showTotal: (t) => `${t} công trình` }}
                        locale={{ emptyText: <Empty description="Không có công trình nào phù hợp bộ lọc" /> }}
                        size="small"
                        loading={isLoading}
                        onRow={(j) => ({
                            onClick: () => navigate(buildJourneyDetailRoute('ql', j._id)),
                            style: { cursor: 'pointer' }
                        })}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: setSelectedRowKeys,
                        }}
                    />
                )}
            </Card>

            {/* Create/Edit Drawer */}
            <JourneyUpsertDrawer
                open={isFormVisible}
                mode="pm"
                journey={editingJourney}
                currentUsername={user?._id || undefined}
                saving={isSubmitting}
                onCancel={() => setIsFormVisible(false)}
                onSubmit={handleFormSubmit}
            />

            {/* DLG-01 Filter Drawer (Mobile) */}
            <Drawer
                title="Bộ lọc công trình"
                placement="right"
                onClose={() => setIsFilterVisible(false)}
                open={isFilterVisible}
                width={300}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <Text strong>Tìm kiếm</Text>
                        <Input
                            placeholder="Từ khóa..."
                            prefix={<SearchOutlined />}
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            style={{ marginTop: 8 }}
                        />
                    </div>
                    <div>
                        <Text strong>Bước hiện tại</Text>
                        <Select
                            style={{ width: '100%', marginTop: 8 }}
                            value={filterStep}
                            onChange={(v) => { setFilterStep(v); }}
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
                            onChange={(v) => { setFilterSla(v); }}
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
                            onChange={(v) => { setFilterPriority(v); }}
                            options={[
                                { value: 'ALL', label: 'Tất cả ưu tiên' },
                                ...Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => ({ value: val, label: cfg.label }))
                            ]}
                        />
                    </div>
                    <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                        <Button type="primary" block onClick={() => setIsFilterVisible(false)}>Áp dụng</Button>
                        <Button block onClick={() => { setKeyword(''); setFilterSla('ALL'); setFilterPriority('ALL'); setFilterStep('ALL'); setIsFilterVisible(false); }}>Xóa bộ lọc</Button>
                    </Space>
                </div>
            </Drawer>
        </div>
    );
};

export default JourneyList;
