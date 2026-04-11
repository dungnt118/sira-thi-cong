import React, { useState, useEffect, useMemo } from 'react';
import {
    Button, Space, Typography, Badge, Modal, Empty,
    Avatar, Collapse, List, Card, message, Tag,
} from 'antd';
import {
    EditOutlined, LoadingOutlined, PaperClipOutlined,
    CloseCircleOutlined, FileTextOutlined,
    FilePdfOutlined, FileImageOutlined, VideoCameraOutlined, FileOutlined,
} from '@ant-design/icons';
import {
    classifyJourneyFile,
    getJourneyFileDisplayName,
    resolveJourneyFileHref,
    resolvePdfPreviewHref,
    type JourneyFileKind,
} from '../../utils/journeyDocumentFileDisplay';
import { journeyDocumentService } from '../../services/core-contracts/services/journeyDocument.service';
import { IJourneyDocument } from '../../services/core-contracts/types/journeyDocument.types';
import { CreateJourneyDocumentModal } from './CreateJourneyDocumentModal';
import { PdfViewer } from '../common/PdfViewer';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';
import dayjs from 'dayjs';

const { Text } = Typography;

// ─── Config constants ──────────────────────────────────────
const DOC_TYPE_LABELS: Record<string, string> = {
    survey_report: 'Báo cáo khảo sát',
    site_photos: 'Ảnh mặt bằng',
    solution_doc: 'Thiết kế giải pháp',
    business_plan: 'Phương án kinh doanh',
    quotation: 'Báo giá',
    contract: 'Hợp đồng',
    advance_request: 'Yêu cầu tạm ứng',
    stage_acceptance: 'Nghiệm thu giai đoạn',
    stage_payment_proof: 'Chứng từ thanh toán GĐ',
    final_acceptance: 'Nghiệm thu bàn giao',
    payment_receipt: 'Hóa đơn / Phiếu thu',
    maintenance_record: 'Biên bản bảo trì',
    warranty_record: 'Biên bản bảo hành',
    after_sales_note: 'Ghi chú sau bán',
};


const STEP_NAME_MAPPING: Record<string, string> = {
    'lead_new': '1. Tiếp nhận',
    'consult_contact': '2. Tư vấn & Hẹn lịch',
    'site_survey': '3. Khảo sát',
    'solution_design': '4. Thiết kế giải pháp',
    'quotation': '5. Báo giá',
    'contract': '6. Hợp đồng',
    'execution': '7. Thi công',
    'final_acceptance': '8. Nghiệm thu',
    'payment': '9. Thanh toán',
    'maintenance': '10. Bảo trì',
    'warranty': '11. Bảo hành',
    'after_sales': '12. Chăm sóc khách hàng',
};

const JOURNEY_STEP_SORT_ORDER = [
    'lead_new', 'consult_contact', 'site_survey', 'solution_design',
    'quotation', 'contract', 'execution', 'final_acceptance',
    'payment', 'maintenance', 'warranty', 'after_sales'
];

const FILE_KIND_LABEL: Record<JourneyFileKind, string> = {
    pdf: 'PDF',
    image: 'Ảnh',
    video: 'Video',
    other: 'Tài liệu',
};

// ─── Props ─────────────────────────────────────────────────
export interface JourneyDocumentsTabProps {
    journeyId: string;
    /** Cho phép sửa / xóa tài liệu (mặc định true) */
    isEditable?: boolean;
    /** Ẩn nút "Tạo tài liệu" nằm trong header của component này (mặc định false) */
    hideCreateButton?: boolean;
    /** Bước hiện tại của công trình — dùng để mặc định "Giai đoạn/Bước" khi thêm tài liệu */
    journeyCurrentStep?: string | null;
}

