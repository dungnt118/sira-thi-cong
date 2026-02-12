import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import TopBar from '../TopBar';
import Sidebar from '../Sidebar';
import Breadcrumbs from '../Breadcrumbs';
import './AppLayout.css';

const { Content } = Layout;

const AppLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <TopBar />
            <Layout>
                <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
                <Layout>
                    <Breadcrumbs />
                    <Content
                        style={{
                            margin: 'var(--spacing-lg)',
                            padding: 'var(--spacing-lg)',
                            minHeight: 'calc(100vh - var(--topbar-height) - var(--breadcrumb-height))',
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
