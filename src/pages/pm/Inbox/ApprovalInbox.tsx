import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Empty,
    List,
    Row,
    Space,
    Spin,
    Statistic,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import {
    ArrowRightOutlined,
    DollarOutlined,
    InboxOutlined,
    InfoCircleOutlined,
    NodeIndexOutlined,
    ReloadOutlined,
    UnorderedListOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { paymentRequestService } from '../../../services/core-contracts/services/paymentRequest.service';
import { stockOrderService } from '../../../services/core-contracts/services/stockOrder.service';
import { workTaskService } from '../../../services/core-contracts/services/workTask.service';
import { IPaymentRequest } from '../../../services/core-contracts/types/paymentRequest.types';
import { IStockOrder } from '../../../services/core-contracts/types/stockOrder.types';
import { IWorkTask } from '../../../services/core-contracts/types/workTask.types';
import { useAuth } from '../../../hooks/useAuth';

const { Title, Text } = Typography;

/**
 * Wave 2 — W2-03. Hộp duyệt tổng hợp cho PM.
 *
 * 4 section:
 *  1. PaymentRequest > 50M chờ PM duyệt (`status='pending_approval'` AND amount > threshold).
 *  2. StockOrder cần PM ký bước 1 (`status='requested'` — PM là người lập/khởi tạo trong workflow).
 *  3. WorkTask đề xuất gán cho PM (`assignee_role='QL'` AND status='pending').
 *  4. ChangeOrder (Wave 5 placeholder).
 *
 * SLA highlight: overdue (đỏ) / due_soon < 24h (cam).
 */

const APPROVAL_TIER_THRESHOLD_VND = 50_000_000;

interface InboxItem {
    id: string;
    title: string;
    subtitle?: string;
    detailHref: string;
    /** ms epoch timestamp; mốc tính SLA. */
    slaTimestamp?: number;
    amount?: number;
    extraTag?: React.ReactNode;
}

interface SectionState {
    loading: boolean;
    error: string | null;
    items: InboxItem[];
}

const initialSection = (): SectionState => ({ loading: true, error: null, items: [] });

const computeSlaState = (timestamp: number | undefined): { level: 'overdue' | 'due_soon' | 'normal'; hoursDiff: number } => {
    if (!timestamp) return { level: 'normal', hoursDiff: Infinity };
    const diffH = (timestamp - Date.now()) / (1000 * 60 * 60);
    if (diffH < 0) return { level: 'overdue', hoursDiff: diffH };
    if (diffH <= 24) return { level: 'due_soon', hoursDiff: diffH };
    return { level: 'normal', hoursDiff: diffH };
};

const renderSlaTag = (timestamp: number | undefined): React.ReactNode => {
    const sla = computeSlaState(timestamp);
    if (sla.level === 'overdue') return <Tag color="error">Quá hạn {Math.abs(Math.round(sla.hoursDiff))}h</Tag>;
    if (sla.level === 'due_soon') return <Tag color="warning">Sắp đến hạn ({Math.round(sla.hoursDiff)}h)</Tag>;
    if (timestamp) return <Tag>{dayjs(timestamp).fromNow ? dayjs(timestamp).fromNow() : dayjs(timestamp).format('DD/MM')}</Tag>;
    return null;
};

const formatVnd = (v: number | undefined): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v ?? 0);

