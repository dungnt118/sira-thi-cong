import React, { useState } from 'react';
import { Card, Tabs, Form, Input, InputNumber, Select, Switch, Button, message, Space, Upload, Row, Col, Typography, Modal } from 'antd';
import { SettingOutlined, SaveOutlined, UploadOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';

const { Option } = Select;

import { useOutletContext } from 'react-router-dom';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { localStorageService } from '../../../services/localstorage/localStorageService';

const { Title: AntTitle, Text: AntText } = Typography;

/**
 * System Settings Page - 5 tabs
 * 1. General: Company info, timezone, language
 * 2. Email: SMTP settings, templates
 * 3. Evidence Settings: File size, formats, Google Drive
 * 4. Payment Settings: Milestones, reminders
 * 5. Customer Portal: Link expiry, access levels
 */
const SystemSettings: React.FC = () => {
    const { isMobile } = useOutletContext<{ isMobile: boolean }>();
    const [activeTab, setActiveTab] = useState('general');
    const [generalForm] = Form.useForm();
    const [emailForm] = Form.useForm();
    const [evidenceForm] = Form.useForm();
    const [paymentForm] = Form.useForm();
    const [portalForm] = Form.useForm();

    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [previewKey, setPreviewKey] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<any>(null);

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


    const handleResetDemoData = () => {
        demoDataService.resetData();
        message.success('Đã reset toàn bộ dữ liệu mẫu vào LocalStorage');
    };

    const handleResetCollection = (key: string) => {
        demoDataService.resetCollection(key);
        message.success(`Đã reset collection ${key} về dữ liệu gốc`);
    };

    const handlePreviewData = (key: string) => {
        const data = localStorageService.getLocal(key);
        setPreviewKey(key);
        setPreviewData(data);
        setPreviewModalVisible(true);
    };

    const tabItems: TabsProps['items'] = [
        {
            key: 'general',
            label: 'Chung',
            children: (
                <Card>
                    <Form form={generalForm} layout="vertical" initialValues={initialGeneral}>
                        <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="companyName" label="Tên công ty" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="timezone" label="Múi giờ" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Asia/Ho_Chi_Minh">Vietnam (UTC+7)</Option>
                                        <Option value="Asia/Bangkok">Thailand (UTC+7)</Option>
                                        <Option value="Asia/Singapore">Singapore (UTC+8)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="language" label="Ngôn ngữ" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="vi">Tiếng Việt</Option>
                                        <Option value="en">English</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
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
        {
            key: 'data',
            label: 'Quản lý Dữ liệu',
            children: (
                <Card>
                    <div style={{ marginBottom: 24 }}>
                        <AntTitle level={5}>Dữ liệu Demo & LocalStorage</AntTitle>
                        <AntText type="secondary">
                            Sử dụng các công cụ dưới đây để quản lý dữ liệu demo đang lưu trữ tại trình duyệt của bạn.
                        </AntText>
                    </div>

                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ padding: 16, background: '#fff7e6', border: '1px solid #ffd591', borderRadius: 8 }}>
                            <Row align="middle" gutter={16}>
                                <Col flex="auto">
                                    <AntText strong>Reset Dữ liệu gốc</AntText>
                                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                                        Xóa dữ liệu hiện tại và nạp lại toàn bộ dữ liệu mẫu từ hệ thống.
                                    </div>
                                </Col>
                                <Col>
                                    <Button 
                                        danger 
                                        icon={<ReloadOutlined />} 
                                        onClick={handleResetDemoData}
                                    >
                                        Reset Dữ liệu
                                    </Button>
                                </Col>
                            </Row>
                        </div>

                        <div>
                            <AntTitle level={5}>Danh sách Collections (LocalStorage)</AntTitle>
                            <div style={{ maxHeight: 400, overflow: 'auto', border: '1px solid #f0f0f0', borderRadius: 8 }}>
                                {demoDataService.getDemoKeys().map(key => {
                                    const data = localStorageService.getLocal(key);
                                    const exists = !!data;
                                    const count = Array.isArray(data) ? data.length : (data ? 1 : 0);
                                    
                                    return (
                                        <div 
                                            key={key} 
                                            style={{ 
                                                padding: '12px 16px', 
                                                borderBottom: '1px solid #f0f0f0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Space direction="vertical" size={0}>
                                                <AntText strong>{key}</AntText>
                                                <Space>
                                                    <AntText type={exists ? "success" : "danger"} style={{ fontSize: 11 }}>
                                                        {exists ? 'Đã tồn tại' : 'Chưa có dữ liệu'}
                                                    </AntText>
                                                    {exists && (
                                                        <AntText type="secondary" style={{ fontSize: 11 }}>
                                                            • {count} records
                                                        </AntText>
                                                    )}
                                                </Space>
                                            </Space>
                                            <Space>
                                                <Button 
                                                    type="link" 
                                                    size="small"
                                                    icon={<ReloadOutlined />} 
                                                    onClick={() => handleResetCollection(key)}
                                                >
                                                    Reset
                                                </Button>
                                                <Button 
                                                    type="link" 
                                                    size="small"
                                                    icon={<EyeOutlined />} 
                                                    disabled={!exists}
                                                    onClick={() => handlePreviewData(key)}
                                                >
                                                    Preview
                                                </Button>
                                            </Space>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Space>
                </Card>
            ),
        },
    ];

    return (
        <div style={{ padding: 0 }}>
            <Card title="Cài đặt hệ thống" extra={<SettingOutlined style={{ fontSize: 20, color: '#1890ff' }} />}>
                <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} />
            </Card>

            <Modal
                title={`Preview: ${previewKey}`}
                open={previewModalVisible}
                onCancel={() => setPreviewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setPreviewModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                <div style={{ 
                    maxHeight: 500, 
                    overflow: 'auto', 
                    background: '#f5f5f5', 
                    padding: 16, 
                    borderRadius: 4,
                    fontFamily: 'monospace',
                    fontSize: 12
                }}>
                    <pre>{JSON.stringify(previewData, null, 2)}</pre>
                </div>
            </Modal>
        </div>
    );
};

export default SystemSettings;
