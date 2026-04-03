import { gql } from 'graphql-tag';

/**
 * Find MaterialGroup DTO with typed data
 */
export const FIND_MATERIALGROUP_DTO = gql`
  query FindMaterialGroupDto($_id: String!, $custominput: Dictionary) {
    response: find_MaterialGroup_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        type
        category
        base_unit
        package_unit
        status
        sort_order
      }
    }
  }
`;

/**
 * Query MaterialGroups DTO list
 */
export const QUERY_MATERIALGROUPS_DTO = gql`
  query QueryMaterialGroupsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_MaterialGroups_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        type
        category
        base_unit
        package_unit
        status
        sort_order
      }
    }
  }
`;
