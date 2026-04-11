import { gql } from 'graphql-tag';

/**
 * Find Customer DTO with typed data
 */
export const FIND_CUSTOMER_DTO = gql`
  query FindCustomerDto($_id: String!, $custominput: Dictionary) {
    response: find_Customer_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        full_name
        phone
        email
        zalo
        city
        province
        ward
        address
        assigned_pm_id
        notes
        bod
        sex
        marriage_state
        geo
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  }
`;

/**
 * Query Customers DTO list
 */
export const QUERY_CUSTOMERS_DTO = gql`
  query QueryCustomersDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Customers_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        full_name
        phone
        email
        zalo
        city
        province
        ward
        address
        assigned_pm_id
        notes
        bod
        sex
        marriage_state
        geo
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  }
`;
