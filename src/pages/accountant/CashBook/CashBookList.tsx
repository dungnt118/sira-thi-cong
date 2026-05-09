import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Col,
    DatePicker,
    Row,
    Select,
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
    BankOutlined,
    DownloadOutlined,
    DownOutlined,
    LineChartOutlined,
    ReloadOutlined,
    RiseOutlined,
    UpOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

import { paymentReceiptService } from '../../../services/core-contracts/services/paymentReceipt.service';
import { paymentRequestService } from '../../../services/core-contracts/services/paymentRequest.service';
import { companyBankAccountService } from '../../../services/core-contracts/services/companyBankAccount.service';
import { IPaymentReceipt } from '../../../services/core-contracts/types/paymentReceipt.types';
import { IPaymentRequest } from '../../../services/core-contracts/types/paymentRequest.types';
import { ICompanyBankAccount } from '../../../services/core-contracts/types/companyBankAccount.types';
import { buildFilter } from '@/utils/filterBuilder';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

/**
 * Wave 4 W4-02b — Cash Book / Sổ quỹ (read-only view).
 *
 * Aggregates dòng tiền vào (PaymentReceipt) và dòng tiền ra (PaymentRequest paid)
 * theo từng tài khoản ngân hàng công ty. Hiển thị running balance.
 *
 * KT có thể:
 *   - Filter theo khoảng ngày
 *   - Filter theo tài khoản công ty
 *   - Xem từng giao dịch + drill-down
 *
 * Read-only — không sửa dữ liệu ở đây. Sửa qua PaymentReceipt / PaymentRequest module.
 */

interface CashFlowEntry {
    id: string;
    date: string | Date;
    type: 'inflow' | 'outflow';
    amount: number;
    bankAccountId?: string;
    description?: string;
    journeyName?: string;
    customerName?: string;
    reference?: string;
    sourceType: 'receipt' | 'request';
    sourceData: IPaymentReceipt | IPaymentRequest;
}

