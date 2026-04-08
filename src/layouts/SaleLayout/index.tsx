import {
    BellOutlined,
    ClockCircleOutlined,
    FormOutlined,
    InboxOutlined,
    MessageOutlined,
    SearchOutlined,
    TeamOutlined,
    UserOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { Badge, Grid, Input, Layout, Menu } from 'antd';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';
import { UserMenu } from '../../components/common/Header/UserMenuWithDocs';
import { useAuth } from '../../hooks/useAuth';
import './SaleLayout.css';

const { Header, Content, Sider } = Layout;
const { Search } = Input;

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

        if (location.pathname.startsWith('/admin/kd/sla')) {
            return '/admin/kd/sla';
        }

        if (location.pathname.startsWith('/admin/kd/surveys')) {
            return '/admin/kd/surveys';
        }

        if (location.pathname.startsWith('/admin/kd/communications')) {
            return '/admin/kd/communications';
        }

        if (location.pathname.startsWith('/admin/kd/expenditures/payment-requests')) {
            return '/admin/kd/expenditures/payment-requests';
        }

        if (location.pathname.startsWith('/admin/kd/profile')) {
            return '/admin/kd/profile';
        }

        return '/admin/kd/dashboard';
    };

    const mobileMenuItems = [
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
            key: '/admin/kd/sla',
            icon: <ClockCircleOutlined />,
            label: 'Cảnh báo tiến độ',
            onClick: () => navigate('/admin/kd/sla'),
        },
        {
            key: '/admin/kd/surveys',
            icon: <FormOutlined />,
            label: 'Khảo sát',
            onClick: () => navigate('/admin/kd/surveys'),
        },
        {
            key: '/admin/kd/communications',
            icon: <MessageOutlined />,
            label: 'Giao tiếp',
            onClick: () => navigate('/admin/kd/communications'),
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

    const desktopMenuItems = [
        {
            key: 'journeys-group',
            icon: <InboxOutlined />,
            label: 'Hành trình khách hàng',
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
                    key: '/admin/kd/sla',
                    label: 'Cảnh báo tiến độ',
                    onClick: () => navigate('/admin/kd/sla'),
                },
                {
                    key: '/admin/kd/surveys',
                    label: 'Khảo sát',
                    onClick: () => navigate('/admin/kd/surveys'),
                },
                {
                    key: '/admin/kd/communications',
                    label: 'Giao tiếp khách hàng',
                    onClick: () => navigate('/admin/kd/communications'),
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

    const memoizedMobileMenuItems = React.useMemo(() => mobileMenuItems.map((item) => ({
        ...item,
        label: (
            <div className="bottom-nav-item">
                <span className="bottom-nav-icon">{item.icon}</span>
                <span className="bottom-nav-text">{item.label}</span>
            </div>
        ),
        icon: null,
    })), [mobileMenuItems]);

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
                        selectedKeys={[getActiveKey()]}
                        defaultOpenKeys={['journeys-group']}
                        items={desktopMenuItems}
                    />
                </Sider>
            )}

            <Layout style={{ marginLeft: isMobile ? 0 : 240, transition: 'margin-left 0.2s' }}>
                <Header className="sale-header">
                    <div className="header-brand">
                        <AppBrandLogo size="sm" />
                        <span className="brand-text">BACSale</span>
                    </div>

                    {!isMobile && (
                        <Search
                            placeholder="Tìm hành trình, khách hàng hoặc nội dung yêu cầu..."
                            allowClear
                            style={{ maxWidth: 460, margin: '0 24px' }}
                            prefix={<SearchOutlined />}
                        />
                    )}

                    <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Badge count={3} size="small">
                            <BellOutlined className="header-icon" />
                        </Badge>
                        <UserMenu avatarColor="#52c41a" />
                    </div>
                </Header>

                <Content className="sale-content">
                    <Outlet />
                </Content>
            </Layout>

            {isMobile && (
                <div className="sale-bottom-nav">
                    <Menu
                        mode="horizontal"
                        selectedKeys={[getActiveKey()]}
                        items={memoizedMobileMenuItems}
                        className="bottom-menu"
                    />
                </div>
            )}
        </Layout>
    );
};

export default SaleLayout;
