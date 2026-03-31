import React from 'react';
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Drawer,
    Form,
    Input,
    Row,
    Select,
    Space,
    Typography,
} from 'antd';
import dayjs from 'dayjs';
import type { IJourney, ICreateJourneyInput } from '../../../../services/core-contracts/types/journey.types';
import type { ICustomer } from '../../../../services/core-contracts/types/customer.types';
import type { ISalesPipeline } from '../../../../services/core-contracts/types/salesPipeline.types';
import type { IPipelineStage } from '../../../../services/core-contracts/types/pipelineStage.types';
import {
    JOURNEY_GO_NO_GO_OPTIONS,
    JOURNEY_PRIORITY_OPTIONS,
    JOURNEY_PROJECT_STATUS_OPTIONS,
    JOURNEY_QUOTE_STATUS_OPTIONS,
    JOURNEY_SLA_OPTIONS,
    JOURNEY_SOURCE_CHANNEL_OPTIONS,
    JOURNEY_STEP_OPTIONS,
    JOURNEY_SURVEY_STATUS_OPTIONS,
} from '../journeySaleMeta';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface JourneyUpsertDrawerProps {
    open: boolean;
    mode: 'create' | 'edit';
    journey?: IJourney | null;
    initialValues?: Partial<ICreateJourneyInput>;
    customers: ICustomer[];
    pipelines: ISalesPipeline[];
    stages: IPipelineStage[];
    saving?: boolean;
    currentUsername?: string;
    onCancel: () => void;
    onSubmit: (payload: ICreateJourneyInput) => Promise<void> | void;
}

const mapJourneyToForm = (
    journey?: IJourney | null,
    currentUsername?: string,
    initialValues?: Partial<ICreateJourneyInput>,
) => ({
    journey_code: journey?.journey_code ?? initialValues?.journey_code,
    request_title: journey?.request_title ?? initialValues?.request_title,
    customer_id: journey?.customer_id ?? initialValues?.customer_id,
    contact_phone: journey?.contact_phone ?? initialValues?.contact_phone,
    contact_email: journey?.contact_email ?? initialValues?.contact_email,
    source_channel: journey?.source_channel ?? initialValues?.source_channel ?? 'direct',
    priority: journey?.priority ?? initialValues?.priority ?? 'medium',
    go_no_go_status: journey?.go_no_go_status ?? initialValues?.go_no_go_status ?? 'draft',
    sla_status: journey?.sla_status ?? initialValues?.sla_status ?? 'on_time',
    survey_status: journey?.survey_status ?? initialValues?.survey_status ?? 'not_started',
    quote_status: journey?.quote_status ?? initialValues?.quote_status ?? 'not_started',
    project_status: journey?.project_status ?? initialValues?.project_status ?? 'not_started',
    current_step: journey?.current_step ?? initialValues?.current_step ?? 'lead_intake',
    requested_service: journey?.requested_service ?? initialValues?.requested_service,
    request_description: journey?.request_description ?? initialValues?.request_description,
    site_address: journey?.site_address ?? initialValues?.site_address,
    sales_pipeline_id: journey?.sales_pipeline_id ?? initialValues?.sales_pipeline_id,
    sales_stage_id: journey?.sales_stage_id ?? initialValues?.sales_stage_id,
    sales_owner_user: journey?.sales_owner_user ?? initialValues?.sales_owner_user ?? currentUsername,
    owner_user_id: journey?.owner_user_id ?? initialValues?.owner_user_id ?? currentUsername,
    duplicate_customer_id: journey?.duplicate_customer_id ?? initialValues?.duplicate_customer_id,
    delivery_pm_user: journey?.delivery_pm_user ?? initialValues?.delivery_pm_user,
    delivery_supervisor_user:
        journey?.delivery_supervisor_user ?? initialValues?.delivery_supervisor_user,
    planned_start_date: journey?.planned_start_date
        ? dayjs(journey.planned_start_date)
        : initialValues?.planned_start_date
          ? dayjs(initialValues.planned_start_date)
          : undefined,
    planned_end_date: journey?.planned_end_date
        ? dayjs(journey.planned_end_date)
        : initialValues?.planned_end_date
          ? dayjs(initialValues.planned_end_date)
          : undefined,
    delivery_note: journey?.delivery_note ?? initialValues?.delivery_note,
});

