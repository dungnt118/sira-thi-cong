import React, { useState, useEffect, useCallback } from 'react';
import {
    Card, Table, Button, Space, Typography, Modal, Form, Input,
    Select, InputNumber, Row, Col, Popconfirm, message, Divider, Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalculatorOutlined } from '@ant-design/icons';
import estimateTemplateService from '../../../services/core-contracts/services/estimateTemplate.service';
import materialService from '../../../services/core-contracts/services/material.service';
import type { IEstimateTemplate, IComponentsItem } from '../../../services/core-contracts/types/estimateTemplate.types';
import type { IMaterial } from '../../../services/core-contracts/types/material.types';

const { Text } = Typography;
const { Option } = Select;

const formatVND = (val?: number | null) =>
    val != null
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
        : '—';

/** Tính total_cost_per_unit từ danh sách components */
const computeTotal = (components?: IComponentsItem[]): number =>
    (components ?? []).reduce(
        (sum, c) => sum + (c.quantity_per_unit ?? 0) * (c.unit_price ?? 0),
        0,
    );

export const EstimateTemplateList: React.FC = () => {
    const [templates, setTemplates]           = useState<IEstimateTemplate[]>([]);
    const [loading, setLoading]               = useState(false);
    const [materials, setMaterials]           = useState<IMaterial[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<IEstimateTemplate | null>(null);
    const [submitting, setSubmitting]         = useState(false);
    const [liveTotal, setLiveTotal]           = useState<number>(0);
    const [form] = Form.useForm();

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        try {
            const res = await estimateTemplateService.queryContent({
                sorted: [{ id: 'code', desc: false }],
            });
            setTemplates(res.data || []);
        } catch {
            message.error('Không thể tải danh sách mẫu dự toán');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMaterials = useCallback(async () => {
        try {
            const res = await materialService.queryContent({
                sorted: [{ id: 'name', desc: false }],
            });
            setMaterials(res.data || []);
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        fetchTemplates();
        fetchMaterials();
    }, [fetchTemplates, fetchMaterials]);

    /** Tính lại liveTotal mỗi khi form values thay đổi */
    const handleValuesChange = (_: any, allValues: any) => {
        setLiveTotal(computeTotal(allValues.components ?? []));
    };

    const handleOpenModal = (record?: IEstimateTemplate) => {
        if (record) {
            setEditingTemplate(record);
            form.setFieldsValue(record);
            setLiveTotal(
                record.total_cost_per_unit ?? computeTotal(record.components),
            );
        } else {
            setEditingTemplate(null);
            form.resetFields();
            form.setFieldsValue({ components: [] });
            setLiveTotal(0);
        }
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await estimateTemplateService.deleteEstimateTemplate(id);
            message.success('Đã xóa mẫu dự toán');
            fetchTemplates();
        } catch {
            message.error('Không thể xóa mẫu dự toán');
        }
    };

    const handleFinish = async (values: any) => {
        const components: IComponentsItem[] = values.components ?? [];
        const total_cost_per_unit = computeTotal(components);

        const payload = { ...values, total_cost_per_unit };

        setSubmitting(true);
        try {
            if (editingTemplate) {
                await estimateTemplateService.updateEstimateTemplate(editingTemplate._id, payload);
                message.success('Cập nhật mẫu dự toán thành công');
            } else {
                await estimateTemplateService.createEstimateTemplate(payload);
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
            type,
            material_id: undefined,
            name: undefined,
            unit: undefined,
            unit_price: undefined,
            quantity_per_unit: components[index]?.quantity_per_unit,
            calc_mode: components[index]?.calc_mode,
        };
        form.setFieldsValue({ components });
        setLiveTotal(computeTotal(components));
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
                unit_price: (mat as any).unit_cost || 0,
            };
            form.setFieldsValue({ components });
            setLiveTotal(computeTotal(components));
        }
    };

    const columns = [
        {
            title: 'Mã HM',
            dataIndex: 'code',
            key: 'code',
            width: 140,
        },
        {
            title: 'Tên Hạng Mục',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ĐVT',
            dataIndex: 'unit',
            key: 'unit',
            width: 70,
        },
        {
            title: 'Tổng chi phí / ĐVT',
            key: 'total_cost_per_unit',
            width: 170,
            align: 'right' as const,
            render: (_: any, record: IEstimateTemplate) => {
                // Ưu tiên giá trị đã lưu; fallback tính từ components
                const val =
                    record.total_cost_per_unit != null && record.total_cost_per_unit > 0
                        ? record.total_cost_per_unit
                        : computeTotal(record.components);
                return (
                    <Tag color="blue" style={{ fontWeight: 600, fontSize: 13 }}>
                        {formatVND(val)}
                    </Tag>
                );
            },
        },
        {
            title: 'Thành phần',
            key: 'components',
            render: (_: any, record: IEstimateTemplate) => (
                <Space direction="vertical" size={2}>
                    {record.components?.map((c, idx) => (
                        <Text key={idx} style={{ fontSize: 12 }}>
                            - {c.name}: {c.quantity_per_unit} {c.unit}{' '}
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                ({formatVND(c.unit_price)})
                            </Text>
                        </Text>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            render: (_: any, record: IEstimateTemplate) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
                    <Popconfirm title="Xóa mẫu này?" onConfirm={() => handleDelete(record._id)}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="Cấu hình Dự toán Tiêu chuẩn (Template)"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                    Thêm Mẫu Mới
                </Button>
            }
            className="pm-card"
        >
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                    Xây dựng các bộ định mức vật tư và nhân công chuẩn cho từng Hạng mục thi công, giúp Kỹ thuật viên lên Dự toán nhanh chóng.
                </Text>
            </div>
            <Table
                columns={columns}
                dataSource={templates}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 15 }}
            />

            <Modal
                title={editingTemplate ? 'Sửa Mẫu Dự toán' : 'Thêm Nhanh Mẫu Dự toán'}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => setIsModalVisible(false)}
                okText="Đồng ý"
                cancelText="Hủy"
                confirmLoading={submitting}
                width={960}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="estimate_template_form"
                    onFinish={handleFinish}
                    onValuesChange={handleValuesChange}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Mã Hạng Mục"
                                name="code"
                                rules={[{ required: true, message: 'Nhập mã' }]}
                            >
                                <Input placeholder="vd: ET-CT-SAN-PU-3L" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={14}>
                            <Form.Item
                                label="Tên Hạng Mục Thi Công"
                                name="name"
                                rules={[{ required: true, message: 'Nhập tên' }]}
                            >
                                <Input placeholder="vd: Mẫu chống thấm sàn PU 3 lớp" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={4}>
                            <Form.Item
                                label="ĐVT Hạng Mục"
                                name="unit"
                                rules={[{ required: true, message: 'Nhập ĐVT' }]}
                            >
                                <Input placeholder="m², cái, gói..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, marginBottom: 0 }}>
                        <Typography.Title level={5} style={{ marginBottom: 12 }}>
                            Cấu hình Thành phần chi phí (Định mức trên 1 ĐVT)
                        </Typography.Title>

                        <Form.List name="components">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.length > 0 && (
                                        <Row gutter={8} style={{ fontWeight: 600, marginBottom: 6, fontSize: 12, color: '#555' }}>
                                            <Col span={4}>Loại chi phí</Col>
                                            <Col span={7}>Tên Vật tư / Nhân công</Col>
                                            <Col span={3}>ĐVT Comp</Col>
                                            <Col span={4}>Định mức/1 ĐVT</Col>
                                            <Col span={5}>Đơn giá hệ thống</Col>
                                            <Col span={1} />
                                        </Row>
                                    )}
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row gutter={8} key={key} align="middle" style={{ marginBottom: 8 }}>
                                            <Col span={4}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'type']}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Select onChange={(val) => handleComponentTypeChange(val, name)}>
                                                        <Option value="material">Vật tư</Option>
                                                        <Option value="labor">Nhân công</Option>
                                                        <Option value="other">Phí khác</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={7}>
                                                <Form.Item
                                                    shouldUpdate={(prev, curr) =>
                                                        prev.components?.[name]?.type !== curr.components?.[name]?.type
                                                    }
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    {() => {
                                                        const type = form.getFieldValue(['components', name, 'type']);
                                                        if (type === 'material') {
                                                            return (
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'material_id']}
                                                                    style={{ marginBottom: 0 }}
                                                                    rules={[{ required: true, message: 'Chọn vật tư' }]}
                                                                >
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Chọn vật tư..."
                                                                        onChange={(val) => handleMaterialChange(val, name)}
                                                                        filterOption={(input, option: any) =>
                                                                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                    >
                                                                        {materials.map(m => (
                                                                            <Option key={m._id} value={m._id}>
                                                                                {m.name} ({m.code})
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                            );
                                                        }
                                                        return (
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'name']}
                                                                style={{ marginBottom: 0 }}
                                                                rules={[{ required: true, message: 'Nhập tên' }]}
                                                            >
                                                                <Input placeholder="Tên nhân công / phí..." />
                                                            </Form.Item>
                                                        );
                                                    }}
                                                </Form.Item>
                                            </Col>
                                            <Col span={3}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'unit']}
                                                    style={{ marginBottom: 0 }}
                                                    rules={[{ required: true, message: 'ĐVT' }]}
                                                >
                                                    <Input placeholder="kg, m², gói..." />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'quantity_per_unit']}
                                                    style={{ marginBottom: 0 }}
                                                    rules={[{ required: true, message: 'Định mức' }]}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        step={0.01}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={5}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'unit_price']}
                                                    style={{ marginBottom: 0 }}
                                                    rules={[{ required: true, message: 'Đơn giá' }]}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={((v: any) => Number(v?.replace(/,/g, '') || 0)) as any}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => {
                                                        remove(name);
                                                        // Recompute after remove
                                                        setTimeout(() => {
                                                            setLiveTotal(computeTotal(form.getFieldValue('components') ?? []));
                                                        }, 0);
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    ))}

                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            type="dashed"
                                            onClick={() => add({ type: 'material', calc_mode: 'package_m2', quantity_per_unit: 1 })}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Thêm thành phần chi phí
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        {/* ── Tổng chi phí / ĐVT (live) ── */}
                        <Divider style={{ margin: '14px 0 10px' }} />
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: '#e6f4ff', border: '1px solid #91caff',
                            borderRadius: 6, padding: '10px 16px',
                        }}>
                            <Space>
                                <CalculatorOutlined style={{ color: '#1677ff' }} />
                                <Text strong style={{ color: '#1677ff' }}>Tổng chi phí / ĐVT (tự tính)</Text>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    = Σ (định mức × đơn giá) cho tất cả thành phần
                                </Text>
                            </Space>
                            <Text strong style={{ fontSize: 18, color: '#cf1322' }}>
                                {formatVND(liveTotal)}
                            </Text>
                        </div>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
};

export default EstimateTemplateList;
