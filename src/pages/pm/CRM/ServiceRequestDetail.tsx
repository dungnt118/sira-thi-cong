import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card, Tabs, Row, Col, Typography, Button, Space,
    Descriptions, Tag, Timeline, Divider, List, Avatar, Empty
} from 'antd';
import {
    PhoneOutlined, EnvironmentOutlined, ArrowLeftOutlined,
    EditOutlined, CameraOutlined, FileTextOutlined,
    CheckCircleOutlined, SyncOutlined, ProjectOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import {
    mockServiceRequests as defaultServiceRequests,
    mockCustomers as defaultCustomers,
    mockPipelines as defaultPipelines
} from '../../../data/mockData';
import type {
    ServiceRequest,
    Customer,
    Pipeline as PipelineType,
    PipelineSystemStage
} from '../../../types/v3';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<PipelineSystemStage, { label: string; color: string }> = {
    NEW: { label: 'Mới tạo', color: 'blue' },
    IN_PROGRESS: { label: 'Đang xử lý', color: 'processing' },
    WON: { label: 'Đã ký HĐ', color: 'success' },
    LOST: { label: 'Từ chối / Hủy', color: 'error' },
};

const ServiceRequestDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [mockPipelines] = useLocalStorageData<PipelineType[]>(demoDataService.KEYS.PIPELINES, defaultPipelines);
    const [mockCustomers] = useLocalStorageData<Customer[]>(demoDataService.KEYS.CUSTOMERS, defaultCustomers);
    const [mockServiceRequests, setMockServiceRequests] = useLocalStorageData<ServiceRequest[]>(demoDataService.KEYS.SERVICE_REQUESTS, defaultServiceRequests);

    const [activeTab, setActiveTab] = useState('overview');

    const request = mockServiceRequests.find(r => r.id === id);
    const customer = mockCustomers.find(c => c.id === request?.customerId);
    const pipeline = mockPipelines.find(p => p.id === request?.pipelineId);
    const stage = pipeline?.stages.find(s => s.id === request?.stageId);

    if (!request || !customer) return <div>Yêu cầu dịch vụ hoặc khách hàng không tồn tại</div>;

    const handleStageUpdate = (newStageId: string) => {
        const updated = mockServiceRequests.map(sr =>
            sr.id === id ? { ...sr, stageId: newStageId } : sr
        );
        setMockServiceRequests(updated);
    };

    const statusObj = STATUS_CONFIG[request.status];

    return (
        <div style={{ padding: '0 0 24px' }}>
            {/* Header / Breadcrumb */}
            <div style={{ marginBottom: 16 }}>
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/ql/crm/service-requests')} style={{ paddingLeft: 0 }}>
                    Quay lại danh sách Yêu cầu
                </Button>
            </div>

            {/* Top Overview Card */}
            <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Space align="center" size="large">
                            <Avatar size={64} style={{ backgroundColor: '#1890ff', fontSize: 24 }}>
                                {request.customerName.charAt(0)}
                            </Avatar>
                            <div>
                                <Title level={4} style={{ margin: 0 }}>
                                    {request.name}
                                </Title>
                                <Space style={{ marginTop: 8 }} split={<Divider type="vertical" />}>
                                    <Text type="secondary">{request.code}</Text>
                                    <Text strong>{request.customerName}</Text>
                                    <Tag color={statusObj.color} style={{ margin: 0 }}>{statusObj.label}</Tag>
                                    <Tag color={stage?.color || 'default'}>{stage?.name}</Tag>
                                </Space>
                            </div>
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Button icon={<EditOutlined />}>Sửa Yêu cầu</Button>
                            {request.status === 'WON' && (
                                <Button type="primary" icon={<ProjectOutlined />} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                                    Tạo Dự án Thi công
                                </Button>
                            )}
                            {request.status !== 'LOST' && request.status !== 'WON' && (
                                <Button danger icon={<CloseCircleOutlined />}>
                                    Hủy cơ hội
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Row gutter={24}>
                {/* Left Column: Details & Tabs */}
                <Col xs={24} md={16}>
                    <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            tabBarStyle={{ padding: '0 24px', marginBottom: 0, backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
                            items={[
                                { key: 'overview', label: 'Tổng quan' },
                                { key: 'survey', label: `Khảo sát (${request.surveyImages.length})` },
                                { key: 'quotes', label: `Báo giá (${request.quotations.length})` },
                            ]}
                        />

                        <div style={{ padding: 24 }}>
                            {activeTab === 'overview' && (
                                <div>
                                    <Descriptions title="Thông tin Khách hàng" bordered column={1} size="small" style={{ marginBottom: 24 }}>
                                        <Descriptions.Item label="SĐT Khách hàng">
                                            <Space>
                                                <PhoneOutlined style={{ color: '#1890ff' }} />
                                                <Text strong>{customer.phone}</Text>
                                            </Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ">
                                            <Space>
                                                <EnvironmentOutlined style={{ color: '#fa8c16' }} />
                                                {[customer.address, customer.city].filter(Boolean).join(', ') || '—'}
                                            </Space>
                                        </Descriptions.Item>
                                        {customer.email && <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>}
                                    </Descriptions>

                                    <Descriptions title="Thông tin Yêu cầu Dịch vụ" bordered column={1} size="small">
                                        <Descriptions.Item label="PM Phụ trách">{request.assignedPmName}</Descriptions.Item>
                                        <Descriptions.Item label="Quy trình Kanban">{pipeline?.name}</Descriptions.Item>
                                        <Descriptions.Item label="Ngày tạo yêu cầu">{new Date(request.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
                                        <Descriptions.Item label="Ghi chú cơ hội">{request.notes || 'Không có ghi chú'}</Descriptions.Item>
                                    </Descriptions>
                                </div>
                            )}

                            {activeTab === 'survey' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <Title level={5}>Dữ liệu Khảo sát & Đo ẩm</Title>
                                        <Button type="primary" icon={<CameraOutlined />} onClick={() => navigate(`/admin/ql/crm/service-requests/${request.id}/survey`)}>
                                            Cập nhật Khảo sát
                                        </Button>
                                    </div>
                                    <List
                                        grid={{ gutter: 16, column: 3 }}
                                        dataSource={request.surveyImages}
                                        renderItem={item => (
                                            <List.Item>
                                                <Card
                                                    hoverable
                                                    cover={<img alt="example" src={item.url} style={{ height: 120, objectFit: 'cover' }} />}
                                                    bodyStyle={{ padding: 12 }}
                                                >
                                                    <Card.Meta title={item.caption} description={new Date(item.takenAt).toLocaleDateString('vi-VN')} />
                                                </Card>
                                            </List.Item>
                                        )}
                                        locale={{ emptyText: <Empty description="Chưa có ảnh khảo sát" /> }}
                                    />
                                </div>
                            )}

                            {activeTab === 'quotes' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <Title level={5}>Lịch sử Báo giá</Title>
                                        <Button type="primary" icon={<FileTextOutlined />} onClick={() => navigate(`/admin/ql/crm/service-requests/${request.id}/quotation`)}>
                                            Tạo Báo giá mới
                                        </Button>
                                    </div>
                                    <List
                                        dataSource={request.quotations}
                                        renderItem={q => (
                                            <List.Item
                                                actions={[<Button type="link">Xem chi tiết</Button>, <Button type="link">Tải PDF</Button>]}
                                                style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 16 }}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar style={{ backgroundColor: '#1890ff' }} icon={<FileTextOutlined />} />}
                                                    title={
                                                        <Space>
                                                            <Text strong>{q.code}</Text>
                                                            <Tag color={q.status === 'APPROVED' ? 'success' : q.status === 'SENT' ? 'processing' : 'default'}>
                                                                {q.status}
                                                            </Tag>
                                                        </Space>
                                                    }
                                                    description={`Ngày tạo: ${q.createdAt} | Tổng tiền: ${(q.total / 1000000).toFixed(1)} triệu VNĐ`}
                                                />
                                            </List.Item>
                                        )}
                                        locale={{ emptyText: <Empty description="Chưa có báo giá nào" /> }}
                                    />
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Right Column: Timeline & Interactions */}
                <Col xs={24} md={8}>
                    <Card title="Công trình cơ hội (Deal Lifecycle)" style={{ borderRadius: 12 }}>
                        <Timeline>
                            <Timeline.Item color="blue" dot={<CheckCircleOutlined />}>
                                <Text strong>Tạo cơ hội mới</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>{new Date(request.createdAt).toLocaleString('vi-VN')} - Bởi {request.assignedPmName}</Text>
                            </Timeline.Item>

                            {request.surveyImages.length > 0 && (
                                <Timeline.Item color="blue" dot={<CameraOutlined />}>
                                    <Text strong>Khảo sát & Đo ẩm</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>{new Date(request.surveyImages[0].takenAt).toLocaleString('vi-VN')} - {request.surveyImages.length} ảnh</Text>
                                </Timeline.Item>
                            )}

                            {request.quotations.length > 0 && (
                                <Timeline.Item color="blue" dot={<FileTextOutlined />}>
                                    <Text strong>Gửi Báo giá {request.quotations[0].code}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>{request.quotations[0].createdAt}</Text>
                                </Timeline.Item>
                            )}

                            {request.status === 'WON' && (
                                <Timeline.Item color="green" dot={<CheckCircleOutlined style={{ fontSize: 16 }} />}>
                                    <Text strong style={{ color: '#52c41a' }}>Chốt Hợp đồng (WON)</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>Đã chuyển vào nhóm khách hàng thi công</Text>
                                </Timeline.Item>
                            )}

                            {request.status !== 'WON' && request.status !== 'LOST' && (
                                <Timeline.Item color="gray" dot={<SyncOutlined spin />}>
                                    <Text type="secondary">Đang theo dõi tiến độ...</Text>
                                </Timeline.Item>
                            )}
                        </Timeline>

                        <Divider />
                        <Title level={5} style={{ fontSize: 14 }}>Cập nhật Bước</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {pipeline?.stages.map(s => (
                                <Button
                                    key={s.id}
                                    block
                                    type={s.id === request.stageId ? 'primary' : 'default'}
                                    style={s.id === request.stageId ? { background: s.color, borderColor: s.color } : {}}
                                    onClick={() => handleStageUpdate(s.id)}
                                >
                                    {s.order}. {s.name}
                                </Button>
                            ))}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ServiceRequestDetail;
