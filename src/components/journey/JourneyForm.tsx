import React, { useState, useEffect } from 'react';
import { 
    Form, Input, Button, Space, Typography, Row, Col, 
    Divider, Select, message, Spin, Card, Badge, AutoComplete
} from 'antd';
import { 
    UserOutlined, PhoneOutlined, HomeOutlined, 
    ProjectOutlined, SettingOutlined, CheckCircleOutlined,
    ClockCircleOutlined, InfoCircleOutlined, EnvironmentOutlined,
    FieldNumberOutlined, HourglassOutlined, RocketOutlined
} from '@ant-design/icons';
import { MasterDataSelect } from '../common/MasterDataSelect';
import { customerService } from '../../services/core-contracts/services/customer.service';
import { AuthorizedUserSelect } from '../authorizedusers/AuthorizedUser';
import { salesPipelineService } from '../../services/core-contracts/services/salesPipeline.service';
import { pipelineStageService } from '../../services/core-contracts/services/pipelineStage.service';
import { IJourney, ICreateJourneyInput } from '../../services/core-contracts/types/journey.types';

const { Text, Title } = Typography;
const { TextArea } = Input;

export interface JourneyFormProps {
    initialValues?: Partial<IJourney>;
    onSubmit: (values: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
    mode?: 'pm' | 'sale';
    currentUsername?: string;
}

const JourneyForm: React.FC<JourneyFormProps> = ({
    initialValues,
    onSubmit,
    onCancel,
    isLoading = false,
    mode = 'pm',
    currentUsername
}) => {
    const [form] = Form.useForm();
    const [pipelines, setPipelines] = useState<{ label: string; value: string }[]>([]);
    const [stages, setStages] = useState<{ label: string; value: string; pipelineId: string }[]>([]);
    const [customerOptions, setCustomerOptions] = useState<{ value: string; label: string; customer: any }[]>([]);
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(initialValues?.customer_id);

    const selectedPipelineId = Form.useWatch('sales_pipeline_id', form);

    useEffect(() => {
        const fetchMetadata = async () => {
            setIsFetchingMetadata(true);
            try {
                const [pipelineRes, stageRes] = await Promise.all([
                    mode === 'sale' ? salesPipelineService.queryContent({ limit: 100 }) : Promise.resolve({ data: [] }),
                    mode === 'sale' ? pipelineStageService.queryContent({ limit: 500 }) : Promise.resolve({ data: [] })
                ]);

                if (pipelineRes.data) {
                    setPipelines(pipelineRes.data.map(p => ({
                        label: p.name || 'N/A',
                        value: p._id
                    })));
                }

                if (stageRes.data) {
                    setStages(stageRes.data.map(s => ({
                        label: s.name || 'N/A',
                        value: s._id,
                        pipelineId: s.pipeline_id || ''
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch metadata:', error);
            } finally {
                setIsFetchingMetadata(false);
            }
        };

        fetchMetadata();
    }, [mode]);

    const handleSearchPhone = async (value: string) => {
        if (!value || value.length < 3) {
            setCustomerOptions([]);
            return;
        }

        try {
            const res = await customerService.queryCustomersDto({
                group: {
                    id: 'phone',
                    operation: 'similar',
                    value: value,
                    children: [],
                },
            });
            if (res.data) {
                setCustomerOptions(res.data.map(c => ({
                    value: c.phone || '',
                    label: `${c.phone} - ${c.full_name}`,
                    customer: c
                })));
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const onSelectPhone = (value: string, option: any) => {
        const c = option.customer;
        setSelectedCustomerId(c._id);
        form.setFieldsValue({
            customer_full_name: c.full_name,
            customer_email: c.email,
            customer_address: c.address,
            customer_province: c.city,
            site_address: c.address || form.getFieldValue('site_address')
        });
    };

    const handleFinish = async (values: any) => {
        let customerId = selectedCustomerId;

        // If no customer selected, create a new one automatically
        if (!customerId && !initialValues?._id) {
            try {
                setIsFetchingMetadata(true); // Reuse loading state or add a new one
                const newCustomer = await customerService.createCustomer({
                    code: `CUST-${Date.now()}`,
                    full_name: values.customer_full_name,
                    phone: values.customer_phone,
                    email: values.customer_email,
                    address: values.customer_address,
                    city: values.customer_province,
                    province: values.customer_province, // Send both to be safe
                    ward: values.customer_ward,
                });
                if (newCustomer?._id) {
                    customerId = newCustomer._id;
                    setSelectedCustomerId(customerId);
                } else {
                    throw new Error('Không thể tạo khách hàng mới');
                }
            } catch (error: any) {
                console.error('Failed to create customer:', error);
                message.error('Lỗi khi tự động tạo khách hàng: ' + (error?.message || 'Unknown error'));
                setIsFetchingMetadata(false);
                return;
            } finally {
                setIsFetchingMetadata(false);
            }
        }

        const payload = {
            ...values,
            customer_id: customerId
        };
        console.log('Final Submission Payload:', JSON.stringify(payload, null, 2));
        onSubmit(payload);
    };

    return (
        <Card variant="borderless" className="premium-form-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    priority: 'medium',
                    source_channel: 'direct',
                    journey_kind: 'main',
                    current_step: 'lead_new',
                    area_m2: 0,
                    execution_days: 0,
                    pm_user: currentUsername,
                    ...initialValues
                }}
                validateTrigger="onBlur"
                /* UX-13 (Wave 3.5): scroll vào field lỗi đầu tiên để user thấy validation message
                   thay vì nghĩ rằng "form đã save trống". */
                scrollToFirstError
            >
                {/* Hidden defaults */}
                <Form.Item name="journey_kind" hidden><Input /></Form.Item>
                <Form.Item name="current_step" hidden><Input /></Form.Item>

                <Divider orientation="left" style={{ marginTop: 0 }}>
                    <Space><UserOutlined /> <Text strong>Thông tin Khách hàng</Text></Space>
                </Divider>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="customer_phone"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        >
                            <AutoComplete
                                placeholder="Nhập SĐT để tìm hoặc thêm mới"
                                onSearch={handleSearchPhone}
                                onSelect={onSelectPhone}
                                options={customerOptions}
                            >
                                <Input prefix={<PhoneOutlined />} />
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="customer_full_name"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Tên khách hàng" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Email" name="customer_email">
                            <Input prefix={<InfoCircleOutlined />} placeholder="example@gmail.com" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Địa chỉ liên hệ" name="customer_address">
                            <Input 
                                prefix={<HomeOutlined />} 
                                placeholder="Số nhà, đường..." 
                                onChange={(e) => {
                                    if (!form.getFieldValue('site_address')) {
                                        form.setFieldsValue({ site_address: e.target.value });
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item 
                            label="Tỉnh/Thành" 
                            name="customer_province"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        >
                            <Input placeholder="VD: Hà Nội" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            label="Phường/Xã" 
                            name="customer_ward"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        >
                            <Input placeholder="VD: Phường Dịch Vọng" />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left">
                    <Space><RocketOutlined /> <Text strong>Yêu cầu & Dự án</Text></Space>
                </Divider>

                <Form.Item
                    label="Tiêu đề yêu cầu"
                    name="request_title"
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                >
                    <Input placeholder="VD: Cải tạo tầng 5, Chống thấm mái..." />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Mã hồ sơ" name="journey_code">
                            <Input placeholder="Để trống để tự động tạo" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Loại dịch vụ"
                            name="serviceTypeId"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        >
                            <MasterDataSelect 
                                categoryCode="service_type" 
                                placeholder="Chọn loại dịch vụ" 
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Diện tích (m2)"
                            name="area_m2"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        >
                            <Input type="number" prefix={<FieldNumberOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày thi công dự kiến"
                            name="execution_days"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        >
                            <Input type="number" prefix={<HourglassOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Địa chỉ thi công" name="site_address">
                    <Input prefix={<EnvironmentOutlined />} placeholder="Địa chỉ nơi thực hiện" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Kênh tiếp nhận" name="source_channel">
                            <Select options={[
                                { label: 'Trực tiếp', value: 'direct' },
                                { label: 'Hotline', value: 'hotline' },
                                { label: 'Marketing', value: 'marketing' },
                                { label: 'Giới thiệu', value: 'referral' },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Mức độ ưu tiên" name="priority">
                            <Select options={[
                                { label: 'Thấp', value: 'low' },
                                { label: 'Trung bình', value: 'medium' },
                                { label: 'Cao', value: 'high' },
                                { label: 'Khẩn cấp', value: 'critical' },
                            ]} />
                        </Form.Item>
                    </Col>
                </Row>

                {mode === 'pm' && (
                    <Form.Item label="PM Phụ trách" name="pm_user">
                        <AuthorizedUserSelect 
                            allowMultiple={false} 
                            placeholder="Chọn PM phụ trách" 
                        />
                    </Form.Item>
                )}

                <Form.Item label="Ghi chú / Mô tả thêm" name="request_description">
                    <TextArea rows={3} placeholder="Chi tiết yêu cầu của khách hàng..." />
                </Form.Item>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isLoading}
                        icon={<CheckCircleOutlined />}
                        style={{ minWidth: 120 }}
                    >
                        {initialValues?._id ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default JourneyForm;
