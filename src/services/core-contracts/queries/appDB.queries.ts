import { gql } from 'graphql-tag';

/**
 * Find AppDB DTO with typed data
 */
export const FIND_APPDB_DTO = gql`
  query FindAppDBDto($_id: String!, $custominput: Dictionary) {
    response: find_AppDB_dto(_id: $_id, custominput: $custominput) {
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
        description
        fileId
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
 * Query AppDBs DTO list
 */
export const QUERY_APPDBS_DTO = gql`
  query QueryAppDBsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AppDBs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        appId
        idx_appId
        appId
        description
        fileId
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
