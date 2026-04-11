import React from 'react';
import { AppBrandLogo } from '../common/AppBrandLogo';
import { Card, Button, Typography, Row, Col, Space } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface PortalPageHeaderProps {
    title: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    onBack?: () => void;
    token: string;
    extra?: React.ReactNode;
    icon?: React.ReactNode;
}

const PortalPageHeader: React.FC<PortalPageHeaderProps> = ({ title, subtitle, onBack, token, extra, icon }) => {
    const navigate = useNavigate();

    return (
        <Card 
            style={{ 
                borderRadius: 12, 
                marginBottom: 16, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: 'none',
                background: '#fff'
            }}
            bodyStyle={{ padding: '16px 20px' }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Space size="middle" align="center">
                        {onBack ? (
                            <Button 
                                icon={<ArrowLeftOutlined />} 
                                type="text" 
                                onClick={onBack}
                                style={{ color: '#666' }}
                            />
                        ) : (
                            <AppBrandLogo size="sm" />
                        )}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {icon && <span style={{ color: '#1890ff', fontSize: 16 }}>{icon}</span>}
                                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>{title}</Title>
                            </div>
                            {subtitle && <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 2 }}>{subtitle}</Text>}
                        </div>
                    </Space>
                </Col>
                <Col>
                    <Space size="small">
                        {token && (
                            <Button 
                                icon={<HomeOutlined />} 
                                size="small" 
                                ghost
                                type="primary"
                                onClick={() => navigate(`/portal/journeys/${token}`)}
                                style={{ borderRadius: 6 }}
                            >
                                Về tổng quan
                            </Button>
                        )}
                        {extra}
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default PortalPageHeader;
