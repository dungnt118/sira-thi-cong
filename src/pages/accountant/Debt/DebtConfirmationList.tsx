import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Input,
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
    AuditOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { debtConfirmationService } from '../../../services/core-contracts/services/debtConfirmation.service';
import {
    DebtConfirmationStatusEnum,
    IDebtConfirmation,
} from '../../../services/core-contracts/types/debtConfirmation.types';
import { buildFilter } from '@/utils/filterBuilder';
import SendConfirmationModal from './components/SendConfirmationModal';

const { Text } = Typography;

/**
 * Wave 4 W4-05 — Debt Confirmation list cho KT.
 *
 * Pipeline status: draft → sent → confirmed | disputed → closed.
 * KT: tạo nháp → gửi KH → cập nhật khi KH xác nhận / disputed → đóng.
 */

const STATUS_CONFIG: Record<DebtConfirmationStatusEnum, { label: string; color: string }> = {
    draft: { label: 'Nháp', color: 'default' },
    sent: { label: 'Đã gửi KH', color: 'warning' },
    confirmed: { label: 'KH đã xác nhận', color: 'success' },
    disputed: { label: 'KH phản đối', color: 'error' },
    closed: { label: 'Đã đóng', color: 'default' },
};

type StatusFilter = 'all' | DebtConfirmationStatusEnum;

