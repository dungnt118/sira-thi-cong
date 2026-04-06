import { CalendarOutlined, CloseOutlined, FilterOutlined, PaperClipOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select, Space, Switch } from 'antd';
import type { Dayjs } from 'dayjs';
import type { InputRef } from 'antd';
import { useEffect, useRef } from 'react';
import { MessageTypeEnum, SystemChangeType, type IContentChatboxMessage } from '../../contentConversation.types';
import { stripHtmlTags } from '../../utils/chatboxUtils';
import './TimelineFilterBar.less';

const MESSAGE_TYPE_OPTIONS = [
    { value: MessageTypeEnum.Message, label: 'Tin nhắn' },
    { value: MessageTypeEnum.Note, label: 'Ghi chú' },
    { value: MessageTypeEnum.ContentChanged, label: 'Thay đổi nội dung' },
    { value: MessageTypeEnum.Schedule, label: 'Lịch' },
    { value: MessageTypeEnum.LinkedContent, label: 'Nội dung liên kết' },
];

const SYSTEM_CHANGE_TYPE_OPTIONS = [
    { value: SystemChangeType.Created, label: 'Tạo mới' },
    { value: SystemChangeType.Updated, label: 'Cập nhật' },
    { value: SystemChangeType.Deleted, label: 'Xóa' },
];

export interface ITimelineFilterState {
    searchText: string;
    messageType: MessageTypeEnum | '';
    changeType: SystemChangeType | '';
    from: Dayjs | null;
    to: Dayjs | null;
    createdBy: string;
    attachmentsOnly: boolean;
}

export interface ICreatorOption {
    value: string;
    label: string;
}

interface ITimelineFilterBarProps {
    searchOnly?: boolean;
    showFilterToolbar?: boolean;
    createdByOptions?: ICreatorOption[];
    value: ITimelineFilterState;
    onChange: (value: ITimelineFilterState) => void;
    onClose: () => void;
}

const getMessageChangeType = (message: IContentChatboxMessage): SystemChangeType | undefined => {
    if (message.message_type !== MessageTypeEnum.ContentChanged) return undefined;
    return message.system?.change_type || message.system_change_type || undefined;
};

export const filterMessages = (
    messages: IContentChatboxMessage[],
    state: ITimelineFilterState,
): IContentChatboxMessage[] => {
    let result = messages;

    if (state.searchText.trim()) {
        const query = state.searchText.trim().toLowerCase();
        result = result.filter((item) => {
            const plain = stripHtmlTags(item.content ?? '').toLowerCase();
            const createdBy = (item.createdBy ?? '').toLowerCase();
            const linkedTitles = (item.payload?.linked_contents || [])
                .map((entry) => `${entry.title || ''} ${entry.schema || ''}`.trim().toLowerCase())
                .join(' ');
            return plain.includes(query) || createdBy.includes(query) || linkedTitles.includes(query);
        });
    }

    if (state.messageType) result = result.filter((item) => item.message_type === state.messageType);
    if (state.messageType === MessageTypeEnum.ContentChanged && state.changeType) {
        result = result.filter((item) => getMessageChangeType(item) === state.changeType);
    }
    if (state.from) {
        const fromTime = state.from.startOf('day').valueOf();
        result = result.filter((item) => new Date(item.createdAt).getTime() >= fromTime);
    }
    if (state.to) {
        const toTime = state.to.endOf('day').valueOf();
        result = result.filter((item) => new Date(item.createdAt).getTime() <= toTime);
    }
    if (state.createdBy) result = result.filter((item) => (item.createdBy ?? '') === state.createdBy);
    if (state.attachmentsOnly) result = result.filter((item) => (item.payload?.attachments?.length || 0) > 0);
    return result;
};

