import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Divider, Typography, Tag, Descriptions, Rate, Row, Col, Image } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined, AuditOutlined, SafetyCertificateOutlined, CameraOutlined, SignatureOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step09AcceptanceProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step09Acceptance: React.FC<Step09AcceptanceProps> = ({ isEditable = false, onSave }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    // Simulated acceptance data (since we don't have a dedicated mockAcceptances yet, we'll derive it)
    const acceptance = {
        date: '2026-03-10',
        supervisor: 'Lê Văn Giám sát',
        customer: 'Ông Nguyễn Văn A',
        rating: 5,
        notes: 'Chất lượng thi công rất tốt, bề mặt sàn phẳng, màu sắc đồng đều. Bàn giao đúng tiến độ.',
        has_warranty_manual: true,
        images: ['https://picsum.photos/300/200?random=10', 'https://picsum.photos/300/200?random=11']
    };

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
    };

    const renderReadOnly = () => {
        return (
            <div style={{ padding: '0 12px' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <SafetyCertificateOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                    <Title level={3} style={{ marginTop: 12 }}>BIÊN BẢN NGHIỆM THU & BÀN GIAO</Title>
                    <Text type="secondary">Ngày hoàn thành: {acceptance.date}</Text>
                </div>

                <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
                    <Descriptions.Item label="Đại diện kỹ thuật" span={1}>{acceptance.supervisor}</Descriptions.Item>
                    <Descriptions.Item label="Đại diện khách hàng" span={1}>{acceptance.customer}</Descriptions.Item>
                    <Descriptions.Item label="Đánh giá chất lượng" span={1}><Rate disabled defaultValue={acceptance.rating} /></Descriptions.Item>
                    <Descriptions.Item label="Sổ bảo hành" span={1}><Tag color="green">Đã bàn giao</Tag></Descriptions.Item>
                    <Descriptions.Item label="Ý kiến khách hàng" span={2}>{acceptance.notes}</Descriptions.Item>
                </Descriptions>

                <Title level={5}><CameraOutlined /> Hình ảnh bàn giao thực tế</Title>
                <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                    {acceptance.images.map((img, i) => (
                        <Col span={12} key={i}>
                            <Image src={img} style={{ borderRadius: 8, width: '100%', height: 200, objectFit: 'cover' }} />
                        </Col>
                    ))}
                </Row>

                <Divider orientation="left"><SignatureOutlined /> Xác nhận chữ ký</Divider>
                <Row gutter={32}>
                    <Col span={12} style={{ textAlign: 'center' }}>
                        <Text strong>Khách hàng ký tên</Text>
                        <div style={{ height: 100, border: '1px dashed #d9d9d9', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                            <Text type="secondary" italic>Đã ký xác nhận điện tử</Text>
                        </div>
                        <Text type="secondary">{acceptance.customer}</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: 'center' }}>
                        <Text strong>Đại diện SIRA ký tên</Text>
                        <div style={{ height: 100, border: '1px dashed #d9d9d9', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                            <Text type="secondary" italic>Đã ký xác nhận điện tử</Text>
                        </div>
                        <Text type="secondary">{acceptance.supervisor}</Text>
                    </Col>
                </Row>

                <div style={{ marginTop: 40, textAlign: 'center' }}>
                    <Button type="primary" icon={<AuditOutlined />}>Tải Biên Bản Nghiệm Thu (PDF)</Button>
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
            title={isEditing ? "Thực hiện: Nghiệm thu / Bàn giao" : "Chi tiết bước: Nghiệm thu / Bàn giao"} 
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

export default Step09Acceptance;
