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

import PortalNavigation from '../../components/portal/PortalNavigation';

const CustomerPortal: React.FC = () => {
    const { journeyCode, token } = useParams<{ journeyCode?: string; token?: string }>();
    const portalKey = journeyCode || token;
    const navigate = useNavigate();
    const [journeys, setJourneys] = useLocalStorageData<Journey[]>(demoDataService.KEYS.JOURNEYS, mockJourneys);
    const [journeyTemplates] = useLocalStorageData<JourneyTemplate[]>(demoDataService.KEYS.JOURNEY_TEMPLATES, mockJourneyTemplates);
    const [portalDocuments] = useLocalStorageData<PortalDocument[]>(demoDataService.KEYS.PORTAL_DOCUMENTS, mockPortalDocuments);

    // If no token, show landing page for general booking
    if (!portalKey) {
        return (
            <>
                <PortalNavigation />
                <CustomerPortalLanding />
            </>
        );
    }

    const currentJourney = journeys.find((item) => item.journey_code === portalKey || String((item as any)._id || item.id || "") === String(portalKey) || item.portal_token === portalKey);
    const syncedResult = currentJourney ? syncJourneyPortalSummary(journeys, currentJourney, portalDocuments, journeyTemplates) : null;
    const syncedJourney = syncedResult?.journey;

    useEffect(() => {
        if (!currentJourney) return;
        const syncResult = syncJourneyPortalSummary(journeys, currentJourney, portalDocuments, journeyTemplates);
        if (syncResult.changed) setJourneys(syncResult.journeys);
    }, [currentJourney, journeyTemplates, journeys, portalDocuments, setJourneys]);

    if (!syncedJourney) {
        return (
            <>
                <PortalNavigation />
                <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 24 }}>
                    <Card style={{ textAlign: 'center', borderRadius: 24, maxWidth: 400, width: '100%', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ fontSize: 64, color: '#38bdf8', marginBottom: 16 }}><SearchOutlined /></div>
                        <Title level={3} style={{ color: '#0f172a', marginBottom: 12 }}>Không tìm thấy công trình</Title>
                        <Text style={{ color: '#475569' }}>Link portal không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ nhà thầu để được cấp link mới hoặc quay lại trang chủ.</Text>
                        <div style={{ marginTop: 24 }}>
                            <Button type="primary" onClick={() => navigate('/portal')} style={{ borderRadius: 8, background: '#38bdf8' }}>Quay lại Portal</Button>
                        </div>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <PortalNavigation />
            <PortalDashboard journey={syncedJourney} token={syncedJourney.journey_code || portalKey} onNavigate={(path) => navigate(path)} />
        </>
    );
};

export default CustomerPortal;
