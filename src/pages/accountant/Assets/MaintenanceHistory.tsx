import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Table, Tag, Card, Row, Col,
    Statistic, Input, Steps, Space, Badge, DatePicker, message, Button,
    Tooltip
} from 'antd';
import {
    ClockCircleOutlined, CheckCircleOutlined,
    SyncOutlined, CloseCircleOutlined, SearchOutlined,
    PlusOutlined, EditOutlined, ToolOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { assetMaintenanceTicketService } from '../../../services/core-contracts/services/assetMaintenanceTicket.service';
import { content_segment_count_by_status } from '../../../store/actions/data/data.action';
import type { IAssetMaintenanceTicket, AssetMaintenanceTicketStatusEnum } from '../../../services/core-contracts/types/assetMaintenanceTicket.types';
import MaintenanceTicketModal from './components/MaintenanceTicketModal';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import _ from 'lodash';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const STATUS_STEPS = [
    { key: 'ALL', title: 'Tất cả' },
    { key: 'planned', title: 'Lên lịch' },
    { key: 'in_progress', title: 'Đang sửa' },
    { key: 'completed', label: 'Xong', title: 'Hoàn tất' },
    { key: 'cancelled', title: 'Hủy bỏ' },
];

const MaintenanceHistory: React.FC = () => {
    // ─── State Management ──────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState<IAssetMaintenanceTicket[]>([]);
    const [activeStatus, setActiveStatus] = useState('ALL');
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);

    const [pagination, setPagination] = useState({ current: 1, pageSize: 15, total: 0 });
    const [stepCounts, setStepCounts] = useState<Record<string, number>>({});
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<IAssetMaintenanceTicket | null>(null);

    // ─── Data Fetching ─────────────────────────────────────────
    
    const fetchStats = async () => {
        try {
            const res = await content_segment_count_by_status({ 
                filter: { target_schema: 'AssetMaintenanceTicket' } 
            } as any);
            if (res.data) {
                const counts: Record<string, number> = {};
                let total = 0;
                res.data.forEach(item => {
                    counts[item.key] = item.count;
                    total += item.count;
                });
                setStepCounts({ ...counts, ALL: total });
            }
        } catch (error) {
            console.error('Lỗi fetch stats:', error);
        }
    };

    const fetchTickets = useCallback(async (overrides?: any) => {
        setLoading(true);
        const { page = pagination.current, pageSize = pagination.pageSize, status = activeStatus, search = searchText } = overrides || {};
        
        try {
            const [start, end] = dateRange;
            const children: any[] = [];
            
            if (status !== 'ALL') {
                children.push({ id: 'status', operation: 'eq', value: status });
            }
            if (start) {
                children.push({ id: 'maintenance_date', operation: 'gte', value: { date: start.startOf('day').toISOString() } });
            }
            if (end) {
                children.push({ id: 'maintenance_date', operation: 'lte', value: { date: end.endOf('day').toISOString() } });
            }
            if (search) {
                // If the search looks like a code, search by code OR asset_id
                children.push({ id: 'code', operation: 'contains', value: search });
            }

            const res = await assetMaintenanceTicketService.queryAssetMaintenanceTicketsDto({
                group: children.length ? { op: 'AND', children } : undefined,
                limit: pageSize,
                skip: (page - 1) * pageSize,
                sorted: [{ id: 'maintenance_date', desc: true }]
            } as any);

            if (res.data) {
                setTickets(res.data);
                setPagination(prev => ({ ...prev, current: page, total: res.records || res.data.length }));
            }
        } catch (error) {
            message.error('Không thể tải lịch sử bảo trì');
        } finally {
            setLoading(false);
        }
    }, [activeStatus, dateRange, searchText, pagination.pageSize]);

    useEffect(() => {
        fetchTickets({ page: 1 });
        fetchStats();
    }, [activeStatus, dateRange]);

    const debouncedSearch = useCallback(
        _.debounce((val: string) => fetchTickets({ page: 1, search: val }), 500),
        [fetchTickets]
    );

    // ─── Table Columns ─────────────────────────────────────────

    const columns = [
        { 
            title: 'Mã phiếu', 
            dataIndex: 'code', 
            key: 'code', 
            render: (t: string) => <Text strong>{t || 'MAINT-ORD'}</Text> 
        },
        { 
            title: 'Tài sản', 
            key: 'asset', 
            render: (_: any, r: IAssetMaintenanceTicket) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.idx_asset_id?.displayName || 'Tài sản lẻ'}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{r.asset_id}</Text>
                </Space>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'st',
            render: (s: AssetMaintenanceTicketStatusEnum) => {
                const themes: Record<string, { color: string, icon: any, label: string }> = {
                    'planned': { color: 'default', icon: <ClockCircleOutlined />, label: 'Lên lịch' },
                    'in_progress': { color: 'processing', icon: <SyncOutlined spin />, label: 'Đang sửa' },
                    'completed': { color: 'success', icon: <CheckCircleOutlined />, label: 'Hoàn tất' },
                    'cancelled': { color: 'error', icon: <CloseCircleOutlined />, label: 'Đã hủy' },
                };
                const theme = themes[s] || themes['planned'];
                return <Tag color={theme.color} icon={theme.icon}>{theme.label.toUpperCase()}</Tag>;
            }
        },
        { 
            title: 'Ngày bảo trì', 
            dataIndex: 'maintenance_date', 
            key: 'date', 
            render: (d: any) => d ? dayjs(d).format('DD/MM/YYYY') : '—' 
        },
        { 
            title: 'Chi phí', 
            dataIndex: 'cost_amount', 
            key: 'cost', 
            align: 'right' as const,
            render: (v: number) => v ? <span>{(v).toLocaleString()}đ</span> : '—'
        },
        { 
            title: 'Đối tác', 
            dataIndex: 'maintenance_partner_id', 
            key: 'partner',
            render: (v: string) => v || 'Nội bộ'
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right' as const,
            width: 80,
            render: (_: any, r: IAssetMaintenanceTicket) => (
                <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={() => { setEditingTicket(r); setIsModalOpen(true); }} 
                />
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>🛠️ Nhật ký Bảo trì & Sửa chữa</Title>
                    <Text type="secondary">Quản lý các đợt kiểm tra, bảo dưỡng định kỳ và khắc phục hư hỏng</Text>
                </div>
                <Space wrap>
                    <RangePicker 
                        value={dateRange}
                        onChange={val => setDateRange(val as any)}
                        presets={[
                            { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
                        ]}
                    />
                    <Button icon={<ReloadOutlined />} onClick={() => { fetchStats(); fetchTickets(); }}>Làm mới</Button>
                </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Đang sửa chữa" value={stepCounts.in_progress || 0} valueStyle={{ color: '#1890ff' }} prefix={<SyncOutlined spin />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Đã hoàn tất (tháng)" value={stepCounts.completed || 0} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Kế hoạch sắp tới" value={stepCounts.planned || 0} prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Tổng ngân sách" value={tickets.reduce((s, t) => s + (t.cost_amount || 0), 0)} suffix="đ" />
                    </Card>
                </Col>
            </Row>

            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
                    <Steps
                        type="navigation"
                        size="small"
                        current={STATUS_STEPS.findIndex(s => s.key === activeStatus)}
                        onChange={idx => setActiveStatus(STATUS_STEPS[idx].key)}
                        style={{ borderBottom: 'none' }}
                        items={STATUS_STEPS.map((s, index) => ({
                            title: (
                                <Space size="small">
                                    {s.title}
                                    <Badge count={stepCounts[s.key] || 0} showZero style={{
                                        backgroundColor: activeStatus === s.key ? '#1890ff' : '#f0f0f0',
                                        color: activeStatus === s.key ? '#fff' : '#8c8c8c',
                                        boxShadow: 'none'
                                    }} />
                                </Space>
                            ),
                        }))}
                    />
                </div>

                <div style={{ padding: '20px 24px' }}>
                    <div style={{ marginBottom: 20 }}>
                        <Input
                            placeholder="Tìm mã phiếu hoặc mã tài sản..."
                            prefix={<SearchOutlined />}
                            onChange={e => { setSearchText(e.target.value); debouncedSearch(e.target.value); }}
                            style={{ width: 350 }}
                            allowClear
                        />
                    </div>

                    <Table
                        rowKey="_id"
                        dataSource={tickets}
                        loading={loading}
                        columns={columns}
                        pagination={{
                            ...pagination,
                            showSizeChanger: true,
                            onChange: (p, s) => fetchTickets({ page: p, pageSize: s })
                        }}
                    />
                </div>
            </Card>

            <MaintenanceTicketModal 
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={() => { setIsModalOpen(false); fetchStats(); fetchTickets(); }}
                initialValues={editingTicket}
            />
        </div>
    );
};

export default MaintenanceHistory;
