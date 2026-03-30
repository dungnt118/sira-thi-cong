import { gql } from 'graphql-tag';

/**
 * Find Employee DTO with typed data
 */
export const FIND_EMPLOYEE_DTO = gql`
  query FindEmployeeDto($_id: String!, $custominput: Dictionary) {
    response: find_Employee_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        name
        email
        sex
        status
        workScheduleId
      }
    }
  }
`;

/**
 * Query Employees DTO list
 */
export const QUERY_EMPLOYEES_DTO = gql`
  query QueryEmployeesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Employees_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        email
        sex
        status
        workScheduleId
      }
    }
  }
`;
