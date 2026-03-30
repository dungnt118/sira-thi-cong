import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PrintCategory interface
 * Auto-generated from Schema: PrintCategory
 */
export interface IPrintCategory {
  _id: string;
  name?: string;
  description?: string;
}

export interface ICreatePrintCategoryInput {
  name?: string;
  description?: string;
}

export type IPrintCategoryListResponse = ApiListResponse<IPrintCategory>
