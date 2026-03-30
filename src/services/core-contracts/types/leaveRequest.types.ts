import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * LeaveRequest interface
 * Auto-generated from Schema: LeaveRequest
 */
export interface ILeaveRequest {
  _id: string;
  employeeId?: string;
  leaveTypeId?: string;
  fromDate?: string;
  toDate?: string;
  totalDays?: string;
  reason?: string;
  status?: LeaveRequestStatusEnum;
  attachments?: string;
  dayRequests?: IDayrequestsItem[];
  approverId?: string;
  approvalDate?: IApprovaldateItem[];
  rejectionReason?: string;
  name?: string;
}

export interface IDayrequestsItem {
  workDate?: string | Date;
  requestedScope?: DayrequestsRequestedScopeEnum;
  countedDays?: number;
}

export interface IApprovaldateItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: ApprovaldateDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: ApprovaldateKindEnum;
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

export interface ICreateLeaveRequestInput {
  employeeId?: string;
  leaveTypeId?: string;
  fromDate?: string;
  toDate?: string;
  totalDays?: string;
  reason?: string;
  status?: LeaveRequestStatusEnum2;
  attachments?: string;
  dayRequests?: IDayrequestsItem[];
  approverId?: string;
  approvalDate?: IApprovaldateItem[];
  rejectionReason?: string;
  name?: string;
}

export type ILeaveRequestListResponse = ApiListResponse<ILeaveRequest>

// Union types generated from value_options
export type LeaveRequestStatusEnum = 'Chờ phê duyệt' | 'Đã phê duyệt' | 'Đã từ chối' | 'Đã hủy';
export type DayrequestsRequestedScopeEnum = 'full_day' | 'morning' | 'afternoon';
export type ApprovaldateDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type ApprovaldateKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type LeaveRequestStatusEnum2 = 'Chờ phê duyệt' | 'Đã phê duyệt' | 'Đã từ chối' | 'Đã hủy';
