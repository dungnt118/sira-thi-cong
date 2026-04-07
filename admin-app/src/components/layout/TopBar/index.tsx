import {
    BellOutlined,
    LogoutOutlined,
    SearchOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Badge, Dropdown, Input, Layout, Space } from 'antd';
import React from 'react';
import './TopBar.css';

const { Header } = Layout;

const TopBar: React.FC = () => {
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        },
    ];

    const notificationItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div>
                    <div style={{ fontWeight: 600 }}>High CPU usage</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Server 1 - 2 min ago</div>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div>
                    <div style={{ fontWeight: 600 }}>Failed backup</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Database - 15 min ago</div>
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <div>
                    <div style={{ fontWeight: 600 }}>License expiring</div>
                    <div style={{ fontSize: 12, color: '#999' }}>30 days remaining</div>
                </div>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'all',
            label: 'View all notifications',
        },
    ];

    return (
        <Header className="topbar">
            <div className="topbar-left">
                <div className="topbar-logo">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        decoding="async"
                        className="topbar-logo-img"
                    />
                    <span className="topbar-logo-text">BACAdmin</span>
                </div>
            </div>

            <div className="topbar-right">
                <Input
                    className="topbar-search"
                    placeholder="Search..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                />

                <Space size="large">
                    <Dropdown menu={{ items: notificationItems }} trigger={['click']} placement="bottomRight">
                        <Badge count={3} size="small">
                            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                        </Badge>
                    </Dropdown>

                    <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} />
                            <span>Admin</span>
                        </Space>
                    </Dropdown>
                </Space>
            </div>
        </Header>
    );
};

export default TopBar;
