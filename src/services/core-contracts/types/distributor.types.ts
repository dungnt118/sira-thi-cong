import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Distributor interface
 * Auto-generated from Schema: Distributor
 */
export interface IDistributor {
  _id: string;
  code?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  categories?: string[];
}

export interface ICreateDistributorInput {
  code?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  categories?: string[];
}

export type IDistributorListResponse = ApiListResponse<IDistributor>
