import { gql } from 'graphql-tag';

/**
 * Find Asset DTO with typed data
 */
export const FIND_ASSET_DTO = gql`
  query FindAssetDto($_id: String!, $custominput: Dictionary) {
    response: find_Asset_dto(_id: $_id, custominput: $custominput) {
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
        serial_number
        status
        assigned_to
        assigned_to_id
        current_allocation_id
        idx_current_allocation_id
        assigned_journey_id
        idx_assigned_journey_id
        purchase_date
        cost
        condition
        notes
      }
    }
  }
`;

/**
 * Query Assets DTO list
 */
export const QUERY_ASSETS_DTO = gql`
  query QueryAssetsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Assets_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        group_id
        idx_group_id
        serial_number
        status
        assigned_to
        assigned_to_id
        current_allocation_id
        idx_current_allocation_id
        assigned_journey_id
        idx_assigned_journey_id
        purchase_date
        cost
        condition
        notes
      }
    }
  }
`;
