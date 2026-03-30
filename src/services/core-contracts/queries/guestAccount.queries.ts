import { gql } from 'graphql-tag';

/**
 * Find GuestAccount DTO with typed data
 */
export const FIND_GUESTACCOUNT_DTO = gql`
  query FindGuestAccountDto($_id: String!, $custominput: Dictionary) {
    response: find_GuestAccount_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        passwordHash
        password
        audience
        avatar
        fullName
        type
        email
        phoneNumber
        title
        tenantId
      }
    }
  }
`;

/**
 * Query GuestAccounts DTO list
 */
export const QUERY_GUESTACCOUNTS_DTO = gql`
  query QueryGuestAccountsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_GuestAccounts_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        passwordHash
        password
        audience
        avatar
        fullName
        type
        email
        phoneNumber
        title
        tenantId
      }
    }
  }
`;
