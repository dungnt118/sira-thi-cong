import type { IndexedContentItem } from 'types/apis';
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
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  created_at?: string | Date;
  created_by?: any;
  project_name?: string;
  journey_code?: string;
  source_id?: string;
  signed_by?: string;
  discrepancy_status?: StockOrderDiscrepancyStatusEnum;
  pdf_url?: string;
  request_id?: string;
  idx_request_id?: IndexedContentItem;
  signed_at?: string | Date;
  signatures?: ISignaturesItem[];
  history?: IHistoryItem[];
  items?: IItemsItem[];
}

export interface ISignaturesItem {
  role?: SignaturesRoleEnum;
  user_name?: string;
  user_id?: string;
  signed_at?: string | Date;
  signature_data_url?: string;
  note?: string;
}

export interface IHistoryItem {
  status?: string;
  updated_by?: string;
  updated_at?: string | Date;
  comment?: string;
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
  project_id?: string;
  created_at?: string | Date;
  created_by?: any;
  project_name?: string;
  journey_code?: string;
  source_id?: string;
  signed_by?: string;
  discrepancy_status?: StockOrderDiscrepancyStatusEnum2;
  pdf_url?: string;
  request_id?: string;
  signed_at?: string | Date;
  signatures?: ISignaturesItem[];
  history?: IHistoryItem[];
  items?: IItemsItem[];
}

export type IStockOrderListResponse = ApiListResponse<IStockOrder>

// Union types generated from value_options
export type StockOrderTypeEnum = 'out' | 'in';
export type StockOrderStatusEnum = 'draft' | 'requested' | 'approved' | 'dispatched' | 'received' | 'completed' | 'discrepancy' | 'cancelled';
export type StockOrderJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type StockOrderSourceEnum = 'distributor' | 'project' | 'other';
export type StockOrderDiscrepancyStatusEnum = 'none' | 'pending_review' | 'confirmed' | 'resolved';
export type SignaturesRoleEnum = 'pm' | 'accountant' | 'warehouse' | 'supervisor';
export type ItemsUnitEnum = 'kg' | 'lit' | 'm2' | 'thung' | 'cuon' | 'cai';
export type StockOrderTypeEnum2 = 'out' | 'in';
export type StockOrderStatusEnum2 = 'draft' | 'requested' | 'approved' | 'dispatched' | 'received' | 'completed' | 'discrepancy' | 'cancelled';
export type StockOrderJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type StockOrderSourceEnum2 = 'distributor' | 'project' | 'other';
export type StockOrderDiscrepancyStatusEnum2 = 'none' | 'pending_review' | 'confirmed' | 'resolved';
