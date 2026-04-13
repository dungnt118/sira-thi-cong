import { estimateTemplateService } from '../../../services/core-contracts/services/estimateTemplate.service';
import { materialService } from '../../../services/core-contracts/services/material.service';
import { laborPriceConfigService } from '../../../services/core-contracts/services/laborPriceConfig.service';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';
import type {
  IDirectCostGroupsItem,
  IJourneyEstimate,
  ILaborBreakdownItem,
  IRoleCostAllocationsItem,
  IStandardizedBucketsItem,
} from '../../../services/core-contracts/types/journeyEstimate.types';
import type { IAllocationPolicyItem, IEstimatePricingPolicy, ITemplateRulesItem } from '../../../services/core-contracts/types/estimatePricingPolicy.types';
import type { IEstimateTemplate, IEstimateTemplateComponentsItem } from '../../../services/core-contracts/types/estimateTemplate.types';
import type { ILaborPriceConfig } from '../../../services/core-contracts/types/laborPriceConfig.types';
import type { IMaterial } from '../../../services/core-contracts/types/material.types';

type RoleSnapshot = IJourneyEstimate['journey_role_snapshot'];
type InputSnapshot = IJourneyEstimate['journey_input_snapshot'];

export interface ComputeJourneyEstimateSolutionResult {
  journeyInputSnapshot: InputSnapshot;
  journeyRoleSnapshot: RoleSnapshot;
  roleCostAllocations: IRoleCostAllocationsItem[];
  directCostGroups: IDirectCostGroupsItem[];
  laborBreakdown: ILaborBreakdownItem;
  standardizedBuckets: IStandardizedBucketsItem[];
  quoteDerivation: IJourneyEstimate['quote_derivation'];
  validationResult: IJourneyEstimate['validation_result'];
  solutionResolution: IJourneyEstimate['solution_resolution'];
  internalCost: number;
  appliedQuoteValue: number;
  recommendedQuote: number;
  selectedTemplateCount: number;
}

const roundMoney = (value: number) => Math.round(value || 0);

const sum = (values: number[]) => values.reduce((total, value) => total + (value || 0), 0);

const asUserList = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') return String(item.userName ?? item.username ?? item._id ?? '');
      return '';
    }).filter(Boolean);
  }
  if (!value) return [];
  if (typeof value === 'string') return [value];
  if (typeof value === 'object') {
    const candidate = value.userName ?? value.username ?? value._id;
    return candidate ? [String(candidate)] : [];
  }
  return [String(value)];
};

export const buildJourneyInputSnapshot = (journey: IJourney, current?: InputSnapshot): InputSnapshot => ({
  ...current,
  service_type_id: journey.serviceTypeId,
  area_m2: journey.area_m2,
  execution_days: journey.execution_days,
  project_complexity_factor:
    journey.complexity_level === 'very_difficult' ? 1.5 :
    journey.complexity_level === 'difficult' ? 1.2 : 1,
});

export const buildJourneyRoleSnapshot = (journey: IJourney, current?: RoleSnapshot): RoleSnapshot => ({
  pm_user: current?.pm_user ?? journey.pm_user,
  owner_user: current?.owner_user ?? journey.owner_user,
  sale_users: current?.sale_users ?? journey.sale_users,
  supervisor_users: current?.supervisor_users ?? journey.supervisor_users,
  technical_users: current?.technical_users ?? journey.technical_users,
});

const resolveScaleType = (policy: IEstimatePricingPolicy, snapshot: InputSnapshot): string => {
  const area = snapshot?.area_m2 ?? 0;
  const days = snapshot?.execution_days ?? 0;
  for (const rule of policy.scale_rules ?? []) {
    const areaOk = (rule.min_area_m2 == null || area >= rule.min_area_m2) && (rule.max_area_m2 == null || area <= rule.max_area_m2);
    const daysOk = (rule.min_execution_days == null || days >= rule.min_execution_days) && (rule.max_execution_days == null || days <= rule.max_execution_days);
    if (areaOk && daysOk && rule.result_scale_type) return rule.result_scale_type;
  }
  return policy.scale_type ?? 'custom';
};

