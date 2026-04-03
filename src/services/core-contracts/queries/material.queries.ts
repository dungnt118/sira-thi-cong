import { gql } from 'graphql-tag';

/**
 * Find Material DTO with typed data
 */
export const FIND_MATERIAL_DTO = gql`
  query FindMaterialDto($_id: String!, $custominput: Dictionary) {
    response: find_Material_dto(_id: $_id, custominput: $custominput) {
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
        group_id
        idx_group_id
        capacity
        unit
        current_stock
        partial_stock
        min_stock_alert
        unit_cost
        opened_lots {
          source_order_id
          source_order_code
          opened_at
          original_quantity
          remaining_quantity
          unit_cost
          note
        }
      }
    }
  }
`;

/**
 * Query Materials DTO list
 */
export const QUERY_MATERIALS_DTO = gql`
  query QueryMaterialsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Materials_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        group_id
        idx_group_id
        capacity
        unit
        current_stock
        partial_stock
        min_stock_alert
        unit_cost
        opened_lots {
          source_order_id
          source_order_code
          opened_at
          original_quantity
          remaining_quantity
          unit_cost
          note
        }
      }
    }
  }
`;
