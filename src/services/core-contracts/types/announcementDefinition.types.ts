import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AnnouncementDefinition interface
 * Auto-generated from Schema: AnnouncementDefinition
 */
export interface IAnnouncementDefinition {
  _id: string;
  title?: string;
  content?: string;
  summary?: string;
  coverImage?: string;
  templateId?: string;
  attachments?: IAttachmentsItem[];
  templateData?: any;
  userGroupIds?: IUsergroupidsItem[];
  channels?: IChannelsItem[];
  priority?: number;
  categoryId?: string;
  metadata?: IMetadataItem[];
  status?: AnnouncementDefinitionStatusEnum;
  sentAt?: ISentatItem[];
  scheduledAt?: IScheduledatItem[];
  outboxMessageId?: string;
  totalRecipients?: number;
  totalSent?: number;
  totalRead?: number;
  statsRefreshedAt?: IStatsrefreshedatItem[];
  tags?: any[];
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

export interface IUsergroupidsItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IChannelsItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IMetadataItem {
  deepLink?: string;
  schemaName?: string;
  recordId?: string;
  actionKey?: string;
  categoryId?: string;
  actions?: IActionsItem[];
  customData?: any;
}

export interface IActionsItem {
  actionId?: string;
  label?: string;
  icon?: string;
  type?: ActionsTypeEnum;
  url?: string;
  deepLink?: string;
  apiEndpoint?: string;
  payload?: any;
}

export interface ISentatItem {
  DateTime?: string | Date;
  UtcDateTime?: string | Date;
  LocalDateTime?: string | Date;
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: SentatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Millisecond?: number;
  Microsecond?: number;
  Nanosecond?: number;
  Minute?: number;
  Month?: number;
  Offset?: IOffsetItem[];
  TotalOffsetMinutes?: number;
  Second?: number;
  Ticks?: any;
  UtcTicks?: any;
  TimeOfDay?: ITimeofdayItem[];
  Year?: number;
}

export interface IOffsetItem {
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

export interface IScheduledatItem {
  DateTime?: string | Date;
  UtcDateTime?: string | Date;
  LocalDateTime?: string | Date;
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: ScheduledatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Millisecond?: number;
  Microsecond?: number;
  Nanosecond?: number;
  Minute?: number;
  Month?: number;
  Offset?: IOffsetItem[];
  TotalOffsetMinutes?: number;
  Second?: number;
  Ticks?: any;
  UtcTicks?: any;
  TimeOfDay?: ITimeofdayItem[];
  Year?: number;
}

export interface IOffsetItem {
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

export interface IStatsrefreshedatItem {
  DateTime?: string | Date;
  UtcDateTime?: string | Date;
  LocalDateTime?: string | Date;
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: StatsrefreshedatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Millisecond?: number;
  Microsecond?: number;
  Nanosecond?: number;
  Minute?: number;
  Month?: number;
  Offset?: IOffsetItem[];
  TotalOffsetMinutes?: number;
  Second?: number;
  Ticks?: any;
  UtcTicks?: any;
  TimeOfDay?: ITimeofdayItem[];
  Year?: number;
}

export interface IOffsetItem {
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

export interface ICreateAnnouncementDefinitionInput {
  title?: string;
  content?: string;
  summary?: string;
  coverImage?: string;
  templateId?: string;
  attachments?: IAttachmentsItem[];
  templateData?: any;
  userGroupIds?: IUsergroupidsItem[];
  channels?: IChannelsItem[];
  priority?: number;
  categoryId?: string;
  metadata?: IMetadataItem[];
  status?: AnnouncementDefinitionStatusEnum2;
  sentAt?: ISentatItem[];
  scheduledAt?: IScheduledatItem[];
  outboxMessageId?: string;
  totalRecipients?: number;
  totalSent?: number;
  totalRead?: number;
  statsRefreshedAt?: IStatsrefreshedatItem[];
  tags?: any[];
}

export type IAnnouncementDefinitionListResponse = ApiListResponse<IAnnouncementDefinition>

// Union types generated from value_options
export type AnnouncementDefinitionStatusEnum = 'Draft' | 'Sent' | 'Scheduled' | 'Cancelled';
export type ActionsTypeEnum = 'OpenUrl' | 'DeepLink' | 'CallApi' | 'Dismiss';
export type SentatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type ScheduledatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type StatsrefreshedatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type AnnouncementDefinitionStatusEnum2 = 'Draft' | 'Sent' | 'Scheduled' | 'Cancelled';
