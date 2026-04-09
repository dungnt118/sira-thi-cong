import React, { useState } from 'react';
import {
    Table, Card, Button, Tag, Input, Select, Space, Avatar,
    Row, Col, Dropdown, Typography, Empty, Modal, Form, Grid
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
    PlusOutlined, SearchOutlined, FilterOutlined, UserOutlined,
    EyeOutlined, EditOutlined,
    MoreOutlined, FunnelPlotOutlined, CameraOutlined, DollarOutlined,
    ProjectOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import {
    mockServiceRequests as defaultServiceRequests,
    mockCustomers as defaultCustomers,
    mockPipelines as defaultPipelines
} from '../../../data/mockData';
import type {
    ServiceRequest,
    PipelineSystemStage,
    Pipeline as PipelineType,
    Customer
} from '../../../types/v3';

const { Text } = Typography;
const { Option } = Select;

const STATUS_CONFIG: Record<PipelineSystemStage, { label: string; color: string }> = {
    NEW: { label: 'Mới tạo', color: 'blue' },
    IN_PROGRESS: { label: 'Đang xử lý', color: 'processing' },
    WON: { label: 'Đã ký HĐ', color: 'success' },
    LOST: { label: 'Từ chối / Hủy', color: 'error' },
};

const ServiceRequestList: React.FC = () => {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const navigate = useNavigate();

    const [mockPipelines] = useLocalStorageData<PipelineType[]>(demoDataService.KEYS.PIPELINES, defaultPipelines);
    const [mockCustomers] = useLocalStorageData<Customer[]>(demoDataService.KEYS.CUSTOMERS, defaultCustomers);
    const [mockServiceRequests, setMockServiceRequests] = useLocalStorageData<ServiceRequest[]>(demoDataService.KEYS.SERVICE_REQUESTS, defaultServiceRequests);

    const [search, setSearch] = useState('');
    const [filterPipeline, setFilterPipeline] = useState<string>('ALL');
    const [filterStatus, setFilterStatus] = useState<PipelineSystemStage | 'ALL'>('ALL');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [createForm] = Form.useForm();

    const filtered = mockServiceRequests.filter(req => {
        const matchSearch = !search ||
            req.name.toLowerCase().includes(search.toLowerCase()) ||
            req.customerName.toLowerCase().includes(search.toLowerCase()) ||
            req.code.toLowerCase().includes(search.toLowerCase());
        const matchPipeline = filterPipeline === 'ALL' || req.pipelineId === filterPipeline;
        const matchStatus = filterStatus === 'ALL' || req.status === filterStatus;
        return matchSearch && matchPipeline && matchStatus;
    });

    const getRowActions = (record: ServiceRequest): MenuProps['items'] => [
        { key: 'view', icon: <EyeOutlined />, label: 'Xem chi tiết', onClick: () => navigate(`/admin/ql/crm/service-requests/${record.id}`) },
        { key: 'edit', icon: <EditOutlined />, label: 'Chỉnh sửa Yêu cầu', onClick: () => navigate(`/admin/ql/crm/service-requests/${record.id}/edit`) },
        { key: 'survey', icon: <CameraOutlined />, label: 'Khảo sát & Đo ẩm', onClick: () => navigate(`/admin/ql/crm/service-requests/${record.id}/survey`) },
        { key: 'quote', icon: <DollarOutlined />, label: 'Lập báo giá', onClick: () => navigate(`/admin/ql/crm/service-requests/${record.id}/quotation`) },
        { type: 'divider' },
        { key: 'project', icon: <ProjectOutlined />, label: '🔨 Tạo dự án thi công', disabled: record.status !== 'WON' },
        { key: 'delete', icon: <DeleteOutlined />, label: 'Xóa yêu cầu', danger: true },
    ];

    const columns: ColumnsType<ServiceRequest> = [
        {
            title: 'Mã YC',
            dataIndex: 'code',
            key: 'code',
            width: 110,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Tên Yêu cầu',
            key: 'name',
            ellipsis: true,
            render: (_, r) => (
                <div style={{ maxWidth: isMobile ? 200 : 'none' }}>
                    <div style={{
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#1976D2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                        onClick={() => navigate(`/admin/ql/crm/service-requests/${r.id}`)}>
                        {r.name}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>Ngày tạo: {r.createdAt.split('T')[0]}</Text>
                </div>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            ellipsis: true,
            width: 180,
            render: (_, r) => {
                const customer = mockCustomers.find(c => c.id === r.customerId);
                return (
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.customerName}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {customer?.phone}
                        </Text>
                    </div>
                )
            },
        },
        {
            title: 'PM phụ trách',
            dataIndex: 'assignedPmName',
            key: 'pm',
            render: (name: string) => (
                <Space>
                    <Avatar size={24} style={{ background: '#52c41a' }} icon={<UserOutlined />} />
                    {name}
                </Space>
            ),
        },
        {
            title: 'Pipeline / Bước',
            key: 'pipeline',
            width: 180,
            render: (_, r) => {
                const pipeline = mockPipelines.find(p => p.id === r.pipelineId);
                const stage = pipeline?.stages.find(s => s.id === r.stageId);
                return (
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{
                            fontSize: 12,
                            marginBottom: 4,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{pipeline?.name}</div>
                        {stage ? (
                            <Tag color={stage.color} style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stage.name}</Tag>
                        ) : null}
                    </div>
                );
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 130,
            render: (_, r) => {
                const s = STATUS_CONFIG[r.status];
                return <Tag color={s.color}>{s.label}</Tag>;
            },
            filters: Object.entries(STATUS_CONFIG).map(([k, v]) => ({ text: v.label, value: k })),
            onFilter: (value, r) => r.status === value,
        },
        {
            title: '',
            key: 'actions',
            width: 48,
            render: (_, r) => (
                <Dropdown menu={{ items: getRowActions(r) }} placement="bottomRight" trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    const handleCreateSubmit = (values: any) => {
        const customer = mockCustomers.find(c => c.id === values.customerId);

        const newRequest: ServiceRequest = {
            id: `sr-${Date.now()}`,
            code: `SR-${Math.floor(1000 + Math.random() * 9000)}`,
            name: values.name,
            customerId: values.customerId,
            customerName: customer?.fullName || 'Khách hàng mới',
            pipelineId: values.pipelineId,
            stageId: values.stageId,
            status: 'NEW',
            assignedPmId: 'pm-01', // Default PM
            assignedPmName: 'Nguyễn Văn A',
            createdAt: new Date().toISOString(),
            surveyImages: [],
            moistureReadings: [],
            quotations: []
        };

        setMockServiceRequests([newRequest, ...mockServiceRequests]);
        setIsCreateModalVisible(false);
        createForm.resetFields();
        Modal.success({
            title: 'Tạo yêu cầu thành công',
            content: `Yêu cầu ${newRequest.code} đã được khởi tạo.`,
        });
    };

    return (
        <div style={{ padding: isMobile ? 4 : 0 }}>
            <div style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col xs={24} md={16}>
                        <h2 style={{ margin: 0, fontSize: isMobile ? '1.2rem' : '1.5rem' }}>Danh sách Yêu cầu Dịch vụ (Deals)</h2>
                        <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>Quản lý toàn bộ cơ hội bán hàng và khảo sát thi công</Text>
                    </Col>
                    <Col xs={24} md={8} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Space size={isMobile ? 8 : 12} wrap={isMobile} style={{ width: isMobile ? '100%' : 'auto' }}>
                            <Button
                                icon={<FunnelPlotOutlined />}
                                onClick={() => navigate('/admin/ql/crm/pipeline')}
                                block={isMobile}
                            >
                                {isMobile ? 'Kanban' : 'Xem bảng Kanban (Pipeline)'}
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsCreateModalVisible(true)}
                                block={isMobile}
                            >
                                {isMobile ? 'Thêm YC' : 'Tạo Yêu cầu mới'}
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            <Card bodyStyle={{ padding: isMobile ? 8 : 24 }}>
                {/* Filter Bar */}
                <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                    <Col xs={24} lg={12}>
                        <Input
                            placeholder="Tìm kiếm theo Tên YC, Mã YC, Tên KH..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Select
                            style={{ width: '100%' }}
                            value={filterPipeline}
                            onChange={setFilterPipeline}
                            options={[
                                { value: 'ALL', label: 'Tất cả Pipeline' },
                                ...mockPipelines.map(p => ({ value: p.id, label: p.name })),
                            ]}
                            suffixIcon={<FilterOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Select
                            style={{ width: '100%' }}
                            value={filterStatus}
                            onChange={setFilterStatus}
                            options={[
                                { value: 'ALL', label: 'Tất cả trạng thái' },
                                ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
                            ]}
                            suffixIcon={<FilterOutlined />}
                        />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={{ pageSize: 15, showSizeChanger: true, showTotal: (t) => `${t} Yêu cầu` }}
                    locale={{ emptyText: <Empty description="Không có Yêu cầu dịch vụ nào" /> }}
                    size={isMobile ? "small" : "middle"}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            <Modal
                title="Tạo Yêu cầu Dịch vụ mới"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={() => createForm.submit()}
                okText="Tạo Yêu cầu"
                cancelText="Hủy"
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit}>
                    <Form.Item name="customerId" label="1. Chọn Khách hàng" rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}>
                        <Select
                            showSearch
                            placeholder="Tìm / Chọn Khách hàng có sẵn"
                            optionFilterProp="children"
                        >
                            {mockCustomers.map(c => (
                                <Option key={c.id} value={c.id}>{c.fullName} - {c.phone}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="name" label="2. Tên Yêu cầu / Cơ hội" rules={[{ required: true, message: 'Vui lòng nhập tên yêu cầu' }]}>
                        <Input placeholder="VD: Chống thấm mái chung cư Sunwah" />
                    </Form.Item>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="pipelineId" label="3. Công trình (Pipeline)" rules={[{ required: true }]}>
                                <Select placeholder="Chọn quy trình mẫu" style={{ width: '100%' }}>
                                    {mockPipelines.map(p => (
                                        <Option key={p.id} value={p.id}>{p.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            {/* In a real app, this would dynamically list stages of the selected pipeline */}
                            <Form.Item name="stageId" label="Bước Khởi tạo" rules={[{ required: true }]}>
                                <Select placeholder="Chọn bước" style={{ width: '100%' }}>
                                    <Option value="st-01">Tiếp nhận Lead</Option>
                                    <Option value="st-02">Đang Khảo sát</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ServiceRequestList;
