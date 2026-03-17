import React from 'react';
import { Layout, Input, Badge, Space } from 'antd';
import { SearchOutlined, BellOutlined } from '@ant-design/icons';
import { UserMenu } from '../../components/common/Header/UserMenu';


/**
 * AdminTopBar - Top navigation bar
 * Components: Logo, Global Search, Notifications, User Profile
 */
const AdminTopBar: React.FC = () => {

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
                padding: '0 24px',
                borderBottom: '1px solid #f0f0f0',
                height: 64,
            }}
        >
            {/* Logo & App Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #1976D2, #42A5F5)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}
                >
                    S
                </div>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#1976D2' }}>
                    SIRA Admin
                </span>
            </div>

            {/* Global Search */}
            <Input.Search
                placeholder="Tìm kiếm người dùng, dự án..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 400 }}
                prefix={<SearchOutlined />}
            />

            {/* Right Section: Notifications + User */}
            <Space size={24}>
                {/* Notifications */}
                <Badge count={3} offset={[-5, 5]}>
                    <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                </Badge>

                {/* User Profile */}
                <UserMenu avatarColor="#1976D2" />
            </Space>
        </Layout.Header>
    );
};

export default AdminTopBar;
