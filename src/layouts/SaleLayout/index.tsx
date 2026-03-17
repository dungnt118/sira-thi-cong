import React from 'react';
import { Layout, Menu, Badge, Grid, Input } from 'antd';
import {
    InboxOutlined,
    ClockCircleOutlined,
    FormOutlined,
    MessageOutlined,
    UserOutlined,
    BellOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserMenu } from '../../components/common/Header/UserMenu';
import './SaleLayout.css';

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;
const { Search } = Input;

export const SaleLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role, user } = useAuth();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    React.useEffect(() => {
        if (role !== 'sale') {
            if (user && user.role) {
                navigate(`/${user.role}/dashboard`);
            } else {
                navigate('/login');
            }
        }
    }, [role, user, navigate]);

    // Convert pathname to menu active key
    const getActiveKey = () => {
        const path = location.pathname;
        if (path === '/sale/dashboard') return 'journeys';
        if (path === '/sale/sla') return 'sla';
        if (path === '/sale/surveys') return 'surveys';
        if (path === '/sale/communications') return 'communications';
        if (path.includes('/sale/profile')) return 'profile';
        return 'journeys';
    };

    const menuItems = [
        {
            key: 'journeys',
            icon: <InboxOutlined />,
            label: 'Hành trình',
            onClick: () => navigate('/sale/dashboard')
        },
        {
            key: 'sla',
            icon: <ClockCircleOutlined />,
            label: 'SLA',
            onClick: () => navigate('/sale/sla')
        },
        {
            key: 'surveys',
            icon: <FormOutlined />,
            label: 'Khảo sát',
            onClick: () => navigate('/sale/surveys')
        },
        {
            key: 'communications',
            icon: <MessageOutlined />,
            label: 'Giao tiếp',
            onClick: () => navigate('/sale/communications')
        },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Cá nhân',
            onClick: () => navigate('/sale/profile')
        }
    ];

    const desktopMenuItems = [
        {
            key: 'journeys-group',
            icon: <InboxOutlined />,
            label: 'Hành trình khách hàng',
            children: [
                { key: '/sale/dashboard', label: 'Journey Inbox', onClick: () => navigate('/sale/dashboard') },
                { key: '/sale/sla', label: 'SLA Queue', onClick: () => navigate('/sale/sla') },
                { key: '/sale/surveys', label: 'Khảo sát', onClick: () => navigate('/sale/surveys') },
                { key: '/sale/communications', label: 'Giao tiếp khách hàng', onClick: () => navigate('/sale/communications') },
            ],
        },
    ];

    // User menu logic moved to shared UserMenu component

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
                        background: '#001529'
                    }}
                >
                    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                        SIRA Sale
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[location.pathname]}
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
                            placeholder="Tìm hành trình..."
                            allowClear
                            style={{ maxWidth: 400, margin: '0 24px' }}
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

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <div className="sale-bottom-nav">
                    <Menu
                        mode="horizontal"
                        selectedKeys={[getActiveKey()]}
                        items={menuItems.map(item => ({
                            ...item,
                            label: (
                                <div className="bottom-nav-item">
                                    <span className="bottom-nav-icon">{item.icon}</span>
                                    <span className="bottom-nav-text">{item.label}</span>
                                </div>
                            ),
                            icon: null
                        }))}
                        className="bottom-menu"
                    />
                </div>
            )}
        </Layout>
    );
};

export default SaleLayout;
