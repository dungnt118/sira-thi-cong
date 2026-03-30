import { gql } from 'graphql-tag';

/**
 * Find WorkFlow DTO with typed data
 */
export const FIND_WORKFLOW_DTO = gql`
  query FindWorkFlowDto($_id: String!, $custominput: Dictionary) {
    response: find_WorkFlow_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        tenantId
        description
        groupId
        idx_groupId
        groupId
        monitors
        isEnable
        isSingleton
        lockTimeout
        lockExpiration
        deleteFinishedWorkflows
        activities {
          activityId
          name
          type
          isStart
          isEnd
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
          x
          y
          full_path
          content_path
          status
          message
        }
        moduleIds
        transitions {
          sourceId
          destId
          outcome
        }
        name
      }
    }
  }
`;

/**
 * Query WorkFlows DTO list
 */
export const QUERY_WORKFLOWS_DTO = gql`
  query QueryWorkFlowsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_WorkFlows_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        tenantId
        description
        groupId
        idx_groupId
        groupId
        monitors
        isEnable
        isSingleton
        lockTimeout
        lockExpiration
        deleteFinishedWorkflows
        activities {
          activityId
          name
          type
          isStart
          isEnd
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
          x
          y
          full_path
          content_path
          status
          message
        }
        moduleIds
        transitions {
          sourceId
          destId
          outcome
        }
        name
      }
    }
  }
`;
