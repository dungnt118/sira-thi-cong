import { gql } from 'graphql-tag';

/**
 * Find QuotationLineItem DTO with typed data
 */
export const FIND_QUOTATIONLINEITEM_DTO = gql`
  query FindQuotationLineItemDto($_id: String!, $custominput: Dictionary) {
    response: find_QuotationLineItem_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        quotation_id
        idx_quotation_id
        quotation_id
        mapping_rule_id
        idx_mapping_rule_id
        mapping_rule_id
        item_name
        unit
        quantity
        unit_price
        line_total
        note
      }
    }
  }
`;

/**
 * Query QuotationLineItems DTO list
 */
export const QUERY_QUOTATIONLINEITEMS_DTO = gql`
  query QueryQuotationLineItemsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_QuotationLineItems_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        quotation_id
        idx_quotation_id
        quotation_id
        mapping_rule_id
        idx_mapping_rule_id
        mapping_rule_id
        item_name
        unit
        quantity
        unit_price
        line_total
        note
      }
    }
  }
`;
