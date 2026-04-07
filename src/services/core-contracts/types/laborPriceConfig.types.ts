import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * LaborPriceConfig interface
 * Auto-generated from Schema: LaborPriceConfig
 */
export interface ILaborPriceConfig {
  _id: string;
  levelCode?: string;
  name?: string;
  defaultPrice?: number;
  status?: LaborPriceConfigStatusEnum;
  note?: string;
}

export interface ICreateLaborPriceConfigInput {
  levelCode?: string;
  name?: string;
  defaultPrice?: number;
  status?: LaborPriceConfigStatusEnum2;
  note?: string;
}

export type ILaborPriceConfigListResponse = ApiListResponse<ILaborPriceConfig>

// Union types generated from value_options
export type LaborPriceConfigStatusEnum = 'active' | 'inactive';
export type LaborPriceConfigStatusEnum2 = 'active' | 'inactive';
