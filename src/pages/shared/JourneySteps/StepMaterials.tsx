import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Button, Space, Row, Col, Statistic, Alert, Divider, Form, Input, InputNumber, Select } from 'antd';
import { BoxPlotOutlined, WarningOutlined, CheckCircleOutlined, HistoryOutlined, EditOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { mockMaterialDetails } from '../../../data/journeyMockData';

const { Text, Title } = Typography;

export interface StepMaterialsProps {
    journeyId: string;
    isEditable?: boolean;
}

const StepMaterials: React.FC<StepMaterialsProps> = ({ journeyId, isEditable = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const materialDetail = mockMaterialDetails.find(m => m.journey_id === journeyId);

    const columns = [
        { title: 'Tên vật tư', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit' },
        { title: 'Nhu cầu', dataIndex: 'total_need', key: 'total_need', align: 'center' as const },
        { title: 'Đã cấp', dataIndex: 'delivered', key: 'delivered', align: 'center' as const, render: (v: number) => <Text type={v > 0 ? 'success' : 'secondary'}>{v}</Text> },
        { title: 'Còn lại', dataIndex: 'remaining', key: 'remaining', align: 'center' as const, render: (v: number) => <Text type={v > 0 ? 'danger' : 'secondary'}>{v}</Text> },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (s: string) => (
                <Tag color={s === 'enough' ? 'success' : 'warning'}>
                    {s === 'enough' ? 'Đủ vật tư' : 'Chờ cấp'}
                </Tag>
            )
        },
    ];

    if (!materialDetail) {
        return (
            <Card bordered={false}>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <BoxPlotOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                    <Title level={5}>Chưa có thông tin vật tư</Title>
                    <Text type="secondary">Thông tin vật tư sẽ được tổng hợp từ dự toán báo giá.</Text>
                </div>
            </Card>
        );
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card 
                title={<span>📦 Quản lý cung ứng vật tư</span>} 
                size="small"
                extra={isEditable && (
                    <Button 
                        type={isEditing ? "default" : "primary"} 
                        icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Xem lại" : "Yêu cầu cấp thêm"}
                    </Button>
                )}
            >
                {isEditing ? (
                    <Form layout="vertical">
                        <Title level={5}>Yêu cầu vật tư / Công cụ</Title>
                        <Row gutter={16}>
                            <Col span={10}><Form.Item label="Loại vật tư" required><Select placeholder="Chọn từ kho..." options={[{label: 'SIRA TOP', value: 'sira-top'}]} /></Form.Item></Col>
                            <Col span={6}><Form.Item label="Số lượng" required><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8}><Form.Item label="Lý do"><Input placeholder="VD: Phát sinh diện tích" /></Form.Item></Col>
                        </Row>
                        <Space>
                            <Button type="primary" icon={<SaveOutlined />}>Gửi yêu cầu</Button>
                            <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                        </Space>
                    </Form>
                ) : (
                    <>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={8}>
                                <Statistic title="Hạng mục đầy đủ" value={materialDetail.items.filter(i => i.status === 'enough').length} suffix={`/${materialDetail.items.length}`} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Ngày cấp cuối" value={materialDetail.last_delivery} prefix={<HistoryOutlined />} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Trạng thái kho" value={materialDetail.warehouse_lock_status === 'locked' ? 'Đã khóa' : 'Mở'} valueStyle={{ color: materialDetail.warehouse_lock_status === 'locked' ? '#cf1322' : '#3f8600' }} />
                            </Col>
                        </Row>
                        
                        {materialDetail.items.some(i => i.status === 'waiting') && (
                            <Alert 
                                message="Cảnh báo cung ứng" 
                                description="Có một số vật tư đang chờ cấp từ kho. Vui lòng liên hệ bộ phận mua hàng."
                                type="warning"
                                showIcon
                                icon={<WarningOutlined />}
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        <Table 
                            size="small" 
                            dataSource={materialDetail.items} 
                            columns={columns} 
                            pagination={false} 
                            rowKey="name"
                        />
                    </>
                )}
            </Card>

            <div style={{ background: '#fafafa', padding: 12, borderRadius: 8 }}>
                <Text type="secondary" italic icon={<CheckCircleOutlined />}> 
                    Vật tư chính đã được xác nhận đúng chủng loại kỹ thuật yêu cầu.
                </Text>
            </div>
        </Space>
    );
};

export default StepMaterials;
