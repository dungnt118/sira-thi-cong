import React from 'react';
import { Badge, Grid, Input, Layout, Menu } from 'antd';
import {
    BellOutlined,
    ClockCircleOutlined,
    FormOutlined,
    InboxOutlined,
    MessageOutlined,
    SearchOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UserMenu } from '../../components/common/Header/UserMenu';
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
        if (role && role !== 'sale') {
            navigate(`/${role}/dashboard`);
            return;
        }

        if (!role) {
            navigate('/login');
        }
    }, [navigate, role]);

    const getActiveKey = () => {
        if (location.pathname.startsWith('/sale/customers')) {
            return '/sale/customers';
        }

        if (location.pathname.startsWith('/sale/dashboard')) {
            return '/sale/dashboard';
        }

        if (location.pathname.startsWith('/sale/sla')) {
            return '/sale/sla';
        }

        if (location.pathname.startsWith('/sale/surveys')) {
            return '/sale/surveys';
        }

        if (location.pathname.startsWith('/sale/communications')) {
            return '/sale/communications';
        }

        if (location.pathname.startsWith('/sale/profile')) {
            return '/sale/profile';
        }

        return '/sale/dashboard';
    };

    const mobileMenuItems = [
        {
            key: '/sale/dashboard',
            icon: <InboxOutlined />,
            label: 'Yêu cầu dịch vụ',
            onClick: () => navigate('/sale/dashboard'),
        },
        {
            key: '/sale/customers',
            icon: <TeamOutlined />,
            label: 'Khách hàng',
            onClick: () => navigate('/sale/customers'),
        },
        {
            key: '/sale/sla',
            icon: <ClockCircleOutlined />,
            label: 'Cảnh báo tiến độ',
            onClick: () => navigate('/sale/sla'),
        },
        {
            key: '/sale/surveys',
            icon: <FormOutlined />,
            label: 'Khảo sát',
            onClick: () => navigate('/sale/surveys'),
        },
        {
            key: '/sale/communications',
            icon: <MessageOutlined />,
            label: 'Giao tiếp',
            onClick: () => navigate('/sale/communications'),
        },
        {
            key: '/sale/profile',
            icon: <UserOutlined />,
            label: 'Cá nhân',
            onClick: () => navigate('/sale/profile'),
        },
    ];

    const desktopMenuItems = [
        {
            key: 'journeys-group',
            icon: <InboxOutlined />,
            label: 'Hành trình khách hàng',
            children: [
                {
                    key: '/sale/dashboard',
                    label: 'Yêu cầu dịch vụ',
                    onClick: () => navigate('/sale/dashboard'),
                },
                {
                    key: '/sale/customers',
                    label: 'Khách hàng',
                    onClick: () => navigate('/sale/customers'),
                },
                {
                    key: '/sale/sla',
                    label: 'Cảnh báo tiến độ',
                    onClick: () => navigate('/sale/sla'),
                },
                {
                    key: '/sale/surveys',
                    label: 'Khảo sát',
                    onClick: () => navigate('/sale/surveys'),
                },
                {
                    key: '/sale/communications',
                    label: 'Giao tiếp khách hàng',
                    onClick: () => navigate('/sale/communications'),
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
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 700,
                        }}
                    >
                        SIRA Sale
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
                        <span className="brand-text">SIRA Sale</span>
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
                        items={mobileMenuItems.map((item) => ({
                            ...item,
                            label: (
                                <div className="bottom-nav-item">
                                    <span className="bottom-nav-icon">{item.icon}</span>
                                    <span className="bottom-nav-text">{item.label}</span>
                                </div>
                            ),
                            icon: null,
                        }))}
                        className="bottom-menu"
                    />
                </div>
            )}
        </Layout>
    );
};

export default SaleLayout;
