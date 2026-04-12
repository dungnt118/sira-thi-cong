import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MasterDataItem interface
 * Auto-generated from Schema: MasterDataItem
 */
export interface IMasterDataItem {
  _id: string;
  category?: MasterDataItemCategoryEnum;
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
  category?: MasterDataItemCategoryEnum2;
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

// Union types generated from value_options
export type MasterDataItemCategoryEnum = 'service_type' | 'source_channel' | 'construction_type' | 'priority_level' | 'go_no_go_status' | 'sla_status' | 'portal_publish_status' | 'survey_status' | 'quote_status' | 'project_status';
export type MasterDataItemCategoryEnum2 = 'service_type' | 'source_channel' | 'construction_type' | 'priority_level' | 'go_no_go_status' | 'sla_status' | 'portal_publish_status' | 'survey_status' | 'quote_status' | 'project_status';
