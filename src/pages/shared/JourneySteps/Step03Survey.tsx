import { useAuth } from '@/hooks/useAuth';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import { surveyRecordService } from '@/services/core-contracts/services/surveyRecord.service';
import { surveyAppointmentService } from '@/services/core-contracts/services/surveyAppointment.service';
import { IJourney } from '@/services/core-contracts/types/journey.types';
import { ISurveyRecord } from '@/services/core-contracts/types/surveyRecord.types';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    FilePdfOutlined,
    FormOutlined,
    HighlightOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Empty,
    Form, message, Modal,
    Result,
    Row,
    Select,
    Space,
    Spin,
    Steps,
    Tag,
    Typography
} from 'antd';
import html2pdf from 'html2pdf.js';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import DynamicSurveyForm from '../../shared/Surveys/DynamicSurveyForm';

const { Text, Title } = Typography;

export interface Step03SurveyProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step03Survey: React.FC<Step03SurveyProps> = ({
    journeyId,
    isEditable = false,
    onSave,
    onEditStateChange
}) => {
    const { isAdmin } = useAuth();
    const [journey, setJourney] = useState<IJourney | null>(null);
    const [surveyRecord, setSurveyRecord] = useState<ISurveyRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [overallStatus, setOverallStatus] = useState<'in_progress' | 'completed'>('in_progress');
    const [formStep, setFormStep] = useState(0);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [surveyDataForm] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    // Initial load
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Journey
                const jData = await journeyService.findJourneyDto(journeyId);
                setJourney(jData);

                // 2. Fetch Existing Survey Record
                const sRecords = await surveyRecordService.querySurveyRecordsDto({
                    group: {
                        id: 'journey_id',
                        operation: 'eq',
                        value: journeyId,
                        children: [],
                    },
                });

                if (sRecords.data && sRecords.data.length > 0) {
                    const record = sRecords.data[0];
                    setSurveyRecord(record);
                    setSelectedAppointmentId(record.appointment_id || null);
                    setOverallStatus(record.survey_status === 'completed' ? 'completed' : 'in_progress');

                    // Map back to DynamicSurveyForm structure
                    const mappedFormData = {
                        header: {
                            urgency: 'Trong tuần',
                            original_request: jData.request_description
                        },
                        zones: record.condition_items?.map((item, idx) => ({
                            zoneCode: `KV-${(idx + 1).toString().padStart(2, '0')}`,
                            areaType: item.area_name || 'Khác',
                            location_desc: '', // We combined this into area_name in ISurveyRecord
                            status_desc: item.condition_note || '',
                            dims_area: item.measurement_note || '',
                            safetyOptions: item.risk_note ? [item.risk_note] : [],
                            proposed_solution: record.proposed_solution || ''
                        })) || []
                    };
                    surveyDataForm.setFieldsValue(mappedFormData);
                }
                // 3. Fetch Appointments for linking
                const apptRes = await surveyAppointmentService.queryContent({
                    group: { id: 'journey_id', operation: 'eq', value: journeyId, children: [] },
                    limit: 100
                });
                
                if (apptRes.data) {
                    setAppointments(apptRes.data);
                }
            } catch (error) {
                console.error('Failed to fetch survey data:', error);
                message.error('Không thể tải dữ liệu khảo sát');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [journeyId, surveyDataForm]);

    // Data for rendering
    const formValues = Form.useWatch([], surveyDataForm);

    // E-Signature States
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);
    const [sigData, setSigData] = useState<string | null>(null);
    const sigPadRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = sigPadRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = sigPadRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleClearSignature = () => {
        const canvas = sigPadRef.current;
        if (canvas) {
            canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
            setSigData(null);
        }
    };

    const handleSaveSignature = () => {
        const canvas = sigPadRef.current;
        if (canvas) {
            setSigData(canvas.toDataURL('image/png'));
            setIsSigModalOpen(false);
            message.success('Đã lưu chữ ký thành công!');
        } else {
            message.warning('Lỗi khi lưu chữ ký.');
        }
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById(`printable-a4-${journeyId}`);
        if (element) {
            const opt = {
                margin: 10,
                filename: `SURVEY-${journey?.journey_code || journeyId}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };
            html2pdf().set(opt).from(element).save();
        }
    };

    const handleFormSubmit = async () => {
        try {
            await surveyDataForm.validateFields();
            message.success('Đã xác nhận dữ liệu khu vực!');
            setFormStep(2); // Move to Preview
        } catch (error) {
            message.error('Vui lòng hoàn thiện các trường bắt buộc (Màu đỏ) của Khu vực khảo sát');
        }
    };

    const onCompleteSurvey = async () => {
        if (!sigData) {
            message.warning('Vui lòng xin chữ ký Khách hàng trước khi chốt hồ sơ!');
            return;
        }

        setIsSaving(true);
        try {
            const values = surveyDataForm.getFieldsValue();

            // Map DynamicSurveyForm -> ISurveyRecord
            const payload = {
                journey_id: journeyId,
                journey_step_code: 'site_survey' as any,
                appointment_id: selectedAppointmentId || undefined,
                survey_status: 'completed' as any,
                customer_name: journey?.customer_full_name,
                site_address: journey?.site_address,
                proposed_solution: values.zones?.[0]?.proposed_solution || '',
                condition_items: values.zones?.map((z: any) => ({
                    area_name: z.areaType,
                    condition_note: `${z.issueTypes?.join(', ') || ''} - ${z.status_desc || ''}`,
                    measurement_note: z.dims_area?.toString() || '0',
                    risk_note: z.safetyOptions?.join(', ') || ''
                })),
                // Signatures could be handled as attachments or separate fields in a real app
                // For now we just log success
            };

            if (surveyRecord?._id) {
                await surveyRecordService.updateSurveyRecord(surveyRecord._id, payload);
            } else {
                await surveyRecordService.createSurveyRecord(payload);
            }

            message.success('Hồ sơ KS đã chốt và nộp về hệ thống thành công!');
            setOverallStatus('completed');
            setIsEditing(false);
            if (onSave) onSave(payload);
        } catch (error) {
            console.error('Failed to complete survey:', error);
            message.error('Không thể lưu hồ sơ khảo sát');
        } finally {
            setIsSaving(false);
        }
    };

    const renderA4Sheet = (data: any) => (
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #d9d9d9', borderRadius: 8, background: '#f0f2f5', padding: '16px 0' }}>
            <div id={`printable-a4-${journeyId}`} style={{
                width: '210mm', minHeight: '297mm', background: '#fff',
                padding: '15mm 20mm', boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                fontFamily: '"Times New Roman", Times, serif',
                margin: '0 auto',
                color: '#000'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontSize: 13, fontWeight: 'bold' }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ margin: '5px auto', width: 100, borderTop: '1px solid #000' }}></div>
                </div>

                <div style={{ textAlign: 'center', margin: '30px 0' }}>
                    <div style={{ fontSize: 20, fontWeight: 'bold' }}>BIÊN BẢN KHẢO SÁT HIỆN TRẠNG</div>
                    <div style={{ fontSize: 12, fontStyle: 'italic', marginTop: 5 }}>Số: SUR-{journey?.journey_code || 'N/A'} / BAC</div>
                </div>

                <div style={{ lineHeight: 1.6, fontSize: 14 }}>
                    <p style={{ marginBottom: 15 }}>Hôm nay, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}, tại địa chỉ: {journey?.site_address || '---'}</p>

                    <div style={{ fontWeight: 'bold', marginBottom: 5 }}>I. Thành phần Khách hàng:</div>
                    <div style={{ marginLeft: 15, marginBottom: 10 }}>
                        <div>- Ông/Bà: <strong>{journey?.customer_full_name || '---'}</strong></div>
                        <div>- Điện thoại: {journey?.customer_phone || '---'}</div>
                    </div>

                    <div style={{ fontWeight: 'bold', marginBottom: 5 }}>II. Đại diện Công ty BAC(Đơn vị khảo sát):</div>
                    <div style={{ marginLeft: 15, marginBottom: 15 }}>
                        <div>- Ông/Bà: {journey?.supervisor_name || 'Nhân viên kỹ thuật'}</div>
                        <div>- Chức vụ: Chuyên viên khảo sát hiện trường</div>
                    </div>

                    <div style={{ fontWeight: 'bold', marginBottom: 5 }}>III. Nội dung khảo sát & Ghi nhận hiện trạng:</div>
                    <div style={{ marginLeft: 10 }}>
                        {data?.zones?.map((z: any, idx: number) => (
                            <div key={idx} style={{ marginBottom: 15, borderBottom: '1px dashed #eee', paddingBottom: 10 }}>
                                <div style={{ fontWeight: 'bold' }}>{idx + 1}. Hạng mục: {z?.areaType || 'Không định danh'}</div>
                                <div style={{ marginLeft: 10 }}>
                                    <div>+ Vị trí chi tiết: {z?.location_desc || 'Theo thực tế'}</div>
                                    <div>+ Khối lượng sơ bộ: {z.dims_area || '0'} m²</div>
                                    <div>+ Tình trạng: <span style={{ color: '#d00' }}>{z?.issueTypes?.join(', ') || 'Chưa ghi nhận'}</span></div>
                                    <div>+ Ghi chú: {z.status_desc || '---'}</div>
                                    <div style={{ fontWeight: 'bold', marginTop: 3 }}>+ Đề xuất sơ bộ: {z?.proposed_solution || '---'}</div>
                                </div>
                            </div>
                        ))}
                        {(!data?.zones || data?.zones?.length === 0) && (
                            <p style={{ fontStyle: 'italic', color: '#666' }}>Không ghi nhận hạng mục khảo sát nào.</p>
                        )}
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <p>Hai bên cùng xác nhận các thông tin trên là đúng với thực tế quan sát tại hiện trường. Kết quả khảo sát này là cơ sở để BAClập biện pháp thi công và báo giá chính thức.</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, textAlign: 'center' }}>
                        <div style={{ width: '45%' }}>
                            <strong>ĐẠI DIỆN KHÁCH HÀNG</strong>
                            <div style={{ fontStyle: 'italic', fontSize: 11 }}>(Ký và ghi rõ họ tên)</div>
                            <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                {sigData ? (
                                    <img src={sigData} alt="Signature" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                ) : (
                                    <div style={{ color: '#eee', height: 40 }}>[Chữ ký]</div>
                                )}
                            </div>
                        </div>
                        <div style={{ width: '45%' }}>
                            <strong>ĐẠI DIỆN KỸ THUẬT</strong>
                            <div style={{ fontStyle: 'italic', fontSize: 11 }}>(Ký và ghi rõ họ tên)</div>
                            <div style={{ height: 100, marginTop: 10 }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <Card variant="borderless" className="ky-card" style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Đang tải dữ liệu hồ sơ..." />
            </Card>
        );
    }

    const renderStepContent = () => {
        const templates = [
            { id: 'TPL-CTST', name: 'Chống thấm Sân thượng', description: 'Chuẩn cho bề mặt lộ thiên.' },
            { id: 'TPL-CTWC', name: 'Chống thấm WC', description: 'Kiểm tra hộp KT, ống xuyên sàn.' },
            { id: 'TPL-GENERAL', name: 'Khảo sát Tổng hợp', description: 'Đánh giá chung nhiều hạng mục.' }
        ];

        switch (formStep) {
            case 0:
                return (
                    <div style={{ padding: '16px 0' }}>
                        <Text strong style={{ fontSize: 16 }}>Chọn Mẫu Khảo Sát</Text>
                        <p style={{ color: '#666', marginBottom: 24 }}>Phân loại này giúp sinh form phù hợp với hạng mục tại hiện trường.</p>
                        <Row gutter={[12, 12]}>
                            {templates.map(tpl => (
                                <Col xs={24} sm={8} key={tpl.id}>
                                    <div
                                        className="ky-card"
                                        style={{
                                            background: '#fff',
                                            padding: 16,
                                            border: selectedTemplate === tpl.id ? '2px solid #1677ff' : '1px solid #f0f0f0',
                                            borderRadius: 8,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelectedTemplate(tpl.id)}
                                    >
                                        <div style={{ fontWeight: 600, color: selectedTemplate === tpl.id ? '#1677ff' : '#333' }}>{tpl.name}</div>
                                        <p style={{ marginTop: 8, fontSize: 12, color: '#666', marginBottom: 0 }}>{tpl.description}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <div style={{ marginTop: 24, marginBottom: 16 }}>
                            <Text strong>Liên kết Lịch hẹn (Traceability)</Text>
                            <Select
                                style={{ width: '100%', marginTop: 8 }}
                                placeholder="Chọn lịch hẹn khảo sát tương ứng..."
                                value={selectedAppointmentId}
                                onChange={setSelectedAppointmentId}
                                allowClear
                            >
                                {appointments.map(a => (
                                    <Select.Option key={a._id} value={a._id}>
                                        {dayjs(a.scheduled_at).format('HH:mm DD/MM/YYYY')} - {a.note || 'Không có ghi chú'}
                                    </Select.Option>
                                ))}
                            </Select>
                            {!appointments.length && <Text type="secondary" style={{ fontSize: 12 }}>Chưa có lịch hẹn nào được ghi nhận. Bạn vẫn có thể khảo sát trực tiếp.</Text>}
                        </div>
                        <div style={{ marginTop: 24 }}>
                            <Button type="primary" block size="large" disabled={!selectedTemplate} onClick={() => setFormStep(1)}>
                                Bắt đầu nhập liệu
                            </Button>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div style={{ padding: '16px 0' }}>
                        <DynamicSurveyForm form={surveyDataForm} initialTemplate={selectedTemplate} />

                        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                            <Button onClick={() => setFormStep(0)} style={{ flex: 1 }}>Quay lại</Button>
                            <Button type="primary" size="large" onClick={handleFormSubmit} style={{ flex: 2 }}>
                                Xem Biên bản
                            </Button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div style={{ padding: '16px 0' }}>
                        <Result
                            status="info"
                            title="Xác nhận Kết quả"
                            subTitle="Hãy kiểm tra lại số liệu trước khi xin chữ ký Khách hàng."
                            style={{ padding: '16px 0' }}
                        />
                        {renderA4Sheet(formValues)}

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <Button key="back" onClick={() => setFormStep(1)} style={{ flex: 1 }}>Sửa lại</Button>
                            <Button key="submit" type="primary" size="large" onClick={() => setFormStep(3)} style={{ flex: 2 }}>
                                Tiến hành Ký tên
                            </Button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Space style={{ marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Button type="primary" size="large" icon={<HighlightOutlined />} onClick={() => setIsSigModalOpen(true)}>
                                Lấy chữ ký Khách hàng
                            </Button>
                            <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF} type="dashed">Lưu PDF</Button>
                        </Space>

                        <div style={{ width: '100%', marginBottom: 24 }}>
                            <Button
                                type="primary"
                                size="large"
                                block
                                loading={isSaving}
                                icon={<CheckCircleOutlined />}
                                style={{ background: '#52c41a', borderColor: '#52c41a', height: 50 }}
                                onClick={onCompleteSurvey}
                            >
                                Đóng & Nộp Hồ Sơ Khảo Sát
                            </Button>
                        </div>

                        {renderA4Sheet(formValues)}
                    </div>
                );
            default: return null;
        }
    };

    const renderReadOnly = () => {
        return (
            <div>
                <Card variant="borderless" style={{ background: '#f6faff', marginBottom: 20 }}>
                    <Space align="start">
                        {overallStatus === 'completed' ? (
                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 32 }} />
                        ) : (
                            <ClockCircleOutlined style={{ color: '#1677ff', fontSize: 32 }} />
                        )}
                        <div>
                             <Title level={5} style={{ margin: 0 }}>
                                {overallStatus === 'completed' ? 'Hồ sơ khảo sát đã hoàn tất' : 'Hồ sơ khảo sát đang thực hiện'}
                            </Title>
                            <Text type="secondary">Mã hồ sơ: SUR-{journey?.journey_code || '---'}</Text>
                            {selectedAppointmentId && (
                                <div style={{ marginTop: 4 }}>
                                    <Tag color="cyan">Link tới Lịch hẹn: {dayjs(appointments.find(a => a._id === selectedAppointmentId)?.scheduled_at).format('DD/MM/YYYY')}</Tag>
                                </div>
                            )}
                        </div>
                    </Space>
                </Card>

                {surveyRecord ? (
                    renderA4Sheet({
                        zones: surveyRecord.condition_items?.map(i => ({
                            areaType: i.area_name,
                            location_desc: '',
                            issueTypes: [i.condition_note],
                            dims_area: i.measurement_note,
                            proposed_solution: surveyRecord.proposed_solution
                        }))
                    })
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Chưa có dữ liệu khảo sát chính thức cho công trình này."
                    />
                )}

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF} disabled={!surveyRecord}>
                        Xuất file PDF
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Card
            title={isEditing ? "Đang tiến hành Khảo sát" : "Chi tiết Khảo sát"}
            variant="borderless"
            className="ky-card"
            style={{ borderRadius: 12 }}
            extra={(isEditable || isAdmin) && (
                <Button
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => {
                        const newEditing = !isEditing;
                        setIsEditing(newEditing);
                        if (onEditStateChange) onEditStateChange(newEditing);
                    }}
                >
                    {isEditing ? "Xem lại" : (overallStatus === 'completed' ? "Cập nhật" : "Khảo sát ngay")}
                </Button>
            )}
        >
            {isEditing ? (
                <div>
                    <div style={{ marginBottom: 20 }}>
                        <Steps
                            current={formStep}
                            size="small"
                            items={[
                                { title: 'Mẫu', icon: <FormOutlined /> },
                                { title: 'Data', icon: <EditOutlined /> },
                                { title: 'Review', icon: <CheckCircleOutlined /> },
                                { title: 'Ký', icon: <FilePdfOutlined /> }
                            ]}
                        />
                    </div>
                    {renderStepContent()}
                </div>
            ) : renderReadOnly()}

            <Modal
                title="Khách hàng ký xác nhận"
                open={isSigModalOpen}
                onCancel={() => setIsSigModalOpen(false)}
                footer={[
                    <Button key="clear" onClick={handleClearSignature}>Ký lại</Button>,
                    <Button key="save" type="primary" onClick={handleSaveSignature}>Lưu chữ ký</Button>
                ]}
                width="100%"
                style={{ top: 10 }}
                styles={{ body: { padding: 0 } }}
            >
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <Text type="secondary">Vui lòng ký vào khung bên dưới</Text>
                </div>
                <div style={{
                    borderTop: '1px solid #f0f0f0',
                    borderBottom: '1px solid #f0f0f0',
                    background: '#fff',
                    touchAction: 'none',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <canvas
                        ref={sigPadRef}
                        width={350}
                        height={250}
                        style={{ cursor: 'crosshair' }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>
            </Modal>
        </Card>
    );
};

export default Step03Survey;


