import { gql } from 'graphql-tag';

/**
 * Find RoleType DTO with typed data
 */
export const FIND_ROLETYPE_DTO = gql`
  query FindRoleTypeDto($_id: String!, $custominput: Dictionary) {
    response: find_RoleType_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        code
        description
        menuPermissions {
          menuId
          permissions
        }
      }
    }
  }
`;

/**
 * Query RoleTypes DTO list
 */
export const QUERY_ROLETYPES_DTO = gql`
  query QueryRoleTypesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_RoleTypes_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        code
        description
        menuPermissions {
          menuId
          permissions
        }
      }
    }
  }
`;
