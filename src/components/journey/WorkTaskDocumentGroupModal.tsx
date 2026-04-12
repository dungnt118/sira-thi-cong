import React, { useMemo, useState, useEffect } from 'react';
import {
    Button,
    Collapse,
    Form,
    Input,
    Modal,
    Space,
    Typography,
    DatePicker,
    Switch,
    Row,
    Col,
} from 'antd';
import { UploadFiles } from '../files/UploadFiles';
import dayjs from 'dayjs';
import { journeyDocumentService } from '../../services/core-contracts/services/journeyDocument.service';
import type { IJourneyDocument } from '../../services/core-contracts/types/journeyDocument.types';
import type { IActionsItem } from '../../services/core-contracts/types/workTask.types';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const DOC_TYPE_LABELS: Record<string, string> = {
    survey_report: 'Biên bản khảo sát',
    site_photos: 'Ảnh hiện trạng',
    solution_doc: 'Hồ sơ giải pháp',
    business_plan: 'Kế hoạch kinh doanh',
    quotation: 'Báo giá',
    contract: 'Hợp đồng',
    advance_request: 'Đề nghị tạm ứng',
    stage_acceptance: 'Nghiệm thu giai đoạn',
    stage_payment_proof: 'Chứng từ thanh toán giai đoạn',
    final_acceptance: 'Nghiệm thu cuối',
    payment_receipt: 'Phiếu thu / chứng từ thanh toán',
    maintenance_record: 'Biên bản bảo trì',
    warranty_record: 'Biên bản bảo hành',
    after_sales_note: 'Ghi chú sau bán',
};

export interface DocTypePanelSpec {
    doc_type: string;
    actions: IActionsItem[];
    minCount: number;
}

export function groupDocumentActionsByDocType(actions: IActionsItem[]): DocTypePanelSpec[] {
    const m = new Map<string, IActionsItem[]>();
    for (const a of actions) {
        const dt = (a.doc_type && String(a.doc_type)) || 'unknown';
        if (!m.has(dt)) m.set(dt, []);
        m.get(dt)!.push(a);
    }
    return [...m.entries()].map(([doc_type, acts]) => ({
        doc_type,
        actions: acts,
        minCount: Math.max(
            1,
            ...acts.map((x) => (typeof x.min_count === 'number' && x.min_count > 0 ? x.min_count : 1))
        ),
    }));
}

export interface WorkTaskDocumentGroupModalProps {
    open: boolean;
    onCancel: () => void;
    journeyId: string;
    worktaskId: string;
    stepCode?: string | null;
    /** Chỉ các action require_document đã gom. */
    actions: IActionsItem[];
    /** Sau mỗi lần tạo tài liệu thành công (refetch + kiểm tra hoàn thành nhiệm vụ ở parent). */
    onDocumentsChanged?: () => void | Promise<void>;
}

