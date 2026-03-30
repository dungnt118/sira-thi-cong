import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AppDB interface
 * Auto-generated from Schema: AppDB
 */
export interface IAppDB {
  _id: string;
  appId?: string;
  idx_appId?: IndexedContentItem;
  description?: string;
  fileId?: string;
  version?: IVersionItem[];
  name?: string;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface ICreateAppDBInput {
  appId?: string;
  description?: string;
  fileId?: string;
  version?: IVersionItem[];
  name?: string;
}

export type IAppDBListResponse = ApiListResponse<IAppDB>
