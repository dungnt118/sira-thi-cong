import { gql } from 'graphql-tag';

/**
 * Find ActivityLog DTO with typed data
 */
export const FIND_ACTIVITYLOG_DTO = gql`
  query FindActivityLogDto($_id: String!, $custominput: Dictionary) {
    response: find_ActivityLog_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        type
        message
        data
        remoteIP
        user
        headers
      }
    }
  }
`;

/**
 * Query ActivityLogs DTO list
 */
export const QUERY_ACTIVITYLOGS_DTO = gql`
  query QueryActivityLogsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ActivityLogs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        type
        message
        data
        remoteIP
        user
        headers
      }
    }
  }
`;
