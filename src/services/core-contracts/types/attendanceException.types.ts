import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AttendanceException interface
 * Auto-generated from Schema: AttendanceException
 */
export interface IAttendanceException {
  _id: string;
  employeeId?: string;
  workDate?: string;
  type?: AttendanceExceptionTypeEnum;
  severity?: AttendanceExceptionSeverityEnum;
  status?: AttendanceExceptionStatusEnum;
  message?: string;
  note?: string;
  reasonCode?: string;
  resolvedBy?: string;
  resolvedAt?: IResolvedatItem[];
  name?: string;
}

export interface IResolvedatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: ResolvedatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: ResolvedatKindEnum;
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

export interface ICreateAttendanceExceptionInput {
  employeeId?: string;
  workDate?: string;
  type?: AttendanceExceptionTypeEnum2;
  severity?: AttendanceExceptionSeverityEnum2;
  status?: AttendanceExceptionStatusEnum2;
  message?: string;
  note?: string;
  reasonCode?: string;
  resolvedBy?: string;
  resolvedAt?: IResolvedatItem[];
  name?: string;
}

export type IAttendanceExceptionListResponse = ApiListResponse<IAttendanceException>

// Union types generated from value_options
export type AttendanceExceptionTypeEnum = 'late_in' | 'early_out' | 'missing_punch' | 'absent_without_leave';
export type AttendanceExceptionSeverityEnum = 'info' | 'warning' | 'critical';
export type AttendanceExceptionStatusEnum = 'open' | 'resolved' | 'ignored';
export type ResolvedatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type ResolvedatKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type AttendanceExceptionTypeEnum2 = 'late_in' | 'early_out' | 'missing_punch' | 'absent_without_leave';
export type AttendanceExceptionSeverityEnum2 = 'info' | 'warning' | 'critical';
export type AttendanceExceptionStatusEnum2 = 'open' | 'resolved' | 'ignored';
