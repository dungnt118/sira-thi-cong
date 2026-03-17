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

/* ====== MOCK DATA ====== */
const kpiData = {
    totalProjects: 48,
    projectsTrend: 12,
    activeProjects: 15,
    pendingApprovals: 23,
    revenueThisMonth: 650000000,
    revenueTrend: 8.5,
};

const recentProjects = [
    {
        key: '1',
        code: 'DU-2026-001',
        name: 'Chống thấm Chung cư Sunrise',
        customer: 'Công ty ABC',
        status: 'Đang thi công',
        pm: 'Nguyễn Văn A',
        progress: 72,
    },
    {
        key: '2',
        code: 'DU-2026-002',
        name: 'Sửa chữa Nhà riêng Q7',
        customer: 'Anh Trần Văn B',
        status: 'Chờ nghiệm thu',
        pm: 'Nguyễn Văn A',
        progress: 95,
    },
    {
        key: '3',
        code: 'DU-2026-003',
        name: 'Chống thấm Văn phòng DEF',
        customer: 'Công ty DEF',
        status: 'Chậm tiến độ',
        pm: 'Nguyễn Văn A',
        progress: 45,
    },
    {
        key: '4',
        code: 'DU-2026-004',
        name: 'Sửa chữa Biệt thự Thảo Điền',
        customer: 'Chị Lê Thị C',
        status: 'Bản nháp',
        pm: 'Nguyễn Văn A',
        progress: 0,
    },
    {
        key: '5',
        code: 'DU-2026-005',
        name: 'Chống thấm Nhà xưởng GHI',
        customer: 'Công ty GHI',
        status: 'Đang thi công',
        pm: 'Nguyễn Văn A',
        progress: 30,
    },
];

