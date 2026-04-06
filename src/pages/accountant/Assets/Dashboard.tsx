import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Card, Row, Col, Table, Tag, Button, Statistic,
    Typography, Space, Tabs, Modal, Form, Input, InputNumber, Select,
    message, Grid, Tooltip, Empty
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined, EditOutlined,
    ToolOutlined, BarChartOutlined, UserOutlined,
    SearchOutlined, ReloadOutlined, InfoCircleOutlined,
    CheckCircleOutlined, WarningOutlined, CloseCircleOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { assetService } from '../../../services/core-contracts/services/asset.service';
import { assetGroupService } from '../../../services/core-contracts/services/assetGroup.service';
import MaintenanceTicketModal from './components/MaintenanceTicketModal';
import { 
    content_segment_group_count, 
    content_numeric_aggregate 
} from '../../../store/actions/data/data.action';
import type { IAsset, AssetStatusEnum } from '../../../services/core-contracts/types/asset.types';
import type { IAssetGroup, AssetGroupCategoryEnum } from '../../../services/core-contracts/types/assetGroup.types';
import dayjs from 'dayjs';
import _ from 'lodash';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const STATUS_CONFIG: Record<AssetStatusEnum, { color: string, label: string, icon: any }> = {
    available: { color: 'green', label: 'Sẵn sàng', icon: <CheckCircleOutlined /> },
    in_use: { color: 'blue', label: 'Đang mượn', icon: <UserOutlined /> },
    maintenance: { color: 'orange', label: 'Bảo trì', icon: <ToolOutlined /> },
    broken: { color: 'red', label: 'Hỏng', icon: <CloseCircleOutlined /> },
    lost: { color: 'default', label: 'Thất lạc', icon: <WarningOutlined /> }
};

const CATEGORY_LABELS: Record<AssetGroupCategoryEnum, string> = {
    machinery: 'Máy móc hạng nặng',
    power_tools: 'Dụng cụ điện',
    hand_tools: 'Dụng cụ cầm tay',
    measuring_testing: 'Đo lường & Kiểm định',
    safety_ppe: 'BHLĐ & Safety',
    lifting_handling: 'Nâng hạ & Bốc xếp',
    vehicles: 'Phương tiện vận chuyển',
    it_equipment: 'Thiết bị IT',
    office_furniture: 'Nội thất văn phòng',
    electrical_installation: 'Thiết bị điện',
    temporary_site: 'Lán trại & Phụ trợ',
    other: 'Khác'
};

