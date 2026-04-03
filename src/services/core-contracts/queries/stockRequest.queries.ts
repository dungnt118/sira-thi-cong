import { gql } from 'graphql-tag';

/**
 * Find StockRequest DTO with typed data
 */
export const FIND_STOCKREQUEST_DTO = gql`
  query FindStockRequestDto($_id: String!, $custominput: Dictionary) {
    response: find_StockRequest_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        type
        requested_by
        journey_id
        idx_journey_id
        journey_step_code
        project_id
        idx_project_id
        project_name
        items {
          material_id
          material_name
          unit
          requested
          note
        }
        reason
        status
        reviewed_by
        reviewed_at
        review_note
        converted_order_id
        idx_converted_order_id
        created_at
        journey_name
      }
    }
  }
`;

/**
 * Query StockRequests DTO list
 */
export const QUERY_STOCKREQUESTS_DTO = gql`
  query QueryStockRequestsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_StockRequests_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        type
        requested_by
        journey_id
        idx_journey_id
        journey_step_code
        project_id
        idx_project_id
        project_name
        items {
          material_id
          material_name
          unit
          requested
          note
        }
        reason
        status
        reviewed_by
        reviewed_at
        review_note
        converted_order_id
        idx_converted_order_id
        created_at
        journey_name
      }
    }
  }
`;
