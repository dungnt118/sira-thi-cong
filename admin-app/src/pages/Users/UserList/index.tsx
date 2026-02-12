import React from 'react';
import { Card, Table, Button, Input, Space, Tag, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './UserList.css';

const UserList: React.FC = () => {
    const userData = [
        {
            key: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Admin',
            department: 'IT',
            status: 'active',
            lastLogin: '2024-02-12 10:30',
        },
        {
            key: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'Manager',
            department: 'HR',
            status: 'active',
            lastLogin: '2024-02-12 09:15',
        },
        {
            key: '3',
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            role: 'User',
            department: 'Sales',
            status: 'inactive',
            lastLogin: '2024-02-10 14:20',
        },
        {
            key: '4',
            name: 'Alice Brown',
            email: 'alice.brown@example.com',
            role: 'Manager',
            department: 'Finance',
            status: 'active',
            lastLogin: '2024-02-12 11:45',
        },
    ];

    const actionMenuItems: MenuProps['items'] = [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            danger: true,
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                { text: 'Admin', value: 'Admin' },
                { text: 'Manager', value: 'Manager' },
                { text: 'User', value: 'User' },
            ],
            onFilter: (value: any, record: any) => record.role === value,
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'default'}>
                    {status.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' },
            ],
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: 'Last Login',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            sorter: (a: any, b: any) => a.lastLogin.localeCompare(b.lastLogin),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Dropdown menu={{ items: actionMenuItems }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div className="user-list">
            <h1>User Management</h1>

            <Card style={{ marginTop: 24 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {/* Toolbar */}
                    <div className="user-list-toolbar">
                        <Input
                            placeholder="Search users..."
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                        <Button type="primary" icon={<PlusOutlined />}>
                            Create User
                        </Button>
                    </div>

                    {/* Table */}
                    <Table
                        columns={columns}
                        dataSource={userData}
                        pagination={{
                            total: userData.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} users`,
                        }}
                    />
                </Space>
            </Card>
        </div>
    );
};

export default UserList;
