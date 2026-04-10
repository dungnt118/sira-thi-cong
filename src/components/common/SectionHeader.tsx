import React from 'react';
import { Typography, Space, Grid, Row, Col } from 'antd';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface SectionHeaderProps {
    title: string;
    breadcrumb?: string;
    description?: string;
    actions?: React.ReactNode;
    style?: React.CSSProperties;
    loading?: boolean;
    /** Kéo full-bleed ngang khớp padding của vùng Content (BaseLayout mobile: 12, Sale sale-content: 8). */
    contentBleedPx?: number;
    /** Màu tiêu đề (vd. PM dashboard #1976D2). */
    titleColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    breadcrumb,
    description,
    actions,
    style,
    contentBleedPx = 12,
    titleColor,
}) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const titleStyle: React.CSSProperties = titleColor
        ? { color: titleColor }
        : {};

    if (isMobile) {
        const bleed = contentBleedPx;
        return (
            <div
                className="section-header section-header--mobile-sticky"
                style={{
                    position: 'sticky',
                    top: 'var(--section-header-sticky-top, 56px)',
                    zIndex: 990,
                    background: '#fff',
                    margin: `0 -${bleed}px 16px -${bleed}px`,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: `max(${bleed}px, env(safe-area-inset-left, 0px))`,
                    paddingRight: `max(${bleed}px, env(safe-area-inset-right, 0px))`,
                    borderBottom: '1px solid #f0f0f0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 10,
                    ...style,
                }}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Title
                        level={4}
                        style={{
                            margin: 0,
                            wordBreak: 'break-word',
                            lineHeight: 1.3,
                            ...titleStyle,
                        }}
                    >
                        {title}
                    </Title>
                    {description && (
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 12,
                                display: 'block',
                                marginTop: 4,
                                lineHeight: 1.4,
                            }}
                        >
                            {description}
                        </Text>
                    )}
                </div>
                {actions && (
                    <Space size={8} style={{ flexShrink: 0, marginTop: 2 }}>
                        {actions}
                    </Space>
                )}
            </div>
        );
    }

    return (
        <Row
            justify="space-between"
            align="bottom"
            gutter={[16, 16]}
            style={{ marginBottom: 24, ...style }}
        >
            <Col xs={24} lg={16}>
                {breadcrumb && (
                    <Text
                        type="secondary"
                        style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}
                    >
                        {breadcrumb}
                    </Text>
                )}
                <Title level={2} style={{ margin: '4px 0 8px', ...titleStyle }}>
                    {title}
                </Title>
                {description && <Text type="secondary">{description}</Text>}
            </Col>
            {actions && (
                <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                    <Space wrap>{actions}</Space>
                </Col>
            )}
        </Row>
    );
};

export default SectionHeader;
