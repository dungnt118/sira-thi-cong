import React, { useState } from 'react';
import {
    Table, Card, Button, Tag, Input, Select, Space, Avatar,
    Row, Col, Dropdown, Typography, Empty, Modal, Form
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
    PlusOutlined, SearchOutlined, FilterOutlined, UserOutlined,
    EyeOutlined, EditOutlined,
    MoreOutlined, FunnelPlotOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockServiceRequests, mockCustomers, mockPipelines } from '../../../data/mockData';
import type { ServiceRequest, PipelineSystemStage } from '../../../types/v3';

const { Text } = Typography;
const { Option } = Select;

const STATUS_CONFIG: Record<PipelineSystemStage, { label: string; color: string }> = {
    NEW: { label: 'Mới tạo', color: 'blue' },
    IN_PROGRESS: { label: 'Đang xử lý', color: 'processing' },
    WON: { label: 'Đã ký HĐ', color: 'success' },
    LOST: { label: 'Từ chối / Hủy', color: 'error' },
};

const ServiceRequestList: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterPipeline, setFilterPipeline] = useState<string>('ALL');
    const [filterStatus, setFilterStatus] = useState<PipelineSystemStage | 'ALL'>('ALL');

    // Create Modal State
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
        { key: 'view', icon: <EyeOutlined />, label: 'Xem chi tiết', onClick: () => navigate(`/pm/crm/service-requests/${record.id}`) },
        { key: 'edit', icon: <EditOutlined />, label: 'Chỉnh sửa Yêu cầu', onClick: () => navigate(`/pm/crm/service-requests/${record.id}/edit`) },
        { key: 'survey', label: '📸 Khảo sát & Đo ẩm', onClick: () => navigate(`/pm/crm/service-requests/${record.id}/survey`) },
        { key: 'quote', label: '💰 Lập báo giá', onClick: () => navigate(`/pm/crm/service-requests/${record.id}/quotation`) },
        { type: 'divider' },
        { key: 'project', label: '🔨 Tạo dự án thi công', disabled: record.status !== 'WON' },
    ];

    const columns: ColumnsType<ServiceRequest> = [
        {
            title: 'Mã YC',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Tên Yêu cầu',
            key: 'name',
            render: (_, r) => (
                <div>
                    <div style={{ fontWeight: 600, cursor: 'pointer', color: '#1976D2' }}
                        onClick={() => navigate(`/pm/crm/service-requests/${r.id}`)}>
                        {r.name}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>Ngày tạo: {r.createdAt.split('T')[0]}</Text>
                </div>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, r) => {
                const customer = mockCustomers.find(c => c.id === r.customerId);
                return (
                    <div>
                        <div style={{ fontWeight: 500 }}>{r.customerName}</div>
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
            render: (_, r) => {
                const pipeline = mockPipelines.find(p => p.id === r.pipelineId);
                const stage = pipeline?.stages.find(s => s.id === r.stageId);
                return (
                    <div>
                        <div style={{ fontSize: 12, marginBottom: 4 }}>{pipeline?.name}</div>
                        {stage ? (
                            <Tag color={stage.color}>{stage.name}</Tag>
                        ) : null}
                    </div>
                );
            },
        },
        {
            title: 'Trạng thái chung',
            key: 'status',
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
        console.log('Creating Service Request:', values);
        setIsCreateModalVisible(false);
        createForm.resetFields();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ margin: 0 }}>Danh sách Yêu cầu Dịch vụ (Deals)</h2>
                    <Text type="secondary">Quản lý toàn bộ cơ hội bán hàng và khảo sát thi công</Text>
                </div>
                <Space>
                    <Button icon={<FunnelPlotOutlined />} onClick={() => navigate('/pm/crm/pipeline')}>
                        Xem bảng Kanban (Pipeline)
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
                        Tạo Yêu cầu mới
                    </Button>
                </Space>
            </div>

            <Card>
                {/* Filter Bar */}
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    <Col flex="auto">
                        <Input
                            placeholder="Tìm kiếm theo Tên YC, Mã YC, Tên KH..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col>
                        <Select
                            style={{ width: 220 }}
                            value={filterPipeline}
                            onChange={setFilterPipeline}
                            options={[
                                { value: 'ALL', label: 'Tất cả Pipeline' },
                                ...mockPipelines.map(p => ({ value: p.id, label: p.name })),
                            ]}
                            suffixIcon={<FilterOutlined />}
                        />
                    </Col>
                    <Col>
                        <Select
                            style={{ width: 180 }}
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
                    size="middle"
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

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="pipelineId" label="3. Hành trình (Pipeline)" rules={[{ required: true }]}>
                                <Select placeholder="Chọn quy trình mẫu">
                                    {mockPipelines.map(p => (
                                        <Option key={p.id} value={p.id}>{p.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* In a real app, this would dynamically list stages of the selected pipeline */}
                            <Form.Item name="stageId" label="Bước Khởi tạo" rules={[{ required: true }]}>
                                <Select placeholder="Chọn bước">
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
