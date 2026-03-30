import { gql } from 'graphql-tag';

/**
 * Find HrmRoleConfigItem DTO with typed data
 */
export const FIND_HRMROLECONFIGITEM_DTO = gql`
  query FindHrmRoleConfigItemDto($_id: String!, $custominput: Dictionary) {
    response: find_HrmRoleConfigItem_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        role
        permissions
        description
        isActive
        name
      }
    }
  }
`;

/**
 * Query HrmRoleConfigItems DTO list
 */
export const QUERY_HRMROLECONFIGITEMS_DTO = gql`
  query QueryHrmRoleConfigItemsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_HrmRoleConfigItems_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        role
        permissions
        description
        isActive
        name
      }
    }
  }
`;
