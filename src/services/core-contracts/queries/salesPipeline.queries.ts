import { gql } from 'graphql-tag';

/**
 * Find SalesPipeline DTO with typed data
 */
export const FIND_SALESPIPELINE_DTO = gql`
  query FindSalesPipelineDto($_id: String!, $custominput: Dictionary) {
    response: find_SalesPipeline_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        is_active
        is_default
      }
    }
  }
`;

/**
 * Query SalesPipelines DTO list
 */
export const QUERY_SALESPIPELINES_DTO = gql`
  query QuerySalesPipelinesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_SalesPipelines_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        is_active
        is_default
      }
    }
  }
`;
