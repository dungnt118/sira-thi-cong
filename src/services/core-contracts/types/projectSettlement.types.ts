import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ProjectSettlement interface
 * Auto-generated from Schema: ProjectSettlement
 */
export interface IProjectSettlement {
  _id: string;
  code?: string;
  settlement_date?: string | Date;
  status?: ProjectSettlementStatusEnum;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: ProjectSettlementJourneyStepCodeEnum;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  customer_id?: string;
  idx_customer_id?: IndexedContentItem;
  handover_acceptance_id?: string;
  idx_handover_acceptance_id?: IndexedContentItem;
  latest_debt_confirmation_id?: string;
  idx_latest_debt_confirmation_id?: IndexedContentItem;
  latest_invoice_id?: string;
  idx_latest_invoice_id?: IndexedContentItem;
  contract_value?: number;
  approved_appendix_total?: number;
  invoiced_total?: number;
  received_total?: number;
  adjustment_total?: number;
  settlement_value?: number;
  outstanding_amount?: number;
  decision_note?: string;
  discrepancy_note?: string;
  evidence_files?: HeadlessFileUpload[];
  contract_id?: string;
  idx_contract_id?: IndexedContentItem;
}

export interface ICreateProjectSettlementInput {
  code?: string;
  settlement_date?: string | Date;
  status?: ProjectSettlementStatusEnum2;
  journey_id?: string;
  journey_step_code?: ProjectSettlementJourneyStepCodeEnum2;
  project_id?: string;
  customer_id?: string;
  handover_acceptance_id?: string;
  latest_debt_confirmation_id?: string;
  latest_invoice_id?: string;
  contract_value?: number;
  approved_appendix_total?: number;
  invoiced_total?: number;
  received_total?: number;
  adjustment_total?: number;
  settlement_value?: number;
  outstanding_amount?: number;
  decision_note?: string;
  discrepancy_note?: string;
  evidence_files?: HeadlessFileUpload[];
  contract_id?: string;
}

export type IProjectSettlementListResponse = ApiListResponse<IProjectSettlement>

// Union types generated from value_options
export type ProjectSettlementStatusEnum = 'draft' | 'pending_review' | 'confirmed' | 'disputed' | 'closed';
export type ProjectSettlementJourneyStepCodeEnum = 'handover_acceptance' | 'warranty_aftercare' | 'contract_signing';
export type ProjectSettlementStatusEnum2 = 'draft' | 'pending_review' | 'confirmed' | 'disputed' | 'closed';
export type ProjectSettlementJourneyStepCodeEnum2 = 'handover_acceptance' | 'warranty_aftercare' | 'contract_signing';
