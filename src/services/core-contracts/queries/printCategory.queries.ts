import { gql } from 'graphql-tag';

/**
 * Find PrintCategory DTO with typed data
 */
export const FIND_PRINTCATEGORY_DTO = gql`
  query FindPrintCategoryDto($_id: String!, $custominput: Dictionary) {
    response: find_PrintCategory_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        description
      }
    }
  }
`;

/**
 * Query PrintCategorys DTO list
 */
export const QUERY_PRINTCATEGORYS_DTO = gql`
  query QueryPrintCategorysDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PrintCategorys_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        description
      }
    }
  }
`;
