import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    ProjectOutlined,
    FileImageOutlined,
    WarningOutlined,
    TeamOutlined,
    BarChartOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import { BaseLayout } from '../shared/BaseLayout';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/supervisor/dashboard',
        icon: <DashboardOutlined />,
        label: LABELS.SUPERVISOR.DASHBOARD,
    },
    {
        key: '/supervisor/projects',
        icon: <ProjectOutlined />,
        label: LABELS.SUPERVISOR.PROJECTS,
    },
    {
        key: '/supervisor/evidence-queue',
        icon: <FileImageOutlined />,
        label: LABELS.SUPERVISOR.EVIDENCE_QUEUE,
    },
    {
        key: '/supervisor/quality-issues',
        icon: <WarningOutlined />,
        label: LABELS.SUPERVISOR.QUALITY_ISSUES,
    },
    {
        key: '/supervisor/team-performance',
        icon: <TeamOutlined />,
        label: LABELS.SUPERVISOR.TEAM_PERFORMANCE,
    },
    {
        key: '/supervisor/reports',
        icon: <BarChartOutlined />,
        label: LABELS.SUPERVISOR.REPORTS,
    },
];

const SupervisorSidebar: React.FC = () => {
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
                SIRA Giám Sát
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
            />
        </div>
    );
};

const SupervisorTopBar: React.FC = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
            <div>{/* Breadcrumbs */}</div>
            <div style={{ display: 'flex', gap: 16 }}>
                {/* Search, Notifications, Profile */}
            </div>
        </div>
    );
};

export const SupervisorLayout: React.FC = () => {
    return <BaseLayout sidebar={<SupervisorSidebar />} topBar={<SupervisorTopBar />} />;
};
