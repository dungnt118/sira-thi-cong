import React, { useEffect, useState } from 'react';
import {
    Alert,
    Card,
    Col,
    Descriptions,
    Empty,
    Progress,
    Row,
    Space,
    Spin,
    Statistic,
    Tag,
    Typography,
    message,
} from 'antd';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BankOutlined,
    DollarOutlined,
    InboxOutlined,
    LineChartOutlined,
    PieChartOutlined,
    RiseOutlined,
    WalletOutlined,
} from '@ant-design/icons';

import {
    aggregateJourneyFinancials,
    fmtPct,
    fmtVND,
    JourneyFinancialBreakdown,
} from '../../../../utils/journeyFinancialsAggregator';

const { Text, Title } = Typography;

/**
 * Wave 4 W4-01 — P&L Tab cho 1 Journey.
 *
 * Reuse `aggregateJourneyFinancials` (cùng helper với Cost Ledger + KT Reports).
 * Hiển thị:
 *   1. KPI: Doanh thu thực thu / Chi phí thực tế / Lãi gộp / % Margin
 *   2. Doanh thu breakdown: Hoá đơn xuất, Phiếu thu, Còn nợ
 *   3. Chi phí breakdown: Vật tư, Thanh toán
 *   4. So sánh với hợp đồng + ước tính
 */

export interface PnLTabProps {
    journeyId: string;
}

