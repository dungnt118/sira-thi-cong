import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MasterDataCategory interface
 * Auto-generated from Schema: MasterDataCategory
 */
export interface IMasterDataCategory {
  _id: string;
  code?: string;
  name?: string;
  module?: MasterDataCategoryModuleEnum;
  isActive?: boolean;
  allowCustomItem?: boolean;
  sortOrder?: number;
  description?: string;
  note?: string;
}

export interface ICreateMasterDataCategoryInput {
  code?: string;
  name?: string;
  module?: MasterDataCategoryModuleEnum2;
  isActive?: boolean;
  allowCustomItem?: boolean;
  sortOrder?: number;
  description?: string;
  note?: string;
}

export type IMasterDataCategoryListResponse = ApiListResponse<IMasterDataCategory>

// Union types generated from value_options
export type MasterDataCategoryModuleEnum = 'foundation' | 'crm' | 'project' | 'execution' | 'inventory' | 'finance' | 'document';
export type MasterDataCategoryModuleEnum2 = 'foundation' | 'crm' | 'project' | 'execution' | 'inventory' | 'finance' | 'document';
