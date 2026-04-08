import React, { useState } from 'react';
import {
    Card, Form, Input, Button, Select, Row, Col, Divider,
    Typography, message, Tag
} from 'antd';
import {
    UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined,
    AimOutlined, ArrowLeftOutlined, SaveOutlined, ProfileOutlined,
    CheckCircleOutlined, SolutionOutlined, FileTextOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { customerService } from '../../../services/core-contracts/services/customer.service';
import type { ICustomer, ICreateCustomerInput } from '../../../services/core-contracts/types/customer.types';

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
    const [initialLoading, setInitialLoading] = useState(false);
    const [existing, setExisting] = useState<ICustomer | null>(null);

    const isEdit = !!id && id !== 'new';

    const fetchExisting = async () => {
        if (!isEdit || !id) return;
        setInitialLoading(true);
        try {
            const res = await customerService.findCustomerDto(id);
            if (res) {
                setExisting(res);
                form.setFieldsValue({
                    fullName: res.full_name,
                    phone: res.phone,
                    email: res.email,
                    address: res.address,
                    district: res.district,
                    city: res.city,
                    notes: res.notes,
                    assignedPmId: res.assigned_pm_id,
                });
                // Handle GPS if available in res.geo
            }
        } catch (error) {
            console.error('Failed to fetch customer:', error);
            message.error('Không thể tải thông tin khách hàng');
        } finally {
            setInitialLoading(false);
        }
    };

    React.useEffect(() => {
        fetchExisting();
    }, [id]);

    const handleGetGPS = () => {
        // Mock getting GPS
        setGps({ lat: 10.7769 + (Math.random() - 0.5) * 0.05, lng: 106.7009 + (Math.random() - 0.5) * 0.05 });
        message.success('Đã lấy tọa độ GPS thành công');
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const hide = message.loading(isEdit ? 'Đang cập nhật khách hàng...' : 'Đang thêm khách hàng mới...', 0);
        await new Promise(r => setTimeout(r, 600));

        const customerData: ICreateCustomerInput = {
            full_name: values.fullName,
            phone: values.phone,
            email: values.email,
            address: values.address,
            district: values.district,
            city: values.city,
            notes: values.notes,
            assigned_pm_id: values.assignedPmId,
            // geo: gps ? { type: 'Point', coordinates: [gps.lng, gps.lat] } : undefined
        };

        try {
            if (isEdit && id) {
                await customerService.updateCustomer(id, customerData);
                message.success('Đã cập nhật khách hàng thành công');
            } else {
                await customerService.createCustomer(customerData);
                message.success('Đã thêm khách hàng mới thành công');
            }
            navigate('/admin/ql/crm/customers');
        } catch (error) {
            console.error('Failed to save customer:', error);
            message.error('Không thể lưu thông tin khách hàng');
        } finally {
            hide();
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/ql/crm/customers')}>
                    Quay lại
                </Button>
                <div>
                    <Title level={4} style={{ margin: 0 }}>
                        {isEdit ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách hàng mới'}
                    </Title>
                    <Text type="secondary">
                        {isEdit ? `Đang sửa: ${existing?.full_name}` : 'Nhập thông tin khách hàng mới vào hệ thống'}
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
                        <Card title={<span><ProfileOutlined /> Thông tin cơ bản</span>} style={{ marginBottom: 16 }}>
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

                            <Divider orientation="left"><EnvironmentOutlined /> Địa chỉ công trình</Divider>
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
                                    <span style={{ fontWeight: 500 }}><AimOutlined /> Tọa độ GPS</span>
                                    <Button icon={<AimOutlined />} onClick={handleGetGPS} type="default" size="small">
                                        Lấy vị trí hiện tại
                                    </Button>
                                </div>
                                {gps ? (
                                    <div style={{ marginTop: 8, fontSize: 13 }}>
                                        <Tag color="blue">Lat: {gps.lat.toFixed(5)}</Tag>
                                        <Tag color="blue">Lng: {gps.lng.toFixed(5)}</Tag>
                                        <Text type="success" style={{ marginLeft: 8 }}><CheckCircleOutlined /> Đã xác định</Text>
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
                        <Card title={<span><SolutionOutlined /> Trạng thái CRM</span>} style={{ marginBottom: 16 }}>
                            <Form.Item name="assignedPmId" label="PM phụ trách">
                                <Select
                                    defaultValue="U001"
                                    options={[{ value: 'U001', label: 'Nguyễn Văn PM' }]}
                                    size="large"
                                />
                            </Form.Item>
                        </Card>

                        <Card title={<span><FileTextOutlined /> Ghi chú</span>}>
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
                    <Button size="large" onClick={() => navigate('/admin/ql/crm/customers')}>Hủy</Button>
                    <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} loading={loading}>
                        {isEdit ? 'Lưu thay đổi' : 'Thêm Khách hàng'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CustomerCreate;
