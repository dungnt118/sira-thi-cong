import React, { useState } from 'react';
import { Card, Table, Tag, Button, Row, Col, Statistic, Space, Input, Modal, Descriptions, Form, message, Tooltip, Avatar } from 'antd';
import {
    UserOutlined, PlusOutlined, SearchOutlined, PhoneOutlined,
    EyeOutlined, LinkOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

/* ====== MOCK DATA ====== */
const mockCustomers = [
    {
        key: '1', name: 'Công ty ABC', contact: 'Nguyễn Thanh Hùng', phone: '0901-234-567',
        email: 'hungnguyen@abc.com', type: 'Doanh nghiệp', totalProjects: 3,
        activeProjects: 1, totalRevenue: 380000000, portalActive: true,
    },
    {
        key: '2', name: 'Anh Trần Văn B', contact: 'Trần Văn B', phone: '0901-345-678',
        email: 'vanb@gmail.com', type: 'Cá nhân', totalProjects: 1,
        activeProjects: 1, totalRevenue: 45000000, portalActive: false,
    },
    {
        key: '3', name: 'Công ty DEF', contact: 'Lê Minh Phương', phone: '0901-456-789',
        email: 'phuongle@def.com', type: 'Doanh nghiệp', totalProjects: 2,
        activeProjects: 1, totalRevenue: 450000000, portalActive: true,
    },
    {
        key: '4', name: 'Chị Lê Thị C', contact: 'Lê Thị C', phone: '0901-567-890',
        email: 'lethic@gmail.com', type: 'Cá nhân', totalProjects: 1,
        activeProjects: 0, totalRevenue: 80000000, portalActive: false,
    },
    {
        key: '5', name: 'Công ty GHI', contact: 'Phạm Văn Gia', phone: '0901-678-901',
        email: 'giapham@ghi.com', type: 'Doanh nghiệp', totalProjects: 2,
        activeProjects: 1, totalRevenue: 520000000, portalActive: true,
    },
    {
        key: '6', name: 'Ông Phạm Văn D', contact: 'Phạm Văn D', phone: '0901-789-012',
        email: '', type: 'Cá nhân', totalProjects: 1,
        activeProjects: 0, totalRevenue: 60000000, portalActive: false,
    },
    {
        key: '7', name: 'Bà Vũ Thị E', contact: 'Vũ Thị E', phone: '0901-890-123',
        email: 'vuthie@gmail.com', type: 'Cá nhân', totalProjects: 1,
        activeProjects: 1, totalRevenue: 95000000, portalActive: false,
    },
    {
        key: '8', name: 'Công ty JKL', contact: 'Hoàng Minh Tuấn', phone: '0901-901-234',
        email: 'tuanhoang@jkl.com', type: 'Doanh nghiệp', totalProjects: 1,
        activeProjects: 1, totalRevenue: 520000000, portalActive: true,
    },
];

/* ====== COMPONENT ====== */
const Customers: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [addModal, setAddModal] = useState(false);
    const [viewModal, setViewModal] = useState<any>(null);
    const [form] = Form.useForm();

    const filteredData = mockCustomers.filter(c =>
        !searchText || c.name.toLowerCase().includes(searchText.toLowerCase()) || c.contact.toLowerCase().includes(searchText.toLowerCase())
    );

    const generatePortalLink = (customer: any) => {
        const link = `https://portal.sira.vn/customer/${customer.key}`;
        navigator.clipboard.writeText(link);
        message.success(`Đã sao chép link cổng khách hàng: ${customer.name}`);
    };

    const columns: ColumnsType<any> = [
        {
            title: 'Khách hàng', dataIndex: 'name', key: 'name',
            render: (name: string, record: any) => (
                <Space>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: record.type === 'Doanh nghiệp' ? '#1890ff' : '#722ed1' }} />
                    <div>
                        <div style={{ fontWeight: 600 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{record.type}</div>
                    </div>
                </Space>
            ),
        },
        { title: 'Người liên hệ', dataIndex: 'contact', key: 'contact', width: 160 },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 130, render: (p: string) => <><PhoneOutlined /> {p}</> },
        { title: 'Email', dataIndex: 'email', key: 'email', width: 190, render: (e: string) => e || <span style={{ color: '#ccc' }}>-</span> },
        { title: 'Tổng DA', dataIndex: 'totalProjects', key: 'totalProjects', width: 90, align: 'center' as const },
        { title: 'Đang hoạt động', dataIndex: 'activeProjects', key: 'activeProjects', width: 120, align: 'center' as const },
        {
            title: 'Tổng doanh thu', dataIndex: 'totalRevenue', key: 'totalRevenue', width: 130, align: 'right' as const,
            render: (v: number) => `${(v / 1000000).toFixed(0)} tr`,
        },
        {
            title: 'Portal', dataIndex: 'portalActive', key: 'portalActive', width: 80, align: 'center' as const,
            render: (active: boolean) => active ? <Tag color="green">Bật</Tag> : <Tag color="default">Tắt</Tag>,
        },
        {
            title: '', key: 'actions', width: 100,
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="Chi tiết"><Button type="text" icon={<EyeOutlined />} size="small" onClick={() => setViewModal(record)} /></Tooltip>
                    <Tooltip title="Tạo link Portal"><Button type="text" icon={<LinkOutlined />} size="small" onClick={() => generatePortalLink(record)} /></Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>Quản Lý Khách Hàng</h2>
                <Space>
                    <Input placeholder="Tìm khách hàng..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 220 }} allowClear />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModal(true)}>Thêm Khách hàng</Button>
                </Space>
            </Row>

            {/* Summary */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}><Card size="small"><Statistic title="Tổng Khách hàng" value={mockCustomers.length} prefix={<UserOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Doanh nghiệp" value={mockCustomers.filter(c => c.type === 'Doanh nghiệp').length} valueStyle={{ color: '#722ed1' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Portal đang bật" value={mockCustomers.filter(c => c.portalActive).length} prefix={<LinkOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Tổng Doanh thu" value={mockCustomers.reduce((a, b) => a + b.totalRevenue, 0) / 1000000000} suffix="tỷ" precision={1} valueStyle={{ color: '#3f8600' }} /></Card></Col>
            </Row>

            <Card bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} khách hàng` }}
                    size="middle"
                />
            </Card>

            {/* Add Modal */}
            <Modal title="Thêm Khách hàng" open={addModal} onCancel={() => setAddModal(false)} onOk={() => { message.success('Đã thêm khách hàng!'); setAddModal(false); }} okText="Thêm" cancelText="Hủy">
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên Khách hàng" rules={[{ required: true }]}><Input placeholder="Tên công ty hoặc cá nhân" /></Form.Item>
                    <Form.Item name="contact" label="Người liên hệ"><Input /></Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email"><Input /></Form.Item>
                </Form>
            </Modal>

            {/* View Modal */}
            <Modal title={viewModal?.name} open={!!viewModal} onCancel={() => setViewModal(null)} footer={null} width={500}>
                {viewModal && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Loại"><Tag color={viewModal.type === 'Doanh nghiệp' ? 'blue' : 'purple'}>{viewModal.type}</Tag></Descriptions.Item>
                        <Descriptions.Item label="Người liên hệ">{viewModal.contact}</Descriptions.Item>
                        <Descriptions.Item label="SĐT"><PhoneOutlined /> {viewModal.phone}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewModal.email || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Tổng dự án">{viewModal.totalProjects}</Descriptions.Item>
                        <Descriptions.Item label="Đang hoạt động">{viewModal.activeProjects}</Descriptions.Item>
                        <Descriptions.Item label="Tổng doanh thu">{(viewModal.totalRevenue / 1000000).toFixed(0)} triệu</Descriptions.Item>
                        <Descriptions.Item label="Portal KH">{viewModal.portalActive ? <Tag color="green">Đã kích hoạt</Tag> : <Tag>Chưa kích hoạt</Tag>}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default Customers;
