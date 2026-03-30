import { gql } from 'graphql-tag';

/**
 * Find SystemFieldGroup DTO with typed data
 */
export const FIND_SYSTEMFIELDGROUP_DTO = gql`
  query FindSystemFieldGroupDto($_id: String!, $custominput: Dictionary) {
    response: find_SystemFieldGroup_dto(_id: $_id, custominput: $custominput) {
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
        description
        displayOrder
        faIcon
        isDeleted
        tags
      }
    }
  }
`;

/**
 * Query SystemFieldGroups DTO list
 */
export const QUERY_SYSTEMFIELDGROUPS_DTO = gql`
  query QuerySystemFieldGroupsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_SystemFieldGroups_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        description
        displayOrder
        faIcon
        isDeleted
        tags
      }
    }
  }
`;
