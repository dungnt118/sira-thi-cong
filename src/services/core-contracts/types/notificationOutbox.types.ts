import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * NotificationOutbox interface
 * Auto-generated from Schema: NotificationOutbox
 */
export interface INotificationOutbox {
  _id: string;
  messageId?: string;
  scope?: NotificationOutboxScopeEnum;
  regCode?: string;
  workflowKey?: string;
  correlationId?: string;
  subjectTemplate?: string;
  bodyTemplate?: string;
  templateData?: any;
  metadata?: IMetadataItem[];
  recipients?: IRecipientsItem[];
  channels?: IChannelsItem[];
  priority?: number;
  status?: NotificationOutboxStatusEnum;
  scheduledAt?: IScheduledatItem[];
  options?: any;
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

export interface IRecipientsItem {
  userGroupIds?: IUsergroupidsItem[];
  includes?: IIncludesItem[];
  excludes?: IExcludesItem[];
  explicitUsernames?: IExplicitusernamesItem[];
  explicitEmails?: IExplicitemailsItem[];
  explicitGlobalUserIds?: IExplicitglobaluseridsItem[];
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

export interface IIncludesItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IExcludesItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IExplicitusernamesItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IExplicitemailsItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IExplicitglobaluseridsItem {
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

export interface ICreateNotificationOutboxInput {
  messageId?: string;
  scope?: NotificationOutboxScopeEnum2;
  regCode?: string;
  workflowKey?: string;
  correlationId?: string;
  subjectTemplate?: string;
  bodyTemplate?: string;
  templateData?: any;
  metadata?: IMetadataItem[];
  recipients?: IRecipientsItem[];
  channels?: IChannelsItem[];
  priority?: number;
  status?: NotificationOutboxStatusEnum2;
  scheduledAt?: IScheduledatItem[];
  options?: any;
}

export type INotificationOutboxListResponse = ApiListResponse<INotificationOutbox>

// Union types generated from value_options
export type NotificationOutboxScopeEnum = 'Tenant' | 'CrossTenant' | 'SystemWide';
export type NotificationOutboxStatusEnum = 'Pending' | 'Processing' | 'PartiallyCompleted' | 'Completed' | 'Failed';
export type ActionsTypeEnum = 'OpenUrl' | 'DeepLink' | 'CallApi' | 'Dismiss';
export type ScheduledatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type NotificationOutboxScopeEnum2 = 'Tenant' | 'CrossTenant' | 'SystemWide';
export type NotificationOutboxStatusEnum2 = 'Pending' | 'Processing' | 'PartiallyCompleted' | 'Completed' | 'Failed';
