import React from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber } from 'antd';
import type { JourneyStepDef } from '../../../types/journey';

interface StepConfigModalProps {
    open: boolean;
    initialData: JourneyStepDef | null;
    onSave: (values: any) => void;
    onCancel: () => void;
}

const StepConfigModal: React.FC<StepConfigModalProps> = ({ open, initialData, onSave, onCancel }) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (open) {
            form.setFieldsValue(initialData || {
                is_enabled: true,
                publish_flag: false,
                sla_hours: 0
            });
        }
    }, [open, initialData, form]);

    return (
        <Modal
            title={initialData ? 'Cấu hình bước' : 'Thêm bước mới'}
            open={open}
            onCancel={onCancel}
            onOk={() => {
                form.validateFields().then(values => {
                    onSave(values);
                });
            }}
            width={800}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="step_name" label="Tên bước" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="step_code" label="Mã bước" rules={[{ required: true }]}>
                    <Input disabled={!!initialData} />
                </Form.Item>
                <Form.Item name="step_goal" label="Mục tiêu">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="publish_flag" label="Portal công khai" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item name="sla_hours" label="SLA (giờ)">
                    <InputNumber min={0} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default StepConfigModal;