// ─── Component ─────────────────────────────────────────────
export const JourneyDocumentsTab: React.FC<JourneyDocumentsTabProps> = ({
    journeyId,
    isEditable = true,
    hideCreateButton = false,
    journeyCurrentStep,
}) => {
    const [documents, setDocuments] = useState<IJourneyDocument[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);
    const [editingDoc, setEditingDoc] = useState<IJourneyDocument | null>(null);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<{
        kind: JourneyFileKind;
        url: string;
        name: string;
    } | null>(null);

    // ─── Data fetching ──────────────────────────────────────
    const fetchDocuments = async () => {
        setIsLoadingDocs(true);
        try {
            const res = await journeyDocumentService.queryJourneyDocumentsDto({
                group: { id: 'journey_id', operation: 'eq', value: journeyId },
            } as any);
            if (res.data) {
                setDocuments(res.data);
            }
        } catch (error) {
            console.error('JourneyDocumentsTab – Fetch documents error:', error);
        } finally {
            setIsLoadingDocs(false);
        }
    };

    useEffect(() => {
        fetchDocuments();

        const handleRefresh = () => fetchDocuments();
        window.addEventListener('journey-documents-updated', handleRefresh);
        return () => {
            window.removeEventListener('journey-documents-updated', handleRefresh);
        };
    }, [journeyId]);

    // ─── Grouping logic ─────────────────────────────────────
    const documentsGroupedByStep = useMemo(() => {
        const map = new Map<string, IJourneyDocument[]>();
        documents.forEach((d) => {
            const key = d.journey_step_code || '__unassigned';
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(d);
        });
        const entries = [...map.entries()].sort((a, b) => {
            if (a[0] === '__unassigned') return 1;
            if (b[0] === '__unassigned') return -1;
            const ia = JOURNEY_STEP_SORT_ORDER.indexOf(a[0]);
            const ib = JOURNEY_STEP_SORT_ORDER.indexOf(b[0]);
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        });
        return entries;
    }, [documents]);

    // ─── File preview helpers ───────────────────────────────
    const openFilePreview = (file: HeadlessFileUpload) => {
        const url =
            classifyJourneyFile(file) === 'pdf'
                ? resolvePdfPreviewHref(file)
                : resolveJourneyFileHref(file);

        if (!url) {
            message.warning(
                'Không phân giải được đường dẫn file (cần file_id / file_path hoặc URL hợp lệ, không dùng blob).',
            );
            return;
        }
        setFilePreview({ kind: classifyJourneyFile(file), url, name: getJourneyFileDisplayName(file) });
    };

    const renderFileKindIcon = (kind: JourneyFileKind, size = 18) => {
        const style = { fontSize: size };
        if (kind === 'pdf') return <FilePdfOutlined style={{ ...style, color: '#f5222d' }} />;
        if (kind === 'image') return <FileImageOutlined style={{ ...style, color: '#52c41a' }} />;
        if (kind === 'video') return <VideoCameraOutlined style={{ ...style, color: '#fa8c16' }} />;
        return <FileOutlined style={{ ...style, color: '#1890ff' }} />;
    };

    const renderAttachedFileRow = (file: HeadlessFileUpload, docKey: string, fileIdx: number) => {
        const kind = classifyJourneyFile(file);
        const displayName = getJourneyFileDisplayName(file);
        const url = resolveJourneyFileHref(file);

        const kindTag = (
            <Tag
                style={{ margin: 0, flexShrink: 0, alignSelf: 'center' }}
                color={
                    kind === 'pdf' ? 'red'
                        : kind === 'image' ? 'green'
                            : kind === 'video' ? 'orange'
                                : 'blue'
                }
            >
                {FILE_KIND_LABEL[kind]}
            </Tag>
        );

        if (kind === 'image' && url) {
            return (
                <div
                    key={`${docKey}-f-${fileIdx}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                        padding: '4px 6px',
                        borderRadius: 6,
                        background: '#fafafa',
                        border: '1px solid #f0f0f0',
                    }}
                >
                    {/* Thumbnail */}
                    <button
                        type="button"
                        onClick={() => openFilePreview(file)}
                        style={{
                            border: '1px solid #e8e8e8',
                            borderRadius: 6,
                            padding: 0,
                            cursor: 'pointer',
                            background: '#fff',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}
                        aria-label={`Xem ảnh ${displayName}`}
                    >
                        <img
                            src={url}
                            alt=""
                            style={{ width: 40, height: 40, objectFit: 'cover', display: 'block' }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </button>
                    {/* Filename */}
                    <Button
                        type="link"
                        size="small"
                        style={{
                            padding: 0,
                            height: 'auto',
                            textAlign: 'left',
                            flex: 1,
                            minWidth: 0,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            lineHeight: 1.4,
                        }}
                        onClick={() => openFilePreview(file)}
                    >
                        <Space align="center" size={4}>
                            {renderFileKindIcon(kind, 14)}
                            <span style={{ fontSize: 13 }}>{displayName}</span>
                        </Space>
                    </Button>
                    {/* Tag float right */}
                    {kindTag}
                </div>
            );
        }

        return (
            <div
                key={`${docKey}-f-${fileIdx}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 6,
                    padding: '4px 6px',
                    borderRadius: 6,
                    background: '#fafafa',
                    border: '1px solid #f0f0f0',
                }}
            >
                {/* Icon */}
                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {renderFileKindIcon(kind, 16)}
                </span>
                {/* Filename */}
                <Button
                    type="link"
                    size="small"
                    style={{
                        padding: 0,
                        height: 'auto',
                        textAlign: 'left',
                        flex: 1,
                        minWidth: 0,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        lineHeight: 1.4,
                        fontSize: 13,
                    }}
                    onClick={() => openFilePreview(file)}
                    disabled={!url}
                >
                    {displayName}
                </Button>
                {/* Tag float right */}
                {kindTag}
            </div>
        );
    };

    // ─── Render ─────────────────────────────────────────────
    return (
        <div style={{ maxWidth: 900, width: '100%' }}>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                    flexWrap: 'wrap',
                    gap: 8,
                }}
            >
                <Space>
                    <PaperClipOutlined style={{ color: '#1890ff' }} />
                    <Text strong style={{ fontSize: 15 }}>
                        Tài liệu công trình
                    </Text>
                    <Badge count={documents.length} style={{ backgroundColor: '#52c41a' }} />
                </Space>
                {!hideCreateButton && (
                    <Button
                        size="small"
                        icon={<FileTextOutlined />}
                        onClick={() => {
                            setEditingDoc(null);
                            setIsDocModalOpen(true);
                        }}
                    >
                        Tạo tài liệu
                    </Button>
                )}
            </div>

            {/* Document list */}
            {isLoadingDocs ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <LoadingOutlined style={{ fontSize: 28, color: '#1890ff' }} />
                    <div style={{ marginTop: 12 }}>
                        <Text type="secondary">Đang tải tài liệu...</Text>
                    </div>
                </div>
            ) : documents.length === 0 ? (
                <Empty description="Chưa có tài liệu nào được tải lên" />
            ) : (
                <Collapse
                    bordered={false}
                    style={{ background: 'transparent' }}
                    defaultActiveKey={documentsGroupedByStep.map(([k]) => k)}
                    items={documentsGroupedByStep.map(([stepKey, stepDocs]) => ({
                        key: stepKey,
                        label: (
                            <Space wrap>
                                <Text strong>
                                    {stepKey === '__unassigned'
                                        ? 'Chưa gán bước công trình'
                                        : STEP_NAME_MAPPING[stepKey] || stepKey}
                                </Text>
                                <Badge count={stepDocs.length} style={{ backgroundColor: '#1890ff' }} />
                            </Space>
                        ),
                        children: (
                            <List
                                dataSource={stepDocs}
                                grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                                renderItem={(doc) => {
                                    const firstFile = doc.files?.[0];
                                    const firstKind = firstFile ? classifyJourneyFile(firstFile) : null;
                                    const firstFileHref = firstFile
                                        ? resolveJourneyFileHref(firstFile)
                                        : undefined;
                                    const classificationTitle = doc.doc_type
                                        ? DOC_TYPE_LABELS[doc.doc_type as string] || doc.doc_type
                                        : 'Chưa phân loại';


                                    const actions = isEditable
                                        ? [
                                            <EditOutlined
                                                key="edit"
                                                onClick={() => {
                                                    setEditingDoc(doc);
                                                    setIsDocModalOpen(true);
                                                }}
                                            />,
                                            <Button
                                                key="delete"
                                                type="text"
                                                danger
                                                icon={<CloseCircleOutlined />}
                                                onClick={() => {
                                                    Modal.confirm({
                                                        title: 'Xóa tài liệu',
                                                        content: 'Bạn có chắc chắn muốn xóa tài liệu này?',
                                                        onOk: async () => {
                                                            await journeyDocumentService.deleteJourneyDocument(
                                                                doc._id,
                                                            );
                                                            message.success('Đã xóa tài liệu');
                                                            fetchDocuments();
                                                        },
                                                    });
                                                }}
                                            />,
                                        ]
                                        : [];

                                    return (
                                        <List.Item>
                                            <Card size="small" hoverable actions={actions}>
                                                <Card.Meta
                                                    avatar={
                                                        firstFile && firstKind === 'image' && firstFileHref ? (
                                                            <Avatar
                                                                src={firstFileHref}
                                                                shape="square"
                                                                size={48}
                                                                style={{ borderRadius: 8 }}
                                                            />
                                                        ) : firstFile && firstKind ? (
                                                            <Avatar
                                                                style={{ backgroundColor: '#f0f5ff' }}
                                                                icon={renderFileKindIcon(firstKind, 22)}
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                icon={<FileTextOutlined />}
                                                                style={{ backgroundColor: '#1890ff' }}
                                                            />
                                                        )
                                                    }
                                                    title={
                                                        <Text
                                                            strong
                                                            ellipsis={{ tooltip: classificationTitle }}
                                                            style={{ fontSize: 15 }}
                                                        >
                                                            {classificationTitle}
                                                        </Text>
                                                    }
                                                    description={
                                                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                                            <Text
                                                                type="secondary"
                                                                ellipsis={{ tooltip: doc.description || undefined }}
                                                                style={{ fontSize: 13, display: 'block' }}
                                                            >
                                                                {doc.description?.trim()
                                                                    ? doc.description
                                                                    : 'Không có mô tả'}
                                                            </Text>
                                                            {doc.published_at ? (
                                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                                    Ban hành:{' '}
                                                                    {dayjs(doc.published_at).format('DD/MM/YYYY')}
                                                                </Text>
                                                            ) : null}
                                                            {doc.is_published === false ? (
                                                                <Tag>Chưa publish Portal</Tag>
                                                            ) : null}
                                                            <div style={{ marginTop: 4 }}>
                                                                {doc.files && doc.files.length > 0 ? (
                                                                    doc.files.map((f, i) =>
                                                                        renderAttachedFileRow(f, doc._id, i),
                                                                    )
                                                                ) : (
                                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                                        Không có file
                                                                    </Text>
                                                                )}
                                                            </div>
                                                        </Space>
                                                    }
                                                />
                                            </Card>
                                        </List.Item>
                                    );
                                }}
                            />
                        ),
                    }))}
                />
            )}

            {/* File preview modal */}
            <Modal
                open={!!filePreview}
                title={filePreview?.name}
                onCancel={() => setFilePreview(null)}
                width={filePreview?.kind === 'pdf' ? 'min(1200px, 96vw)' : 720}
                style={{ top: 0, paddingBottom: 0, margin: '0 auto' }}
                styles={{
                    content:
                        filePreview?.kind === 'pdf'
                            ? {
                                height: '100dvh',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 0,
                                borderRadius: 0,
                                overflow: 'hidden',
                            }
                            : {},
                    header:
                        filePreview?.kind === 'pdf'
                            ? {
                                padding: '12px 16px',
                                marginBottom: 0,
                                borderBottom: '1px solid #f0f0f0',
                                flexShrink: 0,
                            }
                            : {},
                    body:
                        filePreview?.kind === 'pdf'
                            ? {
                                flex: 1,
                                padding: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                            }
                            : { padding: '16px 24px' },
                }}
                destroyOnHidden
                footer={null}
            >
                {filePreview?.kind === 'pdf' && filePreview.url ? (
                    <PdfViewer url={filePreview.url} title={filePreview.name} height="100%" />
                ) : null}
                {filePreview?.kind === 'image' && filePreview.url ? (
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={filePreview.url}
                            alt={filePreview.name}
                            style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain' }}
                        />
                    </div>
                ) : null}
                {filePreview?.kind === 'video' && filePreview.url ? (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <video
                            src={filePreview.url}
                            controls
                            style={{ width: '100%', maxHeight: '70vh', borderRadius: 8, background: '#000' }}
                        />
                        <Text type="secondary">
                            Nếu video không phát được (giới hạn máy chủ hoặc trình duyệt), hãy dùng nút &quot;Tải
                            xuống / Mở tab mới&quot; phía dưới.
                        </Text>
                    </Space>
                ) : null}
                {filePreview?.kind === 'other' && filePreview.url ? (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Text>
                            Định dạng này không xem trực tiếp trên trình duyệt. Hãy tải file về và mở bằng ứng dụng
                            phù hợp (Word, Excel, AutoCAD, ZIP…).
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Gợi ý: sau khi tải, kiểm tra nguồn file và chỉ mở nếu bạn tin cậy người gửi.
                        </Text>
                    </Space>
                ) : null}
            </Modal>

            {/* Create / Edit document modal */}
            <CreateJourneyDocumentModal
                open={isDocModalOpen}
                onCancel={() => {
                    setIsDocModalOpen(false);
                    setEditingDoc(null);
                }}
                onSuccess={() => {
                    setIsDocModalOpen(false);
                    setEditingDoc(null);
                    fetchDocuments();
                }}
                journeyId={journeyId}
                stepCode={journeyCurrentStep || undefined}
                editingDoc={editingDoc}
            />
        </div>
    );
};

export default JourneyDocumentsTab;
