import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    UserOutlined,
    TeamOutlined,
    DatabaseOutlined,
    SettingOutlined,
    SafetyOutlined,
    DashboardOutlined,
    ToolOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './Sidebar.css';

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems: MenuProps['items'] = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/users',
            icon: <UserOutlined />,
            label: 'Users',
            children: [
                { key: '/users', label: 'User List' },
                { key: '/roles', label: 'Roles' },
                { key: '/permissions', label: 'Permissions' },
            ],
        },
        {
            key: '/organization',
            icon: <TeamOutlined />,
            label: 'Organization',
            children: [
                { key: '/departments', label: 'Departments' },
            ],
        },
        {
            key: '/data',
            icon: <DatabaseOutlined />,
            label: 'Data Management',
            children: [
                { key: '/schemas', label: 'Schemas' },
                { key: '/workflows', label: 'Workflows' },
                { key: '/forms', label: 'Forms' },
            ],
        },
        {
            key: '/system',
            icon: <ToolOutlined />,
            label: 'System',
            children: [
                { key: '/system/settings', label: 'Settings' },
                { key: '/system/integrations', label: 'Integrations' },
                { key: '/system/email-templates', label: 'Email Templates' },
            ],
        },
        {
            key: '/security',
            icon: <SafetyOutlined />,
            label: 'Security',
            children: [
                { key: '/security/audit-log', label: 'Audit Log' },
                { key: '/security/access-control', label: 'Access Control' },
                { key: '/security/api-keys', label: 'API Keys' },
            ],
        },
        {
            key: '/monitoring',
            icon: <DashboardOutlined />,
            label: 'Monitoring',
            children: [
                { key: '/monitoring/system-health', label: 'System Health' },
                { key: '/monitoring/performance', label: 'Performance' },
                { key: '/monitoring/error-logs', label: 'Error Logs' },
            ],
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        navigate(key);
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            width={240}
            collapsedWidth={64}
            style={{
                background: '#FFFFFF',
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
                items={menuItems}
                onClick={handleMenuClick}
                style={{ borderRight: 0, paddingTop: 'var(--spacing-md)' }}
            />
        </Sider>
    );
};

export default Sidebar;
