import React, { useState } from 'react';
import { 
    Form, Input, Select, InputNumber, Button, Card, 
    Typography, Space, Row, Col, message,
    Alert, Radio, Table, Tag, Divider
} from 'antd';
import { 
    PlusOutlined, SaveOutlined, ArrowLeftOutlined, 
    InfoCircleOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import { 
    Material, Distributor, StockOrder, 
    StockOrderSource, MaterialType 
} from '../../../types/v3';
import mockMaterials from '../../../data/mock/materials.json';
import mockDistributors from '../../../data/mock/distributors.json';
import { mockProjects } from '../../../data/mockData';

const { Title, Text } = Typography;

const InboundForm: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [sourceType, setSourceType] = useState<StockOrderSource>('DISTRIBUTOR');
    
    const [materials, setMaterials] = useLocalStorageData<Material[]>('MATERIALS', mockMaterials as Material[]);
    const [distributors] = useLocalStorageData<Distributor[]>('DISTRIBUTORS', mockDistributors as Distributor[]);
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

        const newItem = {
            key: Date.now(),
            materialId: material.id,
            materialName: material.name,
            unit: material.unit,
            type: material.type,
            quantity: values.quantity,
            unitCost: values.unitCost || material.unitCost,
            total: (values.quantity * (values.unitCost || material.unitCost)),
            // Fields for fixed assets
            depreciationMonths: values.depreciationMonths,
            assignedTo: values.assignedTo
        };

        setSelectedItems([...selectedItems, newItem]);
        form.setFieldsValue({ materialId: null, quantity: null, unitCost: null });
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
                unitCost: item.unitCost
            })),
            totalValue: selectedItems.reduce((sum, item) => sum + item.total, 0),
            status: 'SIGNED',
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
                // If it's a fixed asset, we might want to update more info but for now just stock
                return {
                    ...m,
                    currentStock: m.currentStock + addedItem.quantity,
                    // Update fixed asset info if applicable
                    fixedAssetInfo: m.type === 'FIXED_ASSET' ? {
                        depreciationMonths: addedItem.depreciationMonths || m.fixedAssetInfo?.depreciationMonths || 24,
                        purchaseDate: newStockOrder.createdAt,
                        condition: 'NEW',
                        assignedTo: addedItem.assignedTo || m.fixedAssetInfo?.assignedTo
                    } : m.fixedAssetInfo
                };
            }
            return m;
        }));

        message.success('Nhập kho thành công');
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
        { title: 'SL', dataIndex: 'quantity', key: 'qty', render: (val: number, record: any) => `${val} ${record.unit}` },
        { title: 'Đơn giá', dataIndex: 'unitCost', key: 'cost', render: (val: number) => val.toLocaleString('vi-VN') + 'đ' },
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
                <Title level={4} style={{ margin: 0 }}>📋 Phiếu Nhập Kho</Title>
            </div>

            <Row gutter={24}>
                <Col span={16}>
                    <Card title="Thông tin mặt hàng" style={{ marginBottom: '24px' }}>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="materialId" label="Chọn vật tư/tài sản">
                                        <Select 
                                            showSearch
                                            placeholder="Gõ mã hoặc tên"
                                            optionFilterProp="children"
                                            onChange={(val) => {
                                                const mat = materials.find(m => m.id === val);
                                                if (mat) form.setFieldsValue({ unitCost: mat.unitCost });
                                            }}
                                        >
                                            {materials.map(m => (
                                                <Select.Option key={m.id} value={m.id}>
                                                    [{m.code}] {m.name} ({m.type === 'FIXED_ASSET' ? 'Tài sản' : 'Vật tư'})
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="quantity" label="Số lượng">
                                        <InputNumber min={0.1} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="unitCost" label="Đơn giá nhập">
                                        <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Conditional fields for Fixed Assets */}
                            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.materialId !== curr.materialId}>
                                {() => {
                                    const mat = materials.find(m => m.id === form.getFieldValue('materialId'));
                                    if (mat?.type === 'FIXED_ASSET') {
                                        return (
                                            <Alert
                                                message="Cấu hình tài sản cố định"
                                                description={
                                                    <Row gutter={16} style={{ marginTop: 8 }}>
                                                        <Col span={12}>
                                                            <Form.Item name="depreciationMonths" label="Thời gian khấu hao (tháng)" initialValue={24}>
                                                                <InputNumber min={1} style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item name="assignedTo" label="Giao cho người quản lý">
                                                                <Select placeholder="Chọn GS/Thợ">
                                                                    <Select.Option value="GS Trần Văn Tuấn">GS Trần Văn Tuấn</Select.Option>
                                                                    <Select.Option value="GS Lê Văn Thái">GS Lê Văn Thái</Select.Option>
                                                                    <Select.Option value="Thợ Trần Văn C">Thợ Trần Văn C</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                }
                                                type="info"
                                                showIcon
                                                style={{ marginBottom: 16 }}
                                            />
                                        );
                                    }
                                    return null;
                                }}
                            </Form.Item>

                            <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddItem}>
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

                <Col span={8}>
                    <Card title="Nguồn nhập & Thông tin chung">
                        <Form form={form} layout="vertical">
                            <Form.Item label="Hình thức nhập">
                                <Radio.Group value={sourceType} onChange={e => setSourceType(e.target.value)}>
                                    <Radio.Button value="DISTRIBUTOR">Từ NPP</Radio.Button>
                                    <Radio.Button value="PROJECT">Từ CT/Dự án</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            {sourceType === 'DISTRIBUTOR' ? (
                                <Form.Item 
                                    name="distributorId" 
                                    label="Nhà phân phối"
                                    rules={[{ required: true, message: 'Vui lòng chọn NPP' }]}
                                >
                                    <Select placeholder="Chọn nhà phân phối">
                                        {distributors.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : (
                                <Form.Item 
                                    name="projectId" 
                                    label="Dự án/Công trình"
                                    rules={[{ required: true, message: 'Vui lòng chọn dự án' }]}
                                >
                                    <Select placeholder="Chọn dự án trả hàng">
                                        {mockProjects.filter(p => p.status === 'COMPLETED' || p.status === 'IN_PROGRESS').map(p => (
                                            <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}

                            <Form.Item name="notes" label="Ghi chú">
                                <Input.TextArea rows={4} placeholder="Ví dụ: Nhập hàng thừa từ công trình Q1, thùng sơn 10L còn 2L..." />
                            </Form.Item>

                            <div style={{ marginTop: '24px', textAlign: 'right' }}>
                                <Space>
                                    <Text strong>Tổng cộng: {selectedItems.reduce((sum, item) => sum + item.total, 0).toLocaleString('vi-VN')}đ</Text>
                                    <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSubmit}>
                                        Hoàn tất nhập kho
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </Card>

                    <Card size="small" style={{ marginTop: '16px', background: '#f5f5f5' }}>
                        <Space align="start">
                            <InfoCircleOutlined style={{ color: '#1890ff', marginTop: '4px' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Lưu ý: Khi nhập hàng thừa từ công trình (VD: 2L từ thùng 10L), hãy nhập số lượng thực tế là 0.2 thùng nếu đơn vị gốc là thùng, hoặc chuyển đổi sang đơn vị lẻ nếu cần.
                            </Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default InboundForm;