const evaluateFormula = (formula: string | undefined, context: Record<string, number>): number | null => {
  if (!formula) return null;
  try {
    const keys = Object.keys(context);
    const values = Object.values(context);
    const result = new Function(...keys, 'return (' + formula + ');')(...values);
    return Number.isFinite(Number(result)) ? Number(result) : null;
  } catch {
    return null;
  }
};

const matchesTemplateRule = (
  rule: ITemplateRulesItem,
  snapshot: InputSnapshot,
  complexityLevel?: string,
): boolean => {
  const area = snapshot?.area_m2 ?? 0;
  const days = snapshot?.execution_days ?? 0;
  const areaOk = (rule.min_area_m2 == null || area >= rule.min_area_m2) && (rule.max_area_m2 == null || area <= rule.max_area_m2);
  const daysOk = (rule.min_execution_days == null || days >= rule.min_execution_days) && (rule.max_execution_days == null || days <= rule.max_execution_days);
  const complexityValues = rule.complexity_levels ?? [];
  const complexityOk = complexityValues.length === 0 || !complexityLevel || complexityValues.includes(complexityLevel);
  return areaOk && daysOk && complexityOk;
};

const inferAppliedQuantity = (
  template: IEstimateTemplate,
  rule: ITemplateRulesItem,
  snapshot: InputSnapshot,
): number => {
  const context = {
    area_m2: snapshot?.area_m2 ?? 0,
    execution_days: snapshot?.execution_days ?? 0,
    worker_count: snapshot?.worker_count ?? 0,
    internal_staff_count: snapshot?.internal_staff_count ?? 0,
    supervisor_count: snapshot?.supervisor_count ?? 0,
  };
  const byFormula = evaluateFormula(rule.quantity_formula, context);
  if (byFormula != null && byFormula > 0) return byFormula;
  const multiplier = rule.default_multiplier ?? 1;
  const unit = String(template.unit ?? '').toLowerCase();
  if (unit.includes('m2') || unit.includes('m²')) return (snapshot?.area_m2 ?? 1) * multiplier;
  if (unit.includes('ngay') || unit.includes('day')) return (snapshot?.execution_days ?? 1) * multiplier;
  return multiplier;
};

const buildFallbackDirectCostGroups = (
  policy: IEstimatePricingPolicy,
  snapshot: InputSnapshot,
): IDirectCostGroupsItem[] => {
  const area = snapshot?.area_m2 ?? 0;
  const baseRate = policy.quote_suggestion_rule?.base_quote_rate_m2 ?? 0;
  const complexity = snapshot?.project_complexity_factor ?? 1;
  const materialAmount = roundMoney(baseRate * area * complexity);
  return [
    {
      group_code: 'AUTO-FALLBACK',
      name: 'Auto-generated base solution',
      quantity: area,
      unit: 'm2',
      material_amount: materialAmount,
      labor_amount: 0,
      other_amount: 0,
      subtotal: materialAmount,
      cost_basis_note: 'Fallback from pricing policy because no matching template rule was resolved.',
      note: policy.name ?? policy.code,
      components: [
        {
          type: 'material',
          calc_mode: 'package_m2',
          quantity_per_unit: 1,
          expanded_quantity: area,
          quantity: area,
          unit: 'm2',
          unit_price: roundMoney(baseRate * complexity),
          line_total: materialAmount,
          item_name: 'Base material cost',
          source_type: 'policy',
          source_ref_label: policy.name ?? policy.code,
          formula_code: 'policy_base_rate',
          formula_snapshot: 'base_quote_rate_m2 x area x complexity',
          cost_note: 'Generated from pricing policy fallback',
        },
      ],
    },
  ];
};

const allocationAmount = (base: number, pct: number) => roundMoney(base * pct);

