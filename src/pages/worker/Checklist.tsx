import React, { useState } from 'react';
import {
    Card, Button, Tag, Typography, Progress, Alert,
    Modal, Badge
} from 'antd';
import {
    ArrowLeftOutlined, WarningOutlined,
    CameraOutlined, CheckCircleOutlined, CloseCircleOutlined,
    LockOutlined, PushpinOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockJourneys as defaultJourneys } from '../../data/journeyMockData';
import type { Journey, JourneyChecklistStep, StepStatus, IncidentReport } from '../../types/journey';
import { useLocalStorageData } from '../../hooks/useLocalStorageData';
import { demoDataService } from '../../services/localstorage/demoDataService';

const { Title, Text } = Typography;

// Removed materials check temporarily or just fake returning true
const hasMaterialsDispached = (_journey: Journey) => {
    return true; // Simplified for journey mockup
};

const STEP_STYLE: Record<StepStatus, { color: string; bg: string; label: React.ReactNode }> = {
    LOCKED: { color: '#bbb', bg: '#fafafa', label: <span><LockOutlined /> Khóa</span> },
    OPEN: { color: '#1890ff', bg: '#e6f4ff', label: <span>Mở</span> },
    IN_PROGRESS: { color: '#fa8c16', bg: '#fff7e6', label: <span>Đang làm</span> },
    AWAITING_REVIEW: { color: '#722ed1', bg: '#f9f0ff', label: <span>Chờ PM</span> },
    APPROVED: { color: '#52c41a', bg: '#f6ffed', label: <span><CheckCircleOutlined /> Duyệt</span> },
    REJECTED: { color: '#ff4d4f', bg: '#fff2f0', label: <span><CloseCircleOutlined /> Từ chối</span> },
};

