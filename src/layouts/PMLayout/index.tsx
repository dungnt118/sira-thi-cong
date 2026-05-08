import { find_setting } from '@/store/actions/data/data.action';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { SET_JOURNEY_SETTING } from '@/store/reducers/schemas/schemas.reducer';
import {
    BarChartOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    DollarOutlined,
    ExportOutlined,
    HistoryOutlined,
    InboxOutlined,
    LayoutOutlined,
    NodeIndexOutlined,
    SettingOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { AppShellHeader } from '../shared/AppShellHeader';
import { BaseLayout } from '../shared/BaseLayout';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/admin/ql/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
    },
    {
        // W2-03 — Hộp duyệt tổng hợp
        key: '/admin/ql/inbox',
        icon: <UnorderedListOutlined />,
        label: 'Hộp duyệt',
    },
    {
        key: '/admin/ql/journeys',
        icon: <NodeIndexOutlined />,
        label: 'Công trình Khách hàng',
        children: [
            { key: '/admin/ql/journeys', label: 'Danh sách yêu cầu', icon: <UnorderedListOutlined /> },
            { key: '/admin/ql/crm/customers', label: 'Danh sách Khách hàng', icon: <TeamOutlined /> },
            { key: '/admin/ql/crm/customers/new', label: 'Thêm Khách hàng mới', icon: <UserAddOutlined /> },
        ],
    },
    {
        key: '/admin/ql/inventory',
        icon: <InboxOutlined />,
        label: 'Kho Vật tư',
        children: [
            { key: '/admin/ql/inventory/catalog', label: 'Danh mục Vật tư', icon: <InboxOutlined /> },
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
    {
        key: '/admin/ql/settings',
        icon: <SettingOutlined />,
        label: 'Cấu hình',
        children: [
            { key: '/admin/ql/settings/customer-journey', label: 'Cấu hình CustomerJourney', icon: <SettingOutlined /> },
            { key: '/admin/ql/settings/estimate-templates', label: 'Mẫu định mức (Template)', icon: <LayoutOutlined /> },
            { key: '/admin/ql/settings/pricing-policies', label: 'Chính sách tính giá', icon: <DollarOutlined /> },
            { key: '/admin/ql/settings/journey-estimates', label: 'Dự toán nội bộ', icon: <UnorderedListOutlined /> },
            { key: '/admin/ql/master-data', label: 'Quản lý Master Data', icon: <DatabaseOutlined /> },
        ],
    },
];

const PMSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div
                style={{
                    height: 64,
                    flexShrink: 0,
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
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={['/admin/ql/journeys', '/admin/ql/inventory', '/admin/ql/finance', '/admin/ql/teams']}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </div>
        </div>
    );
};

const PMTopBar: React.FC = () => (
    <AppShellHeader
        productTitle="Quản lý dự án"
        brandAccentColor="#1976D2"
        avatarColor="#1976D2"
        logoSize="md"
        placeholder="Tìm kiếm dự án, đội nhóm..."
        onSearch={(value) => {
            console.log('PM Search:', value);
        }}
    />
);

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

    /**
     * UX-08 (Wave 3.5) — chỉ redirect 1 lần khi role thay đổi (mount/login).
     * Trước đây useEffect re-trigger trên mỗi render do navigate trong deps,
     * có thể gây bounce sang dashboard của role khác khi user navigate nội bộ.
     * Dùng `redirectedRole` ref để chỉ redirect khi role THỰC SỰ đổi.
     */
    const redirectedRole = React.useRef<string | null>(null);
    React.useEffect(() => {
        if (!role) {
            navigate('/login');
            return;
        }
        if (role !== 'QL' && !isAdmin && redirectedRole.current !== role) {
            redirectedRole.current = role;
            navigate(`/admin/${role.toLowerCase()}/dashboard`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role, isAdmin]);

    return <BaseLayout sidebar={<PMSidebar />} topBar={<PMTopBar />} />;
};
