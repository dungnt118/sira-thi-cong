import React from 'react';
import { Menu, Badge, Avatar, Dropdown, Space, Grid, Input } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    InboxOutlined, ClockCircleOutlined, FormOutlined,
    MessageOutlined, UserOutlined, LogoutOutlined, BellOutlined, SearchOutlined
} from '@ant-design/icons';
import { BaseLayout } from '../shared/BaseLayout';

const { useBreakpoint } = Grid;
const { Search } = Input;

const menuItems: MenuProps['items'] = [
    {
        key: '/sale/journeys-group',
        icon: <InboxOutlined />,
        label: 'Hành trình khách hàng',
        children: [
            { key: '/sale/journeys', label: 'Journey Inbox' },
            { key: '/sale/journeys/sla', label: 'SLA Queue' },
            { key: '/sale/journeys/surveys', label: 'Khảo sát' },
            { key: '/sale/journeys/communications', label: 'Giao tiếp khách hàng' },
        ],
    },
];

const SaleSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 18, fontWeight: 'bold',
            }}>
                SIRA Sale
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['/sale/journeys-group']}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
            />
        </div>
    );
};

const SaleTopBar: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const userMenu: MenuProps['items'] = [
        { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', onClick: () => navigate('/login') },
    ];

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: isMobile ? '0 12px' : '0 24px', height: '100%', gap: 12 }}>
            {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #52c41a, #95de64)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' }}>S</div>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#52c41a' }}>SIRA Sale</span>
                </div>
            )}
            <Search placeholder="Tìm hành trình..." allowClear style={{ maxWidth: 400, flex: 1 }} prefix={<SearchOutlined />} />
            <Space size={isMobile ? 12 : 24} style={{ flexShrink: 0 }}>
                <Badge count={3} offset={[-5, 5]}><BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} /></Badge>
                <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                    <Space style={{ cursor: 'pointer' }}>
                        <Avatar icon={<UserOutlined />} style={{ background: '#52c41a' }} />
                        {!isMobile && <span style={{ fontWeight: 500 }}>Sale Trần</span>}
                    </Space>
                </Dropdown>
            </Space>
        </div>
    );
};

export const SaleLayout: React.FC = () => {
    return <BaseLayout sidebar={<SaleSidebar />} topBar={<SaleTopBar />} />;
};
