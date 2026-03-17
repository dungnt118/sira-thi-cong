import React from 'react';
import { Menu, Badge, Space, Grid, Input } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    CalendarOutlined,
    UserOutlined, BellOutlined, SearchOutlined
} from '@ant-design/icons';
import { BaseLayout } from '../shared/BaseLayout';
import { UserMenu } from '../../components/common/Header/UserMenu';

const { useBreakpoint } = Grid;
const { Search } = Input;

const menuItems: MenuProps['items'] = [
    {
        key: '/giam-sat-group',
        icon: <CalendarOutlined />,
        label: 'Khảo sát & Hiện trường',
        children: [
            { key: '/giam-sat/surveys', label: 'Lịch khảo sát' },
            { key: '/giam-sat/journey-feed', label: 'Feed hành trình' },
        ],
    },
];

const GiamSatSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                SIRA GS
            </div>
            <Menu
                theme="dark" mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['/giam-sat-group']}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
            />
        </div>
    );
};

const GiamSatTopBar: React.FC = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    // User menu logic moved to shared UserMenu component
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: isMobile ? '0 12px' : '0 24px', height: '100%', gap: 12 }}>
            {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #fa8c16, #ffc069)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' }}>G</div>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#fa8c16' }}>SIRA Giám sát</span>
                </div>
            )}
            <Search placeholder="Tìm khảo sát..." allowClear style={{ maxWidth: 360, flex: 1 }} prefix={<SearchOutlined />} />
            <Space size={isMobile ? 12 : 24} style={{ flexShrink: 0 }}>
                <Badge count={2} offset={[-5, 5]}><BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} /></Badge>
                <UserMenu avatarColor="#fa8c16" showName={!isMobile} />
            </Space>
        </div>
    );
};

export const GiamSatLayout: React.FC = () => {
    return <BaseLayout sidebar={<GiamSatSidebar />} topBar={<GiamSatTopBar />} />;
};
