import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import AdminTopBar from './TopBar';
import AdminSidebar from './Sidebar';
import './AdminLayoutV2.css';

const { Content } = Layout;

/**
 * AdminLayoutV2 - Simplified admin layout for construction SME
 * Focus: User/Role Management, Audit Log, Reports, Settings
 * Platform: Desktop-only (no mobile)
 */
const AdminLayoutV2: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <Layout className="admin-layout-v2" style={{ minHeight: '100vh' }}>
            {/* Top Bar: Logo, Search, Notifications, Profile */}
            <AdminTopBar />

            <Layout>
                {/* Sidebar: 6-item menu */}
                <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />

                {/* Main Content Area */}
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: '#fff',
                            borderRadius: '8px',
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminLayoutV2;
