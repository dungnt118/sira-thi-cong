import { SearchOutlined } from '@ant-design/icons';
import { Grid, Input } from 'antd';
import { Link } from 'react-router-dom';
import { AppBrandLogo } from '@/components/common/AppBrandLogo';
import { UserMenu } from '@/components/common/Header/UserMenuWithDocs';
import Notify from '@/components/notify';
import './AppShellHeader.css';

const { Search } = Input;
const { useBreakpoint } = Grid;

export type AppShellHeaderProps = {
    /** Tên hiển thị theo vai trò / ứng dụng (VD: BACSale, Quản lý dự án) */
    productTitle: string;
    /** Màu chữ tiêu đề (nhận diện vai trò) */
    brandAccentColor?: string;
    /** Màu avatar UserMenu */
    avatarColor?: string;
    placeholder?: string;
    onSearch?: (value: string) => void;
    /**
     * Có hiện ô tìm kiếm trên desktop hay không.
     * Mặc định: ẩn trên mobile, hiện từ breakpoint md.
     */
    showSearch?: boolean;
    /** Mặc định: hiện tên user trên desktop, ẩn trên mobile */
    userMenuShowName?: boolean;
    logoSize?: 'sm' | 'md';
    logoVariant?: React.ComponentProps<typeof AppBrandLogo>['variant'];
    /** Vùng trái (VD: nút menu Admin mobile) */
    leadingSlot?: React.ReactNode;
    className?: string;
    /** Ẩn Notify (hiếm khi dùng) */
    hideNotify?: boolean;
};

/**
 * Header shell dùng chung: UserMenu + useAuth xử lý tên, vai trò, chuyển quyền;
 * Notify gắn GraphQL inbox.
 */
export const AppShellHeader: React.FC<AppShellHeaderProps> = ({
    productTitle,
    brandAccentColor = '#52c41a',
    avatarColor = '#52c41a',
    placeholder = 'Tìm kiếm...',
    onSearch,
    showSearch: showSearchProp,
    userMenuShowName: showNameProp,
    logoSize = 'sm',
    logoVariant,
    leadingSlot,
    className,
    hideNotify,
}) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const showSearch = showSearchProp ?? !isMobile;
    const userMenuShowName = showNameProp ?? !isMobile;

    const handleSearch = (value: string) => {
        onSearch?.(value);
    };

    return (
        <div
            className={['app-shell-header', className].filter(Boolean).join(' ')}
            style={{ ['--app-shell-accent' as string]: brandAccentColor }}
        >
            {leadingSlot ? <div className="app-shell-header__leading">{leadingSlot}</div> : null}
            <div className="app-shell-header__brand">
                <AppBrandLogo size={isMobile ? 'sm' : logoSize} variant={logoVariant} />
                <span className="app-shell-header__title">{productTitle}</span>
            </div>
            {showSearch ? (
                <Search
                    placeholder={placeholder}
                    allowClear
                    onSearch={handleSearch}
                    className="app-shell-header__search"
                    prefix={<SearchOutlined />}
                />
            ) : null}
            <div className="app-shell-header__actions">
                {!hideNotify ? <Notify /> : null}
                <UserMenu avatarColor={avatarColor} showName={userMenuShowName} />
            </div>
        </div>
    );
};
