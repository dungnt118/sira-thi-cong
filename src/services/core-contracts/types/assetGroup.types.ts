import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AssetGroup interface
 * Auto-generated from Schema: AssetGroup
 */
export interface IAssetGroup {
  _id: string;
  name?: string;
  category?: string;
  depreciation_months?: number;
}

export interface ICreateAssetGroupInput {
  name?: string;
  category?: string;
  depreciation_months?: number;
}

export type IAssetGroupListResponse = ApiListResponse<IAssetGroup>
