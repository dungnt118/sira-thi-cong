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
  assignee_role?: WorkTaskAssigneeRoleEnum;
  action_key?: WorkTaskActionKeyEnum;
  documentId?: string;
  idx_documentId?: IndexedContentItem;
  assignee?: any;
}

export interface ICreateWorkTaskInput {
  journey_id?: string;
  journey_step_code?: WorkTaskJourneyStepCodeEnum2;
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
  assignee_role?: WorkTaskAssigneeRoleEnum2;
  action_key?: WorkTaskActionKeyEnum2;
  documentId?: string;
  assignee?: any;
}

export type IWorkTaskListResponse = ApiListResponse<IWorkTask>

// Union types generated from value_options
export type WorkTaskJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type WorkTaskStatusEnum = 'pending' | 'finished' | 'skipped';
export type WorkTaskAssigneeRoleEnum = 'QL' | 'GS' | 'KYT' | 'KT' | 'HC' | 'KD' | 'ADMIN';
export type WorkTaskActionKeyEnum = 'fill_site_address' | 'assign_owner_user' | 'upload_survey_report' | 'upload_site_photos' | 'upload_solution_doc' | 'upload_business_plan' | 'upload_customer_quotation' | 'upload_contract' | 'confirm_quote_approved' | 'confirm_final_acceptance' | 'upload_payment_receipt' | 'link_origin_journey';
export type WorkTaskJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type WorkTaskStatusEnum2 = 'pending' | 'finished' | 'skipped';
export type WorkTaskAssigneeRoleEnum2 = 'QL' | 'GS' | 'KYT' | 'KT' | 'HC' | 'KD' | 'ADMIN';
export type WorkTaskActionKeyEnum2 = 'fill_site_address' | 'assign_owner_user' | 'upload_survey_report' | 'upload_site_photos' | 'upload_solution_doc' | 'upload_business_plan' | 'upload_customer_quotation' | 'upload_contract' | 'confirm_quote_approved' | 'confirm_final_acceptance' | 'upload_payment_receipt' | 'link_origin_journey';
