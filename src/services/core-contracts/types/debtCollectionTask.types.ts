import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * DebtCollectionTask interface
 * Auto-generated from Schema: DebtCollectionTask
 */
export interface IDebtCollectionTask {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: DebtCollectionTaskJourneyStepCodeEnum;
  payment_milestone_id?: string;
  idx_payment_milestone_id?: IndexedContentItem;
  debt_confirmation_id?: string;
  idx_debt_confirmation_id?: IndexedContentItem;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  customer_id?: string;
  idx_customer_id?: IndexedContentItem;
  task_type?: DebtCollectionTaskTaskTypeEnum;
  status?: DebtCollectionTaskStatusEnum;
  assigned_user?: any;
  scheduled_at?: string | Date;
  completed_at?: string | Date;
  debt_amount?: number;
  customer_commitment_date?: string | Date;
  result_note?: string;
  next_action?: string;
  evidence_files?: HeadlessFileUpload[];
  contract_id?: string;
  idx_contract_id?: IndexedContentItem;
}

export interface ICreateDebtCollectionTaskInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: DebtCollectionTaskJourneyStepCodeEnum2;
  payment_milestone_id?: string;
  debt_confirmation_id?: string;
  project_id?: string;
  customer_id?: string;
  task_type?: DebtCollectionTaskTaskTypeEnum2;
  status?: DebtCollectionTaskStatusEnum2;
  assigned_user?: any;
  scheduled_at?: string | Date;
  completed_at?: string | Date;
  debt_amount?: number;
  customer_commitment_date?: string | Date;
  result_note?: string;
  next_action?: string;
  evidence_files?: HeadlessFileUpload[];
  contract_id?: string;
}

export type IDebtCollectionTaskListResponse = ApiListResponse<IDebtCollectionTask>

// Union types generated from value_options
export type DebtCollectionTaskJourneyStepCodeEnum = 'contract_signing' | 'handover_acceptance' | 'warranty_aftercare';
export type DebtCollectionTaskTaskTypeEnum = 'reminder_call' | 'reminder_message' | 'commitment_follow_up' | 'escalation';
export type DebtCollectionTaskStatusEnum = 'open' | 'in_progress' | 'committed' | 'completed' | 'overdue' | 'cancelled';
export type DebtCollectionTaskJourneyStepCodeEnum2 = 'contract_signing' | 'handover_acceptance' | 'warranty_aftercare';
export type DebtCollectionTaskTaskTypeEnum2 = 'reminder_call' | 'reminder_message' | 'commitment_follow_up' | 'escalation';
export type DebtCollectionTaskStatusEnum2 = 'open' | 'in_progress' | 'committed' | 'completed' | 'overdue' | 'cancelled';
