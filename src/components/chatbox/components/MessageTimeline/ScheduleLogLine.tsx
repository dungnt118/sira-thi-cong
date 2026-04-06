import { CalendarOutlined } from '@ant-design/icons';
import type { IContentChatboxMessage } from '../../contentConversation.types';
import { formatMessageTime } from '../../utils/chatboxUtils';
import './ScheduleLogLine.less';

interface IScheduleLogLineProps {
    message: IContentChatboxMessage;
}

export default function ScheduleLogLine({ message }: IScheduleLogLineProps) {
    return (
        <div className="schedule-log-line">
            <CalendarOutlined className="schedule-icon" />
            <span className="schedule-text">{message.content}</span>
            <span className="schedule-meta">{message.createdBy} • {formatMessageTime(message.createdAt)}</span>
        </div>
    );
}
