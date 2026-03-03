import React, { useState } from 'react';
import {
    Card, Button, Upload, Input, InputNumber, Row, Col,
    Typography, Table, Tag, Tooltip, message, Alert
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    UploadOutlined, CameraOutlined, DeleteOutlined, MobileOutlined,
    SaveOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockCustomers } from '../../../data/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface MoistureRow {
    key: string;
    location: string;
    value: number;
}

const SurveyUpload: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const customer = mockCustomers.find(c => c.id === id);

    const [images, setImages] = useState(customer?.surveyImages || []);
    const [moisture, setMoisture] = useState<MoistureRow[]>(
        customer?.moistureReadings.map((m, i) => ({ key: String(i), location: m.location, value: m.value })) || []
    );
    const [newLoc, setNewLoc] = useState('');
    const [newVal, setNewVal] = useState<number>(0);
    const [saving, setSaving] = useState(false);

    const handleAddMoisture = () => {
        if (!newLoc || newVal === undefined) return;
        setMoisture(prev => [...prev, { key: Date.now().toString(), location: newLoc, value: newVal }]);
        setNewLoc('');
        setNewVal(0);
    };

    const moiColumns: ColumnsType<MoistureRow> = [
        { title: 'Vị trí', dataIndex: 'location', key: 'location', render: v => <Text strong>{v}</Text> },
        {
            title: 'Độ ẩm (%)',
            dataIndex: 'value',
            key: 'value',
            render: (v: number) => (
                <Tag color={v > 12 ? 'red' : v > 8 ? 'orange' : 'green'}>
                    {v}% {v > 12 ? '⚠️ Cao' : v > 8 ? '⚡ Trung bình' : '✅ Tốt'}
                </Tag>
            ),
        },
        {
            title: '',
            key: 'del',
            width: 48,
            render: (_, r) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setMoisture(prev => prev.filter(m => m.key !== r.key))}
                />
            ),
        },
    ];

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setSaving(false);
        message.success('Đã lưu dữ liệu khảo sát');
    };

    if (!customer) return <div>Không tìm thấy khách hàng</div>;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/pm/crm/customers/${id}`)}>
                    Quay lại
                </Button>
                <div>
                    <Title level={4} style={{ margin: 0 }}>📸 Khảo sát & Đo ẩm</Title>
                    <Text type="secondary">KH: {customer.fullName} – {customer.address}</Text>
                </div>
            </div>

            <Alert
                message="Lưu ý khi khảo sát"
                description="Chụp ảnh toàn cảnh, chi tiết vết thấm, và góc khuất. Đo độ ẩm tại ít nhất 3 vị trí. Dữ liệu này sẽ được dùng để tự động tính toán báo giá."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Row gutter={24}>
                {/* Left: Image Upload */}
                <Col xs={24} lg={14}>
                    <Card
                        title={<><CameraOutlined /> Ảnh khảo sát ({images.length} ảnh)</>}
                        style={{ marginBottom: 16 }}
                        extra={
                            <Tooltip title="Chụp từ điện thoại">
                                <Button icon={<MobileOutlined />} size="small">App Thợ</Button>
                            </Tooltip>
                        }
                    >
                        <Upload.Dragger
                            multiple
                            accept="image/*"
                            beforeUpload={(file) => {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    setImages(prev => [...prev, {
                                        id: Date.now().toString(),
                                        url: e.target?.result as string,
                                        caption: file.name,
                                        takenAt: new Date().toISOString(),
                                        takenBy: 'Nguyễn Văn PM',
                                    }]);
                                };
                                reader.readAsDataURL(file);
                                return false;
                            }}
                            style={{ marginBottom: 16 }}
                        >
                            <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                            <p>Kéo thả ảnh vào đây hoặc click để chọn file</p>
                            <p style={{ color: '#999', fontSize: 12 }}>Hỗ trợ: JPG, PNG, HEIC. Tối đa 10MB/ảnh</p>
                        </Upload.Dragger>

                        {/* Image Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 8 }}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.caption || `Ảnh ${i + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        size="small"
                                        style={{
                                            position: 'absolute', top: 4, right: 4,
                                            background: 'rgba(0,0,0,0.5)', color: '#fff',
                                            borderRadius: 4,
                                        }}
                                        onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                    />
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        background: 'rgba(0,0,0,0.5)', color: '#fff',
                                        fontSize: 10, padding: '2px 6px',
                                    }}>
                                        {img.takenAt.split('T')[0]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                {/* Right: Moisture Readings */}
                <Col xs={24} lg={10}>
                    <Card title="💧 Đo độ ẩm" style={{ marginBottom: 16 }}>
                        <Row gutter={8} style={{ marginBottom: 12 }}>
                            <Col flex="auto">
                                <Input
                                    placeholder="Vị trí (VD: góc phòng ngủ)"
                                    value={newLoc}
                                    onChange={e => setNewLoc(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <InputNumber
                                    placeholder="%"
                                    style={{ width: 70 }}
                                    value={newVal}
                                    onChange={v => setNewVal(v || 0)}
                                    min={0} max={100} step={0.1}
                                />
                            </Col>
                            <Col>
                                <Button type="primary" onClick={handleAddMoisture}>+Thêm</Button>
                            </Col>
                        </Row>

                        <Table
                            columns={moiColumns}
                            dataSource={moisture}
                            size="small"
                            pagination={false}
                        />

                        {moisture.some(m => m.value > 12) && (
                            <Alert
                                message="⚠️ Có vị trí độ ẩm cao (>12%)"
                                description="Cần xử lý độ ẩm trước khi thi công"
                                type="warning"
                                showIcon
                                style={{ marginTop: 12 }}
                            />
                        )}
                    </Card>

                    <Card title="📝 Ghi chú khảo sát">
                        <TextArea
                            rows={4}
                            placeholder="Mô tả tình trạng công trình, vị trí thấm, điều kiện thi công..."
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                <Button size="large" onClick={() => navigate(`/pm/crm/customers/${id}`)}>Hủy</Button>
                <Button
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    loading={saving}
                    onClick={handleSave}
                >
                    Lưu khảo sát
                </Button>
                <Button
                    type="primary"
                    ghost
                    size="large"
                    onClick={() => navigate(`/pm/crm/customers/${id}/quotation`)}
                >
                    Tiếp: Lập báo giá →
                </Button>
            </div>
        </div>
    );
};

export default SurveyUpload;
