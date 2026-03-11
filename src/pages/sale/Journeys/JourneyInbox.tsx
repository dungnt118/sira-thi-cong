import React, { useState } from 'react';
import {
    Card, Tag, Input, Select, Space, Typography, Row, Col,
    Badge, Empty
} from 'antd';
import {
    SearchOutlined, MessageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockJourneys } from '../../../data/journeyMockData';
import type { SlaStatus } from '../../../types/journey';

const { Text } = Typography;

const SLA_CONFIG: Record<SlaStatus, { label: string; color: string }> = {
    ontime: { label: 'Đúng hạn', color: 'success' },
    at_risk: { label: 'Có rủi ro', color: 'warning' },
    overdue: { label: 'Quá hạn', color: 'error' },
};

const SURVEY_LABEL: Record<string, string> = {
    not_started: 'Chưa KS', scheduled: 'Đã lịch', in_progress: 'Đang KS', completed: 'Đã KS'
};

const JourneyInbox: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [filterSla, setFilterSla] = useState('ALL');
    const [filterStep, setFilterStep] = useState('ALL');

    const filtered = mockJourneys.filter(j => {
        const matchK = !keyword || [j.journey_code, j.customer_name, j.request_title].some(f => f?.toLowerCase().includes(keyword.toLowerCase()));
        const matchSla = filterSla === 'ALL' || j.sla_status === filterSla;
        const matchStep = filterStep === 'ALL' || j.current_step_code === filterStep;
        return matchK && matchSla && matchStep;
    });

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Journey Inbox</h2>
                <Text type="secondary">Hành trình được giao cho Sale xử lý</Text>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space size="small" wrap>
                        <Tag.CheckableTag checked={filterSla === 'ALL'} onChange={() => setFilterSla('ALL')}>Tất cả SLA</Tag.CheckableTag>
                        <Tag.CheckableTag checked={filterSla === 'overdue'} onChange={() => setFilterSla('overdue')}>Quá hạn</Tag.CheckableTag>
                        <Tag.CheckableTag checked={filterSla === 'at_risk'} onChange={() => setFilterSla('at_risk')}>Có rủi ro</Tag.CheckableTag>
                        <Tag.CheckableTag checked={filterSla === 'ontime'} onChange={() => setFilterSla('ontime')}>Đúng hạn</Tag.CheckableTag>
                    </Space>
                </div>
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    <Col flex="auto">
                        <Input placeholder="Tìm mã, tên KH..." prefix={<SearchOutlined />} value={keyword} onChange={e => setKeyword(e.target.value)} allowClear />
                    </Col>
                    <Col>
                        <Select style={{ width: 140 }} value={filterStep} onChange={setFilterStep} options={[
                            { value: 'ALL', label: 'Tất cả bước' },
                            { value: 'INTAKE', label: 'Tiếp nhận' },
                            { value: 'SURVEY', label: 'Khảo sát' },
                            { value: 'QUOTATION', label: 'Dự toán/Báo giá' },
                            { value: 'CONTRACT', label: 'Hợp đồng' }
                        ]} />
                    </Col>
                </Row>

                <div>
                    {filtered.length === 0 && <Empty description="Không có hành trình" />}
                    {filtered.map(j => (
                        <Card
                            key={j.id}
                            size="small"
                            hoverable
                            style={{ marginBottom: 10, borderRadius: 8, cursor: 'pointer', borderLeft: `4px solid ${j.sla_status === 'overdue' ? '#ff4d4f' : j.sla_status === 'at_risk' ? '#fa8c16' : '#52c41a'}` }}
                            onClick={() => navigate(`/sale/journeys/${j.id}`)}
                        >
                            <Row gutter={16} align="middle">
                                <Col flex="auto">
                                    <Space>
                                        <Text strong style={{ color: '#1976D2' }}>{j.journey_code}</Text>
                                        <Tag>{j.current_step}</Tag>
                                        <Badge status={SLA_CONFIG[j.sla_status].color as any} text={SLA_CONFIG[j.sla_status].label} />
                                    </Space>
                                    <div style={{ marginTop: 4 }}>
                                        <Text strong>{j.customer_name}</Text>
                                        <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>{j.request_title}</Text>
                                    </div>
                                    <div style={{ marginTop: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            Sale phụ trách: <Text strong>{j.owner_user}</Text> ·
                                            KS: {SURVEY_LABEL[j.survey_status] || '—'}
                                        </Text>
                                    </div>
                                    <div style={{ marginTop: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            Next Action: <Text type="warning">{j.current_step === 'Khảo sát hiện trường' ? 'Chờ Kỹ thuật duyệt' : j.current_step === 'Dự toán & Báo giá' ? 'Gửi báo giá cho KH' : 'Liên hệ KH'}</Text>
                                        </Text>
                                    </div>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    {(j.unread_thread_count || j.unread_portal_threads) > 0 && (
                                        <Badge count={j.unread_thread_count || j.unread_portal_threads} size="small" title="Tin nhắn chưa đọc">
                                            <MessageOutlined style={{ color: '#1976D2', fontSize: 18 }} />
                                        </Badge>
                                    )}
                                    <div style={{ fontSize: 11, color: '#999', marginTop: 8 }}>Cập nhật: {j.last_activity_at.split('T')[0]}</div>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default JourneyInbox;
