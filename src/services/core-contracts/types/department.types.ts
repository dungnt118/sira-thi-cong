import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Department interface
 * Auto-generated from Schema: Department
 */
export interface IDepartment {
  _id: string;
  code?: string;
  name?: string;
  isLocked?: boolean;
  parentId?: string;
  idx_parentId?: IndexedContentItem;
  note?: string;
  apply_to_children?: boolean;
  tenantId?: string;
}

export interface ICreateDepartmentInput {
  code?: string;
  name?: string;
  isLocked?: boolean;
  parentId?: string;
  note?: string;
  apply_to_children?: boolean;
  tenantId?: string;
}

export type IDepartmentListResponse = ApiListResponse<IDepartment>
