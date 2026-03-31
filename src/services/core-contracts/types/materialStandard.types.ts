import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MaterialStandard interface
 * Auto-generated from Schema: MaterialStandard
 */
export interface IMaterialStandard {
  _id: string;
  material_id?: string;
  idx_material_id?: IndexedContentItem;
  material_name?: string;
  construction_type?: string;
  idx_construction_type?: IndexedContentItem;
  usage_per_m2?: number;
  note?: string;
}

export interface ICreateMaterialStandardInput {
  material_id?: string;
  material_name?: string;
  construction_type?: string;
  usage_per_m2?: number;
  note?: string;
}

export type IMaterialStandardListResponse = ApiListResponse<IMaterialStandard>
