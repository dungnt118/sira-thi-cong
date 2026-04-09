import { find_setting } from '@/store/actions/data/data.action';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { SET_JOURNEY_SETTING } from '@/store/reducers/schemas/schemas.reducer';
import {
    BarChartOutlined,
    BellOutlined,
    DashboardOutlined,
    DollarOutlined,
    ExportOutlined,
    HistoryOutlined,
    InboxOutlined,
    LayoutOutlined,
    NodeIndexOutlined,
    SearchOutlined,
    SettingOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import type { MenuProps } from 'antd';
import { Badge, Grid, Input, Menu, Space } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';
import { UserMenu } from '../../components/common/Header/UserMenuWithDocs';
import { useAuth } from '../../hooks/useAuth';
import { BaseLayout } from '../shared/BaseLayout';

const { Search } = Input;
const { useBreakpoint } = Grid;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/admin/ql/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
    },
    {
        key: '/admin/ql/journeys',
        icon: <NodeIndexOutlined />,
        label: 'Công trình Khách hàng',
        children: [
            { key: '/admin/ql/journeys', label: 'Danh sách yêu cầu', icon: <UnorderedListOutlined /> },
            { key: '/admin/ql/crm/customers', label: 'Danh sách Khách hàng', icon: <TeamOutlined /> },
            { key: '/admin/ql/crm/customers/new', label: 'Thêm Khách hàng mới', icon: <UserAddOutlined /> },
            { key: '/admin/ql/settings/customer-journey', label: 'Cấu hình CustomerJourney', icon: <SettingOutlined /> },
        ],
    },
    // Nhóm tính năng Thi công (Projects/Checklist cũ) đã gộp vào Journey
    {
        key: '/admin/ql/inventory',
        icon: <InboxOutlined />,
        label: 'Kho Vật tư',
        children: [
            { key: '/admin/ql/inventory/catalog', label: 'Danh mục Vật tư', icon: <InboxOutlined /> },
            { key: '/admin/ql/settings/estimate-templates', label: 'Mẫu định mức Chuẩn', icon: <LayoutOutlined /> },
            // { key: '/admin/ql/inventory/plan', label: '📐 Định mức Dự án' },
            { key: '/admin/ql/inventory/stock-out', label: 'Tạo phiếu xuất', icon: <ExportOutlined /> },
            { key: '/admin/ql/assets/allocation', label: 'Tạo phiếu mượn', icon: <ExportOutlined /> },
            { key: '/admin/ql/inventory/history', label: 'Lịch sử xuất/nhập', icon: <HistoryOutlined /> },
        ],
    },
    {
        key: '/admin/ql/finance',
        icon: <DollarOutlined />,
        label: 'Tài chính',
        children: [
            { key: '/admin/ql/finance/projects', label: 'Tài chính Dự án' },
            { key: '/admin/ql/finance/payment-requests', label: 'Phiếu Yêu cầu chi', icon: <DollarOutlined /> },
            { key: '/admin/ql/financials/milestones', label: 'Mốc Thanh toán' },
        ],
    },
    {
        key: '/admin/ql/teams',
        icon: <TeamOutlined />,
        label: 'Quản lý Đội/Thợ',
        children: [
            { key: '/admin/ql/teams/workers', label: 'Quản lý Thợ', icon: <TeamOutlined /> },
            { key: '/admin/ql/teams/groups', label: 'Quản lý Đội thợ', icon: <TeamOutlined /> },
            { key: '/admin/ql/teams/prices', label: 'Trình độ thợ', icon: <DollarOutlined /> },
        ],
    },
    {
        key: '/admin/ql/reports',
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
                    gap: 10,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    padding: '0 8px',
                }}
            >
                <AppBrandLogo size="sm" variant="onDark" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Quản lý dự án</span>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['/admin/ql/journeys', '/admin/ql/inventory', '/admin/ql/finance', '/admin/ql/teams']}
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
                    <AppBrandLogo size="md" />
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#1976D2' }}>
                        Quản lý dự án
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
    const { role, isAdmin } = useAuth();
    const dispatch = useAppDispatch();
    const journeySetting = useAppSelector(state => state.schemas.journeySetting);

    React.useEffect(() => {
        if (!journeySetting) {
            find_setting({ schema: 'CustomerJourneySetting' }, dispatch).then(res => {
                if (res.code === 0 && res.data) {
                    dispatch({
                        type: SET_JOURNEY_SETTING,
                        payload: res.data
                    });
                }
            });
        }
    }, [dispatch, journeySetting]);

    React.useEffect(() => {
        if (role && role !== 'QL' && !isAdmin) {
            navigate(`/admin/${role.toLowerCase()}/dashboard`);
            return;
        }

        if (!role) {
            navigate('/login');
        }
    }, [role, isAdmin, navigate]);

    return <BaseLayout sidebar={<PMSidebar />} topBar={<PMTopBar />} />;
};
