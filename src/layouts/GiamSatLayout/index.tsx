import {
    AppstoreOutlined,
    BellOutlined,
    HistoryOutlined,
    HomeOutlined,
    InboxOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Badge, Layout } from 'antd';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';
import { UserMenu } from '../../components/common/Header/UserMenuWithDocs';
import { useAuth } from '../../hooks/useAuth';
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
        { key: '/admin/gs/profile', icon: <UserOutlined />, label: 'Cá nhân' },
    ];

    const activeTab = navTabs.find(t =>
        location.pathname.startsWith(t.key)
    )?.key || '/admin/gs/dashboard';

    return (
        <Layout className="giam-sat-layout">
            <Header className="giam-sat-header">
                <div className="header-brand-mobile">
                    <AppBrandLogo size="sm" variant="onDark" />
                    <span className="brand-text-mobile">BACGiám Sát</span>
                </div>
                <div className="header-actions-mobile">
                    <Badge count={2} size="small" offset={[-4, 4]}>
                        <BellOutlined className="header-icon-mobile" />
                    </Badge>
                    <UserMenu avatarColor="#fa8c16" showName={false} />
                </div>
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
