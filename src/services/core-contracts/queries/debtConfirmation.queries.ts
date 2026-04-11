import { gql } from 'graphql-tag';

/**
 * Find DebtConfirmation DTO with typed data
 */
export const FIND_DEBTCONFIRMATION_DTO = gql`
  query FindDebtConfirmationDto($_id: String!, $custominput: Dictionary) {
    response: find_DebtConfirmation_dto(_id: $_id, custominput: $custominput) {
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
        payment_milestone_id
        idx_payment_milestone_id
        customer_id
        idx_customer_id
        confirmation_date
        status
        debt_amount
        amount_confirmed_by_customer
        difference_amount
        confirmed_by_customer_name
        confirmed_by_company
        confirmed_at
        payment_commitment_date
        reason
        evidence_files
      }
    }
  }
`;

/**
 * Query DebtConfirmations DTO list
 */
export const QUERY_DEBTCONFIRMATIONS_DTO = gql`
  query QueryDebtConfirmationsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_DebtConfirmations_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        journey_id
        idx_journey_id
        journey_step_code
        payment_milestone_id
        idx_payment_milestone_id
        customer_id
        idx_customer_id
        confirmation_date
        status
        debt_amount
        amount_confirmed_by_customer
        difference_amount
        confirmed_by_customer_name
        confirmed_by_company
        confirmed_at
        payment_commitment_date
        reason
        evidence_files
      }
    }
  }
`;
