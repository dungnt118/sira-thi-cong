import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * IndexedContentItem interface
 * Auto-generated from Schema: IndexedContentItem
 */
export interface IIndexedContentItem {
  _id: string;
  itemId?: string;
  parentId?: string;
  code?: string;
  title?: string;
  bigtext?: string;
  bigtext_unsign?: string;
  collection?: string;
  schema?: string;
  schema_label?: string;
  tenantId?: string;
  tenantName?: string;
  isDraft?: boolean;
  batchToken?: string;
}

export interface ICreateIndexedContentItemInput {
  itemId?: string;
  parentId?: string;
  code?: string;
  title?: string;
  bigtext?: string;
  bigtext_unsign?: string;
  collection?: string;
  schema?: string;
  schema_label?: string;
  tenantId?: string;
  tenantName?: string;
  isDraft?: boolean;
  batchToken?: string;
}

export type IIndexedContentItemListResponse = ApiListResponse<IIndexedContentItem>
