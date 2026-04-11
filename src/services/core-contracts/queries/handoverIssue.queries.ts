import { gql } from 'graphql-tag';

/**
 * Find HandoverIssue DTO with typed data
 */
export const FIND_HANDOVERISSUE_DTO = gql`
  query FindHandoverIssueDto($_id: String!, $custominput: Dictionary) {
    response: find_HandoverIssue_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        journey_id
        idx_journey_id
        journey_step_code
        handover_acceptance_id
        idx_handover_acceptance_id
        issue_title
        issue_category
        severity
        status
        assigned_user
        due_date
        linked_warranty_case_id
        idx_linked_warranty_case_id
        escalation_status
        escalated_to_warranty_at
        resolved_at
        issue_detail
        resolution_note
        evidence_files
      }
    }
  }
`;

/**
 * Query HandoverIssues DTO list
 */
export const QUERY_HANDOVERISSUES_DTO = gql`
  query QueryHandoverIssuesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_HandoverIssues_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        journey_id
        idx_journey_id
        journey_step_code
        handover_acceptance_id
        idx_handover_acceptance_id
        issue_title
        issue_category
        severity
        status
        assigned_user
        due_date
        linked_warranty_case_id
        idx_linked_warranty_case_id
        escalation_status
        escalated_to_warranty_at
        resolved_at
        issue_detail
        resolution_note
        evidence_files
      }
    }
  }
`;
