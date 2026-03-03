import React, { useState } from 'react';
import {
    Card, Button, Badge, Tag, Avatar, Typography, Space, Progress,
    Empty, Tooltip, message, Row, Col
} from 'antd';
import {
    DragOutlined, PlusOutlined, UserOutlined, PhoneOutlined,
    DollarOutlined, CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import { mockCustomers, mockPipelines } from '../../../data/mockData';
import type { Customer, Pipeline as PipelineType, PipelineStage } from '../../../types/v3';

const { Text, Title } = Typography;
const { Option } = Select;

interface KanbanCardProps {
    customer: Customer;
    pipeline: PipelineType;
    onMove: (customerId: string, newStageId: string) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ customer, pipeline, onMove }) => {
    const navigate = useNavigate();
    const hasQuotation = customer.quotations.length > 0;
    const latestQuote = hasQuotation ? customer.quotations[customer.quotations.length - 1] : null;

    // Find next stage dynamically
    const currentStage = pipeline.stages.find(s => s.id === customer.stageId);
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
            onClick={() => navigate(`/pm/crm/customers/${customer.id}`)}
            actions={[
                <Tooltip title="Khảo sát">
                    <span onClick={e => { e.stopPropagation(); navigate(`/pm/crm/customers/${customer.id}/survey`); }}>
                        📸
                    </span>
                </Tooltip>,
                <Tooltip title="Báo giá">
                    <span onClick={e => { e.stopPropagation(); navigate(`/pm/crm/customers/${customer.id}/quotation`); }}>
                        💰
                    </span>
                </Tooltip>,
                nextStage ? (
                    <Tooltip title={`Chuyển sang: ${nextStage.name}`}>
                        <span onClick={e => {
                            e.stopPropagation();
                            onMove(customer.id, nextStage.id);
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
                    <Avatar size={28} style={{ background: '#1976D2', flexShrink: 0 }} icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>{customer.fullName}</div>
                        <Text type="secondary" style={{ fontSize: 11 }}>{customer.code}</Text>
                    </div>
                </div>
                <DragOutlined style={{ color: '#bbb', cursor: 'grab' }} />
            </div>

            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 12, color: '#666' }}>
                    <PhoneOutlined style={{ marginRight: 4 }} /> {customer.phone}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                    📍 {customer.district}
                </div>
                {latestQuote && (
                    <div style={{ fontSize: 12, color: '#52c41a', fontWeight: 500 }}>
                        <DollarOutlined style={{ marginRight: 4 }} />
                        {(latestQuote.total / 1000000).toFixed(0)} triệu VNĐ
                    </div>
                )}
                {customer.surveyImages.length > 0 && (
                    <Tag color="blue" style={{ fontSize: 11, width: 'fit-content' }}>
                        📸 {customer.surveyImages.length} ảnh KS
                    </Tag>
                )}
            </div>

            <div style={{ marginTop: 8, fontSize: 11, color: '#aaa' }}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                {customer.createdAt}
                <Text style={{ float: 'right', fontSize: 11 }}>PM: {customer.assignedPmName.split(' ').pop()}</Text>
            </div>
        </Card>
    );
};

const Pipeline: React.FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState(mockCustomers);
    const [activePipelineId, setActivePipelineId] = useState<string>(mockPipelines[0]?.id || '');

    const activePipeline = mockPipelines.find(p => p.id === activePipelineId) || mockPipelines[0];

    // Filter customers by active pipeline ONLY
    const pipelineCustomers = customers.filter(c => c.pipelineId === activePipeline.id);

    const handleMove = (customerId: string, newStageId: string) => {
        setCustomers(prev =>
            prev.map(c => c.id === customerId ? { ...c, stageId: newStageId } : c)
        );
    };

    // Calculate conversion dynamically based on 'WON' systemStage
    const wonStageIds = activePipeline.stages.filter(s => s.systemStage === 'WON').map(s => s.id);
    const totalConverted = pipelineCustomers.filter(c => c.stageId && wonStageIds.includes(c.stageId)).length;
    const conversionRate = pipelineCustomers.length > 0 ? Math.round((totalConverted / pipelineCustomers.length) * 100) : 0;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <Title level={4} style={{ margin: 0 }}>CRM Pipeline – Kanban Board</Title>
                        <Select
                            value={activePipelineId}
                            onChange={setActivePipelineId}
                            style={{ width: 250 }}
                            size="small"
                        >
                            {mockPipelines.map(p => (
                                <Option key={p.id} value={p.id}>{p.name}</Option>
                            ))}
                        </Select>
                    </div>
                    <Text type="secondary">
                        Tổng: {pipelineCustomers.length} KH &nbsp;|&nbsp; Thắng: {totalConverted} &nbsp;|&nbsp; Tỉ lệ chuyển đổi: {conversionRate}%
                    </Text>
                </div>
                <Space>
                    <Button onClick={() => navigate('/pm/crm/customers')}>Xem dạng Table</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/pm/crm/customers/new')}>
                        Thêm KH mới
                    </Button>
                </Space>
            </div>

            {/* Conversion Progress */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Text style={{ fontWeight: 500 }}>Tỉ lệ chuyển đổi tháng này</Text>
                        <Progress
                            percent={conversionRate}
                            strokeColor={{ from: '#108ee9', to: '#87d068' }}
                            style={{ margin: '4px 0 0' }}
                        />
                    </Col>
                    <Col>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 32, fontWeight: 700, color: '#52c41a' }}>{conversionRate}%</div>
                            <Text type="secondary" style={{ fontSize: 12 }}>{totalConverted}/{customers.length} KH</Text>
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
                    const colCustomers = pipelineCustomers.filter(c => c.stageId === col.id);
                    // Generate subtle bgColor based on the string color
                    const getBgColor = (c: string) => {
                        const bgMap: Record<string, string> = { blue: '#e6f4ff', gold: '#fffbe6', orange: '#fff7e6', green: '#f6ffed', red: '#fff2f0', volcano: '#fff2e8' };
                        return bgMap[c] || '#f5f5f5';
                    };

                    return (
                        <div
                            key={col.id}
                            style={{
                                minWidth: 260,
                                maxWidth: 280,
                                flex: '0 0 260px',
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
                                    count={colCustomers.length}
                                    style={{ background: col.color }}
                                    showZero
                                />
                            </div>

                            {/* Cards */}
                            <div style={{ padding: '8px' }}>
                                {colCustomers.length === 0 ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Không có KH"
                                        style={{ marginTop: 24 }}
                                    />
                                ) : (
                                    colCustomers.map(c => (
                                        <KanbanCard key={c.id} customer={c} pipeline={activePipeline} onMove={handleMove} />
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
                                    onClick={() => navigate('/pm/crm/customers/new')}
                                >
                                    Thêm KH
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
