import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ContentDeleted interface
 * Auto-generated from Schema: ContentDeleted
 */
export interface IContentDeleted {
  _id: string;
  content_id?: string;
  deletedTime?: string | Date;
  deleter?: string;
  sessionTime?: string;
  isLocked?: boolean;
  isDraft?: boolean;
  schema?: string;
  lockedBy?: string;
  tenantId?: string;
  ownerId?: string;
  departmentId?: string;
  orgPath?: any[];
  lastVersionId?: string;
  versionId?: string;
  translate?: any;
  approvalSnapshot?: IApprovalsnapshotItem[];
  main_thread_id?: string;
  thread_ids?: any[];
  wf_approval?: IWfApprovalItem[];
  customData?: any;
  isSeeding?: any[];
}

export interface IApprovalsnapshotItem {
  currentVersionId?: string;
  currentState?: ApprovalsnapshotCurrentStateEnum;
  currentTicketId?: string;
  snapshotUpdatedAt?: string | Date;
  finalActionType?: ApprovalsnapshotFinalActionTypeEnum;
  finalApproverUserIds?: any[];
  finalDecisionNote?: string;
  finalActionAt?: IFinalactionatItem[];
  currentStageInfo?: string;
  pendingAssigneeUserIds?: any[];
}

export interface IFinalactionatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: FinalactionatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: FinalactionatKindEnum;
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

export interface IWfApprovalItem {
  status?: WfApprovalStatusEnum;
  instance_id?: string;
  current_step?: string;
  progress?: IProgressItem[];
  due_at?: IDueAtItem[];
  priority?: WfApprovalPriorityEnum;
  last_action?: ILastActionItem[];
  updated_at?: string | Date;
  definition?: IDefinitionItem[];
  instance?: IInstanceItem[];
  current_step_detail?: ICurrentStepDetailItem[];
  steps?: IStepsItem[];
  history?: IHistoryItem[];
}

export interface IProgressItem {
  current?: number;
  total?: number;
  percent?: number;
}

export interface IDueAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: DueAtDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: DueAtKindEnum;
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

export interface ILastActionItem {
  action?: string;
  actor_user_id?: string;
  actor_name?: string;
  at?: string | Date;
}

export interface IDefinitionItem {
  id?: string;
  key?: string;
  name?: string;
  version?: number;
}

export interface IInstanceItem {
  id?: string;
  status?: InstanceStatusEnum;
  started_at?: IStartedAtItem[];
  ended_at?: IEndedAtItem[];
  duration_seconds?: any[];
}

export interface IStartedAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: StartedAtDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: StartedAtKindEnum;
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

export interface IEndedAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: EndedAtDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: EndedAtKindEnum;
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

export interface ICurrentStepDetailItem {
  id?: string;
  name?: string;
  type?: CurrentStepDetailTypeEnum;
  index?: number;
  status?: CurrentStepDetailStatusEnum;
  started_at?: IStartedAtItem[];
  due_at?: IDueAtItem[];
}

export interface IStartedAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: StartedAtDayOfWeekEnum2;
  DayOfYear?: number;
  Hour?: number;
  Kind?: StartedAtKindEnum2;
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

export interface IDueAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: DueAtDayOfWeekEnum2;
  DayOfYear?: number;
  Hour?: number;
  Kind?: DueAtKindEnum2;
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

export interface IStepsItem {
  id?: string;
  name?: string;
  type?: StepsTypeEnum;
  order?: number;
  status?: StepsStatusEnum;
  started_at?: IStartedAtItem[];
  ended_at?: IEndedAtItem[];
  duration_seconds?: any[];
  sla?: ISlaItem[];
  assignees?: IAssigneesItem[];
  actions?: IActionsItem[];
  jobs?: IJobsItem[];
}

export interface IStartedAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: StartedAtDayOfWeekEnum3;
  DayOfYear?: number;
  Hour?: number;
  Kind?: StartedAtKindEnum3;
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

export interface IEndedAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: EndedAtDayOfWeekEnum2;
  DayOfYear?: number;
  Hour?: number;
  Kind?: EndedAtKindEnum2;
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

export interface ISlaItem {
  due_at?: IDueAtItem[];
  is_overdue?: boolean;
}

export interface IDueAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: DueAtDayOfWeekEnum3;
  DayOfYear?: number;
  Hour?: number;
  Kind?: DueAtKindEnum3;
  Millisecond?: number;
  Microsecond?: number;
  Nanosecond?: number;
  Minute?: number;
  Month?: number;
  Second?: number;
  Ticks?: any;
  TimeOfDay?: any;
  Year?: number;
}

export interface IAssigneesItem {
  user_id?: string;
  username?: string;
  display_name?: string;
  department_id?: string;
  department_name?: string;
}

export interface IActionsItem {
  action?: string;
  actor_user_id?: string;
  actor_name?: string;
  comment?: string;
  at?: string | Date;
}

