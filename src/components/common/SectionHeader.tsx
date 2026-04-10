import React from 'react';
import { Typography, Space, Grid, Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface SectionHeaderProps {
    title: string;
    breadcrumb?: string;
    description?: string;
    actions?: React.ReactNode;
    style?: React.CSSProperties;
    loading?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    breadcrumb,
    description,
    actions,
    style,
}) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    if (isMobile) {
        return (
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: '#fff',
                    padding: '12px 16px',
                    margin: '0 -16px 16px -16px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    ...style,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {title}
                    </Title>
                    {description && (
                        <Tooltip title={description}>
                            <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                        </Tooltip>
                    )}
                </div>
                {actions && (
                    <Space size={8}>
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
                <Title level={2} style={{ margin: '4px 0 8px' }}>
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
