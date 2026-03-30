import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * RoleType interface
 * Auto-generated from Schema: RoleType
 */
export interface IRoleType {
  _id: string;
  name?: string;
  code?: string;
  description?: string;
  menuPermissions?: IMenupermissionsItem[];
}

export interface IMenupermissionsItem {
  menuId?: string;
  permissions?: any[];
}

export interface ICreateRoleTypeInput {
  name?: string;
  code?: string;
  description?: string;
  menuPermissions?: IMenupermissionsItem[];
}

export type IRoleTypeListResponse = ApiListResponse<IRoleType>
