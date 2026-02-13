import React from 'react';
import { Card, Row, Col, Statistic, Table, Badge, Button, Space, Typography } from 'antd';
import {
    UserOutlined,
    ProjectOutlined,
    FileImageOutlined,
    DollarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface SystemMetrics {
    users: {
        total: number;
        active: number; // logged in today
        online: number; // currently online
        change: number; // % change vs last week
    };
    projects: {
        total: number;
        active: number; // In Progress status
        completed_this_month: number;
        change: number;
    };
    evidence: {
        pending_approval: number; // Awaiting PM/Supervisor approval
        approved_today: number;
        total_this_month: number;
        change: number;
    };
    payment: {
        pending_confirmation: number; // Awaiting Accountant confirmation
        total_this_month: number;
        change: number;
    };
}

interface ActivityLog {
    key: string;
    timestamp: string;
    user: string;
    action: string;
    entity: string;
    status: 'success' | 'pending' | 'error';
}

/**
 * Admin Dashboard V2 - Construction SME Focus
 * Metrics: Users, Projects, Evidence, Payments (NOT Server/CPU/Memory)
 */
const DashboardV2: React.FC = () => {
    // Mock data - replace with GraphQL/API calls
    const metrics: SystemMetrics = {
        users: { total: 24, active: 18, online: 5, change: 12.5 },
        projects: { total: 47, active: 12, completed_this_month: 8, change: 6.7 },
        evidence: { pending_approval: 23, approved_today: 15, total_this_month: 342, change: -4.3 },
        payment: { pending_confirmation: 5, total_this_month: 185000000, change: 8.2 },
    };

    const recentActivities: ActivityLog[] = [
        {
            key: '1',
            timestamp: '10:30 SA',
            user: 'Nguyễn Văn A',
            action: 'Evidence Approved',
            entity: 'DU-2024-001',
            status: 'success',
        },
        {
            key: '2',
            timestamp: '09:15 SA',
            user: 'Trần Thị B',
            action: 'Payment Confirmed',
            entity: 'DU-2024-002',
            status: 'success',
        },
        {
            key: '3',
            timestamp: '08:45 SA',
            user: 'Lê Văn C',
            action: 'Evidence Uploaded',
            entity: 'DU-2024-003',
            status: 'pending',
        },
        {
            key: '4',
            timestamp: '08:20 SA',
            user: 'Phạm Thị D',
            action: 'User Login',
            entity: 'Admin',
            status: 'success',
        },
        {
            key: '5',
            timestamp: '07:55 SA',
            user: 'Hoàng Văn E',
            action: 'Project Created',
            entity: 'DU-2024-004',
            status: 'success',
        },
    ];

    const activityColumns: ColumnsType<ActivityLog> = [
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 100,
        },
        {
            title: 'Người dùng',
            dataIndex: 'user',
            key: 'user',
            width: 150,
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
                const icon =
                    record.status === 'success' ? (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : record.status === 'pending' ? (
                        <ClockCircleOutlined style={{ color: '#faad14' }} />
                    ) : (
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                    );
                return (
                    <Space>
                        {icon}
                        {text}
                    </Space>
                );
            },
        },
        {
            title: 'Đối tượng',
            dataIndex: 'entity',
            key: 'entity',
            width: 150,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 120,
            render: (status: 'success' | 'pending' | 'error') => {
                const colorMap: Record<string, 'success' | 'warning' | 'error'> = {
                    success: 'success',
                    pending: 'warning',
                    error: 'error',
                };
                const textMap: Record<string, string> = {
                    success: 'Thành công',
                    pending: 'Chờ xử lý',
                    error: 'Lỗi',
                };
                return <Badge status={colorMap[status]} text={textMap[status]} />;
            },
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                Dashboard
            </Title>

            {/* System Metrics */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {/* Users */}
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Người dùng"
                            value={metrics.users.total}
                            prefix={<UserOutlined />}
                            suffix={
                                <Text style={{ fontSize: 14 }}>
                                    <ArrowUpOutlined style={{ color: '#52c41a' }} /> {metrics.users.change}%
                                </Text>
                            }
                        />
                        <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
                            Đang hoạt động: {metrics.users.active} | Online: {metrics.users.online}
                        </div>
                    </Card>
                </Col>

                {/* Projects */}
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Dự án"
                            value={metrics.projects.total}
                            prefix={<ProjectOutlined />}
                            suffix={
                                <Text style={{ fontSize: 14 }}>
                                    <ArrowUpOutlined style={{ color: '#52c41a' }} /> {metrics.projects.change}%
                                </Text>
                            }
                        />
                        <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
                            Đang thực hiện: {metrics.projects.active} | Hoàn thành tháng này:{' '}
                            {metrics.projects.completed_this_month}
                        </div>
                    </Card>
                </Col>

                {/* Evidence */}
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hình ảnh minh chứng"
                            value={metrics.evidence.pending_approval}
                            prefix={<FileImageOutlined />}
                            suffix={
                                <Text style={{ fontSize: 14 }}>
                                    <ArrowDownOutlined style={{ color: '#ff4d4f' }} /> {Math.abs(metrics.evidence.change)}%
                                </Text>
                            }
                        />
                        <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
                            Chờ duyệt | Đã duyệt hôm nay: {metrics.evidence.approved_today}
                        </div>
                    </Card>
                </Col>

                {/* Payment */}
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Thanh toán (Tháng này)"
                            value={metrics.payment.total_this_month / 1000000}
                            precision={1}
                            prefix={<DollarOutlined />}
                            suffix={
                                <Text style={{ fontSize: 14 }}>
                                    Triệu VNĐ <ArrowUpOutlined style={{ color: '#52c41a' }} /> {metrics.payment.change}%
                                </Text>
                            }
                        />
                        <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
                            Chờ xác nhận: {metrics.payment.pending_confirmation}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activities */}
            <Card title="Hoạt động gần đây" style={{ marginBottom: 24 }}>
                <Table
                    columns={activityColumns}
                    dataSource={recentActivities}
                    pagination={false}
                    size="small"
                />
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button type="link">Xem tất cả hoạt động →</Button>
                </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Thao tác nhanh">
                <Space size="middle" wrap>
                    <Button type="primary" icon={<UserOutlined />}>
                        Tạo người dùng mới
                    </Button>
                    <Button icon={<FileImageOutlined />}>Xem nhật ký hệ thống</Button>
                    <Button icon={<ProjectOutlined />}>Báo cáo hệ thống</Button>
                </Space>
            </Card>
        </div>
    );
};

export default DashboardV2;
