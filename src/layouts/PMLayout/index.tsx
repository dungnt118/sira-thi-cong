import React from 'react';
import { Menu, Input, Badge, Space, Grid } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    DashboardOutlined,
    ProjectOutlined,
    UserOutlined,
    DollarOutlined,
    BarChartOutlined,
    SearchOutlined,
    BellOutlined,
    InboxOutlined,
    NodeIndexOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import { BaseLayout } from '../shared/BaseLayout';
import { UserMenu } from '../../components/common/Header/UserMenu';

const { Search } = Input;
const { useBreakpoint } = Grid;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/pm/dashboard',
        icon: <DashboardOutlined />,
        label: 'Tổng Quan',
    },
    {
        key: '/pm/crm',
        icon: <UserOutlined />,
        label: 'CRM & Bán hàng',
        children: [
            { key: '/pm/crm/service-requests', label: 'Yêu cầu Dịch vụ (Deals)' },
            { key: '/pm/crm/pipeline', label: 'Pipeline Kanban' },
            { key: '/pm/crm/customers', label: 'Danh sách Khách hàng' },
            { key: '/pm/crm/customers/new', label: 'Thêm KH mới' },
            { key: '/pm/crm/pipeline-settings', label: 'Cấu hình Pipeline' },
        ],
    },
    {
        key: '/pm/journeys',
        icon: <NodeIndexOutlined />,
        label: 'Hành trình Khách hàng',
        children: [
            { key: '/pm/journeys', label: 'Danh sách Hành trình' },
            { key: '/pm/journeys/board', label: 'Board / Kanban' },
            { key: '/pm/journeys/action-center', label: 'Action Center' },
            { key: '/pm/journeys/templates', label: 'Template Quy trình' },
        ],
    },
    {
        key: '/pm/construction',
        icon: <ProjectOutlined />,
        label: 'Nhật ký Thi công',
        children: [
            { key: '/pm/construction/projects', label: 'Danh sách Dự án' },
            { key: '/pm/construction/projects/create', label: 'Tạo Dự án' },
            { key: '/pm/construction/evidence', label: 'Duyệt Ảnh/Video' },
            { key: '/pm/construction/templates', label: 'Template Checklist' },
        ],
    },
    {
        key: '/pm/inventory',
        icon: <InboxOutlined />,
        label: 'Kho Vật tư',
        children: [
            { key: '/pm/inventory/catalog', label: '📦 Danh mục Vật tư' },
            { key: '/pm/settings/estimate-templates', label: '📐 Mẫu định mức Chuẩn' },
            // { key: '/pm/inventory/plan', label: '📐 Định mức Dự án' },
            { key: '/pm/inventory/request-out', label: '📤 Yêu cầu Xuất kho' },
            { key: '/pm/inventory/request-in', label: '📥 Yêu cầu Nhập kho' },
        ],
    },
    {
        key: '/pm/finance',
        icon: <DollarOutlined />,
        label: 'Tài chính',
        children: [
            { key: '/pm/finance/projects', label: 'Tài chính Dự án' },
            { key: '/pm/financials/milestones', label: 'Mốc Thanh toán' },
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
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const handleSearch = (value: string) => {
        console.log('PM Search:', value);
    };

    // User menu logic moved to shared UserMenu component

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: isMobile ? '0 4px' : '0 24px',
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

                <UserMenu avatarColor="#1976D2" showName={!isMobile} />
            </Space>
        </div>
    );
};

export const PMLayout: React.FC = () => {
    const navigate = useNavigate();
    const { role, user } = useAuth();
    
    React.useEffect(() => {
        if (role !== 'pm') {
            if (user && user.role) {
                navigate(`/${user.role}/dashboard`);
            } else {
                navigate('/login');
            }
        }
    }, [role, user, navigate]);

    return <BaseLayout sidebar={<PMSidebar />} topBar={<PMTopBar />} />;
};
