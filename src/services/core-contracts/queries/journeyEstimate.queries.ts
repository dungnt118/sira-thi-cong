import { gql } from 'graphql-tag';

/**
 * Find JourneyEstimate DTO with typed data
 */
export const FIND_JOURNEYESTIMATE_DTO = gql`
  query FindJourneyEstimateDto($_id: String!, $custominput: Dictionary) {
    response: find_JourneyEstimate_dto(_id: $_id, custominput: $custominput) {
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
        survey_record_id
        idx_survey_record_id
        pricing_policy_id
        idx_pricing_policy_id
        total_estimate_cost
        applied_quote_value
        version_no
        status
        journey_input_snapshot {
          service_type_id
          idx_service_type_id
          area_m2
          execution_days
          worker_count
          internal_staff_count
          supervisor_count
          outsource_mode
          internal_schedule_utilization_pct
          project_complexity_factor
        }
        quote_derivation {
          recommended_quote_value_initial
          final_quote_floor
          base_quote_rate_m2
          duration_factor
          scale_factor
          complexity_factor
          pricing_mode
          note
        }
        standardized_buckets {
          bucket_code
          bucket_name
          rate_pct
          base_amount
          amount
          formula_source
          sort_order
          note
        }
        labor_breakdown {
          outsource_labor
          internal_fixed_salary
          technical_commission
          supervisor_commission
          labor_total
          note
          role_allocation_total
          sale_related_excluded
          management_related_excluded
        }
        direct_cost_groups {
          template_id
          idx_template_id
          name
          quantity
          unit
          material_amount
          labor_amount
          other_amount
          subtotal
          note
          components {
            type
            material_id
            idx_material_id
            labor_price_config_id
            idx_labor_price_config_id
            calc_mode
            quantity
            unit
            unit_price
            line_total
            formula_code
            formula_snapshot
            note
            item_code
            item_name
            item_spec
            brand_name
            source_type
            source_ref_label
            quantity_per_unit
            expanded_quantity
            waste_pct
            cost_note
          }
          group_code
          template_name_snapshot
          cost_basis_note
        }
        validation_result {
          is_feasible
          target_profit_pct_min
          actual_profit_pct
          warning_codes
          warning_note
        }
        role_cost_allocations {
          bucket_code
          role_code
          usernames
          headcount
          work_days
          calc_mode
          unit_rate
          allocation_pct
          amount
          formula_snapshot
          note
        }
        journey_role_snapshot {
          pm_user
          owner_user
          sale_users
          supervisor_users
          technical_users
        }
        solution_resolution {
          resolved_scale_type
          policy_resolution_mode
          policy_resolution_note
          generation_status
          calc_engine_version
          template_selection_note
        }
      }
    }
  }
`;

/**
 * Query JourneyEstimates DTO list
 */
export const QUERY_JOURNEYESTIMATES_DTO = gql`
  query QueryJourneyEstimatesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_JourneyEstimates_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        journey_id
        idx_journey_id
        survey_record_id
        idx_survey_record_id
        pricing_policy_id
        idx_pricing_policy_id
        total_estimate_cost
        applied_quote_value
        version_no
        status
        journey_input_snapshot {
          service_type_id
          idx_service_type_id
          area_m2
          execution_days
          worker_count
          internal_staff_count
          supervisor_count
          outsource_mode
          internal_schedule_utilization_pct
          project_complexity_factor
        }
        quote_derivation {
          recommended_quote_value_initial
          final_quote_floor
          base_quote_rate_m2
          duration_factor
          scale_factor
          complexity_factor
          pricing_mode
          note
        }
        standardized_buckets {
          bucket_code
          bucket_name
          rate_pct
          base_amount
          amount
          formula_source
          sort_order
          note
        }
        labor_breakdown {
          outsource_labor
          internal_fixed_salary
          technical_commission
          supervisor_commission
          labor_total
          note
          role_allocation_total
          sale_related_excluded
          management_related_excluded
        }
        direct_cost_groups {
          template_id
          idx_template_id
          name
          quantity
          unit
          material_amount
          labor_amount
          other_amount
          subtotal
          note
          components {
            type
            material_id
            idx_material_id
            labor_price_config_id
            idx_labor_price_config_id
            calc_mode
            quantity
            unit
            unit_price
            line_total
            formula_code
            formula_snapshot
            note
            item_code
            item_name
            item_spec
            brand_name
            source_type
            source_ref_label
            quantity_per_unit
            expanded_quantity
            waste_pct
            cost_note
          }
          group_code
          template_name_snapshot
          cost_basis_note
        }
        validation_result {
          is_feasible
          target_profit_pct_min
          actual_profit_pct
          warning_codes
          warning_note
        }
        role_cost_allocations {
          bucket_code
          role_code
          usernames
          headcount
          work_days
          calc_mode
          unit_rate
          allocation_pct
          amount
          formula_snapshot
          note
        }
        journey_role_snapshot {
          pm_user
          owner_user
          sale_users
          supervisor_users
          technical_users
        }
        solution_resolution {
          resolved_scale_type
          policy_resolution_mode
          policy_resolution_note
          generation_status
          calc_engine_version
          template_selection_note
        }
      }
    }
  }
`;





