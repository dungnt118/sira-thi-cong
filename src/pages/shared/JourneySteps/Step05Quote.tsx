import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Result, Space, Divider, Typography, Tag, Table, Row, Col, InputNumber } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined, PlusOutlined, DeleteOutlined, CalculatorOutlined } from '@ant-design/icons';

import { mockQuotations, mockEstimates } from '../../../data/journeyMockData';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step05QuoteProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

const Step05Quote: React.FC<Step05QuoteProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const quote = mockQuotations.find(q => q.journey_id === journeyId);
    const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    // Sync form values when quote changes or mode changes
    useEffect(() => {
        if (quote) {
            form.setFieldsValue({
                items: quote.items || [],
                notes: (quote as any).notes || ''
            });
        }
    }, [quote, isEditing, form]);

    const handleSyncWithEstimates = () => {
        const estimate = mockEstimates.find(e => e.journey_id === journeyId);
        if (!estimate) return;

        const aggregated: Record<string, any> = {};
        (estimate.groups || []).forEach(group => {
            (group.components || []).forEach(comp => {
                const key = `${comp.name}_${comp.unit}`;
                if (aggregated[key]) {
                    aggregated[key].qty += comp.quantity || 0;
                } else {
                    aggregated[key] = {
                        name: comp.name,
                        unit: comp.unit,
                        qty: comp.quantity || 0,
                        price: comp.unitPrice || 0,
                    };
                }
            });
        });

        const syncItems = Object.values(aggregated).map((item, idx) => ({
            ...item,
            key: `sync-${idx + 1}-${Date.now()}`,
        }));

        form.setFieldsValue({ items: syncItems });
    };

    const handleFinish = (values: any) => {
        // Calculate final totals before saving
        const items = values.items || [];
        let subtotal = 0;
        items.forEach((item: any) => {
            subtotal += (item.qty || 0) * (item.price || 0);
        });
        const tax = Math.round(subtotal * 0.1);
        
        const processedValues = {
            ...values,
            total_amount: subtotal,
            tax_amount: tax,
            grand_total: subtotal + tax
        };

        if (onSave) onSave(processedValues);
        setIsEditing(false);
        if (onEditStateChange) onEditStateChange(false);
    };

    const columns = [
        { title: 'Tên hạng mục', dataIndex: 'name', key: 'name' },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit' },
        { title: 'Số lượng', dataIndex: 'qty', key: 'qty', align: 'center' as const },
        { title: 'Đơn giá', dataIndex: 'price', key: 'price', align: 'right' as const, render: (val: number) => formatVND(val) },
        { title: 'Thành tiền', dataIndex: 'total', key: 'total', align: 'right' as const, render: (_: any, record: any) => formatVND((record.qty || 0) * (record.price || 0)) },
    ];

    const editColumns = [
        { 
            title: 'Tên hạng mục', 
            dataIndex: 'name', 
            key: 'name',
            render: (_: any, __: any, index: number) => (
                <Form.Item name={['items', index, 'name']} style={{ margin: 0 }} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            )
        },
        { 
            title: 'ĐVT', 
            dataIndex: 'unit', 
            key: 'unit',
            width: 100,
            render: (_: any, __: any, index: number) => (
                <Form.Item name={['items', index, 'unit']} style={{ margin: 0 }}>
                    <Input />
                </Form.Item>
            )
        },
        { 
            title: 'SL', 
            dataIndex: 'qty', 
            key: 'qty',
            width: 80,
            render: (_: any, __: any, index: number) => (
                <Form.Item name={['items', index, 'qty']} style={{ margin: 0 }}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
            )
        },
        { 
            title: 'Đơn giá', 
            dataIndex: 'price', 
            key: 'price',
            width: 150,
            render: (_: any, __: any, index: number) => (
                <Form.Item name={['items', index, 'price']} style={{ margin: 0 }}>
                    <InputNumber min={0} step={1000} style={{ width: '100%' }} formatter={(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                </Form.Item>
            )
        },
        {
            title: '',
            key: 'action',
            width: 50,
            render: (_: any, __: any, index: number) => (
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
                    const items = form.getFieldValue('items') || [];
                    form.setFieldsValue({ items: items.filter((_: any, i: number) => i !== index) });
                }} />
            )
        }
    ];

    return (
        <Card 
            title={isEditing ? "Thực hiện: Báo giá / Hợp đồng" : "Chi tiết bước: Báo giá / Hợp đồng"} 
            bordered={false} 
            className="ky-card"
            extra={isEditable && (
                <Space>
                    {isEditing && (
                        <Button 
                            type="primary" 
                            ghost 
                            icon={<CalculatorOutlined />} 
                            onClick={handleSyncWithEstimates}
                        >
                            Tổng hợp từ dự toán
                        </Button>
                    )}
                    <Button 
                        type={isEditing ? "default" : "primary"}
                        icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                        onClick={() => {
                            const newEdit = !isEditing;
                            setIsEditing(newEdit);
                            if (onEditStateChange) onEditStateChange(newEdit);
                        }}
                    >
                        {isEditing ? "Xem lại" : "Cập nhật"}
                    </Button>
                </Space>
            )}
        >
            {!isEditable && (
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Bạn đang ở chế độ Chỉ đọc (Chưa có quyền KeyRole hoặc chưa được phân công).</Text>
                </div>
            )}
            
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={handleFinish}
            >
                {isEditing ? (
                    <>
                        <Divider orientation="left">Điều chỉnh chi tiết báo giá</Divider>
                        
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const items = getFieldValue('items') || [];
                                let subtotal = 0;
                                items.forEach((item: any) => {
                                    subtotal += (item.qty || 0) * (item.price || 0);
                                });
                                const tax = Math.round(subtotal * 0.1);
                                const grandTotal = subtotal + tax;

                                return (
                                    <>
                                        <Table 
                                            dataSource={items} 
                                            columns={editColumns} 
                                            pagination={false} 
                                            size="small" 
                                            bordered
                                            rowKey={(record, index) => record?.key || `edit-${index}`}
                                            footer={() => (
                                                <div>
                                                    <Button type="dashed" block icon={<PlusOutlined />} onClick={() => {
                                                        const currentItems = form.getFieldValue('items') || [];
                                                        form.setFieldsValue({ 
                                                            items: [...currentItems, { name: '', unit: '', qty: 1, price: 0, key: `new-${Date.now()}` }] 
                                                        });
                                                    }}>
                                                        Thêm hạng mục mới
                                                    </Button>
                                                    <div style={{ textAlign: 'right', marginTop: 16, padding: '0 12px' }}>
                                                        <Row gutter={16}>
                                                            <Col span={20}><Text strong>Cộng tiền hàng:</Text></Col>
                                                            <Col span={4}>{formatVND(subtotal)}</Col>
                                                            <Col span={20}><Text strong>Thuế VAT (10%):</Text></Col>
                                                            <Col span={4}>{formatVND(tax)}</Col>
                                                            <Col span={20}><Title level={5}>Tổng cộng thanh toán:</Title></Col>
                                                            <Col span={4}><Title level={5} type="danger">{formatVND(grandTotal)}</Title></Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </>
                                );
                            }}
                        </Form.Item>
                        
                        <Divider />
                        <Form.Item label="Ghi chú điều chỉnh / Điều khoản bổ sung" name="notes">
                            <TextArea rows={4} placeholder="Nhập ghi chú liên quan đến báo giá này..." />
                        </Form.Item>

                        <Space style={{ marginTop: 16 }}>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu báo giá & Chốt tổng tiền</Button>
                            <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                        </Space>
                    </>
                ) : (
                    <div style={{ padding: '0 12px' }}>
                        {!quote ? (
                            <Result
                                status="info"
                                title="Chưa có báo giá chính thức"
                                subTitle="Báo giá đang được bộ phận Sale xử lý dựa trên dự toán kỹ thuật."
                            />
                        ) : (
                            <>
                                <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Space size="large">
                                        <div>
                                            <Text type="secondary">Trạng thái:</Text> <Tag color="blue">{quote.status.toUpperCase()}</Tag>
                                        </div>
                                        <div>
                                            <Text type="secondary">Tổng giá trị:</Text> <Text strong type="danger">{formatVND(quote.grand_total)}</Text>
                                        </div>
                                    </Space>
                                </div>

                                <Table 
                                    dataSource={quote.items} 
                                    columns={columns} 
                                    pagination={false} 
                                    size="small" 
                                    bordered
                                    rowKey="key"
                                    footer={() => (
                                        <div style={{ textAlign: 'right' }}>
                                            <Row gutter={16}>
                                                <Col span={20}><Text strong>Cộng tiền hàng:</Text></Col>
                                                <Col span={4}>{formatVND(quote.total_amount)}</Col>
                                                <Col span={20}><Text strong>Thuế VAT (10%):</Text></Col>
                                                <Col span={4}>{formatVND(quote.tax_amount)}</Col>
                                                <Col span={20}><Title level={5}>Tổng cộng thanh toán:</Title></Col>
                                                <Col span={4}><Title level={5} type="danger">{formatVND(quote.grand_total)}</Title></Col>
                                            </Row>
                                        </div>
                                    )}
                                />

                                <Divider />
                                <div style={{ textAlign: 'center' }}>
                                    <Text type="secondary">Báo giá này có hiệu lực trong vòng 15 ngày kể từ ngày phát hành.</Text>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Form>
        </Card>
    );
};

export default Step05Quote;
