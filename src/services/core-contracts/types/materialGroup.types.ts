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
  type?: MaterialGroupTypeEnum;
  category?: string;
  base_unit?: string;
  package_unit?: string;
  status?: MaterialGroupStatusEnum;
  sort_order?: number;
}

export interface ICreateMaterialGroupInput {
  name?: string;
  type?: MaterialGroupTypeEnum2;
  category?: string;
  base_unit?: string;
  package_unit?: string;
  status?: MaterialGroupStatusEnum2;
  sort_order?: number;
}

export type IMaterialGroupListResponse = ApiListResponse<IMaterialGroup>

// Union types generated from value_options
export type MaterialGroupTypeEnum = 'CONSUMABLE' | 'OTHER';
export type MaterialGroupStatusEnum = 'active' | 'inactive';
export type MaterialGroupTypeEnum2 = 'CONSUMABLE' | 'OTHER';
export type MaterialGroupStatusEnum2 = 'active' | 'inactive';
