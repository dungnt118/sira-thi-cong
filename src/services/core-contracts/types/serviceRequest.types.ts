import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ServiceRequest interface
 * Auto-generated from Schema: ServiceRequest
 */
export interface IServiceRequest {
  _id: string;
  code?: string;
  name?: string;
  customer_id?: string;
  idx_customer_id?: IndexedContentItem;
  customer_name?: string;
  contact_phone?: string;
  contact_email?: string;
  site_address?: string;
  requested_service?: string;
  pipeline_id?: string;
  idx_pipeline_id?: IndexedContentItem;
  stage_id?: string;
  idx_stage_id?: IndexedContentItem;
  status?: ServiceRequestStatusEnum;
  assigned_pm_id?: any;
  duplicate_customer_id?: string;
  idx_duplicate_customer_id?: IndexedContentItem;
  notes?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
}

export interface ICreateServiceRequestInput {
  code?: string;
  name?: string;
  customer_id?: string;
  customer_name?: string;
  contact_phone?: string;
  contact_email?: string;
  site_address?: string;
  requested_service?: string;
  pipeline_id?: string;
  stage_id?: string;
  status?: ServiceRequestStatusEnum2;
  assigned_pm_id?: any;
  duplicate_customer_id?: string;
  notes?: string;
  journey_id?: string;
}

export type IServiceRequestListResponse = ApiListResponse<IServiceRequest>

// Union types generated from value_options
export type ServiceRequestStatusEnum = 'new' | 'in_progress' | 'won' | 'lost';
export type ServiceRequestStatusEnum2 = 'new' | 'in_progress' | 'won' | 'lost';
