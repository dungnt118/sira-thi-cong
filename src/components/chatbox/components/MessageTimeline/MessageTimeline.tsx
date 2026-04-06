import { Empty } from 'antd';
import { useEffect, useRef } from 'react';
import { groupMessagesByCreator } from '../../utils/chatboxUtils';
import { MessageTypeEnum, type IContentChatboxMessage } from '../../contentConversation.types';
import ChangeLogCard from './ChangeLogCard';
import DateSeparator from './DateSeparator';
import LinkedContentCard from './LinkedContentCard';
import MessageBubble from './MessageBubble';
import NoteCard from './NoteCard';
import ScheduleLogLine from './ScheduleLogLine';
import './MessageTimeline.less';

interface IMessageTimelineProps {
    messages: IContentChatboxMessage[];
    currentUsername?: string;
    isAdmin?: boolean;
    onReply?: (messageId: string) => void;
    emptyDescription?: string;
}

export default function MessageTimeline({
    messages,
    currentUsername,
    isAdmin = false,
    onReply,
    emptyDescription = 'Chưa có tin nhắn nào. Hãy bắt đầu trao đổi.',
}: IMessageTimelineProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = scrollContainerRef.current;
        if (!element) return;
        requestAnimationFrame(() => {
            element.scrollTop = element.scrollHeight;
        });
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <div className="message-timeline-empty">
                <Empty description={emptyDescription} />
            </div>
        );
    }

    const sortedMessages = [...messages].sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    );
    const groups = groupMessagesByCreator(sortedMessages);
    const firstMessageIds = new Set(
        groups.map((group) => group.messages[0]?._id).filter((messageId): messageId is string => Boolean(messageId)),
    );

    const dateGroups: Record<string, IContentChatboxMessage[]> = {};
    sortedMessages.forEach((item) => {
        const dateKey = new Date(item.createdAt).toDateString();
        if (!dateGroups[dateKey]) dateGroups[dateKey] = [];
        dateGroups[dateKey].push(item);
    });

    const sortedDates = Object.keys(dateGroups).sort(
        (left, right) => new Date(left).getTime() - new Date(right).getTime(),
    );

    return (
        <div className="message-timeline" ref={scrollContainerRef}>
            {sortedDates.map((dateKey) => (
                <div key={dateKey} className="message-date-group">
                    <DateSeparator date={new Date(dateKey)} />

                    {dateGroups[dateKey].map((item, index) => {
                        const isFirstOfGroup = item._id ? firstMessageIds.has(item._id) : index === 0;
                        return (
                            <div key={item._id || `${dateKey}-${index}`} className="message-item">
                                {item.message_type === MessageTypeEnum.Message ? (
                                    <MessageBubble
                                        message={item}
                                        repliedToMessage={item.reply_to_id ? messages.find((message) => message._id === item.reply_to_id) : undefined}
                                        isFirstOfGroup={isFirstOfGroup}
                                        currentUsername={currentUsername}
                                        onReply={item._id && onReply ? () => onReply(item._id || '') : undefined}
                                    />
                                ) : item.message_type === MessageTypeEnum.Note ? (
                                    <NoteCard message={item} />
                                ) : item.message_type === MessageTypeEnum.ContentChanged ? (
                                    <ChangeLogCard message={item} />
                                ) : item.message_type === MessageTypeEnum.Schedule ? (
                                    <ScheduleLogLine message={item} />
                                ) : item.message_type === MessageTypeEnum.LinkedContent ? (
                                    <LinkedContentCard message={item} currentUsername={currentUsername} isAdmin={isAdmin} />
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
