import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AttendanceAdjustmentRequest interface
 * Auto-generated from Schema: AttendanceAdjustmentRequest
 */
export interface IAttendanceAdjustmentRequest {
  _id: string;
  attendanceId?: string;
  employeeId?: string;
  issueType?: AttendanceAdjustmentRequestIssueTypeEnum;
  reason?: string;
  status?: AttendanceAdjustmentRequestStatusEnum;
  approvedBy?: string;
  approvedAt?: IApprovedatItem[];
  approvalNote?: string;
  name?: string;
}

export interface IApprovedatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: ApprovedatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: ApprovedatKindEnum;
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

export interface ICreateAttendanceAdjustmentRequestInput {
  attendanceId?: string;
  employeeId?: string;
  issueType?: AttendanceAdjustmentRequestIssueTypeEnum2;
  reason?: string;
  status?: AttendanceAdjustmentRequestStatusEnum2;
  approvedBy?: string;
  approvedAt?: IApprovedatItem[];
  approvalNote?: string;
  name?: string;
}

export type IAttendanceAdjustmentRequestListResponse = ApiListResponse<IAttendanceAdjustmentRequest>

// Union types generated from value_options
export type AttendanceAdjustmentRequestIssueTypeEnum = 'missing_check_in' | 'missing_check_out' | 'wrong_time' | 'wrong_location' | 'system_error' | 'other';
export type AttendanceAdjustmentRequestStatusEnum = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type ApprovedatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type ApprovedatKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type AttendanceAdjustmentRequestIssueTypeEnum2 = 'missing_check_in' | 'missing_check_out' | 'wrong_time' | 'wrong_location' | 'system_error' | 'other';
export type AttendanceAdjustmentRequestStatusEnum2 = 'pending' | 'approved' | 'rejected' | 'cancelled';
