import React from 'react';
import { Layout, Input, Badge, Space } from 'antd';
import { SearchOutlined, BellOutlined, MenuOutlined } from '@ant-design/icons';
import { UserMenu } from '../../components/common/Header/UserMenu';
import { Button } from 'antd';


interface AdminTopBarProps {
    onMenuClick?: () => void;
    isMobile?: boolean;
}

/**
 * AdminTopBar - Top navigation bar
 * Components: Logo, Global Search, Notifications, User Profile
 */
const AdminTopBar: React.FC<AdminTopBarProps> = ({ onMenuClick, isMobile }) => {

    // User dropdown menu logic moved to shared UserMenu component

    const handleSearch = (value: string) => {
        console.log('Search:', value);
        // TODO: Implement global search
    };

    return (
        <Layout.Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fff',
                padding: isMobile ? '0 16px' : '0 24px',
                borderBottom: '1px solid #f0f0f0',
                height: 64,
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Left Section: Menu Toggle (Mobile) + Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
                {isMobile && (
                    <Button 
                        type="text" 
                        icon={<MenuOutlined />} 
                        onClick={onMenuClick}
                        style={{ fontSize: 18 }}
                    />
                )}
                <div
                    style={{
                        width: isMobile ? 32 : 40,
                        height: isMobile ? 32 : 40,
                        background: 'linear-gradient(135deg, #1976D2, #42A5F5)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: isMobile ? 16 : 20,
                        fontWeight: 'bold',
                    }}
                >
                    S
                </div>
                {!isMobile && (
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#1976D2' }}>
                        SIRA Admin
                    </span>
                )}
            </div>

            {/* Global Search */}
            {!isMobile && (
                <Input.Search
                    placeholder="Tìm kiếm..."
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                />
            )}

            {/* Right Section: Notifications + User */}
            <Space size={isMobile ? 12 : 24}>
                {/* Search icon for mobile if needed, or just notifications */}
                {isMobile && <SearchOutlined style={{ fontSize: 18, cursor: 'pointer' }} />}
                
                {/* Notifications */}
                <Badge count={3} offset={[-5, 5]} size="small">
                    <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                </Badge>

                {/* User Profile */}
                <UserMenu avatarColor="#1976D2" />
            </Space>
        </Layout.Header>
    );
};

export default AdminTopBar;
