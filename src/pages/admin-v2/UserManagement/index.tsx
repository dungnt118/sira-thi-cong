import React, { useState } from 'react';
import {
    Card,
    Table,
    Button,
    Input,
    Space,
    Tag,
    Modal,
    Form,
    Select,
    Row,
    Col,
    Statistic,
    Popconfirm,
    message,
} from 'antd';
import {
    UserOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    username: string;
    role: 'Admin' | 'PM' | 'Supervisor' | 'Accountant' | 'Outsource Leader' | 'Staff';
    outsourceCompanyId?: string;
    outsourceCompanyName?: string;
    status: 'Active' | 'Inactive';
    lastLogin?: Date;
    createdTime: Date;
}

/**
 * User Management Page - CRUD for 6 roles
 * Roles: Admin, PM, Supervisor, Accountant, Outsource Leader, Staff
 */
const UserManagement: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [filterRole, setFilterRole] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm();

    // Mock data - replace with GraphQL/API calls
    const mockUsers: User[] = [
        {
            _id: '1',
            name: 'Nguyễn Văn A',
            email: 'admin@sira.vn',
            phone: '0901234567',
            username: 'admin',
            role: 'Admin',
            status: 'Active',
            lastLogin: new Date('2024-02-13T08:30:00'),
            createdTime: new Date('2024-01-01'),
        },
        {
            _id: '2',
            name: 'Trần Thị B',
            email: 'pm.tranb@sira.vn',
            phone: '0902345678',
            username: 'pm_tranb',
            role: 'PM',
            status: 'Active',
            lastLogin: new Date('2024-02-13T09:15:00'),
            createdTime: new Date('2024-01-05'),
        },
        {
            _id: '3',
            name: 'Lê Văn C',
            email: 'supervisor.lec@sira.vn',
            phone: '0903456789',
            username: 'sv_lec',
            role: 'Supervisor',
            status: 'Active',
            lastLogin: new Date('2024-02-12T16:45:00'),
            createdTime: new Date('2024-01-10'),
        },
        {
            _id: '4',
            name: 'Phạm Thị D',
            email: 'accountant@sira.vn',
            phone: '0904567890',
            username: 'acc_phamd',
            role: 'Accountant',
            status: 'Active',
            lastLogin: new Date('2024-02-13T07:20:00'),
            createdTime: new Date('2024-01-15'),
        },
        {
            _id: '5',
            name: 'Hoàng Văn E',
            email: 'partner@company-a.vn',
            phone: '0905678901',
            username: 'partner_hoange',
            role: 'Outsource Leader',
            outsourceCompanyId: 'company-a',
            outsourceCompanyName: 'Công ty TNHH Xây dựng A',
            status: 'Active',
            lastLogin: new Date('2024-02-13T06:00:00'),
            createdTime: new Date('2024-02-01'),
        },
        {
            _id: '6',
            name: 'Vũ Thị F',
            email: 'staff.vuf@sira.vn',
            phone: '0906789012',
            username: 'staff_vuf',
            role: 'Staff',
            status: 'Inactive',
            createdTime: new Date('2024-01-20'),
        },
    ];

    const [users] = useState<User[]>(mockUsers);

    // Statistics
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'Active').length;
    const usersByRole = {
        Admin: users.filter((u) => u.role === 'Admin').length,
        PM: users.filter((u) => u.role === 'PM').length,
        Supervisor: users.filter((u) => u.role === 'Supervisor').length,
        Accountant: users.filter((u) => u.role === 'Accountant').length,
        'Outsource Leader': users.filter((u) => u.role === 'Outsource Leader').length,
        Staff: users.filter((u) => u.role === 'Staff').length,
    };

    // Filtered users
    const filteredUsers = users.filter((user) => {
        const matchSearch =
            !searchText ||
            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.username.toLowerCase().includes(searchText.toLowerCase());

        const matchRole = !filterRole || user.role === filterRole;
        const matchStatus = !filterStatus || user.status === filterStatus;

        return matchSearch && matchRole && matchStatus;
    });

    // Table columns
    const columns: ColumnsType<User> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 120,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 120,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 140,
            render: (role: string) => {
                const colors: Record<string, string> = {
                    Admin: 'red',
                    PM: 'blue',
                    Supervisor: 'green',
                    Accountant: 'orange',
                    'Outsource Leader': 'purple',
                    Staff: 'default',
                };
                return <Tag color={colors[role]}>{role}</Tag>;
            },
        },
        {
            title: 'Công ty (nếu Outsource)',
            dataIndex: 'outsourceCompanyName',
            key: 'outsourceCompanyName',
            width: 180,
            render: (text) => text || '-',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Tag color={status === 'Active' ? 'success' : 'default'} icon={status === 'Active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                    {status === 'Active' ? 'Hoạt động' : 'Ngừng'}
                </Tag>
            ),
        },
        {
            title: 'Đăng nhập lần cuối',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            width: 150,
            render: (date?: Date) => (date ? new Date(date).toLocaleString('vi-VN') : '-'),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận vô hiệu hóa?"
                        description={`Bạn có chắc muốn vô hiệu hóa người dùng "${record.name}"?`}
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleCreate = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalOpen(true);
    };

    const handleDelete = (userId: string) => {
        message.success('Đã vô hiệu hóa người dùng');
        // TODO: Call API to deactivate user
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values:', values);

            if (editingUser) {
                message.success('Cập nhật người dùng thành công');
            } else {
                message.success('Tạo người dùng mới thành công');
            }

            setIsModalOpen(false);
            form.resetFields();
            // TODO: Call API to create/update user
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleRoleChange = (role: string) => {
        // Clear outsourceCompanyId if role is not Outsource Leader
        if (role !== 'Outsource Leader') {
            form.setFieldsValue({ outsourceCompanyId: undefined });
        }
    };

    return (
        <div style={{ padding: 24 }}>
            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng người dùng" value={totalUsers} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Đang hoạt động" value={activeUsers} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="PM" value={usersByRole.PM} />
                        <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                            Supervisor: {usersByRole.Supervisor} | Outsource: {usersByRole['Outsource Leader']}
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Nhân viên" value={usersByRole.Staff} />
                        <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                            Admin: {usersByRole.Admin} | Accountant: {usersByRole.Accountant}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Filters & Actions */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Space size="middle">
                            <Search
                                placeholder="Tìm theo tên, email, username..."
                                allowClear
                                style={{ width: 300 }}
                                onChange={(e) => setSearchText(e.target.value)}
                                prefix={<SearchOutlined />}
                            />
                            <Select placeholder="Vai trò" allowClear style={{ width: 160 }} onChange={setFilterRole}>
                                <Option value="Admin">Admin</Option>
                                <Option value="PM">PM</Option>
                                <Option value="Supervisor">Supervisor</Option>
                                <Option value="Accountant">Accountant</Option>
                                <Option value="Outsource Leader">Outsource Leader</Option>
                                <Option value="Staff">Staff</Option>
                            </Select>
                            <Select placeholder="Trạng thái" allowClear style={{ width: 140 }} onChange={setFilterStatus}>
                                <Option value="Active">Hoạt động</Option>
                                <Option value="Inactive">Ngừng</Option>
                            </Select>
                        </Space>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                            Tạo người dùng mới
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Users Table */}
            <Card title={`Danh sách người dùng (${filteredUsers.length})`}>
                <Table columns={columns} dataSource={filteredUsers} rowKey="_id" scroll={{ x: 1400 }} pagination={{ pageSize: 10, showSizeChanger: true }} />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingUser ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                        <Input placeholder="Nguyễn Văn A" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input placeholder="user@sira.vn" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
                                <Input placeholder="0901234567" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Vui lòng nhập username' }]}>
                                <Input placeholder="username" disabled={!!editingUser} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {!editingUser && (
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>
                    )}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                                <Select placeholder="Chọn vai trò" onChange={handleRoleChange}>
                                    <Option value="Admin">Admin</Option>
                                    <Option value="PM">PM</Option>
                                    <Option value="Supervisor">Supervisor</Option>
                                    <Option value="Accountant">Accountant</Option>
                                    <Option value="Outsource Leader">Outsource Leader</Option>
                                    <Option value="Staff">Staff</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
                                <Select placeholder="Chọn trạng thái">
                                    <Option value="Active">Hoạt động</Option>
                                    <Option value="Inactive">Ngừng</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item noStyle shouldUpdate={(prev, curr) => prev.role !== curr.role}>
                        {({ getFieldValue }) =>
                            getFieldValue('role') === 'Outsource Leader' ? (
                                <Form.Item name="outsourceCompanyId" label="Cộng tác viên" rules={[{ required: true, message: 'Vui lòng chọn công ty' }]}>
                                    <Select placeholder="Chọn công ty">
                                        <Option value="company-a">Công ty TNHH Xây dựng A</Option>
                                        <Option value="company-b">Công ty TNHH Xây dựng B</Option>
                                        <Option value="company-c">Công ty TNHH Xây dựng C</Option>
                                    </Select>
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
