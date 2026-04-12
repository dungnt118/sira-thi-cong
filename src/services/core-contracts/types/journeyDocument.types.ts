import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * JourneyDocument interface
 * Auto-generated from Schema: JourneyDocument
 */
export interface IJourneyDocument {
  _id: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: JourneyDocumentJourneyStepCodeEnum;
  worktaskId?: string;
  idx_worktaskId?: IndexedContentItem;
  description?: string;
  files?: HeadlessFileUpload[];
  published_at?: string | Date;
  is_published?: boolean;
  createdAt?: string | Date;
  createdBy?: any;
  title?: string;
  doc_type?: JourneyDocumentDocTypeEnum;
}

export interface ICreateJourneyDocumentInput {
  journey_id?: string;
  journey_step_code?: JourneyDocumentJourneyStepCodeEnum2;
  worktaskId?: string;
  description?: string;
  files?: HeadlessFileUpload[];
  published_at?: string | Date;
  is_published?: boolean;
  createdAt?: string | Date;
  createdBy?: any;
  title?: string;
  doc_type?: JourneyDocumentDocTypeEnum2;
}

export type IJourneyDocumentListResponse = ApiListResponse<IJourneyDocument>

// Union types generated from value_options
export type JourneyDocumentJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type JourneyDocumentDocTypeEnum = 'survey_report' | 'site_photos' | 'solution_doc' | 'business_plan' | 'quotation' | 'contract' | 'advance_request' | 'stage_acceptance' | 'stage_payment_proof' | 'final_acceptance' | 'payment_receipt' | 'maintenance_record' | 'warranty_record' | 'after_sales_note';
export type JourneyDocumentJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type JourneyDocumentDocTypeEnum2 = 'survey_report' | 'site_photos' | 'solution_doc' | 'business_plan' | 'quotation' | 'contract' | 'advance_request' | 'stage_acceptance' | 'stage_payment_proof' | 'final_acceptance' | 'payment_receipt' | 'maintenance_record' | 'warranty_record' | 'after_sales_note';
