import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Card, Typography, Button } from 'antd';
import PortalDashboard from '../../components/portal/PortalDashboard';
import CustomerPortalLanding from './CustomerPortalLanding';
import { useLocalStorageData } from '../../hooks/useLocalStorageData';
import { mockJourneys, mockJourneyTemplates } from '../../data/journeyMockData';
import { mockPortalDocuments } from '../../data/portalMockData';
import { demoDataService } from '../../services/core-graphql/localstorage/demoDataService';
import { syncJourneyPortalSummary } from '../../services/core-graphql/localstorage/portalDocumentService';
import type { Journey, JourneyTemplate } from '../../types/journey';
import type { PortalDocument } from '../../types/portal';

const { Title, Text } = Typography;

const CustomerPortal: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [journeys, setJourneys] = useLocalStorageData<Journey[]>(demoDataService.KEYS.JOURNEYS, mockJourneys);
    const [journeyTemplates] = useLocalStorageData<JourneyTemplate[]>(demoDataService.KEYS.JOURNEY_TEMPLATES, mockJourneyTemplates);
    const [portalDocuments] = useLocalStorageData<PortalDocument[]>(demoDataService.KEYS.PORTAL_DOCUMENTS, mockPortalDocuments);

    // If no token, show landing page for general booking
    if (!token) {
        return <CustomerPortalLanding />;
    }

    const currentJourney = journeys.find((item) => item.portal_token === token || item.journey_code === token);
    const syncedResult = currentJourney ? syncJourneyPortalSummary(journeys, currentJourney, portalDocuments, journeyTemplates) : null;
    const syncedJourney = syncedResult?.journey;

    useEffect(() => {
        if (!currentJourney) return;
        const syncResult = syncJourneyPortalSummary(journeys, currentJourney, portalDocuments, journeyTemplates);
        if (syncResult.changed) setJourneys(syncResult.journeys);
    }, [currentJourney, journeyTemplates, journeys, portalDocuments, setJourneys]);

    if (!syncedJourney) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: 24 }}>
                <Card style={{ textAlign: 'center', borderRadius: 24, maxWidth: 400, width: '100%', background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    <div style={{ fontSize: 64, color: '#38bdf8', marginBottom: 16 }}><SearchOutlined /></div>
                    <Title level={3} style={{ color: '#fff', marginBottom: 12 }}>Không tìm thấy hành trình</Title>
                    <Text style={{ color: '#94a3b8' }}>Link portal không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ nhà thầu để được cấp link mới hoặc quay lại trang chủ.</Text>
                    <div style={{ marginTop: 24 }}>
                        <Button type="primary" onClick={() => navigate('/portal')} style={{ borderRadius: 8, background: '#38bdf8' }}>Quay lại Portal</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return <PortalDashboard journey={syncedJourney} token={token} onNavigate={(path) => navigate(path)} />;
};

export default CustomerPortal;
