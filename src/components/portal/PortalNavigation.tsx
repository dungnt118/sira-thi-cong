import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Avatar, Space, Typography, Dropdown, MenuProps, Grid } from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    LoginOutlined,
    DashboardOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { AppBrandLogo } from '../common/AppBrandLogo';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const PortalNavigation: React.FC = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isSmall = !screens.sm;
    const { isAuthenticated, user, role, logout } = useAuth();

    const getDashboardPath = (userRole: string | null) => {
        if (!userRole) return '/admin';
        const r = userRole.toLowerCase();
        if (r === 'pm' || r === 'ql') return '/admin/ql/dashboard';
        if (r === 'sale' || r === 'kd') return '/admin/kd/dashboard';
        if (r === 'gs' || r === 'giam-sat') return '/admin/gs/dashboard';
        if (r === 'kt' || r === 'ke-toan') return '/admin/kt/dashboard';
        if (r === 'kyt' || r === 'ky-thuat') return '/admin/kyt/dashboard';
        return '/admin';
    };

    const handleAction = () => {
        if (isAuthenticated) {
            navigate(getDashboardPath(role));
        } else {
            navigate('/login');
        }
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => {
                logout();
                navigate('/portal');
            }
        }
    ];

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            height: '64px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '0 12px' : '0 20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Brand Logo & Home Link */}
                <Space size={isMobile ? "small" : "large"}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AppBrandLogo size={32} to="" />
                        <Text strong style={{ fontSize: isMobile ? 15 : 18, color: '#0f172a', letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
                            BAC GROUP
                        </Text>
                    </Link>

                    {isAuthenticated && (
                        <Space size={isMobile ? "middle" : "middle"} className="nav-links" style={{ marginLeft: isMobile ? 8 : 24 }}>
                            <Link to={getDashboardPath(role)} style={{
                                color: '#475569',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}>
                                <DashboardOutlined /> {!isMobile && "Vào Dashboard"}
                            </Link>
                            {!isMobile && (
                                <Link to={`/admin/${role?.toLowerCase()}/profile`} style={{
                                    color: '#475569',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6
                                }}>
                                    <UserOutlined /> Hồ sơ
                                </Link>
                            )}
                        </Space>
                    )}
                </Space>

                {/* Auth Section */}
                <div className="auth-section">
                    {isAuthenticated ? (
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '30px',
                                background: '#f1f5f9',
                                transition: 'all 0.2s'
                            }}>
                                <Avatar
                                    size="small"
                                    icon={<UserOutlined />}
                                    src={user?.avatar}
                                    style={{ background: '#38bdf8', flexShrink: 0 }}
                                />
                                {!isMobile && (
                                    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 120 }}>
                                        <Text strong style={{ fontSize: 13, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {user?.displayName || user?.username}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 10 }}>{role?.toUpperCase()}</Text>
                                    </div>
                                )}
                            </div>
                        </Dropdown>
                    ) : (
                        <Button
                            type="primary"
                            icon={<LoginOutlined />}
                            onClick={handleAction}
                            size={isMobile ? 'small' : 'middle'}
                            style={{
                                borderRadius: '8px',
                                background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                                border: 'none',
                                fontWeight: 600,
                                boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.3)'
                            }}
                        >
                            {!isMobile && "Đăng nhập"}
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PortalNavigation;
