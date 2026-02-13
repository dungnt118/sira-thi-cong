import React, { useState } from 'react';
import { Card, Tabs, Form, Input, InputNumber, Select, Switch, Button, message, Space, Upload, Row, Col } from 'antd';
import { SettingOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';

const { Option } = Select;

/**
 * System Settings Page - 5 tabs
 * 1. General: Company info, timezone, language
 * 2. Email: SMTP settings, templates
 * 3. Evidence Settings: File size, formats, Google Drive
 * 4. Payment Settings: Milestones, reminders
 * 5. Customer Portal: Link expiry, access levels
 */
const SystemSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [generalForm] = Form.useForm();
    const [emailForm] = Form.useForm();
    const [evidenceForm] = Form.useForm();
    const [paymentForm] = Form.useForm();
    const [portalForm] = Form.useForm();

    // Mock initial values
    const initialGeneral = {
        companyName: 'SIRA Construction',
        timezone: 'Asia/Ho_Chi_Minh',
        language: 'vi',
        evidenceRetentionYears: 5,
    };

    const initialEmail = {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: 'noreply@sira.vn',
        smtpPassword: '***',
        fromEmail: 'noreply@sira.vn',
        fromName: 'SIRA System',
    };

    const initialEvidence = {
        maxFileSize: 500, // MB
        allowedFormats: ['jpg', 'jpeg', 'png', 'mp4', 'mov'],
        autoGenerateThumbnails: true,
        googleDriveEnabled: true,
        googleDriveFolderId: 'sira-evidence-2024',
    };

    const initialPayment = {
        defaultDeposit: 30,
        defaultAdvance: 40,
        defaultAcceptance: 30,
        paymentReminderDays: 3,
        enableAutoReminder: true,
    };

    const initialPortal = {
        linkExpiryDays: 30,
        defaultAccessLevel: 'BASIC',
        allowGuestComments: false,
    };

    const handleSaveGeneral = async () => {
        try {
            const values = await generalForm.validateFields();
            console.log('General settings:', values);
            message.success('Đã lưu cài đặt chung');
            // TODO: Call API to save settings
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const handleSaveEmail = async () => {
        try {
            const values = await emailForm.validateFields();
            console.log('Email settings:', values);
            message.success('Đã lưu cài đặt email');
            // TODO: Call API to save settings
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const handleSaveEvidence = async () => {
        try {
            const values = await evidenceForm.validateFields();
            console.log('Evidence settings:', values);
            message.success('Đã lưu cài đặt minh chứng');
            // TODO: Call API to save settings
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const handleSavePayment = async () => {
        try {
            const values = await paymentForm.validateFields();
            console.log('Payment settings:', values);
            message.success('Đã lưu cài đặt thanh toán');
            // TODO: Call API to save settings
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const handleSavePortal = async () => {
        try {
            const values = await portalForm.validateFields();
            console.log('Portal settings:', values);
            message.success('Đã lưu cài đặt Customer Portal');
            // TODO: Call API to save settings
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const tabItems: TabsProps['items'] = [
        {
            key: 'general',
            label: 'Chung',
            children: (
                <Card>
                    <Form form={generalForm} layout="vertical" initialValues={initialGeneral}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="companyName" label="Tên công ty" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="timezone" label="Múi giờ" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Asia/Ho_Chi_Minh">Vietnam (UTC+7)</Option>
                                        <Option value="Asia/Bangkok">Thailand (UTC+7)</Option>
                                        <Option value="Asia/Singapore">Singapore (UTC+8)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="language" label="Ngôn ngữ" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="vi">Tiếng Việt</Option>
                                        <Option value="en">English</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="evidenceRetentionYears" label="Thời gian lưu trữ minh chứng (năm)">
                                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Logo công ty">
                            <Upload beforeUpload={() => false} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Tải lên logo</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveGeneral}>
                                Lưu cài đặt
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            children: (
                <Card>
                    <Form form={emailForm} layout="vertical" initialValues={initialEmail}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="smtpHost" label="SMTP Host" rules={[{ required: true }]}>
                                    <Input placeholder="smtp.gmail.com" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="smtpPort" label="SMTP Port" rules={[{ required: true }]}>
                                    <InputNumber min={1} max={65535} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="smtpUser" label="SMTP Username" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="smtpPassword" label="SMTP Password" rules={[{ required: true }]}>
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="fromEmail" label="From Email" rules={[{ required: true, type: 'email' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="fromName" label="From Name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Email Templates">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <strong>Evidence Approved:</strong> Thông báo khi minh chứng được duyệt
                                </div>
                                <div>
                                    <strong>Payment Due:</strong> Nhắc nhở thanh toán sắp đến hạn
                                </div>
                                <div>
                                    <strong>Project Assigned:</strong> Thông báo khi được phân công dự án
                                </div>
                            </Space>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveEmail}>
                                Lưu cài đặt
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
        {
            key: 'evidence',
            label: 'Minh chứng',
            children: (
                <Card>
                    <Form form={evidenceForm} layout="vertical" initialValues={initialEvidence}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="maxFileSize" label="Kích thước file tối đa (MB)">
                                    <InputNumber min={1} max={2000} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="allowedFormats" label="Định dạng cho phép">
                                    <Select mode="multiple" placeholder="Chọn định dạng">
                                        <Option value="jpg">JPG</Option>
                                        <Option value="jpeg">JPEG</Option>
                                        <Option value="png">PNG</Option>
                                        <Option value="gif">GIF</Option>
                                        <Option value="mp4">MP4</Option>
                                        <Option value="mov">MOV</Option>
                                        <Option value="avi">AVI</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="autoGenerateThumbnails" label="Tự động tạo thumbnail" valuePropName="checked">
                            <Switch />
                        </Form.Item>

                        <Form.Item name="googleDriveEnabled" label="Kết nối Google Drive" valuePropName="checked">
                            <Switch />
                        </Form.Item>

                        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.googleDriveEnabled !== curr.googleDriveEnabled}>
                            {({ getFieldValue }) =>
                                getFieldValue('googleDriveEnabled') ? (
                                    <Form.Item name="googleDriveFolderId" label="Google Drive Folder ID">
                                        <Input placeholder="sira-evidence-2024" />
                                    </Form.Item>
                                ) : null
                            }
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveEvidence}>
                                Lưu cài đặt
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
        {
            key: 'payment',
            label: 'Thanh toán',
            children: (
                <Card>
                    <Form form={paymentForm} layout="vertical" initialValues={initialPayment}>
                        <div style={{ marginBottom: 24 }}>
                            <strong>Cột mốc thanh toán mặc định (%):</strong>
                        </div>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="defaultDeposit" label="Đặt cọc (Deposit)">
                                    <InputNumber min={0} max={100} suffix="%" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="defaultAdvance" label="Tạm ứng (Advance)">
                                    <InputNumber min={0} max={100} suffix="%" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="defaultAcceptance" label="Nghiệm thu (Acceptance)">
                                    <InputNumber min={0} max={100} suffix="%" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <div style={{ padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
                                Tổng:{' '}
                                {(paymentForm.getFieldValue('defaultDeposit') || 0) +
                                    (paymentForm.getFieldValue('defaultAdvance') || 0) +
                                    (paymentForm.getFieldValue('defaultAcceptance') || 0)}
                                % (phải = 100%)
                            </div>
                        </Form.Item>

                        <Form.Item name="paymentReminderDays" label="Nhắc nhở thanh toán (trước bao nhiêu ngày)">
                            <InputNumber min={1} max={30} suffix="ngày" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item name="enableAutoReminder" label="Tự động gửi email nhắc nhở" valuePropName="checked">
                            <Switch />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSavePayment}>
                                Lưu cài đặt
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
        {
            key: 'portal',
            label: 'Customer Portal',
            children: (
                <Card>
                    <Form form={portalForm} layout="vertical" initialValues={initialPortal}>
                        <Form.Item name="linkExpiryDays" label="Link có hiệu lực (ngày)">
                            <InputNumber min={1} max={365} suffix="ngày" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item name="defaultAccessLevel" label="Quyền truy cập mặc định">
                            <Select>
                                <Option value="BASIC">BASIC - Chỉ xem minh chứng</Option>
                                <Option value="FULL">FULL - Xem minh chứng, vật tư, thanh toán</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="allowGuestComments" label="Cho phép khách hàng comment" valuePropName="checked">
                            <Switch />
                        </Form.Item>

                        <Form.Item>
                            <div style={{ padding: 12, background: '#e6f7ff', borderRadius: 4, border: '1px solid #91d5ff' }}>
                                <strong>Lưu ý:</strong> Customer Portal link sẽ được tạo tự động khi dự án hoàn thành và được gửi qua email cho khách
                                hàng.
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSavePortal}>
                                Lưu cài đặt
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="Cài đặt hệ thống" extra={<SettingOutlined style={{ fontSize: 20, color: '#1890ff' }} />}>
                <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} />
            </Card>
        </div>
    );
};

export default SystemSettings;
