import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Divider, Space, InputNumber, Select, Col, Row, Popconfirm, Modal, Tag, Table } from 'antd';
import { PlusOutlined, DeleteOutlined, CalculatorOutlined, FileTextOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { mockEstimateTemplates, mockMaterials } from '../../../data/mockData';
import { mockEstimates } from '../../../data/journeyMockData';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export interface Step04SolutionProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step04Solution: React.FC<Step04SolutionProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    const [templateForm] = Form.useForm();
    const [subTotal, setSubTotal] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);

    // Initial load: fetch from mockData if available
    useEffect(() => {
        const existingEstimate = mockEstimates.find(e => e.journey_id === journeyId);
        if (existingEstimate) {
            setInitialData(existingEstimate);
            form.setFieldsValue({
                groups: existingEstimate.groups,
                taxRate: existingEstimate.taxRate,
                notes: existingEstimate.notes
            });
        }
    }, [journeyId, form]);

    // Watch values to calculate totals
    const formValues = Form.useWatch([], form);

    useEffect(() => {
        // Use initialData if not editing or if formValues hasn't been populated yet
        const currentData = isEditing ? formValues : ( (formValues?.groups && formValues.groups.length > 0) ? formValues : initialData);
        if (!currentData) return;
        
        let newSubTotal = 0;

        const groups = currentData.groups || [];
        groups.forEach((group: any) => {
            const components = group?.components || [];
            components.forEach((comp: any) => {
                const qty = comp?.quantity || 0;
                const price = comp?.unitPrice || 0;
                newSubTotal += (qty * price);
            });
        });

        const taxRate = currentData.taxRate ?? 10;
        const newTaxAmount = newSubTotal * (taxRate / 100);
        
        setSubTotal(newSubTotal);
        setTaxAmount(newTaxAmount);
        setGrandTotal(newSubTotal + newTaxAmount);
    }, [formValues, initialData, isEditing]);

    const handleFinish = (values: any) => {
        if (onSave) {
            onSave({ ...values, subTotal, taxAmount, grandTotal });
        }
        setIsEditing(false);
    };

    const handleMaterialChange = (materialId: string, groupName: number, compName: number) => {
        const mat = mockMaterials.find(m => m.id === materialId);
        if (mat) {
            const currentGroups = form.getFieldValue('groups') || [];
            const comps = currentGroups[groupName]?.components || [];
            comps[compName] = {
                ...comps[compName],
                name: mat.name,
                unit: mat.unit,
                unitPrice: mat.unitCost, // Auto-fill price
            };
            currentGroups[groupName].components = comps;
            form.setFieldsValue({ groups: currentGroups });
        }
    };

    const handleAddTemplate = () => {
        templateForm.validateFields().then(values => {
            const template = mockEstimateTemplates.find(t => t.id === values.templateId);
            if (template) {
                const qty = values.quantity || 1;
                const mappedComponents = template.components.map(c => ({
                    type: c.type,
                    itemId: c.itemId,
                    name: c.name,
                    unit: c.unit,
                    quantity: c.quantityPerUnit * qty,
                    unitPrice: c.unitPrice
                }));

                const currentGroups = form.getFieldValue('groups') || [];
                form.setFieldsValue({
                    groups: [...currentGroups, {
                        templateId: template.id,
                        name: template.name,
                        unit: template.unit,
                        quantity: qty,
                        notes: '',
                        components: mappedComponents
                    }]
                });
                
                setTemplateModalOpen(false);
                templateForm.resetFields();
            }
        });
    };

    // Format currency
    const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const getGroupTotal = (groupIndex: number) => {
        let total = 0;
        const comps = formValues?.groups?.[groupIndex]?.components || [];
        comps.forEach((c: any) => {
            total += (c.quantity || 0) * (c.unitPrice || 0);
        });
        return total;
    };

    const renderSummary = () => {
        const currentData = isEditing ? formValues : ( (formValues?.groups && formValues.groups.length > 0) ? formValues : initialData);
        if (!currentData?.groups || currentData.groups.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">Chưa có dữ liệu giải pháp & dự toán được lập.</Text>
                </div>
            );
        }

        return (
            <div>
                {currentData.groups.map((group: any, idx: number) => (
                    <Card key={idx} size="small" type="inner" title={`${idx + 1}. ${group.name}`} style={{ marginBottom: 16 }}>
                        <Table 
                            size="small"
                            pagination={false}
                            dataSource={group.components}
                            rowKey={(_, index) => `${idx}-${index}`}
                            columns={[
                                { title: 'Loại', dataIndex: 'type', render: (t) => <Tag color={t === 'material' ? 'green' : (t === 'labor' ? 'orange' : 'default')}>{t === 'material' ? 'Vật tư' : (t === 'labor' ? 'Nhân công' : 'Phí khác')}</Tag> },
                                { title: 'Tên chi phí', dataIndex: 'name' },
                                { title: 'ĐVT', dataIndex: 'unit' },
                                { title: 'SL', dataIndex: 'quantity' },
                                { title: 'Đơn giá', dataIndex: 'unitPrice', render: (p) => formatVND(p) },
                                { title: 'Thành tiền', key: 'total', align: 'right', render: (_, record: any) => formatVND((record.quantity || 0) * (record.unitPrice || 0)) }
                            ]}
                            footer={() => {
                                let gTotal = 0;
                                (group.components || []).forEach((c: any) => { gTotal += (c.quantity || 0) * (c.unitPrice || 0); });
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {group.notes && (
                                            <div style={{ textAlign: 'left', padding: '4px 8px', background: '#f9f9f9', borderLeft: '3px solid #1890ff' }}>
                                                <Text italic style={{ fontSize: 13 }}><FileTextOutlined /> Ghi chú hạng mục: {group.notes}</Text>
                                            </div>
                                        )}
                                        <div style={{ textAlign: 'right' }}>
                                            <Text strong>Cộng hạng mục: </Text>
                                            <Text type="danger" strong>{formatVND(gTotal)}</Text>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </Card>
                ))}
            </div>
        );
    };

    const displayTaxRate = isEditing ? (formValues?.taxRate ?? 10) : (formValues?.taxRate || initialData?.taxRate || 10);
    const displayNotes = isEditing ? formValues?.notes : (formValues?.notes || initialData?.notes);

    return (
        <Card 
            title={isEditing ? "Thực hiện: Xây Dựng Giải pháp & Dự toán" : "Chi tiết: Giải pháp & Dự toán"} 
            bordered={false} 
            className="ky-card"
            extra={isEditable && (
                <Button 
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Xem lại" : ( (formValues?.groups?.length || initialData?.groups?.length) > 0 ? "Cập nhật" : "Lập dự toán")}
                </Button>
            )}
        >
            {!isEditable && (
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Bạn đang ở chế độ Chỉ đọc (Chưa có quyền KeyRole hoặc chưa được phân công).</Text>
                </div>
            )}

            {isEditing ? (
                <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={handleFinish}
                    initialValues={{ taxRate: 10, groups: [] }}
                >
                    <div style={{ marginBottom: 24 }}>
                        <Text type="secondary">Thêm các hạng mục thi công từ Mẫu Dự Toán chuẩn. Hệ thống sẽ tự động tính toán chi phí vật tư và nhân công tương ứng.</Text>
                    </div>

                    <Form.List name="groups">
                        {(groups, { remove: removeGroup }) => (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {groups.map((groupField, index) => (
                                    <Card 
                                        key={groupField.key} 
                                        size="small" 
                                        type="inner"
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Space>
                                                    <Text strong style={{ fontSize: 16 }}>
                                                        {index + 1}. {formValues?.groups?.[index]?.name || 'Hạng mục mới'}
                                                    </Text>
                                                    <Tag color="blue">{(formValues?.groups?.[index] as any)?.quantity} {(formValues?.groups?.[index] as any)?.unit}</Tag>
                                                </Space>
                                                <Space>
                                                    <Text type="danger" strong>{formatVND(getGroupTotal(index))}</Text>
                                                    <Popconfirm title="Xóa toàn bộ hạng mục này?" onConfirm={() => removeGroup(groupField.name)}>
                                                        <Button danger type="text" icon={<DeleteOutlined />} />
                                                    </Popconfirm>
                                                </Space>
                                            </div>
                                        }
                                    >
                                        <Form.List name={[groupField.name, 'components']}>
                                            {(components, { add: addComp, remove: removeComp }) => (
                                                <>
                                                    {components.length > 0 && (
                                                        <Row gutter={8} style={{ fontWeight: 'bold', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                                                            <Col span={3}>Phân loại</Col>
                                                            <Col span={7}>Tên Chi Phí (Vật tư/Nhân công)</Col>
                                                            <Col span={3}>ĐVT</Col>
                                                            <Col span={3}>SL / Khối lượng</Col>
                                                            <Col span={4}>Đơn Giá (VNĐ)</Col>
                                                            <Col span={3}>Thành Tiền</Col>
                                                            <Col span={1}></Col>
                                                        </Row>
                                                    )}
                                                    {components.map((compField, compIndex) => (
                                                        <Row gutter={8} key={compField.key} style={{ marginBottom: 8, alignItems: 'center' }}>
                                                            <Col span={3}>
                                                                <Form.Item {...compField} name={[compField.name, 'type']} style={{ marginBottom: 0 }}>
                                                                    <Select options={[
                                                                        { label: <Tag color="green">Vật tư</Tag>, value: 'material' },
                                                                        { label: <Tag color="orange">Nhân công</Tag>, value: 'labor' },
                                                                        { label: <Tag color="default">Phí khác</Tag>, value: 'other' },
                                                                    ]} />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={7}>
                                                                {form.getFieldValue(['groups', groupField.name, 'components', compField.name, 'type']) === 'material' ? (
                                                                    <Form.Item {...compField} name={[compField.name, 'itemId']} style={{ marginBottom: 0 }}>
                                                                        <Select 
                                                                            showSearch 
                                                                            placeholder="Chọn vật tư..." 
                                                                            onChange={(val) => handleMaterialChange(val, groupField.name, compField.name)}
                                                                            filterOption={(input, option) =>
                                                                                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                                                            }
                                                                            style={{ width: '100%' }}
                                                                        >
                                                                            {mockMaterials.map(m => (
                                                                                <Option key={m.id} value={m.id}>{m.name} ({m.code})</Option>
                                                                            ))}
                                                                        </Select>
                                                                    </Form.Item>
                                                                ) : (
                                                                    <Form.Item {...compField} name={[compField.name, 'name']} style={{ marginBottom: 0 }}>
                                                                        <Input placeholder="Tên chi phí" />
                                                                    </Form.Item>
                                                                )}
                                                            </Col>
                                                            <Col span={3}>
                                                                <Form.Item {...compField} name={[compField.name, 'unit']} style={{ marginBottom: 0 }}>
                                                                    <Input placeholder="kg, m2..." />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={3}>
                                                                <Form.Item {...compField} name={[compField.name, 'quantity']} style={{ marginBottom: 0 }}>
                                                                    <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={4}>
                                                                <Form.Item {...compField} name={[compField.name, 'unitPrice']} style={{ marginBottom: 0 }}>
                                                                    <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={3}>
                                                                <Text strong type="secondary">
                                                                    {formatVND((formValues?.groups?.[index]?.components?.[compIndex]?.quantity || 0) * (formValues?.groups?.[index]?.components?.[compIndex]?.unitPrice || 0))}
                                                                </Text>
                                                            </Col>
                                                            <Col span={1}>
                                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeComp(compField.name)} />
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                    <div style={{ marginTop: 12 }}>
                                                        <Button type="dashed" size="small" onClick={() => addComp({ type: 'other', unitPrice: 0, quantity: 1 })} icon={<PlusOutlined />}>
                                                            Thêm phí khác
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </Form.List>

                                        <Divider style={{ margin: '16px 0 8px 0' }} />
                                        <Form.Item {...groupField} name={[groupField.name, 'notes']} label={<span><FileTextOutlined /> Ghi chú nội bộ cho Hạng mục này</span>} style={{ marginBottom: 0 }}>
                                            <TextArea rows={2} placeholder="Nhập lưu ý thi công đặc biệt cho hạng mục này..." />
                                        </Form.Item>
                                    </Card>
                                ))}

                                <Button type="dashed" onClick={() => setTemplateModalOpen(true)} block icon={<PlusOutlined />} style={{ height: 50, fontSize: 16 }}>
                                    Thêm Hạng Mục Thi Công (Từ Mẫu)
                                </Button>
                            </div>
                        )}
                    </Form.List>

                    <Divider />
                    <div style={{ background: '#fafafa', padding: 24, borderRadius: 8 }}>
                        <Row gutter={[16, 16]}>
                            <Col span={18} style={{ textAlign: 'right' }}><Text strong>Cộng Tiền (Subtotal):</Text></Col>
                            <Col span={6} style={{ textAlign: 'right' }}><Text>{formatVND(subTotal)}</Text></Col>

                            <Col span={18} style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                                <Text strong>Thuế VAT (%):</Text>
                                <Form.Item name="taxRate" style={{ marginBottom: 0, width: 80 }}>
                                    <InputNumber min={0} max={100} />
                                </Form.Item>
                            </Col>
                            <Col span={6} style={{ textAlign: 'right' }}><Text>{formatVND(taxAmount)}</Text></Col>

                            <Col span={24}><Divider style={{ margin: '12px 0' }} /></Col>
                            
                            <Col span={18} style={{ textAlign: 'right' }}>
                                <Title level={4} style={{ margin: 0 }}>Tổng Dự Toán (Grand Total):</Title>
                            </Col>
                            <Col span={6} style={{ textAlign: 'right' }}>
                                <Title level={4} type="danger" style={{ margin: 0 }}>{formatVND(grandTotal)}</Title>
                            </Col>
                        </Row>
                    </div>

                    <Divider />
                    <Form.Item label="Đánh giá chung / Khuyến nghị kỹ thuật" name="notes">
                        <TextArea rows={4} placeholder="Nhập ghi chú tổng kết toàn bộ phương án kỹ thuật..." />
                    </Form.Item>

                    <Space style={{ marginTop: 16 }}>
                        <Button type="primary" htmlType="submit" icon={<CalculatorOutlined />} size="large">
                            Lưu Dự Toán Giải Pháp
                        </Button>
                        <Button onClick={() => {
                            setIsEditing(false);
                            if (onEditStateChange) onEditStateChange(false);
                        }}>Hủy</Button>
                    </Space>
                </Form>
            ) : (
                <>
                    {renderSummary()}
                    <Divider />
                    <div style={{ background: '#fafafa', padding: 24, borderRadius: 8 }}>
                        <Row gutter={[16, 16]}>
                            <Col span={18} style={{ textAlign: 'right' }}><Text strong>Cộng Tiền (Subtotal):</Text></Col>
                            <Col span={6} style={{ textAlign: 'right' }}><Text>{formatVND(subTotal)}</Text></Col>
                            <Col span={18} style={{ textAlign: 'right' }}><Text strong>Thuế VAT ({displayTaxRate}%):</Text></Col>
                            <Col span={6} style={{ textAlign: 'right' }}><Text>{formatVND(taxAmount)}</Text></Col>
                            <Col span={24}><Divider style={{ margin: '12px 0' }} /></Col>
                            <Col span={18} style={{ textAlign: 'right' }}>
                                <Title level={4} style={{ margin: 0 }}>Tổng Dự Toán:</Title>
                            </Col>
                            <Col span={6} style={{ textAlign: 'right' }}>
                                <Title level={4} type="danger" style={{ margin: 0 }}>{formatVND(grandTotal)}</Title>
                            </Col>
                        </Row>
                    </div>
                    {displayNotes && (
                        <div style={{ marginTop: 24 }}>
                            <Divider orientation="left">Ghi chú tổng kết</Divider>
                            <Text>{displayNotes}</Text>
                        </div>
                    )}
                </>
            )}

            <Modal
                title="Chọn Mẫu Hạng Mục Thi Công"
                open={isTemplateModalOpen}
                onOk={handleAddTemplate}
                onCancel={() => setTemplateModalOpen(false)}
                destroyOnClose
            >
                <Form form={templateForm} layout="vertical" preserve={false}>
                    <Form.Item name="templateId" label="Mẫu Dự Toán" rules={[{ required: true, message: 'Vui lòng chọn 1 mẫu' }]}>
                        <Select placeholder="-- Chọn mẫu tiêu chuẩn --">
                            {mockEstimateTemplates.map(t => (
                                <Option key={t.id} value={t.id}>{t.name} ({t.components.length} thành phần)</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item shouldUpdate={(prev, curr) => prev.templateId !== curr.templateId} noStyle>
                        {() => {
                            const tmplId = templateForm.getFieldValue('templateId');
                            const tmpl = mockEstimateTemplates.find(t => t.id === tmplId);
                            if (!tmpl) return null;
                            return (
                                <Form.Item name="quantity" label={`Khối lượng thi công (${tmpl.unit})`} rules={[{ required: true, message: 'Nhập khối lượng' }]} initialValue={1}>
                                    <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Step04Solution;