const DocumentPanel: React.FC<{
    spec: DocTypePanelSpec;
    journeyId: string;
    worktaskId: string;
    stepCode?: string | null;
    onSaved: () => void | Promise<void>;
}> = ({ spec, journeyId, worktaskId, stepCode, onSaved }) => {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [currentDocId, setCurrentDocId] = useState<string | null>(null);





    // Load existing document for this worktaskId + doc_type
    useEffect(() => {
        let active = true;
        const loadInitial = async () => {
            if (!journeyId || !worktaskId || !spec.doc_type) return;
            try {
                const res = await journeyDocumentService.queryJourneyDocumentsDto({
                    group: {
                        op: 'AND',
                        children: [
                            { id: 'journey_id', operation: '==', value: journeyId },
                            { id: 'worktaskId', operation: '==', value: worktaskId },
                            { id: 'doc_type', operation: '==', value: spec.doc_type },
                        ],
                    },
                    sorted: [{ id: 'createdAt', desc: true }],
                    limit: 1,
                } as any);

                if (!active) return;
                const latest = res.data?.[0];
                if (latest) {
                    setCurrentDocId(latest._id);
                    form.setFieldsValue({
                        description: latest.description,
                        published_at: latest.published_at ? dayjs(latest.published_at) : null,
                        is_published: latest.is_published !== false,
                        files: latest.files || [],
                    });
                }
            } catch (err) {
                console.error('Failed to load initial document:', err);
            }
        };
        void loadInitial();
        return () => {
            active = false;
        };
    }, [journeyId, worktaskId, spec.doc_type, form]);



    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const mappedFiles = (values.files || []) as HeadlessFileUpload[];
            
            if (mappedFiles.length === 0) {
                Modal.warning({
                    title: 'Thiếu tài liệu',
                    content: 'Vui lòng đính kèm ít nhất một file.'
                });
                return;
            }

            const hasInvalid = mappedFiles.some((m) => {
                const u = m.url ? String(m.url) : '';
                return !m.file_id && !m.file_path && (!u || u.startsWith('blob:'));
            });
            if (hasInvalid) {
                Modal.error({
                    title: 'Lỗi định danh file',
                    content: 'Một số file chưa có định danh từ máy chủ.'
                });
                return;
            }

            setSaving(true);
            const docData: any = {
                description: values.description,
                doc_type: spec.doc_type,
                journey_id: journeyId,
                worktaskId: worktaskId,
                journey_step_code: stepCode && String(stepCode).trim() ? String(stepCode).trim() : undefined,
                files: mappedFiles,
                published_at: values.published_at?.toISOString?.() ?? undefined,
                is_published: values.is_published !== false,
            };

            let resDoc: IJourneyDocument;
            if (currentDocId) {
                resDoc = await journeyDocumentService.updateJourneyDocument(currentDocId, docData);
                Modal.success({
                    title: 'Thành công',
                    content: `Đã cập nhật tài liệu: ${DOC_TYPE_LABELS[spec.doc_type] || spec.doc_type}`
                });
            } else {
                resDoc = await journeyDocumentService.createJourneyDocument(docData);
                Modal.success({
                    title: 'Thành công',
                    content: `Đã thêm tài liệu: ${DOC_TYPE_LABELS[spec.doc_type] || spec.doc_type}`
                });
                if (resDoc._id) setCurrentDocId(resDoc._id);
            }

            window.dispatchEvent(new CustomEvent('journey-documents-updated'));
            await onSaved();
        } catch (e: unknown) {
            if (e && typeof e === 'object' && 'errorFields' in e) return;
            console.error(e);
            Modal.error({
                title: 'Lỗi',
                content: e instanceof Error ? e.message : 'Lỗi khi lưu tài liệu'
            });
        } finally {
            setSaving(false);
        }
    };

    const title = DOC_TYPE_LABELS[spec.doc_type] || spec.doc_type;
    const notes = spec.actions.map((a) => a.note).filter(Boolean) as string[];

    return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text type="secondary">
                Số lượng tối thiểu gợi ý theo cấu hình: <Text strong>{spec.minCount}</Text>
            </Text>
            {notes.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {notes.map((n, i) => (
                        <li key={i}>
                            <Text type="secondary">{n}</Text>
                        </li>
                    ))}
                </ul>
            ) : null}
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    is_published: true,
                    published_at: dayjs(),
                }}
            >
                <Form.Item label="Mô tả tài liệu" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                    <TextArea rows={2} placeholder="Mô tả ngắn cho bộ tài liệu này" />
                </Form.Item>
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
                <Form.Item label="Đính kèm file" name="files" required>
                    <UploadFiles />
                </Form.Item>
            </Form>
            <Button type="primary" loading={saving} onClick={() => void handleSave()}>
                Lưu tài liệu ({title})
            </Button>
        </Space>
    );
};

export const WorkTaskDocumentGroupModal: React.FC<WorkTaskDocumentGroupModalProps> = ({
    open,
    onCancel,
    journeyId,
    worktaskId,
    stepCode,
    actions,
    onDocumentsChanged,
}) => {
    const panels = useMemo(() => groupDocumentActionsByDocType(actions), [actions]);

    const handleAfterSave = async () => {
        await onDocumentsChanged?.();
    };

    return (
        <Modal
            title="Tải tài liệu theo nhiệm vụ"
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel}>
                    Đóng
                </Button>,
            ]}
            width={720}
            destroyOnClose
        >
            <Paragraph type="secondary" style={{ marginTop: 0 }}>
                Mỗi loại tài liệu một panel — lưu riêng từng loại. Sau khi lưu, hệ thống kiểm tra đủ điều kiện nhiệm vụ.
            </Paragraph>
            <Collapse
                defaultActiveKey={panels.map((p) => p.doc_type)}
                items={panels.map((spec) => ({
                    key: spec.doc_type,
                    label: (
                        <Space>
                            <Text strong>{DOC_TYPE_LABELS[spec.doc_type] || spec.doc_type}</Text>
                            <Text type="secondary">({spec.actions.length} yêu cầu)</Text>
                        </Space>
                    ),
                    children: (
                        <DocumentPanel
                            spec={spec}
                            journeyId={journeyId}
                            worktaskId={worktaskId}
                            stepCode={stepCode}
                            onSaved={handleAfterSave}
                        />
                    ),
                }))}
            />
        </Modal>
    );
};
