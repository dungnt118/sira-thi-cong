import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * HtmlStore interface
 * Auto-generated from Schema: HtmlStore
 */
export interface IHtmlStore {
  _id: string;
  description?: string;
  html?: string;
  privateMode?: boolean;
  name?: string;
}

export interface ICreateHtmlStoreInput {
  description?: string;
  html?: string;
  privateMode?: boolean;
  name?: string;
}

export type IHtmlStoreListResponse = ApiListResponse<IHtmlStore>