export default function TimelineFilterBar({
    searchOnly = false,
    showFilterToolbar = false,
    createdByOptions = [],
    value,
    onChange,
    onClose,
}: ITimelineFilterBarProps) {
    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (searchOnly || showFilterToolbar) {
            inputRef.current?.focus();
        }
    }, [searchOnly, showFilterToolbar]);

    if (!searchOnly && !showFilterToolbar) {
        return null;
    }

    const hasActiveFilter = Boolean(
        value.searchText.trim() || value.messageType || value.changeType || value.from || value.to || value.createdBy || value.attachmentsOnly,
    );

    return (
        <div className="timeline-filter-bar">
            <Space size="middle" wrap className="timeline-filter-bar-content">
                <Space.Compact className="timeline-filter-search">
                    <Input
                        ref={inputRef}
                        prefix={<SearchOutlined className="timeline-filter-input-icon" />}
                        placeholder="Tìm trong luồng..."
                        value={value.searchText}
                        onChange={(event) => onChange({ ...value, searchText: event.target.value })}
                        allowClear
                        className="timeline-filter-search-input"
                    />
                </Space.Compact>

                {showFilterToolbar && (
                    <>
                        <Space size="middle" className="timeline-filter-type">
                            <FilterOutlined className="timeline-filter-icon" />
                            <Select
                                value={value.messageType || undefined}
                                onChange={(nextValue) => onChange({ ...value, messageType: (nextValue as MessageTypeEnum) ?? '', changeType: (nextValue as MessageTypeEnum) === MessageTypeEnum.ContentChanged ? value.changeType : '' })}
                                options={MESSAGE_TYPE_OPTIONS}
                                placeholder="Loại tin"
                                allowClear
                                className="timeline-filter-select"
                                style={{ minWidth: 160 }}
                            />
                        </Space>

                        {value.messageType === MessageTypeEnum.ContentChanged && (
                            <Select
                                value={value.changeType || undefined}
                                onChange={(nextValue) => onChange({ ...value, changeType: (nextValue as SystemChangeType) ?? '' })}
                                options={SYSTEM_CHANGE_TYPE_OPTIONS}
                                placeholder="Kiểu thay đổi"
                                allowClear
                                className="timeline-filter-select"
                                style={{ minWidth: 130 }}
                            />
                        )}

                        <Space size="middle" className="timeline-filter-date">
                            <CalendarOutlined className="timeline-filter-icon" />
                            <DatePicker placeholder="Từ ngày" value={value.from} onChange={(date) => onChange({ ...value, from: date })} className="timeline-filter-date-picker" />
                            <DatePicker placeholder="Đến ngày" value={value.to} onChange={(date) => onChange({ ...value, to: date })} className="timeline-filter-date-picker" />
                        </Space>

                        {createdByOptions.length > 0 && (
                            <Space size="middle" className="timeline-filter-createdBy">
                                <UserOutlined className="timeline-filter-icon" />
                                <Select
                                    value={value.createdBy || undefined}
                                    onChange={(nextValue) => onChange({ ...value, createdBy: nextValue ?? '' })}
                                    options={createdByOptions}
                                    placeholder="Người nhắn"
                                    allowClear
                                    className="timeline-filter-select"
                                    style={{ minWidth: 140 }}
                                />
                            </Space>
                        )}

                        <Space size="middle" className="timeline-filter-attachments">
                            <PaperClipOutlined className="timeline-filter-icon" />
                            <span className="timeline-filter-label">Chỉ file đính kèm</span>
                            <Switch checked={value.attachmentsOnly} onChange={(checked) => onChange({ ...value, attachmentsOnly: checked })} />
                        </Space>
                    </>
                )}

                {hasActiveFilter && (
                    <Button
                        type="link"
                        onClick={() => onChange({
                            searchText: '',
                            messageType: '',
                            changeType: '',
                            from: null,
                            to: null,
                            createdBy: '',
                            attachmentsOnly: false,
                        })}
                        className="timeline-filter-clear"
                    >
                        Xóa bộ lọc
                    </Button>
                )}

                <Button type="text" icon={<CloseOutlined />} onClick={onClose} className="timeline-filter-close" />
            </Space>
        </div>
    );
}
