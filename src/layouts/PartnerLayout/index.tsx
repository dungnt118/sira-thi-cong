import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    ProjectOutlined,
    UploadOutlined,
    ShoppingOutlined,
    TeamOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { LABELS } from '@utils/constants';
import { BaseLayout } from '../shared/BaseLayout';
import { UserMenu } from '../../components/common/Header/UserMenuWithDocs';
import { AppBrandLogo } from '../../components/common/AppBrandLogo';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/partner/dashboard',
        icon: <DashboardOutlined />,
        label: LABELS.PARTNER.DASHBOARD,
    },
    {
        key: '/partner/my-projects',
        icon: <ProjectOutlined />,
        label: LABELS.PARTNER.MY_PROJECTS,
    },
    {
        key: '/partner/upload-evidence',
        icon: <UploadOutlined />,
        label: LABELS.PARTNER.UPLOAD_EVIDENCE,
    },
    {
        key: '/partner/materials',
        icon: <ShoppingOutlined />,
        label: LABELS.PARTNER.MATERIALS,
    },
    {
        key: '/partner/labor',
        icon: <TeamOutlined />,
        label: LABELS.PARTNER.LABOR,
    },
    {
        key: '/partner/payments',
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
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div
                style={{
                    height: 64,
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
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>SIRA Partner</span>
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

const PartnerTopBar: React.FC = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AppBrandLogo size="sm" />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
                <UserMenu avatarColor="#13c2c2" />
            </div>
        </div>
    );
};

export const PartnerLayout: React.FC = () => {
    return <BaseLayout sidebar={<PartnerSidebar />} topBar={<PartnerTopBar />} />;
};
