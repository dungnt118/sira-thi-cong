import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MaterialGroup interface
 * Auto-generated from Schema: MaterialGroup
 */
export interface IMaterialGroup {
  _id: string;
  name?: string;
  base_unit?: string;
  package_unit?: string;
  category?: string;
}

export interface ICreateMaterialGroupInput {
  name?: string;
  base_unit?: string;
  package_unit?: string;
  category?: string;
}

export type IMaterialGroupListResponse = ApiListResponse<IMaterialGroup>
