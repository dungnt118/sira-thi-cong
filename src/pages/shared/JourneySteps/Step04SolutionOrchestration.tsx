/**
 * Step04SolutionOrchestration
 *
 * Internal estimate (JourneyEstimate) for a journey:
 *   0. Estimation Config — pricing_policy_id + total_estimate_cost (edit-mode header)
 *   1. 9 standardized cost buckets  (summary)
 *   2. Labor breakdown               (Nhân công chi tiết)
 *   3. Direct-cost groups            (Vật tư & hạng mục trực tiếp)
 *
 * Auto-calc rules:
 *   - pricing_policy_id selected  → compute total_estimate_cost automatically
 *   - total_estimate_cost provided → use as contractValue override
 *   - neither                      → auto-find policy (by serviceTypeId → is_default)
 *
 * All IJourneyEstimate fields are saved on submit.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert, Button, Card, Col, Collapse, Divider, Form, Input,
  InputNumber, List, Popconfirm, Progress, Row, Select,
  Space, Spin, Statistic, Table, Tag, Tooltip, Typography,
  message as antMessage,
} from 'antd';
import {
  AuditOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  PercentageOutlined,
  PlusOutlined,
  RocketOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SettingOutlined,
  SyncOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from '@ant-design/icons';

import { useJourneyEstimateFlow } from '../../../hooks/journey/useJourneyEstimateFlow';
import { estimatePricingPolicyService } from '../../../services/core-contracts/services/estimatePricingPolicy.service';
import type {
  IDirectCostGroupsItem,
  IJourneyEstimate,
  ILaborBreakdownItem,
  IStandardizedBucketsItem,
} from '../../../services/core-contracts/types/journeyEstimate.types';
import type { StandardizedBucketsBucketCodeEnum } from '../../../services/core-contracts/types/journeyEstimate.types';
import type {
  IEstimatePricingPolicy,
  IAllocationPolicyItem,
} from '../../../services/core-contracts/types/estimatePricingPolicy.types';

const { Text, Title } = Typography;
const { Panel } = Collapse;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

const BUCKET_CONFIGS: {
  code: StandardizedBucketsBucketCodeEnum;
  label: string;
  color: string;
  note?: string;
}[] = [
  { code: '01_materials',            label: 'Vật tư (Materials)',       color: '#52c41a' },
  { code: '02_labor_total',          label: 'Nhân công (Labor)',         color: '#1890ff' },
  { code: '03_warranty_maintenance', label: 'Bảo hành & Bảo trì',       color: '#faad14', note: 'Hậu dự án' },
  { code: '04_risk',                 label: 'Dự phòng rủi ro',           color: '#fa8c16' },
  { code: '05_corporate_tax',        label: 'Thuế doanh nghiệp',         color: '#722ed1' },
  { code: '06_sales_cost',           label: 'Chi phí bán hàng',          color: '#eb2f96' },
  { code: '07_management_cost',      label: 'Chi phí gián tiếp',         color: '#13c2c2', note: 'Quản lý & vận hành' },
  { code: '08_hidden_cost',          label: 'Chi phí ẩn',                color: '#f5222d' },
  { code: '09_profit',               label: 'Lợi nhuận (Profit)',         color: '#fa541c' },
];

const EMPTY_LABOR: ILaborBreakdownItem = {
  outsource_labor: 0, internal_fixed_salary: 0,
  technical_commission: 0, supervisor_commission: 0, labor_total: 0, note: '',
};

const newGroup = (): IDirectCostGroupsItem => ({
  name: '', quantity: 1, unit: 'm²',
  material_amount: 0, labor_amount: 0, other_amount: 0,
  subtotal: 0, note: '', components: [],
});

function recomputeGroup(g: IDirectCostGroupsItem): IDirectCostGroupsItem {
  const qty = g.quantity ?? 1;
  const sub = ((g.material_amount ?? 0) + (g.labor_amount ?? 0) + (g.other_amount ?? 0)) * qty;
  return { ...g, subtotal: sub };
}

function recomputeLabor(lb: ILaborBreakdownItem): ILaborBreakdownItem {
  const total =
    (lb.outsource_labor ?? 0) +
    (lb.internal_fixed_salary ?? 0) +
    (lb.technical_commission ?? 0) +
    (lb.supervisor_commission ?? 0);
  return { ...lb, labor_total: total };
}

// ─── Calculation engine ───────────────────────────────────────────────────────

interface ComputeResult {
  buckets: IStandardizedBucketsItem[];
  labor: ILaborBreakdownItem;
  directCostGroups: IDirectCostGroupsItem[];
  contractValue: number;
  recommendedQuote: number;
  policyName: string;
  quoteDerivation: IJourneyEstimate['quote_derivation'];
  validationResult: IJourneyEstimate['validation_result'];
}

/**
 * CORRECT calculation chain:
 *
 * Step 1 — MATERIALS (01): base_rate_m2 × area_m2 × complexity  [FIXED, independent of total]
 * Step 2 — LABOR (02): salary from execution_days + commissions % of materials  [FIXED, independent of total]
 * Step 3 — ALLOCATIONS (03-08): each % of their calc_base (direct_cost / labor / material / contract_value)
 *   • For contract_value-based: solve algebraically to avoid circular dependency
 * Step 4 — RECOMMENDED QUOTE: solve T = (fixed_costs) / (1 - cv_alloc_pct - target_profit_pct)
 * Step 5 — CONTRACT VALUE: use user's targetTotal if provided, else recommendedQuote
 * Step 6 — PROFIT (09): ALWAYS = contractValue - sum(01-08)  [residual, NOT a fixed %]
 * Step 7 — AUTO-GENERATE direct_cost_groups from area + rates
 *
 * @param targetTotal  User-supplied total_estimate_cost override (changes profit only)
 */