const PnLTab: React.FC<PnLTabProps> = ({ journeyId }) => {
    const [data, setData] = useState<JourneyFinancialBreakdown | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!journeyId) return;
        let cancelled = false;
        setLoading(true);
        aggregateJourneyFinancials(journeyId)
            .then(res => { if (!cancelled) setData(res); })
            .catch((e: any) => message.error(e?.message || 'Không thể tải báo cáo lãi/lỗ.'))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [journeyId]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>;
    }
    if (!data) {
        return <Empty description="Chưa có dữ liệu lãi/lỗ." />;
    }

    /* ─── Calc derived ───────────────────────────────────────── */

    const isProfit = data.gross_margin > 0;
    const marginPct = data.gross_margin_pct;
    const revenueProgress = data.contract_value > 0
        ? Math.min(100, (data.revenue_received / data.contract_value) * 100)
        : 0;

    /* ─── Render ─────────────────────────────────────────────── */

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card>
                <Title level={4} style={{ marginTop: 0 }}>
                    <LineChartOutlined /> Báo cáo Lãi / Lỗ
                </Title>
                <Text type="secondary">
                    Tổng hợp doanh thu thực thu, chi phí thực tế và biên lợi nhuận của công trình.
                    Số liệu cập nhật real-time từ phiếu thu, hoá đơn, vật tư và khoản chi.
                </Text>

                {data.contract_value === 0 && (
                    <Alert
                        type="warning"
                        showIcon
                        style={{ marginTop: 12 }}
                        message="Chưa có Hợp đồng (Quotation status='approved')"
                        description="Không thể tính tỷ lệ thu so với hợp đồng. Cập nhật báo giá thành 'approved' ở bước Hợp đồng."
                    />
                )}

                {/* KPI Row */}
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small" style={{ background: '#f6ffed' }}>
                            <Statistic
                                title="Doanh thu thực thu"
                                value={data.revenue_received}
                                formatter={(v) => fmtVND(Number(v))}
                                prefix={<RiseOutlined />}
                                valueStyle={{ color: '#52c41a', fontSize: 20 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small" style={{ background: '#fff1f0' }}>
                            <Statistic
                                title="Chi phí thực tế"
                                value={data.cost_actual}
                                formatter={(v) => fmtVND(Number(v))}
                                prefix={<ArrowDownOutlined />}
                                valueStyle={{ color: '#cf1322', fontSize: 20 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small" style={{ background: isProfit ? '#e6f7ff' : '#fff7e6' }}>
                            <Statistic
                                title={isProfit ? 'Lãi gộp' : 'Lỗ'}
                                value={Math.abs(data.gross_margin)}
                                formatter={(v) => fmtVND(Number(v))}
                                prefix={isProfit ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                valueStyle={{
                                    color: isProfit ? '#1890ff' : '#fa8c16',
                                    fontSize: 22,
                                    fontWeight: 700,
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Biên lợi nhuận"
                                value={Math.abs(marginPct)}
                                precision={1}
                                suffix="%"
                                prefix={isProfit ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                valueStyle={{
                                    color: isProfit ? (marginPct > 15 ? '#52c41a' : '#1890ff') : '#cf1322',
                                    fontSize: 20,
                                }}
                            />
                            {data.revenue_received > 0 && (
                                <Progress
                                    percent={Math.min(100, Math.max(0, marginPct))}
                                    showInfo={false}
                                    size="small"
                                    strokeColor={
                                        marginPct > 15 ? '#52c41a'
                                            : marginPct > 0 ? '#1890ff'
                                                : '#cf1322'
                                    }
                                />
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Tỷ lệ thu so với hợp đồng */}
                {data.contract_value > 0 && (
                    <Card size="small" style={{ marginTop: 16 }}>
                        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text strong>Tiến độ thu tiền so với Hợp đồng</Text>
                            <Text>
                                {fmtVND(data.revenue_received)} / <Text strong>{fmtVND(data.contract_value)}</Text>
                            </Text>
                        </Space>
                        <Progress
                            percent={Math.round(revenueProgress)}
                            strokeColor={{ from: '#fa8c16', to: '#52c41a' }}
                            format={p => `${p}%`}
                        />
                        {data.receivable_outstanding > 0 && (
                            <Text type="warning" style={{ fontSize: 12 }}>
                                <BankOutlined /> Còn nợ: <Text strong>{fmtVND(data.receivable_outstanding)}</Text>
                            </Text>
                        )}
                    </Card>
                )}
            </Card>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={
                            <Space>
                                <DollarOutlined style={{ color: '#52c41a' }} />
                                <span>Doanh thu</span>
                            </Space>
                        }
                    >
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Giá hợp đồng">
                                <Text strong>{fmtVND(data.contract_value)}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng đợt setup">
                                {fmtVND(data.total_milestones)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đã xuất hoá đơn (VAT)">
                                <Text>{fmtVND(data.revenue_invoiced)}</Text>
                                <Tag color="blue" style={{ marginLeft: 8 }}>{data.invoices.length} HĐ</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Đã thực thu">
                                <Text strong style={{ color: '#52c41a' }}>{fmtVND(data.revenue_received)}</Text>
                                <Tag color="success" style={{ marginLeft: 8 }}>{data.receipts.length} phiếu</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Còn nợ">
                                {data.receivable_outstanding > 0
                                    ? <Text strong style={{ color: '#cf1322' }}>{fmtVND(data.receivable_outstanding)}</Text>
                                    : <Tag color="success">Đã thu đủ</Tag>}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={
                            <Space>
                                <WalletOutlined style={{ color: '#cf1322' }} />
                                <span>Chi phí</span>
                            </Space>
                        }
                    >
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Kế hoạch (estimate)">
                                {fmtVND(data.cost_planned)}
                                {data.estimate?.version_no && (
                                    <Tag style={{ marginLeft: 8 }}>v{data.estimate.version_no}</Tag>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><InboxOutlined /> Vật tư đã xuất</>}>
                                {fmtVND(data.cost_material_actual)}
                                <Tag style={{ marginLeft: 8 }}>{data.stockOrders.length} phiếu</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={<><BankOutlined /> Đã chi</>}>
                                {fmtVND(data.cost_payment_paid)}
                                <Tag style={{ marginLeft: 8 }}>{data.requests.length} phiếu</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng chi thực tế">
                                <Text strong style={{ color: '#cf1322' }}>{fmtVND(data.cost_actual)}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Lệch so với KH">
                                {data.cost_planned > 0
                                    ? <>
                                        <Text strong style={{
                                            color: data.cost_variance > 0 ? '#cf1322' : data.cost_variance < 0 ? '#52c41a' : '#595959',
                                        }}>
                                            {data.cost_variance > 0 ? '+' : data.cost_variance < 0 ? '−' : ''}
                                            {fmtVND(Math.abs(data.cost_variance))}
                                        </Text>
                                        <Tag
                                            color={data.cost_variance > 0 ? 'error' : 'success'}
                                            style={{ marginLeft: 8 }}
                                        >
                                            {fmtPct(data.cost_variance_pct)}
                                        </Tag>
                                    </>
                                    : <Tag>Chưa có KH</Tag>}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            {/* Insights */}
            <Card size="small" title={<Space><PieChartOutlined /><span>Đánh giá</span></Space>}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {data.revenue_received === 0 && (
                        <Alert type="info" showIcon message="Chưa có dòng tiền thu vào." />
                    )}
                    {isProfit && marginPct > 20 && (
                        <Alert
                            type="success"
                            showIcon
                            message={`Lãi gộp tốt (${fmtPct(marginPct)})`}
                            description="Biên lợi nhuận trên 20%, hiệu quả tốt."
                        />
                    )}
                    {isProfit && marginPct < 5 && marginPct > 0 && (
                        <Alert
                            type="warning"
                            showIcon
                            message={`Biên lợi nhuận mỏng (${fmtPct(marginPct)})`}
                            description="Cần kiểm soát chi phí để tránh trượt sang lỗ."
                        />
                    )}
                    {!isProfit && data.revenue_received > 0 && (
                        <Alert
                            type="error"
                            showIcon
                            message={`Đang lỗ ${fmtVND(Math.abs(data.gross_margin))}`}
                            description="Chi phí thực tế vượt quá doanh thu thực thu. Cần can thiệp."
                        />
                    )}
                    {data.cost_variance_pct > 10 && (
                        <Alert
                            type="warning"
                            showIcon
                            message={`Vượt ngân sách ${fmtPct(data.cost_variance_pct)}`}
                            description="Chi phí thực tế đã vượt 10% so với ước tính."
                        />
                    )}
                    {data.receivable_outstanding > 0 && data.contract_value > 0
                        && data.revenue_received / data.contract_value < 0.5 && (
                        <Alert
                            type="warning"
                            showIcon
                            message="Mới thu được dưới 50% giá trị hợp đồng"
                            description="Theo dõi tiến độ thu để đảm bảo dòng tiền."
                        />
                    )}
                </Space>
            </Card>
        </Space>
    );
};

export default PnLTab;
