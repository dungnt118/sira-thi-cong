import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ChecklistTemplate interface
 * Auto-generated from Schema: ChecklistTemplate
 */
export interface IChecklistTemplate {
  _id: string;
  name?: string;
  description?: string;
  category?: string;
  idx_category?: IndexedContentItem;
  is_default?: boolean;
  steps?: IStepsItem[];
}

export interface IStepsItem {
  step_code?: string;
  step_order?: number;
  step_name?: string;
  description?: string;
  min_photos?: number;
  allow_video?: boolean;
  is_required?: boolean;
}

export interface ICreateChecklistTemplateInput {
  name?: string;
  description?: string;
  category?: string;
  is_default?: boolean;
  steps?: IStepsItem[];
}

export type IChecklistTemplateListResponse = ApiListResponse<IChecklistTemplate>
