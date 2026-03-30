import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ProjectAssignment interface
 * Auto-generated from Schema: ProjectAssignment
 */
export interface IProjectAssignment {
  _id: string;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: ProjectAssignmentJourneyStepCodeEnum;
  role_id?: string;
  idx_role_id?: IndexedContentItem;
  employee_id?: string;
  idx_employee_id?: IndexedContentItem;
  assignment_type?: ProjectAssignmentAssignmentTypeEnum;
  is_primary?: boolean;
  note?: string;
}

export interface ICreateProjectAssignmentInput {
  project_id?: string;
  journey_id?: string;
  journey_step_code?: ProjectAssignmentJourneyStepCodeEnum2;
  role_id?: string;
  employee_id?: string;
  assignment_type?: ProjectAssignmentAssignmentTypeEnum2;
  is_primary?: boolean;
  note?: string;
}

export type IProjectAssignmentListResponse = ApiListResponse<IProjectAssignment>

// Union types generated from value_options
export type ProjectAssignmentJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type ProjectAssignmentAssignmentTypeEnum = 'pm' | 'supervisor' | 'accountant' | 'sale' | 'other';
export type ProjectAssignmentJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type ProjectAssignmentAssignmentTypeEnum2 = 'pm' | 'supervisor' | 'accountant' | 'sale' | 'other';
