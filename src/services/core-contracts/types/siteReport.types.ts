import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * SiteReport interface
 * Auto-generated from Schema: SiteReport
 */
export interface ISiteReport {
  _id: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  worktaskId?: string;
  idx_worktaskId?: IndexedContentItem;
  journey_step_code?: SiteReportJourneyStepCodeEnum;
  title?: string;
  content?: string;
  progress_pct?: number;
  medias?: HeadlessFileUpload[];
  issue_summary?: string;
  next_action?: string;
  createdAt?: string | Date;
  createdBy?: any;
}

export interface ICreateSiteReportInput {
  journey_id?: string;
  worktaskId?: string;
  journey_step_code?: SiteReportJourneyStepCodeEnum2;
  title?: string;
  content?: string;
  progress_pct?: number;
  medias?: HeadlessFileUpload[];
  issue_summary?: string;
  next_action?: string;
  createdAt?: string | Date;
  createdBy?: any;
}

export type ISiteReportListResponse = ApiListResponse<ISiteReport>

// Union types generated from value_options
export type SiteReportJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type SiteReportJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
