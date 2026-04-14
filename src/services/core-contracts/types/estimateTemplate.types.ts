import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * EstimateTemplate interface
 * Auto-generated from Schema: EstimateTemplate
 */
export interface IEstimateTemplate {
  _id: string;
  code?: string;
  name?: string;
  service_type_id?: string;
  idx_service_type_id?: IndexedContentItem;
  scale_type?: EstimateTemplateScaleTypeEnum;
  unit?: string;
  components?: IComponentsItem[];
  total_cost_per_unit?: number;
}

export interface IComponentsItem {
  type?: ComponentsTypeEnum;
  material_id?: string;
  idx_material_id?: IndexedContentItem;
  labor_price_config_id?: string;
  idx_labor_price_config_id?: IndexedContentItem;
  name?: string;
  unit?: string;
  calc_mode?: ComponentsCalcModeEnum;
  quantity_per_unit?: number;
  unit_price?: number;
  note?: string;
}

export interface ICreateEstimateTemplateInput {
  code?: string;
  name?: string;
  service_type_id?: string;
  scale_type?: EstimateTemplateScaleTypeEnum2;
  unit?: string;
  components?: IComponentsItem[];
  total_cost_per_unit?: number;
}

export type IEstimateTemplateListResponse = ApiListResponse<IEstimateTemplate>

// Union types generated from value_options
export type EstimateTemplateScaleTypeEnum = 'small' | 'medium' | 'large' | 'custom';
export type ComponentsTypeEnum = 'material' | 'labor' | 'other';
export type ComponentsCalcModeEnum = 'manual' | 'package_m2' | 'daily_worker' | 'formula';
export type EstimateTemplateScaleTypeEnum2 = 'small' | 'medium' | 'large' | 'custom';
