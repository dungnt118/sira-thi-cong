import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Layout, theme, Empty, Breadcrumb } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { mockJourneys, mockJourneyTemplates } from '../../data/journeyMockData';
import JourneyStepRenderer from '../shared/JourneySteps/JourneyStepRenderer';
import { useAuth } from '../../hooks/useAuth';

const { Content } = Layout;
const { Title, Text } = Typography;

export const KTJourneyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const { role } = useAuth();

    const journey = mockJourneys.find(j => j.id === id);

    if (!journey) {
        return (
            <Content style={{ padding: 24, margin: 0, minHeight: 280, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
                <Empty description="Không tìm thấy thông tin hành trình / yêu cầu" />
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button onClick={() => navigate('/ky-thuat/dashboard')}>Quay lại Dashboard</Button>
                </div>
            </Content>
        );
    }

    // Determine editability based on current role and step configuration
    const isEditable = React.useMemo(() => {
        if (!role) return false;
        
        // Find the template for this journey (fallback to default)
        const template = mockJourneyTemplates.find(t => t.id === journey.template_id) || mockJourneyTemplates[0];
        // Find the current step in the template
        const currentStep = template.steps.find(s => s.step_code === journey.current_step_code);
        
        if (!currentStep) return false;
        
        // Check if the current user's role is in the roleConfigurations for this step
        return currentStep.roleConfigurations?.some(config => config.roleId === role) || false;
    }, [journey.current_step_code, journey.template_id, role]);

    return (
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                    <a onClick={() => navigate('/ky-thuat/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Chi tiết Hành trình</Breadcrumb.Item>
            </Breadcrumb>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginRight: 16 }} />
                <div>
                    <Title level={4} style={{ margin: 0 }}>{journey.customer_name} - {journey.request_title}</Title>
                    <Text type="secondary">Mã: {journey.journey_code} | Số điện thoại: {journey.customer_phone}</Text>
                </div>
            </div>

            <JourneyStepRenderer 
                stepCode={journey.current_step_code} 
                journeyId={journey.id} 
                isEditable={isEditable} 
            />
        </Content>
    );
};

export default KTJourneyDetail;
