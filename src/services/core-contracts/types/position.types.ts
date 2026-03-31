import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Position interface
 * Auto-generated from Schema: Position
 */
export interface IPosition {
  _id: string;
  code?: string;
  name?: string;
}

export interface ICreatePositionInput {
  code?: string;
  name?: string;
}

export type IPositionListResponse = ApiListResponse<IPosition>
