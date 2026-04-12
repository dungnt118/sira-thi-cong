import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * JourneyEstimate interface
 * Auto-generated from Schema: JourneyEstimate
 */
export interface IJourneyEstimate {
  _id: string;
  code?: string;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  survey_record_id?: string;
  idx_survey_record_id?: IndexedContentItem;
  pricing_policy_id?: string;
  idx_pricing_policy_id?: IndexedContentItem;
  version_no?: number;
  status?: JourneyEstimateStatusEnum;
  journey_input_snapshot?: IJourneyInputSnapshotItem;
  quote_derivation?: IQuoteDerivationItem;
  standardized_buckets?: IStandardizedBucketsItem[];
  labor_breakdown?: ILaborBreakdownItem;
  direct_cost_groups?: IDirectCostGroupsItem[];
  validation_result?: IValidationResultItem;
  //deprecated fields
  // tax_rate?: number;
  // subtotal?: number;
  // tax_amount?: number;
  // grand_total?: number;
  // notes?: string;
  // groups?: IGroupsItem[];
}

export interface IJourneyInputSnapshotItem {
  service_type_id?: string;
  idx_service_type_id?: IndexedContentItem;
  area_m2?: number;
  execution_days?: number;
  worker_count?: number;
  internal_staff_count?: number;
  supervisor_count?: number;
  outsource_mode?: JourneyInputSnapshotOutsourceModeEnum;
  internal_schedule_utilization_pct?: number;
  project_complexity_factor?: number;
}

export interface IQuoteDerivationItem {
  recommended_quote_value_initial?: number;
  final_quote_floor?: number;
  base_quote_rate_m2?: number;
  duration_factor?: number;
  scale_factor?: number;
  complexity_factor?: number;
  pricing_mode?: QuoteDerivationPricingModeEnum;
  note?: string;
}

export interface IStandardizedBucketsItem {
  bucket_code?: StandardizedBucketsBucketCodeEnum;
  bucket_name?: string;
  rate_pct?: number;
  base_amount?: number;
  amount?: number;
  formula_source?: string;
  sort_order?: number;
  note?: string;
}

export interface ILaborBreakdownItem {
  outsource_labor?: number;
  internal_fixed_salary?: number;
  technical_commission?: number;
  supervisor_commission?: number;
  labor_total?: number;
  note?: string;
}

export interface IDirectCostGroupsItem {
  template_id?: string;
  idx_template_id?: IndexedContentItem;
  name?: string;
  quantity?: number;
  unit?: string;
  material_amount?: number;
  labor_amount?: number;
  other_amount?: number;
  subtotal?: number;
  note?: string;
  components?: IComponentsItem[];
}

export interface IComponentsItem {
  type?: ComponentsTypeEnum;
  material_id?: string;
  idx_material_id?: IndexedContentItem;
  labor_price_config_id?: string;
  idx_labor_price_config_id?: IndexedContentItem;
  calc_mode?: ComponentsCalcModeEnum;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  line_total?: number;
  formula_code?: string;
  formula_snapshot?: string;
  note?: string;
}

export interface IValidationResultItem {
  is_feasible?: boolean;
  target_profit_pct_min?: number;
  actual_profit_pct?: number;
  warning_codes?: string[];
  warning_note?: string;
}

export interface IGroupsItem {
  //deprecated fields
  // template_id?: string;
  // idx_template_id?: IndexedContentItem;
  // name?: string;
  // quantity?: number;
  // unit?: string;
  // group_total?: number;
  // notes?: string;
  // components?: IComponentsItem[];
}

export interface IComponentsItem {
  //deprecated fields
  // type?: ComponentsTypeEnum2;
  // item_id?: string;
  // idx_item_id?: IndexedContentItem;
  // labor_price_config_id?: string;
  // idx_labor_price_config_id?: IndexedContentItem;
  // name?: string;
  // unit?: string;
  // quantity?: number;
  // unit_price?: number;
  // line_total?: number;
  // note?: string;
}

export interface ICreateJourneyEstimateInput {
  code?: string;
  journey_id?: string;
  survey_record_id?: string;
  pricing_policy_id?: string;
  version_no?: number;
  status?: JourneyEstimateStatusEnum2;
  journey_input_snapshot?: IJourneyInputSnapshotItem;
  quote_derivation?: IQuoteDerivationItem;
  standardized_buckets?: IStandardizedBucketsItem[];
  labor_breakdown?: ILaborBreakdownItem;
  direct_cost_groups?: IDirectCostGroupsItem[];
  validation_result?: IValidationResultItem;
  //deprecated fields
  // tax_rate?: number;
  // subtotal?: number;
  // tax_amount?: number;
  // grand_total?: number;
  // notes?: string;
  // groups?: IGroupsItem[];
}

export type IJourneyEstimateListResponse = ApiListResponse<IJourneyEstimate>

// Union types generated from value_options
export type JourneyEstimateStatusEnum = 'draft' | 'reviewing' | 'approved' | 'superseded';
export type JourneyInputSnapshotOutsourceModeEnum = 'daily' | 'package_m2' | 'mixed' | 'internal_only';
export type QuoteDerivationPricingModeEnum = 'policy_first' | 'target_quote_check' | 'profit_target_optimize';
export type StandardizedBucketsBucketCodeEnum = '01_materials' | '02_labor_total' | '03_warranty_maintenance' | '04_risk' | '05_corporate_tax' | '06_sales_cost' | '07_management_cost' | '08_hidden_cost' | '09_profit';
export type ComponentsTypeEnum = 'material' | 'labor' | 'other';
export type ComponentsCalcModeEnum = 'manual' | 'package_m2' | 'daily_worker' | 'formula';
export type ComponentsTypeEnum2 = 'material' | 'labor' | 'other';
export type JourneyEstimateStatusEnum2 = 'draft' | 'reviewing' | 'approved' | 'superseded';
