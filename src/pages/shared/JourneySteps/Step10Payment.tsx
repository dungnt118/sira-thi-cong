import React, { useState } from 'react';
import { Card, Form, Input, Button, Result, Space, Divider, Typography, Tag, Table, Row, Col, Statistic, Alert, InputNumber, Select } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import { mockPayments } from '../../../data/journeyMockData';
import { DollarOutlined, CheckCircleFilled, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step10PaymentProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step10Payment: React.FC<Step10PaymentProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const paymentData = mockPayments.find(p => p.journey_id === journeyId);
    const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
        if (onEditStateChange) onEditStateChange(false);
    };

    const milestoneColumns = [
        { 
            title: 'Tên đợt', 
            dataIndex: 'name', 
            render: (_: any, __: any, index: number) => (
                <Form.Item name={['milestones', index, 'name']} style={{ margin: 0 }} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            )
        },
        { 
            title: 'Số tiền', 
            dataIndex: 'amount', 
            render: (_: any, __: any, index: number) => (
                <Form.Item name={['milestones', index, 'amount']} style={{ margin: 0 }}>
                    <InputNumber min={0} style={{ width: '100%' }} formatter={(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                </Form.Item>
            )
        },
        { 
            title: 'Ngày thu', 
            dataIndex: 'paid_at', 
            render: (_: any, __: any, index: number) => (
                <Form.Item name={['milestones', index, 'paid_at']} style={{ margin: 0 }}>
                    <Input placeholder="YYYY-MM-DD" />
                </Form.Item>
            )
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            render: (_: any, __: any, index: number) => (
                <Form.Item name={['milestones', index, 'status']} style={{ margin: 0 }}>
                    <Select options={[
                        { label: 'Đã thu', value: 'paid' },
                        { label: 'Chờ thanh toán', value: 'pending' },
                    ]} />
                </Form.Item>
            )
        },
    ];

    const columns = [
        { title: 'Đợt thanh toán', dataIndex: 'name', key: 'name' },
        { title: 'Số tiền', dataIndex: 'amount', key: 'amount', render: (val: number) => formatVND(val) },
        { title: 'Hạn thanh toán', dataIndex: 'due_date', key: 'due_date' },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (s: string, record: any) => (
                <Tag color={s === 'paid' ? 'success' : 'warning'} icon={s === 'paid' ? <CheckCircleFilled /> : <ClockCircleOutlined />}>
                    {s === 'paid' ? `Đã thu (${record.paid_at})` : 'Chờ thanh toán'}
                </Tag>
            )
        },
    ];

    const renderReadOnly = () => {
        if (!paymentData) {
            return (
                <Result
                    status="info"
                    title="Chưa có dữ liệu quyết toán"
                    subTitle="Thông tin thanh toán cuối cùng sẽ hiển thị sau khi nghiệm thu công trình."
                />
            );
        }

        const totalPaid = paymentData.milestones.filter(m => m.status === 'paid').reduce((sum, m) => sum + m.amount, 0);
        const totalAmount = paymentData.milestones.reduce((sum, m) => sum + m.amount, 0);
        const balance = totalAmount - totalPaid;

        return (
            <div style={{ padding: '0 12px' }}>
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={8}>
                        <Card size="small" style={{ background: '#f6ffed' }}>
                            <Statistic title="Đã thanh toán" value={totalPaid} suffix="đ" valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small" style={{ background: '#fff7e6' }}>
                            <Statistic title="Còn lại" value={balance} suffix="đ" valueStyle={{ color: '#cf1322' }} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic title="Tổng giá trị" value={totalAmount} suffix="đ" />
                        </Card>
                    </Col>
                </Row>

                <Title level={5}><DollarOutlined /> Lịch trình thanh toán chi tiết</Title>
                <Table 
                    dataSource={paymentData.milestones} 
                    columns={columns} 
                    pagination={false} 
                    size="small" 
                    bordered 
                    rowKey="id"
                />

                <Alert 
                    message="Lưu ý quan trọng" 
                    description="Các đợt thanh toán quá hạn sẽ ảnh hưởng đến tiến độ bảo hành định kỳ. Vui lòng hoàn tất nghĩa vụ tài chính đúng hạn."
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    style={{ marginTop: 24 }}
                />
            </div>
        );
    };

    const renderEditable = () => (
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleFinish}
            initialValues={{ milestones: paymentData?.milestones || [] }}
        >
            <Divider orientation="left">Quyết toán lịch trình thanh toán</Divider>
            <Table 
                dataSource={Form.useWatch('milestones', form) || []} 
                columns={milestoneColumns} 
                pagination={false} 
                size="small" 
                bordered
            />
            <Divider />
            <Form.Item label="Ghi chú quyết toán" name="notes">
                <TextArea rows={4} placeholder="Nhập ghi chú liên quan đến việc thanh lý hợp đồng..." />
            </Form.Item>
            <Space style={{ marginTop: 16 }}>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu & Hoàn tất quyết toán</Button>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
            </Space>
        </Form>
    );

    return (
        <Card 
            title={isEditing ? "Thực hiện: Quyết toán / Thanh lý" : "Chi tiết bước: Quyết toán / Thanh lý"} 
            bordered={false} 
            className="ky-card"
            extra={isEditable && (
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

export default Step10Payment;
