import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ActivityLog interface
 * Auto-generated from Schema: ActivityLog
 */
export interface IActivityLog {
  _id: string;
  type?: string;
  message?: string;
  data?: any;
  remoteIP?: string;
  user?: string;
  headers?: any;
}

export interface ICreateActivityLogInput {
  type?: string;
  message?: string;
  data?: any;
  remoteIP?: string;
  user?: string;
  headers?: any;
}

export type IActivityLogListResponse = ApiListResponse<IActivityLog>
