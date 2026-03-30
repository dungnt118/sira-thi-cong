import { gql } from 'graphql-tag';

/**
 * Find PaymentAdjustment DTO with typed data
 */
export const FIND_PAYMENTADJUSTMENT_DTO = gql`
  query FindPaymentAdjustmentDto($_id: String!, $custominput: Dictionary) {
    response: find_PaymentAdjustment_dto(_id: $_id, custominput: $custominput) {
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
        payment_milestone_id
        idx_payment_milestone_id
        payment_milestone_id
        project_id
        idx_project_id
        project_id
        adjustment_type
        status
        current_amount
        proposed_amount
        delta_amount
        current_due_date
        proposed_due_date
        effective_date
        requested_by
        approved_by
        reason
        note
        evidence_files
      }
    }
  }
`;

/**
 * Query PaymentAdjustments DTO list
 */
export const QUERY_PAYMENTADJUSTMENTS_DTO = gql`
  query QueryPaymentAdjustmentsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PaymentAdjustments_dto(filter: $filter, custominput: $custominput) {
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
        payment_milestone_id
        idx_payment_milestone_id
        payment_milestone_id
        project_id
        idx_project_id
        project_id
        adjustment_type
        status
        current_amount
        proposed_amount
        delta_amount
        current_due_date
        proposed_due_date
        effective_date
        requested_by
        approved_by
        reason
        note
        evidence_files
      }
    }
  }
`;
