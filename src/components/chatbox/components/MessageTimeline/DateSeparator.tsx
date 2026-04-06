import { formatMessageDate } from '../../utils/chatboxUtils';
import './DateSeparator.less';

interface IDateSeparatorProps {
    date: Date;
}

export default function DateSeparator({ date }: IDateSeparatorProps) {
    return (
        <div className="date-separator">
            <span className="date-separator-line" />
            <span className="date-separator-text">{formatMessageDate(date)}</span>
            <span className="date-separator-line" />
        </div>
    );
}
