import { gql } from 'graphql-tag';

/**
 * Find WarrantyVisit DTO with typed data
 */
export const FIND_WARRANTYVISIT_DTO = gql`
  query FindWarrantyVisitDto($_id: String!, $custominput: Dictionary) {
    response: find_WarrantyVisit_dto(_id: $_id, custominput: $custominput) {
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
        warranty_case_id
        idx_warranty_case_id
        warranty_card_id
        idx_warranty_card_id
        scheduled_at
        visit_status
        performed_by
        started_at
        completed_at
        result
        work_summary
        next_action
        evidence_files
        note
      }
    }
  }
`;

/**
 * Query WarrantyVisits DTO list
 */
export const QUERY_WARRANTYVISITS_DTO = gql`
  query QueryWarrantyVisitsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_WarrantyVisits_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        journey_id
        idx_journey_id
        journey_step_code
        warranty_case_id
        idx_warranty_case_id
        warranty_card_id
        idx_warranty_card_id
        scheduled_at
        visit_status
        performed_by
        started_at
        completed_at
        result
        work_summary
        next_action
        evidence_files
        note
      }
    }
  }
`;
