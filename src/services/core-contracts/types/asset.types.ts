import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Asset interface
 * Auto-generated from Schema: Asset
 */
export interface IAsset {
  _id: string;
  code?: string;
  name?: string;
  group_id?: string;
  idx_group_id?: IndexedContentItem;
  serial_number?: string;
  status?: AssetStatusEnum;
  assigned_to?: string;
  purchase_date?: string | Date;
  cost?: number;
  condition?: string;
  notes?: string;
}

export interface ICreateAssetInput {
  code?: string;
  name?: string;
  group_id?: string;
  serial_number?: string;
  status?: AssetStatusEnum2;
  assigned_to?: string;
  purchase_date?: string | Date;
  cost?: number;
  condition?: string;
  notes?: string;
}

export type IAssetListResponse = ApiListResponse<IAsset>

// Union types generated from value_options
export type AssetStatusEnum = 'available' | 'in_use' | 'maintenance' | 'broken' | 'lost';
export type AssetStatusEnum2 = 'available' | 'in_use' | 'maintenance' | 'broken' | 'lost';
