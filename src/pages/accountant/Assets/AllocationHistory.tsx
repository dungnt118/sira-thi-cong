import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Typography, Table, Button, Tag, Card, Row, Col,
    Statistic, Input, Steps, Space, Badge, DatePicker, message, Grid, List
} from 'antd';
import {
    ClockCircleOutlined, CheckCircleOutlined,
    CarryOutOutlined, SearchOutlined, PlusOutlined, EditOutlined, 
    EyeOutlined, UserOutlined, CalendarOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { assetAllocationService } from '../../../services/core-contracts/services/assetAllocation.service';
import { content_segment_group_count } from '../../../store/actions/data/data.action';
import type { IAssetAllocation, AssetAllocationStatusEnum } from '../../../services/core-contracts/types/assetAllocation.types';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import _ from 'lodash';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const STATUS_STEPS = [
    { key: 'ALL', title: 'Tất cả' },
    { key: 'requested', title: 'Chờ duyệt' },
    { key: 'approved', title: 'Đã duyệt (Chờ ký)' },
    { key: 'received', title: 'Đang mượn' },
    { key: 'returned', title: 'Đã hoàn trả' },
];

const AssetAllocationHistory: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // ─── State Management ──────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [allocations, setAllocations] = useState<IAssetAllocation[]>([]);
    const [activeStatus, setActiveStatus] = useState('ALL');
    const [searchText, setSearchText] = useState('');
    
    // Filtering states
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);

    // Pagination state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Stats
    const [stepCounts, setStepCounts] = useState<Record<string, number>>({});

    // ─── Query Logic ──────────────────────────────────────────
    
    const buildFilter = useCallback((override?: any) => {
        const currentStatus = override?.status !== undefined ? override.status : activeStatus;
        const currentSearch = override?.search !== undefined ? override.search : searchText;
        const [start, end] = dateRange;

        const children: any[] = [];

        if (currentStatus && currentStatus !== 'ALL') {
            children.push({ id: 'status', operation: 'eq', value: currentStatus });
        }

        if (start) {
            children.push({ id: 'createdAt', operation: 'gte', value: { date: start.startOf('day').toISOString() } });
        }
        if (end) {
            children.push({ id: 'createdAt', operation: 'lte', value: { date: end.endOf('day').toISOString() } });
        }

        if (currentSearch) {
            children.push({ id: 'code', operation: 'contains', value: currentSearch });
        }

        return children.length ? { op: 'AND', children } : undefined;
    }, [activeStatus, searchText, dateRange]);

    const fetchAllocations = async (currentParams?: any) => {
        setLoading(true);
        const { page = pagination.current, pageSize = pagination.pageSize, ...overrides } = currentParams || {};

        try {
            const filterGroup = buildFilter(overrides);
            const res = await assetAllocationService.queryAssetAllocationsDto({
                group: filterGroup,
                limit: pageSize,
                skip: (page - 1) * pageSize,
                sorted: [{ id: 'createdAt', desc: true }]
            } as any);

            if (res.data) {
                setAllocations(res.data);
                setPagination(prev => ({ 
                    ...prev, 
                    current: page, 
                    pageSize, 
                    total: res.records || res.data?.length || 0 
                }));
            }
        } catch (error) {
            message.error('Không thể tải lịch sử cấp phát');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const filterGroup = buildFilter({ status: 'ALL' });
            const countsRes = await content_segment_group_count({ 
                field: 'status',
                filter: { target_schema: 'AssetAllocation', group: filterGroup } 
            } as any);
            
            if (countsRes.data) {
                const counts: Record<string, number> = {};
                let total = 0;
                countsRes.data.forEach(item => {
                    counts[item.key] = item.count;
                    total += item.count;
                });
                setStepCounts({ ...counts, ALL: total });
            }
        } catch (error) {
            console.error('Lỗi fetch stats:', error);
        }
    };

    const debouncedFetch = useCallback(
        _.debounce((search: string) => fetchAllocations({ page: 1, search }), 500),
        [dateRange, activeStatus]
    );

    useEffect(() => {
        fetchAllocations({ page: 1 });
        fetchStats();
    }, [activeStatus, dateRange]);

    const handleSearchChange = (val: string) => {
        setSearchText(val);
        debouncedFetch(val);
    };

    const getStatusTag = (s: AssetAllocationStatusEnum) => {
        const colors: Record<string, string> = {
            'requested': 'processing',
            'approved': 'cyan',
            'received': 'blue',
            'returned': 'success',
            'completed': 'success',
            'rejected': 'error'
        };
        const labels: Record<string, string> = {
            'requested': 'Đợi Duyệt',
            'approved': 'Đợi Ký Nhận',
            'received': 'Đang Sử Dụng',
            'returned': 'Đã Trả',
            'completed': 'Hoàn Tất',
            'rejected': 'Từ Chối'
        };
        return <Tag color={colors[s] || 'default'} style={{ margin: 0 }}>{(labels[s] || s).toUpperCase()}</Tag>;
    };

    const columns = [
        { 
            title: 'Mã phiếu', 
            dataIndex: 'code', 
            key: 'code', 
            width: 140,
            render: (t: string, r: IAssetAllocation) => (
                <Button type="link" onClick={() => navigate(`/kt/assets/allocation/${r._id}`)} style={{ padding: 0 }}>
                    <Text strong>{t || 'ALLOC-ORD'}</Text>
                </Button>
            )
        },
        { 
            title: 'Tài sản', 
            key: 'asset', 
            minWidth: 200,
            render: (_: any, r: IAssetAllocation) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.asset_name || 'Tài sản lẻ'}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{r.asset_code}</Text>
                </Space>
            ) 
        },
        { 
            title: 'Người yêu cầu', 
            dataIndex: 'requested_by', 
            key: 'reqBy',
            width: 150,
            render: (v: any) => (
                <Space size={4}>
                    <UserOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
                    <Text style={{ fontSize: 13 }}>{v?.displayName || v?.email || v || '—'}</Text>
                </Space>
            )
        },
        { 
            title: 'Hành trình', 
            dataIndex: 'journey_name', 
            key: 'proj', 
            render: (v: string) => v || '—' 
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'st',
            width: 130,
            render: (s: AssetAllocationStatusEnum) => getStatusTag(s)
        },
        { 
            title: 'Ngày mượn', 
            dataIndex: 'request_date', 
            key: 'date', 
            width: 120,
            render: (d: any) => d ? dayjs(d).format('DD/MM/YY') : '—' 
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right' as const,
            width: 100,
            render: (_: any, r: IAssetAllocation) => (
                <Button
                    type={r.status === 'requested' || r.status === 'approved' ? 'primary' : 'default'}
                    size="small"
                    onClick={() => navigate(`/kt/assets/allocation/${r._id}`)}
                >
                    {r.status === 'requested' ? 'Duyệt' : (r.status === 'approved' ? 'Ký nhận' : 'Xem')}
                </Button>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>🔄 Quản lý Cấp phát & Mượn tài sản</Title>
                    <Text type="secondary">Theo dõi nhật ký giao nhận, thu hồi máy móc thiết bị</Text>
                </div>
                <Space wrap>
                    <RangePicker 
                        value={dateRange}
                        onChange={(val) => setDateRange(val as any)}
                        presets={[
                            { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
                            { label: 'Năm nay', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
                        ]}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/kt/assets/allocation')}>
                        Tạo yêu cầu mượn
                    </Button>
                </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Cần Kế toán duyệt" value={stepCounts.requested || 0} valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Chờ người mượn ký" value={stepCounts.approved || 0} valueStyle={{ color: '#eb2f96' }} prefix={<CarryOutOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Đang sử dụng" value={stepCounts.received || 0} valueStyle={{ color: '#1890ff' }} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Tổng cộng" value={stepCounts.ALL || 0} />
                    </Card>
                </Col>
            </Row>

            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '0 24px', borderBottom: '1px solid #f0f0f0', overflowX: 'auto' }}>
                    <Steps
                        type="navigation"
                        size="small"
                        current={STATUS_STEPS.findIndex(s => s.key === activeStatus)}
                        onChange={idx => setActiveStatus(STATUS_STEPS[idx].key)}
                        style={{ borderBottom: 'none', minWidth: 600 }}
                        items={STATUS_STEPS.map((s, index) => ({
                            title: (
                                <Space size="small">
                                    {s.title}
                                    <Badge count={stepCounts[s.key] || 0} showZero style={{
                                        backgroundColor: activeStatus === s.key ? '#1890ff' : '#f0f0f0',
                                        color: activeStatus === s.key ? '#fff' : '#8c8c8c',
                                        boxShadow: 'none',
                                        fontSize: 10
                                    }} />
                                </Space>
                            ),
                            icon: <div style={{ width: 0, overflow: 'hidden' }} />
                        }))}
                    />
                </div>

                <div style={{ padding: '20px 24px' }}>
                    <div style={{ marginBottom: 20 }}>
                        <Input
                            placeholder="Tìm mã phiếu, tài sản, người mượn..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => handleSearchChange(e.target.value)}
                            style={{ width: isMobile ? '100%' : 350 }}
                            allowClear
                        />
                    </div>

                    {!isMobile ? (
                        <Table
                            rowKey="_id"
                            dataSource={allocations}
                            loading={loading}
                            columns={columns}
                            pagination={{
                                ...pagination,
                                showSizeChanger: true,
                                onChange: (p, s) => fetchAllocations({ page: p, pageSize: s })
                            }}
                            scroll={{ x: 'max-content' }}
                        />
                    ) : (
                        <List
                            dataSource={allocations}
                            loading={loading}
                            pagination={{
                                ...pagination,
                                size: 'small',
                                onChange: (page, pageSize) => fetchAllocations({ page, pageSize })
                            }}
                            renderItem={(item) => (
                                <List.Item style={{ padding: '12px 0' }}>
                                    <Card size="small" style={{ width: '100%', borderRadius: 12 }} onClick={() => navigate(`/kt/assets/allocation/${item._id}`)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text strong>{item.code || 'ALLOC'}</Text>
                                            {getStatusTag(item.status || 'requested')}
                                        </div>
                                        <div style={{ marginBottom: 4 }}>
                                            <Text strong style={{ fontSize: 13 }}>{item.asset_name}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Người mượn:</Text>
                                            <Text style={{ fontSize: 13 }}>{item.requested_by?.displayName || item.requested_by || '—'}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Hành trình:</Text>
                                            <Text style={{ fontSize: 12 }}>{item.journey_name || '—'}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #f0f0f0', paddingTop: 8 }}>
                                            <Text type="secondary" style={{ fontSize: 11 }}><CalendarOutlined /> Mượn: {item.request_date ? dayjs(item.request_date).format('DD/MM/YY') : '—'}</Text>
                                            <ArrowRightOutlined style={{ color: '#bfbfbf', fontSize: 12 }} />
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AssetAllocationHistory;
