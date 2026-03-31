import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * SurveyAppointment interface
 * Auto-generated from Schema: SurveyAppointment
 */
export interface ISurveyAppointment {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: SurveyAppointmentJourneyStepCodeEnum;
  service_request_id?: string;
  idx_service_request_id?: IndexedContentItem;
  customer_id?: string;
  idx_customer_id?: IndexedContentItem;
  scheduled_at?: string | Date;
  appointment_status?: SurveyAppointmentAppointmentStatusEnum;
  assigned_user?: any;
  confirmed_by_customer?: boolean;
  confirmed_at?: string | Date;
  reschedule_reason?: string;
  note?: string;
}

export interface ICreateSurveyAppointmentInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: SurveyAppointmentJourneyStepCodeEnum2;
  service_request_id?: string;
  customer_id?: string;
  scheduled_at?: string | Date;
  appointment_status?: SurveyAppointmentAppointmentStatusEnum2;
  assigned_user?: any;
  confirmed_by_customer?: boolean;
  confirmed_at?: string | Date;
  reschedule_reason?: string;
  note?: string;
}

export type ISurveyAppointmentListResponse = ApiListResponse<ISurveyAppointment>

// Union types generated from value_options
export type SurveyAppointmentJourneyStepCodeEnum = 'survey_planning' | 'site_survey' | 'survey_review';
export type SurveyAppointmentAppointmentStatusEnum = 'draft' | 'scheduled' | 'confirmed' | 'rescheduled' | 'cancelled';
export type SurveyAppointmentJourneyStepCodeEnum2 = 'survey_planning' | 'site_survey' | 'survey_review';
export type SurveyAppointmentAppointmentStatusEnum2 = 'draft' | 'scheduled' | 'confirmed' | 'rescheduled' | 'cancelled';
