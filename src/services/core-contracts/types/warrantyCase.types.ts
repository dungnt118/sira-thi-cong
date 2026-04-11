import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * WarrantyCase interface
 * Auto-generated from Schema: WarrantyCase
 */
export interface IWarrantyCase {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: WarrantyCaseJourneyStepCodeEnum;
  warranty_card_id?: string;
  idx_warranty_card_id?: IndexedContentItem;
  source_handover_issue_id?: string;
  idx_source_handover_issue_id?: IndexedContentItem;
  reported_at?: string | Date;
  issue_title?: string;
  severity?: WarrantyCaseSeverityEnum;
  status?: WarrantyCaseStatusEnum;
  assigned_user?: any;
  latest_visit_id?: string;
  idx_latest_visit_id?: IndexedContentItem;
  resolved_at?: string | Date;
  issue_detail?: string;
  resolution_note?: string;
  evidence_files?: HeadlessFileUpload[];
  //deprecated fields
  // project_id?: string;
  // idx_project_id?: IndexedContentItem;
}

export interface ICreateWarrantyCaseInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: WarrantyCaseJourneyStepCodeEnum2;
  warranty_card_id?: string;
  source_handover_issue_id?: string;
  reported_at?: string | Date;
  issue_title?: string;
  severity?: WarrantyCaseSeverityEnum2;
  status?: WarrantyCaseStatusEnum2;
  assigned_user?: any;
  latest_visit_id?: string;
  resolved_at?: string | Date;
  issue_detail?: string;
  resolution_note?: string;
  evidence_files?: HeadlessFileUpload[];
  //deprecated fields
  // project_id?: string;
}

export type IWarrantyCaseListResponse = ApiListResponse<IWarrantyCase>

// Union types generated from value_options
export type WarrantyCaseJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type WarrantyCaseSeverityEnum = 'low' | 'medium' | 'high' | 'critical';
export type WarrantyCaseStatusEnum = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type WarrantyCaseJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type WarrantyCaseSeverityEnum2 = 'low' | 'medium' | 'high' | 'critical';
export type WarrantyCaseStatusEnum2 = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
