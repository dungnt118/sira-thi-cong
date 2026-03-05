import React, { useState } from 'react';
import {
    Card, Form, Input, Button, Select, Row, Col, Divider,
    Typography, message, Tag
} from 'antd';
import {
    UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined,
    AimOutlined, ArrowLeftOutlined, SaveOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockCustomers } from '../../../data/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

const DISTRICT_OPTIONS = [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7',
    'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12',
    'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Tân Bình', 'Quận Tân Phú',
    'Quận Phú Nhuận', 'Quận Bình Tân', 'Quận Thủ Đức',
    'Huyện Bình Chánh', 'Huyện Củ Chi', 'Huyện Hóc Môn', 'Huyện Nhà Bè',
];

const CustomerCreate: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const isEdit = !!id && id !== 'new';
    const existing = isEdit ? mockCustomers.find(c => c.id === id) : null;

    // Pre-fill form if editing
    React.useEffect(() => {
        if (existing) {
            form.setFieldsValue({
                fullName: existing.fullName,
                phone: existing.phone,
                email: existing.email,
                address: existing.address,
                district: existing.district,
                city: existing.city,
                notes: existing.notes,
            });
            if (existing.gpsLat && existing.gpsLng) {
                setGps({ lat: existing.gpsLat, lng: existing.gpsLng });
            }
        }
    }, [existing, form]);

    const handleGetGPS = () => {
        // Mock getting GPS
        setGps({ lat: 10.7769 + (Math.random() - 0.5) * 0.05, lng: 106.7009 + (Math.random() - 0.5) * 0.05 });
        message.success('Đã lấy tọa độ GPS thành công');
    };

    const handleSubmit = async (_values: unknown) => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setLoading(false);
        message.success(isEdit ? 'Đã cập nhật khách hàng' : 'Đã thêm khách hàng mới');
        navigate('/pm/crm/customers');
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pm/crm/customers')}>
                    Quay lại
                </Button>
                <div>
                    <Title level={4} style={{ margin: 0 }}>
                        {isEdit ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách hàng mới'}
                    </Title>
                    <Text type="secondary">
                        {isEdit ? `Đang sửa: ${existing?.fullName}` : 'Nhập thông tin khách hàng mới vào hệ thống'}
                    </Text>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ city: 'TP.HCM' }}
            >
                <Row gutter={24}>
                    {/* Left Column: Main Info */}
                    <Col xs={24} lg={14}>
                        <Card title="📋 Thông tin cơ bản" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="fullName"
                                        label="Họ và tên / Tên công ty *"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="VD: Nguyễn Văn A hoặc Công ty TNHH ABC" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại *"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập SĐT' },
                                            { pattern: /^0[0-9]{9}$/, message: 'SĐT không hợp lệ (10 số, bắt đầu bằng 0)' },
                                        ]}
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="0901234567" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="email" label="Email">
                                        <Input prefix={<MailOutlined />} placeholder="email@example.com" size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left">📍 Địa chỉ công trình</Divider>
                            <Form.Item
                                name="address"
                                label="Địa chỉ cụ thể *"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                            >
                                <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, tên đường..." />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="district" label="Quận/Huyện *" rules={[{ required: true }]}>
                                        <Select
                                            placeholder="Chọn quận/huyện"
                                            showSearch
                                            options={DISTRICT_OPTIONS.map(d => ({ value: d, label: d }))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="city" label="Thành phố">
                                        <Select options={[{ value: 'TP.HCM', label: 'TP. Hồ Chí Minh' }]} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* GPS Picker */}
                            <div style={{
                                padding: 16, background: '#f5f8ff', borderRadius: 8,
                                border: '1px dashed #1976D2', marginBottom: 16,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 500 }}>📍 Tọa độ GPS</span>
                                    <Button icon={<AimOutlined />} onClick={handleGetGPS} type="default" size="small">
                                        Lấy vị trí hiện tại
                                    </Button>
                                </div>
                                {gps ? (
                                    <div style={{ marginTop: 8, fontSize: 13 }}>
                                        <Tag color="blue">Lat: {gps.lat.toFixed(5)}</Tag>
                                        <Tag color="blue">Lng: {gps.lng.toFixed(5)}</Tag>
                                        <Text type="success" style={{ marginLeft: 8 }}>✅ Đã xác định</Text>
                                    </div>
                                ) : (
                                    <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                                        Chưa có tọa độ – Nhấn nút để lấy GPS hoặc nhập thủ công
                                    </Text>
                                )}
                            </div>
                        </Card>
                    </Col>

                    {/* Right Column: Status & Notes */}
                    <Col xs={24} lg={10}>
                        <Card title="🎯 Trạng thái CRM" style={{ marginBottom: 16 }}>
                            <Form.Item name="assignedPmId" label="PM phụ trách">
                                <Select
                                    defaultValue="U001"
                                    options={[{ value: 'U001', label: 'Nguyễn Văn PM' }]}
                                    size="large"
                                />
                            </Form.Item>
                        </Card>

                        <Card title="📝 Ghi chú">
                            <Form.Item name="notes">
                                <TextArea
                                    rows={4}
                                    placeholder="Ghi chú nội bộ về khách hàng (yêu cầu đặc biệt, thời gian thuận tiện...)"
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                    <Button size="large" onClick={() => navigate('/pm/crm/customers')}>Hủy</Button>
                    <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} loading={loading}>
                        {isEdit ? 'Lưu thay đổi' : 'Thêm Khách hàng'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CustomerCreate;
