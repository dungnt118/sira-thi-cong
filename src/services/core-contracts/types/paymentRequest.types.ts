import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PaymentRequest interface
 * Auto-generated from Schema: PaymentRequest
 */
export interface IPaymentRequest {
  _id: string;
  code?: string;
  request_date?: string | Date;
  request_type?: PaymentRequestRequestTypeEnum;
  priority?: PaymentRequestPriorityEnum;
  requested_by?: any;
  approver_assigned?: any;
  status?: PaymentRequestStatusEnum;
  reference_code?: string;
  request_note?: string;
  supporting_files?: HeadlessFileUpload[];
  company_bank_account_id?: string;
  idx_company_bank_account_id?: IndexedContentItem;
  beneficiary_bank_contact_id?: string;
  idx_beneficiary_bank_contact_id?: IndexedContentItem;
  source_account_name_snapshot?: string;
  source_account_number_snapshot?: string;
  source_bank_name_snapshot?: string;
  beneficiary_name_snapshot?: string;
  beneficiary_account_number_snapshot?: string;
  beneficiary_bank_name_snapshot?: string;
  beneficiary_branch_snapshot?: string;
  amount?: number;
  currency?: PaymentRequestCurrencyEnum;
  payment_content?: string;
  submitted_at?: string | Date;
  approved_by?: any;
  approved_at?: string | Date;
  rejected_at?: string | Date;
  rejected_by?: any;
  rejection_reason?: string;
  paid_by?: any;
  paid_at?: string | Date;
  bank_transaction_ref?: string;
  cancelled_by?: any;
  cancelled_at?: string | Date;
  cancel_reason?: string;
  payment_proof_files?: HeadlessFileUpload[];
  payment_proof_note?: string;
}

export interface ICreatePaymentRequestInput {
  code?: string;
  request_date?: string | Date;
  request_type?: PaymentRequestRequestTypeEnum2;
  priority?: PaymentRequestPriorityEnum2;
  requested_by?: any;
  approver_assigned?: any;
  status?: PaymentRequestStatusEnum2;
  reference_code?: string;
  request_note?: string;
  supporting_files?: HeadlessFileUpload[];
  company_bank_account_id?: string;
  beneficiary_bank_contact_id?: string;
  source_account_name_snapshot?: string;
  source_account_number_snapshot?: string;
  source_bank_name_snapshot?: string;
  beneficiary_name_snapshot?: string;
  beneficiary_account_number_snapshot?: string;
  beneficiary_bank_name_snapshot?: string;
  beneficiary_branch_snapshot?: string;
  amount?: number;
  currency?: PaymentRequestCurrencyEnum2;
  payment_content?: string;
  submitted_at?: string | Date;
  approved_by?: any;
  approved_at?: string | Date;
  rejected_at?: string | Date;
  rejected_by?: any;
  rejection_reason?: string;
  paid_by?: any;
  paid_at?: string | Date;
  bank_transaction_ref?: string;
  cancelled_by?: any;
  cancelled_at?: string | Date;
  cancel_reason?: string;
  payment_proof_files?: HeadlessFileUpload[];
  payment_proof_note?: string;
}

export type IPaymentRequestListResponse = ApiListResponse<IPaymentRequest>

// Union types generated from value_options
export type PaymentRequestRequestTypeEnum = 'supplier_payment' | 'expense_reimbursement' | 'salary_payment' | 'tax_payment' | 'internal_transfer' | 'other';
export type PaymentRequestPriorityEnum = 'normal' | 'urgent' | 'critical';
export type PaymentRequestStatusEnum = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'paid' | 'cancelled';
export type PaymentRequestCurrencyEnum = 'vnd' | 'usd' | 'eur';
export type PaymentRequestRequestTypeEnum2 = 'supplier_payment' | 'expense_reimbursement' | 'salary_payment' | 'tax_payment' | 'internal_transfer' | 'other';
export type PaymentRequestPriorityEnum2 = 'normal' | 'urgent' | 'critical';
export type PaymentRequestStatusEnum2 = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'paid' | 'cancelled';
export type PaymentRequestCurrencyEnum2 = 'vnd' | 'usd' | 'eur';
