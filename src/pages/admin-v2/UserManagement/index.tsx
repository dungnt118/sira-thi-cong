import React, { useCallback, useEffect, useState } from 'react';
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
    Tooltip,
} from 'antd';
import {
    UserOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useOutletContext } from 'react-router-dom';

// Services & Constants
import { globalUserService } from 'services/users/global-users/global-user.service';
import { authorizedUserService } from 'services/users/authorized-users/authorized-user.service';
import { BAC_USER_CLIENT_ID, ROLE_COLOR_MAP, ROLE_LABEL_MAP, USER_ROLES } from 'services/users/user.constants';
import type { AuthorizedUser, IdentityContext } from 'services/users/authorized-users/authorizedusers.types';
import type { IGlobalUser } from 'services/users/global-users/global-user.types';

const { Search } = Input;
const { Option } = Select;

/**
 * User Management Page - Refactored for BAC User Client
 * Managed Roles: QL, GS, KYT, KT, KD, ADMIN
 */
const UserManagement: React.FC = () => {
    const { isMobile } = useOutletContext<{ isMobile: boolean }>();
    
    // State
    const [users, setUsers] = useState<AuthorizedUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // Filters
    const [searchText, setSearchText] = useState('');
    const [filterRole, setFilterRole] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AuthorizedUser | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    /**
     * Fetch users from backend
     */
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await authorizedUserService.searchUsers({
                keyword: searchText,
                clientId: BAC_USER_CLIENT_ID,
                isActive: filterStatus === 'Active' ? true : filterStatus === 'Inactive' ? false : null,
                page,
                pageSize,
            });

            if (response.success) {
                // Further filter by role if needed (client-side if server doesn't support direct role filter in search)
                let data = response.data;
                if (filterRole) {
                    data = data.filter(u => {
                        const context = u.identity_contexts?.find(ctx => ctx.clientId === BAC_USER_CLIENT_ID);
                        return context?.roles.includes(filterRole);
                    });
                }
                setUsers(data);
                setTotal(response.total);
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            message.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    }, [searchText, filterStatus, filterRole, page, pageSize]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    /**
     * Delete/Deactivate User
     */
    const handleDelete = async (userId: string) => {
        try {
            const success = await authorizedUserService.deactivateUser(userId);
            if (success) {
                message.success('Đã vô hiệu hóa người dùng');
                fetchUsers();
            } else {
                message.error('Vô hiệu hóa thất bại');
            }
        } catch (error) {
            message.error('Lỗi khi vô hiệu hóa người dùng');
        }
    };

    /**
     * Table columns
     */
    const columns: ColumnsType<AuthorizedUser> = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 180,
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>@{record.username}</div>
                </div>
            ),
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            width: 220,
            render: (_, record) => (
                <div>
                    <div>{record.email}</div>
                    <div style={{ fontSize: '12px' }}>{record.phoneNumber}</div>
                </div>
            ),
        },
        {
            title: 'Vai trò',
            key: 'roles',
            width: 250,
            render: (_, record) => {
                const context = record.identity_contexts?.find(ctx => ctx.clientId === BAC_USER_CLIENT_ID);
                if (!context || !context.roles.length) return <Tag>Chưa gán quyền</Tag>;
                
                return (
                    <Space size={[0, 4]} wrap>
                        {context.roles.map(role => (
                            <Tag key={role} color={ROLE_COLOR_MAP[role] || 'blue'}>
                                {ROLE_LABEL_MAP[role] || role}
                            </Tag>
                        ))}
                    </Space>
                );
            },
        },
        {
            title: 'Vai trò mặc định',
            key: 'defaultRole',
            width: 150,
            render: (_, record) => {
                const context = record.identity_contexts?.find(ctx => ctx.clientId === BAC_USER_CLIENT_ID);
                const defaultRole = context?.defaultRole;
                if (!defaultRole) return '-';
                
                return (
                    <Tag color="gold" style={{ fontWeight: 'bold' }}>
                        {ROLE_LABEL_MAP[defaultRole] || defaultRole}
                    </Tag>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 120,
            render: (isActive: boolean) => (
                <Tag 
                    color={isActive ? 'success' : 'default'} 
                    icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                >
                    {isActive ? 'Hoạt động' : 'Ngừng'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            onClick={() => handleEdit(record)} 
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Vô hiệu hóa người dùng?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    /**
     * Edit User
     */
    const handleEdit = (user: AuthorizedUser) => {
        setEditingUser(user);
        const context = user.identity_contexts?.find(ctx => ctx.clientId === BAC_USER_CLIENT_ID);
        
        form.setFieldsValue({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            username: user.username,
            roles: context?.roles || [],
            defaultRole: context?.defaultRole || '',
            isActive: user.isActive ? 'Active' : 'Inactive',
        });
        setIsModalOpen(true);
    };

    /**
     * Create User
     */
    const handleCreate = () => {
        setEditingUser(null);
        form.resetFields();
        form.setFieldsValue({ isActive: 'Active', roles: [] });
        setIsModalOpen(true);
    };

    /**
     * Save User (Create or Update)
     */
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            if (editingUser) {
                // 1. Update Global User
                if (editingUser.globalUserId) {
                    await globalUserService.updateUser({
                        userId: editingUser.globalUserId,
                        fullName: values.fullName,
                        email: values.email,
                        phoneNumber: values.phoneNumber,
                    });
                }

                // 2. Update Identity Context (Roles & Default Role)
                await authorizedUserService.updateIdentityContext({
                    userId: editingUser._id,
                    clientId: BAC_USER_CLIENT_ID,
                    roles: values.roles,
                    defaultRole: values.defaultRole,
                });

                message.success('Cập nhật người dùng thành công');
            } else {
                // NEW USER FLOW
                // 1. Create Global User
                const newGlobalUser = await globalUserService.createUser({
                    login: values.username,
                    password: values.password,
                    profile: {
                        displayName: values.fullName,
                        email: values.email,
                        phone: values.phoneNumber,
                    }
                });

                if (newGlobalUser && newGlobalUser.id) {
                    // 2. Create Authorized User with roles & default role
                    await authorizedUserService.createAuthorizedUser({
                        globalUserId: newGlobalUser.id,
                        clientId: BAC_USER_CLIENT_ID,
                        roles: values.roles,
                        role: values.defaultRole,
                    });
                    message.success('Tạo người dùng mới thành công');
                }
            }

            setIsModalOpen(false);
            fetchUsers();
        } catch (error: any) {
            console.error('Save user error:', error);
            message.error(error.message || 'Thao tác thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: 0 }}>
            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic 
                            title="Tổng số tài khoản" 
                            value={total} 
                            prefix={<UserOutlined />} 
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic 
                            title="Đang hoạt động" 
                            value={users.filter(u => u.isActive).length} 
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CheckCircleOutlined />} 
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Button 
                        type="primary" 
                        size="large"
                        icon={<PlusOutlined />} 
                        onClick={handleCreate}
                        block
                        style={{ height: '100%' }}
                    >
                        Tạo người dùng mới
                    </Button>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={10}>
                        <Search
                            placeholder="Tìm theo tên, email, username..."
                            allowClear
                            onSearch={val => {
                                setSearchText(val);
                                setPage(1);
                            }}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col xs={12} md={5}>
                        <Select 
                            placeholder="Vai trò" 
                            allowClear 
                            style={{ width: '100%' }} 
                            onChange={val => {
                                setFilterRole(val);
                                setPage(1);
                            }}
                        >
                            {USER_ROLES.map(role => (
                                <Option key={role.Value} value={role.Value}>{role.Label}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} md={5}>
                        <Select 
                            placeholder="Trạng thái" 
                            allowClear 
                            style={{ width: '100%' }} 
                            onChange={val => {
                                setFilterStatus(val);
                                setPage(1);
                            }}
                        >
                            <Option value="Active">Hoạt động</Option>
                            <Option value="Inactive">Ngừng</Option>
                        </Select>
                    </Col>
                    <Col xs={24} md={4}>
                        <Button 
                            icon={<SyncOutlined spin={loading} />} 
                            onClick={fetchUsers}
                            block
                        >
                            Làm mới
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card>
                <Table 
                    columns={columns} 
                    dataSource={users} 
                    rowKey="_id" 
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        onChange: (p, s) => {
                            setPage(p);
                            setPageSize(s);
                        },
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingUser ? 'Cập nhật tài khoản' : 'Tạo mới tài khoản'}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={submitting}
                width={700}
                okText="Lưu thông tin"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} layout="vertical" initialValues={{ roles: [] }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item 
                                name="fullName" 
                                label="Họ và tên" 
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            >
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                name="username" 
                                label="Tên đăng nhập" 
                                rules={[{ required: true, message: 'Vui lòng nhập username' }]}
                            >
                                <Input placeholder="username" disabled={!!editingUser} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item 
                                name="email" 
                                label="Email" 
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' },
                                ]}
                            >
                                <Input placeholder="email@domain.com" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phoneNumber" label="Số điện thoại">
                                <Input placeholder="090..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    {!editingUser && (
                        <Form.Item 
                            name="password" 
                            label="Mật khẩu khởi tạo" 
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    )}

                    <Form.Item 
                        name="roles" 
                        label="Các vai trò khả dụng (BAC User)" 
                        rules={[{ required: true, message: 'Chọn ít nhất 1 vai trò' }]}
                    >
                        <Select 
                            mode="multiple" 
                            placeholder="Chọn các vai trò"
                            style={{ width: '100%' }}
                        >
                            {USER_ROLES.map(role => (
                                <Option key={role.Value} value={role.Value}>{role.Label}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate={(prev, curr) => prev.roles !== curr.roles}>
                        {({ getFieldValue }) => {
                            const selectedRoles = getFieldValue('roles') || [];
                            return (
                                <Form.Item 
                                    name="defaultRole" 
                                    label="Vai trò mặc định" 
                                    rules={[{ required: true, message: 'Vui lòng chọn vai trò mặc định' }]}
                                >
                                    <Select placeholder="Chọn vai trò mặc định">
                                        {selectedRoles.map((role: string) => (
                                            <Option key={role} value={role}>
                                                {ROLE_LABEL_MAP[role] || role}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
