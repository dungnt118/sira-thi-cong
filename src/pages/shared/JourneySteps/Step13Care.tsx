import React from 'react';
import { Card, Form, Input, Button, Result, Space, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export interface Step13CareProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step13Care: React.FC<Step13CareProps> = ({ isEditable = false, onSave }) => {
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
    };

    if (!isEditable) {
        return (
            <Card title="Chi tiết bước: CSKH sau công trình (Sale)" bordered={false} className="ky-card">
                <Result
                    status="info"
                    title="CSKH sau công trình"
                    subTitle="Thông tin chi tiết của bước CSKH sau công trình ở chế độ xem (Readonly)."
                />
            </Card>
        );
    }

    return (
        <Card title="Thực hiện: CSKH sau công trình" bordered={false} className="ky-card">
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

export default Step13Care;
