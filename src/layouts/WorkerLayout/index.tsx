import React, { useState } from 'react';
import { Layout, Badge, Avatar, Dropdown, Space, Drawer } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    HomeOutlined,
    AppstoreOutlined,
    InboxOutlined,
    UserOutlined,
    BellOutlined,
    LogoutOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

// Bottom nav tabs for mobile supervisor
const navTabs = [
    { key: '/supervisor/home', icon: <HomeOutlined />, label: 'Trang chủ' },
    { key: '/supervisor/projects', icon: <AppstoreOutlined />, label: 'Công trình' },
    { key: '/supervisor/materials', icon: <InboxOutlined />, label: 'Vật tư' },
    { key: '/supervisor/profile', icon: <UserOutlined />, label: 'Tôi' },
];

export const SupervisorLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const activeTab = navTabs.find(t =>
        location.pathname.startsWith(t.key)
    )?.key || '/supervisor/home';

    const userMenuItems: MenuProps['items'] = [
        { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ của tôi' },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', onClick: () => navigate('/login') },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f6fa' }}>
            {/* Mobile Top Header */}
            <Header
                style={{
                    background: '#1976D2',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    height: 56,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                        style={{
                            width: 32, height: 32, background: 'rgba(255,255,255,0.2)',
                            borderRadius: 8, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16,
                        }}
                    >
                        S
                    </div>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>
                        SIRA Giám Sát
                    </span>
                </div>
                <Space>
                    <Badge count={2} offset={[-4, 4]}>
                        <BellOutlined
                            style={{ fontSize: 20, color: '#fff', cursor: 'pointer' }}
                            onClick={() => setDrawerOpen(true)}
                        />
                    </Badge>
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Avatar
                            size={32}
                            style={{ background: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}
                            icon={<UserOutlined />}
                        />
                    </Dropdown>
                </Space>
            </Header>

            {/* Main Content */}
            <Content
                style={{
                    padding: '16px 16px 80px',
                    maxWidth: 768,
                    margin: '0 auto',
                    width: '100%',
                    minHeight: 'calc(100vh - 56px - 60px)',
                }}
            >
                <Outlet />
            </Content>

            {/* Bottom Navigation */}
            <Footer
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    padding: 0,
                    background: '#fff',
                    borderTop: '1px solid #e8e8e8',
                    display: 'flex',
                    boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
                    zIndex: 100,
                }}
            >
                {navTabs.map(tab => {
                    const isActive = activeTab === tab.key;
                    return (
                        <div
                            key={tab.key}
                            onClick={() => navigate(tab.key)}
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                                cursor: 'pointer',
                                color: isActive ? '#1976D2' : '#8c8c8c',
                                fontSize: 10,
                                fontWeight: isActive ? 600 : 400,
                                background: isActive ? '#f0f5ff' : 'transparent',
                                borderTop: isActive ? '2px solid #1976D2' : '2px solid transparent',
                                transition: 'all 0.2s',
                            }}
                        >
                            <div style={{ fontSize: 20 }}>{tab.icon}</div>
                            <span>{tab.label}</span>
                        </div>
                    );
                })}
            </Footer>

            {/* Notification Drawer */}
            <Drawer
                title="Thông báo"
                placement="right"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                width={300}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                        { text: 'PM duyệt 2 ảnh bước 11 của DA-001', time: '30 phút trước', icon: '✅' },
                        { text: 'DA-002 có vật tư sẵn sàng xuất, vui lòng ký nhận', time: '2 giờ trước', icon: '📦' },
                        { text: 'PM yêu cầu báo cáo tổng hợp DA-001', time: '3 giờ trước', icon: '📋' },
                    ].map((n, i) => (
                        <div key={i} style={{ padding: 12, background: '#f5f6fa', borderRadius: 8 }}>
                            <div style={{ fontSize: 13 }}>{n.icon} {n.text}</div>
                            <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{n.time}</div>
                        </div>
                    ))}
                </div>
            </Drawer>
        </Layout>
    );
};

export default SupervisorLayout;
