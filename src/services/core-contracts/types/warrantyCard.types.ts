import type { IndexedContentItem } from 'types/apis';
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
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  project_name?: string;
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
}

export interface ICreateWarrantyCardInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: WarrantyCardJourneyStepCodeEnum2;
  journey_code?: string;
  project_id?: string;
  project_name?: string;
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
}

export type IWarrantyCardListResponse = ApiListResponse<IWarrantyCard>

// Union types generated from value_options
export type WarrantyCardJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type WarrantyCardJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
