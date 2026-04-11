import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PaymentAdjustment interface
 * Auto-generated from Schema: PaymentAdjustment
 */
export interface IPaymentAdjustment {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: PaymentAdjustmentJourneyStepCodeEnum;
  payment_milestone_id?: string;
  idx_payment_milestone_id?: IndexedContentItem;
  adjustment_type?: PaymentAdjustmentAdjustmentTypeEnum;
  status?: PaymentAdjustmentStatusEnum;
  current_amount?: number;
  proposed_amount?: number;
  delta_amount?: number;
  current_due_date?: string | Date;
  proposed_due_date?: string | Date;
  effective_date?: string | Date;
  requested_by?: any;
  approved_by?: any;
  reason?: string;
  note?: string;
  evidence_files?: HeadlessFileUpload[];
}

export interface ICreatePaymentAdjustmentInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: PaymentAdjustmentJourneyStepCodeEnum2;
  payment_milestone_id?: string;
  adjustment_type?: PaymentAdjustmentAdjustmentTypeEnum2;
  status?: PaymentAdjustmentStatusEnum2;
  current_amount?: number;
  proposed_amount?: number;
  delta_amount?: number;
  current_due_date?: string | Date;
  proposed_due_date?: string | Date;
  effective_date?: string | Date;
  requested_by?: any;
  approved_by?: any;
  reason?: string;
  note?: string;
  evidence_files?: HeadlessFileUpload[];
}

export type IPaymentAdjustmentListResponse = ApiListResponse<IPaymentAdjustment>

// Union types generated from value_options
export type PaymentAdjustmentJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PaymentAdjustmentAdjustmentTypeEnum = 'increase' | 'decrease' | 'reschedule' | 'waiver' | 'other';
export type PaymentAdjustmentStatusEnum = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'applied';
export type PaymentAdjustmentJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PaymentAdjustmentAdjustmentTypeEnum2 = 'increase' | 'decrease' | 'reschedule' | 'waiver' | 'other';
export type PaymentAdjustmentStatusEnum2 = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'applied';
