import { gql } from 'graphql-tag';

/**
 * Find MasterDataCategory DTO with typed data
 */
export const FIND_MASTERDATACATEGORY_DTO = gql`
  query FindMasterDataCategoryDto($_id: String!, $custominput: Dictionary) {
    response: find_MasterDataCategory_dto(_id: $_id, custominput: $custominput) {
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
        module
        isActive
        allowCustomItem
        sortOrder
        description
        note
      }
    }
  }
`;

/**
 * Query MasterDataCategorys DTO list
 */
export const QUERY_MASTERDATACATEGORYS_DTO = gql`
  query QueryMasterDataCategorysDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_MasterDataCategorys_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        module
        isActive
        allowCustomItem
        sortOrder
        description
        note
      }
    }
  }
`;
