import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Project interface
 * Auto-generated from Schema: Project
 */
export interface IProject {
  _id: string;
  code?: string;
  name?: string;
  service_request_id?: string;
  idx_service_request_id?: IndexedContentItem;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  contract_id?: string;
  idx_contract_id?: IndexedContentItem;
  customer_id?: string;
  idx_customer_id?: IndexedContentItem;
  site_address?: string;
  pm_user?: any;
  supervisor_user?: any;
  status?: ProjectStatusEnum;
  planned_start_date?: string | Date;
  planned_end_date?: string | Date;
  note?: string;
  latest_project_settlement_id?: string;
  idx_latest_project_settlement_id?: IndexedContentItem;
  latest_closeout_package_id?: string;
  idx_latest_closeout_package_id?: IndexedContentItem;
}

export interface ICreateProjectInput {
  code?: string;
  name?: string;
  service_request_id?: string;
  journey_id?: string;
  contract_id?: string;
  customer_id?: string;
  site_address?: string;
  pm_user?: any;
  supervisor_user?: any;
  status?: ProjectStatusEnum2;
  planned_start_date?: string | Date;
  planned_end_date?: string | Date;
  note?: string;
  latest_project_settlement_id?: string;
  latest_closeout_package_id?: string;
}

export type IProjectListResponse = ApiListResponse<IProject>

// Union types generated from value_options
export type ProjectStatusEnum = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type ProjectStatusEnum2 = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';
