import React, { useState } from 'react';
import {
    Card, Row, Col, Table, Tag, Button, Statistic, Alert, Typography,
    Modal, Progress, Divider
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CheckCircleOutlined, WarningOutlined
} from '@ant-design/icons';
import { mockMilestones } from '../../../data/mockData';
import type { PaymentMilestone, MilestoneStatus } from '../../../types/v3';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<MilestoneStatus, { label: string; color: string }> = {
    PENDING: { label: '⏳ Chờ thu', color: 'warning' },
    PAID: { label: '✅ Đã thu', color: 'success' },
    OVERDUE: { label: '🚨 Quá hạn', color: 'error' },
};

const PaymentDashboard: React.FC = () => {
    const [confirmModal, setConfirmModal] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState<PaymentMilestone | null>(null);

    const totalAmount = mockMilestones.reduce((s, m) => s + m.amount, 0);
    const paidAmount = mockMilestones.filter(m => m.status === 'PAID').reduce((s, m) => s + m.amount, 0);
    const pendingAmount = mockMilestones.filter(m => m.status === 'PENDING').reduce((s, m) => s + m.amount, 0);
    const overdueAmount = mockMilestones.filter(m => m.status === 'OVERDUE').reduce((s, m) => s + m.amount, 0);

    const handleConfirmPayment = (milestone: PaymentMilestone) => {
        setSelectedMilestone(milestone);
        setConfirmModal(true);
    };

    const milestoneColumns: ColumnsType<PaymentMilestone> = [
        {
            title: 'Dự án',
            key: 'project',
            fixed: 'left',
            width: 150,
            render: (_, m) => (
                <div style={{ padding: '4px 0' }}>
                    <Text strong style={{ fontSize: 13 }}>{m.projectName.length > 30 ? m.projectName.slice(0, 30) + '...' : m.projectName}</Text>
                    <div style={{ fontSize: 11, color: '#999' }}>Đợt {m.round} ({m.percentage}%)</div>
                </div>
            ),
        },
        {
            title: 'Số tiền',
            key: 'amount',
            align: 'right',
            width: 140,
            sorter: (a, b) => a.amount - b.amount,
            render: (_, m) => (
                <Text strong style={{ fontSize: 14, color: '#1976D2' }}>
                    {m.amount.toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
        {
            title: 'Hạn thu',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 100,
            sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
            render: (date, m) => (
                <Text style={{ fontSize: 13, color: m.status === 'OVERDUE' ? '#ff4d4f' : '#333', fontWeight: m.status === 'OVERDUE' ? 700 : 400 }}>
                    {date}
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 120,
            render: (_, m) => <Tag color={STATUS_CONFIG[m.status].color} style={{ fontSize: 11, margin: 0 }}>{STATUS_CONFIG[m.status].label}</Tag>,
            filters: Object.entries(STATUS_CONFIG).map(([k, v]) => ({ text: v.label, value: k })),
            onFilter: (value, r) => r.status === value,
        },
        {
            title: '',
            key: 'action',
            width: 130,
            fixed: 'right',
            render: (_, m) => m.status !== 'PAID' ? (
                <Button
                    type="primary"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleConfirmPayment(m)}
                    style={{ fontSize: 11 }}
                >
                    Xác nhận
                </Button>
            ) : (
                <Text type="secondary" style={{ fontSize: 11 }}>
                    ✅ {m.paidAt?.split('T')[0]}
                </Text>
            ),
        },
    ];

    return (
        <div style={{ padding: '0 4px' }}>
            <Title level={4} style={{ marginBottom: 24 }}>💰 Theo dõi Thanh toán</Title>

            {/* KPI */}
            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" style={{ borderLeft: '3px solid #1976D2', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Tổng phải thu</Text>} 
                            value={Math.round(totalAmount / 1000000)} 
                            suffix={<span style={{ fontSize: 12 }}>tr</span>} 
                            valueStyle={{ color: '#1976D2', fontSize: 20 }} 
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" style={{ borderLeft: '3px solid #52c41a', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Đã thu</Text>} 
                            value={Math.round(paidAmount / 1000000)} 
                            suffix={<span style={{ fontSize: 12 }}>tr</span>} 
                            valueStyle={{ color: '#52c41a', fontSize: 20 }} 
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" style={{ borderLeft: '3px solid #fa8c16', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Chờ thu</Text>} 
                            value={Math.round(pendingAmount / 1000000)} 
                            suffix={<span style={{ fontSize: 12 }}>tr</span>} 
                            valueStyle={{ color: '#fa8c16', fontSize: 20 }} 
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small" style={{ borderLeft: '3px solid #ff4d4f', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<Text type="secondary" style={{ fontSize: 12 }}>Quá hạn</Text>}
                            value={Math.round(overdueAmount / 1000000)}
                            suffix={<span style={{ fontSize: 12 }}>tr</span>}
                            valueStyle={{ color: overdueAmount > 0 ? '#ff4d4f' : '#52c41a', fontSize: 20 }}
                            prefix={overdueAmount > 0 ? <WarningOutlined /> : undefined}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Collection Progress */}
            <Card size="small" style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Text strong style={{ fontSize: 13 }}>Tiến độ thu tiền tháng này</Text>
                <div style={{ marginTop: 8 }}>
                    <Progress
                        percent={Math.round((paidAmount / totalAmount) * 100)}
                        strokeColor={{ from: '#fa8c16', to: '#52c41a' }}
                        format={p => <span style={{ fontSize: 12 }}>{p}%</span>}
                    />
                </div>
                <Text type="secondary" style={{ fontSize: 11 }}>
                    Đã thu {paidAmount.toLocaleString('vi-VN')}đ / {totalAmount.toLocaleString('vi-VN')}đ
                </Text>
            </Card>

            {overdueAmount > 0 && (
                <Alert
                    message={
                        <div style={{ fontSize: 12 }}>
                            🚨 Có công nợ quá hạn: <strong>{overdueAmount.toLocaleString('vi-VN')}đ</strong>
                        </div>
                    }
                    type="error"
                    showIcon
                    style={{ marginBottom: 16, borderRadius: 8 }}
                />
            )}

            <div style={{ background: '#fff', borderRadius: 8, padding: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Table
                    columns={milestoneColumns}
                    dataSource={mockMilestones}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 'max-content' }}
                    pagination={{ 
                        pageSize: 10, 
                        size: 'small',
                        showTotal: (t) => <span style={{ fontSize: 12 }}>{t} đợt</span>
                    }}
                />
            </div>

            {/* Confirm Payment Modal */}
            <Modal
                title={<><CheckCircleOutlined style={{ color: '#52c41a' }} /> Xác nhận thu tiền</>}
                open={confirmModal}
                width={window.innerWidth < 640 ? '95%' : 520}
                centered={window.innerWidth < 640}
                onCancel={() => setConfirmModal(false)}
                onOk={() => {
                    setConfirmModal(false);
                    // mock update
                    import('antd').then(({ message: msg }) => msg.success('Đã xác nhận thu tiền thành công'));
                }}
                okText="Xác nhận"
                okType="primary"
            >
                {selectedMilestone && (
                    <div style={{ padding: '12px 0' }}>
                        <Row style={{ marginBottom: 12 }}>
                            <Col xs={8} sm={6}><Text type="secondary">Dự án:</Text></Col>
                            <Col xs={16} sm={18}><Text strong>{selectedMilestone.projectName}</Text></Col>
                        </Row>
                        <Row style={{ marginBottom: 12 }}>
                            <Col xs={8} sm={6}><Text type="secondary">Đợt:</Text></Col>
                            <Col xs={16} sm={18}><Text strong>Đợt {selectedMilestone.round} ({selectedMilestone.percentage}%)</Text></Col>
                        </Row>
                        <Row>
                            <Col xs={8} sm={6}><Text type="secondary">Số tiền:</Text></Col>
                            <Col xs={16} sm={18}>
                                <Text strong style={{ fontSize: 22, color: '#52c41a' }}>
                                    {selectedMilestone.amount.toLocaleString('vi-VN')}đ
                                </Text>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '16px 0' }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Trạng thái sẽ đổi sang "Đã thu" và ghi nhận vào báo cáo.
                        </Text>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PaymentDashboard;
