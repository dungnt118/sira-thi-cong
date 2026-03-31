import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MultiImportQueue interface
 * Auto-generated from Schema: MultiImportQueue
 */
export interface IMultiImportQueue {
  _id: string;
  target_schema?: string;
  data?: any[];
  is_start?: boolean;
  start_time?: string | Date;
  finished_time?: string | Date;
  records?: number;
  successed?: number;
  failure?: number;
  messages?: any[];
  is_active?: boolean;
  processor?: string;
  name?: string;
}

export interface ICreateMultiImportQueueInput {
  target_schema?: string;
  data?: any[];
  is_start?: boolean;
  start_time?: string | Date;
  finished_time?: string | Date;
  records?: number;
  successed?: number;
  failure?: number;
  messages?: any[];
  is_active?: boolean;
  processor?: string;
  name?: string;
}

export type IMultiImportQueueListResponse = ApiListResponse<IMultiImportQueue>
