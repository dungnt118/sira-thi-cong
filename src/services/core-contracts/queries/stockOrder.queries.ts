import { gql } from 'graphql-tag';

/**
 * Find StockOrder DTO with typed data
 */
export const FIND_STOCKORDER_DTO = gql`
  query FindStockOrderDto($_id: String!, $custominput: Dictionary) {
    response: find_StockOrder_dto(_id: $_id, custominput: $custominput) {
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
        status
        journey_id
        idx_journey_id
        journey_step_code
        source
        supplier
        total_value
        notes
        created_at
        created_by
        journey_code
        source_id
        signed_by
        discrepancy_status
        pdf_url
        request_id
        idx_request_id
        requested_by
        reviewed_by
        reviewed_at
        review_note
        request_reason
        signed_at
        signature_image
        signatures {
          role
          user_name
          user_id
          signed_at
          signature_data_url
          note
        }
        history {
          status
          updated_by
          updated_at
          comment
        }
        items {
          material_id
          material_name
          unit
          quantity
          requested_quantity
          issued_quantity
          received_quantity
          unit_cost
          is_partial
          remaining_percent
          discrepancy_note
        }
        journey_source_id
        idx_journey_source_id
        distributor_source_id
        idx_distributor_source_id
        journey_name
      }
    }
  }
`;

/**
 * Query StockOrders DTO list
 */
export const QUERY_STOCKORDERS_DTO = gql`
  query QueryStockOrdersDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_StockOrders_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        type
        status
        journey_id
        idx_journey_id
        journey_step_code
        source
        supplier
        total_value
        notes
        created_at
        created_by
        journey_code
        source_id
        signed_by
        discrepancy_status
        pdf_url
        request_id
        idx_request_id
        requested_by
        reviewed_by
        reviewed_at
        review_note
        request_reason
        signed_at
        signature_image
        signatures {
          role
          user_name
          user_id
          signed_at
          signature_data_url
          note
        }
        history {
          status
          updated_by
          updated_at
          comment
        }
        items {
          material_id
          material_name
          unit
          quantity
          requested_quantity
          issued_quantity
          received_quantity
          unit_cost
          is_partial
          remaining_percent
          discrepancy_note
        }
        journey_source_id
        idx_journey_source_id
        distributor_source_id
        idx_distributor_source_id
        journey_name
      }
    }
  }
`;
