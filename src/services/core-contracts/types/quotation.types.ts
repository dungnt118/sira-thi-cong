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
  worktaskId?: string;
  idx_worktaskId?: IndexedContentItem;
  status?: QuotationStatusEnum;
  subtotal?: number;
  discount?: number;
  total?: number;
  approved_at?: string | Date;
  notes?: string;
  createdAt?: string | Date;
  createdBy?: any;
  updatedBy?: any;
  updatedAt?: string | Date;
}

export interface ICreateQuotationInput {
  code?: string;
  version_no?: number;
  journey_id?: string;
  worktaskId?: string;
  status?: QuotationStatusEnum2;
  subtotal?: number;
  discount?: number;
  total?: number;
  approved_at?: string | Date;
  notes?: string;
  createdAt?: string | Date;
  createdBy?: any;
  updatedBy?: any;
  updatedAt?: string | Date;
}

export type IQuotationListResponse = ApiListResponse<IQuotation>

// Union types generated from value_options
export type QuotationStatusEnum = 'draft' | 'sent' | 'approved' | 'rejected';
export type QuotationStatusEnum2 = 'draft' | 'sent' | 'approved' | 'rejected';
