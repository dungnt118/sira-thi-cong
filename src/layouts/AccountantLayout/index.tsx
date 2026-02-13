import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    DollarOutlined,
    FileTextOutlined,
    BarChartOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import { BaseLayout } from '../shared/BaseLayout';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/accountant/dashboard',
        icon: <DashboardOutlined />,
        label: LABELS.ACCOUNTANT.DASHBOARD,
    },
    {
        key: '/accountant/financial-summary',
        icon: <DollarOutlined />,
        label: LABELS.ACCOUNTANT.FINANCIAL_SUMMARY,
    },
    {
        key: '/accountant/payment-tracking',
        icon: <FileTextOutlined />,
        label: LABELS.ACCOUNTANT.PAYMENT_TRACKING,
    },
    {
        key: '/accountant/reports',
        icon: <BarChartOutlined />,
        label: LABELS.ACCOUNTANT.REPORTS,
    },
];

const AccountantSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div
                style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                }}
            >
                SIRA Kế Toán
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
            />
        </div>
    );
};

const AccountantTopBar: React.FC = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
            <div>{/* Breadcrumbs */}</div>
            <div style={{ display: 'flex', gap: 16 }}>
                {/* Search, Notifications, Profile */}
            </div>
        </div>
    );
};

export const AccountantLayout: React.FC = () => {
    return <BaseLayout sidebar={<AccountantSidebar />} topBar={<AccountantTopBar />} />;
};
