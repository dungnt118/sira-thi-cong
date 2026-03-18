import React, { useState, useMemo } from 'react';
import {
    Card, Row, Col, Table, Tag, Button, Statistic,
    Typography, Space, Tabs, Modal, Form, Input, InputNumber, Select,
    message, Popconfirm, Alert
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined, MinusOutlined, HistoryOutlined,
    BankOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import type { Material, StockOrder, MaterialGroup, StockOrderStatus } from '../../../types/v3';
import mockMaterialsData from '../../../data/mock/materials.json';
import mockStockOrdersData from '../../../data/mock/stockOrders.json';

const { Title, Text } = Typography;
const { Option } = Select;

const InventoryDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [skuForm] = Form.useForm();
    
    // Use LocalStorage for state management
    const [groups, setGroups] = useLocalStorageData<MaterialGroup[]>('MATERIAL_GROUPS', (mockMaterialsData as any).groups);
    const [materials, setMaterials] = useLocalStorageData<Material[]>('MATERIALS', (mockMaterialsData as any).materials);
    const [stockOrders] = useLocalStorageData<StockOrder[]>('STOCK_ORDERS', mockStockOrdersData as StockOrder[]);

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isSkuModalOpen, setIsSkuModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<MaterialGroup | null>(null);
    const [editingGroup, setEditingGroup] = useState<MaterialGroup | null>(null);
    const [editingSku, setEditingSku] = useState<Material | null>(null);

    // Aggregation Logic for Groups
    const groupStats = useMemo(() => {
        return groups.map(group => {
            const skus = materials.filter(m => m.groupId === group.id);
            const totalCapacity = skus.reduce((sum, s) => sum + (s.currentStock * s.capacity + s.partialStock), 0);
            const totalFull = skus.reduce((sum, s) => sum + s.currentStock, 0);
            const totalPartial = skus.filter(s => s.partialStock > 0).length;
            const totalValue = skus.reduce((sum, s) => {
                const fullValue = s.currentStock * s.unitCost;
                const partialValue = (s.partialStock / s.capacity) * s.unitCost;
                return sum + (isNaN(fullValue) ? 0 : fullValue) + (isNaN(partialValue) ? 0 : partialValue);
            }, 0);

            return {
                ...group,
                totalCapacity,
                totalFull,
                totalPartial,
                totalValue,
                skus
            };
        });
    }, [groups, materials]);

    const totalInventoryValue = groupStats.reduce((s: number, g: any) => s + g.totalValue, 0);
    const lowStockSkus = materials.filter(m => m.currentStock <= m.minStockAlert);

    const handleSaveGroup = () => {
        form.validateFields().then(values => {
            if (editingGroup) {
                const updated = groups.map(g => g.id === editingGroup.id ? { ...g, ...values } : g);
                setGroups(updated);
                message.success('Cập nhật nhóm hàng thành công');
            } else {
                const newId = `GRP-${Date.now()}`;
                setGroups([...groups, { ...values, id: newId }]);
                message.success('Thêm nhóm hàng mới thành công');
            }
            setIsGroupModalOpen(false);
        });
    };

    const handleDeleteGroup = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const hasSkus = materials.some(m => m.groupId === id);
        if (hasSkus) {
            message.error('Không thể xóa nhóm đang có SKU. Vui lòng xóa SKU trước.');
            return;
        }
        setGroups(groups.filter(g => g.id !== id));
        message.success('Đã xóa nhóm hàng');
    };

    const handleSaveSku = () => {
        skuForm.validateFields().then(values => {
            const group = groups.find(g => g.id === values.groupId);
            if (!group) return;

            // Inherit from Group
            const skuData = {
                ...values,
                name: `${values.capacity}`, // Name is just the number/capacity now
                unit: group.packageUnit      // Inherit package unit from group
            };

            if (editingSku) {
                const updated = materials.map(m => m.id === editingSku.id ? { ...m, ...skuData } : m);
                setMaterials(updated);
                message.success('Cập nhật SKU thành công');
            } else {
                const newId = `SKU-${Date.now()}`;
                setMaterials([...materials, { ...skuData, id: newId, currentStock: 0, partialStock: 0 }]);
                message.success('Thêm SKU mới thành công');
            }
            setIsSkuModalOpen(false);
        });
    };

    const groupColumns: ColumnsType<any> = [
        { 
            title: 'Tên Nhóm hàng', 
            dataIndex: 'name', 
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Text strong>{text}</Text>
                    <Tag>{record.category}</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>({record.packageUnit})</Text>
                </Space>
            )
        },
        { 
            title: 'Tổng Dung lượng', 
            key: 'capacity',
            render: (_, record) => (
                <Text strong style={{ color: '#1890ff' }}>
                    {record.totalCapacity.toLocaleString()} {record.baseUnit}
                </Text>
            )
        },
        { 
            title: 'Số lượng Nguyên', 
            dataIndex: 'totalFull', 
            key: 'full',
            render: (v, record) => <Tag color="blue">{v} {record.packageUnit}</Tag>
        },
        { 
            title: 'Số lượng Dở', 
            dataIndex: 'totalPartial', 
            key: 'partial',
            render: (v, record) => <Tag color="orange">{v} {record.packageUnit}</Tag>
        },
        { 
            title: 'Tổng Giá trị (Ước tính)', 
            dataIndex: 'totalValue', 
            key: 'val',
            align: 'right',
            render: (v) => <Text strong>{v.toLocaleString('vi-VN')}đ</Text>
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 250,
            render: (_, record) => (
                <Space onClick={(e) => e.stopPropagation()}>
                    <Button 
                        size="small" 
                        icon={<PlusOutlined />} 
                        onClick={() => {
                            setSelectedGroup(record);
                            skuForm.resetFields();
                            skuForm.setFieldsValue({ groupId: record.id, minStockAlert: 5 });
                            setEditingSku(null);
                            setIsSkuModalOpen(true);
                        }}
                    >
                        Thêm SKU
                    </Button>
                    <Button 
                        size="small" 
                        icon={<EditOutlined />} 
                        onClick={() => {
                            setEditingGroup(record);
                            form.setFieldsValue(record);
                            setIsGroupModalOpen(true);
                        }}
                    />
                    <Popconfirm 
                        title="Xóa nhóm hàng? (Chỉ khi không có SKU)" 
                        onConfirm={(e) => handleDeleteGroup(record.id, e as any)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button 
                            size="small" 
                            danger 
                            icon={<DeleteOutlined />} 
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const expandedRowRender = (group: any) => {
        const skuColumns: ColumnsType<Material> = [
            { title: 'Mã SKU', dataIndex: 'code', key: 'code', width: 120 },
            { 
                title: 'Quy cách', 
                dataIndex: 'name', 
                key: 'name', 
                render: (v) => <Text strong>{v} {group.baseUnit}</Text> 
            },
            { 
                title: 'Tồn Kho thực tế', 
                key: 'cap',
                render: (_, m) => (
                    <Space direction="vertical" size={0}>
                        <Text>{m.currentStock} {group.packageUnit} nguyên</Text>
                        {m.partialStock > 0 && <Text type="warning" style={{ fontSize: 11 }}>+ {m.partialStock} {group.baseUnit} lẻ</Text>}
                    </Space>
                )
            },
            { title: 'Đơn giá', dataIndex: 'unitCost', key: 'cost', align: 'right', render: (v) => v.toLocaleString('vi-VN') + 'đ' },
            { 
                title: 'Thành tiền', 
                key: 'total', 
                align: 'right',
                render: (_, m) => {
                    const totalVal = (m.currentStock * m.unitCost) + (m.partialStock / m.capacity) * m.unitCost;
                    return (isNaN(totalVal) ? '0' : totalVal.toLocaleString('vi-VN')) + 'đ';
                }
            },
            {
                title: '',
                key: 'act',
                render: (_, m) => (
                    <Button type="text" icon={<EditOutlined />} onClick={() => {
                        setEditingSku(m);
                        skuForm.setFieldsValue(m);
                        setIsSkuModalOpen(true);
                    }} />
                )
            }
        ];

        return (
            <Table 
                columns={skuColumns} 
                dataSource={group.skus} 
                pagination={false} 
                size="small" 
                rowKey="id"
                style={{ margin: '8px 0', background: '#fafafa', borderRadius: 4 }}
            />
        );
    };

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 24 
            }}>
                <Title level={4} style={{ margin: 0 }}>📦 Quản lý Vật tư tiêu hao</Title>
                <Space>
                    <Button icon={<BankOutlined />} onClick={() => navigate('/accountant/inventory/distributors')}>Nhà phân phối</Button>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => {
                        setEditingGroup(null);
                        form.resetFields();
                        setIsGroupModalOpen(true);
                    }}>Khai báo Nhóm hàng</Button>
                    <Button icon={<HistoryOutlined />} onClick={() => navigate('/accountant/inventory/history')}>Lịch sử</Button>
                    <Button icon={<MinusOutlined />} onClick={() => navigate('/accountant/inventory/stock-out')}>Xuất kho</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/accountant/inventory/stock-in')}>Nhập kho</Button>
                </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Tổng giá trị kho" value={totalInventoryValue} suffix="đ" precision={0} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Số Nhóm hàng" value={groups.length} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Cần nhập thêm (SKU)" value={lowStockSkus.length} valueStyle={{ color: '#cf1322' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Vòng quay kho (Tháng)" value={1.2} />
                    </Card>
                </Col>
            </Row>

            <Tabs
                items={[
                    {
                        key: 'materials',
                        label: 'Danh mục vật tư',
                        children: (
                            <Table
                                columns={groupColumns}
                                dataSource={groupStats}
                                rowKey="id"
                                size="middle"
                                expandable={{ expandedRowRender, defaultExpandAllRows: false }}
                                pagination={false}
                            />
                        ),
                    },
                    {
                        key: 'history',
                        label: 'Lịch sử nhập/xuất',
                        children: (
                            <Table
                                rowKey="id"
                                dataSource={stockOrders}
                                size="small"
                                scroll={{ x: 'max-content' }}
                                columns={[
                                    { 
                                        title: 'Mã phiếu', 
                                        dataIndex: 'code', 
                                        key: 'code', 
                                        fixed: 'left', 
                                        width: 120, 
                                        render: (c: string, record: StockOrder) => (
                                            <Button type="link" onClick={() => navigate(`/accountant/inventory/order/${record.id}`)} style={{ padding: 0 }}>
                                                <Text strong>{c}</Text>
                                            </Button>
                                        ) 
                                    },
                                    { title: 'Loại', dataIndex: 'type', key: 'type', width: 100, render: (t: string) => <Tag color={t === 'OUT' ? 'orange' : 'green'}>{t === 'OUT' ? 'Xuất kho' : 'Nhập kho'}</Tag> },
                                    { title: 'Nguồn', dataIndex: 'source', key: 'source', width: 120 },
                                    { title: 'Đối tượng', dataIndex: 'projectName', key: 'proj', minWidth: 150, render: (v: string) => v || '—' },
                                    { 
                                        title: 'Trạng thái', 
                                        dataIndex: 'status', 
                                        key: 'st', 
                                        width: 130,
                                        render: (s: StockOrderStatus) => {
                                            const colors: Record<string, string> = {
                                                'DRAFT': 'default',
                                                'REQUESTED': 'processing',
                                                'APPROVED': 'cyan',
                                                'DISPATCHED': 'purple',
                                                'RECEIVED': 'blue',
                                                'COMPLETED': 'success',
                                                'DISCREPANCY': 'error',
                                                'CANCELLED': 'error'
                                            };
                                            return <Tag color={colors[s] || 'default'}>{s}</Tag>;
                                        }
                                    },
                                    { title: 'Giá trị', dataIndex: 'totalValue', key: 'val', width: 120, render: (v: number) => `${(v || 0).toLocaleString('vi-VN')}đ` },
                                    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'date', width: 110 },
                                ]}
                            />
                        ),
                    },
                ]}
            />

            {/* Group Modal */}
            <Modal
                title={editingGroup ? "Cập nhật Nhóm hàng" : "Khai báo Nhóm hàng mới"}
                open={isGroupModalOpen}
                onOk={handleSaveGroup}
                onCancel={() => setIsGroupModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên Nhóm hàng (Sản phẩm)" rules={[{ required: true }]}>
                        <Input placeholder="VD: Sơn PU (Lót)" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="baseUnit" label="ĐVT cơ sở (L/Kg)" rules={[{ required: true }]}>
                                <Select placeholder="Chọn ĐVT">
                                    <Option value="Kg">Kg</Option>
                                    <Option value="Lít">Lít</Option>
                                    <Option value="Cái">Cái</Option>
                                    <Option value="Mét">Mét</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="packageUnit" label="ĐVT đóng gói" rules={[{ required: true }]}>
                                <Select placeholder="Thùng/Lon...">
                                    <Option value="thùng">Thùng</Option>
                                    <Option value="lon">Lon</Option>
                                    <Option value="bao">Bao</Option>
                                    <Option value="cái">Cái</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Form.Item name="type" initialValue="CONSUMABLE" hidden><Input /></Form.Item>
                    </Row>
                    <Form.Item name="category" label="Danh mục">
                        <Input placeholder="VD: Sơn chống thấm" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* SKU Modal */}
            <Modal
                title={editingSku ? "Chỉnh sửa SKU" : `Thêm SKU vào nhóm: ${selectedGroup?.name}`}
                open={isSkuModalOpen}
                onOk={handleSaveSku}
                onCancel={() => setIsSkuModalOpen(false)}
                width={500}
            >
                <Alert 
                    message={`SKU này sẽ kế thừa ĐVT cơ sở (${selectedGroup?.baseUnit}) và ĐVT đóng gói (${selectedGroup?.packageUnit}) từ Nhóm.`}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Form form={skuForm} layout="vertical">
                    <Form.Item name="groupId" hidden><Input /></Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="code" label="Mã SKU" rules={[{ required: true }]}>
                                <Input placeholder="VD: PU-15KG" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                name="capacity" 
                                label={`Số lượng quy cách (mỗi ${selectedGroup?.packageUnit})`} 
                                rules={[{ required: true }]}
                            >
                                <InputNumber 
                                    style={{ width: '100%' }} 
                                    placeholder="VD: 15" 
                                    addonAfter={selectedGroup?.baseUnit}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="unitCost" label="Đơn giá tham chiếu" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="minStockAlert" label="Cảnh báo tồn tối thiểu">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryDashboard;
