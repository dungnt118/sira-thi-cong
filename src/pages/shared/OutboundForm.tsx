import React, { useState } from 'react';
import { 
    Form, Input, Select, InputNumber, Button, Card, 
    Typography, Space, Row, Col, message,
    Table, Empty, Radio, Tag
} from 'antd';
import { 
    PlusOutlined, SaveOutlined, ArrowLeftOutlined, 
    DeleteOutlined, WarningOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../hooks/useLocalStorageData';
import { 
    Material, StockOrder, MaterialGroup 
} from '../../types/v3';
import mockMaterialsData from '../../data/mock/materials.json';
import { mockJourneys } from '../../data/journeyMockData';

const { Title, Text } = Typography;

const OutboundForm: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    const [groups] = useLocalStorageData<MaterialGroup[]>('MATERIAL_GROUPS', (mockMaterialsData as any).groups);
    const [materials, setMaterials] = useLocalStorageData<Material[]>('MATERIALS', (mockMaterialsData as any).materials);
    const [stockOrders, setStockOrders] = useLocalStorageData<StockOrder[]>('STOCK_ORDERS', []);
    
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [outMode, setOutMode] = useState<'FULL' | 'PARTIAL'>('FULL');

    const handleAddItem = () => {
        const values = form.getFieldsValue();
        if (!values.materialId || !values.quantity) {
            message.warning('Vui lòng nhập vật tư và số lượng');
            return;
        }

        const material = materials.find(m => m.id === values.materialId);
        if (!material) return;
        const group = groups.find(g => g.id === material.groupId);

        const isPartial = outMode === 'PARTIAL';
        const unit = isPartial ? (group?.baseUnit || material.unit) : material.unit;

        // Validation
        const capacity = material.capacity || 1; // Fallback for old data
        const partialStock = material.partialStock || 0;
        const totalAvailable = (material.currentStock * capacity) + partialStock;
        const requestedBase = isPartial ? values.quantity : values.quantity * capacity;

        if (requestedBase > totalAvailable) {
            message.error(`Số lượng yêu cầu (${requestedBase} ${unit}) vượt quá tồn kho khả dụng (${totalAvailable} ${unit})`);
            return;
        }

        const newItem = {
            key: Date.now(),
            materialId: material.id,
            materialName: `[${material.code}] ${group?.name || 'Vật tư'} - quy cách ${material.capacity}${group?.baseUnit || ''}`,
            unit: unit,
            quantity: values.quantity,
            requestedQuantity: values.quantity,
            issuedQuantity: values.quantity,
            isPartial: isPartial,
            baseQuantity: requestedBase, 
            unitCost: material.unitCost,
            total: isPartial 
                ? (values.quantity / capacity) * material.unitCost 
                : values.quantity * material.unitCost
        };

        setSelectedItems([...selectedItems, newItem]);
        form.setFieldsValue({ materialId: null, quantity: null });
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
        if (!formValues.journeyId) {
            message.error('Vui lòng chọn hành trình / công trình tiếp nhận');
            return;
        }
        
        const journey = mockJourneys.find(j => j.id === formValues.journeyId);
        
        const newStockOrder: StockOrder = {
            id: `PX-${Date.now()}`,
            code: `PX-${new Date().getFullYear()}-${(stockOrders.length + 1).toString().padStart(3, '0')}`,
            type: 'OUT',
            journeyId: formValues.journeyId,
            journeyCode: journey?.journey_code,
            items: selectedItems.map(item => ({
                materialId: item.materialId,
                materialName: item.materialName,
                unit: item.unit,
                quantity: item.quantity,
                requestedQuantity: item.requestedQuantity,
                issuedQuantity: item.issuedQuantity,
                unitCost: item.unitCost,
                isPartial: item.isPartial
            })),
            totalValue: selectedItems.reduce((sum, item) => sum + (item.total || 0), 0),
            status: 'REQUESTED',
            signatures: [],
            history: [{
                status: 'REQUESTED',
                updatedBy: 'Hệ thống (Web)',
                updatedAt: new Date().toISOString()
            }],
            createdBy: 'Hệ thống',
            createdAt: new Date().toISOString().split('T')[0],
            notes: formValues.notes
        };

        // Update Stock Orders
        setStockOrders([newStockOrder, ...stockOrders]);

        // Update Inventory Stocks
        setMaterials(prev => prev.map(m => {
            const addedItems = selectedItems.filter(item => item.materialId === m.id);
            if (addedItems.length > 0) {
                let newCurrentStock = m.currentStock;
                let newPartialStock = m.partialStock || 0;
                
                addedItems.forEach(item => {
                    const requestedAmount = item.baseQuantity; 
                    const capacity = m.capacity || 1;
                    
                    if (newPartialStock >= requestedAmount) {
                        newPartialStock -= requestedAmount;
                    } else {
                        const neededFromFull = requestedAmount - newPartialStock;
                        const fullToOpen = Math.ceil(neededFromFull / capacity);
                        
                        newCurrentStock -= fullToOpen;
                        newPartialStock = (fullToOpen * capacity) + newPartialStock - requestedAmount;
                    }
                });

                return {
                    ...m,
                    currentStock: newCurrentStock,
                    partialStock: Number(newPartialStock.toFixed(2))
                };
            }
            return m;
        }));

        message.success('Tạo phiếu xuất kho thành công. Chờ duyệt.');
        navigate(-1);
    };

    const itemColumns = [
        { title: 'Vật tư', dataIndex: 'materialName', key: 'name' },
        { title: 'SL Xuất', dataIndex: 'quantity', key: 'qty', render: (val: number, record: any) => `${val} ${record.unit}` },
        { title: 'Thành tiền', dataIndex: 'total', key: 'total', render: (val: number) => val.toLocaleString('vi-VN') + 'đ' },
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
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginRight: '16px' }} />
                <Title level={4} style={{ margin: 0 }}>🚚 Phiếu Xuất Kho</Title>
            </div>

            <Row gutter={24}>
                <Col span={16}>
                    <Card title="Chọn vật tư cấp phát" style={{ marginBottom: '24px' }}>
                        <Form form={form} layout="vertical">
                            <div style={{ marginBottom: 16 }}>
                                <Text type="secondary">Chế độ xuất: </Text>
                                <Radio.Group value={outMode} onChange={e => setOutMode(e.target.value)} size="small">
                                    <Radio.Button value="FULL">Nguyên thùng/lon</Radio.Button>
                                    <Radio.Button value="PARTIAL">Xuất lẻ (Kg/Lít)</Radio.Button>
                                </Radio.Group>
                            </div>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="materialId" label="Chọn vật tư">
                                        <Select 
                                            showSearch
                                            placeholder="Gõ mã hoặc tên"
                                            optionFilterProp="children"
                                            onChange={() => form.setFieldsValue({ quantity: null })}
                                        >
                                            {materials
                                                .filter(m => {
                                                    const group = groups.find(g => g.id === m.groupId);
                                                    return group?.type === 'CONSUMABLE';
                                                })
                                                .map(m => {
                                                    const group = groups.find(g => g.id === m.groupId);
                                                    const isLow = m.currentStock <= m.minStockAlert;
                                                    return (
                                                        <Select.Option key={m.id} value={m.id} disabled={m.currentStock <= 0 && (!m.partialStock || m.partialStock <= 0)}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span><Text strong>[{m.code}]</Text> {group?.name || 'Vật tư'} - quy cách {m.capacity}{group?.baseUnit || ''}</span>
                                                                <span style={{ fontSize: 11, color: isLow ? '#ff4d4f' : '#888' }}>
                                                                    Tồn: {m.currentStock} {m.unit} {(m.partialStock || 0) > 0 ? `(+ ${m.partialStock} lẻ)` : ''}
                                                                </span>
                                                            </div>
                                                        </Select.Option>
                                                    );
                                                })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item 
                                        name="quantity" 
                                        label={outMode === 'FULL' ? "Số lượng (Thùng/Lon)" : "Số lượng lẻ (Kg/Lít)"}
                                    >
                                        <InputNumber min={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={4} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '24px' }}>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddItem}>
                                        Thêm
                                    </Button>
                                </Col>
                            </Row>
                        </Form>

                        <Table 
                            dataSource={selectedItems} 
                            columns={itemColumns} 
                            pagination={false} 
                            size="small"
                            locale={{ emptyText: <Empty description="Chưa có vật tư nào được chọn" /> }}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card title="Thông tin tiếp nhận">
                        <Form form={form} layout="vertical">
                            <Form.Item 
                                name="journeyId" 
                                label="Hành trình / Công trình tiếp nhận"
                                rules={[{ required: true, message: 'Vui lòng chọn hành trình' }]}
                            >
                                <Select placeholder="Chọn hành trình" showSearch optionFilterProp="children">
                                    {mockJourneys
                                        .filter(j => ['active', 'not_started'].includes(j.project_status))
                                        .map(j => (
                                            <Select.Option key={j.id} value={j.id}>
                                                <Space>
                                                    <Tag color="blue" style={{fontSize: 11}}>{j.journey_code}</Tag>
                                                    {j.customer_name} — {j.requested_service}
                                                </Space>
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="notes" label="Ghi chú xuất kho">
                                <Input.TextArea rows={4} placeholder="Ví dụ: Cấp bù vật tư cho công trình, cho mượn máy khoan..." />
                            </Form.Item>

                            <div style={{ marginTop: '24px' }}>
                                <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                                    <Text strong style={{ fontSize: '18px' }}>
                                        Tổng giá trị: {selectedItems.reduce((sum, item) => sum + item.total, 0).toLocaleString('vi-VN')}đ
                                    </Text>
                                </div>
                                <Button type="primary" size="large" block icon={<SaveOutlined />} onClick={handleSubmit}>
                                    Tạo phiếu xuất kho
                                </Button>
                            </div>
                        </Form>
                    </Card>

                    <Card size="small" style={{ marginTop: '16px', border: '1px solid #ffe58f', background: '#fffbe6' }}>
                        <Space align="start">
                            <WarningOutlined style={{ color: '#faad14', marginTop: '4px' }} />
                            <Text style={{ fontSize: '12px' }}>
                                Phiếu xuất kho sau khi tạo sẽ ở trạng thái <strong>Chờ ký duyệt</strong>. 
                                Giám sát, PM hoặc Kế toán sẽ duyệt và nhận bàn giao vật tư trên ứng dụng.
                            </Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OutboundForm;
