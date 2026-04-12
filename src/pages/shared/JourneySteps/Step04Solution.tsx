import React from 'react';
import { Step04EstimateOrchestration } from './Step04EstimateOrchestration';

export interface Step04SolutionProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step04Solution: React.FC<Step04SolutionProps> = ({ journeyId }) => {
    return <Step04EstimateOrchestration journeyId={journeyId} />;
};

export default Step04Solution;

