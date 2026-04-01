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
  context_type?: JourneyDocumentContextTypeEnum;
  description?: string;
  files?: HeadlessFileUpload[];
  published_at?: string | Date;
  is_published?: boolean;
  createdAt?: string | Date;
  createdBy?: any;
}

export interface ICreateJourneyDocumentInput {
  journey_id?: string;
  journey_step_code?: JourneyDocumentJourneyStepCodeEnum2;
  context_type?: JourneyDocumentContextTypeEnum2;
  description?: string;
  files?: HeadlessFileUpload[];
  published_at?: string | Date;
  is_published?: boolean;
  createdAt?: string | Date;
  createdBy?: any;
}

export type IJourneyDocumentListResponse = ApiListResponse<IJourneyDocument>

// Union types generated from value_options
export type JourneyDocumentJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type JourneyDocumentContextTypeEnum = 'survey' | 'quotation' | 'contract' | 'progress' | 'payment' | 'general';
export type JourneyDocumentJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type JourneyDocumentContextTypeEnum2 = 'survey' | 'quotation' | 'contract' | 'progress' | 'payment' | 'general';
