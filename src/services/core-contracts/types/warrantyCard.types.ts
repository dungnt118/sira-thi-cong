import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * WarrantyCard interface
 * Auto-generated from Schema: WarrantyCard
 */
export interface IWarrantyCard {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: WarrantyCardJourneyStepCodeEnum;
  journey_code?: string;
  customer_name?: string;
  customer_phone?: string;
  address?: string;
  construction_type?: string;
  idx_construction_type?: IndexedContentItem;
  area_m2?: number;
  completed_date?: string | Date;
  warranty_months?: number;
  expiry_date?: string | Date;
  issued_at?: string | Date;
  materials?: string[];
  qr_code?: string;
  journey_name?: string;
  //deprecated fields
  // project_id?: string;
  // idx_project_id?: IndexedContentItem;
  // project_name?: string;
}

export interface ICreateWarrantyCardInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: WarrantyCardJourneyStepCodeEnum2;
  journey_code?: string;
  customer_name?: string;
  customer_phone?: string;
  address?: string;
  construction_type?: string;
  area_m2?: number;
  completed_date?: string | Date;
  warranty_months?: number;
  expiry_date?: string | Date;
  issued_at?: string | Date;
  materials?: string[];
  qr_code?: string;
  journey_name?: string;
  //deprecated fields
  // project_id?: string;
  // project_name?: string;
}

export type IWarrantyCardListResponse = ApiListResponse<IWarrantyCard>

// Union types generated from value_options
export type WarrantyCardJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type WarrantyCardJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
