import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import { 
    HomeOutlined, 
    CalendarOutlined, 
    ToolOutlined, 
    UserOutlined,
    BellOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './KyThuatLayout.css';

const { Header, Content } = Layout;

export const KyThuatLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Convert pathname to menu active key
    const getActiveKey = () => {
        const path = location.pathname;
        if (path.includes('/ky-thuat/schedule')) return 'schedule';
        if (path.includes('/ky-thuat/execution')) return 'execution';
        if (path.includes('/ky-thuat/profile')) return 'profile';
        return 'dashboard';
    };

    const menuItems = [
        {
            key: 'dashboard',
            icon: <HomeOutlined />,
            label: 'Tổng quan',
            onClick: () => navigate('/ky-thuat/dashboard')
        },
        {
            key: 'schedule',
            icon: <CalendarOutlined />,
            label: 'Lịch trình',
            onClick: () => navigate('/ky-thuat/schedule')
        },
        {
            key: 'execution',
            icon: <ToolOutlined />,
            label: 'Thi công',
            onClick: () => navigate('/ky-thuat/execution')
        },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Cá nhân',
            onClick: () => navigate('/ky-thuat/profile')
        }
    ];

    const userMenu = (
        <Menu items={[
            { key: '1', label: 'Cài đặt' },
            { key: '2', label: 'Đăng xuất', onClick: () => navigate('/login') },
        ]} />
    );

    return (
        <Layout className="ky-thuat-layout">
            <Header className="ky-thuat-header">
                <div className="header-brand">
                    <span className="brand-text">Kỹ Thuật</span>
                </div>
                <div className="header-actions">
                    <Badge count={2} size="small">
                        <BellOutlined className="header-icon" />
                    </Badge>
                    <Dropdown overlay={userMenu} trigger={['click']}>
                        <Avatar style={{ marginLeft: 16, cursor: 'pointer', backgroundColor: '#13a8a8' }}>KT</Avatar>
                    </Dropdown>
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
