import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * IncidentReport interface
 * Auto-generated from Schema: IncidentReport
 */
export interface IIncidentReport {
  _id: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: IncidentReportJourneyStepCodeEnum;
  type?: IncidentReportTypeEnum;
  description?: string;
  severity?: IncidentReportSeverityEnum;
  reported_by?: any;
  images?: HeadlessFileUpload[];
  pm_reply?: string;
  is_resolved?: boolean;
  resolved_at?: string | Date;
  title?: string;
  priority?: IncidentReportPriorityEnum;
  status?: IncidentReportStatusEnum;
  assigned_to?: string;
  //deprecated fields
  // project_id?: string;
  // idx_project_id?: IndexedContentItem;
}

export interface ICreateIncidentReportInput {
  journey_id?: string;
  journey_step_code?: IncidentReportJourneyStepCodeEnum2;
  type?: IncidentReportTypeEnum2;
  description?: string;
  severity?: IncidentReportSeverityEnum2;
  reported_by?: any;
  images?: HeadlessFileUpload[];
  pm_reply?: string;
  is_resolved?: boolean;
  resolved_at?: string | Date;
  title?: string;
  priority?: IncidentReportPriorityEnum2;
  status?: IncidentReportStatusEnum2;
  assigned_to?: string;
  //deprecated fields
  // project_id?: string;
}

export type IIncidentReportListResponse = ApiListResponse<IIncidentReport>

// Union types generated from value_options
export type IncidentReportJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type IncidentReportTypeEnum = 'material_shortage' | 'technical' | 'weather' | 'equipment' | 'safety' | 'warranty' | 'maintain' | 'other';
export type IncidentReportSeverityEnum = 'normal' | 'urgent';
export type IncidentReportPriorityEnum = 'low' | 'medium' | 'high' | 'critical';
export type IncidentReportStatusEnum = 'open' | 'investigating' | 'resolved';
export type IncidentReportJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type IncidentReportTypeEnum2 = 'material_shortage' | 'technical' | 'weather' | 'equipment' | 'safety' | 'warranty' | 'maintain' | 'other';
export type IncidentReportSeverityEnum2 = 'normal' | 'urgent';
export type IncidentReportPriorityEnum2 = 'low' | 'medium' | 'high' | 'critical';
export type IncidentReportStatusEnum2 = 'open' | 'investigating' | 'resolved';
