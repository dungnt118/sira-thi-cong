import { gql } from 'graphql-tag';

/**
 * Find CompanyBankAccount DTO with typed data
 */
export const FIND_COMPANYBANKACCOUNT_DTO = gql`
  query FindCompanyBankAccountDto($_id: String!, $custominput: Dictionary) {
    response: find_CompanyBankAccount_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        account_name
        account_number
        bank_name
        branch_name
        company_name
        currency
        is_default
        status
        note
      }
    }
  }
`;

/**
 * Query CompanyBankAccounts DTO list
 */
export const QUERY_COMPANYBANKACCOUNTS_DTO = gql`
  query QueryCompanyBankAccountsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_CompanyBankAccounts_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        account_name
        account_number
        bank_name
        branch_name
        company_name
        currency
        is_default
        status
        note
      }
    }
  }
`;
