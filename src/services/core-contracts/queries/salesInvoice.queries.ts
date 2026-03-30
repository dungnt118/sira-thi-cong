import { gql } from 'graphql-tag';

/**
 * Find SalesInvoice DTO with typed data
 */
export const FIND_SALESINVOICE_DTO = gql`
  query FindSalesInvoiceDto($_id: String!, $custominput: Dictionary) {
    response: find_SalesInvoice_dto(_id: $_id, custominput: $custominput) {
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
        payment_receipt_id
        idx_payment_receipt_id
        payment_receipt_id
        project_id
        idx_project_id
        project_id
        customer_id
        idx_customer_id
        customer_id
        invoice_type
        invoice_status
        invoice_date
        invoice_number
        tax_code
        amount_before_tax
        tax_amount
        total_amount
        issued_by
        sent_at
        note
        invoice_files
        contract_id
        idx_contract_id
        contract_id
      }
    }
  }
`;

/**
 * Query SalesInvoices DTO list
 */
export const QUERY_SALESINVOICES_DTO = gql`
  query QuerySalesInvoicesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_SalesInvoices_dto(filter: $filter, custominput: $custominput) {
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
        payment_receipt_id
        idx_payment_receipt_id
        payment_receipt_id
        project_id
        idx_project_id
        project_id
        customer_id
        idx_customer_id
        customer_id
        invoice_type
        invoice_status
        invoice_date
        invoice_number
        tax_code
        amount_before_tax
        tax_amount
        total_amount
        issued_by
        sent_at
        note
        invoice_files
        contract_id
        idx_contract_id
        contract_id
      }
    }
  }
`;
