import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Divider, Space, Table, InputNumber, Select, Col, Row, Popconfirm } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined, CalculatorOutlined } from '@ant-design/icons';
import { mockMaterials } from '../../../data/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export interface Step04SolutionProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step04Solution: React.FC<Step04SolutionProps> = ({ journeyId, isEditable = false, onSave }) => {
    const [form] = Form.useForm();
    const [subTotal, setSubTotal] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    // Watch values to calculate totals
    const formValues = Form.useWatch([], form);

    useEffect(() => {
        if (!formValues) return;
        
        let worksTotal = 0;
        let matsTotal = 0;

        const works = formValues.workItems || [];
        works.forEach((item: any) => {
            const qty = item?.quantity || 0;
            const price = item?.unitPrice || 0;
            worksTotal += (qty * price);
        });

        const mats = formValues.materials || [];
        mats.forEach((item: any) => {
            const qty = item?.quantity || 0;
            const price = item?.unitPrice || 0;
            matsTotal += (qty * price);
        });

        const newSubTotal = worksTotal + matsTotal;
        const taxRate = formValues.taxRate ?? 10;
        const newTaxAmount = newSubTotal * (taxRate / 100);
        
        setSubTotal(newSubTotal);
        setTaxAmount(newTaxAmount);
        setGrandTotal(newSubTotal + newTaxAmount);
    }, [formValues]);

    const handleFinish = (values: any) => {
        if (onSave) {
            onSave({ ...values, subTotal, taxAmount, grandTotal });
        }
    };

    const handleMaterialChange = (materialId: string, index: number) => {
        const mat = mockMaterials.find(m => m.id === materialId);
        if (mat) {
            const currentMats = form.getFieldValue('materials') || [];
            currentMats[index] = {
                ...currentMats[index],
                name: mat.name,
                code: mat.code,
                unit: mat.unit,
                unitPrice: mat.unitCost, // Auto-fill price
            };
            form.setFieldsValue({ materials: currentMats });
        }
    };

    // Format currency
    const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    return (
        <Card title="Thực hiện: Xây Dựng Giải pháp & Dự toán" bordered={false} className="ky-card">
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={handleFinish}
                initialValues={{ taxRate: 10, workItems: [{}], materials: [{}] }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Text type="secondary">Kỹ thuật viên điền các hạng mục cần thực hiện và vật tư cần thiết để hệ thống tự động tính toán tổng chi phí dự toán làm cơ sở cho Báo giá.</Text>
                </div>

                <Divider orientation="left">I. Bảng Hạng Mục Thi Công</Divider>
                <Form.List name="workItems">
                    {(fields, { add, remove }) => (
                        <>
                            {/* Header for Desktop View */}
                            {isEditable && fields.length > 0 && (
                                <Row gutter={8} style={{ fontWeight: 'bold', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                                    <Col span={1}>STT</Col>
                                    <Col span={5}>Hạng Mục Thi Công</Col>
                                    <Col span={5}>Cách Thức Thi Công</Col>
                                    <Col span={2}>ĐVT</Col>
                                    <Col span={2}>SL</Col>
                                    <Col span={3}>Đơn Giá (VNĐ)</Col>
                                    <Col span={3}>Thành Tiền</Col>
                                    <Col span={2}>Ghi Chú</Col>
                                    <Col span={1}></Col>
                                </Row>
                            )}
                            {fields.map(({ key, name, ...restField }, index) => (
                                <Row gutter={8} key={key} style={{ marginBottom: 8, alignItems: 'center' }}>
                                    <Col span={1}>{index + 1}</Col>
                                    <Col span={5}>
                                        <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Nhập tên' }]} style={{ marginBottom: 0 }}>
                                            <Input placeholder="Tên hạng mục" readOnly={!isEditable} bordered={isEditable} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item {...restField} name={[name, 'method']} style={{ marginBottom: 0 }}>
                                            <TextArea autoSize={{ minRows: 1, maxRows: 3 }} placeholder="Mô tả cách thức thi công..." readOnly={!isEditable} bordered={isEditable} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Form.Item {...restField} name={[name, 'unit']} style={{ marginBottom: 0 }}>
                                            <Input placeholder="m2/Trọn gói" readOnly={!isEditable} bordered={isEditable} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Form.Item {...restField} name={[name, 'quantity']} style={{ marginBottom: 0 }}>
                                            <InputNumber min={0} style={{ width: '100%' }} disabled={!isEditable} bordered={isEditable} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item {...restField} name={[name, 'unitPrice']} style={{ marginBottom: 0 }}>
                                            <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} disabled={!isEditable} bordered={isEditable} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Text strong>{formatVND((formValues?.workItems?.[index]?.quantity || 0) * (formValues?.workItems?.[index]?.unitPrice || 0))}</Text>
                                    </Col>
                                    <Col span={2}>
                                        <Form.Item {...restField} name={[name, 'note']} style={{ marginBottom: 0 }}>
                                            <Input placeholder="Ghi chú" readOnly={!isEditable} bordered={isEditable} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}>
                                        {isEditable && (
                                            <Popconfirm title="Xóa dòng này?" onConfirm={() => remove(name)}>
                                                <Button type="text" danger icon={<DeleteOutlined />} />
                                            </Popconfirm>
                                        )}
                                    </Col>
                                </Row>
                            ))}
                            {isEditable && (
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                                        Thêm Hạng Mục Thi Công
                                    </Button>
                                </Form.Item>
                            )}
                        </>
                    )}
                </Form.List>

                <Divider orientation="left">II. Bảng Thống Kê Vật Tư</Divider>
                <Form.List name="materials">
                    {(fields, { add, remove }) => (
                        <>
                            {isEditable && fields.length > 0 && (
                                <Row gutter={8} style={{ fontWeight: 'bold', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                                    <Col span={1}>STT</Col>
                                    <Col span={6}>Tên Vật Tư</Col>
                                    <Col span={3}>Mã SP</Col>
                                    <Col span={2}>ĐVT</Col>
                                    <Col span={3}>SL Dùng</Col>
                                    <Col span={4}>Đơn Giá (VNĐ)</Col>
                                    <Col span={4}>Thành Tiền</Col>
                                    <Col span={1}></Col>
                                </Row>
                            )}
                            {fields.map(({ key, name, ...restField }, index) => (
                                <Row gutter={8} key={key} style={{ marginBottom: 8, alignItems: 'center' }}>
                                    <Col span={1}>{index + 1}</Col>
                                    <Col span={6}>
                                        {isEditable ? (
                                            <Form.Item {...restField} name={[name, 'materialId']} rules={[{ required: true, message: 'Chọn' }]} style={{ marginBottom: 0 }}>
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
                                        ) : (
                                            <Form.Item {...restField} name={[name, 'name']} style={{ marginBottom: 0 }}>
                                                <Input readOnly bordered={false} />
                                            </Form.Item>
                                        )}
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item {...restField} name={[name, 'code']} style={{ marginBottom: 0 }}>
                                            <Input readOnly bordered={false} placeholder="Auto" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Form.Item {...restField} name={[name, 'unit']} style={{ marginBottom: 0 }}>
                                            <Input readOnly bordered={false} placeholder="Auto" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true, message: 'Nhập SL' }]} style={{ marginBottom: 0 }}>
                                            <InputNumber min={0} style={{ width: '100%' }} disabled={!isEditable} bordered={isEditable} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item {...restField} name={[name, 'unitPrice']} style={{ marginBottom: 0 }}>
                                            <InputNumber min={0} disabled={!isEditable} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} bordered={isEditable} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Text strong type="success">{formatVND((formValues?.materials?.[index]?.quantity || 0) * (formValues?.materials?.[index]?.unitPrice || 0))}</Text>
                                    </Col>
                                    <Col span={1}>
                                        {isEditable && (
                                            <Popconfirm title="Xóa dòng này?" onConfirm={() => remove(name)}>
                                                <Button type="text" danger icon={<DeleteOutlined />} />
                                            </Popconfirm>
                                        )}
                                    </Col>
                                </Row>
                            ))}
                            {isEditable && (
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                                        Thêm Vật Tư
                                    </Button>
                                </Form.Item>
                            )}
                        </>
                    )}
                </Form.List>

                <Divider orientation="left">III. Tổng Hợp Chi Phí</Divider>
                <div style={{ background: '#fafafa', padding: 24, borderRadius: 8 }}>
                    <Row gutter={[16, 16]}>
                        <Col span={18} style={{ textAlign: 'right' }}><Text strong>Cộng Tiền (Subtotal):</Text></Col>
                        <Col span={6} style={{ textAlign: 'right' }}><Text>{formatVND(subTotal)}</Text></Col>

                        <Col span={18} style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                            <Text strong>Thuế VAT (%):</Text>
                            <Form.Item name="taxRate" style={{ marginBottom: 0, width: 80 }}>
                                <InputNumber min={0} max={100} disabled={!isEditable} />
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}><Text>{formatVND(taxAmount)}</Text></Col>

                        <Col span={24}><Divider style={{ margin: '12px 0' }} /></Col>
                        
                        <Col span={18} style={{ textAlign: 'right' }}>
                            <Title level={4} style={{ margin: 0 }}>Tổng Cộng Thanh Toán:</Title>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Title level={4} type="danger" style={{ margin: 0 }}>{formatVND(grandTotal)}</Title>
                        </Col>
                    </Row>
                </div>

                <Divider />
                <Form.Item label="Ghi chú tổng kết / Khuyến nghị từ Kỹ thuật" name="notes">
                    <TextArea rows={4} placeholder="Nhập ghi chú thêm về phương án kỹ thuật, các lưu ý thi công đặc biệt..." readOnly={!isEditable} />
                </Form.Item>

                {isEditable && (
                    <Space style={{ marginTop: 16 }}>
                        <Button type="primary" htmlType="submit" icon={<CalculatorOutlined />} size="large">
                            Lưu Dự Toán Giải Pháp
                        </Button>
                    </Space>
                )}
            </Form>
        </Card>
    );
};

export default Step04Solution;
