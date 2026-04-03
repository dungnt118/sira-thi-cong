import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MaterialReceiptConfirmation interface
 * Auto-generated from Schema: MaterialReceiptConfirmation
 */
export interface IMaterialReceiptConfirmation {
  _id: string;
  stock_order_id?: string;
  idx_stock_order_id?: IndexedContentItem;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: MaterialReceiptConfirmationJourneyStepCodeEnum;
  receiver_user?: any;
  receipt_time?: string | Date;
  receipt_status?: MaterialReceiptConfirmationReceiptStatusEnum;
  checked_items?: ICheckedItemsItem[];
  evidence_files?: HeadlessFileUpload[];
  signature_data_url?: string;
  note?: string;
}

export interface ICheckedItemsItem {
  item_name?: string;
  expected_quantity?: string;
  received_quantity?: string;
  checked?: boolean;
}

export interface ICreateMaterialReceiptConfirmationInput {
  stock_order_id?: string;
  journey_id?: string;
  journey_step_code?: MaterialReceiptConfirmationJourneyStepCodeEnum2;
  receiver_user?: any;
  receipt_time?: string | Date;
  receipt_status?: MaterialReceiptConfirmationReceiptStatusEnum2;
  checked_items?: ICheckedItemsItem[];
  evidence_files?: HeadlessFileUpload[];
  signature_data_url?: string;
  note?: string;
}

export type IMaterialReceiptConfirmationListResponse = ApiListResponse<IMaterialReceiptConfirmation>

// Union types generated from value_options
export type MaterialReceiptConfirmationJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type MaterialReceiptConfirmationReceiptStatusEnum = 'pending' | 'received' | 'rejected';
export type MaterialReceiptConfirmationJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type MaterialReceiptConfirmationReceiptStatusEnum2 = 'pending' | 'received' | 'rejected';
