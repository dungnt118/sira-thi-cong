import React, { useState } from 'react';
import { Card, Form, Input, Button, Result, Space, Divider, Typography, Tag, Table, Row, Col, InputNumber } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import { mockQuotations } from '../../../data/journeyMockData';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step05QuoteProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step05Quote: React.FC<Step05QuoteProps> = ({ journeyId, isEditable = false, onSave }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const items = Form.useWatch('items', form);

    const quote = mockQuotations.find(q => q.journey_id === journeyId);

    const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
    };

    const columns = [
        { title: 'Tên hạng mục', dataIndex: 'name', key: 'name' },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit' },
        { title: 'Số lượng', dataIndex: 'qty', key: 'qty', align: 'center' as const },
        { title: 'Đơn giá', dataIndex: 'price', key: 'price', align: 'right' as const, render: (val: number) => formatVND(val) },
        { title: 'Thành tiền', dataIndex: 'total', key: 'total', align: 'right' as const, render: (val: number) => formatVND(val) },
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
                    const items = form.getFieldValue('items');
                    form.setFieldsValue({ items: items.filter((_: any, i: number) => i !== index) });
                }} />
            )
        }
    ];

    const renderReadOnly = () => {
        if (!quote) {
            return (
                <Result
                    status="info"
                    title="Chưa có báo giá chính thức"
                    subTitle="Báo giá đang được bộ phận Sale xử lý dựa trên dự toán kỹ thuật."
                />
            );
        }

        return (
            <div style={{ padding: '0 12px' }}>
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
            </div>
        );
    };

    const renderEditable = () => (
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleFinish}
            initialValues={{ items: quote?.items || [] }}
        >
            <Divider orientation="left">Điều chỉnh chi tiết báo giá</Divider>
            <Table 
                dataSource={items || []} 
                columns={editColumns} 
                pagination={false} 
                size="small" 
                bordered
                footer={() => (
                    <Button type="dashed" block icon={<PlusOutlined />} onClick={() => {
                        const items = form.getFieldValue('items') || [];
                        form.setFieldsValue({ items: [...items, { name: '', unit: '', qty: 1, price: 0 }] });
                    }}>
                        Thêm hạng mục mới
                    </Button>
                )}
            />
            
            <Divider />
            <Form.Item label="Ghi chú điều chỉnh / Điều khoản bổ sung" name="notes">
                <TextArea rows={4} placeholder="Nhập ghi chú liên quan đến báo giá này..." />
            </Form.Item>

            <Space style={{ marginTop: 16 }}>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu & Cập nhật tổng tiền</Button>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
            </Space>
        </Form>
    );

    return (
        <Card 
            title={isEditing ? "Thực hiện: Báo giá / Hợp đồng" : "Chi tiết bước: Báo giá / Hợp đồng"} 
            bordered={false} 
            className="ky-card"
            extra={isEditable && (
                <Button 
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Xem lại" : "Cập nhật"}
                </Button>
            )}
        >
            {!isEditable && (
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Bạn đang ở chế độ Chỉ đọc (Chưa có quyền KeyRole hoặc chưa được phân công).</Text>
                </div>
            )}
            {isEditing ? renderEditable() : renderReadOnly()}
        </Card>
    );
};

export default Step05Quote;
