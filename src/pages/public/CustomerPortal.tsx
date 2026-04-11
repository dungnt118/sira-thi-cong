import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { Card, Typography, Button, Spin } from 'antd';
import PortalDashboard from '../../components/portal/PortalDashboard';
import CustomerPortalLanding from './CustomerPortalLanding';
import { usePortalJourney } from '../../hooks/usePortalJourney';
import PortalNavigation from '../../components/portal/PortalNavigation';

const { Title, Text } = Typography;

const CustomerPortal: React.FC = () => {
    const { journeyId, token } = useParams<{ journeyId?: string; token?: string }>();
    const portalKey = journeyId || token;
    const navigate = useNavigate();
    const { journey, isLoading } = usePortalJourney(portalKey);

    // If no token, show landing page for general booking
    if (!portalKey) {
        return (
            <>
                <PortalNavigation />
                <CustomerPortalLanding />
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <PortalNavigation />
                <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#38bdf8' }} spin />} />
                </div>
            </>
        );
    }

    if (!journey) {
        return (
            <>
                <PortalNavigation />
                <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 24 }}>
                    <Card style={{ textAlign: 'center', borderRadius: 24, maxWidth: 400, width: '100%', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ fontSize: 64, color: '#38bdf8', marginBottom: 16 }}><SearchOutlined /></div>
                        <Title level={3} style={{ color: '#0f172a', marginBottom: 12 }}>Không tìm thấy công trình</Title>
                        <Text style={{ color: '#475569' }}>Link portal không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ nhà thầu để được cấp link mới hoặc quay lại trang chủ.</Text>
                        <div style={{ marginTop: 24 }}>
                            <Button type="primary" onClick={() => navigate('/portal')} style={{ borderRadius: 8, background: '#38bdf8', borderColor: '#38bdf8' }}>Quay lại Portal</Button>
                        </div>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <PortalNavigation />
            <PortalDashboard journey={journey as any} token={journey.journey_code || portalKey} onNavigate={(path) => navigate(path)} />
        </>
    );
};

export default CustomerPortal;
