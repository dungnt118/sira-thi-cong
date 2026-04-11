import React from 'react';
import {
    Button,
    Col,
    DatePicker,
    Drawer,
    Form,
    Input,
    Row,
    Select,
    Space,
    Typography,
} from 'antd';
import dayjs from 'dayjs';
import type {
    ICreateCustomerInput,
    ICustomer,
    CustomerMarriageStateEnum2,
    CustomerSexEnum2,
} from '../../../../services/core-contracts/types/customer.types';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface CustomerUpsertDrawerProps {
    open: boolean;
    mode: 'create' | 'edit';
    customer?: ICustomer | null;
    saving?: boolean;
    onCancel: () => void;
    onSubmit: (payload: ICreateCustomerInput) => Promise<void> | void;
}

const sexOptions: { value: CustomerSexEnum2; label: string }[] = [
    { value: 'mail', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'none', label: 'Chưa xác định' },
];

const marriageOptions: { value: CustomerMarriageStateEnum2; label: string }[] = [
    { value: 'single', label: 'Độc thân' },
    { value: 'marriaged', label: 'Đã kết hôn' },
    { value: 'children', label: 'Có con' },
];

const mapCustomerToForm = (customer?: ICustomer | null) => ({
    code: customer?.code,
    full_name: customer?.full_name,
    phone: customer?.phone,
    email: customer?.email,
    zalo: customer?.zalo,
    province: customer?.province,
    city: customer?.city,
    ward: customer?.ward,
    address: customer?.address,
    assigned_pm_id: customer?.assigned_pm_id,
    sex: customer?.sex || 'none',
    marriage_state: customer?.marriage_state,
    bod: customer?.bod ? dayjs(customer.bod) : undefined,
    notes: customer?.notes,
});

const normalizePayload = (values: Record<string, any>): ICreateCustomerInput => ({
    ...values,
    bod: values.bod ? values.bod.toISOString() : undefined,
});

const CustomerUpsertDrawer: React.FC<CustomerUpsertDrawerProps> = ({
    open,
    mode,
    customer,
    saving = false,
    onCancel,
    onSubmit,
}) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (!open) {
            return;
        }

        form.setFieldsValue(mapCustomerToForm(customer));
    }, [open, customer, form]);

    const handleSubmit = async () => {
        const values = await form.validateFields();
        await onSubmit(normalizePayload(values));
        form.resetFields();
    };

    return (
        <Drawer
            title={mode === 'create' ? 'Tạo khách hàng' : 'Cập nhật khách hàng'}
            placement="right"
            width={680}
            open={open}
            onClose={onCancel}
            destroyOnClose
            extra={
                <Space>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button type="primary" loading={saving} onClick={handleSubmit}>
                        {mode === 'create' ? 'Tạo khách hàng' : 'Lưu thay đổi'}
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical">
                <Title level={5} style={{ marginTop: 0 }}>
                    Thông tin định danh
                </Title>
                <Text type="secondary">
                    Quản lý hồ sơ khách hàng phục vụ Sale, tạo yêu cầu dịch vụ và theo dõi công trình.
                </Text>

                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col xs={24} md={10}>
                        <Form.Item label="Mã khách hàng" name="code">
                            <Input placeholder="Ví dụ: KH-2026-001" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={14}>
                        <Form.Item
                            label="Họ và tên"
                            name="full_name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên khách hàng' }]}
                        >
                            <Input placeholder="Nhập họ và tên khách hàng" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Điện thoại liên hệ"
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại liên hệ' }]}
                        >
                            <Input placeholder="Nhập số điện thoại liên hệ" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Email" name="email">
                            <Input placeholder="Nhập email khách hàng" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Zalo" name="zalo">
                            <Input placeholder="Nhập số Zalo" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="PM phụ trách" name="assigned_pm_id">
                            <Input placeholder="Nhập username phụ trách nội bộ" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Giới tính" name="sex">
                            <Select options={sexOptions} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Tình trạng hôn nhân" name="marriage_state">
                            <Select allowClear options={marriageOptions} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Năm sinh" name="bod">
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                </Row>

                <Title level={5}>Địa chỉ và ghi chú</Title>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Tỉnh / thành phố"
                            name="province"
                            rules={[{ required: true, message: 'Vui lòng nhập tỉnh / thành phố' }]}
                        >
                            <Input placeholder="Nhập tỉnh / thành phố" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Thành phố" name="city">
                            <Input placeholder="Nhập thành phố" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Phường / xã"
                            name="ward"
                            rules={[{ required: true, message: 'Vui lòng nhập phường / xã' }]}
                        >
                            <Input placeholder="Nhập phường / xã" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Địa chỉ chi tiết" name="address">
                            <Input placeholder="Nhập địa chỉ chi tiết" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Ghi chú CRM" name="notes">
                            <TextArea
                                rows={4}
                                placeholder="Ghi chú thêm về nhu cầu, lịch sử làm việc hoặc đặc điểm khách hàng."
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default CustomerUpsertDrawer;
