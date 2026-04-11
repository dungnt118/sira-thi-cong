import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PortalMessage interface
 * Auto-generated from Schema: PortalMessage
 */
export interface IPortalMessage {
  _id: string;
  thread_id?: string;
  idx_thread_id?: IndexedContentItem;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: PortalMessageJourneyStepCodeEnum;
  sender?: string;
  sender_role?: PortalMessageSenderRoleEnum;
  message_body?: string;
  attachments?: HeadlessFileUpload[];
  official_response?: boolean;
  sent_at?: string | Date;
}

export interface ICreatePortalMessageInput {
  thread_id?: string;
  journey_id?: string;
  journey_step_code?: PortalMessageJourneyStepCodeEnum2;
  sender?: string;
  sender_role?: PortalMessageSenderRoleEnum2;
  message_body?: string;
  attachments?: HeadlessFileUpload[];
  official_response?: boolean;
  sent_at?: string | Date;
}

export type IPortalMessageListResponse = ApiListResponse<IPortalMessage>

// Union types generated from value_options
export type PortalMessageJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PortalMessageSenderRoleEnum = 'customer' | 'pm' | 'sale';
export type PortalMessageJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PortalMessageSenderRoleEnum2 = 'customer' | 'pm' | 'sale';
