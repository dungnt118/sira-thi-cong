import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Space, Typography, Modal, Form, Input, Select, InputNumber, Row, Col, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import estimateTemplateService from '../../../services/core-contracts/services/estimateTemplate.service';
import materialService from '../../../services/core-contracts/services/material.service';
import { IEstimateTemplate } from '../../../services/core-contracts/types/estimateTemplate.types';
import { IMaterial } from '../../../services/core-contracts/types/material.types';

// Extended type to support components which might not be in the auto-generated types yet
interface IEstimateTemplateExtended extends IEstimateTemplate {
    components?: {
        type: 'material' | 'labor' | 'other';
        material_id?: string;
        name?: string;
        unit?: string;
        quantity_per_unit?: number;
        unit_price?: number;
        calc_mode?: string;
    }[];
}

const { Text } = Typography;
const { Option } = Select;

export const EstimateTemplateList: React.FC = () => {
    const [templates, setTemplates] = useState<IEstimateTemplateExtended[]>([]);
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<IMaterial[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<IEstimateTemplateExtended | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        try {
            const res = await estimateTemplateService.queryContent({
                sorted: [{ id: 'code', desc: false }]
            });
            setTemplates(res.data || []);
        } catch (error) {
            console.error('Fetch templates error:', error);
            message.error('Không thể tải danh sách mẫu dự toán');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMaterials = useCallback(async () => {
        try {
            const res = await materialService.queryContent({
                sorted: [{ id: 'name', desc: false }]
            });
            setMaterials(res.data || []);
        } catch (error) {
            console.error('Fetch materials error:', error);
        }
    }, []);

    useEffect(() => {
        fetchTemplates();
        fetchMaterials();
    }, [fetchTemplates, fetchMaterials]);

    const handleOpenModal = (record?: IEstimateTemplate) => {
        if (record) {
            setEditingTemplate(record);
            form.setFieldsValue(record);
        } else {
            setEditingTemplate(null);
            form.resetFields();
            form.setFieldsValue({
                components: []
            });
        }
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await estimateTemplateService.deleteEstimateTemplate(id);
            message.success('Đã xóa mẫu dự toán');
            fetchTemplates();
        } catch (error) {
            message.error('Không thể xóa mẫu dự toán');
        }
    };

    const handleFinish = async (values: any) => {
        setSubmitting(true);
        try {
            if (editingTemplate) {
                await estimateTemplateService.updateEstimateTemplate(editingTemplate._id, values);
                message.success('Cập nhật mẫu dự toán thành công');
            } else {
                await estimateTemplateService.createEstimateTemplate(values);
                message.success('Thêm mới mẫu dự toán thành công');
            }
            setIsModalVisible(false);
            fetchTemplates();
        } catch (error: any) {
            message.error(error.message || 'Thao tác thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const handleComponentTypeChange = (type: string, index: number) => {
        const components = form.getFieldValue('components');
        components[index] = { 
            ...components[index], 
            type, 
            material_id: undefined, 
            name: undefined, 
            unit: undefined, 
            unit_price: undefined 
        };
        form.setFieldsValue({ components });
    };

    const handleMaterialChange = (materialId: string, index: number) => {
        const mat = materials.find(m => m._id === materialId);
        if (mat) {
            const components = form.getFieldValue('components');
            components[index] = {
                ...components[index],
                material_id: mat._id,
                name: mat.name,
                unit: mat.unit,
                unit_price: mat.unit_cost || 0
            };
            form.setFieldsValue({ components });
        }
    };

    const formatVND = (val?: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

    const columns = [
        { title: 'Mã HM', dataIndex: 'code', key: 'code', width: 120 },
        { title: 'Tên Hạng Mục', dataIndex: 'name', key: 'name' },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 80 },
        { 
            title: 'Thành phần', 
            key: 'components',
            render: (_: any, record: IEstimateTemplateExtended) => (
                <Space direction="vertical" size="small">
                    {record.components?.map((c: any, idx: number) => (
                        <Text key={idx} style={{ fontSize: 13 }}>
                            - {c.name}: {c.quantity_per_unit} {c.unit} ({formatVND(c.unit_price)})
                        </Text>
                    ))}
                </Space>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_: any, record: IEstimateTemplate) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
                    <Popconfirm title="Xóa mẫu này?" onConfirm={() => handleDelete(record._id)}>
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
                rowKey="_id" 
                loading={loading}
                pagination={{ pageSize: 15 }} 
            />

            <Modal
                title={editingTemplate ? "Sửa Mẫu Dự toán" : "Thêm Nhanh Mẫu Dự toán"}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={submitting}
                width={900}
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="estimate_template_form" onFinish={handleFinish}>
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
                                            <Col span={3}>ĐVT Comp</Col>
                                            <Col span={4}>Định mức/1 ĐVT</Col>
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
                                                                <Form.Item {...restField} name={[name, 'material_id']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                                                                    <Select 
                                                                        showSearch 
                                                                        placeholder="Chọn vật tư..."
                                                                        onChange={(val) => handleMaterialChange(val, name)}
                                                                        filterOption={(input, option: any) =>
                                                                            ((option?.children as any) || '').toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                    >
                                                                        {materials.map(m => (
                                                                            <Option key={m._id} value={m._id}>{m.name} ({m.code})</Option>
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
                                                <Form.Item {...restField} name={[name, 'quantity_per_unit']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                                                    <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={5}>
                                                <Form.Item {...restField} name={[name, 'unit_price']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                                                    <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}>
                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                            </Col>
                                        </Row>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add({ type: 'material', calc_mode: 'manual' })} block icon={<PlusOutlined />}>
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
