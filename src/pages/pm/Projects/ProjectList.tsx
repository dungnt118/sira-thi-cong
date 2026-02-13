import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Row, Col, Progress, Statistic, Tooltip } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    ExportOutlined,
    ProjectOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

/* ====== MOCK DATA ====== */
const mockProjects = [
    {
        key: '1', code: 'DU-2026-001', name: 'Chống thấm Chung cư Sunrise',
        type: 'Outsource', customer: 'Công ty ABC', address: '123 Nguyễn Hữu Thọ, Q7',
        status: 'Đang thi công', progress: 72, pm: 'Nguyễn Văn A',
        supervisor: 'Trần Thị B', outsourceCompany: 'NTC Construction',
        startDate: '2026-01-15', endDate: '2026-03-15', budget: 120000000, qualityScore: 82,
    },
    {
        key: '2', code: 'DU-2026-002', name: 'Sửa chữa Nhà riêng Q7',
        type: 'Nội bộ', customer: 'Anh Trần Văn B', address: '45 Lê Văn Lương, Q7',
        status: 'Chờ nghiệm thu', progress: 95, pm: 'Nguyễn Văn A',
        supervisor: 'Lê Văn C', outsourceCompany: '',
        startDate: '2026-01-01', endDate: '2026-02-20', budget: 45000000, qualityScore: 90,
    },
    {
        key: '3', code: 'DU-2026-003', name: 'Chống thấm Văn phòng DEF',
        type: 'Outsource', customer: 'Công ty DEF', address: '789 Phạm Văn Đồng, Thủ Đức',
        status: 'Chậm tiến độ', progress: 45, pm: 'Nguyễn Văn A',
        supervisor: 'Trần Thị D', outsourceCompany: 'Hoàng Long JSC',
        startDate: '2025-12-01', endDate: '2026-02-01', budget: 250000000, qualityScore: 65,
    },
    {
        key: '4', code: 'DU-2026-004', name: 'Sửa chữa Biệt thự Thảo Điền',
        type: 'Nội bộ', customer: 'Chị Lê Thị C', address: '12 Xuân Thuỷ, Q2',
        status: 'Bản nháp', progress: 0, pm: 'Nguyễn Văn A',
        supervisor: '', outsourceCompany: '',
        startDate: '', endDate: '', budget: 80000000, qualityScore: 0,
    },
    {
        key: '5', code: 'DU-2026-005', name: 'Chống thấm Nhà xưởng GHI',
        type: 'Outsource', customer: 'Công ty GHI', address: '456 Quốc Lộ 1A, Bình Tân',
        status: 'Đang thi công', progress: 30, pm: 'Nguyễn Văn A',
        supervisor: 'Nguyễn Văn E', outsourceCompany: 'Đại Phát JSC',
        startDate: '2026-02-01', endDate: '2026-04-15', budget: 350000000, qualityScore: 78,
    },
    {
        key: '6', code: 'DU-2026-006', name: 'Chống nứt Tường nhà phố',
        type: 'Nội bộ', customer: 'Ông Phạm Văn D', address: '78 Hai Bà Trưng, Q1',
        status: 'Hoàn thành', progress: 100, pm: 'Nguyễn Văn A',
        supervisor: 'Trần Thị B', outsourceCompany: '',
        startDate: '2025-11-01', endDate: '2026-01-20', budget: 60000000, qualityScore: 92,
    },
    {
        key: '7', code: 'DU-2026-007', name: 'Xử lý thấm dột Mái nhà',
        type: 'Outsource', customer: 'Bà Vũ Thị E', address: '101 Cách Mạng Tháng 8, Q3',
        status: 'Đã lên lịch', progress: 0, pm: 'Nguyễn Văn A',
        supervisor: 'Lê Văn F', outsourceCompany: 'NTC Construction',
        startDate: '2026-03-01', endDate: '2026-04-30', budget: 95000000, qualityScore: 0,
    },
    {
        key: '8', code: 'DU-2026-008', name: 'Chống thấm Tầng hầm Chung cư',
        type: 'Outsource', customer: 'Công ty JKL', address: '200 Nguyễn Xí, Bình Thạnh',
        status: 'Đang thi công', progress: 55, pm: 'Nguyễn Văn A',
        supervisor: 'Nguyễn Văn G', outsourceCompany: 'Hoàng Long JSC',
        startDate: '2026-01-20', endDate: '2026-05-20', budget: 520000000, qualityScore: 80,
    },
];

