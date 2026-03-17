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
import { getProjectProgress, mockProjects as defaultProjects } from '../../../data/mockData';
import { ProjectStatus } from '../../../types/v3';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';


/* ====== COMPONENT ====== */
const ProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    const [mockProjects] = useLocalStorageData<any[]>(demoDataService.KEYS.PROJECTS, defaultProjects);

    const statusMap: Record<ProjectStatus, { label: string; color: string }> = {
        'SCHEDULED': { label: 'Đã lên lịch', color: 'cyan' },
        'WAITING_MATERIALS': { label: 'Chờ vật tư', color: 'orange' },
        'IN_PROGRESS': { label: 'Đang thi công', color: 'processing' },
        'AWAITING_APPROVAL': { label: 'Chờ nghiệm thu', color: 'warning' },
        'COMPLETED': { label: 'Hoàn thành', color: 'success' },
        'CANCELLED': { label: 'Đã hủy', color: 'default' },
    };

    const filteredData = mockProjects.filter((p) => {
        const matchSearch = !searchText || p.name.toLowerCase().includes(searchText.toLowerCase()) || p.code.toLowerCase().includes(searchText.toLowerCase());
        const matchType = !typeFilter || p.type === typeFilter;
        const matchStatus = !statusFilter || p.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    }).map(p => ({
        ...p,
        key: p.id,
        progress: getProjectProgress(p) || 0,
    }));

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
        { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', width: 160, ellipsis: true },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 140,
            render: (s: ProjectStatus) => (
                <Tag color={statusMap[s]?.color || 'default'}>
                    {statusMap[s]?.label || s}
                </Tag>
            ),
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
            render: (v: number) => v ? `${(v / 1000000).toFixed(0)} tr` : '-',
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
                    { title: 'Đang thi công', value: mockProjects.filter(p => p.status === 'IN_PROGRESS').length, icon: <ClockCircleOutlined />, color: '#fa8c16' },
                    { title: 'Sắp tới', value: mockProjects.filter(p => p.status === 'SCHEDULED' || p.status === 'WAITING_MATERIALS').length, icon: <ExclamationCircleOutlined />, color: '#722ed1' },
                    { title: 'Hoàn thành', value: mockProjects.filter(p => p.status === 'COMPLETED').length, icon: <CheckCircleOutlined />, color: '#52c41a' },
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
                        options={Object.entries(statusMap).map(([value, info]) => ({
                            value,
                            label: info.label
                        }))}
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
