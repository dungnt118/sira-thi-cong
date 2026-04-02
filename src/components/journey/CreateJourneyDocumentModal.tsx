import React, { useState, useEffect } from 'react';
import { 
    Modal, Form, Input, Select, DatePicker, 
    Upload, Button, message, Space, Typography, Switch,
    Row, Col
} from 'antd';
import {
    UploadOutlined,
    FilePdfOutlined,
    FileImageOutlined,
    VideoCameraOutlined,
    FileOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { journeyDocumentService } from '../../services/core-contracts/services/journeyDocument.service';
import { IJourneyDocument } from '../../services/core-contracts/types/journeyDocument.types';
import { classifyJourneyFile } from '../../utils/journeyDocumentFileDisplay';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Text } = Typography;

export interface CreateJourneyDocumentModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: (doc: IJourneyDocument) => void;
    journeyId: string;
    stepCode?: string;
    editingDoc?: IJourneyDocument | null;
}

export const CreateJourneyDocumentModal: React.FC<CreateJourneyDocumentModalProps> = ({
    open, onCancel, onSuccess, journeyId, stepCode, editingDoc
}) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            if (editingDoc) {
                form.setFieldsValue({
                    description: editingDoc.description,
                    context_type: editingDoc.context_type,
                    is_published: editingDoc.is_published,
                    published_at: editingDoc.published_at ? dayjs(editingDoc.published_at) : null,
                    journey_step_code: editingDoc.journey_step_code
                });
                if (editingDoc.files) {
                    setFileList(editingDoc.files.map((f, i) => ({
                        uid: i.toString(),
                        name: f.name || 'Tài liệu',
                        status: 'done',
                        url: f.url,
                        originFileObj: f
                    })));
                }
            } else {
                form.resetFields();
                form.setFieldsValue({
                    context_type: 'general',
                    is_published: true,
                    published_at: dayjs(),
                    journey_step_code: stepCode
                });
                setFileList([]);
            }
        }
    }, [open, editingDoc, form, stepCode]);

    const uploadIconRender = (file: UploadFile) => {
        const kind = classifyJourneyFile({
            name: file.name,
            url: typeof file.url === 'string' ? file.url : undefined,
            mime_type:
                file.originFileObj && typeof (file.originFileObj as File).type === 'string'
                    ? (file.originFileObj as File).type
                    : undefined,
        });
        if (kind === 'pdf') return <FilePdfOutlined style={{ color: '#f5222d' }} />;
        if (kind === 'image') return <FileImageOutlined style={{ color: '#52c41a' }} />;
        if (kind === 'video') return <VideoCameraOutlined style={{ color: '#fa8c16' }} />;
        return <FileOutlined style={{ color: '#1890ff' }} />;
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setIsSubmitting(true);

            const mappedFiles = fileList.map(f => {
                if (f.url) return { url: f.url, name: f.name };
                // In a real app, you would handle the upload to S3/Cloudinary here
                // For this demo/skeleton, we'll mock the URL if it's a new file
                return { 
                    url: URL.createObjectURL(f.originFileObj as any), 
                    name: f.name 
                };
            });

            const docData = {
                ...values,
                journey_id: journeyId,
                files: mappedFiles,
                published_at: values.published_at?.toISOString()
            };

            let res;
            if (editingDoc) {
                res = await journeyDocumentService.updateJourneyDocument(editingDoc._id, docData);
                message.success("Đã cập nhật tài liệu thành công!");
            } else {
                res = await journeyDocumentService.createJourneyDocument(docData as any);
                message.success("Đã thêm tài liệu mới!");
            }

            onSuccess(res);
            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error("Submit document error:", error);
            message.error("Lỗi khi lưu tài liệu: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title={editingDoc ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={isSubmitting}
            width={600}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Mô tả tài liệu" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                    <TextArea rows={3} placeholder="VD: Báo giá chống thấm sân thượng..." />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Giai đoạn/Bước" name="journey_step_code">
                            <Select placeholder="Chọn bước (nếu có)" allowClear>
                                <Select.Option value="lead_intake">Tiếp nhận thông tin</Select.Option>
                                <Select.Option value="qualification">Đủ điều kiện</Select.Option>
                                <Select.Option value="survey_planning">Lên lịch khảo sát</Select.Option>
                                <Select.Option value="site_survey">Khảo sát hiện trường</Select.Option>
                                <Select.Option value="survey_review">Duyệt khảo sát</Select.Option>
                                <Select.Option value="estimate_preparation">Lập dự toán</Select.Option>
                                <Select.Option value="quotation_preparation">Lập báo giá</Select.Option>
                                <Select.Option value="quotation_sent">Đã gửi báo giá</Select.Option>
                                <Select.Option value="quotation_approved">Duyệt báo giá</Select.Option>
                                <Select.Option value="contract_signing">Ký hợp đồng</Select.Option>
                                <Select.Option value="project_execution">Thi công</Select.Option>
                                <Select.Option value="handover_acceptance">Nghiệm thu/Bàn giao</Select.Option>
                                <Select.Option value="warranty_aftercare">Bảo hành/Hậu mãi</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Phân loại" name="context_type" rules={[{ required: true }]}>
                            <Select options={[
                                { value: 'survey', label: 'Tài liệu Khảo sát' },
                                { value: 'quotation', label: 'Báo giá / Dự toán' },
                                { value: 'contract', label: 'Hợp đồng / PLHĐ' },
                                { value: 'progress', label: 'Tiến độ / Báo cáo' },
                                { value: 'payment', label: 'Chứng từ Thanh toán' },
                                { value: 'general', label: 'Tài liệu chung' },
                            ]} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Ngày ban hành" name="published_at">
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Publish lên Portal?" name="is_published" valuePropName="checked">
                            <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Đính kèm file" required>
                    <Upload
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={() => false} // Manual upload
                        multiple
                        iconRender={uploadIconRender}
                        showUploadList={{ showRemoveIcon: true }}
                    >
                        <Button icon={<UploadOutlined />}>Tải lên file (PDF, Docx, Image...)</Button>
                    </Upload>
                    <Text type="secondary" style={{ fontSize: 12 }}>Cho phép đính kèm nhiều file tài liệu.</Text>
                </Form.Item>
            </Form>
        </Modal>
    );
};
