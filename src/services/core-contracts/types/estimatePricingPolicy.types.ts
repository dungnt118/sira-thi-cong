import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * EstimatePricingPolicy interface
 * Auto-generated from Schema: EstimatePricingPolicy
 */
export interface IEstimatePricingPolicy {
  _id: string;
  code?: string;
  name?: string;
  service_type_id?: string;
  idx_service_type_id?: IndexedContentItem;
  scale_type?: EstimatePricingPolicyScaleTypeEnum;
  is_default?: boolean;
  status?: EstimatePricingPolicyStatusEnum;
  note?: string;
  quote_suggestion_rule?: IQuoteSuggestionRuleItem;
  scale_rules?: IScaleRulesItem[];
  labor_policy?: ILaborPolicyItem;
  allocation_policy?: IAllocationPolicyItem[];
  profit_policy?: IProfitPolicyItem;
  scenario_rules?: IScenarioRulesItem[];
}

export interface IQuoteSuggestionRuleItem {
  pricing_strategy?: QuoteSuggestionRulePricingStrategyEnum;
  base_quote_rate_m2?: number;
  duration_factor?: number;
  scale_factor?: number;
  complexity_factor?: number;
  min_quote_floor?: number;
  note?: string;
}

export interface IScaleRulesItem {
  min_area_m2?: number;
  max_area_m2?: number;
  min_execution_days?: number;
  max_execution_days?: number;
  result_scale_type?: ScaleRulesResultScaleTypeEnum;
  note?: string;
}

export interface ILaborPolicyItem {
  internal_salary_monthly?: number;
  internal_support_monthly?: number;
  working_days_per_month?: number;
  salary_allocation_factor?: number;
  technical_commission_pct?: number;
  supervisor_commission_pct?: number;
  outsource_daily_rate_min?: number;
  outsource_daily_rate_max?: number;
  outsource_package_rate_m2_min?: number;
  outsource_package_rate_m2_max?: number;
}

export interface IAllocationPolicyItem {
  bucket_code?: AllocationPolicyBucketCodeEnum;
  default_rate_pct?: number;
  min_rate_pct?: number;
  max_rate_pct?: number;
  calc_base?: AllocationPolicyCalcBaseEnum;
  formula_code?: string;
  note?: string;
}

export interface IProfitPolicyItem {
  target_profit_pct_min?: number;
  target_profit_pct_max?: number;
  warning_threshold_pct?: number;
}

export interface IScenarioRulesItem {
  trigger_key?: string;
  operator?: ScenarioRulesOperatorEnum;
  compare_value?: number;
  effect_bucket_code?: ScenarioRulesEffectBucketCodeEnum;
  effect_type?: ScenarioRulesEffectTypeEnum;
  effect_value?: number;
  note?: string;
}

export interface ICreateEstimatePricingPolicyInput {
  code?: string;
  name?: string;
  service_type_id?: string;
  scale_type?: EstimatePricingPolicyScaleTypeEnum2;
  is_default?: boolean;
  status?: EstimatePricingPolicyStatusEnum2;
  note?: string;
  quote_suggestion_rule?: IQuoteSuggestionRuleItem;
  scale_rules?: IScaleRulesItem[];
  labor_policy?: ILaborPolicyItem;
  allocation_policy?: IAllocationPolicyItem[];
  profit_policy?: IProfitPolicyItem;
  scenario_rules?: IScenarioRulesItem[];
}

export type IEstimatePricingPolicyListResponse = ApiListResponse<IEstimatePricingPolicy>

// Union types generated from value_options
export type EstimatePricingPolicyScaleTypeEnum = 'small' | 'medium' | 'large' | 'custom';
export type EstimatePricingPolicyStatusEnum = 'active' | 'inactive';
export type QuoteSuggestionRulePricingStrategyEnum = 'rate_factor' | 'banded_rate' | 'manual_formula';
export type ScaleRulesResultScaleTypeEnum = 'small' | 'medium' | 'large' | 'custom';
export type AllocationPolicyBucketCodeEnum = '03_warranty_maintenance' | '04_risk' | '05_corporate_tax' | '06_sales_cost' | '07_management_cost' | '08_hidden_cost';
export type AllocationPolicyCalcBaseEnum = 'contract_value' | 'direct_cost' | 'labor_cost' | 'material_cost' | 'custom';
export type ScenarioRulesOperatorEnum = '<' | '<=' | '>' | '>=' | '==';
export type ScenarioRulesEffectBucketCodeEnum = '02_labor_total' | '03_warranty_maintenance' | '04_risk' | '05_corporate_tax' | '06_sales_cost' | '07_management_cost' | '08_hidden_cost' | '09_profit';
export type ScenarioRulesEffectTypeEnum = 'increase_pct' | 'decrease_pct' | 'override_formula' | 'warning_only';
export type EstimatePricingPolicyScaleTypeEnum2 = 'small' | 'medium' | 'large' | 'custom';
export type EstimatePricingPolicyStatusEnum2 = 'active' | 'inactive';
