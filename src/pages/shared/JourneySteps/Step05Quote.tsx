import React from 'react';
import Step05QuoteOrchestration from './Step05QuoteOrchestration';

export interface Step05QuoteProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

const Step05Quote: React.FC<Step05QuoteProps> = ({ journeyId, isEditable = false, onEditStateChange }) => {
    return (
        <Step05QuoteOrchestration 
            journeyId={journeyId} 
            isEditable={isEditable}
            onEditStateChange={onEditStateChange}
        />
    );
};

export default Step05Quote;

