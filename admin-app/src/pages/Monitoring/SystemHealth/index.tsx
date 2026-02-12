import React from 'react';
import { Card, Row, Col, Progress, Tag, Table, Space } from 'antd';
import {
    CheckCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import './SystemHealth.css';

const SystemHealth: React.FC = () => {
    const serverData = [
        {
            key: '1',
            name: 'Web Server 1',
            status: 'healthy',
            cpu: 45,
            memory: 62,
            disk: 38,
            uptime: '15 days',
        },
        {
            key: '2',
            name: 'Web Server 2',
            status: 'healthy',
            cpu: 52,
            memory: 58,
            disk: 41,
            uptime: '15 days',
        },
        {
            key: '3',
            name: 'Database Server',
            status: 'warning',
            cpu: 78,
            memory: 85,
            disk: 65,
            uptime: '30 days',
        },
        {
            key: '4',
            name: 'Cache Server',
            status: 'healthy',
            cpu: 25,
            memory: 42,
            disk: 28,
            uptime: '45 days',
        },
    ];

    const columns = [
        {
            title: 'Server',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config = {
                    healthy: { color: 'success', icon: <CheckCircleOutlined />, text: 'Healthy' },
                    warning: { color: 'warning', icon: <WarningOutlined />, text: 'Warning' },
                    critical: { color: 'error', icon: <CloseCircleOutlined />, text: 'Critical' },
                };
                const { color, icon, text } = config[status as keyof typeof config];
                return (
                    <Tag color={color} icon={icon}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: 'CPU',
            dataIndex: 'cpu',
            key: 'cpu',
            render: (cpu: number) => (
                <Progress
                    percent={cpu}
                    size="small"
                    status={cpu > 80 ? 'exception' : cpu > 60 ? 'normal' : 'success'}
                />
            ),
        },
        {
            title: 'Memory',
            dataIndex: 'memory',
            key: 'memory',
            render: (memory: number) => (
                <Progress
                    percent={memory}
                    size="small"
                    status={memory > 80 ? 'exception' : memory > 60 ? 'normal' : 'success'}
                />
            ),
        },
        {
            title: 'Disk',
            dataIndex: 'disk',
            key: 'disk',
            render: (disk: number) => (
                <Progress
                    percent={disk}
                    size="small"
                    status={disk > 80 ? 'exception' : disk > 60 ? 'normal' : 'success'}
                />
            ),
        },
        {
            title: 'Uptime',
            dataIndex: 'uptime',
            key: 'uptime',
        },
    ];

    return (
        <div className="system-health">
            <h1>System Health</h1>

            {/* Overview Cards */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <div className="health-metric">
                            <div className="health-metric-icon" style={{ background: '#E8F5E9' }}>
                                <CheckCircleOutlined style={{ fontSize: 32, color: '#4CAF50' }} />
                            </div>
                            <div className="health-metric-content">
                                <div className="health-metric-value">4</div>
                                <div className="health-metric-label">Healthy Servers</div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <div className="health-metric">
                            <div className="health-metric-icon" style={{ background: '#FFF3E0' }}>
                                <WarningOutlined style={{ fontSize: 32, color: '#FF9800' }} />
                            </div>
                            <div className="health-metric-content">
                                <div className="health-metric-value">1</div>
                                <div className="health-metric-label">Warnings</div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <div className="health-metric">
                            <div className="health-metric-icon" style={{ background: '#FFEBEE' }}>
                                <CloseCircleOutlined style={{ fontSize: 32, color: '#F44336' }} />
                            </div>
                            <div className="health-metric-content">
                                <div className="health-metric-value">0</div>
                                <div className="health-metric-label">Critical Issues</div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <div className="health-metric">
                            <div className="health-metric-content">
                                <div className="health-metric-value">99.9%</div>
                                <div className="health-metric-label">Uptime (30 days)</div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Server Details Table */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="Server Details">
                        <Table columns={columns} dataSource={serverData} pagination={false} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SystemHealth;
