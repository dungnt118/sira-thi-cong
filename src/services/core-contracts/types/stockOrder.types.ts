import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * StockOrder interface
 * Auto-generated from Schema: StockOrder
 */
export interface IStockOrder {
  _id: string;
  code?: string;
  type?: StockOrderTypeEnum;
  status?: StockOrderStatusEnum;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: StockOrderJourneyStepCodeEnum;
  source?: StockOrderSourceEnum;
  supplier?: string;
  total_value?: number;
  notes?: string;
  created_at?: string | Date;
  created_by?: any;
  journey_code?: string;
  signed_by?: any;
  discrepancy_status?: StockOrderDiscrepancyStatusEnum;
  pdf_url?: string;
  signed_at?: string | Date;

  items?: IItemsItem[];
  journey_source_id?: string;
  idx_journey_source_id?: IndexedContentItem;
  distributor_source_id?: string;
  idx_distributor_source_id?: IndexedContentItem;
  journey_name?: string;
  requested_by?: any;
  reviewed_by?: any;
  reviewed_at?: string | Date;
  review_note?: string;
  request_reason?: string;
  signature_image?: string;
}

export interface IItemsItem {
  material_id?: string;
  idx_material_id?: IndexedContentItem;
  material_name?: string;
  unit?: ItemsUnitEnum;
  quantity?: number;
  requested_quantity?: number;
  issued_quantity?: number;
  received_quantity?: number;
  unit_cost?: number;
  is_partial?: boolean;
  remaining_percent?: number;
  discrepancy_note?: string;
}

export interface ICreateStockOrderInput {
  code?: string;
  type?: StockOrderTypeEnum2;
  status?: StockOrderStatusEnum2;
  journey_id?: string;
  journey_step_code?: StockOrderJourneyStepCodeEnum2;
  source?: StockOrderSourceEnum2;
  supplier?: string;
  total_value?: number;
  notes?: string;
  created_at?: string | Date;
  created_by?: any;
  journey_code?: string;
  signed_by?: any;
  discrepancy_status?: StockOrderDiscrepancyStatusEnum2;
  pdf_url?: string;
  signed_at?: string | Date;
  history?: IHistoryItem[];
  items?: IItemsItem[];
  journey_source_id?: string;
  distributor_source_id?: string;
  journey_name?: string;
  requested_by?: any;
  reviewed_by?: any;
  reviewed_at?: string | Date;
  review_note?: string;
  request_reason?: string;
  signature_image?: string;
}

export type IStockOrderListResponse = ApiListResponse<IStockOrder>

// Union types generated from value_options
export type StockOrderTypeEnum = 'out' | 'in';
export type StockOrderStatusEnum = 'draft' | 'requested' | 'approved' | 'dispatched' | 'received' | 'completed' | 'discrepancy' | 'cancelled';
export type StockOrderJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type StockOrderSourceEnum = 'distributor' | 'journey' | 'other';
export type StockOrderDiscrepancyStatusEnum = 'none' | 'pending_review' | 'confirmed' | 'resolved';
export type ItemsUnitEnum = 'kg' | 'lit' | 'm2' | 'thung' | 'cuon' | 'cai';
export type StockOrderTypeEnum2 = 'out' | 'in';
export type StockOrderStatusEnum2 = 'draft' | 'requested' | 'approved' | 'dispatched' | 'received' | 'completed' | 'discrepancy' | 'cancelled';
export type StockOrderJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type StockOrderSourceEnum2 = 'distributor' | 'journey' | 'other';
export type StockOrderDiscrepancyStatusEnum2 = 'none' | 'pending_review' | 'confirmed' | 'resolved';
