import React, { useState } from 'react';
import {
    Card, Upload, Button, Input, Progress, Typography,
    Alert, Modal
} from 'antd';
import {
    DeleteOutlined, ArrowLeftOutlined,
    CheckCircleOutlined, CameraOutlined, ToolOutlined,
    CloudUploadOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockProjects } from '../../data/mockData';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface UploadedFile {
    uid: string;
    url: string;
    name: string;
    timestamp: string;
    status: 'uploading' | 'done' | 'error';
    progress: number;
}

const EvidenceUpload: React.FC = () => {
    const navigate = useNavigate();
    const { projectId, stepId } = useParams<{ projectId: string; stepId: string }>();
    const project = mockProjects.find(p => p.id === projectId);
    const step = project?.steps.find(s => s.id === stepId);

    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [doneModal, setDoneModal] = useState(false);

    const minPhotos = step?.minPhotos || 2;
    const canSubmit = files.filter(f => f.status === 'done').length >= minPhotos;

    const handleFileAdd = (file: File) => {
        const uid = Date.now().toString();
        const newFile: UploadedFile = {
            uid,
            url: URL.createObjectURL(file),
            name: file.name,
            timestamp: new Date().toLocaleString('vi-VN'),
            status: 'uploading',
            progress: 0,
        };
        setFiles(prev => [...prev, newFile]);

        // Simulate upload
        let p = 0;
        const interval = setInterval(() => {
            p += 20;
            setFiles(prev => prev.map(f => f.uid === uid ? { ...f, progress: p } : f));
            if (p >= 100) {
                clearInterval(interval);
                setFiles(prev => prev.map(f => f.uid === uid ? { ...f, status: 'done', progress: 100 } : f));
            }
        }, 200);
        return false;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));
        setSubmitting(false);
        setDoneModal(true);
    };

    const doneCount = files.filter(f => f.status === 'done').length;

    if (!project || !step) return <div style={{ padding: 16 }}>Không tìm thấy bước thi công</div>;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate(`/worker/checklist/${projectId}`)} />
                <div>
                    <Title level={5} style={{ margin: 0 }}><CameraOutlined /> Bước {step.order}: {step.name}</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>{project.code}</Text>
                </div>
            </div>

            {/* Upload requirement */}
            <Alert
                message={
                    <div>
                        <Text strong>Yêu cầu: {minPhotos} ảnh tối thiểu</Text>
                        <Progress
                            percent={Math.min(100, Math.round((doneCount / minPhotos) * 100))}
                            size="small"
                            status={doneCount >= minPhotos ? 'success' : 'active'}
                            showInfo={false}
                            style={{ marginTop: 4 }}
                        />
                        <Text style={{ fontSize: 12 }}>
                            Đã tải: <strong>{doneCount}/{minPhotos}</strong>
                            {doneCount >= minPhotos && <span> <CheckCircleOutlined style={{ color: '#52c41a' }} /> Đủ ảnh</span>}
                        </Text>
                    </div>
                }
                type={doneCount >= minPhotos ? 'success' : 'info'}
                style={{ marginBottom: 16, borderRadius: 10 }}
            />

            {/* Step description */}
            <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                <ToolOutlined /> {step.description}
            </div>

            {/* Upload area */}
            <Upload.Dragger
                multiple
                accept="image/*,video/*"
                beforeUpload={handleFileAdd}
                showUploadList={false}
                style={{ marginBottom: 16 }}
            >
                <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 40, color: '#bfbfbf' }}><CameraOutlined /></div>
                    <div style={{ fontWeight: 600, marginTop: 8 }}>Nhấn hoặc kéo thả ảnh/video</div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                        JPG, PNG, MP4 · Tự động ghi timestamp & GPS
                    </div>
                </div>
            </Upload.Dragger>

            {/* File grid */}
            {files.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
                    {files.map(f => (
                        <div key={f.uid} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#f5f5f5' }}>
                            <img
                                src={f.url}
                                alt={f.name}
                                style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                            />
                            {f.status === 'uploading' && (
                                <div style={{
                                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Progress type="circle" percent={f.progress} width={48} strokeColor="#fff" trailColor="rgba(255,255,255,0.3)" />
                                </div>
                            )}
                            {f.status === 'done' && (
                                <div style={{
                                    position: 'absolute', top: 6, right: 6,
                                    background: '#52c41a', borderRadius: '50%', width: 20, height: 20,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <CheckCircleOutlined style={{ color: '#fff', fontSize: 12 }} />
                                </div>
                            )}
                            {/* Timestamp watermark */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 9,
                                padding: '2px 6px', display: 'flex', justifyContent: 'space-between',
                            }}>
                                <span><ClockCircleOutlined /> {f.timestamp}</span>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ color: '#fff', padding: 0, height: 'auto' }}
                                    onClick={() => setFiles(prev => prev.filter(x => x.uid !== f.uid))}
                                />
                            </div>
                        </div>
                    ))}
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
                disabled={!canSubmit}
                loading={submitting}
                onClick={handleSubmit}
                style={{ height: 50, fontSize: 16, borderRadius: 12 }}
            >
                {canSubmit ? (<span><CheckCircleOutlined /> Gửi ảnh chờ PM duyệt</span>) : `Cần thêm ${minPhotos - doneCount} ảnh nữa`}
            </Button>

            <Modal
                title={<span><CheckCircleOutlined style={{ color: '#52c41a' }} /> Gửi ảnh thành công!</span>}
                open={doneModal}
                onCancel={() => { setDoneModal(false); navigate(`/worker/checklist/${projectId}`); }}
                footer={[
                    <Button key="back" type="primary" onClick={() => { setDoneModal(false); navigate(`/worker/checklist/${projectId}`); }}>
                        Quay lại Checklist
                    </Button>,
                ]}
                centered
            >
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: 48, color: '#1890ff' }}><CloudUploadOutlined /></div>
                    <Text>Đã gửi {doneCount} ảnh cho bước <strong>{step.name}</strong>.</Text>
                    <br />
                    <Text type="secondary">PM sẽ xem xét và phê duyệt trong thời gian sớm nhất.</Text>
                </div>
            </Modal>
        </div>
    );
};

export default EvidenceUpload;
