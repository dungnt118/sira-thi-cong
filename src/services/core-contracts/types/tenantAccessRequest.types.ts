import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * TenantAccessRequest interface
 * Auto-generated from Schema: TenantAccessRequest
 */
export interface ITenantAccessRequest {
  _id: string;
  globalUserId?: string;
  requester?: IRequesterItem[];
  regCode?: string;
  clientId?: string;
  message?: string;
  metadata?: any;
  status?: TenantAccessRequestStatusEnum;
  currentReviewStep?: any[];
  resolvedReviewChain?: IResolvedreviewchainItem[];
  reviewHistory?: IReviewhistoryItem[];
  reviewedBy?: string;
  reviewerName?: string;
  reviewedAt?: IReviewedatItem[];
  rejectReason?: string;
  assignedRoles?: any[];
  membershipId?: string;
  provisionedAt?: IProvisionedatItem[];
  provisionError?: string;
  provisionResult?: IProvisionresultItem[];
}

export interface IRequesterItem {
  username?: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface IResolvedreviewchainItem {
  stepIndex?: number;
  label?: string;
  reviewerType?: ResolvedreviewchainReviewerTypeEnum;
  approvalMode?: ResolvedreviewchainApprovalModeEnum;
  resolvedReviewers?: IResolvedreviewersItem[];
  stepStatus?: string;
  skipReason?: string;
}

export interface IResolvedreviewersItem {
  Username?: string;
  DisplayName?: string;
  Decision?: any[];
  DecidedAt?: IDecidedatItem[];
}

export interface IDecidedatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: DecidedatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: DecidedatKindEnum;
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

export interface IReviewhistoryItem {
  stepIndex?: number;
  stepLabel?: string;
  reviewerType?: string;
  reviewerUsername?: string;
  reviewerDisplayName?: string;
  action?: ReviewhistoryActionEnum;
  comment?: string;
  actionAt?: string | Date;
}

export interface IReviewedatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: ReviewedatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: ReviewedatKindEnum;
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

export interface IProvisionedatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: ProvisionedatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: ProvisionedatKindEnum;
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

export interface IProvisionresultItem {
  strategy?: any[];
  authorizedUserId?: string;
  subjectId?: string;
  subjectSchema?: string;
  subjectAction?: any[];
  scriptKey?: string;
  scriptParams?: any;
  pipelineKey?: string;
  pipelineAffectedDocuments?: IPipelineaffecteddocumentsItem[];
}

export interface IPipelineaffecteddocumentsItem {
  schema?: string;
  documentId?: string;
  action?: PipelineaffecteddocumentsActionEnum;
}

export interface ICreateTenantAccessRequestInput {
  globalUserId?: string;
  requester?: IRequesterItem[];
  regCode?: string;
  clientId?: string;
  message?: string;
  metadata?: any;
  status?: TenantAccessRequestStatusEnum2;
  currentReviewStep?: any[];
  resolvedReviewChain?: IResolvedreviewchainItem[];
  reviewHistory?: IReviewhistoryItem[];
  reviewedBy?: string;
  reviewerName?: string;
  reviewedAt?: IReviewedatItem[];
  rejectReason?: string;
  assignedRoles?: any[];
  membershipId?: string;
  provisionedAt?: IProvisionedatItem[];
  provisionError?: string;
  provisionResult?: IProvisionresultItem[];
}

export type ITenantAccessRequestListResponse = ApiListResponse<ITenantAccessRequest>

// Union types generated from value_options
export type TenantAccessRequestStatusEnum = 'Đang chờ' | 'Chờ xác nhận chủ sở hữu' | 'Đã duyệt' | 'Từ chối' | 'Đã hủy' | 'Đã cấp quyền';
export type ResolvedreviewchainReviewerTypeEnum = 'Quản trị viên' | 'Chủ sở hữu';
export type ResolvedreviewchainApprovalModeEnum = 'Bất kỳ một người duyệt' | 'Tất cả phải duyệt';
export type DecidedatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type DecidedatKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type ReviewhistoryActionEnum = 'Phê duyệt' | 'Từ chối';
export type ReviewedatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type ReviewedatKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type ProvisionedatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type ProvisionedatKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type PipelineaffecteddocumentsActionEnum = 'Created' | 'Updated' | 'Reused' | 'Skipped' | 'Failed';
export type TenantAccessRequestStatusEnum2 = 'Đang chờ' | 'Chờ xác nhận chủ sở hữu' | 'Đã duyệt' | 'Từ chối' | 'Đã hủy' | 'Đã cấp quyền';
