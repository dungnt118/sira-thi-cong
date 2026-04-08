import { AppBrandLogo } from '@/components/common/AppBrandLogo';
import {
    ClockCircleOutlined,
    EnvironmentOutlined,
    InboxOutlined,
    PhoneOutlined,
    SafetyCertificateOutlined,
    SendOutlined,
    ToolOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Divider,
    Form, Input,
    message,
    Row,
    Select,
    Space,
    Typography,
    Upload
} from 'antd';
import React, { useState } from 'react';
import { mockServiceRequests as defaultServiceRequests } from '../../data/mockData';
import { useLocalStorageData } from '../../hooks/useLocalStorageData';
import { demoDataService } from '../../services/core-graphql/localstorage/demoDataService';
import type { ServiceRequest } from '../../types/v3';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const CustomerPortalLanding: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [mockServiceRequests, setMockServiceRequests] = useLocalStorageData<ServiceRequest[]>(
        demoDataService.KEYS.SERVICE_REQUESTS,
        defaultServiceRequests
    );

    const onFinish = (values: any) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newReq: ServiceRequest = {
                id: `sr-${Date.now()}`,
                code: `SR-${Math.floor(1000 + Math.random() * 9000)}`,
                name: values.description || `Yêu cầu từ ${values.fullName}`,
                customerId: 'guest-' + Date.now(),
                customerName: values.fullName,
                pipelineId: 'pipe-01',
                stageId: 'st-01',
                status: 'NEW',
                assignedPmId: 'pm-01',
                assignedPmName: 'Admin',
                createdAt: new Date().toISOString(),
                surveyImages: [],
                moistureReadings: [],
                quotations: []
            };

            setMockServiceRequests([newReq, ...mockServiceRequests]);
            setLoading(false);
            form.resetFields();

            message.success({
                content: (
                    <span>
                        Đã gửi yêu cầu thành công! Mã yêu cầu của bạn là <b>{newReq.code}</b>.
                        Chúng tôi sẽ liên hệ lại trong vòng 2 giờ.
                    </span>
                ),
                duration: 5,
            });
        }, 1500);
    };

    return (
        <div className="portal-container" style={{
            minHeight: '100vh',
            background: '#f8fafc',
            padding: '40px 20px',
            color: '#1e293b',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header / Brand */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <AppBrandLogo size={64} variant="default" />
                </div>
                <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    borderRadius: '20px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    marginBottom: 16
                }}>
                    <Text style={{ color: '#38bdf8', fontWeight: 600, fontSize: 12, letterSpacing: 1 }}>
                        BAC CONSTRUCTION & TECHNOLOGY
                    </Text>
                </div>
                <Title level={1} style={{ color: '#0f172a', margin: 0, fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800 }}>
                    Đặt Dịch vụ <span style={{
                        background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Nhanh chóng</span>
                </Title>
                <Paragraph style={{ color: '#475569', fontSize: 18, marginTop: 12, maxWidth: 600, margin: '12px auto' }}>
                    BAC cam kết mang đến giải pháp thi công chuyên nghiệp, bền vững và minh bạch cho công trình của bạn.
                </Paragraph>
            </div>

            <Row gutter={[40, 40]} justify="center" style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Left Side: Service Info */}
                <Col xs={24} lg={10}>
                    <Space direction="vertical" size={32} style={{ width: '100%' }}>
                        <div className="benefit-item">
                            <Space align="start" size={16}>
                                <div style={{
                                    width: 48, height: 48,
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    borderRadius: 12,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#38bdf8', fontSize: 24
                                }}>
                                    <ClockCircleOutlined />
                                </div>
                                <div>
                                    <Title level={4} style={{ color: '#1e293b', margin: 0 }}>Phản hồi trong 2h</Title>
                                    <Text style={{ color: '#475569' }}>Đội ngũ kỹ thuật sẽ liên hệ tư vấn sơ bộ ngay sau khi nhận yêu cầu.</Text>
                                </div>
                            </Space>
                        </div>

                        <div className="benefit-item">
                            <Space align="start" size={16}>
                                <div style={{
                                    width: 48, height: 48,
                                    background: 'rgba(129, 140, 248, 0.1)',
                                    borderRadius: 12,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#818cf8', fontSize: 24
                                }}>
                                    <SafetyCertificateOutlined />
                                </div>
                                <div>
                                    <Title level={4} style={{ color: '#1e293b', margin: 0 }}>Khảo sát miễn phí</Title>
                                    <Text style={{ color: '#475569' }}>Chúng tôi thực hiện đo đạc, kiểm tra hiện trạng hiện trường hoàn toàn miễn phí.</Text>
                                </div>
                            </Space>
                        </div>

                        <div className="benefit-item">
                            <Space align="start" size={16}>
                                <div style={{
                                    width: 48, height: 48,
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    borderRadius: 12,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#10b981', fontSize: 24
                                }}>
                                    <ToolOutlined />
                                </div>
                                <div>
                                    <Title level={4} style={{ color: '#1e293b', margin: 0 }}>Bảo hành dài hạn</Title>
                                    <Text style={{ color: '#475569' }}>Cam kết chất lượng với chính sách bảo hành lên đến 10 năm tùy hạng mục.</Text>
                                </div>
                            </Space>
                        </div>

                        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <Title level={5} style={{ color: '#1e293b' }}>Hỗ trợ khách hàng</Title>
                            <Paragraph style={{ color: '#475569', marginBottom: 8 }}>
                                <PhoneOutlined /> Hotline: 1900 xxxx (8:00 - 18:00)
                            </Paragraph>
                            <Paragraph style={{ color: '#475569', margin: 0 }}>
                                <EnvironmentOutlined /> Địa chỉ: Tòa nhà SIRA, Quận Bình Thạnh, TP. HCM
                            </Paragraph>
                        </div>
                    </Space>
                </Col>

                {/* Right Side: Booking Form */}
                <Col xs={24} lg={12}>
                    <Card style={{
                        background: '#fff',
                        borderRadius: '24px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
                    }} bodyStyle={{ padding: '32px' }}>
                        <Title level={3} style={{ color: '#1e293b', marginBottom: 24 }}>Thông tin đặt lịch</Title>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label={<Text style={{ color: '#94a3b8' }}>Họ và tên</Text>}
                                        name="fullName"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                                            placeholder="Nguyễn Văn A"
                                            style={{ background: '#fff', border: '1px solid #d1d5db', color: '#1e293b', height: 45 }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label={<Text style={{ color: '#94a3b8' }}>Số điện thoại</Text>}
                                        name="phone"
                                        rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />}
                                            placeholder="09xx xxx xxx"
                                            style={{ background: '#fff', border: '1px solid #d1d5db', color: '#1e293b', height: 45 }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label={<Text style={{ color: '#94a3b8' }}>Dịch vụ quan tâm</Text>}
                                name="serviceType"
                                rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ' }]}
                            >
                                <Select
                                    placeholder="Chọn loại dịch vụ"
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ background: '#fff' }}
                                >
                                    <Option value="chong-tham">Chống thấm chuyên sâu</Option>
                                    <Option value="son-nu">Sơn nước & Trang trí</Option>
                                    <Option value="dien-nuoc">Hệ thống Điện - Nước</Option>
                                    <Option value="cai-tao">Cải tạo trọn gói</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={<Text style={{ color: '#94a3b8' }}>Mô tả yêu cầu</Text>}
                                name="description"
                            >
                                <Input.TextArea
                                    placeholder="VD: Nhà tôi bị thấm sàn mái, diện tích khoảng 50m2..."
                                    rows={4}
                                    style={{ background: '#fff', border: '1px solid #d1d5db', color: '#1e293b' }}
                                />
                            </Form.Item>

                            <Form.Item label={<Text style={{ color: '#94a3b8' }}>Ảnh hiện trạng (tùy chọn)</Text>}>
                                <Dragger
                                    multiple={true}
                                    style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 12 }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined style={{ color: '#38bdf8' }} />
                                    </p>
                                    <p className="ant-upload-text" style={{ color: '#64748b' }}>Kéo thả hoặc nhấp để tải ảnh lên</p>
                                </Dragger>
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                                icon={<SendOutlined />}
                                style={{
                                    height: 54,
                                    borderRadius: 12,
                                    background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    marginTop: 16,
                                    boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.4)'
                                }}
                            >
                                Gửi Yêu Cầu Tư Vấn
                            </Button>

                            <div style={{ textAlign: 'center', marginTop: 24 }}>
                                <Space style={{ color: '#64748b', fontSize: 13 }}>
                                    <SafetyCertificateOutlined />
                                    Bảo mật thông tin khách hàng tuyệt đối
                                </Space>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {/* Micro-animations / Styling via style tag for simplicity in this artifact */}
            <style>{`
                .portal-container .ant-input, .portal-container .ant-select-selector {
                    transition: all 0.3s ease !important;
                    border-radius: 8px !important;
                }
                .portal-container .ant-input:focus, .portal-container .ant-select-focused .ant-select-selector {
                    border-color: #38bdf8 !important;
                    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.1) !important;
                }
                .benefit-item {
                    transition: transform 0.3s ease;
                }
                .benefit-item:hover {
                    transform: translateX(10px);
                }
                .ant-form-item-label label {
                    font-weight: 500;
                    color: #475569 !important;
                }
                .ant-select-dropdown {
                    background-color: #fff !important;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                }
                .ant-select-item {
                    color: #475569 !important;
                }
                .ant-select-item-option-active {
                    background-color: #f1f5f9 !important;
                    color: #1e293b !important;
                }
                .ant-select-item-option-selected {
                    background-color: #e0f2fe !important;
                    color: #0369a1 !important;
                }
            `}</style>
        </div>
    );
};

export default CustomerPortalLanding;