const DebtConfirmationList: React.FC = () => {
    const navigate = useNavigate();
    const [confirmations, setConfirmations] = useState<IDebtConfirmation[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<IDebtConfirmation | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await debtConfirmationService.queryDebtConfirmationsDto(buildFilter({
                sortBy: [{ id: 'confirmation_date', desc: true }],
                limit: 200,
            }));
            setConfirmations(res?.data || []);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải danh sách xác nhận công nợ.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Filtering ──────────────────────────────────────────── */

    const filteredConfirmations = useMemo(() => {
        return confirmations.filter(c => {
            const matchStatus = statusFilter === 'all' || c.status === statusFilter;
            const q = search.toLowerCase().trim();
            const matchSearch = !q
                || (c.code ?? '').toLowerCase().includes(q)
                || (c.confirmed_by_customer_name ?? '').toLowerCase().includes(q)
                || ((c as any).idx_customer_id?.title ?? '').toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [confirmations, statusFilter, search]);

    const counts = useMemo(() => {
        const acc: Record<string, number> = { all: confirmations.length };
        confirmations.forEach(c => {
            const k = c.status ?? 'draft';
            acc[k] = (acc[k] ?? 0) + 1;
        });
        return acc;
    }, [confirmations]);

    /* ─── Handlers ───────────────────────────────────────────── */

    const handleOpenCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (record: IDebtConfirmation) => {
        if (record.status === 'closed') {
            message.info('Xác nhận công nợ đã đóng, không thể chỉnh sửa.');
            return;
        }
        setEditing(record);
        setModalOpen(true);
    };

    const handleStatusTransition = async (
        record: IDebtConfirmation,
        next: DebtConfirmationStatusEnum,
    ) => {
        try {
            const patch: any = { status: next };
            if (next === 'sent') patch.confirmation_date = patch.confirmation_date ?? new Date().toISOString();
            if (next === 'confirmed' || next === 'disputed') patch.confirmed_at = new Date().toISOString();
            const updated = await debtConfirmationService.updateDebtConfirmation(record._id, patch);
            setConfirmations(prev => prev.map(x => x._id === updated._id ? updated : x));
            message.success(`Đã cập nhật trạng thái → ${STATUS_CONFIG[next].label}`);
        } catch (e: any) {
            message.error(e?.message || 'Cập nhật thất bại.');
        }
    };

    const handleSuccess = (saved: IDebtConfirmation) => {
        setConfirmations(prev => {
            const idx = prev.findIndex(x => x._id === saved._id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = saved;
                return next;
            }
            return [saved, ...prev];
        });
        setModalOpen(false);
    };

    /* ─── Table columns ─────────────────────────────────────── */

    const columns: ColumnsType<IDebtConfirmation> = [
        {
            title: 'Mã / Khách hàng',
            key: 'code',
            width: 220,
            render: (_, c) => {
                const customer = (c as any).idx_customer_id;
                return (
                    <Space direction="vertical" size={0}>
                        <Text strong>{c.code ?? c._id.slice(-6).toUpperCase()}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {c.confirmed_by_customer_name ?? customer?.title ?? customer?.name ?? '—'}
                        </Text>
                    </Space>
                );
            },
        },
        {
            title: 'Số tiền nợ',
            dataIndex: 'debt_amount',
            key: 'debt_amount',
            width: 150,
            align: 'right',
            sorter: (a, b) => (a.debt_amount ?? 0) - (b.debt_amount ?? 0),
            render: (v: number) => (
                <Text strong style={{ color: '#cf1322' }}>{(v ?? 0).toLocaleString('vi-VN')}đ</Text>
            ),
        },
        {
            title: 'KH xác nhận',
            dataIndex: 'amount_confirmed_by_customer',
            key: 'amount_confirmed_by_customer',
            width: 150,
            align: 'right',
            render: (v: number, c) => {
                if (v == null) return <Text type="secondary">—</Text>;
                const diff = c.difference_amount ?? ((c.debt_amount ?? 0) - v);
                return (
                    <Space direction="vertical" size={0}>
                        <Text>{v.toLocaleString('vi-VN')}đ</Text>
                        {diff !== 0 && (
                            <Text type="secondary" style={{ fontSize: 11, color: diff > 0 ? '#cf1322' : '#52c41a' }}>
                                Lệch: {diff > 0 ? '+' : ''}{diff.toLocaleString('vi-VN')}
                            </Text>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Ngày xác nhận',
            dataIndex: 'confirmation_date',
            key: 'confirmation_date',
            width: 110,
            render: (d) => d ? dayjs(d).format('DD/MM/YYYY') : '—',
        },
        {
            title: 'Cam kết trả',
            dataIndex: 'payment_commitment_date',
            key: 'payment_commitment_date',
            width: 110,
            render: (d) => d ? dayjs(d).format('DD/MM/YYYY') : <Text type="secondary">—</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (s: DebtConfirmationStatusEnum) => {
                const cfg = STATUS_CONFIG[s] ?? STATUS_CONFIG.draft;
                return <Badge status={cfg.color as any} text={cfg.label} />;
            },
        },
        {
            title: '',
            key: 'actions',
            width: 280,
            fixed: 'right',
            render: (_, record) => {
                const status = record.status ?? 'draft';
                return (
                    <Space size="small">
                        <Tooltip title="Xem / Sửa">
                            <Button size="small" icon={<AuditOutlined />} onClick={() => handleOpenEdit(record)} />
                        </Tooltip>
                        {status === 'draft' && (
                            <Popconfirm
                                title="Gửi xác nhận này cho khách hàng?"
                                onConfirm={() => handleStatusTransition(record, 'sent')}
                            >
                                <Button size="small" type="primary" icon={<SendOutlined />}>Gửi KH</Button>
                            </Popconfirm>
                        )}
                        {status === 'sent' && (
                            <>
                                <Tooltip title="KH đã ký xác nhận">
                                    <Button
                                        size="small"
                                        icon={<CheckCircleOutlined />}
                                        style={{ background: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                                        onClick={() => handleStatusTransition(record, 'confirmed')}
                                    >
                                        Xác nhận
                                    </Button>
                                </Tooltip>
                                <Tooltip title="KH phản đối số liệu">
                                    <Button
                                        size="small"
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => handleStatusTransition(record, 'disputed')}
                                    >
                                        Phản đối
                                    </Button>
                                </Tooltip>
                            </>
                        )}
                        {(status === 'confirmed' || status === 'disputed') && (
                            <Popconfirm
                                title="Đóng xác nhận này?"
                                onConfirm={() => handleStatusTransition(record, 'closed')}
                            >
                                <Button size="small">Đóng</Button>
                            </Popconfirm>
                        )}
                        {status === 'confirmed' && (
                            <Tooltip title="Tạo task nhắc thu hồi công nợ">
                                <Button
                                    size="small"
                                    type="link"
                                    onClick={() => navigate(`/admin/kt/debt/collection?confirmation_id=${record._id}`)}
                                >
                                    → Tạo nhắc nợ
                                </Button>
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
    ];

    const tabItems = [
        { key: 'all', label: <span>Tất cả <Badge count={counts.all ?? 0} style={{ marginLeft: 6 }} overflowCount={999} /></span> },
        { key: 'draft', label: <span>Nháp <Badge count={counts.draft ?? 0} style={{ marginLeft: 6 }} /></span> },
        { key: 'sent', label: <span>Đã gửi KH <Badge count={counts.sent ?? 0} style={{ marginLeft: 6, backgroundColor: '#faad14' }} /></span> },
        { key: 'confirmed', label: <span>KH xác nhận <Badge count={counts.confirmed ?? 0} style={{ marginLeft: 6, backgroundColor: '#52c41a' }} /></span> },
        { key: 'disputed', label: <span>Phản đối <Badge count={counts.disputed ?? 0} style={{ marginLeft: 6, backgroundColor: '#ff4d4f' }} /></span> },
        { key: 'closed', label: <span>Đã đóng <Badge count={counts.closed ?? 0} style={{ marginLeft: 6 }} /></span> },
    ];

    return (
        <Card
            title={
                <Space>
                    <AuditOutlined style={{ color: '#fa8c16' }} />
                    <span>Xác nhận Công nợ</span>
                </Space>
            }
            extra={
                <Space>
                    <Tooltip title="Làm mới">
                        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
                    </Tooltip>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
                        Tạo xác nhận mới
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
                        placeholder="Tìm theo mã, tên KH..."
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
                    dataSource={filteredConfirmations}
                    columns={columns}
                    rowKey="_id"
                    size="small"
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `${t} biên bản` }}
                    locale={{ emptyText: 'Chưa có biên bản xác nhận công nợ nào.' }}
                />
            )}

            <SendConfirmationModal
                open={modalOpen}
                confirmation={editing}
                onClose={() => setModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </Card>
    );
};

export default DebtConfirmationList;
