import { gql } from 'graphql-tag';

/**
 * Find Quotation DTO with typed data
 */
export const FIND_QUOTATION_DTO = gql`
  query FindQuotationDto($_id: String!, $custominput: Dictionary) {
    response: find_Quotation_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        version_no
        journey_id
        idx_journey_id
        status
        subtotal
        discount
        total
        approved_at
        notes
      }
    }
  }
`;

/**
 * Query Quotations DTO list
 */
export const QUERY_QUOTATIONS_DTO = gql`
  query QueryQuotationsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Quotations_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        version_no
        journey_id
        idx_journey_id
        status
        subtotal
        discount
        total
        approved_at
        notes
      }
    }
  }
`;