const WorkerChecklist: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [journeys] = useLocalStorageData<Journey[]>(demoDataService.KEYS.JOURNEYS, defaultJourneys);
    const journey = journeys.find(p => p.id === id);

    const [selectedStep, setSelectedStep] = useState<JourneyChecklistStep | null>(null);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    if (!journey) return <div style={{ padding: 16 }}>Không tìm thấy hành trình</div>;

    const materialsOk = hasMaterialsDispached(journey);
    const workSteps = journey.work_steps || [];
    const incidents = journey.incidents || [];
    const approvedCount = workSteps.filter((s: JourneyChecklistStep) => s.status === 'APPROVED').length;
    const progress = workSteps.length > 0 ? Math.round((approvedCount / workSteps.length) * 100) : 0;
    const currentStep = workSteps.find((s: JourneyChecklistStep) => s.status === 'IN_PROGRESS' || s.status === 'OPEN' || s.status === 'AWAITING_REVIEW');
    const hasUnresolved = incidents.filter((i: IncidentReport) => !i.isResolved).length;

    const handleStepClick = (step: JourneyChecklistStep) => {
        if (step.status === 'LOCKED') return;
        // Gap #9: Block if no materials
        if (!materialsOk && step.status === 'OPEN') {
            Modal.warning({
                title: '⚠️ Chưa nhận vật tư',
                content: (
                    <div>
                        <p>Bạn chưa ký nhận phiếu xuất kho cho dự án này.</p>
                        <p>Theo quy trình SIRA, bạn cần ký nhận vật tư <strong>trước khi bắt đầu thi công</strong>.</p>
                        <p>Vui lòng liên hệ PM/Kế toán để được cấp phiếu xuất kho.</p>
                    </div>
                ),
                okText: 'Đã hiểu',
            });
            return;
        }
        setSelectedStep(step);
        setUploadModalOpen(true);
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate('/worker/home')} />
                <div>
                    <Title level={5} style={{ margin: 0 }}>{journey.journey_code}</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>{journey.requested_service}</Text>
                </div>
                {hasUnresolved > 0 && (
                    <Badge count={hasUnresolved} style={{ background: '#ff4d4f' }} title={`${hasUnresolved} sự cố chưa xử lý`} />
                )}
            </div>

            {/* Progress Summary */}
            <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontWeight: 600 }}>Tiến độ tổng</Text>
                    <Text style={{ fontWeight: 700, color: '#1976D2', fontSize: 16 }}>{progress}%</Text>
                </div>
                <Progress percent={progress} status="active" strokeColor={{ from: '#1976D2', to: '#42a5f5' }} showInfo={false} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999', marginTop: 4 }}>
                    <span>Đã hoàn thành: {approvedCount}/{workSteps.length} bước</span>
                    <span>BĐ: {journey.plan_start || 'Chưa rõ'}</span>
                </div>
            </Card>

            {/* Gap #9 Warning */}
            {!materialsOk && (
                <Alert
                    type="warning"
                    icon={<WarningOutlined />}
                    showIcon
                    style={{ marginBottom: 12, borderRadius: 10 }}
                    message={
                        <div>
                            <Text strong><WarningOutlined /> Chưa nhận vật tư – Báo cáo bị khóa</Text>
                            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                Phiếu xuất kho chưa được ký nhận. Liên hệ PM/Kế toán để mở khóa thi công.
                            </div>
                        </div>
                    }
                    action={
                        <Button size="small" onClick={() => navigate('/worker/materials')}>
                            Xem phiếu VT
                        </Button>
                    }
                />
            )}

            {/* Current Step Highlight */}
            {currentStep && (
                <div style={{
                    padding: '12px 16px', background: 'linear-gradient(135deg, #1976D2, #42a5f5)',
                    borderRadius: 12, color: '#fff', marginBottom: 12,
                    boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
                }}>
                    <div style={{ fontSize: 12, opacity: 0.8 }}><PushpinOutlined /> Bước đang thực hiện ({currentStep.order}/{workSteps.length})</div>
                    <div style={{ fontSize: 16, fontWeight: 700, margin: '4px 0' }}>{currentStep.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{currentStep.description}</div>
                    <Button
                        block
                        style={{ marginTop: 12, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', height: 40 }}
                        icon={<CameraOutlined />}
                        onClick={() => handleStepClick(currentStep)}
                    >
                        Tải lên ảnh bước này
                    </Button>
                </div>
            )}

            {/* Full Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {workSteps.map((step: JourneyChecklistStep) => {
                    const style = STEP_STYLE[step.status];
                    const isClickable = step.status !== 'LOCKED';
                    return (
                        <div
                            key={step.id}
                            onClick={() => handleStepClick(step)}
                            style={{
                                padding: '10px 12px',
                                background: style.bg,
                                borderRadius: 10,
                                border: `1px solid ${style.color}40`,
                                cursor: isClickable ? 'pointer' : 'not-allowed',
                                opacity: step.status === 'LOCKED' ? 0.5 : 1,
                                transition: 'all 0.15s',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* Step number circle */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: style.color, color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                                    }}>
                                        {step.status === 'APPROVED' ? <CheckCircleOutlined /> : step.status === 'LOCKED' ? <LockOutlined /> : step.order}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: step.status === 'LOCKED' ? '#bbb' : '#333' }}>
                                            {step.name}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#999' }}>
                                            {step.minPhotos} ảnh tối thiểu
                                            {step.evidences.length > 0 && ` · ${step.evidences.length} đã tải`}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Tag */}
                                <Tag style={{ fontSize: 10, border: `1px solid ${style.color}`, background: style.bg, color: style.color }}>
                                    {style.label}
                                </Tag>
                            </div>

                            {/* Evidence thumbnails */}
                            {step.evidences.length > 0 && (
                                <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {step.evidences.slice(0, 5).map((ev: JourneyChecklistStep['evidences'][number]) => (
                                        <img
                                            key={ev.id}
                                            src={ev.url}
                                            style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                                        />
                                    ))}
                                    {step.evidences.length > 5 && (
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 6, background: '#00000066',
                                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                                        }}>
                                            +{step.evidences.length - 5}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Rejection feedback */}
                            {step.status === 'REJECTED' && step.notes && (
                                <div style={{ marginTop: 6, padding: '4px 8px', background: '#fff2f0', borderRadius: 6, fontSize: 11, color: '#ff4d4f' }}>
                                    <CloseCircleOutlined /> PM từ chối: {step.notes}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Upload Evidence Modal */}
            <Modal
                title={selectedStep ? (<span><CameraOutlined /> Bước {selectedStep.order}: {selectedStep.name}</span>) : 'Tải ảnh'}
                open={uploadModalOpen && !!selectedStep}
                onCancel={() => { setUploadModalOpen(false); setSelectedStep(null); }}
                footer={null}
                centered
            >
                {selectedStep && (
                    <div>
                        <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                            {selectedStep.description}
                        </div>
                        <Alert
                            message={`Cần tải tối thiểu ${selectedStep.minPhotos} ảnh cho bước này`}
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                        <Button
                            type="primary"
                            block
                            size="large"
                            icon={<CameraOutlined />}
                            onClick={() => {
                                navigate(`/worker/evidence/${id}/${selectedStep.id}`);
                                setUploadModalOpen(false);
                            }}
                        >
                            Mở màn hình tải ảnh
                        </Button>
                        <Button
                            block
                            style={{ marginTop: 8 }}
                            onClick={() => { setUploadModalOpen(false); setSelectedStep(null); }}
                        >
                            Đóng
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default WorkerChecklist;
