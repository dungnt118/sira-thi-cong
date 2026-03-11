import React, { useState } from 'react';
import { 
    Form, Input, Select, Button, Card, Row, Col, Typography, 
    Checkbox, Upload, Space, Divider, Popconfirm, Collapse 
} from 'antd';
import { 
    PlusOutlined, DeleteOutlined, CameraOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;

const AREA_TYPES = [
    "Mái tôn", "Tường đứng", "Nhà vệ sinh", "Sân thượng", 
    "Ban công", "Mái bê tông", "Hộp kỹ thuật", "Cổ ống / xuyên sàn", 
    "Khe tiếp giáp", "Khác"
];

const ISSUE_TYPES = [
    "Thấm nước", "Dột", "Nứt", "Rỉ sét", "Bong tróc", 
    "Rêu mốc", "Đọng nước", "Rò rỉ quanh ống", "Hở mí / hở khe", "Xuống cấp lớp cũ"
];

const CAUSE_OPTIONS = [
    "Nguồn từ mưa tạt", "Từ mái / chồng mí", "Từ vít / phụ kiện", 
    "Từ cổ ống", "Từ sàn tầng trên", "Từ tường ngoài", 
    "Từ khe tiếp giáp", "Từ đường ống cấp thoát nước", "Chưa xác định"
];

const SAFETY_OPTIONS = [
    "Làm việc trên cao", "Trơn trượt", "Gần điện", "Không gian hẹp", 
    "Đang có người sử dụng", "Cần giàn giáo", "Cần dây an toàn", "Khó vận chuyển vật tư"
];

const SURFACE_CONDITIONS = [
    "Khô", "Ẩm", "Đọng nước", "Bám bụi", "Có lớp cũ", "Rêu mốc", "Bề mặt yếu / bở", "Có dầu mỡ"
];

// Helper to render tight checklist blocks
const OptionsBlock = ({ label, name, options }: { label: string, name: any, options: string[] }) => (
    <div style={{ padding: 12, borderRadius: 8, border: '1px dashed #d9d9d9', background: '#fafbfc' }}>
        <div style={{ marginBottom: 8, fontWeight: 500, fontSize: 13, color: '#595959' }}>{label}</div>
        <Form.Item name={name} noStyle>
            <Checkbox.Group style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {options.map(opt => (
                    <Checkbox key={opt} value={opt} style={{ margin: 0, padding: '4px 8px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 4 }}>
                        {opt}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </Form.Item>
    </div>
);

interface DynamicSurveyFormProps {
    form: any; // Ant Form Instance
    initialTemplate?: string | null;
}

const DynamicSurveyForm: React.FC<DynamicSurveyFormProps> = ({ form, initialTemplate }) => {
    
    const [activeKeys, setActiveKeys] = useState<string[]>(['0']);

    return (
        <Form 
            form={form} 
            layout="vertical" 
            initialValues={{
                header: {
                    survey_date: null,
                    urgency: 'Trong tuần'
                },
                zones: initialTemplate ? [
                    // Mock: Auto-populate 1 zone based on template choice (e.g. Toilet)
                    { zoneCode: 'KV-01', areaType: initialTemplate.includes('WC') ? 'Nhà vệ sinh' : 'Sân thượng' }
                ] : []
            }}
        >
            <Card title="1. Thông tin chung toàn công trình" size="small" style={{ marginBottom: 24, borderRadius: 8 }}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Mức độ ưu tiên chung" name={['header', 'urgency']}>
                            <Select options={['Rất gấp', 'Trong tuần', 'Trong tháng', 'Khảo sát ngẫu nhiên / Bảo hành'].map(v => ({ label: v, value: v }))} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Nhu cầu gốc của khách (Ghi nhận chung)" name={['header', 'original_request']}>
                            <TextArea rows={2} placeholder="Vd: Thấm dột từ trần tầng 3 xuống phòng ngủ..." />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <Title level={5} style={{ margin: 0 }}>2. Chi tiết từng Khu Vực Khảo Sát</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>Mỗi khu vực là 1 block dữ liệu độc lập chứa hình ảnh, kích thước và nguyên nhân riêng.</Text>
                </div>
                <Form.List name="zones">
                    {(fields, { add }) => (
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                            add({ zoneCode: `KV-${(fields.length + 1).toString().padStart(2, '0')}` });
                            setActiveKeys(prev => [...prev, fields.length.toString()]);
                        }}>
                            Thêm Khu Vực
                        </Button>
                    )}
                </Form.List>
            </div>

            <Form.List name="zones">
                {(fields, { remove }) => {
                    if (fields.length === 0) {
                        return (
                            <div style={{ textAlign: 'center', padding: 40, border: '2px dashed #e8e8e8', borderRadius: 8, color: '#aaa', marginBottom: 24 }}>
                                Chưa có khu vực khảo sát nào được tạo. Nhấn "Thêm Khu Vực" để bắt đầu.
                            </div>
                        );
                    }
                    
                    return (
                        <Collapse 
                            activeKey={activeKeys} 
                            onChange={(keys) => setActiveKeys(keys as string[])}
                            style={{ marginBottom: 24, background: '#fff' }}
                        >
                            {fields.map(({ key, name, ...restField }, index) => {
                                const areaType = form.getFieldValue(['zones', name, 'areaType']);
                                return (
                                    <Collapse.Panel
                                        key={name.toString()}
                                        header={
                                            <Space>
                                                <Text type="secondary" style={{ fontSize: 13 }}>Khu vực {index + 1}</Text>
                                                <Text strong>{areaType ? `(${areaType})` : '(Chưa định danh)'}</Text>
                                            </Space>
                                        }
                                        extra={
                                            <Popconfirm 
                                                title="Xóa khu vực này?" 
                                                onConfirm={(e) => { 
                                                    e?.stopPropagation(); 
                                                    remove(name); 
                                                }}
                                                onCancel={(e) => e?.stopPropagation()}
                                            >
                                                <Button danger type="text" icon={<DeleteOutlined />} size="small" onClick={(e) => e.stopPropagation()} />
                                            </Popconfirm>
                                        }
                                    >
                                        {/* Thông tin định danh Zone */}
                                        <Row gutter={16}>
                                            <Col xs={12} md={6}>
                                                <Form.Item {...restField} name={[name, 'zoneCode']} label="Mã Khu Vực">
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <Form.Item {...restField} name={[name, 'areaType']} label="Loại Hạng Mục" rules={[{ required: true, message: 'Vui lòng chọn' }]}>
                                                    <Select options={AREA_TYPES.map(v => ({ label: v, value: v }))} />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item {...restField} name={[name, 'location_desc']} label="Tầng / Vị trí cụ thể">
                                                    <Input placeholder="Vd: Tầng 2, phía sau nhà" />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        {/* Các Checkbox Blocks */}
                                        <Row gutter={16} style={{ marginBottom: 16 }}>
                                            <Col xs={24} lg={12}>
                                                <OptionsBlock label="Dấu hiệu hiện trạng" name={[name, 'issueTypes']} options={ISSUE_TYPES} />
                                            </Col>
                                            <Col xs={24} lg={12}>
                                                <OptionsBlock label="Nguyên nhân nghi ngờ" name={[name, 'causeOptions']} options={CAUSE_OPTIONS} />
                                            </Col>
                                        </Row>

                                        {/* Kích thước */}
                                        <div style={{ background: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 16, border: '1px solid #f0f0f0' }}>
                                            <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 13 }}>Kích thước / Khối lượng sơ bộ</div>
                                            <Row gutter={16}>
                                                <Col xs={12} md={6}>
                                                    <Form.Item {...restField} name={[name, 'dims_length']} label="Dài (m)" style={{ marginBottom: 0 }}>
                                                        <Input type="number" />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Item {...restField} name={[name, 'dims_width']} label="Rộng (m)" style={{ marginBottom: 0 }}>
                                                        <Input type="number" />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Item {...restField} name={[name, 'dims_height']} label="Cao (m)" style={{ marginBottom: 0 }}>
                                                        <Input type="number" />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Item {...restField} name={[name, 'dims_area']} label="Diện tích (m²)" style={{ marginBottom: 0 }}>
                                                        <Input type="number" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>

                                        {/* Bề mặt & An toàn */}
                                        <Row gutter={16} style={{ marginBottom: 16 }}>
                                            <Col xs={24} lg={12}>
                                                <OptionsBlock label="Điều kiện bề mặt" name={[name, 'surfaceConditions']} options={SURFACE_CONDITIONS} />
                                            </Col>
                                            <Col xs={24} lg={12}>
                                                <OptionsBlock label="Điều kiện an toàn thi công" name={[name, 'safetyOptions']} options={SAFETY_OPTIONS} />
                                            </Col>
                                        </Row>
                                        
                                        {/* Mô tả Text */}
                                        <Row gutter={16}>
                                            <Col xs={24} md={12}>
                                                <Form.Item {...restField} name={[name, 'status_desc']} label="Mô tả hiện trạng bằng lời">
                                                    <TextArea rows={3} placeholder="Mô tả cụ thể vị trí dột, tính chất lan truyền..." />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item {...restField} name={[name, 'proposed_solution']} label="Đề xuất giải pháp dự kiến">
                                                    <TextArea rows={3} placeholder="Giải pháp chống thấm (chưa phải báo giá cuối)..." />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Divider style={{ margin: '12px 0' }} />

                                        {/* Upload Media Khu vực */}
                                        <div>
                                            <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 13 }}>Hình ảnh / Video minh chứng khu vực này</div>
                                            <Upload
                                                action="/api/upload"
                                                listType="picture-card"
                                                multiple
                                            >
                                                <div>
                                                    <CameraOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                            </Upload>
                                        </div>
                                    </Collapse.Panel>
                                );
                            })}
                        </Collapse>
                    );
                }}
            </Form.List>
        </Form>
    );
};

export default DynamicSurveyForm;
