# SCHEMA ANALYSIS: Auto Solution Chain

## Scope
- Update `EstimatePricingPolicy` to include template selection rules.
- Update `JourneyEstimate` to separate internal cost vs applied quote value.
- Add audit fields for policy/template resolution.

## Approved Changes

### EstimatePricingPolicy
- Add `template_rules` (Nested)
  - `template_id`: ObjectId -> `EstimateTemplate`
  - `selection_mode`: Text enum `required | optional | conditional`
  - `priority`: Number
  - `min_area_m2`: Number
  - `max_area_m2`: Number
  - `min_execution_days`: Number
  - `max_execution_days`: Number
  - `complexity_levels`: Tags
  - `default_multiplier`: Number
  - `quantity_formula`: Text
  - `note`: Text

### JourneyEstimate
- Clarify `total_estimate_cost` as internal cost before profit.
- Add `applied_quote_value`: Number
- Add `solution_resolution` (Object)
  - `resolved_scale_type`: Text enum `small | medium | large | custom`
  - `policy_resolution_mode`: Text enum `explicit_policy | service_default | global_default`
  - `policy_resolution_note`: Text
  - `generation_status`: Text enum `ready | partial | failed | manual_adjusted`
  - `calc_engine_version`: Text
  - `template_selection_note`: Text

## Intent
- `Journey` provides raw input.
- `EstimatePricingPolicy` decides pricing logic and template selection.
- `EstimateTemplate` provides recipe/components.
- `JourneyEstimate` stores resolved result and audit trace.
