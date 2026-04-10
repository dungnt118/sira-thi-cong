import {
    AppstoreOutlined,
    HistoryOutlined,
    HomeOutlined,
    InboxOutlined,
    UserOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AppShellHeader } from '../shared/AppShellHeader';
import './GiamSatMobile.css';

const { Header, Content } = Layout;

export const GiamSatLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { role, availableRoles } = useAuth();
    const hasGSRole = availableRoles?.includes('GS') || role === 'GS';

    React.useEffect(() => {
        // If user doesn't have GS role, redirect them to their primary dashboard
        if (!hasGSRole && role) {
            navigate(`/admin/${role.toLowerCase()}/dashboard`);
            return;
        }

        if (!role) {
            navigate('/login');
        }
    }, [navigate, role, hasGSRole]);

    const navTabs = [
        { key: '/admin/gs/dashboard', icon: <HomeOutlined />, label: 'Trang chủ' },
        { key: '/admin/gs/projects', icon: <AppstoreOutlined />, label: 'Công trình' },
        { key: '/admin/gs/materials', icon: <InboxOutlined />, label: 'Vật tư' },
        { key: '/admin/gs/inventory/history', icon: <HistoryOutlined />, label: 'Lịch sử' },
        { key: '/admin/gs/expenditures/payment-requests', icon: <DollarOutlined />, label: 'Yêu cầu chi' },
        { key: '/admin/gs/profile', icon: <UserOutlined />, label: 'Cá nhân' },
    ];

    const activeTab = navTabs.find(t =>
        location.pathname.startsWith(t.key)
    )?.key || '/admin/gs/dashboard';

    return (
        <Layout className="giam-sat-layout">
            <Header
                className="giam-sat-layout__header"
                style={{
                    padding: 0,
                    background: '#fff',
                    lineHeight: 'normal',
                    minHeight: 56,
                    height: 'auto',
                }}
            >
                <AppShellHeader
                    productTitle="BAC Giám sát"
                    brandAccentColor="#fa8c16"
                    avatarColor="#fa8c16"
                    userMenuShowName={false}
                    showSearch={false}
                />
            </Header>

            <Content className="giam-sat-content">
                <Outlet />
            </Content>

            <div className="giam-sat-bottom-nav">
                {navTabs.map(tab => {
                    const isActive = activeTab === tab.key;
                    return (
                        <div
                            key={tab.key}
                            className={`bottom-nav-tab ${isActive ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const targetPath = tab.key;
                                console.log('Bottom Nav navigating to:', targetPath);
                                navigate(targetPath);
                            }}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
};

export default GiamSatLayout;
