import React, { useState } from 'react';
import { Card, Form, Input, Button, Result, Space, Divider, Typography } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

export interface Step06ContractProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step06Contract: React.FC<Step06ContractProps> = ({ isEditable = false, onSave }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
    };

    const renderReadOnly = () => (
        <Result
            status="info"
            title="Ký kết hợp đồng"
            subTitle="Thông tin chi tiết của bước Ký kết hợp đồng ở chế độ xem (Readonly)."
        />
    );

    const renderEditable = () => (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Divider orientation="left">Thông tin cơ bản</Divider>
            <Form.Item label="Ghi chú / Đánh giá" name="notes" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="Nhập ghi chú hoặc kết quả thực hiện của công việc này..." />
            </Form.Item>
            <Space style={{ marginTop: 16 }}>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu kết quả</Button>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
            </Space>
        </Form>
    );

    return (
        <Card 
            title={isEditing ? "Thực hiện: Ký kết hợp đồng" : "Chi tiết bước: Ký kết hợp đồng"} 
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

export default Step06Contract;
