import React, { useEffect, useState } from 'react';
import {
    Form, Input, Select, DatePicker, Row, Col,
    Divider, Typography, Space, Button, message, Spin, AutoComplete, InputNumber
} from 'antd';
import {
    UserOutlined, HomeOutlined, CustomerServiceOutlined,
    CalendarOutlined, InfoCircleOutlined, PhoneOutlined, MailOutlined,
    FieldNumberOutlined, HourglassOutlined, DashboardOutlined
} from '@ant-design/icons';
import { MasterDataSelect } from '../common/MasterDataSelect';
import dayjs from 'dayjs';
import type { IJourney, ICreateJourneyInput } from '../../services/core-contracts/types/journey.types';
import { customerService } from '../../services/core-contracts/services/customer.service';
import { employeeService } from '../../services/core-contracts/services/employee.service';
import { salesPipelineService } from '../../services/core-contracts/services/salesPipeline.service';
import { pipelineStageService } from '../../services/core-contracts/services/pipelineStage.service';

const { TextArea } = Input;
const { Text } = Typography;

interface JourneyFormProps {
    initialValues?: Partial<IJourney>;
    onSubmit: (values: ICreateJourneyInput) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    mode?: 'pm' | 'sale';
    currentUsername?: string;
}

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Thấp' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'high', label: 'Cao' },
    { value: 'critical', label: 'Khẩn cấp' },
];

const COMPLEXITY_LEVEL_OPTIONS = [
    { label: 'Tiêu chuẩn', value: 'standard' },
    { label: 'Khó', value: 'difficult' },
    { label: 'Rất khó', value: 'very_difficult' },
];

const SOURCE_CHANNEL_OPTIONS = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'hotline', label: 'Hotline' },
    { value: 'referral', label: 'Giới thiệu' },
    { value: 'direct', label: 'Trực tiếp' },
];

