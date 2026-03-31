import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MasterDataItem interface
 * Auto-generated from Schema: MasterDataItem
 */
export interface IMasterDataItem {
  _id: string;
  categoryId?: string;
  idx_categoryId?: IndexedContentItem;
  label?: string;
  value?: string;
  shortLabel?: string;
  color?: string;
  faIcon?: string;
  sortOrder?: number;
  isDefault?: boolean;
  isActive?: boolean;
  description?: string;
  metadataJson?: any;
}

export interface ICreateMasterDataItemInput {
  categoryId?: string;
  label?: string;
  value?: string;
  shortLabel?: string;
  color?: string;
  faIcon?: string;
  sortOrder?: number;
  isDefault?: boolean;
  isActive?: boolean;
  description?: string;
  metadataJson?: any;
}

export type IMasterDataItemListResponse = ApiListResponse<IMasterDataItem>
