import React from 'react';
import { Menu, Badge, Space, Grid } from 'antd';
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
import { UserMenu } from '../../components/common/Header/UserMenuWithDocs';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';

const menuItems: MenuProps['items'] = [
    {
        key: '/admin/kt/dashboard',
        icon: <DashboardOutlined />,
        label: 'Tổng quan',
    },
    {
        key: '/admin/kt/inventory',
        icon: <InboxOutlined />,
        label: 'QL Vật tư',
        children: [
            { key: '/admin/kt/inventory/materials', label: 'Danh mục vật tư' },
            { key: '/admin/kt/inventory/distributors', label: 'Nhà phân phối' },
            { key: '/admin/kt/inventory/stock-out', label: 'Phiếu xuất kho' },
            { key: '/admin/kt/inventory/stock-in', label: 'Phiếu nhập kho' },
            { key: '/admin/kt/inventory/history', label: 'Lịch sử xuất/nhập' },
        ],
    },
    {
        key: '/admin/kt/assets',
        icon: <ToolOutlined />,
        label: 'QL Tài sản',
        children: [
            { key: '/admin/kt/assets/list', label: 'Danh mục tài sản' },
            { key: '/admin/kt/assets/allocation', label: 'Yêu cầu Cấp phát' },
            { key: '/admin/kt/assets/allocation-history', label: 'Lịch sử cấp phát' },
            { key: '/admin/kt/assets/maintenance', label: 'Bảo trì & Sửa chữa' },
        ],
    },
    {
        key: '/admin/kt/finance',
        icon: <DollarOutlined />,
        label: 'Thanh toán',
        children: [
            { key: '/admin/kt/finance/milestones', label: 'Theo dõi đợt TT' },
            { key: '/admin/kt/finance/report', label: 'Báo cáo tài chính' },
        ],
    },
    {
        key: '/admin/kt/expenditures',
        icon: <BankOutlined />,
        label: 'Khoản chi',
        children: [
            { key: '/admin/kt/expenditures/payment-requests', label: 'Yêu cầu chi' },
            { key: '/admin/kt/expenditures/company-bank-accounts', label: 'Tài khoản Công ty' },
            { key: '/admin/kt/expenditures/beneficiary-contacts', label: 'Tài khoản thụ hưởng' },
        ],
    },
    {
        key: '/admin/kt/warranty',
        icon: <SafetyOutlined />,
        label: 'Bảo hành',
        children: [
            { key: '/admin/kt/warranty/cards', label: 'Phiếu bảo hành' },
            { key: '/admin/kt/warranty/schedule', label: 'Lịch nhắc bảo hành' },
        ],
    },
    {
        key: '/admin/kt/reports',
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
                    justifyContent: 'center', gap: 10, color: '#fff', fontSize: 15, fontWeight: 700,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    padding: '0 8px',
                }}
            >
                <AppBrandLogo size="sm" variant="onDark" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Kế toán</span>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['/admin/kt/inventory', '/admin/kt/assets', '/admin/kt/finance', '/admin/kt/warranty', '/admin/kt/expenditures']}
                items={menuItems}
                onClick={e => navigate(e.key)}
            />
        </div>
    );
};

const AccountantTopBar: React.FC = () => {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    // User menu logic moved to shared UserMenu component

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                minWidth: 0,
                padding: isMobile ? '0 8px 0 4px' : '0 24px',
                height: '100%',
                gap: isMobile ? 8 : 12,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    minWidth: 0,
                    flex: '1 1 auto',
                    overflow: 'hidden',
                }}
            >
                <AppBrandLogo size={isMobile ? 'sm' : 'md'} />
                <span
                    style={{
                        fontSize: isMobile ? 14 : 16,
                        fontWeight: 600,
                        color: '#52c41a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                    }}
                >
                    Lam Bac – Kế toán
                </span>
            </div>
            <Space size={isMobile ? 12 : 24} style={{ minWidth: 0, flex: '0 1 auto' }}>
                <Badge count={3} offset={[-5, 5]}>
                    <BellOutlined style={{ fontSize: isMobile ? 18 : 20, cursor: 'pointer' }} />
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
            navigate(`/admin/${role.toLowerCase()}/dashboard`);
            return;
        }

        if (!role) {
            navigate('/login');
        }
    }, [navigate, role]);

    return <BaseLayout sidebar={<AccountantSidebar />} topBar={<AccountantTopBar />} />;
};

export default AccountantV3Layout;
