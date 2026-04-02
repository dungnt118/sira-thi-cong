import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Divider, Typography, Statistic, Row, Col, Timeline } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import { HeartOutlined, SmileOutlined, MessageOutlined, StarFilled, CustomerServiceOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step13CareProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step13Care: React.FC<Step13CareProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    console.log(`Rendering Step13Care for journey: ${journeyId}`);
    const [isEditing, setIsEditing] = useState(false);

    // Simulated care data
    const careData = {
        last_contact: '2026-03-15',
        status: 'satisfied',
        nps_score: 9,
        feedback: 'Rất hài lòng với thái độ phục vụ của nhân viên kỹ thuật. Sàn nhà sau khi thi công rất đẹp.',
        activities: [
            { date: '2026-03-11', type: 'Call', content: 'Gọi điện thăm hỏi sau bàn giao 24h. Khách hàng phản hồi tốt.' },
            { date: '2026-03-15', type: 'Survey', content: 'Gửi link khảo sát mức độ hài lòng. Điểm NPS: 9/10.' }
        ]
    };

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
    };

    const renderReadOnly = () => {
        return (
            <div style={{ padding: '0 12px' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <SmileOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
                    <Title level={3} style={{ marginTop: 12 }}>CHĂM SÓC & PHẢN HỒI</Title>
                    <Text type="secondary">Cập nhật lần cuối: {careData.last_contact}</Text>
                </div>

                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={12}>
                        <Card size="small" style={{ textAlign: 'center', background: '#fff1f0' }}>
                            <Statistic title="Điểm NPS" value={careData.nps_score} suffix="/ 10" prefix={<StarFilled style={{ color: '#ffcd3c' }} />} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" style={{ textAlign: 'center', background: '#f6ffed' }}>
                            <Statistic title="Trạng thái" value="Hài lòng" prefix={<SmileOutlined style={{ color: '#52c41a' }} />} />
                        </Card>
                    </Col>
                </Row>

                <Title level={5}><MessageOutlined /> Ý kiến phản hồi của khách hàng</Title>
                <div style={{ padding: 16, background: '#fafafa', borderRadius: 8, borderLeft: '4px solid #1890ff', marginBottom: 24 }}>
                    <Text italic>"{careData.feedback}"</Text>
                </div>

                <Title level={5}><CustomerServiceOutlined /> Nhật ký chăm sóc</Title>
                <Timeline mode="left">
                    {careData.activities.map((act, i) => (
                        <Timeline.Item key={i} label={act.date}>
                            <Text strong>[{act.type}]</Text> {act.content}
                        </Timeline.Item>
                    ))}
                </Timeline>

                <div style={{ marginTop: 32, textAlign: 'center' }}>
                    <Button type="dashed" icon={<HeartOutlined />}>Gửi quà tặng tri ân</Button>
                </div>
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
            title={isEditing ? "Thực hiện: Chăm sóc khách hàng" : "Chi tiết bước: Chăm sóc khách hàng"} 
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

export default Step13Care;

