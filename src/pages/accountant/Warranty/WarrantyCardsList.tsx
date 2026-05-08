import React, { useCallback, useEffect, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Input,
    Segmented,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    ReloadOutlined,
    SafetyCertificateOutlined,
    SearchOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { warrantyCardService } from '../../../services/core-contracts/services/warrantyCard.service';
import { IWarrantyCard } from '../../../services/core-contracts/types/warrantyCard.types';
import { buildFilter } from '@/utils/filterBuilder';

const { Text } = Typography;

/* ─── Helpers ─────────────────────────────────────────────────── */

type ExpiryFilter = 'all' | 'active' | 'expiring_soon' | 'expired';

const getExpiryStatus = (card: IWarrantyCard): ExpiryFilter => {
    if (!card.expiry_date) return 'active';
    const daysLeft = dayjs(card.expiry_date).diff(dayjs(), 'day');
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 30) return 'expiring_soon';
    return 'active';
};

const formatDate = (d?: string | Date) => d ? dayjs(d).format('DD/MM/YYYY') : '—';

/* ─── Component ──────────────────────────────────────────────── */

const WarrantyCardsList: React.FC = () => {
    const [allCards, setAllCards] = useState<IWarrantyCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<ExpiryFilter>('all');
    const [search, setSearch] = useState('');

    const fetchCards = useCallback(async () => {
        setLoading(true);
        try {
            const res = await warrantyCardService.queryWarrantyCardsDto(buildFilter({
                sortBy: [{ id: 'issued_at', desc: true }],
                limit: 200,
            }));
            setAllCards(res?.data || []);
        } catch {
            message.error('Không thể tải danh sách thẻ bảo hành.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCards(); }, [fetchCards]);

    /* ─── Filtering ─────────────────────────────────────────── */

    const filteredCards = allCards.filter(card => {
        const matchesFilter = filter === 'all' || getExpiryStatus(card) === filter;
        const q = search.toLowerCase();
        const matchesSearch = !q
            || (card.customer_name ?? '').toLowerCase().includes(q)
            || (card.journey_name ?? '').toLowerCase().includes(q)
            || (card.code ?? '').toLowerCase().includes(q)
            || (card.customer_phone ?? '').includes(q);
        return matchesFilter && matchesSearch;
    });

    const counts = {
        all: allCards.length,
        active: allCards.filter(c => getExpiryStatus(c) === 'active').length,
        expiring_soon: allCards.filter(c => getExpiryStatus(c) === 'expiring_soon').length,
        expired: allCards.filter(c => getExpiryStatus(c) === 'expired').length,
    };

    /* ─── Table columns ─────────────────────────────────────── */

    const columns: ColumnsType<IWarrantyCard> = [
        {
            title: 'Mã thẻ',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (code, r) => (
                <Text strong>{code ?? r._id.slice(-6).toUpperCase()}</Text>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.customer_name ?? '—'}</Text>
                    {r.customer_phone && <Text type="secondary" style={{ fontSize: 12 }}>{r.customer_phone}</Text>}
                </Space>
            ),
        },
        {
            title: 'Công trình',
            dataIndex: 'journey_name',
            key: 'journey_name',
            render: (name, r) => (
                <Space direction="vertical" size={0}>
                    <Text>{name ?? '—'}</Text>
                    {r.address && <Text type="secondary" style={{ fontSize: 12 }}>{r.address}</Text>}
                </Space>
            ),
        },
        {
            title: 'Bảo hành',
            key: 'warranty',
            width: 110,
            render: (_, r) => (
                <Text>{r.warranty_months ?? '—'} tháng</Text>
            ),
        },
        {
            title: 'Ngày cấp',
            dataIndex: 'issued_at',
            key: 'issued_at',
            width: 110,
            render: formatDate,
        },
        {
            title: 'Hết hạn',
            dataIndex: 'expiry_date',
            key: 'expiry_date',
            width: 130,
            render: (d, r) => {
                const status = getExpiryStatus(r);
                const daysLeft = d ? dayjs(d).diff(dayjs(), 'day') : null;
                return (
                    <Space direction="vertical" size={0}>
                        <Text>{formatDate(d)}</Text>
                        {status === 'expired' && (
                            <Tag color="error" icon={<WarningOutlined />}>Hết hạn</Tag>
                        )}
                        {status === 'expiring_soon' && (
                            <Tag color="warning">Còn {daysLeft} ngày</Tag>
                        )}
                        {status === 'active' && daysLeft !== null && (
                            <Tag color="success" icon={<SafetyCertificateOutlined />}>Còn {daysLeft} ngày</Tag>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Hoàn công',
            dataIndex: 'completed_date',
            key: 'completed_date',
            width: 110,
            render: formatDate,
        },
    ];

    /* ─── Render ─────────────────────────────────────────────── */

    const segmentedOptions = [
        { label: `Tất cả (${counts.all})`, value: 'all' },
        {
            label: (
                <span>
                    Còn hiệu lực <Badge count={counts.active} color="#52c41a" style={{ marginLeft: 4 }} overflowCount={999} />
                </span>
            ),
            value: 'active',
        },
        {
            label: (
                <span>
                    Sắp hết hạn <Badge count={counts.expiring_soon} color="#fa8c16" style={{ marginLeft: 4 }} />
                </span>
            ),
            value: 'expiring_soon',
        },
        {
            label: (
                <span>
                    Đã hết hạn <Badge count={counts.expired} color="#ff4d4f" style={{ marginLeft: 4 }} />
                </span>
            ),
            value: 'expired',
        },
    ];

    return (
        <Card
            title={
                <Space>
                    <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                    <span>Quản lý Phiếu Bảo hành</span>
                </Space>
            }
            extra={
                <Tooltip title="Làm mới">
                    <Button icon={<ReloadOutlined />} onClick={fetchCards} loading={loading} />
                </Tooltip>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Segmented
                        options={segmentedOptions}
                        value={filter}
                        onChange={(v) => setFilter(v as ExpiryFilter)}
                    />
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Tìm theo tên KH, công trình, mã thẻ..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        allowClear
                        style={{ width: 280 }}
                    />
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
                ) : (
                    <Table
                        dataSource={filteredCards}
                        columns={columns}
                        rowKey="_id"
                        size="small"
                        pagination={{
                            pageSize: 20,
                            showSizeChanger: true,
                            showTotal: (total) => `${total} thẻ bảo hành`,
                        }}
                        rowClassName={(r) => {
                            const s = getExpiryStatus(r);
                            if (s === 'expired') return 'row-danger';
                            if (s === 'expiring_soon') return 'row-warning';
                            return '';
                        }}
                        locale={{ emptyText: 'Không có thẻ bảo hành nào.' }}
                    />
                )}
            </Space>
        </Card>
    );
};

export default WarrantyCardsList;
