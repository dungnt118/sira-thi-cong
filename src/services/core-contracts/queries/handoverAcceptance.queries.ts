import { gql } from 'graphql-tag';

/**
 * Find HandoverAcceptance DTO with typed data
 */
export const FIND_HANDOVERACCEPTANCE_DTO = gql`
  query FindHandoverAcceptanceDto($_id: String!, $custominput: Dictionary) {
    response: find_HandoverAcceptance_dto(_id: $_id, custominput: $custominput) {
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
        project_id
        idx_project_id
        project_id
        handover_date
        acceptance_status
        accepted_by_customer
        company_representative
        acceptance_note
        issue_note
        evidence_files
        signature_customer
        signature_company
        contract_id
        idx_contract_id
        contract_id
      }
    }
  }
`;

/**
 * Query HandoverAcceptances DTO list
 */
export const QUERY_HANDOVERACCEPTANCES_DTO = gql`
  query QueryHandoverAcceptancesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_HandoverAcceptances_dto(filter: $filter, custominput: $custominput) {
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
        project_id
        idx_project_id
        project_id
        handover_date
        acceptance_status
        accepted_by_customer
        company_representative
        acceptance_note
        issue_note
        evidence_files
        signature_customer
        signature_company
        contract_id
        idx_contract_id
        contract_id
      }
    }
  }
`;
