import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * HrmRoleConfigSnapshot interface
 * Auto-generated from Schema: HrmRoleConfigSnapshot
 */
export interface IHrmRoleConfigSnapshot {
  _id: string;
  items?: IItemsItem[];
  publishedAt?: string | Date;
  publishedBy?: string;
  isLatest?: boolean;
  name?: string;
}

export interface IItemsItem {
  role?: string;
  permissions?: any[];
  description?: string;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  name?: string;
  id?: string;
}

export interface ICreateHrmRoleConfigSnapshotInput {
  items?: IItemsItem[];
  publishedAt?: string | Date;
  publishedBy?: string;
  isLatest?: boolean;
  name?: string;
}

export type IHrmRoleConfigSnapshotListResponse = ApiListResponse<IHrmRoleConfigSnapshot>