const CashBookList: React.FC = () => {
    const [receipts, setReceipts] = useState<IPaymentReceipt[]>([]);
    const [requests, setRequests] = useState<IPaymentRequest[]>([]);
    const [bankAccounts, setBankAccounts] = useState<ICompanyBankAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
        // Wave 6 W6-03 — Default range "30 ngày qua" thay vì "Tháng này" để KT thấy
        // được transactions ở cuối tháng trước (use case phổ biến đầu mỗi tháng).
        dayjs().subtract(30, 'day').startOf('day'),
        dayjs().endOf('day'),
    ]);
    const [bankFilter, setBankFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'all' | 'inflow' | 'outflow'>('all');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [receiptsRes, requestsRes, banksRes] = await Promise.all([
                paymentReceiptService.queryPaymentReceiptsDto(buildFilter({
                    sortBy: [{ id: 'receipt_date', desc: true }],
                    limit: 500,
                })),
                paymentRequestService.queryPaymentRequestsDto(buildFilter({
                    where: { id: 'status', value: 'paid' },
                    sortBy: [{ id: 'paid_at', desc: true }],
                    limit: 500,
                })),
                companyBankAccountService.queryCompanyBankAccountsDto(buildFilter({
                    sortBy: [{ id: 'createdAt', desc: false }],
                    limit: 50,
                })),
            ]);
            setReceipts(receiptsRes?.data || []);
            setRequests(requestsRes?.data || []);
            setBankAccounts(banksRes?.data || []);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải sổ quỹ.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Build cash flow entries ────────────────────────────── */

    const allEntries: CashFlowEntry[] = useMemo(() => {
        const inflows: CashFlowEntry[] = receipts.map(r => ({
            id: r._id,
            date: r.receipt_date ?? (r as any).createdAt ?? new Date(),
            type: 'inflow',
            amount: r.amount_received ?? 0,
            bankAccountId: (r as any).company_bank_account_id,
            description: r.note,
            journeyName: (r as any).idx_journey_id?.title ?? (r as any).idx_journey_id?.name,
            customerName: (r as any).idx_customer_id?.title ?? (r as any).idx_customer_id?.name,
            reference: r.transaction_ref ?? r.code,
            sourceType: 'receipt',
            sourceData: r,
        }));

        const outflows: CashFlowEntry[] = requests.map(req => ({
            id: req._id,
            date: req.paid_at ?? req.request_date ?? (req as any).createdAt ?? new Date(),
            type: 'outflow',
            amount: req.amount ?? 0,
            bankAccountId: req.company_bank_account_id,
            description: req.payment_content ?? req.request_note,
            customerName: req.beneficiary_name_snapshot,
            reference: req.bank_transaction_ref ?? req.code,
            sourceType: 'request',
            sourceData: req,
        }));

        return [...inflows, ...outflows].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [receipts, requests]);

    /* ─── Filtering ──────────────────────────────────────────── */

    const filteredEntries = useMemo(() => {
        const [start, end] = dateRange;
        return allEntries.filter(e => {
            const date = dayjs(e.date);
            if (!date.isValid()) return false;
            if (date.isBefore(start, 'day') || date.isAfter(end, 'day')) return false;
            if (bankFilter !== 'all' && e.bankAccountId !== bankFilter) return false;
            if (activeTab !== 'all' && e.type !== activeTab) return false;
            return true;
        });
    }, [allEntries, dateRange, bankFilter, activeTab]);

    /* ─── Aggregations ───────────────────────────────────────── */

    const totals = useMemo(() => {
        const inflow = filteredEntries.filter(e => e.type === 'inflow').reduce((s, e) => s + e.amount, 0);
        const outflow = filteredEntries.filter(e => e.type === 'outflow').reduce((s, e) => s + e.amount, 0);
        return { inflow, outflow, net: inflow - outflow };
    }, [filteredEntries]);

    const bankAccountMap = useMemo(() => {
        const map: Record<string, ICompanyBankAccount> = {};
        bankAccounts.forEach(b => { map[b._id] = b; });
        return map;
    }, [bankAccounts]);

    /* ─── Table columns ─────────────────────────────────────── */

    const columns: ColumnsType<CashFlowEntry> = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            width: 110,
            render: (d) => dayjs(d).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 90,
            render: (t: 'inflow' | 'outflow') => (
                t === 'inflow'
                    ? <Tag color="success" icon={<DownOutlined />}>Thu</Tag>
                    : <Tag color="error" icon={<UpOutlined />}>Chi</Tag>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            align: 'right',
            sorter: (a, b) => a.amount - b.amount,
            render: (v: number, e) => (
                <Text strong style={{ color: e.type === 'inflow' ? '#52c41a' : '#cf1322' }}>
                    {e.type === 'inflow' ? '+' : '−'}{v.toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
        {
            title: 'TK Công ty',
            dataIndex: 'bankAccountId',
            key: 'bankAccountId',
            width: 220,
            render: (id) => {
                const b = id ? bankAccountMap[id] : undefined;
                return b
                    ? <Space direction="vertical" size={0}>
                        <Text style={{ fontSize: 13 }}>{b.bank_name ?? '—'}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{b.account_number ?? ''}</Text>
                    </Space>
                    : <Text type="secondary">—</Text>;
            },
        },
        {
            title: 'Đối tượng',
            key: 'subject',
            render: (_, e) => (
                <Space direction="vertical" size={0}>
                    {e.customerName && <Text>{e.customerName}</Text>}
                    {e.journeyName && <Text type="secondary" style={{ fontSize: 11 }}>{e.journeyName}</Text>}
                    {!e.customerName && !e.journeyName && <Text type="secondary">—</Text>}
                </Space>
            ),
        },
        {
            title: 'Diễn giải',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (v) => v || <Text type="secondary">—</Text>,
        },
        {
            title: 'Tham chiếu',
            dataIndex: 'reference',
            key: 'reference',
            width: 140,
            render: (v) => v
                ? <Text code style={{ fontSize: 11 }}>{v}</Text>
                : <Text type="secondary">—</Text>,
        },
    ];

    /* ─── Tab counts ─────────────────────────────────────────── */

    const inflowCount = filteredEntries.filter(e => e.type === 'inflow').length;
    const outflowCount = filteredEntries.filter(e => e.type === 'outflow').length;
    const tabItems = [
        {
            key: 'all',
            label: <span>Tất cả <Badge count={filteredEntries.length} style={{ marginLeft: 6 }} overflowCount={9999} /></span>,
        },
        {
            key: 'inflow',
            label: <span>Thu (Vào) <Badge count={inflowCount} style={{ marginLeft: 6, backgroundColor: '#52c41a' }} overflowCount={9999} /></span>,
        },
        {
            key: 'outflow',
            label: <span>Chi (Ra) <Badge count={outflowCount} style={{ marginLeft: 6, backgroundColor: '#cf1322' }} overflowCount={9999} /></span>,
        },
    ];

    /* ─── Export CSV ─────────────────────────────────────────── */

    const handleExportCSV = () => {
        const headers = ['Ngày', 'Loại', 'Số tiền', 'Tài khoản', 'Đối tượng', 'Diễn giải', 'Tham chiếu'];
        const rows = filteredEntries.map(e => {
            const bank = e.bankAccountId ? bankAccountMap[e.bankAccountId] : undefined;
            return [
                dayjs(e.date).format('DD/MM/YYYY'),
                e.type === 'inflow' ? 'Thu' : 'Chi',
                e.amount.toString(),
                bank ? `${bank.bank_name} ${bank.account_number}` : '',
                e.customerName ?? e.journeyName ?? '',
                (e.description ?? '').replace(/[\r\n]+/g, ' '),
                e.reference ?? '',
            ];
        });
        const csv = [headers, ...rows]
            .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cashbook-${dateRange[0].format('YYYYMMDD')}-${dateRange[1].format('YYYYMMDD')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    /* ─── Render ─────────────────────────────────────────────── */

    return (
        <Card
            title={
                <Space>
                    <WalletOutlined style={{ color: '#1890ff' }} />
                    <span>Sổ quỹ (Cash Book)</span>
                </Space>
            }
            extra={
                <Space>
                    <Tooltip title="Xuất CSV">
                        <Button icon={<DownloadOutlined />} onClick={handleExportCSV} disabled={filteredEntries.length === 0}>
                            Xuất CSV
                        </Button>
                    </Tooltip>
                    <Tooltip title="Làm mới">
                        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
                    </Tooltip>
                </Space>
            }
        >
            {/* Top KPIs */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ background: '#f6ffed' }}>
                        <Statistic
                            title="Tổng thu"
                            value={totals.inflow}
                            formatter={(v) => `${Number(v).toLocaleString('vi-VN')}đ`}
                            prefix={<RiseOutlined />}
                            valueStyle={{ color: '#52c41a', fontSize: 20 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ background: '#fff1f0' }}>
                        <Statistic
                            title="Tổng chi"
                            value={totals.outflow}
                            formatter={(v) => `${Number(v).toLocaleString('vi-VN')}đ`}
                            prefix={<UpOutlined />}
                            valueStyle={{ color: '#cf1322', fontSize: 20 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ background: totals.net >= 0 ? '#e6f7ff' : '#fff7e6' }}>
                        <Statistic
                            title="Chênh lệch (Net)"
                            value={Math.abs(totals.net)}
                            formatter={(v) => `${totals.net >= 0 ? '+' : '−'}${Number(v).toLocaleString('vi-VN')}đ`}
                            prefix={<LineChartOutlined />}
                            valueStyle={{ color: totals.net >= 0 ? '#1890ff' : '#fa8c16', fontSize: 20 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Space direction="horizontal" wrap style={{ marginBottom: 16 }}>
                <RangePicker
                    value={dateRange}
                    onChange={(v) => v && v[0] && v[1] && setDateRange([v[0], v[1]])}
                    format="DD/MM/YYYY"
                    allowClear={false}
                    presets={[
                        { label: '7 ngày qua', value: [dayjs().subtract(7, 'day'), dayjs()] },
                        { label: '30 ngày qua', value: [dayjs().subtract(30, 'day'), dayjs()] },
                        { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
                        { label: 'Tháng trước', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
                        { label: 'Quý này', value: [(dayjs() as any).startOf('quarter'), (dayjs() as any).endOf('quarter')] },
                        { label: 'Năm nay', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
                    ]}
                />
                <Select
                    value={bankFilter}
                    onChange={setBankFilter}
                    style={{ minWidth: 240 }}
                    options={[
                        { value: 'all', label: 'Tất cả tài khoản' },
                        ...bankAccounts.map(b => ({
                            value: b._id,
                            label: `${b.bank_name ?? ''} — ${b.account_number ?? ''}`,
                        })),
                    ]}
                    prefix={<BankOutlined />}
                />
            </Space>

            <Tabs
                activeKey={activeTab}
                onChange={(k) => setActiveTab(k as any)}
                items={tabItems}
            />

            {loading ? (
                <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
            ) : (
                <Table
                    dataSource={filteredEntries}
                    columns={columns}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        pageSize: 30,
                        showSizeChanger: true,
                        showTotal: (t) => `${t} giao dịch`,
                    }}
                    locale={{ emptyText: 'Không có giao dịch trong khoảng thời gian đã chọn.' }}
                />
            )}
        </Card>
    );
};

export default CashBookList;
