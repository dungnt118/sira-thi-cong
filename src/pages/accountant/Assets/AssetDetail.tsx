import React, { useState, useEffect, useCallback } from 'react';
import {
    Card, Row, Col, Typography, Tag, Button,
    Space, Tabs, message, Modal,
    Alert, Descriptions, Result, Spin,
    Table, Badge, Divider, Grid, Statistic
} from 'antd';
import {
    ArrowLeftOutlined, ToolOutlined, 
    BarChartOutlined, UserOutlined, 
    AuditOutlined, HistoryOutlined,
    EditOutlined, PlusOutlined, CheckCircleOutlined,
    ClockCircleOutlined, WarningOutlined, CloseCircleOutlined, SyncOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { assetService } from '../../../services/core-contracts/services/asset.service';
import { assetAllocationService } from '../../../services/core-contracts/services/assetAllocation.service';
import { assetMaintenanceTicketService } from '../../../services/core-contracts/services/assetMaintenanceTicket.service';
import type { IAsset, AssetStatusEnum } from '../../../services/core-contracts/types/asset.types';
import type { IAssetAllocation } from '../../../services/core-contracts/types/assetAllocation.types';
import type { IAssetMaintenanceTicket } from '../../../services/core-contracts/types/assetMaintenanceTicket.types';
import MaintenanceTicketModal from './components/MaintenanceTicketModal';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const STATUS_CONFIG: Record<AssetStatusEnum, { color: string, label: string, icon: any }> = {
    available: { color: 'green', label: 'Sẵn sàng', icon: <CheckCircleOutlined /> },
    in_use: { color: 'blue', label: 'Đang mượn', icon: <UserOutlined /> },
    maintenance: { color: 'orange', label: 'Bảo trì', icon: <ToolOutlined /> },
    broken: { color: 'red', label: 'Hỏng', icon: <CloseCircleOutlined /> },
    lost: { color: 'default', label: 'Thất lạc', icon: <WarningOutlined /> }
};

const AssetDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const screens = useBreakpoint();

    const [loading, setLoading] = useState(true);
    const [asset, setAsset] = useState<IAsset | null>(null);
    const [allocations, setAllocations] = useState<IAssetAllocation[]>([]);
    const [tickets, setTickets] = useState<IAssetMaintenanceTicket[]>([]);
    
    // Modal states
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

    const fetchAllData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [assetRes, allocRes, ticketRes] = await Promise.all([
                assetService.findAssetDto(id),
                assetAllocationService.queryAssetAllocationsDto({
                    group: { op: 'AND', children: [{ id: 'asset_id', operation: 'eq', value: id }] },
                    limit: 10,
                    sorted: [{ id: 'request_date', desc: true }]
                } as any),
                assetMaintenanceTicketService.queryAssetMaintenanceTicketsDto({
                    group: { op: 'AND', children: [{ id: 'asset_id', operation: 'eq', value: id }] },
                    limit: 10,
                    sorted: [{ id: 'maintenance_date', desc: true }]
                } as any)
            ]);

            setAsset(assetRes);
            setAllocations(allocRes.data || []);
            setTickets(ticketRes.data || []);
        } catch (error) {
            message.error('Không thể tải thông tin chi tiết tài sản');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    if (loading && !asset) {
        return <div style={{ padding: 100, textAlign: 'center' }}><Spin size="large" tip="Đang tải dữ liệu tài sản..." /></div>;
    }

    if (!asset) {
        return <Result status="404" title="Không tìm thấy tài sản" subTitle="Tài sản này không tồn tại hoặc đã bị xóa." />;
    }

    const statusInfo = STATUS_CONFIG[asset.status || 'available'];

    // ─── Table Columns ─────────────────────────────────────────

    const allocColumns = [
        { title: 'Mã phiếu', dataIndex: 'code', key: 'code', render: (t: string, r: IAssetAllocation) => <Button type="link" onClick={() => navigate(`/kt/assets/allocation/${r._id}`)} style={{ padding: 0 }}>{t || 'ALLOC'}</Button> },
        { title: 'Người mượn', dataIndex: 'requested_by', key: 'by', render: (v: any) => v?.displayName || v || '—' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'st', render: (s: string) => <Tag color="blue">{s?.toUpperCase()}</Tag> },
        { title: 'Ngày mượn', dataIndex: 'request_date', key: 'date', render: (d: any) => d ? dayjs(d).format('DD/MM/YY') : '—' },
        { title: 'Ngày trả', dataIndex: 'actual_return_date', key: 'ret', render: (d: any) => d ? dayjs(d).format('DD/MM/YY') : '—' },
    ];

    const maintenanceColumns = [
        { title: 'Ngày sửa', dataIndex: 'maintenance_date', key: 'date', render: (d: any) => d ? dayjs(d).format('DD/MM/YY') : '—' },
        { title: 'Lý do / Nội dung', dataIndex: 'notes', key: 'notes' },
        { title: 'Chi phí', dataIndex: 'cost_amount', key: 'cost', align: 'right' as const, render: (v: number) => v ? <span>{(v).toLocaleString()}đ</span> : '0đ' },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'st', 
            render: (s: string) => {
                const colors: Record<string, string> = { 'completed': 'success', 'in_progress': 'processing', 'planned': 'default', 'cancelled': 'error' };
                return <Tag color={colors[s] || 'default'}>{s?.toUpperCase()}</Tag>;
            }
        },
    ];

    return (
        <div style={{ width: '100%', padding: '0 24px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/kt/assets/list')} />
                    <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Chi tiết Hồ sơ Tài sản 360°</Text>
                        <Title level={4} style={{ margin: 0 }}>{asset.name} <Tag color="blue" style={{ marginLeft: 8 }}>{asset.code}</Tag></Title>
                    </div>
                </Space>
                <Space>
                    <Button icon={<ToolOutlined />} onClick={() => setIsMaintenanceModalOpen(true)}>Tạo Phiếu Bảo trì</Button>
                    <Button type="primary" icon={<EditOutlined />}>Chỉnh sửa</Button>
                </Space>
            </div>

            <Row gutter={[16, 16]}>
                {/* ─── Sidebar: Overall Info ───────────────── */}
                <Col xs={24} lg={8}>
                    <Card bordered={false} style={{ borderRadius: 12, marginBottom: 16 }}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <div style={{ width: 120, height: 120, background: '#f5f5f5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <ToolOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                            </div>
                            <Tag color={statusInfo.color} icon={statusInfo.icon} style={{ padding: '4px 12px', fontSize: 14 }}>
                                {statusInfo.label.toUpperCase()}
                            </Tag>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <Descriptions column={1} size="small" labelStyle={{ color: '#8c8c8c' }}>
                            <Descriptions.Item label="Mã hiệu / Serial">{asset.serial_number || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày nhập kho">{asset.purchase_date ? dayjs(asset.purchase_date).format('DD/MM/YYYY') : '—'}</Descriptions.Item>
                            <Descriptions.Item label="Nguyên giá">{(asset.cost || 0).toLocaleString()}đ</Descriptions.Item>
                            <Descriptions.Item label="Người giữ">{asset.assigned_to || <Text type="secondary">Đang trong kho</Text>}</Descriptions.Item>
                            <Descriptions.Item label="Tình trạng">{asset.condition || 'Bình thường'}</Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card size="small" title="Thống kê tóm tắt" style={{ borderRadius: 12 }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic title="Lượt mượn" value={allocations.length} prefix={<SyncOutlined />} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="Lượt bảo trì" value={tickets.length} prefix={<HistoryOutlined />} />
                            </Col>
                        </Row>
                        <div style={{ marginTop: 16 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>Tổng chi phí bảo trì: <Text strong>{tickets.reduce((s, t) => s + (t.cost_amount || 0), 0).toLocaleString()}đ</Text></Text>
                        </div>
                    </Card>
                </Col>

                {/* ─── Main Content: Tabs History ───────────── */}
                <Col xs={24} lg={16}>
                    <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
                        <Tabs
                            defaultActiveKey="alloc"
                            style={{ padding: '0 24px', background: '#fff' }}
                            items={[
                                {
                                    key: 'alloc',
                                    label: <Space><AuditOutlined />Lịch sử Cấp phát</Space>,
                                    children: (
                                        <div style={{ padding: '20px 0' }}>
                                            <Table 
                                                dataSource={allocations} 
                                                columns={allocColumns} 
                                                rowKey="_id" 
                                                pagination={false}
                                                size="small"
                                            />
                                            {allocations.length === 0 && <Result status="info" title="Chưa có lượt mượn nào" />}
                                        </div>
                                    )
                                },
                                {
                                    key: 'maint',
                                    label: <Space><HistoryOutlined />Lịch sử Bảo trì</Space>,
                                    children: (
                                        <div style={{ padding: '20px 0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <Title level={5}>Lịch sử bảo dưỡng & Sửa chữa</Title>
                                                <Button size="small" icon={<PlusOutlined />} onClick={() => setIsMaintenanceModalOpen(true)}>Tạo mới</Button>
                                            </div>
                                            <Table 
                                                dataSource={tickets} 
                                                columns={maintenanceColumns} 
                                                rowKey="_id" 
                                                pagination={false}
                                                size="small"
                                            />
                                        </div>
                                    )
                                },
                                {
                                    key: 'notes',
                                    label: <Space><EditOutlined />Ghi chú hệ thống</Space>,
                                    children: (
                                        <div style={{ padding: '20px 0' }}>
                                            <Text type="secondary">{asset.notes || 'Không có ghi chú hệ thống cho tài sản này.'}</Text>
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            <MaintenanceTicketModal 
                open={isMaintenanceModalOpen}
                onCancel={() => setIsMaintenanceModalOpen(false)}
                onSuccess={() => { setIsMaintenanceModalOpen(false); fetchAllData(); }}
                assetId={asset._id}
            />
        </div>
    );
};

export default AssetDetail;
