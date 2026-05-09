import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Modal,
    Progress,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    CheckCircleOutlined,
    LinkOutlined,
    ReloadOutlined,
    RollbackOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { paymentRequestService } from '@/services/core-contracts/services/paymentRequest.service';
import { paymentMilestoneService } from '@/services/core-contracts/services/paymentMilestone.service';
import { IPaymentRequest } from '@/services/core-contracts/types/paymentRequest.types';
import { IPaymentMilestone } from '@/services/core-contracts/types/paymentMilestone.types';
import { buildFilter } from '@/utils/filterBuilder';

const { Text, Title } = Typography;

/**
 * Wave 7 W7-03 — KT one-time backfill tool.
 *
 * Wave 4 Phase 0 thêm `PaymentRequest.payment_milestone_id` để link sang đợt thu.
 * Records cũ vẫn dùng `reference_code` (free-text). Trang này:
 *   1. Quét tất cả PaymentRequest có `reference_code` nhưng `payment_milestone_id` rỗng.
 *   2. Match theo: tìm PaymentMilestone có `_id` chứa trong reference_code,
 *      hoặc journey_code + round trùng với reference.
 *   3. Hiển thị suggestion list với nút "Áp dụng" mỗi dòng.
 *   4. KT verify từng row + click "Áp dụng tất cả" hoặc "Áp dụng đã chọn".
 *
 * Read-only preview cho đến khi user explicit click apply → tránh data corruption.
 */

interface MatchSuggestion {
    request: IPaymentRequest;
    matchedMilestone: IPaymentMilestone | null;
    matchReason: string;
    confidence: 'high' | 'medium' | 'low' | 'none';
}

