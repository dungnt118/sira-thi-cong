import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * NotifyPushResult interface
 * Auto-generated from Schema: NotifyPushResult
 */
export interface INotifyPushResult {
  _id: string;
  title?: string;
  body?: string;
  image?: string;
  icon?: string;
  data?: any;
  results?: IResultsItem[];
  failure?: number;
  success?: number;
  userId?: string;
  sent?: boolean;
  read?: boolean;
}

export interface IResultsItem {
  token?: string;
  success?: boolean;
  error?: string;
}

export interface ICreateNotifyPushResultInput {
  title?: string;
  body?: string;
  image?: string;
  icon?: string;
  data?: any;
  results?: IResultsItem[];
  failure?: number;
  success?: number;
  userId?: string;
  sent?: boolean;
  read?: boolean;
}

export type INotifyPushResultListResponse = ApiListResponse<INotifyPushResult>
