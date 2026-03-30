import { gql } from 'graphql-tag';

/**
 * Find MaterialReceiptConfirmation DTO with typed data
 */
export const FIND_MATERIALRECEIPTCONFIRMATION_DTO = gql`
  query FindMaterialReceiptConfirmationDto($_id: String!, $custominput: Dictionary) {
    response: find_MaterialReceiptConfirmation_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        stock_order_id
        idx_stock_order_id
        stock_order_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        project_id
        idx_project_id
        project_id
        receiver_user
        receipt_time
        receipt_status
        checked_items {
          item_name
          expected_quantity
          received_quantity
          checked
        }
        evidence_files
        signature_data_url
        note
      }
    }
  }
`;

/**
 * Query MaterialReceiptConfirmations DTO list
 */
export const QUERY_MATERIALRECEIPTCONFIRMATIONS_DTO = gql`
  query QueryMaterialReceiptConfirmationsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_MaterialReceiptConfirmations_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        stock_order_id
        idx_stock_order_id
        stock_order_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        project_id
        idx_project_id
        project_id
        receiver_user
        receipt_time
        receipt_status
        checked_items {
          item_name
          expected_quantity
          received_quantity
          checked
        }
        evidence_files
        signature_data_url
        note
      }
    }
  }
`;
