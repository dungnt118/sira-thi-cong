import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * WarrantyReminder interface
 * Auto-generated from Schema: WarrantyReminder
 */
export interface IWarrantyReminder {
  _id: string;
  warranty_card_id?: string;
  idx_warranty_card_id?: IndexedContentItem;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: WarrantyReminderJourneyStepCodeEnum;
  customer_name?: string;
  customer_phone?: string;
  channel?: WarrantyReminderChannelEnum;
  scheduled_at?: string | Date;
  sent_at?: string | Date;
  status?: WarrantyReminderStatusEnum;
  message?: string;
  journey_name?: string;
  //deprecated fields
  // project_name?: string;
}

export interface ICreateWarrantyReminderInput {
  warranty_card_id?: string;
  journey_id?: string;
  journey_step_code?: WarrantyReminderJourneyStepCodeEnum2;
  customer_name?: string;
  customer_phone?: string;
  channel?: WarrantyReminderChannelEnum2;
  scheduled_at?: string | Date;
  sent_at?: string | Date;
  status?: WarrantyReminderStatusEnum2;
  message?: string;
  journey_name?: string;
  //deprecated fields
  // project_name?: string;
}

export type IWarrantyReminderListResponse = ApiListResponse<IWarrantyReminder>

// Union types generated from value_options
export type WarrantyReminderJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type WarrantyReminderChannelEnum = 'sms' | 'zalo';
export type WarrantyReminderStatusEnum = 'pending' | 'sent' | 'failed';
export type WarrantyReminderJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type WarrantyReminderChannelEnum2 = 'sms' | 'zalo';
export type WarrantyReminderStatusEnum2 = 'pending' | 'sent' | 'failed';