const normalizeJourneyPayload = (values: Record<string, any>): ICreateJourneyInput => ({
    ...values,
    planned_start_date: values.planned_start_date ? values.planned_start_date.toISOString() : undefined,
    planned_end_date: values.planned_end_date ? values.planned_end_date.toISOString() : undefined,
});

export const JourneyUpsertDrawer: React.FC<JourneyUpsertDrawerProps> = ({
    open,
    mode,
    journey,
    initialValues,
    customers,
    pipelines,
    stages,
    saving = false,
    currentUsername,
    onCancel,
    onSubmit,
}) => {
    const [form] = Form.useForm();
    const selectedPipelineId = Form.useWatch('sales_pipeline_id', form);

    React.useEffect(() => {
        if (!open) {
            return;
        }

        form.setFieldsValue(mapJourneyToForm(journey, currentUsername, initialValues));
    }, [open, journey, currentUsername, initialValues, form]);

    React.useEffect(() => {
        const selectedStageId = form.getFieldValue('sales_stage_id');
        if (!selectedStageId) {
            return;
        }

        const stage = stages.find((item) => item._id === selectedStageId);
        if (stage && selectedPipelineId && stage.pipeline_id !== selectedPipelineId) {
            form.setFieldValue('sales_stage_id', undefined);
        }
    }, [selectedPipelineId, stages, form]);

    const stageOptions = stages
        .filter((stage) => !selectedPipelineId || stage.pipeline_id === selectedPipelineId)
        .sort((left, right) => (left.order || 0) - (right.order || 0))
        .map((stage) => ({
            value: stage._id,
            label: stage.name || 'Không tên',
        }));

    const customerOptions = customers
        .slice()
        .sort((left, right) => (left.full_name || '').localeCompare(right.full_name || '', 'vi'))
        .map((customer) => ({
            value: customer._id,
            label: customer.full_name || customer.code || customer.phone || customer._id,
        }));

    const pipelineOptions = pipelines
        .slice()
        .sort((left, right) => (left.name || '').localeCompare(right.name || '', 'vi'))
        .map((pipeline) => ({
            value: pipeline._id,
            label: pipeline.name || 'Không tên',
        }));

    const handleCustomerChange = (customerId?: string) => {
        if (!customerId) {
            return;
        }

        const customer = customers.find((item) => item._id === customerId);
        if (!customer) {
            return;
        }

        form.setFieldsValue({
            contact_phone: form.getFieldValue('contact_phone') || customer.phone,
            contact_email: form.getFieldValue('contact_email') || customer.email,
            site_address: form.getFieldValue('site_address') || customer.address,
        });
    };

    const handleStageChange = (stageId?: string) => {
        if (!stageId) {
            return;
        }

        const selectedStage = stages.find((item) => item._id === stageId);
        if (selectedStage?.journey_step_code) {
            form.setFieldValue('current_step', selectedStage.journey_step_code);
        }
    };

    const submit = async () => {
        const values = await form.validateFields();
        await onSubmit(normalizeJourneyPayload(values));
        form.resetFields();
    };

    return (
        <Drawer
            title={mode === 'create' ? 'Tạo yêu cầu dịch vụ' : 'Cập nhật yêu cầu dịch vụ'}
            placement="right"
            width={720}
            open={open}
            onClose={onCancel}
            destroyOnClose
            extra={
                <Space>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button type="primary" loading={saving} onClick={submit}>
                        {mode === 'create' ? 'Tạo hành trình' : 'Lưu thay đổi'}
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical">
                <Title level={5} style={{ marginTop: 0 }}>
                    Thông tin tiếp nhận
                </Title>
                <Text type="secondary">
                    Nhóm trường này phản ánh bản ghi Journey tại lớp Sale, đồng thời là nền cho toàn bộ hành trình phía sau.
                </Text>

                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col xs={24} md={10}>
                        <Form.Item
                            label="Mã hành trình"
                            name="journey_code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã hành trình' }]}
                        >
                            <Input placeholder="Ví dụ: JRN-2026-001" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={14}>
                        <Form.Item
                            label="Tiêu đề yêu cầu"
                            name="request_title"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề yêu cầu' }]}
                        >
                            <Input placeholder="Ví dụ: Chống thấm sân thượng nhà phố" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Khách hàng"
                            name="customer_id"
                            rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
                        >
                            <Select
                                showSearch
                                optionFilterProp="label"
                                placeholder="Chọn khách hàng"
                                options={customerOptions}
                                onChange={handleCustomerChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Khách hàng nghi trùng" name="duplicate_customer_id">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                placeholder="Chọn khách hàng nghi trùng"
                                options={customerOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Số điện thoại tiếp nhận" name="contact_phone">
                            <Input placeholder="Nhập số điện thoại liên hệ" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Email tiếp nhận" name="contact_email">
                            <Input placeholder="Nhập email liên hệ" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Kênh tiếp nhận" name="source_channel">
                            <Select options={JOURNEY_SOURCE_CHANNEL_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Loại dịch vụ yêu cầu" name="requested_service">
                            <Input placeholder="Ví dụ: Sơn epoxy sàn kho" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Địa chỉ công trình" name="site_address">
                            <Input placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Mô tả yêu cầu" name="request_description">
                            <TextArea rows={4} placeholder="Ghi nhận đầy đủ nhu cầu, bối cảnh công trình và các yêu cầu đặc biệt." />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <Title level={5}>Điều phối Sale và pipeline</Title>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Quy trình bán hàng" name="sales_pipeline_id">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                placeholder="Chọn quy trình bán hàng"
                                options={pipelineOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Giai đoạn bán hàng" name="sales_stage_id">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                placeholder="Chọn giai đoạn bán hàng"
                                options={stageOptions}
                                onChange={handleStageChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Phụ trách kinh doanh" name="sales_owner_user">
                            <Input placeholder="Nhập username phụ trách kinh doanh" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Chủ sở hữu hành trình" name="owner_user_id">
                            <Input placeholder="Nhập username chủ sở hữu hành trình" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Bước hiện tại" name="current_step">
                            <Select options={JOURNEY_STEP_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Go / No-Go" name="go_no_go_status">
                            <Select options={JOURNEY_GO_NO_GO_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Độ ưu tiên" name="priority">
                            <Select options={JOURNEY_PRIORITY_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Trạng thái SLA" name="sla_status">
                            <Select options={JOURNEY_SLA_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Khảo sát" name="survey_status">
                            <Select options={JOURNEY_SURVEY_STATUS_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Báo giá" name="quote_status">
                            <Select options={JOURNEY_QUOTE_STATUS_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Triển khai" name="project_status">
                            <Select options={JOURNEY_PROJECT_STATUS_OPTIONS} />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <Title level={5}>Thông tin bàn giao cho delivery</Title>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="PM triển khai" name="delivery_pm_user">
                            <Input placeholder="Nhập username PM triển khai" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Giám sát triển khai" name="delivery_supervisor_user">
                            <Input placeholder="Nhập username giám sát triển khai" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Ngày bắt đầu dự kiến" name="planned_start_date">
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Ngày kết thúc dự kiến" name="planned_end_date">
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Ghi chú triển khai" name="delivery_note">
                            <TextArea rows={3} placeholder="Ghi chú handoff, cam kết với khách hàng hoặc lưu ý cho delivery." />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default JourneyUpsertDrawer;
