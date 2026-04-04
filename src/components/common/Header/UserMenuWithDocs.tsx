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
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { forceSwitchRole } from '../../../utils/authUtils';
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
    const { user, role, availableRoles, logout } = useAuth();

    const rolesList = [
        { key: 'ADMIN', title: 'Quản trị viên', icon: <UserOutlined />, path: '/admin/dashboard', color: '#1890ff' },
        { key: 'QL', title: 'Quản lý dự án', icon: <ProjectOutlined />, path: '/ql/dashboard', color: '#722ed1' },
        { key: 'KD', title: 'Kinh doanh (Sale)', icon: <CustomerServiceOutlined />, path: '/kd/dashboard', color: '#eb2f96' },
        { key: 'KYT', title: 'Kỹ thuật', icon: <ProjectOutlined />, path: '/kyt/dashboard', color: '#13a8a8' },
        { key: 'GS', title: 'Giám sát', icon: <SafetyOutlined />, path: '/gs/dashboard', color: '#52c41a' },
        { key: 'KT', title: 'Kế toán', icon: <DollarOutlined />, path: '/kt/dashboard', color: '#fa8c16' },
        { key: 'PARTNER', title: 'Đối tác', icon: <TeamOutlined />, path: '/partner/dashboard', color: '#13c2c2' }
    ];

    const handleSwitch = (roleKey: string, path: string) => {
        forceSwitchRole(roleKey, path);
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
            onClick: () => navigate(`/${role?.toLowerCase()}/profile`)
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
                navigate('/login');
            }
        }
    ];

    return (
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: avatarColor }} />
                {showName && <span style={{ fontWeight: 500 }}>{user?.username || 'User'}</span>}
            </Space>
        </Dropdown>
    );
};

export default UserMenu;
