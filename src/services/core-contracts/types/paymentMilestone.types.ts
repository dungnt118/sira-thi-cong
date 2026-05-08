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
  quotation_id?: string;
  idx_quotation_id?: IndexedContentItem;
  round?: number;
  percentage?: number;
  amount?: number;
  due_date?: string | Date;
  status?: PaymentMilestoneStatusEnum;
  /** Loại đợt thanh toán — phân loại theo bản chất nghiệp vụ, độc lập với journey_step_code. */
  kind?: PaymentMilestoneKindEnum;
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
  journey_name?: string;
  //deprecated fields
  // project_id?: string;
  // idx_project_id?: IndexedContentItem;
  // project_name?: string;
  // contract_id?: string;
  // idx_contract_id?: IndexedContentItem;
}

export interface ICreatePaymentMilestoneInput {
  journey_id?: string;
  journey_step_code?: PaymentMilestoneJourneyStepCodeEnum2;
  journey_code?: string;
  quotation_id?: string;
  round?: number;
  percentage?: number;
  amount?: number;
  due_date?: string | Date;
  status?: PaymentMilestoneStatusEnum2;
  kind?: PaymentMilestoneKindEnum;
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
  journey_name?: string;
  //deprecated fields
  // project_id?: string;
  // project_name?: string;
  // contract_id?: string;
}

export type IPaymentMilestoneListResponse = ApiListResponse<IPaymentMilestone>

// Union types generated from value_options
export type PaymentMilestoneJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PaymentMilestoneStatusEnum = 'pending' | 'partially_paid' | 'paid' | 'overdue';
export type PaymentMilestoneJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PaymentMilestoneStatusEnum2 = 'pending' | 'partially_paid' | 'paid' | 'overdue';
/**
 * Loại đợt thanh toán (phân loại nghiệp vụ, độc lập với journey_step_code).
 * - advance_deposit: Tạm ứng / Đặt cọc đầu kỳ (có thể phát sinh ở nhiều bước theo lịch hợp đồng).
 * - progress_payment: Thanh toán theo tiến độ thi công (mặc định).
 * - retention: Giữ lại bảo hành (5–10% sau bàn giao, giải ngân khi hết hạn BH).
 * - final_settlement: Quyết toán / Thanh lý hợp đồng.
 * - other: Khác (escape hatch).
 */
export type PaymentMilestoneKindEnum =
    | 'advance_deposit'
    | 'progress_payment'
    | 'retention'
    | 'final_settlement'
    | 'other';
