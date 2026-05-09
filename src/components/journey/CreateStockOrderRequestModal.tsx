import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Select,
    Space,
    Typography,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { stockOrderService } from '../../services/core-contracts/services/stockOrder.service';
import {
    ItemsUnitEnum,
    StockOrderJourneyStepCodeEnum,
} from '../../services/core-contracts/types/stockOrder.types';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * Wave 2 — W2-04. Header CTA "Đề xuất nhập kho" / "Đề xuất xuất kho" cho GS/KYT/PM.
 *
 * Backend gộp StockRequest vào StockOrder (gap-analysis 2026-05-08). Form này tạo
 * một StockOrder với `status='requested'` để gửi vào pipeline duyệt của KT.
 */
export interface CreateStockOrderRequestModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    journeyId: string;
    journeyName?: string;
    journeyCode?: string;
    journeyCurrentStep?: StockOrderJourneyStepCodeEnum;
    /** 'in' = đề xuất nhập kho từ NCC; 'out' = đề xuất xuất kho ra công trình. */
    type: 'in' | 'out';
}

const UNIT_OPTIONS: Array<{ value: ItemsUnitEnum; label: string }> = [
    { value: 'kg', label: 'Kg' },
    { value: 'lit', label: 'Lít' },
    { value: 'm2', label: 'm²' },
    { value: 'thung', label: 'Thùng' },
    { value: 'cuon', label: 'Cuộn' },
    { value: 'cai', label: 'Cái' },
];

export const CreateStockOrderRequestModal: React.FC<CreateStockOrderRequestModalProps> = ({
    open,
    onCancel,
    onSuccess,
    journeyId,
    journeyName,
    journeyCode,
    journeyCurrentStep,
    type,
}) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                journey_step_code: journeyCurrentStep || 'execution',
                items: [{ material_name: '', unit: 'cai', requested_quantity: 1 }],
            });
        }
    }, [open, journeyCurrentStep, form]);

    const handleFinish = async (values: any) => {
        setIsSubmitting(true);
        try {
            const items = (values.items || []).filter((it: any) => it && it.material_name);
            if (items.length === 0) {
                message.warning('Vui lòng thêm ít nhất một vật tư.');
                setIsSubmitting(false);
                return;
            }
            await stockOrderService.createStockOrder({
                type,
                status: 'requested',
                journey_id: journeyId,
                journey_code: journeyCode,
                journey_name: journeyName,
                journey_source_id: journeyId,
                journey_step_code: values.journey_step_code,
                source: type === 'in' ? 'distributor' : 'journey',
                supplier: type === 'in' ? values.supplier : undefined,
                request_reason: values.request_reason,
                notes: values.notes,
                items: items.map((it: any) => ({
                    material_id: it.material_id,
                    material_name: it.material_name,
                    unit: it.unit,
                    requested_quantity: it.requested_quantity,
                    discrepancy_note: it.note,
                })),
            });
            message.success(
                type === 'in'
                    ? 'Đã gửi đề xuất nhập kho. KT sẽ duyệt trong pipeline.'
                    : 'Đã gửi đề xuất xuất kho. KT sẽ duyệt trong pipeline.',
            );
            form.resetFields();
            onSuccess();
        } catch (e) {
            message.error('Không tạo được đề xuất: ' + (e instanceof Error ? e.message : 'lỗi không xác định'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title={type === 'in' ? 'Đề xuất nhập kho' : 'Đề xuất xuất kho'}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={isSubmitting}
            destroyOnHidden
            width={780}
            okText="Gửi duyệt"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    journey_step_code: journeyCurrentStep || 'execution',
                    items: [{ material_name: '', unit: 'cai', requested_quantity: 1 }],
                }}
            >
                <Alert
                    type="info"
                    showIcon
                    message={
                        type === 'in'
                            ? `Đề xuất nhập kho cho công trình "${journeyName || journeyCode || journeyId}". Sau khi gửi, KT duyệt → Thủ kho nhập → GS xác nhận nhận hàng.`
                            : `Đề xuất xuất kho cho công trình "${journeyName || journeyCode || journeyId}". Sau khi gửi, KT duyệt → Thủ kho xuất → GS hiện trường xác nhận đã nhận.`
                    }
                    style={{ marginBottom: 16 }}
                />

                {type === 'in' && (
                    <Form.Item label="Nhà cung cấp (nếu có)" name="supplier">
                        <Input placeholder="Tên NCC / Đại lý phân phối" />
                    </Form.Item>
                )}

                <Form.Item
                    label="Lý do đề xuất"
                    name="request_reason"
                    rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
                >
                    <TextArea rows={2} placeholder="VD: Hết vật tư xi măng cho hạng mục móng — cần bổ sung 50 bao" />
                </Form.Item>

                <Form.Item label="Ghi chú thêm" name="notes">
                    <TextArea rows={2} placeholder="(không bắt buộc)" />
                </Form.Item>

                <Text strong>Danh sách vật tư đề xuất</Text>
                <Form.List name="items">
                    {(fields, { add, remove }) => (
                        <div style={{ marginTop: 8 }}>
                            {fields.map((field) => (
                                <Row key={field.key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                                    <Col span={8}>
                                        <Form.Item
                                            name={[field.name, 'material_name']}
                                            rules={[{ required: true, message: 'Tên vật tư' }]}
                                            style={{ margin: 0 }}
                                        >
                                            <Input placeholder="Tên vật tư" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name={[field.name, 'unit']} style={{ margin: 0 }}>
                                            <Select options={UNIT_OPTIONS} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            name={[field.name, 'requested_quantity']}
                                            rules={[{ required: true, type: 'number', min: 0.01 }]}
                                            style={{ margin: 0 }}
                                        >
                                            <InputNumber min={0} placeholder="SL" style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item name={[field.name, 'note']} style={{ margin: 0 }}>
                                            <Input placeholder="Ghi chú" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2} style={{ textAlign: 'center' }}>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => remove(field.name)}
                                            disabled={fields.length === 1}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Space>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => add({ material_name: '', unit: 'cai', requested_quantity: 1 })}
                                >
                                    Thêm vật tư
                                </Button>
                            </Space>
                        </div>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default CreateStockOrderRequestModal;
