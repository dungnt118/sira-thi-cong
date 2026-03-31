import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * SalesPipeline interface
 * Auto-generated from Schema: SalesPipeline
 */
export interface ISalesPipeline {
  _id: string;
  name?: string;
  is_active?: boolean;
  is_default?: boolean;
}

export interface ICreateSalesPipelineInput {
  name?: string;
  is_active?: boolean;
  is_default?: boolean;
}

export type ISalesPipelineListResponse = ApiListResponse<ISalesPipeline>
