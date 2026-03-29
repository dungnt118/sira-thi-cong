import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import PortalDashboard from '../../components/portal/PortalDashboard';
import { useLocalStorageData } from '../../hooks/useLocalStorageData';
import { mockJourneys, mockJourneyTemplates } from '../../data/journeyMockData';
import { mockPortalDocuments } from '../../data/portalMockData';
import { demoDataService } from '../../services/localstorage/demoDataService';
import { syncJourneyPortalSummary } from '../../services/localstorage/portalDocumentService';
import type { Journey, JourneyTemplate } from '../../types/journey';
import type { PortalDocument } from '../../types/portal';

const { Title, Text } = Typography;

const CustomerPortal: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [journeys, setJourneys] = useLocalStorageData<Journey[]>(demoDataService.KEYS.JOURNEYS, mockJourneys);
    const [journeyTemplates] = useLocalStorageData<JourneyTemplate[]>(demoDataService.KEYS.JOURNEY_TEMPLATES, mockJourneyTemplates);
    const [portalDocuments] = useLocalStorageData<PortalDocument[]>(demoDataService.KEYS.PORTAL_DOCUMENTS, mockPortalDocuments);

    const currentJourney = journeys.find((item) => item.portal_token === token || item.journey_code === token);
    const syncedJourney = currentJourney ? syncJourneyPortalSummary(journeys, currentJourney, portalDocuments, journeyTemplates).journey : null;

    useEffect(() => {
        if (!currentJourney) return;
        const syncResult = syncJourneyPortalSummary(journeys, currentJourney, portalDocuments, journeyTemplates);
        if (syncResult.changed) setJourneys(syncResult.journeys);
    }, [currentJourney, journeyTemplates, journeys, portalDocuments, setJourneys]);

    if (!syncedJourney) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: 24 }}>
                <Card style={{ textAlign: 'center', borderRadius: 16, maxWidth: 400, width: '100%' }}>
                    <div style={{ fontSize: 64, color: '#bfbfbf' }}><SearchOutlined /></div>
                    <Title level={3} style={{ color: '#ff4d4f' }}>Không tìm thấy</Title>
                    <Text type='secondary'>Link portal không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ nhà thầu để được cấp link mới.</Text>
                </Card>
            </div>
        );
    }

    return <PortalDashboard journey={syncedJourney} token={token} onNavigate={(path) => navigate(path)} />;
};

export default CustomerPortal;
