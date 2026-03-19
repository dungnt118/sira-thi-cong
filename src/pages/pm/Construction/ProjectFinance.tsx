// @ts-nocheck
import React from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Statistic, Progress,
    Table, Alert, Divider, Space,
} from 'antd';
import {
    ArrowLeftOutlined, InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { 
    mockProjects as defaultProjects, 
    mockMaterials as defaultMaterials, 
    mockStandards as defaultStandards 
} from '../../../data/mockData';
import type { Material, MaterialStandard } from '../../../types/v3';
import type { Project } from '../../../types/legacy-project';

const { Title, Text } = Typography;

const ProjectFinance: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [mockProjects] = useLocalStorageData<Project[]>(demoDataService.KEYS.PROJECTS, defaultProjects);
    const [mockMaterials] = useLocalStorageData<Material[]>(demoDataService.KEYS.MATERIALS, defaultMaterials);
    const [mockStandards] = useLocalStorageData<MaterialStandard[]>(demoDataService.KEYS.STANDARDS, defaultStandards);

    const project = mockProjects.find(p => p.id === id);

    if (!project) return <div>Không tìm thấy dự án</div>;

    const milestones = project.paymentMilestones;
    const contractValue = milestones.reduce((s, m) => s + m.amount, 0);
    const collected = milestones.filter(m => m.status === 'PAID').reduce((s, m) => s + m.amount, 0);
    const remaining = contractValue - collected;
    const collectedPct = contractValue > 0 ? Math.round((collected / contractValue) * 100) : 0;

    // Estimated material cost from standards
    const standards = mockStandards.filter(s => s.constructionType === project.type);
    const matCost = standards.reduce((sum, s) => {
        const mat = mockMaterials.find(m => m.id === s.materialId);
        return sum + (mat?.unitCost ?? 0) * Math.ceil(project.areaM2 * s.usagePerM2);
    }, 0);

    const estimatedMargin = contractValue - matCost;
    const marginPct = contractValue > 0 ? Math.round((estimatedMargin / contractValue) * 100) : 0;

    const milestoneColumns = [
        { title: 'Đợt', dataIndex: 'round', width: 60, render: (v: number) => <Text strong>Đợt {v}</Text> },
        { title: 'Tỷ lệ', dataIndex: 'percentage', width: 70, render: (v: number) => <Tag>{v}%</Tag> },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (v: number) => <Text strong style={{ color: '#1976D2' }}>{v.toLocaleString('vi-VN')} đ</Text>,
        },
        {
            title: 'Hạn thu',
            dataIndex: 'dueDate',
            render: (v: string) => <Text>{v}</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v: string, r: typeof milestones[0]) => (
                <div>
                    <Tag color={v === 'PAID' ? 'success' : v === 'OVERDUE' ? 'error' : 'warning'}>
                        {v === 'PAID' ? '✅ Đã thu' : v === 'OVERDUE' ? '⚠️ Quá hạn' : '⏳ Chờ thu'}
                    </Tag>
                    {v === 'PAID' && r.paidAt && (
                        <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                            Thu {r.paidAt.split('T')[0]} bởi {r.paidBy}
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <Button icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(`/pm/construction/projects/${project.id}`)}>
                    Chi tiết dự án
                </Button>
                <div style={{ flex: 1 }}>
                    <Title level={4} style={{ margin: 0 }}>💰 Tài chính Dự án (Xem tổng quan)</Title>
                    <Text type="secondary">{project.code} – {project.customerName}</Text>
                </div>
            </div>

            <Alert
                message={
                    <Space>
                        <InfoCircleOutlined />
                        PM chỉ xem được tổng quan. Việc xác nhận thu tiền do Kế toán thực hiện.
                        Liên hệ: <strong>Kế toán Phạm Thị A</strong>
                    </Space>
                }
                type="info" style={{ marginBottom: 16 }}
            />

            {/* KPI Cards */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderTop: '3px solid #1976D2' }}>
                        <Statistic
                            title="💰 Giá trị Hợp đồng"
                            value={contractValue}
                            formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                            valueStyle={{ color: '#1976D2', fontSize: 18 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderTop: '3px solid #52c41a' }}>
                        <Statistic
                            title="✅ Đã thu"
                            value={collected}
                            formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                            valueStyle={{ color: '#52c41a', fontSize: 18 }}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>({collectedPct}% giá trị HĐ)</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderTop: '3px solid #fa8c16' }}>
                        <Statistic
                            title="⏳ Còn lại"
                            value={remaining}
                            formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                            valueStyle={{ color: '#fa8c16', fontSize: 18 }}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>({100 - collectedPct}% giá trị HĐ)</Text>
                    </Card>
                </Col>
            </Row>

            {/* Collection progress */}
            <Card title="📊 Tiến độ thu tiền" style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Tiến độ thu tiền</Text>
                        <Text strong>{collectedPct}%</Text>
                    </div>
                    <Progress percent={collectedPct} status={collectedPct === 100 ? 'success' : 'active'} strokeColor="#1976D2" />
                </div>
            </Card>

            {/* Payment milestones table */}
            <Card title="📅 Lịch Thanh toán" style={{ marginBottom: 16 }}>
                <Table
                    dataSource={milestones}
                    columns={milestoneColumns}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                />
                <Alert
                    message="📌 Kế toán xác nhận việc thu tiền. PM không có quyền thao tác thanh toán."
                    type="warning" showIcon style={{ marginTop: 12 }}
                />
            </Card>

            {/* Material cost estimate */}
            <Card title="📦 Chi phí Vật tư ước tính">
                {standards.map(s => {
                    const mat = mockMaterials.find(m => m.id === s.materialId);
                    const qty = Math.ceil(project.areaM2 * s.usagePerM2);
                    const cost = (mat?.unitCost ?? 0) * qty;
                    return (
                        <Row key={s.materialId} justify="space-between" style={{ marginBottom: 8 }}>
                            <Col>
                                <Text>{s.materialName}</Text>
                                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                                    ({project.areaM2}m² × {s.usagePerM2} = {qty} {mat?.unit})
                                </Text>
                            </Col>
                            <Col>
                                <Text>{cost.toLocaleString('vi-VN')} đ</Text>
                            </Col>
                        </Row>
                    );
                })}
                <Divider style={{ margin: '8px 0' }} />
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Col><Text strong>Tổng chi phí VT ước tính</Text></Col>
                    <Col><Text strong>{matCost.toLocaleString('vi-VN')} đ</Text></Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Col>
                        <Text strong>Margin ước tính</Text>
                        <Text type="secondary" style={{ marginLeft: 8, fontSize: 11 }}>(giả sử thu đủ HĐ)</Text>
                    </Col>
                    <Col>
                        <Text strong style={{ color: estimatedMargin > 0 ? '#52c41a' : '#ff4d4f', fontSize: 16 }}>
                            {estimatedMargin.toLocaleString('vi-VN')} đ ({marginPct}%)
                        </Text>
                    </Col>
                </Row>
                <Alert
                    message="📌 Đây là ước tính dựa trên định mức tiêu chuẩn. Số liệu chính xác do Kế toán xác nhận."
                    type="warning" showIcon style={{ marginTop: 8 }}
                />
            </Card>
        </div>
    );
};

export default ProjectFinance;
