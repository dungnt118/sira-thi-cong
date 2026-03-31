import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ContentChatboxMessage interface
 * Auto-generated from Schema: ContentChatboxMessage
 */
export interface IContentChatboxMessage {
  _id: string;
  content?: string;
  message_type?: ContentChatboxMessageMessageTypeEnum;
  thread_id?: string;
  reply_to_id?: string;
  context?: IContextItem[];
  payload?: IPayloadItem[];
  system?: ISystemItem[];
  date?: string | Date;
}

export interface IContextItem {
  target_schema?: string;
  content_id?: string;
  content_title?: string;
}

export interface IPayloadItem {
  metadata?: string;
  attachments?: IAttachmentsItem[];
  schedule?: IScheduleItem[];
  mentions?: any[];
}

export interface IAttachmentsItem {
  file_id?: string;
  name?: string;
  mine_type?: string;
  size?: any[];
  alt?: string;
  url?: string;
  file_type?: string;
  file_path?: string;
}

export interface IScheduleItem {
  scheduled_at?: IScheduledAtItem[];
  timezone?: string;
  remind_before_minutes?: any[];
  recurrence?: string;
}

export interface IScheduledAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: ScheduledAtDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: ScheduledAtKindEnum;
  Millisecond?: number;
  Microsecond?: number;
  Nanosecond?: number;
  Minute?: number;
  Month?: number;
  Second?: number;
  Ticks?: any;
  TimeOfDay?: ITimeofdayItem[];
  Year?: number;
}

export interface ITimeofdayItem {
  Ticks?: any;
  Days?: number;
  Hours?: number;
  Milliseconds?: number;
  Microseconds?: number;
  Nanoseconds?: number;
  Minutes?: number;
  Seconds?: number;
  TotalDays?: number;
  TotalHours?: number;
  TotalMilliseconds?: number;
  TotalMicroseconds?: number;
  TotalNanoseconds?: number;
  TotalMinutes?: number;
  TotalSeconds?: number;
}

export interface ISystemItem {
  change_type?: SystemChangeTypeEnum;
  changes?: IChangesItem[];
  oridata?: string;
}

export interface IChangesItem {
  id?: string;
  label?: string;
  ori?: string;
  current?: string;
}

export interface ICreateContentChatboxMessageInput {
  content?: string;
  message_type?: ContentChatboxMessageMessageTypeEnum2;
  thread_id?: string;
  reply_to_id?: string;
  context?: IContextItem[];
  payload?: IPayloadItem[];
  system?: ISystemItem[];
  date?: string | Date;
}

export type IContentChatboxMessageListResponse = ApiListResponse<IContentChatboxMessage>

// Union types generated from value_options
export type ContentChatboxMessageMessageTypeEnum = 'contentchanged' | 'schedule' | 'note' | 'message';
export type ScheduledAtDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type ScheduledAtKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type SystemChangeTypeEnum = 'created' | 'updated' | 'deleted';
export type ContentChatboxMessageMessageTypeEnum2 = 'contentchanged' | 'schedule' | 'note' | 'message';
