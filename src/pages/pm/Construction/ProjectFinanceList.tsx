// @ts-nocheck
import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Input,
    Avatar, Space, Empty, Progress, Statistic,
} from 'antd';
import {
    DollarOutlined, UserOutlined, SearchOutlined,
    ExclamationCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockProjects } from '../../../data/mockData';

const { Title, Text } = Typography;

const ProjectFinanceList: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const projects = mockProjects.map(p => {
        const total = p.paymentMilestones.reduce((s, m) => s + m.amount, 0);
        const collected = p.paymentMilestones.filter(m => m.status === 'PAID').reduce((s, m) => s + m.amount, 0);
        const overdue = p.paymentMilestones.filter(m => m.status === 'OVERDUE').length;
        const pct = total > 0 ? Math.round((collected / total) * 100) : 0;
        return { ...p, total, collected, overdue, pct, remaining: total - collected };
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
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>💰 Tài chính Dự án</Title>
                    <Text type="secondary">Tổng quan thu tiền theo từng dự án (PM chỉ xem)</Text>
                </div>
            </div>

            {/* KPI Cards */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
                {[
                    { title: '💰 Tổng giá trị HĐ', value: totalContractValue, color: '#1976D2' },
                    { title: '✅ Đã thu', value: totalCollected, color: '#52c41a' },
                    { title: '⏳ Còn lại', value: totalRemaining, color: '#fa8c16' },
                ].map(k => (
                    <Col xs={24} sm={8} key={k.title}>
                        <Card size="small" style={{ borderTop: `3px solid ${k.color}` }}>
                            <Statistic
                                title={k.title}
                                value={k.value}
                                formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                                valueStyle={{ color: k.color, fontSize: 16 }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            {overdueCount > 0 && (
                <Card
                    size="small"
                    style={{ background: '#fff2f0', border: '1px solid #ffccc7', marginBottom: 16 }}
                >
                    <Space>
                        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                        <Text style={{ color: '#ff4d4f' }}>
                            <strong>{overdueCount} dự án</strong> có đợt thanh toán quá hạn — liên hệ Kế toán xử lý.
                        </Text>
                    </Space>
                </Card>
            )}

            {/* Search */}
            <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm theo tên dự án, mã, khách hàng..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginBottom: 16, maxWidth: 420 }}
                allowClear
            />

            {/* Project list */}
            {filtered.length === 0 && (
                <Empty description="Không tìm thấy dự án nào" />
            )}

            {filtered.map(p => (
                <Card
                    key={p.id}
                    hoverable
                    onClick={() => navigate(`/ql/construction/projects/${p.id}/finance`)}
                    style={{
                        marginBottom: 12,
                        borderLeft: `4px solid ${p.overdue > 0 ? '#ff4d4f' : p.pct === 100 ? '#52c41a' : '#1976D2'}`,
                        cursor: 'pointer',
                    }}
                >
                    <Row justify="space-between" align="middle">
                        <Col flex="auto">
                            <Space align="start">
                                <Avatar
                                    size={40}
                                    style={{
                                        background: p.overdue > 0 ? '#ff4d4f' : p.pct === 100 ? '#52c41a' : '#1976D2',
                                        flexShrink: 0,
                                    }}
                                    icon={<DollarOutlined />}
                                />
                                <div>
                                    <Space>
                                        <Text strong style={{ fontSize: 14 }}>{p.code}</Text>
                                        {p.overdue > 0 && (
                                            <Tag color="error" icon={<ExclamationCircleOutlined />}>
                                                {p.overdue} đợt quá hạn
                                            </Tag>
                                        )}
                                        {p.pct === 100 && (
                                            <Tag color="success" icon={<CheckCircleOutlined />}>Thu đủ</Tag>
                                        )}
                                    </Space>
                                    <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{p.name}</div>
                                    <Space style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                                        <span><UserOutlined /> {p.customerName}</span>
                                        <span>·</span>
                                        <span>Tổng HĐ: <strong>{p.total.toLocaleString('vi-VN')}đ</strong></span>
                                    </Space>
                                </div>
                            </Space>
                        </Col>
                        <Col style={{ textAlign: 'right', minWidth: 180 }}>
                            <div style={{ marginBottom: 4 }}>
                                <Text strong style={{ color: '#52c41a' }}>
                                    {p.collected.toLocaleString('vi-VN')}đ
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>
                                    / {p.total.toLocaleString('vi-VN')}đ
                                </Text>
                            </div>
                            <Progress
                                percent={p.pct}
                                size="small"
                                style={{ width: 160 }}
                                status={p.overdue > 0 ? 'exception' : p.pct === 100 ? 'success' : 'active'}
                            />
                            <div style={{ marginTop: 6 }}>
                                <Button size="small" type="primary">Xem tài chính →</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
            ))}
        </div>
    );
};

export default ProjectFinanceList;
