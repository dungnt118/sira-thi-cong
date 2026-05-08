import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Card, Row, Col, Table, Tag, Button, Statistic, Alert, Typography,
    Modal, Progress, Divider, Grid, Space, Spin, Tooltip, message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CheckCircleOutlined, WarningOutlined, ReloadOutlined, EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { paymentMilestoneService } from '../../../services/core-contracts/services/paymentMilestone.service';
import {
    IPaymentMilestone,
    PaymentMilestoneStatusEnum,
} from '../../../services/core-contracts/types/paymentMilestone.types';
import { buildJourneyDetailRoute } from '@/utils/adminRoutes';
import { buildFilter } from '@/utils/filterBuilder';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

/**
 * UX-10 (Wave 3.5) — KT Finance Dashboard.
 * REWRITE: thay `mockMilestones` bằng `paymentMilestoneService.queryPaymentMilestonesDto({})`
 * (cross-journey aggregation). Status enum dùng đúng theo backend:
 *   pending | partially_paid | paid | overdue
 */

const STATUS_CONFIG: Record<PaymentMilestoneStatusEnum, { label: string; color: string }> = {
    pending: { label: 'Chờ thu', color: 'warning' },
    partially_paid: { label: 'Đã thu một phần', color: 'processing' },
    paid: { label: 'Đã thu', color: 'success' },
    overdue: { label: 'Quá hạn', color: 'error' },
};

const isOverdue = (m: IPaymentMilestone): boolean => {
    if (m.status === 'paid') return false;
    if (m.status === 'overdue') return true;
    if (!m.due_date) return false;
    return dayjs(m.due_date).isBefore(dayjs(), 'day') && (m.remaining_amount ?? m.amount ?? 0) > 0;
};

