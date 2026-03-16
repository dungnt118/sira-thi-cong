import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Step03Survey from '../shared/JourneySteps/Step03Survey';

const { Title } = Typography;

const SurveyForm: React.FC = () => {
    const { id: journeyId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleBack = () => navigate('/ky-thuat/schedule');

    if (!journeyId) {
        return <div>Hành trình không hợp lệ.</div>;
    }

    return (
        <div style={{ paddingBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ padding: 0, marginRight: 12 }} />
                <Title level={4} style={{ margin: 0 }}>Khảo Sát: {journeyId}</Title>
            </div>

            <Step03Survey journeyId={journeyId} isEditable={true} />
        </div>
    );
};

export default SurveyForm;
