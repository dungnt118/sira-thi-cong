import { gql } from 'graphql-tag';

/**
 * Find AssetGroup DTO with typed data
 */
export const FIND_ASSETGROUP_DTO = gql`
  query FindAssetGroupDto($_id: String!, $custominput: Dictionary) {
    response: find_AssetGroup_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        category
        depreciation_months
      }
    }
  }
`;

/**
 * Query AssetGroups DTO list
 */
export const QUERY_ASSETGROUPS_DTO = gql`
  query QueryAssetGroupsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AssetGroups_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        category
        depreciation_months
      }
    }
  }
`;
