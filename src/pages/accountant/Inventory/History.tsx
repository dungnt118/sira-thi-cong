import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
    Typography, Table, Button, Tag, Card, Row, Col, 
    Statistic, Tabs, Input, Steps, Space, Badge, Grid, 
    List, message, Modal, Tooltip, DatePicker 
} from 'antd';
import {
    FileTextOutlined, ClockCircleOutlined,
    ImportOutlined, ExportOutlined, SearchOutlined,
    ArrowRightOutlined, FilePdfOutlined, DownloadOutlined,
    InfoCircleOutlined, UserOutlined, CalendarOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { stockOrderService } from '../../../services/core-contracts/services/stockOrder.service';
import { 
    content_segment_group_count, 
    content_numeric_aggregate 
} from '../../../store/actions/data/data.action';
import type { IStockOrder } from '../../../services/core-contracts/types/stockOrder.types';
import {
    classifyJourneyFile,
    getJourneyFileDisplayName,
    resolveJourneyFileHref,
    resolvePdfPreviewHref,
    type JourneyFileKind,
} from '../../../utils/journeyDocumentFileDisplay';
import { PdfViewer } from '../../../components/common/PdfViewer';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import _ from 'lodash';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

const SOURCE_LABELS: Record<string, string> = {
    internal: 'Nội bộ',
    distributor: 'Nhà phân phối',
    retail: 'Kho lẻ',
    journey: 'Hành trình',
    discrepancy: 'Điều chỉnh',
    manual: 'Thủ công',
    project: 'Công trình'
};

const STATUS_STEPS = [
    { key: 'draft', title: 'Nháp' },
    { key: 'requested', title: 'Cần duyệt' },
    { key: 'approved', title: 'Đang xử lý' },
    { key: 'completed', title: 'Hoàn thành' },
    { key: 'cancelled', title: 'Đã hủy/Lỗi' }
];

const InventoryHistory: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { role } = useAuth();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // ─── State Management ──────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [stockOrders, setStockOrders] = useState<IStockOrder[]>([]);
    
    // Initial states from URL params or defaults
    const [activeTabType, setActiveTabType] = useState<'out' | 'in'>(
        (searchParams.get('type') as 'out' | 'in') || 'out'
    );
    const [activeStep, setActiveStep] = useState<string>(
        searchParams.get('step') || 'requested'
    );
    
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

    // Stats states
    const [statAgg, setStatAgg] = useState({
        totalInValue: 0,
        totalOutValue: 0,
        pendingCount: 0,
        totalCount: 0
    });
    const [stepCounts, setStepCounts] = useState<Record<string, number>>({});

    const [filePreview, setFilePreview] = useState<{
        kind: JourneyFileKind;
        url: string;
        name: string;
    } | null>(null);

    // ─── Query Logic ──────────────────────────────────────────
    
    const buildFilter = useCallback((override?: any) => {
        const currentType = override?.type || activeTabType;
        const currentStep = override?.step !== undefined ? override.step : activeStep;
        const currentSearch = override?.search !== undefined ? override.search : searchText;
        const [start, end] = dateRange;

        const children: any[] = [{ id: 'type', operation: 'eq', value: currentType }];

        if (currentStep && currentStep !== 'ALL') {
            if (currentStep === 'approved') {
                children.push({ id: 'status', operation: 'in', value: ['approved', 'dispatched', 'received'] });
            } else if (currentStep === 'cancelled') {
                children.push({ id: 'status', operation: 'in', value: ['cancelled', 'discrepancy'] });
            } else {
                children.push({ id: 'status', operation: 'eq', value: currentStep });
            }
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

        // GraphQL Schema expects "group" to be an OBJECT with "children" and "op"
        return {
            op: 'AND',
            children: children
        };
    }, [activeTabType, activeStep, searchText, dateRange]);

    const fetchOrders = async (currentParams?: any) => {
        setLoading(true);
        const { page = pagination.current, pageSize = pagination.pageSize, ...overrides } = currentParams || {};

        try {
            const filterGroup = buildFilter(overrides);
            const res = await stockOrderService.queryStockOrdersDto({
                group: filterGroup,
                limit: pageSize,
                skip: (page - 1) * pageSize,
                sorted: [{ id: 'createdAt', desc: true }]
            } as any);

            if (res.data) {
                setStockOrders(res.data);
                setPagination(prev => ({ 
                    ...prev, 
                    current: page, 
                    pageSize, 
                    total: res.records || res.data?.length || 0 
                }));
            }
        } catch (error) {
            message.error('Không thể tải lịch sử kho');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const filterGroup = buildFilter({ step: 'ALL' });
            
            // 1. Get counts by status
            const countsRes = await content_segment_group_count({ 
                field: 'status',
                filter: { target_schema: 'StockOrder', group: filterGroup } 
            } as any);
            
            if (countsRes.data) {
                const counts: Record<string, number> = {};
                let total = 0;
                let pending = 0;
                
                countsRes.data.forEach(item => {
                    const status = item.key;
                    counts[status] = item.count;
                    total += item.count;
                    if (status === 'requested') pending += item.count;
                });
                
                const mappedStepCounts: Record<string, number> = {
                    draft: counts.draft || 0,
                    requested: counts.requested || 0,
                    approved: (counts.approved || 0) + (counts.dispatched || 0) + (counts.received || 0),
                    completed: counts.completed || 0,
                    cancelled: (counts.cancelled || 0) + (counts.discrepancy || 0)
                };
                
                setStepCounts(mappedStepCounts);
                setStatAgg(prev => ({ ...prev, totalCount: total, pendingCount: pending }));
            }

            // 2. Get financial sums
            // Fix: Create modified children for the stats to correctly count across types when calculated individually
            const baseChildren = filterGroup.children.filter(g => g.id !== 'type');
            
            const [inRes, outRes] = await Promise.all([
                content_numeric_aggregate({ 
                    field: 'total_value',
                    filter: { 
                        target_schema: 'StockOrder', 
                        group: { op: 'AND', children: [{ id: 'type', operation: 'eq', value: 'in' }, ...baseChildren] } 
                    } 
                } as any),
                content_numeric_aggregate({ 
                    field: 'total_value',
                    filter: { 
                        target_schema: 'StockOrder', 
                        group: { op: 'AND', children: [{ id: 'type', operation: 'eq', value: 'out' }, ...baseChildren] } 
                    } 
                } as any)
            ]);
            
            setStatAgg(prev => ({
                ...prev,
                totalInValue: inRes.data?.sum || 0,
                totalOutValue: outRes.data?.sum || 0
            }));

        } catch (error) {
            console.error('Lỗi fetch stats:', error);
        }
    };

    const debouncedFetch = useCallback(
        _.debounce((search: string) => fetchOrders({ page: 1, search }), 500),
        [dateRange, activeTabType, activeStep]
    );

    useEffect(() => {
        fetchOrders({ page: 1 });
        fetchStats();
    }, [activeTabType, activeStep, dateRange]);

    const handleSearchChange = (val: string) => {
        setSearchText(val);
        debouncedFetch(val);
    };

    const onTabChange = (key: string) => {
        const nextType = key as 'out' | 'in';
        setActiveTabType(nextType);
        setSearchParams(prev => {
            prev.set('type', nextType);
            return prev;
        });
    };

    const onStepChange = (idx: number) => {
        const nextStep = STATUS_STEPS[idx].key;
        setActiveStep(nextStep);
        setSearchParams(prev => {
            prev.set('step', nextStep);
            return prev;
        });
    };

    const handleCreateOrder = () => {
        const pathSuffix = activeTabType === 'out' ? 'stock-out' : 'stock-in';
        navigate(`/${role}/inventory/${pathSuffix}`);
    };

    const handleTableChange = (pagination: any) => {
        fetchOrders({ page: pagination.current, pageSize: pagination.pageSize });
    };

    const getStatusTag = (s: string) => {
        const colors: Record<string, string> = {
            'draft': 'default',
            'requested': 'processing',
            'approved': 'cyan',
            'dispatched': 'purple',
            'received': 'blue',
            'completed': 'success',
            'discrepancy': 'error',
            'cancelled': 'error'
        };
        return <Tag color={colors[s] || 'default'} style={{ margin: 0 }}>{s.toUpperCase()}</Tag>;
    };

    const openFilePreview = (file: HeadlessFileUpload) => {
        const kind = classifyJourneyFile(file);
        const url = kind === 'pdf' ? resolvePdfPreviewHref(file) : resolveJourneyFileHref(file);

        if (!url) {
            message.warning('Không tìm thấy đường dẫn file hợp lệ');
            return;
        }
        setFilePreview({ kind, url, name: getJourneyFileDisplayName(file) });
    };

    const renderUser = (u: any) => {
        if (!u) return '—';
        if (typeof u === 'string') return u;
        return u.displayName || u.email || u.username || '—';
    };

    const columns = [
        {
            title: 'Mã phiếu',
            dataIndex: 'code',
            key: 'code',
            fixed: 'left' as const,
            width: 130,
            render: (c: string, record: IStockOrder) => (
                <Button type="link" onClick={() => navigate(`/${role?.toLowerCase()}/inventory/order/${record._id}`)} style={{ padding: 0 }}>
                    <Text strong>{c || 'STOCK-ORD'}</Text>
                </Button>
            )
        },
        { 
            title: 'Người lập', 
            dataIndex: 'createdBy', 
            key: 'created_by', 
            width: 140, 
            render: (v: any) => (
                <Space size={4}>
                    <UserOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
                    <Text ellipsis={{ tooltip: renderUser(v) }} style={{ fontSize: 13 }}>{renderUser(v)}</Text>
                </Space>
            )
        },
        {
            title: 'Hành trình',
            key: 'journey',
            minWidth: 180,
            render: (_: any, record: IStockOrder) => {
                if (record.journey_code || record.journey_name) {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {record.journey_code && <Tag color="blue" style={{ width: 'fit-content', marginBottom: 2 }}>{record.journey_code}</Tag>}
                            <Text strong style={{ fontSize: 12 }}>{record.journey_name || '—'}</Text>
                        </div>
                    );
                }
                return <span style={{ color: '#bfbfbf' }}>—</span>;
            }
        },
        { 
            title: 'Nguồn', 
            dataIndex: 'source', 
            key: 'source', 
            width: 110, 
            render: (s: string) => <Tag style={{ margin: 0 }}>{SOURCE_LABELS[s] || s?.toUpperCase() || '—'}</Tag> 
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'st',
            width: 120,
            render: (s: string) => getStatusTag(s || 'draft')
        },
        { title: 'Giá trị', dataIndex: 'total_value', key: 'val', width: 110, align: 'right' as const, render: (v: number) => <Text strong>{(v || 0).toLocaleString('vi-VN')}đ</Text> },
        { 
            title: 'Tạo lúc', 
            dataIndex: 'createdAt', 
            key: 'date', 
            width: 140, 
            render: (d: any) => d ? <div style={{ fontSize: 12 }}><CalendarOutlined style={{ marginRight: 4, color: '#bfbfbf' }} />{dayjs(d).format('DD/MM/YY HH:mm')}</div> : '—' 
        },
        { 
            title: 'Duyệt lúc', 
            dataIndex: 'reviewed_at', 
            key: 'rev_date', 
            width: 140, 
            render: (d: any) => d ? <div style={{ fontSize: 12, color: '#52c41a' }}><CalendarOutlined style={{ marginRight: 4 }} />{dayjs(d).format('DD/MM/YY HH:mm')}</div> : '—'
        },
        { title: 'Ghi chú', dataIndex: 'notes', key: 'notes', width: 150, ellipsis: true, render: (n: string) => n || '—' },
        {
            title: 'Bản in',
            key: 'docs',
            width: 80,
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_: any, record: IStockOrder) => {
                const pdf = record.pdf_files?.[0];
                if (!pdf) return null;
                return (
                    <Tooltip title="Xem minh chứng">
                        <Button type="text" size="small" icon={<FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />} onClick={(e) => { e.stopPropagation(); openFilePreview(pdf); }} />
                    </Tooltip>
                );
            }
        },
    ];

    return (
        <div style={{ padding: isMobile ? '8px' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
                <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>⏱️ Hồ sơ xuất/nhập kho</Title>
                <Space wrap>
                    <RangePicker 
                        value={dateRange}
                        onChange={(val) => setDateRange(val as any)}
                        presets={[
                            { label: 'Hôm nay', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
                            { label: 'Hôm qua', value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')] },
                            { label: 'Tuần này', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
                            { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
                            { label: 'Năm nay', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
                        ]}
                        format="DD/MM/YYYY"
                    />
                    <Button type="primary" icon={activeTabType === 'out' ? <ExportOutlined /> : <ImportOutlined />} onClick={handleCreateOrder}>
                        {activeTabType === 'out' ? 'Tạo phiếu xuất' : 'Tạo phiếu nhập'}
                    </Button>
                </Space>
            </div>

            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, height: '100%' }}>
                        <Statistic title="Tổng phiếu" value={statAgg.totalCount} prefix={<FileTextOutlined style={{ color: '#1890ff' }} />} valueStyle={{ fontSize: isMobile ? 18 : 24 }} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, height: '100%' }}>
                        <Statistic title="GT Nhập kho" value={statAgg.totalInValue} valueStyle={{ color: '#52c41a', fontSize: isMobile ? 16 : 20 }} prefix={<ImportOutlined />} suffix="đ" />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, height: '100%' }}>
                        <Statistic title="GT Xuất kho" value={statAgg.totalOutValue} valueStyle={{ color: '#fa8c16', fontSize: isMobile ? 16 : 20 }} prefix={<ExportOutlined />} suffix="đ" />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, height: '100%' }}>
                        <Statistic title="Chờ duyệt" value={statAgg.pendingCount} valueStyle={{ color: '#eb2f96', fontSize: isMobile ? 18 : 24 }} prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Tabs
                    activeKey={activeTabType}
                    onChange={onTabChange}
                    items={[ { key: 'out', label: `Phiếu xuất kho` }, { key: 'in', label: `Phiếu nhập kho` } ]}
                    style={{ padding: isMobile ? '0 12px' : '0 24px', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}
                    size={isMobile ? 'small' : 'middle'}
                />

                <div style={{ padding: isMobile ? '12px' : '20px 24px' }}>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
                            <Steps
                                type="navigation"
                                size="small"
                                current={STATUS_STEPS.findIndex(s => s.key === activeStep)}
                                onChange={onStepChange}
                                style={{ minWidth: isMobile ? 600 : 'auto', borderBottom: 'none' }}
                                items={STATUS_STEPS.map((s, index) => ({
                                    title: (
                                        <Space size="small">
                                            {s.title}
                                            <Badge count={stepCounts[s.key] || 0} showZero style={{ 
                                                backgroundColor: activeStep === s.key ? '#1890ff' : '#f0f0f0', 
                                                color: activeStep === s.key ? '#fff' : '#8c8c8c', 
                                                boxShadow: 'none', fontSize: 10 
                                            }} />
                                        </Space>
                                    ),
                                    icon: <div style={{ width: 0, overflow: 'hidden' }} />
                                }))}
                            />
                        </div>

                        <Input
                            placeholder="Tìm nhanh mã phiếu..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => handleSearchChange(e.target.value)}
                            style={{ width: isMobile ? '100%' : 300 }}
                            allowClear
                            size={isMobile ? 'large' : 'middle'}
                        />
                    </div>

                    {!isMobile ? (
                        <Table
                            rowKey="_id"
                            dataSource={stockOrders}
                            size="small"
                            loading={loading}
                            scroll={{ x: 'max-content' }}
                            columns={columns}
                            pagination={{
                                ...pagination,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50']
                            }}
                            onChange={handleTableChange}
                        />
                    ) : (
                        <List
                            dataSource={stockOrders}
                            loading={loading}
                            pagination={{
                                ...pagination,
                                size: 'small',
                                onChange: (page, pageSize) => fetchOrders({ page, pageSize })
                            }}
                            renderItem={(item) => (
                                <List.Item style={{ padding: '12px 0' }}>
                                    <Card size="small" style={{ width: '100%', borderRadius: 12, border: '1px solid #f0f0f0' }} onClick={() => navigate(`/${role?.toLowerCase()}/inventory/order/${item._id}`)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text strong>{item.code || 'ORD'}</Text>
                                            <Space>
                                                {item.pdf_files && item.pdf_files.length > 0 && <FilePdfOutlined style={{ color: '#ff4d4f' }} onClick={(e) => { e.stopPropagation(); openFilePreview(item.pdf_files![0]); }} />}
                                                {getStatusTag(item.status || 'draft')}
                                            </Space>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                             <Text type="secondary" style={{ fontSize: 12 }}>Người lập:</Text>
                                             <Text style={{ fontSize: 12 }}>{renderUser(item.createdBy)}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Hành trình:</Text>
                                            <div style={{ textAlign: 'right' }}>
                                                {item.journey_code && <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>{item.journey_code}</Tag>}
                                                <br/><Text style={{ fontSize: 11 }}>{item.journey_name}</Text>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Nguồn:</Text>
                                            <Tag style={{ fontSize: 12 }}>{SOURCE_LABELS[item.source || ''] || item.source?.toUpperCase() || '—'}</Tag>
                                        </div>
                                        {item.notes && (
                                            <div style={{ display: 'flex', gap: 8, marginBottom: 8, padding: '4px 8px', background: '#f5f5f5', borderRadius: 4 }}>
                                                <InfoCircleOutlined style={{ color: '#bfbfbf', marginTop: 3 }} />
                                                <Text type="secondary" style={{ fontSize: 11 }}>{item.notes}</Text>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px dashed #f0f0f0' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <Text type="secondary" style={{ fontSize: 10 }}>Lập: {item.createdAt ? dayjs(item.createdAt).format('DD/MM/YY HH:mm') : '—'}</Text>
                                                {item.reviewed_at && <Text style={{ fontSize: 10, color: '#52c41a' }}>Duyệt: {dayjs(item.reviewed_at).format('DD/MM/YY HH:mm')}</Text>}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Text strong style={{ color: '#fa8c16', marginRight: 8 }}>{(item.total_value || 0).toLocaleString('vi-VN')}đ</Text>
                                                <ArrowRightOutlined style={{ fontSize: 12, color: '#bfbfbf' }} />
                                            </div>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Card>

            {/* File preview modal */}
            <Modal open={!!filePreview} title={filePreview?.name} onCancel={() => setFilePreview(null)} width={filePreview?.kind === 'pdf' ? 'min(1200px, 96vw)' : 720} style={{ top: 0, paddingBottom: 0, margin: '0 auto' }} styles={{ content: filePreview?.kind === 'pdf' ? { height: '100dvh', display: 'flex', flexDirection: 'column', padding: 0, borderRadius: 0, overflow: 'hidden' } : {}, header: filePreview?.kind === 'pdf' ? { padding: '12px 16px', marginBottom: 0, borderBottom: '1px solid #f0f0f0', flexShrink: 0 } : {}, body: filePreview?.kind === 'pdf' ? { flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 } : { padding: '16px 24px' }, }} destroyOnHidden footer={null} >
                {filePreview?.kind === 'pdf' && filePreview.url ? <PdfViewer url={filePreview.url} title={filePreview.name} height="100%" /> : null}
                {filePreview?.kind === 'image' && filePreview.url ? <div style={{ textAlign: 'center' }}><img src={filePreview.url} alt={filePreview.name} style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain' }} /></div> : null}
                {filePreview?.kind === 'other' && filePreview.url ? <Space direction="vertical" size="middle" style={{ width: '100%' }}><Text>Định dạng này không xem trực tiếp trên trình duyệt. Hãy tải file về và mở bằng ứng dụng phù hợp.</Text><Button type="primary" href={filePreview.url} target="_blank" icon={<DownloadOutlined />}>Tải file về</Button></Space> : null}
            </Modal>
        </div>
    );
};

export default InventoryHistory;
