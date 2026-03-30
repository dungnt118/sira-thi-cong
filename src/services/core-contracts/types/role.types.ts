import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Role interface
 * Auto-generated from Schema: Role
 */
export interface IRole {
  _id: string;
  name?: string;
  typeId?: string;
  idx_typeId?: IndexedContentItem;
  tenantId?: string;
  isLocked?: boolean;
  code?: string;
  description?: string;
  menuPermissions?: IMenupermissionsItem[];
}

export interface IMenupermissionsItem {
  menuId?: string;
  permissions?: any[];
}

export interface ICreateRoleInput {
  name?: string;
  typeId?: string;
  tenantId?: string;
  isLocked?: boolean;
  code?: string;
  description?: string;
  menuPermissions?: IMenupermissionsItem[];
}

export type IRoleListResponse = ApiListResponse<IRole>
