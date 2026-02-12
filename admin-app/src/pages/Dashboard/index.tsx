import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Alert, Button, Space } from 'antd';
import {
    UserOutlined,
    DatabaseOutlined,
    CloudServerOutlined,
    WarningOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { Line } from 'recharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    // Mock data for user activity chart
    const userActivityData = [
        { time: '00:00', users: 120 },
        { time: '04:00', users: 80 },
        { time: '08:00', users: 250 },
        { time: '12:00', users: 380 },
        { time: '16:00', users: 320 },
        { time: '20:00', users: 180 },
    ];

    // Mock data for recent actions
    const recentActions = [
        {
            key: '1',
            user: 'John Doe',
            action: 'Created new schema',
            target: 'Employee',
            timestamp: '2 minutes ago',
            status: 'success',
        },
        {
            key: '2',
            user: 'Jane Smith',
            action: 'Updated user role',
            target: 'Admin',
            timestamp: '5 minutes ago',
            status: 'success',
        },
        {
            key: '3',
            user: 'Bob Johnson',
            action: 'Deleted workflow',
            target: 'Approval Process',
            timestamp: '10 minutes ago',
            status: 'warning',
        },
        {
            key: '4',
            user: 'Alice Brown',
            action: 'Modified permissions',
            target: 'User Management',
            timestamp: '15 minutes ago',
            status: 'success',
        },
    ];

    const actionColumns = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Target',
            dataIndex: 'target',
            key: 'target',
        },
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'success' ? 'success' : 'warning'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>

            {/* System Health Cards */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={1234}
                            prefix={<UserOutlined />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#4CAF50' }}>
                                    <ArrowUpOutlined /> 12%
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Schemas"
                            value={45}
                            prefix={<DatabaseOutlined />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#4CAF50' }}>
                                    <ArrowUpOutlined /> 5%
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Server Status"
                            value="Healthy"
                            prefix={<CloudServerOutlined />}
                            valueStyle={{ color: '#4CAF50' }}
                            suffix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="System Alerts"
                            value={3}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#FF9800' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* User Activity Chart */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="User Activity (Last 24 Hours)">
                        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: '#999' }}>Chart will be implemented with Recharts</p>
                        </div>
                    </Card>
                </Col>

                {/* System Alerts */}
                <Col xs={24} lg={8}>
                    <Card title="System Alerts">
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Alert
                                message="High CPU Usage"
                                description="Server 1 is experiencing high CPU usage (85%)"
                                type="warning"
                                showIcon
                                action={
                                    <Button size="small" type="link">
                                        View
                                    </Button>
                                }
                            />
                            <Alert
                                message="Failed Backup"
                                description="Database backup failed at 2:00 AM"
                                type="error"
                                showIcon
                                action={
                                    <Button size="small" type="link">
                                        View
                                    </Button>
                                }
                            />
                            <Alert
                                message="License Expiring"
                                description="License will expire in 30 days"
                                type="info"
                                showIcon
                                action={
                                    <Button size="small" type="link">
                                        Renew
                                    </Button>
                                }
                            />
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Recent Actions */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card
                        title="Recent Actions"
                        extra={
                            <Button type="link" href="/security/audit-log">
                                View All
                            </Button>
                        }
                    >
                        <Table
                            columns={actionColumns}
                            dataSource={recentActions}
                            pagination={false}
                            size="middle"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="Quick Actions">
                        <Space size="middle" wrap>
                            <Button type="primary" icon={<UserOutlined />}>
                                Create User
                            </Button>
                            <Button icon={<DatabaseOutlined />}>Create Schema</Button>
                            <Button icon={<CloudServerOutlined />}>View System Health</Button>
                            <Button icon={<WarningOutlined />}>View Alerts</Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
