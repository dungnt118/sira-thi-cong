import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ChartTemplate interface
 * Auto-generated from Schema: ChartTemplate
 */
export interface IChartTemplate {
  _id: string;
  templateKey?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: any[];
  faIcon?: string;
  chartType?: ChartTemplateChartTypeEnum;
  previewImage?: string;
  requiredFields?: IRequiredfieldsItem[];
  placeholders?: IPlaceholdersItem[];
  templateConfig?: any;
  isPublic?: boolean;
  isRecommended?: boolean;
  sortOrder?: number;
  version?: IVersionItem[];
  name?: string;
}

export interface IRequiredfieldsItem {
  measureFields?: IMeasurefieldsItem[];
  dimensionFields?: IDimensionfieldsItem[];
  timeField?: ITimefieldItem[];
  kpiDateFields?: IKpidatefieldsItem[];
  drilldownFields?: IDrilldownfieldsItem[];
  sortFields?: ISortfieldsItem[];
}

export interface IMeasurefieldsItem {
  placeholderName?: string;
  jsonPath?: string;
  fieldType?: string;
  expectedPropType?: any[];
  exampleValue?: string;
  description?: string;
  required?: boolean;
  title?: string;
}

export interface IDimensionfieldsItem {
  placeholderName?: string;
  jsonPath?: string;
  fieldType?: string;
  expectedPropType?: any[];
  exampleValue?: string;
  description?: string;
  required?: boolean;
  title?: string;
}

export interface ITimefieldItem {
  placeholderName?: string;
  jsonPath?: string;
  fieldType?: string;
  expectedPropType?: any[];
  exampleValue?: string;
  description?: string;
  required?: boolean;
  title?: string;
}

export interface IKpidatefieldsItem {
  placeholderName?: string;
  jsonPath?: string;
  fieldType?: string;
  expectedPropType?: any[];
  exampleValue?: string;
  description?: string;
  required?: boolean;
  title?: string;
}

export interface IDrilldownfieldsItem {
  placeholderName?: string;
  jsonPath?: string;
  fieldType?: string;
  expectedPropType?: any[];
  exampleValue?: string;
  description?: string;
  required?: boolean;
  title?: string;
}

export interface ISortfieldsItem {
  placeholderName?: string;
  jsonPath?: string;
  fieldType?: string;
  expectedPropType?: any[];
  exampleValue?: string;
  description?: string;
  required?: boolean;
  title?: string;
}

export interface IPlaceholdersItem {
  Comparer?: IComparerItem[];
  Count?: number;
  Capacity?: number;
  Keys?: IKeysItem[];
  Values?: IValuesItem[];
  Item?: IItemItem[];
}

export interface IComparerItem {
  Chars?: any;
  Length?: number;
}

export interface IKeysItem {
  type?: string;
  jsonPath?: string;
  fieldType?: string;
  expectedPropType?: string;
  example?: string;
  description?: string;
  required?: boolean;
  title?: string;
}

export interface IValuesItem {
  type?: string;
  jsonPath?: string;
  fieldType?: string;
  expectedPropType?: string;
  example?: string;
  description?: string;
  required?: boolean;
  title?: string;
}

export interface IItemItem {
  type?: string;
  jsonPath?: string;
  fieldType?: string;
  expectedPropType?: string;
  example?: string;
  description?: string;
  required?: boolean;
  title?: string;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface ICreateChartTemplateInput {
  templateKey?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: any[];
  faIcon?: string;
  chartType?: ChartTemplateChartTypeEnum2;
  previewImage?: string;
  requiredFields?: IRequiredfieldsItem[];
  placeholders?: IPlaceholdersItem[];
  templateConfig?: any;
  isPublic?: boolean;
  isRecommended?: boolean;
  sortOrder?: number;
  version?: IVersionItem[];
  name?: string;
}

export type IChartTemplateListResponse = ApiListResponse<IChartTemplate>

// Union types generated from value_options
export type ChartTemplateChartTypeEnum = 'number' | 'pie' | 'donut' | 'bar' | 'column' | 'line' | 'area' | 'funnel' | 'table' | 'net' | 'pivotTable';
export type ChartTemplateChartTypeEnum2 = 'number' | 'pie' | 'donut' | 'bar' | 'column' | 'line' | 'area' | 'funnel' | 'table' | 'net' | 'pivotTable';
