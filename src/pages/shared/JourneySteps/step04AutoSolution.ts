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
import type { IEstimateTemplate, IComponentsItem } from '../../../services/core-contracts/types/estimateTemplate.types';
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

export interface ComputeJourneyEstimateSolutionInput {
  journey: IJourney;
  policy: IEstimatePricingPolicy;
  currentEstimate?: IJourneyEstimate | null;
  appliedQuoteValueOverride?: number;
  policyResolutionMode?: NonNullable<IJourneyEstimate['solution_resolution']>['policy_resolution_mode'];
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

const matchesTemplateScale = (templateScaleType: string | undefined, resolvedScaleType: string): boolean => {
  if (!templateScaleType || templateScaleType === 'custom') return true;
  return templateScaleType === resolvedScaleType;
};

const describeAllocationBase = (calcBase: string | undefined): string => {
  switch (calcBase) {
    case 'material_cost':
      return 'chi phí vật tư';
    case 'labor_cost':
      return 'chi phí nhân công';
    case 'direct_cost':
      return 'chi phí trực tiếp';
    case 'contract_value':
      return 'giá trị báo giá';
    default:
      return 'custom base';
  }
};

const sharePct = (amount: number, total: number): number => {
  if (!total || total <= 0) return 0;
  return Math.round(((amount || 0) / total) * 10000) / 100;
};

const bucketNoteFromAllocation = (allocation: IAllocationPolicyItem | undefined): string => {
  if (!allocation) return 'Chưa cấu hình tỷ lệ phân bổ.';
  if (allocation.note) return allocation.note;
  return 'Tỷ lệ ' + (allocation.default_rate_pct ?? 0) + '% trên ' + describeAllocationBase(allocation.calc_base) + '.';
};

const buildFallbackDirectCostGroups = (
  policy: IEstimatePricingPolicy,
  snapshot: InputSnapshot,
  fallbackReason: string,
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
      cost_basis_note: fallbackReason,
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
          cost_note: fallbackReason,
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
  const components = await Promise.all((template.components ?? []).map(async (component: IComponentsItem) => {
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

const fetchTemplatesByServiceType = async (serviceTypeId: string): Promise<IEstimateTemplate[]> => {
  if (!serviceTypeId) return [];
  try {
    const response = await estimateTemplateService.queryContent({
      group: {
        op: 'AND',
        children: [
          { id: 'service_type_id', operation: '==', value: serviceTypeId, children: [] },
        ],
      },
      sorted: [{ id: 'createdTime', desc: true }],
    } as any);
    return response?.data ?? [];
  } catch {
    return [];
  }
};

const buildTemplateDependencyCaches = async (templates: Array<IEstimateTemplate | null>) => {
  const materialIds = new Set<string>();
  const laborIds = new Set<string>();
  templates.forEach((template) => {
    (template?.components ?? []).forEach((component: IComponentsItem) => {
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
  return {
    materialCache: new Map(materialEntries),
    laborCache: new Map(laborEntries),
  };
};

const resolveAllocationBaseAmount = (
  calcBase: IAllocationPolicyItem['calc_base'],
  materialsAmount: number,
  laborTotal: number,
  directCost: number,
  appliedQuoteValue: number,
): number => {
  switch (calcBase) {
    case 'material_cost':
      return materialsAmount;
    case 'labor_cost':
      return laborTotal;
    case 'direct_cost':
      return directCost;
    case 'contract_value':
      return appliedQuoteValue;
    default:
      return 0;
  }
};

export const computeJourneyEstimateSolution = async (input: ComputeJourneyEstimateSolutionInput): Promise<ComputeJourneyEstimateSolutionResult> => {
  const { journey, policy, currentEstimate, appliedQuoteValueOverride, policyResolutionMode } = input;
  const journeyInputSnapshot = buildJourneyInputSnapshot(journey, currentEstimate?.journey_input_snapshot);
  const journeyRoleSnapshot = buildJourneyRoleSnapshot(journey, currentEstimate?.journey_role_snapshot);
  const resolvedScaleType = resolveScaleType(policy, journeyInputSnapshot);
  const templateRules = policy.template_rules ?? [];
  const matchedRules = templateRules.filter((rule) => !!rule.template_id && matchesTemplateRule(rule, journeyInputSnapshot, journey.complexity_level));
  let policy_has_no_template_rules = false;
  let template_rules_present_but_no_rule_matched = false;
  let rule_matched_but_template_filtered_or_missing = false;
  let auto_matched_single_template = false;
  let matched_template_rules = false;
  let ambiguous_template_candidates = false;
  let templateSelectionNote = '';
  let fallbackReason = '';
  let selectedTemplatePairs: Array<{ rule: ITemplateRulesItem; template: IEstimateTemplate }> = [];

  if (templateRules.length === 0) {
    policy_has_no_template_rules = true;
    if (journey.serviceTypeId) {
      const serviceTypeTemplates = await fetchTemplatesByServiceType(journey.serviceTypeId);
      const exactScaleCandidates = serviceTypeTemplates.filter((template) => matchesTemplateScale(template.scale_type, resolvedScaleType) && template.scale_type === resolvedScaleType);
      if (exactScaleCandidates.length === 1) {
        const template = exactScaleCandidates[0];
        auto_matched_single_template = true;
        selectedTemplatePairs = [{
          template,
          rule: {
            template_id: template._id,
            default_multiplier: 1,
            note: 'Auto-matched because policy has no template rules and exactly one service-type template matched the resolved scale.',
          },
        }];
        templateSelectionNote = 'Auto-matched single template because policy has no template rules and exactly one service-type template matched scale ' + resolvedScaleType + '.';
      } else {
        const genericScaleCandidates = exactScaleCandidates.length === 0
          ? serviceTypeTemplates.filter((template) => matchesTemplateScale(template.scale_type, resolvedScaleType) && (!template.scale_type || template.scale_type === 'custom'))
          : [];
        if (genericScaleCandidates.length === 1) {
          const template = genericScaleCandidates[0];
          auto_matched_single_template = true;
          selectedTemplatePairs = [{
            template,
            rule: {
              template_id: template._id,
              default_multiplier: 1,
              note: 'Auto-matched because policy has no template rules and exactly one generic/custom-scale template remained for the service type.',
            },
          }];
          templateSelectionNote = 'Auto-matched single template because policy has no template rules, no exact scale template existed, and one generic/custom candidate remained.';
        } else if (exactScaleCandidates.length > 1 || genericScaleCandidates.length > 1) {
          ambiguous_template_candidates = true;
          const candidateCount = exactScaleCandidates.length > 1 ? exactScaleCandidates.length : genericScaleCandidates.length;
          fallbackReason = 'Fallback used because policy has no template rules and ' + String(candidateCount) + ' EstimateTemplate candidates were found for service type ' + journey.serviceTypeId + ' at scale ' + resolvedScaleType + ', so no single template could be auto-selected.';
          templateSelectionNote = fallbackReason;
        } else {
          fallbackReason = 'Fallback used because policy has no template rules and no usable EstimateTemplate was found for service type ' + journey.serviceTypeId + ' at scale ' + resolvedScaleType + '.';
          templateSelectionNote = fallbackReason;
        }
      }
    } else {
      fallbackReason = 'Fallback used because policy has no template rules and journey.serviceTypeId is empty, so EstimateTemplate auto-matching could not run.';
      templateSelectionNote = fallbackReason;
    }
  } else if (matchedRules.length === 0) {
    template_rules_present_but_no_rule_matched = true;
    fallbackReason = 'Fallback used because policy template rules exist but none matched the current journey area, execution days, and complexity.';
    templateSelectionNote = fallbackReason;
  } else {
    const explicitPairs = await Promise.all(matchedRules.map(async (rule) => {
      try {
        const template = rule.template_id ? await estimateTemplateService.findContent(rule.template_id) as IEstimateTemplate : null;
        return { rule, template };
      } catch {
        return { rule, template: null };
      }
    }));
    selectedTemplatePairs = explicitPairs.filter((pair): pair is { rule: ITemplateRulesItem; template: IEstimateTemplate } => !!pair.template && matchesTemplateScale(pair.template.scale_type, resolvedScaleType));
    if (selectedTemplatePairs.length > 0) {
      matched_template_rules = true;
      templateSelectionNote = 'Matched ' + String(selectedTemplatePairs.length) + ' template rule(s) and expanded the usable templates into direct-cost groups.';
    } else {
      rule_matched_but_template_filtered_or_missing = true;
      fallbackReason = 'Fallback used because policy template rules matched, but every referenced template was missing or filtered out by scale ' + resolvedScaleType + '.';
      templateSelectionNote = fallbackReason;
    }
  }

  const { materialCache, laborCache } = await buildTemplateDependencyCaches(selectedTemplatePairs.map((pair) => pair.template));
  const directCostGroups: IDirectCostGroupsItem[] = [];
  for (const pair of selectedTemplatePairs) {
    directCostGroups.push(await buildGroupFromTemplate(pair.template, pair.rule, journeyInputSnapshot, materialCache, laborCache));
  }
  const usedTemplates = directCostGroups.length > 0;
  const finalFallbackReason = fallbackReason || 'Fallback used because no usable template-based solution could be resolved.';
  const resolvedGroups = usedTemplates ? directCostGroups : buildFallbackDirectCostGroups(policy, journeyInputSnapshot, finalFallbackReason);
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
    note: usedTemplates
      ? (auto_matched_single_template ? 'Generated from auto-matched template.' : 'Generated from matched template rules.')
      : 'Generated from policy fallback. ' + finalFallbackReason,
  };
  const otherDirectCost = sum(resolvedGroups.map((group) => group.other_amount ?? 0));
  const directCost = materialsAmount + (laborBreakdown.labor_total ?? 0) + otherDirectCost;
  const profitPct = (policy.profit_policy?.target_profit_pct_min ?? 0) / 100;
  const recommendedQuote = roundMoney(directCost / Math.max(0.01, 1 - profitPct));
  const appliedQuoteValue = roundMoney(appliedQuoteValueOverride && appliedQuoteValueOverride > 0 ? appliedQuoteValueOverride : recommendedQuote);
  const allocationPolicyMap = new Map((policy.allocation_policy ?? []).map((allocation) => [allocation.bucket_code, allocation]));
  const allocationAmounts: Record<string, number> = {
    '03_warranty_maintenance': 0,
    '04_risk': 0,
    '05_corporate_tax': 0,
    '06_sales_cost': 0,
    '07_management_cost': 0,
    '08_hidden_cost': 0,
  };
  const allocationBaseAmounts: Record<string, number> = {
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
    const base = resolveAllocationBaseAmount(allocation.calc_base, materialsAmount, laborBreakdown.labor_total ?? 0, directCost, appliedQuoteValue);
    allocationBaseAmounts[allocation.bucket_code] = base;
    allocationAmounts[allocation.bucket_code] = roundMoney(base * pct);
  });
  const internalCost = directCost + Object.values(allocationAmounts).reduce((total, value) => total + value, 0);
  const profitAmount = roundMoney(appliedQuoteValue - internalCost);
  const roleCostAllocations = buildSimpleRoleAllocations(journeyRoleSnapshot, laborBreakdown, journey.execution_days ?? 0);
  laborBreakdown.role_allocation_total = sum(roleCostAllocations.map((item) => item.amount ?? 0));
  laborBreakdown.sale_related_excluded = allocationAmounts['06_sales_cost'];
  laborBreakdown.management_related_excluded = allocationAmounts['07_management_cost'];
  const baseRate = policy.quote_suggestion_rule?.base_quote_rate_m2 ?? 0;
  const area = journeyInputSnapshot?.area_m2 ?? 0;
  const complexity = journeyInputSnapshot?.project_complexity_factor ?? 1;
  const standardizedBuckets: IStandardizedBucketsItem[] = [
    {
      bucket_code: '01_materials',
      bucket_name: 'Materials',
      rate_pct: sharePct(materialsAmount, appliedQuoteValue),
      base_amount: materialsAmount,
      amount: materialsAmount,
      formula_source: usedTemplates ? 'sum(template material components)' : 'base_quote_rate_m2 x area_m2 x project_complexity_factor',
      note: usedTemplates
        ? 'Materials aggregated from template-generated component lines across ' + String(directCostGroups.length) + ' direct-cost group(s).'
        : 'Fallback materials derived from quote_suggestion_rule base rate ' + String(baseRate) + ' x area ' + String(area) + ' x complexity ' + String(complexity) + '.',
    },
    {
      bucket_code: '02_labor_total',
      bucket_name: 'Labor',
      rate_pct: sharePct(laborBreakdown.labor_total ?? 0, appliedQuoteValue),
      base_amount: laborBreakdown.labor_total ?? 0,
      amount: laborBreakdown.labor_total ?? 0,
      formula_source: 'template labor + internal salary allocation + technical commission + supervisor commission',
      note: 'Outsource/template labor ' + String(templateLabor) + ', internal salary ' + String(internalFixedSalary) + ', technical commission ' + String(technicalCommission) + ', supervisor commission ' + String(supervisorCommission) + '.',
    },
    {
      bucket_code: '03_warranty_maintenance',
      bucket_name: 'Warranty & Maintenance',
      rate_pct: sharePct(allocationAmounts['03_warranty_maintenance'], appliedQuoteValue),
      base_amount: allocationBaseAmounts['03_warranty_maintenance'],
      amount: allocationAmounts['03_warranty_maintenance'],
      formula_source: allocationPolicyMap.get('03_warranty_maintenance')?.formula_code ?? ((allocationPolicyMap.get('03_warranty_maintenance')?.default_rate_pct ?? 0) + '% x ' + describeAllocationBase(allocationPolicyMap.get('03_warranty_maintenance')?.calc_base)),
      note: bucketNoteFromAllocation(allocationPolicyMap.get('03_warranty_maintenance')),
    },
    {
      bucket_code: '04_risk',
      bucket_name: 'Risk',
      rate_pct: sharePct(allocationAmounts['04_risk'], appliedQuoteValue),
      base_amount: allocationBaseAmounts['04_risk'],
      amount: allocationAmounts['04_risk'],
      formula_source: allocationPolicyMap.get('04_risk')?.formula_code ?? ((allocationPolicyMap.get('04_risk')?.default_rate_pct ?? 0) + '% x ' + describeAllocationBase(allocationPolicyMap.get('04_risk')?.calc_base)),
      note: bucketNoteFromAllocation(allocationPolicyMap.get('04_risk')),
    },
    {
      bucket_code: '05_corporate_tax',
      bucket_name: 'Corporate Tax',
      rate_pct: sharePct(allocationAmounts['05_corporate_tax'], appliedQuoteValue),
      base_amount: allocationBaseAmounts['05_corporate_tax'],
      amount: allocationAmounts['05_corporate_tax'],
      formula_source: allocationPolicyMap.get('05_corporate_tax')?.formula_code ?? ((allocationPolicyMap.get('05_corporate_tax')?.default_rate_pct ?? 0) + '% x ' + describeAllocationBase(allocationPolicyMap.get('05_corporate_tax')?.calc_base)),
      note: bucketNoteFromAllocation(allocationPolicyMap.get('05_corporate_tax')),
    },
    {
      bucket_code: '06_sales_cost',
      bucket_name: 'Sales Cost',
      rate_pct: sharePct(allocationAmounts['06_sales_cost'], appliedQuoteValue),
      base_amount: allocationBaseAmounts['06_sales_cost'],
      amount: allocationAmounts['06_sales_cost'],
      formula_source: allocationPolicyMap.get('06_sales_cost')?.formula_code ?? ((allocationPolicyMap.get('06_sales_cost')?.default_rate_pct ?? 0) + '% x ' + describeAllocationBase(allocationPolicyMap.get('06_sales_cost')?.calc_base)),
      note: bucketNoteFromAllocation(allocationPolicyMap.get('06_sales_cost')),
    },
    {
      bucket_code: '07_management_cost',
      bucket_name: 'Management Cost',
      rate_pct: sharePct(allocationAmounts['07_management_cost'], appliedQuoteValue),
      base_amount: allocationBaseAmounts['07_management_cost'],
      amount: allocationAmounts['07_management_cost'],
      formula_source: allocationPolicyMap.get('07_management_cost')?.formula_code ?? ((allocationPolicyMap.get('07_management_cost')?.default_rate_pct ?? 0) + '% x ' + describeAllocationBase(allocationPolicyMap.get('07_management_cost')?.calc_base)),
      note: bucketNoteFromAllocation(allocationPolicyMap.get('07_management_cost')),
    },
    {
      bucket_code: '08_hidden_cost',
      bucket_name: 'Hidden Cost',
      rate_pct: sharePct(allocationAmounts['08_hidden_cost'], appliedQuoteValue),
      base_amount: allocationBaseAmounts['08_hidden_cost'],
      amount: allocationAmounts['08_hidden_cost'],
      formula_source: allocationPolicyMap.get('08_hidden_cost')?.formula_code ?? ((allocationPolicyMap.get('08_hidden_cost')?.default_rate_pct ?? 0) + '% x ' + describeAllocationBase(allocationPolicyMap.get('08_hidden_cost')?.calc_base)),
      note: bucketNoteFromAllocation(allocationPolicyMap.get('08_hidden_cost')),
    },
    {
      bucket_code: '09_profit',
      bucket_name: 'Profit',
      rate_pct: sharePct(profitAmount, appliedQuoteValue),
      base_amount: appliedQuoteValue,
      amount: profitAmount,
      formula_source: 'applied_quote_value - internal_cost',
      note: 'Residual profit after subtracting direct cost and all configured allocations from the applied quote value.',
    },
  ];
  const quoteDerivationNote = usedTemplates
    ? (auto_matched_single_template ? templateSelectionNote : 'Generated from matched template rules. ' + templateSelectionNote)
    : finalFallbackReason;
  return {
    journeyInputSnapshot,
    journeyRoleSnapshot,
    roleCostAllocations,
    directCostGroups: resolvedGroups,
    laborBreakdown,
    standardizedBuckets,
    quoteDerivation: {
      recommended_quote_value_initial: recommendedQuote,
      pricing_mode: appliedQuoteValueOverride ? 'target_quote_check' : 'policy_first',
      note: quoteDerivationNote,
    },
    validationResult: {
      is_feasible: profitAmount >= 0,
      target_profit_pct_min: policy.profit_policy?.target_profit_pct_min ?? 0,
      actual_profit_pct: appliedQuoteValue > 0 ? roundMoney((profitAmount / appliedQuoteValue) * 10000) / 100 : 0,
      warning_codes: usedTemplates ? [] : ['template_fallback'],
      warning_note: usedTemplates ? undefined : finalFallbackReason,
    },
    solutionResolution: {
      resolved_scale_type: resolvedScaleType as any,
      policy_resolution_mode: (policyResolutionMode ?? (policy.service_type_id ? 'service_default' : 'global_default')) as any,
      policy_resolution_note: policy.name ?? policy.code,
      generation_status: (usedTemplates ? 'ready' : 'partial') as any,
      calc_engine_version: 'step04-auto-solution-v1',
      template_selection_note: templateSelectionNote || (usedTemplates ? 'Template-based direct-cost groups were generated.' : finalFallbackReason),
    },
    internalCost,
    appliedQuoteValue,
    recommendedQuote,
    selectedTemplateCount: directCostGroups.length,
  };
};