interface SectionCardProps {
    title: string;
    icon: React.ReactNode;
    state: SectionState;
    seeAllHref: string;
    seeAllLabel?: string;
    description?: string;
    color?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
    title,
    icon,
    state,
    seeAllHref,
    seeAllLabel = 'Xem tất cả',
    description,
    color = '#1890ff',
}) => {
    const navigate = useNavigate();
    const top5 = state.items.slice(0, 5);
    const overdueCount = state.items.filter((i) => computeSlaState(i.slaTimestamp).level === 'overdue').length;

    return (
        <Card
            size="small"
            title={
                <Space>
                    <span style={{ color }}>{icon}</span>
                    <span>{title}</span>
                    <Badge count={state.items.length} overflowCount={999} style={{ backgroundColor: color }} />
                    {overdueCount > 0 && (
                        <Badge count={`${overdueCount} quá hạn`} style={{ backgroundColor: '#ef4444' }} />
                    )}
                </Space>
            }
            extra={
                <Button type="link" icon={<ArrowRightOutlined />} onClick={() => navigate(seeAllHref)}>
                    {seeAllLabel}
                </Button>
            }
            style={{ height: '100%' }}
        >
            {description && (
                <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
                    <InfoCircleOutlined /> {description}
                </Text>
            )}

            {state.loading ? (
                <div style={{ textAlign: 'center', padding: 24 }}>
                    <Spin />
                </div>
            ) : state.error ? (
                <Alert type="error" showIcon message={state.error} />
            ) : top5.length === 0 ? (
                <Empty description="Không có gì cần xử lý." image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <List
                    size="small"
                    dataSource={top5}
                    renderItem={(it) => (
                        <List.Item
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(it.detailHref)}
                        >
                            <Space direction="vertical" size={2} style={{ width: '100%' }}>
                                <Space wrap size={6}>
                                    <Text strong style={{ fontSize: 13 }}>{it.title}</Text>
                                    {it.extraTag}
                                    {renderSlaTag(it.slaTimestamp)}
                                </Space>
                                {it.subtitle && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>{it.subtitle}</Text>
                                )}
                                {it.amount != null && (
                                    <Text style={{ fontSize: 12, color: '#1890ff' }}>{formatVnd(it.amount)}</Text>
                                )}
                            </Space>
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );
};

export const ApprovalInbox: React.FC = () => {
    const { user } = useAuth();
    const username = user?.username || user?.userName || user?.code;

    const [paymentSection, setPaymentSection] = useState<SectionState>(initialSection);
    const [stockSection, setStockSection] = useState<SectionState>(initialSection);
    const [taskSection, setTaskSection] = useState<SectionState>(initialSection);

    /** Section 1 — PaymentRequest > 50M chờ PM duyệt. */
    const fetchPaymentRequests = async () => {
        setPaymentSection({ ...initialSection() });
        try {
            const res = await paymentRequestService.queryPaymentRequestsDto({
                fields: [{ field: 'status', op: 'eq', value: 'pending_approval' }],
                sortFields: [{ field: 'submitted_at', sortType: 'asc' }],
                pageNumber: 1,
                pageSize: 100,
            } as any);
            const filtered = (res?.data || []).filter((p: IPaymentRequest) => (p.amount ?? 0) > APPROVAL_TIER_THRESHOLD_VND);
            const items: InboxItem[] = filtered.map((p) => ({
                id: p._id,
                title: p.payment_content || p.code || '(không có nội dung)',
                subtitle: `${p.code || ''} • ${p.beneficiary_name_snapshot || '(chưa có người nhận)'}`,
                detailHref: '/admin/ql/finance/payment-requests',
                slaTimestamp: p.submitted_at ? new Date(p.submitted_at as any).getTime() + 24 * 3600 * 1000 : undefined,
                amount: p.amount,
                extraTag: <Tag color="purple">PM duyệt</Tag>,
            }));
            setPaymentSection({ loading: false, error: null, items });
        } catch (e: any) {
            setPaymentSection({ loading: false, error: e?.message || 'Không tải được PaymentRequest', items: [] });
        }
    };

    /** Section 2 — StockOrder requested chưa có PM ký signatures[0]. */
    const fetchStockOrders = async () => {
        setStockSection({ ...initialSection() });
        try {
            const res = await stockOrderService.queryStockOrdersDto({
                fields: [{ field: 'status', op: 'eq', value: 'requested' }],
                sortFields: [{ field: 'createdAt', sortType: 'asc' }],
                pageNumber: 1,
                pageSize: 100,
            } as any);
            const all: IStockOrder[] = res?.data || [];
            // Lọc: phiếu chưa có PM signature ở step_order=1.
            const unsigned = all.filter((o) => {
                const pmSig = o.signatures?.find((s) => s.role === 'pm');
                return !pmSig || (!pmSig.signed_at && !pmSig.system_confirmed);
            });
            const items: InboxItem[] = unsigned.map((o) => ({
                id: o._id,
                title: `${o.code || '(chưa có mã)'} — ${o.type === 'in' ? 'Nhập' : 'Xuất'} kho`,
                subtitle: `${o.journey_name || o.journey_code || '—'} • ${o.items?.length ?? 0} items`,
                detailHref: `/admin/ql/inventory/order/${o._id}`,
                slaTimestamp: o.createdAt ? new Date(o.createdAt as any).getTime() + 48 * 3600 * 1000 : undefined,
                amount: o.total_value,
                extraTag: <Tag color={o.type === 'in' ? 'blue' : 'orange'}>{o.type === 'in' ? 'Nhập' : 'Xuất'}</Tag>,
            }));
            setStockSection({ loading: false, error: null, items });
        } catch (e: any) {
            setStockSection({ loading: false, error: e?.message || 'Không tải được StockOrder', items: [] });
        }
    };

    /** Section 3 — WorkTask gán cho PM còn pending. */
    const fetchWorkTasks = async () => {
        setTaskSection({ ...initialSection() });
        try {
            const res = await workTaskService.queryWorkTasksDto({
                fields: [
                    { field: 'status', op: 'eq', value: 'pending' },
                    { field: 'assignee_role', op: 'eq', value: 'QL' },
                ],
                sortFields: [{ field: 'due_time', sortType: 'asc' }],
                pageNumber: 1,
                pageSize: 100,
            } as any);
            const all: IWorkTask[] = res?.data || [];
            const items: InboxItem[] = all.map((t) => ({
                id: t._id,
                title: t.title || '(chưa đặt tên)',
                subtitle: t.description?.slice(0, 80) || (t.journey_step_code ? `Bước: ${t.journey_step_code}` : undefined),
                detailHref: t.journey_id ? `/admin/ql/journeys/${t.journey_id}?tab=MY_TASKS` : '/admin/ql/journeys',
                slaTimestamp: t.due_time ? new Date(t.due_time as any).getTime() : undefined,
            }));
            setTaskSection({ loading: false, error: null, items });
        } catch (e: any) {
            setTaskSection({ loading: false, error: e?.message || 'Không tải được WorkTask', items: [] });
        }
    };

    const refreshAll = () => {
        void fetchPaymentRequests();
        void fetchStockOrders();
        void fetchWorkTasks();
    };

    useEffect(() => {
        refreshAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalPending = useMemo(
        () => paymentSection.items.length + stockSection.items.length + taskSection.items.length,
        [paymentSection, stockSection, taskSection],
    );

    const totalOverdue = useMemo(
        () =>
            [paymentSection, stockSection, taskSection].reduce(
                (sum, s) => sum + s.items.filter((i) => computeSlaState(i.slaTimestamp).level === 'overdue').length,
                0,
            ),
        [paymentSection, stockSection, taskSection],
    );

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 12 }} align="center" wrap>
                <Title level={3} style={{ margin: 0 }}>
                    <UnorderedListOutlined /> Hộp duyệt
                </Title>
                <Button icon={<ReloadOutlined />} onClick={refreshAll}>Tải lại</Button>
            </Space>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Tổng hợp các yêu cầu đang chờ {username || 'PM'} xử lý — đề nghị chi cấp 2, đề xuất nhập/xuất kho cần PM ký bước 1, công việc gán cho PM, và yêu cầu thay đổi phạm vi (Wave 5).
            </Text>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Tổng cần xử lý"
                            value={totalPending}
                            prefix={<UnorderedListOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Đã quá hạn SLA"
                            value={totalOverdue}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: totalOverdue > 0 ? '#ef4444' : '#8c8c8c' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Đề nghị chi (PM cấp 2)"
                            value={paymentSection.items.length}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <SectionCard
                        title="Đề nghị chi cần PM duyệt"
                        icon={<DollarOutlined />}
                        state={paymentSection}
                        seeAllHref="/admin/ql/finance/payment-requests"
                        description={`Số tiền > ${formatVnd(APPROVAL_TIER_THRESHOLD_VND)} — vượt quyền KT, cần PM duyệt cấp 2.`}
                        color="#722ed1"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <SectionCard
                        title="Đề xuất nhập/xuất kho cần PM ký"
                        icon={<InboxOutlined />}
                        state={stockSection}
                        seeAllHref="/admin/ql/inventory/stock-orders"
                        description="PM ký bước 1 trên signatures[] để chuyển phiếu sang KT duyệt."
                        color="#1890ff"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <SectionCard
                        title="Việc của PM trên các công trình"
                        icon={<NodeIndexOutlined />}
                        state={taskSection}
                        seeAllHref="/admin/ql/journeys"
                        description="WorkTask có assignee_role = QL còn pending."
                        color="#52c41a"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={
                            <Space>
                                <NodeIndexOutlined style={{ color: '#bfbfbf' }} />
                                <span>Yêu cầu thay đổi phạm vi (ChangeOrder)</span>
                                <Tag>Wave 5</Tag>
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        <Empty
                            description={
                                <span>
                                    <Text type="secondary">Tính năng ChangeOrder sẽ được triển khai ở Wave 5.</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Hiện tại các thay đổi phạm vi sau ký được ghi nhận trong tab "Hợp đồng" của Journey360.
                                    </Text>
                                </span>
                            }
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ApprovalInbox;
