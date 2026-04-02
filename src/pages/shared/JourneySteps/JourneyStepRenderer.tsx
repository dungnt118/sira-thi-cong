import React from 'react';
import { Button, Card, Empty, Space, Typography, message, Grid } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import Step01Info from './Step01Info';
import Step02Consult from './Step02Consult';
import Step03Survey from './Step03Survey';
import Step04Solution from './Step04Solution';
import Step05Quote from './Step05Quote';
import Step06Contract from './Step06Contract';
import Step07Advance from './Step07Advance';
import Step08Construct from './Step08Construct';
import Step09Acceptance from './Step09Acceptance';
import Step10Payment from './Step10Payment';
import Step11Maintain from './Step11Maintain';
import Step12Warranty from './Step12Warranty';
import Step13Care from './Step13Care';

const { Text } = Typography;

export interface JourneyStepRendererProps {
    stepCode: string;
    journeyId: string;
    isEditable?: boolean;
    canFinalize?: boolean;
    journeyCurrentStep?: string; // The actual current_step from the journey object
    workTasks?: any[]; // All worktasks for validation
    stepLabel?: string; // Human readable name for the current step
    onRefresh?: () => void;
}

export const MAP_ENUM_TO_STEP_CODE: Record<string, string> = {
    'lead_intake': 'S01_INFO',
    'qualification': 'S01_INFO',
    'survey_planning': 'S02_CONSULT',
    'site_survey': 'S03_SURVEY',
    'survey_review': 'S03_SURVEY',
    'estimate_preparation': 'S04_SOLUTION',
    'quotation_preparation': 'S05_QUOTE',
    'quotation_sent': 'S05_QUOTE',
    'quotation_approved': 'S05_QUOTE',
    'contract_signing': 'S06_CONTRACT',
    'project_execution': 'S08_CONSTRUCT',
    'handover_acceptance': 'S09_ACCEPTANCE',
    'warranty_aftercare': 'S12_WARRANTY',
};

const JOURNEY_STEP_SEQUENCE = [
    'lead_intake', 'qualification', 'survey_planning', 'site_survey', 'survey_review',
    'estimate_preparation', 'quotation_preparation', 'quotation_sent', 'quotation_approved',
    'contract_signing', 'project_execution', 'handover_acceptance', 'warranty_aftercare'
];

export const JourneyStepRenderer: React.FC<JourneyStepRendererProps> = ({ 
    stepCode, 
    journeyId, 
    isEditable = false,
    canFinalize = false,
    journeyCurrentStep,
    workTasks = [],
    stepLabel = '',
    onRefresh
}) => {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const [isInternalEdit, setIsInternalEdit] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);

    // Resolve step code if it's an enum value
    const resolvedStepCode = MAP_ENUM_TO_STEP_CODE[stepCode] || stepCode;

    const handleConfirmStep = async () => {
        // We use journeyCurrentStep if provided (the actual progress), 
        // fallback to mapping existing stepCode back to a sequence key if possible
        const actualStep = journeyCurrentStep || (Object.keys(MAP_ENUM_TO_STEP_CODE).find(key => MAP_ENUM_TO_STEP_CODE[key] === stepCode) || stepCode);
        
        console.log("handleConfirmStep triggered", { actualStep, stepCode, journeyCurrentStep });

        const currentIndex = JOURNEY_STEP_SEQUENCE.indexOf(actualStep);
        if (currentIndex === -1) {
            const errorMsg = `Không xác định được bước '${actualStep}' trong quy trình`;
            console.error(errorMsg);
            message.error(errorMsg);
            return;
        }

        // 1. Validation Logic: Check mandatory worktasks for this step
        const stepTasks = workTasks.filter(t => t.journey_step_code === actualStep);
        const unfinishedMandatoryTasks = stepTasks.filter(t => t.is_required && t.status !== 'finished');
        
        if (unfinishedMandatoryTasks.length > 0) {
            const taskNames = unfinishedMandatoryTasks.map(t => `"${t.title}"`).join(', ');
            message.warning({
                content: (
                    <span>
                        Chưa thể hoàn thành! Còn <b>{unfinishedMandatoryTasks.length}</b> đầu việc bắt buộc chưa xong: 
                        <br />{taskNames}
                    </span>
                ),
                duration: 5
            });
            return;
        }

        if (currentIndex === JOURNEY_STEP_SEQUENCE.length - 1) {
            message.info("Đây là bước cuối cùng của hành trình!");
            return;
        }

        const nextStep = JOURNEY_STEP_SEQUENCE[currentIndex + 1];
        setIsUpdating(true);
        try {
            await journeyService.updateJourney(journeyId, { current_step: nextStep as any });
            message.success(`Đã xác nhận hoàn thành. Chuyển sang bước kế tiếp!`);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Failed to advance step:", error);
            message.error("Lỗi khi cập nhật trạng thái bước");
        } finally {
            setIsUpdating(false);
        }
    };

    const renderStep = () => {
        const commonProps = { 
            journeyId, 
            isEditable: isEditable,
            onEditStateChange: (editing: boolean) => setIsInternalEdit(editing),
            onSave: () => { if (onRefresh) onRefresh(); }
        };

        switch (resolvedStepCode) {
            case 'S01_INFO': return <Step01Info {...commonProps} />;
            case 'S02_CONSULT': return <Step02Consult {...commonProps} />;
            case 'S03_SURVEY': return <Step03Survey {...commonProps} />;
            case 'S04_SOLUTION': return <Step04Solution {...commonProps} />;
            case 'S05_QUOTE': return <Step05Quote {...commonProps} />;
            case 'S06_CONTRACT': return <Step06Contract {...commonProps} />;
            case 'S07_ADVANCE': return <Step07Advance {...commonProps} />;
            case 'S08_CONSTRUCT': return <Step08Construct {...commonProps} />;
            case 'S09_ACCEPTANCE': return <Step09Acceptance {...commonProps} />;
            case 'S10_PAYMENT': return <Step10Payment {...commonProps} />;
            case 'S11_MAINTAIN': return <Step11Maintain {...commonProps} />;
            case 'S12_WARRANTY': return <Step12Warranty {...commonProps} />;
            case 'S13_CARE': return <Step13Care {...commonProps} />;
            default: return <Empty description={`Component cho bước ${resolvedStepCode} đang được phát triển`} />;
        }
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }} size={isMobile ? 'small' : 'middle'}>
            {canFinalize && !isInternalEdit && (
                <Card size="small" style={{ border: '1px solid #d9f7be', background: '#f6ffed', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Text strong><CheckCircleOutlined style={{ color: '#52c41a' }} /> Xác nhận Hoàn thành Bước {stepLabel}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>Bạn có vai trò chốt bước này. Nhấp xác nhận để kết thúc và chuyển sang bước tiếp theo.</Text>
                        </div>
                        <Button 
                            type="primary" 
                            onClick={handleConfirmStep} 
                            loading={isUpdating}
                            icon={isUpdating ? <LoadingOutlined /> : <CheckCircleOutlined />}
                            style={{ background: '#52c41a', borderColor: '#52c41a' }}
                        >
                            Xác nhận Hoàn thành
                        </Button>
                    </div>
                </Card>
            )}

            {renderStep()}
        </Space>
    );
};

export default JourneyStepRenderer;
