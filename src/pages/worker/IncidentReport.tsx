// @ts-nocheck
import React, { useState } from 'react';
import {
    Card, Form, Input, Select, Button, Upload, Typography,
    Alert, Modal
} from 'antd';
import {
    ArrowLeftOutlined, CameraOutlined, SendOutlined, ExclamationCircleOutlined,
    BoxPlotOutlined, ToolOutlined, CloudOutlined, WarningOutlined,
    QuestionCircleOutlined, CheckCircleOutlined, MailOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockProjects } from '../../data/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

const MY_WORKER_ID = 'U002';

const INCIDENT_TYPES = [
    { value: 'MATERIAL_SHORTAGE', label: <span><BoxPlotOutlined /> Thiếu vật tư</span> },
    { value: 'TECHNICAL', label: <span><ToolOutlined /> Sự cố kỹ thuật</span> },
    { value: 'WEATHER', label: <span><CloudOutlined /> Thời tiết xấu</span> },
    { value: 'EQUIPMENT', label: <span><ToolOutlined /> Hỏng thiết bị</span> },
    { value: 'SAFETY', label: <span><WarningOutlined /> An toàn lao động</span> },
    { value: 'OTHER', label: <span><QuestionCircleOutlined /> Khác</span> },
];

const IncidentReport: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [images, setImages] = useState<string[]>([]);
    const [sending, setSending] = useState(false);
    const [sentModal, setSentModal] = useState(false);

    const myProjects = mockProjects.filter(p => p.workerIds.includes(MY_WORKER_ID) && p.status === 'IN_PROGRESS');

    const handleSubmit = async (_values: unknown) => {
        setSending(true);
        await new Promise(r => setTimeout(r, 900));
        setSending(false);
        setSentModal(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate('/worker/home')} />
                <div>
                    <Title level={5} style={{ margin: 0 }}><WarningOutlined style={{ color: '#ff4d4f' }} /> Báo cáo Sự cố</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>Thông báo ngay cho PM</Text>
                </div>
            </div>

            <Alert
                message="Báo cáo ngay lập tức khi gặp sự cố. PM sẽ nhận thông báo ngay."
                type="warning"
                showIcon
                icon={<ExclamationCircleOutlined />}
                style={{ marginBottom: 16, borderRadius: 10 }}
            />

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Card style={{ borderRadius: 12, marginBottom: 12 }}>
                    <Form.Item name="projectId" label="Dự án *" rules={[{ required: true }]}>
                        <Select
                            placeholder="Chọn dự án đang thi công"
                            options={myProjects.map(p => ({ value: p.id, label: `${p.code} – ${p.name.slice(0, 30)}` }))}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item name="type" label="Loại sự cố *" rules={[{ required: true }]}>
                        <Select
                            placeholder="Chọn loại sự cố"
                            options={INCIDENT_TYPES}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item name="severity" label="Mức độ *" rules={[{ required: true }]} initialValue="NORMAL">
                        <Select size="large" options={[
                            { value: 'NORMAL', label: <span><WarningOutlined /> Bình thường – Cần xử lý trong hôm nay</span> },
                            { value: 'URGENT', label: <span><ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /> Khấn cấp – Cần xử lý ngay</span> },
                        ]} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả sự cố *"
                        rules={[{ required: true, min: 10, message: 'Vui lòng mô tả ít nhất 10 ký tự' }]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Mô tả chi tiết sự cố đang gặp phải...
VD: Hết SIRA PU lớp phủ, chỉ còn ~5kg không đủ cho lớp thứ 2 (cần ~20kg để hoàn thành tầng 3)"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                </Card>

                {/* Photo */}
                <Card size="small" style={{ borderRadius: 12, marginBottom: 16 }}>
                    <Text strong><CameraOutlined /> Ảnh minh chứng (tuỳ chọn)</Text>
                    <Upload.Dragger
                        accept="image/*"
                        multiple
                        showUploadList={false}
                        beforeUpload={(file) => {
                            const reader = new FileReader();
                            reader.onload = (e) => setImages(prev => [...prev, e.target?.result as string]);
                            reader.readAsDataURL(file);
                            return false;
                        }}
                        style={{ marginTop: 8 }}
                    >
                        <div style={{ padding: 12, fontSize: 13, color: '#999' }}>
                            <CameraOutlined style={{ fontSize: 20, display: 'block', marginBottom: 4 }} />
                            Nhấn để chụp / tải ảnh
                        </div>
                    </Upload.Dragger>
                    {images.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                            {images.map((img, i) => (
                                <img key={i} src={img} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                            ))}
                        </div>
                    )}
                </Card>

                <Button
                    type="primary"
                    danger
                    htmlType="submit"
                    block
                    size="large"
                    loading={sending}
                    icon={<SendOutlined />}
                    style={{ height: 50, borderRadius: 12, fontSize: 15 }}
                >
                    Gửi báo cáo sự cố ngay
                </Button>
            </Form>

            <Modal
                title={<span><CheckCircleOutlined style={{ color: '#52c41a' }} /> Đã gửi báo cáo sự cố</span>}
                open={sentModal}
                onCancel={() => { setSentModal(false); navigate('/worker/home'); }}
                footer={[
                    <Button key="ok" type="primary" onClick={() => { setSentModal(false); navigate('/worker/home'); }}>
                        Về trang chủ
                    </Button>,
                ]}
                centered
            >
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: 48, color: '#1890ff' }}><MailOutlined /></div>
                    <Text strong>PM đã nhận được thông báo</Text>
                    <br />
                    <Text type="secondary">Vui lòng chờ phản hồi từ PM. Tiếp tục các bước không bị ảnh hưởng.</Text>
                </div>
            </Modal>
        </div>
    );
};

export default IncidentReport;
