import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Tree, message, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

interface Role {
    _id: string;
    name: string;
    code: string;
    description: string;
    isSystem: boolean; // Cannot delete system roles
    userCount: number;
    permissions: string[];
    createdTime: Date;
}

/**
 * Role Management Page - 6 system roles + custom roles
 * System Roles: Admin, PM, Supervisor, Accountant, Outsource Leader, Staff
 * Construction-specific permissions
 */
const RoleManagement: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [form] = Form.useForm();

    // Construction-specific permissions tree
    const permissionsTree: DataNode[] = [
        {
            title: 'Dự án',
            key: 'projects',
            children: [
                { title: 'Xem tất cả dự án', key: 'projects.view_all' },
                { title: 'Xem dự án của mình', key: 'projects.view_own' },
                { title: 'Tạo dự án', key: 'projects.create' },
                { title: 'Chỉnh sửa dự án', key: 'projects.edit' },
                { title: 'Xóa dự án', key: 'projects.delete' },
                { title: 'Phân công nhóm', key: 'projects.assign_team' },
            ],
        },
        {
            title: 'Hình ảnh minh chứng',
            key: 'evidence',
            children: [
                { title: 'Xem minh chứng', key: 'evidence.view' },
                { title: 'Tải lên minh chứng', key: 'evidence.upload' },
                { title: 'Duyệt minh chứng', key: 'evidence.approve' },
                { title: 'Từ chối minh chứng', key: 'evidence.reject' },
            ],
        },
        {
            title: 'Vật tư',
            key: 'materials',
            children: [
                { title: 'Xem vật tư', key: 'materials.view' },
                { title: 'Tạo vật tư', key: 'materials.create' },
                { title: 'Duyệt chênh lệch vật tư', key: 'materials.approve_variance' },
            ],
        },
        {
            title: 'Chất lượng',
            key: 'quality',
            children: [
                { title: 'Xem vấn đề chất lượng', key: 'quality.view' },
                { title: 'Tạo vấn đề chất lượng', key: 'quality.create_issue' },
                { title: 'Giải quyết vấn đề', key: 'quality.resolve_issue' },
            ],
        },
        {
            title: 'Thanh toán',
            key: 'payment',
            children: [
                { title: 'Xem thanh toán', key: 'payment.view' },
                { title: 'Tạo cột mốc thanh toán', key: 'payment.create_milestone' },
                { title: 'Xác nhận thanh toán', key: 'payment.confirm' },
            ],
        },
        {
            title: 'Báo cáo',
            key: 'reports',
            children: [
                { title: 'Xem báo cáo', key: 'reports.view' },
                { title: 'Xuất báo cáo', key: 'reports.export' },
            ],
        },
        {
            title: 'Người dùng',
            key: 'users',
            children: [
                { title: 'Xem người dùng', key: 'users.view' },
                { title: 'Tạo người dùng', key: 'users.create' },
                { title: 'Chỉnh sửa người dùng', key: 'users.edit' },
                { title: 'Xóa người dùng', key: 'users.delete' },
            ],
        },
        {
            title: 'Nhật ký hệ thống',
            key: 'audit',
            children: [{ title: 'Xem nhật ký', key: 'audit.view' }],
        },
    ];

    // Mock data - 6 system roles + custom roles
    const mockRoles: Role[] = [
        {
            _id: '1',
            name: 'Admin',
            code: 'ADMIN',
            description: 'Quản trị viên hệ thống',
            isSystem: true,
            userCount: 2,
            permissions: ['projects.*', 'evidence.*', 'materials.*', 'quality.*', 'payment.*', 'reports.*', 'users.*', 'audit.*'],
            createdTime: new Date('2024-01-01'),
        },
        {
            _id: '2',
            name: 'PM',
            code: 'PM',
            description: 'Quản lý dự án',
            isSystem: true,
            userCount: 5,
            permissions: ['projects.*', 'evidence.view', 'evidence.approve', 'materials.*', 'quality.*', 'payment.view', 'payment.create_milestone', 'reports.*'],
            createdTime: new Date('2024-01-01'),
        },
        {
            _id: '3',
            name: 'Supervisor',
            code: 'SUPERVISOR',
            description: 'Giám sát thi công',
            isSystem: true,
            userCount: 8,
            permissions: ['projects.view_own', 'evidence.*', 'materials.view', 'quality.*', 'reports.view'],
            createdTime: new Date('2024-01-01'),
        },
        {
            _id: '4',
            name: 'Accountant',
            code: 'ACCOUNTANT',
            description: 'Kế toán',
            isSystem: true,
            userCount: 3,
            permissions: ['projects.view_all', 'payment.*', 'reports.*'],
            createdTime: new Date('2024-01-01'),
        },
        {
            _id: '5',
            name: 'Outsource Leader',
            code: 'OUTSOURCE_LEADER',
            description: 'Trưởng nhóm outsource',
            isSystem: true,
            userCount: 4,
            permissions: ['projects.view_own', 'evidence.view', 'evidence.upload', 'quality.view', 'reports.view'],
            createdTime: new Date('2024-01-01'),
        },
        {
            _id: '6',
            name: 'Staff',
            code: 'STAFF',
            description: 'Nhân viên',
            isSystem: true,
            userCount: 12,
            permissions: ['projects.view_own', 'evidence.view', 'evidence.upload'],
            createdTime: new Date('2024-01-01'),
        },
    ];

    const [roles] = useState<Role[]>(mockRoles);

    // Statistics
    const totalRoles = roles.length;
    const systemRoles = roles.filter((r) => r.isSystem).length;
    const customRoles = roles.filter((r) => !r.isSystem).length;
    const totalUsers = roles.reduce((sum, r) => sum + r.userCount, 0);

    // Table columns
    const columns: ColumnsType<Role> = [
        {
            title: 'Tên vai trò',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (text, record) => (
                <Space>
                    {record.isSystem && <SafetyOutlined style={{ color: '#1890ff' }} />}
                    <span style={{ fontWeight: record.isSystem ? 600 : 400 }}>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
            width: 150,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Loại',
            dataIndex: 'isSystem',
            key: 'isSystem',
            width: 120,
            render: (isSystem: boolean) => <Tag color={isSystem ? 'blue' : 'default'}>{isSystem ? 'Hệ thống' : 'Tùy chỉnh'}</Tag>,
        },
        {
            title: 'Số người dùng',
            dataIndex: 'userCount',
            key: 'userCount',
            width: 120,
            align: 'center',
        },
        {
            title: 'Số quyền',
            key: 'permissions',
            width: 100,
            align: 'center',
            render: (_, record) => record.permissions.length,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size="small" icon={<LockOutlined />} onClick={() => handleViewPermissions(record)}>
                        Quyền
                    </Button>
                    {!record.isSystem && (
                        <>
                            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                                Sửa
                            </Button>
                            <Button type="link" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>
                                Xóa
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const handleCreate = () => {
        setEditingRole(null);
        setSelectedPermissions([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setSelectedPermissions(role.permissions);
        form.setFieldsValue(role);
        setIsModalOpen(true);
    };

    const handleViewPermissions = (role: Role) => {
        setEditingRole(role);
        setSelectedPermissions(role.permissions);
        Modal.info({
            title: `Quyền của vai trò: ${role.name}`,
            width: 600,
            content: (
                <div style={{ marginTop: 16 }}>
                    <Tree
                        checkable
                        checkedKeys={role.permissions}
                        treeData={permissionsTree}
                        disabled
                        defaultExpandAll
                        selectable={false}
                    />
                </div>
            ),
            okText: 'Đóng',
        });
    };

    const handleDelete = (_roleId: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa vai trò?',
            content: 'Bạn có chắc muốn xóa vai trò này? Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                message.success('Đã xóa vai trò');
                // TODO: Call API to delete role
            },
        });
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values:', values);
            console.log('Selected permissions:', selectedPermissions);

            if (editingRole) {
                message.success('Cập nhật vai trò thành công');
            } else {
                message.success('Tạo vai trò mới thành công');
            }

            setIsModalOpen(false);
            form.resetFields();
            // TODO: Call API to create/update role
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handlePermissionCheck = (checkedKeys: any) => {
        setSelectedPermissions(checkedKeys as string[]);
    };

    return (
        <div style={{ padding: 24 }}>
            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng vai trò" value={totalRoles} prefix={<SafetyOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Vai trò hệ thống" value={systemRoles} valueStyle={{ color: '#1890ff' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Vai trò tùy chỉnh" value={customRoles} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng người dùng" value={totalUsers} prefix={<LockOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Actions */}
            <Card style={{ marginBottom: 16 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <SafetyOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                            <span style={{ fontSize: 16, fontWeight: 500 }}>6 vai trò hệ thống (không thể xóa)</span>
                        </Space>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                            Tạo vai trò tùy chỉnh
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Roles Table */}
            <Card title={`Danh sách vai trò (${roles.length})`}>
                <Table columns={columns} dataSource={roles} rowKey="_id" pagination={{ pageSize: 10 }} />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingRole ? 'Chỉnh sửa vai trò' : 'Tạo vai trò tùy chỉnh'}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={700}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên vai trò" rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}>
                        <Input placeholder="Ví dụ: Team Leader" />
                    </Form.Item>

                    <Form.Item name="code" label="Mã vai trò" rules={[{ required: true, message: 'Vui lòng nhập mã vai trò' }]}>
                        <Input placeholder="TEAM_LEADER" disabled={!!editingRole} />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={2} placeholder="Mô tả vai trò..." />
                    </Form.Item>

                    <Form.Item label="Phân quyền">
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: 12, maxHeight: 400, overflow: 'auto' }}>
                            <Tree
                                checkable
                                checkedKeys={selectedPermissions}
                                onCheck={handlePermissionCheck}
                                treeData={permissionsTree}
                                defaultExpandAll
                            />
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RoleManagement;
