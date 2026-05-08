import React from 'react';
import { Avatar, Dropdown, Space, Typography } from 'antd';
import {
    BookOutlined,
    CustomerServiceOutlined,
    DollarOutlined,
    LogoutOutlined,
    ProjectOutlined,
    SafetyOutlined,
    SettingOutlined,
    SwapOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { useAuth } from '../../../hooks/useAuth';
import { forceSwitchRole, MANUAL_ROLE_KEY } from '../../../utils/authUtils';
import { loadUserData } from '@/pages/shared/auth/store/actions/user.actions';
import { buildDocumentationPath } from '../../../utils/documentation';

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
        { key: 'ADMIN', title: 'Quản trị viên', icon: <UserOutlined />, path: '/admin/dashboard', color: '#1890ff' },
        { key: 'QL', title: 'Quản lý dự án', icon: <ProjectOutlined />, path: '/admin/ql/dashboard', color: '#722ed1' },
        { key: 'KD', title: 'Kinh doanh (Sale)', icon: <CustomerServiceOutlined />, path: '/admin/kd/dashboard', color: '#eb2f96' },
        { key: 'KYT', title: 'Kỹ thuật', icon: <ProjectOutlined />, path: '/admin/kyt/dashboard', color: '#13a8a8' },
        { key: 'GS', title: 'Giám sát', icon: <SafetyOutlined />, path: '/admin/gs/dashboard', color: '#52c41a' },
        { key: 'KT', title: 'Kế toán', icon: <DollarOutlined />, path: '/admin/kt/dashboard', color: '#fa8c16' }
        // PARTNER role disabled in Wave 1 (gap-analysis 2026-05-08)
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
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {role?.toUpperCase() || 'NO ROLE'}
                    </Text>
                </div>
            ),
            disabled: true
        },
        { type: 'divider' },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
            onClick: () => navigate('/personal/profile')
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
            onClick: () => navigate(`/${role?.toLowerCase()}/settings`)
        },
        {
            key: 'documentation',
            icon: <BookOutlined />,
            label: 'BAC Document',
            onClick: () => navigate(buildDocumentationPath(role))
        },
        { type: 'divider' },
        {
            key: 'switch-role',
            icon: <SwapOutlined />,
            label: <Text strong>Chuyển quyền nhanh</Text>,
            children: rolesList
                .filter(item => availableRoles?.includes(item.key) && item.key !== role)
                .map(item => ({
                    key: `switch-${item.key}`,
                    icon: React.cloneElement(item.icon as React.ReactElement<{ style?: React.CSSProperties }>, {
                        style: { color: item.color }
                    }),
                    label: item.title,
                    onClick: () => handleSwitch(item.key, item.path)
                }))
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
            onClick: () => {
                logout();
            }
        }
    ];

    const userLabelStyles: React.CSSProperties = {
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: 0,
    };

    return (
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
            <Space style={{ cursor: 'pointer', minWidth: 0, maxWidth: '100%' }} size="small">
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: avatarColor, flexShrink: 0 }} />
                {showName && <span style={userLabelStyles}>{user?.username || 'User'}</span>}
            </Space>
        </Dropdown>
    );
};

export default UserMenu;
