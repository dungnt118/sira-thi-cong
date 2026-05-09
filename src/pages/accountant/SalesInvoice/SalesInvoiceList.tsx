import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Input,
    Modal,
    Popconfirm,
    Space,
    Spin,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    FileTextOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { salesInvoiceService } from '../../../services/core-contracts/services/salesInvoice.service';
import {
    ISalesInvoice,
    SalesInvoiceInvoiceStatusEnum,
    SalesInvoiceInvoiceTypeEnum,
} from '../../../services/core-contracts/types/salesInvoice.types';
import { buildFilter } from '@/utils/filterBuilder';
import IssueInvoiceModal from './components/IssueInvoiceModal';

const { Text } = Typography;

/**
 * Wave 4 W4-04 — Sales Invoice list cho KT.
 *
 * Pipeline status: draft → pending_issue → issued → sent → cancelled.
 * KT có thể: tạo mới (từ PaymentReceipt), phát hành, gửi cho khách, huỷ.
 */

const STATUS_CONFIG: Record<SalesInvoiceInvoiceStatusEnum, { label: string; color: string }> = {
    draft: { label: 'Nháp', color: 'default' },
    pending_issue: { label: 'Chờ phát hành', color: 'warning' },
    issued: { label: 'Đã phát hành', color: 'processing' },
    sent: { label: 'Đã gửi KH', color: 'success' },
    cancelled: { label: 'Đã huỷ', color: 'error' },
};

const TYPE_CONFIG: Record<SalesInvoiceInvoiceTypeEnum, { label: string; color: string }> = {
    vat_invoice: { label: 'VAT', color: 'blue' },
    sales_invoice: { label: 'Bán hàng', color: 'cyan' },
    adjustment_invoice: { label: 'Điều chỉnh', color: 'orange' },
};

type StatusFilter = 'all' | SalesInvoiceInvoiceStatusEnum;

const SalesInvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<ISalesInvoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [search, setSearch] = useState('');
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<ISalesInvoice | null>(null);

    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        try {
            const res = await salesInvoiceService.querySalesInvoicesDto(buildFilter({
                sortBy: [{ id: 'createdAt', desc: true }],
                limit: 200,
            }));
            setInvoices(res?.data || []);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải danh sách hoá đơn.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

    /* ─── Filtering ──────────────────────────────────────────── */

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchStatus = statusFilter === 'all' || inv.invoice_status === statusFilter;
            const q = search.toLowerCase().trim();
            const matchSearch = !q
                || (inv.code ?? '').toLowerCase().includes(q)
                || (inv.invoice_number ?? '').toLowerCase().includes(q)
                || (inv.tax_code ?? '').toLowerCase().includes(q)
                || ((inv as any).idx_customer_id?.title ?? '').toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [invoices, statusFilter, search]);

    /* ─── Counts ─────────────────────────────────────────────── */

    const counts = useMemo(() => {
        const acc: Record<string, number> = { all: invoices.length };
        invoices.forEach(inv => {
            const k = inv.invoice_status ?? 'draft';
            acc[k] = (acc[k] ?? 0) + 1;
        });
        return acc;
    }, [invoices]);

    /* ─── Handlers ───────────────────────────────────────────── */

    const handleOpenCreate = () => {
        setEditingInvoice(null);
        setIssueModalOpen(true);
    };

    const handleOpenEdit = (inv: ISalesInvoice) => {
        if (inv.invoice_status === 'sent' || inv.invoice_status === 'cancelled') {
            message.info('Hoá đơn đã ở trạng thái khoá, không thể chỉnh sửa.');
            return;
        }
        setEditingInvoice(inv);
        setIssueModalOpen(true);
    };

    const handleStatusTransition = async (
        inv: ISalesInvoice,
        next: SalesInvoiceInvoiceStatusEnum,
    ) => {
        try {
            const patch: any = { invoice_status: next };
            if (next === 'issued' && !inv.invoice_date) {
                patch.invoice_date = new Date().toISOString();
            }
            if (next === 'sent') {
                patch.sent_at = new Date().toISOString();
            }
            const updated = await salesInvoiceService.updateSalesInvoice(inv._id, patch);
            setInvoices(prev => prev.map(x => x._id === updated._id ? updated : x));
            message.success(`Đã cập nhật hoá đơn → ${STATUS_CONFIG[next].label}`);
        } catch (e: any) {
            message.error(e?.message || 'Cập nhật thất bại.');
        }
    };

    const handleSuccess = (saved: ISalesInvoice) => {
        setInvoices(prev => {
            const idx = prev.findIndex(x => x._id === saved._id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = saved;
                return next;
            }
            return [saved, ...prev];
        });
        setIssueModalOpen(false);
    };

    /* ─── Table columns ─────────────────────────────────────── */

    const columns: ColumnsType<ISalesInvoice> = [
        {
            title: 'Mã / Số hoá đơn',
            key: 'code',
            width: 180,
            render: (_, inv) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{inv.code ?? inv._id.slice(-6).toUpperCase()}</Text>
                    {inv.invoice_number && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            HĐ #{inv.invoice_number}
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, inv) => {
                const customer = (inv as any).idx_customer_id;
                return (
                    <Space direction="vertical" size={0}>
                        <Text>{customer?.title ?? customer?.name ?? '—'}</Text>
                        {inv.tax_code && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                MST: {inv.tax_code}
                            </Text>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Loại',
            dataIndex: 'invoice_type',
            key: 'invoice_type',
            width: 110,
            render: (t: SalesInvoiceInvoiceTypeEnum) => {
                const cfg = TYPE_CONFIG[t] ?? { label: t ?? '—', color: 'default' };
                return <Tag color={cfg.color}>{cfg.label}</Tag>;
            },
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total_amount',
            key: 'total_amount',
            width: 150,
            align: 'right',
            sorter: (a, b) => (a.total_amount ?? 0) - (b.total_amount ?? 0),
            render: (v: number, inv) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ color: '#1890ff' }}>
                        {(v ?? 0).toLocaleString('vi-VN')}đ
                    </Text>
                    {inv.tax_amount ? (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            VAT: {inv.tax_amount.toLocaleString('vi-VN')}đ
                        </Text>
                    ) : null}
                </Space>
            ),
        },
        {
            title: 'Ngày HĐ',
            dataIndex: 'invoice_date',
            key: 'invoice_date',
            width: 110,
            render: (d) => d ? dayjs(d).format('DD/MM/YYYY') : '—',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'invoice_status',
            key: 'invoice_status',
            width: 140,
            render: (s: SalesInvoiceInvoiceStatusEnum) => {
                const cfg = STATUS_CONFIG[s] ?? STATUS_CONFIG.draft;
                return <Badge status={cfg.color as any} text={cfg.label} />;
            },
        },
        {
            title: '',
            key: 'actions',
            width: 220,
            fixed: 'right',
            render: (_, inv) => {
                const status = inv.invoice_status ?? 'draft';
                return (
                    <Space size="small">
                        <Tooltip title="Xem / Sửa">
                            <Button size="small" icon={<FileTextOutlined />} onClick={() => handleOpenEdit(inv)} />
                        </Tooltip>
                        {(status === 'draft' || status === 'pending_issue') && (
                            <Popconfirm
                                title="Phát hành hoá đơn này?"
                                description="Hoá đơn sau khi phát hành chỉ có thể huỷ, không sửa được nội dung."
                                onConfirm={() => handleStatusTransition(inv, 'issued')}
                            >
                                <Button size="small" type="primary">Phát hành</Button>
                            </Popconfirm>
                        )}
                        {status === 'issued' && (
                            <Button
                                size="small"
                                icon={<SendOutlined />}
                                onClick={() => handleStatusTransition(inv, 'sent')}
                                style={{ background: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                            >
                                Đã gửi KH
                            </Button>
                        )}
                        {status !== 'sent' && status !== 'cancelled' && (
                            <Popconfirm
                                title="Huỷ hoá đơn này?"
                                onConfirm={() => handleStatusTransition(inv, 'cancelled')}
                            >
                                <Button size="small" danger>Huỷ</Button>
                            </Popconfirm>
                        )}
                    </Space>
                );
            },
        },
    ];

    /* ─── Render ─────────────────────────────────────────────── */

    const tabItems = [
        {
            key: 'all',
            label: <span>Tất cả <Badge count={counts.all ?? 0} style={{ marginLeft: 6 }} overflowCount={999} /></span>,
        },
        {
            key: 'draft',
            label: <span>Nháp <Badge count={counts.draft ?? 0} style={{ marginLeft: 6 }} /></span>,
        },
        {
            key: 'pending_issue',
            label: <span>Chờ phát hành <Badge count={counts.pending_issue ?? 0} style={{ marginLeft: 6, backgroundColor: '#faad14' }} /></span>,
        },
        {
            key: 'issued',
            label: <span>Đã phát hành <Badge count={counts.issued ?? 0} style={{ marginLeft: 6, backgroundColor: '#1890ff' }} /></span>,
        },
        {
            key: 'sent',
            label: <span>Đã gửi KH <Badge count={counts.sent ?? 0} style={{ marginLeft: 6, backgroundColor: '#52c41a' }} /></span>,
        },
        {
            key: 'cancelled',
            label: <span>Đã huỷ <Badge count={counts.cancelled ?? 0} style={{ marginLeft: 6, backgroundColor: '#ff4d4f' }} /></span>,
        },
    ];

    return (
        <Card
            title={
                <Space>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    <span>Hoá đơn bán hàng (VAT)</span>
                </Space>
            }
            extra={
                <Space>
                    <Tooltip title="Làm mới">
                        <Button icon={<ReloadOutlined />} onClick={fetchInvoices} loading={loading} />
                    </Tooltip>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
                        Xuất hoá đơn mới
                    </Button>
                </Space>
            }
        >
            <Tabs
                activeKey={statusFilter}
                onChange={(k) => setStatusFilter(k as StatusFilter)}
                items={tabItems}
                tabBarExtraContent={
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Tìm theo mã, số HĐ, MST..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        allowClear
                        style={{ width: 280 }}
                    />
                }
            />

            {loading ? (
                <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
            ) : (
                <Table
                    dataSource={filteredInvoices}
                    columns={columns}
                    rowKey="_id"
                    size="small"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (t) => `${t} hoá đơn`,
                    }}
                    locale={{ emptyText: 'Chưa có hoá đơn nào.' }}
                />
            )}

            <IssueInvoiceModal
                open={issueModalOpen}
                invoice={editingInvoice}
                onClose={() => setIssueModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </Card>
    );
};

export default SalesInvoiceList;
