import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * TenantInfo interface
 * Auto-generated from Schema: TenantInfo
 */
export interface ITenantInfo {
  _id: string;
  name?: string;
  code?: string;
  domain?: string;
  description?: string;
  logoId?: string;
  color?: string;
}

export interface ICreateTenantInfoInput {
  name?: string;
  code?: string;
  domain?: string;
  description?: string;
  logoId?: string;
  color?: string;
}

export type ITenantInfoListResponse = ApiListResponse<ITenantInfo>
