import { gql } from 'graphql-tag';

/**
 * Find MasterDataItem DTO with typed data
 */
export const FIND_MASTERDATAITEM_DTO = gql`
  query FindMasterDataItemDto($_id: String!, $custominput: Dictionary) {
    response: find_MasterDataItem_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        categoryId
        idx_categoryId
        categoryId
        label
        value
        shortLabel
        color
        faIcon
        sortOrder
        isDefault
        isActive
        description
        metadataJson
      }
    }
  }
`;

/**
 * Query MasterDataItems DTO list
 */
export const QUERY_MASTERDATAITEMS_DTO = gql`
  query QueryMasterDataItemsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_MasterDataItems_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        categoryId
        idx_categoryId
        categoryId
        label
        value
        shortLabel
        color
        faIcon
        sortOrder
        isDefault
        isActive
        description
        metadataJson
      }
    }
  }
`;
