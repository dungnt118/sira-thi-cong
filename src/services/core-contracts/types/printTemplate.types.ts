import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PrintTemplate interface
 * Auto-generated from Schema: PrintTemplate
 */
export interface IPrintTemplate {
  _id: string;
  name?: string;
  html?: string;
  css?: string;
  is_library?: boolean;
  category?: string;
  dsId?: string;
  target_schema?: string;
  page_setup?: IPageSetupItem[];
}

export interface IPageSetupItem {
  size?: ISizeItem[];
  orientation?: PageSetupOrientationEnum;
  margins?: IMarginsItem[];
}

export interface ISizeItem {
  name?: string;
  widthMm?: number;
  heightMm?: number;
}

export interface IMarginsItem {
  topMm?: number;
  bottomMm?: number;
  leftMm?: number;
  rightMm?: number;
}

export interface ICreatePrintTemplateInput {
  name?: string;
  html?: string;
  css?: string;
  is_library?: boolean;
  category?: string;
  dsId?: string;
  target_schema?: string;
  page_setup?: IPageSetupItem[];
}

export type IPrintTemplateListResponse = ApiListResponse<IPrintTemplate>

// Union types generated from value_options
export type PageSetupOrientationEnum = 'portrait' | 'landscape';
