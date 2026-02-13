import React from 'react';
import { Layout, Drawer, Button, Grid } from 'antd';
import { Outlet } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { Breadcrumbs } from '@components/common/Breadcrumbs';
import './BaseLayout.css';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

interface BaseLayoutProps {
    sidebar: React.ReactNode;
    topBar: React.ReactNode;
    children?: React.ReactNode;
}

/**
 * BaseLayout - Shared layout structure for all roles
 * Provides consistent layout with sidebar, topbar, and content area
 * Supports mobile responsive design with Drawer sidebar
 */
export const BaseLayout: React.FC<BaseLayoutProps> = ({ sidebar, topBar }) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const siderWidth = 240;
    const collapsedWidth = 80;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    width={siderWidth}
                    collapsedWidth={collapsedWidth}
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
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    placement="left"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    width={siderWidth}
                    bodyStyle={{ padding: 0, background: '#001529' }}
                    headerStyle={{ display: 'none' }}
                >
                    <div onClick={() => setMobileOpen(false)}>
                        {sidebar}
                    </div>
                </Drawer>
            )}

            <Layout
                style={{
                    marginLeft: isMobile ? 0 : (collapsed ? collapsedWidth : siderWidth),
                    transition: 'margin-left 0.2s',
                }}
            >
                <Header
                    style={{
                        padding: 0,
                        background: '#fff',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {isMobile && (
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setMobileOpen(true)}
                            style={{
                                fontSize: 18,
                                width: 48,
                                height: 48,
                                marginLeft: 8,
                            }}
                        />
                    )}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        {topBar}
                    </div>
                </Header>
                <Content style={{ margin: isMobile ? '16px 8px' : '24px 16px', padding: isMobile ? 12 : 24, background: '#f0f2f5' }}>
                    <Breadcrumbs />
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};
