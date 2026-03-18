import React, { useState } from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Badge, Input,
    Avatar, Space, Empty, Progress,
} from 'antd';
import {
    CameraOutlined, UserOutlined, SearchOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { mockProjects as defaultProjects } from '../../../data/mockData';
import type { Project, StepStatus } from '../../../types/legacy-project';

const { Title, Text } = Typography;

const AWAITING_STATUSES: StepStatus[] = ['AWAITING_REVIEW'];

const EvidenceQueue: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [mockProjects] = useLocalStorageData<Project[]>(demoDataService.KEYS.PROJECTS, defaultProjects);

    // Enrich each project with pending review count
    const projects = mockProjects.map(p => ({
        ...p,
        pendingCount: p.steps.filter(s => AWAITING_STATUSES.includes(s.status)).length,
        totalPhotos: p.steps.flatMap(s => s.evidences).length,
        approvedPhotos: p.steps.flatMap(s => s.evidences).filter(e => e.status === 'APPROVED').length,
    }));

    const filtered = projects.filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase())
        || p.code.toLowerCase().includes(search.toLowerCase())
        || p.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const withPending = filtered.filter(p => p.pendingCount > 0);
    const noPending = filtered.filter(p => p.pendingCount === 0);

    const ProjectCard: React.FC<{ p: typeof projects[0] }> = ({ p }) => (
        <Card
            hoverable
            onClick={() => navigate(`/pm/construction/evidence/${p.id}`)}
            style={{
                marginBottom: 12,
                borderLeft: `4px solid ${p.pendingCount > 0 ? '#fa8c16' : '#52c41a'}`,
                cursor: 'pointer',
            }}
        >
            <Row justify="space-between" align="middle">
                <Col flex="auto">
                    <Space align="start">
                        <Avatar
                            size={40}
                            style={{ background: p.pendingCount > 0 ? '#fa8c16' : '#52c41a', flexShrink: 0 }}
                            icon={<CameraOutlined />}
                        />
                        <div>
                            <Space>
                                <Text strong style={{ fontSize: 14 }}>{p.code}</Text>
                                {p.pendingCount > 0 && (
                                    <Badge count={p.pendingCount} style={{ background: '#fa8c16' }} />
                                )}
                            </Space>
                            <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{p.name}</div>
                            <Space style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                                <span><UserOutlined /> {p.customerName}</span>
                                <span>·</span>
                                <span>📸 {p.totalPhotos} ảnh ({p.approvedPhotos} đã duyệt)</span>
                                {p.pmName && <><span>·</span><span>PM: {p.pmName}</span></>}
                            </Space>
                        </div>
                    </Space>
                </Col>
                <Col style={{ textAlign: 'right', minWidth: 140 }}>
                    {p.pendingCount > 0 ? (
                        <>
                            <Tag color="orange" icon={<ClockCircleOutlined />}>
                                {p.pendingCount} bước chờ duyệt
                            </Tag>
                            <div style={{ marginTop: 6 }}>
                                <Progress
                                    percent={p.totalPhotos > 0 ? Math.round((p.approvedPhotos / p.totalPhotos) * 100) : 0}
                                    size="small"
                                    style={{ width: 130 }}
                                    status="active"
                                />
                            </div>
                        </>
                    ) : (
                        <Tag color="success">✅ Đã duyệt hết</Tag>
                    )}
                    <div style={{ marginTop: 8 }}>
                        <Button size="small" type={p.pendingCount > 0 ? 'primary' : 'default'}>
                            {p.pendingCount > 0 ? 'Duyệt ngay →' : 'Xem ảnh →'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Card>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>📸 Duyệt Ảnh / Video thi công</Title>
                    <Text type="secondary">Chọn dự án để xem và duyệt bằng chứng thi công từ thợ</Text>
                </div>
                <Row gutter={[8, 8]} align="middle">
                    {[
                        { label: 'Chờ duyệt', value: projects.filter(p => p.pendingCount > 0).length, color: '#fa8c16' },
                        { label: 'Tổng ảnh', value: projects.reduce((s, p) => s + p.totalPhotos, 0), color: '#1976D2' },
                        { label: 'Đã duyệt', value: projects.reduce((s, p) => s + p.approvedPhotos, 0), color: '#52c41a' },
                    ].map(k => (
                        <Col key={k.label}>
                            <Card size="small" style={{ minWidth: 90, textAlign: 'center', borderTop: `3px solid ${k.color}` }}>
                                <div style={{ fontSize: 22, fontWeight: 700, color: k.color }}>{k.value}</div>
                                <div style={{ fontSize: 11, color: '#999' }}>{k.label}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Search */}
            <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm dự án, mã dự án, tên khách hàng..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginBottom: 20, maxWidth: 420 }}
                allowClear
            />

            {/* Pending Review */}
            {withPending.length > 0 && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                        <Text strong style={{ color: '#fa8c16' }}>Chờ duyệt ({withPending.length} dự án)</Text>
                    </div>
                    {withPending.map(p => <ProjectCard key={p.id} p={p} />)}
                </>
            )}

            {/* Already Approved */}
            {noPending.length > 0 && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0 12px' }}>
                        <Text type="secondary">✅ Đã duyệt xong ({noPending.length} dự án)</Text>
                    </div>
                    {noPending.map(p => <ProjectCard key={p.id} p={p} />)}
                </>
            )}

            {filtered.length === 0 && (
                <Empty description={search ? `Không tìm thấy dự án "${search}"` : 'Không có dự án nào'} />
            )}
        </div>
    );
};

export default EvidenceQueue;
