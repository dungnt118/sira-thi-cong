import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
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
    AuditOutlined,
    DownloadOutlined,
    ReloadOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { paymentMilestoneService } from '../../../services/core-contracts/services/paymentMilestone.service';
import { IPaymentMilestone } from '../../../services/core-contracts/types/paymentMilestone.types';
import { buildFilter } from '@/utils/filterBuilder';

const { Text } = Typography;

/**
 * Wave 4 W4-03.3 — AR Aging Report (Tuổi nợ phải thu).
 *
 * Phân tích PaymentMilestone status='pending' / 'partially_paid' theo tuổi quá hạn:
 *   - Trong hạn: due_date >= today
 *   - 0–30 ngày quá hạn
 *   - 31–60 ngày
 *   - 61–90 ngày
 *   - >90 ngày (rủi ro cao)
 */

type AgingBucket = 'current' | '0_30' | '31_60' | '61_90' | 'over_90';

const BUCKET_CONFIG: Record<AgingBucket, { label: string; color: string; bg: string }> = {
    current: { label: 'Trong hạn', color: '#52c41a', bg: '#f6ffed' },
    '0_30': { label: '0–30 ngày', color: '#1890ff', bg: '#e6f7ff' },
    '31_60': { label: '31–60 ngày', color: '#fa8c16', bg: '#fff7e6' },
    '61_90': { label: '61–90 ngày', color: '#fa541c', bg: '#fff2e8' },
    over_90: { label: '> 90 ngày', color: '#cf1322', bg: '#fff1f0' },
};

const computeBucket = (m: IPaymentMilestone): AgingBucket => {
    if (!m.due_date) return 'current';
    const days = dayjs().diff(dayjs(m.due_date), 'day');
    if (days < 0) return 'current';
    if (days <= 30) return '0_30';
    if (days <= 60) return '31_60';
    if (days <= 90) return '61_90';
    return 'over_90';
};

const remainingOf = (m: IPaymentMilestone): number =>
    m.remaining_amount ?? Math.max(0, (m.amount ?? 0) - (m.amount_received_total ?? 0));

