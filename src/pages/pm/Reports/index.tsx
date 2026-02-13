import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Tabs, Progress } from 'antd';
import {
    ProjectOutlined, DollarOutlined,
    FileExcelOutlined, FilePdfOutlined, PrinterOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

/* ====== MOCK DATA ====== */
const projectSummary = [
    { key: '1', code: 'DU-2026-001', name: 'CT CC Sunrise', type: 'Outsource', status: 'Đang thi công', progress: 72, budget: 120, spent: 78, qualityScore: 82 },
    { key: '2', code: 'DU-2026-002', name: 'SC Nhà riêng Q7', type: 'Nội bộ', status: 'Chờ nghiệm thu', progress: 95, budget: 45, spent: 42, qualityScore: 90 },
    { key: '3', code: 'DU-2026-003', name: 'CT VP DEF', type: 'Outsource', status: 'Chậm tiến độ', progress: 45, budget: 250, spent: 180, qualityScore: 65 },
    { key: '4', code: 'DU-2026-005', name: 'CT NX GHI', type: 'Outsource', status: 'Đang thi công', progress: 30, budget: 350, spent: 95, qualityScore: 78 },
    { key: '5', code: 'DU-2026-006', name: 'CT Tường nhà phố', type: 'Nội bộ', status: 'Hoàn thành', progress: 100, budget: 60, spent: 58, qualityScore: 92 },
    { key: '6', code: 'DU-2026-008', name: 'CT Tầng hầm CC', type: 'Outsource', status: 'Đang thi công', progress: 55, budget: 520, spent: 210, qualityScore: 80 },
];

const financialSummary = [
    { key: '1', project: 'DU-2026-001', revenue: 48, expense: 78, profit: -30, collected: 40, outstanding: 80 },
    { key: '2', project: 'DU-2026-002', revenue: 27, expense: 42, profit: -15, collected: 100, outstanding: 0 },
    { key: '3', project: 'DU-2026-003', revenue: 75, expense: 180, profit: -105, collected: 30, outstanding: 62.5 },
    { key: '4', project: 'DU-2026-005', revenue: 35, expense: 95, profit: -60, collected: 10, outstanding: 57.1 },
    { key: '5', project: 'DU-2026-006', revenue: 60, expense: 58, profit: 2, collected: 100, outstanding: 0 },
    { key: '6', project: 'DU-2026-008', revenue: 52, expense: 210, profit: -158, collected: 10, outstanding: 90 },
];

/* ====== COMPONENT ====== */
const PMReports: React.FC = () => {


    const statusColor: Record<string, string> = {
        'Đang thi công': 'processing', 'Chờ nghiệm thu': 'warning', 'Chậm tiến độ': 'error',
        'Hoàn thành': 'success', 'Bản nháp': 'default', 'Đã lên lịch': 'cyan',
    };

    const projectColumns: ColumnsType<any> = [
        { title: 'Mã DA', dataIndex: 'code', key: 'code', width: 120 },
        { title: 'Tên dự án', dataIndex: 'name', key: 'name', width: 200 },
        { title: 'Loại', dataIndex: 'type', key: 'type', width: 100, render: (t: string) => <Tag color={t === 'Nội bộ' ? 'blue' : 'orange'}>{t}</Tag> },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 140, render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag> },
        { title: 'Tiến độ', dataIndex: 'progress', key: 'progress', width: 120, render: (p: number) => <Progress percent={p} size="small" /> },
        { title: 'Ngân sách (tr)', dataIndex: 'budget', key: 'budget', width: 100, align: 'right' as const },
        { title: 'Đã chi (tr)', dataIndex: 'spent', key: 'spent', width: 100, align: 'right' as const },
        { title: 'CL', dataIndex: 'qualityScore', key: 'qualityScore', width: 60, render: (s: number) => s > 0 ? <Tag color={s >= 80 ? 'green' : s >= 60 ? 'orange' : 'red'}>{s}</Tag> : '-' },
    ];

    const finColumns: ColumnsType<any> = [
        { title: 'Dự án', dataIndex: 'project', key: 'project', width: 120 },
        { title: 'Doanh thu (tr)', dataIndex: 'revenue', key: 'revenue', width: 120, align: 'right' as const },
        { title: 'Chi phí (tr)', dataIndex: 'expense', key: 'expense', width: 120, align: 'right' as const },
        { title: 'Lãi/Lỗ (tr)', dataIndex: 'profit', key: 'profit', width: 120, align: 'right' as const, render: (v: number) => <span style={{ color: v >= 0 ? '#3f8600' : '#cf1322' }}>{v >= 0 ? '+' : ''}{v}</span> },
        { title: 'Thu được (%)', dataIndex: 'collected', key: 'collected', width: 120, render: (v: number) => <Progress percent={v} size="small" status={v >= 100 ? 'success' : undefined} /> },
        { title: 'Công nợ (%)', dataIndex: 'outstanding', key: 'outstanding', width: 120, render: (v: number) => v > 0 ? <Tag color={v > 50 ? 'red' : 'warning'}>{v}%</Tag> : <Tag color="green">0%</Tag> },
    ];

    const totalBudget = projectSummary.reduce((a, b) => a + b.budget, 0);
    const totalSpent = projectSummary.reduce((a, b) => a + b.spent, 0);
    const avgQuality = Math.round(projectSummary.filter(p => p.qualityScore > 0).reduce((a, b) => a + b.qualityScore, 0) / projectSummary.filter(p => p.qualityScore > 0).length);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>Báo Cáo</h2>
                <Space>
                    <Button icon={<FileExcelOutlined />}>Xuất Excel</Button>
                    <Button icon={<FilePdfOutlined />}>Xuất PDF</Button>
                    <Button icon={<PrinterOutlined />}>In</Button>
                </Space>
            </Row>

            {/* Summary */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}><Card size="small"><Statistic title="Tổng Dự án" value={projectSummary.length} prefix={<ProjectOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Tổng Ngân sách" value={totalBudget} suffix="triệu" prefix={<DollarOutlined />} valueStyle={{ color: '#3f8600' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Đã Chi" value={totalSpent} suffix="triệu" valueStyle={{ color: '#cf1322' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Chất lượng TB" value={avgQuality} suffix="/ 100" valueStyle={{ color: avgQuality >= 80 ? '#52c41a' : '#fa8c16' }} /></Card></Col>
            </Row>

            <Card>
                <Tabs defaultActiveKey="project_summary" items={[
                    {
                        key: 'project_summary',
                        label: 'Tổng quan Dự án',
                        children: (
                            <div>
                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    {[
                                        { label: 'Đang thi công', count: 3, color: '#fa8c16', icon: <ClockCircleOutlined /> },
                                        { label: 'Chờ nghiệm thu', count: 1, color: '#722ed1', icon: <CheckCircleOutlined /> },
                                        { label: 'Chậm tiến độ', count: 1, color: '#ff4d4f', icon: <ExclamationCircleOutlined /> },
                                        { label: 'Hoàn thành', count: 1, color: '#52c41a', icon: <CheckCircleOutlined /> },
                                    ].map((item, idx) => (
                                        <Col span={6} key={idx}>
                                            <div style={{ textAlign: 'center', padding: 12, border: '1px solid #f0f0f0', borderRadius: 8 }}>
                                                <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.count}</div>
                                                <div style={{ fontSize: 12, color: '#666' }}>{item.icon} {item.label}</div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                                <Table columns={projectColumns} dataSource={projectSummary} pagination={false} size="small" />
                            </div>
                        ),
                    },
                    {
                        key: 'financial_summary',
                        label: 'Tài chính Dự án',
                        children: <Table columns={finColumns} dataSource={financialSummary} pagination={false} size="small" />,
                    },
                    {
                        key: 'team_performance',
                        label: 'Hiệu suất Đội nhóm',
                        children: (
                            <Table
                                size="small"
                                pagination={false}
                                columns={[
                                    { title: 'Nhân viên', dataIndex: 'name', key: 'name' },
                                    { title: 'Vai trò', dataIndex: 'role', key: 'role', width: 130 },
                                    { title: 'DA Đang làm', dataIndex: 'active', key: 'active', width: 110, align: 'center' as const },
                                    { title: 'DA Hoàn thành', dataIndex: 'completed', key: 'completed', width: 120, align: 'center' as const },
                                    { title: 'CL Trung bình', dataIndex: 'avgQuality', key: 'avgQuality', width: 110, render: (v: number) => <Tag color={v >= 80 ? 'green' : 'orange'}>{v}</Tag> },
                                    { title: 'Tư liệu duyệt', dataIndex: 'evidenceRate', key: 'evidenceRate', width: 120, render: (v: number) => <Progress percent={v} size="small" /> },
                                ]}
                                dataSource={[
                                    { key: '1', name: 'Trần Thị B', role: 'Giám sát viên', active: 3, completed: 12, avgQuality: 85, evidenceRate: 92 },
                                    { key: '2', name: 'Lê Văn C', role: 'Giám sát viên', active: 2, completed: 8, avgQuality: 78, evidenceRate: 88 },
                                    { key: '3', name: 'Trần Thị D', role: 'Giám sát viên', active: 1, completed: 5, avgQuality: 72, evidenceRate: 85 },
                                    { key: '4', name: 'Nguyễn Văn E', role: 'Giám sát viên', active: 2, completed: 15, avgQuality: 90, evidenceRate: 95 },
                                ]}
                            />
                        ),
                    },
                ]} />
            </Card>
        </div>
    );
};

export default PMReports;