export interface IJobsItem {
  job_id?: string;
  status?: JobsStatusEnum;
  assigned_to?: string;
  started_at?: IStartedAtItem[];
  completed_at?: ICompletedAtItem[];
  evidence?: IEvidenceItem[];
}

export interface IStartedAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: StartedAtDayOfWeekEnum4;
  DayOfYear?: number;
  Hour?: number;
  Kind?: StartedAtKindEnum4;
  Millisecond?: number;
  Microsecond?: number;
  Nanosecond?: number;
  Minute?: number;
  Month?: number;
  Second?: number;
  Ticks?: any;
  TimeOfDay?: any;
  Year?: number;
}

export interface ICompletedAtItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: CompletedAtDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: CompletedAtKindEnum;
  Millisecond?: number;
  Microsecond?: number;
  Nanosecond?: number;
  Minute?: number;
  Month?: number;
  Second?: number;
  Ticks?: any;
  TimeOfDay?: any;
  Year?: number;
}

export interface IEvidenceItem {
  attachments?: any[];
  note?: string;
}

export interface IHistoryItem {
  event?: string;
  step_id?: string;
  at?: string | Date;
  actor_user_id?: string;
  actor_name?: string;
  meta?: any;
}

export interface ICreateContentDeletedInput {
  content_id?: string;
  deletedTime?: string | Date;
  deleter?: string;
  sessionTime?: string;
  isLocked?: boolean;
  isDraft?: boolean;
  schema?: string;
  lockedBy?: string;
  tenantId?: string;
  ownerId?: string;
  departmentId?: string;
  orgPath?: any[];
  lastVersionId?: string;
  versionId?: string;
  translate?: any;
  approvalSnapshot?: IApprovalsnapshotItem[];
  main_thread_id?: string;
  thread_ids?: any[];
  wf_approval?: IWfApprovalItem[];
  customData?: any;
  isSeeding?: any[];
}

export type IContentDeletedListResponse = ApiListResponse<IContentDeleted>

// Union types generated from value_options
export type ApprovalsnapshotCurrentStateEnum = 'draft' | 'commited' | 'approved' | 'rejected' | 'cancelled';
export type ApprovalsnapshotFinalActionTypeEnum = 'Approve' | 'Reject' | 'RequestChanges' | 'Comment' | 'Delegate' | 'Reassign' | 'Withdraw' | 'Cancel' | 'Escalate';
export type FinalactionatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type FinalactionatKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type WfApprovalStatusEnum = 'draft' | 'pending_approval' | 'in_progress' | 'approved' | 'rejected' | 'cancelled' | 'failed';
export type WfApprovalPriorityEnum = 'low' | 'normal' | 'high' | 'urgent';
export type DueAtDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type DueAtKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type InstanceStatusEnum = 'draft' | 'pending_approval' | 'in_progress' | 'approved' | 'rejected' | 'cancelled' | 'failed';
export type StartedAtDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type StartedAtKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type EndedAtDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type EndedAtKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type CurrentStepDetailTypeEnum = 'review' | 'approval' | 'notification' | 'task' | 'signal';
export type CurrentStepDetailStatusEnum = 'pending' | 'queued' | 'in_progress' | 'waiting_signal' | 'approved' | 'rejected' | 'skipped' | 'cancelled' | 'failed' | 'completed';
export type StartedAtDayOfWeekEnum2 = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type StartedAtKindEnum2 = 'Unspecified' | 'Utc' | 'Local';
export type DueAtDayOfWeekEnum2 = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type DueAtKindEnum2 = 'Unspecified' | 'Utc' | 'Local';
export type StepsTypeEnum = 'review' | 'approval' | 'notification' | 'task' | 'signal';
export type StepsStatusEnum = 'pending' | 'queued' | 'in_progress' | 'waiting_signal' | 'approved' | 'rejected' | 'skipped' | 'cancelled' | 'failed' | 'completed';
export type StartedAtDayOfWeekEnum3 = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type StartedAtKindEnum3 = 'Unspecified' | 'Utc' | 'Local';
export type EndedAtDayOfWeekEnum2 = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type EndedAtKindEnum2 = 'Unspecified' | 'Utc' | 'Local';
export type DueAtDayOfWeekEnum3 = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type DueAtKindEnum3 = 'Unspecified' | 'Utc' | 'Local';
export type JobsStatusEnum = 'pending' | 'queued' | 'in_progress' | 'waiting_signal' | 'approved' | 'rejected' | 'skipped' | 'cancelled' | 'failed' | 'completed';
export type StartedAtDayOfWeekEnum4 = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type StartedAtKindEnum4 = 'Unspecified' | 'Utc' | 'Local';
export type CompletedAtDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type CompletedAtKindEnum = 'Unspecified' | 'Utc' | 'Local';
