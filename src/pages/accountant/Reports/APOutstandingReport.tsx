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
    PieChartOutlined,
    ReloadOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { paymentRequestService } from '../../../services/core-contracts/services/paymentRequest.service';
import { IPaymentRequest } from '../../../services/core-contracts/types/paymentRequest.types';
import { buildFilter } from '@/utils/filterBuilder';

const { Text } = Typography;

/**
 * Wave 4 W4-03.4 — AP Outstanding Report (Công nợ phải trả).
 *
 * PaymentRequest status='approved' (đã duyệt nhưng chưa chi).
 * Group theo loại + tuổi (kể từ ngày approved).
 */

const TYPE_LABEL: Record<string, string> = {
    supplier_payment: 'Trả NCC',
    expense_reimbursement: 'Hoàn ứng',
    salary_payment: 'Trả lương',
    tax_payment: 'Nộp thuế',
    internal_transfer: 'Chuyển nội bộ',
    other: 'Khác',
};

const PRIORITY_COLOR: Record<string, string> = {
    normal: 'default',
    urgent: 'orange',
    critical: 'red',
};

const APOutstandingReport: React.FC = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<IPaymentRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await paymentRequestService.queryPaymentRequestsDto(buildFilter({
                where: { id: 'status', value: 'approved' },
                sortBy: [{ id: 'approved_at', desc: false }],
                limit: 500,
            }));
            setRequests(res?.data || []);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải báo cáo AP.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Stats by type ─────────────────────────────────────── */

    const byType = useMemo(() => {
        const map: Record<string, { count: number; amount: number }> = {};
        for (const r of requests) {
            const t = r.request_type ?? 'other';
            if (!map[t]) map[t] = { count: 0, amount: 0 };
            map[t].count += 1;
            map[t].amount += r.amount ?? 0;
        }
        return map;
    }, [requests]);

    const total = requests.reduce((s, r) => s + (r.amount ?? 0), 0);
    const urgentTotal = requests
        .filter(r => r.priority === 'urgent' || r.priority === 'critical')
        .reduce((s, r) => s + (r.amount ?? 0), 0);

    /* ─── Columns ────────────────────────────────────────────── */

    const columns: ColumnsType<IPaymentRequest> = [
        {
            title: 'Mã / Người thụ hưởng',
            key: 'code',
            fixed: 'left',
            width: 220,
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.code ?? r._id.slice(-6).toUpperCase()}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {r.beneficiary_name_snapshot ?? '—'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Loại chi',
            dataIndex: 'request_type',
            key: 'request_type',
            width: 140,
            render: (t) => <Tag>{TYPE_LABEL[t] ?? t ?? '—'}</Tag>,
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            align: 'right',
            sorter: (a, b) => (a.amount ?? 0) - (b.amount ?? 0),
            render: (v: number) => (
                <Text strong style={{ color: '#cf1322' }}>
                    {(v ?? 0).toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
        {
            title: 'Mức ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            width: 110,
            render: (p) => {
                const color = PRIORITY_COLOR[p] ?? 'default';
                const label = p === 'critical' ? 'Khẩn' : p === 'urgent' ? 'Gấp' : 'Thường';
                return (
                    <Tag color={color}>
                        {p === 'critical' && <WarningOutlined style={{ marginRight: 4 }} />}
                        {label}
                    </Tag>
                );
            },
        },
        {
            title: 'Đã duyệt',
            dataIndex: 'approved_at',
            key: 'approved_at',
            width: 120,
            sorter: (a, b) => {
                const da = a.approved_at ? dayjs(a.approved_at).valueOf() : 0;
                const db = b.approved_at ? dayjs(b.approved_at).valueOf() : 0;
                return da - db;
            },
            render: (d) => d ? dayjs(d).format('DD/MM/YYYY') : '—',
        },
        {
            title: 'Tuổi (ngày)',
            key: 'age',
            width: 120,
            render: (_, r) => {
                if (!r.approved_at) return '—';
                const days = dayjs().diff(dayjs(r.approved_at), 'day');
                return (
                    <Tag color={days > 30 ? 'error' : days > 14 ? 'orange' : days > 7 ? 'gold' : 'default'}>
                        {days} ngày
                    </Tag>
                );
            },
        },
        {
            title: 'Nội dung',
            dataIndex: 'payment_content',
            key: 'payment_content',
            ellipsis: true,
            render: (v) => v || <Text type="secondary">—</Text>,
        },
    ];

    return (
        <Card
            title={
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/kt/reports')} type="text" />
                    <PieChartOutlined />
                    <span>AP Outstanding — Công nợ phải trả</span>
                </Space>
            }
            extra={
                <Tooltip title="Làm mới">
                    <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
                </Tooltip>
            }
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ background: '#fff1f0' }}>
                        <Statistic
                            title="Tổng phải trả"
                            value={total}
                            formatter={(v) => `${Number(v).toLocaleString('vi-VN')}đ`}
                            valueStyle={{ color: '#cf1322', fontSize: 18 }}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>{requests.length} phiếu</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ background: '#fff7e6' }}>
                        <Statistic
                            title="Khẩn / Gấp"
                            value={urgentTotal}
                            formatter={(v) => `${Number(v).toLocaleString('vi-VN')}đ`}
                            valueStyle={{ color: '#fa8c16', fontSize: 18 }}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {requests.filter(r => r.priority === 'urgent' || r.priority === 'critical').length} phiếu ưu tiên
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Phân loại</Text>
                        <Space wrap size={4}>
                            {Object.entries(byType).map(([t, v]) => (
                                <Tooltip key={t} title={`${v.count} phiếu`}>
                                    <Tag color="blue">
                                        {TYPE_LABEL[t] ?? t}: {(v.amount).toLocaleString('vi-VN')}đ
                                    </Tag>
                                </Tooltip>
                            ))}
                        </Space>
                    </Card>
                </Col>
            </Row>

            {urgentTotal > 0 && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message={`Có ${urgentTotal.toLocaleString('vi-VN')}đ phiếu chi khẩn/gấp đang chờ thanh toán`}
                    description="Cần ưu tiên xử lý để tránh ảnh hưởng tiến độ công trình hoặc quan hệ NCC."
                />
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
            ) : (
                <Table
                    dataSource={requests}
                    columns={columns}
                    rowKey="_id"
                    size="small"
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 30, showTotal: (t) => `${t} phiếu` }}
                    locale={{ emptyText: 'Không có công nợ phải trả nào.' }}
                />
            )}
        </Card>
    );
};

export default APOutstandingReport;
