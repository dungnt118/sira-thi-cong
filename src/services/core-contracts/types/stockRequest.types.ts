import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * StockRequest interface
 * Auto-generated from Schema: StockRequest
 */
export interface IStockRequest {
  _id: string;
  code?: string;
  type?: StockRequestTypeEnum;
  requested_by?: any;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: StockRequestJourneyStepCodeEnum;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  project_name?: string;
  items?: IItemsItem[];
  reason?: string;
  status?: StockRequestStatusEnum;
  reviewed_by?: any;
  reviewed_at?: string | Date;
  review_note?: string;
  converted_order_id?: string;
  idx_converted_order_id?: IndexedContentItem;
  created_at?: string | Date;
  journey_name?: string;
}

export interface IItemsItem {
  material_id?: string;
  idx_material_id?: IndexedContentItem;
  material_name?: string;
  unit?: ItemsUnitEnum;
  requested?: number;
  note?: string;
}

export interface ICreateStockRequestInput {
  code?: string;
  type?: StockRequestTypeEnum2;
  requested_by?: any;
  journey_id?: string;
  journey_step_code?: StockRequestJourneyStepCodeEnum2;
  project_id?: string;
  project_name?: string;
  items?: IItemsItem[];
  reason?: string;
  status?: StockRequestStatusEnum2;
  reviewed_by?: any;
  reviewed_at?: string | Date;
  review_note?: string;
  converted_order_id?: string;
  created_at?: string | Date;
  journey_name?: string;
}

export type IStockRequestListResponse = ApiListResponse<IStockRequest>

// Union types generated from value_options
export type StockRequestTypeEnum = 'request_out' | 'request_in';
export type StockRequestJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type StockRequestStatusEnum = 'pending' | 'approved' | 'rejected' | 'converted';
export type ItemsUnitEnum = 'kg' | 'lit' | 'm2' | 'thung' | 'cuon' | 'cai';
export type StockRequestTypeEnum2 = 'request_out' | 'request_in';
export type StockRequestJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type StockRequestStatusEnum2 = 'pending' | 'approved' | 'rejected' | 'converted';
