import React from 'react';
import { Layout, Drawer, Button, Grid } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { Breadcrumbs } from '@components/common/Breadcrumbs';
import './BaseLayout.css';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

/** Chi tiết công trình (JourneyDetail360): /admin/{ql|gs|kt}/journeys/:id — không hiển thị breadcrumb. */
const isJourneyDetailPath = (pathname: string): boolean => {
    const m = pathname.match(/^\/admin\/(ql|gs|kt)\/journeys\/([^/]+)$/);
    if (!m) return false;
    if (m[1] === 'ql' && m[2] === 'board') return false;
    return true;
};

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
    const location = useLocation();
    const isCustomerJourneySetting = location.pathname === '/admin/ql/settings/customer-journey';
    const hideBreadcrumbs =
        (isMobile && location.pathname.startsWith('/admin/ql')) ||
        isCustomerJourneySetting ||
        isJourneyDetailPath(location.pathname);

    const siderWidth = 240;
    const collapsedWidth = 80;
    const mobileDrawerWidth =
        typeof window !== 'undefined'
            ? Math.min(280, Math.max(window.innerWidth - 24, 240))
            : siderWidth;

    return (
        <Layout style={{ minHeight: '100vh', minWidth: 0 }}>
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
                    width={mobileDrawerWidth}
                    styles={{
                        body: { padding: 0, background: '#001529' },
                        header: { display: 'none' }
                    }}
                >
                    <div onClick={() => setMobileOpen(false)}>
                        {sidebar}
                    </div>
                </Drawer>
            )}

            <Layout
                className="base-layout__main"
                style={{
                    minWidth: 0,
                    marginLeft: isMobile ? 0 : (collapsed ? collapsedWidth : siderWidth),
                    transition: 'margin-left 0.2s',
                }}
            >
                <Header
                    className="base-layout__header"
                    style={{
                        padding: 0,
                        background: '#fff',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1000,
                        width: '100%',
                        minWidth: 0,
                        lineHeight: 'normal',
                        height: 'auto',
                        minHeight: 56,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'stretch',
                    }}
                >
                    {isMobile && (
                        <Button
                            type="text"
                            className="base-layout__menu-trigger"
                            icon={<MenuOutlined />}
                            onClick={() => setMobileOpen(true)}
                            style={{
                                fontSize: 18,
                                width: 48,
                                height: 48,
                                marginLeft: 'max(8px, env(safe-area-inset-left, 0px))',
                                alignSelf: 'center',
                                flexShrink: 0,
                            }}
                        />
                    )}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'stretch' }}>
                        {topBar}
                    </div>
                </Header>
                <Content
                    style={{
                        minWidth: 0,
                        width: '100%',
                        maxWidth: '100%',
                        margin: isCustomerJourneySetting ? 0 : (isMobile ? '0 0 12px' : '0 16px 24px'),
                        padding: isCustomerJourneySetting ? 0 : (isMobile ? (hideBreadcrumbs ? '0 12px 16px' : '12px 12px 16px') : 24),
                        background: '#f0f2f5',
                        boxSizing: 'border-box',
                        height: isCustomerJourneySetting ? 'calc(100vh - 64px)' : 'auto',
                        overflow: isCustomerJourneySetting ? 'hidden' : 'visible',
                    }}
                >
                    {!hideBreadcrumbs && <Breadcrumbs />}
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};
