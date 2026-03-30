import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * TenantAccessLog interface
 * Auto-generated from Schema: TenantAccessLog
 */
export interface ITenantAccessLog {
  _id: string;
  user_name?: string;
  tenantId?: string;
  ip?: string;
  headers?: any;
}

export interface ICreateTenantAccessLogInput {
  user_name?: string;
  tenantId?: string;
  ip?: string;
  headers?: any;
}

export type ITenantAccessLogListResponse = ApiListResponse<ITenantAccessLog>
