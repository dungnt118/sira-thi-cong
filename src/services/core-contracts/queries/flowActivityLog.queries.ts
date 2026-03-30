import { gql } from 'graphql-tag';

/**
 * Find FlowActivityLog DTO with typed data
 */
export const FIND_FLOWACTIVITYLOG_DTO = gql`
  query FindFlowActivityLogDto($_id: String!, $custominput: Dictionary) {
    response: find_FlowActivityLog_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        from_activity
        endTime
        total_time
        pending_time
        execution_time
        output {
          message
          status
          result
          outcomes {
            Chars
            Length
          }
        }
        input
        token
        status
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
 * Query FlowActivityLogs DTO list
 */
export const QUERY_FLOWACTIVITYLOGS_DTO = gql`
  query QueryFlowActivityLogsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_FlowActivityLogs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        from_activity
        endTime
        total_time
        pending_time
        execution_time
        output {
          message
          status
          result
          outcomes {
            Chars
            Length
          }
        }
        input
        token
        status
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
