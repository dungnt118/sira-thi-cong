import React, { useState } from 'react';
import {
    Card, Row, Col, Typography, Button, Tag, Space, Badge, Empty, Tooltip, message, Progress, Grid
} from 'antd';
import {
    PlusOutlined, CalendarOutlined, DragOutlined, DollarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import { mockServiceRequests, mockPipelines } from '../../../data/mockData';
import type { ServiceRequest, Pipeline as PipelineType } from '../../../types/v3';

const { Text, Title } = Typography;
const { Option } = Select;

interface KanbanCardProps {
    request: ServiceRequest;
    pipeline: PipelineType;
    onMove: (requestId: string, newStageId: string) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ request, pipeline, onMove }) => {
    const navigate = useNavigate();
    const hasQuotation = request.quotations.length > 0;
    const latestQuote = hasQuotation ? request.quotations[request.quotations.length - 1] : null;

    // Find next stage dynamically
    const currentStage = pipeline.stages.find(s => s.id === request.stageId);
    const nextStage = currentStage ? pipeline.stages.find(s => s.order === currentStage.order + 1) : null;

    return (
        <Card
            size="small"
            hoverable
            style={{
                marginBottom: 8,
                borderRadius: 8,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                cursor: 'pointer',
            }}
            onClick={() => navigate(`/pm/crm/service-requests/${request.id}`)}
            actions={[
                <Tooltip title="Khảo sát" key="survey">
                    <span onClick={e => { e.stopPropagation(); navigate(`/pm/crm/service-requests/${request.id}/survey`); }}>
                        📸
                    </span>
                </Tooltip>,
                <Tooltip title="Báo giá" key="quote">
                    <span onClick={e => { e.stopPropagation(); navigate(`/pm/crm/service-requests/${request.id}/quotation`); }}>
                        💰
                    </span>
                </Tooltip>,
                nextStage ? (
                    <Tooltip title={`Chuyển sang: ${nextStage.name}`} key="move">
                        <span onClick={e => {
                            e.stopPropagation();
                            onMove(request.id, nextStage.id);
                            message.success(`Đã chuyển sang ${nextStage.name}`);
                        }}>
                            {'→'}
                        </span>
                    </Tooltip>
                ) : <span style={{ opacity: 0.3 }}>{'→'}</span>,
            ]}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ width: 4, height: 28, background: currentStage?.color || '#1976D2', borderRadius: 2 }} />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>{request.name}</div>
                        <Text type="secondary" style={{ fontSize: 11 }}>{request.code} • {request.customerName}</Text>
                    </div>
                </div>
                <DragOutlined style={{ color: '#bbb', cursor: 'grab' }} />
            </div>

            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {latestQuote && (
                    <div style={{ fontSize: 12, color: '#52c41a', fontWeight: 500 }}>
                        <DollarOutlined style={{ marginRight: 4 }} />
                        {(latestQuote.total / 1000000).toFixed(0)} triệu VNĐ
                    </div>
                )}
                {request.surveyImages.length > 0 && (
                    <Tag color="blue" style={{ fontSize: 11, width: 'fit-content' }}>
                        📸 {request.surveyImages.length} ảnh KS
                    </Tag>
                )}
            </div>

            <div style={{ marginTop: 8, fontSize: 11, color: '#aaa' }}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                {request.createdAt.split('T')[0]}
                <Text style={{ float: 'right', fontSize: 11 }}>PM: {request.assignedPmName.split(' ').pop()}</Text>
            </div>
        </Card>
    );
};

