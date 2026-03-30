import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PortalDocument interface
 * Auto-generated from Schema: PortalDocument
 */
export interface IPortalDocument {
  _id: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: PortalDocumentJourneyStepCodeEnum;
  journey_code?: string;
  context_type?: PortalDocumentContextTypeEnum;
  published_context?: string;
  file_name?: string;
  file_type?: PortalDocumentFileTypeEnum;
  files?: HeadlessFileUpload[];
  thumbnail_url?: string;
  published_at?: string | Date;
  sort_order?: number;
  is_visible?: boolean;
}

export interface ICreatePortalDocumentInput {
  journey_id?: string;
  journey_step_code?: PortalDocumentJourneyStepCodeEnum2;
  journey_code?: string;
  context_type?: PortalDocumentContextTypeEnum2;
  published_context?: string;
  file_name?: string;
  file_type?: PortalDocumentFileTypeEnum2;
  files?: HeadlessFileUpload[];
  thumbnail_url?: string;
  published_at?: string | Date;
  sort_order?: number;
  is_visible?: boolean;
}

export type IPortalDocumentListResponse = ApiListResponse<IPortalDocument>

// Union types generated from value_options
export type PortalDocumentJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type PortalDocumentContextTypeEnum = 'survey' | 'quotation' | 'contract' | 'progress' | 'payment' | 'general';
export type PortalDocumentFileTypeEnum = 'pdf' | 'doc' | 'image' | 'other';
export type PortalDocumentJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type PortalDocumentContextTypeEnum2 = 'survey' | 'quotation' | 'contract' | 'progress' | 'payment' | 'general';
export type PortalDocumentFileTypeEnum2 = 'pdf' | 'doc' | 'image' | 'other';
