import { gql } from 'graphql-tag';

/**
 * Find ProjectAssignment DTO with typed data
 */
export const FIND_PROJECTASSIGNMENT_DTO = gql`
  query FindProjectAssignmentDto($_id: String!, $custominput: Dictionary) {
    response: find_ProjectAssignment_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        project_id
        idx_project_id
        project_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        role_id
        idx_role_id
        role_id
        employee_id
        idx_employee_id
        employee_id
        assignment_type
        is_primary
        note
      }
    }
  }
`;

/**
 * Query ProjectAssignments DTO list
 */
export const QUERY_PROJECTASSIGNMENTS_DTO = gql`
  query QueryProjectAssignmentsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ProjectAssignments_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        project_id
        idx_project_id
        project_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        role_id
        idx_role_id
        role_id
        employee_id
        idx_employee_id
        employee_id
        assignment_type
        is_primary
        note
      }
    }
  }
`;
