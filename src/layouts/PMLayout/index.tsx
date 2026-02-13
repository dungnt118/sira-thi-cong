import React from 'react';
import { Menu, Input, Badge, Avatar, Dropdown, Space, Grid } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    ProjectOutlined,
    TeamOutlined,
    UserOutlined,
    DollarOutlined,
    BarChartOutlined,
    SearchOutlined,
    BellOutlined,
    LogoutOutlined,
    SettingOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import { BaseLayout } from '../shared/BaseLayout';

const { Search } = Input;
const { useBreakpoint } = Grid;

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
                key: '/pm/projects/create',
                label: LABELS.PM.CREATE_PROJECT,
            },
        ],
    },
    {
        key: '/pm/contracts',
        icon: <FileTextOutlined />,
        label: LABELS.PM.CONTRACTS,
        children: [
            {
                key: '/pm/contracts/all',
                label: LABELS.PM.ALL_CONTRACTS,
            },
            {
                key: '/pm/contracts/create',
                label: LABELS.PM.CREATE_CONTRACT,
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
                label: LABELS.PM.COLLABORATORS,
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
                defaultOpenKeys={['/pm/projects', '/pm/contracts', '/pm/teams', '/pm/financials']}
                items={menuItems}
                onClick={handleMenuClick}
            />
        </div>
    );
};

const PMTopBar: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const handleSearch = (value: string) => {
        console.log('PM Search:', value);
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
            onClick: () => navigate('/pm/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
            onClick: () => navigate('/pm/settings'),
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: () => navigate('/login'),
        },
    ];

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: isMobile ? '0 12px' : '0 24px',
                height: '100%',
                gap: 12,
            }}
        >
            {/* Logo & App Name - Hidden on mobile since hamburger takes its place */}
            {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
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
                        SIRA PM
                    </span>
                </div>
            )}

            {/* Global Search */}
            <Search
                placeholder={isMobile ? 'Tìm kiếm...' : 'Tìm kiếm dự án, đội nhóm...'}
                allowClear
                onSearch={handleSearch}
                style={{ maxWidth: 400, flex: 1 }}
                prefix={<SearchOutlined />}
            />

            {/* Right Section: Notifications + User */}
            <Space size={isMobile ? 12 : 24} style={{ flexShrink: 0 }}>
                <Badge count={5} offset={[-5, 5]}>
                    <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                </Badge>

                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <Space style={{ cursor: 'pointer' }}>
                        <Avatar icon={<UserOutlined />} style={{ background: '#1976D2' }} />
                        {!isMobile && <span style={{ fontWeight: 500 }}>PM Nguyễn</span>}
                    </Space>
                </Dropdown>
            </Space>
        </div>
    );
};

export const PMLayout: React.FC = () => {
    return <BaseLayout sidebar={<PMSidebar />} topBar={<PMTopBar />} />;
};
