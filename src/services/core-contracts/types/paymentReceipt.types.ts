import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PaymentReceipt interface
 * Auto-generated from Schema: PaymentReceipt
 */
export interface IPaymentReceipt {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: PaymentReceiptJourneyStepCodeEnum;
  payment_milestone_id?: string;
  idx_payment_milestone_id?: IndexedContentItem;
  receipt_date?: string | Date;
  receipt_method?: PaymentReceiptReceiptMethodEnum;
  amount_received?: number;
  transaction_ref?: string;
  collected_by?: any;
  proof_files?: HeadlessFileUpload[];
  note?: string;
  //deprecated fields
  // project_id?: string;
  // idx_project_id?: IndexedContentItem;
  // contract_id?: string;
  // idx_contract_id?: IndexedContentItem;
}

export interface ICreatePaymentReceiptInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: PaymentReceiptJourneyStepCodeEnum2;
  payment_milestone_id?: string;
  receipt_date?: string | Date;
  receipt_method?: PaymentReceiptReceiptMethodEnum2;
  amount_received?: number;
  transaction_ref?: string;
  collected_by?: any;
  proof_files?: HeadlessFileUpload[];
  note?: string;
  //deprecated fields
  // project_id?: string;
  // contract_id?: string;
}

export type IPaymentReceiptListResponse = ApiListResponse<IPaymentReceipt>

// Union types generated from value_options
export type PaymentReceiptJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PaymentReceiptReceiptMethodEnum = 'cash' | 'bank_transfer' | 'card' | 'other';
export type PaymentReceiptJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PaymentReceiptReceiptMethodEnum2 = 'cash' | 'bank_transfer' | 'card' | 'other';