const AssetsDashboard: React.FC = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [groupForm] = Form.useForm();
    const [assetForm] = Form.useForm();
    const navigate = useNavigate();
    
    // ─── State Management ──────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<IAssetGroup[]>([]);
    const [assets, setAssets] = useState<IAsset[]>([]);
    
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<IAssetGroup | null>(null);
    const [editingAsset, setEditingAsset] = useState<IAsset | null>(null);
    
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('groups');

    // Pagination states
    const [assetPagination, setAssetPagination] = useState({ current: 1, pageSize: 15, total: 0 });
    const [groupPagination, setGroupPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        inUse: 0,
        totalValue: 0
    });

    // ─── Data Fetching ─────────────────────────────────────────
    
    const fetchStats = async () => {
        try {
            const [statusCounts, valueSum] = await Promise.all([
                content_segment_group_count({ field: 'status', filter: { target_schema: 'Asset' } } as any),
                content_numeric_aggregate({ field: 'cost', filter: { target_schema: 'Asset' } } as any)
            ]);

            if (statusCounts.data) {
                let total = 0;
                let available = 0;
                let inUse = 0;
                statusCounts.data.forEach(item => {
                    total += item.count;
                    if (item.key === 'available') available = item.count;
                    if (item.key === 'in_use') inUse = item.count;
                });
                setStats(prev => ({ ...prev, total, available, inUse }));
            }
            const valueAgg = valueSum?.data;
            if (valueAgg) {
                setStats(prev => ({ ...prev, totalValue: valueAgg.sum ?? 0 }));
            }
        } catch (e) {
            console.error('Failed to fetch asset stats', e);
        }
    };

    const fetchGroups = useCallback(async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const res = await assetGroupService.queryAssetGroupsDto({
                limit: size,
                skip: (page - 1) * size,
                sorted: [{ id: 'name', desc: false }]
            } as any);
            if (res.data) {
                setGroups(res.data);
                setGroupPagination(prev => ({ ...prev, current: page, total: res.records || res.data?.length || 0 }));
            }
        } catch (e) {
            message.error('Không thể tải danh sách nhóm tài sản');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAssets = useCallback(async (page = 1, size = 15, search = searchText) => {
        setLoading(true);
        try {
            const children: any[] = [];
            if (search) {
                children.push({ id: 'name', operation: 'contains', value: search });
            }

            const res = await assetService.queryAssetsDto({
                group: children.length ? { op: 'OR', children } : undefined,
                limit: size,
                skip: (page - 1) * size,
                sorted: [{ id: 'createdAt', desc: true }]
            } as any);
            
            if (res.data) {
                setAssets(res.data);
                setAssetPagination(prev => ({ ...prev, current: page, total: res.records || res.data?.length || 0 }));
            }
        } catch (e) {
            message.error('Không thể tải danh sách tài sản');
        } finally {
            setLoading(false);
        }
    }, [searchText]);

    useEffect(() => {
        fetchStats();
        fetchGroups();
        fetchAssets();
    }, [fetchGroups, fetchAssets]);

    const debouncedSearch = useCallback(
        _.debounce((val: string) => fetchAssets(1, 15, val), 500),
        [fetchAssets]
    );

    // ─── Event Handlers ────────────────────────────────────────
    
    const handleSaveGroup = async () => {
        const values = await groupForm.validateFields();
        try {
            if (editingGroup) {
                await assetGroupService.updateAssetGroup(editingGroup._id, values);
                message.success('Cập nhật nhóm tài sản thành công');
            } else {
                await assetGroupService.createAssetGroup(values);
                message.success('Thêm nhóm tài sản thành công');
            }
            setIsGroupModalOpen(false);
            fetchGroups();
        } catch (e) {
            message.error('Lỗi khi lưu nhóm tài sản');
        }
    };

    const handleSaveAsset = async () => {
        const values = await assetForm.validateFields();
        try {
            if (editingAsset) {
                await assetService.updateAsset(editingAsset._id, values);
                message.success('Cập nhật tài sản thành công');
            } else {
                await assetService.createAsset(values);
                message.success('Thêm tài sản thành công');
            }
            setIsAssetModalOpen(false);
            fetchAssets();
            fetchStats();
        } catch (e) {
            message.error('Lỗi khi lưu tài sản');
        }
    };

    const handleDeleteAsset = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa tài sản?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await assetService.deleteAsset(id);
                    message.success('Đã xóa tài sản');
                    fetchAssets();
                    fetchStats();
                } catch (e) {
                    message.error('Không thể xóa tài sản');
                }
            }
        });
    };

    // ─── Table Columns ─────────────────────────────────────────

    const groupColumns: ColumnsType<IAssetGroup> = [
        { 
            title: 'Tên Nhóm Tài sản', 
            dataIndex: 'name', 
            key: 'name', 
            render: (t) => <Text strong>{t}</Text> 
        },
        { 
            title: 'Danh mục', 
            dataIndex: 'category', 
            key: 'cat', 
            render: (c: AssetGroupCategoryEnum) => CATEGORY_LABELS[c] || c 
        },
        { 
            title: 'Khấu hao', 
            dataIndex: 'depreciation_months', 
            key: 'dep', 
            render: (v) => v ? `${v} tháng` : '—' 
        },
        {
            title: 'Thao tác',
            key: 'act',
            width: 150,
            render: (_, g) => (
                <Space>
                    <Tooltip title="Thêm tài sản vào nhóm này">
                        <Button size="small" icon={<PlusOutlined />} onClick={() => {
                            assetForm.resetFields();
                            assetForm.setFieldsValue({ group_id: g._id, status: 'available' });
                            setEditingAsset(null);
                            setIsAssetModalOpen(true);
                        }} />
                    </Tooltip>
                    <Button size="small" icon={<EditOutlined />} onClick={() => {
                        setEditingGroup(g);
                        groupForm.setFieldsValue(g);
                        setIsGroupModalOpen(true);
                    }} />
                </Space>
            )
        }
    ];

    const assetColumns: ColumnsType<IAsset> = [
        { title: 'Mã TS', dataIndex: 'code', key: 'code', width: 120, render: (c) => <Tag color="blue">{c || 'AST'}</Tag> },
        { title: 'Tên Tài sản', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
        { title: 'Serial', dataIndex: 'serial_number', key: 'sn', width: 150, render: (v) => v || '—' },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'st',
            width: 130,
            render: (s: AssetStatusEnum) => {
                const cfg = STATUS_CONFIG[s] || { color: 'default', label: s };
                return <Tag color={cfg.color} icon={cfg.icon}>{cfg.label}</Tag>;
            }
        },
        { 
            title: 'Người giữ', 
            dataIndex: 'assigned_to', 
            key: 'user', 
            render: (v, r) => v ? <span><UserOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />{v}</span> : <Text type="secondary">—</Text> 
        },
        { 
            title: 'Nguyên giá', 
            dataIndex: 'cost', 
            key: 'cost', 
            align: 'right',
            render: (v) => v ? <Text strong color="orange">{(v).toLocaleString()}đ</Text> : '0đ'
        },
        {
            title: '',
            key: 'act',
            width: 120, // Increased to fit 3 icons
            fixed: 'right',
            render: (_, a) => (
                <Space>
                    <Tooltip title="Xem chi tiết hồ sơ 360">
                        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/kt/assets/${a._id}`)} />
                    </Tooltip>
                    <Tooltip title="Lập phiếu bảo trì">
                        <Button type="text" size="small" icon={<ToolOutlined />} onClick={() => { setEditingAsset(a); setIsMaintenanceModalOpen(true); }} />
                    </Tooltip>
                    <Button type="text" size="small" icon={<EditOutlined />} onClick={() => {
                        setEditingAsset(a);
                        assetForm.setFieldsValue(a);
                        setIsAssetModalOpen(true);
                    }} />
                </Space>
            )
        }
    ];

    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>🏢 Quản lý Tài sản Cố định</Title>
                    <Text type="secondary">Theo dõi, cấp phát và báo cáo tài sản doanh nghiệp</Text>
                </div>
                <Space wrap>
                    <Button icon={<ReloadOutlined />} onClick={() => { fetchStats(); fetchGroups(); fetchAssets(); }}>Làm mới</Button>
                    <Button icon={<BarChartOutlined />}>Báo cáo</Button>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => {
                        setEditingGroup(null);
                        groupForm.resetFields();
                        setIsGroupModalOpen(true);
                    }}>Thêm Nhóm tài sản</Button>
                </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Tổng tài sản" value={stats.total} prefix={<ToolOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Đang cấp phát" value={stats.inUse} valueStyle={{ color: '#1890ff' }} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Sẵn sàng" value={stats.available} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Tổng nguyên giá" value={stats.totalValue} suffix="đ" valueStyle={{ fontSize: isMobile ? 18 : 24 }} />
                    </Card>
                </Col>
            </Row>

            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ padding: isMobile ? '0 12px' : '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}
                    items={[
                        {
                            key: 'groups',
                            label: `Nhóm tài sản (${groupPagination.total})`,
                            children: (
                                <div style={{ padding: isMobile ? '16px 12px' : '20px 24px' }}>
                                    <Table 
                                        columns={groupColumns} 
                                        dataSource={groups} 
                                        rowKey="_id" 
                                        loading={loading}
                                        pagination={{
                                            ...groupPagination,
                                            onChange: (p, s) => fetchGroups(p, s)
                                        }}
                                        size="small"
                                        scroll={{ x: 'max-content' }}
                                    />
                                </div>
                            )
                        },
                        {
                            key: 'all',
                            label: `Tất cả tài sản (${assetPagination.total})`,
                            children: (
                                <div style={{ padding: isMobile ? '16px 12px' : '20px 24px' }}>
                                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                        <Input 
                                            placeholder="Tìm theo Serial, mã hoặc tên tài sản..." 
                                            prefix={<SearchOutlined />} 
                                            style={{ width: isMobile ? '100%' : 400 }} 
                                            allowClear
                                            onChange={e => { setSearchText(e.target.value); debouncedSearch(e.target.value); }}
                                        />
                                        {!isMobile && (
                                            <Space>
                                                <Button icon={<PlusOutlined />} type="primary" size="small" onClick={() => {
                                                    assetForm.resetFields();
                                                    assetForm.setFieldsValue({ status: 'available' });
                                                    setEditingAsset(null);
                                                    setIsAssetModalOpen(true);
                                                }}>Thêm Tài sản lẻ</Button>
                                            </Space>
                                        )}
                                    </div>
                                    <Table 
                                        columns={assetColumns} 
                                        dataSource={assets} 
                                        rowKey="_id" 
                                        loading={loading}
                                        scroll={{ x: 'max-content' }}
                                        pagination={{
                                            ...assetPagination,
                                            showSizeChanger: true,
                                            pageSizeOptions: ['10', '15', '30', '50'],
                                            onChange: (p, s) => fetchAssets(p, s)
                                        }}
                                    />
                                </div>
                            )
                        }
                    ]}
                />
            </Card>

            {/* Maintenance Modal Integration */}
            <MaintenanceTicketModal
                open={isMaintenanceModalOpen}
                onCancel={() => setIsMaintenanceModalOpen(false)}
                onSuccess={() => { setIsMaintenanceModalOpen(false); fetchAssets(); fetchStats(); }}
                assetId={editingAsset?._id}
            />

            {/* Group Modal */}
            <Modal
                title={editingGroup ? "Cập nhật Nhóm tài sản" : "Thêm Nhóm tài sản mới"}
                open={isGroupModalOpen}
                onOk={handleSaveGroup}
                onCancel={() => setIsGroupModalOpen(false)}
                destroyOnClose
            >
                <Form form={groupForm} layout="vertical">
                    <Form.Item name="name" label="Tên Nhóm tài sản" rules={[{ required: true, message: 'Vui lòng nhập tên nhóm' }]}>
                        <Input placeholder="VD: Máy móc thiết bị thi công" />
                    </Form.Item>
                    <Form.Item name="category" label="Danh mục">
                        <Select placeholder="Chọn danh mục">
                            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                                <Option key={k} value={k}>{v}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="depreciation_months" label="Thời gian khấu hao tiêu chuẩn (Tháng)" initialValue={24}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Asset Modal */}
            <Modal
                title={editingAsset ? "Cập nhật tài sản" : "Thêm tài sản mới"}
                open={isAssetModalOpen}
                onOk={handleSaveAsset}
                onCancel={() => setIsAssetModalOpen(false)}
                width={isMobile ? 'calc(100vw - 24px)' : 700}
                destroyOnClose
            >
                <Form form={assetForm} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="group_id" label="Nhóm tài sản" rules={[{ required: true }]}>
                                <Select placeholder="Chọn nhóm">
                                    {groups.map(g => (
                                        <Option key={g._id} value={g._id}>{g.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="code" label="Mã tài sản / Số hiệu" rules={[{ required: true }]}>
                                <Input placeholder="VD: Bosch-001" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="name" label="Tên chi tiết tài sản" rules={[{ required: true }]}>
                                <Input placeholder="VD: Máy khoan Bosch GBH 2-24 DRE" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="serial_number" label="Số Serial">
                                <Input placeholder="VD: SN123456" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Form.Item name="status" label="Trạng thái">
                                <Select>
                                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                        <Option key={k} value={k}>{v.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="cost" label="Nguyên giá (VNĐ)" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v!.replace(/\$\s?|(,*)/g, '')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="purchase_date" label="Ngày nhập">
                                <Input type="date" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="assigned_to" label="Người giữ / Địa điểm">
                                <Input placeholder="VD: Nguyễn Văn A - Công trình A" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="condition" label="Tình trạng hiện tại">
                                <Input placeholder="VD: Mới 100%, Đã qua sử dụng..." />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="notes" label="Ghi chú thêm">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    {editingAsset && (
                        <div style={{ textAlign: 'right' }}>
                            <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleDeleteAsset(editingAsset._id)}>Xóa tài sản khỏi hệ thống</Button>
                        </div>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default AssetsDashboard;
