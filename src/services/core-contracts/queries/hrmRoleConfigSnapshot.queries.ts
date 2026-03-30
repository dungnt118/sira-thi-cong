import { gql } from 'graphql-tag';

/**
 * Find HrmRoleConfigSnapshot DTO with typed data
 */
export const FIND_HRMROLECONFIGSNAPSHOT_DTO = gql`
  query FindHrmRoleConfigSnapshotDto($_id: String!, $custominput: Dictionary) {
    response: find_HrmRoleConfigSnapshot_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        items {
          role
          permissions
          description
          isActive
          createdAt
          updatedAt
          name
          id
        }
        publishedAt
        publishedBy
        isLatest
        name
      }
    }
  }
`;

/**
 * Query HrmRoleConfigSnapshots DTO list
 */
export const QUERY_HRMROLECONFIGSNAPSHOTS_DTO = gql`
  query QueryHrmRoleConfigSnapshotsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_HrmRoleConfigSnapshots_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        items {
          role
          permissions
          description
          isActive
          createdAt
          updatedAt
          name
          id
        }
        publishedAt
        publishedBy
        isLatest
        name
      }
    }
  }
`;
