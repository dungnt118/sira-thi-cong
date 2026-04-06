import React from 'react';
import { BRAND_LOGO_URL } from '@/constants/brand';

const SIZE_PX = { xs: 24, sm: 32, md: 40, lg: 48, xl: 72 } as const;

export type AppBrandLogoSize = keyof typeof SIZE_PX | number;

export interface AppBrandLogoProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
    /** Kích thước cạnh vuông (px). Mặc định md = 40. */
    size?: AppBrandLogoSize;
    /** Nền trắng + bo góc — dùng trên header màu (cam, xanh…). */
    variant?: 'default' | 'onDark';
}

/**
 * Logo thương hiệu chuẩn — luôn scale qua width/height + object-fit (không hiển thị nguyên kích thước file).
 */
export const AppBrandLogo: React.FC<AppBrandLogoProps> = ({
    size = 'md',
    variant = 'default',
    alt = 'Logo',
    style,
    className,
    ...rest
}) => {
    const px = typeof size === 'number' ? size : SIZE_PX[size];

    const img = (
        <img
            src={BRAND_LOGO_URL}
            alt={alt}
            decoding="async"
            className={className}
            {...rest}
            style={{
                width: px,
                height: px,
                objectFit: 'contain',
                display: 'block',
                flexShrink: 0,
                borderRadius: Math.min(10, Math.round(px / 4)),
                ...style,
            }}
        />
    );

    if (variant !== 'onDark') {
        return img;
    }

    const pad = Math.max(2, Math.round(px * 0.08));
    const inner = px - pad * 2;

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: px,
                height: px,
                background: '#fff',
                borderRadius: 8,
                flexShrink: 0,
                overflow: 'hidden',
                lineHeight: 0,
            }}
        >
            <img
                src={BRAND_LOGO_URL}
                alt={alt}
                decoding="async"
                className={className}
                {...rest}
                style={{
                    width: inner,
                    height: inner,
                    objectFit: 'contain',
                    display: 'block',
                }}
            />
        </span>
    );
};
