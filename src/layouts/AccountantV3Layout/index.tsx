import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    DashboardOutlined,
    InboxOutlined,
    DollarOutlined,
    SafetyOutlined,
    BarChartOutlined,
    ToolOutlined,
    BankOutlined,
} from '@ant-design/icons';
import { BaseLayout } from '../shared/BaseLayout';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';
import { AppShellHeader } from '../shared/AppShellHeader';

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
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div
                style={{
                    height: 64, flexShrink: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 10, color: '#fff', fontSize: 15, fontWeight: 700,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    padding: '0 8px',
                }}
            >
                <AppBrandLogo size="sm" variant="onDark" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Kế toán</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={['/admin/kt/inventory', '/admin/kt/assets', '/admin/kt/finance', '/admin/kt/warranty', '/admin/kt/expenditures']}
                    items={menuItems}
                    onClick={e => navigate(e.key)}
                />
            </div>
        </div>
    );
};

const AccountantTopBar: React.FC = () => (
    <AppShellHeader
        productTitle="Lam Bac – Kế toán"
        brandAccentColor="#52c41a"
        avatarColor="#52c41a"
        logoSize="md"
        showSearch={false}
    />
);

export const AccountantV3Layout: React.FC = () => {
    const navigate = useNavigate();
    const { role, isAdmin } = useAuth();

    /**
     * UX-08 (Wave 3.5) — chỉ redirect 1 lần khi role thay đổi.
     * Tránh bouncing khi user navigate nội bộ (re-render trigger redirect).
     */
    const redirectedRole = React.useRef<string | null>(null);
    React.useEffect(() => {
        if (!role) {
            navigate('/login');
            return;
        }
        if (role !== 'KT' && !isAdmin && redirectedRole.current !== role) {
            redirectedRole.current = role;
            navigate(`/admin/${role.toLowerCase()}/dashboard`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role, isAdmin]);

    return <BaseLayout sidebar={<AccountantSidebar />} topBar={<AccountantTopBar />} />;
};

export default AccountantV3Layout;
