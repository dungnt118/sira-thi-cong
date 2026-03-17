import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, DatePicker, Select, Input, Row, Col } from 'antd';
import {
    FileTextOutlined,
    SearchOutlined,
    DownloadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

type AuditAction =
    | 'User Login'
    | 'User Logout'
    | 'User Created'
    | 'User Deactivated'
    | 'Role Changed'
    | 'Project Created'
    | 'Project Assigned'
    | 'Project Status Changed'
    | 'Evidence Uploaded'
    | 'Evidence Approved'
    | 'Evidence Rejected'
    | 'Material Variance Created'
    | 'Material Variance Approved'
    | 'Quality Issue Created'
    | 'Quality Issue Resolved'
    | 'Payment Milestone Created'
    | 'Payment Confirmed';

interface AuditLogEntry {
    _id: string;
    timestamp: Date;
    user: string;
    userId: string;
    action: AuditAction;
    entity: string; // Project code, Evidence ID, etc.
    details: string;
    ipAddress?: string;
    status: 'success' | 'failed';
}

import { useOutletContext } from 'react-router-dom';

/**
 * Audit Log Page - Construction-specific actions
 * NOT generic schema CRUD, but construction business actions
 */
const AuditLog: React.FC = () => {
    const { isMobile } = useOutletContext<{ isMobile: boolean }>();
    const [searchText, setSearchText] = useState('');
    const [filterAction, setFilterAction] = useState<string>('');
    const [filterUser, _setFilterUser] = useState<string>('');
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

    // Mock data - construction-specific audit logs
    const mockLogs: AuditLogEntry[] = [
        {
            _id: '1',
            timestamp: new Date('2024-02-13T10:30:00'),
            user: 'Nguyễn Văn A',
            userId: 'pm_nguyena',
            action: 'Evidence Approved',
            entity: 'DU-2024-001',
            details: 'Approved evidence for stage BEFORE (5 photos)',
            ipAddress: '192.168.1.100',
            status: 'success',
        },
        {
            _id: '2',
            timestamp: new Date('2024-02-13T09:15:00'),
            user: 'Trần Thị B',
            userId: 'acc_tranb',
            action: 'Payment Confirmed',
            entity: 'DU-2024-002',
            details: 'Confirmed payment milestone: Advance 40% (20,000,000 VNĐ)',
            ipAddress: '192.168.1.101',
            status: 'success',
        },
        {
            _id: '3',
            timestamp: new Date('2024-02-13T08:45:00'),
            user: 'Lê Văn C',
            userId: 'staff_lec',
            action: 'Evidence Uploaded',
            entity: 'DU-2024-003',
            details: 'Uploaded 3 photos for stage DURING',
            ipAddress: '192.168.1.102',
            status: 'success',
        },
        {
            _id: '4',
            timestamp: new Date('2024-02-13T08:20:00'),
            user: 'Phạm Thị D',
            userId: 'sv_phamd',
            action: 'Quality Issue Created',
            entity: 'DU-2024-001',
            details: 'Created quality issue: Water seepage detected in corner',
            ipAddress: '192.168.1.103',
            status: 'success',
        },
        {
            _id: '5',
            timestamp: new Date('2024-02-13T07:55:00'),
            user: 'Hoàng Văn E',
            userId: 'pm_hoange',
            action: 'Project Created',
            entity: 'DU-2024-004',
            details: 'Created new project: Chống thấm tòa nhà ABC, Type: Internal',
            ipAddress: '192.168.1.104',
            status: 'success',
        },
        {
            _id: '6',
            timestamp: new Date('2024-02-13T07:30:00'),
            user: 'Admin',
            userId: 'admin',
            action: 'User Created',
            entity: 'staff_newuser',
            details: 'Created new user: Vũ Thị F, Role: Staff',
            ipAddress: '192.168.1.105',
            status: 'success',
        },
        {
            _id: '7',
            timestamp: new Date('2024-02-12T16:45:00'),
            user: 'Nguyễn Văn A',
            userId: 'pm_nguyena',
            action: 'Evidence Rejected',
            entity: 'DU-2024-001',
            details: 'Rejected evidence: Poor photo quality, requested re-upload',
            ipAddress: '192.168.1.100',
            status: 'success',
        },
        {
            _id: '8',
            timestamp: new Date('2024-02-12T15:20:00'),
            user: 'Trần Thị B',
            userId: 'acc_tranb',
            action: 'Payment Milestone Created',
            entity: 'DU-2024-005',
            details: 'Created payment milestone: Deposit 30% (15,000,000 VNĐ)',
            ipAddress: '192.168.1.101',
            status: 'success',
        },
    ];

    const [logs] = useState<AuditLogEntry[]>(mockLogs);

    // Action categories for filtering
    const actionCategories = [
        { label: 'Người dùng', value: 'user', actions: ['User Login', 'User Logout', 'User Created', 'User Deactivated', 'Role Changed'] },
        { label: 'Dự án', value: 'project', actions: ['Project Created', 'Project Assigned', 'Project Status Changed'] },
        { label: 'Minh chứng', value: 'evidence', actions: ['Evidence Uploaded', 'Evidence Approved', 'Evidence Rejected'] },
        { label: 'Vật tư', value: 'material', actions: ['Material Variance Created', 'Material Variance Approved'] },
        { label: 'Chất lượng', value: 'quality', actions: ['Quality Issue Created', 'Quality Issue Resolved'] },
        { label: 'Thanh toán', value: 'payment', actions: ['Payment Milestone Created', 'Payment Confirmed'] },
    ];

    // Filtered logs
    const filteredLogs = logs.filter((log) => {
        const matchSearch =
            !searchText ||
            log.user.toLowerCase().includes(searchText.toLowerCase()) ||
            log.entity.toLowerCase().includes(searchText.toLowerCase()) ||
            log.details.toLowerCase().includes(searchText.toLowerCase());

        const matchAction = !filterAction || log.action === filterAction;
        const matchUser = !filterUser || log.userId === filterUser;

        const matchDate =
            !dateRange ||
            (dayjs(log.timestamp).isAfter(dateRange[0]) && dayjs(log.timestamp).isBefore(dateRange[1].add(1, 'day')));

        return matchSearch && matchAction && matchUser && matchDate;
    });

    // Table columns
    const columns: ColumnsType<AuditLogEntry> = [
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 160,
            sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
            render: (date: Date) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
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
            width: 200,
            render: (action: AuditAction) => {
                const colors: Record<string, string> = {
                    'Evidence Approved': 'success',
                    'Evidence Rejected': 'error',
                    'Payment Confirmed': 'success',
                    'Quality Issue Created': 'warning',
                    'Project Created': 'processing',
                    'User Created': 'blue',
                };
                return <Tag color={colors[action] || 'default'}>{action}</Tag>;
            },
        },
        {
            title: 'Đối tượng',
            dataIndex: 'entity',
            key: 'entity',
            width: 150,
        },
        {
            title: 'Chi tiết',
            dataIndex: 'details',
            key: 'details',
            ellipsis: true,
        },
        {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            width: 130,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) =>
                status === 'success' ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                        Thành công
                    </Tag>
                ) : (
                    <Tag color="error" icon={<CloseCircleOutlined />}>
                        Thất bại
                    </Tag>
                ),
        },
    ];

    const handleExport = () => {
        console.log('Exporting audit logs to CSV...');
        // TODO: Implement CSV export
    };

    return (
        <div style={{ padding: 0 }}>
            <Card title="Nhật ký hệ thống" extra={<FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />}>
                {/* Filters */}
                <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]} style={{ marginBottom: isMobile ? 16 : 24 }}>
                    <Col xs={24} sm={8}>
                        <Search
                            placeholder="Tìm theo người dùng, đối tượng, chi tiết..."
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <RangePicker
                            style={{ width: '100%' }}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            format="DD/MM/YYYY"
                            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                        />
                    </Col>
                    <Col xs={12} sm={4}>
                        <Select placeholder="Hành động" allowClear style={{ width: '100%' }} onChange={setFilterAction}>
                            {actionCategories.map((cat) => (
                                <Select.OptGroup key={cat.value} label={cat.label}>
                                    {cat.actions.map((action) => (
                                        <Option key={action} value={action}>
                                            {action}
                                        </Option>
                                    ))}
                                </Select.OptGroup>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} block>
                            Xuất
                        </Button>
                    </Col>
                </Row>

                {/* Info */}
                <div style={{ marginBottom: 16, padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
                    <Space>
                        <ClockCircleOutlined />
                        <span>
                            Hiển thị <strong>{filteredLogs.length}</strong> bản ghi
                            {dateRange && ` từ ${dateRange[0].format('DD/MM/YYYY')} đến ${dateRange[1].format('DD/MM/YYYY')}`}
                        </span>
                    </Space>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredLogs}
                    rowKey="_id"
                    scroll={{ x: 1200 }}
                    pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `Tổng ${total} bản ghi` }}
                />
            </Card>
        </div>
    );
};

export default AuditLog;
