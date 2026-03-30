import { gql } from 'graphql-tag';

/**
 * Find Department DTO with typed data
 */
export const FIND_DEPARTMENT_DTO = gql`
  query FindDepartmentDto($_id: String!, $custominput: Dictionary) {
    response: find_Department_dto(_id: $_id, custominput: $custominput) {
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
        isLocked
        parentId
        idx_parentId
        parentId
        note
        apply_to_children
        tenantId
      }
    }
  }
`;

/**
 * Query Departments DTO list
 */
export const QUERY_DEPARTMENTS_DTO = gql`
  query QueryDepartmentsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Departments_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        isLocked
        parentId
        idx_parentId
        parentId
        note
        apply_to_children
        tenantId
      }
    }
  }
`;
