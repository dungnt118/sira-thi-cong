import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Empty,
    Input,
    Row,
    Col,
    Space,
    Spin,
    Statistic,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    ArrowRightOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    EyeOutlined,
    InboxOutlined,
    ReloadOutlined,
    SearchOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { stockOrderService } from '../../services/core-contracts/services/stockOrder.service';
import {
    IStockOrder,
    StockOrderStatusEnum,
} from '../../services/core-contracts/types/stockOrder.types';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

/**
 * Wave 2 — W2-01b. Hàng đợi xử lý StockOrder theo vai trò.
 *
 * Backend đã gộp StockRequest vào StockOrder; status chuỗi là
 *  draft → requested → approved → dispatched → received → completed
 *  (+ discrepancy / cancelled là nhánh phụ).
 *
 * Component này render danh sách + filter theo tab status; click row để mở
 * StockOrderDetail (ở `/admin/{role}/inventory/order/:id`) — nơi các action ký
 * duyệt/xuất/nhận đã được wire sẵn.
 */
export type StockOrderWorkflowMode = 'kt' | 'gs' | 'pm' | 'kyt';

export interface StockOrderWorkflowListProps {
    /** kt: full pipeline; gs: chỉ dispatched + received của journey GS phụ trách; pm: oversight all; kyt: như gs. */
    mode: StockOrderWorkflowMode;
    /** Role-prefix dùng để build URL detail. */
    rolePathPrefix: 'kt' | 'gs' | 'ql' | 'kyt';
}

type TabKey = 'pending' | 'requested' | 'approved' | 'dispatched' | 'received' | 'completed' | 'discrepancy' | 'cancelled' | 'all';

const STATUS_TAG: Record<StockOrderStatusEnum, { color: string; label: string }> = {
    draft: { color: 'default', label: 'Nháp' },
    requested: { color: 'warning', label: 'Chờ duyệt' },
    approved: { color: 'processing', label: 'Đã duyệt — chờ xuất/nhập' },
    dispatched: { color: 'cyan', label: 'Đang giao — chờ nhận' },
    received: { color: 'success', label: 'Đã nhận' },
    completed: { color: 'success', label: 'Hoàn tất' },
    discrepancy: { color: 'error', label: 'Lệch số lượng' },
    cancelled: { color: 'default', label: 'Đã hủy' },
};

const renderStatusTag = (status: StockOrderStatusEnum | undefined): React.ReactNode => {
    if (!status) return <Tag>—</Tag>;
    const cfg = STATUS_TAG[status] ?? { color: 'default', label: status };
    return <Tag color={cfg.color}>{cfg.label}</Tag>;
};

const formatVnd = (v: number | undefined): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v ?? 0);

const formatDate = (v: string | Date | undefined): string => {
    if (!v) return '—';
    const d = typeof v === 'string' ? new Date(v) : v;
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString('vi-VN');
};

/**
 * Tabs hiển thị theo mode.
 * - kt: full pipeline
 * - gs/kyt: chỉ status liên quan field-ops (dispatched + received)
 * - pm: tất cả status (oversight)
 */
const getVisibleTabs = (mode: StockOrderWorkflowMode): TabKey[] => {
    if (mode === 'kt') return ['requested', 'approved', 'dispatched', 'discrepancy', 'completed', 'cancelled', 'all'];
    if (mode === 'pm') return ['requested', 'approved', 'dispatched', 'received', 'discrepancy', 'completed', 'cancelled', 'all'];
    // gs / kyt: trọng tâm là Hàng đợi tôi cần nhận + lịch sử
    return ['dispatched', 'received', 'completed', 'all'];
};

const TAB_LABEL: Record<TabKey, string> = {
    pending: 'Đang xử lý',
    requested: 'Chờ duyệt',
    approved: 'Chờ xuất/nhập',
    dispatched: 'Đang giao',
    received: 'Đã nhận',
    completed: 'Hoàn tất',
    discrepancy: 'Lệch số lượng',
    cancelled: 'Đã hủy',
    all: 'Tất cả',
};

const matchTab = (order: IStockOrder, tab: TabKey): boolean => {
    if (tab === 'all') return true;
    return order.status === (tab as StockOrderStatusEnum);
};