/* ====== COMPONENT ====== */
const ProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    const statusColor: Record<string, string> = {
        'Đang thi công': 'processing',
        'Chờ nghiệm thu': 'warning',
        'Chậm tiến độ': 'error',
        'Bản nháp': 'default',
        'Hoàn thành': 'success',
        'Đã lên lịch': 'cyan',
        'Đã đóng': 'default',
    };

    const filteredData = mockProjects.filter((p) => {
        const matchSearch = !searchText || p.name.toLowerCase().includes(searchText.toLowerCase()) || p.code.toLowerCase().includes(searchText.toLowerCase());
        const matchType = !typeFilter || p.type === typeFilter;
        const matchStatus = !statusFilter || p.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    });

    const columns: ColumnsType<any> = [
        {
            title: 'Mã DA', dataIndex: 'code', key: 'code', width: 130, fixed: 'left' as const,
            render: (code: string) => <a onClick={() => navigate(`/pm/projects/${code}`)} style={{ fontWeight: 600 }}>{code}</a>,
        },
        { title: 'Tên dự án', dataIndex: 'name', key: 'name', width: 250, ellipsis: true },
        {
            title: 'Loại', dataIndex: 'type', key: 'type', width: 110,
            render: (t: string) => <Tag color={t === 'Nội bộ' ? 'blue' : 'orange'}>{t}</Tag>,
        },
        { title: 'Khách hàng', dataIndex: 'customer', key: 'customer', width: 160, ellipsis: true },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 140,
            render: (s: string) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>,
        },
        {
            title: 'Tiến độ', dataIndex: 'progress', key: 'progress', width: 130,
            render: (p: number) => <Progress percent={p} size="small" status={p >= 95 ? 'success' : p < 50 && p > 0 ? 'exception' : undefined} />,
        },
        {
            title: 'Chất lượng', dataIndex: 'qualityScore', key: 'qualityScore', width: 100,
            render: (score: number) => score > 0 ? (
                <Tooltip title={`${score}/100 điểm`}>
                    <Tag color={score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'}>{score} đ</Tag>
                </Tooltip>
            ) : <span style={{ color: '#ccc' }}>-</span>,
        },
        {
            title: 'Ngân sách', dataIndex: 'budget', key: 'budget', width: 120, align: 'right' as const,
            render: (v: number) => `${(v / 1000000).toFixed(0)} tr`,
        },
        {
            title: '', key: 'actions', width: 80, fixed: 'right' as const,
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => navigate(`/pm/projects/${record.code}`)} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} size="small" />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>Danh Sách Dự Án</h2>
                <Space>
                    <Button icon={<ExportOutlined />}>Xuất Excel</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/pm/projects/create')}>
                        Tạo Dự án
                    </Button>
                </Space>
            </Row>

            {/* Summary Cards */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                {[
                    { title: 'Tổng', value: mockProjects.length, icon: <ProjectOutlined />, color: '#1890ff' },
                    { title: 'Đang thi công', value: mockProjects.filter(p => p.status === 'Đang thi công').length, icon: <ClockCircleOutlined />, color: '#fa8c16' },
                    { title: 'Chậm tiến độ', value: mockProjects.filter(p => p.status === 'Chậm tiến độ').length, icon: <ExclamationCircleOutlined />, color: '#ff4d4f' },
                    { title: 'Hoàn thành', value: mockProjects.filter(p => p.status === 'Hoàn thành').length, icon: <CheckCircleOutlined />, color: '#52c41a' },
                ].map((item, idx) => (
                    <Col span={6} key={idx}>
                        <Card size="small">
                            <Statistic title={item.title} value={item.value} prefix={item.icon} valueStyle={{ color: item.color, fontSize: 20 }} />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Filters */}
            <Card bodyStyle={{ padding: '12px 16px' }} style={{ marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        placeholder="Tìm kiếm dự án..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 240 }}
                        allowClear
                    />
                    <Select
                        placeholder="Loại dự án"
                        value={typeFilter}
                        onChange={setTypeFilter}
                        allowClear
                        style={{ width: 160 }}
                        options={[
                            { value: 'Nội bộ', label: 'Nội bộ' },
                            { value: 'Outsource', label: 'Outsource' },
                        ]}
                    />
                    <Select
                        placeholder="Trạng thái"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        allowClear
                        style={{ width: 160 }}
                        options={[
                            { value: 'Bản nháp', label: 'Bản nháp' },
                            { value: 'Đã lên lịch', label: 'Đã lên lịch' },
                            { value: 'Đang thi công', label: 'Đang thi công' },
                            { value: 'Chờ nghiệm thu', label: 'Chờ nghiệm thu' },
                            { value: 'Chậm tiến độ', label: 'Chậm tiến độ' },
                            { value: 'Hoàn thành', label: 'Hoàn thành' },
                        ]}
                    />
                </Space>
            </Card>

            {/* Table */}
            <Card bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} dự án` }}
                    scroll={{ x: 1200 }}
                    size="middle"
                />
            </Card>
        </div>
    );
};

export default ProjectList;