const buildGroupFromTemplate = async (
  template: IEstimateTemplate,
  rule: ITemplateRulesItem,
  snapshot: InputSnapshot,
  materialCache: Map<string, IMaterial | null>,
  laborCache: Map<string, ILaborPriceConfig | null>,
): Promise<IDirectCostGroupsItem> => {
  const appliedQuantity = inferAppliedQuantity(template, rule, snapshot);
  const components = await Promise.all((template.components ?? []).map(async (component: IEstimateTemplateComponentsItem) => {
    const material = component.material_id ? materialCache.get(component.material_id) ?? null : null;
    const labor = component.labor_price_config_id ? laborCache.get(component.labor_price_config_id) ?? null : null;
    const unitPrice = roundMoney(component.unit_price ?? material?.unit_cost ?? labor?.defaultPrice ?? 0);
    const quantityPerUnit = component.quantity_per_unit ?? 1;
    const expandedQuantity = appliedQuantity;
    const quantity = roundMoney(quantityPerUnit * expandedQuantity);
    const sourceType = component.material_id ? 'material_master' : component.labor_price_config_id ? 'labor_price_config' : 'manual';
    return {
      type: component.type,
      material_id: component.material_id,
      labor_price_config_id: component.labor_price_config_id,
      calc_mode: component.calc_mode,
      quantity_per_unit: quantityPerUnit,
      expanded_quantity: expandedQuantity,
      quantity,
      unit: component.unit ?? template.unit,
      unit_price: unitPrice,
      line_total: roundMoney(quantity * unitPrice),
      item_code: material?.code ?? labor?.levelCode,
      item_name: component.name ?? material?.name ?? labor?.name ?? template.name,
      item_spec: material?.capacity != null ? String(material.capacity) + ' ' + String(material.unit ?? '') : undefined,
      source_type: sourceType as any,
      source_ref_label: material?.name ?? labor?.name ?? template.name,
      formula_code: rule.quantity_formula ?? component.calc_mode,
      formula_snapshot: rule.quantity_formula ? 'Applied rule formula: ' + rule.quantity_formula : 'quantity_per_unit x applied_quantity',
      note: component.note,
      cost_note: 'Template component generated from rule',
    };
  }));
  const materialAmount = sum(components.filter((item) => item.type === 'material').map((item) => item.line_total ?? 0));
  const laborAmount = sum(components.filter((item) => item.type === 'labor').map((item) => item.line_total ?? 0));
  const otherAmount = sum(components.filter((item) => item.type === 'other').map((item) => item.line_total ?? 0));
  return {
    template_id: rule.template_id,
    group_code: template.code,
    template_name_snapshot: template.name,
    name: template.name,
    quantity: appliedQuantity,
    unit: template.unit,
    material_amount: materialAmount,
    labor_amount: laborAmount,
    other_amount: otherAmount,
    subtotal: materialAmount + laborAmount + otherAmount,
    cost_basis_note: 'Generated from EstimateTemplate and template rule.',
    note: rule.note,
    components: components as any,
  };
};

const buildSimpleRoleAllocations = (roleSnapshot: RoleSnapshot, laborBreakdown: ILaborBreakdownItem, executionDays: number): IRoleCostAllocationsItem[] => {
  const allocations: IRoleCostAllocationsItem[] = [];
  const push = (roleCode: IRoleCostAllocationsItem['role_code'], users: any, amount: number) => {
    const usernames = asUserList(users);
    if (!amount || amount <= 0) return;
    allocations.push({
      bucket_code: '02_labor_total',
      role_code: roleCode,
      usernames,
      headcount: usernames.length || undefined,
      work_days: executionDays,
      calc_mode: 'fixed_amount',
      amount,
    });
  };
  push('technical', roleSnapshot?.technical_users, laborBreakdown.technical_commission ?? 0);
  push('supervisor', roleSnapshot?.supervisor_users, laborBreakdown.supervisor_commission ?? 0);
  push('internal_support', roleSnapshot?.pm_user, laborBreakdown.internal_fixed_salary ?? 0);
  return allocations;
};

