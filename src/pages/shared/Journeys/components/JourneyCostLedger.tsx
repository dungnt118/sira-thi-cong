import React, { useEffect, useState } from 'react';
import {
    Alert,
    Card,
    Col,
    Empty,
    Progress,
    Row,
    Space,
    Spin,
    Statistic,
    Table,
    Tag,
    Typography,
    message,
} from 'antd';
import {
    BankOutlined,
    DollarCircleOutlined,
    InboxOutlined,
    LineChartOutlined,
    PieChartOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import {
    aggregateJourneyFinancials,
    fmtPct,
    fmtVND,
    JourneyFinancialBreakdown,
} from '../../../../utils/journeyFinancialsAggregator';
import { IPaymentRequest } from '../../../../services/core-contracts/types/paymentRequest.types';
import { IStockOrder } from '../../../../services/core-contracts/types/stockOrder.types';

const { Text, Title } = Typography;

/**
 * Wave 4 W4-02a — Cost Ledger (Sổ chi phí thực tế).
 *
 * Read-only tab inside Journey360. Shows:
 *   1. Top KPI: Planned vs Actual cost + variance
 *   2. Breakdown table: Material (StockOrder) vs Payments (PaymentRequest)
 *   3. Drill-down: list of stock orders + paid payment requests
 *
 * Audience: QL (project oversight), KT (cost approval review).
 */

export interface JourneyCostLedgerProps {
    journeyId: string;
}

const JourneyCostLedger: React.FC<JourneyCostLedgerProps> = ({ journeyId }) => {
    const [data, setData] = useState<JourneyFinancialBreakdown | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!journeyId) return;
        let cancelled = false;
        setLoading(true);
        aggregateJourneyFinancials(journeyId)
            .then(res => { if (!cancelled) setData(res); })
            .catch((e: any) => message.error(e?.message || 'Không thể tải sổ chi phí.'))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [journeyId]);

    /* ─── Render helpers ─────────────────────────────────────── */

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>;
    }

    if (!data) {
        return <Empty description="Chưa có dữ liệu chi phí cho công trình này." />;
    }

    const variancePct = data.cost_variance_pct;
    const isOverBudget = variancePct > 5;
    const isUnderBudget = variancePct < -5;

    /* ─── Tables ─────────────────────────────────────────────── */

    const stockOrderColumns: ColumnsType<IStockOrder> = [
        {
            title: 'Mã phiếu',
            dataIndex: 'code',
            key: 'code',
            width: 130,
            render: (c, r) => c ?? r._id.slice(-6).toUpperCase(),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (t) => (
                <Tag color={t === 'in' ? 'green' : t === 'out' ? 'orange' : 'default'}>
                    {t === 'in' ? 'Nhập' : t === 'out' ? 'Xuất' : t ?? '—'}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (s) => <Tag>{s ?? '—'}</Tag>,
        },
        {
            title: 'Giá trị',
            key: 'value',
            align: 'right',
            render: (_, r) => {
                // Ưu tiên total_value (auto-compute server-side W4 Phase 6).
                if (typeof (r as any).total_value === 'number' && (r as any).total_value > 0) {
                    return <Text strong>{fmtVND((r as any).total_value)}</Text>;
                }
                const items = (r.items as any[]) ?? [];
                const total = items.reduce((s, i) => {
                    const qty = i.received_quantity ?? i.issued_quantity ?? i.requested_quantity ?? i.quantity ?? 0;
                    return s + qty * (i.unit_cost ?? i.unit_price ?? 0);
                }, 0);
                return <Text strong>{fmtVND(total)}</Text>;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 110,
            render: (d) => d ? dayjs(d).format('DD/MM/YYYY') : '—',
        },
    ];

    const requestColumns: ColumnsType<IPaymentRequest> = [
        {
            title: 'Mã phiếu',
            dataIndex: 'code',
            key: 'code',
            width: 130,
            render: (c, r) => c ?? r._id.slice(-6).toUpperCase(),
        },
        {
            title: 'Loại chi',
            dataIndex: 'request_type',
            key: 'request_type',
            width: 160,
            render: (t) => {
                const map: Record<string, string> = {
                    supplier_payment: 'Trả NCC',
                    expense_reimbursement: 'Hoàn ứng',
                    salary_payment: 'Trả lương',
                    tax_payment: 'Nộp thuế',
                    internal_transfer: 'Chuyển nội bộ',
                    other: 'Khác',
                };
                return <Tag>{map[t] ?? t ?? '—'}</Tag>;
            },
        },
        {
            title: 'Người thụ hưởng',
            key: 'beneficiary',
            render: (_, r) => r.beneficiary_name_snapshot ?? '—',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (v) => <Text strong style={{ color: '#cf1322' }}>{fmtVND(v)}</Text>,
        },
        {
            title: 'Ngày chi',
            dataIndex: 'paid_at',
            key: 'paid_at',
            width: 110,
            render: (d) => d ? dayjs(d).format('DD/MM/YYYY') : '—',
        },
    ];

    /* ─── Render ─────────────────────────────────────────────── */

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card>
                <Title level={4} style={{ marginTop: 0 }}>
                    <PieChartOutlined /> Sổ chi phí thực tế
                </Title>
                <Text type="secondary">
                    Tổng hợp chi phí từ Vật tư xuất kho + Thanh toán đã chi, đối chiếu với kế hoạch.
                </Text>

                {data.cost_planned === 0 && (
                    <Alert
                        type="warning"
                        showIcon
                        style={{ marginTop: 12 }}
                        message="Chưa có ước tính (JourneyEstimate) ở trạng thái 'approved'"
                        description="Không thể tính độ lệch ngân sách. Tạo & duyệt JourneyEstimate ở bước Solution Design."
                    />
                )}

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small" style={{ background: '#f0f9ff' }}>
                            <Statistic
                                title="Kế hoạch"
                                value={data.cost_planned}
                                formatter={(v) => fmtVND(Number(v))}
                                prefix={<LineChartOutlined />}
                                valueStyle={{ color: '#1890ff', fontSize: 18 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small" style={{ background: '#fff7e6' }}>
                            <Statistic
                                title="Thực tế (Vật tư + Chi)"
                                value={data.cost_actual}
                                formatter={(v) => fmtVND(Number(v))}
                                prefix={<DollarCircleOutlined />}
                                valueStyle={{ color: '#fa8c16', fontSize: 18 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small" style={{ background: isOverBudget ? '#fff1f0' : isUnderBudget ? '#f6ffed' : '#fafafa' }}>
                            <Statistic
                                title="Lệch so với KH"
                                value={Math.abs(data.cost_variance)}
                                formatter={(v) => `${data.cost_variance > 0 ? '+' : data.cost_variance < 0 ? '−' : ''}${fmtVND(Number(v))}`}
                                prefix={isOverBudget ? <WarningOutlined /> : null}
                                valueStyle={{
                                    color: isOverBudget ? '#cf1322' : isUnderBudget ? '#52c41a' : '#595959',
                                    fontSize: 18,
                                }}
                                suffix={data.cost_planned > 0 ? `(${fmtPct(variancePct)})` : ''}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Đã chi / Kế hoạch"
                                value={data.cost_planned > 0 ? Math.round((data.cost_actual / data.cost_planned) * 100) : 0}
                                suffix="%"
                                valueStyle={{ fontSize: 18 }}
                            />
                            <Progress
                                percent={data.cost_planned > 0 ? Math.min(100, (data.cost_actual / data.cost_planned) * 100) : 0}
                                strokeColor={isOverBudget ? '#cf1322' : '#52c41a'}
                                size="small"
                                showInfo={false}
                            />
                        </Card>
                    </Col>
                </Row>

                {isOverBudget && (
                    <Alert
                        type="error"
                        showIcon
                        style={{ marginTop: 16 }}
                        message={`Vượt ngân sách ${fmtPct(variancePct)}`}
                        description="Cần rà soát lại các khoản chi và nguồn vật tư đã xuất."
                    />
                )}
            </Card>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={
                            <Space>
                                <InboxOutlined />
                                <span>Chi phí Vật tư (Stock Out)</span>
                                <Tag color="orange">{fmtVND(data.cost_material_actual)}</Tag>
                            </Space>
                        }
                    >
                        <Table
                            dataSource={data.stockOrders}
                            columns={stockOrderColumns}
                            rowKey="_id"
                            size="small"
                            pagination={data.stockOrders.length > 5 ? { pageSize: 5 } : false}
                            locale={{ emptyText: 'Chưa có phiếu xuất kho.' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={
                            <Space>
                                <BankOutlined />
                                <span>Chi phí Thanh toán (Đã chi)</span>
                                <Tag color="red">{fmtVND(data.cost_payment_paid)}</Tag>
                            </Space>
                        }
                    >
                        <Table
                            dataSource={data.requests}
                            columns={requestColumns}
                            rowKey="_id"
                            size="small"
                            pagination={data.requests.length > 5 ? { pageSize: 5 } : false}
                            locale={{ emptyText: 'Chưa có khoản chi nào được duyệt.' }}
                        />
                    </Card>
                </Col>
            </Row>
        </Space>
    );
};

export default JourneyCostLedger;
