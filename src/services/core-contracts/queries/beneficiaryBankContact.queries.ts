import { gql } from 'graphql-tag';

/**
 * Find BeneficiaryBankContact DTO with typed data
 */
export const FIND_BENEFICIARYBANKCONTACT_DTO = gql`
  query FindBeneficiaryBankContactDto($_id: String!, $custominput: Dictionary) {
    response: find_BeneficiaryBankContact_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        contact_type
        contact_name
        phone
        email
        linked_distributor_id
        idx_linked_distributor_id
        bank_account_name
        bank_account_number
        bank_name
        branch_name
        identity_no
        tax_code
        is_frequent
        status
        note
      }
    }
  }
`;

/**
 * Query BeneficiaryBankContacts DTO list
 */
export const QUERY_BENEFICIARYBANKCONTACTS_DTO = gql`
  query QueryBeneficiaryBankContactsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_BeneficiaryBankContacts_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        contact_type
        contact_name
        phone
        email
        linked_distributor_id
        idx_linked_distributor_id
        bank_account_name
        bank_account_number
        bank_name
        branch_name
        identity_no
        tax_code
        is_frequent
        status
        note
      }
    }
  }
`;
