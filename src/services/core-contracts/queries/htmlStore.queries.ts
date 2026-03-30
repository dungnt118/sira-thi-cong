import { gql } from 'graphql-tag';

/**
 * Find HtmlStore DTO with typed data
 */
export const FIND_HTMLSTORE_DTO = gql`
  query FindHtmlStoreDto($_id: String!, $custominput: Dictionary) {
    response: find_HtmlStore_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        description
        html
        privateMode
        name
      }
    }
  }
`;

/**
 * Query HtmlStores DTO list
 */
export const QUERY_HTMLSTORES_DTO = gql`
  query QueryHtmlStoresDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_HtmlStores_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        description
        html
        privateMode
        name
      }
    }
  }
`;
