import { gql } from 'graphql-tag';

/**
 * Find AssetAllocation DTO with typed data
 */
export const FIND_ASSETALLOCATION_DTO = gql`
  query FindAssetAllocationDto($_id: String!, $custominput: Dictionary) {
    response: find_AssetAllocation_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        asset_id
        idx_asset_id
        journey_id
        idx_journey_id
        journey_step_code
        requested_by
        request_date
        expected_return_date
        actual_return_date
        status
        notes
        signature_image
        asset_name
        asset_code
        journey_name
      }
    }
  }
`;

/**
 * Query AssetAllocations DTO list
 */
export const QUERY_ASSETALLOCATIONS_DTO = gql`
  query QueryAssetAllocationsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AssetAllocations_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        asset_id
        idx_asset_id
        journey_id
        idx_journey_id
        journey_step_code
        requested_by
        request_date
        expected_return_date
        actual_return_date
        status
        notes
        signature_image
        asset_name
        asset_code
        journey_name
      }
    }
  }
`;
