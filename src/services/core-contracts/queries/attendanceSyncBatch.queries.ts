import { gql } from 'graphql-tag';

/**
 * Find AttendanceSyncBatch DTO with typed data
 */
export const FIND_ATTENDANCESYNCBATCH_DTO = gql`
  query FindAttendanceSyncBatchDto($_id: String!, $custominput: Dictionary) {
    response: find_AttendanceSyncBatch_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        batchCode
        source
        fromDate
        toDate
        totalRecords
        successCount
        errorCount
        status
        note
        syncedBy
        syncedAt
        name
      }
    }
  }
`;

/**
 * Query AttendanceSyncBatchs DTO list
 */
export const QUERY_ATTENDANCESYNCBATCHS_DTO = gql`
  query QueryAttendanceSyncBatchsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AttendanceSyncBatchs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        batchCode
        source
        fromDate
        toDate
        totalRecords
        successCount
        errorCount
        status
        note
        syncedBy
        syncedAt
        name
      }
    }
  }
`;
