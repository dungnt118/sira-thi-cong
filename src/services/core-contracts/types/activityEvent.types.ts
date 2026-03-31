import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ActivityEvent interface
 * Auto-generated from Schema: ActivityEvent
 */
export interface IActivityEvent {
  _id: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: ActivityEventJourneyStepCodeEnum;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  service_request_id?: string;
  idx_service_request_id?: IndexedContentItem;
  category?: ActivityEventCategoryEnum;
  timestamp?: string | Date;
  actor?: string;
  action?: string;
  summary?: string;
  context?: string;
  related_entity_id?: string;
  related_entity_type?: ActivityEventRelatedEntityTypeEnum;
}

export interface ICreateActivityEventInput {
  journey_id?: string;
  journey_step_code?: ActivityEventJourneyStepCodeEnum2;
  project_id?: string;
  service_request_id?: string;
  category?: ActivityEventCategoryEnum2;
  timestamp?: string | Date;
  actor?: string;
  action?: string;
  summary?: string;
  context?: string;
  related_entity_id?: string;
  related_entity_type?: ActivityEventRelatedEntityTypeEnum2;
}

export type IActivityEventListResponse = ApiListResponse<IActivityEvent>

// Union types generated from value_options
export type ActivityEventJourneyStepCodeEnum = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type ActivityEventCategoryEnum = 'stock_order' | 'asset_allocation' | 'payment' | 'warranty' | 'incident' | 'survey' | 'quotation' | 'contract' | 'construct' | 'general';
export type ActivityEventRelatedEntityTypeEnum = 'stock_order' | 'asset_allocation' | 'payment_milestone' | 'warranty' | 'site_report' | 'incident_report' | 'journey_step';
export type ActivityEventJourneyStepCodeEnum2 = 'lead_intake' | 'qualification' | 'survey_planning' | 'site_survey' | 'survey_review' | 'estimate_preparation' | 'quotation_preparation' | 'quotation_sent' | 'quotation_approved' | 'contract_signing' | 'project_execution' | 'handover_acceptance' | 'warranty_aftercare';
export type ActivityEventCategoryEnum2 = 'stock_order' | 'asset_allocation' | 'payment' | 'warranty' | 'incident' | 'survey' | 'quotation' | 'contract' | 'construct' | 'general';
export type ActivityEventRelatedEntityTypeEnum2 = 'stock_order' | 'asset_allocation' | 'payment_milestone' | 'warranty' | 'site_report' | 'incident_report' | 'journey_step';
