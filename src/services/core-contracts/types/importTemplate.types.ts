import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ImportTemplate interface
 * Auto-generated from Schema: ImportTemplate
 */
export interface IImportTemplate {
  _id: string;
  schemaId?: string;
  idx_schemaId?: IndexedContentItem;
  name?: string;
  nestedId?: string;
  mapping?: IMappingItem[];
  keyMapping?: IKeymappingItem[];
  defaultObjectValue?: any;
  sheet_name?: string;
  sheet_number?: number;
  pipelineKey?: string;
  start_row?: number;
  end_row?: number;
  tags?: any[];
  description?: string;
}

export interface IMappingItem {
  prop_id?: string;
  label?: string;
  prop_type?: MappingPropTypeEnum;
  ref_schema?: string;
  idx_ref_schema?: IndexedContentItem;
  colIndex?: string;
  required?: boolean;
  use_origin_formula?: boolean;
  hidden?: boolean;
  lookup_matches?: any[];
  lookup_field_value?: string;
  lookup_measure?: MappingLookupMeasureEnum;
  col?: string;
  ref_id?: IRefIdItem[];
  formula?: string;
  format?: MappingFormatEnum;
}

export interface IRefIdItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IKeymappingItem {
  col?: string;
  prop_type?: KeymappingPropTypeEnum;
  ref_id?: IRefIdItem[];
  formula?: string;
  format?: KeymappingFormatEnum;
}

export interface IRefIdItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface ICreateImportTemplateInput {
  schemaId?: string;
  name?: string;
  nestedId?: string;
  mapping?: IMappingItem[];
  keyMapping?: IKeymappingItem[];
  defaultObjectValue?: any;
  sheet_name?: string;
  sheet_number?: number;
  pipelineKey?: string;
  start_row?: number;
  end_row?: number;
  tags?: any[];
  description?: string;
}

export type IImportTemplateListResponse = ApiListResponse<IImportTemplate>

// Union types generated from value_options
export type MappingPropTypeEnum = 'TEXT' | 'BOOLEAN' | 'DATE' | 'TIME' | 'NUMBER' | 'TextArray#TEXTARRAY' | 'REFERENCE' | 'LOOKUP';
export type MappingLookupMeasureEnum = 'DEFAULT' | 'AVG' | 'SUM' | 'MAX' | 'MIN' | 'COUNT' | 'CONCAT';
export type MappingFormatEnum = 'dd/MM/yyyy' | 'dd-MM-yyyy' | 'MM-dd-yyyy' | 'MM/dd/yyyy' | 'yyyy/MM/dd' | 'yyyy-MM-dd';
export type KeymappingPropTypeEnum = 'TEXT' | 'REFERENCE';
export type KeymappingFormatEnum = 'dd/MM/yyyy' | 'dd-MM-yyyy' | 'MM-dd-yyyy' | 'MM/dd/yyyy' | 'yyyy/MM/dd' | 'yyyy-MM-dd';
