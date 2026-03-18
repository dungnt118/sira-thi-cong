import React, { useState, useMemo } from 'react';
import {
    Card, Row, Col, Table, Tag, Button, Statistic,
    Typography, Space, Tabs, Modal, Form, Input, InputNumber, Select,
    message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined, EditOutlined,
    ToolOutlined, BarChartOutlined, UserOutlined,
    SearchOutlined
} from '@ant-design/icons';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import type { Asset, AssetGroup, AssetStatus } from '../../../types/v3';
import mockAssetsData from '../../../data/mock/assets.json';

const { Title, Text } = Typography;
const { Option } = Select;

const AssetsDashboard: React.FC = () => {
    const [groupForm] = Form.useForm();
    const [assetForm] = Form.useForm();
    
    // Use LocalStorage for state management
    const [groups, setGroups] = useLocalStorageData<AssetGroup[]>('ASSET_GROUPS', (mockAssetsData as any).groups);
    const [assets, setAssets] = useLocalStorageData<Asset[]>('ASSETS', (mockAssetsData as any).assets);

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<AssetGroup | null>(null);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

    const statusColors: Record<AssetStatus, string> = {
        AVAILABLE: 'green',
        IN_USE: 'blue',
        MAINTENANCE: 'orange',
        BROKEN: 'red',
        LOST: 'default'
    };

    const statusLabels: Record<AssetStatus, string> = {
        AVAILABLE: 'Sẵn sàng',
        IN_USE: 'Đang sử dụng',
        MAINTENANCE: 'Bảo trì',
        BROKEN: 'Hỏng',
        LOST: 'Mất'
    };

    const handleSaveGroup = () => {
        groupForm.validateFields().then(values => {
            if (editingGroup) {
                setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...values } : g));
                message.success('Cập nhật nhóm tài sản thành công');
            } else {
                setGroups([...groups, { ...values, id: `ASG-${Date.now()}` }]);
                message.success('Thêm nhóm tài sản thành công');
            }
            setIsGroupModalOpen(false);
        });
    };

    const handleSaveAsset = () => {
        assetForm.validateFields().then(values => {
            if (editingAsset) {
                setAssets(assets.map(a => a.id === editingAsset.id ? { ...a, ...values } : a));
                message.success('Cập nhật thông tin tài sản thành công');
            } else {
                setAssets([...assets, { ...values, id: `AST-${Date.now()}` }]);
                message.success('Thêm tài sản mới thành công');
            }
            setIsAssetModalOpen(false);
        });
    };

    const groupColumns: ColumnsType<AssetGroup> = [
        { title: 'Tên Nhóm Tài sản', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
        { title: 'Danh mục', dataIndex: 'category', key: 'cat' },
        { title: 'Khấu hao (Tháng)', dataIndex: 'depreciationMonths', key: 'dep', render: (v) => `${v} tháng` },
        { 
            title: 'Số lượng', 
            key: 'count', 
            render: (_, g) => assets.filter(a => a.groupId === g.id).length 
        },
        {
            title: 'Thao tác',
            key: 'act',
            render: (_, g) => (
                <Space>
                    <Button size="small" icon={<PlusOutlined />} onClick={() => {
                        assetForm.resetFields();
                        assetForm.setFieldsValue({ groupId: g.id, status: 'AVAILABLE' });
                        setEditingAsset(null);
                        setIsAssetModalOpen(true);
                    }}>Thêm TS</Button>
                    <Button size="small" icon={<EditOutlined />} onClick={() => {
                        setEditingGroup(g);
                        groupForm.setFieldsValue(g);
                        setIsGroupModalOpen(true);
                    }} />
                </Space>
            )
        }
    ];

    const assetColumns: ColumnsType<Asset> = [
        { title: 'Mã TS', dataIndex: 'code', key: 'code', width: 120 },
        { title: 'Tên Tài sản', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
        { title: 'Số Serial', dataIndex: 'serialNumber', key: 'sn' },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'st',
            render: (s: AssetStatus) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>
        },
        { title: 'Người giữ', dataIndex: 'assignedTo', key: 'user', render: (v) => v || '—' },
        { title: 'Ngày nhập', dataIndex: 'purchaseDate', key: 'date' },
        {
            title: '',
            key: 'act',
            render: (_, a) => (
                <Button type="text" icon={<EditOutlined />} onClick={() => {
                    setEditingAsset(a);
                    assetForm.setFieldsValue(a);
                    setIsAssetModalOpen(true);
                }} />
            )
        }
    ];

    const stats = useMemo(() => {
        return {
            total: assets.length,
            inUse: assets.filter(a => a.status === 'IN_USE').length,
            available: assets.filter(a => a.status === 'AVAILABLE').length,
            totalValue: assets.reduce((s, a) => s + a.cost, 0)
        };
    }, [assets]);

    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>🛠️ Quản lý Tài sản Cố định</Title>
                <Space>
                    <Button icon={<BarChartOutlined />}>Báo cáo TS</Button>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => {
                        setEditingGroup(null);
                        groupForm.resetFields();
                        setIsGroupModalOpen(true);
                    }}>Thêm Nhóm tài sản</Button>
                </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Tổng số tài sản" value={stats.total} prefix={<ToolOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Đang cấp phát" value={stats.inUse} valueStyle={{ color: '#1890ff' }} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Sẵn sàng" value={stats.available} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Tổng nguyên giá" value={stats.totalValue} suffix="đ" />
                    </Card>
                </Col>
            </Row>

            <Tabs
                items={[
                    {
                        key: 'groups',
                        label: 'Danh sách Nhóm tài sản',
                        children: (
                            <Table 
                                columns={groupColumns} 
                                dataSource={groups} 
                                rowKey="id" 
                                pagination={false}
                                expandable={{
                                    expandedRowRender: (record) => (
                                        <Table 
                                            columns={assetColumns} 
                                            dataSource={assets.filter(a => a.groupId === record.id)} 
                                            pagination={false}
                                            size="small"
                                            rowKey="id"
                                        />
                                    )
                                }}
                            />
                        )
                    },
                    {
                        key: 'all',
                        label: 'Tất cả tài sản (Tracking)',
                        children: (
                            <Card size="small" title="Tra cứu Tài sản theo Serial/Mã">
                                <div style={{ marginBottom: 16 }}>
                                    <Input placeholder="Tìm theo Serial, mã hoặc tên tài sản..." prefix={<SearchOutlined />} style={{ width: 400 }} />
                                </div>
                                <Table columns={assetColumns} dataSource={assets} rowKey="id" />
                            </Card>
                        )
                    }
                ]}
            />

            {/* Group Modal */}
            <Modal
                title={editingGroup ? "Cập nhật Nhóm tài sản" : "Thêm Nhóm tài sản mới"}
                open={isGroupModalOpen}
                onOk={handleSaveGroup}
                onCancel={() => setIsGroupModalOpen(false)}
            >
                <Form form={groupForm} layout="vertical">
                    <Form.Item name="name" label="Tên Nhóm tài sản" rules={[{ required: true }]}>
                        <Input placeholder="VD: Máy móc thiết bị thi công" />
                    </Form.Item>
                    <Form.Item name="category" label="Danh mục">
                        <Select placeholder="Chọn danh mục">
                            <Option value="Dụng cụ thi công">Dụng cụ thi công</Option>
                            <Option value="Văn phòng phẩm">Văn phòng phẩm</Option>
                            <Option value="Máy móc công nghệ">Máy móc công nghệ</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="depreciationMonths" label="Thời gian khấu hao tiêu chuẩn (Tháng)" initialValue={24}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Asset Modal */}
            <Modal
                title={editingAsset ? "Cập nhật tài sản" : "Thêm tài sản mới"}
                open={isAssetModalOpen}
                onOk={handleSaveAsset}
                onCancel={() => setIsAssetModalOpen(false)}
                width={700}
            >
                <Form form={assetForm} layout="vertical">
                    <Form.Item name="groupId" hidden><Input /></Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="code" label="Mã tài sản / Số hiệu" rules={[{ required: true }]}>
                                <Input placeholder="VD: Bosch-001" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="serialNumber" label="Số Serial (Nếu có)">
                                <Input placeholder="VD: SN123456" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="name" label="Tên chi tiết tài sản" rules={[{ required: true }]}>
                        <Input placeholder="VD: Máy khoan Bosch GBH 2-24 DRE - Bộ phận #1" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="status" label="Trạng thái">
                                <Select>
                                    <Option value="AVAILABLE">Sẵn sàng</Option>
                                    <Option value="IN_USE">Đang sử dụng</Option>
                                    <Option value="MAINTENANCE">Bảo trì</Option>
                                    <Option value="BROKEN">Hỏng</Option>
                                    <Option value="LOST">Mất</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="cost" label="Nguyên giá (Đồng)" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="purchaseDate" label="Ngày nhập">
                                <Input type="date" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="assignedTo" label="Giao cho / Địa điểm">
                                <Input placeholder="Người hoặc bộ phòng ban đang giữ" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="condition" label="Tình trạng">
                                <Input placeholder="VD: Mới 100%, Đã qua sử dụng..." />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="notes" label="Ghi chú">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AssetsDashboard;
