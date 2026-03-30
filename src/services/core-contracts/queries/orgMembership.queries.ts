import { gql } from 'graphql-tag';

/**
 * Find OrgMembership DTO with typed data
 */
export const FIND_ORGMEMBERSHIP_DTO = gql`
  query FindOrgMembershipDto($_id: String!, $custominput: Dictionary) {
    response: find_OrgMembership_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        employeeId
        departmentId
        isManager
        isPrimary
        positionId
      }
    }
  }
`;

/**
 * Query OrgMemberships DTO list
 */
export const QUERY_ORGMEMBERSHIPS_DTO = gql`
  query QueryOrgMembershipsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_OrgMemberships_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        employeeId
        departmentId
        isManager
        isPrimary
        positionId
      }
    }
  }
`;
