import { gql } from 'graphql-tag';

/**
 * Find IndexedContentItem DTO with typed data
 */
export const FIND_INDEXEDCONTENTITEM_DTO = gql`
  query FindIndexedContentItemDto($_id: String!, $custominput: Dictionary) {
    response: find_IndexedContentItem_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        itemId
        parentId
        code
        title
        bigtext
        bigtext_unsign
        collection
        schema
        schema_label
        tenantId
        tenantName
        isDraft
        batchToken
      }
    }
  }
`;

/**
 * Query IndexedContentItems DTO list
 */
export const QUERY_INDEXEDCONTENTITEMS_DTO = gql`
  query QueryIndexedContentItemsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_IndexedContentItems_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        itemId
        parentId
        code
        title
        bigtext
        bigtext_unsign
        collection
        schema
        schema_label
        tenantId
        tenantName
        isDraft
        batchToken
      }
    }
  }
`;