const BackfillPaymentRequestLink: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<IPaymentRequest[]>([]);
    const [milestones, setMilestones] = useState<IPaymentMilestone[]>([]);
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [applying, setApplying] = useState(false);
    const [applyProgress, setApplyProgress] = useState(0);

    /* ─── Load data ──────────────────────────────────────────── */

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [requestsRes, milestonesRes] = await Promise.all([
                paymentRequestService.queryPaymentRequestsDto(buildFilter({
                    sortBy: [{ id: 'createdAt', desc: true }],
                    limit: 500,
                })),
                paymentMilestoneService.queryPaymentMilestonesDto(buildFilter({
                    sortBy: [{ id: 'createdAt', desc: true }],
                    limit: 500,
                })),
            ]);
            setRequests(requestsRes?.data || []);
            setMilestones(milestonesRes?.data || []);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải dữ liệu.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Match algorithm ────────────────────────────────────── */

    useEffect(() => {
        if (requests.length === 0) return;

        const sugg: MatchSuggestion[] = requests
            // Chỉ scan các request CHƯA có payment_milestone_id
            .filter(r => !r.payment_milestone_id)
            .map(req => {
                const ref = (req.reference_code ?? '').trim().toLowerCase();
                if (!ref) {
                    return { request: req, matchedMilestone: null, matchReason: 'Thiếu reference_code', confidence: 'none' as const };
                }

                // Strategy 1: ref chứa milestone _id (24-char hex)
                const idMatch = ref.match(/[a-f0-9]{24}/i);
                if (idMatch) {
                    const ms = milestones.find(m => m._id === idMatch[0]);
                    if (ms) {
                        return {
                            request: req,
                            matchedMilestone: ms,
                            matchReason: `Khớp _id trực tiếp trong reference_code`,
                            confidence: 'high' as const,
                        };
                    }
                }

                // Strategy 2: ref chứa journey_id + round (vd: "JRN-123 đợt 2")
                const roundMatch = ref.match(/(?:đợt|dot|d|round|r)[\s-_]?(\d+)/i);
                const round = roundMatch ? parseInt(roundMatch[1]) : null;
                if (round) {
                    const candidates = milestones.filter(m => m.round === round);
                    if (candidates.length === 1) {
                        return {
                            request: req,
                            matchedMilestone: candidates[0],
                            matchReason: `Tìm theo "đợt ${round}" — duy nhất`,
                            confidence: 'medium' as const,
                        };
                    } else if (candidates.length > 1) {
                        // Try further match by journey reference in text
                        const journeyHint = (req as any).idx_payment_milestone_id?.title
                            ?? (req as any).idx_journey_id?.title
                            ?? '';
                        const further = candidates.find(c => {
                            const cTitle = (c as any).idx_journey_id?.title ?? c.journey_name ?? '';
                            return cTitle && journeyHint && cTitle.toLowerCase().includes(journeyHint.toLowerCase());
                        });
                        if (further) {
                            return {
                                request: req,
                                matchedMilestone: further,
                                matchReason: `Tìm theo "đợt ${round}" + journey hint`,
                                confidence: 'low' as const,
                            };
                        }
                    }
                }

                return {
                    request: req,
                    matchedMilestone: null,
                    matchReason: `Không tìm được milestone từ "${ref.substring(0, 60)}"`,
                    confidence: 'none' as const,
                };
            });

        setSuggestions(sugg);
    }, [requests, milestones]);

    /* ─── Apply ──────────────────────────────────────────────── */

    const handleApplyOne = async (s: MatchSuggestion) => {
        if (!s.matchedMilestone) return;
        try {
            await paymentRequestService.updatePaymentRequest(s.request._id, {
                payment_milestone_id: s.matchedMilestone._id,
            });
            // Update local state to reflect applied
            setRequests(prev => prev.map(r => r._id === s.request._id
                ? { ...r, payment_milestone_id: s.matchedMilestone!._id }
                : r));
            message.success(`Đã link ${s.request.code ?? s.request._id.slice(-6)}`);
        } catch (e: any) {
            message.error(e?.message || 'Cập nhật thất bại.');
        }
    };

    const handleApplyAll = async (minConfidence: 'high' | 'medium') => {
        const eligible = suggestions.filter(s => {
            if (!s.matchedMilestone) return false;
            if (minConfidence === 'high') return s.confidence === 'high';
            return s.confidence === 'high' || s.confidence === 'medium';
        });

        if (eligible.length === 0) {
            message.info('Không có suggestion phù hợp để apply.');
            return;
        }

        Modal.confirm({
            title: `Áp dụng ${eligible.length} suggestion ${minConfidence === 'high' ? 'high confidence' : 'high + medium'}?`,
            content: 'Hành động này sẽ ghi `payment_milestone_id` cho từng PaymentRequest. Có thể rollback nếu cần.',
            onOk: async () => {
                setApplying(true);
                setApplyProgress(0);
                let done = 0;
                for (const s of eligible) {
                    try {
                        await paymentRequestService.updatePaymentRequest(s.request._id, {
                            payment_milestone_id: s.matchedMilestone!._id,
                        });
                        done += 1;
                        setApplyProgress(Math.round((done / eligible.length) * 100));
                    } catch (e) {
                        // Continue on individual failure
                    }
                }
                setApplying(false);
                message.success(`Hoàn tất: ${done}/${eligible.length} record đã link.`);
                fetchData();
            },
        });
    };

    const handleRollback = async (s: MatchSuggestion) => {
        try {
            await paymentRequestService.updatePaymentRequest(s.request._id, {
                payment_milestone_id: undefined,
            } as any);
            setRequests(prev => prev.map(r => r._id === s.request._id
                ? { ...r, payment_milestone_id: undefined }
                : r));
            message.success(`Đã unlink ${s.request.code ?? s.request._id.slice(-6)}`);
        } catch (e: any) {
            message.error(e?.message || 'Rollback thất bại.');
        }
    };

    /* ─── Stats ──────────────────────────────────────────────── */

    const stats = {
        total: requests.length,
        alreadyLinked: requests.filter(r => r.payment_milestone_id).length,
        suggestable: suggestions.filter(s => s.matchedMilestone).length,
        highConf: suggestions.filter(s => s.confidence === 'high').length,
        mediumConf: suggestions.filter(s => s.confidence === 'medium').length,
        lowConf: suggestions.filter(s => s.confidence === 'low').length,
        noMatch: suggestions.filter(s => s.confidence === 'none').length,
    };

    /* ─── Columns ────────────────────────────────────────────── */

    const columns: ColumnsType<MatchSuggestion> = [
        {
            title: 'PaymentRequest',
            key: 'req',
            width: 240,
            render: (_, s) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{s.request.code ?? s.request._id.slice(-6).toUpperCase()}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {s.request.amount?.toLocaleString('vi-VN')}đ · {s.request.beneficiary_name_snapshot ?? '—'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 10 }}>
                        {s.request.paid_at ? dayjs(s.request.paid_at).format('DD/MM/YYYY') : '—'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Reference code (cũ)',
            key: 'ref',
            render: (_, s) => (
                <Text code style={{ fontSize: 11 }}>{s.request.reference_code ?? '—'}</Text>
            ),
        },
        {
            title: 'Milestone match',
            key: 'match',
            width: 240,
            render: (_, s) => {
                if (!s.matchedMilestone) {
                    return <Text type="secondary" style={{ fontSize: 12 }}>{s.matchReason}</Text>;
                }
                return (
                    <Space direction="vertical" size={0}>
                        <Text>Đợt #{s.matchedMilestone.round ?? '?'} · {s.matchedMilestone.amount?.toLocaleString('vi-VN')}đ</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{s.matchReason}</Text>
                    </Space>
                );
            },
        },
        {
            title: 'Độ tin cậy',
            key: 'confidence',
            width: 120,
            render: (_, s) => {
                const cfg: Record<typeof s.confidence, { color: string; label: string }> = {
                    high: { color: 'success', label: 'Cao' },
                    medium: { color: 'processing', label: 'Trung bình' },
                    low: { color: 'warning', label: 'Thấp' },
                    none: { color: 'default', label: 'Không khớp' },
                };
                const c = cfg[s.confidence];
                return <Tag color={c.color}>{c.label}</Tag>;
            },
        },
        {
            title: '',
            key: 'actions',
            width: 200,
            render: (_, s) => {
                if (s.request.payment_milestone_id) {
                    return (
                        <Space>
                            <Tag color="success" icon={<CheckCircleOutlined />}>Đã link</Tag>
                            <Tooltip title="Unlink (rollback)">
                                <Button size="small" icon={<RollbackOutlined />} onClick={() => handleRollback(s)} />
                            </Tooltip>
                        </Space>
                    );
                }
                if (!s.matchedMilestone) return null;
                return (
                    <Button size="small" type="primary" icon={<LinkOutlined />} onClick={() => handleApplyOne(s)}>
                        Áp dụng
                    </Button>
                );
            },
        },
    ];

    /* ─── Render ─────────────────────────────────────────────── */

    return (
        <Card title={
            <Space>
                <LinkOutlined />
                <span>Backfill PaymentRequest → PaymentMilestone link</span>
            </Space>
        }>
            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message="Wave 7 W7-03 — Công cụ một lần"
                description={
                    <Space direction="vertical" size={4}>
                        <Text>Wave 4 thêm field <code>payment_milestone_id</code>. Records cũ dùng <code>reference_code</code> (free-text).</Text>
                        <Text>Trang này quét + đề xuất link tự động dựa trên: (1) _id 24-char hex trong ref, (2) số "đợt N" + journey hint.</Text>
                        <Text type="warning">Verify từng dòng trước khi click "Áp dụng". Có thể rollback từng record.</Text>
                    </Space>
                }
            />

            {/* Stats */}
            <Space wrap style={{ marginBottom: 16 }}>
                <Tag>Tổng: {stats.total}</Tag>
                <Tag color="success">Đã link: {stats.alreadyLinked}</Tag>
                <Tag color="processing">High confidence: {stats.highConf}</Tag>
                <Tag color="warning">Medium: {stats.mediumConf}</Tag>
                <Tag color="orange">Low: {stats.lowConf}</Tag>
                <Tag color="default">Không khớp: {stats.noMatch}</Tag>
            </Space>

            {/* Bulk actions */}
            <Space style={{ marginBottom: 16 }} wrap>
                <Button onClick={fetchData} icon={<ReloadOutlined />} loading={loading}>Làm mới</Button>
                <Button
                    type="primary"
                    icon={<LinkOutlined />}
                    onClick={() => handleApplyAll('high')}
                    disabled={stats.highConf === 0}
                >
                    Áp dụng {stats.highConf} High
                </Button>
                <Button
                    icon={<LinkOutlined />}
                    onClick={() => handleApplyAll('medium')}
                    disabled={stats.highConf + stats.mediumConf === 0}
                >
                    Áp dụng {stats.highConf + stats.mediumConf} High + Medium
                </Button>
            </Space>

            {applying && (
                <Alert
                    type="info"
                    style={{ marginBottom: 16 }}
                    message={
                        <div>
                            <Text>Đang áp dụng...</Text>
                            <Progress percent={applyProgress} size="small" />
                        </div>
                    }
                />
            )}

            {/* Warning for low confidence */}
            {stats.lowConf > 0 && (
                <Alert
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                    style={{ marginBottom: 16 }}
                    message={`Có ${stats.lowConf} suggestion độ tin cậy THẤP — nên review thủ công từng dòng trước khi áp dụng.`}
                />
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
            ) : (
                <Table
                    dataSource={suggestions}
                    columns={columns}
                    rowKey={(s) => s.request._id}
                    size="small"
                    pagination={{ pageSize: 30, showSizeChanger: true, showTotal: (t) => `${t} suggestions` }}
                    locale={{ emptyText: 'Không có PaymentRequest nào cần backfill.' }}
                />
            )}
        </Card>
    );
};

export default BackfillPaymentRequestLink;
