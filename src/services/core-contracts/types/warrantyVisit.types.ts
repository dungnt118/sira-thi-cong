import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * WarrantyVisit interface
 * Auto-generated from Schema: WarrantyVisit
 */
export interface IWarrantyVisit {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: WarrantyVisitJourneyStepCodeEnum;
  warranty_case_id?: string;
  idx_warranty_case_id?: IndexedContentItem;
  warranty_card_id?: string;
  idx_warranty_card_id?: IndexedContentItem;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  scheduled_at?: string | Date;
  visit_status?: WarrantyVisitVisitStatusEnum;
  performed_by?: any;
  started_at?: string | Date;
  completed_at?: string | Date;
  result?: WarrantyVisitResultEnum;
  work_summary?: string;
  next_action?: string;
  evidence_files?: HeadlessFileUpload[];
  note?: string;
}

export interface ICreateWarrantyVisitInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: WarrantyVisitJourneyStepCodeEnum2;
  warranty_case_id?: string;
  warranty_card_id?: string;
  project_id?: string;
  scheduled_at?: string | Date;
  visit_status?: WarrantyVisitVisitStatusEnum2;
  performed_by?: any;
  started_at?: string | Date;
  completed_at?: string | Date;
  result?: WarrantyVisitResultEnum2;
  work_summary?: string;
  next_action?: string;
  evidence_files?: HeadlessFileUpload[];
  note?: string;
}

export type IWarrantyVisitListResponse = ApiListResponse<IWarrantyVisit>

// Union types generated from value_options
export type WarrantyVisitJourneyStepCodeEnum = 'warranty_aftercare' | 'handover_acceptance' | 'project_execution';
export type WarrantyVisitVisitStatusEnum = 'scheduled' | 'in_progress' | 'completed' | 'rescheduled' | 'cancelled';
export type WarrantyVisitResultEnum = 'fixed' | 'follow_up_required' | 'customer_absent' | 'outside_scope' | 'cancelled';
export type WarrantyVisitJourneyStepCodeEnum2 = 'warranty_aftercare' | 'handover_acceptance' | 'project_execution';
export type WarrantyVisitVisitStatusEnum2 = 'scheduled' | 'in_progress' | 'completed' | 'rescheduled' | 'cancelled';
export type WarrantyVisitResultEnum2 = 'fixed' | 'follow_up_required' | 'customer_absent' | 'outside_scope' | 'cancelled';
