import React from 'react';
import { Card, Form, Input, Button, Result, Typography, Divider, Space } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface Step05QuoteProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step05Quote: React.FC<Step05QuoteProps> = ({ journeyId, isEditable = false, onSave }) => {
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
    };

    if (!isEditable) {
        return (
            <Card title="Chi tiết bước: Báo giá (Sale)" bordered={false} className="ky-card">
                <Result
                    status="info"
                    title="Báo giá"
                    subTitle="Thông tin chi tiết của bước Báo giá ở chế độ xem (Readonly)."
                />
            </Card>
        );
    }

    return (
        <Card title="Thực hiện: Báo giá" bordered={false} className="ky-card">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Divider orientation="left">Thông tin cơ bản</Divider>
                <Form.Item label="Ghi chú / Đánh giá" name="notes" rules={[{ required: true }]}>
                    <TextArea rows={4} placeholder="Nhập ghi chú hoặc kết quả thực hiện của công việc này..." />
                </Form.Item>
                <Space style={{ marginTop: 16 }}>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu kết quả</Button>
                    <Button>Hủy</Button>
                </Space>
            </Form>
        </Card>
    );
};

export default Step05Quote;
