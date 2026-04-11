import { gql } from 'graphql-tag';

/**
 * Find PaymentMilestone DTO with typed data
 */
export const FIND_PAYMENTMILESTONE_DTO = gql`
  query FindPaymentMilestoneDto($_id: String!, $custominput: Dictionary) {
    response: find_PaymentMilestone_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        journey_id
        idx_journey_id
        journey_step_code
        journey_code
        quotation_id
        idx_quotation_id
        round
        percentage
        amount
        due_date
        status
        amount_received_total
        remaining_amount
        receipt_count
        paid_at
        paid_by
        last_receipt_date
        latest_receipt_id
        idx_latest_receipt_id
        latest_invoice_id
        idx_latest_invoice_id
        latest_adjustment_id
        idx_latest_adjustment_id
        latest_debt_confirmation_id
        idx_latest_debt_confirmation_id
        latest_collection_task_id
        idx_latest_collection_task_id
        receipt_note
        journey_name
      }
    }
  }
`;

/**
 * Query PaymentMilestones DTO list
 */
export const QUERY_PAYMENTMILESTONES_DTO = gql`
  query QueryPaymentMilestonesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PaymentMilestones_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        journey_id
        idx_journey_id
        journey_step_code
        journey_code
        quotation_id
        idx_quotation_id
        round
        percentage
        amount
        due_date
        status
        amount_received_total
        remaining_amount
        receipt_count
        paid_at
        paid_by
        last_receipt_date
        latest_receipt_id
        idx_latest_receipt_id
        latest_invoice_id
        idx_latest_invoice_id
        latest_adjustment_id
        idx_latest_adjustment_id
        latest_debt_confirmation_id
        idx_latest_debt_confirmation_id
        latest_collection_task_id
        idx_latest_collection_task_id
        receipt_note
        journey_name
      }
    }
  }
`;
