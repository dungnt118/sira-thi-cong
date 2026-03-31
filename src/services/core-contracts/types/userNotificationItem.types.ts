import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * UserNotificationItem interface
 * Auto-generated from Schema: UserNotificationItem
 */
export interface IUserNotificationItem {
  _id: string;
  messageId?: string;
  recipientKey?: string;
  subject?: string;
  body?: string;
  imageUrl?: string;
  deepLink?: string;
  categoryId?: string;
  priority?: number;
  workflowKey?: string;
  actions?: IActionsItem[];
  customData?: any;
  isRead?: boolean;
  readAt?: IReadatItem[];
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

export interface IReadatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: ReadatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: ReadatKindEnum;
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

export interface ICreateUserNotificationItemInput {
  messageId?: string;
  recipientKey?: string;
  subject?: string;
  body?: string;
  imageUrl?: string;
  deepLink?: string;
  categoryId?: string;
  priority?: number;
  workflowKey?: string;
  actions?: IActionsItem[];
  customData?: any;
  isRead?: boolean;
  readAt?: IReadatItem[];
}

export type IUserNotificationItemListResponse = ApiListResponse<IUserNotificationItem>

// Union types generated from value_options
export type ActionsTypeEnum = 'OpenUrl' | 'DeepLink' | 'CallApi' | 'Dismiss';
export type ReadatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type ReadatKindEnum = 'Unspecified' | 'Utc' | 'Local';
