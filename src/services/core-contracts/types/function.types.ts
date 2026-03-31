import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Function interface
 * Auto-generated from Schema: Function
 */
export interface IFunction {
  _id: string;
  sequence?: number;
  command?: string;
  expression?: string;
  type?: FunctionTypeEnum;
  parameters?: any[];
  disabled?: boolean;
}

export interface ICreateFunctionInput {
  sequence?: number;
  command?: string;
  expression?: string;
  type?: FunctionTypeEnum2;
  parameters?: any[];
  disabled?: boolean;
}

export type IFunctionListResponse = ApiListResponse<IFunction>

// Union types generated from value_options
export type FunctionTypeEnum = 'METHOD' | 'VARIABLE';
export type FunctionTypeEnum2 = 'METHOD' | 'VARIABLE';
