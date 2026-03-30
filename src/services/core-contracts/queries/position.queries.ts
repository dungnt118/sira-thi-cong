import { gql } from 'graphql-tag';

/**
 * Find Position DTO with typed data
 */
export const FIND_POSITION_DTO = gql`
  query FindPositionDto($_id: String!, $custominput: Dictionary) {
    response: find_Position_dto(_id: $_id, custominput: $custominput) {
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
      }
    }
  }
`;

/**
 * Query Positions DTO list
 */
export const QUERY_POSITIONS_DTO = gql`
  query QueryPositionsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Positions_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
      }
    }
  }
`;
