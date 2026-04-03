import { gql } from 'graphql-tag';

/**
 * Find PaymentRequest DTO with typed data
 */
export const FIND_PAYMENTREQUEST_DTO = gql`
  query FindPaymentRequestDto($_id: String!, $custominput: Dictionary) {
    response: find_PaymentRequest_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        request_date
        request_type
        priority
        requested_by
        approver_assigned
        status
        reference_code
        request_note
        supporting_files
        company_bank_account_id
        idx_company_bank_account_id
        beneficiary_bank_contact_id
        idx_beneficiary_bank_contact_id
        source_account_name_snapshot
        source_account_number_snapshot
        source_bank_name_snapshot
        beneficiary_name_snapshot
        beneficiary_account_number_snapshot
        beneficiary_bank_name_snapshot
        beneficiary_branch_snapshot
        amount
        currency
        payment_content
        submitted_at
        approved_by
        approved_at
        rejected_at
        rejection_reason
        paid_by
        paid_at
        bank_transaction_ref
        cancelled_by
        cancelled_at
        cancel_reason
        payment_proof_files
        payment_proof_note
      }
    }
  }
`;

/**
 * Query PaymentRequests DTO list
 */
export const QUERY_PAYMENTREQUESTS_DTO = gql`
  query QueryPaymentRequestsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PaymentRequests_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        request_date
        request_type
        priority
        requested_by
        approver_assigned
        status
        reference_code
        request_note
        supporting_files
        company_bank_account_id
        idx_company_bank_account_id
        beneficiary_bank_contact_id
        idx_beneficiary_bank_contact_id
        source_account_name_snapshot
        source_account_number_snapshot
        source_bank_name_snapshot
        beneficiary_name_snapshot
        beneficiary_account_number_snapshot
        beneficiary_bank_name_snapshot
        beneficiary_branch_snapshot
        amount
        currency
        payment_content
        submitted_at
        approved_by
        approved_at
        rejected_at
        rejection_reason
        paid_by
        paid_at
        bank_transaction_ref
        cancelled_by
        cancelled_at
        cancel_reason
        payment_proof_files
        payment_proof_note
      }
    }
  }
`;
