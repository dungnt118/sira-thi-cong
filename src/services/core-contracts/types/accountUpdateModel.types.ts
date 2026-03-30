import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AccountUpdateModel interface
 * Auto-generated from Schema: AccountUpdateModel
 */
export interface IAccountUpdateModel {
  _id: string;
  password?: string;
  globalUserId?: string;
  username?: string;
  isActive?: boolean;
  permVer?: number;
  isRoot?: boolean;
  identity_contexts?: IIdentityContextsItem[];
  avatar?: string;
  fullName?: string;
  type?: string;
  email?: string;
  phoneNumber?: string;
  title?: string;
  tenantId?: string;
}

export interface IIdentityContextsItem {
  clientId?: string;
  subjectSchema?: string;
  policy?: IdentityContextsPolicyEnum;
  subjectId?: string;
  roles?: any[];
  defaultRole?: string;
  metadata?: any;
}

export interface ICreateAccountUpdateModelInput {
  password?: string;
  globalUserId?: string;
  username?: string;
  isActive?: boolean;
  permVer?: number;
  isRoot?: boolean;
  identity_contexts?: IIdentityContextsItem[];
  avatar?: string;
  fullName?: string;
  type?: string;
  email?: string;
  phoneNumber?: string;
  title?: string;
  tenantId?: string;
}

export type IAccountUpdateModelListResponse = ApiListResponse<IAccountUpdateModel>

// Union types generated from value_options
export type IdentityContextsPolicyEnum = 'none' | 'system' | 'root' | 'admin' | 'staff' | 'customer';
