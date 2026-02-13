import React, { useState } from 'react';
import { Card, Table, Tag, Button, Row, Col, Statistic, Space, Select, Tabs, Tooltip, Badge } from 'antd';
import {
    ClockCircleOutlined, ExclamationCircleOutlined,
    ExportOutlined, ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

/* ====== MOCK DATA ====== */
const milestoneData = [
    { key: '1', project: 'DU-2026-001', projectName: 'Chống thấm Chung cư Sunrise', milestone: 'Tạm ứng 2', percentage: 30, amount: 36000000, dueDate: '2026-02-20', status: 'Chờ thanh toán', customer: 'Công ty ABC' },
    { key: '2', project: 'DU-2026-002', projectName: 'Sửa chữa Nhà riêng Q7', milestone: 'Nghiệm thu', percentage: 40, amount: 18000000, dueDate: '2026-02-25', status: 'Chờ nghiệm thu', customer: 'Anh Trần Văn B' },
    { key: '3', project: 'DU-2026-003', projectName: 'Chống thấm VP DEF', milestone: 'Tạm ứng 1', percentage: 30, amount: 75000000, dueDate: '2026-01-28', status: 'Quá hạn', customer: 'Công ty DEF' },
    { key: '4', project: 'DU-2026-005', projectName: 'Chống thấm NX GHI', milestone: 'Đặt cọc', percentage: 10, amount: 35000000, dueDate: '2026-02-15', status: 'Đã thanh toán', customer: 'Công ty GHI', paidDate: '2026-02-08' },
    { key: '5', project: 'DU-2026-008', projectName: 'CT Tầng hầm CC', milestone: 'Tạm ứng 1', percentage: 30, amount: 156000000, dueDate: '2026-03-01', status: 'Chưa đến hạn', customer: 'Công ty JKL' },
    { key: '6', project: 'DU-2026-001', projectName: 'CT CC Sunrise', milestone: 'Nghiệm thu', percentage: 25, amount: 30000000, dueDate: '2026-03-20', status: 'Chưa đến hạn', customer: 'Công ty ABC' },
    { key: '7', project: 'DU-2026-005', projectName: 'CT NX GHI', milestone: 'Tạm ứng 1', percentage: 30, amount: 105000000, dueDate: '2026-03-10', status: 'Chưa đến hạn', customer: 'Công ty GHI' },
];

const transactionData = [
    { key: '1', date: '2026-02-10', project: 'DU-2026-001', description: 'Thanh toán Đặt cọc', type: 'Thu', amount: 12000000, method: 'Chuyển khoản' },
    { key: '2', date: '2026-02-08', project: 'DU-2026-005', description: 'Thanh toán Đặt cọc GHI', type: 'Thu', amount: 35000000, method: 'Chuyển khoản' },
    { key: '3', date: '2026-02-05', project: 'DU-2026-001', description: 'Mua vật tư chống thấm PU', type: 'Chi', amount: 15000000, method: 'Tiền mặt' },
    { key: '4', date: '2026-01-25', project: 'DU-2026-001', description: 'Thanh toán Tạm ứng 1', type: 'Thu', amount: 36000000, method: 'Chuyển khoản' },
    { key: '5', date: '2026-01-20', project: 'DU-2026-003', description: 'Thanh toán nhân công OS', type: 'Chi', amount: 45000000, method: 'Chuyển khoản' },
    { key: '6', date: '2026-01-15', project: 'DU-2026-008', description: 'Thanh toán Đặt cọc JKL', type: 'Thu', amount: 52000000, method: 'Chuyển khoản' },
    { key: '7', date: '2026-01-10', project: 'DU-2026-001', description: 'Thanh toán Đặt cọc ABC', type: 'Thu', amount: 12000000, method: 'Chuyển khoản' },
];

/* ====== COMPONENT ====== */
const Financials: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    const statusColor: Record<string, string> = {
        'Đã thanh toán': 'success', 'Chờ thanh toán': 'warning', 'Quá hạn': 'error',
        'Chưa đến hạn': 'default', 'Chờ nghiệm thu': 'purple',
    };

    const milestoneColumns: ColumnsType<any> = [
        { title: 'Dự án', dataIndex: 'project', key: 'project', width: 120, render: (code: string, rec: any) => <Tooltip title={rec.projectName}><a>{code}</a></Tooltip> },
        { title: 'Khách hàng', dataIndex: 'customer', key: 'customer', width: 140, ellipsis: true },
        { title: 'Mốc', dataIndex: 'milestone', key: 'milestone', width: 110 },
        { title: '%', dataIndex: 'percentage', key: 'percentage', width: 60, render: (v: number) => `${v}%` },
        { title: 'Số tiền', dataIndex: 'amount', key: 'amount', width: 120, align: 'right' as const, render: (v: number) => `${(v / 1000000).toFixed(0)} tr` },
        { title: 'Hạn TT', dataIndex: 'dueDate', key: 'dueDate', width: 110 },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 140, render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag> },
    ];

    const filteredMilestones = milestoneData.filter(m => !statusFilter || m.status === statusFilter);

    const transactionColumns: ColumnsType<any> = [
        { title: 'Ngày', dataIndex: 'date', key: 'date', width: 110 },
        { title: 'Dự án', dataIndex: 'project', key: 'project', width: 120 },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Loại', dataIndex: 'type', key: 'type', width: 80, render: (t: string) => <Tag color={t === 'Thu' ? 'green' : 'red'}>{t}</Tag> },
        { title: 'Số tiền', dataIndex: 'amount', key: 'amount', width: 120, align: 'right' as const, render: (v: number) => `${(v / 1000000).toFixed(0)} tr` },
        { title: 'Phương thức', dataIndex: 'method', key: 'method', width: 130 },
    ];

    const totalRevenue = transactionData.filter(t => t.type === 'Thu').reduce((a, b) => a + b.amount, 0);
    const totalExpense = transactionData.filter(t => t.type === 'Chi').reduce((a, b) => a + b.amount, 0);
    const overdueAmount = milestoneData.filter(m => m.status === 'Quá hạn').reduce((a, b) => a + b.amount, 0);
    const pendingAmount = milestoneData.filter(m => m.status === 'Chờ thanh toán').reduce((a, b) => a + b.amount, 0);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>Tài Chính</h2>
                <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
            </Row>

            {/* Summary */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}><Card size="small"><Statistic title="Tổng Thu" value={totalRevenue / 1000000} suffix="triệu" prefix={<ArrowUpOutlined />} valueStyle={{ color: '#3f8600' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Tổng Chi" value={totalExpense / 1000000} suffix="triệu" prefix={<ArrowDownOutlined />} valueStyle={{ color: '#cf1322' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Chờ thanh toán" value={pendingAmount / 1000000} suffix="triệu" prefix={<ClockCircleOutlined />} valueStyle={{ color: '#fa8c16' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Quá hạn" value={overdueAmount / 1000000} suffix="triệu" prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
            </Row>

            <Card>
                <Tabs defaultActiveKey="milestones" items={[
                    {
                        key: 'milestones',
                        label: <Badge count={milestoneData.filter(m => m.status === 'Quá hạn').length} offset={[10, 0]}>Mốc Thanh toán</Badge>,
                        children: (
                            <div>
                                <Space style={{ marginBottom: 16 }}>
                                    <Select placeholder="Lọc trạng thái" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: 180 }}
                                        options={[
                                            { value: 'Chờ thanh toán', label: 'Chờ thanh toán' },
                                            { value: 'Quá hạn', label: 'Quá hạn' },
                                            { value: 'Đã thanh toán', label: 'Đã thanh toán' },
                                            { value: 'Chưa đến hạn', label: 'Chưa đến hạn' },
                                        ]}
                                    />
                                </Space>
                                <Table columns={milestoneColumns} dataSource={filteredMilestones} pagination={false} size="small" />
                            </div>
                        ),
                    },
                    {
                        key: 'transactions',
                        label: 'Giao dịch',
                        children: (
                            <Table columns={transactionColumns} dataSource={transactionData} pagination={{ pageSize: 10 }} size="small" />
                        ),
                    },
                ]} />
            </Card>
        </div>
    );
};

export default Financials;
