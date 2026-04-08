import React from 'react';
import { Layout, Menu, Badge } from 'antd';
import {
    HomeOutlined,
    CalendarOutlined,
    ToolOutlined,
    UserOutlined,
    BellOutlined,
    FormOutlined,
    HistoryOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserMenu } from '../../components/common/Header/UserMenuWithDocs';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';
import './KyThuatLayout.css';

const { Header, Content } = Layout;

export const KyThuatLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role, isAdmin } = useAuth();

    React.useEffect(() => {
        if (role && role !== 'KYT' && !isAdmin) {
            navigate(`/admin/${role.toLowerCase()}/dashboard`);
            return;
        }

        if (!role) {
            navigate('/login');
        }
    }, [role, isAdmin, navigate]);

    // Convert pathname to menu active key
    const getActiveKey = () => {
        const path = location.pathname;
        if (path.includes('/admin/kyt/schedule')) return 'schedule';
        if (path.includes('/admin/kyt/execution')) return 'execution';
        if (path.includes('/admin/kyt/expenditures/payment-requests')) return 'payment-requests';
        if (path.includes('/admin/kyt/profile')) return 'profile';
        return 'dashboard';
    };

    const menuItems = [
        {
            key: 'dashboard',
            icon: <HomeOutlined />,
            label: 'Tổng quan',
            onClick: () => navigate('/admin/kyt/dashboard')
        },
        {
            key: 'schedule',
            icon: <CalendarOutlined />,
            label: 'Lịch trình',
            onClick: () => navigate('/admin/kyt/schedule')
        },
        {
            key: 'execution',
            icon: <ToolOutlined />,
            label: 'Thi công',
            onClick: () => navigate('/admin/kyt/execution')
        },
        {
            key: 'payment-requests',
            icon: <DollarOutlined />,
            label: 'Yêu cầu chi',
            onClick: () => navigate('/admin/kyt/expenditures/payment-requests')
        },
        {
            key: 'profile',
            icon: <UserOutlined />, label: 'Cá nhân',
            onClick: () => navigate('/admin/kyt/profile')
        }
    ];

    // User menu logic moved to shared UserMenu component

    return (
        <Layout className="ky-thuat-layout">
            <Header className="ky-thuat-header">
                <div className="header-brand">
                    <AppBrandLogo size="sm" />
                    <span className="brand-text">Kỹ Thuật</span>
                </div>
                <div className="header-actions">
                    <Badge count={2} size="small">
                        <BellOutlined className="header-icon" />
                    </Badge>
                    <UserMenu avatarColor="#13a8a8" showName={false} />
                </div>
            </Header>
            <Content className="ky-thuat-content">
                <Outlet />
            </Content>
            {/* Mobile Bottom Navigation */}
            <div className="ky-thuat-bottom-nav">
                <Menu
                    mode="horizontal"
                    selectedKeys={[getActiveKey()]}
                    items={menuItems.map(item => ({
                        ...item,
                        label: <div className="bottom-nav-item"><span className="bottom-nav-icon">{item.icon}</span><span className="bottom-nav-text">{item.label}</span></div>,
                        icon: null // we use custom label to render stack
                    }))}
                    className="bottom-menu"
                />
            </div>
        </Layout>
    );
};

export default KyThuatLayout;
