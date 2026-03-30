import type { IndexedContentItem } from 'types/apis';
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
  steps?: IStepsItem[];
}

export interface ILeadIntakeItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IQualificationItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface ISurveyPlanningItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface ISiteSurveyItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface ISurveyReviewItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IEstimatePreparationItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IQuotationPreparationItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IQuotationSentItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IQuotationApprovedItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IContractSigningItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IProjectExecutionItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IHandoverAcceptanceItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IWarrantyAftercareItem {
  step_code?: string;
  step_name?: string;
  step_order?: number;
  is_enabled?: boolean;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  sla_hours?: number;
  entry_status?: string;
  done_status?: string;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  from_role_id?: string;
  idx_from_role_id?: IndexedContentItem;
  to_role_id?: string;
  idx_to_role_id?: IndexedContentItem;
  handoff_required?: boolean;
  goal?: string;
  instruction_note?: string;
  entry_criteria?: string;
  exit_criteria?: string;
}

export interface IStepsItem {
  step_code?: StepsStepCodeEnum;
  step_name?: string;
  order?: number;
  is_enabled?: boolean;
  owner_role_id?: string;
  idx_owner_role_id?: IndexedContentItem;
  checklist_template_id?: string;
  idx_checklist_template_id?: IndexedContentItem;
  sla_hours?: number;
  portal_visible?: boolean;
  allow_skip?: boolean;
  auto_open_next?: boolean;
  entry_status?: StepsEntryStatusEnum;
  done_status?: StepsDoneStatusEnum;
  goal?: string;
  instruction_note?: string;
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
  steps?: IStepsItem[];
}

export type ICustomerJourneySettingListResponse = ApiListResponse<ICustomerJourneySetting>

// Union types generated from value_options
export type StepsStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type StepsEntryStatusEnum = 'not_started' | 'ready' | 'blocked';
export type StepsDoneStatusEnum = 'completed' | 'approved' | 'signed' | 'published';
