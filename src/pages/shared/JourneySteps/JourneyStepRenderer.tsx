import React from 'react';
import { Button, Card, Empty, Space, Typography, message, Grid } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { confirmAdvanceJourneyStep, HEADER_STEP_KEY_TO_TEMPLATE_STEP_CODE } from '../../../utils/journeyStepConfirmation';
import Step01Info from './Step01Info';
import Step02Consult from './Step02Consult';
import Step03Survey from './Step03Survey';
import Step04SolutionOrchestration from './Step04SolutionOrchestration';
import Step05QuoteOrchestration from './Step05QuoteOrchestration';
import Step06SettlementOrchestration from './Step06SettlementOrchestration';
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
    modalApi?: any; // The Modal instance from parent context
    onRefresh?: () => void;
}

export const MAP_ENUM_TO_STEP_CODE = HEADER_STEP_KEY_TO_TEMPLATE_STEP_CODE;

export const JourneyStepRenderer: React.FC<JourneyStepRendererProps> = ({
    stepCode,
    journeyId,
    isEditable = false,
    canFinalize = false,
    journeyCurrentStep,
    workTasks = [],
    stepLabel = '',
    modalApi,
    onRefresh
}) => {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const [isInternalEdit, setIsInternalEdit] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);

    // Resolve step code if it's an enum value
    const resolvedStepCode = MAP_ENUM_TO_STEP_CODE[stepCode] || stepCode;

    const handleConfirmStep = async () => {
        const actualStep =
            journeyCurrentStep ||
            (Object.keys(MAP_ENUM_TO_STEP_CODE).find((key) => MAP_ENUM_TO_STEP_CODE[key] === stepCode) || stepCode);

        setIsUpdating(true);
        try {
            const result = await confirmAdvanceJourneyStep({
                journeyId,
                actualStep,
                workTasks,
                modalApi: modalApi ?? undefined,
            });
            if (result === 'advanced' && onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to advance step:', error);
            message.error('Lỗi khi cập nhật trạng thái bước');
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
            case 'S04_SOLUTION': return <Step04SolutionOrchestration {...commonProps} />;
            case 'S05_QUOTE': return <Step05QuoteOrchestration {...commonProps} />;
            case 'S06_CONTRACT': return <Step06SettlementOrchestration {...commonProps} />;
            case 'S07_ADVANCE': return <Step07Advance {...commonProps} />; // Keep for legacy potential but not in main sequence
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
