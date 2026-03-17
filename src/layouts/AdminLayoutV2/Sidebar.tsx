import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    SafetyOutlined,
    FileTextOutlined,
    BarChartOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface AdminSidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
    isDrawer?: boolean;
    onItemClick?: () => void;
}

/**
 * AdminSidebar - Simplified 6-item menu
 * Menu: Dashboard, Users, Roles, Audit Log, Reports, Settings
 */
const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onCollapse, isDrawer, onItemClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Menu items
    const menuItems: MenuProps['items'] = [
        {
            key: '/admin-v2',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin-v2/users',
            icon: <UserOutlined />,
            label: 'Quản lý người dùng',
        },
        {
            key: '/admin-v2/roles',
            icon: <SafetyOutlined />,
            label: 'Quản lý vai trò',
        },
        {
            key: '/admin-v2/audit',
            icon: <FileTextOutlined />,
            label: 'Nhật ký hệ thống',
        },
        {
            key: '/admin-v2/reports',
            icon: <BarChartOutlined />,
            label: 'Báo cáo',
        },
        {
            key: '/admin-v2/settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        navigate(key);
        if (onItemClick) {
            onItemClick();
        }
    };

    // Get current selected key
    const selectedKey = location.pathname;

    const menu = (
        <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={menuItems}
            style={{
                height: '100%',
                borderRight: 0,
                paddingTop: 16,
            }}
        />
    );

    if (isDrawer) {
        return menu;
    }

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            width={240}
            style={{
                background: '#fff',
                borderRight: '1px solid #f0f0f0',
            }}
        >
            {menu}
        </Sider>
    );
};

export default AdminSidebar;
