import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * BlockingActivityIndex interface
 * Auto-generated from Schema: BlockingActivityIndex
 */
export interface IBlockingActivityIndex {
  _id: string;
  workflowId?: string;
  instanceId?: string;
  activityId?: string;
  isStart?: boolean;
  name?: string;
  parameters?: any;
  tenantId?: string;
}

export interface ICreateBlockingActivityIndexInput {
  workflowId?: string;
  instanceId?: string;
  activityId?: string;
  isStart?: boolean;
  name?: string;
  parameters?: any;
  tenantId?: string;
}

export type IBlockingActivityIndexListResponse = ApiListResponse<IBlockingActivityIndex>
