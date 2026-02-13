import React, { useState } from 'react';
import {
    Card, Form, Input, Select, DatePicker, Steps, Button, Row, Col,
    message, InputNumber, Upload, Space, Divider, Typography, Grid,
} from 'antd';
import {
    ArrowLeftOutlined, SaveOutlined, ProjectOutlined, UserOutlined,
    EnvironmentOutlined, TeamOutlined, DollarOutlined, UploadOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const steps = [
    { title: 'Thông tin cơ bản', icon: <ProjectOutlined /> },
    { title: 'Khách hàng & Địa điểm', icon: <EnvironmentOutlined /> },
    { title: 'Phân công & Tài chính', icon: <TeamOutlined /> },
];

const mockCustomers = [
    { id: '1', name: 'Chung cư Sunrise City' },
    { id: '2', name: 'Vinhomes Central Park' },
    { id: '3', name: 'The Manor Bình Thạnh' },
];

const mockContracts = [
    { id: 'c1', code: 'HD-2025-001', name: 'Hợp đồng sửa chữa tầng 5', customerId: '1' },
    { id: 'c2', code: 'HD-2025-002', name: 'Hợp đồng chống thấm', customerId: '1' },
    { id: 'c3', code: 'HD-2025-003', name: 'Bảo trì định kỳ Q1', customerId: '2' },
];

const ProjectCreate: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const availableContracts = mockContracts.filter((c) => c.customerId === selectedCustomer);

    const handleFinish = () => {
        message.success('Dự án đã được tạo thành công!');
        navigate('/pm/projects/all');
    };

    const handleSaveDraft = () => {
        message.info('Đã lưu bản nháp.');
    };

    const renderStep0 = () => (
        <>
            <Card
                title={<Space><ProjectOutlined /> Thông tin dự án</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item
                            name="projectCode"
                            label="Mã dự án"
                            rules={[{ required: true, message: 'Vui lòng nhập mã dự án' }]}
                        >
                            <Input placeholder="VD: DA-2025-001" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item
                            name="projectName"
                            label="Tên dự án"
                            rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}
                        >
                            <Input placeholder="VD: Sửa chữa tầng 5 - Block A" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item
                            name="projectType"
                            label="Loại dự án"
                            rules={[{ required: true, message: 'Vui lòng chọn' }]}
                        >
                            <Select placeholder="Chọn loại dự án">
                                <Option value="internal">Nội bộ</Option>
                                <Option value="outsource">Outsource</Option>
                                <Option value="maintenance">Bảo trì</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item name="priority" label="Mức độ ưu tiên">
                            <Select placeholder="Chọn mức độ">
                                <Option value="high">Cao</Option>
                                <Option value="medium">Trung bình</Option>
                                <Option value="low">Thấp</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item name="endDate" label="Ngày kết thúc">
                            <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="description" label="Mô tả dự án">
                            <TextArea rows={3} placeholder="Mô tả tổng quan về dự án..." />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </>
    );

    const renderStep1 = () => (
        <>
            <Card
                title={<Space><UserOutlined /> Khách hàng</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="customerId"
                            label="Khách hàng"
                            rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
                        >
                            <Select
                                placeholder="Chọn khách hàng"
                                showSearch
                                onChange={(val: string) => {
                                    setSelectedCustomer(val);
                                    form.setFieldValue('contractId', undefined);
                                }}
                            >
                                {mockCustomers.map((c) => (
                                    <Option key={c.id} value={c.id}>{c.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="contractId" label={<Space><FileTextOutlined /> Hợp đồng liên kết</Space>}>
                            <Select
                                placeholder={selectedCustomer ? 'Chọn hợp đồng' : 'Vui lòng chọn khách hàng trước'}
                                disabled={!selectedCustomer}
                                allowClear
                                showSearch
                            >
                                {availableContracts.map((c) => (
                                    <Option key={c.id} value={c.id}>{c.code} – {c.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="contactPerson" label="Người đại diện">
                            <Input placeholder="Tên người liên hệ" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="contactPhone" label="SĐT liên hệ">
                            <Input placeholder="0901-234-567" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card
                title={<Space><EnvironmentOutlined /> Địa điểm thi công</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
                            <Select placeholder="Chọn tỉnh/thành" showSearch>
                                <Option value="hcm">TP. Hồ Chí Minh</Option>
                                <Option value="hn">Hà Nội</Option>
                                <Option value="dn">Đà Nẵng</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item name="district" label="Quận/Huyện">
                            <Select placeholder="Chọn quận/huyện" showSearch>
                                <Option value="q1">Quận 1</Option>
                                <Option value="q7">Quận 7</Option>
                                <Option value="bt">Bình Thạnh</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item name="ward" label="Phường/Xã">
                            <Select placeholder="Chọn phường/xã" showSearch>
                                <Option value="p1">Phường 1</Option>
                                <Option value="p2">Phường 2</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="address" label="Địa chỉ chi tiết" rules={[{ required: true }]}>
                            <Input placeholder="VD: 123 Nguyễn Huệ, Q.1, TP.HCM" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </>
    );

    const renderStep2 = () => (
        <>
            <Card
                title={<Space><TeamOutlined /> Phân công nhân sự</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                        <Form.Item name="managerId" label="Quản lý dự án" rules={[{ required: true }]}>
                            <Select placeholder="Chọn quản lý">
                                <Option value="pm1">Nguyễn Văn A</Option>
                                <Option value="pm2">Trần Thị B</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="supervisorId" label="Giám sát hiện trường">
                            <Select placeholder="Chọn giám sát">
                                <Option value="sv1">Lê Văn C</Option>
                                <Option value="sv2">Phạm Thị D</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="teamMembers" label="Thành viên đội">
                            <Select mode="multiple" placeholder="Chọn thành viên">
                                <Option value="m1">Hoàng Văn E</Option>
                                <Option value="m2">Vũ Minh Tuấn</Option>
                                <Option value="m3">Đỗ Thị Hương</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card
                title={<Space><DollarOutlined /> Tài chính</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={8}>
                        <Form.Item name="estimatedBudget" label="Ngân sách dự kiến (VNĐ)">
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(v) => v?.replace(/,/g, '') as unknown as number}
                                placeholder="500,000,000"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="estimatedRevenue" label="Doanh thu dự kiến (VNĐ)">
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(v) => v?.replace(/,/g, '') as unknown as number}
                                placeholder="700,000,000"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="paymentType" label="Hình thức thanh toán">
                            <Select placeholder="Chọn hình thức">
                                <Option value="milestone">Theo tiến độ</Option>
                                <Option value="monthly">Hàng tháng</Option>
                                <Option value="completion">Khi hoàn thành</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card
                title={<Space><UploadOutlined /> Tài liệu đính kèm</Space>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Upload.Dragger>
                    <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 32, color: '#1890ff' }} /></p>
                    <p className="ant-upload-text">Kéo thả hoặc bấm để tải lên</p>
                    <p className="ant-upload-hint">Hỗ trợ PDF, Word, Excel, Hình ảnh (tối đa 10MB)</p>
                </Upload.Dragger>
            </Card>
        </>
    );

    const stepRenderers = [renderStep0, renderStep1, renderStep2];

    return (
        <div>
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                        {!isMobile && 'Quay lại'}
                    </Button>
                    <Title level={4} style={{ margin: 0 }}>Tạo Dự Án Mới</Title>
                </Space>
                <Space>
                    <Button icon={<SaveOutlined />} onClick={handleSaveDraft}>
                        {!isMobile && 'Lưu nháp'}
                    </Button>
                </Space>
            </Row>

            <Steps
                current={currentStep}
                items={steps}
                style={{ marginBottom: 32 }}
                size={isMobile ? 'small' : 'default'}
                direction={isMobile ? 'vertical' : 'horizontal'}
            />

            <Form form={form} layout="vertical" onFinish={handleFinish}>
                {stepRenderers[currentStep]()}

                <Row justify="space-between" style={{ marginTop: 16 }}>
                    <Button disabled={currentStep === 0} onClick={() => setCurrentStep((s) => s - 1)}>
                        Quay lại
                    </Button>
                    {currentStep < steps.length - 1 ? (
                        <Button type="primary" onClick={() => setCurrentStep((s) => s + 1)}>
                            Tiếp theo
                        </Button>
                    ) : (
                        <Button type="primary" htmlType="submit">
                            Tạo dự án
                        </Button>
                    )}
                </Row>
            </Form>
        </div>
    );
};

export default ProjectCreate;
