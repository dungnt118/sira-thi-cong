import React from 'react';
import { Modal, Form, Input, InputNumber, message, Space, Button, Alert } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { siteReportService } from '../../services/core-contracts/services/siteReport.service';
import { UploadFiles } from '../files/UploadFiles';

const { TextArea } = Input;

export interface CreateSiteReportModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    journeyId: string;
    stepCode: string;
    taskId?: string;
    taskTitle?: string;
}

export const CreateSiteReportModal: React.FC<CreateSiteReportModalProps> = ({
    open,
    onCancel,
    onSuccess,
    journeyId,
    stepCode,
    taskId,
    taskTitle
}) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleFinish = async (values: any) => {
        setIsSubmitting(true);
        try {
            await siteReportService.createSiteReport({
                journey_id: journeyId,
                journey_step_code: stepCode as any,
                worktaskId: taskId,
                title: values.title || `Báo cáo công việc: ${taskTitle || stepCode}`,
                content: values.content,
                progress_pct: values.progress_pct || 0,
                medias: values.medias || []
            });

            message.success('Đã tạo báo cáo mới thành công!');
            form.resetFields();
            onSuccess();
        } catch (error) {
            console.error('Failed to create site report:', error);
            message.error('Lỗi khi tạo báo cáo: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title={taskTitle ? `Tạo báo cáo cho: ${taskTitle}` : 'Tạo báo cáo hiện trường'}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={isSubmitting}
            width={700}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ 
                    progress_pct: 0,
                    title: taskTitle ? `Báo cáo: ${taskTitle}` : undefined
                }}
            >
                <Alert 
                    type="info" 
                    showIcon 
                    message={`Tạo nhật ký thi công cho giai đoạn "${stepCode}".`}
                    style={{ marginBottom: 16 }}
                />

                <Form.Item label="Tiêu đề báo cáo" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                    <Input placeholder="Ví dụ: Hoàn thành khảo sát mặt bằng..." />
                </Form.Item>

                <Form.Item label="Tiến độ (%)" name="progress_pct">
                    <InputNumber min={0} max={100} addonAfter="%" style={{ width: 150 }} />
                </Form.Item>

                <Form.Item label="Nội dung chi tiết" name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                    <TextArea rows={4} placeholder="Mô tả kết quả công việc, các vấn đề phát sinh nếu có..." />
                </Form.Item>

                <Form.Item label="Hình ảnh minh chứng" name="medias">
                    <UploadFiles />
                </Form.Item>
            </Form>
        </Modal>
    );
};
