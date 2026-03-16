import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Row, Col, Button, Card, Divider, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { JourneyStepDef } from '../../../types/journey';

const { TextArea } = Input;

interface StepConfigModalProps {
    open: boolean;
    initialData: JourneyStepDef | null;
    onSave: (values: any) => void;
    onCancel: () => void;
}

const PROCEDURE_GROUPS = [
    { value: 'GRP_01_INFO', label: '1. Thông tin khách hàng' },
    { value: 'GRP_02_CONTACT', label: '2. Liên hệ / Tư vấn' },
    { value: 'GRP_03_SURVEY', label: '3. Khảo sát' },
    { value: 'GRP_04_SOLUTION', label: '4. Xây Dựng Giải pháp' },
    { value: 'GRP_05_QUOTE', label: '5. Báo giá' },
    { value: 'GRP_06_CONTRACT', label: '6. Làm hợp đồng' },
    { value: 'GRP_07_DEPOSIT', label: '7. Tạm ứng' },
    { value: 'GRP_08_CONSTRUCT', label: '8. Triển khai' },
    { value: 'GRP_09_ACCEPTANCE', label: '9. Nghiệm Thu' },
    { value: 'GRP_10_PAYMENT', label: '10. Thanh Toán' },
    { value: 'GRP_11_MAINTAIN', label: '11. Bảo trì' },
    { value: 'GRP_12_WARRANTY', label: '12. Bảo hành' },
    { value: 'GRP_13_CSKH', label: '13. CSKH sau công trình' },
    { value: 'GRP_14_CUSTOM', label: '14. Tùy chỉnh (Custom)' },
];

const ROLES_LIST = [
    { value: 'Sale', label: 'Sale / Tư vấn' },
    { value: 'PM', label: 'PM (Dự án)' },
    { value: 'giam-sat', label: 'Giám sát / Thi công' },
    { value: 'ky-thuat', label: 'Kỹ thuật / Kế hoạch' },
    { value: 'ke-toan', label: 'Kế toán / Tài chính' },
];

const StepConfigModal: React.FC<StepConfigModalProps> = ({ open, initialData, onSave, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue(initialData);
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form]);

    const handleOk = () => {
        form.validateFields().then(values => {
            onSave(values);
        });
    };

    return (
        <Modal
            title={initialData ? 'Chỉnh sửa Cấu hình Bước' : 'Thêm Bước Mới'}
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            okText="Lưu Cấu Hình"
            cancelText="Hủy"
            width={800}
            style={{ top: 20 }}
            maskClosable={false}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Mã Step" name="step_code" rules={[{ required: true }]}>
                            <Input placeholder="VD: INTAKE" disabled={!!initialData} />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item label="Tên Bước" name="step_name" rules={[{ required: true }]}>
                            <Input placeholder="VD: Tiếp nhận thông tin" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={16}>
                        <Form.Item label="Mục tiêu của Bước" name="step_goal" rules={[{ required: true }]}>
                            <TextArea rows={2} placeholder="Mô tả mục tiêu..." />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Nhóm Quy trình Chuẩn" name="standardProcedureGroupCd" rules={[{ required: true }]}>
                            <Select options={PROCEDURE_GROUPS} placeholder="Chọn nhóm chuẩn..." />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Publish Portal (Mở cho Khách xem)" name="publish_flag" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Divider style={{ margin: '12px 0' }} />
                <h3>Cấu hình Vai trò tham gia (Sub-workflow)</h3>

                <Form.List name="roleConfigurations">
                    {(fields, { add, remove }) => (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {fields.map((field, index) => (
                                <Card
                                    size="small"
                                    key={field.key}
                                    title={`Vai trò ${index + 1}`}
                                    extra={
                                        <Popconfirm title="Xóa vai trò này?" onConfirm={() => remove(field.name)}>
                                            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                                        </Popconfirm>
                                    }
                                    style={{ background: '#f8f9fa', border: '1px solid #d9d9d9' }}
                                >
                                    <Row gutter={12}>
                                        <Col span={8}>
                                            <Form.Item {...field} name={[field.name, 'roleId']} label="Chọn Role" rules={[{ required: true }]}>
                                                <Select options={ROLES_LIST} placeholder="Vai trò..." />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item {...field} name={[field.name, 'slaHours']} label="SLA Xử lý (Giờ)" rules={[{ required: true }]}>
                                                <Input type="number" placeholder="24" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item {...field} name={[field.name, 'dependencyRole']} label="Điều kiện bắt đầu">
                                                <Select options={[{ value: null, label: 'Bắt đầu ngay' }, ...ROLES_LIST]} placeholder="Bắt đầu ngay" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={12}>
                                        <Col span={18}>
                                            <Form.Item {...field} name={[field.name, 'instructions']} label="Hướng dẫn / Nhiệm vụ cụ thể">
                                                <TextArea rows={2} placeholder="Ví dụ: Lên danh sách vật tư cần dùng" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item {...field} name={[field.name, 'isKeyRole']} valuePropName="checked" label="Vai trò chốt?">
                                                <Switch checkedChildren="Có" unCheckedChildren="Ko" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.List name={[field.name, 'checklists']}>
                                        {(checklistFields, { add: addChecklist, remove: removeChecklist }) => (
                                            <div>
                                                <div style={{ marginBottom: 4, fontWeight: 500 }}>Checklist Bắt Buộc</div>
                                                {checklistFields.map((chkField, chkIndex) => (
                                                    <div key={chkField.key} style={{ display: 'flex', marginBottom: 8, gap: 8 }}>
                                                        <Form.Item
                                                            {...chkField}
                                                            noStyle
                                                        >
                                                            <Input placeholder={`Việc ${chkIndex + 1}`} />
                                                        </Form.Item>
                                                        <Button danger icon={<DeleteOutlined />} onClick={() => removeChecklist(chkField.name)} />
                                                    </div>
                                                ))}
                                                <Button type="dashed" onClick={() => addChecklist()} icon={<PlusOutlined />} size="small">
                                                    Thêm việc
                                                </Button>
                                            </div>
                                        )}
                                    </Form.List>
                                </Card>
                            ))}
                            <Button type="dashed" onClick={() => add({ isKeyRole: false, checklists: [''] })} block icon={<PlusOutlined />}>
                                Bổ sung Vai trò tham gia Bước
                            </Button>
                        </div>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default StepConfigModal;
