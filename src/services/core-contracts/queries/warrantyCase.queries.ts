import { gql } from 'graphql-tag';

/**
 * Find WarrantyCase DTO with typed data
 */
export const FIND_WARRANTYCASE_DTO = gql`
  query FindWarrantyCaseDto($_id: String!, $custominput: Dictionary) {
    response: find_WarrantyCase_dto(_id: $_id, custominput: $custominput) {
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
        journey_id
        journey_step_code
        warranty_card_id
        idx_warranty_card_id
        warranty_card_id
        source_handover_issue_id
        idx_source_handover_issue_id
        source_handover_issue_id
        project_id
        idx_project_id
        project_id
        reported_at
        issue_title
        severity
        status
        assigned_user
        latest_visit_id
        idx_latest_visit_id
        latest_visit_id
        resolved_at
        issue_detail
        resolution_note
        evidence_files
      }
    }
  }
`;

/**
 * Query WarrantyCases DTO list
 */
export const QUERY_WARRANTYCASES_DTO = gql`
  query QueryWarrantyCasesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_WarrantyCases_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        warranty_card_id
        idx_warranty_card_id
        warranty_card_id
        source_handover_issue_id
        idx_source_handover_issue_id
        source_handover_issue_id
        project_id
        idx_project_id
        project_id
        reported_at
        issue_title
        severity
        status
        assigned_user
        latest_visit_id
        idx_latest_visit_id
        latest_visit_id
        resolved_at
        issue_detail
        resolution_note
        evidence_files
      }
    }
  }
`;
