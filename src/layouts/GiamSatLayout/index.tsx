import React from 'react';
import { Layout, Badge } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    HomeOutlined,
    AppstoreOutlined,
    InboxOutlined,
    UserOutlined,
    BellOutlined,
    FormOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { UserMenu } from '../../components/common/Header/UserMenuWithDocs';
import './GiamSatMobile.css';

const { Header, Content } = Layout;

export const GiamSatLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { role } = useAuth();

    React.useEffect(() => {
        if (role && role !== 'GS') {
            navigate(`/${role.toLowerCase()}/dashboard`);
            return;
        }

        if (!role) {
            navigate('/login');
        }
    }, [navigate, role]);

    const navTabs = [
        { key: '/gs/dashboard', icon: <HomeOutlined />, label: 'Trang chủ' },
        { key: '/gs/projects', icon: <AppstoreOutlined />, label: 'Dự án' },
        { key: '/gs/materials', icon: <InboxOutlined />, label: 'Vật tư' },
        { key: '/gs/inventory/history', icon: <HistoryOutlined />, label: 'Lịch sử' },
        { key: '/gs/profile', icon: <UserOutlined />, label: 'Cá nhân' },
    ];

    const activeTab = navTabs.find(t =>
        location.pathname.startsWith(t.key)
    )?.key || '/gs/dashboard';

    return (
        <Layout className="giam-sat-layout">
            <Header className="giam-sat-header">
                <div className="header-brand-mobile">
                    <div className="brand-logo-small">G</div>
                    <span className="brand-text-mobile">SIRA Giám Sát</span>
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
                            onClick={() => navigate(tab.key === '/gs/profile' ? '/personal/profile' : tab.key)}
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
