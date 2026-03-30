import { gql } from 'graphql-tag';

/**
 * Find WorkFlowGroup DTO with typed data
 */
export const FIND_WORKFLOWGROUP_DTO = gql`
  query FindWorkFlowGroupDto($_id: String!, $custominput: Dictionary) {
    response: find_WorkFlowGroup_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        moduleIds
        name
      }
    }
  }
`;

/**
 * Query WorkFlowGroups DTO list
 */
export const QUERY_WORKFLOWGROUPS_DTO = gql`
  query QueryWorkFlowGroupsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_WorkFlowGroups_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        moduleIds
        name
      }
    }
  }
`;
