import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    Tooltip,
    message,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    LockOutlined,
    PlusOutlined,
    SearchOutlined,
    SyncOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { authorizedUserService } from 'services/users/authorized-users/authorized-user.service';
import type { AuthorizedUser } from 'services/users/authorized-users/authorizedusers.types';
import { globalUserService } from 'services/users/global-users/global-user.service';
import { BAC_USER_CLIENT_ID, ROLE_COLOR_MAP, ROLE_LABEL_MAP, USER_ROLES } from 'services/users/user.constants';

const { Search } = Input;
const { Option } = Select;

type UserFormValues = {
    fullName: string;
    username: string;
    email: string;
    phoneNumber?: string;
    password?: string;
    roles: string[];
    defaultRole: string;
    isActive?: 'Active' | 'Inactive';
};

type PasswordResetFormValues = {
    newPassword: string;
    confirmPassword: string;
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<AuthorizedUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [filterRole, setFilterRole] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AuthorizedUser | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);
    const [passwordTargetUser, setPasswordTargetUser] = useState<AuthorizedUser | null>(null);
    const [form] = Form.useForm<UserFormValues>();
    const [passwordForm] = Form.useForm<PasswordResetFormValues>();

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
                let data = response.data;

                if (filterRole) {
                    data = data.filter((user) => {
                        const context = user.identity_contexts?.find((item) => item.clientId === BAC_USER_CLIENT_ID);
                        return context?.roles.includes(filterRole);
                    });
                }

                setUsers(data);
                setTotal(response.total);
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            message.error('Không thể tải danh sách người dùng.');
        } finally {
            setLoading(false);
        }
    }, [filterRole, filterStatus, page, pageSize, searchText]);

    useEffect(() => {
        void fetchUsers();
    }, [fetchUsers]);

    const closeUserModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        form.resetFields();
    };

    const handleOpenPasswordModal = (user: AuthorizedUser) => {
        if (!user.globalUserId) {
            message.error('Không tìm thấy GlobalUser liên kết để đổi mật khẩu.');
            return;
        }

        setPasswordTargetUser(user);
        passwordForm.resetFields();
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setPasswordTargetUser(null);
        passwordForm.resetFields();
    };

    const handlePasswordModalOk = async () => {
        const targetGlobalUserId = passwordTargetUser?.globalUserId;

        if (!targetGlobalUserId) {
            message.error('Không tìm thấy GlobalUser liên kết để đổi mật khẩu.');
            return;
        }

        try {
            const values = await passwordForm.validateFields();
            setPasswordSubmitting(true);

            await globalUserService.resetPassword(targetGlobalUserId, values.newPassword);

            const userLabel = passwordTargetUser?.username || passwordTargetUser?.email || 'tài khoản';
            message.success(`Đã đổi mật khẩu cho ${userLabel}.`);
            closePasswordModal();
        } catch (error: any) {
            console.error('Change password error:', error);
            message.error(error?.message || 'Không thể đổi mật khẩu tài khoản.');
        } finally {
            setPasswordSubmitting(false);
        }
    };

    const handleToggleStatus = async (user: AuthorizedUser) => {
        if (!user.globalUserId) {
            message.error('Không tìm thấy GlobalUser liên kết để thay đổi trạng thái.');
            return;
        }

        const newStatus = !user.isActive;
        const actionLabel = newStatus ? 'kích hoạt' : 'tạm ngưng';

        try {
            setLoading(true);
            const success = newStatus ? 
                await globalUserService.activateUser(user.globalUserId) : 
                await globalUserService.deactivateUser(user.globalUserId);

            if (success) {
                message.success(`Đã ${actionLabel} tài khoản ${user.username || user.fullName}.`);
                await fetchUsers();
            } else {
                throw new Error(`Không thể ${actionLabel} tài khoản.`);
            }
        } catch (error: any) {
            console.error(`Toggle status error (${actionLabel}):`, error);
            message.error(error?.message || `Lỗi khi ${actionLabel} tài khoản.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (user: AuthorizedUser) => {
        if (!user.globalUserId) {
            message.error('Không tìm thấy GlobalUser liên kết nên chưa thể xóa tài khoản.');
            return;
        }

        let authorizedUserDeleted = false;

        try {
            await authorizedUserService.deleteUser(user._id);
            authorizedUserDeleted = true;

            await globalUserService.deleteUser(user.globalUserId);

            message.success('Đã xóa tài khoản, bao gồm AuthorizedUser và GlobalUser.');
            await fetchUsers();
        } catch (error: any) {
            console.error('Delete user error:', error);

            if (authorizedUserDeleted) {
                message.error(error?.message || 'Đã xóa AuthorizedUser nhưng chưa xóa được GlobalUser. Vui lòng kiểm tra lại.');
                await fetchUsers();
                return;
            }

            message.error(error?.message || 'Không thể xóa tài khoản.');
        }
    };

    const handleEdit = (user: AuthorizedUser) => {
        setEditingUser(user);

        const context = user.identity_contexts?.find((item) => item.clientId === BAC_USER_CLIENT_ID);

        form.setFieldsValue({
            fullName: user.fullName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            username: user.username || '',
            roles: context?.roles || [],
            defaultRole: context?.defaultRole || '',
            isActive: user.isActive ? 'Active' : 'Inactive',
        });

        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingUser(null);
        form.resetFields();
        form.setFieldsValue({
            isActive: 'Active',
            roles: [],
        });
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            if (editingUser) {
                if (editingUser.globalUserId) {
                    const isGlobalUpdated = await globalUserService.updateUser({
                        userId: editingUser.globalUserId,
                        fullName: values.fullName,
                        email: values.email,
                        phoneNumber: values.phoneNumber,
                    });

                    if (!isGlobalUpdated) {
                        throw new Error('Không thể cập nhật GlobalUser.');
                    }
                }

                const isContextUpdated = await authorizedUserService.updateIdentityContext({
                    userId: editingUser._id,
                    clientId: BAC_USER_CLIENT_ID,
                    roles: values.roles,
                    defaultRole: values.defaultRole,
                });

                if (!isContextUpdated) {
                    throw new Error('Không thể cập nhật quyền của AuthorizedUser.');
                }

                message.success('Cập nhật người dùng thành công.');
            } else {
                const newGlobalUser = await globalUserService.createUser({
                    login: values.username,
                    password: values.password || '',
                    profile: {
                        displayName: values.fullName,
                        email: values.email,
                        phone: values.phoneNumber,
                    },
                });

                if (!newGlobalUser?.id) {
                    throw new Error('Không thể tạo GlobalUser.');
                }

                const newAuthorizedUser = await authorizedUserService.createAuthorizedUser({
                    globalUserId: newGlobalUser.id,
                    clientId: BAC_USER_CLIENT_ID,
                    roles: values.roles,
                    role: values.defaultRole,
                });

                if (!newAuthorizedUser?._id) {
                    throw new Error('Không thể tạo AuthorizedUser.');
                }

                message.success('Tạo người dùng mới thành công.');
            }

            closeUserModal();
            await fetchUsers();
        } catch (error: any) {
            console.error('Save user error:', error);
            message.error(error?.message || 'Thao tác thất bại.');
        } finally {
            setSubmitting(false);
        }
    };

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
                const context = record.identity_contexts?.find((item) => item.clientId === BAC_USER_CLIENT_ID);

                if (!context || !context.roles.length) {
                    return <Tag>Chưa gán quyền</Tag>;
                }

                return (
                    <Space size={[0, 4]} wrap>
                        {context.roles.map((role) => (
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
                const context = record.identity_contexts?.find((item) => item.clientId === BAC_USER_CLIENT_ID);
                const defaultRole = context?.defaultRole;

                if (!defaultRole) {
                    return '-';
                }

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
                <Tag color={isActive ? 'success' : 'default'} icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                    {isActive ? 'Hoạt động' : 'Ngừng'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 190,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Đổi mật khẩu">
                        <Button type="text" icon={<LockOutlined />} onClick={() => handleOpenPasswordModal(record)} />
                    </Tooltip>
                    <Tooltip title={record.isActive ? 'Tạm ngưng tài khoản' : 'Kích hoạt tài khoản'}>
                        <Popconfirm
                            title={`${record.isActive ? 'Tạm ngưng' : 'Kích hoạt'} tài khoản này?`}
                            onConfirm={() => handleToggleStatus(record)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button 
                                type="text" 
                                icon={record.isActive ? <CloseCircleOutlined style={{ color: '#faad14' }} /> : <CheckCircleOutlined style={{ color: '#52c41a' }} />} 
                            />
                        </Popconfirm>
                    </Tooltip>
                    <Popconfirm
                        title="Xóa tài khoản này?"
                        description="Thao tác sẽ xóa cả AuthorizedUser và GlobalUser."
                        onConfirm={() => handleDelete(record)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 0 }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic title="Tổng số tài khoản" value={total} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Đang hoạt động"
                            value={users.filter((user) => user.isActive).length}
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

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={10}>
                        <Search
                            placeholder="Tìm theo tên, email, username..."
                            allowClear
                            onSearch={(value) => {
                                setSearchText(value);
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
                            onChange={(value) => {
                                setFilterRole(value);
                                setPage(1);
                            }}
                        >
                            {USER_ROLES.map((role) => (
                                <Option key={role.Value} value={role.Value}>
                                    {role.Label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} md={5}>
                        <Select
                            placeholder="Trạng thái"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={(value) => {
                                setFilterStatus(value);
                                setPage(1);
                            }}
                        >
                            <Option value="Active">Hoạt động</Option>
                            <Option value="Inactive">Ngừng</Option>
                        </Select>
                    </Col>
                    <Col xs={24} md={4}>
                        <Button icon={<SyncOutlined spin={loading} />} onClick={() => void fetchUsers()} block>
                            Làm mới
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Card>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="_id"
                    loading={loading}
                    scroll={{ x: 1100 }}
                    pagination={{
                        current: page,
                        pageSize,
                        total,
                        onChange: (nextPage, nextPageSize) => {
                            setPage(nextPage);
                            setPageSize(nextPageSize);
                        },
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                />
            </Card>

            <Modal
                title={`Đổi mật khẩu${passwordTargetUser?.username ? ` - ${passwordTargetUser.username}` : ''}`}
                open={isPasswordModalOpen}
                onOk={handlePasswordModalOk}
                onCancel={closePasswordModal}
                confirmLoading={passwordSubmitting}
                okText="Cập nhật mật khẩu"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={passwordForm} layout="vertical">
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới.' },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Nhập lại mật khẩu mới"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu mới.' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(new Error('Mật khẩu xác nhận chưa khớp.'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={editingUser ? 'Cập nhật tài khoản' : 'Tạo mới tài khoản'}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={closeUserModal}
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
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên.' }]}
                            >
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="Tên đăng nhập"
                                rules={[{ required: true, message: 'Vui lòng nhập username.' }]}
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
                                    { required: true, message: 'Vui lòng nhập email.' },
                                    { type: 'email', message: 'Email không hợp lệ.' },
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
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu.' },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="roles"
                        label="Các vai trò khả dụng (BAC User)"
                        rules={[{ required: true, message: 'Chọn ít nhất 1 vai trò.' }]}
                    >
                        <Select mode="multiple" placeholder="Chọn các vai trò" style={{ width: '100%' }}>
                            {USER_ROLES.map((role) => (
                                <Option key={role.Value} value={role.Value}>
                                    {role.Label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate={(prev, current) => prev.roles !== current.roles}>
                        {({ getFieldValue }) => {
                            const selectedRoles = getFieldValue('roles') || [];

                            return (
                                <Form.Item
                                    name="defaultRole"
                                    label="Vai trò mặc định"
                                    rules={[{ required: true, message: 'Vui lòng chọn vai trò mặc định.' }]}
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
