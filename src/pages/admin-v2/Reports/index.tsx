import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Table,
    Space,
    Statistic,
    Tag,
    Progress,
    Menu,
} from 'antd';
import {
    BarChartOutlined,
    DollarOutlined,
    ProjectOutlined,
    TeamOutlined,
    FileImageOutlined,
    ToolOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    EyeOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

type ReportCategory = 'financial' | 'project' | 'performance' | 'evidence' | 'quality';
type ReportType =
    | 'revenue_overview'
    | 'payment_collection'
    | 'outstanding_payments'
    | 'cash_flow'
    | 'profit_analysis'
    | 'cost_tracking'
    | 'project_summary'
    | 'project_performance'
    | 'delayed_projects'
    | 'project_type_comparison'
    | 'user_performance'
    | 'personal_details'
    | 'team_performance'
    | 'supervisor_efficiency'
    | 'outsource_performance'
    | 'evidence_status'
    | 'evidence_approval_efficiency'
    | 'photo_quality_issues'
    | 'quality_issues'
    | 'material_variance';

/**
 * Báo cáo Quản trị - Admin Reports
 * - 20 báo cáo đầy đủ
 * - Tiếng Việt hoàn toàn
 * - Drilldown thực tế (clickable navigation)
 */
const Reports: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('financial');
    const [selectedReport, setSelectedReport] = useState<ReportType>('revenue_overview');
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(30, 'day'), dayjs()]);

    // Drill-down state
    const [drilldownFilter, setDrilldownFilter] = useState<any>(null);

    // Report categories
    const reportCategories = [
        {
            key: 'financial',
            icon: <DollarOutlined />,
            label: 'Tài chính',
            reports: [
                { key: 'revenue_overview', name: 'Tổng quan Doanh thu' },
                { key: 'payment_collection', name: 'Thu tiền Khách hàng' },
                { key: 'outstanding_payments', name: 'Công nợ Phải thu' },
                { key: 'cash_flow', name: 'Dòng tiền' },
                { key: 'profit_analysis', name: 'Phân tích Lợi nhuận' },
                { key: 'cost_tracking', name: 'Theo dõi Chi phí' },
            ],
        },
        {
            key: 'project',
            icon: <ProjectOutlined />,
            label: 'Dự án',
            reports: [
                { key: 'project_summary', name: 'Tổng quan Dự án' },
                { key: 'project_performance', name: 'Hiệu suất Dự án' },
                { key: 'delayed_projects', name: 'Dự án Chậm tiến độ' },
                { key: 'project_type_comparison', name: 'So sánh Loại hình' },
            ],
        },
        {
            key: 'performance',
            icon: <TeamOutlined />,
            label: 'Hiệu suất',
            reports: [
                { key: 'user_performance', name: 'Hiệu suất Cá nhân' },
                { key: 'personal_details', name: 'Chi tiết Cá nhân' },
                { key: 'team_performance', name: 'Hiệu suất Nhóm' },
                { key: 'supervisor_efficiency', name: 'Hiệu suất Giám sát' },
                { key: 'outsource_performance', name: 'Hiệu suất Outsource' },
            ],
        },
        {
            key: 'evidence',
            icon: <FileImageOutlined />,
            label: 'Tư liệu',
            reports: [
                { key: 'evidence_status', name: 'Trạng thái Tư liệu' },
                { key: 'evidence_approval_efficiency', name: 'Hiệu suất Duyệt TL' },
                { key: 'photo_quality_issues', name: 'Vấn đề Chất lượng' },
            ],
        },
        {
            key: 'quality',
            icon: <ToolOutlined />,
            label: 'Chất lượng',
            reports: [
                { key: 'quality_issues', name: 'Vấn đề Chất lượng' },
                { key: 'material_variance', name: 'Chênh lệch Vật tư' },
            ],
        },
    ];

    // Mock data - Doanh thu
    const mockRevenueData = {
        total: 2850000000,
        growth: 15.3,
        internal: 1650000000,
        outsource: 1200000000,
        byMonth: [
            { month: 'T1/2026', revenue: 450000000, projectCount: 8 },
            { month: 'T2/2026', revenue: 520000000, projectCount: 10 },
            { month: 'T3/2026', revenue: 580000000, projectCount: 12 },
            { month: 'T4/2026', revenue: 650000000, projectCount: 11 },
            { month: 'T5/2026', revenue: 650000000, projectCount: 9 },
        ],
        byProjectType: [
            { type: 'Nội bộ', revenue: 1650000000, count: 28 },
            { type: 'Outsource', revenue: 1200000000, count: 22 },
        ],
    };

    // Mock data - Thu tiền
    const mockPaymentData = {
        collected: 2100000000,
        total: 2850000000,
        rate: 73.7,
        deposit: { collected: 850000000, total: 1000000000, rate: 85 },
        advance: { collected: 900000000, total: 1200000000, rate: 75 },
        acceptance: { collected: 350000000, total: 650000000, rate: 53.8 },
        overdue: 12,
    };

    // Mock data - Công nợ
    const mockOutstandingData = [
        {
            key: '1',
            projectCode: 'DU-2024-003',
            customerName: 'Công ty ABC',
            amount: 25000000,
            daysOverdue: 35,
            milestone: 'Nghiệm thu',
        },
        {
            key: '2',
            projectCode: 'DU-2024-007',
            customerName: 'Anh Nguyễn Văn A',
            amount: 18000000,
            daysOverdue: 12,
            milestone: 'Tạm ứng',
        },
        {
            key: '3',
            projectCode: 'DU-2024-010',
            customerName: 'Chị Trần Thị B',
            amount: 32000000,
            daysOverdue: 8,
            milestone: 'Nghiệm thu',
        },
        {
            key: '4',
            projectCode: 'DU-2024-015',
            customerName: 'Công ty XYZ',
            amount: 15000000,
            daysOverdue: 3,
            milestone: 'Đặt cọc',
        },
    ];

    // Mock data - Dòng tiền
    const mockCashFlowData = {
        cashIn: 2100000000,
        cashOut: 1450000000,
        netCashFlow: 650000000,
        balance: 3200000000,
        transactions: [
            { month: 'T1/2026', cashIn: 380000000, cashOut: 250000000, net: 130000000 },
            { month: 'T2/2026', cashIn: 420000000, cashOut: 280000000, net: 140000000 },
            { month: 'T3/2026', cashIn: 450000000, cashOut: 310000000, net: 140000000 },
            { month: 'T4/2026', cashIn: 480000000, cashOut: 320000000, net: 160000000 },
            { month: 'T5/2026', cashIn: 370000000, cashOut: 290000000, net: 80000000 },
        ],
    };

    // Mock data - Lợi nhuận
    const mockProfitData = [
        {
            key: '1',
            projectCode: 'DU-2024-001',
            revenue: 85000000,
            materialCost: 45000000,
            laborCost: 18000000,
            profit: 22000000,
            margin: 25.9,
        },
        {
            key: '2',
            projectCode: 'DU-2024-005',
            revenue: 120000000,
            materialCost: 65000000,
            laborCost: 28000000,
            profit: 27000000,
            margin: 22.5,
        },
        {
            key: '3',
            projectCode: 'DU-2024-012',
            revenue: 95000000,
            materialCost: 52000000,
            laborCost: 22000000,
            profit: 21000000,
            margin: 22.1,
        },
    ];

    // Mock data - Chi phí
    const mockCostData = {
        total: 1450000000,
        material: 850000000,
        labor: 450000000,
        overhead: 150000000,
        byCategory: [
            { category: 'Vật tư', amount: 850000000, percent: 58.6 },
            { category: 'Nhân công', amount: 450000000, percent: 31.0 },
            { category: 'Chi phí chung', amount: 150000000, percent: 10.3 },
        ],
    };

    // Mock data - Dự án
    const mockProjectData = [
        {
            key: '1',
            code: 'DU-2024-001',
            name: 'Chống thấm Chung cư ABC',
            status: 'Hoàn thành',
            pm: 'Nguyễn Văn A',
            duration: 45,
            plannedDuration: 42,
            evidenceRate: 100,
        },
        {
            key: '2',
            code: 'DU-2024-005',
            name: 'Sửa chữa Nhà riêng XYZ',
            status: 'Đang thi công',
            pm: 'Trần Thị B',
            duration: 28,
            plannedDuration: 30,
            evidenceRate: 85,
        },
        {
            key: '3',
            code: 'DU-2024-012',
            name: 'Chống thấm Văn phòng DEF',
            status: 'Chậm tiến độ',
            pm: 'Lê Văn C',
            duration: 38,
            plannedDuration: 30,
            evidenceRate: 65,
        },
    ];

    // Mock data - Hiệu suất user
    const mockUserPerformanceData = [
        {
            key: '1',
            name: 'Nguyễn Văn A',
            role: 'PM',
            projects: 8,
            evidenceUploaded: 245,
            evidenceApproved: 220,
            avgResponseTime: 4.2,
        },
        {
            key: '2',
            name: 'Trần Thị B',
            role: 'Giám sát',
            projects: 12,
            evidenceUploaded: 380,
            evidenceApproved: 365,
            avgResponseTime: 3.8,
        },
        {
            key: '3',
            name: 'Lê Văn C',
            role: 'Nhân viên',
            projects: 6,
            evidenceUploaded: 156,
            evidenceApproved: 148,
            avgResponseTime: 5.1,
        },
    ];

    // Mock data - Tư liệu (Media/Documents)
    const mockEvidenceData = {
        total: 1245,
        totalPhotos: 980,
        totalVideos: 265,
        totalStorageGB: 245.8,
        photoStorageGB: 85.2,
        videoStorageGB: 160.6,
        before: 385,
        during: 520,
        after: 340,
        pending: 45,
        approved: 1150,
        rejected: 50,
        approvalRate: 95.8,
        byType: [
            { type: 'Ảnh (JPG/PNG)', count: 980, sizeGB: 85.2, avgSizeMB: 89 },
            { type: 'Video (MP4/MOV)', count: 265, sizeGB: 160.6, avgSizeMB: 620 },
        ],
        rejectionReasons: [
            { reason: 'Ảnh/Video mờ', count: 22 },
            { reason: 'Thiếu thông tin', count: 15 },
            { reason: 'Góc chụp sai', count: 8 },
            { reason: 'Khác', count: 5 },
        ],
    };

    // Mock data - Chất lượng
    const mockQualityData = [
        {
            key: '1',
            projectCode: 'DU-2024-003',
            issueType: 'Vết nứt bề mặt',
            severity: 'Cao',
            status: 'Đã khắc phục',
            createdDate: '2026-01-15',
            resolvedDate: '2026-01-18',
            resolutionTime: 3,
        },
        {
            key: '2',
            projectCode: 'DU-2024-007',
            issueType: 'Màu không đều',
            severity: 'Trung bình',
            status: 'Đang xử lý',
            createdDate: '2026-02-10',
            resolvedDate: null,
            resolutionTime: null,
        },
    ];

    // Handle drilldown
    const handleDrilldown = (reportType: ReportType, filter: any) => {
        setSelectedReport(reportType);
        setDrilldownFilter(filter);
    };

    // Render reports
    const renderReportContent = () => {
        switch (selectedReport) {
            /* =================== TÀI CHÍNH =================== */
            case 'revenue_overview':
                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tổng Doanh thu"
                                        value={mockRevenueData.total / 1000000}
                                        suffix="triệu"
                                        prefix={<DollarOutlined />}
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                    <Tag color="green" icon={<ArrowUpOutlined />} style={{ marginTop: 8 }}>
                                        +{mockRevenueData.growth}% so với tháng trước
                                    </Tag>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    onClick={() =>
                                        handleDrilldown('project_summary', { projectType: 'internal' })
                                    }
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Statistic
                                        title="Dự án Nội bộ"
                                        value={mockRevenueData.internal / 1000000}
                                        suffix="triệu"
                                    />
                                    <Progress
                                        percent={Number(((mockRevenueData.internal / mockRevenueData.total) * 100).toFixed(1))}
                                        strokeColor="#1890ff"
                                        showInfo={false}
                                        style={{ marginTop: 8 }}
                                    />
                                    <div style={{ marginTop: 8, fontSize: 12, color: '#1890ff' }}>
                                        <EyeOutlined /> Click để xem chi tiết
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    onClick={() =>
                                        handleDrilldown('project_summary', { projectType: 'outsource' })
                                    }
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Statistic
                                        title="Dự án Outsource"
                                        value={mockRevenueData.outsource / 1000000}
                                        suffix="triệu"
                                    />
                                    <Progress
                                        percent={Number(((mockRevenueData.outsource / mockRevenueData.total) * 100).toFixed(1))}
                                        strokeColor="#52c41a"
                                        showInfo={false}
                                        style={{ marginTop: 8 }}
                                    />
                                    <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                                        <EyeOutlined /> Click để xem chi tiết
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Giá trị TB/Dự án"
                                        value={(mockRevenueData.total / 50 / 1000000).toFixed(1)}
                                        suffix="triệu"
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Xu hướng Doanh thu (5 tháng gần nhất)">
                            <div style={{ padding: 20 }}>
                                {mockRevenueData.byMonth.map((item, index) => (
                                    <div key={index} style={{ marginBottom: 16 }}>
                                        <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{item.month}</strong>
                                            <span>
                                                {(item.revenue / 1000000).toFixed(0)} triệu - {item.projectCount} dự án
                                            </span>
                                        </div>
                                        <Progress percent={(item.revenue / 650000000) * 100} showInfo={false} strokeColor="#1890ff" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                );

            case 'payment_collection':
                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="Tổng Tiền Đã thu"
                                        value={mockPaymentData.collected / 1000000}
                                        suffix="triệu"
                                        prefix={<DollarOutlined />}
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="Tỷ lệ Thu tiền"
                                        value={mockPaymentData.rate}
                                        suffix="%"
                                        valueStyle={{ color: mockPaymentData.rate > 70 ? '#3f8600' : '#cf1322' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    hoverable
                                    onClick={() => handleDrilldown('outstanding_payments', {})}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Statistic
                                        title="Hóa đơn Quá hạn"
                                        value={mockPaymentData.overdue}
                                        valueStyle={{ color: '#cf1322' }}
                                    />
                                    <div style={{ marginTop: 8, fontSize: 12, color: '#cf1322' }}>
                                        <EyeOutlined /> Click để xem danh sách
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Thu tiền theo Milestone">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card
                                        hoverable
                                        onClick={() =>
                                            handleDrilldown('project_summary', { milestone: 'deposit' })
                                        }
                                        style={{ background: '#f0f2f5', cursor: 'pointer' }}
                                    >
                                        <h4>Đặt cọc (30%)</h4>
                                        <div style={{ fontSize: 24, fontWeight: 600, color: '#1890ff' }}>
                                            {mockPaymentData.deposit.rate}%
                                        </div>
                                        <div style={{ marginTop: 8, color: '#666' }}>
                                            {(mockPaymentData.deposit.collected / 1000000).toFixed(0)} /{' '}
                                            {(mockPaymentData.deposit.total / 1000000).toFixed(0)} triệu
                                        </div>
                                        <Progress
                                            percent={mockPaymentData.deposit.rate}
                                            strokeColor="#1890ff"
                                            style={{ marginTop: 8 }}
                                        />
                                        <div style={{ marginTop: 8, fontSize: 12, color: '#1890ff' }}>
                                            <EyeOutlined /> Click để xem dự án
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card
                                        hoverable
                                        onClick={() =>
                                            handleDrilldown('project_summary', { milestone: 'advance' })
                                        }
                                        style={{ background: '#f0f2f5', cursor: 'pointer' }}
                                    >
                                        <h4>Tạm ứng (40%)</h4>
                                        <div style={{ fontSize: 24, fontWeight: 600, color: '#52c41a' }}>
                                            {mockPaymentData.advance.rate}%
                                        </div>
                                        <div style={{ marginTop: 8, color: '#666' }}>
                                            {(mockPaymentData.advance.collected / 1000000).toFixed(0)} /{' '}
                                            {(mockPaymentData.advance.total / 1000000).toFixed(0)} triệu
                                        </div>
                                        <Progress
                                            percent={mockPaymentData.advance.rate}
                                            strokeColor="#52c41a"
                                            style={{ marginTop: 8 }}
                                        />
                                        <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                                            <EyeOutlined /> Click để xem dự án
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card
                                        hoverable
                                        onClick={() =>
                                            handleDrilldown('project_summary', { milestone: 'acceptance' })
                                        }
                                        style={{ background: '#f0f2f5', cursor: 'pointer' }}
                                    >
                                        <h4>Nghiệm thu (30%)</h4>
                                        <div style={{ fontSize: 24, fontWeight: 600, color: '#faad14' }}>
                                            {mockPaymentData.acceptance.rate.toFixed(1)}%
                                        </div>
                                        <div style={{ marginTop: 8, color: '#666' }}>
                                            {(mockPaymentData.acceptance.collected / 1000000).toFixed(0)} /{' '}
                                            {(mockPaymentData.acceptance.total / 1000000).toFixed(0)} triệu
                                        </div>
                                        <Progress
                                            percent={mockPaymentData.acceptance.rate}
                                            strokeColor="#faad14"
                                            style={{ marginTop: 8 }}
                                        />
                                        <div style={{ marginTop: 8, fontSize: 12, color: '#faad14' }}>
                                            <EyeOutlined /> Click để xem dự án
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </>
                );

            case 'outstanding_payments':
                const outstandingColumns: ColumnsType<any> = [
                    { title: 'Mã dự án', dataIndex: 'projectCode', key: 'projectCode', width: 130 },
                    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
                    {
                        title: 'Số tiền',
                        dataIndex: 'amount',
                        key: 'amount',
                        width: 130,
                        render: (val) => `${(val / 1000000).toFixed(1)} triệu`,
                    },
                    {
                        title: 'Số ngày Quá hạn',
                        dataIndex: 'daysOverdue',
                        key: 'daysOverdue',
                        width: 140,
                        render: (days) => (
                            <Tag color={days > 30 ? 'red' : days > 14 ? 'orange' : 'gold'}>{days} ngày</Tag>
                        ),
                        sorter: (a, b) => b.daysOverdue - a.daysOverdue,
                    },
                    { title: 'Milestone', dataIndex: 'milestone', key: 'milestone', width: 120 },
                    {
                        title: 'Thao tác',
                        key: 'actions',
                        width: 200,
                        render: (_, record) => (
                            <Space size="small">
                                <Button
                                    type="link"
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={() => navigate(`/admin-v2/projects/${record.projectCode}`)}
                                >
                                    Xem Timeline
                                </Button>
                                <Button type="link" size="small">
                                    Nhắc nhở
                                </Button>
                            </Space>
                        ),
                    },
                ];

                const totalOutstanding = mockOutstandingData.reduce((sum, item) => sum + item.amount, 0);

                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tổng Công nợ"
                                        value={totalOutstanding / 1000000}
                                        suffix="triệu"
                                        valueStyle={{ color: '#cf1322' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="0-7 ngày"
                                        value={mockOutstandingData.filter((p) => p.daysOverdue <= 7).length}
                                        valueStyle={{ color: '#faad14' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="8-30 ngày"
                                        value={mockOutstandingData.filter((p) => p.daysOverdue > 7 && p.daysOverdue <= 30).length}
                                        valueStyle={{ color: '#ff7a45' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="30+ ngày"
                                        value={mockOutstandingData.filter((p) => p.daysOverdue > 30).length}
                                        valueStyle={{ color: '#cf1322' }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Chi tiết Công nợ">
                            <Table columns={outstandingColumns} dataSource={mockOutstandingData} pagination={false} />
                        </Card>
                    </>
                );

            case 'cash_flow':
                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tiền Vào"
                                        value={mockCashFlowData.cashIn / 1000000}
                                        suffix="triệu"
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<ArrowUpOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tiền Ra"
                                        value={mockCashFlowData.cashOut / 1000000}
                                        suffix="triệu"
                                        valueStyle={{ color: '#cf1322' }}
                                        prefix={<ArrowDownOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Dòng tiền Ròng"
                                        value={mockCashFlowData.netCashFlow / 1000000}
                                        suffix="triệu"
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Số dư Hiện tại"
                                        value={mockCashFlowData.balance / 1000000}
                                        suffix="triệu"
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Dòng tiền theo tháng">
                            <div style={{ padding: 20 }}>
                                {mockCashFlowData.transactions.map((item, index) => (
                                    <div key={index} style={{ marginBottom: 20 }}>
                                        <h4>{item.month}</h4>
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <div style={{ color: '#3f8600' }}>
                                                    Vào: {(item.cashIn / 1000000).toFixed(0)} triệu
                                                </div>
                                                <Progress percent={(item.cashIn / 500000000) * 100} strokeColor="#3f8600" showInfo={false} />
                                            </Col>
                                            <Col span={8}>
                                                <div style={{ color: '#cf1322' }}>
                                                    Ra: {(item.cashOut / 1000000).toFixed(0)} triệu
                                                </div>
                                                <Progress percent={(item.cashOut / 500000000) * 100} strokeColor="#cf1322" showInfo={false} />
                                            </Col>
                                            <Col span={8}>
                                                <div style={{ color: '#1890ff' }}>
                                                    Ròng: {(item.net / 1000000).toFixed(0)} triệu
                                                </div>
                                                <Progress percent={(item.net / 200000000) * 100} strokeColor="#1890ff" showInfo={false} />
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                );

            case 'profit_analysis':
                const profitColumns: ColumnsType<any> = [
                    { title: 'Mã dự án', dataIndex: 'projectCode', key: 'projectCode', width: 130 },
                    {
                        title: 'Doanh thu',
                        dataIndex: 'revenue',
                        key: 'revenue',
                        render: (val) => `${(val / 1000000).toFixed(1)} triệu`,
                    },
                    {
                        title: 'Chi phí Vật tư',
                        dataIndex: 'materialCost',
                        key: 'materialCost',
                        render: (val) => `${(val / 1000000).toFixed(1)} triệu`,
                    },
                    {
                        title: 'Chi phí Nhân công',
                        dataIndex: 'laborCost',
                        key: 'laborCost',
                        render: (val) => `${(val / 1000000).toFixed(1)} triệu`,
                    },
                    {
                        title: 'Lợi nhuận',
                        dataIndex: 'profit',
                        key: 'profit',
                        render: (val) => (
                            <strong style={{ color: '#3f8600' }}>{(val / 1000000).toFixed(1)} triệu</strong>
                        ),
                    },
                    {
                        title: 'Tỷ suất LN',
                        dataIndex: 'margin',
                        key: 'margin',
                        render: (val) => <Tag color="green">{val.toFixed(1)}%</Tag>,
                        sorter: (a, b) => b.margin - a.margin,
                    },
                    {
                        title: '',
                        key: 'actions',
                        width: 120,
                        render: (_, record) => (
                            <Button
                                type="link"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => handleDrilldown('cost_tracking', { project: record.projectCode })}
                            >
                                Chi tiết
                            </Button>
                        ),
                    },
                ];

                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tổng Lợi nhuận"
                                        value={70000000 / 1000000}
                                        suffix="triệu"
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tỷ suất TB"
                                        value={23.5}
                                        suffix="%"
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Dự án phân tích" value={mockProfitData.length} />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tỷ suất Cao nhất"
                                        value={25.9}
                                        suffix="%"
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Phân tích Lợi nhuận theo Dự án">
                            <Table columns={profitColumns} dataSource={mockProfitData} pagination={false} />
                        </Card>
                    </>
                );

            case 'cost_tracking':
                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tổng Chi phí"
                                        value={mockCostData.total / 1000000}
                                        suffix="triệu"
                                        valueStyle={{ color: '#cf1322' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Vật tư" value={mockCostData.material / 1000000} suffix="triệu" />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Nhân công" value={mockCostData.labor / 1000000} suffix="triệu" />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Chi phí chung" value={mockCostData.overhead / 1000000} suffix="triệu" />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Tỷ trọng Chi phí">
                            <div style={{ padding: 20 }}>
                                {mockCostData.byCategory.map((item, index) => (
                                    <div key={index} style={{ marginBottom: 20 }}>
                                        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{item.category}</strong>
                                            <span>
                                                {(item.amount / 1000000).toFixed(0)} triệu ({item.percent}%)
                                            </span>
                                        </div>
                                        <Progress percent={item.percent} strokeColor="#1890ff" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                );

            /* =================== DỰ ÁN =================== */
            case 'project_summary':
                const projectColumns: ColumnsType<any> = [
                    { title: 'Mã dự án', dataIndex: 'code', key: 'code', width: 130 },
                    { title: 'Tên dự án', dataIndex: 'name', key: 'name' },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status) => {
                            const colors: Record<string, string> = {
                                'Hoàn thành': 'green',
                                'Đang thi công': 'blue',
                                'Chậm tiến độ': 'red',
                            };
                            return <Tag color={colors[status]}>{status}</Tag>;
                        },
                    },
                    { title: 'PM', dataIndex: 'pm', key: 'pm', width: 150 },
                    {
                        title: 'Thời gian',
                        key: 'duration',
                        render: (_, record) => {
                            const delay = record.duration - record.plannedDuration;
                            return (
                                <div>
                                    {record.duration}/{record.plannedDuration} ngày
                                    {delay > 0 && <Tag color="red" style={{ marginLeft: 8 }}>+{delay}</Tag>}
                                </div>
                            );
                        },
                    },
                    {
                        title: 'Minh chứng',
                        dataIndex: 'evidenceRate',
                        key: 'evidenceRate',
                        render: (rate) => <Progress percent={rate} size="small" />,
                    },
                    {
                        title: '',
                        key: 'actions',
                        width: 100,
                        render: (_, record) => (
                            <Button
                                type="link"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => handleDrilldown('project_performance', { project: record.code })}
                            >
                                Chi tiết
                            </Button>
                        ),
                    },
                ];

                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Tổng Dự án" value={50} />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Hoàn thành" value={32} valueStyle={{ color: '#3f8600' }} />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Đang thi công" value={15} valueStyle={{ color: '#1890ff' }} />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Chậm tiến độ" value={3} valueStyle={{ color: '#cf1322' }} />
                                </Card>
                            </Col>
                        </Row>

                        {drilldownFilter && (
                            <Card size="small" style={{ marginBottom: 16, background: '#e6f7ff', borderColor: '#91d5ff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>
                                        <strong>Lọc:</strong>{' '}
                                        {drilldownFilter.projectType && `Loại: ${drilldownFilter.projectType}`}
                                        {drilldownFilter.milestone && `Milestone: ${drilldownFilter.milestone}`}
                                    </span>
                                    <Button size="small" onClick={() => setDrilldownFilter(null)}>
                                        Xóa lọc
                                    </Button>
                                </div>
                            </Card>
                        )}

                        <Card title="Danh sách Dự án">
                            <Table columns={projectColumns} dataSource={mockProjectData} pagination={{ pageSize: 10 }} />
                        </Card>
                    </>
                );

            case 'project_performance':
            case 'delayed_projects':
            case 'project_type_comparison':
                return (
                    <div style={{ padding: 60, textAlign: 'center', background: '#fafafa', borderRadius: 4 }}>
                        <ProjectOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
                            {selectedReport === 'project_performance' && 'Hiệu suất Dự án'}
                            {selectedReport === 'delayed_projects' && 'Dự án Chậm tiến độ'}
                            {selectedReport === 'project_type_comparison' && 'So sánh Loại hình Dự án'}
                        </div>
                        <div style={{ fontSize: 14, color: '#999' }}>Đang phát triển...</div>
                    </div>
                );

            /* =================== HIỆU SUẤT =================== */
            case 'user_performance':
                const userPerfColumns: ColumnsType<any> = [
                    { title: 'Tên', dataIndex: 'name', key: 'name' },
                    { title: 'Vai trò', dataIndex: 'role', key: 'role', width: 120 },
                    { title: 'Số Dự án', dataIndex: 'projects', key: 'projects', width: 100 },
                    {
                        title: 'MC Tải lên',
                        dataIndex: 'evidenceUploaded',
                        key: 'evidenceUploaded',
                        width: 120,
                    },
                    {
                        title: 'MC Đã duyệt',
                        dataIndex: 'evidenceApproved',
                        key: 'evidenceApproved',
                        width: 120,
                    },
                    {
                        title: 'Thời gian TB Phản hồi',
                        dataIndex: 'avgResponseTime',
                        key: 'avgResponseTime',
                        width: 180,
                        render: (time) => `${time} giờ`,
                    },
                    {
                        title: '',
                        key: 'actions',
                        width: 120,
                        render: (_, record) => (
                            <Button
                                type="link"
                                size="small"
                                icon={<UserOutlined />}
                                onClick={() => handleDrilldown('personal_details', { userName: record.name })}
                            >
                                Chi tiết
                            </Button>
                        ),
                    },
                ];

                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Tổng Nhân viên" value={15} />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="PM" value={3} valueStyle={{ color: '#1890ff' }} />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Giám sát" value={5} valueStyle={{ color: '#52c41a' }} />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Nhân viên" value={7} valueStyle={{ color: '#faad14' }} />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Hiệu suất Cá nhân">
                            <Table columns={userPerfColumns} dataSource={mockUserPerformanceData} pagination={false} />
                        </Card>
                    </>
                );

            case 'personal_details':
                return (
                    <div style={{ padding: 60, textAlign: 'center', background: '#fafafa', borderRadius: 4 }}>
                        {drilldownFilter?.userName && (
                            <div style={{ marginBottom: 16, fontSize: 16, color: '#1890ff' }}>
                                Chi tiết: {drilldownFilter.userName}
                            </div>
                        )}
                        <UserOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Chi tiết Hiệu suất Cá nhân</div>
                        <div style={{ fontSize: 14, color: '#999' }}>Đang phát triển...</div>
                    </div>
                );

            case 'team_performance':
            case 'supervisor_efficiency':
            case 'outsource_performance':
                return (
                    <div style={{ padding: 60, textAlign: 'center', background: '#fafafa', borderRadius: 4 }}>
                        <TeamOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
                            {selectedReport === 'team_performance' && 'Hiệu suất Nhóm'}
                            {selectedReport === 'supervisor_efficiency' && 'Hiệu suất Giám sát'}
                            {selectedReport === 'outsource_performance' && 'Hiệu suất Outsource'}
                        </div>
                        <div style={{ fontSize: 14, color: '#999' }}>Đang phát triển...</div>
                    </div>
                );

            /* =================== TƯ LIỆU (MEDIA/DOCUMENTS) =================== */
            case 'evidence_status':
                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Tổng Tư liệu" value={mockEvidenceData.total} />
                                    <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                                        {mockEvidenceData.totalPhotos} ảnh + {mockEvidenceData.totalVideos} video
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tổng Dung lượng"
                                        value={mockEvidenceData.totalStorageGB}
                                        suffix="GB"
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                    <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                                        Ảnh: {mockEvidenceData.photoStorageGB}GB | Video: {mockEvidenceData.videoStorageGB}GB
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tỷ lệ Duyệt"
                                        value={mockEvidenceData.approvalRate}
                                        suffix="%"
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                    <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                                        {mockEvidenceData.approved} đã duyệt / {mockEvidenceData.pending} chờ duyệt
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Từ chối" value={mockEvidenceData.rejected} valueStyle={{ color: '#cf1322' }} />
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={12}>
                                <Card title="Phân loại Ảnh / Video">
                                    <div style={{ padding: 20 }}>
                                        {mockEvidenceData.byType.map((item, index) => (
                                            <div key={index} style={{ marginBottom: 20 }}>
                                                <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                                                    <strong>{item.type}</strong>
                                                    <span>{item.count} files ({item.sizeGB.toFixed(1)} GB)</span>
                                                </div>
                                                <Progress
                                                    percent={Number(((item.count / mockEvidenceData.total) * 100).toFixed(1))}
                                                    strokeColor={index === 0 ? '#1890ff' : '#52c41a'}
                                                />
                                                <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
                                                    Dung lượng TB: {item.avgSizeMB} MB/file
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Theo Giai đoạn">
                                    <div style={{ padding: 20 }}>
                                        <div style={{ marginBottom: 16 }}>
                                            <div style={{ marginBottom: 4 }}>
                                                <strong>TRƯỚC (Before)</strong>: {mockEvidenceData.before}
                                            </div>
                                            <Progress
                                                percent={(mockEvidenceData.before / mockEvidenceData.total) * 100}
                                                strokeColor="#1890ff"
                                            />
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                            <div style={{ marginBottom: 4 }}>
                                                <strong>TRONG (During)</strong>: {mockEvidenceData.during}
                                            </div>
                                            <Progress
                                                percent={(mockEvidenceData.during / mockEvidenceData.total) * 100}
                                                strokeColor="#52c41a"
                                            />
                                        </div>
                                        <div>
                                            <div style={{ marginBottom: 4 }}>
                                                <strong>SAU (After)</strong>: {mockEvidenceData.after}
                                            </div>
                                            <Progress
                                                percent={(mockEvidenceData.after / mockEvidenceData.total) * 100}
                                                strokeColor="#faad14"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Lý do Từ chối">
                            <div style={{ padding: 20 }}>
                                {mockEvidenceData.rejectionReasons.map((item, index) => (
                                    <div key={index} style={{ marginBottom: 16 }}>
                                        <div style={{ marginBottom: 4 }}>
                                            <strong>{item.reason}</strong>: {item.count} lần
                                        </div>
                                        <Progress
                                            percent={(item.count / mockEvidenceData.rejected) * 100}
                                            strokeColor="#cf1322"
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                );

            case 'evidence_approval_efficiency':
            case 'photo_quality_issues':
                return (
                    <div style={{ padding: 60, textAlign: 'center', background: '#fafafa', borderRadius: 4 }}>
                        <FileImageOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
                            {selectedReport === 'evidence_approval_efficiency' && 'Hiệu suất Duyệt Tư liệu'}
                            {selectedReport === 'photo_quality_issues' && 'Vấn đề Chất lượng'}
                        </div>
                        <div style={{ fontSize: 14, color: '#999' }}>Đang phát triển...</div>
                    </div>
                );

            /* =================== CHẤT LƯỢNG =================== */
            case 'quality_issues':
                const qualityColumns: ColumnsType<any> = [
                    { title: 'Mã dự án', dataIndex: 'projectCode', key: 'projectCode', width: 130 },
                    { title: 'Loại vấn đề', dataIndex: 'issueType', key: 'issueType' },
                    {
                        title: 'Mức độ',
                        dataIndex: 'severity',
                        key: 'severity',
                        render: (severity) => {
                            const colors: Record<string, string> = {
                                'Cao': 'red',
                                'Trung bình': 'orange',
                                'Thấp': 'blue',
                            };
                            return <Tag color={colors[severity]}>{severity}</Tag>;
                        },
                    },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status) => {
                            const colors: Record<string, string> = {
                                'Đã khắc phục': 'green',
                                'Đang xử lý': 'blue',
                            };
                            return <Tag color={colors[status]}>{status}</Tag>;
                        },
                    },
                    { title: 'Ngày tạo', dataIndex: 'createdDate', key: 'createdDate', width: 110 },
                    {
                        title: 'Thời gian xử lý',
                        dataIndex: 'resolutionTime',
                        key: 'resolutionTime',
                        render: (time) => (time ? `${time} ngày` : '-'),
                    },
                ];

                return (
                    <>
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic title="Tổng Vấn đề" value={mockQualityData.length} />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Đã khắc phục"
                                        value={mockQualityData.filter((q) => q.status === 'Đã khắc phục').length}
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Đang xử lý"
                                        value={mockQualityData.filter((q) => q.status === 'Đang xử lý').length}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Thời gian TB xử lý"
                                        value={3}
                                        suffix="ngày"
                                        valueStyle={{ color: '#faad14' }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Danh sách Vấn đề Chất lượng">
                            <Table columns={qualityColumns} dataSource={mockQualityData} pagination={false} />
                        </Card>
                    </>
                );

            case 'material_variance':
                return (
                    <div style={{ padding: 60, textAlign: 'center', background: '#fafafa', borderRadius: 4 }}>
                        <ToolOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Chênh lệch Vật tư</div>
                        <div style={{ fontSize: 14, color: '#999' }}>Đang phát triển...</div>
                    </div>
                );

            default:
                return null;
        }
    };

    const currentCategory = reportCategories.find((cat) => cat.key === selectedCategory);

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Báo cáo Quản trị - Admin Reports"
                extra={<BarChartOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
            >
                {/* Category Navigation */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={24}>
                        <Menu
                            mode="horizontal"
                            selectedKeys={[selectedCategory]}
                            onClick={({ key }) => {
                                setSelectedCategory(key as ReportCategory);
                                const firstReport = reportCategories.find((cat) => cat.key === key)?.reports[0]
                                    .key as ReportType;
                                setSelectedReport(firstReport);
                                setDrilldownFilter(null);
                            }}
                            items={reportCategories.map((cat) => ({
                                key: cat.key,
                                label: cat.label,
                                icon: cat.icon,
                            }))}
                        />
                    </Col>
                </Row>

                {/* Report Selector + Filters */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={10}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Chọn báo cáo"
                            value={selectedReport}
                            onChange={(value) => {
                                setSelectedReport(value as ReportType);
                                setDrilldownFilter(null);
                            }}
                        >
                            {currentCategory?.reports.map((report) => (
                                <Select.Option key={report.key} value={report.key}>
                                    {report.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <RangePicker
                            style={{ width: '100%' }}
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                            format="DD/MM/YYYY"
                        />
                    </Col>
                    <Col span={6}>
                        <Space>
                            <Button icon={<FilePdfOutlined />}>Xuất PDF</Button>
                            <Button icon={<FileExcelOutlined />}>Xuất Excel</Button>
                        </Space>
                    </Col>
                </Row>

                {/* Report Content */}
                <div style={{ marginTop: 24 }}>{renderReportContent()}</div>
            </Card>
        </div>
    );
};

export default Reports;
