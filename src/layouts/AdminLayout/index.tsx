import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    DatabaseOutlined,
    SettingOutlined,
    SafetyOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import { BaseLayout } from '../shared/BaseLayout';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/admin/dashboard',
        icon: <DashboardOutlined />,
        label: LABELS.ADMIN.DASHBOARD,
    },
    {
        key: '/admin/users',
        icon: <UserOutlined />,
        label: LABELS.ADMIN.USER_MANAGEMENT,
    },
    {
        key: '/admin/organization',
        icon: <TeamOutlined />,
        label: LABELS.ADMIN.DEPARTMENT_HIERARCHY,
    },
    {
        key: '/admin/data',
        icon: <DatabaseOutlined />,
        label: 'Quản Lý Dữ Liệu',
        children: [
            {
                key: '/admin/schemas',
                label: LABELS.ADMIN.SCHEMA_MANAGEMENT,
            },
            {
                key: '/admin/workflows',
                label: LABELS.ADMIN.WORKFLOW_DESIGNER,
            },
            {
                key: '/admin/forms',
                label: LABELS.ADMIN.FORM_BUILDER,
            },
        ],
    },
    {
        key: '/admin/system',
        icon: <SettingOutlined />,
        label: 'Cấu Hình Hệ Thống',
        children: [
            {
                key: '/admin/system-settings',
                label: LABELS.ADMIN.SYSTEM_SETTINGS,
            },
            {
                key: '/admin/integrations',
                label: LABELS.ADMIN.INTEGRATION_MANAGEMENT,
            },
            {
                key: '/admin/menus',
                label: LABELS.ADMIN.MENU_MANAGEMENT,
            },
        ],
    },
    {
        key: '/admin/security',
        icon: <SafetyOutlined />,
        label: LABELS.ADMIN.SECURITY_SETTINGS,
        children: [
            {
                key: '/admin/roles',
                label: LABELS.ADMIN.ROLE_MANAGEMENT,
            },
            {
                key: '/admin/access-control',
                label: LABELS.ADMIN.ACCESS_CONTROL,
            },
            {
                key: '/admin/api-keys',
                label: LABELS.ADMIN.API_KEYS,
            },
        ],
    },
    {
        key: '/admin/monitoring',
        icon: <LineChartOutlined />,
        label: 'Giám Sát',
        children: [
            {
                key: '/admin/performance',
                label: LABELS.ADMIN.PERFORMANCE_DASHBOARD,
            },
            {
                key: '/admin/audit-log',
                label: LABELS.ADMIN.AUDIT_LOG,
            },
            {
                key: '/admin/error-logs',
                label: LABELS.ADMIN.ERROR_LOGS,
            },
        ],
    },
];

const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div
                style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                }}
            >
                SIRA Admin
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['/admin/data', '/admin/system', '/admin/security', '/admin/monitoring']}
                items={menuItems}
                onClick={handleMenuClick}
            />
        </div>
    );
};

const AdminTopBar: React.FC = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
            <div>{/* Breadcrumbs will go here */}</div>
            <div style={{ display: 'flex', gap: 16 }}>
                {/* Search, Notifications, Profile will go here */}
            </div>
        </div>
    );
};

export const AdminLayout: React.FC = () => {
    return <BaseLayout sidebar={<AdminSidebar />} topBar={<AdminTopBar />} />;
};
