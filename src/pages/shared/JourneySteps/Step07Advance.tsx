import React, { useState } from 'react';
import { Card, Form, Input, Button, Result, Space, Divider, Typography, Tag, Table, InputNumber } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import { mockPayments } from '../../../data/journeyMockData';
import { CheckCircleFilled, ClockCircleOutlined, WalletOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step07AdvanceProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step07Advance: React.FC<Step07AdvanceProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
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
            title: 'Hạn thanh toán', 
            dataIndex: 'due_date', 
            render: (_: any, __: any, index: number) => (
                <Form.Item name={['milestones', index, 'due_date']} style={{ margin: 0 }}>
                    <Input placeholder="YYYY-MM-DD" />
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
            render: (s: string) => (
                <Tag color={s === 'paid' ? 'success' : 'warning'} icon={s === 'paid' ? <CheckCircleFilled /> : <ClockCircleOutlined />}>
                    {s === 'paid' ? 'Đã thu tiền' : 'Chờ thanh toán'}
                </Tag>
            )
        },
    ];

    const renderReadOnly = () => {
        if (!paymentData) {
            return (
                <Result
                    status="info"
                    title="Chưa có thông tin tạm ứng"
                    subTitle="Kế hoạch thanh toán sẽ được cập nhật sau khi hợp đồng được ký kết."
                />
            );
        }

        // Only show first milestone for "Advance" step
        const firstMilestone = paymentData.milestones[0];

        return (
            <div style={{ padding: '0 12px' }}>
                <div style={{ marginBottom: 24, textAlign: 'center', background: '#e6f7ff', padding: 20, borderRadius: 8 }}>
                    <WalletOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }} />
                    <Title level={4}>Yêu cầu Tạm ứng: {formatVND(firstMilestone.amount)}</Title>
                    <Text type="secondary">Vui lòng kiểm tra trạng thái thu tiền từ bộ phận Kế toán.</Text>
                </div>

                <Divider orientation="left">Thông tin thanh toán</Divider>
                <Table 
                    dataSource={[firstMilestone]} 
                    columns={columns} 
                    pagination={false} 
                    size="small" 
                    bordered 
                />

                {firstMilestone.status === 'paid' && (
                    <div style={{ marginTop: 16, padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
                        <Text type="success" strong><CheckCircleFilled /> Kế toán xác nhận đã thu đủ tiền cọc vào ngày {firstMilestone.paid_at}.</Text>
                    </div>
                )}
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
            <Divider orientation="left">Điều chỉnh lịch trình thanh toán</Divider>
            <Table 
                dataSource={Form.useWatch('milestones', form) || []} 
                columns={milestoneColumns} 
                pagination={false} 
                size="small" 
                bordered
            />
            <Divider />
            <Form.Item label="Ghi chú thanh toán" name="notes">
                <TextArea rows={4} placeholder="Nhập ghi chú hoặc yêu cầu thanh toán cụ thể..." />
            </Form.Item>
            <Space style={{ marginTop: 16 }}>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu kế hoạch thanh toán</Button>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
            </Space>
        </Form>
    );

    return (
        <Card 
            title={isEditing ? "Thực hiện: Tạm ứng / Đặt cọc" : "Chi tiết bước: Tạm ứng / Đặt cọc"} 
            variant="borderless" 
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

export default Step07Advance;

