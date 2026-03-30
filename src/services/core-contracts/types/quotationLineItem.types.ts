import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * QuotationLineItem interface
 * Auto-generated from Schema: QuotationLineItem
 */
export interface IQuotationLineItem {
  _id: string;
  quotation_id?: string;
  idx_quotation_id?: IndexedContentItem;
  mapping_rule_id?: string;
  idx_mapping_rule_id?: IndexedContentItem;
  item_name?: string;
  unit?: string;
  quantity?: number;
  unit_price?: number;
  line_total?: number;
  note?: string;
}

export interface ICreateQuotationLineItemInput {
  quotation_id?: string;
  mapping_rule_id?: string;
  item_name?: string;
  unit?: string;
  quantity?: number;
  unit_price?: number;
  line_total?: number;
  note?: string;
}

export type IQuotationLineItemListResponse = ApiListResponse<IQuotationLineItem>
