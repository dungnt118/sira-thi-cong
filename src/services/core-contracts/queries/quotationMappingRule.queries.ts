import { gql } from 'graphql-tag';

/**
 * Find QuotationMappingRule DTO with typed data
 */
export const FIND_QUOTATIONMAPPINGRULE_DTO = gql`
  query FindQuotationMappingRuleDto($_id: String!, $custominput: Dictionary) {
    response: find_QuotationMappingRule_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        service_type
        idx_service_type
        service_type
        rule_name
        source_cost_types
        target_item_name
        formula_note
        is_active
      }
    }
  }
`;

/**
 * Query QuotationMappingRules DTO list
 */
export const QUERY_QUOTATIONMAPPINGRULES_DTO = gql`
  query QueryQuotationMappingRulesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_QuotationMappingRules_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        service_type
        idx_service_type
        service_type
        rule_name
        source_cost_types
        target_item_name
        formula_note
        is_active
      }
    }
  }
`;
