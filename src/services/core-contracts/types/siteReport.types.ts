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
export type SiteReportJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type SiteReportJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
