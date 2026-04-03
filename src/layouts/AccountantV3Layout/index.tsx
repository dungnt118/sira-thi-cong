import React from 'react';
import { Menu, Badge, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    DashboardOutlined,
    InboxOutlined,
    DollarOutlined,
    SafetyOutlined,
    BarChartOutlined,
    BellOutlined,
    ToolOutlined,
    BankOutlined,
    ContactsOutlined,
} from '@ant-design/icons';
import { BaseLayout } from '../shared/BaseLayout';
import { UserMenu } from '../../components/common/Header/UserMenu';

const menuItems: MenuProps['items'] = [
    {
        key: '/kt/dashboard',
        icon: <DashboardOutlined />,
        label: 'Tổng quan',
    },
    {
        key: '/kt/inventory',
        icon: <InboxOutlined />,
        label: 'QL Vật tư',
        children: [
            { key: '/kt/inventory/materials', label: 'Danh mục vật tư' },
            { key: '/kt/inventory/distributors', label: 'Nhà phân phối' },
            { key: '/kt/inventory/stock-out', label: 'Phiếu xuất kho' },
            { key: '/kt/inventory/stock-in', label: 'Phiếu nhập kho' },
            { key: '/kt/inventory/history', label: 'Lịch sử xuất/nhập' },
        ],
    },
    {
        key: '/kt/assets',
        icon: <ToolOutlined />,
        label: 'QL Tài sản',
        children: [
            { key: '/kt/assets/list', label: 'Danh mục tài sản' },
            { key: '/kt/assets/allocation', label: 'Yêu cầu Cấp phát' },
            { key: '/kt/assets/allocation-history', label: 'Lịch sử cấp phát' },
            { key: '/kt/assets/maintenance', label: 'Bảo trì & Sửa chữa' },
        ],
    },
    {
        key: '/kt/finance',
        icon: <DollarOutlined />,
        label: 'Thanh toán',
        children: [
            { key: '/kt/finance/milestones', label: 'Theo dõi đợt TT' },
            { key: '/kt/finance/report', label: 'Báo cáo tài chính' },
        ],
    },
    {
        key: '/kt/expenditures',
        icon: <BankOutlined />,
        label: 'Khoản chi',
        children: [
            { key: '/kt/expenditures/payment-requests', label: 'Yêu cầu chi' },
            { key: '/kt/expenditures/company-bank-accounts', label: 'Tài khoản Công ty' },
            { key: '/kt/expenditures/beneficiary-contacts', label: 'Tài khoản thụ hưởng' },
        ],
    },
    {
        key: '/kt/warranty',
        icon: <SafetyOutlined />,
        label: 'Bảo hành',
        children: [
            { key: '/kt/warranty/cards', label: 'Phiếu bảo hành' },
            { key: '/kt/warranty/schedule', label: 'Lịch nhắc bảo hành' },
        ],
    },
    {
        key: '/kt/reports',
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
                defaultOpenKeys={['/kt/inventory', '/kt/assets', '/kt/finance', '/kt/warranty', '/kt/expenditures']}
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
    const navigate = useNavigate();
    const { role } = useAuth();

    React.useEffect(() => {
        if (role && role !== 'KT') {
            navigate(`/${role.toLowerCase()}/dashboard`);
            return;
        }

        if (!role) {
            navigate('/login');
        }
    }, [navigate, role]);

    return <BaseLayout sidebar={<AccountantSidebar />} topBar={<AccountantTopBar />} />;
};

export default AccountantV3Layout;
