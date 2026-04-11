import { gql } from 'graphql-tag';

/**
 * Find ProjectSettlement DTO with typed data
 */
export const FIND_PROJECTSETTLEMENT_DTO = gql`
  query FindProjectSettlementDto($_id: String!, $custominput: Dictionary) {
    response: find_ProjectSettlement_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        settlement_date
        status
        journey_id
        idx_journey_id
        journey_step_code
        customer_id
        idx_customer_id
        handover_acceptance_id
        idx_handover_acceptance_id
        latest_debt_confirmation_id
        idx_latest_debt_confirmation_id
        latest_invoice_id
        idx_latest_invoice_id
        contract_value
        approved_appendix_total
        invoiced_total
        received_total
        adjustment_total
        settlement_value
        outstanding_amount
        decision_note
        discrepancy_note
        evidence_files
      }
    }
  }
`;

/**
 * Query ProjectSettlements DTO list
 */
export const QUERY_PROJECTSETTLEMENTS_DTO = gql`
  query QueryProjectSettlementsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ProjectSettlements_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        settlement_date
        status
        journey_id
        idx_journey_id
        journey_step_code
        customer_id
        idx_customer_id
        handover_acceptance_id
        idx_handover_acceptance_id
        latest_debt_confirmation_id
        idx_latest_debt_confirmation_id
        latest_invoice_id
        idx_latest_invoice_id
        contract_value
        approved_appendix_total
        invoiced_total
        received_total
        adjustment_total
        settlement_value
        outstanding_amount
        decision_note
        discrepancy_note
        evidence_files
      }
    }
  }
`;
