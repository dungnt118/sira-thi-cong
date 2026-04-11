import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * HandoverAcceptance interface
 * Auto-generated from Schema: HandoverAcceptance
 */
export interface IHandoverAcceptance {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: HandoverAcceptanceJourneyStepCodeEnum;
  handover_date?: string | Date;
  acceptance_status?: HandoverAcceptanceAcceptanceStatusEnum;
  accepted_by_customer?: string;
  company_representative?: any;
  acceptance_note?: string;
  issue_note?: string;
  evidence_files?: HeadlessFileUpload[];
  signature_customer?: string;
  signature_company?: string;
  //deprecated fields
  // project_id?: string;
  // idx_project_id?: IndexedContentItem;
  // contract_id?: string;
  // idx_contract_id?: IndexedContentItem;
}

export interface ICreateHandoverAcceptanceInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: HandoverAcceptanceJourneyStepCodeEnum2;
  handover_date?: string | Date;
  acceptance_status?: HandoverAcceptanceAcceptanceStatusEnum2;
  accepted_by_customer?: string;
  company_representative?: any;
  acceptance_note?: string;
  issue_note?: string;
  evidence_files?: HeadlessFileUpload[];
  signature_customer?: string;
  signature_company?: string;
  //deprecated fields
  // project_id?: string;
  // contract_id?: string;
}

export type IHandoverAcceptanceListResponse = ApiListResponse<IHandoverAcceptance>

// Union types generated from value_options
export type HandoverAcceptanceJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type HandoverAcceptanceAcceptanceStatusEnum = 'draft' | 'partially_accepted' | 'accepted' | 'rework_required';
export type HandoverAcceptanceJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type HandoverAcceptanceAcceptanceStatusEnum2 = 'draft' | 'partially_accepted' | 'accepted' | 'rework_required';
