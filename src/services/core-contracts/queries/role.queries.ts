import { gql } from 'graphql-tag';

/**
 * Find Role DTO with typed data
 */
export const FIND_ROLE_DTO = gql`
  query FindRoleDto($_id: String!, $custominput: Dictionary) {
    response: find_Role_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        typeId
        idx_typeId
        typeId
        tenantId
        isLocked
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
 * Query Roles DTO list
 */
export const QUERY_ROLES_DTO = gql`
  query QueryRolesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Roles_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        typeId
        idx_typeId
        typeId
        tenantId
        isLocked
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
