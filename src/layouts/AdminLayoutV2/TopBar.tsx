import { MenuOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import React from 'react';
import { AppShellHeader } from '../shared/AppShellHeader';

interface AdminTopBarProps {
    onMenuClick?: () => void;
    isMobile?: boolean;
}

/**
 * Top bar Admin — cùng shell header với các vai trò (Notify + UserMenu + chuyển quyền).
 */
const AdminTopBar: React.FC<AdminTopBarProps> = ({ onMenuClick, isMobile }) => {
    return (
        <Layout.Header
            style={{
                padding: 0,
                background: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                lineHeight: 'normal',
                height: 'auto',
                minHeight: 56,
                borderBottom: '1px solid #f0f0f0',
            }}
        >
            <AppShellHeader
                leadingSlot={
                    isMobile ? (
                        <Button type="text" icon={<MenuOutlined />} onClick={onMenuClick} style={{ fontSize: 18 }} />
                    ) : null
                }
                productTitle="BACAdmin"
                brandAccentColor="#1976D2"
                avatarColor="#1976D2"
                logoSize="md"
                placeholder="Tìm kiếm..."
                onSearch={(value) => {
                    console.log('Search:', value);
                }}
                userMenuShowName={!isMobile}
            />
        </Layout.Header>
    );
};

export default AdminTopBar;
