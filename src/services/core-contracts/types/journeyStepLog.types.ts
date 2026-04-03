import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * JourneyStepLog interface
 * Auto-generated from Schema: JourneyStepLog
 */
export interface IJourneyStepLog {
  _id: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  step_code?: JourneyStepLogStepCodeEnum;
  event_type?: JourneyStepLogEventTypeEnum;
  event_time?: string | Date;
  from_step_code?: JourneyStepLogFromStepCodeEnum;
  to_step_code?: JourneyStepLogToStepCodeEnum;
  start_time?: string | Date;
  end_time?: string | Date;
  duration_minutes?: number;
  sla_hours_snapshot?: number;
  sla_status?: JourneyStepLogSlaStatusEnum;
  actor_user?: any;
  trigger_source?: JourneyStepLogTriggerSourceEnum;
  worktask_id?: string;
  idx_worktask_id?: IndexedContentItem;
  note?: string;
  metadata?: IMetadataItem;
}

export interface IMetadataItem {
  previous_status?: string;
  new_status?: string;
  breach_reason?: string;
  comment?: string;
}

export interface ICreateJourneyStepLogInput {
  journey_id?: string;
  step_code?: JourneyStepLogStepCodeEnum2;
  event_type?: JourneyStepLogEventTypeEnum2;
  event_time?: string | Date;
  from_step_code?: JourneyStepLogFromStepCodeEnum2;
  to_step_code?: JourneyStepLogToStepCodeEnum2;
  start_time?: string | Date;
  end_time?: string | Date;
  duration_minutes?: number;
  sla_hours_snapshot?: number;
  sla_status?: JourneyStepLogSlaStatusEnum2;
  actor_user?: any;
  trigger_source?: JourneyStepLogTriggerSourceEnum2;
  worktask_id?: string;
  note?: string;
  metadata?: IMetadataItem;
}

export type IJourneyStepLogListResponse = ApiListResponse<IJourneyStepLog>

// Union types generated from value_options
export type JourneyStepLogStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type JourneyStepLogEventTypeEnum = 'enter_step' | 'exit_step' | 'transition' | 'pause_step' | 'resume_step' | 'complete_step' | 'reopen_step' | 'sla_snapshot';
export type JourneyStepLogFromStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type JourneyStepLogToStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type JourneyStepLogSlaStatusEnum = 'on_time' | 'at_risk' | 'overdue' | 'paused' | 'completed';
export type JourneyStepLogTriggerSourceEnum = 'manual' | 'workflow' | 'system' | 'api' | 'import';
export type JourneyStepLogStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type JourneyStepLogEventTypeEnum2 = 'enter_step' | 'exit_step' | 'transition' | 'pause_step' | 'resume_step' | 'complete_step' | 'reopen_step' | 'sla_snapshot';
export type JourneyStepLogFromStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type JourneyStepLogToStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type JourneyStepLogSlaStatusEnum2 = 'on_time' | 'at_risk' | 'overdue' | 'paused' | 'completed';
export type JourneyStepLogTriggerSourceEnum2 = 'manual' | 'workflow' | 'system' | 'api' | 'import';
