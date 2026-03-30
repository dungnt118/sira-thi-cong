import React, { useState, useEffect } from 'react';
import {
    Card, Tag, Input, Select, Space, Typography, Row, Col,
    Badge, Empty, Spin, message
} from 'antd';
import {
    SearchOutlined, MessageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';

const { Text } = Typography;

const SLA_CONFIG: Record<string, { label: string; color: string }> = {
    on_time: { label: 'Đúng hạn', color: 'success' },
    at_risk: { label: 'Có rủi ro', color: 'warning' },
    overdue: { label: 'Quá hạn', color: 'error' },
    ontime: { label: 'Đúng hạn', color: 'success' }, // Fallback cho data cũ
};

const SaleDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [filterSla, setFilterSla] = useState('ALL');
    const [filterStep, setFilterStep] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [journeys, setJourneys] = useState<IJourney[]>([]);

    useEffect(() => {
        loadJourneys();
    }, []);

    const loadJourneys = async () => {
        setLoading(true);
        try {
            const res = await journeyService.queryContent();
            if (res && res.data) {
                setJourneys(res.data);
            }
        } catch (error) {
            console.error('Error fetching journeys', error);
            message.error('Lỗi khi tải danh sách hành trình.');
        } finally {
            setLoading(false);
        }
    };

    const filtered = journeys.filter((j: any) => {
        const customerName = j.idx_customer_id?.primary_text || '';
        const title = j.request_title || '';
        const code = j.journey_code || '';

        const matchK = !keyword || [code, customerName, title].some(f => f?.toLowerCase().includes(keyword.toLowerCase()));
        const matchSla = filterSla === 'ALL' || j.sla_status === filterSla;
        const matchStep = filterStep === 'ALL' || j.current_step === filterStep;
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
                    <Row gutter={12}>
                        <Col flex="auto">
                            <Input placeholder="Tìm mã, tên KH..." prefix={<SearchOutlined />} value={keyword} onChange={e => setKeyword(e.target.value)} allowClear />
                        </Col>
                        <Col>
                            <Select style={{ width: 140 }} value={filterSla} onChange={setFilterSla} options={[
                                { value: 'ALL', label: 'Tất cả SLA' },
                                { value: 'overdue', label: 'Quá hạn' },
                                { value: 'at_risk', label: 'Có rủi ro' },
                                { value: 'ontime', label: 'Đúng hạn' },
                            ]} />
                        </Col>
                        <Col>
                            <Select style={{ width: 160 }} value={filterStep} onChange={setFilterStep} options={[
                                { value: 'ALL', label: 'Tất cả bước' },
                                { value: 'ALL', label: 'Tất cả bước' },
                                { value: 'lead_intake', label: '1. Tiếp nhận' },
                                { value: 'survey_planning', label: '2. Khảo sát' },
                                { value: 'estimate_preparation', label: '3. Dự toán/Báo giá' },
                                { value: 'contract_signing', label: '4. Hợp đồng' }
                            ]} />
                        </Col>
                    </Row>
                </div>

                <Spin spinning={loading}>
                    <div>
                        {filtered.length === 0 && <Empty description="Không có hành trình" />}
                        {filtered.map((j: any) => {
                            const customerName = j.idx_customer_id?.primary_text || 'Khách hàng ẩn';
                            const slaConfig = SLA_CONFIG[j.sla_status] || { label: j.sla_status, color: 'default' };
                            const lastActivity = j.last_activity_at ? new Date(j.last_activity_at).toISOString().split('T')[0] : '—';
                            const nextMilestone = j.next_milestone_due ? new Date(j.next_milestone_due).toISOString().split('T')[0] : lastActivity;

                            return (
                                <Card
                                    key={j._id}
                                    size="small"
                                    hoverable
                                    style={{ marginBottom: 10, borderRadius: 8, cursor: 'pointer', borderLeft: `4px solid ${j.sla_status === 'overdue' ? '#ff4d4f' : j.sla_status === 'at_risk' ? '#fa8c16' : '#52c41a'}` }}
                                    onClick={() => navigate(`/sale/dashboard/${j._id}`)}
                                >
                                    <Row gutter={16} align="middle">
                                        <Col flex="auto">
                                            <Space>
                                                <Text strong style={{ color: '#1976D2' }}>{j.journey_code}</Text>
                                                <Tag>{j.current_step}</Tag>
                                                <Badge status={slaConfig.color as any} text={slaConfig.label} />
                                            </Space>
                                            <div style={{ marginTop: 4 }}>
                                                <Text strong>{customerName}</Text>
                                                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>{j.request_title}</Text>
                                            </div>
                                            <div style={{ marginTop: 4 }}>
                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                    Kỹ thuật KS: <Text strong>{j.supervisor_name || 'Chưa phân công'}</Text>
                                                </Text>
                                            </div>
                                            <div style={{ marginTop: 4 }}>
                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                    Lịch hẹn tiếp theo: <Text style={{ color: '#1677ff' }}>{nextMilestone}</Text>
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col style={{ textAlign: 'right' }}>
                                            {j.unread_thread_count > 0 && (
                                                <Badge count={j.unread_thread_count} size="small" title="Tin nhắn chưa đọc">
                                                    <MessageOutlined style={{ color: '#1976D2', fontSize: 18 }} />
                                                </Badge>
                                            )}
                                            <div style={{ fontSize: 11, color: '#999', marginTop: 8 }}>Cập nhật: {lastActivity}</div>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })}
                    </div>
                </Spin>
            </Card>
        </div>
    );
};

export default SaleDashboard;
