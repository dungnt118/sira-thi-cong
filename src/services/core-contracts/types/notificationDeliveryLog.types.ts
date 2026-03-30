import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * NotificationDeliveryLog interface
 * Auto-generated from Schema: NotificationDeliveryLog
 */
export interface INotificationDeliveryLog {
  _id: string;
  messageId?: string;
  regCode?: string;
  recipientKey?: string;
  recipientType?: string;
  channel?: NotificationDeliveryLogChannelEnum;
  resolvedSubject?: string;
  resolvedBody?: string;
  status?: NotificationDeliveryLogStatusEnum;
  attempts?: number;
  sentAt?: ISentatItem[];
  deliveredAt?: IDeliveredatItem[];
  errorMessage?: string;
  providerMessageId?: string;
  providerName?: string;
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

export interface IDeliveredatItem {
  DateTime?: string | Date;
  UtcDateTime?: string | Date;
  LocalDateTime?: string | Date;
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: DeliveredatDayOfWeekEnum;
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

export interface ICreateNotificationDeliveryLogInput {
  messageId?: string;
  regCode?: string;
  recipientKey?: string;
  recipientType?: string;
  channel?: NotificationDeliveryLogChannelEnum2;
  resolvedSubject?: string;
  resolvedBody?: string;
  status?: NotificationDeliveryLogStatusEnum2;
  attempts?: number;
  sentAt?: ISentatItem[];
  deliveredAt?: IDeliveredatItem[];
  errorMessage?: string;
  providerMessageId?: string;
  providerName?: string;
}

export type INotificationDeliveryLogListResponse = ApiListResponse<INotificationDeliveryLog>

// Union types generated from value_options
export type NotificationDeliveryLogChannelEnum = 'InApp' | 'Email' | 'WebPush' | 'AppPush' | 'SMS';
export type NotificationDeliveryLogStatusEnum = 'Queued' | 'Sent' | 'Delivered' | 'Read' | 'Failed' | 'Bounced' | 'Rejected';
export type SentatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type DeliveredatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type NotificationDeliveryLogChannelEnum2 = 'InApp' | 'Email' | 'WebPush' | 'AppPush' | 'SMS';
export type NotificationDeliveryLogStatusEnum2 = 'Queued' | 'Sent' | 'Delivered' | 'Read' | 'Failed' | 'Bounced' | 'Rejected';
