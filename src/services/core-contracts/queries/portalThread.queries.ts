import { gql } from 'graphql-tag';

/**
 * Find PortalThread DTO with typed data
 */
export const FIND_PORTALTHREAD_DTO = gql`
  query FindPortalThreadDto($_id: String!, $custominput: Dictionary) {
    response: find_PortalThread_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        thread_code
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        context_type
        context_label
        status
        last_message_at
        unread_count
      }
    }
  }
`;

/**
 * Query PortalThreads DTO list
 */
export const QUERY_PORTALTHREADS_DTO = gql`
  query QueryPortalThreadsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PortalThreads_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        thread_code
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        context_type
        context_label
        status
        last_message_at
        unread_count
      }
    }
  }
`;
