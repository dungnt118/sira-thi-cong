import { gql } from 'graphql-tag';

/**
 * Find BlockingActivityIndex DTO with typed data
 */
export const FIND_BLOCKINGACTIVITYINDEX_DTO = gql`
  query FindBlockingActivityIndexDto($_id: String!, $custominput: Dictionary) {
    response: find_BlockingActivityIndex_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        workflowId
        instanceId
        activityId
        isStart
        name
        parameters
        tenantId
      }
    }
  }
`;

/**
 * Query BlockingActivityIndexs DTO list
 */
export const QUERY_BLOCKINGACTIVITYINDEXS_DTO = gql`
  query QueryBlockingActivityIndexsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_BlockingActivityIndexs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        workflowId
        instanceId
        activityId
        isStart
        name
        parameters
        tenantId
      }
    }
  }
`;
