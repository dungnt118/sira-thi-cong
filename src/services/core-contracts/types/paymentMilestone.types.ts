import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PaymentMilestone interface
 * Auto-generated from Schema: PaymentMilestone
 */
export interface IPaymentMilestone {
  _id: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: PaymentMilestoneJourneyStepCodeEnum;
  journey_code?: string;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  project_name?: string;
  quotation_id?: string;
  idx_quotation_id?: IndexedContentItem;
  round?: number;
  percentage?: number;
  amount?: number;
  due_date?: string | Date;
  status?: PaymentMilestoneStatusEnum;
  amount_received_total?: number;
  remaining_amount?: number;
  receipt_count?: number;
  paid_at?: string | Date;
  paid_by?: any;
  last_receipt_date?: string | Date;
  latest_receipt_id?: string;
  idx_latest_receipt_id?: IndexedContentItem;
  latest_invoice_id?: string;
  idx_latest_invoice_id?: IndexedContentItem;
  latest_adjustment_id?: string;
  idx_latest_adjustment_id?: IndexedContentItem;
  latest_debt_confirmation_id?: string;
  idx_latest_debt_confirmation_id?: IndexedContentItem;
  latest_collection_task_id?: string;
  idx_latest_collection_task_id?: IndexedContentItem;
  receipt_note?: string;
  contract_id?: string;
  idx_contract_id?: IndexedContentItem;
  journey_name?: string;
}

export interface ICreatePaymentMilestoneInput {
  journey_id?: string;
  journey_step_code?: PaymentMilestoneJourneyStepCodeEnum2;
  journey_code?: string;
  project_id?: string;
  project_name?: string;
  quotation_id?: string;
  round?: number;
  percentage?: number;
  amount?: number;
  due_date?: string | Date;
  status?: PaymentMilestoneStatusEnum2;
  amount_received_total?: number;
  remaining_amount?: number;
  receipt_count?: number;
  paid_at?: string | Date;
  paid_by?: any;
  last_receipt_date?: string | Date;
  latest_receipt_id?: string;
  latest_invoice_id?: string;
  latest_adjustment_id?: string;
  latest_debt_confirmation_id?: string;
  latest_collection_task_id?: string;
  receipt_note?: string;
  contract_id?: string;
  journey_name?: string;
}

export type IPaymentMilestoneListResponse = ApiListResponse<IPaymentMilestone>

// Union types generated from value_options
export type PaymentMilestoneJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type PaymentMilestoneStatusEnum = 'pending' | 'partially_paid' | 'paid' | 'overdue';
export type PaymentMilestoneJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type PaymentMilestoneStatusEnum2 = 'pending' | 'partially_paid' | 'paid' | 'overdue';
