// @ts-nocheck
import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Input,
    Avatar, Space, Empty, Progress, Statistic,
} from 'antd';
import {
    InboxOutlined, UserOutlined, SearchOutlined,
    ExclamationCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockProjects, mockMaterials, mockStandards } from '../../../data/mockData';

const { Title, Text } = Typography;

const MaterialPlanList: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const projects = mockProjects.map(p => {
        const standards = mockStandards.filter(s => s.constructionType === p.type);
        const items = standards.map(s => {
            const needed = Math.ceil(p.areaM2 * s.usagePerM2);
            const stock = mockMaterials.find(m => m.id === s.materialId)?.currentStock ?? 0;
            return { needed, stock, enough: stock >= needed };
        });
        const hasShortage = items.some(i => !i.enough);
        const totalItems = items.length;
        const okItems = items.filter(i => i.enough).length;
        const pct = totalItems > 0 ? Math.round((okItems / totalItems) * 100) : 100;
        return { ...p, hasShortage, pct, totalItems, okItems };
    });

    const filtered = projects.filter(p =>
        !search
        || p.name.toLowerCase().includes(search.toLowerCase())
        || p.code.toLowerCase().includes(search.toLowerCase())
        || p.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const shortageCount = projects.filter(p => p.hasShortage).length;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>📦 Định mức Vật tư Dự án</Title>
                    <Text type="secondary">Xem và xác nhận định mức vật tư theo từng dự án</Text>
                </div>
            </div>

            <Row gutter={16} style={{ marginBottom: 20 }}>
                {[
                    { title: '🔨 Tổng dự án', value: projects.length, color: '#1976D2' },
                    { title: '⚠️ Thiếu vật tư', value: shortageCount, color: '#ff4d4f' },
                    { title: '✅ Đủ vật tư', value: projects.length - shortageCount, color: '#52c41a' },
                ].map(k => (
                    <Col xs={24} sm={8} key={k.title}>
                        <Card size="small" style={{ borderTop: `3px solid ${k.color}` }}>
                            <Statistic
                                title={k.title}
                                value={k.value}
                                valueStyle={{ color: k.color, fontSize: 22 }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm dự án, khách hàng..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginBottom: 16, maxWidth: 420 }}
                allowClear
            />

            {filtered.length === 0 && <Empty description="Không có dự án nào" />}

            {filtered.map(p => (
                <Card
                    key={p.id}
                    hoverable
                    onClick={() => navigate(`/pm/construction/projects/${p.id}/materials`)}
                    style={{
                        marginBottom: 12,
                        borderLeft: `4px solid ${p.hasShortage ? '#ff4d4f' : '#52c41a'}`,
                        cursor: 'pointer',
                    }}
                >
                    <Row justify="space-between" align="middle">
                        <Col flex="auto">
                            <Space align="start">
                                <Avatar
                                    size={40}
                                    style={{ background: p.hasShortage ? '#ff4d4f' : '#52c41a', flexShrink: 0 }}
                                    icon={<InboxOutlined />}
                                />
                                <div>
                                    <Space>
                                        <Text strong style={{ fontSize: 14 }}>{p.code}</Text>
                                        {p.hasShortage
                                            ? <Tag color="error" icon={<ExclamationCircleOutlined />}>Thiếu VT</Tag>
                                            : <Tag color="success" icon={<CheckCircleOutlined />}>Đủ VT</Tag>}
                                    </Space>
                                    <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{p.name}</div>
                                    <Space style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                                        <span><UserOutlined /> {p.customerName}</span>
                                        <span>·</span>
                                        <span>{p.areaM2} m² · {p.type}</span>
                                    </Space>
                                </div>
                            </Space>
                        </Col>
                        <Col style={{ textAlign: 'right', minWidth: 160 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {p.okItems}/{p.totalItems} loại VT đủ kho
                            </Text>
                            <Progress
                                percent={p.pct}
                                size="small"
                                style={{ width: 140, display: 'block', marginTop: 4 }}
                                status={p.hasShortage ? 'exception' : 'success'}
                            />
                            <Button size="small" type="primary" style={{ marginTop: 6 }}>
                                Xem định mức →
                            </Button>
                        </Col>
                    </Row>
                </Card>
            ))}
        </div>
    );
};

export default MaterialPlanList;
