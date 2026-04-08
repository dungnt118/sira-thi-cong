import React from 'react';
import { Avatar, Dropdown, Space, Typography } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    SwapOutlined,
    CustomerServiceOutlined,
    ProjectOutlined,
    SafetyOutlined,
    DollarOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { useAuth } from '../../../hooks/useAuth';
import { forceSwitchRole, MANUAL_ROLE_KEY } from '../../../utils/authUtils';
import { loadUserData } from '@/pages/shared/auth/store/actions/user.actions';
import type { MenuProps } from 'antd';

const { Text } = Typography;

interface UserMenuProps {
    avatarColor?: string;
    showName?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({
    avatarColor = '#1890ff',
    showName = true
}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, role, availableRoles, logout } = useAuth();

    const rolesList = [
        { key: 'ADMIN', title: 'Quản Trị Viên', icon: <UserOutlined />, path: '/admin/dashboard', color: '#1890ff' },
        { key: 'QL', title: 'Quản Lý Dự Án', icon: <ProjectOutlined />, path: '/admin/ql/dashboard', color: '#722ed1' },
        { key: 'KD', title: 'Kinh Doanh (Sale)', icon: <CustomerServiceOutlined />, path: '/admin/kd/dashboard', color: '#eb2f96' },
        { key: 'KYT', title: 'Kỹ Thuật', icon: <ProjectOutlined />, path: '/admin/kyt/dashboard', color: '#13a8a8' },
        { key: 'GS', title: 'Giám Sát', icon: <SafetyOutlined />, path: '/admin/gs/dashboard', color: '#52c41a' },
        { key: 'KT', title: 'Kế Toán', icon: <DollarOutlined />, path: '/admin/kt/dashboard', color: '#fa8c16' },
        { key: 'PARTNER', title: 'Đối Tác', icon: <TeamOutlined />, path: '/admin/partner/dashboard', color: '#13c2c2' },
    ];

    const handleSwitch = (roleKey: string, path: string) => {
        localStorage.setItem(MANUAL_ROLE_KEY, roleKey);
        // Force refresh to ensure full context reload with the new role
        window.location.assign(path);
    };

    const menuItems: MenuProps['items'] = [
        {
            key: 'user-info',
            label: (
                <div style={{ padding: '4px 0' }}>
                    <Text strong>{user?.username || 'Người dùng'}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{role?.toUpperCase() || 'NO ROLE'}</Text>
                </div>
            ),
            disabled: true,
        },
        { type: 'divider' },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
            onClick: () => navigate('/personal/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
            onClick: () => navigate(`/${role?.toLowerCase()}/settings`),
        },
        { type: 'divider' },
        {
            key: 'switch-role',
            icon: <SwapOutlined />,
            label: <Text strong>Chuyển quyền nhanh</Text>,
            children: (rolesList || [])
                .filter(r => availableRoles?.includes(r.key) && r.key !== role)
                .map(r => ({
                    key: `switch-${r.key}`,
                    icon: React.cloneElement(r.icon as React.ReactElement<any>, { style: { color: r.color } }),
                    label: r.title,
                    onClick: () => handleSwitch(r.key, r.path),
                })),
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
            onClick: () => {
                logout();
                navigate('/login');
            },
        },
    ];

    return (
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
                <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: avatarColor }}
                />
                {showName && (
                    <span style={{ fontWeight: 500 }}>
                        {user?.username || 'User'}
                    </span>
                )}
            </Space>
        </Dropdown>
    );
};
