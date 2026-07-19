import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Input,
    Avatar, Space, Empty, Progress, Statistic, Grid
} from 'antd';
import {
    DollarOutlined, UserOutlined, SearchOutlined,
    ExclamationCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockProjects } from '../../../data/mockData';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface ProjectFinanceSummary {
    id: string;
    code: string;
    name: string;
    customerId: string;
    customerName: string;
    address: string;
    areaM2: number;
    category: string;
    type: string;
    status: string;
    total: number;
    collected: number;
    overdue: number;
    pct: number;
    remaining: number;
}

const ProjectFinanceList: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.sm;
    const [search, setSearch] = useState('');

    // Tính toán số liệu tài chính dự án từ đợt thanh toán
    const projects: ProjectFinanceSummary[] = mockProjects.map(p => {
        const milestones = p.paymentMilestones || [];
        const total = milestones.reduce((s, m) => s + (m.amount || 0), 0);
        const collected = milestones.filter(m => m.status === 'PAID').reduce((s, m) => s + (m.amount || 0), 0);
        const overdue = milestones.filter(m => m.status === 'OVERDUE').length;
        const pct = total > 0 ? Math.round((collected / total) * 100) : 0;
        
        return {
            id: p.id,
            code: p.code || '',
            name: p.name || '',
            customerId: p.customerId || '',
            customerName: p.customerName || '',
            address: p.address || '',
            areaM2: p.areaM2 || 0,
            category: p.category || '',
            type: p.type || '',
            status: p.status || '',
            total,
            collected,
            overdue,
            pct,
            remaining: total - collected
        };
    });

    const filtered = projects.filter(p =>
        !search
        || p.name.toLowerCase().includes(search.toLowerCase())
        || p.code.toLowerCase().includes(search.toLowerCase())
        || p.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const totalContractValue = projects.reduce((s, p) => s + p.total, 0);
    const totalCollected = projects.reduce((s, p) => s + p.collected, 0);
    const totalRemaining = projects.reduce((s, p) => s + p.remaining, 0);
    const overdueCount = projects.filter(p => p.overdue > 0).length;

    return (
        <div style={{ padding: isMobile ? '8px' : '0' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, fontSize: isMobile ? 18 : 20 }}>💰 Tài chính Dự án</Title>
                <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>
                    Tổng quan thu tiền theo từng dự án (PM chỉ xem)
                </Text>
            </div>

            {/* KPI Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                {[
                    { title: '💰 Tổng giá trị HĐ', value: totalContractValue, color: '#1890ff' },
                    { title: '✅ Đã thu', value: totalCollected, color: '#52c41a' },
                    { title: '⏳ Còn lại', value: totalRemaining, color: '#fa8c16' },
                ].map(k => (
                    <Col xs={24} sm={8} key={k.title}>
                        <Card 
                            size="small" 
                            style={{ 
                                borderTop: `3px solid ${k.color}`,
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                            }}
                        >
                            <Statistic
                                title={<Text type="secondary" style={{ fontSize: 13 }}>{k.title}</Text>}
                                value={k.value}
                                formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                                valueStyle={{ color: k.color, fontSize: isMobile ? 15 : 18, fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            {overdueCount > 0 && (
                <Card
                    size="small"
                    style={{ background: '#fff2f0', border: '1px solid #ffccc7', marginBottom: 16, borderRadius: 8 }}
                >
                    <Space>
                        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                        <Text style={{ color: '#ff4d4f', fontSize: isMobile ? 12 : 13 }}>
                            <strong>{overdueCount} dự án</strong> có đợt thanh toán quá hạn — liên hệ Kế toán xử lý.
                        </Text>
                    </Space>
                </Card>
            )}

            {/* Search */}
            <div style={{ marginBottom: 16 }}>
                <Input
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Tìm theo tên dự án, mã, khách hàng..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ 
                        width: '100%', 
                        maxWidth: isMobile ? '100%' : 420,
                        height: 40,
                        borderRadius: 6 
                    }}
                    allowClear
                />
            </div>

            {/* Project list */}
            {filtered.length === 0 ? (
                <Empty description="Không tìm thấy dự án nào" style={{ marginTop: 32 }} />
            ) : (
                filtered.map(p => {
                    const borderLeftColor = p.overdue > 0 ? '#ff4d4f' : p.pct === 100 ? '#52c41a' : '#1890ff';
                    const avatarBgColor = p.overdue > 0 ? '#ff4d4f' : p.pct === 100 ? '#52c41a' : '#1890ff';
                    
                    return (
                        <Card
                            key={p.id}
                            hoverable
                            onClick={() => navigate(`/ql/construction/projects/${p.id}/finance`)}
                            style={{
                                marginBottom: 16,
                                borderLeft: `4px solid ${borderLeftColor}`,
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                                cursor: 'pointer',
                            }}
                            bodyStyle={{ padding: isMobile ? 12 : 16 }}
                        >
                            <Row gutter={[16, 12]} align="middle">
                                <Col xs={24} sm={16} md={18}>
                                    <Space align="start" size={isMobile ? 8 : 12} style={{ display: 'flex', width: '100%' }}>
                                        <Avatar
                                            size={isMobile ? 36 : 40}
                                            style={{
                                                background: avatarBgColor,
                                                flexShrink: 0,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                            icon={<DollarOutlined />}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <Space wrap size={8}>
                                                <Text strong style={{ fontSize: isMobile ? 14 : 16 }}>{p.code}</Text>
                                                {p.overdue > 0 && (
                                                    <Tag color="error" icon={<ExclamationCircleOutlined />} style={{ margin: 0 }}>
                                                        {p.overdue} đợt quá hạn
                                                    </Tag>
                                                )}
                                                {p.pct === 100 && (
                                                    <Tag color="success" icon={<CheckCircleOutlined />} style={{ margin: 0 }}>Thu đủ</Tag>
                                                )}
                                            </Space>
                                            <div style={{ 
                                                fontSize: isMobile ? 12 : 14, 
                                                color: '#262626', 
                                                marginTop: 4,
                                                fontWeight: 500,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {p.name}
                                            </div>
                                            <Space wrap style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }} size={8}>
                                                <span><UserOutlined /> {p.customerName}</span>
                                                <span>·</span>
                                                <span>Tổng HĐ: <strong>{p.total.toLocaleString('vi-VN')}đ</strong></span>
                                            </Space>
                                        </div>
                                    </Space>
                                </Col>
                                <Col xs={24} sm={8} md={6} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
                                        <div style={{ marginBottom: 4 }}>
                                            <Text strong style={{ color: '#52c41a', fontSize: 14 }}>
                                                {p.collected.toLocaleString('vi-VN')}đ
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                                                / {p.total.toLocaleString('vi-VN')}đ
                                            </Text>
                                        </div>
                                        <Progress
                                            percent={p.pct}
                                            size="small"
                                            style={{ 
                                                width: isMobile ? '100%' : 140,
                                                marginBottom: 8
                                            }}
                                            status={p.overdue > 0 ? 'exception' : p.pct === 100 ? 'success' : 'active'}
                                        />
                                        <Button 
                                            size="small" 
                                            type="primary"
                                            ghost
                                            style={{ 
                                                width: isMobile ? '100%' : 'auto', 
                                                height: 32,
                                                borderRadius: 6 
                                            }}
                                        >
                                            Xem tài chính →
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    );
                })
            )}
        </div>
    );
};

export default ProjectFinanceList;
