import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    ProjectOutlined,
    TeamOutlined,
    UserOutlined,
    DollarOutlined,
    BarChartOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import { BaseLayout } from '../shared/BaseLayout';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/pm/dashboard',
        icon: <DashboardOutlined />,
        label: LABELS.PM.DASHBOARD,
    },
    {
        key: '/pm/projects',
        icon: <ProjectOutlined />,
        label: LABELS.PM.PROJECTS,
        children: [
            {
                key: '/pm/projects/all',
                label: LABELS.PM.ALL_PROJECTS,
            },
            {
                key: '/pm/projects/my',
                label: LABELS.PM.MY_PROJECTS,
            },
            {
                key: '/pm/projects/create',
                label: LABELS.PM.CREATE_PROJECT,
            },
        ],
    },
    {
        key: '/pm/teams',
        icon: <TeamOutlined />,
        label: LABELS.PM.TEAMS,
        children: [
            {
                key: '/pm/teams/internal',
                label: LABELS.PM.INTERNAL_TEAMS,
            },
            {
                key: '/pm/teams/outsource',
                label: LABELS.PM.OUTSOURCE_COMPANIES,
            },
        ],
    },
    {
        key: '/pm/customers',
        icon: <UserOutlined />,
        label: LABELS.PM.CUSTOMERS,
    },
    {
        key: '/pm/financials',
        icon: <DollarOutlined />,
        label: LABELS.PM.FINANCIALS,
        children: [
            {
                key: '/pm/financials/milestones',
                label: LABELS.PM.PAYMENT_MILESTONES,
            },
            {
                key: '/pm/financials/transactions',
                label: LABELS.PM.TRANSACTIONS,
            },
        ],
    },
    {
        key: '/pm/reports',
        icon: <BarChartOutlined />,
        label: LABELS.PM.REPORTS,
    },
];

const PMSidebar: React.FC = () => {
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
                SIRA PM
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['/pm/projects', '/pm/teams', '/pm/financials']}
                items={menuItems}
                onClick={handleMenuClick}
            />
        </div>
    );
};

const PMTopBar: React.FC = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
            <div>{/* Breadcrumbs */}</div>
            <div style={{ display: 'flex', gap: 16 }}>
                {/* Search, Notifications, Profile */}
            </div>
        </div>
    );
};

export const PMLayout: React.FC = () => {
    return <BaseLayout sidebar={<PMSidebar />} topBar={<PMTopBar />} />;
};
