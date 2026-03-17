import React from 'react';
import { Menu, Badge, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    InboxOutlined,
    DollarOutlined,
    SafetyOutlined,
    BarChartOutlined,
    UserOutlined,
    BellOutlined,
} from '@ant-design/icons';
import { BaseLayout } from '../shared/BaseLayout';
import { UserMenu } from '../../components/common/Header/UserMenu';

const menuItems: MenuProps['items'] = [
    {
        key: '/accountant/dashboard',
        icon: <DashboardOutlined />,
        label: 'Tổng quan',
    },
    {
        key: '/accountant/inventory',
        icon: <InboxOutlined />,
        label: 'Kho vật tư',
        children: [
            { key: '/accountant/inventory/materials', label: 'Danh mục VT' },
            { key: '/accountant/inventory/stock-out', label: 'Phiếu xuất kho' },
            { key: '/accountant/inventory/stock-in', label: 'Phiếu nhập kho' },
            { key: '/accountant/inventory/history', label: 'Lịch sử kho' },
        ],
    },
    {
        key: '/accountant/finance',
        icon: <DollarOutlined />,
        label: 'Thanh toán',
        children: [
            { key: '/accountant/finance/milestones', label: 'Theo dõi đợt TT' },
            { key: '/accountant/finance/report', label: 'Báo cáo tài chính' },
        ],
    },
    {
        key: '/accountant/warranty',
        icon: <SafetyOutlined />,
        label: 'Bảo hành',
        children: [
            { key: '/accountant/warranty/cards', label: 'Phiếu bảo hành' },
            { key: '/accountant/warranty/schedule', label: 'Lịch nhắc bảo hành' },
        ],
    },
    {
        key: '/accountant/reports',
        icon: <BarChartOutlined />,
        label: 'Báo cáo',
    },
];

const AccountantSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div
                style={{
                    height: 64, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                💼 Kế toán
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['/accountant/inventory', '/accountant/finance', '/accountant/warranty']}
                items={menuItems}
                onClick={e => navigate(e.key)}
            />
        </div>
    );
};

const AccountantTopBar: React.FC = () => {
    // User menu logic moved to shared UserMenu component

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '0 24px', height: '100%', gap: 12,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 40, height: 40, background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                    borderRadius: 8, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold',
                }}>
                    K
                </div>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#52c41a' }}>Lam Bac – Kế toán</span>
            </div>
            <Space size={24}>
                <Badge count={3} offset={[-5, 5]}>
                    <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                </Badge>
                <UserMenu avatarColor="#52c41a" />
            </Space>
        </div>
    );
};

export const AccountantV3Layout: React.FC = () => {
    return <BaseLayout sidebar={<AccountantSidebar />} topBar={<AccountantTopBar />} />;
};

export default AccountantV3Layout;
