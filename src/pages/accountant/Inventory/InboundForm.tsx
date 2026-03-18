import React, { useState, useMemo } from 'react';
import { 
    Form, Input, Select, InputNumber, Button, Card, 
    Typography, Space, Row, Col, message,
    Radio, Table, Divider, Tag
} from 'antd';
import { 
    PlusOutlined, SaveOutlined, ArrowLeftOutlined, 
    InfoCircleOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import { 
    Material, Distributor, StockOrder, 
    StockOrderSource, MaterialGroup 
} from '../../../types/v3';
import mockMaterialsData from '../../../data/mock/materials.json';
import mockDistributors from '../../../data/mock/distributors.json';
import { mockProjects } from '../../../data/mockData';

const { Title, Text } = Typography;

const InboundForm: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [sourceType, setSourceType] = useState<StockOrderSource>('DISTRIBUTOR');
    
    // Watch form fields for reactivity and calculation
    const watchedQuantity = Form.useWatch('quantity', form);
    const watchedRemainingQuantity = Form.useWatch('remainingQuantity', form);
    const watchedUnitCost = Form.useWatch('unitCost', form);
    const watchedIsPartial = Form.useWatch('isPartial', form);

    const [groups] = useLocalStorageData<MaterialGroup[]>('MATERIAL_GROUPS', (mockMaterialsData as any).groups);
    const [materials, setMaterials] = useLocalStorageData<Material[]>('MATERIALS', (mockMaterialsData as any).materials);
    const [distributors] = useLocalStorageData<Distributor[]>('DISTRIBUTORS', mockDistributors as Distributor[]);
    const [stockOrders, setStockOrders] = useLocalStorageData<StockOrder[]>('STOCK_ORDERS', []);
    
    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    // Calculate temporary total for the current input
    const tempTotal = useMemo(() => {
        const qty = watchedIsPartial ? (watchedRemainingQuantity || 0) : (watchedQuantity || 0);
        const cost = watchedUnitCost || 0;
        return qty * cost;
    }, [watchedIsPartial, watchedQuantity, watchedRemainingQuantity, watchedUnitCost]);

    const handleAddItem = () => {
        const values = form.getFieldsValue();
        if (!values.materialId || (!values.quantity && !values.remainingQuantity)) {
            message.warning('Vui lòng chọn vật tư và nhập số lượng');
            return;
        }

        const material = materials.find(m => m.id === values.materialId);
        if (!material) return;
        const group = groups.find(g => g.id === material.groupId);

        const isPartial = values.isPartial && sourceType === 'PROJECT';
        const qty = isPartial ? 0 : (values.quantity || 0);
        const remQty = values.remainingQuantity || 0;
        const cost = values.unitCost || material.unitCost || 0;
        
        const newItem = {
            key: Date.now(),
            materialId: material.id,
            materialName: `[${material.code}] ${group?.name || 'Vật tư'} - quy cách ${material.capacity}${group?.baseUnit || ''}`,
            baseUnit: group?.baseUnit || 'đơn vị',
            unit: material.unit,
            quantity: qty,
            requestedQuantity: qty, // PM requested this
            issuedQuantity: qty,    // Default same as requested for now
            isPartial: isPartial,
            remainingQuantity: remQty, // In liters/kg
            unitCost: cost,
            total: isPartial ? (remQty * cost) : (qty * cost),
        };

        setSelectedItems([...selectedItems, newItem]);
        form.setFieldsValue({ materialId: null, quantity: null, unitCost: null, isPartial: false, remainingQuantity: null });
    };

    const removeItem = (key: number) => {
        setSelectedItems(selectedItems.filter(item => item.key !== key));
    };

    const handleSubmit = () => {
        if (selectedItems.length === 0) {
            message.error('Vui lòng thêm ít nhất một mặt hàng');
            return;
        }

        const formValues = form.getFieldsValue();
        
        const newStockOrder: StockOrder = {
            id: `PN-${Date.now()}`,
            code: `PN-${new Date().getFullYear()}-${(stockOrders.length + 1).toString().padStart(3, '0')}`,
            type: 'IN',
            source: sourceType,
            sourceId: sourceType === 'DISTRIBUTOR' ? formValues.distributorId : formValues.projectId,
            projectId: sourceType === 'PROJECT' ? formValues.projectId : undefined,
            items: selectedItems.map(item => ({
                materialId: item.materialId,
                materialName: item.materialName,
                unit: item.unit,
                quantity: item.quantity,
                requestedQuantity: item.requestedQuantity,
                issuedQuantity: item.issuedQuantity,
                unitCost: item.unitCost,
                isPartial: item.isPartial,
                remainingPercent: item.isPartial ? (item.remainingQuantity * 100 / 20) : undefined
            })),
            totalValue: selectedItems.reduce((sum, item) => sum + (item.total || 0), 0),
            status: 'COMPLETED', // Directly completed for now in this legacy form
            signatures: [],
            history: [{
                status: 'COMPLETED',
                updatedBy: 'Kế toán Phạm Thị A',
                updatedAt: new Date().toISOString()
            }],
            createdBy: 'Kế toán Phạm Thị A',
            createdAt: new Date().toISOString().split('T')[0],
            notes: formValues.notes
        };

        // Update Stock Orders
        setStockOrders([newStockOrder, ...stockOrders]);

        // Update Inventory Stocks
        setMaterials(prev => prev.map(m => {
            const addedItems = selectedItems.filter(item => item.materialId === m.id);
            if (addedItems.length > 0) {
                let newStock = m.currentStock;
                let newPartial = m.partialStock || 0;
                
                addedItems.forEach(item => {
                    if (item.isPartial) {
                        newPartial += item.remainingQuantity;
                    } else {
                        newStock += item.quantity;
                    }
                });

                return {
                    ...m,
                    currentStock: newStock,
                    partialStock: newPartial
                };
            }
            return m;
        }));

        message.success('Nhập kho thành công');
        navigate('/accountant/inventory');
    };

    const itemColumns = [
        { title: 'Vật tư', dataIndex: 'materialName', key: 'name', render: (val: string, record: any) => (
            <div>
                <div>{val}</div>
                {record.isPartial && <Tag color="warning" style={{ fontSize: 10 }}>Hàng dở dang</Tag>}
            </div>
        )},
        { 
            title: 'Quy cách', 
            dataIndex: 'materialId', 
            key: 'sku',
            render: (_: string, record: any) => {
                const materialsMatch = materials.find(m => m.id === record.materialId);
                return <Tag color="blue">{materialsMatch?.unit || 'đơn vị'}</Tag>;
            }
        },
        { 
            title: 'SL Nhập', 
            key: 'qty', 
            render: (_: any, record: any) => record.isPartial ? `${record.remainingQuantity} (${record.baseUnit} lẻ)` : `${record.quantity} ${record.unit}` 
        },
        { title: 'Đơn giá', dataIndex: 'unitCost', key: 'cost', render: (val: number) => (val || 0).toLocaleString('vi-VN') + 'đ' },
        { title: 'Thành tiền', dataIndex: 'total', key: 'total', render: (val: number) => (val || 0).toLocaleString('vi-VN') + 'đ' },
        {
            title: '',
            key: 'action',
            render: (_: any, record: any) => (
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(record.key)} />
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/accountant/inventory')} style={{ marginRight: '16px' }} />
                <Title level={4} style={{ margin: 0 }}>📋 Phiếu Nhập Kho</Title>
            </div>

            <Row gutter={24}>
                <Col span={18}>
                    <Card title="Thông tin mặt hàng" style={{ marginBottom: '24px' }}>
                        <Form form={form} layout="vertical">
                            <Row gutter={12}>
                                <Col span={8}>
                                    <Form.Item name="materialId" label="Chọn vật tư">
                                        <Select 
                                            showSearch
                                            placeholder="Gõ mã SKU hoặc tên"
                                            optionFilterProp="children"
                                            onChange={(val) => {
                                                const mat = materials.find(m => m.id === val);
                                                if (mat) form.setFieldsValue({ unitCost: mat.unitCost });
                                            }}
                                        >
                                            {materials
                                                .filter(m => {
                                                    const g = groups.find(group => group.id === m.groupId);
                                                    return g?.type === 'CONSUMABLE';
                                                })
                                                .map(m => {
                                                    const group = groups.find(g => g.id === m.groupId);
                                                    return (
                                                        <Select.Option key={m.id} value={m.id}>
                                                            <Text strong>[{m.code}]</Text> {group?.name} - quy cách {m.capacity}{group?.baseUnit}
                                                        </Select.Option>
                                                    );
                                                })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Row gutter={8} align="bottom">
                                        {sourceType === 'PROJECT' && (
                                            <Col span={6}>
                                                <Form.Item name="isPartial" valuePropName="checked" label=" ">
                                                    <Button 
                                                        type={watchedIsPartial ? 'primary' : 'default'}
                                                        onClick={() => form.setFieldsValue({ isPartial: !watchedIsPartial })}
                                                        block
                                                    >
                                                        {watchedIsPartial ? '📦 Hàng lẻ' : '📦 Nguyên'}
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        )}
                                        <Col span={watchedIsPartial ? 5 : 6}>
                                            {watchedIsPartial ? (
                                                <Form.Item name="remainingQuantity" label="Lượng lẻ" rules={[{ required: true }]}>
                                                    <InputNumber min={0.1} style={{ width: '100%' }} placeholder="Kg/Lit" />
                                                </Form.Item>
                                            ) : (
                                                <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                                                    <InputNumber min={1} style={{ width: '100%' }} placeholder="Thùng/Lon" />
                                                </Form.Item>
                                            )}
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="unitCost" label="Đơn giá nhập">
                                                <InputNumber 
                                                    min={0} 
                                                    style={{ width: '100%' }} 
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                                                    parser={value => (value ? value.replace(/\$\s?|(,*)/g, '') : '') as any}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Thành tiền VNĐ">
                                                <InputNumber 
                                                    disabled 
                                                    value={tempTotal} 
                                                    style={{ width: '100%', background: '#f5f5f5', color: '#333', fontWeight: 'bold' }} 
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddItem} style={{ marginTop: 8 }}>
                                Thêm vào danh sách
                            </Button>
                        </Form>

                        <Divider style={{ margin: '24px 0' }} />

                        <Table 
                            dataSource={selectedItems} 
                            columns={itemColumns} 
                            pagination={false} 
                            size="small"
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card title="Nguồn nhập" size="small">
                        <Form form={form} layout="vertical">
                            <Form.Item label="Hình thức">
                                <Radio.Group value={sourceType} onChange={e => setSourceType(e.target.value)} size="small" style={{ width: '100%', textAlign: 'center' }}>
                                    <Radio.Button value="DISTRIBUTOR" style={{ width: '50%' }}>Từ NPP</Radio.Button>
                                    <Radio.Button value="PROJECT" style={{ width: '50%' }}>Dự án</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            {sourceType === 'DISTRIBUTOR' ? (
                                <Form.Item 
                                    name="distributorId" 
                                    label="Nhà phân phối"
                                    rules={[{ required: true, message: 'Chọn NPP' }]}
                                >
                                    <Select placeholder="Chọn NPP" style={{ width: '100%' }}>
                                        {distributors.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : (
                                <Form.Item 
                                    name="projectId" 
                                    label="Dự án/Công trình"
                                    rules={[{ required: true, message: 'Chọn dự án' }]}
                                >
                                    <Select placeholder="Chọn dự án" style={{ width: '100%' }}>
                                        {mockProjects.filter(p => p.status === 'COMPLETED' || p.status === 'IN_PROGRESS').map(p => (
                                            <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}

                            <Form.Item name="notes" label="Ghi chú">
                                <Input.TextArea rows={2} placeholder="Ghi chú..." />
                            </Form.Item>

                            <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Text type="secondary">Tổng tiền:</Text>
                                    <Text strong style={{ fontSize: '16px', color: '#f5222d' }}>
                                        {selectedItems.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString('vi-VN')}đ
                                    </Text>
                                </div>
                                <Button type="primary" block size="large" icon={<SaveOutlined />} onClick={handleSubmit}>
                                    Hoàn tất
                                </Button>
                            </div>
                        </Form>
                    </Card>

                    <Card size="small" style={{ marginTop: '12px', background: '#fffbe6', border: '1px solid #ffe58f' }}>
                        <Space align="start">
                            <InfoCircleOutlined style={{ color: '#faad14', marginTop: '4px' }} />
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                Nhập lẻ: VD 2L từ thùng 10L, nhập 2 vào ô Lượng lẻ.
                            </Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default InboundForm;
