import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ProjectCloseoutPackage interface
 * Auto-generated from Schema: ProjectCloseoutPackage
 */
export interface IProjectCloseoutPackage {
  _id: string;
  code?: string;
  closeout_date?: string | Date;
  status?: ProjectCloseoutPackageStatusEnum;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: ProjectCloseoutPackageJourneyStepCodeEnum;
  project_settlement_id?: string;
  idx_project_settlement_id?: IndexedContentItem;
  customer_id?: string;
  idx_customer_id?: IndexedContentItem;
  portal_thread_id?: string;
  idx_portal_thread_id?: IndexedContentItem;
  published_at?: string | Date;
  customer_confirmed_at?: string | Date;
  closed_at?: string | Date;
  published_document_ids?: HeadlessReferenceContent[];
  idx_published_document_ids?: IndexedContentItem;
  summary?: string;
  closing_note?: string;
  reopen_reason?: string;
  //deprecated fields
  // project_id?: string;
  // idx_project_id?: IndexedContentItem;
  // contract_id?: string;
  // idx_contract_id?: IndexedContentItem;
}

export interface ICreateProjectCloseoutPackageInput {
  code?: string;
  closeout_date?: string | Date;
  status?: ProjectCloseoutPackageStatusEnum2;
  journey_id?: string;
  journey_step_code?: ProjectCloseoutPackageJourneyStepCodeEnum2;
  project_settlement_id?: string;
  customer_id?: string;
  portal_thread_id?: string;
  published_at?: string | Date;
  customer_confirmed_at?: string | Date;
  closed_at?: string | Date;
  published_document_ids?: HeadlessReferenceContent[];
  summary?: string;
  closing_note?: string;
  reopen_reason?: string;
  //deprecated fields
  // project_id?: string;
  // contract_id?: string;
}

export type IProjectCloseoutPackageListResponse = ApiListResponse<IProjectCloseoutPackage>

// Union types generated from value_options
export type ProjectCloseoutPackageStatusEnum = 'draft' | 'published' | 'customer_confirmed' | 'reopened' | 'closed';
export type ProjectCloseoutPackageJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type ProjectCloseoutPackageStatusEnum2 = 'draft' | 'published' | 'customer_confirmed' | 'reopened' | 'closed';
export type ProjectCloseoutPackageJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
