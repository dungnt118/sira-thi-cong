import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    Input,
    Row,
    Space,
    Spin,
    Statistic,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    ArrowLeftOutlined,
    DownloadOutlined,
    LineChartOutlined,
    ReloadOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { IJourney } from '../../../services/core-contracts/types/journey.types';
import {
    aggregateJourneyFinancials,
    fetchAllPaidPaymentRequests,
    fmtPct,
    fmtVND,
    JourneyFinancialBreakdown,
} from '../../../utils/journeyFinancialsAggregator';
import { buildFilter } from '@/utils/filterBuilder';

const { Text, Title } = Typography;

/**
 * Wave 4 W4-03.1 — P&L Report (cross-journey).
 *
 * Loads ALL active journeys (status NOT IN cancelled/draft) and computes financials per journey.
 * Aggregated KPIs at top + sortable table.
 */

interface JourneyPnL {
    journey: IJourney;
    breakdown: JourneyFinancialBreakdown;
}

const PnLReport: React.FC = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState<JourneyPnL[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchAllJourneys = useCallback(async () => {
        setLoading(true);
        try {
            // Pull active journeys + all paid PaymentRequests song song (cache cho aggregator).
            const [journeysRes, paidRequestsRes] = await Promise.all([
                journeyService.queryJourneysDto(buildFilter({
                    sortBy: [{ id: 'createdAt', desc: true }],
                    limit: 100,
                })),
                fetchAllPaidPaymentRequests(),
            ]);
            const journeys: IJourney[] = (journeysRes?.data || []).filter(
                j => !['cancelled', 'archived'].includes((j as any).status ?? '')
            );
            const paidRequestsCache = paidRequestsRes?.data || [];

            // Aggregate concurrently (max 10 in flight for politeness).
            // Pass paidRequestsCache để skip global PaymentRequest fetch trong mỗi aggregate.
            const breakdowns: JourneyPnL[] = [];
            const BATCH = 10;
            for (let i = 0; i < journeys.length; i += BATCH) {
                const slice = journeys.slice(i, i + BATCH);
                const results = await Promise.all(
                    slice.map(j =>
                        aggregateJourneyFinancials(j._id, { paidRequestsCache })
                            .then(b => ({ journey: j, breakdown: b }))
                    )
                );
                breakdowns.push(...results);
            }
            setRows(breakdowns);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải báo cáo P&L.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllJourneys(); }, [fetchAllJourneys]);

    /* ─── Filtered rows ─────────────────────────────────────── */

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return rows;
        return rows.filter(r => {
            const j = r.journey;
            return (j.journey_code ?? '').toLowerCase().includes(q)
                || ((j as any).name ?? (j as any).journey_name ?? '').toLowerCase().includes(q)
                || (j.customer_full_name ?? '').toLowerCase().includes(q);
        });
    }, [rows, search]);

    /* ─── Aggregate KPIs ─────────────────────────────────────── */

    const totals = useMemo(() => {
        return filtered.reduce(
            (acc, r) => ({
                revenue: acc.revenue + r.breakdown.revenue_received,
                cost: acc.cost + r.breakdown.cost_actual,
                margin: acc.margin + r.breakdown.gross_margin,
                contractValue: acc.contractValue + r.breakdown.contract_value,
            }),
            { revenue: 0, cost: 0, margin: 0, contractValue: 0 },
        );
    }, [filtered]);

    const totalMarginPct = totals.revenue > 0 ? (totals.margin / totals.revenue) * 100 : 0;

    /* ─── Columns ────────────────────────────────────────────── */

    const columns: ColumnsType<JourneyPnL> = [
        {
            title: 'Mã / Công trình',
            key: 'journey',
            fixed: 'left',
            width: 240,
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text
                        strong
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => navigate(`/admin/kt/journeys/${r.journey._id}`)}
                    >
                        {r.journey.journey_code ?? r.journey._id.slice(-6).toUpperCase()}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                        {(r.journey as any).name ?? (r.journey as any).journey_name ?? r.journey.customer_full_name ?? '—'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Hợp đồng',
            key: 'contract_value',
            width: 140,
            align: 'right',
            sorter: (a, b) => a.breakdown.contract_value - b.breakdown.contract_value,
            render: (_, r) => fmtVND(r.breakdown.contract_value),
        },
        {
            title: 'Doanh thu thực thu',
            key: 'revenue',
            width: 160,
            align: 'right',
            sorter: (a, b) => a.breakdown.revenue_received - b.breakdown.revenue_received,
            render: (_, r) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {fmtVND(r.breakdown.revenue_received)}
                </Text>
            ),
        },
        {
            title: 'Chi phí thực tế',
            key: 'cost',
            width: 160,
            align: 'right',
            sorter: (a, b) => a.breakdown.cost_actual - b.breakdown.cost_actual,
            render: (_, r) => (
                <Text strong style={{ color: '#cf1322' }}>
                    {fmtVND(r.breakdown.cost_actual)}
                </Text>
            ),
        },
        {
            title: 'Lãi/Lỗ',
            key: 'margin',
            width: 160,
            align: 'right',
            sorter: (a, b) => a.breakdown.gross_margin - b.breakdown.gross_margin,
            render: (_, r) => {
                const m = r.breakdown.gross_margin;
                return (
                    <Text strong style={{ color: m > 0 ? '#1890ff' : m < 0 ? '#cf1322' : '#595959' }}>
                        {m === 0 ? fmtVND(0) : (m > 0 ? '+' : '−') + fmtVND(Math.abs(m))}
                    </Text>
                );
            },
        },
        {
            title: '% Margin',
            key: 'margin_pct',
            width: 110,
            align: 'right',
            sorter: (a, b) => a.breakdown.gross_margin_pct - b.breakdown.gross_margin_pct,
            render: (_, r) => {
                const p = r.breakdown.gross_margin_pct;
                return (
                    <Tag color={p > 15 ? 'success' : p > 5 ? 'processing' : p > 0 ? 'warning' : 'error'}>
                        {fmtPct(p)}
                    </Tag>
                );
            },
        },
        {
            title: 'Lệch KH',
            key: 'variance',
            width: 130,
            align: 'right',
            sorter: (a, b) => a.breakdown.cost_variance_pct - b.breakdown.cost_variance_pct,
            render: (_, r) => {
                if (r.breakdown.cost_planned === 0) return <Text type="secondary">—</Text>;
                const v = r.breakdown.cost_variance_pct;
                return (
                    <Text style={{ color: v > 5 ? '#cf1322' : v < -5 ? '#52c41a' : '#595959' }}>
                        {v > 0 ? '+' : ''}{fmtPct(v)}
                    </Text>
                );
            },
        },
    ];

    /* ─── Export CSV ─────────────────────────────────────────── */

    const handleExportCSV = () => {
        const headers = ['Mã', 'Tên', 'Hợp đồng', 'Doanh thu', 'Chi phí', 'Lãi/Lỗ', '% Margin', '% Lệch KH'];
        const csvRows = filtered.map(r => [
            r.journey.journey_code ?? '',
            (((r.journey as any).name ?? (r.journey as any).journey_name ?? r.journey.customer_full_name ?? '') as string).replace(/[\r\n]+/g, ' '),
            r.breakdown.contract_value,
            r.breakdown.revenue_received,
            r.breakdown.cost_actual,
            r.breakdown.gross_margin,
            r.breakdown.gross_margin_pct.toFixed(1),
            r.breakdown.cost_variance_pct.toFixed(1),
        ]);
        const csv = [headers, ...csvRows]
            .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pnl-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    /* ─── Render ─────────────────────────────────────────────── */

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card
                title={
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/kt/reports')} type="text" />
                        <LineChartOutlined />
                        <span>Báo cáo Lãi/Lỗ tổng hợp</span>
                    </Space>
                }
                extra={
                    <Space>
                        <Button icon={<DownloadOutlined />} onClick={handleExportCSV} disabled={filtered.length === 0}>
                            Xuất CSV
                        </Button>
                        <Tooltip title="Làm mới">
                            <Button icon={<ReloadOutlined />} onClick={fetchAllJourneys} loading={loading} />
                        </Tooltip>
                    </Space>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col xs={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Tổng hợp đồng"
                                value={totals.contractValue}
                                formatter={(v) => fmtVND(Number(v))}
                                valueStyle={{ fontSize: 18 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card size="small" style={{ background: '#f6ffed' }}>
                            <Statistic
                                title="Tổng doanh thu thực"
                                value={totals.revenue}
                                formatter={(v) => fmtVND(Number(v))}
                                valueStyle={{ color: '#52c41a', fontSize: 18 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card size="small" style={{ background: '#fff1f0' }}>
                            <Statistic
                                title="Tổng chi phí"
                                value={totals.cost}
                                formatter={(v) => fmtVND(Number(v))}
                                valueStyle={{ color: '#cf1322', fontSize: 18 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card size="small" style={{ background: totals.margin >= 0 ? '#e6f7ff' : '#fff7e6' }}>
                            <Statistic
                                title={`Lãi/Lỗ (${fmtPct(totalMarginPct)})`}
                                value={Math.abs(totals.margin)}
                                formatter={(v) => `${totals.margin >= 0 ? '+' : '−'}${fmtVND(Number(v))}`}
                                valueStyle={{
                                    color: totals.margin >= 0 ? '#1890ff' : '#fa8c16',
                                    fontSize: 18,
                                    fontWeight: 700,
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Card>
                <Space style={{ marginBottom: 12 }} wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Tìm theo mã/tên công trình..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        allowClear
                        style={{ width: 280 }}
                    />
                    {loading && <Text type="secondary">Đang tổng hợp dữ liệu... <Spin size="small" /></Text>}
                </Space>

                <Alert
                    type="info"
                    showIcon
                    style={{ marginBottom: 12 }}
                    message="Số liệu cross-journey được tính từ phiếu thu, hoá đơn, vật tư xuất kho và khoản chi đã duyệt."
                />

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 64 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 12, color: '#8c8c8c' }}>Đang aggregate financials...</div>
                    </div>
                ) : (
                    <Table
                        dataSource={filtered}
                        columns={columns}
                        rowKey={(r) => r.journey._id}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        pagination={{ pageSize: 30, showTotal: (t) => `${t} công trình` }}
                        locale={{ emptyText: 'Không có công trình nào.' }}
                    />
                )}
            </Card>
        </Space>
    );
};

export default PnLReport;
