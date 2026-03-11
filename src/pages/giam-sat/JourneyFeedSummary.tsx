import React, { useState } from 'react';
import { Card, Table, Tag, Badge, Typography, Select, Row, Col, Statistic } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { mockSurveys } from '../../data/journeyMockData';
import type { SurveyRecord } from '../../types/journey';

const { Text } = Typography;

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Chờ review', color: 'warning', icon: <ClockCircleOutlined /> },
    reviewed: { label: 'Đã review', color: 'processing', icon: <SyncOutlined /> },
    approved: { label: 'Đã phê duyệt', color: 'success', icon: <CheckCircleOutlined /> },
};

const JourneyFeedSummary: React.FC = () => {
    const [filterStatus, setFilterStatus] = useState('ALL');

    const filtered = mockSurveys.filter(s => filterStatus === 'ALL' || s.review_status === filterStatus);

    const submitted = mockSurveys.filter(s => s.submitted_at);
    const pending = mockSurveys.filter(s => s.review_status === 'pending');
    const approved = mockSurveys.filter(s => s.review_status === 'approved');

    const columns: ColumnsType<SurveyRecord> = [
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, s) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{s.customer_name}</div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{s.site_address}</Text>
                </div>
            ),
        },
        { title: 'Ngày khảo sát', dataIndex: 'survey_date', key: 'date', render: v => v ? v.split('T')[0] : s => s.scheduled_date },
        {
            title: 'Số khu vực',
            key: 'areas',
            render: (_, s) => <Badge count={s.area_list.length} style={{ background: '#fa8c16' }} showZero />,
            align: 'center',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, s) => {
                const cfg = STATUS_CONFIG[s.review_status];
                return <Tag color={cfg.color} icon={cfg.icon}>{cfg.label}</Tag>;
            },
        },
        {
            title: 'Nộp lúc',
            key: 'submitted',
            render: (_, s) => s.submitted_at
                ? <Text style={{ fontSize: 11 }}>{s.submitted_at.split('T')[0]}</Text>
                : <Text type="secondary">—</Text>,
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Feed Hành trình</h2>
                <Text type="secondary">Dữ liệu khảo sát đã nộp</Text>
            </div>

            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={8}>
                    <Card size="small" style={{ borderLeft: '4px solid #1890ff', borderRadius: 8 }}>
                        <Statistic title="Đã nộp" value={submitted.length} valueStyle={{ color: '#1890ff' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" style={{ borderLeft: '4px solid #fa8c16', borderRadius: 8 }}>
                        <Statistic title="Chờ review" value={pending.length} valueStyle={{ color: '#fa8c16' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" style={{ borderLeft: '4px solid #52c41a', borderRadius: 8 }}>
                        <Statistic title="Đã phê duyệt" value={approved.length} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Row style={{ marginBottom: 16 }}>
                    <Col>
                        <Select
                            style={{ width: 180 }}
                            value={filterStatus}
                            onChange={setFilterStatus}
                            options={[
                                { value: 'ALL', label: 'Tất cả trạng thái' },
                                { value: 'pending', label: 'Chờ review' },
                                { value: 'reviewed', label: 'Đã review' },
                                { value: 'approved', label: 'Đã phê duyệt' },
                            ]}
                        />
                    </Col>
                </Row>
                <Table columns={columns} dataSource={filtered} rowKey="id" size="small" pagination={{ pageSize: 10 }} />
            </Card>
        </div>
    );
};

export default JourneyFeedSummary;