export const StockOrderWorkflowList: React.FC<StockOrderWorkflowListProps> = ({ mode, rolePathPrefix }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState<IStockOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const visibleTabs = useMemo(() => getVisibleTabs(mode), [mode]);
    const [activeTab, setActiveTab] = useState<TabKey>(visibleTabs[0] ?? 'all');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Pull tất cả status; filter client-side để có count theo tab.
            // Wave 3 sẽ chuyển sang query có pagination + server filter để scale.
            const res = await stockOrderService.queryStockOrdersDto({
                sortFields: [{ field: 'createdAt', sortType: 'desc' }],
                pageNumber: 1,
                pageSize: 200,
            } as any);
            const all = res?.data || [];
            // GS/KYT: lọc về phiếu thuộc journey mà user là supervisor (tương tự pattern WorkTask).
            // Vì shape supervisor_users đa hình, ta chỉ filter mềm: hiện tất cả phiếu, tab đã limit theo status.
            // Wave 3 sẽ wire chính xác supervisor scope qua server filter.
            setOrders(all);
        } catch (e: any) {
            setError(e?.message || 'Không tải được danh sách phiếu kho.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const filteredByTab = useMemo(
        () => orders.filter((o) => matchTab(o, activeTab)),
        [orders, activeTab],
    );

    const filteredBySearch = useMemo(() => {
        if (!searchText) return filteredByTab;
        const q = searchText.trim().toLowerCase();
        return filteredByTab.filter((o) =>
            (o.code || '').toLowerCase().includes(q) ||
            (o.journey_code || '').toLowerCase().includes(q) ||
            (o.journey_name || '').toLowerCase().includes(q) ||
            (o.supplier || '').toLowerCase().includes(q),
        );
    }, [filteredByTab, searchText]);

    const counts = useMemo(() => {
        const map: Record<string, number> = { all: orders.length };
        for (const o of orders) {
            const s = o.status || 'draft';
            map[s] = (map[s] ?? 0) + 1;
        }
        return map;
    }, [orders]);

    const totalAmountInTab = useMemo(
        () => filteredByTab.reduce((sum, o) => sum + (o.total_value ?? 0), 0),
        [filteredByTab],
    );

    const detailHref = (id: string) => `/admin/${rolePathPrefix}/inventory/order/${id}`;

    /** Hint nhỏ trên header cho user biết đây là pipeline gì. */
    const headerSubtitle = useMemo(() => {
        if (mode === 'kt') {
            return 'Hàng đợi xử lý phiếu kho. Click vào dòng để duyệt / xuất / nhập / đối soát lệch.';
        }
        if (mode === 'gs' || mode === 'kyt') {
            return 'Phiếu kho cần bạn xác nhận đã nhận tại hiện trường.';
        }
        return 'Tổng quan phiếu kho — PM theo dõi pipeline.';
    }, [mode]);

    const columns: ColumnsType<IStockOrder> = [
        {
            title: 'Mã phiếu',
            key: 'code',
            width: 160,
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.code || '(chưa có mã)'}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {formatDate(r.createdAt)}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 90,
            render: (t: 'in' | 'out' | undefined) =>
                t === 'in' ? <Tag color="blue">Nhập kho</Tag> : <Tag color="orange">Xuất kho</Tag>,
        },
        {
            title: 'Công trình',
            key: 'journey',
            width: 240,
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text>{r.journey_name || r.journey_code || '—'}</Text>
                    {r.supplier && (
                        <Text type="secondary" style={{ fontSize: 11 }}>NCC: {r.supplier}</Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Items',
            key: 'item_count',
            width: 80,
            align: 'center',
            render: (_, r) => <Tag>{r.items?.length ?? 0}</Tag>,
        },
        {
            title: 'Giá trị',
            dataIndex: 'total_value',
            key: 'total_value',
            width: 140,
            align: 'right',
            render: (v: number | undefined) => (v ? formatVnd(v) : '—'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            render: (s) => renderStatusTag(s),
        },
        {
            title: 'Người đề xuất',
            key: 'requested_by',
            width: 140,
            render: (_, r) => {
                const u = r.requested_by;
                if (!u) return <Text type="secondary">—</Text>;
                if (typeof u === 'string') return <Text style={{ fontSize: 12 }}>{u}</Text>;
                const o = u as Record<string, unknown>;
                return <Text style={{ fontSize: 12 }}>{String(o.display_name || o.username || o._id || '—')}</Text>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 110,
            render: (_, r) => (
                <Tooltip title="Mở phiếu để duyệt / ký / nhận">
                    <Button
                        type="link"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate(detailHref(r._id))}
                    >
                        Mở
                    </Button>
                </Tooltip>
            ),
        },
    ];

    if (loading && orders.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: 60 }}>
                <Spin tip="Đang tải phiếu kho..." />
            </div>
        );
    }

    return (
        <div style={{ padding: 16 }}>
            <Space style={{ marginBottom: 12 }} align="center" wrap>
                <Title level={4} style={{ margin: 0 }}>
                    <InboxOutlined /> Hàng đợi phiếu kho
                </Title>
                <Button icon={<ReloadOutlined />} size="small" onClick={() => void fetchData()}>
                    Tải lại
                </Button>
            </Space>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                {headerSubtitle}
            </Text>

            {error && <Alert type="error" showIcon message="Không tải được dữ liệu" description={error} style={{ marginBottom: 12 }} />}

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title={`Phiếu trong tab "${TAB_LABEL[activeTab]}"`}
                            value={filteredByTab.length}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Tổng giá trị"
                            value={totalAmountInTab}
                            suffix="đ"
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Lệch số lượng"
                            value={counts.discrepancy ?? 0}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#ef4444' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Tabs
                activeKey={activeTab}
                onChange={(k) => setActiveTab(k as TabKey)}
                items={visibleTabs.map((t) => ({
                    key: t,
                    label: (
                        <Space size={6}>
                            <span>{TAB_LABEL[t]}</span>
                            <Badge
                                count={counts[t === 'all' ? 'all' : t] ?? 0}
                                overflowCount={999}
                                style={{ backgroundColor: '#8c8c8c' }}
                            />
                        </Space>
                    ),
                }))}
                tabBarExtraContent={
                    <Input
                        placeholder="Tìm mã phiếu / công trình / NCC"
                        prefix={<SearchOutlined />}
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 280 }}
                    />
                }
            />

            <Table
                columns={columns}
                dataSource={filteredBySearch}
                rowKey="_id"
                size="middle"
                pagination={{ pageSize: 15 }}
                locale={{ emptyText: <Empty description={`Không có phiếu trong tab "${TAB_LABEL[activeTab]}"`} /> }}
                onRow={(r) => ({
                    onClick: () => navigate(detailHref(r._id)),
                    style: { cursor: 'pointer' },
                })}
            />
        </div>
    );
};

export default StockOrderWorkflowList;
