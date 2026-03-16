import React from 'react';
import { Empty } from 'antd';
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

export interface JourneyStepRendererProps {
    stepCode: string;
    journeyId: string;
    isEditable?: boolean;
}

export const JourneyStepRenderer: React.FC<JourneyStepRendererProps> = ({ stepCode, journeyId, isEditable = false }) => {
    switch (stepCode) {
        case 'S01_INFO':
            return <Step01Info journeyId={journeyId} isEditable={isEditable} />;
        case 'S02_CONSULT':
            return <Step02Consult journeyId={journeyId} isEditable={isEditable} />;
        case 'S03_SURVEY':
            return <Step03Survey journeyId={journeyId} isEditable={isEditable} />;
        case 'S04_SOLUTION':
            return <Step04Solution journeyId={journeyId} isEditable={isEditable} />;
        case 'S05_QUOTE':
            return <Step05Quote journeyId={journeyId} isEditable={isEditable} />;
        case 'S06_CONTRACT':
            return <Step06Contract journeyId={journeyId} isEditable={isEditable} />;
        case 'S07_ADVANCE':
            return <Step07Advance journeyId={journeyId} isEditable={isEditable} />;
        case 'S08_CONSTRUCT':
            return <Step08Construct journeyId={journeyId} isEditable={isEditable} />;
        case 'S09_ACCEPTANCE':
            return <Step09Acceptance journeyId={journeyId} isEditable={isEditable} />;
        case 'S10_PAYMENT':
            return <Step10Payment journeyId={journeyId} isEditable={isEditable} />;
        case 'S11_MAINTAIN':
            return <Step11Maintain journeyId={journeyId} isEditable={isEditable} />;
        case 'S12_WARRANTY':
            return <Step12Warranty journeyId={journeyId} isEditable={isEditable} />;
        case 'S13_CARE':
            return <Step13Care journeyId={journeyId} isEditable={isEditable} />;
        default:
            return <Empty description="Component cho bước này đang được phát triển" />;
    }
};

export default JourneyStepRenderer;
