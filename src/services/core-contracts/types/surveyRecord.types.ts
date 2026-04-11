import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * SurveyRecord interface
 * Auto-generated from Schema: SurveyRecord
 */
export interface ISurveyRecord {
  _id: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: SurveyRecordJourneyStepCodeEnum;
  scheduled_date?: string | Date;
  survey_date?: string | Date;
  survey_status?: SurveyRecordSurveyStatusEnum;
  surveyor_name?: string;
  customer_name?: string;
  site_address?: string;
  contact_name?: string;
  contact_phone?: string;
  condition_items?: IConditionItemsItem[];
  proposed_items?: IProposedItemsItem[];
  proposed_solution?: string;
  labor_need_note?: string;
  material_need_note?: string;
  review_status?: SurveyRecordReviewStatusEnum;
  media_files?: HeadlessFileUpload[];
  //deprecated fields
  // service_request_id?: string;
  // idx_service_request_id?: IndexedContentItem;
}

export interface IConditionItemsItem {
  area_name?: string;
  condition_note?: string;
  measurement_note?: string;
  risk_note?: string;
}

export interface IProposedItemsItem {
  item_name?: string;
  scope_note?: string;
  quantity_note?: string;
  technical_note?: string;
}

export interface ICreateSurveyRecordInput {
  journey_id?: string;
  journey_step_code?: SurveyRecordJourneyStepCodeEnum2;
  scheduled_date?: string | Date;
  survey_date?: string | Date;
  survey_status?: SurveyRecordSurveyStatusEnum2;
  surveyor_name?: string;
  customer_name?: string;
  site_address?: string;
  contact_name?: string;
  contact_phone?: string;
  condition_items?: IConditionItemsItem[];
  proposed_items?: IProposedItemsItem[];
  proposed_solution?: string;
  labor_need_note?: string;
  material_need_note?: string;
  review_status?: SurveyRecordReviewStatusEnum2;
  media_files?: HeadlessFileUpload[];
  //deprecated fields
  // service_request_id?: string;
}

export type ISurveyRecordListResponse = ApiListResponse<ISurveyRecord>

// Union types generated from value_options
export type SurveyRecordJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type SurveyRecordSurveyStatusEnum = 'draft' | 'pending_completion' | 'completed' | 'approved';
export type SurveyRecordReviewStatusEnum = 'pending' | 'reviewed' | 'need_update' | 'approved';
export type SurveyRecordJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type SurveyRecordSurveyStatusEnum2 = 'draft' | 'pending_completion' | 'completed' | 'approved';
export type SurveyRecordReviewStatusEnum2 = 'pending' | 'reviewed' | 'need_update' | 'approved';
