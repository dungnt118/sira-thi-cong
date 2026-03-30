import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * WorkFlowGroup interface
 * Auto-generated from Schema: WorkFlowGroup
 */
export interface IWorkFlowGroup {
  _id: string;
  moduleIds?: any[];
  name?: string;
}

export interface ICreateWorkFlowGroupInput {
  moduleIds?: any[];
  name?: string;
}

export type IWorkFlowGroupListResponse = ApiListResponse<IWorkFlowGroup>
