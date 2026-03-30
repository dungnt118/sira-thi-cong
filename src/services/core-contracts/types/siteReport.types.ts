import type { IndexedContentItem } from 'types/apis';
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
  journey_step_code?: SiteReportJourneyStepCodeEnum;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  report_date?: string | Date;
  supervisor_user?: any;
  title?: string;
  content?: string;
  progress_pct?: number;
  images?: HeadlessFileUpload[];
  weather_note?: string;
  issue_summary?: string;
  next_action?: string;
}

export interface ICreateSiteReportInput {
  journey_id?: string;
  journey_step_code?: SiteReportJourneyStepCodeEnum2;
  project_id?: string;
  report_date?: string | Date;
  supervisor_user?: any;
  title?: string;
  content?: string;
  progress_pct?: number;
  images?: HeadlessFileUpload[];
  weather_note?: string;
  issue_summary?: string;
  next_action?: string;
}

export type ISiteReportListResponse = ApiListResponse<ISiteReport>

// Union types generated from value_options
export type SiteReportJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type SiteReportJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
