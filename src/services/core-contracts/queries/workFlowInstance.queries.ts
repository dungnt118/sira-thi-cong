import { gql } from 'graphql-tag';

/**
 * Find WorkFlowInstance DTO with typed data
 */
export const FIND_WORKFLOWINSTANCE_DTO = gql`
  query FindWorkFlowInstanceDto($_id: String!, $custominput: Dictionary) {
    response: find_WorkFlowInstance_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        parentId
        workflowId
        idx_workflowId
        workflowId
        token
        status
        faultMessage
        displayMessage
        state {
          lastResult
          input
          duration
        }
        blockingActivities {
          activityId
          name
          type
          status
          message
        }
        tenantId
        lastActivity {
          activityId
          name
          type
          status
          message
        }
        duration
        name
      }
    }
  }
`;

/**
 * Query WorkFlowInstances DTO list
 */
export const QUERY_WORKFLOWINSTANCES_DTO = gql`
  query QueryWorkFlowInstancesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_WorkFlowInstances_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        parentId
        workflowId
        idx_workflowId
        workflowId
        token
        status
        faultMessage
        displayMessage
        state {
          lastResult
          input
          duration
        }
        blockingActivities {
          activityId
          name
          type
          status
          message
        }
        tenantId
        lastActivity {
          activityId
          name
          type
          status
          message
        }
        duration
        name
      }
    }
  }
`;
