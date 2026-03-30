import { gql } from 'graphql-tag';

/**
 * Find WarrantyCard DTO with typed data
 */
export const FIND_WARRANTYCARD_DTO = gql`
  query FindWarrantyCardDto($_id: String!, $custominput: Dictionary) {
    response: find_WarrantyCard_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        journey_code
        project_id
        idx_project_id
        project_id
        project_name
        customer_name
        customer_phone
        address
        construction_type
        idx_construction_type
        construction_type
        area_m2
        completed_date
        warranty_months
        expiry_date
        issued_at
        materials
        qr_code
      }
    }
  }
`;

/**
 * Query WarrantyCards DTO list
 */
export const QUERY_WARRANTYCARDS_DTO = gql`
  query QueryWarrantyCardsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_WarrantyCards_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        journey_code
        project_id
        idx_project_id
        project_id
        project_name
        customer_name
        customer_phone
        address
        construction_type
        idx_construction_type
        construction_type
        area_m2
        completed_date
        warranty_months
        expiry_date
        issued_at
        materials
        qr_code
      }
    }
  }
`;
