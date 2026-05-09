import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Empty,
    Input,
    Modal,
    Progress,
    Spin,
    Typography,
    Upload,
    message,
} from 'antd';
import {
    ArrowLeftOutlined,
    CameraOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    SendOutlined,
    ToolOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { workTaskService } from '@/services/core-contracts/services/workTask.service';
import { journeyDocumentService } from '@/services/core-contracts/services/journeyDocument.service';
import { IWorkTask } from '@/services/core-contracts/types/workTask.types';
import { ICreateJourneyDocumentInput, IJourneyDocument } from '@/services/core-contracts/types/journeyDocument.types';
import { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';
import { buildFilter } from '@/utils/filterBuilder';
import { useFileUpload } from '@/components/files/useFileUpload';

const { Text, Title } = Typography;
const { TextArea } = Input;

/**
 * Wave 6 W6-06 + Wave 7 W7-01 — Supervisor Evidence Upload (real file upload).
 *
 * URL: /admin/gs/evidence/:projectId/:stepId
 *   - projectId = journey._id
 *   - stepId = workTask._id
 *
 * Flow (W7 update):
 *   1. Fetch WorkTask + existing JourneyDocuments linked to this task
 *   2. User chọn files → preview cục bộ (data URL)
 *   3. Submit:
 *      a) Upload từng file lên `upload_url` qua `useFileUpload.parseUploadResponse`
 *      b) Tạo JourneyDocument với `files: HeadlessFileUpload[]` thật
 *      c) Set WorkTask.review_status='awaiting_review'
 *   4. Mỗi file có progress bar riêng + error retry per-file.
 */

interface UploadedFile {
    uid: string;
    /** Local data URL for preview before upload completes. */
    url: string;
    name: string;
    timestamp: string;
    file: File;
    /** Wave 7 — upload state per file. */
    uploadStatus: 'pending' | 'uploading' | 'done' | 'error';
    uploadProgress: number;
    /** Server response after successful upload. */
    serverFile?: HeadlessFileUpload;
    errorMsg?: string;
}

const EvidenceUpload: React.FC = () => {
    const navigate = useNavigate();
    const { projectId, stepId } = useParams<{ projectId: string; stepId: string }>();

    const [task, setTask] = useState<IWorkTask | null>(null);
    const [existingDocs, setExistingDocs] = useState<IJourneyDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [doneModal, setDoneModal] = useState(false);
    const { getAuthHeaders, parseUploadResponse } = useFileUpload();

    const fetchData = useCallback(async () => {
        if (!stepId) return;
        setLoading(true);
        try {
            const [taskData, docsRes] = await Promise.all([
                workTaskService.findWorkTaskDto(stepId).catch(() => null),
                journeyDocumentService.queryJourneyDocumentsDto(buildFilter({
                    where: { id: 'worktaskId', value: stepId },
                    limit: 20,
                })),
            ]);
            setTask(taskData);
            setExistingDocs(docsRes?.data || []);
        } catch (e: any) {
            message.error(e?.message || 'Không thể tải bước thi công.');
        } finally {
            setLoading(false);
        }
    }, [stepId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ─── Handlers ───────────────────────────────────────────── */

    const handleFileAdd = (file: File) => {
        const uid = Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8);
        const reader = new FileReader();
        reader.onload = (e) => {
            const newFile: UploadedFile = {
                uid,
                url: (e.target?.result as string) ?? '',
                name: file.name,
                timestamp: new Date().toLocaleString('vi-VN'),
                file,
                uploadStatus: 'pending',
                uploadProgress: 0,
            };
            setFiles(prev => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
        return false; // Prevent auto-upload — we manage upload in handleSubmit
    };

    /**
     * Upload 1 file lên backend storage và trả về HeadlessFileUpload.
     * Wave 7 W7-01: real upload via XMLHttpRequest để có per-file progress.
     */
    const uploadOne = (uf: UploadedFile): Promise<HeadlessFileUpload> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', uf.file);
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setFiles(prev => prev.map(x => x.uid === uf.uid ? { ...x, uploadProgress: percent } : x));
                }
            });
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const json = JSON.parse(xhr.responseText);
                        const parsed = parseUploadResponse(json);
                        setFiles(prev => prev.map(x => x.uid === uf.uid ? { ...x, uploadStatus: 'done', uploadProgress: 100, serverFile: parsed } : x));
                        resolve(parsed);
                    } catch (e: any) {
                        setFiles(prev => prev.map(x => x.uid === uf.uid ? { ...x, uploadStatus: 'error', errorMsg: 'Parse error: ' + e.message } : x));
                        reject(e);
                    }
                } else {
                    setFiles(prev => prev.map(x => x.uid === uf.uid ? { ...x, uploadStatus: 'error', errorMsg: `HTTP ${xhr.status}` } : x));
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText.substring(0, 200)}`));
                }
            });
            xhr.addEventListener('error', () => {
                setFiles(prev => prev.map(x => x.uid === uf.uid ? { ...x, uploadStatus: 'error', errorMsg: 'Network error' } : x));
                reject(new Error('Network error'));
            });
            // Resolve upload URL từ localStorage (configured at app boot).
            const uploadUrl = localStorage.getItem('upload_url') || '/api/file/upload';
            xhr.open('POST', uploadUrl);
            const headers = getAuthHeaders();
            for (const [k, v] of Object.entries(headers)) {
                xhr.setRequestHeader(k, v);
            }
            xhr.send(formData);
            // Mark as uploading
            setFiles(prev => prev.map(x => x.uid === uf.uid ? { ...x, uploadStatus: 'uploading', uploadProgress: 0 } : x));
        });
    };

    const handleSubmit = async () => {
        if (!task || !projectId || !stepId) return;
        if (files.length === 0) return;
        setSubmitting(true);
        try {
            // Wave 7 W7-01: Real upload từng file qua upload_url.
            const pendingFiles = files.filter(f => f.uploadStatus === 'pending' || f.uploadStatus === 'error');
            const alreadyUploaded = files.filter(f => f.uploadStatus === 'done' && f.serverFile)
                .map(f => f.serverFile!) as HeadlessFileUpload[];

            const newlyUploaded: HeadlessFileUpload[] = [];
            for (const uf of pendingFiles) {
                try {
                    const result = await uploadOne(uf);
                    newlyUploaded.push(result);
                } catch (e: any) {
                    // Stop on first failure - user can retry.
                    message.error(`Lỗi upload "${uf.name}": ${e.message}. Click Gửi lại để retry.`);
                    setSubmitting(false);
                    return;
                }
            }

            const allUploaded = [...alreadyUploaded, ...newlyUploaded];

            // Tạo JourneyDocument với metadata + file references thật
            const input: ICreateJourneyDocumentInput = {
                journey_id: projectId,
                journey_step_code: task.journey_step_code ?? 'execution',
                worktaskId: stepId,
                title: `Ảnh thi công: ${task.title ?? 'Bước thi công'}`,
                description: notes || undefined,
                doc_type: 'site_photos',
                is_published: false,
                files: allUploaded,
            };
            await journeyDocumentService.createJourneyDocument(input);

            // Update task status → awaiting_review
            await workTaskService.updateWorkTask(stepId, { review_status: 'awaiting_review' });

            message.success(`Đã upload ${allUploaded.length} ảnh + gửi PM duyệt`);
            setDoneModal(true);
        } catch (e: any) {
            message.error(e?.message || 'Không thể lưu hồ sơ.');
        } finally {
            setSubmitting(false);
        }
    };

    /* ─── Render ─────────────────────────────────────────────── */

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>;
    }
    if (!task) {
        return (
            <div style={{ padding: 16 }}>
                <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate(`/admin/gs/checklist/${projectId}`)}>Quay lại</Button>
                <Empty description="Không tìm thấy bước thi công" style={{ marginTop: 24 }} />
            </div>
        );
    }

    const minPhotos = task.min_photos ?? 0;
    const totalPhotos = files.length + existingDocs.reduce((s, d) => s + (d.files?.length ?? 0), 0);
    const canSubmit = minPhotos === 0 || totalPhotos >= minPhotos;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate(`/admin/gs/checklist/${projectId}`)} />
                <div>
                    <Title level={5} style={{ margin: 0 }}><CameraOutlined /> {task.title ?? 'Bước thi công'}</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>{(task as any).idx_journey_id?.title ?? projectId}</Text>
                </div>
            </div>

            {/* Min photos requirement */}
            {minPhotos > 0 && (
                <Alert
                    message={
                        <div>
                            <Text strong>Yêu cầu: {minPhotos} ảnh tối thiểu</Text>
                            <Progress
                                percent={Math.min(100, Math.round((totalPhotos / minPhotos) * 100))}
                                size="small"
                                status={totalPhotos >= minPhotos ? 'success' : 'active'}
                                showInfo={false}
                                style={{ marginTop: 4 }}
                            />
                            <Text style={{ fontSize: 12 }}>
                                Đã tải: <strong>{totalPhotos}/{minPhotos}</strong>
                                {totalPhotos >= minPhotos && <span> <CheckCircleOutlined style={{ color: '#52c41a' }} /> Đủ ảnh</span>}
                            </Text>
                        </div>
                    }
                    type={totalPhotos >= minPhotos ? 'success' : 'info'}
                    style={{ marginBottom: 16, borderRadius: 10 }}
                />
            )}

            {/* Step description */}
            {task.description && (
                <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                    <ToolOutlined /> {task.description}
                </div>
            )}

            {/* Existing docs */}
            {existingDocs.length > 0 && (
                <Card size="small" style={{ marginBottom: 16, borderRadius: 10 }}>
                    <Text strong>Đã có {existingDocs.length} hồ sơ ảnh trước đó</Text>
                </Card>
            )}

            {/* Upload area */}
            <Upload.Dragger
                multiple
                accept="image/*"
                beforeUpload={handleFileAdd}
                showUploadList={false}
                style={{ marginBottom: 16 }}
            >
                <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 40, color: '#bfbfbf' }}><CameraOutlined /></div>
                    <div style={{ fontWeight: 600, marginTop: 8 }}>Nhấn hoặc kéo thả ảnh</div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                        JPG, PNG · Tự động ghi timestamp
                    </div>
                </div>
            </Upload.Dragger>

            {/* File grid với upload status (W7) */}
            {files.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
                    {files.map(f => {
                        const statusColor = f.uploadStatus === 'done' ? '#52c41a'
                            : f.uploadStatus === 'error' ? '#ff4d4f'
                                : f.uploadStatus === 'uploading' ? '#1890ff'
                                    : '#bfbfbf';
                        return (
                            <div key={f.uid} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#f5f5f5' }}>
                                <img
                                    src={f.url}
                                    alt={f.name}
                                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                                />
                                {/* Status badge */}
                                <div style={{
                                    position: 'absolute', top: 6, right: 6,
                                    background: statusColor, borderRadius: '50%', width: 22, height: 22,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: 12,
                                }}>
                                    {f.uploadStatus === 'done' && <CheckCircleOutlined />}
                                    {f.uploadStatus === 'error' && '!'}
                                    {f.uploadStatus === 'uploading' && f.uploadProgress + '%'}
                                </div>
                                {/* Progress overlay */}
                                {f.uploadStatus === 'uploading' && (
                                    <div style={{
                                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Progress
                                            type="circle"
                                            percent={f.uploadProgress}
                                            size={48}
                                            strokeColor="#fff"
                                            trailColor="rgba(255,255,255,0.3)"
                                        />
                                    </div>
                                )}
                                {/* Error overlay */}
                                {f.uploadStatus === 'error' && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0,
                                        background: 'rgba(255,77,79,0.9)', color: '#fff', fontSize: 11,
                                        padding: '4px 8px',
                                    }}>
                                        Lỗi: {f.errorMsg}
                                    </div>
                                )}
                                {/* Footer */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 9,
                                    padding: '2px 6px', display: 'flex', justifyContent: 'space-between',
                                }}>
                                    <span><ClockCircleOutlined /> {f.timestamp}</span>
                                    {f.uploadStatus !== 'uploading' && (
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            style={{ color: '#fff', padding: 0, height: 'auto' }}
                                            onClick={() => setFiles(prev => prev.filter(x => x.uid !== f.uid))}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Notes */}
            <Card size="small" style={{ marginBottom: 16, borderRadius: 10 }}>
                <TextArea
                    placeholder="Ghi chú cho bước này (tình trạng, điều kiện thi công...)"
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />
            </Card>

            {/* Submit */}
            <Button
                type="primary"
                block
                size="large"
                disabled={!canSubmit || files.length === 0}
                loading={submitting}
                onClick={handleSubmit}
                icon={<SendOutlined />}
                style={{ height: 50, fontSize: 16, borderRadius: 12 }}
            >
                {files.length === 0
                    ? 'Chọn ít nhất 1 ảnh'
                    : !canSubmit
                        ? `Cần thêm ${minPhotos - totalPhotos} ảnh nữa`
                        : `Gửi ${files.length} ảnh chờ PM duyệt`}
            </Button>

            {minPhotos === 0 && files.length === 0 && (
                <Alert
                    type="info"
                    showIcon
                    style={{ marginTop: 12 }}
                    message="Bước này không yêu cầu ảnh tối thiểu. Bạn vẫn có thể tải ảnh để minh chứng."
                />
            )}

            <Modal
                title={<span><CheckCircleOutlined style={{ color: '#52c41a' }} /> Gửi ảnh thành công!</span>}
                open={doneModal}
                onCancel={() => { setDoneModal(false); navigate(`/admin/gs/checklist/${projectId}`); }}
                footer={[
                    <Button key="back" type="primary" onClick={() => { setDoneModal(false); navigate(`/admin/gs/checklist/${projectId}`); }}>
                        Quay lại Checklist
                    </Button>,
                ]}
                centered
                destroyOnHidden
            >
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: 48, color: '#1890ff' }}><CloudUploadOutlined /></div>
                    <Text>
                        Đã upload <strong>{files.filter(f => f.uploadStatus === 'done').length}</strong> ảnh
                        cho bước <strong>{task.title}</strong>.
                    </Text>
                    <br />
                    <Text type="secondary">PM sẽ xem xét và phê duyệt trong thời gian sớm nhất.</Text>
                </div>
            </Modal>
        </div>
    );
};

export default EvidenceUpload;
