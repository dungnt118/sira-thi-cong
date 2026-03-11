import React, { useState } from 'react';
import {
    Card, Button, Tag, Typography, Row, Col, Form, Input,
    Space, Divider, Modal, Tabs, Upload, Checkbox, Select, InputNumber
} from 'antd';
import {
    ArrowLeftOutlined, PlusOutlined, SaveOutlined, CheckCircleOutlined,
    UploadOutlined, WarningOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockSurveys, mockJourneys } from '../../data/journeyMockData';
import type { SurveyArea } from '../../types/journey';

const { Text, Title } = Typography;
const { TextArea } = Input;

const SurveyForm: React.FC = () => {
    const { journeyId } = useParams<{ journeyId: string }>();
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.id === journeyId) || mockJourneys[0];
    const survey = mockSurveys.find(s => s.journey_id === journeyId) || mockSurveys[0];

    const [areas, setAreas] = useState<SurveyArea[]>(survey?.area_list || []);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [showRiskModal, setShowRiskModal] = useState(false);
    const [showSignModal, setShowSignModal] = useState(false);
    const [areaForm] = Form.useForm();
    const [riskForm] = Form.useForm();
    const [mainForm] = Form.useForm();

    const addArea = () => {
        areaForm.validateFields().then(values => {
            setAreas(prev => [...prev, values]);
            setShowAreaModal(false);
            areaForm.resetFields();
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/giam-sat/surveys')}>
                    Quay lại
                </Button>
                <Space>
                    <Button icon={<SaveOutlined />}>Lưu nháp</Button>
                    <Button type="primary" icon={<CheckCircleOutlined />}>Nộp khảo sát</Button>
                </Space>
            </div>

            {/* Survey Header */}
            <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)', borderRadius: 10 }}>
                <Title level={4} style={{ margin: 0 }}>{journey?.customer_name || survey.customer_name}</Title>
                <Text type="secondary">{journey?.site_address || survey.site_address}</Text>
                <div style={{ marginTop: 8 }}>
                    <Tag color="orange">Giám sát: {survey.giam_sat_user || 'Lê Văn GS'}</Tag>
                    <Tag>{survey.scheduled_date}</Tag>
                </div>
            </Card>

            <Form form={mainForm} layout="vertical">
                {/* Customer Snapshot */}
                <Card title="📋 Thông tin khảo sát" size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Người khảo sát" name="surveyor_name" initialValue="Lê Văn Giám sát">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Ngày khảo sát" name="survey_date" initialValue={new Date().toLocaleDateString('vi-VN')}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Area Repeater */}
                <Card
                    title={`📐 Khu vực khảo sát (${areas.length})`}
                    size="small"
                    style={{ marginBottom: 16, borderRadius: 8 }}
                    extra={<Button size="small" icon={<PlusOutlined />} onClick={() => setShowAreaModal(true)}>Thêm khu vực</Button>}
                >
                    {areas.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                            Chưa có khu vực. Nhấn "Thêm khu vực" để bắt đầu.
                        </div>
                    )}
                    {areas.map((area, idx) => (
                        <Card key={idx} size="small" style={{ marginBottom: 8, borderRadius: 6, borderLeft: '3px solid #fa8c16' }}>
                            <Row gutter={8} align="middle">
                                <Col flex="auto">
                                    <Text strong>Khu vực {idx + 1}: {area.area_name}</Text>
                                    {area.area_type && <Tag style={{ marginLeft: 6 }}>{area.area_type}</Tag>}
                                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{area.current_condition}</div>
                                    {area.moisture_value !== undefined && (
                                        <Tag color="blue" style={{ marginTop: 4 }}>Độ ẩm: {area.moisture_value}%</Tag>
                                    )}
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Card>

                {/* Media Upload */}
                <Card title="📸 Ảnh/Video khảo sát" size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
                    <Upload listType="picture-card" multiple>
                        <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 4, fontSize: 12 }}>Tải ảnh lên</div>
                        </div>
                    </Upload>
                </Card>

                {/* Risk Flags */}
                <Card
                    title={<span><WarningOutlined style={{ color: '#fa8c16' }} /> Rủi ro hiện trường</span>}
                    size="small"
                    style={{ marginBottom: 16, borderRadius: 8 }}
                    extra={<Button size="small" onClick={() => setShowRiskModal(true)}>Thêm rủi ro</Button>}
                >
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Rủi ro vật tư" name="material_risk">
                                <Select mode="multiple" options={[
                                    { value: 'thiếu', label: 'Thiếu vật tư' },
                                    { value: 'khó kiếm', label: 'Khó kiếm' },
                                    { value: 'lead time dài', label: 'Lead time dài' },
                                ]} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Rủi ro tiếp cận" name="access_risk">
                                <Select mode="multiple" options={[
                                    { value: 'giáo', label: 'Cần giàn giáo' },
                                    { value: 'đu dây', label: 'Cần đu dây' },
                                    { value: 'khung giờ', label: 'Giới hạn khung giờ' },
                                ]} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Mô tả rủi ro" name="risk_note">
                        <TextArea rows={2} />
                    </Form.Item>
                </Card>

                {/* Solution + Labor + Material */}
                <Card title="🛠️ Đề xuất & Nhu cầu" size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
                    <Form.Item label="Giải pháp sơ bộ" name="proposed_solution">
                        <TextArea rows={3} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Nhu cầu nhân công" name="labor_need_note">
                                <TextArea rows={2} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Nhu cầu vật tư" name="material_need_note">
                                <TextArea rows={2} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Signature */}
                <Card title="✍️ Chữ ký" size="small" style={{ borderRadius: 8 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={{ border: '1px dashed #d9d9d9', borderRadius: 8, padding: 16, textAlign: 'center', minHeight: 100, cursor: 'pointer' }}
                                onClick={() => setShowSignModal(true)}>
                                <div style={{ color: '#999' }}>Chữ ký Giám sát</div>
                                <div style={{ fontSize: 11, color: '#ccc' }}>Nhấn để ký</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ border: '1px dashed #d9d9d9', borderRadius: 8, padding: 16, textAlign: 'center', minHeight: 100, cursor: 'pointer' }}>
                                <div style={{ color: '#999' }}>Chữ ký Khách hàng</div>
                                <div style={{ fontSize: 11, color: '#ccc' }}>Nhấn để ký</div>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Form>

            {/* Add Area Modal */}
            <Modal title="Thêm khu vực khảo sát" open={showAreaModal}
                onCancel={() => { setShowAreaModal(false); areaForm.resetFields(); }}
                onOk={addArea} okText="Thêm" cancelText="Hủy">
                <Form form={areaForm} layout="vertical">
                    <Row gutter={12}>
                        <Col span={14}>
                            <Form.Item label="Tên khu vực" name="area_name" rules={[{ required: true }]}>
                                <Input placeholder="VD: Mái chính, Sê nô..." />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Loại khu vực" name="area_type">
                                <Select options={[
                                    { value: 'Mái BTCT', label: 'Mái BTCT' },
                                    { value: 'Sàn', label: 'Sàn' },
                                    { value: 'Tường', label: 'Tường' },
                                    { value: 'Sê nô', label: 'Sê nô' },
                                ]} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Hiện trạng" name="current_condition" rules={[{ required: true }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Số đo/ghi chú kỹ thuật" name="measurement_notes">
                                <TextArea rows={2} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Chỉ số độ ẩm (%)" name="moisture_value">
                                <InputNumber style={{ width: '100%' }} min={0} max={100} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Signature Modal */}
            <Modal title="Vẽ chữ ký" open={showSignModal} onCancel={() => setShowSignModal(false)}
                onOk={() => setShowSignModal(false)} okText="Xác nhận" cancelText="Hủy">
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, height: 200, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    [Signature Pad Canvas]
                </div>
                <Row gutter={12} style={{ marginTop: 12 }}>
                    <Col span={12}>
                        <Form.Item label="Tên người ký" name="signer_name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Vai trò" name="signer_role">
                            <Select options={[{ value: 'Giám sát', label: 'Giám sát' }, { value: 'Khách hàng', label: 'Khách hàng' }]} />
                        </Form.Item>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default SurveyForm;
