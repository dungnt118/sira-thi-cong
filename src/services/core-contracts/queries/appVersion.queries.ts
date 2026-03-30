import { gql } from 'graphql-tag';

/**
 * Find AppVersion DTO with typed data
 */
export const FIND_APPVERSION_DTO = gql`
  query FindAppVersionDto($_id: String!, $custominput: Dictionary) {
    response: find_AppVersion_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        appId
        idx_appId
        appId
        fileId
        description
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
        name
      }
    }
  }
`;

/**
 * Query AppVersions DTO list
 */
export const QUERY_APPVERSIONS_DTO = gql`
  query QueryAppVersionsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AppVersions_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        appId
        idx_appId
        appId
        fileId
        description
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
        name
      }
    }
  }
`;
