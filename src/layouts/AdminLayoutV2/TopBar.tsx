import React from 'react';
import { Layout, Input, Badge, Avatar, Dropdown, Space } from 'antd';
import {
    SearchOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header } = Layout;
const { Search } = Input;

/**
 * AdminTopBar - Top navigation bar
 * Components: Logo, Global Search, Notifications, User Profile
 */
const AdminTopBar: React.FC = () => {
    const navigate = useNavigate();

    // User dropdown menu
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
            onClick: () => navigate('/admin-v2/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
            onClick: () => navigate('/admin-v2/settings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: () => {
                // TODO: Handle logout
                navigate('/login');
            },
        },
    ];

    const handleSearch = (value: string) => {
        console.log('Search:', value);
        // TODO: Implement global search
    };

    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fff',
                padding: '0 24px',
                borderBottom: '1px solid #f0f0f0',
                height: 64,
            }}
        >
            {/* Logo & App Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #1976D2, #42A5F5)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}
                >
                    S
                </div>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#1976D2' }}>
                    SIRA Admin
                </span>
            </div>

            {/* Global Search */}
            <Search
                placeholder="Tìm kiếm người dùng, dự án..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 400 }}
                prefix={<SearchOutlined />}
            />

            {/* Right Section: Notifications + User */}
            <Space size={24}>
                {/* Notifications */}
                <Badge count={3} offset={[-5, 5]}>
                    <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                </Badge>

                {/* User Profile */}
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <Space style={{ cursor: 'pointer' }}>
                        <Avatar icon={<UserOutlined />} style={{ background: '#1976D2' }} />
                        <span style={{ fontWeight: 500 }}>Admin</span>
                    </Space>
                </Dropdown>
            </Space>
        </Header>
    );
};

export default AdminTopBar;
