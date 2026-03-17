import React, { useState } from 'react';
import { Card, Form, Input, Button, Result, Space, Divider, Typography, Progress, Timeline, Image, Row, Col, Alert, InputNumber } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import { mockConstructReports } from '../../../data/journeyMockData';
import { RocketOutlined, BuildOutlined, CheckCircleOutlined, PictureOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step08ConstructProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step08Construct: React.FC<Step08ConstructProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const reports = mockConstructReports.filter(r => r.journey_id === journeyId);

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
        if (onEditStateChange) onEditStateChange(false);
    };

    const renderReadOnly = () => {
        if (reports.length === 0) {
            return (
                <Result
                    status="info"
                    title="Đang chuẩn bị thi công"
                    subTitle="Chưa có nhật ký thi công nào được ghi nhận. Quá trình thi công sẽ bắt đầu sau khi tạm ứng được xác nhận."
                />
            );
        }

        const latestReport = reports[reports.length - 1];

        return (
            <div style={{ padding: '0 12px' }}>
                <div style={{ marginBottom: 24, padding: 16, background: '#f0f2f5', borderRadius: 8 }}>
                    <Row align="middle" gutter={16}>
                        <Col span={4} style={{ textAlign: 'center' }}>
                            <RocketOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                        </Col>
                        <Col span={20}>
                            <Title level={4} style={{ margin: '0 0 8px 0' }}>Tiến độ tổng thể: {latestReport.progress_pct}%</Title>
                            <Progress percent={latestReport.progress_pct} status="active" strokeColor="#1890ff" />
                        </Col>
                    </Row>
                </div>

                <Title level={5}><BuildOutlined /> Nhật ký thi công hàng ngày</Title>
                <Timeline mode="left">
                    {reports.map((report, idx) => (
                        <Timeline.Item 
                            key={report.id} 
                            label={report.date}
                            color={idx === reports.length - 1 ? 'blue' : 'gray'}
                        >
                            <Card size="small" title={<span>Giám sát: <strong>{report.supervisor}</strong></span>}>
                                <Text>{report.content}</Text>
                                {report.images && report.images.length > 0 && (
                                    <div style={{ marginTop: 12 }}>
                                        <Space wrap>
                                            {report.images.map((img, i) => (
                                                <Image 
                                                    key={i} 
                                                    width={80} 
                                                    height={60} 
                                                    src={img} 
                                                    fallback="https://via.placeholder.com/80x60?text=No+Image"
                                                    style={{ borderRadius: 4, objectFit: 'cover' }}
                                                />
                                            ))}
                                        </Space>
                                        <div style={{ marginTop: 4 }}>
                                            <Text type="secondary" style={{ fontSize: '12px' }}><PictureOutlined /> {report.images.length} ảnh hiện trường</Text>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </Timeline.Item>
                    ))}
                </Timeline>

                {latestReport.progress_pct === 100 && (
                    <Alert 
                        message="Thi công hoàn tất" 
                        description="Hạng mục đã hoàn thành 100% khối lượng. Đang chuyển sang bước Nghiệm thu & Bàn giao."
                        type="success"
                        showIcon
                        icon={<CheckCircleOutlined />}
                        style={{ marginTop: 16 }}
                    />
                )}
            </div>
        );
    };

    const renderEditable = () => (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Divider orientation="left">Nhật ký mới</Divider>
            <Form.Item label="Tiến độ (%)" name="progress" initialValue={reports.length > 0 ? reports[reports.length-1].progress_pct : 0}>
                <InputNumber min={0} max={100} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item label="Nội dung công việc" name="notes" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="Nhập chi tiết các hạng mục đã thi công trong ngày..." />
            </Form.Item>
            <Form.Item label="Hình ảnh hiện trường">
                <Button icon={<PictureOutlined />}>Tải ảnh lên</Button>
            </Form.Item>
            <Space style={{ marginTop: 16 }}>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu nhật ký</Button>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
            </Space>
        </Form>
    );

    return (
        <Card 
            title={isEditing ? "Thực hiện: Triển khai / Thi công" : "Chi tiết bước: Triển khai / Thi công"} 
            bordered={false} 
            className="ky-card"
            extra={isEditable && (
                <Button 
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => {
                        const newEdit = !isEditing;
                        setIsEditing(newEdit);
                        if (onEditStateChange) onEditStateChange(newEdit);
                    }}
                >
                    {isEditing ? "Xem nhật ký" : "Cập nhật tiến độ"}
                </Button>
            )}
        >
            {!isEditable && (
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Bạn đang ở chế độ Chỉ đọc (Chưa có quyền KeyRole hoặc chưa được phân công).</Text>
                </div>
            )}
            {isEditing ? renderEditable() : renderReadOnly()}
        </Card>
    );
};

export default Step08Construct;
