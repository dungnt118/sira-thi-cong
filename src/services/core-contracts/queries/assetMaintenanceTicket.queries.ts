import { gql } from 'graphql-tag';

/**
 * Find AssetMaintenanceTicket DTO with typed data
 */
export const FIND_ASSETMAINTENANCETICKET_DTO = gql`
  query FindAssetMaintenanceTicketDto($_id: String!, $custominput: Dictionary) {
    response: find_AssetMaintenanceTicket_dto(_id: $_id, custominput: $custominput) {
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
        status
        maintenance_partner_id
        idx_maintenance_partner_id
        responsible_user
        maintenance_date
        completed_at
        cost_amount
        journey_id
        idx_journey_id
        notes
      }
    }
  }
`;

/**
 * Query AssetMaintenanceTickets DTO list
 */
export const QUERY_ASSETMAINTENANCETICKETS_DTO = gql`
  query QueryAssetMaintenanceTicketsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AssetMaintenanceTickets_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        asset_id
        idx_asset_id
        status
        maintenance_partner_id
        idx_maintenance_partner_id
        responsible_user
        maintenance_date
        completed_at
        cost_amount
        journey_id
        idx_journey_id
        notes
      }
    }
  }
`;
