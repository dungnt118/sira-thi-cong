import React, { useState, useMemo, useEffect } from 'react';
import { Typography, Table, Button, Tag, Card, Row, Col, Statistic, Tabs, Input, Steps, Space, Badge, Grid, List, message, Modal, Tooltip } from 'antd';
import {
    FileTextOutlined, ClockCircleOutlined,
    ImportOutlined, ExportOutlined, SearchOutlined,
    ArrowRightOutlined, FilePdfOutlined, DownloadOutlined,
    InfoCircleOutlined, UserOutlined, CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { stockOrderService } from '../../../services/core-contracts/services/stockOrder.service';
import type { IStockOrder, StockOrderStatusEnum } from '../../../services/core-contracts/types/stockOrder.types';
import { getFileLink } from '../../../services/storeService';
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

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const SOURCE_LABELS: Record<string, string> = {
    internal: 'Nội bộ',
    distributor: 'Nhà phân phối',
    retail: 'Kho lẻ',
    journey: 'Hành trình',
    discrepancy: 'Điều chỉnh',
    manual: 'Thủ công',
    project: 'Công trình'
};

const InventoryHistory: React.FC = () => {
    const navigate = useNavigate();
    const { role } = useAuth();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(false);
    const [stockOrders, setStockOrders] = useState<IStockOrder[]>([]);
    const [activeTabType, setActiveTabType] = useState<'out' | 'in'>('out');
    const [activeStep, setActiveStep] = useState<string>('requested');
    const [searchText, setSearchText] = useState('');
    const [filePreview, setFilePreview] = useState<{
        kind: JourneyFileKind;
        url: string;
        name: string;
    } | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await stockOrderService.queryStockOrdersDto({});
            if (res.data) {
                setStockOrders(res.data);
            }
        } catch (error) {
            message.error('Không thể tải lịch sử kho');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCreateOrder = () => {
        const pathSuffix = activeTabType === 'out' ? 'stock-out' : 'stock-in';
        navigate(`/${role}/inventory/${pathSuffix}`);
    };

    const stats = useMemo(() => {
        let totalIn = 0;
        let valIn = 0;
        let totalOut = 0;
        let valOut = 0;
        let pending = 0;

        stockOrders.forEach(o => {
            if (o.type === 'in') {
                totalIn++;
                valIn += o.total_value || 0;
            } else if (o.type === 'out') {
                totalOut++;
                valOut += o.total_value || 0;
            }
            if (o.status === 'requested') {
                pending++;
            }
        });

        return {
            total: stockOrders.length,
            totalIn,
            valIn,
            totalOut,
            valOut,
            pending
        };
    }, [stockOrders]);

    const typeFilteredOrders = useMemo(() => {
        return stockOrders.filter(o => o.type === activeTabType);
    }, [stockOrders, activeTabType]);

    const stepCounts = useMemo(() => {
        const counts: Record<string, number> = {
            draft: 0,
            requested: 0,
            approved: 0,
            completed: 0,
            cancelled: 0
        };
        typeFilteredOrders.forEach(o => {
            const s = o.status || 'draft';
            if (s === 'draft') counts.draft++;
            else if (s === 'requested') counts.requested++;
            else if (['approved', 'dispatched', 'received'].includes(s)) counts.approved++;
            else if (s === 'completed') counts.completed++;
            else if (['cancelled', 'discrepancy'].includes(s)) counts.cancelled++;
        });
        return counts;
    }, [typeFilteredOrders]);

    const finalList = useMemo(() => {
        let list = stockOrders;
        
        if (searchText) {
            const lower = searchText.toLowerCase();
            return list.filter(o =>
                (o.code && o.code.toLowerCase().includes(lower)) ||
                (o.journey_code && o.journey_code.toLowerCase().includes(lower)) ||
                (o.journey_name && o.journey_name.toLowerCase().includes(lower)) ||
                (o.notes && o.notes.toLowerCase().includes(lower))
            );
        }

        list = typeFilteredOrders;

        if (activeStep !== 'ALL') {
            if (activeStep === 'approved') {
                list = list.filter(o => ['approved', 'dispatched', 'received'].includes(o.status || ''));
            } else if (activeStep === 'cancelled') {
                list = list.filter(o => ['cancelled', 'discrepancy'].includes(o.status || ''));
            } else {
                list = list.filter(o => o.status === activeStep);
            }
        }

        return list;
    }, [stockOrders, typeFilteredOrders, activeStep, searchText]);

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
        setFilePreview({
            kind,
            url,
            name: getJourneyFileDisplayName(file)
        });
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
                <Button type="link" onClick={() => navigate(`/kt/inventory/order/${record._id}`)} style={{ padding: 0 }}>
                    <Text strong>{c || 'STOCK-ORD'}</Text>
                </Button>
            )
        },
        { 
            title: 'Yêu cầu bởi', 
            dataIndex: 'requested_by', 
            key: 'req_by', 
            width: 140, 
            render: (v: any) => (
                <Space size={4}>
                    <UserOutlined style={{ fontSize: 13, color: '#8c8c8c' }} />
                    <Text ellipsis={{ tooltip: renderUser(v) }} style={{ fontSize: 13 }}>{renderUser(v)}</Text>
                </Space>
            )
        },
        {
            title: 'Đối tượng/Công trình',
            key: 'journey',
            minWidth: 180,
            render: (_: any, record: IStockOrder) => {
                if (record.journey_code || record.journey_name) {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {record.journey_code && <Tag color="blue" style={{ width: 'fit-content', marginBottom: 2 }}>{record.journey_code}</Tag>}
                            <Text strong style={{ fontSize: 12 }}>{record.journey_name || 'Hành trình không tên'}</Text>
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
            title: 'Lập phiếu', 
            dataIndex: 'created_at', 
            key: 'date', 
            width: 140, 
            render: (d: any) => d ? (
                <div style={{ fontSize: 12 }}>
                    <CalendarOutlined style={{ marginRight: 4, color: '#bfbfbf' }} />
                    {dayjs(d).format('DD/MM/YY HH:mm')}
                </div>
            ) : '—' 
        },
        { 
            title: 'Duyệt phiếu', 
            dataIndex: 'reviewed_at', 
            key: 'rev_date', 
            width: 140, 
            render: (d: any) => d ? (
                <div style={{ fontSize: 12, color: '#52c41a' }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {dayjs(d).format('DD/MM/YY HH:mm')}
                </div>
            ) : <Text type="secondary" italic style={{ fontSize: 11 }}>Chưa duyệt</Text>
        },
        {
            title: 'Ghi chú',
            dataIndex: 'notes',
            key: 'notes',
            width: 150,
            ellipsis: { tooltip: true },
            render: (n: string) => n || '—'
        },
        {
            title: 'Minh chứng',
            key: 'docs',
            width: 80,
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_: any, record: IStockOrder) => {
                const pdf = record.pdf_files?.[0];
                if (!pdf) return null;
                return (
                    <Tooltip title="Xem minh chứng PDF">
                        <Button 
                            type="text" 
                            size="small"
                            icon={<FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />} 
                            onClick={(e) => {
                                e.stopPropagation();
                                openFilePreview(pdf);
                            }}
                        />
                    </Tooltip>
                );
            }
        },
    ];

    const tabTypes = [
        { key: 'out', label: `Phiếu xuất kho (${stats.totalOut})` },
        { key: 'in', label: `Phiếu nhập kho (${stats.totalIn})` }
    ];

    const STATUS_STEPS = [
        { key: 'draft', title: 'Nháp' },
        { key: 'requested', title: 'Cần duyệt' },
        { key: 'approved', title: 'Đang xử lý' },
        { key: 'completed', title: 'Hoàn thành' },
        { key: 'cancelled', title: 'Đã hủy/Lỗi' }
    ];

    const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === activeStep);

    return (
        <div style={{ padding: isMobile ? '8px' : '0' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
            }}>
                <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>⏱️ Lịch sử xuất/nhập kho</Title>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Button
                        type="primary"
                        icon={activeTabType === 'out' ? <ExportOutlined /> : <ImportOutlined />}
                        onClick={handleCreateOrder}
                    >
                        {activeTabType === 'out' ? 'Tạo phiếu xuất' : 'Tạo phiếu nhập'}
                    </Button>
                </div>
            </div>

            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, height: '100%' }}>
                        <Statistic
                            title={<span style={{ fontSize: isMobile ? 12 : 14 }}>Tổng phiếu</span>}
                            value={stats.total}
                            prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ fontSize: isMobile ? 18 : 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, height: '100%' }}>
                        <Statistic
                            title={<span style={{ fontSize: isMobile ? 12 : 14 }}>Nhập kho</span>}
                            value={stats.valIn}
                            valueStyle={{ color: '#52c41a', fontSize: isMobile ? 16 : 20 }}
                            prefix={<ImportOutlined />}
                            suffix="đ"
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, height: '100%' }}>
                        <Statistic
                            title={<span style={{ fontSize: isMobile ? 12 : 14 }}>Xuất kho</span>}
                            value={stats.valOut}
                            valueStyle={{ color: '#fa8c16', fontSize: isMobile ? 16 : 20 }}
                            prefix={<ExportOutlined />}
                            suffix="đ"
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8, height: '100%' }}>
                        <Statistic
                            title={<span style={{ fontSize: isMobile ? 12 : 14 }}>Cần duyệt</span>}
                            value={stats.pending}
                            valueStyle={{ color: '#eb2f96', fontSize: isMobile ? 18 : 24 }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Tabs
                    activeKey={activeTabType}
                    onChange={(k: any) => {
                        setActiveTabType(k);
                        setActiveStep('ALL');
                    }}
                    items={tabTypes}
                    style={{ padding: isMobile ? '0 12px' : '0 24px', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}
                    size={isMobile ? 'small' : 'middle'}
                />

                <div style={{ padding: isMobile ? '12px' : '20px 24px' }}>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
                            <Steps
                                type="navigation"
                                size="small"
                                current={currentStepIndex !== -1 ? currentStepIndex : 0}
                                onChange={idx => setActiveStep(STATUS_STEPS[idx].key)}
                                style={{ minWidth: isMobile ? 600 : 'auto', borderBottom: 'none' }}
                                items={STATUS_STEPS.map((s, index) => {
                                    const count = stepCounts[s.key] || 0;
                                    const isActive = currentStepIndex === index;
                                    return {
                                        title: (
                                            <Space size="small">
                                                {s.title}
                                                <Badge
                                                    count={count}
                                                    showZero
                                                    style={{
                                                        backgroundColor: isActive ? '#1890ff' : '#f0f0f0',
                                                        color: isActive ? '#fff' : '#8c8c8c',
                                                        boxShadow: 'none',
                                                        fontSize: 10
                                                    }}
                                                />
                                            </Space>
                                        ),
                                        icon: <div style={{ width: 0, overflow: 'hidden' }} />
                                    };
                                })}
                            />
                        </div>

                        <Input
                            placeholder="Tìm mã phiếu, đối tượng, ghi chú..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: isMobile ? '100%' : 300 }}
                            allowClear
                            size={isMobile ? 'large' : 'middle'}
                        />
                    </div>

                    {!isMobile ? (
                        <Table
                            rowKey="_id"
                            dataSource={finalList}
                            size="small"
                            loading={loading}
                            scroll={{ x: 'max-content' }}
                            columns={columns}
                            pagination={{ pageSize: 15 }}
                        />
                    ) : (
                        <List
                            dataSource={finalList}
                            loading={loading}
                            pagination={{ pageSize: 10, size: 'small' }}
                            renderItem={(item) => (
                                <List.Item style={{ padding: '12px 0' }}>
                                    <Card
                                        size="small"
                                        style={{ width: '100%', borderRadius: 12, border: '1px solid #f0f0f0' }}
                                        onClick={() => navigate(`/kt/inventory/order/${item._id}`)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text strong>{item.code || 'ORD'}</Text>
                                            <Space>
                                                {item.pdf_files && item.pdf_files.length > 0 && (
                                                    <FilePdfOutlined 
                                                        style={{ color: '#ff4d4f', cursor: 'pointer' }} 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openFilePreview(item.pdf_files![0]);
                                                        }} 
                                                    />
                                                )}
                                                {getStatusTag(item.status || 'draft')}
                                            </Space>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Người yêu cầu:</Text>
                                            <Text style={{ fontSize: 12 }}>{renderUser(item.requested_by)}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Dự án/Hành trình:</Text>
                                            {item.journey_code || item.journey_name ? (
                                                <div style={{ textAlign: 'right' }}>
                                                    {item.journey_code && <Tag color="blue" size="small" style={{ margin: 0, fontSize: 10 }}>{item.journey_code}</Tag>}
                                                    <br/>
                                                    <Text style={{ fontSize: 11 }}>{item.journey_name}</Text>
                                                </div>
                                            ) : <Text style={{ fontSize: 12 }}>—</Text>}
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
                                                <Text type="secondary" style={{ fontSize: 10 }}>Lập: {item.created_at ? dayjs(item.created_at).format('DD/MM/YY HH:mm') : '—'}</Text>
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

            {/* File preview modal reuse logic */}
            <Modal
                open={!!filePreview}
                title={filePreview?.name}
                onCancel={() => setFilePreview(null)}
                width={filePreview?.kind === 'pdf' ? 'min(1200px, 96vw)' : 720}
                style={{ top: 0, paddingBottom: 0, margin: '0 auto' }}
                styles={{
                    content:
                        filePreview?.kind === 'pdf'
                            ? {
                                  height: '100dvh',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  padding: 0,
                                  borderRadius: 0,
                                  overflow: 'hidden',
                              }
                            : {},
                    header:
                        filePreview?.kind === 'pdf'
                            ? {
                                  padding: '12px 16px',
                                  marginBottom: 0,
                                  borderBottom: '1px solid #f0f0f0',
                                  flexShrink: 0,
                              }
                            : {},
                    body:
                        filePreview?.kind === 'pdf'
                            ? {
                                  flex: 1,
                                  padding: 0,
                                  overflow: 'hidden',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  minHeight: 0,
                              }
                            : { padding: '16px 24px' },
                }}
                destroyOnHidden
                footer={null}
            >
                {filePreview?.kind === 'pdf' && filePreview.url ? (
                    <PdfViewer url={filePreview.url} title={filePreview.name} height="100%" />
                ) : null}
                {filePreview?.kind === 'image' && filePreview.url ? (
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={filePreview.url}
                            alt={filePreview.name}
                            style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain' }}
                        />
                    </div>
                ) : null}
                {filePreview?.kind === 'other' && filePreview.url ? (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Text>
                            Định dạng này không xem trực tiếp trên trình duyệt. Hãy tải file về và mở bằng ứng dụng
                            phù hợp.
                        </Text>
                        <Button type="primary" href={filePreview.url} target="_blank" icon={<DownloadOutlined />}>
                            Tải file về
                        </Button>
                    </Space>
                ) : null}
            </Modal>
        </div>
    );
};

export default InventoryHistory;
