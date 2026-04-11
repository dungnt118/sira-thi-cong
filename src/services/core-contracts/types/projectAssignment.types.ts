import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ProjectAssignment interface
 * Auto-generated from Schema: ProjectAssignment
 */
export interface IProjectAssignment {
  _id: string;
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
  //deprecated fields
  // project_id?: string;
  // idx_project_id?: IndexedContentItem;
}

export interface ICreateProjectAssignmentInput {
  journey_id?: string;
  journey_step_code?: ProjectAssignmentJourneyStepCodeEnum2;
  role_id?: string;
  employee_id?: string;
  assignment_type?: ProjectAssignmentAssignmentTypeEnum2;
  is_primary?: boolean;
  note?: string;
  //deprecated fields
  // project_id?: string;
}

export type IProjectAssignmentListResponse = ApiListResponse<IProjectAssignment>

// Union types generated from value_options
export type ProjectAssignmentJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type ProjectAssignmentAssignmentTypeEnum = 'pm' | 'supervisor' | 'accountant' | 'sale' | 'other';
export type ProjectAssignmentJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type ProjectAssignmentAssignmentTypeEnum2 = 'pm' | 'supervisor' | 'accountant' | 'sale' | 'other';
