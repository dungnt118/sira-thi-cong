import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PortalThread interface
 * Auto-generated from Schema: PortalThread
 */
export interface IPortalThread {
  _id: string;
  thread_code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: PortalThreadJourneyStepCodeEnum;
  context_type?: PortalThreadContextTypeEnum;
  context_label?: string;
  status?: PortalThreadStatusEnum;
  last_message_at?: string | Date;
  unread_count?: number;
}

export interface ICreatePortalThreadInput {
  thread_code?: string;
  journey_id?: string;
  journey_step_code?: PortalThreadJourneyStepCodeEnum2;
  context_type?: PortalThreadContextTypeEnum2;
  context_label?: string;
  status?: PortalThreadStatusEnum2;
  last_message_at?: string | Date;
  unread_count?: number;
}

export type IPortalThreadListResponse = ApiListResponse<IPortalThread>

// Union types generated from value_options
export type PortalThreadJourneyStepCodeEnum = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PortalThreadContextTypeEnum = 'survey' | 'progress' | 'payment' | 'general' | 'quotation';
export type PortalThreadStatusEnum = 'open' | 'waiting' | 'closed';
export type PortalThreadJourneyStepCodeEnum2 = 'lead_new' | 'consult_contact' | 'site_survey' | 'solution_design' | 'quotation' | 'contract' | 'execution' | 'final_acceptance' | 'payment' | 'maintenance' | 'warranty' | 'after_sales';
export type PortalThreadContextTypeEnum2 = 'survey' | 'progress' | 'payment' | 'general' | 'quotation';
export type PortalThreadStatusEnum2 = 'open' | 'waiting' | 'closed';
