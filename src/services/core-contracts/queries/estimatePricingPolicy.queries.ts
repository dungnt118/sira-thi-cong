import { gql } from 'graphql-tag';

/**
 * Find EstimatePricingPolicy DTO with typed data
 */
export const FIND_ESTIMATEPRICINGPOLICY_DTO = gql`
  query FindEstimatePricingPolicyDto($_id: String!, $custominput: Dictionary) {
    response: find_EstimatePricingPolicy_dto(_id: $_id, custominput: $custominput) {
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
        service_type_id
        idx_service_type_id
        scale_type
        is_default
        status
        note
        quote_suggestion_rule {
          pricing_strategy
          base_quote_rate_m2
          duration_factor
          scale_factor
          complexity_factor
          min_quote_floor
          note
        }
        scale_rules {
          min_area_m2
          max_area_m2
          min_execution_days
          max_execution_days
          result_scale_type
          note
        }
        labor_policy {
          internal_salary_monthly
          internal_support_monthly
          working_days_per_month
          salary_allocation_factor
          technical_commission_pct
          supervisor_commission_pct
          outsource_daily_rate_min
          outsource_daily_rate_max
          outsource_package_rate_m2_min
          outsource_package_rate_m2_max
        }
        allocation_policy {
          bucket_code
          default_rate_pct
          min_rate_pct
          max_rate_pct
          calc_base
          formula_code
          note
        }
        profit_policy {
          target_profit_pct_min
          target_profit_pct_max
          warning_threshold_pct
        }
        scenario_rules {
          trigger_key
          operator
          compare_value
          effect_bucket_code
          effect_type
          effect_value
          note
        }
      }
    }
  }
`;

/**
 * Query EstimatePricingPolicys DTO list
 */
export const QUERY_ESTIMATEPRICINGPOLICYS_DTO = gql`
  query QueryEstimatePricingPolicysDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_EstimatePricingPolicys_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        service_type_id
        idx_service_type_id
        scale_type
        is_default
        status
        note
        quote_suggestion_rule {
          pricing_strategy
          base_quote_rate_m2
          duration_factor
          scale_factor
          complexity_factor
          min_quote_floor
          note
        }
        scale_rules {
          min_area_m2
          max_area_m2
          min_execution_days
          max_execution_days
          result_scale_type
          note
        }
        labor_policy {
          internal_salary_monthly
          internal_support_monthly
          working_days_per_month
          salary_allocation_factor
          technical_commission_pct
          supervisor_commission_pct
          outsource_daily_rate_min
          outsource_daily_rate_max
          outsource_package_rate_m2_min
          outsource_package_rate_m2_max
        }
        allocation_policy {
          bucket_code
          default_rate_pct
          min_rate_pct
          max_rate_pct
          calc_base
          formula_code
          note
        }
        profit_policy {
          target_profit_pct_min
          target_profit_pct_max
          warning_threshold_pct
        }
        scenario_rules {
          trigger_key
          operator
          compare_value
          effect_bucket_code
          effect_type
          effect_value
          note
        }
      }
    }
  }
`;
