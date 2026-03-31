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
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  handover_date?: string | Date;
  acceptance_status?: HandoverAcceptanceAcceptanceStatusEnum;
  accepted_by_customer?: string;
  company_representative?: any;
  acceptance_note?: string;
  issue_note?: string;
  evidence_files?: HeadlessFileUpload[];
  signature_customer?: string;
  signature_company?: string;
  contract_id?: string;
  idx_contract_id?: IndexedContentItem;
}

export interface ICreateHandoverAcceptanceInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: HandoverAcceptanceJourneyStepCodeEnum2;
  project_id?: string;
  handover_date?: string | Date;
  acceptance_status?: HandoverAcceptanceAcceptanceStatusEnum2;
  accepted_by_customer?: string;
  company_representative?: any;
  acceptance_note?: string;
  issue_note?: string;
  evidence_files?: HeadlessFileUpload[];
  signature_customer?: string;
  signature_company?: string;
  contract_id?: string;
}

export type IHandoverAcceptanceListResponse = ApiListResponse<IHandoverAcceptance>

// Union types generated from value_options
export type HandoverAcceptanceJourneyStepCodeEnum = 'handover_acceptance' | 'project_execution' | 'warranty_aftercare';
export type HandoverAcceptanceAcceptanceStatusEnum = 'draft' | 'partially_accepted' | 'accepted' | 'rework_required';
export type HandoverAcceptanceJourneyStepCodeEnum2 = 'handover_acceptance' | 'project_execution' | 'warranty_aftercare';
export type HandoverAcceptanceAcceptanceStatusEnum2 = 'draft' | 'partially_accepted' | 'accepted' | 'rework_required';
