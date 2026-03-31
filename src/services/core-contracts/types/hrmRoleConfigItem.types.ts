import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * HrmRoleConfigItem interface
 * Auto-generated from Schema: HrmRoleConfigItem
 */
export interface IHrmRoleConfigItem {
  _id: string;
  role?: string;
  permissions?: any[];
  description?: string;
  isActive?: boolean;
  name?: string;
}

export interface ICreateHrmRoleConfigItemInput {
  role?: string;
  permissions?: any[];
  description?: string;
  isActive?: boolean;
  name?: string;
}

export type IHrmRoleConfigItemListResponse = ApiListResponse<IHrmRoleConfigItem>
