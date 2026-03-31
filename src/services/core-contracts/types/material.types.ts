import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Material interface
 * Auto-generated from Schema: Material
 */
export interface IMaterial {
  _id: string;
  code?: string;
  name?: string;
  group_id?: string;
  idx_group_id?: IndexedContentItem;
  capacity?: number;
  unit?: MaterialUnitEnum;
  current_stock?: number;
  partial_stock?: number;
  min_stock_alert?: number;
  unit_cost?: number;
}

export interface ICreateMaterialInput {
  code?: string;
  name?: string;
  group_id?: string;
  capacity?: number;
  unit?: MaterialUnitEnum2;
  current_stock?: number;
  partial_stock?: number;
  min_stock_alert?: number;
  unit_cost?: number;
}

export type IMaterialListResponse = ApiListResponse<IMaterial>

// Union types generated from value_options
export type MaterialUnitEnum = 'kg' | 'lit' | 'm2' | 'thung' | 'cuon' | 'cai';
export type MaterialUnitEnum2 = 'kg' | 'lit' | 'm2' | 'thung' | 'cuon' | 'cai';
