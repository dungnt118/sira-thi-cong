import { gql } from 'graphql-tag';

/**
 * Find NotifyPushResult DTO with typed data
 */
export const FIND_NOTIFYPUSHRESULT_DTO = gql`
  query FindNotifyPushResultDto($_id: String!, $custominput: Dictionary) {
    response: find_NotifyPushResult_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        title
        body
        image
        icon
        data
        results {
          token
          success
          error
        }
        failure
        success
        userId
        sent
        read
      }
    }
  }
`;

/**
 * Query NotifyPushResults DTO list
 */
export const QUERY_NOTIFYPUSHRESULTS_DTO = gql`
  query QueryNotifyPushResultsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_NotifyPushResults_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        title
        body
        image
        icon
        data
        results {
          token
          success
          error
        }
        failure
        success
        userId
        sent
        read
      }
    }
  }
`;