export const computeJourneyEstimateSolution = async (input: ComputeJourneyEstimateSolutionInput): Promise<ComputeJourneyEstimateSolutionResult> => {
  const { journey, policy, currentEstimate, appliedQuoteValueOverride, policyResolutionMode } = input;
  const journeyInputSnapshot = buildJourneyInputSnapshot(journey, currentEstimate?.journey_input_snapshot);
  const journeyRoleSnapshot = buildJourneyRoleSnapshot(journey, currentEstimate?.journey_role_snapshot);
  const resolvedScaleType = resolveScaleType(policy, journeyInputSnapshot);
  const matchedRules = (policy.template_rules ?? []).filter((rule) => !!rule.template_id && matchesTemplateRule(rule, journeyInputSnapshot, journey.complexity_level));
  const templates = await Promise.all(matchedRules.map(async (rule) => { try { return rule.template_id ? await estimateTemplateService.findContent(rule.template_id) as IEstimateTemplate : null; } catch { return null; } }));
  const materialIds = new Set<string>();
  const laborIds = new Set<string>();
  templates.forEach((template) => {
    (template?.components ?? []).forEach((component: IEstimateTemplateComponentsItem) => {
      if (component.material_id) materialIds.add(component.material_id);
      if (component.labor_price_config_id) laborIds.add(component.labor_price_config_id);
    });
  });
  const materialEntries = await Promise.all(Array.from(materialIds).map(async (id) => {
    try {
      return [id, await materialService.findContent(id) as IMaterial] as const;
    } catch {
      return [id, null] as const;
    }
  }));
  const laborEntries = await Promise.all(Array.from(laborIds).map(async (id) => {
    try {
      return [id, await laborPriceConfigService.findContent(id) as ILaborPriceConfig] as const;
    } catch {
      return [id, null] as const;
    }
  }));
  const materialCache = new Map(materialEntries);
  const laborCache = new Map(laborEntries);
  const directCostGroups = [];
  for (let index = 0; index < matchedRules.length; index += 1) {
    const template = templates[index];
    const rule = matchedRules[index];
    if (!template) continue;
    if (template.scale_type && template.scale_type !== resolvedScaleType && template.scale_type !== 'custom') continue;
    directCostGroups.push(await buildGroupFromTemplate(template, rule, journeyInputSnapshot, materialCache, laborCache));
  }
  const resolvedGroups = directCostGroups.length > 0 ? directCostGroups : buildFallbackDirectCostGroups(policy, journeyInputSnapshot);
  const materialsAmount = sum(resolvedGroups.map((group) => group.material_amount ?? 0));
  const templateLabor = sum(resolvedGroups.map((group) => group.labor_amount ?? 0));
  const workingDays = policy.labor_policy?.working_days_per_month ?? 26;
  const internalFixedSalary = roundMoney(((((policy.labor_policy?.internal_salary_monthly ?? 0) + (policy.labor_policy?.internal_support_monthly ?? 0)) / workingDays) * (journey.execution_days ?? 0)) * (policy.labor_policy?.salary_allocation_factor ?? 1));
  const technicalCommission = roundMoney(materialsAmount * ((policy.labor_policy?.technical_commission_pct ?? 0) / 100));
  const supervisorCommission = roundMoney(materialsAmount * ((policy.labor_policy?.supervisor_commission_pct ?? 0) / 100));
  const laborBreakdown: ILaborBreakdownItem = {
    outsource_labor: templateLabor,
    internal_fixed_salary: internalFixedSalary,
    technical_commission: technicalCommission,
    supervisor_commission: supervisorCommission,
    labor_total: templateLabor + internalFixedSalary + technicalCommission + supervisorCommission,
    note: directCostGroups.length > 0 ? 'Generated from templates.' : 'Generated from policy fallback.',
  };
  const otherDirectCost = sum(resolvedGroups.map((group) => group.other_amount ?? 0));
  const directCost = materialsAmount + (laborBreakdown.labor_total ?? 0) + otherDirectCost;
  const profitPct = (policy.profit_policy?.target_profit_pct_min ?? 0) / 100;
  const recommendedQuote = roundMoney(directCost / Math.max(0.01, 1 - profitPct));
  const appliedQuoteValue = roundMoney(appliedQuoteValueOverride && appliedQuoteValueOverride > 0 ? appliedQuoteValueOverride : recommendedQuote);
  const allocationAmounts: Record<string, number> = {
    '03_warranty_maintenance': 0,
    '04_risk': 0,
    '05_corporate_tax': 0,
    '06_sales_cost': 0,
    '07_management_cost': 0,
    '08_hidden_cost': 0,
  };
  (policy.allocation_policy ?? []).forEach((allocation) => {
    if (!allocation.bucket_code || !(allocation.bucket_code in allocationAmounts)) return;
    const pct = (allocation.default_rate_pct ?? 0) / 100;
    let base = 0;
    switch (allocation.calc_base) {
      case 'material_cost':
        base = materialsAmount;
        break;
      case 'labor_cost':
        base = laborBreakdown.labor_total ?? 0;
        break;
      case 'direct_cost':
        base = directCost;
        break;
      case 'contract_value':
        base = appliedQuoteValue;
        break;
      default:
        base = 0;
    }
    allocationAmounts[allocation.bucket_code] = roundMoney(base * pct);
  });
  const internalCost = directCost + Object.values(allocationAmounts).reduce((total, value) => total + value, 0);
  const profitAmount = roundMoney(appliedQuoteValue - internalCost);
  const roleCostAllocations = buildSimpleRoleAllocations(journeyRoleSnapshot, laborBreakdown, journey.execution_days ?? 0);
  laborBreakdown.role_allocation_total = sum(roleCostAllocations.map((item) => item.amount ?? 0));
  laborBreakdown.sale_related_excluded = allocationAmounts['06_sales_cost'];
  laborBreakdown.management_related_excluded = allocationAmounts['07_management_cost'];
  const standardizedBuckets: IStandardizedBucketsItem[] = [
    { bucket_code: '01_materials', bucket_name: 'Materials', amount: materialsAmount },
    { bucket_code: '02_labor_total', bucket_name: 'Labor', amount: laborBreakdown.labor_total ?? 0 },
    { bucket_code: '03_warranty_maintenance', bucket_name: 'Warranty & Maintenance', amount: allocationAmounts['03_warranty_maintenance'] },
    { bucket_code: '04_risk', bucket_name: 'Risk', amount: allocationAmounts['04_risk'] },
    { bucket_code: '05_corporate_tax', bucket_name: 'Corporate Tax', amount: allocationAmounts['05_corporate_tax'] },
    { bucket_code: '06_sales_cost', bucket_name: 'Sales Cost', amount: allocationAmounts['06_sales_cost'] },
    { bucket_code: '07_management_cost', bucket_name: 'Management Cost', amount: allocationAmounts['07_management_cost'] },
    { bucket_code: '08_hidden_cost', bucket_name: 'Hidden Cost', amount: allocationAmounts['08_hidden_cost'] },
    { bucket_code: '09_profit', bucket_name: 'Profit', amount: profitAmount },
  ];
  return {
    journeyInputSnapshot,
    journeyRoleSnapshot,
    roleCostAllocations,
    directCostGroups: resolvedGroups,
    laborBreakdown,
    standardizedBuckets,
    quoteDerivation: { recommended_quote_value_initial: recommendedQuote, pricing_mode: appliedQuoteValueOverride ? 'target_quote_check' : 'policy_first', note: directCostGroups.length > 0 ? 'Generated from template rules.' : 'Generated from policy fallback.' },
    validationResult: { is_feasible: profitAmount >= 0, target_profit_pct_min: policy.profit_policy?.target_profit_pct_min ?? 0, actual_profit_pct: appliedQuoteValue > 0 ? roundMoney((profitAmount / appliedQuoteValue) * 10000) / 100 : 0, warning_codes: directCostGroups.length > 0 ? [] : ['template_fallback'] },
    solutionResolution: { resolved_scale_type: resolvedScaleType as any, policy_resolution_mode: (policyResolutionMode ?? (policy.service_type_id ? 'service_default' : 'global_default')) as any, policy_resolution_note: policy.name ?? policy.code, generation_status: (directCostGroups.length > 0 ? 'ready' : 'partial') as any, calc_engine_version: 'step04-auto-solution-v1', template_selection_note: directCostGroups.length > 0 ? 'Matched template rules were expanded to direct-cost groups.' : 'No template rule matched, fallback group used.' },
    internalCost,
    appliedQuoteValue,
    recommendedQuote,
    selectedTemplateCount: directCostGroups.length,
  };
};