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
  steps?: IStepsItem[];
}

export interface IRolesItem {
  role?: RolesRoleEnum | string;
  idx_role?: IndexedContentItem;
  permissions?: string[];
}

export interface IChecklistItem {
  name?: string;
  is_required?: boolean;
  role?: RolesRoleEnum | string;
  description?: string;
  action?: ChecklistActionEnum;
  actions?: IActionsItem[];
}

export interface IActionsItem {
  action_key?: ActionsActionKeyEnum;
  action_type?: ActionsActionTypeEnum;
  target_field?: ActionsTargetFieldEnum;
  expected_value?: string;
  doc_type?: ActionsDocTypeEnum;
  min_count?: number;
  note?: string;
}

export interface IStepsItem {
  step_code?: StepsStepCodeEnum;
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

// Deprecated Item Interfaces kept for potential logic dependencies but consolidated to use shared sub-interfaces
export interface ILeadIntakeItem extends IStepsItem {}
export interface IQualificationItem extends IStepsItem {}
export interface ISurveyPlanningItem extends IStepsItem {}
export interface ISiteSurveyItem extends IStepsItem {}
export interface ISurveyReviewItem extends IStepsItem {}
export interface IEstimatePreparationItem extends IStepsItem {}
export interface IQuotationPreparationItem extends IStepsItem {}
export interface IQuotationSentItem extends IStepsItem {}
export interface IQuotationApprovedItem extends IStepsItem {}
export interface IContractSigningItem extends IStepsItem {}
export interface IProjectExecutionItem extends IStepsItem {}
export interface IHandoverAcceptanceItem extends IStepsItem {}
export interface IWarrantyAftercareItem extends IStepsItem {}

export interface ICreateCustomerJourneySettingInput {
  setting_key?: string;
  setting_name?: string;
  is_active?: boolean;
  version_label?: string;
  note?: string;
  steps?: IStepsItem[];
}

export type ICustomerJourneySettingListResponse = ApiListResponse<ICustomerJourneySetting>

// Union types generated from value_options
export type ChecklistActionEnum = 'submit_qualification';
export type StepsStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type RolesRoleEnum = 'QL' | 'GS' | 'KYT' | 'KT' | 'HC' | 'KD' | 'ADMIN';
export type ChecklistRoleEnum = 'QL' | 'GS' | 'KYT' | 'KT' | 'HC' | 'KD' | 'ADMIN';
export type ActionsActionKeyEnum = 'fill_site_address' | 'assign_owner_user' | 'upload_survey_report' | 'upload_site_photos' | 'upload_solution_doc' | 'upload_business_plan' | 'upload_customer_quotation' | 'upload_contract' | 'confirm_quote_approved' | 'confirm_final_acceptance' | 'upload_payment_receipt' | 'link_origin_journey';
export type ActionsActionTypeEnum = 'require_journey_field' | 'require_document' | 'require_status_equals';
export type ActionsTargetFieldEnum = 'request_title' | 'customer_id' | 'owner_user' | 'site_address' | 'serviceTypeId' | 'go_no_go_status' | 'survey_status' | 'quote_status' | 'project_status' | 'portal_publish_status' | 'journey_kind' | 'origin_journey_id';
export type ActionsDocTypeEnum = 'survey_report' | 'site_photos' | 'solution_doc' | 'business_plan' | 'quotation' | 'contract' | 'advance_request' | 'stage_acceptance' | 'stage_payment_proof' | 'final_acceptance' | 'payment_receipt' | 'maintenance_record' | 'warranty_record' | 'after_sales_note';
