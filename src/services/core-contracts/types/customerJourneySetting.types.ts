import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * CustomerJourneySetting interface
 * Auto-generated from Schema: CustomerJourneySetting
 */
export interface ICustomerJourneySetting {
  _id: string;
  setting_key?: string;
  setting_name?: string;
  is_active?: boolean;
  version_label?: string;
  note?: string;
  lead_intake?: ILeadIntakeItem[];
  qualification?: IQualificationItem[];
  survey_planning?: ISurveyPlanningItem[];
  site_survey?: ISiteSurveyItem[];
  survey_review?: ISurveyReviewItem[];
  estimate_preparation?: IEstimatePreparationItem[];
  quotation_preparation?: IQuotationPreparationItem[];
  quotation_sent?: IQuotationSentItem[];
  quotation_approved?: IQuotationApprovedItem[];
  contract_signing?: IContractSigningItem[];
  project_execution?: IProjectExecutionItem[];
  handover_acceptance?: IHandoverAcceptanceItem[];
  warranty_aftercare?: IWarrantyAftercareItem[];
}

export interface ILeadIntakeItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface IQualificationItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface ISurveyPlanningItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface ISiteSurveyItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface ISurveyReviewItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface IEstimatePreparationItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface IQuotationPreparationItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface IQuotationSentItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface IQuotationApprovedItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface IContractSigningItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface IProjectExecutionItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface IHandoverAcceptanceItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  role_copy?: string;
  idx_role_copy?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface IWarrantyAftercareItem {
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  roles?: IRolesItem[];
  checklist?: IChecklistItem[];
}

export interface IRolesItem {
  role?: string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  description?: string;
}

export interface ICreateCustomerJourneySettingInput {
  setting_key?: string;
  setting_name?: string;
  is_active?: boolean;
  version_label?: string;
  note?: string;
  lead_intake?: ILeadIntakeItem[];
  qualification?: IQualificationItem[];
  survey_planning?: ISurveyPlanningItem[];
  site_survey?: ISiteSurveyItem[];
  survey_review?: ISurveyReviewItem[];
  estimate_preparation?: IEstimatePreparationItem[];
  quotation_preparation?: IQuotationPreparationItem[];
  quotation_sent?: IQuotationSentItem[];
  quotation_approved?: IQuotationApprovedItem[];
  contract_signing?: IContractSigningItem[];
  project_execution?: IProjectExecutionItem[];
  handover_acceptance?: IHandoverAcceptanceItem[];
  warranty_aftercare?: IWarrantyAftercareItem[];
}

export type ICustomerJourneySettingListResponse = ApiListResponse<ICustomerJourneySetting>
