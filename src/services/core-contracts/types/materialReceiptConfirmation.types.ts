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
export type MaterialReceiptConfirmationJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type MaterialReceiptConfirmationReceiptStatusEnum = 'pending' | 'received' | 'rejected';
export type MaterialReceiptConfirmationJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type MaterialReceiptConfirmationReceiptStatusEnum2 = 'pending' | 'received' | 'rejected';
