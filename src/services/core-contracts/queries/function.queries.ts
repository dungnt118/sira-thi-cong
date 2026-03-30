import { gql } from 'graphql-tag';

/**
 * Find Function DTO with typed data
 */
export const FIND_FUNCTION_DTO = gql`
  query FindFunctionDto($_id: String!, $custominput: Dictionary) {
    response: find_Function_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        sequence
        command
        expression
        type
        parameters
        disabled
      }
    }
  }
`;

/**
 * Query Functions DTO list
 */
export const QUERY_FUNCTIONS_DTO = gql`
  query QueryFunctionsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Functions_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        sequence
        command
        expression
        type
        parameters
        disabled
      }
    }
  }
`;
