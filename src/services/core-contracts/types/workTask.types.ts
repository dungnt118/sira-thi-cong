import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * WorkTask interface
 * Auto-generated from Schema: WorkTask
 */
export interface IWorkTask {
  _id: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: WorkTaskJourneyStepCodeEnum;
  role?: string;
  idx_role?: IndexedContentItem;
  assignee?: any;
  assigned_by?: any;
  title?: string;
  description?: string;
  is_required?: boolean;
  sla_hours?: number;
  start_time?: string | Date;
  due_time?: string | Date;
  finish_time?: string | Date;
  status?: WorkTaskStatusEnum;
  verified?: boolean;
  verified_by?: any;
  verified_time?: string | Date;
  note?: string;
}

export interface ICreateWorkTaskInput {
  journey_id?: string;
  journey_step_code?: WorkTaskJourneyStepCodeEnum2;
  role?: string;
  assignee?: any;
  assigned_by?: any;
  title?: string;
  description?: string;
  is_required?: boolean;
  sla_hours?: number;
  start_time?: string | Date;
  due_time?: string | Date;
  finish_time?: string | Date;
  status?: WorkTaskStatusEnum2;
  verified?: boolean;
  verified_by?: any;
  verified_time?: string | Date;
  note?: string;
}

export type IWorkTaskListResponse = ApiListResponse<IWorkTask>

// Union types generated from value_options
export type WorkTaskJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type WorkTaskStatusEnum = 'pending' | 'finished' | 'skipped';
export type WorkTaskJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type WorkTaskStatusEnum2 = 'pending' | 'finished' | 'skipped';
