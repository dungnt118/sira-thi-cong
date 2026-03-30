import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AttendanceRecord interface
 * Auto-generated from Schema: AttendanceRecord
 */
export interface IAttendanceRecord {
  _id: string;
  employeeId?: string;
  workDate?: string;
  checkIn?: ICheckinItem[];
  checkOut?: ICheckoutItem[];
  workingHours?: string;
  status?: AttendanceRecordStatusEnum;
  note?: string;
  name?: string;
}

export interface ICheckinItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: CheckinDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: CheckinKindEnum;
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

export interface ICheckoutItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: CheckoutDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: CheckoutKindEnum;
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

export interface ICreateAttendanceRecordInput {
  employeeId?: string;
  workDate?: string;
  checkIn?: ICheckinItem[];
  checkOut?: ICheckoutItem[];
  workingHours?: string;
  status?: AttendanceRecordStatusEnum2;
  note?: string;
  name?: string;
}

export type IAttendanceRecordListResponse = ApiListResponse<IAttendanceRecord>

// Union types generated from value_options
export type AttendanceRecordStatusEnum = 'present' | 'absent' | 'leave' | 'holiday' | 'weekend';
export type CheckinDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type CheckinKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type CheckoutDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type CheckoutKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type AttendanceRecordStatusEnum2 = 'present' | 'absent' | 'leave' | 'holiday' | 'weekend';
