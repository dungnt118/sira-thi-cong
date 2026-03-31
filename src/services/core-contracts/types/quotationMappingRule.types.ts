import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * QuotationMappingRule interface
 * Auto-generated from Schema: QuotationMappingRule
 */
export interface IQuotationMappingRule {
  _id: string;
  service_type?: string;
  idx_service_type?: IndexedContentItem;
  rule_name?: string;
  source_cost_types?: string[];
  target_item_name?: string;
  formula_note?: string;
  is_active?: boolean;
}

export interface ICreateQuotationMappingRuleInput {
  service_type?: string;
  rule_name?: string;
  source_cost_types?: string[];
  target_item_name?: string;
  formula_note?: string;
  is_active?: boolean;
}

export type IQuotationMappingRuleListResponse = ApiListResponse<IQuotationMappingRule>
