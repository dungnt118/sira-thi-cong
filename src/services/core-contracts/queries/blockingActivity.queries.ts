import { gql } from 'graphql-tag';

/**
 * Find BlockingActivity DTO with typed data
 */
export const FIND_BLOCKINGACTIVITY_DTO = gql`
  query FindBlockingActivityDto($_id: String!, $custominput: Dictionary) {
    response: find_BlockingActivity_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        action {
          schema
          suggestProperties {
            id
            propType
            label
          }
          actionType
          new_data_flow
          is_multi_task
          executable
        }
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
 * Query BlockingActivitys DTO list
 */
export const QUERY_BLOCKINGACTIVITYS_DTO = gql`
  query QueryBlockingActivitysDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_BlockingActivitys_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        action {
          schema
          suggestProperties {
            id
            propType
            label
          }
          actionType
          new_data_flow
          is_multi_task
          executable
        }
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
