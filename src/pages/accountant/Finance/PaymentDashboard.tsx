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
            render: (_, m) => (
                <div>
                    <Text strong style={{ fontSize: 13 }}>{m.projectName.slice(0, 35)}...</Text>
                    <div style={{ fontSize: 11, color: '#999' }}>Đợt {m.round} ({m.percentage}%)</div>
                </div>
            ),
        },
        {
            title: 'Số tiền',
            key: 'amount',
            align: 'right',
            width: 160,
            sorter: (a, b) => a.amount - b.amount,
            render: (_, m) => (
                <Text strong style={{ fontSize: 15, color: '#1976D2' }}>
                    {m.amount.toLocaleString('vi-VN')}
                </Text>
            ),
        },
        {
            title: 'Hạn thu',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 110,
            sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
            render: (date, m) => (
                <Text style={{ color: m.status === 'OVERDUE' ? '#ff4d4f' : '#333', fontWeight: m.status === 'OVERDUE' ? 700 : 400 }}>
                    {date}
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 130,
            render: (_, m) => <Tag color={STATUS_CONFIG[m.status].color}>{STATUS_CONFIG[m.status].label}</Tag>,
            filters: Object.entries(STATUS_CONFIG).map(([k, v]) => ({ text: v.label, value: k })),
            onFilter: (value, r) => r.status === value,
        },
        {
            title: '',
            key: 'action',
            width: 120,
            render: (_, m) => m.status !== 'PAID' ? (
                <Button
                    type="primary"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleConfirmPayment(m)}
                >
                    Xác nhận thu
                </Button>
            ) : (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    ✅ {m.paidAt?.split('T')[0]}
                </Text>
            ),
        },
    ];

    return (
        <div>
            <Title level={4} style={{ marginBottom: 24 }}>💰 Theo dõi Thanh toán</Title>

            {/* KPI */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card style={{ borderLeft: '3px solid #1976D2' }}>
                        <Statistic title="Tổng phải thu" value={Math.round(totalAmount / 1000000)} suffix="triệu" valueStyle={{ color: '#1976D2' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ borderLeft: '3px solid #52c41a' }}>
                        <Statistic title="Đã thu" value={Math.round(paidAmount / 1000000)} suffix="triệu" valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ borderLeft: '3px solid #fa8c16' }}>
                        <Statistic title="Chờ thu" value={Math.round(pendingAmount / 1000000)} suffix="triệu" valueStyle={{ color: '#fa8c16' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ borderLeft: '3px solid #ff4d4f' }}>
                        <Statistic
                            title="Quá hạn"
                            value={Math.round(overdueAmount / 1000000)}
                            suffix="triệu"
                            valueStyle={{ color: overdueAmount > 0 ? '#ff4d4f' : '#52c41a' }}
                            prefix={overdueAmount > 0 ? <WarningOutlined /> : undefined}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Collection Progress */}
            <Card style={{ marginBottom: 16 }}>
                <Text strong>Tiến độ thu tiền tháng này</Text>
                <div style={{ marginTop: 8 }}>
                    <Progress
                        percent={Math.round((paidAmount / totalAmount) * 100)}
                        strokeColor={{ from: '#fa8c16', to: '#52c41a' }}
                        format={p => `${p}%`}
                    />
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Đã thu {paidAmount.toLocaleString('vi-VN')}đ / {totalAmount.toLocaleString('vi-VN')}đ
                </Text>
            </Card>

            {overdueAmount > 0 && (
                <Alert
                    message={<>🚨 Có công nợ quá hạn: <strong>{overdueAmount.toLocaleString('vi-VN')}đ</strong> – Cần liên hệ khách hàng ngay</>}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Card>
                <Table
                    columns={milestoneColumns}
                    dataSource={mockMilestones}
                    rowKey="id"
                    size="middle"
                    pagination={{ pageSize: 10, showTotal: t => `${t} đợt thanh toán` }}
                />
            </Card>

            {/* Confirm Payment Modal */}
            <Modal
                title={<><CheckCircleOutlined style={{ color: '#52c41a' }} /> Xác nhận thu tiền</>}
                open={confirmModal}
                onCancel={() => setConfirmModal(false)}
                onOk={() => {
                    setConfirmModal(false);
                    // mock update
                    import('antd').then(({ message: msg }) => msg.success('Đã xác nhận thu tiền thành công'));
                }}
                okText="Xác nhận đã thu"
                okType="primary"
            >
                {selectedMilestone && (
                    <div>
                        <Row style={{ marginBottom: 8 }}>
                            <Col span={10}><Text type="secondary">Dự án:</Text></Col>
                            <Col span={14}><Text strong>{selectedMilestone.projectName.slice(0, 40)}</Text></Col>
                        </Row>
                        <Row style={{ marginBottom: 8 }}>
                            <Col span={10}><Text type="secondary">Đợt:</Text></Col>
                            <Col span={14}><Text strong>Đợt {selectedMilestone.round} ({selectedMilestone.percentage}%)</Text></Col>
                        </Row>
                        <Row>
                            <Col span={10}><Text type="secondary">Số tiền:</Text></Col>
                            <Col span={14}>
                                <Text strong style={{ fontSize: 20, color: '#52c41a' }}>
                                    {selectedMilestone.amount.toLocaleString('vi-VN')} VNĐ
                                </Text>
                            </Col>
                        </Row>
                        <Divider />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Sau khi xác nhận, trạng thái sẽ đổi sang "Đã thu" và ghi nhận vào báo cáo tài chính.
                        </Text>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PaymentDashboard;
