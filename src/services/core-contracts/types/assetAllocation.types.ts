import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AssetAllocation interface
 * Auto-generated from Schema: AssetAllocation
 */
export interface IAssetAllocation {
  _id: string;
  code?: string;
  asset_id?: string;
  idx_asset_id?: IndexedContentItem;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: AssetAllocationJourneyStepCodeEnum;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  requested_by?: any;
  request_date?: string | Date;
  expected_return_date?: string | Date;
  actual_return_date?: string | Date;
  status?: AssetAllocationStatusEnum;
  notes?: string;
  requested_by_id?: string;
  signatures?: ISignaturesItem[];
  project_name?: string;
  history?: IHistoryItem[];
  asset_name?: string;
  asset_code?: string;
  journey_name?: string;
}

export interface ISignaturesItem {
  role?: SignaturesRoleEnum;
  user_name?: string;
  user_id?: string;
  signed_at?: string | Date;
  signature_data_url?: string;
}

export interface IHistoryItem {
  status?: string;
  updated_by?: string;
  updated_at?: string | Date;
  comment?: string;
}

export interface ICreateAssetAllocationInput {
  code?: string;
  asset_id?: string;
  journey_id?: string;
  journey_step_code?: AssetAllocationJourneyStepCodeEnum2;
  project_id?: string;
  requested_by?: any;
  request_date?: string | Date;
  expected_return_date?: string | Date;
  actual_return_date?: string | Date;
  status?: AssetAllocationStatusEnum2;
  notes?: string;
  requested_by_id?: string;
  signatures?: ISignaturesItem[];
  project_name?: string;
  history?: IHistoryItem[];
  asset_name?: string;
  asset_code?: string;
  journey_name?: string;
}

export type IAssetAllocationListResponse = ApiListResponse<IAssetAllocation>

// Union types generated from value_options
export type AssetAllocationJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type AssetAllocationStatusEnum = 'requested' | 'approved' | 'received' | 'completed' | 'rejected' | 'returned';
export type SignaturesRoleEnum = 'accountant' | 'borrower';
export type AssetAllocationJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type AssetAllocationStatusEnum2 = 'requested' | 'approved' | 'received' | 'completed' | 'rejected' | 'returned';
