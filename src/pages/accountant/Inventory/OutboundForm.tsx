import React, { useState } from 'react';
import { 
    Form, Input, Select, InputNumber, Button, Card, 
    Typography, Space, Row, Col, message,
    Table, Tag, Empty
} from 'antd';
import { 
    PlusOutlined, SaveOutlined, ArrowLeftOutlined, 
    DeleteOutlined, WarningOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import { 
    Material, StockOrder, MaterialType 
} from '../../../types/v3';
import mockMaterials from '../../../data/mock/materials.json';
import { mockProjects } from '../../../data/mockData';

const { Title, Text } = Typography;

const OutboundForm: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    const [materials, setMaterials] = useLocalStorageData<Material[]>('MATERIALS', mockMaterials as Material[]);
    const [stockOrders, setStockOrders] = useLocalStorageData<StockOrder[]>('STOCK_ORDERS', []);
    
    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    const handleAddItem = () => {
        const values = form.getFieldsValue();
        if (!values.materialId || !values.quantity) {
            message.warning('Vui lòng chọn vật tư và nhập số lượng');
            return;
        }

        const material = materials.find(m => m.id === values.materialId);
        if (!material) return;

        if (values.quantity > material.currentStock) {
            message.error(`Số lượng xuất (${values.quantity} ${material.unit}) vượt quá tồn kho hiện tại (${material.currentStock} ${material.unit})`);
            return;
        }

        const newItem = {
            key: Date.now(),
            materialId: material.id,
            materialName: material.name,
            unit: material.unit,
            type: material.type,
            quantity: values.quantity,
            unitCost: material.unitCost,
            total: (values.quantity * material.unitCost)
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
        if (!formValues.projectId) {
            message.error('Vui lòng chọn dự án tiếp nhận');
            return;
        }
        
        const project = mockProjects.find(p => p.id === formValues.projectId);
        
        const newStockOrder: StockOrder = {
            id: `PX-${Date.now()}`,
            code: `PX-${new Date().getFullYear()}-${(stockOrders.length + 1).toString().padStart(3, '0')}`,
            type: 'OUT',
            projectId: formValues.projectId,
            projectName: project?.name,
            items: selectedItems.map(item => ({
                materialId: item.materialId,
                materialName: item.materialName,
                unit: item.unit,
                quantity: item.quantity,
                unitCost: item.unitCost
            })),
            totalValue: selectedItems.reduce((sum, item) => sum + item.total, 0),
            status: 'PENDING_SIGNATURE',
            createdBy: 'Kế toán Phạm Thị A',
            createdAt: new Date().toISOString().split('T')[0],
            notes: formValues.notes
        };

        // Update Stock Orders
        setStockOrders([newStockOrder, ...stockOrders]);

        // Update Inventory Stocks
        setMaterials(prev => prev.map(m => {
            const addedItem = selectedItems.find(item => item.materialId === m.id);
            if (addedItem) {
                return {
                    ...m,
                    currentStock: m.currentStock - addedItem.quantity
                };
            }
            return m;
        }));

        message.success('Tạo phiếu xuất kho thành công. Chờ thợ ký nhận.');
        navigate('/accountant/inventory');
    };

    const itemColumns = [
        { title: 'Vật tư', dataIndex: 'materialName', key: 'name' },
        { 
            title: 'Loại', 
            dataIndex: 'type', 
            key: 'type',
            render: (type: MaterialType) => (
                <Tag color={type === 'FIXED_ASSET' ? 'purple' : 'blue'}>
                    {type === 'FIXED_ASSET' ? 'CĐ' : 'TH'}
                </Tag>
            )
        },
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
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/accountant/inventory')} style={{ marginRight: '16px' }} />
                <Title level={4} style={{ margin: 0 }}>🚚 Phiếu Xuất Kho</Title>
            </div>

            <Row gutter={24}>
                <Col span={16}>
                    <Card title="Chọn vật tư cấp phát" style={{ marginBottom: '24px' }}>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="materialId" label="Chọn vật tư/tài sản">
                                        <Select 
                                            showSearch
                                            placeholder="Gõ mã hoặc tên"
                                            optionFilterProp="children"
                                        >
                                            {materials.map(m => (
                                                <Select.Option key={m.id} value={m.id} disabled={m.currentStock <= 0}>
                                                    [{m.code}] {m.name} - Tồn: {m.currentStock} {m.unit}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="quantity" label="Số lượng xuất">
                                        <InputNumber min={0.1} style={{ width: '100%' }} />
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
                                name="projectId" 
                                label="Dự án/Công trình tiếp nhận"
                                rules={[{ required: true, message: 'Vui lòng chọn dự án' }]}
                            >
                                <Select placeholder="Chọn dự án">
                                    {mockProjects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'SCHEDULED' || p.status === 'WAITING_MATERIALS').map(p => (
                                        <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
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
                                Phiếu xuất kho sau khi tạo sẽ ở trạng thái <strong>Chờ ký</strong>. 
                                Giám sát hoặc thợ cần ký nhận trên ứng dụng di động để xác nhận đã nhận bàn giao vật tư/tài sản.
                            </Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OutboundForm;
