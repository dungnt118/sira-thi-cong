import React, { useState } from 'react';
import { Card, Form, Input, Button, Result, Space, Divider, Typography, Tag, Timeline, Alert } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import { mockIncidents } from '../../../data/journeyMockData';
import { SafetyOutlined, WarningOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step12WarrantyProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step12Warranty: React.FC<Step12WarrantyProps> = ({ journeyId, isEditable = false, onSave }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const incidents = mockIncidents.filter(inc => inc.journey_id === journeyId && inc.type === 'warranty');

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
    };

    const renderReadOnly = () => {
        if (incidents.length === 0) {
            return (
                <Result
                    status="info"
                    icon={<SafetyOutlined />}
                    title="Chưa ghi nhận yêu cầu bảo hành"
                    subTitle="Vui lòng liên hệ hotline SIRA nếu có bất kỳ vấn đề gì sau khi bàn giao để được hỗ trợ bảo hành kịp thời."
                />
            );
        }

        return (
            <div style={{ padding: '0 12px' }}>
                <Title level={5}><SafetyOutlined /> Lịch sử yêu cầu Bảo hành / Sửa chữa</Title>
                <Timeline mode="left">
                    {incidents.map((inc) => (
                        <Timeline.Item 
                            key={inc.id} 
                            label={inc.reported_at}
                            color={inc.status === 'resolved' ? 'green' : (inc.priority === 'high' ? 'red' : 'orange')}
                        >
                            <Card size="small" title={inc.title} extra={<Tag color={inc.priority === 'high' ? 'red' : 'blue'}>{inc.priority.toUpperCase()}</Tag>}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Phụ trách: {inc.assigned_to}</Text>
                                        <Tag color={inc.status === 'resolved' ? 'success' : 'processing'}>
                                            {inc.status === 'resolved' ? 'Đã xử lý' : 'Đang xử lý'}
                                        </Tag>
                                    </div>
                                    <Alert 
                                        message="Tình trạng: Đang kiểm tra nguyên nhân. Dự kiến hoàn thành xử lý trong 48h."
                                        type="warning"
                                        showIcon
                                        icon={<WarningOutlined />}
                                        style={{ marginTop: 8 }}
                                    />
                                </Space>
                            </Card>
                        </Timeline.Item>
                    ))}
                </Timeline>

                <Alert 
                    message="Thời hạn bảo hành" 
                    description="Công trình của bạn còn thời hạn bảo hành 18 tháng đối với lỗi kỹ thuật thi công."
                    type="success"
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
            title={isEditing ? "Thực hiện: Bảo hành / Sửa chữa" : "Chi tiết bước: Bảo hành / Sửa chữa"} 
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

export default Step12Warranty;
