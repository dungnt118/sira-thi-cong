import React, { useState, useEffect } from 'react';
import {
    Modal, Form, Input, Select, DatePicker,
    Upload, Button, message, Space, Typography, Switch,
    Row, Col,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadProps } from 'antd';
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
import { classifyJourneyFile, resolveJourneyFileHref } from '../../utils/journeyDocumentFileDisplay';
import { useFileUpload } from '../files/useFileUpload';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

const { TextArea } = Input;
const { Text } = Typography;

export interface CreateJourneyDocumentModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: (doc: IJourneyDocument) => void;
    journeyId: string;
    /** Mã bước journey (vd. `current_step`) — tự điền "Giai đoạn/Bước" khi thêm mới */
    stepCode?: string | null;
    editingDoc?: IJourneyDocument | null;
}

export const CreateJourneyDocumentModal: React.FC<CreateJourneyDocumentModalProps> = ({
    open, onCancel, onSuccess, journeyId, stepCode, editingDoc,
}) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { getUploadConfig, parseUploadResponse } = useFileUpload();
    const uploadConfig = getUploadConfig();

    const withResolvedPreviewUrls = (list: UploadFile[]): UploadFile[] =>
        list.map((f) => {
            if (f.status === 'done' && f.response) {
                const std = parseUploadResponse(f.response);
                const href = resolveJourneyFileHref(std as HeadlessFileUpload);
                return { ...f, url: href ?? f.url };
            }
            return f;
        });

    useEffect(() => {
        if (open) {
            if (editingDoc) {
                form.setFieldsValue({
                    description: editingDoc.description,
                    doc_type: editingDoc.doc_type,
                    is_published: editingDoc.is_published,

                    published_at: editingDoc.published_at ? dayjs(editingDoc.published_at) : null,
                    journey_step_code: editingDoc.journey_step_code,
                });
                if (editingDoc.files?.length) {
                    setFileList(
                        editingDoc.files.map((f, i) => ({
                            uid: String(f.file_id || `existing-${i}`),
                            name: f.name || 'Tài liệu',
                            status: 'done',
                            url: resolveJourneyFileHref(f),
                            response: f,
                        })),
                    );
                } else {
                    setFileList([]);
                }
            } else {
                const step = stepCode && String(stepCode).trim() ? String(stepCode).trim() : undefined;
                form.resetFields();
                form.setFieldsValue({
                    doc_type: 'quotation',
                    is_published: true,
                    published_at: dayjs(),
                    ...(step ? { journey_step_code: step } : {}),
                });
                setFileList([]);
            }

        }
    }, [open, editingDoc, form, stepCode]);

    const uploadIconRender: UploadProps['iconRender'] = (file) => {
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

    const handleUploadChange: UploadProps['onChange'] = ({ fileList: next }) => {
        setFileList(withResolvedPreviewUrls(next));
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (fileList.length === 0) {
                message.error('Vui lòng đính kèm ít nhất một file.');
                return;
            }
            if (fileList.some((f) => f.status === 'uploading')) {
                message.warning('Vui lòng đợi file tải lên xong.');
                return;
            }
            if (fileList.some((f) => f.status === 'error')) {
                message.error('Có file tải lên thất bại.');
                return;
            }

            setIsSubmitting(true);

            const mappedFiles = fileList
                .filter((f) => f.status === 'done')
                .map((f) => {
                    const std = f.response ? parseUploadResponse(f.response) : null;
                    return {
                        name: f.name || std?.name || 'Tài liệu',
                        url: std?.url,
                        file_id: std?.file_id,
                        file_path: std?.file_path,
                        file_type: std?.file_type,
                        mime_type: std?.mime_type,
                    };
                });

            const hasInvalid = mappedFiles.some((m) => {
                const u = m.url ? String(m.url) : '';
                return !m.file_id && !m.file_path && (!u || u.startsWith('blob:'));
            });
            if (hasInvalid) {
                message.error('Một số file chưa có định danh từ máy chủ. Hãy tải lên lại hoặc kiểm tra cấu hình upload.');
                setIsSubmitting(false);
                return;
            }

            const docData = {
                ...values,
                journey_id: journeyId,
                files: mappedFiles,
                published_at: values.published_at?.toISOString(),
            };

            let res;
            if (editingDoc) {
                res = await journeyDocumentService.updateJourneyDocument(editingDoc._id, docData);
                message.success('Đã cập nhật tài liệu thành công!');
            } else {
                res = await journeyDocumentService.createJourneyDocument(docData as any);
                message.success('Đã thêm tài liệu mới!');
            }

            onSuccess(res);
            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error('Submit document error:', error);
            message.error('Lỗi khi lưu tài liệu: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title={editingDoc ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={isSubmitting}
            width={600}
            destroyOnHidden
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Mô tả tài liệu" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                    <TextArea rows={3} placeholder="VD: Báo giá chống thấm sân thượng..." />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Giai đoạn/Bước" name="journey_step_code">
                            <Select placeholder="Chọn bước (nếu có)" allowClear>
                                <Select.Option value="lead_new">1. Tiếp nhận</Select.Option>
                                <Select.Option value="consult_contact">2. Tư vấn & Hẹn lịch</Select.Option>
                                <Select.Option value="site_survey">3. Khảo sát</Select.Option>
                                <Select.Option value="solution_design">4. Thiết kế giải pháp</Select.Option>
                                <Select.Option value="quotation">5. Báo giá</Select.Option>
                                <Select.Option value="contract">6. Hợp đồng</Select.Option>
                                <Select.Option value="execution">7. Thi công</Select.Option>
                                <Select.Option value="final_acceptance">8. Nghiệm thu bàn giao</Select.Option>
                                <Select.Option value="payment">9. Thanh toán</Select.Option>
                                <Select.Option value="maintenance">10. Bảo trì</Select.Option>
                                <Select.Option value="warranty">11. Bảo hành</Select.Option>
                                <Select.Option value="after_sales">12. Chăm sóc sau bán</Select.Option>

                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Phân loại" name="doc_type" rules={[{ required: true }]}>
                            <Select
                                options={[
                                    { value: 'survey_report', label: 'Báo cáo khảo sát' },
                                    { value: 'site_photos', label: 'Ảnh hiện trạng' },
                                    { value: 'solution_doc', label: 'Thiết kế giải pháp' },
                                    { value: 'business_plan', label: 'Phương án' },
                                    { value: 'quotation', label: 'Báo giá' },
                                    { value: 'contract', label: 'Hợp đồng' },
                                    { value: 'advance_request', label: 'Yêu cầu tạm ứng' },
                                    { value: 'stage_acceptance', label: 'Nghiệm thu GĐ' },
                                    { value: 'stage_payment_proof', label: 'Chứng từ TT' },
                                    { value: 'final_acceptance', label: 'Bàn giao' },
                                    { value: 'payment_receipt', label: 'Hóa đơn / Phiếu thu' },
                                    { value: 'maintenance_record', label: 'Biên bản bảo trì' },
                                    { value: 'warranty_record', label: 'Biên bản bảo hành' },
                                    { value: 'after_sales_note', label: 'Hậu mãi' },
                                ]}
                            />
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
                        action={uploadConfig.action}
                        headers={uploadConfig.headers}
                        onChange={handleUploadChange}
                        multiple
                        iconRender={uploadIconRender}
                        showUploadList={{ showRemoveIcon: true }}
                    >
                        <Button icon={<UploadOutlined />}>Tải lên file (PDF, Docx, Image...)</Button>
                    </Upload>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        File được đẩy lên máy chủ (UPLOAD_URL); không dùng liên kết blob tạm. Xem/tải qua cấu hình FILE_PREVIEW_URL.
                    </Text>
                </Form.Item>
            </Form>
        </Modal>
    );
};
