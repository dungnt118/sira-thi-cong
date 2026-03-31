import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * EstimateTemplate interface
 * Auto-generated from Schema: EstimateTemplate
 */
export interface IEstimateTemplate {
  _id: string;
  code?: string;
  name?: string;
  unit?: string;
}

export interface ICreateEstimateTemplateInput {
  code?: string;
  name?: string;
  unit?: string;
}

export type IEstimateTemplateListResponse = ApiListResponse<IEstimateTemplate>
