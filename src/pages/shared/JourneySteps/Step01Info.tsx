import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Space, Typography, Row, Col, Descriptions, Tag, message } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined, UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import { mockJourneys } from '../../../data/journeyMockData';
import { mockCustomers, mockServiceRequests } from '../../../data/mockData';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step01InfoProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step01Info: React.FC<Step01InfoProps> = ({ journeyId, isEditable = false, onSave }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [customerData, setCustomerData] = useState<any>(null);

    useEffect(() => {
        // Find journey -> service request -> customer
        const journey = mockJourneys.find(j => j.id === journeyId);
        if (journey) {
            const sr = mockServiceRequests.find(s => s.code === journey.service_request_code);
            if (sr) {
                const customer = mockCustomers.find(c => c.id === sr.customerId);
                if (customer) {
                    setCustomerData(customer);
                    form.setFieldsValue(customer);
                }
            }
        }
    }, [journeyId, form]);

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setCustomerData({ ...customerData, ...values });
        setIsEditing(false);
        message.success('Cập nhật thông tin khách hàng thành công');
    };

    const renderReadOnly = () => {
        if (!customerData) return <div style={{ padding: 20, textAlign: 'center' }}><Text type="secondary">Không tìm thấy thông tin khách hàng</Text></div>;

        return (
            <div style={{ padding: '0 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    </div>
                    <div>
                        <Title level={4} style={{ margin: 0 }}>{customerData.fullName}</Title>
                        <Tag color="cyan">{customerData.code}</Tag>
                    </div>
                </div>

                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label={<span><PhoneOutlined /> Điện thoại</span>}>
                        <Text strong>{customerData.phone}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span><MailOutlined /> Email</span>}>
                        {customerData.email || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span><HomeOutlined /> Địa chỉ</span>} span={2}>
                        {customerData.address}, {customerData.district}, {customerData.city}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người phụ trách">
                        {customerData.assignedPmName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {customerData.createdAt}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú nghiệp vụ" span={2}>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{customerData.notes || 'Chưa có ghi chú'}</div>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        );
    };

    const renderEditable = () => (
        <Form form={form} layout="vertical" onFinish={handleFinish} style={{ padding: '0 12px' }}>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="090..." />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Email" name="email">
                        <Input prefix={<MailOutlined />} placeholder="abc@email.com" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Mã khách hàng" name="code">
                        <Input disabled placeholder="Tự động" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Địa chỉ" name="address">
                        <Input prefix={<HomeOutlined />} placeholder="Số nhà, đường..." />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Quận/Huyện" name="district">
                        <Input placeholder="Quận 1..." />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Thành phố" name="city">
                        <Input placeholder="TP.HCM..." />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Ghi chú nghiệp vụ" name="notes">
                        <TextArea rows={4} placeholder="Nhập các lưu ý đặc biệt về khách hàng này..." />
                    </Form.Item>
                </Col>
            </Row>
            
            <Space style={{ marginTop: 24, width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setIsEditing(false)}>Hủy bỏ</Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu thông tin</Button>
            </Space>
        </Form>
    );

    return (
        <Card 
            title={isEditing ? "Cập nhật: Thông tin khách hàng" : "Hồ sơ: Thông tin khách hàng"} 
            bordered={false} 
            className="ky-card"
            extra={isEditable && (
                <Button 
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Xem lại" : "Chỉnh sửa"}
                </Button>
            )}
        >
            {!isEditable && (
                <div style={{ marginBottom: 16 }}>
                    <Tag color="warning">Chế độ Chỉ đọc</Tag>
                    <Text type="secondary" style={{ marginLeft: 8 }}>Bạn không có quyền chỉnh sửa thông tin này.</Text>
                </div>
            )}
            {isEditing ? renderEditable() : renderReadOnly()}
        </Card>
    );
};

export default Step01Info;
