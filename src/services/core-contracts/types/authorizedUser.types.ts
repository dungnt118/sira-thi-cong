import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AuthorizedUser interface
 * Auto-generated from Schema: AuthorizedUser
 */
export interface IAuthorizedUser {
  _id: string;
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

export interface ICreateAuthorizedUserInput {
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

export type IAuthorizedUserListResponse = ApiListResponse<IAuthorizedUser>

// Union types generated from value_options
export type IdentityContextsPolicyEnum = 'none' | 'system' | 'root' | 'admin' | 'staff' | 'customer';
