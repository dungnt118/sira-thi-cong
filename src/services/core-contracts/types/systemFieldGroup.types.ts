import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * SystemFieldGroup interface
 * Auto-generated from Schema: SystemFieldGroup
 */
export interface ISystemFieldGroup {
  _id: string;
  code?: string;
  name?: string;
  description?: string;
  displayOrder?: number;
  faIcon?: string;
  isDeleted?: boolean;
  tags?: any[];
}

export interface ICreateSystemFieldGroupInput {
  code?: string;
  name?: string;
  description?: string;
  displayOrder?: number;
  faIcon?: string;
  isDeleted?: boolean;
  tags?: any[];
}

export type ISystemFieldGroupListResponse = ApiListResponse<ISystemFieldGroup>