const ARAgingReport: React.FC = () => {
    const navigate = useNavigate();
    const [milestones, setMilestones] = useState<IPaymentMilestone[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await paymentMilestoneService.queryPaymentMilestonesDto(buildFilter({
                sortBy: [{ id: 'due_date', desc: false }],
                limit: 500,
            }));
            // Filter chỉ lấy milestone còn nợ (remaining > 0)
            const withDebt = (res?.data || []).filter(m => remainingOf(m) > 0 && m.status !== 'paid');
            setMilestones(withDebt);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải báo cáo AR Aging.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Group by bucket ────────────────────────────────────── */

    const buckets = useMemo(() => {
        const result: Record<AgingBucket, { items: IPaymentMilestone[]; total: number }> = {
            current: { items: [], total: 0 },
            '0_30': { items: [], total: 0 },
            '31_60': { items: [], total: 0 },
            '61_90': { items: [], total: 0 },
            over_90: { items: [], total: 0 },
        };
        for (const m of milestones) {
            const b = computeBucket(m);
            result[b].items.push(m);
            result[b].total += remainingOf(m);
        }
        return result;
    }, [milestones]);

    const grandTotal = milestones.reduce((s, m) => s + remainingOf(m), 0);
    const overdueTotal = (['0_30', '31_60', '61_90', 'over_90'] as AgingBucket[])
        .reduce((s, b) => s + buckets[b].total, 0);

    /* ─── Columns (flat list with bucket tag) ─────────────── */

    const columns: ColumnsType<IPaymentMilestone> = [
        {
            title: 'Khách hàng / Công trình',
            key: 'subject',
            fixed: 'left',
            width: 280,
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.journey_name ?? '—'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Đợt #{r.round ?? '?'} · {r.receipt_note ?? r.kind ?? ''}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Số nợ còn lại',
            key: 'remaining',
            width: 160,
            align: 'right',
            sorter: (a, b) => remainingOf(a) - remainingOf(b),
            render: (_, r) => (
                <Text strong style={{ color: '#cf1322' }}>
                    {remainingOf(r).toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
        {
            title: 'Hạn thu',
            dataIndex: 'due_date',
            key: 'due_date',
            width: 120,
            sorter: (a, b) => {
                const da = a.due_date ? dayjs(a.due_date).valueOf() : 0;
                const db = b.due_date ? dayjs(b.due_date).valueOf() : 0;
                return da - db;
            },
            render: (d) => d ? dayjs(d).format('DD/MM/YYYY') : '—',
        },
        {
            title: 'Tuổi nợ',
            key: 'aging',
            width: 130,
            sorter: (a, b) => {
                const da = a.due_date ? dayjs().diff(dayjs(a.due_date), 'day') : 0;
                const db = b.due_date ? dayjs().diff(dayjs(b.due_date), 'day') : 0;
                return da - db;
            },
            render: (_, r) => {
                const b = computeBucket(r);
                const cfg = BUCKET_CONFIG[b];
                if (b === 'current') return <Tag color="success">{cfg.label}</Tag>;
                const days = r.due_date ? dayjs().diff(dayjs(r.due_date), 'day') : 0;
                return (
                    <Space size={4}>
                        <Tag color={b === 'over_90' ? 'error' : b === '61_90' ? 'volcano' : b === '31_60' ? 'orange' : 'blue'}>
                            {days} ngày
                        </Tag>
                        {b === 'over_90' && <WarningOutlined style={{ color: '#cf1322' }} />}
                    </Space>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (s) => <Tag>{s ?? '—'}</Tag>,
        },
        {
            title: '',
            key: 'action',
            width: 120,
            render: (_, r) => (
                <Button
                    size="small"
                    type="link"
                    onClick={() => r.journey_id && navigate(`/admin/kt/journeys/${r.journey_id}`)}
                >
                    Xem CT
                </Button>
            ),
        },
    ];

    return (
        <Card
            title={
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/kt/reports')} type="text" />
                    <AuditOutlined />
                    <span>AR Aging — Tuổi nợ phải thu</span>
                </Space>
            }
            extra={
                <Tooltip title="Làm mới">
                    <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
                </Tooltip>
            }
        >
            {/* 5 buckets summary */}
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                {(Object.keys(BUCKET_CONFIG) as AgingBucket[]).map(b => {
                    const cfg = BUCKET_CONFIG[b];
                    const data = buckets[b];
                    return (
                        <Col key={b} xs={12} sm={8} md={5} lg={5}>
                            <Card size="small" style={{ background: cfg.bg, height: '100%' }}>
                                <Statistic
                                    title={<Text style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</Text>}
                                    value={data.total}
                                    formatter={(v) => `${Number(v).toLocaleString('vi-VN')}đ`}
                                    valueStyle={{ color: cfg.color, fontSize: 16 }}
                                />
                                <Text type="secondary" style={{ fontSize: 11 }}>{data.items.length} đợt</Text>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {grandTotal > 0 && (
                <Alert
                    type={overdueTotal / grandTotal > 0.3 ? 'error' : overdueTotal / grandTotal > 0.1 ? 'warning' : 'info'}
                    showIcon
                    style={{ marginBottom: 16 }}
                    message={
                        <span>
                            Tổng phải thu: <strong>{grandTotal.toLocaleString('vi-VN')}đ</strong>
                            {' — '}
                            Quá hạn: <strong style={{ color: '#cf1322' }}>{overdueTotal.toLocaleString('vi-VN')}đ</strong>
                            {' '}({((overdueTotal / grandTotal) * 100).toFixed(1)}%)
                        </span>
                    }
                />
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
            ) : (
                <Table
                    dataSource={milestones}
                    columns={columns}
                    rowKey="_id"
                    size="small"
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 30, showTotal: (t) => `${t} khoản nợ` }}
                    locale={{ emptyText: 'Không có khoản phải thu nào quá hạn.' }}
                />
            )}
        </Card>
    );
};

export default ARAgingReport;
