import {
    DollarOutlined,
    FormOutlined,
    InboxOutlined,
    MoreOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Grid, Layout, Menu } from 'antd';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';
import { AppShellHeader } from '../shared/AppShellHeader';
import { useAuth } from '../../hooks/useAuth';
import './SaleLayout.css';

const { Header, Content, Sider } = Layout;

/** Tối đa 5 ô trên bottom bar; nếu nhiều hơn thì 4 tab đầu + ô thứ 5 là menu "Thêm". */
const MOBILE_BOTTOM_MAX_TABS = 5;

type MobileNavItem = {
    key: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
};

export const SaleLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = useAuth();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    React.useEffect(() => {
        if (role && role !== 'KD') {
            navigate(`/admin/${role.toLowerCase()}/dashboard`);
            return;
        }

        if (!role) {
            navigate('/login');
        }
    }, [navigate, role]);

    const getActiveKey = () => {
        if (location.pathname.startsWith('/admin/kd/customers')) {
            return '/admin/kd/customers';
        }

        if (location.pathname.startsWith('/admin/kd/dashboard')) {
            return '/admin/kd/dashboard';
        }

        if (location.pathname.startsWith('/admin/kd/surveys')) {
            return '/admin/kd/surveys';
        }

        if (location.pathname.startsWith('/admin/kd/surveys')) {
            return '/admin/kd/surveys';
        }

        if (location.pathname.startsWith('/admin/kd/communications')) {
            return '';
        }

        if (location.pathname.startsWith('/admin/kd/expenditures/payment-requests')) {
            return '/admin/kd/expenditures/payment-requests';
        }

        if (location.pathname.startsWith('/admin/kd/profile')) {
            return '/admin/kd/profile';
        }

        return '/admin/kd/dashboard';
    };

    const mobileMenuItems: MobileNavItem[] = [
        {
            key: '/admin/kd/dashboard',
            icon: <InboxOutlined />,
            label: 'Yêu cầu',
            onClick: () => navigate('/admin/kd/dashboard'),
        },
        {
            key: '/admin/kd/customers',
            icon: <TeamOutlined />,
            label: 'Khách hàng',
            onClick: () => navigate('/admin/kd/customers'),
        },
        {
            key: '/admin/kd/surveys',
            icon: <FormOutlined />,
            label: 'Khảo sát',
            onClick: () => navigate('/admin/kd/surveys'),
        },
        {
            key: '/admin/kd/expenditures/payment-requests',
            icon: <DollarOutlined />,
            label: 'Yêu cầu chi',
            onClick: () => navigate('/admin/kd/expenditures/payment-requests'),
        },
        {
            key: '/admin/kd/profile',
            icon: <UserOutlined />,
            label: 'Cá nhân',
            onClick: () => navigate('/admin/kd/profile'),
        },
    ];

    const mobilePrimaryItems: MobileNavItem[] =
        mobileMenuItems.length <= MOBILE_BOTTOM_MAX_TABS
            ? mobileMenuItems
            : mobileMenuItems.slice(0, MOBILE_BOTTOM_MAX_TABS - 1);
    const mobileOverflowItems: MobileNavItem[] =
        mobileMenuItems.length <= MOBILE_BOTTOM_MAX_TABS
            ? []
            : mobileMenuItems.slice(MOBILE_BOTTOM_MAX_TABS - 1);

    const activeKey = getActiveKey();
    const isOverflowActive = mobileOverflowItems.some((item) => item.key === activeKey);

    const overflowDropdownItems: MenuProps['items'] = mobileOverflowItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
    }));

    const onOverflowMenuClick: MenuProps['onClick'] = ({ key }) => {
        const item = mobileOverflowItems.find((i) => i.key === key);
        item?.onClick();
    };

    const desktopMenuItems = [
        {
            key: 'journeys-group',
            icon: <InboxOutlined />,
            label: 'Công trình khách hàng',
            children: [
                {
                    key: '/admin/kd/dashboard',
                    label: 'Yêu cầu',
                    onClick: () => navigate('/admin/kd/dashboard'),
                },
                {
                    key: '/admin/kd/customers',
                    label: 'Khách hàng',
                    onClick: () => navigate('/admin/kd/customers'),
                },
                {
                    key: '/admin/kd/surveys',
                    label: 'Khảo sát',
                    onClick: () => navigate('/admin/kd/surveys'),
                },
                {
                    key: '/admin/kd/expenditures/payment-requests',
                    label: 'Yêu cầu chi tiền',
                    icon: <DollarOutlined />,
                    onClick: () => navigate('/admin/kd/expenditures/payment-requests'),
                },
            ],
        },
    ];

    return (
        <Layout className="sale-layout">
            {!isMobile && (
                <Sider
                    width={240}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        background: '#001529',
                    }}
                >
                    <div
                        style={{
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: 700,
                            padding: '0 8px',
                        }}
                    >
                        <AppBrandLogo size="sm" variant="onDark" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>BACSale</span>
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={activeKey ? [activeKey] : []}
                        defaultOpenKeys={['journeys-group']}
                        items={desktopMenuItems}
                    />
                </Sider>
            )}

            <Layout
                className="sale-layout__main"
                style={{ marginLeft: isMobile ? 0 : 240, transition: 'margin-left 0.2s' }}
            >
                <Header
                    className="sale-layout__header"
                    style={{
                        padding: 0,
                        background: '#fff',
                        lineHeight: 'normal',
                        height: 'auto',
                        minHeight: 56,
                    }}
                >
                    <AppShellHeader
                        productTitle="BACSale"
                        brandAccentColor="#52c41a"
                        avatarColor="#52c41a"
                        logoSize="sm"
                        placeholder="Tìm công trình, khách hàng hoặc nội dung yêu cầu..."
                    />
                </Header>

                <Content className="sale-content">
                    <Outlet />
                </Content>
            </Layout>

            {isMobile && (
                <nav className="sale-bottom-nav" aria-label="Điều hướng chính">
                    <div className="bottom-nav-bar">
                        {mobilePrimaryItems.map((item) => {
                            const selected = activeKey === item.key;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    className={`bottom-nav-slot${selected ? ' bottom-nav-slot--active' : ''}`}
                                    onClick={item.onClick}
                                >
                                    <span className="bottom-nav-icon">{item.icon}</span>
                                    <span className="bottom-nav-text">{item.label}</span>
                                </button>
                            );
                        })}
                        {mobileOverflowItems.length > 0 && (
                            <Dropdown
                                menu={{
                                    items: overflowDropdownItems,
                                    onClick: onOverflowMenuClick,
                                    selectedKeys: isOverflowActive ? [activeKey] : [],
                                }}
                                placement="top"
                                trigger={['click']}
                                destroyOnHidden
                                getPopupContainer={() => document.body}
                            >
                                <button
                                    type="button"
                                    className={`bottom-nav-slot bottom-nav-slot--more${isOverflowActive ? ' bottom-nav-slot--active' : ''}`}
                                    aria-haspopup="menu"
                                >
                                    <span className="bottom-nav-icon">
                                        <MoreOutlined />
                                    </span>
                                    <span className="bottom-nav-text">Thêm</span>
                                </button>
                            </Dropdown>
                        )}
                    </div>
                </nav>
            )}
        </Layout>
    );
};

export default SaleLayout;
