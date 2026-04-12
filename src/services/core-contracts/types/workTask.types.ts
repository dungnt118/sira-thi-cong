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
  documentId?: string;
  idx_documentId?: IndexedContentItem;
  assignee?: any;
  actions?: IActionsItem[];
}

export interface IActionsItem {
  action_key?: ActionsActionKeyEnum;
  action_type?: ActionsActionTypeEnum;
  target_field?: ActionsTargetFieldEnum;
  expected_value?: string;
  doc_type?: ActionsDocTypeEnum;
  min_count?: number;
  note?: string;
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
  documentId?: string;
  assignee?: any;
  actions?: IActionsItem[];
}

export type IWorkTaskListResponse = ApiListResponse<IWorkTask>

// Union types generated from value_options
export type WorkTaskJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type WorkTaskStatusEnum = 'pending' | 'finished' | 'skipped';
export type WorkTaskAssigneeRoleEnum = 'QL' | 'GS' | 'KYT' | 'KT' | 'HC' | 'KD' | 'ADMIN';
export type ActionsActionKeyEnum = 'fill_site_address' | 'assign_owner_user' | 'upload_survey_report' | 'upload_site_photos' | 'upload_solution_doc' | 'upload_business_plan' | 'upload_customer_quotation' | 'upload_contract' | 'confirm_quote_approved' | 'confirm_final_acceptance' | 'upload_payment_receipt' | 'link_origin_journey';
export type ActionsActionTypeEnum = 'require_journey_field' | 'require_document' | 'require_status_equals';
export type ActionsTargetFieldEnum = 'request_title' | 'customer_id' | 'owner_user' | 'site_address' | 'serviceTypeId' | 'go_no_go_status' | 'survey_status' | 'quote_status' | 'project_status' | 'portal_publish_status' | 'journey_kind' | 'origin_journey_id';
export type ActionsDocTypeEnum = 'survey_report' | 'site_photos' | 'solution_doc' | 'business_plan' | 'quotation' | 'contract' | 'advance_request' | 'stage_acceptance' | 'stage_payment_proof' | 'final_acceptance' | 'payment_receipt' | 'maintenance_record' | 'warranty_record' | 'after_sales_note';
export type WorkTaskJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type WorkTaskStatusEnum2 = 'pending' | 'finished' | 'skipped';
export type WorkTaskAssigneeRoleEnum2 = 'QL' | 'GS' | 'KYT' | 'KT' | 'HC' | 'KD' | 'ADMIN';
