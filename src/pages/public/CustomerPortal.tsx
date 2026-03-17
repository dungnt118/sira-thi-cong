import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockJourneys } from '../../data/journeyMockData';
import PortalDashboard from '../../components/portal/PortalDashboard';
import { SearchOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

const CustomerPortal: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    // Find journey by portal token
    const journey = mockJourneys.find(j => j.portal_token === token) || mockJourneys.find(j => j.portal_token);

    if (!journey) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: 24,
            }}>
                <Card style={{ textAlign: 'center', borderRadius: 16, maxWidth: 400, width: '100%' }}>
                    <div style={{ fontSize: 64, color: '#bfbfbf' }}><SearchOutlined /></div>
                    <Title level={3} style={{ color: '#ff4d4f' }}>Không tìm thấy</Title>
                    <Text type="secondary">Link portal không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ nhà thầu để được cấp link mới.</Text>
                </Card>
            </div>
        );
    }

    return (
        <PortalDashboard 
            journey={journey} 
            token={token} 
            onNavigate={(path) => navigate(path)} 
        />
    );
};

export default CustomerPortal;
