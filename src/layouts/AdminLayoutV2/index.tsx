import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import AdminTopBar from './TopBar';
import AdminSidebar from './Sidebar';
import { Drawer } from 'antd';
import './AdminLayoutV2.css';

const { Content } = Layout;

/**
 * AdminLayoutV2 - Simplified admin layout for construction SME
 * Focus: User/Role Management, Audit Log, Reports, Settings
 * Platform: Desktop-only (no mobile)
 */
const AdminLayoutV2: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [drawerVisible, setDrawerVisible] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 992);

    React.useEffect(() => {
        const mql = window.matchMedia('(max-width: 991px)');
        const onChange = () => setIsMobile(mql.matches);
        mql.addEventListener('change', onChange);
        // Initial check
        setIsMobile(mql.matches);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    return (
        <Layout className="admin-layout-v2" style={{ minHeight: '100vh' }}>
            {/* Top Bar: Logo, Search, Notifications, Profile */}
            <AdminTopBar onMenuClick={() => setDrawerVisible(true)} isMobile={isMobile} />

            <Layout>
                {/* Sidebar: Render as Sider on desktop, Drawer on mobile */}
                {isMobile ? (
                    <Drawer
                        placement="left"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        bodyStyle={{ padding: 0 }}
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