const Pipeline: React.FC = () => {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const navigate = useNavigate();
    const [requests, setRequests] = useState(mockServiceRequests);
    const [activePipelineId, setActivePipelineId] = useState<string>(mockPipelines[0]?.id || '');

    const activePipeline = mockPipelines.find(p => p.id === activePipelineId) || mockPipelines[0];

    // Filter requests by active pipeline ONLY
    const pipelineRequests = requests.filter(r => r.pipelineId === activePipeline.id);

    const handleMove = (requestId: string, newStageId: string) => {
        setRequests(prev =>
            prev.map(r => r.id === requestId ? { ...r, stageId: newStageId } : r)
        );
    };

    // Calculate conversion dynamically based on 'WON' systemStage
    const wonStageIds = activePipeline.stages.filter(s => s.systemStage === 'WON').map(s => s.id);
    const totalConverted = pipelineRequests.filter(r => r.stageId && wonStageIds.includes(r.stageId)).length;
    const conversionRate = pipelineRequests.length > 0 ? Math.round((totalConverted / pipelineRequests.length) * 100) : 0;

    return (
        <div style={{ padding: isMobile ? 4 : 0 }}>
            <div style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col xs={24} lg={16}>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 8 : 0 }}>
                            <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>CRM Pipeline – Kanban Board</Title>
                            <Select
                                value={activePipelineId}
                                onChange={setActivePipelineId}
                                style={{ width: isMobile ? '100%' : 250 }}
                                size={isMobile ? "middle" : "small"}
                            >
                                {mockPipelines.map(p => (
                                    <Option key={p.id} value={p.id}>{p.name}</Option>
                                ))}
                            </Select>
                        </div>
                        <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>
                            Tổng: {pipelineRequests.length} YC &nbsp;|&nbsp; Thắng: {totalConverted} &nbsp;|&nbsp; Tỉ lệ: {conversionRate}%
                        </Text>
                    </Col>
                    <Col xs={24} lg={8} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Space size={8} wrap={isMobile} style={{ width: isMobile ? '100%' : 'auto' }}>
                            <Button onClick={() => navigate('/pm/crm/service-requests')} block={isMobile}>
                                {isMobile ? 'Dạng danh sách' : 'Xem dạng Danh sách'}
                            </Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/pm/crm/service-requests/new')} block={isMobile}>
                                {isMobile ? 'Tạo YC' : 'Tạo Yêu cầu mới'}
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            {/* Conversion Progress */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={18}>
                        <Text style={{ fontWeight: 500 }}>Tỉ lệ chuyển đổi tháng này</Text>
                        <Progress
                            percent={conversionRate}
                            strokeColor={{ from: '#108ee9', to: '#87d068' }}
                            style={{ margin: '4px 0 0' }}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <div style={{ textAlign: isMobile ? 'left' : 'center', display: isMobile ? 'flex' : 'block', alignItems: 'center', gap: 12 }}>
                            <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, color: '#52c41a' }}>{conversionRate}%</div>
                            <Text type="secondary" style={{ fontSize: 12 }}>{totalConverted}/{pipelineRequests.length} YC</Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Kanban Board */}
            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    overflowX: 'auto',
                    paddingBottom: 16,
                    minHeight: 500,
                }}
            >
                {activePipeline.stages.map(col => {
                    const colRequests = pipelineRequests.filter(r => r.stageId === col.id);
                    // Generate subtle bgColor based on the string color
                    const getBgColor = (c: string) => {
                        const bgMap: Record<string, string> = { blue: '#e6f4ff', gold: '#fffbe6', orange: '#fff7e6', green: '#f6ffed', red: '#fff2f0', volcano: '#fff2e8' };
                        return bgMap[c] || '#f5f5f5';
                    };

                    return (
                        <div
                            key={col.id}
                            style={{
                                minWidth: isMobile ? 240 : 260,
                                maxWidth: isMobile ? 250 : 280,
                                flex: `0 0 ${isMobile ? '240px' : '260px'}`,
                                background: getBgColor(col.color),
                                borderRadius: 12,
                                border: `1px solid ${col.color}`,
                            }}
                        >
                            {/* Column Header */}
                            <div
                                style={{
                                    padding: '10px 12px',
                                    borderBottom: `2px solid ${col.color}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: '#ffffff99',
                                    borderRadius: '12px 12px 0 0'
                                }}
                            >
                                <span style={{ fontWeight: 600, color: col.color, fontSize: 13, textTransform: 'uppercase' }}>
                                    {col.order}. {col.name}
                                </span>
                                <Badge
                                    count={colRequests.length}
                                    style={{ background: col.color }}
                                    showZero
                                />
                            </div>

                            {/* Cards */}
                            <div style={{ padding: '8px' }}>
                                {colRequests.length === 0 ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Không có YC"
                                        style={{ marginTop: 24 }}
                                    />
                                ) : (
                                    colRequests.map(c => (
                                        <KanbanCard key={c.id} request={c} pipeline={activePipeline} onMove={handleMove} />
                                    ))
                                )}
                            </div>

                            {/* Add to column */}
                            <div style={{ padding: '0 8px 8px' }}>
                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    style={{ width: '100%', borderColor: col.color, color: col.color }}
                                    size="small"
                                    onClick={() => navigate('/pm/crm/service-requests/new')}
                                >
                                    Thêm Yêu cầu
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Pipeline;
