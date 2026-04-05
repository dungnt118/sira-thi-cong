import React, { useState, useMemo, useEffect } from 'react';
import {
    Card, Row, Col, Table, Tag, Button, Statistic,
    Typography, Space, Modal, Form, Input, InputNumber, Select,
    message, Popconfirm, Alert, Grid
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined, MinusOutlined, HistoryOutlined,
    BankOutlined, EditOutlined, DeleteOutlined,
    InboxOutlined, AppstoreOutlined, AlertOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { materialService } from '../../../services/core-contracts/services/material.service';
import { materialGroupService } from '../../../services/core-contracts/services/materialGroup.service';
import type { IMaterial } from '../../../services/core-contracts/types/material.types';
import type { IMaterialGroup } from '../../../services/core-contracts/types/materialGroup.types';
import { MATERIAL_GROUP_CATEGORY_LABELS, type MaterialGroupCategory } from '../../../types/v3';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const InventoryDashboard: React.FC = () => {
    const screens = useBreakpoint();
    const isNarrow = !screens.md;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [skuForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<IMaterialGroup[]>([]);
    const [materials, setMaterials] = useState<IMaterial[]>([]);

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isSkuModalOpen, setIsSkuModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<IMaterialGroup | null>(null);
    const [editingGroup, setEditingGroup] = useState<IMaterialGroup | null>(null);
    const [editingSku, setEditingSku] = useState<IMaterial | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [groupRes, materialRes] = await Promise.all([
                materialGroupService.queryMaterialGroupsDto({}),
                materialService.queryMaterialsDto({})
            ]);
            if (groupRes.data) setGroups(groupRes.data);
            if (materialRes.data) setMaterials(materialRes.data);
        } catch (error) {
            message.error('Không thể tải dữ liệu vật tư');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Aggregation Logic for Groups
    const groupStats = useMemo(() => {
        return groups.map(group => {
            const skus = materials.filter(m => m.group_id === group._id);
            const totalFull = skus.reduce((sum, s) => sum + (s.current_stock || 0), 0);
            const totalPartial = skus.filter(s => (s.partial_stock || 0) > 0).length;
            const totalValue = skus.reduce((sum, s) => {
                const fullValue = (s.current_stock || 0) * (s.unit_cost || 0);
                const partialValue = ((s.partial_stock || 0) / (s.capacity || 1)) * (s.unit_cost || 0);
                return sum + (isNaN(fullValue) ? 0 : fullValue) + (isNaN(partialValue) ? 0 : partialValue);
            }, 0);

            return {
                ...group,
                totalFull,
                totalPartial,
                totalValue,
                skus
            };
        });
    }, [groups, materials]);

    const totalInventoryValue = groupStats.reduce((s: number, g: any) => s + g.totalValue, 0);
    const lowStockSkus = materials.filter(m => (m.current_stock || 0) <= (m.min_stock_alert || 0));

    const handleSaveGroup = async () => {
        try {
            const values = await form.validateFields();
            if (editingGroup) {
                await materialGroupService.updateMaterialGroup(editingGroup._id, values);
                message.success('Cập nhật nhóm hàng thành công');
            } else {
                await materialGroupService.createMaterialGroup({ ...values, type: 'CONSUMABLE' });
                message.success('Thêm nhóm hàng mới thành công');
            }
            setIsGroupModalOpen(false);
            fetchData();
        } catch (error) {
            message.error('Lỗi khi lưu nhóm hàng');
        }
    };

    const handleDeleteGroup = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const hasSkus = materials.some(m => m.group_id === id);
        if (hasSkus) {
            message.error('Không thể xóa nhóm đang có SKU. Vui lòng xóa SKU trước.');
            return;
        }
        try {
            await materialGroupService.deleteMaterialGroup(id);
            message.success('Đã xóa nhóm hàng');
            fetchData();
        } catch (error) {
            message.error('Lỗi khi xóa nhóm hàng');
        }
    };

    const handleSaveSku = async () => {
        try {
            const values = await skuForm.validateFields();
            const group = groups.find(g => g._id === values.group_id);
            if (!group) return;

            const skuData = {
                ...values,
                name: `${values.capacity} ${group.base_unit || ''}`,
                unit: group.package_unit
            };

            if (editingSku) {
                await materialService.updateMaterial(editingSku._id, skuData);
                message.success('Cập nhật SKU thành công');
            } else {
                await materialService.createMaterial({ 
                    ...skuData, 
                    current_stock: 0, 
                    partial_stock: 0 
                } as any);
                message.success('Thêm SKU mới thành công');
            }
            setIsSkuModalOpen(false);
            fetchData();
        } catch (error) {
            message.error('Lỗi khi lưu SKU');
        }
    };

    const groupColumns: ColumnsType<any> = [
        {
            title: 'Tên Nhóm hàng',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Text strong>{text}</Text>
                    {record.category ? (
                        <Tag color="cyan">
                            {MATERIAL_GROUP_CATEGORY_LABELS[record.category as MaterialGroupCategory]}
                        </Tag>
                    ) : null}
                    <Text type="secondary" style={{ fontSize: 12 }}>({record.package_unit})</Text>
                </Space>
            )
        },
        {
            title: 'Quy cách (Gốc)',
            key: 'base_unit',
            render: (_, record) => (
                <Text strong style={{ color: '#1890ff' }}>
                    {record.base_unit || '—'}
                </Text>
            )
        },
        {
            title: 'Số lượng Nguyên',
            dataIndex: 'totalFull',
            key: 'full',
            render: (v, record) => <Tag color="blue">{v} {record.package_unit}</Tag>
        },
        {
            title: 'Số lượng Dở',
            dataIndex: 'totalPartial',
            key: 'partial',
            render: (v, record) => <Tag color="orange">{v} SKU dở</Tag>
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
                            skuForm.setFieldsValue({ group_id: record._id, min_stock_alert: 5 });
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
                        onConfirm={(e) => handleDeleteGroup(record._id, e as any)}
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
        const skuColumns: ColumnsType<IMaterial> = [
            { title: 'Mã SKU', dataIndex: 'code', key: 'code', width: 120 },
            {
                title: 'Quy cách',
                dataIndex: 'name',
                key: 'name',
                render: (v) => <Text strong>{v}</Text>
            },
            {
                title: 'Tồn Kho thực tế',
                key: 'cap',
                render: (_, m) => (
                    <Space direction="vertical" size={0}>
                        <Text>{m.current_stock || 0} {group.package_unit} nguyên</Text>
                        {(m.partial_stock || 0) > 0 && <Text type="warning" style={{ fontSize: 11 }}>+ {m.partial_stock} {group.base_unit} lẻ</Text>}
                    </Space>
                )
            },
            { title: 'Đơn giá', dataIndex: 'unit_cost', key: 'cost', align: 'right', render: (v) => (v || 0).toLocaleString('vi-VN') + 'đ' },
            {
                title: 'Thành tiền',
                key: 'total',
                align: 'right',
                render: (_, m) => {
                    const totalVal = ((m.current_stock || 0) * (m.unit_cost || 0)) + (((m.partial_stock || 0) / (m.capacity || 1)) * (m.unit_cost || 0));
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
                rowKey="_id"
                style={{ margin: '8px 0', background: '#fafafa', borderRadius: 4 }}
            />
        );
    };

    return (
        <div style={{ minWidth: 0 }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: isNarrow ? 'column' : 'row',
                    alignItems: isNarrow ? 'stretch' : 'center',
                    justifyContent: 'space-between',
                    gap: isNarrow ? 12 : 16,
                    marginBottom: isNarrow ? 16 : 24,
                }}
            >
                <Title
                    level={4}
                    style={{
                        margin: 0,
                        width: isNarrow ? '100%' : undefined,
                        minWidth: 0,
                        lineHeight: 1.35,
                    }}
                >
                    <InboxOutlined style={{ marginRight: 8 }} />
                    Quản lý Vật tư tiêu hao
                </Title>
                <Space wrap size={isNarrow ? 'small' : 'middle'} style={isNarrow ? { width: '100%' } : undefined}>
                    <Button icon={<BankOutlined />} onClick={() => navigate('/kt/inventory/distributors')}>
                        Nhà phân phối
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => {
                            setEditingGroup(null);
                            form.resetFields();
                            setIsGroupModalOpen(true);
                        }}
                    >
                        Khai báo Nhóm
                    </Button>
                    <Button icon={<HistoryOutlined />} onClick={() => navigate('/kt/inventory/history')}>
                        Lịch sử
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/kt/inventory/stock-in')}>
                        Nhập kho
                    </Button>
                    <Button danger icon={<MinusOutlined />} onClick={() => navigate('/kt/inventory/stock-out')}>
                        Xuất kho
                    </Button>
                </Space>
            </div>

            <Row gutter={[12, 12]} style={{ marginBottom: isNarrow ? 16 : 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small" bordered={false} className="dashboard-stat-card" styles={{ body: { padding: isNarrow ? 12 : undefined } }}>
                        <Statistic
                            title={<span style={{ whiteSpace: 'normal' }}>Tổng giá trị kho</span>}
                            value={totalInventoryValue}
                            prefix={<AppstoreOutlined />}
                            formatter={(val) => (
                                <span style={{ whiteSpace: 'nowrap' }}>
                                    {typeof val === 'number' ? val.toLocaleString('vi-VN') : val} đ
                                </span>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small" bordered={false} className="dashboard-stat-card" styles={{ body: { padding: isNarrow ? 12 : undefined } }}>
                        <Statistic title="Số Nhóm hàng" value={groups.length} prefix={<InboxOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small" bordered={false} className="dashboard-stat-card" styles={{ body: { padding: isNarrow ? 12 : undefined } }}>
                        <Statistic
                            title={<span style={{ whiteSpace: 'normal' }}>Cần nhập thêm (SKU)</span>}
                            value={lowStockSkus.length}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<AlertOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small" bordered={false} className="dashboard-stat-card" styles={{ body: { padding: isNarrow ? 12 : undefined } }}>
                        <Statistic
                            title={<span style={{ whiteSpace: 'normal' }}>Vòng quay kho (Tháng)</span>}
                            value={1.2}
                            prefix={<HistoryOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Table
                columns={groupColumns}
                dataSource={groupStats}
                rowKey="_id"
                size={isNarrow ? 'small' : 'middle'}
                loading={loading}
                expandable={{ expandedRowRender, defaultExpandAllRows: false }}
                pagination={false}
                scroll={{ x: 1000 }}
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
                        <Col xs={24} sm={8}>
                            <Form.Item name="base_unit" label="ĐVT cơ sở (L/Kg)" rules={[{ required: true }]}>
                                <Select placeholder="Chọn ĐVT">
                                    <Option value="Kg">Kg</Option>
                                    <Option value="Lít">Lít</Option>
                                    <Option value="Cái">Cái</Option>
                                    <Option value="Mét">Mét</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={16}>
                            <Form.Item name="package_unit" label="ĐVT đóng gói" rules={[{ required: true }]}>
                                <Select placeholder="Thùng/Lon...">
                                    <Option value="thùng">Thùng</Option>
                                    <Option value="lon">Lon</Option>
                                    <Option value="bao">Bao</Option>
                                    <Option value="cái">Cái</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="category" label="Danh mục (loại vật tư)">
                        <Select
                            allowClear
                            placeholder="Chọn danh mục"
                            options={(Object.keys(MATERIAL_GROUP_CATEGORY_LABELS) as any).map((value: any) => ({
                                value,
                                label: (MATERIAL_GROUP_CATEGORY_LABELS as any)[value],
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* SKU Modal */}
            <Modal
                title={editingSku ? "Chỉnh sửa SKU" : `Thêm SKU vào nhóm: ${selectedGroup?.name}`}
                open={isSkuModalOpen}
                onOk={handleSaveSku}
                onCancel={() => setIsSkuModalOpen(false)}
                width={isNarrow ? 'calc(100vw - 24px)' : 500}
            >
                <Alert
                    message={`SKU này sẽ kế thừa ĐVT cơ sở (${selectedGroup?.base_unit}) và ĐVT đóng gói (${selectedGroup?.package_unit}) từ Nhóm.`}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Form form={skuForm} layout="vertical">
                    <Form.Item name="group_id" hidden><Input /></Form.Item>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="code" label="Mã SKU" rules={[{ required: true }]}>
                                <Input placeholder="VD: PU-15KG" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="capacity"
                                label={`Số lượng quy cách (mỗi ${selectedGroup?.package_unit})`}
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="VD: 15"
                                    addonAfter={selectedGroup?.base_unit}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="unit_cost" label="Đơn giá tham chiếu" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="min_stock_alert" label="Cảnh báo tồn tối thiểu">
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
