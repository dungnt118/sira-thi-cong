import React, { useState } from 'react';
import { Card, Form, Input, Button, Result, Space, Divider, Typography, Tag, Timeline, Alert } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import { mockIncidents } from '../../../data/journeyMockData';
import { ToolOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step11MaintainProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step11Maintain: React.FC<Step11MaintainProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const incidents = mockIncidents.filter(inc => inc.journey_id === journeyId && inc.type === 'maintain');

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
        if (onEditStateChange) onEditStateChange(false);
    };

    const renderReadOnly = () => {
        if (incidents.length === 0) {
            return (
                <Result
                    status="info"
                    icon={<ToolOutlined />}
                    title="Chưa đến kỳ bảo trì"
                    subTitle="Lịch bảo trì định kỳ sẽ được hệ thống tự động nhắc nhở sau 6 tháng kể từ ngày bàn giao."
                />
            );
        }

        return (
            <div style={{ padding: '0 12px' }}>
                <Title level={5}><ToolOutlined /> Lịch sử bảo trì định kỳ</Title>
                <Timeline mode="left">
                    {incidents.map((inc) => (
                        <Timeline.Item 
                            key={inc.id} 
                            label={inc.reported_at}
                            color={inc.status === 'resolved' ? 'green' : 'orange'}
                        >
                            <Card size="small" title={inc.title}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Kỹ thuật: {inc.assigned_to}</Text>
                                        <Tag color={inc.status === 'resolved' ? 'success' : 'processing'}>
                                            {inc.status === 'resolved' ? 'Đã hoàn thành' : 'Đang xử lý'}
                                        </Tag>
                                    </div>
                                    <Text italic>Ghi chú: Đã kiểm tra bề mặt, vệ sinh và lăn lại lớp phủ bảo vệ tại các vị trí tiếp giáp.</Text>
                                </Space>
                            </Card>
                        </Timeline.Item>
                    ))}
                </Timeline>

                <Alert 
                    message="Chính sách bảo trì" 
                    description="SIRA cam kết bảo trì định kỳ miễn phí 2 lần/năm trong 2 năm đầu tiên."
                    type="info"
                    showIcon
                    style={{ marginTop: 24 }}
                />
            </div>
        );
    };

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
            title={isEditing ? "Thực hiện: Bảo trì định kỳ" : "Chi tiết bước: Bảo trì định kỳ"} 
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

export default Step11Maintain;

