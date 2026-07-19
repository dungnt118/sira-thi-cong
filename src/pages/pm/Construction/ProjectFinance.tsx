import React from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Statistic, Progress,
    Table, Alert, Divider, Space, Grid
} from 'antd';
import {
    ArrowLeftOutlined, InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import {
    mockProjects as defaultProjects,
    mockMaterials as defaultMaterials,
    mockStandards as defaultStandards
} from '../../../data/mockData';
import type { Material, MaterialStandard, PaymentMilestone } from '../../../types/v3';
import type { Project } from '../../../types/legacy-project';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ProjectFinance: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const screens = useBreakpoint();
    const isMobile = !screens.sm;

    const [mockProjects] = useLocalStorageData<Project[]>(demoDataService.KEYS.PROJECTS, defaultProjects);
    const [mockMaterials] = useLocalStorageData<Material[]>(demoDataService.KEYS.MATERIALS, defaultMaterials);
    const [mockStandards] = useLocalStorageData<MaterialStandard[]>(demoDataService.KEYS.STANDARDS, defaultStandards);

    const project = mockProjects.find(p => p.id === id);

    if (!project) return <div style={{ padding: 24, textAlign: 'center' }}><Alert message="Không tìm thấy dự án" type="error" /></div>;

    const milestones = (project.paymentMilestones || []) as PaymentMilestone[];
    const contractValue = milestones.reduce((s, m) => s + (m.amount || 0), 0);
    const collected = milestones.filter(m => m.status === 'PAID').reduce((s, m) => s + (m.amount || 0), 0);
    const remaining = contractValue - collected;
    const collectedPct = contractValue > 0 ? Math.round((collected / contractValue) * 100) : 0;

    // Ước tính chi phí vật tư từ định mức
    const standards = mockStandards.filter(s => s.constructionType === project.type);
    const matCost = standards.reduce((sum, s) => {
        const mat = mockMaterials.find(m => m.id === s.materialId);
        return sum + (mat?.unitCost ?? 0) * Math.ceil((project.areaM2 || 0) * (s.usagePerM2 ?? 0));
    }, 0);

    const estimatedMargin = contractValue - matCost;
    const marginPct = contractValue > 0 ? Math.round((estimatedMargin / contractValue) * 100) : 0;

    const milestoneColumns = [
        { 
            title: 'Đợt', 
            dataIndex: 'round', 
            key: 'round',
            width: 80, 
            render: (v: number) => <Text strong>Đợt {v}</Text> 
        },
        { 
            title: 'Tỷ lệ', 
            dataIndex: 'percentage', 
            key: 'percentage',
            width: 80, 
            render: (v: number) => <Tag style={{ margin: 0 }}>{v}%</Tag> 
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (v: number) => <Text strong style={{ color: '#1890ff' }}>{(v || 0).toLocaleString('vi-VN')} đ</Text>,
        },
        {
            title: 'Hạn thu',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 120,
            render: (v: string) => <Text>{v || '—'}</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 180,
            render: (v: string, r: PaymentMilestone) => (
                <div>
                    <Tag color={v === 'PAID' ? 'success' : v === 'OVERDUE' ? 'error' : 'warning'} style={{ margin: 0 }}>
                        {v === 'PAID' ? '✅ Đã thu' : v === 'OVERDUE' ? '⚠️ Quá hạn' : '⏳ Chờ thu'}
                    </Tag>
                    {v === 'PAID' && r.paidAt && (
                        <div style={{ fontSize: 10, color: '#8c8c8c', marginTop: 2 }}>
                            Thu {(r.paidAt as string).split('T')[0]} bởi {r.paidBy}
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: isMobile ? '8px' : '0' }}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 16, marginBottom: 20 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
                <div style={{ flex: 1 }}>
                    <Title level={4} style={{ margin: 0, fontSize: isMobile ? 18 : 20 }}>💰 Tài chính Dự án (Xem tổng quan)</Title>
                    <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>{project.code} – {project.customerName}</Text>
                </div>
            </div>

            <Alert
                message={
                    <Space size={4}>
                        <InfoCircleOutlined />
                        <Text style={{ fontSize: 13 }}>
                            PM chỉ xem được tổng quan. Việc xác nhận thu tiền do Kế toán thực hiện. Liên hệ: <strong>Kế toán Phạm Thị A</strong>
                        </Text>
                    </Space>
                }
                type="info" 
                showIcon 
                style={{ marginBottom: 16, borderRadius: 6 }}
            />

            {/* KPI Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderTop: '3px solid #1890ff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <Statistic
                            title="💰 Giá trị Hợp đồng"
                            value={contractValue}
                            formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                            valueStyle={{ color: '#1890ff', fontSize: isMobile ? 18 : 22, fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderTop: '3px solid #52c41a', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <Statistic
                            title="✅ Đã thu"
                            value={collected}
                            formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                            valueStyle={{ color: '#52c41a', fontSize: isMobile ? 18 : 22, fontWeight: 700 }}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>({collectedPct}% giá trị HĐ)</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderTop: '3px solid #fa8c16', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <Statistic
                            title="⏳ Còn lại"
                            value={remaining}
                            formatter={v => `${Number(v).toLocaleString('vi-VN')} đ`}
                            valueStyle={{ color: '#fa8c16', fontSize: isMobile ? 18 : 22, fontWeight: 700 }}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>({100 - collectedPct}% giá trị HĐ)</Text>
                    </Card>
                </Col>
            </Row>

            {/* Collection progress */}
            <Card title="📊 Tiến độ thu tiền" style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text>Tiến độ thu tiền</Text>
                        <Text strong>{collectedPct}%</Text>
                    </div>
                    <Progress percent={collectedPct} status={collectedPct === 100 ? 'success' : 'active'} strokeColor="#1890ff" />
                </div>
            </Card>

            {/* Payment milestones table */}
            <Card 
                title="📅 Lịch Thanh toán" 
                style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                bodyStyle={{ padding: isMobile ? 8 : 16 }}
            >
                <Table
                    dataSource={milestones}
                    columns={milestoneColumns}
                    rowKey="id"
                    pagination={false}
                    size={isMobile ? "small" : "middle"}
                    scroll={{ x: 'max-content' }}
                />
                <Alert
                    message="Kế toán chịu trách nhiệm xác nhận việc thu tiền thực tế từ khách hàng."
                    type="warning" 
                    showIcon 
                    style={{ marginTop: 12, borderRadius: 6 }}
                />
            </Card>

            {/* Material cost estimate */}
            <Card title="📦 Chi phí Vật tư ước tính" style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                {standards.map(s => {
                    const mat = mockMaterials.find(m => m.id === s.materialId);
                    const qty = Math.ceil((project.areaM2 || 0) * (s.usagePerM2 ?? 0));
                    const cost = (mat?.unitCost ?? 0) * qty;
                    return (
                        <Row key={s.materialId} justify="space-between" align="middle" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 4 }}>
                            <Col>
                                <Text strong style={{ fontSize: isMobile ? 12 : 14 }}>{s.materialName}</Text>
                                <Text type="secondary" style={{ marginLeft: 8, fontSize: 11 }}>
                                    ({project.areaM2}m² × {s.usagePerM2} = {qty} {mat?.unit})
                                </Text>
                            </Col>
                            <Col>
                                <Text style={{ fontSize: isMobile ? 12 : 14 }}>{cost.toLocaleString('vi-VN')} đ</Text>
                            </Col>
                        </Row>
                    );
                })}
                <Divider style={{ margin: '12px 0' }} />
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Col><Text strong>Tổng chi phí VT ước tính</Text></Col>
                    <Col><Text strong style={{ fontSize: isMobile ? 14 : 16 }}>{matCost.toLocaleString('vi-VN')} đ</Text></Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 12 }}>
                    <Col>
                        <Text strong>Margin ước tính</Text>
                        <Text type="secondary" style={{ marginLeft: 4, fontSize: 11 }}>(giả thiết thu đủ HĐ)</Text>
                    </Col>
                    <Col>
                        <Text strong style={{ color: estimatedMargin > 0 ? '#52c41a' : '#ff4d4f', fontSize: isMobile ? 14 : 16 }}>
                            {estimatedMargin.toLocaleString('vi-VN')} đ ({marginPct}%)
                        </Text>
                    </Col>
                </Row>
                <Alert
                    message="Đây là số liệu ước tính dựa trên định mức tiêu chuẩn kỹ thuật làm cơ sở tham khảo cho PM."
                    type="warning" 
                    showIcon 
                    style={{ marginTop: 8, borderRadius: 6 }}
                />
            </Card>
        </div>
    );
};

export default ProjectFinance;
