import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Drawer, Grid, theme } from 'antd';
import AdminTopBar from './TopBar';
import AdminSidebar from './Sidebar';
import './AdminLayoutV2.css';

const { Content } = Layout;
const { useBreakpoint } = Grid;

/**
 * AdminLayoutV2 - Simplified admin layout for construction SME
 * Focus: User/Role Management, Audit Log, Reports, Settings
 */
const AdminLayoutV2: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [drawerVisible, setDrawerVisible] = React.useState(false);
    const screens = useBreakpoint();
    const { token: { colorBgContainer } } = theme.useToken();
    
    // isMobile if width < 992px (Ant Design lg breakpoint)
    const isMobile = screens.md === true && screens.lg === false || screens.md === false;

    return (
        <Layout className="admin-layout-v2" style={{ minHeight: '100vh', background: colorBgContainer }}>
            {/* Top Bar: Logo, Search, Notifications, Profile */}
            <AdminTopBar 
                onMenuClick={() => setDrawerVisible(true)} 
                isMobile={isMobile} 
                collapsed={collapsed}
                onCollapse={setCollapsed}
            />

            <Layout>
                {/* Sidebar: Render as Sider on desktop, Drawer on mobile */}
                {isMobile ? (
                    <Drawer
                        placement="left"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        styles={{ body: { padding: 0 } }}
                        width={240}
                        closable={false}
                    >
                        <AdminSidebar 
                            collapsed={false} 
                            onCollapse={() => {}} 
                            isDrawer 
                            onItemClick={() => setDrawerVisible(false)}
                        />
                    </Drawer>
                ) : (
                    <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
                )}

                {/* Main Content Area */}
                <Layout style={{ padding: isMobile ? '0' : '0 16px 24px', background: '#f0f2f5' }}>
                    <Content
                        style={{
                            padding: isMobile ? 8 : 24,
                            margin: 0,
                            minHeight: 280,
                            background: isMobile ? '#f0f2f5' : '#fff',
                            borderRadius: isMobile ? 0 : '8px',
                            marginTop: isMobile ? 0 : 16,
                        }}
                    >
                        <Outlet context={{ isMobile }} />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminLayoutV2;
