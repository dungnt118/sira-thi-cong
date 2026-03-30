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
        asset_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        project_id
        idx_project_id
        project_id
        requested_by
        request_date
        expected_return_date
        actual_return_date
        status
        notes
        requested_by_id
        signatures {
          role
          user_name
          user_id
          signed_at
          signature_data_url
        }
        project_name
        history {
          status
          updated_by
          updated_at
          comment
        }
        asset_name
        asset_code
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
        asset_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        project_id
        idx_project_id
        project_id
        requested_by
        request_date
        expected_return_date
        actual_return_date
        status
        notes
        requested_by_id
        signatures {
          role
          user_name
          user_id
          signed_at
          signature_data_url
        }
        project_name
        history {
          status
          updated_by
          updated_at
          comment
        }
        asset_name
        asset_code
      }
    }
  }
`;