function computeFromPolicy(
  policy: IEstimatePricingPolicy,
  area_m2: number,
  execution_days: number,
  complexity_level?: string,
  targetTotal?: number,
): ComputeResult {
  const qsr = policy.quote_suggestion_rule;
  const lp  = policy.labor_policy;

  // ── Complexity multiplier (scale applies only at very_difficult) ───────────
  const complexityFactor     = qsr?.complexity_factor ?? 1;
  const scaleFactor          = qsr?.scale_factor ?? 1;
  const complexityMultiplier =
    complexity_level === 'very_difficult' ? complexityFactor * scaleFactor
    : complexity_level === 'difficult'    ? complexityFactor
    : 1;

  // ── Step 1: MATERIALS — independent of total ─────────────────────────────
  // base_quote_rate_m2 represents the direct material cost rate per m²
  const baseRate         = qsr?.base_quote_rate_m2 ?? 0;
  const materialsAmount  = Math.round(baseRate * area_m2 * complexityMultiplier);

  // ── Step 2: LABOR — independent of total ─────────────────────────────────
  const workingDays     = lp?.working_days_per_month ?? 26;
  // Internal salary: prorated to execution_days
  const internalSalary  = Math.round(
    ((lp?.internal_salary_monthly ?? 0) + (lp?.internal_support_monthly ?? 0))
    / workingDays
    * execution_days
    * (lp?.salary_allocation_factor ?? 1),
  );
  // Commissions are % of direct material cost (independent of quote)
  const techComm   = Math.round(materialsAmount * ((lp?.technical_commission_pct  ?? 0) / 100));
  const supComm    = Math.round(materialsAmount * ((lp?.supervisor_commission_pct ?? 0) / 100));
  const laborTotal = internalSalary + techComm + supComm;

  const labor: ILaborBreakdownItem = {
    internal_fixed_salary: internalSalary,
    technical_commission:  techComm,
    supervisor_commission: supComm,
    outsource_labor:       0,
    labor_total:           laborTotal,
    note: `Lương ${execution_days}ng: ${internalSalary.toLocaleString('vi-VN')}đ | KT ${lp?.technical_commission_pct ?? 0}%: ${techComm.toLocaleString('vi-VN')}đ | GS ${lp?.supervisor_commission_pct ?? 0}%: ${supComm.toLocaleString('vi-VN')}đ`,
  };

  // ── Step 3a: ALLOCATIONS with known bases (not contract_value) ────────────
  const directCost = materialsAmount + laborTotal;

  interface AllocEntry { amount: number; note: string; pct: number }
  const alloc: Record<string, AllocEntry> = {};

  (policy.allocation_policy ?? []).forEach((ap: IAllocationPolicyItem) => {
    if (!ap.bucket_code) return;
    const pct = (ap.default_rate_pct ?? 0) / 100;
    let base: number | null = null;
    switch (ap.calc_base) {
      case 'material_cost': base = materialsAmount; break;
      case 'labor_cost':    base = laborTotal;      break;
      case 'direct_cost':   base = directCost;      break;
      default:              base = null; // contract_value — defer to step 3b
    }
    if (base !== null) {
      alloc[ap.bucket_code] = {
        amount: Math.round(base * pct),
        note:   ap.note ? ap.note : `${ap.default_rate_pct}% × ${ap.calc_base ?? 'direct_cost'}`,
        pct,
      };
    }
  });

  const fixedAllocSum = Object.values(alloc).reduce((s, v) => s + v.amount, 0);

  // ── Step 4: Solve for RECOMMENDED QUOTE ──────────────────────────────────
  // Sum of pct for contract_value-based allocations
  const cvAllocPct = (policy.allocation_policy ?? [])
    .filter(ap => ap.calc_base === 'contract_value' || (!ap.calc_base && ap.bucket_code))
    .reduce((s, ap) => s + (ap.default_rate_pct ?? 0) / 100, 0);

  const targetProfitPct     = (policy.profit_policy?.target_profit_pct_min ?? 15) / 100;
  const denominator         = 1 - cvAllocPct - targetProfitPct;
  // T × denominator = directCost + fixedAllocSum → T = (directCost + fixedAllocSum) / denominator
  const recommendedQuote    = denominator > 0.01
    ? Math.round((directCost + fixedAllocSum) / denominator)
    : Math.round(directCost * 1.35); // safety fallback: 35% markup

  // ── Step 3b: ALLOCATIONS with contract_value base ────────────────────────
  // Use recommendedQuote as proxy for contract_value (best estimate before total is decided)
  const quoteForAlloc = (targetTotal && targetTotal > 0) ? targetTotal : recommendedQuote;

  (policy.allocation_policy ?? []).forEach((ap: IAllocationPolicyItem) => {
    if (!ap.bucket_code) return;
    if (ap.calc_base === 'contract_value' || (!ap.calc_base && ap.bucket_code)) {
      const pct = (ap.default_rate_pct ?? 0) / 100;
      alloc[ap.bucket_code] = {
        amount: Math.round(quoteForAlloc * pct),
        note:   ap.note ? ap.note : `${ap.default_rate_pct}% × tổng hợp đồng`,
        pct,
      };
    }
  });

  const totalAllocSum = Object.values(alloc).reduce((s, v) => s + v.amount, 0);

  // ── Step 5: CONTRACT VALUE ────────────────────────────────────────────────
  const contractValue   = (targetTotal && targetTotal > 0) ? targetTotal : recommendedQuote;
  const totalInternalCost = materialsAmount + laborTotal + totalAllocSum;

  // ── Step 6: PROFIT — always RESIDUAL ─────────────────────────────────────
  const profitAmount    = Math.max(0, contractValue - totalInternalCost);
  const actualProfitPct = contractValue > 0
    ? Math.round((profitAmount / contractValue) * 1000) / 10
    : 0;

  // ── Step 7: BUILD BUCKETS with formula notes ──────────────────────────────
  const buckets: IStandardizedBucketsItem[] = BUCKET_CONFIGS.map((cfg, idx) => {
    let amount = 0;
    let note   = '';
    let formulaSource = 'policy_computed';

    if (cfg.code === '01_materials') {
      amount = materialsAmount;
      note   = `${baseRate.toLocaleString('vi-VN')} đ/m² × ${area_m2}m² × hệ số ${complexityMultiplier.toFixed(2)}`;
    } else if (cfg.code === '02_labor_total') {
      amount = laborTotal;
      note   = labor.note ?? '';
    } else if (cfg.code === '09_profit') {
      amount = profitAmount;
      note   = `${fmt(contractValue)} − chi phí ${fmt(totalInternalCost)} = ${fmt(profitAmount)} (${actualProfitPct}%)`;
      formulaSource = 'residual';
    } else {
      const entry = alloc[cfg.code];
      amount = entry?.amount ?? 0;
      note   = entry?.note   ?? '';
    }

    return {
      bucket_code:    cfg.code,
      bucket_name:    cfg.label,
      amount,
      base_amount:    amount,
      rate_pct:       contractValue > 0 ? Math.round((amount / contractValue) * 1000) / 10 : 0,
      formula_source: formulaSource,
      sort_order:     idx + 1,
      note,
    };
  });

  // ── Step 8: AUTO-GENERATE direct_cost_groups ──────────────────────────────
  const laborPerM2     = area_m2 > 0 ? Math.round(laborTotal / area_m2) : 0;
  const directCostGroups: IDirectCostGroupsItem[] = [
    {
      name:            `Thi công tổng thể (${area_m2}m² - ${complexity_level ?? 'standard'})`,
      quantity:        area_m2,
      unit:            'm²',
      material_amount: baseRate,                    // per-unit rate
      labor_amount:    laborPerM2,                  // per-unit rate
      other_amount:    0,
      subtotal:        materialsAmount + laborTotal,
      note:            `Policy: ${policy.name ?? policy.code} | Base: ${baseRate.toLocaleString('vi-VN')}đ/m²`,
      components: [
        {
          type:         'material' as const,
          calc_mode:    'package_m2' as const,
          quantity:     area_m2,
          unit:         'm²',
          unit_price:   Math.round(baseRate * complexityMultiplier),
          line_total:   materialsAmount,
          formula_code: `base_rate_m2 × area × complexity(${complexityMultiplier.toFixed(2)})`,
          note:         `Vật tư thi công theo diện tích`,
        },
        {
          type:         'labor' as const,
          calc_mode:    'daily_worker' as const,
          quantity:     execution_days,
          unit:         'ngày',
          unit_price:   execution_days > 0 ? Math.round(internalSalary / execution_days) : 0,
          line_total:   internalSalary,
          formula_code: `salary / working_days × execution_days × allocation_factor`,
          note:         `Lương nội bộ ${execution_days} ngày`,
        },
        ...(techComm > 0 ? [{
          type:         'labor' as const,
          calc_mode:    'package_m2' as const,
          quantity:     area_m2,
          unit:         'm²',
          unit_price:   area_m2 > 0 ? Math.round(techComm / area_m2) : 0,
          line_total:   techComm,
          formula_code: `materials × ${lp?.technical_commission_pct ?? 0}%`,
          note:         `Hoa hồng Kỹ thuật`,
        }] : []),
        ...(supComm > 0 ? [{
          type:         'labor' as const,
          calc_mode:    'package_m2' as const,
          quantity:     area_m2,
          unit:         'm²',
          unit_price:   area_m2 > 0 ? Math.round(supComm / area_m2) : 0,
          line_total:   supComm,
          formula_code: `materials × ${lp?.supervisor_commission_pct ?? 0}%`,
          note:         `Hoa hồng Giám sát`,
        }] : []),
      ],
    },
  ];

  // ── Derivation record ─────────────────────────────────────────────────────
  const quoteDerivation: IJourneyEstimate['quote_derivation'] = {
    recommended_quote_value_initial: recommendedQuote,
    final_quote_floor:               qsr?.min_quote_floor ?? 0,
    base_quote_rate_m2:              baseRate,
    duration_factor:                 1,
    scale_factor:                    scaleFactor,
    complexity_factor:               complexityMultiplier,
    pricing_mode:                    targetTotal ? 'target_quote_check' : 'profit_target_optimize',
    note: targetTotal
      ? `Tổng kỳ vọng: ${fmt(targetTotal)} | Policy đề xuất: ${fmt(recommendedQuote)} | LN thực: ${actualProfitPct}%`
      : `Policy: "${policy.name ?? policy.code}" | Đề xuất tối thiểu đạt LN ${(targetProfitPct * 100).toFixed(0)}%`,
  };

  const warningThreshold = policy.profit_policy?.warning_threshold_pct ?? (targetProfitPct * 100);
  const validationResult: IJourneyEstimate['validation_result'] = {
    is_feasible:           actualProfitPct >= warningThreshold,
    target_profit_pct_min: targetProfitPct * 100,
    actual_profit_pct:     actualProfitPct,
    warning_codes:         [
      ...(actualProfitPct < warningThreshold ? ['PROFIT_BELOW_TARGET'] : []),
      ...(targetTotal && targetTotal < totalInternalCost ? ['QUOTE_BELOW_COST'] : []),
    ],
    warning_note: actualProfitPct < warningThreshold
      ? `LN thực tế ${actualProfitPct}% thấp hơn mục tiêu ${warningThreshold}%`
      : undefined,
  };

  return {
    buckets,
    labor,
    directCostGroups,
    contractValue,
    recommendedQuote,
    policyName:      policy.name ?? policy.code ?? policy._id,
    quoteDerivation,
    validationResult,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const BucketsViewGrid: React.FC<{ buckets: IStandardizedBucketsItem[] }> = ({ buckets }) => {
  const get = (code: string) => buckets.find(b => b.bucket_code === code);
  return (
    <Row gutter={[12, 12]}>
      {BUCKET_CONFIGS.map(cfg => {
        const bucket = get(cfg.code);
        const amount = bucket?.amount ?? 0;
        const note   = bucket?.note ?? cfg.note ?? '';
        return (
          <Col span={8} key={cfg.code}>
            <Card size="small" style={{ borderLeft: `4px solid ${cfg.color}`, height: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size={0}>
                <Space>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>{cfg.label}</Text>
                  {bucket?.rate_pct ? <Tag style={{ marginLeft: 4, fontSize: 10 }}>{bucket.rate_pct}%</Tag> : null}
                </Space>
                <Title level={4} style={{ margin: '6px 0 0', color: cfg.code === '09_profit' ? '#fa541c' : undefined }}>
                  {fmt(amount)}
                </Title>
                {note && <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 2 }}>{note}</Text>}
              </Space>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

const BucketsEditTable: React.FC<{
  buckets: IStandardizedBucketsItem[];
  onChange: (b: IStandardizedBucketsItem[]) => void;
}> = ({ buckets, onChange }) => {
  const set = (code: string, field: 'amount' | 'note', val: number | string | null) =>
    onChange(buckets.map(b => b.bucket_code === code ? { ...b, [field]: val ?? 0 } : b));

  return (
    <Table
      dataSource={buckets} rowKey="bucket_code" pagination={false} size="small" bordered
      columns={[
        {
          title: 'Bucket', dataIndex: 'bucket_code', width: 190,
          render: (code: string) => {
            const c = BUCKET_CONFIGS.find(x => x.code === code);
            return <Space>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c?.color, display: 'inline-block' }} />
              <Text style={{ fontSize: 12 }}>{c?.label ?? code}</Text>
            </Space>;
          },
        },
        {
          title: '%', dataIndex: 'rate_pct', width: 55, align: 'right' as const,
          render: (v: number) => v ? <Text type="secondary" style={{ fontSize: 11 }}>{v}%</Text> : null,
        },
        {
          title: 'Số tiền (VNĐ)', dataIndex: 'amount',
          render: (val: number, r: IStandardizedBucketsItem) =>
            <InputNumber value={val} min={0} size="small" style={{ width: '100%' }}
              formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={v => Number(v?.replace(/,/g, '') || 0)}
              onChange={v => set(r.bucket_code!, 'amount', v)} />,
        },
        {
          title: 'Ghi chú', dataIndex: 'note',
          render: (val: string, r: IStandardizedBucketsItem) =>
            <Input value={val} size="small" placeholder="Ghi chú..."
              onChange={e => set(r.bucket_code!, 'note', e.target.value)} />,
        },
        {
          title: 'Thành tiền', align: 'right' as const, width: 130,
          render: (_: any, r: IStandardizedBucketsItem) =>
            <Text strong style={{ color: r.bucket_code === '09_profit' ? '#fa541c' : undefined }}>
              {fmt(r.amount || 0)}
            </Text>,
        },
      ]}
      summary={rows => {
        const total = rows.reduce((s, r) => s + (r.amount || 0), 0);
        return <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={4}><Text strong>Tổng cộng</Text></Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="right">
            <Text strong style={{ color: '#cf1322', fontSize: 15 }}>{fmt(total)}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>;
      }}
    />
  );
};

const LaborView: React.FC<{ lb: ILaborBreakdownItem }> = ({ lb }) => (
  <Row gutter={[16, 8]}>
    {[
      { label: 'Nhân công outsource',     value: lb.outsource_labor },
      { label: 'Lương nội bộ (cố định)',  value: lb.internal_fixed_salary },
      { label: 'Hoa hồng Kỹ thuật',       value: lb.technical_commission },
      { label: 'Hoa hồng Giám sát',       value: lb.supervisor_commission },
    ].map(row => (
      <Col span={12} key={row.label}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
          <Text type="secondary" style={{ fontSize: 13 }}>{row.label}</Text>
          <Text strong>{fmt(row.value ?? 0)}</Text>
        </div>
      </Col>
    ))}
    <Col span={24}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#fafafa', borderRadius: 6, marginTop: 4 }}>
        <Text strong style={{ fontSize: 14 }}>Tổng nhân công (tự tính)</Text>
        <Text strong style={{ fontSize: 15, color: '#1890ff' }}>{fmt(lb.labor_total ?? 0)}</Text>
      </div>
    </Col>
    {lb.note && <Col span={24}><Text type="secondary" style={{ fontSize: 12 }}>Ghi chú: {lb.note}</Text></Col>}
  </Row>
);

const LaborEdit: React.FC<{
  lb: ILaborBreakdownItem;
  onChange: (lb: ILaborBreakdownItem) => void;
}> = ({ lb, onChange }) => {
  const set = (field: keyof ILaborBreakdownItem, val: number | string | null) => {
    const next = { ...lb, [field]: val ?? 0 };
    onChange(recomputeLabor(next));
  };
  const rows: { label: string; field: keyof ILaborBreakdownItem }[] = [
    { label: 'Nhân công outsource',    field: 'outsource_labor' },
    { label: 'Lương nội bộ (cố định)', field: 'internal_fixed_salary' },
    { label: 'Hoa hồng Kỹ thuật',      field: 'technical_commission' },
    { label: 'Hoa hồng Giám sát',      field: 'supervisor_commission' },
  ];
  return (
    <div>
      <Row gutter={[16, 0]}>
        {rows.map(r => (
          <Col span={12} key={r.field}>
            <Form.Item label={r.label} style={{ marginBottom: 12 }}>
              <InputNumber
                value={lb[r.field] as number}
                min={0} style={{ width: '100%' }} size="small"
                formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={v => Number(v?.replace(/,/g, '') || 0)}
                onChange={v => set(r.field, v)}
              />
            </Form.Item>
          </Col>
        ))}
      </Row>
      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#e6f7ff', borderRadius: 6, padding: '8px 12px', marginBottom: 8 }}>
        <Text strong>Tổng nhân công (tự tính)</Text>
        <Text strong style={{ color: '#1890ff', fontSize: 14 }}>{fmt(lb.labor_total ?? 0)}</Text>
      </div>
      <Form.Item label="Ghi chú" style={{ marginBottom: 0 }}>
        <Input value={lb.note} size="small" onChange={e => onChange({ ...lb, note: e.target.value })} />
      </Form.Item>
    </div>
  );
};

const DirectCostView: React.FC<{ groups: IDirectCostGroupsItem[] }> = ({ groups }) => {
  if (!groups.length) return <Text type="secondary">Chưa có hạng mục vật tư nào.</Text>;
  return (
    <Collapse size="small" ghost>
      {groups.map((g, i) => (
        <Panel
          key={i}
          header={
            <Space>
              <Text strong>{g.name || `Hạng mục ${i + 1}`}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>×{g.quantity ?? 1} {g.unit}</Text>
              <Tag color="blue">{fmt(g.subtotal ?? 0)}</Tag>
            </Space>
          }
        >
          <Row gutter={[12, 4]} style={{ marginBottom: 8 }}>
            {[
              { label: 'Vật tư',        value: g.material_amount },
              { label: 'Nhân công',     value: g.labor_amount },
              { label: 'Chi phí khác',  value: g.other_amount },
            ].map(row => (
              <Col span={8} key={row.label}>
                <div style={{ textAlign: 'center', background: '#fafafa', borderRadius: 6, padding: '6px 8px' }}>
                  <div style={{ fontSize: 11, color: '#888' }}>{row.label}</div>
                  <div style={{ fontWeight: 600 }}>{fmt(row.value ?? 0)}</div>
                </div>
              </Col>
            ))}
          </Row>
          {(g.components?.length ?? 0) > 0 && (
            <Table
              dataSource={g.components}
              rowKey={(_, idx) => String(idx)}
              pagination={false}
              size="small"
              columns={[
                { title: 'Loại', dataIndex: 'type', width: 80, render: (v: string) => <Tag>{v}</Tag> },
                { title: 'SL', dataIndex: 'quantity', width: 60, align: 'right' as const },
                { title: 'ĐVT', dataIndex: 'unit', width: 60 },
                { title: 'Đơn giá', dataIndex: 'unit_price', align: 'right' as const, render: (v: number) => fmt(v) },
                { title: 'Thành tiền', dataIndex: 'line_total', align: 'right' as const, render: (v: number) => <Text strong>{fmt(v)}</Text> },
                { title: 'Ghi chú', dataIndex: 'note', render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
              ]}
            />
          )}
          {g.note && <div style={{ marginTop: 6 }}><Text type="secondary" style={{ fontSize: 12 }}>Ghi chú hạng mục: {g.note}</Text></div>}
        </Panel>
      ))}
    </Collapse>
  );
};

const DirectCostEdit: React.FC<{
  groups: IDirectCostGroupsItem[];
  onChange: (groups: IDirectCostGroupsItem[]) => void;
}> = ({ groups, onChange }) => {
  const setGroup = (idx: number, patch: Partial<IDirectCostGroupsItem>) => {
    const next = groups.map((g, i) => i === idx ? recomputeGroup({ ...g, ...patch }) : g);
    onChange(next);
  };
  const addGroup    = () => onChange([...groups, newGroup()]);
  const removeGroup = (idx: number) => onChange(groups.filter((_, i) => i !== idx));

  return (
    <div>
      {groups.map((g, i) => (
        <Card
          key={i}
          size="small"
          style={{ marginBottom: 10, border: '1px solid #e8e8e8' }}
          title={
            <Space>
              <Text strong style={{ fontSize: 13 }}>{g.name || `Hạng mục ${i + 1}`}</Text>
              <Tag color="blue">{fmt(g.subtotal ?? 0)}</Tag>
            </Space>
          }
          extra={
            <Popconfirm title="Xóa hạng mục này?" onConfirm={() => removeGroup(i)} okText="Xóa" cancelText="Hủy">
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          }
        >
          <Row gutter={[12, 0]}>
            <Col span={10}>
              <Form.Item label="Tên hạng mục" style={{ marginBottom: 8 }}>
                <Input value={g.name} size="small" onChange={e => setGroup(i, { name: e.target.value })} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="Số lượng" style={{ marginBottom: 8 }}>
                <InputNumber value={g.quantity} min={0} size="small" style={{ width: '100%' }}
                  onChange={v => setGroup(i, { quantity: v ?? 0 })} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="Đơn vị" style={{ marginBottom: 8 }}>
                <Input value={g.unit} size="small" onChange={e => setGroup(i, { unit: e.target.value })} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Chi phí Vật tư" style={{ marginBottom: 8 }}>
                <InputNumber value={g.material_amount} min={0} size="small" style={{ width: '100%' }}
                  formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={v => Number(v?.replace(/,/g, '') || 0)}
                  onChange={v => setGroup(i, { material_amount: v ?? 0 })} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Chi phí Nhân công" style={{ marginBottom: 8 }}>
                <InputNumber value={g.labor_amount} min={0} size="small" style={{ width: '100%' }}
                  formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={v => Number(v?.replace(/,/g, '') || 0)}
                  onChange={v => setGroup(i, { labor_amount: v ?? 0 })} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Chi phí khác" style={{ marginBottom: 8 }}>
                <InputNumber value={g.other_amount} min={0} size="small" style={{ width: '100%' }}
                  formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={v => Number(v?.replace(/,/g, '') || 0)}
                  onChange={v => setGroup(i, { other_amount: v ?? 0 })} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ghi chú" style={{ marginBottom: 0 }}>
                <Input value={g.note} size="small" onChange={e => setGroup(i, { note: e.target.value })} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ))}
      <Button type="dashed" block icon={<PlusOutlined />} onClick={addGroup}>
        Thêm hạng mục
      </Button>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const Step04SolutionOrchestration: React.FC<{ journeyId: string }> = ({ journeyId }) => {
  const { journey, estimate, loading, saveEstimate, readinessScore, refresh } = useJourneyEstimateFlow(journeyId);

  // ── Edit state ───────────────────────────────────────────────────────────
  const [isEditing,          setIsEditing]          = useState(false);
  const [editBuckets,        setEditBuckets]         = useState<IStandardizedBucketsItem[]>([]);
  const [editLabor,          setEditLabor]           = useState<ILaborBreakdownItem>(EMPTY_LABOR);
  const [editGroups,         setEditGroups]          = useState<IDirectCostGroupsItem[]>([]);

  // Estimation Config — top section
  const [editPolicyId,       setEditPolicyId]        = useState<string | null>(null);
  const [editTotalCost,      setEditTotalCost]        = useState<number | null>(null);

  // Computed metadata preserved for save
  const [savedQuoteDerivation,  setSavedQuoteDerivation]  = useState<IJourneyEstimate['quote_derivation'] | null>(null);
  const [savedValidationResult, setSavedValidationResult] = useState<IJourneyEstimate['validation_result'] | null>(null);

  const [isAutoCalcing,      setIsAutoCalcing]        = useState(false);
  const [autoCalcNote,       setAutoCalcNote]         = useState<string | null>(null);

  // Policy options for Select
  const [policyOptions,      setPolicyOptions]        = useState<{ label: string; value: string }[]>([]);
  const [policyOptLoading,   setPolicyOptLoading]     = useState(false);

  // ── Load policy options ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isEditing) return;
    setPolicyOptLoading(true);
    estimatePricingPolicyService.queryContent({
      group: { op: 'AND', children: [
        { id: 'status', operation: '==', value: 'active', children: [] },
      ]},
      sorted: [{ id: 'name', desc: false }],
      limit: 100,
    } as any)
      .then(res => {
        setPolicyOptions(
          (res?.data ?? []).map((p: IEstimatePricingPolicy) => ({
            label: p.name ?? p.code ?? p._id,
            value: p._id,
          })),
        );
      })
      .finally(() => setPolicyOptLoading(false));
  }, [isEditing]);

  // Total = saved total_estimate_cost, or sum of buckets
  const totalCost = estimate?.total_estimate_cost
    ?? estimate?.standardized_buckets?.reduce((a, b) => a + (b.amount || 0), 0)
    ?? 0;
  // Internal cost = everything except profit
  const internalCost = estimate?.standardized_buckets
    ?.filter(b => b.bucket_code !== '09_profit')
    .reduce((s, b) => s + (b.amount || 0), 0)
    ?? 0;

  // ── Edit lifecycle ───────────────────────────────────────────────────────
  const handleStartEdit = () => {
    const existingBuckets = estimate?.standardized_buckets ?? [];
    setEditBuckets(
      BUCKET_CONFIGS.map(cfg => {
        const found = existingBuckets.find(b => b.bucket_code === cfg.code);
        return found ?? { bucket_code: cfg.code, bucket_name: cfg.label, amount: 0, note: '' };
      }),
    );
    setEditLabor(estimate?.labor_breakdown ? { ...estimate.labor_breakdown } : { ...EMPTY_LABOR });
    setEditGroups(estimate?.direct_cost_groups ? estimate.direct_cost_groups.map(g => ({ ...g })) : []);
    setEditPolicyId(estimate?.pricing_policy_id ?? null);
    setEditTotalCost(estimate?.total_estimate_cost ?? null);
    setSavedQuoteDerivation(estimate?.quote_derivation ?? null);
    setSavedValidationResult(estimate?.validation_result ?? null);
    setAutoCalcNote(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditBuckets([]);
    setEditLabor(EMPTY_LABOR);
    setEditGroups([]);
    setEditPolicyId(null);
    setEditTotalCost(null);
    setSavedQuoteDerivation(null);
    setSavedValidationResult(null);
    setAutoCalcNote(null);
  };

  const handleSave = async () => {
    const computedTotal = editBuckets.reduce((s, b) => s + (b.amount || 0), 0);

    // Build journey_input_snapshot from current journey fields
    const journeyInputSnapshot: IJourneyEstimate['journey_input_snapshot'] = {
      service_type_id:          journey?.serviceTypeId,
      area_m2:                  journey?.area_m2,
      execution_days:           journey?.execution_days,
      project_complexity_factor:
        journey?.complexity_level === 'very_difficult' ? 1.5
        : journey?.complexity_level === 'difficult'    ? 1.2
        : 1,
    };

    const payload: Partial<IJourneyEstimate> = {
      pricing_policy_id:    editPolicyId ?? undefined,
      total_estimate_cost:  editTotalCost ?? computedTotal,
      journey_input_snapshot: journeyInputSnapshot,
      quote_derivation:     savedQuoteDerivation ?? undefined,
      validation_result:    savedValidationResult ?? {
        is_feasible:           true,
        target_profit_pct_min: 15,
        actual_profit_pct:     0,
        warning_codes:         [],
      },
      standardized_buckets: editBuckets,
      labor_breakdown:      editLabor,
      direct_cost_groups:   editGroups,
    };

    await saveEstimate(payload);
    setIsEditing(false);
  };

  // ── Auto-calc engine ─────────────────────────────────────────────────────
  /**
   * Fetches the right policy then runs computeFromPolicy.
   * Respects the priority: editPolicyId → serviceTypeId → is_default.
   * If editTotalCost is set, passes it as targetTotal override.
   */
  const runAutoCalc = useCallback(async (policyIdOverride?: string | null, totalOverride?: number | null) => {
    if (!journey?.area_m2 || !journey?.execution_days) {
      antMessage.warning('Cần nhập Diện tích và Số ngày thi công trước khi tính tự động.');
      return;
    }
    setIsAutoCalcing(true);
    try {
      let policy: IEstimatePricingPolicy | null = null;
      const resolvedPolicyId = policyIdOverride ?? editPolicyId;

      if (resolvedPolicyId) {
        // Fetch by explicit policy id
        try {
          policy = await estimatePricingPolicyService.findContent(resolvedPolicyId);
        } catch {
          policy = null;
        }
      }

      if (!policy && journey.serviceTypeId) {
        const r = await estimatePricingPolicyService.queryContent({
          group: { op: 'AND', children: [
            { id: 'service_type_id', operation: '==', value: journey.serviceTypeId, children: [] },
            { id: 'status',         operation: '==', value: 'active',              children: [] },
          ]},
          sorted: [{ id: 'createdTime', desc: true }], limit: 1,
        } as any);
        policy = r?.data?.[0] ?? null;
        if (policy && !resolvedPolicyId) {
          setEditPolicyId(policy._id);
        }
      }

      if (!policy) {
        const r = await estimatePricingPolicyService.queryContent({
          group: { op: 'AND', children: [
            { id: 'is_default', operation: '==', value: true,     children: [] },
            { id: 'status',     operation: '==', value: 'active', children: [] },
          ]}, limit: 1,
        } as any);
        policy = r?.data?.[0] ?? null;
        if (policy && !resolvedPolicyId) {
          setEditPolicyId(policy._id);
        }
      }

      if (!policy) {
        antMessage.error('Không tìm thấy chính sách giá. Kiểm tra Cấu hình → Chính sách giá.');
        return;
      }

      const resolvedTotal = totalOverride ?? editTotalCost ?? undefined;
      const result = computeFromPolicy(
        policy,
        journey.area_m2,
        journey.execution_days,
        journey.complexity_level,
        resolvedTotal && resolvedTotal > 0 ? resolvedTotal : undefined,
      );

      setEditBuckets(result.buckets);
      setEditLabor(result.labor);
      // Auto-populate direct_cost_groups only if currently empty (don't overwrite user's manual entries)
      setEditGroups(prev => prev.length === 0 ? result.directCostGroups : prev);
      setSavedQuoteDerivation(result.quoteDerivation);
      setSavedValidationResult(result.validationResult);

      // Sync total_estimate_cost from computation if not user-overridden
      if (!resolvedTotal || resolvedTotal === 0) {
        setEditTotalCost(result.contractValue);
      }

      const profitPct = result.validationResult?.actual_profit_pct ?? 0;
      const profitAmt = result.buckets.find(b => b.bucket_code === '09_profit')?.amount ?? 0;
      const noteLines = [
        `Tính từ policy "${result.policyName}"`,
        `Đề xuất tối ưu: ${fmt(result.recommendedQuote)} | Tổng áp dụng: ${fmt(result.contractValue)}`,
        `Vật tư: ${fmt(result.buckets.find(b => b.bucket_code === '01_materials')?.amount ?? 0)} | Nhân công: ${fmt(result.labor.labor_total ?? 0)} | Lợi nhuận: ${fmt(profitAmt)} (${profitPct}%)`,
      ];
      setAutoCalcNote(noteLines.join('\n'));
    } catch (err) {
      antMessage.error('Lỗi khi tính: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setIsAutoCalcing(false);
    }
  }, [journey, editPolicyId, editTotalCost]);

  // When policy is selected → auto-calc immediately
  const handlePolicyChange = (policyId: string | null) => {
    setEditPolicyId(policyId);
    if (policyId) {
      runAutoCalc(policyId, editTotalCost);
    }
  };

  // When total cost is changed → re-run calc with new total as override
  const handleTotalCostChange = (val: number | null) => {
    setEditTotalCost(val);
  };

  const isInputReady = !!(journey?.area_m2 && journey?.execution_days);

  // ── Toolbar ──────────────────────────────────────────────────────────────
  const toolbar = !isEditing ? (
    <Space>
      <Button size="small" icon={<SyncOutlined spin={loading} />} onClick={refresh}>Refresh</Button>
      <Button size="small" type="primary" icon={<EditOutlined />} onClick={handleStartEdit}>
        Tiến hành dự toán
      </Button>
    </Space>
  ) : (
    <Space>
      <Tooltip title={!isInputReady ? 'Cần Diện tích và Số ngày thi công' : 'Tính lại tự động từ chính sách giá'}>
        <Button size="small" icon={<RocketOutlined />} loading={isAutoCalcing}
          disabled={!isInputReady} onClick={() => runAutoCalc()}>
          Tự động tính
        </Button>
      </Tooltip>
      <Button size="small" type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
        Lưu dự toán
      </Button>
      <Button size="small" icon={<RollbackOutlined />} onClick={handleCancelEdit}>Hủy</Button>
    </Space>
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* 0. Estimation Config — only shown in edit mode */}
      {isEditing && (
        <Card
          size="small"
          style={{ background: '#f0f5ff', border: '1px solid #adc6ff' }}
          title={
            <Space>
              <SettingOutlined style={{ color: '#2f54eb' }} />
              <Text strong style={{ color: '#2f54eb' }}>Cấu hình dự toán</Text>
              <Tag color="blue">Đầu vào tính toán</Tag>
            </Space>
          }
        >
          <Row gutter={[16, 0]} align="bottom">
            <Col span={10}>
              <Form.Item
                label={<Text strong>Chọn chính sách tính giá dự toán</Text>}
                style={{ marginBottom: 0 }}
                extra={<Text type="secondary" style={{ fontSize: 11 }}>Chọn policy → hệ thống tự động tính toán phân bổ chi phí</Text>}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Chọn chính sách giá..."
                  style={{ width: '100%' }}
                  value={editPolicyId ?? undefined}
                  loading={policyOptLoading}
                  options={policyOptions}
                  filterOption={(input, opt) =>
                    (opt?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={handlePolicyChange}
                  notFoundContent={policyOptLoading ? <Spin size="small" /> : 'Không có chính sách nào'}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<Text strong>Tổng giá dự toán kỳ vọng (VNĐ)</Text>}
                style={{ marginBottom: 0 }}
                extra={<Text type="secondary" style={{ fontSize: 11 }}>Nhập để ghi đè giá tự động tính từ policy</Text>}
              >
                <InputNumber
                  value={editTotalCost ?? undefined}
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Để trống → tự tính"
                  formatter={v => v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                  parser={v => Number(v?.replace(/,/g, '') || 0)}
                  onChange={handleTotalCostChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item style={{ marginBottom: 0 }} label=" ">
                <Tooltip title={!isInputReady ? 'Cần Diện tích và Số ngày thi công' : 'Tính lại từ policy + các thông tin đầu vào'}>
                  <Button
                    type="primary"
                    block
                    icon={<ThunderboltOutlined />}
                    loading={isAutoCalcing}
                    disabled={!isInputReady}
                    onClick={() => runAutoCalc()}
                  >
                    Tính lại ngay
                  </Button>
                </Tooltip>
              </Form.Item>
            </Col>
          </Row>

          {autoCalcNote && (
            <Alert
              type="success" showIcon closable
              message={<span style={{ whiteSpace: 'pre-line', fontSize: 12 }}>{autoCalcNote}</span>}
              style={{ marginTop: 12 }}
              onClose={() => setAutoCalcNote(null)}
            />
          )}
        </Card>
      )}

      {/* 1. Cost Partition — 9 Buckets */}
      <Card
        size="small"
        title={<Space><BarChartOutlined /><Text strong>Cost Partition (9 Buckets)</Text></Space>}
        extra={toolbar}
      >
        {isEditing
          ? <BucketsEditTable buckets={editBuckets} onChange={setEditBuckets} />
          : <BucketsViewGrid  buckets={estimate?.standardized_buckets ?? []} />
        }
      </Card>

      {/* 2. Labor Breakdown */}
      <Card
        size="small"
        title={<Space><TeamOutlined /><Text strong>Nhân công chi tiết</Text></Space>}
      >
        {isEditing
          ? <LaborEdit lb={editLabor} onChange={setEditLabor} />
          : estimate?.labor_breakdown
            ? <LaborView lb={estimate.labor_breakdown} />
            : <Text type="secondary">Chưa có dữ liệu nhân công. Nhấn "Tiến hành dự toán" để nhập.</Text>
        }
      </Card>

      {/* 3. Direct Cost Groups */}
      <Card
        size="small"
        title={
          <Space>
            <ToolOutlined />
            <Text strong>Vật tư & Hạng mục trực tiếp</Text>
            {!isEditing && estimate?.direct_cost_groups?.length
              ? <Tag>{estimate.direct_cost_groups.length} hạng mục</Tag>
              : null}
          </Space>
        }
      >
        {isEditing
          ? <DirectCostEdit groups={editGroups} onChange={setEditGroups} />
          : estimate?.direct_cost_groups?.length
            ? <DirectCostView groups={estimate.direct_cost_groups} />
            : <Text type="secondary">Chưa có hạng mục. Nhấn "Tiến hành dự toán" để nhập.</Text>
        }
      </Card>

      {/* 4. Summary + Readiness */}
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small"
            title={<Space><SafetyCertificateOutlined /><Text strong>Financial Bound</Text></Space>}
            style={{ height: '100%' }}>
            <Statistic
              title="Tổng giá trị dự toán (Báo giá)"
              value={totalCost}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<DollarOutlined />}
              formatter={v => fmt(Number(v))}
            />
            <Divider style={{ margin: '10px 0' }} />
            <Space direction="vertical" style={{ width: '100%' }} size={6}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Chi phí nội bộ (01-08):</Text>
                <Text strong>{fmt(internalCost)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Lợi nhuận (phần dư):</Text>
                <Text strong style={{ color: (totalCost - internalCost) > 0 ? '#52c41a' : '#cf1322' }}>
                  {fmt(Math.max(0, totalCost - internalCost))}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">LN% thực tế:</Text>
                <Text strong style={{ color: (estimate?.validation_result?.actual_profit_pct ?? 0) >= (estimate?.validation_result?.target_profit_pct_min ?? 15) ? '#52c41a' : '#cf1322' }}>
                  {estimate?.validation_result?.actual_profit_pct ?? '—'}%
                  <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                    (mục tiêu: {estimate?.validation_result?.target_profit_pct_min ?? 15}%)
                  </Text>
                </Text>
              </div>
              {estimate?.quote_derivation?.recommended_quote_value_initial != null
                && estimate.quote_derivation.recommended_quote_value_initial !== totalCost && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px dashed #f0f0f0' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>Policy đề xuất:</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {fmt(estimate.quote_derivation.recommended_quote_value_initial)}
                  </Text>
                </div>
              )}
              {estimate?.pricing_policy_id && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>Policy:</Text>
                  <Tag color="geekblue" style={{ fontSize: 11 }}>
                    {(estimate as any)?.idx_pricing_policy_id?.title ?? estimate.pricing_policy_id}
                  </Tag>
                </div>
              )}
              {estimate?.validation_result?.warning_note && (
                <Alert type="warning" showIcon
                  message={estimate.validation_result.warning_note}
                  style={{ marginTop: 4, fontSize: 11 }} />
              )}
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small"
            title={<Space><CheckCircleOutlined /><Text strong>Readiness Score</Text></Space>}
            style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <Progress type="dashboard" percent={readinessScore}
                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
            </div>
            <List size="small" split={false}>
              {[
                { label: 'Thông tin mặt bằng',          ok: !!journey?.area_m2 },
                { label: 'Cấu trúc chi phí (Buckets)',   ok: !!(estimate?.standardized_buckets?.length) },
                { label: 'Nhân công chi tiết',           ok: !!(estimate?.labor_breakdown?.labor_total) },
                { label: 'Hạng mục vật tư',              ok: !!(estimate?.direct_cost_groups?.length) },
              ].map(row => (
                <List.Item key={row.label}>
                  <Space>
                    <CheckCircleOutlined style={{ color: row.ok ? '#52c41a' : '#d9d9d9' }} />
                    <Text style={{ fontSize: 12 }}>{row.label}</Text>
                  </Space>
                </List.Item>
              ))}
            </List>
          </Card>
        </Col>
      </Row>

      {/* 5. Audit */}
      <Card size="small" title={<Space><AuditOutlined /><Text strong>Audit Trail</Text></Space>}>
        <Row gutter={16}>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Cập nhật lần cuối: {(estimate as any)?.updatedTime
                ? new Date((estimate as any).updatedTime).toLocaleString('vi-VN')
                : 'N/A'}
            </Text>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Bởi: {(estimate as any)?.updatedBy || 'System'}
            </Text>
          </Col>
        </Row>
      </Card>

    </div>
  );
};

export default Step04SolutionOrchestration;
