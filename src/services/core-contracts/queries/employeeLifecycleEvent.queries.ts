import { gql } from 'graphql-tag';

/**
 * Find EmployeeLifecycleEvent DTO with typed data
 */
export const FIND_EMPLOYEELIFECYCLEEVENT_DTO = gql`
  query FindEmployeeLifecycleEventDto($_id: String!, $custominput: Dictionary) {
    response: find_EmployeeLifecycleEvent_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        employeeId
        eventType
        eventDate
        title
        description
        actorAuthorizedUserId
        sourceModule
        sourceEntityId
        isDerived
        name
      }
    }
  }
`;

/**
 * Query EmployeeLifecycleEvents DTO list
 */
export const QUERY_EMPLOYEELIFECYCLEEVENTS_DTO = gql`
  query QueryEmployeeLifecycleEventsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_EmployeeLifecycleEvents_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        employeeId
        eventType
        eventDate
        title
        description
        actorAuthorizedUserId
        sourceModule
        sourceEntityId
        isDerived
        name
      }
    }
  }
`;
