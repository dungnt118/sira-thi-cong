import { gql } from 'graphql-tag';

/**
 * Find PaymentReceipt DTO with typed data
 */
export const FIND_PAYMENTRECEIPT_DTO = gql`
  query FindPaymentReceiptDto($_id: String!, $custominput: Dictionary) {
    response: find_PaymentReceipt_dto(_id: $_id, custominput: $custominput) {
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
        receipt_date
        receipt_method
        amount_received
        transaction_ref
        collected_by
        proof_files
        note
        contract_id
        idx_contract_id
        contract_id
      }
    }
  }
`;

/**
 * Query PaymentReceipts DTO list
 */
export const QUERY_PAYMENTRECEIPTS_DTO = gql`
  query QueryPaymentReceiptsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PaymentReceipts_dto(filter: $filter, custominput: $custominput) {
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
        receipt_date
        receipt_method
        amount_received
        transaction_ref
        collected_by
        proof_files
        note
        contract_id
        idx_contract_id
        contract_id
      }
    }
  }
`;
