import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * SlowApiSession interface
 * Auto-generated from Schema: SlowApiSession
 */
export interface ISlowApiSession {
  _id: string;
  user?: string;
  target_schema?: string;
  tenantId?: string;
  nestedId?: string;
  tasks?: number;
  processing?: number;
  percentCompleted?: number;
  isBegin?: boolean;
  success?: number;
  failure?: number;
  sourceFile?: ISourcefileItem[];
  errorFile?: IErrorfileItem[];
  isFinished?: boolean;
  message?: string;
  name?: string;
}

export interface ISourcefileItem {
  file_id?: string;
  name?: string;
  mine_type?: string;
  size?: any[];
  alt?: string;
  url?: string;
  file_type?: string;
  file_path?: string;
}

export interface IErrorfileItem {
  file_id?: string;
  name?: string;
  mine_type?: string;
  size?: any[];
  alt?: string;
  url?: string;
  file_type?: string;
  file_path?: string;
}

export interface ICreateSlowApiSessionInput {
  user?: string;
  target_schema?: string;
  tenantId?: string;
  nestedId?: string;
  tasks?: number;
  processing?: number;
  percentCompleted?: number;
  isBegin?: boolean;
  success?: number;
  failure?: number;
  sourceFile?: ISourcefileItem[];
  errorFile?: IErrorfileItem[];
  isFinished?: boolean;
  message?: string;
  name?: string;
}

export type ISlowApiSessionListResponse = ApiListResponse<ISlowApiSession>