const JourneyForm: React.FC<JourneyFormProps> = ({
    initialValues,
    onSubmit,
    onCancel,
    isLoading = false,
    mode = 'pm',
    currentUsername
}) => {
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState<{ label: string; value: string }[]>([]);
    const [pipelines, setPipelines] = useState<{ label: string; value: string }[]>([]);
    const [stages, setStages] = useState<{ label: string; value: string; pipelineId: string }[]>([]);
    const [customerOptions, setCustomerOptions] = useState<{ value: string; label: string; customer: any }[]>([]);
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const [isSavingCustomer, setIsSavingCustomer] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(initialValues?.customer_id);

    const selectedPipelineId = Form.useWatch('sales_pipeline_id', form);

    useEffect(() => {
        const fetchMetadata = async () => {
            setIsFetchingMetadata(true);
            try {
                // Pre-fetch employees as before
                const [empRes, pipelineRes, stageRes] = await Promise.all([
                    employeeService.queryContent({ limit: 100 }),
                    mode === 'sale' ? salesPipelineService.queryContent({ limit: 100 }) : Promise.resolve({ data: [] }),
                    mode === 'sale' ? pipelineStageService.queryContent({ limit: 500 }) : Promise.resolve({ data: [] })
                ]);

                if (empRes.data) {
                    setEmployees(empRes.data.map(e => ({
                        label: e.name || 'N/A',
                        value: e._id
                    })));
                }

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
    }, []);

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
            site_address: c.address || form.getFieldValue('site_address')
        });
    };

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                planned_start_date: initialValues.planned_start_date ? dayjs(initialValues.planned_start_date) : undefined,
                planned_end_date: initialValues.planned_end_date ? dayjs(initialValues.planned_end_date) : undefined,
            });
        }
    }, [initialValues, form]);

    const handleFinish = async (values: any) => {
        let customerId = selectedCustomerId;

        // Step 1: Ensure customer exists if phone is provided
        if (!customerId && values.customer_phone) {
            setIsSavingCustomer(true);
            try {
                const newCustomer = await customerService.createCustomer({
                    phone: values.customer_phone,
                    full_name: values.customer_full_name,
                    email: values.customer_email,
                    address: values.customer_address,
                    province: values.customer_province,
                    ward: values.customer_ward
                });
                customerId = newCustomer._id;
                message.success(`Đã tạo hồ sơ khách hàng mới: ${newCustomer.full_name}`);
            } catch (error) {
                message.error("Không thể tạo hồ sơ khách hàng mới (Thiếu thông tin bắt buộc?).");
                setIsSavingCustomer(false);
                return;
            } finally {
                setIsSavingCustomer(false);
            }
        }

        // Step 2: Format and Submit Journey
        const formattedValues: ICreateJourneyInput = {
            ...values,
            customer_id: customerId,
            planned_start_date: values.planned_start_date ? values.planned_start_date.toISOString() : undefined,
            planned_end_date: values.planned_end_date ? values.planned_end_date.toISOString() : undefined,
        };
        onSubmit(formattedValues);
    };

    return (
        <Spin spinning={isFetchingMetadata || isSavingCustomer}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    priority: 'medium',
                    source_channel: 'direct',
                    owner_user: currentUsername,
                    sale_users: mode === 'sale' ? currentUsername : undefined
                }}
            >
                <Divider orientation="left" style={{ marginTop: 0 }}>
                    <Space><UserOutlined /> <Text strong>Thông tin Khách hàng (Ưu tiên SĐT)</Text></Space>
                </Divider>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="customer_phone"
                            rules={[{ required: true, message: 'Vui lòng nhập SĐT khách hàng' }]}
                        >
                            <AutoComplete
                                onSearch={handleSearchPhone}
                                onSelect={onSelectPhone}
                                options={customerOptions}
                                placeholder="Gõ số điện thoại để tìm..."
                                onChange={() => setSelectedCustomerId(undefined)}
                            >
                                <Input prefix={<PhoneOutlined />} />
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="customer_full_name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Tự động nhận diện hoặc nhập mới" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Email" name="customer_email">
                            <Input prefix={<MailOutlined />} placeholder="abc@gmail.com" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Địa chỉ liên hệ" name="customer_address">
                            <Input prefix={<HomeOutlined />} placeholder="Số nhà, đường, phường..." />
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
                            <Input placeholder="VD: Dịch Vọng" />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left">
                    <Space><InfoCircleOutlined /> <Text strong>Thông tin Công trình & Kỹ thuật</Text></Space>
                </Divider>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mã công trình"
                            name="journey_code"
                        >
                            <Input placeholder="VD: HN-2024-001 (Để trống để tự động tạo)" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Tiêu đề yêu cầu"
                            name="request_title"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                        >
                            <Input placeholder="VD: Khảo sát chống thấm sân thượng" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Địa chỉ công trình"
                            name="site_address"
                        >
                            <Input prefix={<HomeOutlined />} placeholder="Nếu khác địa chỉ liên hệ" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={mode === 'sale' ? "Chủ sở hữu công trình" : "Người phụ trách (PM)"}
                            name="owner_user"
                        >
                            <Select
                                showSearch
                                placeholder="Chọn người phụ trách"
                                options={employees}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {mode === 'sale' && (
                    <>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Quy trình bán hàng" name="sales_pipeline_id">
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Chọn quy trình bán hàng"
                                        options={pipelines}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Giai đoạn bán hàng" name="sales_stage_id">
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Chọn giai đoạn bán hàng"
                                        options={stages.filter(s => !selectedPipelineId || s.pipelineId === selectedPipelineId)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Khách hàng nghi trùng" name="duplicate_customer_id">
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Chọn khách hàng nghi trùng"
                                        options={customerOptions.map(c => ({ label: c.label, value: c.customer._id }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Phụ trách kinh doanh" name="sale_users">
                                    <Select
                                        showSearch
                                        placeholder="Chọn sale phụ trách"
                                        options={employees}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="PM triển khai" name="pm_user">
                                    <Select
                                        showSearch
                                        placeholder="Chọn PM"
                                        options={employees}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Giám sát triển khai" name="supervisor_users">
                                    <Select
                                        showSearch
                                        placeholder="Chọn giám sát"
                                        options={employees}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}

                <Divider orientation="left">
                    <Space><CustomerServiceOutlined /> <Text strong>Chi tiết dịch vụ</Text></Space>
                </Divider>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Loại dịch vụ"
                            name="serviceTypeId"
                        >
                            <MasterDataSelect 
                                categoryCode="service_type" 
                                placeholder="Chọn loại dịch vụ (Xây mới, Cải tạo...)" 
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Mức ưu tiên"
                            name="priority"
                        >
                            <Select options={PRIORITY_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Kênh nguồn"
                            name="source_channel"
                        >
                            <Select options={SOURCE_CHANNEL_OPTIONS} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Diện tích (m2)"
                            name="area_m2"
                        >
                            <InputNumber 
                                style={{ width: '100%' }} 
                                placeholder="0" 
                                min={0}
                                prefix={<FieldNumberOutlined />} 
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Ngày thi công (Dự kiến)"
                            name="execution_days"
                        >
                            <InputNumber 
                                style={{ width: '100%' }} 
                                placeholder="0" 
                                min={0}
                                prefix={<HourglassOutlined />} 
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Độ phức tạp"
                            name="complexity_level"
                        >
                            <Select 
                                placeholder="Chọn độ khó" 
                                options={COMPLEXITY_LEVEL_OPTIONS}
                                suffixIcon={<DashboardOutlined />}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày khởi công (dự kiến)"
                            name="planned_start_date"
                        >
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" prefix={<CalendarOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày kết thúc (dự kiến)"
                            name="planned_end_date"
                        >
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" prefix={<CalendarOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Mô tả chi tiết yêu cầu"
                    name="request_description"
                >
                    <TextArea rows={3} placeholder="Nhập các ghi chú chi tiết từ khách hàng..." />
                </Form.Item>

                {mode === 'sale' && (
                    <Form.Item
                        label="Ghi chú triển khai"
                        name="delivery_note"
                    >
                        <TextArea rows={3} placeholder="Ghi chú handoff, cam kết với khách hàng hoặc lưu ý cho delivery." />
                    </Form.Item>
                )}

                <div style={{ textAlign: 'right', marginTop: 24 }}>
                    <Space>
                        <Button onClick={onCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={isLoading || isSavingCustomer}>
                            {initialValues?._id ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Space>
                </div>
            </Form>
        </Spin>
    );
};

export default JourneyForm;
