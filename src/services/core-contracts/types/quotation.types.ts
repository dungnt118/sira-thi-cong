import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Quotation interface
 * Auto-generated from Schema: Quotation
 */
export interface IQuotation {
  _id: string;
  code?: string;
  version_no?: number;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  status?: QuotationStatusEnum;
  subtotal?: number;
  discount?: number;
  total?: number;
  approved_at?: string | Date;
  notes?: string;
  //deprecated fields
  // service_request_id?: string;
  // idx_service_request_id?: IndexedContentItem;
}

export interface ICreateQuotationInput {
  code?: string;
  version_no?: number;
  journey_id?: string;
  status?: QuotationStatusEnum2;
  subtotal?: number;
  discount?: number;
  total?: number;
  approved_at?: string | Date;
  notes?: string;
  //deprecated fields
  // service_request_id?: string;
}

export type IQuotationListResponse = ApiListResponse<IQuotation>

// Union types generated from value_options
export type QuotationStatusEnum = 'draft' | 'sent' | 'approved' | 'rejected';
export type QuotationStatusEnum2 = 'draft' | 'sent' | 'approved' | 'rejected';
