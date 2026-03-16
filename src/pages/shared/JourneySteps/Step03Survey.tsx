import React, { useState, useRef } from 'react';
import { Card, Steps, Button, Typography, Space, Tag, Descriptions, Row, Col, Result, Form, message, Modal } from 'antd';
import { 
    CheckCircleOutlined, 
    FormOutlined, 
    FilePdfOutlined, 
    EditOutlined, 
    DownloadOutlined, 
    HighlightOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockJourneys } from '../../../data/journeyMockData';
import DynamicSurveyForm from '../../shared/Surveys/DynamicSurveyForm';
import html2pdf from 'html2pdf.js';

const { Text } = Typography;

const mockTemplates = [
    { id: 'TPL-CTST', name: 'Khảo sát Chống thấm Sân thượng', description: 'Template chuẩn cho thấm dột bề mặt lộ thiên.' },
    { id: 'TPL-CTWC', name: 'Khảo sát Chống thấm WC', description: 'Kiểm tra hộp kỹ thuật, đường ống, kẽ gạch.' },
    { id: 'TPL-CBTN', name: 'Khảo sát Cải tạo Nhà', description: 'Template tổng hợp đánh giá kết cấu, tường, điện nước.' }
];

export interface Step03SurveyProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step03Survey: React.FC<Step03SurveyProps> = ({ journeyId, isEditable = false, onSave }) => {
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.id === journeyId) || mockJourneys[0];

    const [overallStatus, setOverallStatus] = useState<'in_progress' | 'completed'>(
        journey.survey_status === 'completed' ? 'completed' : 'in_progress'
    );
    const [formStep, setFormStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [surveyDataForm] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    
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
                margin:       10,
                filename:     `SURVEY-${journey.journey_code}.pdf`,
                image:        { type: 'jpeg' as const, quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
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

    const renderStepContent = () => {
        switch (formStep) {
            case 0:
                return (
                    <div style={{ padding: '16px 0' }}>
                        <Text strong style={{ fontSize: 16 }}>Chọn Mẫu Khảo Sát Tương Ứng</Text>
                        <p style={{ color: '#666', marginBottom: 24 }}>Phân loại này giúp sinh form phù hợp với công việc tại hiện trường.</p>
                        <Row gutter={[12, 12]}>
                            {mockTemplates.map(tpl => (
                                <Col xs={24} sm={12} key={tpl.id}>
                                    <div
                                        className="ky-card"
                                        style={{ 
                                            background: '#fff',
                                            padding: 16,
                                            border: selectedTemplate === tpl.id ? '2px solid #13a8a8' : '1px solid #f0f0f0',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelectedTemplate(tpl.id)}
                                    >
                                        <div style={{ fontWeight: 600, color: selectedTemplate === tpl.id ? '#13a8a8' : '#333' }}>{tpl.name}</div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{tpl.id}</Text>
                                        <p style={{ marginTop: 8, fontSize: 13, color: '#666', marginBottom: 0 }}>{tpl.description}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <div style={{ marginTop: 24 }}>
                            <Button type="primary" block disabled={!selectedTemplate} onClick={() => setFormStep(1)} style={{ backgroundColor: selectedTemplate ? '#13a8a8' : undefined }}>
                                Bắt đầu nhập liệu Form
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
                            <Button type="primary" onClick={handleFormSubmit} style={{ flex: 2, backgroundColor: '#13a8a8' }}>
                                Rà soát Biên bản
                            </Button>
                        </div>
                    </div>
                );
            case 2:
                const surveyData = surveyDataForm.getFieldsValue();
                return (
                    <div style={{ padding: '16px 0' }}>
                        <Result
                            status="info"
                            title="Xác nhận Kết quả Khảo Sát"
                            subTitle="Bạn (Kỹ thuật viên) hãy kiểm tra lại toàn bộ số liệu và hình ảnh trước khi xin chữ ký Khách hàng."
                        />
                        <div className="ky-card" style={{ padding: 16, background: '#fafafa', marginBottom: 24, border: '1px solid #f0f0f0', borderRadius: 8 }}>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Mức độ ưu tiên">{surveyData?.header?.urgency || 'Trong tuần'}</Descriptions.Item>
                                <Descriptions.Item label="Yêu cầu gốc">{surveyData?.header?.original_request || '---'}</Descriptions.Item>
                                <Descriptions.Item label="Số lượng khu vực">{surveyData?.zones?.length || 0} khu vực</Descriptions.Item>
                            </Descriptions>

                            {surveyData?.zones?.map((zone: any, idx: number) => (
                                <Card type="inner" key={idx} title={`KV ${idx + 1}: ${zone?.areaType || '---'}`} style={{ marginTop: 16 }}>
                                    <Descriptions column={1} size="small" bordered>
                                        <Descriptions.Item label="Vị trí">{zone?.location_desc || '---'}</Descriptions.Item>
                                        <Descriptions.Item label="DT ước tính">D:{zone?.dims_length||'-'}x R:{zone?.dims_width||'-'}x C:{zone?.dims_height||'-'} = {zone?.dims_area||'-'} m²</Descriptions.Item>
                                        <Descriptions.Item label="Vấn đề">
                                            {zone?.issueTypes?.length ? zone.issueTypes.map((i: string) => <Tag color="red" key={i}>{i}</Tag>) : '---'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nguyên nhân">
                                            {zone?.causeOptions?.length ? zone.causeOptions.map((i: string) => <Tag color="volcano" key={i}>{i}</Tag>) : '---'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Đề xuất">
                                            {zone?.proposed_solution || '---'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            ))}
                        </div>
                        
                        <div style={{ display: 'flex', gap: 12 }}>
                            <Button key="back" onClick={() => setFormStep(1)} style={{ flex: 1 }}>Sửa lại</Button>
                            <Button key="submit" type="primary" onClick={() => { message.success('Đã lưu dữ liệu'); setFormStep(3); }} style={{ flex: 2, backgroundColor: '#13a8a8' }}>
                                Chuyển sang Bước Ký Tên
                            </Button>
                        </div>
                    </div>
                );
            case 3:
                const finalData = surveyDataForm.getFieldsValue();
                return (
                    <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <style>
                            {`
                            @media print {
                                body * { visibility: hidden; }
                                #printable-a4-${journeyId}, #printable-a4-${journeyId} * { visibility: visible; }
                                #printable-a4-${journeyId} { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; margin: 0 !important; padding: 0 !important; }
                                .ky-thuat-layout { padding-bottom: 0 !important; }
                                .ky-thuat-header, .ky-thuat-bottom-nav, .no-print { display: none !important; }
                            }
                            `}
                        </style>

                        <Space style={{ marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }} className="no-print">
                            <Button type="primary" icon={<HighlightOutlined />} onClick={() => setIsSigModalOpen(true)} style={{ backgroundColor: '#13a8a8' }}>
                                Xin chữ ký Khách hàng (Mobile)
                            </Button>
                            <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF} type="dashed">Lưu dạng PDF</Button>
                        </Space>

                        <div style={{ width: '100%', marginBottom: 24 }} className="no-print">
                            <Button 
                                type="primary" 
                                size="large" 
                                block
                                icon={<CheckCircleOutlined />} 
                                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                onClick={() => {
                                    if (!sigData) {
                                        message.warning('Vui lòng xin chữ ký Khách hàng trước khi chốt hồ sơ!');
                                        return;
                                    }
                                    message.success('Hồ sơ KS đã chốt và đẩy về Sale/Thiết kế thống nhất!');
                                    setOverallStatus('completed');
                                    setIsEditing(false);
                                    if (onSave) onSave(finalData);
                                }}
                            >
                                Đóng Hồ Sơ & Nộp Về Trụ Sở
                            </Button>
                        </div>

                        {/* A4 Document Preview */}
                        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #d9d9d9', borderRadius: 8, background: '#f0f2f5', padding: '16px 0' }}>
                            <div id={`printable-a4-${journeyId}`} style={{ 
                                width: '210mm', minHeight: '297mm', background: '#fff', 
                                padding: '20mm', boxShadow: '0 0 10px rgba(0,0,0,0.1)', 
                                fontFamily: '"Times New Roman", Times, serif',
                                margin: '0 auto'
                            }}>
                                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                                    <div style={{ fontSize: 14, fontWeight: 'bold', textDecoration: 'underline' }}>Độc lập - Tự do - Hạnh phúc</div>
                                </div>
                                
                                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>BIÊN BẢN KHẢO SÁT HIỆN TRẠNG</div>
                                    <div style={{ fontSize: 13, fontStyle: 'italic', marginTop: 5 }}>Số: SUR-{journey.journey_code} / SIRA</div>
                                </div>

                                <div style={{ lineHeight: 1.8, fontSize: 14 }}>
                                    <p>Hôm nay, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}, tại công trình:</p>
                                    
                                    <strong>I. Thành phần Khách hàng:</strong>
                                    <p style={{ marginLeft: 20, margin: 0 }}>Ông/Bà: <strong>{journey.customer_name}</strong></p>
                                    <p style={{ marginLeft: 20, margin: 0 }}>Địa chỉ khảo sát: {journey.site_address}</p>
                                    <br />

                                    <strong>II. Thành phần Đội ngũ SIRA:</strong>
                                    <p style={{ marginLeft: 20, margin: 0 }}>Ông/Bà: Bùi Văn Kỹ thuật</p>
                                    <p style={{ marginLeft: 20, margin: 0 }}>Chức trách: Nhân sự Khảo sát trực tiếp</p>
                                    <br />

                                    <strong>III. Kết quả khảo sát:</strong>
                                    <div style={{ marginTop: 10 }}>
                                        {finalData?.zones?.map((z: any, idx: number) => (
                                            <div key={idx} style={{ marginBottom: 15, paddingBottom: 10 }}>
                                                <div style={{ fontWeight: 'bold' }}>{idx + 1}. Khu vực {z?.areaType || ''}</div>
                                                <ul style={{ margin: '5px 0' }}>
                                                    <li><strong>Vị trí:</strong> {z?.location_desc || '---'}</li>
                                                    <li><strong>S diện tích:</strong> {z.dims_area||0}m² (Khối lượng sơ bộ d={z.dims_length} r={z.dims_width})</li>
                                                    <li><strong>Hiện trạng ghi nhận:</strong> {z?.issueTypes?.join(', ') || '---'}</li>
                                                    <li><strong>Nhận định nguyên nhân gốc:</strong> {z?.causeOptions?.join(', ') || '---'}</li>
                                                    <li><strong>Phát đồ cứu hộ sơ bộ:</strong> {z?.proposed_solution || '---'}</li>
                                                </ul>
                                            </div>
                                        ))}
                                        {(!finalData?.zones || finalData?.zones?.length === 0) && (
                                            <p style={{ fontStyle: 'italic', color: '#666' }}>Không ghi nhận khu vực bất thường nào.</p>
                                        )}
                                    </div>

                                    <br />
                                    <p>Biên bản kết thúc vào lúc .... giờ .... cùng ngày. Cả hai bên đã kiểm tra hiện trạng thực tế, thống nhất với số liệu ghi nhận.</p>
                                    <p>Phòng Kỹ Thuật sẽ lập Biện pháp thi công chi tiết làm cơ sở Bảng Gía để báo khách hàng trong vòng 24hr.</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50, textAlign: 'center' }}>
                                        <div style={{ width: '40%' }}>
                                            <strong>ĐẠI DIỆN KHÁCH HÀNG</strong>
                                            <div style={{ fontStyle: 'italic', fontSize: 12 }}>(Ký và ghi rõ họ tên)</div>
                                            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {sigData ? (
                                                    <img src={sigData} alt="Client Signature" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                                ) : null}
                                            </div>
                                        </div>
                                        <div style={{ width: '40%' }}>
                                            <strong>ĐẠI DIỆN KỸ THUẬT (SIRA)</strong>
                                            <div style={{ fontStyle: 'italic', fontSize: 12 }}>(Ký và ghi rõ họ tên)</div>
                                            <div style={{ height: 120 }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    const renderReadOnly = () => {
        if (overallStatus === 'completed') {
            return (
                <Result
                    status="success"
                    title="Hồ sơ khảo sát đã được hoàn thành!"
                    subTitle="Biên bản đã được lưu và gửi về hệ thống quản lý trung tâm."
                    extra={[
                        <Button type="primary" key="back" onClick={() => navigate('/ky-thuat/dashboard')} style={{ backgroundColor: '#13a8a8' }}>
                            Quay lại Dashboard
                        </Button>,
                        <Button key="download" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Tải file PDF</Button>
                    ]}
                />
            );
        }
        return (
            <Result
                status="info"
                title="Đang chờ kết quả"
                subTitle="Kỹ thuật viên đang thực hiện khảo sát tại hiện trường hoặc hồ sơ đang được soạn thảo."
            />
        );
    };

    return (
        <Card 
            title={isEditing ? "Thực hiện: Khảo sát hiện trạng" : "Kết quả khảo sát kỹ thuật"} 
            bordered={false} 
            className="ky-card"
            extra={isEditable && (
                <Button 
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Xem lại" : (overallStatus === 'completed' ? "Cập nhật lại" : "Bắt đầu khảo sát")}
                </Button>
            )}
        >
            {!isEditable && (
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Bạn đang ở chế độ Chỉ đọc (Chưa có quyền KeyRole hoặc chưa được phân công).</Text>
                </div>
            )}
            
            {isEditing ? (
                <div>
                     <div style={{ marginBottom: 16 }}>
                        <Steps
                            current={formStep}
                            size="small"
                            items={[
                                { title: 'Mẫu', icon: <FormOutlined /> },
                                { title: 'Data', icon: <EditOutlined /> },
                                { title: 'Preview', icon: <CheckCircleOutlined /> },
                                { title: 'Ký', icon: <FilePdfOutlined /> }
                            ]}
                        />
                    </div>
                    {renderStepContent()}
                </div>
            ) : renderReadOnly()}

            <Modal
                title="Khách hàng Ký trực tiếp"
                open={isSigModalOpen}
                onCancel={() => setIsSigModalOpen(false)}
                footer={[
                    <Button key="clear" onClick={handleClearSignature}>Ký lại (Xóa)</Button>,
                    <Button key="save" type="primary" onClick={handleSaveSignature} style={{ backgroundColor: '#13a8a8' }}>Xác nhận Lưu</Button>
                ]}
                width="100%"
                style={{ top: 20 }}
                bodyStyle={{ padding: '16px 0' }}
            >
                <div>
                    <p style={{ padding: '0 16px', marginBottom: 16, fontSize: 13, color: '#666' }}>
                        Khách hàng vui lòng dùng ngón tay ký trực tiếp vào khung dưới đây.
                    </p>
                    <div style={{ 
                        borderTop: '2px dashed #d9d9d9', 
                        borderBottom: '2px dashed #d9d9d9', 
                        background: '#fafafa', 
                        overflow: 'hidden', 
                        touchAction: 'none', 
                        display: 'flex', 
                        justifyContent: 'center' 
                    }}>
                        <canvas 
                            ref={sigPadRef}
                            width={350}
                            height={250}
                            style={{ cursor: 'crosshair', background: '#fff' }}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

export default Step03Survey;
