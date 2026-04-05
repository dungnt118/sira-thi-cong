import React from 'react';
import { Menu, Input, Badge, Space, Grid } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { find_setting } from '@/store/actions/data/data.action';
import { SET_JOURNEY_SETTING } from '@/store/reducers/schemas/schemas.reducer';
import {
    DashboardOutlined,
    DollarOutlined,
    BarChartOutlined,
    SearchOutlined,
    BellOutlined,
    InboxOutlined,
    NodeIndexOutlined,
    ThunderboltOutlined,
    UnorderedListOutlined,
    AppstoreOutlined,
    TeamOutlined,
    UserAddOutlined,
    SettingOutlined,
    LayoutOutlined,
    ExportOutlined,
    HistoryOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import { BaseLayout } from '../shared/BaseLayout';
import { UserMenu } from '../../components/common/Header/UserMenuWithDocs';

const { Search } = Input;
const { useBreakpoint } = Grid;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/ql/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
    },
    {
        key: '/ql/journeys',
        icon: <NodeIndexOutlined />,
        label: 'Hành trình Khách hàng',
        children: [
            { key: '/ql/journeys', label: 'Danh sách yêu cầu', icon: <UnorderedListOutlined /> },
            { key: '/ql/crm/customers', label: 'Danh sách Khách hàng', icon: <TeamOutlined /> },
            { key: '/ql/crm/customers/new', label: 'Thêm Khách hàng mới', icon: <UserAddOutlined /> },
            { key: '/ql/settings/customer-journey', label: 'Cấu hình CustomerJourney', icon: <SettingOutlined /> },
        ],
    },
    // Nhóm tính năng Thi công (Projects/Checklist cũ) đã gộp vào Journey
    {
        key: '/ql/inventory',
        icon: <InboxOutlined />,
        label: 'Kho Vật tư',
        children: [
            { key: '/ql/inventory/catalog', label: 'Danh mục Vật tư', icon: <InboxOutlined /> },
            { key: '/ql/settings/estimate-templates', label: 'Mẫu định mức Chuẩn', icon: <LayoutOutlined /> },
            // { key: '/ql/inventory/plan', label: '📐 Định mức Dự án' },
            { key: '/ql/inventory/stock-out', label: 'Tạo phiếu xuất', icon: <ExportOutlined /> },
            { key: '/ql/assets/allocation', label: 'Tạo phiếu mượn', icon: <ExportOutlined /> },
            { key: '/ql/inventory/history', label: 'Lịch sử xuất/nhập', icon: <HistoryOutlined /> },
        ],
    },
    {
        key: '/ql/finance',
        icon: <DollarOutlined />,
        label: 'Tài chính',
        children: [
            { key: '/ql/finance/projects', label: 'Tài chính Dự án' },
            { key: '/ql/financials/milestones', label: 'Mốc Thanh toán' },
        ],
    },
    {
        key: '/ql/teams',
        icon: <TeamOutlined />,
        label: 'Quản lý Đội/Thợ',
        children: [
            { key: '/ql/teams/workers', label: 'Quản lý Thợ', icon: <TeamOutlined /> },
            { key: '/ql/teams/groups', label: 'Quản lý Đội thợ', icon: <TeamOutlined /> },
            { key: '/ql/teams/prices', label: 'Bảng giá thợ', icon: <DollarOutlined /> },
        ],
    },
    {
        key: '/ql/reports',
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
                defaultOpenKeys={['/ql/projects', '/ql/contracts', '/ql/teams', '/ql/financials']}
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
            navigate(`/${role}/dashboard`);
            return;
        }

        if (!role) {
            navigate('/login');
        }
    }, [role, isAdmin, navigate]);

    return <BaseLayout sidebar={<PMSidebar />} topBar={<PMTopBar />} />;
};
