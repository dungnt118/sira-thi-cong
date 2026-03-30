import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * TenantMembership interface
 * Auto-generated from Schema: TenantMembership
 */
export interface ITenantMembership {
  _id: string;
  globalUserId?: string;
  regCode?: string;
  tenantId?: string;
  isActive?: boolean;
  role?: string;
  username?: string;
  joinedAt?: string | Date;
  expiresAt?: IExpiresatItem[];
  addedBy?: string;
  metadata?: any;
}

export interface IExpiresatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: ExpiresatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: ExpiresatKindEnum;
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

export interface ICreateTenantMembershipInput {
  globalUserId?: string;
  regCode?: string;
  tenantId?: string;
  isActive?: boolean;
  role?: string;
  username?: string;
  joinedAt?: string | Date;
  expiresAt?: IExpiresatItem[];
  addedBy?: string;
  metadata?: any;
}

export type ITenantMembershipListResponse = ApiListResponse<ITenantMembership>

// Union types generated from value_options
export type ExpiresatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type ExpiresatKindEnum = 'Unspecified' | 'Utc' | 'Local';