const PaymentDashboard: React.FC = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const navigate = useNavigate();

    const [milestones, setMilestones] = useState<IPaymentMilestone[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState<IPaymentMilestone | null>(null);

    const fetchMilestones = useCallback(async () => {
        setLoading(true);
        try {
            const res = await paymentMilestoneService.queryPaymentMilestonesDto(buildFilter({
                sortBy: [{ id: 'due_date', desc: false }],
                limit: 200,
            }));
            setMilestones(res?.data || []);
        } catch (e) {
            console.error('[PaymentDashboard] fetch failed:', e);
            message.error('Không thể tải danh sách đợt thanh toán.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMilestones(); }, [fetchMilestones]);

    /* ─── Aggregations ───────────────────────────────────── */

    const aggregations = useMemo(() => {
        let totalAmount = 0;
        let paidAmount = 0;
        let pendingAmount = 0;
        let overdueAmount = 0;

        milestones.forEach(m => {
            const amount = m.amount ?? 0;
            const received = m.amount_received_total ?? 0;
            const remaining = m.remaining_amount ?? Math.max(0, amount - received);
            totalAmount += amount;
            paidAmount += received;

            if (isOverdue(m)) {
                overdueAmount += remaining;
            } else if (m.status !== 'paid') {
                pendingAmount += remaining;
            }
        });

        return { totalAmount, paidAmount, pendingAmount, overdueAmount };
    }, [milestones]);

    const handleConfirmPayment = (m: IPaymentMilestone) => {
        setSelectedMilestone(m);
        setConfirmModal(true);
    };

    const handleViewJourney = (m: IPaymentMilestone) => {
        if (m.journey_id) {
            navigate(buildJourneyDetailRoute('kt', m.journey_id, '?tab=GRP_10_PAYMENT'));
        }
    };

    /* ─── Table columns ─────────────────────────────────── */

    const milestoneColumns: ColumnsType<IPaymentMilestone> = [
        {
            title: 'Công trình',
            key: 'project',
            fixed: 'left',
            width: 200,
            render: (_, m) => {
                const name = m.journey_name ?? m.idx_journey_id?.title ?? m.journey_code ?? '—';
                const display = name.length > 35 ? name.slice(0, 35) + '...' : name;
                return (
                    <div style={{ padding: '4px 0' }}>
                        <Text strong style={{ fontSize: 13 }}>{display}</Text>
                        <div style={{ fontSize: 11, color: '#999' }}>
                            Đợt #{m.round ?? '?'} {m.percentage ? `(${m.percentage}%)` : ''}
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Số tiền',
            key: 'amount',
            align: 'right',
            width: 140,
            sorter: (a, b) => (a.amount ?? 0) - (b.amount ?? 0),
            render: (_, m) => (
                <Text strong style={{ fontSize: 14, color: '#1976D2' }}>
                    {(m.amount ?? 0).toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
        {
            title: 'Đã thu',
            key: 'received',
            align: 'right',
            width: 130,
            render: (_, m) => (
                <Text style={{ fontSize: 13 }}>
                    {(m.amount_received_total ?? 0).toLocaleString('vi-VN')}đ
                    {m.receipt_count ? <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{m.receipt_count} phiếu</Text> : null}
                </Text>
            ),
        },
        {
            title: 'Còn lại',
            key: 'remaining',
            align: 'right',
            width: 130,
            render: (_, m) => {
                const remaining = m.remaining_amount ?? Math.max(0, (m.amount ?? 0) - (m.amount_received_total ?? 0));
                return (
                    <Text strong style={{ fontSize: 13, color: remaining > 0 ? '#cf1322' : '#52c41a' }}>
                        {remaining.toLocaleString('vi-VN')}đ
                    </Text>
                );
            },
        },
        {
            title: 'Hạn thu',
            dataIndex: 'due_date',
            key: 'due_date',
            width: 100,
            sorter: (a, b) => {
                const ad = a.due_date ? new Date(a.due_date).getTime() : 0;
                const bd = b.due_date ? new Date(b.due_date).getTime() : 0;
                return ad - bd;
            },
            render: (d, m) => {
                if (!d) return '—';
                const overdue = isOverdue(m);
                return (
                    <Text style={{
                        fontSize: 13,
                        color: overdue ? '#ff4d4f' : '#333',
                        fontWeight: overdue ? 700 : 400,
                    }}>
                        {dayjs(d).format('DD/MM/YYYY')}
                    </Text>
                );
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 130,
            render: (_, m) => {
                const overdue = isOverdue(m);
                const effectiveStatus: PaymentMilestoneStatusEnum = overdue ? 'overdue' : (m.status ?? 'pending');
                const cfg = STATUS_CONFIG[effectiveStatus] ?? STATUS_CONFIG.pending;
                return <Tag color={cfg.color} style={{ fontSize: 11, margin: 0 }}>{cfg.label}</Tag>;
            },
            filters: Object.entries(STATUS_CONFIG).map(([k, v]) => ({ text: v.label, value: k })),
            onFilter: (value, m) => {
                const effective = isOverdue(m) ? 'overdue' : (m.status ?? 'pending');
                return effective === value;
            },
        },
        {
            title: '',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, m) => (
                <Space size="small">
                    {m.journey_id && (
                        <Tooltip title="Xem chi tiết công trình">
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => handleViewJourney(m)}
                            />
                        </Tooltip>
                    )}
                    {m.status !== 'paid' ? (
                        <Button
                            type="primary"
                            size="small"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleConfirmPayment(m)}
                            style={{ fontSize: 11 }}
                        >
                            Ghi nhận thu
                        </Button>
                    ) : m.last_receipt_date ? (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            ✅ {dayjs(m.last_receipt_date).format('DD/MM')}
                        </Text>
                    ) : null}
                </Space>
            ),
        },
    ];

    /* ─── Render ─────────────────────────────────────────── */

    const { totalAmount, paidAmount, pendingAmount, overdueAmount } = aggregations;

    return (
        <div style={{ padding: isMobile ? '0 0 16px' : '0 4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>💰 Theo dõi Thanh toán</Title>
                <Button icon={<ReloadOutlined />} onClick={fetchMilestones} loading={loading} />
            </div>

            {/* KPI */}
            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" style={{ borderLeft: '3px solid #1976D2', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Tổng phải thu</Text>}
                            value={Math.round(totalAmount / 1000000)}
                            suffix={<span style={{ fontSize: 12 }}>tr</span>}
                            valueStyle={{ color: '#1976D2', fontSize: 20 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" style={{ borderLeft: '3px solid #52c41a', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Đã thu</Text>}
                            value={Math.round(paidAmount / 1000000)}
                            suffix={<span style={{ fontSize: 12 }}>tr</span>}
                            valueStyle={{ color: '#52c41a', fontSize: 20 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" style={{ borderLeft: '3px solid #fa8c16', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Chờ thu</Text>}
                            value={Math.round(pendingAmount / 1000000)}
                            suffix={<span style={{ fontSize: 12 }}>tr</span>}
                            valueStyle={{ color: '#fa8c16', fontSize: 20 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" style={{ borderLeft: '3px solid #ff4d4f', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Quá hạn</Text>}
                            value={Math.round(overdueAmount / 1000000)}
                            suffix={<span style={{ fontSize: 12 }}>tr</span>}
                            valueStyle={{ color: overdueAmount > 0 ? '#ff4d4f' : '#52c41a', fontSize: 20 }}
                            prefix={overdueAmount > 0 ? <WarningOutlined /> : undefined}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Collection Progress */}
            {totalAmount > 0 && (
                <Card size="small" style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <Text strong style={{ fontSize: 13 }}>Tiến độ thu tiền tổng thể</Text>
                    <div style={{ marginTop: 8 }}>
                        <Progress
                            percent={Math.round((paidAmount / totalAmount) * 100)}
                            strokeColor={{ from: '#fa8c16', to: '#52c41a' }}
                            format={p => <span style={{ fontSize: 12 }}>{p}%</span>}
                        />
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        Đã thu {paidAmount.toLocaleString('vi-VN')}đ / {totalAmount.toLocaleString('vi-VN')}đ
                    </Text>
                </Card>
            )}

            {overdueAmount > 0 && (
                <Alert
                    message={
                        <div style={{ fontSize: 12 }}>
                            🚨 Có công nợ quá hạn: <strong>{overdueAmount.toLocaleString('vi-VN')}đ</strong>
                        </div>
                    }
                    type="error"
                    showIcon
                    style={{ marginBottom: 16, borderRadius: 8 }}
                />
            )}

            <div style={{ background: '#fff', borderRadius: 8, padding: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
                ) : (
                    <Table
                        columns={milestoneColumns}
                        dataSource={milestones}
                        rowKey="_id"
                        size="small"
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            pageSize: 15,
                            size: 'small',
                            showTotal: (t) => <span style={{ fontSize: 12 }}>{t} đợt</span>,
                        }}
                        locale={{ emptyText: 'Chưa có đợt thanh toán nào.' }}
                    />
                )}
            </div>

            {/* Confirm Payment Modal — link sang journey để ghi nhận chi tiết */}
            <Modal
                title={<><CheckCircleOutlined style={{ color: '#52c41a' }} /> Ghi nhận thu tiền</>}
                open={confirmModal}
                width={isMobile ? 'calc(100vw - 24px)' : 520}
                centered={isMobile}
                onCancel={() => setConfirmModal(false)}
                onOk={() => {
                    setConfirmModal(false);
                    if (selectedMilestone?.journey_id) {
                        // Mở trang detail journey ở tab Payment để ghi nhận phiếu thu chi tiết
                        // (RecordReceiptModal được mount trong Step10Payment).
                        navigate(buildJourneyDetailRoute('kt', selectedMilestone.journey_id, '?tab=GRP_10_PAYMENT'));
                    }
                }}
                okText="Mở chi tiết để ghi nhận"
                okType="primary"
            >
                {selectedMilestone && (
                    <div style={{ padding: '12px 0' }}>
                        <Row style={{ marginBottom: 12 }}>
                            <Col xs={8} sm={6}><Text type="secondary">Công trình:</Text></Col>
                            <Col xs={16} sm={18}>
                                <Text strong>
                                    {selectedMilestone.journey_name
                                        ?? selectedMilestone.idx_journey_id?.title
                                        ?? selectedMilestone.journey_code
                                        ?? '—'}
                                </Text>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 12 }}>
                            <Col xs={8} sm={6}><Text type="secondary">Đợt:</Text></Col>
                            <Col xs={16} sm={18}>
                                <Text strong>
                                    Đợt {selectedMilestone.round ?? '?'} {selectedMilestone.percentage ? `(${selectedMilestone.percentage}%)` : ''}
                                </Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8} sm={6}><Text type="secondary">Còn lại:</Text></Col>
                            <Col xs={16} sm={18}>
                                <Text strong style={{ fontSize: 22, color: '#52c41a' }}>
                                    {(selectedMilestone.remaining_amount
                                        ?? Math.max(0, (selectedMilestone.amount ?? 0) - (selectedMilestone.amount_received_total ?? 0))
                                    ).toLocaleString('vi-VN')}đ
                                </Text>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '16px 0' }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Sẽ mở trang chi tiết công trình ở tab Thanh toán để bạn ghi nhận phiếu thu cụ thể (số tiền, ngày thu, hình thức, mã giao dịch...).
                        </Text>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PaymentDashboard;
