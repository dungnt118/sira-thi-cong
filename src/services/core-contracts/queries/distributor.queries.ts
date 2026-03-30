import { gql } from 'graphql-tag';

/**
 * Find Distributor DTO with typed data
 */
export const FIND_DISTRIBUTOR_DTO = gql`
  query FindDistributorDto($_id: String!, $custominput: Dictionary) {
    response: find_Distributor_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        name
        phone
        email
        address
        categories
      }
    }
  }
`;

/**
 * Query Distributors DTO list
 */
export const QUERY_DISTRIBUTORS_DTO = gql`
  query QueryDistributorsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Distributors_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        phone
        email
        address
        categories
      }
    }
  }
`;
