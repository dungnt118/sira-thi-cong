import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * HandoverIssue interface
 * Auto-generated from Schema: HandoverIssue
 */
export interface IHandoverIssue {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  journey_step_code?: HandoverIssueJourneyStepCodeEnum;
  handover_acceptance_id?: string;
  idx_handover_acceptance_id?: IndexedContentItem;
  project_id?: string;
  idx_project_id?: IndexedContentItem;
  issue_title?: string;
  issue_category?: HandoverIssueIssueCategoryEnum;
  severity?: HandoverIssueSeverityEnum;
  status?: HandoverIssueStatusEnum;
  assigned_user?: any;
  due_date?: string | Date;
  linked_warranty_case_id?: string;
  idx_linked_warranty_case_id?: IndexedContentItem;
  escalation_status?: HandoverIssueEscalationStatusEnum;
  escalated_to_warranty_at?: string | Date;
  resolved_at?: string | Date;
  issue_detail?: string;
  resolution_note?: string;
  evidence_files?: HeadlessFileUpload[];
}

export interface ICreateHandoverIssueInput {
  code?: string;
  journey_id?: string;
  journey_step_code?: HandoverIssueJourneyStepCodeEnum2;
  handover_acceptance_id?: string;
  project_id?: string;
  issue_title?: string;
  issue_category?: HandoverIssueIssueCategoryEnum2;
  severity?: HandoverIssueSeverityEnum2;
  status?: HandoverIssueStatusEnum2;
  assigned_user?: any;
  due_date?: string | Date;
  linked_warranty_case_id?: string;
  escalation_status?: HandoverIssueEscalationStatusEnum2;
  escalated_to_warranty_at?: string | Date;
  resolved_at?: string | Date;
  issue_detail?: string;
  resolution_note?: string;
  evidence_files?: HeadlessFileUpload[];
}

export type IHandoverIssueListResponse = ApiListResponse<IHandoverIssue>

// Union types generated from value_options
export type HandoverIssueJourneyStepCodeEnum = 'handover_acceptance' | 'project_execution' | 'warranty_aftercare';
export type HandoverIssueIssueCategoryEnum = 'quality' | 'material' | 'cleaning' | 'document' | 'other';
export type HandoverIssueSeverityEnum = 'low' | 'medium' | 'high' | 'critical';
export type HandoverIssueStatusEnum = 'open' | 'assigned' | 'in_progress' | 'awaiting_confirmation' | 'resolved' | 'closed';
export type HandoverIssueEscalationStatusEnum = 'none' | 'proposed' | 'converted' | 'rejected';
export type HandoverIssueJourneyStepCodeEnum2 = 'handover_acceptance' | 'project_execution' | 'warranty_aftercare';
export type HandoverIssueIssueCategoryEnum2 = 'quality' | 'material' | 'cleaning' | 'document' | 'other';
export type HandoverIssueSeverityEnum2 = 'low' | 'medium' | 'high' | 'critical';
export type HandoverIssueStatusEnum2 = 'open' | 'assigned' | 'in_progress' | 'awaiting_confirmation' | 'resolved' | 'closed';
export type HandoverIssueEscalationStatusEnum2 = 'none' | 'proposed' | 'converted' | 'rejected';
