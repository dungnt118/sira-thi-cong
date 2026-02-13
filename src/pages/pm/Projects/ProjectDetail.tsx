import React from 'react';
import {
    Card, Row, Col, Descriptions, Tag, Tabs, Table, Progress, Statistic, Button, Space, Timeline, Badge,
} from 'antd';
import {
    ArrowLeftOutlined, EditOutlined, TeamOutlined,
    EnvironmentOutlined, PhoneOutlined, UserOutlined,
    EyeOutlined, CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

/* ====== MOCK DATA ====== */
const projectDetail = {
    code: 'DU-2026-001', name: 'Chống thấm Chung cư Sunrise',
    type: 'Outsource', status: 'Đang thi công', progress: 72, qualityScore: 82,
    customer: { name: 'Công ty ABC', contact: 'Nguyễn Thanh Hùng', phone: '0901-234-567', email: 'hungnguyen@abc.com' },
    address: '123 Nguyễn Hữu Thọ, Quận 7, HCM',
    startDate: '2026-01-15', endDate: '2026-03-15',
    budget: 120000000, spent: 78000000,
    pm: 'Nguyễn Văn A', supervisor: 'Trần Thị B',
    outsourceCompany: 'NTC Construction', outsourceLeader: 'Lê Văn Leader',
    description: 'Dự án chống thấm toàn bộ khu vực tầng hầm và mái nhà Chung cư Sunrise City. Bao gồm xử lý vết nứt, thi công chống thấm polyurethane, và kiểm tra áp lực nước.',
};

const milestones = [
    { key: '1', name: 'Đặt cọc', type: 'deposit', percentage: 10, amount: 12000000, status: 'Đã thanh toán', paidDate: '2026-01-10' },
    { key: '2', name: 'Tạm ứng 1', type: 'advance', percentage: 30, amount: 36000000, status: 'Đã thanh toán', paidDate: '2026-01-25' },
    { key: '3', name: 'Tạm ứng 2', type: 'advance', percentage: 30, amount: 36000000, status: 'Chờ thanh toán', paidDate: '' },
    { key: '4', name: 'Nghiệm thu', type: 'acceptance', percentage: 25, amount: 30000000, status: 'Chưa đến hạn', paidDate: '' },
    { key: '5', name: 'Thanh lý', type: 'final', percentage: 5, amount: 6000000, status: 'Chưa đến hạn', paidDate: '' },
];

const evidenceItems = [
    { key: '1', stage: 'Trước thi công', count: 12, approved: 10, rejected: 1, pending: 1 },
    { key: '2', stage: 'Trong thi công', count: 25, approved: 18, rejected: 2, pending: 5 },
    { key: '3', stage: 'Sau thi công', count: 0, approved: 0, rejected: 0, pending: 0 },
];

const qualityIssues = [
    { key: '1', title: 'Vết nứt bề mặt khu vực A3', severity: 'Trung bình', status: 'Đang xử lý', reportedBy: 'Trần Thị B', date: '2026-02-08' },
    { key: '2', title: 'Bóng khí dưới lớp chống thấm', severity: 'Nhẹ', status: 'Đã đóng', reportedBy: 'Trần Thị B', date: '2026-02-01' },
];

const activityLog = [
    { time: '2026-02-13 08:30', action: 'Giám sát Trần Thị B tải lên 5 tư liệu mới', type: 'evidence' },
    { time: '2026-02-12 16:00', action: 'Outsource Leader cập nhật tiến độ: 72%', type: 'progress' },
    { time: '2026-02-10 10:00', action: 'Phê duyệt thanh toán Tạm ứng 1: 36 triệu', type: 'payment' },
    { time: '2026-02-08 14:00', action: 'Báo cáo vấn đề chất lượng: Vết nứt bề mặt A3', type: 'quality' },
    { time: '2026-02-05 09:00', action: 'Phân công Giám sát viên Trần Thị B', type: 'team' },
];

/* ====== COMPONENT ====== */
const ProjectDetail: React.FC = () => {
    const navigate = useNavigate();
    const { projectId: _projectId } = useParams();

    const statusColor: Record<string, string> = {
        'Đã thanh toán': 'success', 'Chờ thanh toán': 'warning', 'Chưa đến hạn': 'default', 'Quá hạn': 'error',
    };

    const sevColor: Record<string, string> = { 'Nặng': 'red', 'Trung bình': 'orange', 'Nhẹ': 'green' };

    return (
        <div>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pm/projects/all')}>Quay lại</Button>
                    <h2 style={{ margin: 0 }}>{projectDetail.code} - {projectDetail.name}</h2>
                    <Tag color="processing">{projectDetail.status}</Tag>
                    <Tag color={projectDetail.type === 'Nội bộ' ? 'blue' : 'orange'}>{projectDetail.type}</Tag>
                </Space>
                <Button type="primary" icon={<EditOutlined />}>Chỉnh sửa</Button>
            </Row>

            {/* KPI Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card size="small"><Statistic title="Tiến độ" value={projectDetail.progress} suffix="%" valueStyle={{ color: '#1890ff' }} /></Card>
                </Col>
                <Col span={6}>
                    <Card size="small"><Statistic title="Chất lượng" value={projectDetail.qualityScore} suffix="/ 100" valueStyle={{ color: projectDetail.qualityScore >= 80 ? '#52c41a' : '#fa8c16' }} /></Card>
                </Col>
                <Col span={6}>
                    <Card size="small"><Statistic title="Đã chi" value={projectDetail.spent / 1000000} suffix="triệu" valueStyle={{ color: '#722ed1' }} /></Card>
                </Col>
                <Col span={6}>
                    <Card size="small"><Statistic title="Ngân sách" value={projectDetail.budget / 1000000} suffix="triệu" valueStyle={{ color: '#3f8600' }} /></Card>
                </Col>
            </Row>

            {/* Detail Tabs */}
            <Card>
                <Tabs defaultActiveKey="info" items={[
                    {
                        key: 'info',
                        label: 'Thông tin Chung',
                        children: (
                            <Row gutter={24}>
                                <Col span={14}>
                                    <Descriptions bordered column={2} size="small">
                                        <Descriptions.Item label="Mã dự án" span={1}>{projectDetail.code}</Descriptions.Item>
                                        <Descriptions.Item label="Loại" span={1}><Tag color={projectDetail.type === 'Nội bộ' ? 'blue' : 'orange'}>{projectDetail.type}</Tag></Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ" span={2}><EnvironmentOutlined /> {projectDetail.address}</Descriptions.Item>
                                        <Descriptions.Item label="Ngày bắt đầu" span={1}><CalendarOutlined /> {projectDetail.startDate}</Descriptions.Item>
                                        <Descriptions.Item label="Ngày kết thúc" span={1}><CalendarOutlined /> {projectDetail.endDate}</Descriptions.Item>
                                        <Descriptions.Item label="Giám sát viên" span={1}><UserOutlined /> {projectDetail.supervisor}</Descriptions.Item>
                                        <Descriptions.Item label="Quản lý Dự án" span={1}><UserOutlined /> {projectDetail.pm}</Descriptions.Item>
                                        {projectDetail.type === 'Outsource' && (
                                            <>
                                                <Descriptions.Item label="Công ty Outsource" span={1}><TeamOutlined /> {projectDetail.outsourceCompany}</Descriptions.Item>
                                                <Descriptions.Item label="Trưởng nhóm" span={1}><UserOutlined /> {projectDetail.outsourceLeader}</Descriptions.Item>
                                            </>
                                        )}
                                        <Descriptions.Item label="Mô tả" span={2}>{projectDetail.description}</Descriptions.Item>
                                    </Descriptions>
                                </Col>
                                <Col span={10}>
                                    <Card title="Thông tin Khách hàng" size="small">
                                        <Descriptions column={1} size="small">
                                            <Descriptions.Item label="Tên">{projectDetail.customer.name}</Descriptions.Item>
                                            <Descriptions.Item label="Liên hệ">{projectDetail.customer.contact}</Descriptions.Item>
                                            <Descriptions.Item label="SĐT"><PhoneOutlined /> {projectDetail.customer.phone}</Descriptions.Item>
                                            <Descriptions.Item label="Email">{projectDetail.customer.email}</Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                    <Card title="Tiến độ Tổng quan" size="small" style={{ marginTop: 16 }}>
                                        <Progress percent={projectDetail.progress} strokeColor="#1890ff" />
                                        <Progress percent={(projectDetail.spent / projectDetail.budget) * 100} strokeColor="#722ed1" format={() => `Chi phí: ${Math.round((projectDetail.spent / projectDetail.budget) * 100)}%`} style={{ marginTop: 8 }} />
                                    </Card>
                                </Col>
                            </Row>
                        )
                    },
                    {
                        key: 'milestones',
                        label: <Badge count={milestones.filter(m => m.status === 'Chờ thanh toán').length} offset={[10, 0]}>Mốc Thanh toán</Badge>,
                        children: (
                            <div>
                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    <Col span={6}><Statistic title="Tổng ngân sách" value={120} suffix="triệu" valueStyle={{ fontSize: 18 }} /></Col>
                                    <Col span={6}><Statistic title="Đã thanh toán" value={48} suffix="triệu" valueStyle={{ fontSize: 18, color: '#52c41a' }} /></Col>
                                    <Col span={6}><Statistic title="Chờ xử lý" value={36} suffix="triệu" valueStyle={{ fontSize: 18, color: '#fa8c16' }} /></Col>
                                    <Col span={6}><Statistic title="Còn lại" value={36} suffix="triệu" valueStyle={{ fontSize: 18 }} /></Col>
                                </Row>
                                <Table
                                    dataSource={milestones}
                                    pagination={false}
                                    size="small"
                                    columns={[
                                        { title: 'Mốc', dataIndex: 'name', key: 'name' },
                                        { title: '%', dataIndex: 'percentage', key: 'percentage', render: (v: number) => `${v}%`, width: 60 },
                                        { title: 'Số tiền', dataIndex: 'amount', key: 'amount', render: (v: number) => `${(v / 1000000).toFixed(0)} triệu`, width: 100 },
                                        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>, width: 140 },
                                        { title: 'Ngày TT', dataIndex: 'paidDate', key: 'paidDate', render: (d: string) => d || '-', width: 120 },
                                    ]}
                                />
                            </div>
                        )
                    },
                    {
                        key: 'evidence',
                        label: <Badge count={evidenceItems.reduce((a, b) => a + b.pending, 0)} offset={[10, 0]}>Tư liệu</Badge>,
                        children: (
                            <div>
                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    {evidenceItems.map((e) => (
                                        <Col span={8} key={e.key}>
                                            <Card title={e.stage} size="small">
                                                <Statistic title="Tổng" value={e.count} />
                                                <Space style={{ marginTop: 8 }}>
                                                    <Tag color="green">{e.approved} đã duyệt</Tag>
                                                    <Tag color="red">{e.rejected} từ chối</Tag>
                                                    <Tag color="orange">{e.pending} chờ duyệt</Tag>
                                                </Space>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                <Button type="primary" icon={<EyeOutlined />}>Xem Thư viện Tư liệu</Button>
                            </div>
                        )
                    },
                    {
                        key: 'quality',
                        label: <Badge count={qualityIssues.filter(q => q.status !== 'Đã đóng').length} offset={[10, 0]}>Chất lượng</Badge>,
                        children: (
                            <Table
                                dataSource={qualityIssues}
                                pagination={false}
                                size="small"
                                columns={[
                                    { title: 'Vấn đề', dataIndex: 'title', key: 'title' },
                                    { title: 'Mức độ', dataIndex: 'severity', key: 'severity', render: (s: string) => <Tag color={sevColor[s]}>{s}</Tag>, width: 110 },
                                    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Đã đóng' ? 'default' : 'processing'}>{s}</Tag>, width: 120 },
                                    { title: 'Báo cáo bởi', dataIndex: 'reportedBy', key: 'reportedBy', width: 130 },
                                    { title: 'Ngày', dataIndex: 'date', key: 'date', width: 110 },
                                ]}
                            />
                        )
                    },
                    {
                        key: 'activity',
                        label: 'Lịch sử',
                        children: (
                            <Timeline
                                items={activityLog.map((a) => ({
                                    color:
                                        a.type === 'evidence' ? 'blue' :
                                            a.type === 'payment' ? 'green' :
                                                a.type === 'quality' ? 'red' :
                                                    a.type === 'team' ? 'purple' : 'gray',
                                    children: (
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{a.action}</div>
                                            <div style={{ fontSize: 12, color: '#999' }}>{a.time}</div>
                                        </div>
                                    ),
                                }))}
                            />
                        )
                    },
                ]} />
            </Card>
        </div>
    );
};

export default ProjectDetail;
