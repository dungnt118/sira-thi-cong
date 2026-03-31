import React, { useState, useEffect } from 'react';
import {
    Card, Tag, Input, Select, Space, Typography, Row, Col,
    Badge, Empty, Spin, message, Button, Avatar
} from 'antd';
import {
    SearchOutlined, MessageOutlined,
    ClockCircleOutlined, UserOutlined, ArrowRightOutlined,
    FunnelPlotOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';

const { Text, Title } = Typography;

const SLA_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    on_time: { label: 'Đúng hạn', color: '#52c41a', bg: '#f6ffed' },
    at_risk: { label: 'Có rủi ro', color: '#fa8c16', bg: '#fff7e6' },
    overdue: { label: 'Quá hạn', color: '#ff4d4f', bg: '#fff1f0' },
    ontime: { label: 'Đúng hạn', color: '#52c41a', bg: '#f6ffed' },
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
            // Trong thực tế, cần truyền filter owner_id: user._id
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

    const stats = {
        total: journeys.length,
        overdue: journeys.filter(j => j.sla_status === 'overdue').length,
        at_risk: journeys.filter(j => j.sla_status === 'at_risk').length,
    };

    return (
        <div style={{ padding: '4px 0' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Hệ thống Quản lý Bán hàng</Text>
                    <Title level={2} style={{ margin: '4px 0 0', fontWeight: 700 }}>Journey Inbox</Title>
                </div>
                <Space size="middle">
                    <Badge count={stats.overdue} offset={[-2, 2]}>
                        <Button type="text" danger icon={<ClockCircleOutlined />}>Quá hạn</Button>
                    </Badge>
                    <Button type="primary" shape="round" icon={<FunnelPlotOutlined />} onClick={loadJourneys}>Làm mới</Button>
                </Space>
            </div>

            <Card style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none', marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12} lg={14}>
                        <Input 
                            placeholder="Tìm kiếm theo mã, khách hàng, nội dung yêu cầu..." 
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                            value={keyword} 
                            onChange={e => setKeyword(e.target.value)} 
                            allowClear
                            size="large"
                            style={{ borderRadius: 10 }}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={5}>
                        <Select 
                            style={{ width: '100%' }} 
                            size="large"
                            value={filterSla} 
                            onChange={setFilterSla} 
                            placeholder="Lọc theo SLA"
                            options={[
                                { value: 'ALL', label: 'Tất cả SLA' },
                                { value: 'overdue', label: 'Quá hạn' },
                                { value: 'at_risk', label: 'Có rủi ro' },
                                { value: 'ontime', label: 'Đúng hạn' },
                            ]} 
                        />
                    </Col>
                    <Col xs={12} md={6} lg={5}>
                        <Select 
                            style={{ width: '100%' }} 
                            size="large"
                            value={filterStep} 
                            onChange={setFilterStep}
                            placeholder="Lọc bước"
                            options={[
                                { value: 'ALL', label: 'Tất cả bước' },
                                { value: 'lead_intake', label: '1. Tiếp nhận' },
                                { value: 'survey_planning', label: '2. Khảo sát' },
                                { value: 'estimate_preparation', label: '3. Dự toán' },
                                { value: 'contract_signing', label: '4. Hợp đồng' }
                            ]} 
                        />
                    </Col>
                </Row>
            </Card>

            <Spin spinning={loading} tip="Đang tải dữ liệu...">
                <div style={{ minHeight: 400 }}>
                    {filtered.length === 0 ? (
                        <Card style={{ textAlign: 'center', padding: 60, borderRadius: 16, border: '1px dashed #d9d9d9' }}>
                            <Empty description={<Text type="secondary">Không tìm thấy hành trình nào phù hợp</Text>} />
                            <Button type="link" onClick={() => { setKeyword(''); setFilterSla('ALL'); setFilterStep('ALL'); }}>Xóa bộ lọc</Button>
                        </Card>
                    ) : (
                        <Row gutter={[16, 16]}>
                            {filtered.map((j: any) => {
                                const customerName = j.idx_customer_id?.primary_text || 'Khách hàng ẩn';
                                const sla = SLA_CONFIG[j.sla_status] || { label: j.sla_status, color: '#d9d9d9', bg: '#f5f5f5' };
                                const lastActivity = j.last_activity_at ? new Date(j.last_activity_at).toLocaleDateString('vi-VN') : '—';
                                
                                return (
                                    <Col xs={24} key={j._id}>
                                        <Card 
                                            hoverable 
                                            onClick={() => navigate(`/sale/dashboard/${j._id}`)}
                                            style={{ 
                                                borderRadius: 16, 
                                                border: 'none', 
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            bodyStyle={{ padding: '20px 24px' }}
                                        >
                                            <Row gutter={24} align="middle">
                                                <Col xs={24} sm={16} md={18}>
                                                    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <Text strong style={{ color: '#1890ff', fontSize: 15, letterSpacing: 0.5 }}>{j.journey_code}</Text>
                                                        <Tag color="processing" style={{ borderRadius: 6, margin: 0, border: 'none', padding: '0 10px' }}>{j.current_step_display || j.current_step}</Tag>
                                                        <span style={{ 
                                                            display: 'inline-flex', 
                                                            alignItems: 'center', 
                                                            padding: '2px 10px', 
                                                            background: sla.bg, 
                                                            color: sla.color, 
                                                            borderRadius: 20,
                                                            fontSize: 12,
                                                            fontWeight: 600
                                                        }}>
                                                            <div style={{ width: 6, height: 6, background: sla.color, borderRadius: '50%', marginRight: 6 }} />
                                                            {sla.label}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Title level={4} style={{ margin: '0 0 4px', fontSize: 18 }}>{customerName}</Title>
                                                        <Text type="secondary" style={{ fontSize: 14 }}>{j.request_title}</Text>
                                                    </div>
                                                    <div style={{ marginTop: 16, display: 'flex', gap: 24 }}>
                                                        <Space size={8}>
                                                            <Avatar size={20} icon={<UserOutlined />} style={{ background: '#f5f5f5', color: '#8c8c8c' }} />
                                                            <Text type="secondary" style={{ fontSize: 12 }}>Kỹ thuật: <Text strong style={{ color: '#595959' }}>{j.supervisor_name || j.idx_supervisor_id?.primary_text || 'Chưa có'}</Text></Text>
                                                        </Space>
                                                        <Space size={8}>
                                                            <ClockCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                                                            <Text type="secondary" style={{ fontSize: 12 }}>Hẹn tiếp theo: <Text strong style={{ color: '#1890ff' }}>{j.next_milestone_due ? new Date(j.next_milestone_due).toLocaleDateString('vi-VN') : 'Cần sắp xếp'}</Text></Text>
                                                        </Space>
                                                    </div>
                                                </Col>
                                                <Col xs={24} sm={8} md={6} style={{ textAlign: 'right' }}>
                                                    <Space direction="vertical" align="end" size={12}>
                                                        {j.unread_thread_count > 0 ? (
                                                            <Badge count={j.unread_thread_count}>
                                                                <div style={{ padding: '8px 12px', background: '#e6f7ff', borderRadius: 10, color: '#1890ff' }}>
                                                                    <MessageOutlined style={{ fontSize: 18 }} />
                                                                </div>
                                                            </Badge>
                                                        ) : (
                                                            <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 10, color: '#bfbfbf' }}>
                                                                <MessageOutlined style={{ fontSize: 18 }} />
                                                            </div>
                                                        )}
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontSize: 12, color: '#bfbfbf' }}>Cập nhật</div>
                                                            <div style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 500 }}>{lastActivity}</div>
                                                        </div>
                                                        <Button type="text" icon={<ArrowRightOutlined />} style={{ color: '#1890ff' }}>Chi tiết</Button>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </div>
            </Spin>
        </div>
    );
};
export default SaleDashboard;
