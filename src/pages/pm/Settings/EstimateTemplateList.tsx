import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Modal, Form, Input, Select, InputNumber, Row, Col, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockEstimateTemplates, mockMaterials } from '../../../data/mockData';
import { EstimateTemplate } from '../../../types/v3';

const { Text } = Typography;
const { Option } = Select;

export const EstimateTemplateList: React.FC = () => {
    const [templates, setTemplates] = useState<EstimateTemplate[]>(mockEstimateTemplates);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EstimateTemplate | null>(null);
    const [form] = Form.useForm();

    const handleOpenModal = (record?: EstimateTemplate) => {
        if (record) {
            setEditingTemplate(record);
            form.setFieldsValue(record);
        } else {
            setEditingTemplate(null);
            form.resetFields();
            form.setFieldsValue({
                components: [{ type: 'material' }]
            });
        }
        setIsModalVisible(true);
    };

    const handleDelete = (id: string) => {
        setTemplates(templates.filter(t => t.id !== id));
        message.success('Đã xóa mẫu dự toán');
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            if (editingTemplate) {
                setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, ...values } : t));
                message.success('Cập nhật mẫu dự toán thành công');
            } else {
                const newTemplate = {
                    ...values,
                    id: `EST-TMPL-${Date.now()}`
                };
                setTemplates([...templates, newTemplate]);
                message.success('Thêm mới mẫu dự toán thành công');
            }
            setIsModalVisible(false);
        });
    };

    const handleComponentTypeChange = (type: string, index: number) => {
        const components = form.getFieldValue('components');
        components[index] = { ...components[index], type, itemId: undefined, name: undefined, unit: undefined, unitPrice: undefined };
        form.setFieldsValue({ components });
    };

    const handleMaterialChange = (materialId: string, index: number) => {
        const mat = mockMaterials.find(m => m.id === materialId);
        if (mat) {
            const components = form.getFieldValue('components');
            components[index] = {
                ...components[index],
                itemId: mat.id,
                name: mat.name,
                unit: mat.unit,
                unitPrice: mat.unitCost
            };
            form.setFieldsValue({ components });
        }
    };

    const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const columns = [
        { title: 'Mã HM', dataIndex: 'code', key: 'code', width: 120 },
        { title: 'Tên Hạng Mục', dataIndex: 'name', key: 'name' },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 80 },
        { 
            title: 'Thành phần', 
            key: 'components',
            render: (_: any, record: EstimateTemplate) => (
                <Space direction="vertical" size="small">
                    {record.components.map(c => (
                        <Text key={c.id} style={{ fontSize: 13 }}>
                            - {c.name}: {c.quantityPerUnit} {c.unit} ({formatVND(c.unitPrice)})
                        </Text>
                    ))}
                </Space>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_: any, record: EstimateTemplate) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
                    <Popconfirm title="Xóa mẫu này?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Card title="Cấu hình Dự toán Tiêu chuẩn (Template)" extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm Mẫu Mới</Button>
        } className="pm-card">
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Xây dựng các bộ định mức vật tư và nhân công chuẩn cho từng Hạng mục thi công, giúp Kỹ thuật viên lên Dự toán nhanh chóng.</Text>
            </div>
            <Table 
                columns={columns} 
                dataSource={templates} 
                rowKey="id" 
                pagination={false} 
            />

            <Modal
                title={editingTemplate ? "Sửa Mẫu Dự toán" : "Thêm Nhanh Mẫu Dự toán"}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={900}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="Mã Hạng Mục" name="code" rules={[{ required: true }]}>
                                <Input placeholder="vd: HM-PU-01" />
                            </Form.Item>
                        </Col>
                        <Col span={14}>
                            <Form.Item label="Tên Hạng Mục Thi Công" name="name" rules={[{ required: true }]}>
                                <Input placeholder="vd: Chống thấm sàn mái Polyurethane" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="ĐVT Hạng Mục" name="unit" rules={[{ required: true }]}>
                                <Input placeholder="m², cái, gói..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ background: '#fafafa', padding: 16, borderRadius: 8 }}>
                        <Typography.Title level={5}>Cấu hình Thành phần chi phí (Định mức trên 1 ĐVT)</Typography.Title>
                        <Form.List name="components">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.length > 0 && (
                                        <Row gutter={8} style={{ fontWeight: 'bold', marginBottom: 8 }}>
                                            <Col span={4}>Loại chi phí</Col>
                                            <Col span={7}>Tên Vật tư / Nhân công</Col>
                                            <Col span={3}>ĐVT Component</Col>
                                            <Col span={4}>Hao phí (định mức/1 ĐVT)</Col>
                                            <Col span={5}>Đơn giá hệ thống</Col>
                                            <Col span={1}></Col>
                                        </Row>
                                    )}
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row gutter={8} key={key} style={{ marginBottom: 8 }}>
                                            <Col span={4}>
                                                <Form.Item {...restField} name={[name, 'type']} style={{ marginBottom: 0 }}>
                                                    <Select onChange={(val) => handleComponentTypeChange(val, name)}>
                                                        <Option value="material">Vật tư</Option>
                                                        <Option value="labor">Nhân công</Option>
                                                        <Option value="other">Phí khác</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={7}>
                                                <Form.Item shouldUpdate={(prev, curr) => prev.components?.[name]?.type !== curr.components?.[name]?.type} style={{ marginBottom: 0 }}>
                                                    {() => {
                                                        const type = form.getFieldValue(['components', name, 'type']);
                                                        if (type === 'material') {
                                                            return (
                                                                <Form.Item {...restField} name={[name, 'itemId']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                                                                    <Select 
                                                                        showSearch 
                                                                        placeholder="Chọn vật tư..."
                                                                        onChange={(val) => handleMaterialChange(val, name)}
                                                                        filterOption={(input, option) =>
                                                                            (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                    >
                                                                        {mockMaterials.map(m => (
                                                                            <Option key={m.id} value={m.id}>{m.name} ({m.code})</Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                            );
                                                        }
                                                        return (
                                                            <Form.Item {...restField} name={[name, 'name']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                                                                <Input placeholder="Tên nhân công/phí..." />
                                                            </Form.Item>
                                                        );
                                                    }}
                                                </Form.Item>
                                            </Col>
                                            <Col span={3}>
                                                <Form.Item {...restField} name={[name, 'unit']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                                                    <Input placeholder="kg, công..." />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item {...restField} name={[name, 'quantityPerUnit']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                                                    <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={5}>
                                                <Form.Item {...restField} name={[name, 'unitPrice']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                                                    <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}>
                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                            </Col>
                                        </Row>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add({ type: 'material', id: `C${Date.now()}` })} block icon={<PlusOutlined />}>
                                            Thêm thành phần chi phí
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
};

export default EstimateTemplateList;
