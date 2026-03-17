import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Button, Space, Timeline, Statistic, Row, Col, Form, Input, InputNumber } from 'antd';
import { TeamOutlined, UserOutlined, ClockCircleOutlined, EditOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { mockLaborPlans } from '../../../data/journeyMockData';

const { Text, Title } = Typography;

export interface StepLaborProps {
    journeyId: string;
    isEditable?: boolean;
}

const StepLabor: React.FC<StepLaborProps> = ({ journeyId, isEditable = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const laborPlan = mockLaborPlans.find(p => p.journey_id === journeyId);

    const teamColumns = [
        { title: 'Tên đội/Hạng mục', dataIndex: 'name', key: 'name' },
        { title: 'Trưởng nhóm', dataIndex: 'leader', key: 'leader', render: (text: string) => <Space><UserOutlined />{text}</Space> },
        { title: 'Số lượng thợ', dataIndex: 'count', key: 'count', align: 'center' as const },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (s: string) => (
                <Tag color={s === 'completed' ? 'success' : 'processing'}>
                    {s === 'completed' ? 'Đã hoàn thành' : 'Đang thực hiện'}
                </Tag>
            )
        },
        { title: 'Bắt đầu', dataIndex: 'start_date', key: 'start_date' },
        { title: 'Kết thúc (Dự kiến)', dataIndex: 'end_date', key: 'end_date' },
    ];

    if (!laborPlan) {
        return (
            <Card bordered={false}>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <TeamOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                    <Title level={5}>Chưa có kế hoạch nhân công</Title>
                    <Text type="secondary">Vui lòng lập kế hoạch điều phối thợ cho hành trình này.</Text>
                </div>
            </Card>
        );
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card 
                title={<span><TeamOutlined /> Kế hoạch điều phối nhân công</span>} 
                size="small"
                extra={isEditable && (
                    <Button 
                        type={isEditing ? "default" : "primary"} 
                        icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Xem lại" : "Điều phối mới"}
                    </Button>
                )}
            >
                {isEditing ? (
                    <Form layout="vertical">
                        <Title level={5}>Bổ sung đội thi công</Title>
                        <Row gutter={16}>
                            <Col span={8}><Form.Item label="Tên đội" required><Input placeholder="VD: Đội nề 1" /></Form.Item></Col>
                            <Col span={8}><Form.Item label="Trưởng nhóm" required><Input placeholder="VD: Nguyễn Văn A" /></Form.Item></Col>
                            <Col span={8}><Form.Item label="Số lượng thợ" required><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                        <Space>
                            <Button type="primary" icon={<SaveOutlined />}>Lưu kế hoạch</Button>
                            <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                        </Space>
                    </Form>
                ) : (
                    <>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Statistic title="Tổng nhân lực hiện tại" value={laborPlan.total_workers} prefix={<TeamOutlined />} suffix="thợ" />
                            </Col>
                            <Col span={12}>
                                <Statistic title="Số lượng đội" value={laborPlan.teams.length} />
                            </Col>
                        </Row>
                        <Table 
                            size="small" 
                            dataSource={laborPlan.teams} 
                            columns={teamColumns} 
                            pagination={false} 
                            rowKey="name"
                        />
                    </>
                )}
            </Card>

            <Card title={<span><ClockCircleOutlined /> Nhật ký điểm danh / Chấm công</span>} size="small">
                <Timeline
                    items={laborPlan.daily_tracking.map(t => ({
                        label: t.date,
                        children: (
                            <div>
                                <Text strong>{t.worker_count} thợ</Text> - {t.note}
                                <div style={{ fontSize: 12, color: '#8c8c8c' }}>Tổng giờ công: {t.hours}h</div>
                            </div>
                        ),
                        color: 'blue'
                    }))}
                    mode="left"
                />
            </Card>
        </Space>
    );
};

export default StepLabor;
