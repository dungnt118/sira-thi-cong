import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * StartActivityIndex interface
 * Auto-generated from Schema: StartActivityIndex
 */
export interface IStartActivityIndex {
  _id: string;
  name?: string;
  activityId?: string;
  workflowId?: string;
  isEnable?: boolean;
  parameters?: any;
  tenantId?: string;
}

export interface ICreateStartActivityIndexInput {
  name?: string;
  activityId?: string;
  workflowId?: string;
  isEnable?: boolean;
  parameters?: any;
  tenantId?: string;
}

export type IStartActivityIndexListResponse = ApiListResponse<IStartActivityIndex>
