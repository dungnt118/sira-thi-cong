import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    Progress,
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
    DollarOutlined,
    DownloadOutlined,
    LineChartOutlined,
    ProjectOutlined,
    ReloadOutlined,
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

const { Text } = Typography;

/**
 * Wave 4 W4-03 — PM Reports (un-mocked).
 *
 * Cross-journey summary cho PM. Dùng cùng aggregator như KT Reports
 * nhưng tập trung view PM: tiến độ tài chính + cảnh báo công trình lỗ.
 */

interface JourneyRow {
    journey: IJourney;
    breakdown: JourneyFinancialBreakdown;
}

const PMReports: React.FC = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState<JourneyRow[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
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

            const breakdowns: JourneyRow[] = [];
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
            message.error(e?.message || 'Không thể tải báo cáo.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Summary ────────────────────────────────────────────── */

    const summary = useMemo(() => {
        return rows.reduce(
            (acc, r) => ({
                count: acc.count + 1,
                contractValue: acc.contractValue + r.breakdown.contract_value,
                revenue: acc.revenue + r.breakdown.revenue_received,
                cost: acc.cost + r.breakdown.cost_actual,
                margin: acc.margin + r.breakdown.gross_margin,
                receivable: acc.receivable + r.breakdown.receivable_outstanding,
                lossy: acc.lossy + (r.breakdown.gross_margin < 0 ? 1 : 0),
                overBudget: acc.overBudget + (r.breakdown.cost_variance_pct > 10 ? 1 : 0),
            }),
            { count: 0, contractValue: 0, revenue: 0, cost: 0, margin: 0, receivable: 0, lossy: 0, overBudget: 0 },
        );
    }, [rows]);

    /* ─── Columns ────────────────────────────────────────────── */

    const columns: ColumnsType<JourneyRow> = [
        {
            title: 'Mã / Công trình',
            key: 'code',
            fixed: 'left',
            width: 240,
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text
                        strong
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => navigate(`/admin/ql/journeys/${r.journey._id}`)}
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
            title: 'Tiến độ thu',
            key: 'collection',
            width: 200,
            render: (_, r) => {
                if (r.breakdown.contract_value === 0) return <Text type="secondary">Chưa có HĐ</Text>;
                const p = Math.round((r.breakdown.revenue_received / r.breakdown.contract_value) * 100);
                return (
                    <Tooltip title={`${fmtVND(r.breakdown.revenue_received)} / ${fmtVND(r.breakdown.contract_value)}`}>
                        <Progress percent={Math.min(100, p)} size="small" />
                    </Tooltip>
                );
            },
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
            render: (_, r) => (
                <Tag color={r.breakdown.gross_margin_pct > 15 ? 'success' : r.breakdown.gross_margin_pct > 0 ? 'processing' : 'error'}>
                    {fmtPct(r.breakdown.gross_margin_pct)}
                </Tag>
            ),
        },
        {
            title: 'Lệch ngân sách',
            key: 'variance',
            width: 130,
            align: 'right',
            render: (_, r) => {
                if (r.breakdown.cost_planned === 0) return <Text type="secondary">—</Text>;
                const v = r.breakdown.cost_variance_pct;
                return (
                    <Tag color={v > 10 ? 'error' : v > 5 ? 'warning' : v < -5 ? 'success' : 'default'}>
                        {v > 0 ? '+' : ''}{fmtPct(v)}
                    </Tag>
                );
            },
        },
        {
            title: 'Còn nợ',
            key: 'receivable',
            width: 150,
            align: 'right',
            render: (_, r) => {
                const v = r.breakdown.receivable_outstanding;
                if (v <= 0) return <Tag color="success">Đã thu đủ</Tag>;
                return <Text style={{ color: '#cf1322' }}>{fmtVND(v)}</Text>;
            },
        },
    ];

    /* ─── Render ─────────────────────────────────────────────── */

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Báo Cáo Quản lý</h2>
                <Space>
                    <Button icon={<LineChartOutlined />} onClick={() => navigate('/admin/ql/inbox')}>
                        Hộp duyệt
                    </Button>
                    <Tooltip title="Làm mới">
                        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
                    </Tooltip>
                </Space>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={12} md={6}>
                    <Card size="small">
                        <Statistic title="Tổng dự án" value={summary.count} prefix={<ProjectOutlined />} valueStyle={{ color: '#1890ff' }} />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card size="small" style={{ background: '#f6ffed' }}>
                        <Statistic
                            title="Doanh thu thực thu"
                            value={summary.revenue}
                            formatter={(v) => fmtVND(Number(v))}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#52c41a', fontSize: 18 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card size="small" style={{ background: summary.margin >= 0 ? '#e6f7ff' : '#fff7e6' }}>
                        <Statistic
                            title="Lãi/Lỗ tổng"
                            value={Math.abs(summary.margin)}
                            formatter={(v) => `${summary.margin >= 0 ? '+' : '−'}${fmtVND(Number(v))}`}
                            valueStyle={{ color: summary.margin >= 0 ? '#1890ff' : '#fa8c16', fontSize: 18, fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card size="small" style={{ background: '#fff1f0' }}>
                        <Statistic
                            title="Tổng phải thu"
                            value={summary.receivable}
                            formatter={(v) => fmtVND(Number(v))}
                            valueStyle={{ color: '#cf1322', fontSize: 18 }}
                        />
                    </Card>
                </Col>
            </Row>

            {(summary.lossy > 0 || summary.overBudget > 0) && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message={
                        <Space>
                            {summary.lossy > 0 && <span><strong>{summary.lossy}</strong> công trình đang lỗ</span>}
                            {summary.lossy > 0 && summary.overBudget > 0 && <span>·</span>}
                            {summary.overBudget > 0 && <span><strong>{summary.overBudget}</strong> công trình vượt ngân sách &gt;10%</span>}
                        </Space>
                    }
                    description="Sort cột 'Lãi/Lỗ' hoặc 'Lệch ngân sách' để xem chi tiết."
                />
            )}

            <Card>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 48 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 12, color: '#8c8c8c' }}>Aggregating financials cross-journey...</div>
                    </div>
                ) : (
                    <Table
                        dataSource={rows}
                        columns={columns}
                        rowKey={(r) => r.journey._id}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        pagination={{ pageSize: 30, showTotal: (t) => `${t} công trình` }}
                        locale={{ emptyText: 'Không có dữ liệu công trình.' }}
                    />
                )}
            </Card>
        </div>
    );
};

export default PMReports;
