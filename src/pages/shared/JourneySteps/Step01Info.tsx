import React, { useState, useEffect, useMemo } from 'react';
import { Card, Form, Input, Button, Space, Typography, Row, Col, Descriptions, Tag, message, Divider, Select, Alert, Empty, Avatar } from 'antd';
import { 
    SaveOutlined, EditOutlined, EyeOutlined, UserOutlined, PhoneOutlined, 
    MailOutlined, HomeOutlined, LoadingOutlined, InfoCircleOutlined, 
    EnvironmentOutlined, ToolOutlined, ShareAltOutlined, CalendarOutlined,
    FlagOutlined, RocketOutlined, FormOutlined
} from '@ant-design/icons';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { customerService } from '../../../services/core-contracts/services/customer.service';
import { IJourney } from '../../../services/core-contracts/types/journey.types';
import { ICustomer } from '../../../services/core-contracts/types/customer.types';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step01InfoProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'default' },
    medium: { label: 'Trung bình', color: 'blue' },
    high: { label: 'Cao', color: 'orange' },
    critical: { label: 'Khẩn cấp', color: 'red' },
};

const SOURCE_CHANNEL_CONFIG: Record<string, string> = {
    marketing: 'Marketing',
    hotline: 'Hotline',
    referral: 'Giới thiệu',
    direct: 'Trực tiếp'
};

