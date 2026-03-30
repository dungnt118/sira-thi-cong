import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * DebtConfirmation interface
 * Auto-generated from Schema: DebtConfirmation
 */
export interface IDebtConfirmation {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: DebtConfirmationJourneyStepCodeEnum;
  payment_milestone_id?: string;
  idx_payment_milestone_id?: IndexedContentItem;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  customer_id?: string;
  idx_customer_id?: IndexedContentItem;
  confirmation_date?: string | Date;
  status?: DebtConfirmationStatusEnum;
  debt_amount?: number;
  amount_confirmed_by_customer?: number;
  difference_amount?: number;
  confirmed_by_customer_name?: string;
  confirmed_by_company?: any;
  confirmed_at?: string | Date;
  payment_commitment_date?: string | Date;
  reason?: string;
  evidence_files?: HeadlessFileUpload[];
  contract_id?: string;
  idx_contract_id?: IndexedContentItem;
}

export interface ICreateDebtConfirmationInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: DebtConfirmationJourneyStepCodeEnum2;
  payment_milestone_id?: string;
  project_id?: string;
  customer_id?: string;
  confirmation_date?: string | Date;
  status?: DebtConfirmationStatusEnum2;
  debt_amount?: number;
  amount_confirmed_by_customer?: number;
  difference_amount?: number;
  confirmed_by_customer_name?: string;
  confirmed_by_company?: any;
  confirmed_at?: string | Date;
  payment_commitment_date?: string | Date;
  reason?: string;
  evidence_files?: HeadlessFileUpload[];
  contract_id?: string;
}

export type IDebtConfirmationListResponse = ApiListResponse<IDebtConfirmation>

// Union types generated from value_options
export type DebtConfirmationJourneyStepCodeEnum = 'contract_signing' | 'handover_acceptance' | 'warranty_aftercare';
export type DebtConfirmationStatusEnum = 'draft' | 'sent' | 'confirmed' | 'disputed' | 'closed';
export type DebtConfirmationJourneyStepCodeEnum2 = 'contract_signing' | 'handover_acceptance' | 'warranty_aftercare';
export type DebtConfirmationStatusEnum2 = 'draft' | 'sent' | 'confirmed' | 'disputed' | 'closed';
