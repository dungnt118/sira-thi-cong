import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Customer interface
 * Auto-generated from Schema: Customer
 */
export interface ICustomer {
  _id: string;
  code?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  zalo?: string;
  district?: string;
  city?: string;
  province?: string;
  ward?: string;
  address?: string;
  assigned_pm_id?: any;
  notes?: string;
  bod?: string | Date;
  sex?: CustomerSexEnum;
  marriage_state?: CustomerMarriageStateEnum;
  geo?: any;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: any;
  updatedBy?: any;
}

export interface ICreateCustomerInput {
  code?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  zalo?: string;
  district?: string;
  city?: string;
  province?: string;
  ward?: string;
  address?: string;
  assigned_pm_id?: any;
  notes?: string;
  bod?: string | Date;
  sex?: CustomerSexEnum2;
  marriage_state?: CustomerMarriageStateEnum2;
  geo?: any;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: any;
  updatedBy?: any;
}

export type ICustomerListResponse = ApiListResponse<ICustomer>

// Union types generated from value_options
export type CustomerSexEnum = 'mail' | 'female' | 'none';
export type CustomerMarriageStateEnum = 'single' | 'marriaged' | 'children';
export type CustomerSexEnum2 = 'mail' | 'female' | 'none';
export type CustomerMarriageStateEnum2 = 'single' | 'marriaged' | 'children';
