import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Row,
    Space,
    Spin,
    Statistic,
    Table,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    ArrowLeftOutlined,
    DownloadOutlined,
    LineChartOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { paymentReceiptService } from '../../../services/core-contracts/services/paymentReceipt.service';
import { paymentRequestService } from '../../../services/core-contracts/services/paymentRequest.service';
import { buildFilter } from '@/utils/filterBuilder';

const { Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * Wave 4 W4-03.2 — Cash Flow Report theo tháng.
 *
 * Group inflow (PaymentReceipt) + outflow (PaymentRequest paid) by month.
 * Show running net.
 */

interface MonthlyCashFlow {
    month: string;
    inflow: number;
    outflow: number;
    net: number;
    runningBalance: number;
    inflowCount: number;
    outflowCount: number;
}

const CashFlowReport: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
        dayjs().startOf('year'),
        dayjs().endOf('year'),
    ]);
    const [data, setData] = useState<MonthlyCashFlow[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [receiptsRes, requestsRes] = await Promise.all([
                paymentReceiptService.queryPaymentReceiptsDto(buildFilter({
                    sortBy: [{ id: 'receipt_date', desc: false }],
                    limit: 1000,
                })),
                paymentRequestService.queryPaymentRequestsDto(buildFilter({
                    where: { id: 'status', value: 'paid' },
                    sortBy: [{ id: 'paid_at', desc: false }],
                    limit: 1000,
                })),
            ]);

            const receipts = receiptsRes?.data || [];
            const requests = requestsRes?.data || [];

            // Group by month
            const months: Record<string, MonthlyCashFlow> = {};
            const ensureMonth = (key: string) => {
                if (!months[key]) {
                    months[key] = {
                        month: key,
                        inflow: 0,
                        outflow: 0,
                        net: 0,
                        runningBalance: 0,
                        inflowCount: 0,
                        outflowCount: 0,
                    };
                }
                return months[key];
            };

            for (const r of receipts) {
                const d = r.receipt_date ? dayjs(r.receipt_date) : null;
                if (!d || !d.isValid()) continue;
                const key = d.format('YYYY-MM');
                const m = ensureMonth(key);
                m.inflow += r.amount_received ?? 0;
                m.inflowCount += 1;
            }
            for (const req of requests) {
                const d = req.paid_at ? dayjs(req.paid_at) : null;
                if (!d || !d.isValid()) continue;
                const key = d.format('YYYY-MM');
                const m = ensureMonth(key);
                m.outflow += req.amount ?? 0;
                m.outflowCount += 1;
            }

            // Compute net + running
            const sorted = Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
            let running = 0;
            for (const m of sorted) {
                m.net = m.inflow - m.outflow;
                running += m.net;
                m.runningBalance = running;
            }
            setData(sorted);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải báo cáo dòng tiền.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Filter by range ────────────────────────────────────── */

    const filtered = useMemo(() => {
        const startKey = dateRange[0].format('YYYY-MM');
        const endKey = dateRange[1].format('YYYY-MM');
        return data.filter(d => d.month >= startKey && d.month <= endKey);
    }, [data, dateRange]);

    const totals = useMemo(() => {
        return filtered.reduce(
            (acc, m) => ({
                inflow: acc.inflow + m.inflow,
                outflow: acc.outflow + m.outflow,
                net: acc.net + m.net,
            }),
            { inflow: 0, outflow: 0, net: 0 },
        );
    }, [filtered]);

    /* ─── Columns ────────────────────────────────────────────── */

    const columns: ColumnsType<MonthlyCashFlow> = [
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
            width: 100,
            render: (m) => dayjs(m).format('MM/YYYY'),
        },
        {
            title: 'Thu vào',
            key: 'inflow',
            width: 160,
            align: 'right',
            sorter: (a, b) => a.inflow - b.inflow,
            render: (_, r) => (
                <Space direction="vertical" size={0} align="end">
                    <Text strong style={{ color: '#52c41a' }}>+{r.inflow.toLocaleString('vi-VN')}đ</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{r.inflowCount} phiếu</Text>
                </Space>
            ),
        },
        {
            title: 'Chi ra',
            key: 'outflow',
            width: 160,
            align: 'right',
            sorter: (a, b) => a.outflow - b.outflow,
            render: (_, r) => (
                <Space direction="vertical" size={0} align="end">
                    <Text strong style={{ color: '#cf1322' }}>−{r.outflow.toLocaleString('vi-VN')}đ</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{r.outflowCount} phiếu</Text>
                </Space>
            ),
        },
        {
            title: 'Net',
            key: 'net',
            width: 160,
            align: 'right',
            sorter: (a, b) => a.net - b.net,
            render: (_, r) => (
                <Text strong style={{ color: r.net >= 0 ? '#1890ff' : '#fa8c16' }}>
                    {r.net >= 0 ? '+' : '−'}{Math.abs(r.net).toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
        {
            title: 'Số dư luỹ kế',
            key: 'running',
            width: 160,
            align: 'right',
            render: (_, r) => (
                <Text style={{ color: r.runningBalance >= 0 ? '#52c41a' : '#cf1322' }}>
                    {r.runningBalance >= 0 ? '' : '−'}{Math.abs(r.runningBalance).toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
    ];

    /* ─── Render ─────────────────────────────────────────────── */

    return (
        <Card
            title={
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/kt/reports')} type="text" />
                    <LineChartOutlined />
                    <span>Báo cáo Dòng tiền</span>
                </Space>
            }
            extra={
                <Space>
                    <RangePicker
                        picker="month"
                        value={dateRange}
                        onChange={(v) => v && v[0] && v[1] && setDateRange([v[0], v[1]])}
                        format="MM/YYYY"
                        allowClear={false}
                    />
                    <Tooltip title="Làm mới">
                        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
                    </Tooltip>
                </Space>
            }
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ background: '#f6ffed' }}>
                        <Statistic
                            title="Tổng thu trong kỳ"
                            value={totals.inflow}
                            formatter={(v) => `${Number(v).toLocaleString('vi-VN')}đ`}
                            valueStyle={{ color: '#52c41a', fontSize: 18 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ background: '#fff1f0' }}>
                        <Statistic
                            title="Tổng chi trong kỳ"
                            value={totals.outflow}
                            formatter={(v) => `${Number(v).toLocaleString('vi-VN')}đ`}
                            valueStyle={{ color: '#cf1322', fontSize: 18 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ background: totals.net >= 0 ? '#e6f7ff' : '#fff7e6' }}>
                        <Statistic
                            title="Net trong kỳ"
                            value={Math.abs(totals.net)}
                            formatter={(v) => `${totals.net >= 0 ? '+' : '−'}${Number(v).toLocaleString('vi-VN')}đ`}
                            valueStyle={{ color: totals.net >= 0 ? '#1890ff' : '#fa8c16', fontSize: 18, fontWeight: 700 }}
                        />
                    </Card>
                </Col>
            </Row>

            {totals.outflow > totals.inflow && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 12 }}
                    message="Dòng tiền âm trong kỳ"
                    description="Chi nhiều hơn thu. Cần đẩy nhanh thu hồi công nợ hoặc giãn các khoản chi."
                />
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
            ) : (
                <Table
                    dataSource={filtered}
                    columns={columns}
                    rowKey="month"
                    size="small"
                    pagination={false}
                    locale={{ emptyText: 'Không có dữ liệu trong khoảng thời gian.' }}
                />
            )}
        </Card>
    );
};

export default CashFlowReport;
