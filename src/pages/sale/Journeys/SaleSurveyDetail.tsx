import React, { useState, useRef } from 'react';
import { Card, Steps, Button, Typography, Space, Tag, Descriptions, Row, Col, Result, Form, message, Modal } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, FormOutlined, FilePdfOutlined, EditOutlined, ClockCircleOutlined, DownloadOutlined, HighlightOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import DynamicSurveyForm from '../../shared/Surveys/DynamicSurveyForm';
import SignatureCanvas from 'react-signature-canvas';
import html2pdf from 'html2pdf.js';

const { Text } = Typography;

const mockTemplates = [
    { id: 'TPL-CTST', name: 'Khảo sát Chống thấm Sân thượng', description: 'Template chuẩn cho thấm dột bề mặt lộ thiên.' },
    { id: 'TPL-CTWC', name: 'Khảo sát Chống thấm WC', description: 'Kiểm tra hộp kỹ thuật, đường ống, kẽ gạch.' },
    { id: 'TPL-CBTN', name: 'Khảo sát Cải tạo Nhà', description: 'Template tổng hợp đánh giá kết cấu, tường, điện nước.' }
];

const SaleSurveyDetail: React.FC = () => {
    const { journeyId, surveyId } = useParams<{ journeyId: string, surveyId: string }>();
    const navigate = useNavigate();
    const [journey, setJourney] = React.useState<any>(null);

    React.useEffect(() => {
        if (journeyId) {
            journeyService.findContent(journeyId).then(res => setJourney(res));
        }
    }, [journeyId]);

    const [overallStatus, setOverallStatus] = useState<'scheduled' | 'confirmed' | 'in_progress' | 'completed'>('scheduled');
    const [formStep, setFormStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [surveyDataForm] = Form.useForm();

    // E-Signature States
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);
    const [sigData, setSigData] = useState<string | null>(null);
    const sigPadRef = useRef<any>(null);

    const handleClearSignature = () => {
        if (sigPadRef.current) {
            sigPadRef.current.clear();
        }
    };

    const handleSaveSignature = () => {
        if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
            setSigData(sigPadRef.current.getTrimmedCanvas().toDataURL('image/png'));
            setIsSigModalOpen(false);
            message.success('Đã lưu chữ ký thành công!');
        } else {
            message.warning('Vui lòng tạo chữ ký trước khi lưu.');
        }
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('printable-a4');
        if (element) {
            const opt = {
                margin: 10,
                filename: `SURA-Survey-${surveyId || '2024'}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };
            html2pdf().set(opt).from(element).save();
        }
    };

    const handleBack = () => navigate(`/sale/dashboard/${journey.id}?tab=survey`);

    const handleFormSubmit = async () => {
        try {
            const values = await surveyDataForm.validateFields();
            console.log('Survey Data Collected:', values);
            message.success('Đã lưu dữ liệu tạm thời!');
            setFormStep(2); // Move to Preview
        } catch (error) {
            message.error('Vui lòng hoàn thiện các trường bắt buộc của Khu vực khảo sát');
        }
    };

    const renderStepContent = () => {
        switch (formStep) {
            case 0:
                return (
                    <div style={{ padding: '16px 0' }}>
                        <Text strong style={{ fontSize: 16 }}>Chọn Định Nghĩa Mẫu Khảo Sát (Template)</Text>
                        <p style={{ color: '#666', marginBottom: 24 }}>Hệ thống sẽ sinh ra form nhập liệu cấu trúc động theo template được chọn.</p>
                        <Row gutter={[16, 16]}>
                            {mockTemplates.map(tpl => (
                                <Col xs={24} sm={12} md={8} key={tpl.id}>
                                    <Card
                                        hoverable
                                        style={{ border: selectedTemplate === tpl.id ? '2px solid #1677ff' : '1px solid #f0f0f0' }}
                                        onClick={() => setSelectedTemplate(tpl.id)}
                                    >
                                        <div style={{ fontWeight: 600, color: selectedTemplate === tpl.id ? '#1677ff' : '#333' }}>{tpl.name}</div>
                                        <Text type="secondary" style={{ fontSize: 13 }}>{tpl.id}</Text>
                                        <p style={{ marginTop: 12, fontSize: 13, color: '#666' }}>{tpl.description}</p>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <div style={{ marginTop: 24, textAlign: 'right' }}>
                            <Button type="primary" disabled={!selectedTemplate} onClick={() => setFormStep(1)}>Tiếp tục: Bắt đầu khai báo Dữ liệu</Button>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div style={{ padding: '16px 0' }}>
                        <DynamicSurveyForm form={surveyDataForm} initialTemplate={selectedTemplate} />
                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={() => setFormStep(0)}>Quay lại Chọn Mẫu</Button>
                            <Button type="primary" onClick={handleFormSubmit}>
                                Rà soát & Gửi Biên Bản (Next)
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
                            title="Xác nhận Gửi biên bản Khảo Sát"
                            subTitle="Bạn đã hoàn tất việc nhập liệu. Vui lòng rà soát và Submit để tạo file Biên bản."
                        />
                        <Card size="small" title="Tóm tắt dữ liệu Khảo sát" style={{ marginBottom: 24, background: '#fafafa' }}>
                            <Descriptions column={2} size="small" bordered>
                                <Descriptions.Item label="Mức độ ưu tiên">{surveyData?.header?.urgency || 'Không rõ'}</Descriptions.Item>
                                <Descriptions.Item label="Nhu cầu gốc">{surveyData?.header?.original_request || 'Không có'}</Descriptions.Item>
                                <Descriptions.Item label="Tổng số Khu vực" span={2}>{surveyData?.zones?.length || 0} khu vực</Descriptions.Item>
                            </Descriptions>

                            {surveyData?.zones?.map((zone: any, idx: number) => (
                                <Card type="inner" key={idx} title={`Khu vực ${idx + 1}: ${zone?.areaType || 'Chưa định danh'} (${zone?.zoneCode})`} style={{ marginTop: 16 }}>
                                    <Descriptions column={1} size="small" bordered>
                                        <Descriptions.Item label="Vị trí cụ thể">{zone?.location_desc || 'Chưa nhập'}</Descriptions.Item>
                                        <Descriptions.Item label="Dấu hiệu">
                                            {zone?.issueTypes?.length ? zone.issueTypes.map((i: string) => <Tag color="red" key={i}>{i}</Tag>) : 'Chưa chọn'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nguyên nhân nghi ngờ">
                                            {zone?.causeOptions?.length ? zone.causeOptions.map((i: string) => <Tag color="volcano" key={i}>{i}</Tag>) : 'Chưa chọn'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Kích thước sơ bộ">
                                            D: {zone?.dims_length || '-'}m x R: {zone?.dims_width || '-'}m x C: {zone?.dims_height || '-'}m. S = {zone?.dims_area || '-'} m²
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Bề mặt">
                                            {zone?.surfaceConditions?.length ? zone.surfaceConditions.map((i: string) => <Tag color="blue" key={i}>{i}</Tag>) : 'Chưa ghi nhận'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="An toàn">
                                            {zone?.safetyOptions?.length ? zone.safetyOptions.map((i: string) => <Tag color="orange" key={i}>{i}</Tag>) : 'Bình thường'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Báo cáo viên đề xuất">{zone?.proposed_solution || 'Chưa có'}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            ))}
                        </Card>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                            <Button key="back" onClick={() => setFormStep(1)}>Chỉnh sửa lại</Button>
                            <Button key="submit" type="primary" onClick={() => { message.success('Đã lưu kết quả'); setFormStep(3); }}>Submit Biên bản</Button>
                        </div>
                    </div>
                );
            case 3:
                const finalData = surveyDataForm.getFieldsValue();
                return (
                    <div style={{ padding: '16px 0', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* CSS Print Logic */}
                        <style>
                            {`
                            @media print {
                                body * { visibility: hidden; }
                                #printable-a4, #printable-a4 * { visibility: visible; }
                                #printable-a4 { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; margin: 0 !important; padding: 0 !important; }
                                .no-print { display: none !important; }
                            }
                            `}
                        </style>

                        {/* Thanh công cụ (Không in) */}
                        <Space style={{ marginBottom: 24 }} className="no-print">
                            <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF} type="dashed">Tải Bản PDF</Button>
                            <Button icon={<FilePdfOutlined />} onClick={() => window.print()}>Xem & In Ấn</Button>
                            <Button type="primary" icon={<HighlightOutlined />} onClick={() => setIsSigModalOpen(true)}>
                                Khách hàng Ký trực tiếp
                            </Button>
                        </Space>

                        <div style={{
                            width: '210mm',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginBottom: 24
                        }} className="no-print">
                            <Button
                                type="primary"
                                size="large"
                                icon={<CheckCircleOutlined />}
                                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                onClick={() => {
                                    message.success('Hồ sơ khảo sát đã được chốt và lưu vào Hành trình!');
                                    setOverallStatus('completed');
                                }}
                            >
                                Hoàn thành & Chốt hồ sơ KS
                            </Button>
                        </div>

                        {/* Giao diện Biên Bản A4 */}
                        <div id="printable-a4" style={{
                            width: '210mm', minHeight: '297mm', background: '#fff',
                            padding: '20mm', boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                            fontFamily: '"Times New Roman", Times, serif'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <div style={{ fontSize: 16, fontWeight: 'bold' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                                <div style={{ fontSize: 14, fontWeight: 'bold', textDecoration: 'underline' }}>Độc lập - Tự do - Hạnh phúc</div>
                            </div>

                            <div style={{ textAlign: 'center', margin: '40px 0' }}>
                                <div style={{ fontSize: 24, fontWeight: 'bold' }}>BIÊN BẢN KHẢO SÁT HIỆN TRẠNG</div>
                                <div style={{ fontSize: 13, fontStyle: 'italic', marginTop: 5 }}>Số: SUR-{surveyId?.substring(0, 6) || '2024'} / SIRA</div>
                            </div>

                            <div style={{ lineHeight: 1.8, fontSize: 14 }}>
                                <p>Hôm nay, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}, chúng tôi gồm có:</p>

                                <strong>I. Thành phần Khảo sát (Đại diện SIRA):</strong>
                                <p style={{ marginLeft: 20, margin: 0 }}>Ông/Bà: Báo cáo viên kỹ thuật</p>
                                <p style={{ marginLeft: 20, margin: 0 }}>Chức vụ: Chuyên viên Khảo sát - Báo giá</p>
                                <br />

                                <strong>II. Thành phần Khách hàng:</strong>
                                <p style={{ marginLeft: 20, margin: 0 }}>Ông/Bà: <strong>{journey.idx_customer_id?.primary_text || journey.customer_name}</strong></p>
                                <p style={{ marginLeft: 20, margin: 0 }}>Thông tin liên hệ: {journey.idx_customer_id?.secondary_text || journey.customer_phone || '[Đang cập nhật]'}</p>
                                <br />

                                <strong>III. Nội dung Khảo sát:</strong>
                                <p>Tiến hành khảo sát hiện trạng công trình tại mục tiêu. Kết quả ghi nhận như sau:</p>

                                <div style={{ marginTop: 10 }}>
                                    {finalData?.zones?.map((z: any, idx: number) => (
                                        <div key={idx} style={{ marginBottom: 15, borderBottom: '1px dashed #ccc', paddingBottom: 10 }}>
                                            <div style={{ fontWeight: 'bold' }}>{idx + 1}. Khu vực: {z?.areaType || '---'} ({z?.zoneCode})</div>
                                            <ul style={{ margin: '5px 0' }}>
                                                <li><strong>Vị trí:</strong> {z?.location_desc || '---'}</li>
                                                <li><strong>Khối lượng ước tính (~):</strong> D:{z.dims_length || 0}m x R:{z.dims_width || 0}m. Diện tích: {z.dims_area || 0}m²</li>
                                                <li><strong>Hiện trạng ghi nhận:</strong> {z?.issueTypes?.join(', ') || '---'}</li>
                                                <li><strong>Nguyên nhân nhận định:</strong> {z?.causeOptions?.join(', ') || '---'}</li>
                                                <li><strong>Đề xuất xử lý:</strong> {z?.proposed_solution || '---'}</li>
                                            </ul>
                                        </div>
                                    ))}
                                    {(!finalData?.zones || finalData?.zones?.length === 0) && (
                                        <p style={{ fontStyle: 'italic', color: '#666' }}>Không ghi nhận khu vực bất thường nào.</p>
                                    )}
                                </div>

                                <br />
                                <p>Biên bản kết thúc vào lúc .... giờ .... cùng ngày, đã được hai bên đọc, thống nhất ý kiến và cùng ký tên dưới đây.</p>
                                <p>Biên bản này làm cơ sở lập Phương án thi công và Báo giá chi tiết gửi đến Quý khách hàng.</p>

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
                                        <strong>ĐẠI DIỆN KHẢO SÁT (SIRA)</strong>
                                        <div style={{ fontStyle: 'italic', fontSize: 12 }}>(Ký và ghi rõ họ tên)</div>
                                        <div style={{ height: 100 }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    if (!journey) return <div>Đang tải...</div>;

    return (
        <div style={{ paddingBottom: 60 }}>
            <Button icon={<ArrowLeftOutlined />} type="text" onClick={handleBack} style={{ marginBottom: 12 }}>
                Quay lại Hành trình
            </Button>

            <Card variant="borderless" style={{ marginBottom: 16, borderRadius: 8 }} styles={{ body: { padding: '16px 24px' } }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Space size="large">
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Mã Khảo Sát</Text>
                                <div style={{ fontWeight: 600, fontSize: 16 }}>SUR-{surveyId?.substring(0, 6) || '2024'}</div>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Hành trình</Text>
                                <div style={{ fontWeight: 600 }}>{journey.journey_code}</div>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Khách hàng</Text>
                                <div style={{ fontWeight: 600 }}>{journey.idx_customer_id?.primary_text || journey.customer_name}</div>
                            </div>
                        </Space>
                    </Col>
                    <Col>
                        {overallStatus === 'scheduled' && (
                            <Space>
                                <Button onClick={() => navigate(-1)}>Hủy lịch</Button>
                                <Button type="primary" onClick={() => setOverallStatus('confirmed')}>Xác nhận lịch hẹn</Button>
                            </Space>
                        )}
                        {overallStatus === 'confirmed' && (
                            <Button type="primary" onClick={() => setOverallStatus('in_progress')}>Bắt đầu tiến hành (Tạo Form)</Button>
                        )}
                        {overallStatus === 'in_progress' && (
                            <Tag color="processing" icon={<ClockCircleOutlined />}>Đang tiến hành Khảo sát</Tag>
                        )}
                        {overallStatus === 'completed' && (
                            <Tag color="success" icon={<CheckCircleOutlined />}>Khảo sát Hoàn tất</Tag>
                        )}
                    </Col>
                </Row>

                <div style={{ marginTop: 24 }}>
                    <Steps
                        size="small"
                        current={['scheduled', 'confirmed', 'in_progress', 'completed'].indexOf(overallStatus)}
                        items={[
                            { title: 'Lên lịch', description: 'Đã hẹn KH' },
                            { title: 'Xác nhận', description: 'Kỹ thuật chốt lịch' },
                            { title: 'Bắt đầu', description: 'Thực hiện KS' },
                            { title: 'Hoàn thành', description: 'Chốt hồ sơ KS' }
                        ]}
                    />
                </div>
            </Card>

            {/* VÙNG WORKSPACE */}
            {['scheduled', 'confirmed'].includes(overallStatus) && (
                <Card title="Thông tin Lịch Hẹn" style={{ borderRadius: 8 }}>
                    <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Thời gian hẹn">20-11-2024 14:00</Descriptions.Item>
                        <Descriptions.Item label="Kỹ thuật phụ trách">{journey.surveyor_name || 'Nguyễn Văn KS'}</Descriptions.Item>
                        <Descriptions.Item label="Địa điểm">{journey.site_address}</Descriptions.Item>
                        <Descriptions.Item label="Ghi chú Sale">Nhờ kiểm tra kỹ phần thấm dột mái.</Descriptions.Item>
                    </Descriptions>
                    <div style={{ marginTop: 24, textAlign: 'center', color: '#888' }}>
                        <FormOutlined style={{ fontSize: 48, color: '#e0e0e0' }} />
                        <p style={{ marginTop: 12 }}>Form Khảo sát sẽ được mở khi trạng thái chuyển sang "Bắt đầu".</p>
                    </div>
                </Card>
            )}

            {overallStatus === 'in_progress' && (
                <Card style={{ borderRadius: 8 }} title="Quy trình Tạo Form Khảo Sát">
                    <Steps
                        current={formStep}
                        items={[
                            { title: 'Chọn Mẫu', icon: <FormOutlined /> },
                            { title: 'Nhập Form', icon: <EditOutlined /> },
                            { title: 'Preview & Submit', icon: <CheckCircleOutlined /> },
                            { title: 'Bản in & Ký', icon: <FilePdfOutlined /> }
                        ]}
                        style={{ marginBottom: 24 }}
                    />

                    {renderStepContent()}
                </Card>
            )}

            {overallStatus === 'completed' && (
                <Card style={{ borderRadius: 8 }}>
                    <Result
                        status="success"
                        title="Khảo sát đã hoàn thành và Hồ sơ đã được chốt (Read-only)"
                        subTitle="Hồ sơ khảo sát này đã được lưu vào Hành trình và không thể chỉnh sửa thêm."
                        extra={[
                            <Button type="primary" key="console" onClick={handleBack}>
                                Quay lại Hành trình
                            </Button>,
                            <Button key="buy" icon={<FilePdfOutlined />} onClick={handleDownloadPDF}>Xuất PDF Hồ sơ</Button>,
                        ]}
                    />
                </Card>
            )}

            {/* Modal Chữ Ký */}
            <Modal
                title="Khách hàng Ký trực tiếp"
                open={isSigModalOpen}
                onCancel={() => setIsSigModalOpen(false)}
                footer={[
                    <Button key="clear" onClick={handleClearSignature}>Xóa viết lại</Button>,
                    <Button key="save" type="primary" onClick={handleSaveSignature}>Lưu chữ ký</Button>
                ]}
                width={600}
                centered
            >
                <div>
                    <p style={{ marginBottom: 16 }}>Vui lòng sử dụng chuột hoặc trượt tay trên màn hình cảm ứng để ký vào khung bên dưới.</p>
                    <div style={{ border: '2px dashed #d9d9d9', borderRadius: 8, background: '#fafafa' }}>
                        <SignatureCanvas
                            ref={sigPadRef}
                            canvasProps={{ width: 550, height: 250, className: 'sigCanvas' }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SaleSurveyDetail;
