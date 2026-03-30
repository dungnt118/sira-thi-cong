import { gql } from 'graphql-tag';

/**
 * Find ActivityEvent DTO with typed data
 */
export const FIND_ACTIVITYEVENT_DTO = gql`
  query FindActivityEventDto($_id: String!, $custominput: Dictionary) {
    response: find_ActivityEvent_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        project_id
        idx_project_id
        project_id
        service_request_id
        idx_service_request_id
        service_request_id
        category
        timestamp
        actor
        action
        summary
        context
        related_entity_id
        related_entity_type
      }
    }
  }
`;

/**
 * Query ActivityEvents DTO list
 */
export const QUERY_ACTIVITYEVENTS_DTO = gql`
  query QueryActivityEventsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ActivityEvents_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        project_id
        idx_project_id
        project_id
        service_request_id
        idx_service_request_id
        service_request_id
        category
        timestamp
        actor
        action
        summary
        context
        related_entity_id
        related_entity_type
      }
    }
  }
`;
