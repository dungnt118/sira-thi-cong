import React, { useState } from 'react';
import { Badge, Button, Dropdown, Grid, Input, MenuProps, Modal, Popover, Space, Tabs } from 'antd';
import { BellOutlined, CheckOutlined, DownOutlined } from '@ant-design/icons';
import { useNotificationPanel } from './services/useNotificationPanel';
import NotifyList from './NotifyList';
import * as AntIcons from '@ant-design/icons';
import { useAppSelector } from 'app/store/hooks';
import { hasAuthenticatedUserSession } from './authSession';
import './notify.css';

const { useBreakpoint } = Grid;

type CategoryIconProps = {
    iconName: string;
    color: string;
};

type CategorySummary = {
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    total: number;
    unread: number;
};

type AntdIconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

function CategoryIcon({ iconName, color }: CategoryIconProps) {
    const iconMap = AntIcons as unknown as Record<string, AntdIconComponent>;
    const Icon = iconMap[iconName] ?? AntIcons.BellOutlined;

    return (
        <div style={{ background: color, borderRadius: 8, padding: 8, display: 'inline-flex' }}>
            <Icon style={{ color: '#fff', fontSize: 16 }} />
        </div>
    );
}

function NotifyContent() {
    const screens = useBreakpoint();
    const isDesktop = screens.md ?? true;
    const [popup, setPopup] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const panel = useNotificationPanel(popup);

    const categories: CategorySummary[] = panel.summary?.categories || [];
    const currentCategoryKey = panel.categoryId || 'all';
    const selectedCategory = categories.find((category) => category.categoryId === panel.categoryId);
    const selectedCategoryLabel = selectedCategory?.categoryName || 'Tất cả';

    const categoryItems: MenuProps['items'] = [
        {
            key: 'all',
            label: (
                <Space>
                    <AntIcons.BellOutlined />
                    <span>Tất cả</span>
                </Space>
            ),
            extra: panel.summary?.total || 0,
            onClick: () => panel.setCategoryId(null)
        },
        ...categories.map((category) => ({
            key: category.categoryId,
            label: (
                <Space>
                    <CategoryIcon iconName={category.categoryIcon} color={category.categoryColor} />
                    <span>{category.categoryName}</span>
                </Space>
            ),
            extra: category.unread > 0 ? <Badge count={category.unread} color="red" /> : category.total,
            onClick: () => panel.setCategoryId(category.categoryId)
        }))
    ];

    /** Popover desktop: tiêu đề + đánh dấu đọc cùng hàng (đủ chỗ). */
    const popoverTitleBar = (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                gap: 8,
                flexWrap: 'wrap',
                padding: '0 4px',
                boxSizing: 'border-box',
            }}
        >
            <span style={{ fontSize: 18, fontWeight: 600 }}>Thông báo</span>
            <Button type="text" size="small" onClick={() => panel.handleMarkAllRead()} icon={<CheckOutlined />}>
                Đánh dấu tất cả đã đọc
            </Button>
        </div>
    );

    /** Modal mobile: chỉ tiêu đề — tránh chồng với nút đóng (Ant Design đặt X góc phải header). */
    const modalTitleOnly = (
        <span style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3, display: 'block' }}>Thông báo</span>
    );

    const listScrollHeight = isDesktop ? 400 : 'calc(100dvh - 320px)';

    const panelBody = (
        <div
            style={{
                width: isDesktop ? 450 : '100%',
                maxWidth: '100%',
                maxHeight: isDesktop ? 600 : undefined,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                boxSizing: 'border-box',
            }}
        >
            {!isDesktop && (
                <div style={{ marginBottom: 12 }}>
                    <Button
                        type="default"
                        block
                        size="middle"
                        icon={<CheckOutlined />}
                        onClick={() => panel.handleMarkAllRead()}
                    >
                        Đánh dấu tất cả đã đọc
                    </Button>
                </div>
            )}

            <div
                style={{
                    marginBottom: 16,
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: 8,
                    alignItems: 'stretch',
                    minWidth: 0,
                }}
            >
                <div style={{ flex: isDesktop ? '0 1 60%' : '1 1 0%', minWidth: 0 }}>
                    <Input.Search
                        placeholder="Nhập để tìm kiếm"
                        allowClear
                        onSearch={(value) => panel.setKeyword(value)}
                        style={{ width: '100%' }}
                    />
                </div>

                <Dropdown
                    menu={{
                        items: categoryItems,
                        selectable: true,
                        selectedKeys: [currentCategoryKey],
                    }}
                    trigger={['click']}
                    getPopupContainer={(node) => node.parentElement ?? document.body}
                >
                    <Button title={selectedCategoryLabel} style={{ flexShrink: 0, height: '100%' }}>
                        <span
                            style={{
                                display: 'inline-block',
                                maxWidth: isDesktop ? 130 : 96,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                verticalAlign: 'bottom',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {selectedCategoryLabel}
                        </span>{' '}
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>

            <Tabs
                activeKey={panel.tab}
                onChange={(key) => panel.setTab(key as 'all' | 'unread' | 'read')}
                items={[
                    {
                        key: 'all',
                        label: `Tất cả ${panel.summary?.total || 0}`,
                        children: (
                            <NotifyList panel={panel} onClose={() => setPopup(false)} listScrollHeight={listScrollHeight} />
                        ),
                    },
                    {
                        key: 'unread',
                        label: `Chưa đọc ${panel.summary?.unread || 0}`,
                        children: (
                            <NotifyList panel={panel} onClose={() => setPopup(false)} listScrollHeight={listScrollHeight} />
                        ),
                    },
                    {
                        key: 'read',
                        label: `Đã đọc ${(panel.summary?.total || 0) - (panel.summary?.unread || 0)}`,
                        children: (
                            <NotifyList panel={panel} onClose={() => setPopup(false)} listScrollHeight={listScrollHeight} />
                        ),
                    },
                ]}
            />
        </div>
    );

    const bellButton = (
        <Button
            icon={<BellOutlined className={`text-18 ${panel.unreadCount > 0 ? 'notify-icon' : ''}`} />}
            shape="circle"
            className="toolbar-btn"
            type="default"
            onClick={isDesktop ? undefined : () => setPopup(true)}
        />
    );

    if (isDesktop) {
        return (
            <Popover
                open={popup}
                placement="bottomRight"
                onOpenChange={(visible) => setPopup(visible)}
                trigger="click"
                destroyOnHidden
                arrow={false}
                title={popoverTitleBar}
                content={panelBody}
                getPopupContainer={() => document.body}
            >
                <Badge count={panel.unreadCount} size="small">
                    {bellButton}
                </Badge>
            </Popover>
        );
    }

    return (
        <>
            <Badge count={panel.unreadCount} size="small">
                {bellButton}
            </Badge>
            <Modal
                open={popup}
                onCancel={() => setPopup(false)}
                footer={null}
                title={modalTitleOnly}
                closable
                destroyOnHidden
                zIndex={1100}
                width="100%"
                style={{ top: 0, padding: 0, maxWidth: '100vw', margin: 0 }}
                classNames={{ header: 'notify-mobile-modal__header' }}
                styles={{
                    content: {
                        margin: 0,
                        maxWidth: '100vw',
                        width: '100vw',
                        height: '100dvh',
                        maxHeight: '100dvh',
                        borderRadius: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    },
                    body: {
                        flex: 1,
                        overflow: 'auto',
                        padding: '12px 16px 16px',
                        paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
                        minHeight: 0,
                    },
                    header: {
                        flexShrink: 0,
                        marginBottom: 0,
                        paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
                        paddingBottom: 12,
                        paddingLeft: 16,
                        /* chừa chỗ cho nút đóng (~48px), tránh chữ chèn lên X */
                        paddingRight: 48,
                        borderBottom: '1px solid #f0f0f0',
                        alignItems: 'center',
                    },
                }}
                maskClosable
            >
                {panelBody}
            </Modal>
        </>
    );
}

function Notify() {
    const authUser = useAppSelector((state) => state.auth?.user);
    const hasUserSession = hasAuthenticatedUserSession(authUser);
    const isLoginPage = typeof window !== 'undefined' && window.location?.pathname?.startsWith('/login');

    if (!hasUserSession || isLoginPage) {
        return null;
    }

    return <NotifyContent />;
}

export default Notify;
