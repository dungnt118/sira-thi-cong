import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * SalesInvoice interface
 * Auto-generated from Schema: SalesInvoice
 */
export interface ISalesInvoice {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: SalesInvoiceJourneyStepCodeEnum;
  payment_milestone_id?: string;
  idx_payment_milestone_id?: IndexedContentItem;
  payment_receipt_id?: string;
  idx_payment_receipt_id?: IndexedContentItem;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  customer_id?: string;
  idx_customer_id?: IndexedContentItem;
  invoice_type?: SalesInvoiceInvoiceTypeEnum;
  invoice_status?: SalesInvoiceInvoiceStatusEnum;
  invoice_date?: string | Date;
  invoice_number?: string;
  tax_code?: string;
  amount_before_tax?: number;
  tax_amount?: number;
  total_amount?: number;
  issued_by?: any;
  sent_at?: string | Date;
  note?: string;
  invoice_files?: HeadlessFileUpload[];
  contract_id?: string;
  idx_contract_id?: IndexedContentItem;
}

export interface ICreateSalesInvoiceInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: SalesInvoiceJourneyStepCodeEnum2;
  payment_milestone_id?: string;
  payment_receipt_id?: string;
  project_id?: string;
  customer_id?: string;
  invoice_type?: SalesInvoiceInvoiceTypeEnum2;
  invoice_status?: SalesInvoiceInvoiceStatusEnum2;
  invoice_date?: string | Date;
  invoice_number?: string;
  tax_code?: string;
  amount_before_tax?: number;
  tax_amount?: number;
  total_amount?: number;
  issued_by?: any;
  sent_at?: string | Date;
  note?: string;
  invoice_files?: HeadlessFileUpload[];
  contract_id?: string;
}

export type ISalesInvoiceListResponse = ApiListResponse<ISalesInvoice>

// Union types generated from value_options
export type SalesInvoiceJourneyStepCodeEnum = 'contract_signing' | 'handover_acceptance' | 'warranty_aftercare';
export type SalesInvoiceInvoiceTypeEnum = 'vat_invoice' | 'sales_invoice' | 'adjustment_invoice';
export type SalesInvoiceInvoiceStatusEnum = 'draft' | 'pending_issue' | 'issued' | 'sent' | 'cancelled';
export type SalesInvoiceJourneyStepCodeEnum2 = 'contract_signing' | 'handover_acceptance' | 'warranty_aftercare';
export type SalesInvoiceInvoiceTypeEnum2 = 'vat_invoice' | 'sales_invoice' | 'adjustment_invoice';
export type SalesInvoiceInvoiceStatusEnum2 = 'draft' | 'pending_issue' | 'issued' | 'sent' | 'cancelled';
