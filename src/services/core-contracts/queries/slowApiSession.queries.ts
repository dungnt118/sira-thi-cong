import { gql } from 'graphql-tag';

/**
 * Find SlowApiSession DTO with typed data
 */
export const FIND_SLOWAPISESSION_DTO = gql`
  query FindSlowApiSessionDto($_id: String!, $custominput: Dictionary) {
    response: find_SlowApiSession_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        user
        idx_user
        user
        target_schema
        tenantId
        nestedId
        tasks
        processing
        percentCompleted
        isBegin
        success
        failure
        sourceFile {
          file_id
          name
          mine_type
          size
          alt
          url
          file_type
          file_path
        }
        errorFile {
          file_id
          name
          mine_type
          size
          alt
          url
          file_type
          file_path
        }
        isFinished
        message
        name
      }
    }
  }
`;

/**
 * Query SlowApiSessions DTO list
 */
export const QUERY_SLOWAPISESSIONS_DTO = gql`
  query QuerySlowApiSessionsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_SlowApiSessions_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        user
        idx_user
        user
        target_schema
        tenantId
        nestedId
        tasks
        processing
        percentCompleted
        isBegin
        success
        failure
        sourceFile {
          file_id
          name
          mine_type
          size
          alt
          url
          file_type
          file_path
        }
        errorFile {
          file_id
          name
          mine_type
          size
          alt
          url
          file_type
          file_path
        }
        isFinished
        message
        name
      }
    }
  }
`;
