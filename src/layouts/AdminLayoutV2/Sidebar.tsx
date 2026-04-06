import {
    BarChartOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    FileTextOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: 'Quản lý người dùng',
        },
        {
            key: '/admin/master-data',
            icon: <DatabaseOutlined />,
            label: 'Quản lý Master Data',
        },
        {
            key: '/admin/audit',
            icon: <FileTextOutlined />,
            label: 'Nhật ký hệ thống',
        },
        {
            key: '/admin/reports',
            icon: <BarChartOutlined />,
            label: 'Báo cáo',
        },
        {
            key: '/admin/settings',
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
