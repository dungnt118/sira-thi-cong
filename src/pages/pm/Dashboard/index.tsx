import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Progress, Space, List, Avatar } from 'antd';
import {
    ProjectOutlined,
    FileImageOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    TeamOutlined,
    UserOutlined,
    EyeOutlined,
    ArrowUpOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { mockMilestones as defaultMilestones } from '../../../data/mockData';
import { mockJourneys as defaultJourneys } from '../../../data/journeyMockData';
import type { Journey, ProjectStatusType } from '../../../types/journey';
import { MilestoneStatus } from '../../../types/v3';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';


const notifications = [
    { id: 1, text: 'Giám sát viên Trần Thị B đã tải lên 8 tư liệu mới cho DU-2026-001', time: '5 phút trước', type: 'evidence' },
    { id: 2, text: 'Công nợ DU-2026-003 quá hạn 15 ngày - Cần nhắc nhở', time: '1 giờ trước', type: 'payment' },
    { id: 3, text: 'Vấn đề chất lượng mới tại DU-2026-001 - Vết nứt bề mặt', time: '2 giờ trước', type: 'quality' },
    { id: 4, text: 'Outsource Leader Lê Văn C cập nhật tiến độ DU-2026-005', time: '3 giờ trước', type: 'progress' },
    { id: 5, text: 'Khách hàng Công ty ABC truy cập cổng khách hàng', time: '5 giờ trước', type: 'portal' },
];

/* ====== COMPONENT ====== */
const PMDashboard: React.FC = () => {
    const navigate = useNavigate();

    const statusMap: Record<string, { label: string; color: string }> = {
        'not_started': { label: 'Chưa bắt đầu', color: 'default' },
        'active': { label: 'Đang thực hiện', color: 'processing' },
        'completed': { label: 'Hoàn thành', color: 'success' },
        'cancelled': { label: 'Đã hủy', color: 'error' },
    };

    const paymentStatusMap: Record<MilestoneStatus, { label: string; color: string }> = {
        'PAID': { label: 'Đã thanh toán', color: 'success' },
        'PENDING': { label: 'Chờ thanh toán', color: 'warning' },
        'OVERDUE': { label: 'Quá hạn', color: 'error' },
    };

    const [mockJourneys] = useLocalStorageData<Journey[]>(demoDataService.KEYS.JOURNEYS, defaultJourneys);
    const [mockMilestones] = useLocalStorageData<any[]>(demoDataService.KEYS.MILESTONES, defaultMilestones);

    // Derived Metrics
    const totalProjects = mockJourneys.length;
    const activeProjectsCount = mockJourneys.filter(p => p.project_status === 'active').length;
    const pendingApprovalsCount = 0; // Hardcode tạm do Journey chưa map logic pending approval list
    // Rough monthly revenue calculation (from PAID milestones this month/all time for demo)
    const revenueThisMonth = mockMilestones.filter(m => m.status === 'PAID').reduce((acc, m) => acc + m.amount, 0);

    const recentProjectsData = mockJourneys.slice(0, 5).map(p => ({
        ...p,
        key: p.id,
        progress: 50,
    }));

    const recentPaymentsData = mockMilestones.slice(0, 5).map(m => ({
        ...m,
        key: m.id,
    }));

    const projectColumns: ColumnsType<any> = [
        {
            title: 'Mã HT', dataIndex: 'journey_code', key: 'journey_code', width: 130,
            render: (code, record) => <a onClick={() => navigate(`/pm/journeys/${record.id}`)}>{code}</a>,
        },
        { title: 'Tên Hành trình', dataIndex: 'request_title', key: 'request_title', ellipsis: true },
        { title: 'Khách hàng', dataIndex: 'customer_name', key: 'customer_name', width: 150 },
        {
            title: 'Trạng thái', dataIndex: 'project_status', key: 'project_status', width: 140,
            render: (s: ProjectStatusType) => <Tag color={statusMap[s]?.color || 'default'}>{statusMap[s]?.label || s}</Tag>,
        },
        {
            title: 'Tiến độ', dataIndex: 'progress', key: 'progress', width: 120,
            render: (p) => <Progress percent={p} size="small" status={p >= 95 ? 'success' : undefined} />,
        },
    ];

    const paymentColumns: ColumnsType<any> = [
        { title: 'Dự án', dataIndex: 'projectName', key: 'projectName', width: 130, ellipsis: true },
        { title: 'Mốc', dataIndex: 'round', key: 'round', width: 80, render: (r) => `Đợt ${r}` },
        {
            title: 'Số tiền', dataIndex: 'amount', key: 'amount', width: 120,
            render: (v) => `${(v / 1000000).toFixed(1)} tr`,
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 130,
            render: (s: MilestoneStatus) => <Tag color={paymentStatusMap[s]?.color || 'default'}>{paymentStatusMap[s]?.label || s}</Tag>,
        },
    ];

    return (
        <div style={{ padding: 4 }}>
            <h2 style={{ marginBottom: 24, fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>Tổng Quan Dự Án</h2>

            {/* Row 1: KPI Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable onClick={() => navigate('/pm/journeys')} bodyStyle={{ padding: 16 }}>
                        <Statistic
                            title="Tổng Hành trình"
                            value={totalProjects}
                            prefix={<ProjectOutlined />}
                            valueStyle={{ color: '#1890ff', fontSize: 24 }}
                        />
                        <Tag color="green" icon={<ArrowUpOutlined />} style={{ marginTop: 8, fontSize: 11 }}>
                            +12% <span style={{ opacity: 0.8 }}>tháng trước</span>
                        </Tag>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable onClick={() => navigate('/pm/journeys')} bodyStyle={{ padding: 16 }}>
                        <Statistic
                            title="Đang Thực hiện"
                            value={activeProjectsCount}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#fa8c16', fontSize: 24 }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#1890ff', cursor: 'pointer' }}>
                            <EyeOutlined /> Xem danh sách
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable onClick={() => navigate('/pm/journeys/action-center')} bodyStyle={{ padding: 16 }}>
                        <Statistic
                            title="Chờ Duyệt Tư liệu"
                            value={pendingApprovalsCount}
                            prefix={<FileImageOutlined />}
                            valueStyle={{ color: '#722ed1', fontSize: 24 }}
                        />
                        {pendingApprovalsCount > 10 && (
                            <Tag color="red" icon={<ExclamationCircleOutlined />} style={{ marginTop: 8, fontSize: 11 }}>
                                Cần xử lý gấp
                            </Tag>
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bodyStyle={{ padding: 16 }}>
                        <Statistic
                            title="Doanh thu (Tạm tính)"
                            value={revenueThisMonth / 1000000}
                            suffix="tr"
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600', fontSize: 24 }}
                        />
                        <Tag color="green" icon={<ArrowUpOutlined />} style={{ marginTop: 8, fontSize: 11 }}>
                            +8.5%
                        </Tag>
                    </Card>
                </Col>
            </Row>

            {/* Row 2: Project Distribution + Activity Timeline */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="Phân bố Trạng thái Hành trình" bodyStyle={{ padding: 16 }}>
                        <Row gutter={[8, 16]}>
                            {[
                                { key: 'not_started', color: '#d9d9d9' },
                                { key: 'active', color: '#1890ff' },
                                { key: 'completed', color: '#52c41a' },
                                { key: 'cancelled', color: '#ff4d4f' },
                            ].map((config, idx) => {
                                const item = statusMap[config.key as string];
                                const count = mockJourneys.filter(p => p.project_status === config.key).length;
                                return (
                                    <Col xs={8} sm={4} key={idx}>
                                        <div style={{ textAlign: 'center', marginBottom: 8 }}>
                                            <div style={{ fontSize: 24, fontWeight: 700, color: config.color }}>{count}</div>
                                            <div style={{ fontSize: 11, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                                            <Progress
                                                percent={totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0}
                                                strokeColor={config.color}
                                                showInfo={false}
                                                size="small"
                                                style={{ marginTop: 4 }}
                                            />
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Hoạt động Gần đây" bodyStyle={{ padding: '8px 12px', maxHeight: 300, overflow: 'auto' }}>
                        <List
                            size="small"
                            dataSource={notifications}
                            renderItem={(item) => (
                                <List.Item style={{ padding: '8px 0', border: 'none' }}>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                size="small"
                                                icon={
                                                    item.type === 'evidence' ? <FileImageOutlined /> :
                                                        item.type === 'payment' ? <DollarOutlined /> :
                                                            item.type === 'quality' ? <ExclamationCircleOutlined /> :
                                                                <CheckCircleOutlined />
                                                }
                                                style={{
                                                    backgroundColor:
                                                        item.type === 'evidence' ? '#1890ff' :
                                                            item.type === 'payment' ? '#fa8c16' :
                                                                item.type === 'quality' ? '#ff4d4f' : '#52c41a',
                                                }}
                                            />
                                        }
                                        description={
                                            <div>
                                                <div style={{ fontSize: 12, color: '#333' }}>{item.text}</div>
                                                <div style={{ fontSize: 11, color: '#999' }}>{item.time}</div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Row 3: Recent Projects + Payments */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} xl={14}>
                    <Card
                        title="Hành trình Gần đây"
                        extra={<Button type="link" onClick={() => navigate('/pm/journeys')} style={{ paddingRight: 0 }}>Xem tất cả</Button>}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Table 
                            columns={projectColumns} 
                            dataSource={recentProjectsData} 
                            pagination={false} 
                            size="small" 
                            scroll={{ x: 'max-content' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={10}>
                    <Card
                        title="Thanh toán Gần đây"
                        extra={<Button type="link" onClick={() => navigate('/pm/financials/milestones')} style={{ paddingRight: 0 }}>Xem tất cả</Button>}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Table 
                            columns={paymentColumns} 
                            dataSource={recentPaymentsData} 
                            pagination={false} 
                            size="small" 
                            scroll={{ x: 'max-content' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Row 4: Quick Actions */}
            <Card title="Thao tác Nhanh" bodyStyle={{ padding: 16 }}>
                <Space size={12} wrap style={{ width: '100%' }}>
                    <Button type="primary" icon={<PlusOutlined />} size="middle" onClick={() => navigate('/pm/journeys')} block>
                        Danh sách Hành trình
                    </Button>
                    <Button icon={<TeamOutlined />} size="middle" onClick={() => navigate('/pm/teams/internal')} block>
                        Phân công Đội
                    </Button>
                    <Button icon={<UserOutlined />} size="middle" onClick={() => navigate('/pm/customers')} block>
                        Tạo Cổng KH
                    </Button>
                    <Button icon={<DollarOutlined />} size="middle" onClick={() => navigate('/pm/reports')} block>
                        Xem Báo cáo
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default PMDashboard;
