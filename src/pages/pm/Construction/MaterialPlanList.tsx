import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Input,
    Avatar, Space, Empty, Progress, Statistic, Grid
} from 'antd';
import {
    InboxOutlined, UserOutlined, SearchOutlined,
    ExclamationCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockProjects, mockMaterials, mockStandards } from '../../../data/mockData';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface ProjectMaterialSummary {
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
    hasShortage: boolean;
    pct: number;
    totalItems: number;
    okItems: number;
}

const MaterialPlanList: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.sm;
    const [search, setSearch] = useState('');

    // Tính toán trạng thái thiếu/đủ vật tư dựa trên định mức
    const projects: ProjectMaterialSummary[] = mockProjects.map(p => {
        const standards = mockStandards.filter(s => s.constructionType === p.type);
        const items = standards.map(s => {
            const needed = Math.ceil(p.areaM2 * (s.usagePerM2 ?? 0));
            const stock = mockMaterials.find(m => m.id === s.materialId)?.currentStock ?? 0;
            return { needed, stock, enough: stock >= needed };
        });
        const hasShortage = items.some(i => !i.enough);
        const totalItems = items.length;
        const okItems = items.filter(i => i.enough).length;
        const pct = totalItems > 0 ? Math.round((okItems / totalItems) * 100) : 100;
        
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
            hasShortage,
            pct,
            totalItems,
            okItems
        };
    });

    const filtered = projects.filter(p =>
        !search
        || p.name.toLowerCase().includes(search.toLowerCase())
        || p.code.toLowerCase().includes(search.toLowerCase())
        || p.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const shortageCount = projects.filter(p => p.hasShortage).length;

    return (
        <div style={{ padding: isMobile ? '8px' : '0' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, fontSize: isMobile ? 18 : 20 }}>
                    📦 Định mức Vật tư Dự án
                </Title>
                <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>
                    Xem và xác nhận định mức vật tư theo từng dự án
                </Text>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {[
                    { title: '🔨 Tổng dự án', value: projects.length, color: '#1890ff' },
                    { title: '⚠️ Thiếu vật tư', value: shortageCount, color: '#ff4d4f' },
                    { title: '✅ Đủ vật tư', value: projects.length - shortageCount, color: '#52c41a' },
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
                                valueStyle={{ color: k.color, fontSize: isMobile ? 20 : 24, fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <div style={{ marginBottom: 16 }}>
                <Input
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Tìm dự án, khách hàng..."
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

            {filtered.length === 0 ? (
                <Empty description="Không có dự án nào" style={{ marginTop: 32 }} />
            ) : (
                filtered.map(p => (
                    <Card
                        key={p.id}
                        hoverable
                        onClick={() => navigate(`/ql/construction/projects/${p.id}/materials`)}
                        style={{
                            marginBottom: 16,
                            borderLeft: `4px solid ${p.hasShortage ? '#ff4d4f' : '#52c41a'}`,
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
                                            background: p.hasShortage ? '#ff4d4f' : '#52c41a', 
                                            flexShrink: 0,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                        icon={<InboxOutlined />}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Space wrap size={8}>
                                            <Text strong style={{ fontSize: isMobile ? 14 : 16 }}>{p.code}</Text>
                                            {p.hasShortage ? (
                                                <Tag color="error" icon={<ExclamationCircleOutlined />} style={{ margin: 0 }}>Thiếu VT</Tag>
                                            ) : (
                                                <Tag color="success" icon={<CheckCircleOutlined />} style={{ margin: 0 }}>Đủ VT</Tag>
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
                                            <span>{p.areaM2} m² · {p.type}</span>
                                        </Space>
                                    </div>
                                </Space>
                            </Col>
                            <Col xs={24} sm={8} md={6} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {p.okItems}/{p.totalItems} loại VT đủ kho
                                    </Text>
                                    <Progress
                                        percent={p.pct}
                                        size="small"
                                        style={{ 
                                            width: isMobile ? '100%' : 140, 
                                            marginTop: 4,
                                            marginBottom: 8
                                        }}
                                        status={p.hasShortage ? 'exception' : 'success'}
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
                                        Xem định mức →
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ))
            )}
        </div>
    );
};

export default MaterialPlanList;