export const Step01Info: React.FC<Step01InfoProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [journeyData, setJourneyData] = useState<IJourney | null>(null);
    const [customerData, setCustomerData] = useState<ICustomer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const journey = await journeyService.findJourneyDto(journeyId);
            if (journey) {
                setJourneyData(journey);
                
                let combinedData: any = { ...journey };
                
                if (journey.idx_customer_id?._id) {
                    const customer = await customerService.findCustomerDto(journey.idx_customer_id._id);
                    if (customer) {
                        setCustomerData(customer);
                        Object.assign(combinedData, {
                            full_name: customer.full_name,
                            phone: customer.phone,
                            email: customer.email,
                            customer_code: customer.code,
                            customer_address: customer.address,
                            district: customer.district,
                            city: customer.city,
                            customer_notes: customer.notes
                        });
                    }
                } else {
                    Object.assign(combinedData, {
                        full_name: journey.customer_full_name,
                        phone: journey.customer_phone,
                        email: journey.customer_email,
                        customer_address: journey.customer_address,
                        city: journey.customer_province
                    });
                }
                
                // Use a small delay or ensure component is rendered to avoid "form not connected" warning
                setTimeout(() => {
                    form.setFieldsValue(combinedData);
                }, 0);
            }
        } catch (error) {
            console.error('Step01Info Fetch Error:', error);
            message.error('Không thể tải thông tin hồ sơ');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [journeyId]);

    const handleFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const journeyUpdate = {
                request_title: values.request_title,
                requested_service: values.requested_service,
                site_address: values.site_address,
                source_channel: values.source_channel,
                priority: values.priority,
                request_description: values.request_description,
                customer_full_name: values.full_name,
                customer_phone: values.phone,
                customer_email: values.email,
                customer_address: values.customer_address,
                customer_province: values.city,
            };
            
            await journeyService.updateJourney(journeyId, journeyUpdate);

            if (journeyData?.idx_customer_id?._id) {
                await customerService.updateCustomer(journeyData.idx_customer_id._id, {
                    full_name: values.full_name,
                    phone: values.phone,
                    email: values.email,
                    address: values.customer_address,
                    district: values.district,
                    city: values.city,
                    notes: values.customer_notes
                });
            }

            setIsEditing(false);
            if (onEditStateChange) onEditStateChange(false);
            message.success('Cập nhật thành công');
            
            await fetchData();
            if (onSave) onSave(values);
        } catch (error) {
            console.error('Step01Info Save Error:', error);
            message.error('Lỗi khi lưu thông tin');
        } finally {
            setIsLoading(false);
        }
    };

    const priorityCfg = useMemo(() => {
        const key = journeyData?.priority || '';
        return PRIORITY_CONFIG[key] || { label: key || '—', color: 'default' };
    }, [journeyData?.priority]);

    return (
        <Card 
            title={
                <Space>
                    <FormOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontSize: 16 }}>
                        {isEditing ? "Hiệu chỉnh Yêu cầu & Khách hàng" : "Thông tin Yêu cầu"}
                    </span>
                </Space>
            } 
            bordered={false} 
            className="ky-card-detail"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderRadius: 12 }}
            extra={isEditable && (
                <Button 
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => {
                        const nextState = !isEditing;
                        setIsEditing(nextState);
                        if (onEditStateChange) onEditStateChange(nextState);
                    }}
                >
                    {isEditing ? "Hủy sửa" : "Chỉnh sửa"}
                </Button>
            )}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{}}>
                {isLoading && !journeyData ? (
                    <div style={{ textAlign: 'center', padding: 60 }}>
                        <LoadingOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                        <div style={{ marginTop: 16 }}>Đang chuẩn bị hồ sơ...</div>
                    </div>
                ) : !journeyData ? (
                    <Empty description="Không tìm thấy dữ liệu" />
                ) : isEditing ? (
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Divider orientation="left" plain><RocketOutlined /> Yêu cầu</Divider>
                            <Form.Item label="Tiêu đề yêu cầu" name="request_title" rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <Input placeholder="Tên dịch vụ/yêu cầu..." />
                            </Form.Item>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="Dịch vụ" name="requested_service">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Kênh" name="source_channel">
                                        <Select options={Object.entries(SOURCE_CHANNEL_CONFIG).map(([k, v]) => ({ value: k, label: v }))} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Ưu tiên" name="priority">
                                <Select options={Object.entries(PRIORITY_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
                            </Form.Item>
                            <Form.Item label="Địa chỉ thi công" name="site_address">
                                <Input prefix={<EnvironmentOutlined />} />
                            </Form.Item>
                            <Form.Item label="Mô tả chi tiết" name="request_description">
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={12}>
                            <Divider orientation="left" plain><UserOutlined /> Khách hàng</Divider>
                            <Form.Item label="Tên khách hàng" name="full_name" rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <Input />
                            </Form.Item>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="SĐT" name="phone" rules={[{ required: true, message: 'Bắt buộc' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Email" name="email">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Địa chỉ" name="customer_address">
                                <Input prefix={<HomeOutlined />} />
                            </Form.Item>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="Quận/Huyện" name="district">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Tỉnh/Thành" name="city">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Ghi chú nghiệp vụ" name="customer_notes">
                                <TextArea rows={4} />
                            </Form.Item>
                            
                            <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 16 }}>
                                <Button onClick={() => { setIsEditing(false); onEditStateChange?.(false); }}>Hủy</Button>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
                                    Lưu thay đổi
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                ) : (
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={12}>
                            <Title level={5}><RocketOutlined style={{ color: '#1890ff', marginRight: 8 }} /> Yêu cầu & Dịch vụ</Title>
                            <Descriptions bordered size="small" column={1}>
                                <Descriptions.Item label="Tiêu đề">{journeyData.request_title || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Dịch vụ"><Tag color="blue">{journeyData.requested_service || '—'}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Thi công">{journeyData.site_address || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Kênh">{SOURCE_CHANNEL_CONFIG[journeyData.source_channel || ''] || journeyData.source_channel || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Ưu tiên"><Tag color={priorityCfg.color}>{priorityCfg.label}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Mô tả">
                                    <div style={{ whiteSpace: 'pre-wrap', color: '#666', minHeight: 40 }}>{journeyData.request_description || '...'}</div>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                        
                        <Col xs={24} lg={12}>
                            <Title level={5}><UserOutlined style={{ color: '#52c41a', marginRight: 8 }} /> Hồ sơ Khách hàng</Title>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '8px 0' }}>
                                <Avatar size={48} style={{ backgroundColor: '#f6ffed' }} icon={<UserOutlined style={{ color: '#52c41a' }} />} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 16 }}>{customerData?.full_name || journeyData.customer_full_name || 'Khách hàng ẩn danh'}</div>
                                    <Tag color="green">{customerData?.code || 'PRE-LINKED'}</Tag>
                                </div>
                            </div>
                            <Descriptions bordered size="small" column={1}>
                                <Descriptions.Item label="Điện thoại"><strong>{customerData?.phone || journeyData.customer_phone || '—'}</strong></Descriptions.Item>
                                <Descriptions.Item label="Email">{customerData?.email || journeyData.customer_email || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">
                                    {[
                                        customerData?.address || journeyData.customer_address,
                                        customerData?.district,
                                        customerData?.city || journeyData.customer_province
                                    ].filter(Boolean).join(', ') || '—'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày tạo">{customerData?.createdAt ? new Date(customerData.createdAt).toLocaleDateString('vi-VN') : '—'}</Descriptions.Item>
                                <Descriptions.Item label="Ghi chú">
                                    <div style={{ fontSize: 13, color: '#888' }}>{customerData?.notes || 'Chưa có ghi chú'}</div>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                )}
            </Form>
        </Card>
    );
};

export default Step01Info;
