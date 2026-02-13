import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Breadcrumbs } from '@components/common/Breadcrumbs';
import './BaseLayout.css';

const { Header, Sider, Content } = Layout;

interface BaseLayoutProps {
    sidebar: React.ReactNode;
    topBar: React.ReactNode;
    children?: React.ReactNode;
}

/**
 * BaseLayout - Shared layout structure for all roles
 * Provides consistent layout with sidebar, topbar, and content area
 */
export const BaseLayout: React.FC<BaseLayoutProps> = ({ sidebar, topBar }) => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={240}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                {sidebar}
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
                <Header
                    style={{
                        padding: 0,
                        background: '#fff',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    {topBar}
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#f0f2f5' }}>
                    <Breadcrumbs />
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};
