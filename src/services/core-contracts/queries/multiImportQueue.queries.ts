import { gql } from 'graphql-tag';

/**
 * Find MultiImportQueue DTO with typed data
 */
export const FIND_MULTIIMPORTQUEUE_DTO = gql`
  query FindMultiImportQueueDto($_id: String!, $custominput: Dictionary) {
    response: find_MultiImportQueue_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        target_schema
        data
        is_start
        start_time
        finished_time
        records
        successed
        failure
        messages
        is_active
        processor
        name
      }
    }
  }
`;

/**
 * Query MultiImportQueues DTO list
 */
export const QUERY_MULTIIMPORTQUEUES_DTO = gql`
  query QueryMultiImportQueuesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_MultiImportQueues_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        target_schema
        data
        is_start
        start_time
        finished_time
        records
        successed
        failure
        messages
        is_active
        processor
        name
      }
    }
  }
`;
