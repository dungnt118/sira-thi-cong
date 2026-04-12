import Step04SolutionOrchestration from './Step04SolutionOrchestration';

export interface Step04SolutionProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step04Solution: React.FC<Step04SolutionProps> = ({ journeyId }) => {
    return <Step04SolutionOrchestration journeyId={journeyId} />;
};

export default Step04Solution;

