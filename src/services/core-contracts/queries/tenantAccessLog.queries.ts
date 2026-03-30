import { gql } from 'graphql-tag';

/**
 * Find TenantAccessLog DTO with typed data
 */
export const FIND_TENANTACCESSLOG_DTO = gql`
  query FindTenantAccessLogDto($_id: String!, $custominput: Dictionary) {
    response: find_TenantAccessLog_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        user_name
        tenantId
        ip
        headers
      }
    }
  }
`;

/**
 * Query TenantAccessLogs DTO list
 */
export const QUERY_TENANTACCESSLOGS_DTO = gql`
  query QueryTenantAccessLogsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_TenantAccessLogs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        user_name
        tenantId
        ip
        headers
      }
    }
  }
`;