const recentPayments = [
    { key: '1', project: 'DU-2026-001', milestone: 'Đặt cọc', amount: 15000000, status: 'Đã thanh toán', date: '2026-02-10' },
    { key: '2', project: 'DU-2026-002', milestone: 'Nghiệm thu', amount: 20000000, status: 'Chờ xác nhận', date: '2026-02-12' },
    { key: '3', project: 'DU-2026-003', milestone: 'Tạm ứng', amount: 18000000, status: 'Quá hạn', date: '2026-01-28' },
    { key: '4', project: 'DU-2026-005', milestone: 'Đặt cọc', amount: 12000000, status: 'Đã thanh toán', date: '2026-02-08' },
    { key: '5', project: 'DU-2026-001', milestone: 'Tạm ứng', amount: 25000000, status: 'Chờ xác nhận', date: '2026-02-13' },
];

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

    const statusColor: Record<string, string> = {
        'Đang thi công': 'processing',
        'Chờ nghiệm thu': 'warning',
        'Chậm tiến độ': 'error',
        'Bản nháp': 'default',
        'Hoàn thành': 'success',
    };

    const paymentStatusColor: Record<string, string> = {
        'Đã thanh toán': 'success',
        'Chờ xác nhận': 'warning',
        'Quá hạn': 'error',
    };

    const projectColumns: ColumnsType<any> = [
        {
            title: 'Mã DA', dataIndex: 'code', key: 'code', width: 130,
            render: (code) => <a onClick={() => navigate(`/pm/projects/${code}`)}>{code}</a>,
        },
        { title: 'Tên dự án', dataIndex: 'name', key: 'name', ellipsis: true },
        { title: 'Khách hàng', dataIndex: 'customer', key: 'customer', width: 150 },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 140,
            render: (s) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>,
        },
        {
            title: 'Tiến độ', dataIndex: 'progress', key: 'progress', width: 120,
            render: (p) => <Progress percent={p} size="small" status={p >= 95 ? 'success' : undefined} />,
        },
    ];

    const paymentColumns: ColumnsType<any> = [
        { title: 'Dự án', dataIndex: 'project', key: 'project', width: 130 },
        { title: 'Mốc', dataIndex: 'milestone', key: 'milestone', width: 110 },
        {
            title: 'Số tiền', dataIndex: 'amount', key: 'amount', width: 120,
            render: (v) => `${(v / 1000000).toFixed(0)} triệu`,
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 130,
            render: (s) => <Tag color={paymentStatusColor[s] || 'default'}>{s}</Tag>,
        },
    ];

    return (
        <div style={{ padding: 4 }}>
            <h2 style={{ marginBottom: 24, fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>Tổng Quan Dự Án</h2>

            {/* Row 1: KPI Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable onClick={() => navigate('/pm/projects/all')} bodyStyle={{ padding: 16 }}>
                        <Statistic
                            title="Tổng Dự án"
                            value={kpiData.totalProjects}
                            prefix={<ProjectOutlined />}
                            valueStyle={{ color: '#1890ff', fontSize: 24 }}
                        />
                        <Tag color="green" icon={<ArrowUpOutlined />} style={{ marginTop: 8, fontSize: 11 }}>
                            +{kpiData.projectsTrend}% <span style={{ opacity: 0.8 }}>tháng trước</span>
                        </Tag>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable onClick={() => navigate('/pm/projects/all')} bodyStyle={{ padding: 16 }}>
                        <Statistic
                            title="Đang Thi công"
                            value={kpiData.activeProjects}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#fa8c16', fontSize: 24 }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#1890ff', cursor: 'pointer' }}>
                            <EyeOutlined /> Xem danh sách
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable onClick={() => navigate('/pm/projects/all')} bodyStyle={{ padding: 16 }}>
                        <Statistic
                            title="Chờ Duyệt Tư liệu"
                            value={kpiData.pendingApprovals}
                            prefix={<FileImageOutlined />}
                            valueStyle={{ color: '#722ed1', fontSize: 24 }}
                        />
                        {kpiData.pendingApprovals > 10 && (
                            <Tag color="red" icon={<ExclamationCircleOutlined />} style={{ marginTop: 8, fontSize: 11 }}>
                                Cần xử lý gấp
                            </Tag>
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bodyStyle={{ padding: 16 }}>
                        <Statistic
                            title="Doanh thu Tháng này"
                            value={kpiData.revenueThisMonth / 1000000}
                            suffix="triệu"
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600', fontSize: 24 }}
                        />
                        <Tag color="green" icon={<ArrowUpOutlined />} style={{ marginTop: 8, fontSize: 11 }}>
                            +{kpiData.revenueTrend}%
                        </Tag>
                    </Card>
                </Col>
            </Row>

            {/* Row 2: Project Distribution + Activity Timeline */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="Phân bố Trạng thái Dự án" bodyStyle={{ padding: 16 }}>
                        <Row gutter={[8, 16]}>
                            {[
                                { label: 'Bản nháp', count: 5, color: '#d9d9d9', total: 48 },
                                { label: 'Đã lên lịch', count: 8, color: '#1890ff', total: 48 },
                                { label: 'Đang thi công', count: 15, color: '#fa8c16', total: 48 },
                                { label: 'Chờ nghiệm thu', count: 6, color: '#722ed1', total: 48 },
                                { label: 'Hoàn thành', count: 12, color: '#52c41a', total: 48 },
                                { label: 'Đã đóng', count: 2, color: '#262626', total: 48 },
                            ].map((item, idx) => (
                                <Col xs={8} sm={4} key={idx}>
                                    <div style={{ textAlign: 'center', marginBottom: 8 }}>
                                        <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.count}</div>
                                        <div style={{ fontSize: 11, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                                        <Progress
                                            percent={Math.round((item.count / item.total) * 100)}
                                            strokeColor={item.color}
                                            showInfo={false}
                                            size="small"
                                            style={{ marginTop: 4 }}
                                        />
                                    </div>
                                </Col>
                            ))}
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
                        title="Dự án Gần đây"
                        extra={<Button type="link" onClick={() => navigate('/pm/projects/all')} style={{ paddingRight: 0 }}>Xem tất cả</Button>}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Table 
                            columns={projectColumns} 
                            dataSource={recentProjects} 
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
                            dataSource={recentPayments} 
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
                    <Button type="primary" icon={<PlusOutlined />} size="middle" onClick={() => navigate('/pm/projects/create')} block>
                        Tạo Dự án
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
