import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AppVersion interface
 * Auto-generated from Schema: AppVersion
 */
export interface IAppVersion {
  _id: string;
  appId?: string;
  idx_appId?: IndexedContentItem;
  fileId?: string;
  description?: string;
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

export interface ICreateAppVersionInput {
  appId?: string;
  fileId?: string;
  description?: string;
  version?: IVersionItem[];
  name?: string;
}

export type IAppVersionListResponse = ApiListResponse<IAppVersion>
