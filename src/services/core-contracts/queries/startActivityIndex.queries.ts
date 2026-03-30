import { gql } from 'graphql-tag';

/**
 * Find StartActivityIndex DTO with typed data
 */
export const FIND_STARTACTIVITYINDEX_DTO = gql`
  query FindStartActivityIndexDto($_id: String!, $custominput: Dictionary) {
    response: find_StartActivityIndex_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        activityId
        workflowId
        isEnable
        parameters
        tenantId
      }
    }
  }
`;

/**
 * Query StartActivityIndexs DTO list
 */
export const QUERY_STARTACTIVITYINDEXS_DTO = gql`
  query QueryStartActivityIndexsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_StartActivityIndexs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        activityId
        workflowId
        isEnable
        parameters
        tenantId
      }
    }
  }
`;
