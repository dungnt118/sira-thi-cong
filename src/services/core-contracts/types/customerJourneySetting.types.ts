import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';
import type { IActionsItem } from './workTask.types';

/** Đồng bộ contract với WorkTask — tránh trùng export trong barrel `types/index`. */
export type {
    IActionsItem,
    ActionsActionKeyEnum,
    ActionsActionTypeEnum,
    ActionsTargetFieldEnum,
    ActionsDocTypeEnum,
} from './workTask.types';

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
