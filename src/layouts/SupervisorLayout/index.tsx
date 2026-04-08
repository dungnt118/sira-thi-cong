import {
    DashboardOutlined,
    ProjectOutlined,
    CameraOutlined,
    AlertOutlined,
    TeamOutlined,
    FileDoneOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';
import { BaseLayout } from '../shared/BaseLayout';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/admin/gs/dashboard',
        icon: <DashboardOutlined />,
        label: LABELS.SUPERVISOR.DASHBOARD,
    },
    {
        key: '/admin/gs/projects',
        icon: <ProjectOutlined />,
        label: LABELS.SUPERVISOR.PROJECTS,
    },
    {
        key: '/admin/gs/evidence-queue',
        icon: <CameraOutlined />,
        label: LABELS.SUPERVISOR.EVIDENCE_QUEUE,
    },
    {
        key: '/admin/gs/quality-issues',
        icon: <AlertOutlined />,
        label: LABELS.SUPERVISOR.QUALITY_ISSUES,
    },
    {
        key: '/admin/gs/team-performance',
        icon: <TeamOutlined />,
        label: LABELS.SUPERVISOR.TEAM_PERFORMANCE,
    },
    {
        key: '/admin/gs/reports',
        icon: <FileDoneOutlined />,
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
                    gap: 10,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    padding: '0 8px',
                }}
            >
                <AppBrandLogo size="sm" variant="onDark" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>BAC Giám Sát</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AppBrandLogo size="sm" />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
                {/* Search, Notifications, Profile */}
            </div>
        </div>
    );
};

export const SupervisorLayout: React.FC = () => {
    return <BaseLayout sidebar={<SupervisorSidebar />} topBar={<SupervisorTopBar />} />;
};
