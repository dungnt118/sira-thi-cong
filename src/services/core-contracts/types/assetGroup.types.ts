import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AssetGroup interface
 * Auto-generated from Schema: AssetGroup
 */
export interface IAssetGroup {
  _id: string;
  name?: string;
  category?: AssetGroupCategoryEnum;
  depreciation_months?: number;
}

export interface ICreateAssetGroupInput {
  name?: string;
  category?: AssetGroupCategoryEnum2;
  depreciation_months?: number;
}

export type IAssetGroupListResponse = ApiListResponse<IAssetGroup>

// Union types generated from value_options
export type AssetGroupCategoryEnum = 'machinery' | 'power_tools' | 'hand_tools' | 'measuring_testing' | 'safety_ppe' | 'lifting_handling' | 'vehicles' | 'it_equipment' | 'office_furniture' | 'electrical_installation' | 'temporary_site' | 'other';
export type AssetGroupCategoryEnum2 = 'machinery' | 'power_tools' | 'hand_tools' | 'measuring_testing' | 'safety_ppe' | 'lifting_handling' | 'vehicles' | 'it_equipment' | 'office_furniture' | 'electrical_installation' | 'temporary_site' | 'other';
