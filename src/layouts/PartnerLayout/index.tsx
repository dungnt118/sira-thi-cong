import {
    DashboardOutlined,
    DollarOutlined,
    ProjectOutlined,
    ShoppingOutlined,
    TeamOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';
import { AppShellHeader } from '../shared/AppShellHeader';
import { BaseLayout } from '../shared/BaseLayout';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/admin/partner/dashboard',
        icon: <DashboardOutlined />,
        label: LABELS.PARTNER.DASHBOARD,
    },
    {
        key: '/admin/partner/my-projects',
        icon: <ProjectOutlined />,
        label: LABELS.PARTNER.MY_PROJECTS,
    },
    {
        key: '/admin/partner/upload-evidence',
        icon: <UploadOutlined />,
        label: LABELS.PARTNER.UPLOAD_EVIDENCE,
    },
    {
        key: '/admin/partner/materials',
        icon: <ShoppingOutlined />,
        label: LABELS.PARTNER.MATERIALS,
    },
    {
        key: '/admin/partner/labor',
        icon: <TeamOutlined />,
        label: LABELS.PARTNER.LABOR,
    },
    {
        key: '/admin/partner/payments',
        icon: <DollarOutlined />,
        label: LABELS.PARTNER.PAYMENTS,
    },
];

const PartnerSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div
                style={{
                    height: 64,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    padding: '0 8px',
                }}
            >
                <AppBrandLogo size="sm" variant="onDark" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>BACPartner</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </div>
        </div>
    );
};

const PartnerTopBar: React.FC = () => (
    <AppShellHeader
        productTitle="BACPartner"
        brandAccentColor="#13c2c2"
        avatarColor="#13c2c2"
        showSearch={false}
    />
);

export const PartnerLayout: React.FC = () => {
    return <BaseLayout sidebar={<PartnerSidebar />} topBar={<PartnerTopBar />} />;
};
