import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
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
  requested_by?: any;
  request_date?: string | Date;
  expected_return_date?: string | Date;
  actual_return_date?: string | Date;
  status?: AssetAllocationStatusEnum;
  notes?: string;
  signature_image?: ISignatureImageItem[];
  asset_name?: string;
  asset_code?: string;
  journey_name?: string;
}

export interface ISignatureImageItem {
  role?: SignatureImageRoleEnum;
  user_name?: string;
  user_id?: string;
  signed_at?: string | Date;
  signature_data_url?: string;
}

export interface ICreateAssetAllocationInput {
  code?: string;
  asset_id?: string;
  journey_id?: string;
  journey_step_code?: AssetAllocationJourneyStepCodeEnum2;
  requested_by?: any;
  request_date?: string | Date;
  expected_return_date?: string | Date;
  actual_return_date?: string | Date;
  status?: AssetAllocationStatusEnum2;
  notes?: string;
  signature_image?: ISignatureImageItem[];
  asset_name?: string;
  asset_code?: string;
  journey_name?: string;
}

export type IAssetAllocationListResponse = ApiListResponse<IAssetAllocation>

// Union types generated from value_options
export type AssetAllocationJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type AssetAllocationStatusEnum = 'requested' | 'approved' | 'received' | 'completed' | 'rejected' | 'returned';
export type SignatureImageRoleEnum = 'accountant' | 'borrower';
export type AssetAllocationJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type AssetAllocationStatusEnum2 = 'requested' | 'approved' | 'received' | 'completed' | 'rejected' | 'returned';
