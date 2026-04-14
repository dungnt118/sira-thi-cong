/**
 * Step04SolutionOrchestration
 *
 * Internal estimate (JourneyEstimate) for a journey:
 *   0. Estimation Config - pricing_policy_id + total_estimate_cost (edit-mode header)
 *   1. 9 standardized cost buckets  (summary)
 *   2. Labor breakdown               (Nhân công chi tiết)
 *   3. Direct-cost groups            (Vật tư & hạng mục trực tiếp)
 *
 * Auto-calc rules:
 *   - pricing_policy_id selected  -> compute total_estimate_cost automatically
 *   - total_estimate_cost provided -> use as contractValue override
 *   - neither                      -> auto-find policy (by serviceTypeId -> is_default)
 *
 * All IJourneyEstimate fields are saved on submit.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, Button, Card, Col, Collapse, Divider, Form, Grid, Input,
  InputNumber, List, Modal, Popconfirm, Progress, Row, Select,
  Space, Spin, Statistic, Steps, Table, Tabs, Tag, Tooltip, Typography,
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
import { computeJourneyEstimateSolution } from './step04AutoSolution';
import { estimatePricingPolicyService } from '../../../services/core-contracts/services/estimatePricingPolicy.service';
import { estimateTemplateService } from '../../../services/core-contracts/services/estimateTemplate.service';
import { materialService } from '../../../services/core-contracts/services/material.service';
import { laborPriceConfigService } from '../../../services/core-contracts/services/laborPriceConfig.service';
import type {
  IDirectCostGroupsItem,
  IJourneyEstimate,
  IJourneyRoleSnapshotItem,
  ILaborBreakdownItem,
  IRoleCostAllocationsItem,
  IStandardizedBucketsItem,
} from '../../../services/core-contracts/types/journeyEstimate.types';
import type { StandardizedBucketsBucketCodeEnum } from '../../../services/core-contracts/types/journeyEstimate.types';
import type {
  IEstimatePricingPolicy,
  IAllocationPolicyItem,
  ITemplateRulesItem,
} from '../../../services/core-contracts/types/estimatePricingPolicy.types';
import type { IEstimateTemplate, IEstimateTemplateComponentsItem } from '../../../services/core-contracts/types/estimateTemplate.types';
import type { IMaterial } from '../../../services/core-contracts/types/material.types';
import type { ILaborPriceConfig } from '../../../services/core-contracts/types/laborPriceConfig.types';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';

const { Text, Title } = Typography;
const { Panel } = Collapse;

// Helpers

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

const ROLE_LABELS: Record<string, string> = {
  outsource: "Outsource",
  technical: "Kỹ thuật",
  supervisor: "Giám sát",
  sale: "Kinh doanh",
  pm: "PM",
  owner_admin: "Chủ sở hữu / Admin",
  internal_support: "Hỗ trợ nội bộ",
};

const ROLE_CALC_MODE_LABELS: Record<string, string> = {
  salary_allocation: "Phân bổ lương",
  commission_pct: "Hoa hồng %",
  daily_rate: "Đơn giá ngày công",
  fixed_amount: "Khoản cố định",
  manual: "Thủ công",
};

const COMPONENT_TYPE_LABELS: Record<string, string> = {
  material: "Vật tư",
  labor: "Nhân công",
  other: "Khác",
};

const COMPONENT_SOURCE_LABELS: Record<string, string> = {
  material_master: "Danh mục vật tư",
  labor_price_config: "Bảng giá nhân công",
  manual: "Thủ công",
  policy: "Policy",
  survey: "Khảo sát",
};

const COMPONENT_CALC_MODE_LABELS: Record<string, string> = {
  manual: "Nhập tay",
  package_m2: "Theo m²",
  daily_worker: "Theo ngày công",
  formula: "Theo công thức",
};

const toDisplayUsers = (value: unknown): string[] => {
  if (!value) return [];

  const pick = (item: unknown): string | null => {
    if (item == null || item === "") return null;
    if (typeof item === "string" || typeof item === "number") {
      const s = String(item).trim();
      return s || null;
    }
    if (typeof item === "object") {
      const obj = item as Record<string, unknown>;
      const candidates = [
        obj.fullName,
        obj.displayName,
        obj.name,
        obj.title,
        obj.username,
        obj.userName,
        obj.code,
        obj._id,
        obj.id,
      ];
      for (const candidate of candidates) {
        if (candidate == null || candidate === "") continue;
        const s = String(candidate).trim();
        if (s) return s;
      }
    }
    return null;
  };

  if (Array.isArray(value)) {
    return value.map(pick).filter((item): item is string => Boolean(item));
  }

  const single = pick(value);
  return single ? [single] : [];
};

const getSnapshotUsersByRole = (
  roleCode?: IRoleCostAllocationsItem["role_code"],
  snapshot?: IJourneyRoleSnapshotItem | null,
): string[] => {
  if (!snapshot || !roleCode) return [];
  switch (roleCode) {
    case "pm":
      return toDisplayUsers(snapshot.pm_user);
    case "sale":
      return toDisplayUsers(snapshot.sale_users);
    case "supervisor":
      return toDisplayUsers(snapshot.supervisor_users);
    case "technical":
      return toDisplayUsers(snapshot.technical_users);
    case "owner_admin":
    case "internal_support":
      return toDisplayUsers(snapshot.owner_user);
    default:
      return [];
  }
};

const getAllocationUsers = (
  allocation: IRoleCostAllocationsItem,
  snapshot?: IJourneyRoleSnapshotItem | null,
): string[] => {
  const explicitUsers = toDisplayUsers(allocation.usernames);
  if (explicitUsers.length) return explicitUsers;
  return getSnapshotUsersByRole(allocation.role_code, snapshot);
};

const renderUserTags = (users: string[]) => {
  if (!users.length) return <Text type="secondary">Chưa gán</Text>;
  return (
    <Space size={[4, 4]} wrap>
      {users.map((user) => (
        <Tag key={user}>{user}</Tag>
      ))}
    </Space>
  );
};

const LaborAllocationTable: React.FC<{
  allocations?: IRoleCostAllocationsItem[] | null;
  roleSnapshot?: IJourneyRoleSnapshotItem | null;
  infoMessage?: string;
}> = ({ allocations, roleSnapshot, infoMessage }) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const rows = allocations ?? [];

  if (!rows.length) {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        {infoMessage ? <Alert type="info" showIcon message={infoMessage} /> : null}
        <Alert type="info" showIcon message="Chưa có phân bổ nhân sự chi tiết. Hãy chạy Tự động tính để tạo snapshot phân bổ mới." />
      </Space>
    );
  }

  if (isMobile) {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        {infoMessage ? <Alert type="info" showIcon message={infoMessage} /> : null}
        {rows.map((row, idx) => {
          const users = getAllocationUsers(row, roleSnapshot);
          return (
            <div key={idx} style={{ padding: '10px 12px', border: '1px solid #f0f0f0', borderRadius: 6, background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <Space direction="vertical" size={0}>
                  <Text strong>{ROLE_LABELS[row.role_code ?? ''] ?? row.role_code ?? '—'}</Text>
                  {row.bucket_code ? <Text type="secondary" style={{ fontSize: 11 }}>{row.bucket_code}</Text> : null}
                </Space>
                <Text strong style={{ color: '#1890ff', fontSize: 14 }}>{fmt(row.amount ?? 0)}</Text>
              </div>
              <div style={{ marginBottom: 6 }}>{renderUserTags(users)}</div>
              <Space size={6} wrap>
                {row.calc_mode && <Tag color="blue" style={{ fontSize: 11 }}>{ROLE_CALC_MODE_LABELS[row.calc_mode] ?? row.calc_mode}</Tag>}
                {row.work_days != null && <Text type="secondary" style={{ fontSize: 11 }}>{row.work_days} ngày</Text>}
                {row.headcount != null && <Text type="secondary" style={{ fontSize: 11 }}>HC: {row.headcount}</Text>}
                {row.unit_rate != null && row.unit_rate > 0 && <Text type="secondary" style={{ fontSize: 11 }}>Đơn giá: {fmt(row.unit_rate)}</Text>}
                {row.allocation_pct != null && <Text type="secondary" style={{ fontSize: 11 }}>Tỷ lệ: {row.allocation_pct}%</Text>}
              </Space>
            </div>
          );
        })}
      </Space>
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={10}>
      {infoMessage ? <Alert type="info" showIcon message={infoMessage} /> : null}
      <Table
        dataSource={rows}
        rowKey={(_, idx) => String(idx)}
        size="small"
        bordered
        pagination={false}
        scroll={{ x: 980 }}
        columns={[
          {
            title: "Vai trò",
            dataIndex: "role_code",
            width: 150,
            render: (value: string, row: IRoleCostAllocationsItem) => (
              <Space direction="vertical" size={0}>
                <Text strong>{ROLE_LABELS[value] ?? value ?? "Khác"}</Text>
                {row.bucket_code ? <Text type="secondary" style={{ fontSize: 11 }}>{row.bucket_code}</Text> : null}
              </Space>
            ),
          },
          {
            title: "Nhân sự được gán",
            render: (_: unknown, row: IRoleCostAllocationsItem) => renderUserTags(getAllocationUsers(row, roleSnapshot)),
          },
          {
            title: "Headcount",
            width: 90,
            align: "right" as const,
            render: (_: unknown, row: IRoleCostAllocationsItem) => {
              const users = getAllocationUsers(row, roleSnapshot);
              return row.headcount ?? users.length ?? 0;
            },
          },
          {
            title: "Work days",
            dataIndex: "work_days",
            width: 100,
            align: "right" as const,
            render: (value: number) => value ?? "—",
          },
          {
            title: "Calc mode",
            dataIndex: "calc_mode",
            width: 130,
            render: (value: string) => value ? <Tag color="blue">{ROLE_CALC_MODE_LABELS[value] ?? value}</Tag> : "—",
          },
          {
            title: "Đơn giá / % phân bổ",
            width: 160,
            render: (_: unknown, row: IRoleCostAllocationsItem) => {
              if (row.unit_rate != null && row.unit_rate > 0) return <Text>{fmt(row.unit_rate)}</Text>;
              if (row.allocation_pct != null) return <Text>{row.allocation_pct}%</Text>;
              return <Text type="secondary">—</Text>;
            },
          },
          {
            title: "Số tiền",
            dataIndex: "amount",
            width: 140,
            align: "right" as const,
            render: (value: number) => <Text strong>{fmt(value ?? 0)}</Text>,
          },
          {
            title: "Formula / ghi chú",
            render: (_: unknown, row: IRoleCostAllocationsItem) => (
              <Space direction="vertical" size={0}>
                <Text style={{ fontSize: 12 }}>{row.formula_snapshot || "—"}</Text>
                {row.note ? <Text type="secondary" style={{ fontSize: 11 }}>{row.note}</Text> : null}
              </Space>
            ),
          },
        ]}
      />
    </Space>
  );
};

// Direct-cost components

const getComponentDisplayName = (component: NonNullable<IDirectCostGroupsItem["components"]>[number]) => {
  const materialLabel = (component.idx_material_id as any)?.title;
  const laborLabel = (component.idx_labor_price_config_id as any)?.title;
  return component.item_name || materialLabel || laborLabel || component.item_code || "—";
};

const DirectCostComponentsTable: React.FC<{
  group: IDirectCostGroupsItem;
  onQuickSetup?: () => void;
  resolveMsg?: (text: string | null | undefined) => string;
}> = ({ group, onQuickSetup, resolveMsg = (t) => t ?? '' }) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const components = group.components ?? [];
  const isFallback = !!(group.cost_basis_note?.toLowerCase().includes('fallback'));

  const fallbackAlert = group.cost_basis_note ? (
    <Alert
      type="warning"
      showIcon
      message={
        <Space style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Text style={{ fontSize: 12, flex: 1 }}>{resolveMsg(group.cost_basis_note)}</Text>
          {isFallback && onQuickSetup && (
            <Button
              size="small"
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={onQuickSetup}
              style={{ flexShrink: 0 }}
            >
              Quick Setup Template
            </Button>
          )}
        </Space>
      }
    />
  ) : null;

  if (!components.length) {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        {fallbackAlert}
        <Text type="secondary">Chưa có dòng chi tiết cấu phần. Hãy chạy tự động tính để lấy vật tư và nhân công chi tiết.</Text>
      </Space>
    );
  }

  if (isMobile) {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size={6}>
        {fallbackAlert}
        {components.map((comp, idx) => (
          <div key={idx} style={{ padding: '10px 12px', border: '1px solid #f0f0f0', borderRadius: 6, background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <Space size={4} style={{ flex: 1, flexWrap: 'wrap' }}>
                <Tag style={{ margin: 0 }}>{COMPONENT_TYPE_LABELS[comp.type ?? ''] ?? comp.type ?? '—'}</Tag>
                <Text strong style={{ fontSize: 13 }}>{getComponentDisplayName(comp)}</Text>
              </Space>
              <Text strong style={{ color: '#1890ff', fontSize: 14, marginLeft: 8, flexShrink: 0 }}>{fmt(comp.line_total ?? 0)}</Text>
            </div>
            <Space size={[6, 4]} wrap>
              <Text type="secondary" style={{ fontSize: 11 }}>
                SL: {comp.expanded_quantity ?? comp.quantity ?? '—'} {comp.unit}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>×</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>Đơn giá: {fmt(comp.unit_price ?? 0)}</Text>
              {comp.source_ref_label && (
                <Text type="secondary" style={{ fontSize: 11 }}>Nguồn: {comp.source_ref_label}</Text>
              )}
              {comp.waste_pct != null && (
                <Text type="secondary" style={{ fontSize: 11 }}>Hao hụt: {comp.waste_pct}%</Text>
              )}
            </Space>
            {(comp.cost_note || comp.note) && (
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>{comp.cost_note || comp.note}</Text>
              </div>
            )}
          </div>
        ))}
      </Space>
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={8}>
      {fallbackAlert}
      <Table
        dataSource={components}
        rowKey={(_, idx) => String(idx)}
        size="small"
        bordered
        pagination={false}
        scroll={{ x: 1180 }}
        columns={[
          {
            title: "Loại",
            dataIndex: "type",
            width: 90,
            render: (value: string) => <Tag>{COMPONENT_TYPE_LABELS[value] ?? value ?? "Khác"}</Tag>,
          },
          {
            title: "Tên vật tư / nhân công",
            render: (_: unknown, row: NonNullable<IDirectCostGroupsItem["components"]>[number]) => (
              <Space direction="vertical" size={0}>
                <Text strong>{getComponentDisplayName(row)}</Text>
                {row.item_spec ? <Text type="secondary" style={{ fontSize: 11 }}>{row.item_spec}</Text> : null}
              </Space>
            ),
          },
          {
            title: "Nguồn",
            width: 150,
            render: (_: unknown, row: NonNullable<IDirectCostGroupsItem["components"]>[number]) => (
              <Space direction="vertical" size={0}>
                <Text>{row.source_ref_label || COMPONENT_SOURCE_LABELS[row.source_type ?? ""] || "—"}</Text>
                {row.brand_name ? <Text type="secondary" style={{ fontSize: 11 }}>{row.brand_name}</Text> : null}
              </Space>
            ),
          },
          {
            title: "Cơ sở số lượng",
            width: 160,
            render: (_: unknown, row: NonNullable<IDirectCostGroupsItem["components"]>[number]) => (
              <Space direction="vertical" size={0}>
                <Text>{COMPONENT_CALC_MODE_LABELS[row.calc_mode ?? ""] || row.calc_mode || "—"}</Text>
                {row.quantity_per_unit != null ? (
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {row.quantity_per_unit}/{row.unit || "đv"}
                  </Text>
                ) : null}
              </Space>
            ),
          },
          {
            title: "Số lượng",
            width: 110,
            align: "right" as const,
            render: (_: unknown, row: NonNullable<IDirectCostGroupsItem["components"]>[number]) => row.expanded_quantity ?? row.quantity ?? "—",
          },
          {
            title: "Đơn vị",
            dataIndex: "unit",
            width: 80,
            render: (value: string) => value || "—",
          },
          {
            title: "Đơn giá",
            dataIndex: "unit_price",
            width: 130,
            align: "right" as const,
            render: (value: number) => fmt(value ?? 0),
          },
          {
            title: "Thành tiền",
            dataIndex: "line_total",
            width: 140,
            align: "right" as const,
            render: (value: number) => <Text strong>{fmt(value ?? 0)}</Text>,
          },
          {
            title: "Formula",
            width: 190,
            render: (_: unknown, row: NonNullable<IDirectCostGroupsItem["components"]>[number]) => (
              <Text style={{ fontSize: 12 }}>{row.formula_snapshot || row.formula_code || "—"}</Text>
            ),
          },
          {
            title: "Ghi chú",
            width: 180,
            render: (_: unknown, row: NonNullable<IDirectCostGroupsItem["components"]>[number]) => (
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>{row.cost_note || row.note || "—"}</Text>
                {row.waste_pct != null ? (
                  <Text type="secondary" style={{ fontSize: 11 }}>Hao hụt: {row.waste_pct}%</Text>
                ) : null}
              </Space>
            ),
          },
        ]}
      />
    </Space>
  );
};

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
 * Step 1 — MATERIALS (01): base_rate_m2 � area_m2 � complexity  [FIXED, independent of total]
 * Step 2 — LABOR (02): salary from execution_days + commissions % of materials  [FIXED, independent of total]
 * Step 3 — ALLOCATIONS (03-08): each % of their calc_base (direct_cost / labor / material / contract_value)
 *   ⬢ For contract_value-based: solve algebraically to avoid circular dependency
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

  // —�—� Complexity multiplier (scale applies only at very_difficult) —�—�—�—�—�—�—�—�—�—�—�
  const complexityFactor     = qsr?.complexity_factor ?? 1;
  const scaleFactor          = qsr?.scale_factor ?? 1;
  const complexityMultiplier =
    complexity_level === 'very_difficult' ? complexityFactor * scaleFactor
    : complexity_level === 'difficult'    ? complexityFactor
    : 1;

  // —�—� Step 1: MATERIALS — independent of total —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�
  // base_quote_rate_m2 represents the direct material cost rate per m²
  const baseRate         = qsr?.base_quote_rate_m2 ?? 0;
  const materialsAmount  = Math.round(baseRate * area_m2 * complexityMultiplier);

  // —�—� Step 2: LABOR — independent of total —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�
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
    note: `Lương ${execution_days} ngày: ${internalSalary.toLocaleString('vi-VN')}đ | KT ${lp?.technical_commission_pct ?? 0}%: ${techComm.toLocaleString('vi-VN')}đ | GS ${lp?.supervisor_commission_pct ?? 0}%: ${supComm.toLocaleString('vi-VN')}đ`,
  };

  // —�—� Step 3a: ALLOCATIONS with known bases (not contract_value) —�—�—�—�—�—�—�—�—�—�—�—�
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

  // —�—� Step 4: Solve for RECOMMENDED QUOTE —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�
  // Sum of pct for contract_value-based allocations
  const cvAllocPct = (policy.allocation_policy ?? [])
    .filter(ap => ap.calc_base === 'contract_value' || (!ap.calc_base && ap.bucket_code))
    .reduce((s, ap) => s + (ap.default_rate_pct ?? 0) / 100, 0);

  const targetProfitPct     = (policy.profit_policy?.target_profit_pct_min ?? 15) / 100;
  const denominator         = 1 - cvAllocPct - targetProfitPct;
  // T � denominator = directCost + fixedAllocSum �  T = (directCost + fixedAllocSum) / denominator
  const recommendedQuote    = denominator > 0.01
    ? Math.round((directCost + fixedAllocSum) / denominator)
    : Math.round(directCost * 1.35); // safety fallback: 35% markup

  // —�—� Step 3b: ALLOCATIONS with contract_value base —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�
  // Use recommendedQuote as proxy for contract_value (best estimate before total is decided)
  const quoteForAlloc = (targetTotal && targetTotal > 0) ? targetTotal : recommendedQuote;

  (policy.allocation_policy ?? []).forEach((ap: IAllocationPolicyItem) => {
    if (!ap.bucket_code) return;
    if (ap.calc_base === 'contract_value' || (!ap.calc_base && ap.bucket_code)) {
      const pct = (ap.default_rate_pct ?? 0) / 100;
      alloc[ap.bucket_code] = {
        amount: Math.round(quoteForAlloc * pct),
        note:   ap.note ? ap.note : `${ap.default_rate_pct}% × tổng hợp hợp đồng`,
        pct,
      };
    }
  });

  const totalAllocSum = Object.values(alloc).reduce((s, v) => s + v.amount, 0);

  // —�—� Step 5: CONTRACT VALUE —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�
  const contractValue   = (targetTotal && targetTotal > 0) ? targetTotal : recommendedQuote;
  const totalInternalCost = materialsAmount + laborTotal + totalAllocSum;

  // —�—� Step 6: PROFIT — always RESIDUAL —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�
  const profitAmount    = Math.max(0, contractValue - totalInternalCost);
  const actualProfitPct = contractValue > 0
    ? Math.round((profitAmount / contractValue) * 1000) / 10
    : 0;

  // —�—� Step 7: BUILD BUCKETS with formula notes —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�
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
      note   = `${fmt(contractValue)} - chi phí ${fmt(totalInternalCost)} = ${fmt(profitAmount)} (${actualProfitPct}%)`;
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

  // —�—� Step 8: AUTO-GENERATE direct_cost_groups —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�
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

  // —�—� Derivation record —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�
  const quoteDerivation: IJourneyEstimate['quote_derivation'] = {
    recommended_quote_value_initial: recommendedQuote,
    final_quote_floor:               qsr?.min_quote_floor ?? 0,
    base_quote_rate_m2:              baseRate,
    duration_factor:                 1,
    scale_factor:                    scaleFactor,
    complexity_factor:               complexityMultiplier,
    pricing_mode:                    targetTotal ? 'target_quote_check' : 'profit_target_optimize',
    note:                            targetTotal
      ? `Tổng kỳ vọng: ${fmt(targetTotal)} | Policy đề xuất: ${fmt(recommendedQuote)} | LN thực: ${actualProfitPct}%`
      : `Policy: ${policy.name ?? policy.code} | Đề xuất tối thiểu đạt LN ${(targetProfitPct * 100).toFixed(0)}%`,
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

// —�—�—� Sub-components —�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�—�

const BucketsViewGrid: React.FC<{ buckets: IStandardizedBucketsItem[] }> = ({ buckets }) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const get = (code: string) => buckets.find(b => b.bucket_code === code);

  if (isMobile) {
    const total = buckets.reduce((s, b) => s + (b.amount || 0), 0);
    return (
      <Space direction="vertical" style={{ width: '100%' }} size={4}>
        {BUCKET_CONFIGS.map(cfg => {
          const bucket = get(cfg.code);
          const amount = bucket?.amount ?? 0;
          return (
            <div key={cfg.code} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: 6, background: '#fafafa',
              borderLeft: `3px solid ${cfg.color}`,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0, display: 'inline-block' }} />
              <Text style={{ flex: 1, fontSize: 13 }}>{cfg.label}</Text>
              {bucket?.rate_pct ? <Tag style={{ fontSize: 10, margin: 0 }}>{bucket.rate_pct}%</Tag> : null}
              <Text strong style={{ color: cfg.code === '09_profit' ? '#fa541c' : undefined, fontSize: 13, minWidth: 100, textAlign: 'right' }}>
                {fmt(amount)}
              </Text>
            </div>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#f0f5ff', borderRadius: 6, marginTop: 4 }}>
          <Text strong>Tổng cộng</Text>
          <Text strong style={{ color: '#cf1322' }}>{fmt(total)}</Text>
        </div>
      </Space>
    );
  }

  return (
    <Row gutter={[12, 12]}>
      {BUCKET_CONFIGS.map(cfg => {
        const bucket = get(cfg.code);
        const amount = bucket?.amount ?? 0;
        const note   = bucket?.note ?? cfg.note ?? '';
        return (
          <Col xs={24} sm={12} lg={8} key={cfg.code}>
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

const LaborView: React.FC<{
  lb: ILaborBreakdownItem;
  allocations?: IRoleCostAllocationsItem[] | null;
  roleSnapshot?: IJourneyRoleSnapshotItem | null;
}> = ({ lb, allocations, roleSnapshot }) => {
  return (
    <Space direction='vertical' size={12} style={{ width: '100%' }}>
      <Row gutter={[16, 8]}>
        {[
          { label: 'Nhân công outsource', value: lb.outsource_labor },
          { label: 'Lương nội bộ (cố định)', value: lb.internal_fixed_salary },
          { label: 'Hoa hồng Kỹ thuật', value: lb.technical_commission },
          { label: 'Hoa hồng Giám sát', value: lb.supervisor_commission },
        ].map(row => (
          <Col xs={24} sm={12} key={row.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
              <Text type='secondary' style={{ fontSize: 13 }}>{row.label}</Text>
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
        {lb.note && <Col span={24}><Text type='secondary' style={{ fontSize: 12 }}>Ghi chú: {lb.note}</Text></Col>}
      </Row>
      <Card size='small' type='inner' title={<Space><TeamOutlined /><Text strong>Bảng phân bổ nhân công theo vai trò</Text></Space>}>
        <LaborAllocationTable allocations={allocations} roleSnapshot={roleSnapshot} />
      </Card>
    </Space>
  );
};

const LaborEdit: React.FC<{
  lb: ILaborBreakdownItem;
  onChange: (lb: ILaborBreakdownItem) => void;
  allocations?: IRoleCostAllocationsItem[] | null;
  roleSnapshot?: IJourneyRoleSnapshotItem | null;
}> = ({ lb, onChange, allocations, roleSnapshot }) => {
  const set = (field: keyof ILaborBreakdownItem, val: number | string | null) => {
    const next = { ...lb, [field]: val ?? 0 };
    onChange(recomputeLabor(next));
  };
  const rows: { label: string; field: keyof ILaborBreakdownItem }[] = [
    { label: 'Nhân công outsource', field: 'outsource_labor' },
    { label: 'Lương nội bộ (cố định)', field: 'internal_fixed_salary' },
    { label: 'Hoa hồng Kỹ thuật', field: 'technical_commission' },
    { label: 'Hoa hồng Giám sát', field: 'supervisor_commission' },
  ];
  return (
    <Space direction='vertical' size={12} style={{ width: '100%' }}>
      <div>
        <Row gutter={[16, 0]}>
          {rows.map(r => (
            <Col span={12} key={r.field}>
              <Form.Item label={r.label} style={{ marginBottom: 12 }}>
                <InputNumber
                  value={lb[r.field] as number}
                  min={0} style={{ width: '100%' }} size='small'
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
        <Form.Item label='Ghi chú' style={{ marginBottom: 0 }}>
          <Input value={lb.note} size='small' onChange={e => onChange({ ...lb, note: e.target.value })} />
        </Form.Item>
      </div>
      <Card size='small' type='inner' title={<Space><TeamOutlined /><Text strong>Bảng phân bổ nhân công theo vai trò</Text></Space>}>
        <LaborAllocationTable
          allocations={allocations}
          roleSnapshot={roleSnapshot}
          infoMessage='Bảng dưới đây phản ánh snapshot sinh từ lần tự động tính gần nhất. Nếu bạn chỉnh tay chi phí nhân công tổng hợp ở trên, hãy chạy lại Tự động tính để đồng bộ phân bổ chi tiết.'
        />
      </Card>
    </Space>
  );
};

const DirectCostView: React.FC<{
  groups: IDirectCostGroupsItem[];
  onQuickSetup?: () => void;
  resolveMsg?: (text: string | null | undefined) => string;
}> = ({ groups, onQuickSetup, resolveMsg }) => {
  if (!groups.length) return <Text type='secondary'>Chưa có hạng mục vật tư nào.</Text>;
  return (
    <Collapse size='small' ghost>
      {groups.map((g, i) => (
        <Panel
          key={i}
          header={
            <Space>
              <Text strong>{g.name || `Hạng mục ${i + 1}`}</Text>
              <Text type='secondary' style={{ fontSize: 12 }}>×{g.quantity ?? 1} {g.unit}</Text>
              <Tag color='blue'>{fmt(g.subtotal ?? 0)}</Tag>
            </Space>
          }
        >
          <Row gutter={[12, 4]} style={{ marginBottom: 8 }}>
            {[
              { label: 'Vật tư', value: g.material_amount },
              { label: 'Nhân công', value: g.labor_amount },
              { label: 'Chi phí khác', value: g.other_amount },
            ].map(row => (
              <Col xs={24} sm={8} key={row.label}>
                <div style={{ textAlign: 'center', background: '#fafafa', borderRadius: 6, padding: '6px 8px' }}>
                  <div style={{ fontSize: 11, color: '#888' }}>{row.label}</div>
                  <div style={{ fontWeight: 600 }}>{fmt(row.value ?? 0)}</div>
                </div>
              </Col>
            ))}
          </Row>
          <DirectCostComponentsTable group={g} onQuickSetup={onQuickSetup} resolveMsg={resolveMsg} />
          {g.note && <div style={{ marginTop: 6 }}><Text type='secondary' style={{ fontSize: 12 }}>Ghi chú hạng mục: {g.note}</Text></div>}
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
  const addGroup = () => onChange([...groups, newGroup()]);
  const removeGroup = (idx: number) => onChange(groups.filter((_, i) => i !== idx));

  return (
    <div>
      {groups.map((g, i) => (
        <Card
          key={i}
          size='small'
          style={{ marginBottom: 10, border: '1px solid #e8e8e8' }}
          title={
            <Space>
              <Text strong style={{ fontSize: 13 }}>{g.name || `Hạng mục ${i + 1}`}</Text>
              <Tag color='blue'>{fmt(g.subtotal ?? 0)}</Tag>
            </Space>
          }
          extra={
            <Popconfirm title='Xóa hạng mục này?' onConfirm={() => removeGroup(i)} okText='Xóa' cancelText='Hủy'>
              <Button type='text' danger icon={<DeleteOutlined />} size='small' />
            </Popconfirm>
          }
        >
          <Row gutter={[12, 0]}>
            <Col span={10}>
              <Form.Item label='Tên hạng mục' style={{ marginBottom: 8 }}>
                <Input value={g.name} size='small' onChange={e => setGroup(i, { name: e.target.value })} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label='Số lượng' style={{ marginBottom: 8 }}>
                <InputNumber value={g.quantity} min={0} size='small' style={{ width: '100%' }} onChange={v => setGroup(i, { quantity: v ?? 0 })} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label='Đơn vị' style={{ marginBottom: 8 }}>
                <Input value={g.unit} size='small' onChange={e => setGroup(i, { unit: e.target.value })} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='Chi phí Vật tư' style={{ marginBottom: 8 }}>
                <InputNumber value={g.material_amount} min={0} size='small' style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => Number(v?.replace(/,/g, '') || 0)} onChange={v => setGroup(i, { material_amount: v ?? 0 })} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='Chi phí Nhân công' style={{ marginBottom: 8 }}>
                <InputNumber value={g.labor_amount} min={0} size='small' style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => Number(v?.replace(/,/g, '') || 0)} onChange={v => setGroup(i, { labor_amount: v ?? 0 })} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='Chi phí khác' style={{ marginBottom: 8 }}>
                <InputNumber value={g.other_amount} min={0} size='small' style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => Number(v?.replace(/,/g, '') || 0)} onChange={v => setGroup(i, { other_amount: v ?? 0 })} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Ghi chú' style={{ marginBottom: 0 }}>
                <Input value={g.note} size='small' onChange={e => setGroup(i, { note: e.target.value })} />
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: '12px 0' }} />
          <Space direction='vertical' size={8} style={{ width: '100%' }}>
            <Text strong>Bảng vật tư / nhân công chi tiết</Text>
            <DirectCostComponentsTable group={g} />
          </Space>
        </Card>
      ))}
      <Button type='dashed' block icon={<PlusOutlined />} onClick={addGroup}>
        Thêm hạng mục
      </Button>
    </div>
  );
};

// ─── QuickSetupTemplateModal ──────────────────────────────────────────────────
// Opens when a fallback is detected. Guides the user to create an EstimateTemplate
// and link it to the active pricing policy so future estimates use a real template.

type DirectCostComponent = NonNullable<IDirectCostGroupsItem['components']>[number];

interface QuickSetupProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  serviceTypeId?: string;
  serviceTypeName?: string;
  scaleType?: string;
  policyId?: string;
  policyName?: string;
  seedComponents?: DirectCostComponent[];
}

const SCALE_LABELS: Record<string, string> = {
  small: 'Nhỏ (small)',
  medium: 'Vừa (medium)',
  large: 'Lớn (large)',
  custom: 'Tùy chỉnh (custom)',
};

const QuickSetupTemplateModal: React.FC<QuickSetupProps> = ({
  open, onClose, onSuccess,
  serviceTypeId, serviceTypeName, scaleType, policyId, policyName, seedComponents,
}) => {
  const [step, setStep] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [form] = Form.useForm();
  const [components, setComponents] = React.useState<IEstimateTemplateComponentsItem[]>([]);

  React.useEffect(() => {
    if (!open) return;
    setStep(0);
    const seed: IEstimateTemplateComponentsItem[] = (seedComponents ?? [])
      .filter(c => (c as any).source_type !== 'policy' || (c as any).unit_price)
      .map(c => ({
        type: c.type as any,
        name: c.item_name || 'Hạng mục vật tư',
        unit: c.unit || 'm²',
        calc_mode: c.calc_mode as any,
        quantity_per_unit: c.quantity_per_unit ?? 1,
        unit_price: c.unit_price ?? 0,
      }));
    setComponents(seed.length ? seed : [{
      type: 'material' as any,
      name: 'Vật tư chính',
      unit: 'm²',
      calc_mode: 'package_m2' as any,
      quantity_per_unit: 1,
      unit_price: 0,
    }]);
    form.setFieldsValue({
      name: `Template ${SCALE_LABELS[scaleType ?? ''] ?? scaleType ?? ''} - ${serviceTypeName ?? serviceTypeId ?? ''}`,
      unit: 'm²',
      selection_mode: 'required',
      priority: 1,
    });
  }, [open]);

  const setComp = (idx: number, patch: Partial<IEstimateTemplateComponentsItem>) =>
    setComponents(prev => prev.map((c, i) => i === idx ? { ...c, ...patch } : c));

  const addComp = () => setComponents(prev => [...prev, {
    type: 'material' as any, name: '', unit: 'm²',
    calc_mode: 'package_m2' as any, quantity_per_unit: 1, unit_price: 0,
  }]);

  const removeComp = (idx: number) => setComponents(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    try {
      await form.validateFields();
    } catch { return; }

    const values = form.getFieldsValue();
    setSaving(true);
    try {
      // 1. Create the EstimateTemplate
      const template = await estimateTemplateService.createEstimateTemplate({
        name: values.name,
        code: values.code || undefined,
        service_type_id: serviceTypeId,
        scale_type: scaleType as any,
        unit: values.unit || 'm²',
        components,
      });

      // 2. Patch policy.template_rules to include the new template
      if (policyId && template._id) {
        const policy = await estimatePricingPolicyService.findContent(policyId);
        const existing: ITemplateRulesItem[] = policy?.template_rules ?? [];
        const newRule: ITemplateRulesItem = {
          template_id: template._id,
          selection_mode: values.selection_mode ?? 'required',
          priority: values.priority ?? 1,
          min_area_m2: values.min_area_m2 || undefined,
          max_area_m2: values.max_area_m2 || undefined,
          note: values.rule_note || undefined,
        };
        await estimatePricingPolicyService.updateEstimatePricingPolicy(policyId, {
          template_rules: [...existing, newRule],
        });
      }

      antMessage.success('Đã tạo template và liên kết với policy thành công! Hãy chạy lại Tự động tính để áp dụng.');
      onSuccess();
      onClose();
    } catch (err) {
      antMessage.error('Lỗi: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setSaving(false);
    }
  };

  const stepItems = [
    { title: 'Thông tin Template' },
    { title: 'Cấu phần chi phí' },
    { title: 'Liên kết Policy' },
  ];

  const canNext = step < stepItems.length - 1;
  const canBack = step > 0;

  const footer = (
    <Space>
      <Button onClick={onClose}>Đóng</Button>
      {canBack && <Button onClick={() => setStep(s => s - 1)}>Quay lại</Button>}
      {canNext && (
        <Button type="primary" onClick={async () => {
          if (step === 0) {
            try { await form.validateFields(['name', 'unit']); } catch { return; }
          }
          setStep(s => s + 1);
        }}>
          Tiếp theo
        </Button>
      )}
      {!canNext && (
        <Button type="primary" loading={saving} onClick={handleSave} icon={<SaveOutlined />}>
          Tạo Template & Liên kết Policy
        </Button>
      )}
    </Space>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <Space>
          <ThunderboltOutlined style={{ color: '#fa8c16' }} />
          <span>Quick Setup — Tạo EstimateTemplate mới</span>
        </Space>
      }
      width={740}
      footer={footer}
      afterClose={() => { setStep(0); setSaving(false); }}
    >
      <Steps current={step} size="small" items={stepItems} style={{ marginBottom: 24 }} />

      {/* Step 0: Template Info */}
      {step === 0 && (
        <Form form={form} layout="vertical" size="small">
          <Alert
            type="info" showIcon style={{ marginBottom: 16 }}
            message={
              <span>
                Sẽ tạo template cho <Tag color="blue">{SCALE_LABELS[scaleType ?? ''] ?? scaleType}</Tag>
                của loại dịch vụ <Tag color="geekblue">{serviceTypeName ?? serviceTypeId}</Tag>
                {policyName && <>, liên kết vào policy <Tag color="purple">{policyName}</Tag></>}.
              </span>
            }
          />
          <Row gutter={[12, 0]}>
            <Col span={16}>
              <Form.Item name="name" label="Tên Template" rules={[{ required: true, message: 'Nhập tên template' }]}>
                <Input placeholder="VD: Template chống thấm sàn - quy mô nhỏ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="code" label="Mã (tùy chọn)">
                <Input placeholder="VD: TPL-CTS-SMALL" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'm²', label: 'm²' },
                  { value: 'm³', label: 'm³' },
                  { value: 'bộ', label: 'Bộ' },
                  { value: 'cái', label: 'Cái' },
                  { value: 'gói', label: 'Gói' },
                  { value: 'lần', label: 'Lần' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Quy mô">
                <Tag color="orange" style={{ lineHeight: '30px', padding: '0 10px' }}>
                  {SCALE_LABELS[scaleType ?? ''] ?? scaleType ?? '—'}
                </Tag>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Loại dịch vụ">
                <Tag color="geekblue" style={{ lineHeight: '30px', padding: '0 10px' }}>
                  {serviceTypeName ?? serviceTypeId ?? '—'}
                </Tag>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}

      {/* Step 1: Components */}
      {step === 1 && (
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Alert
            type="info" showIcon
            message="Mỗi dòng là một cấu phần chi phí trong template. Hệ thống sẽ nhân quantity_per_unit với diện tích thực tế khi tính toán."
          />
          {components.map((comp, idx) => (
            <Card
              key={idx} size="small"
              style={{ border: '1px solid #d9d9d9' }}
              extra={
                components.length > 1 && (
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => removeComp(idx)} />
                )
              }
              title={<Text strong style={{ fontSize: 12 }}>Cấu phần {idx + 1}</Text>}
            >
              <Row gutter={[8, 0]}>
                <Col span={5}>
                  <Form.Item label="Loại" style={{ marginBottom: 6 }}>
                    <Select size="small" value={comp.type}
                      onChange={v => setComp(idx, { type: v as any })}
                      options={[
                        { value: 'material', label: 'Vật tư' },
                        { value: 'labor', label: 'Nhân công' },
                        { value: 'other', label: 'Khác' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item label="Tên hạng mục" style={{ marginBottom: 6 }}>
                    <Input size="small" value={comp.name ?? ''} onChange={e => setComp(idx, { name: e.target.value })} placeholder="VD: Sơn chống thấm" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Đơn vị" style={{ marginBottom: 6 }}>
                    <Input size="small" value={comp.unit ?? ''} onChange={e => setComp(idx, { unit: e.target.value })} placeholder="m²" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Calc mode" style={{ marginBottom: 6 }}>
                    <Select size="small" value={comp.calc_mode}
                      onChange={v => setComp(idx, { calc_mode: v as any })}
                      options={[
                        { value: 'package_m2', label: 'Theo m²' },
                        { value: 'daily_worker', label: 'Ngày công' },
                        { value: 'manual', label: 'Thủ công' },
                        { value: 'formula', label: 'Formula' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Qty / đơn vị diện tích" style={{ marginBottom: 0 }}>
                    <InputNumber size="small" style={{ width: '100%' }} value={comp.quantity_per_unit ?? 1} min={0} step={0.01}
                      onChange={v => setComp(idx, { quantity_per_unit: v ?? 1 })} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Đơn giá (VND)" style={{ marginBottom: 0 }}>
                    <InputNumber size="small" style={{ width: '100%' }} value={comp.unit_price ?? 0} min={0}
                      formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={v => Number(v?.replace(/,/g, '') || 0)}
                      onChange={v => setComp(idx, { unit_price: v ?? 0 })} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Ghi chú" style={{ marginBottom: 0 }}>
                    <Input size="small" value={comp.note ?? ''} onChange={e => setComp(idx, { note: e.target.value })} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ))}
          <Button block icon={<PlusOutlined />} size="small" onClick={addComp} style={{ borderStyle: 'dashed' }}>
            Thêm cấu phần
          </Button>
        </Space>
      )}

      {/* Step 2: Template Rule linking */}
      {step === 2 && (
        <Form form={form} layout="vertical" size="small">
          <Alert
            type="warning" showIcon style={{ marginBottom: 16 }}
            message={
              policyId
                ? `Template mới sẽ được thêm vào template_rules của policy "${policyName ?? policyId}". Các dự toán tiếp theo sẽ dùng template này thay vì fallback.`
                : 'Không có policy để liên kết. Template vẫn sẽ được tạo nhưng cần liên kết thủ công sau.'
            }
          />
          <Row gutter={[12, 0]}>
            <Col span={12}>
              <Form.Item name="selection_mode" label="Selection mode" tooltip="required: bắt buộc dùng; optional: tùy chọn; conditional: theo điều kiện">
                <Select options={[
                  { value: 'required', label: 'Required — Bắt buộc' },
                  { value: 'optional', label: 'Optional — Tùy chọn' },
                  { value: 'conditional', label: 'Conditional — Theo điều kiện' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Ưu tiên (nhỏ hơn = cao hơn)" tooltip="Số nhỏ hơn được chọn trước khi có nhiều template rules">
                <InputNumber style={{ width: '100%' }} min={1} max={99} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="min_area_m2" label="Diện tích tối thiểu (m²) — tùy chọn">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="Để trống = không giới hạn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="max_area_m2" label="Diện tích tối đa (m²) — tùy chọn">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="Để trống = không giới hạn" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="rule_note" label="Ghi chú rule">
                <Input.TextArea rows={2} placeholder="VD: Áp dụng cho dự án chống thấm quy mô nhỏ dưới 50m²" />
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, padding: '10px 14px' }}>
            <Text strong style={{ fontSize: 12 }}>Tóm tắt sẽ tạo:</Text>
            <ul style={{ margin: '6px 0 0', paddingLeft: 16, fontSize: 12 }}>
              <li>Template: <strong>{form.getFieldValue('name')}</strong> ({SCALE_LABELS[scaleType ?? ''] ?? scaleType})</li>
              <li>{components.length} cấu phần chi phí</li>
              {policyId && <li>Liên kết vào policy: <strong>{policyName ?? policyId}</strong></li>}
            </ul>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export const Step04SolutionOrchestration: React.FC<{ journeyId: string }> = ({ journeyId }) => {
  const { journey, estimate, estimateHistory, loading, saveEstimate, refresh } = useJourneyEstimateFlow(journeyId);

  // Edit state
  const [isEditing,          setIsEditing]          = useState(false);
  const [editBuckets,        setEditBuckets]         = useState<IStandardizedBucketsItem[]>([]);
  const [editLabor,          setEditLabor]           = useState<ILaborBreakdownItem>(EMPTY_LABOR);
  const [editGroups,         setEditGroups]          = useState<IDirectCostGroupsItem[]>([]);

  // Estimation config
  const [editPolicyId,       setEditPolicyId]        = useState<string | null>(null);
  const [editTotalCost,      setEditTotalCost]        = useState<number | null>(null);

  // Computed metadata preserved for save
  const [savedQuoteDerivation,  setSavedQuoteDerivation]  = useState<IJourneyEstimate['quote_derivation'] | null>(null);
  const [savedValidationResult, setSavedValidationResult] = useState<IJourneyEstimate['validation_result'] | null>(null);
  const [savedJourneyInputSnapshot, setSavedJourneyInputSnapshot] = useState<IJourneyEstimate['journey_input_snapshot'] | null>(null);
  const [savedJourneyRoleSnapshot, setSavedJourneyRoleSnapshot] = useState<IJourneyEstimate['journey_role_snapshot'] | null>(null);
  const [savedRoleCostAllocations, setSavedRoleCostAllocations] = useState<IRoleCostAllocationsItem[] | null>(null);
  const [savedSolutionResolution, setSavedSolutionResolution] = useState<IJourneyEstimate['solution_resolution'] | null>(null);

  const [isAutoCalcing,      setIsAutoCalcing]        = useState(false);

  // Quick Setup modal state (triggered from fallback alert)
  const [quickSetupOpen,    setQuickSetupOpen]        = useState(false);
  const [autoCalcNote,       setAutoCalcNote]         = useState<string | null>(null);

  // Policy options for Select (edit mode)
  const [policyOptions,      setPolicyOptions]        = useState<{ label: string; value: string }[]>([]);
  const [policyOptLoading,   setPolicyOptLoading]     = useState(false);
  // Resolved policy name for view mode (avoids showing raw _id)
  const [resolvedPolicyName, setResolvedPolicyName]   = useState<string | null>(null);

  // Load all policy options when entering edit mode
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

  // Fetch policy name by ID for view mode (runs whenever estimate changes)
  useEffect(() => {
    const policyId = estimate?.pricing_policy_id;
    if (!policyId) { setResolvedPolicyName(null); return; }
    // Skip if already resolved for this ID
    if (resolvedPolicyName && policyOptions.some(o => o.value === policyId)) return;
    estimatePricingPolicyService.findContent(policyId)
      .then(p => setResolvedPolicyName(p?.name ?? p?.code ?? null))
      .catch(() => setResolvedPolicyName(null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimate?.pricing_policy_id]);

  const currentBuckets = isEditing ? editBuckets : (estimate?.standardized_buckets ?? []);
  const currentLabor = isEditing ? editLabor : estimate?.labor_breakdown;
  const currentGroups = isEditing ? editGroups : (estimate?.direct_cost_groups ?? []);
  const currentValidationResult = isEditing
    ? (savedValidationResult ?? estimate?.validation_result ?? null)
    : (estimate?.validation_result ?? null);
  const currentQuoteDerivation = isEditing
    ? (savedQuoteDerivation ?? estimate?.quote_derivation ?? null)
    : (estimate?.quote_derivation ?? null);
  const currentPolicyId = isEditing ? (editPolicyId ?? estimate?.pricing_policy_id ?? null) : (estimate?.pricing_policy_id ?? null);
  const currentPolicyLabel =
    policyOptions.find(option => option.value === currentPolicyId)?.label
    ?? (estimate as any)?.idx_pricing_policy_id?.title
    ?? resolvedPolicyName
    ?? null;  // intentionally NOT falling back to raw ID

  // Tên service type từ journey (được populate bởi backend khi load)
  const currentServiceTypeId =
    estimate?.journey_input_snapshot?.service_type_id ??
    journey?.serviceTypeId ?? null;
  const currentServiceTypeName =
    journey?.idx_serviceTypeId?.title ?? null;

  /**
   * Thay thế các raw MongoDB _id trong text cảnh báo bằng tên hiển thị tương ứng.
   * Backend generate warning text kèm raw ID — cần resolve ở client trước khi render.
   */
  const resolveMessage = (text: string | null | undefined): string => {
    if (!text) return '';
    let result = text;
    if (currentServiceTypeId && currentServiceTypeName) {
      result = result.replaceAll(currentServiceTypeId, currentServiceTypeName);
    }
    if (currentPolicyId && currentPolicyLabel) {
      result = result.replaceAll(currentPolicyId, currentPolicyLabel);
    }
    return result;
  };

  const totalCost = isEditing
    ? (editTotalCost ?? currentBuckets.reduce((sum, bucket) => sum + (bucket.amount || 0), 0))
    : (estimate?.applied_quote_value
      ?? estimate?.standardized_buckets?.reduce((a, b) => a + (b.amount || 0), 0)
      ?? 0);

  const internalCost = currentBuckets
    .filter(bucket => bucket.bucket_code !== '09_profit')
    .reduce((sum, bucket) => sum + (bucket.amount || 0), 0);

  const currentProfitAmount = Math.max(0, totalCost - internalCost);
  const readinessItems = [
    { label: 'Thông tin mặt bằng', ok: !!journey?.area_m2 },
    { label: 'Cấu trúc chi phí (Buckets)', ok: currentBuckets.length > 0 },
    { label: 'Nhân công chi tiết', ok: !!currentLabor?.labor_total },
    { label: 'Hạng mục vật tư', ok: currentGroups.length > 0 },
  ];
  const currentReadinessScore = Math.round((readinessItems.filter(item => item.ok).length / readinessItems.length) * 100);

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
    setEditTotalCost(estimate?.applied_quote_value ?? null);
    setSavedQuoteDerivation(estimate?.quote_derivation ?? null);
    setSavedValidationResult(estimate?.validation_result ?? null);
    setSavedJourneyInputSnapshot(estimate?.journey_input_snapshot ?? null);
    setSavedJourneyRoleSnapshot(estimate?.journey_role_snapshot ?? null);
    setSavedRoleCostAllocations(estimate?.role_cost_allocations ? estimate.role_cost_allocations.map(item => ({ ...item })) : null);
    setSavedSolutionResolution(estimate?.solution_resolution ?? null);
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
    setSavedJourneyInputSnapshot(null);
    setSavedJourneyRoleSnapshot(null);
    setSavedRoleCostAllocations(null);
    setSavedSolutionResolution(null);
    setAutoCalcNote(null);
  };

  const handleSave = async () => {
    const computedTotal = editBuckets.reduce((s, b) => s + (b.amount || 0), 0);
    const computedInternalCost = editBuckets
      .filter(b => b.bucket_code !== '09_profit')
      .reduce((s, b) => s + (b.amount || 0), 0);
    const payload: Partial<IJourneyEstimate> = {
      pricing_policy_id: editPolicyId ?? undefined,
      total_estimate_cost: computedInternalCost,
      applied_quote_value: editTotalCost ?? computedTotal,
      journey_input_snapshot: savedJourneyInputSnapshot ?? estimate?.journey_input_snapshot ?? undefined,
      journey_role_snapshot: savedJourneyRoleSnapshot ?? estimate?.journey_role_snapshot ?? undefined,
      role_cost_allocations: savedRoleCostAllocations ?? estimate?.role_cost_allocations ?? undefined,
      solution_resolution: savedSolutionResolution ?? estimate?.solution_resolution ?? undefined,
      quote_derivation: savedQuoteDerivation ?? estimate?.quote_derivation ?? undefined,
      validation_result: savedValidationResult ?? estimate?.validation_result ?? {
        is_feasible: true,
        target_profit_pct_min: 15,
        actual_profit_pct: 0,
        warning_codes: [],
      },
      standardized_buckets: editBuckets,
      labor_breakdown: editLabor,
      direct_cost_groups: editGroups,
    };

    await saveEstimate(payload);
    setIsEditing(false);
  };

  // Auto-calc engine
  /**
   * Fetches the right policy then runs computeFromPolicy.
   * Respects the priority: editPolicyId �  serviceTypeId �  is_default.
   * If editTotalCost is set, passes it as targetTotal override.
   */
  const runAutoCalc = useCallback(async (policyIdOverride?: string | null, totalOverride?: number | null) => {
    if (!journey?.area_m2 || !journey?.execution_days) {
      antMessage.warning('Can nhap Dien tich va So ngay thi cong truoc khi tinh tu dong.');
      return;
    }
    setIsAutoCalcing(true);
    try {
      let policy: IEstimatePricingPolicy | null = null;
      let resolvedPolicyMode: NonNullable<IJourneyEstimate['solution_resolution']>['policy_resolution_mode'] = 'global_default';
      const resolvedPolicyId = policyIdOverride ?? editPolicyId;

      if (resolvedPolicyId) {
        try {
          policy = await estimatePricingPolicyService.findContent(resolvedPolicyId);
          resolvedPolicyMode = 'explicit_policy';
        } catch {
          policy = null;
        }
      }

      if (!policy && journey.serviceTypeId) {
        const response = await estimatePricingPolicyService.queryContent({
          group: { op: 'AND', children: [
            { id: 'service_type_id', operation: '==', value: journey.serviceTypeId, children: [] },
            { id: 'status', operation: '==', value: 'active', children: [] },
          ]},
          sorted: [{ id: 'createdTime', desc: true }],
          limit: 1,
        } as any);
        policy = response?.data?.[0] ?? null;
        if (policy) {
          resolvedPolicyMode = 'service_default';
          if (!resolvedPolicyId) setEditPolicyId(policy._id);
        }
      }

      if (!policy) {
        const response = await estimatePricingPolicyService.queryContent({
          group: { op: 'AND', children: [
            { id: 'is_default', operation: '==', value: true, children: [] },
            { id: 'status', operation: '==', value: 'active', children: [] },
          ]},
          limit: 1,
        } as any);
        policy = response?.data?.[0] ?? null;
        if (policy && !resolvedPolicyId) {
          setEditPolicyId(policy._id);
        }
      }

      if (!policy) {
        antMessage.error('Không tìm thấy chính sách giá. Kiểm tra Cấu hình > Chính sách giá.');
        return;
      }

      const overrideQuoteValue = totalOverride ?? editTotalCost ?? undefined;
      const result = await computeJourneyEstimateSolution({
        journey,
        policy,
        currentEstimate: estimate,
        appliedQuoteValueOverride: overrideQuoteValue && overrideQuoteValue > 0 ? overrideQuoteValue : undefined,
        policyResolutionMode: resolvedPolicyMode,
      });

      setEditBuckets(result.standardizedBuckets);
      setEditLabor(result.laborBreakdown);
      setEditGroups(result.directCostGroups);
      setEditTotalCost(result.appliedQuoteValue);
      setSavedQuoteDerivation(result.quoteDerivation ?? null);
      setSavedValidationResult(result.validationResult ?? null);
      setSavedJourneyInputSnapshot(result.journeyInputSnapshot ?? null);
      setSavedJourneyRoleSnapshot(result.journeyRoleSnapshot ?? null);
      setSavedRoleCostAllocations(result.roleCostAllocations ?? null);
      setSavedSolutionResolution(result.solutionResolution ?? null);

      const noteLines = [
        'Policy: ' + String(policy.name ?? policy.code ?? policy._id),
        'Resolved templates: ' + String(result.selectedTemplateCount),
        'Internal cost: ' + fmt(result.internalCost) + ' | Applied quote: ' + fmt(result.appliedQuoteValue),
        'Recommended quote: ' + fmt(result.recommendedQuote),
      ];
      setAutoCalcNote(noteLines.join('\n'));
    } catch (err) {
      antMessage.error('Loi khi tinh: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setIsAutoCalcing(false);
    }
  }, [journey, editPolicyId, editTotalCost, estimate]);

  // Re-run when policy changes.
  const handlePolicyChange = (policyId: string | null) => {
    setEditPolicyId(policyId);
    if (policyId) {
      runAutoCalc(policyId, editTotalCost);
    }
  };

  // Track manual total override.
  const handleTotalCostChange = (val: number | null) => {
    setEditTotalCost(val);
  };

  const isInputReady = !!(journey?.area_m2 && journey?.execution_days);

  // Toolbar.
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

  // Nội dung dự toán gần nhất (dùng chung cho cả view và edit mode)
  const latestEstimateContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* 0. Summary + Readiness — đưa lên đầu để quản lý review nhanh */}
      {!isEditing && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small"
              title={<Space><SafetyCertificateOutlined /><Text strong>Financial Bound</Text></Space>}
              style={{ height: '100%' }}>
              <Statistic
                title='Tổng giá trị dự toán (Báo giá)'
                value={totalCost}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                prefix={<DollarOutlined />}
                formatter={v => fmt(Number(v))}
              />
              <Divider style={{ margin: '10px 0' }} />
              <Space direction="vertical" style={{ width: '100%' }} size={6}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type='secondary'>Chi phí nội bộ (01-08):</Text>
                  <Text strong>{fmt(internalCost)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Lợi nhuận (phần dư):</Text>
                  <Text strong style={{ color: currentProfitAmount > 0 ? '#52c41a' : '#cf1322' }}>
                    {fmt(currentProfitAmount)}
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">LN% thực tế:</Text>
                  <Text strong style={{ color: (currentValidationResult?.actual_profit_pct ?? 0) >= (currentValidationResult?.target_profit_pct_min ?? 15) ? '#52c41a' : '#cf1322' }}>
                    {currentValidationResult?.actual_profit_pct ?? '-'}%
                    <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                      (mục tiêu: {currentValidationResult?.target_profit_pct_min ?? 15}%)
                    </Text>
                  </Text>
                </div>
                {currentQuoteDerivation?.recommended_quote_value_initial != null
                  && currentQuoteDerivation?.recommended_quote_value_initial !== totalCost && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px dashed #f0f0f0' }}>
                    <Text type='secondary' style={{ fontSize: 11 }}>Policy đề xuất:</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {fmt(currentQuoteDerivation?.recommended_quote_value_initial ?? 0)}
                    </Text>
                  </div>
                )}
                {currentPolicyId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>Policy:</Text>
                    <Tag color="geekblue" style={{ fontSize: 11 }}>
                      {currentPolicyLabel ?? <Spin size="small" />}
                    </Tag>
                  </div>
                )}
                {currentValidationResult?.warning_note && (
                  <Alert type="warning" showIcon
                    message={resolveMessage(currentValidationResult.warning_note)}
                    style={{ marginTop: 4, fontSize: 11 }} />
                )}
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small"
              title={<Space><CheckCircleOutlined /><Text strong>Readiness Score</Text></Space>}
              extra={toolbar}
              style={{ height: '100%' }}>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <Progress type="dashboard" percent={currentReadinessScore}
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
              </div>
              <List size="small" split={false}>
                {readinessItems.map(row => (
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
      )}

      {/* 1. Cost Partition - 9 Buckets */}
      <Card
        size="small"
        title={<Space><BarChartOutlined /><Text strong>Cost Partition (9 Buckets)</Text></Space>}
        extra={isEditing ? toolbar : undefined}
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
          ? <LaborEdit lb={editLabor} onChange={setEditLabor} allocations={savedRoleCostAllocations} roleSnapshot={savedJourneyRoleSnapshot} />
          : estimate?.labor_breakdown
            ? <LaborView lb={estimate.labor_breakdown} allocations={estimate?.role_cost_allocations} roleSnapshot={estimate?.journey_role_snapshot} />
            : <Text type='secondary'>Chưa có dữ liệu nhân công. Nhấn Tiến hành dự toán để nhập.</Text>
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
            ? <DirectCostView groups={estimate.direct_cost_groups} onQuickSetup={() => setQuickSetupOpen(true)} resolveMsg={resolveMessage} />
            : <Text type='secondary'>Chưa có hạng mục. Nhấn Tiến hành dự toán để nhập.</Text>
        }
      </Card>

      {/* 4. Summary + Readiness — chỉ hiển thị trong edit mode (view mode đã có ở trên cùng) */}
      {isEditing && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small"
              title={<Space><SafetyCertificateOutlined /><Text strong>Financial Bound</Text></Space>}
              style={{ height: '100%' }}>
              <Statistic
                title='Tổng giá trị dự toán (Báo giá)'
                value={totalCost}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                prefix={<DollarOutlined />}
                formatter={v => fmt(Number(v))}
              />
              <Divider style={{ margin: '10px 0' }} />
              <Space direction="vertical" style={{ width: '100%' }} size={6}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type='secondary'>Chi phí nội bộ (01-08):</Text>
                  <Text strong>{fmt(internalCost)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Lợi nhuận (phần dư):</Text>
                  <Text strong style={{ color: currentProfitAmount > 0 ? '#52c41a' : '#cf1322' }}>
                    {fmt(currentProfitAmount)}
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">LN% thực tế:</Text>
                  <Text strong style={{ color: (currentValidationResult?.actual_profit_pct ?? 0) >= (currentValidationResult?.target_profit_pct_min ?? 15) ? '#52c41a' : '#cf1322' }}>
                    {currentValidationResult?.actual_profit_pct ?? '-'}%
                    <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                      (mục tiêu: {currentValidationResult?.target_profit_pct_min ?? 15}%)
                    </Text>
                  </Text>
                </div>
                {currentQuoteDerivation?.recommended_quote_value_initial != null
                  && currentQuoteDerivation?.recommended_quote_value_initial !== totalCost && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px dashed #f0f0f0' }}>
                    <Text type='secondary' style={{ fontSize: 11 }}>Policy đề xuất:</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {fmt(currentQuoteDerivation?.recommended_quote_value_initial ?? 0)}
                    </Text>
                  </div>
                )}
                {currentPolicyId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>Policy:</Text>
                    <Tag color="geekblue" style={{ fontSize: 11 }}>
                      {currentPolicyLabel ?? <Spin size="small" />}
                    </Tag>
                  </div>
                )}
                {currentValidationResult?.warning_note && (
                  <Alert type="warning" showIcon
                    message={resolveMessage(currentValidationResult.warning_note)}
                    style={{ marginTop: 4, fontSize: 11 }} />
                )}
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small"
              title={<Space><CheckCircleOutlined /><Text strong>Readiness Score</Text></Space>}
              style={{ height: '100%' }}>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <Progress type="dashboard" percent={currentReadinessScore}
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
              </div>
              <List size="small" split={false}>
                {readinessItems.map(row => (
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
      )}

      {/* 5. Audit */}
      <Card size="small" title={<Space><AuditOutlined /><Text strong>Audit Trail</Text></Space>}>
        <Row gutter={[16, 16]}>
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

  // Render
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* 0. Estimation Config - only shown in edit mode */}
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
          <Row gutter={[12, 8]}>
            <Col xs={24} md={12} lg={10}>
              <Form.Item
                label={<Text strong>Chính sách tính giá</Text>}
                style={{ marginBottom: 0 }}
                extra={<Text type='secondary' style={{ fontSize: 11 }}>Chọn policy để hệ thống tự động tính toán phân bổ chi phí</Text>}
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
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={<Text strong>Giá trị chào áp dụng (VND)</Text>}
                style={{ marginBottom: 0 }}
                extra={<Text type='secondary' style={{ fontSize: 11 }}>Nhập để ghi đè giá tự động tính từ policy</Text>}
              >
                <InputNumber
                  value={editTotalCost ?? undefined}
                  min={0}
                  style={{ width: '100%' }}
                  placeholder='Để trống → tự tính'
                  formatter={v => v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                  parser={v => Number(v?.replace(/,/g, '') || 0)}
                  onChange={handleTotalCostChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
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

      {/* Edit mode: hiển thị trực tiếp, không có tabs */}
      {isEditing ? latestEstimateContent : (
        <Tabs
          defaultActiveKey="latest"
          size="small"
          items={[
            {
              key: 'latest',
              label: (
                <Space size={4}>
                  <DollarOutlined />
                  <span>Dự toán gần nhất</span>
                  {estimate?.code && <Tag style={{ marginLeft: 2 }}>{estimate.code}</Tag>}
                </Space>
              ),
              children: latestEstimateContent,
            },
            {
              key: 'history',
              label: (
                <Space size={4}>
                  <AuditOutlined />
                  <span>Lịch sử dự toán</span>
                  {estimateHistory.length > 0 && (
                    <Tag color="blue">{estimateHistory.length}</Tag>
                  )}
                </Space>
              ),
              children: (
                <Table
                  size="small"
                  dataSource={estimateHistory}
                  rowKey={r => r._id ?? r.code ?? String(Math.random())}
                  pagination={{ pageSize: 10, showTotal: total => `${total} dự toán` }}
                  columns={[
                    {
                      title: 'Mã dự toán',
                      dataIndex: 'code',
                      width: 180,
                      render: (code: string, row) => (
                        <Space direction="vertical" size={0}>
                          <Text strong style={{ fontSize: 12 }}>{code || '—'}</Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            v{row.version_no ?? 1}
                            {row._id === estimate?._id && (
                              <Tag color="green" style={{ marginLeft: 4, fontSize: 10 }}>Gần nhất</Tag>
                            )}
                          </Text>
                        </Space>
                      ),
                    },
                    {
                      title: 'Trạng thái',
                      dataIndex: 'status',
                      width: 100,
                      render: (status: string) => (
                        <Tag color={status === 'approved' ? 'green' : status === 'draft' ? 'default' : 'orange'}>
                          {status ?? '—'}
                        </Tag>
                      ),
                    },
                    {
                      title: 'Giá báo (VND)',
                      dataIndex: 'applied_quote_value',
                      width: 160,
                      align: 'right' as const,
                      render: (v: number) => <Text strong style={{ color: '#cf1322' }}>{fmt(v ?? 0)}</Text>,
                    },
                    {
                      title: 'Chi phí nội bộ (VND)',
                      dataIndex: 'total_estimate_cost',
                      width: 160,
                      align: 'right' as const,
                      render: (v: number) => fmt(v ?? 0),
                    },
                    {
                      title: 'LN%',
                      width: 80,
                      align: 'right' as const,
                      render: (_: unknown, row: IJourneyEstimate) => {
                        const pct = row.validation_result?.actual_profit_pct;
                        const min = row.validation_result?.target_profit_pct_min ?? 15;
                        if (pct == null) return '—';
                        return (
                          <Text style={{ color: pct >= min ? '#52c41a' : '#cf1322' }}>
                            {pct}%
                          </Text>
                        );
                      },
                    },
                    {
                      title: 'Cảnh báo',
                      width: 120,
                      render: (_: unknown, row: IJourneyEstimate) => {
                        const codes = row.validation_result?.warning_codes ?? [];
                        if (!codes.length) return <Tag color="green">OK</Tag>;
                        return codes.map(c => <Tag key={c} color="orange" style={{ fontSize: 10 }}>{c}</Tag>);
                      },
                    },
                    {
                      title: 'Ngày tạo',
                      width: 140,
                      render: (_: unknown, row: any) => (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {row.createdTime
                            ? new Date(row.createdTime).toLocaleString('vi-VN')
                            : row.createdAt
                            ? new Date(row.createdAt).toLocaleString('vi-VN')
                            : '—'}
                        </Text>
                      ),
                    },
                    {
                      title: 'Người tạo',
                      dataIndex: 'createdBy',
                      width: 160,
                      render: (v: string) => <Text style={{ fontSize: 12 }}>{v || '—'}</Text>,
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      )}

      {/* Quick Setup Template Modal — opens from fallback alert */}
      <QuickSetupTemplateModal
        open={quickSetupOpen}
        onClose={() => setQuickSetupOpen(false)}
        onSuccess={() => {
          setQuickSetupOpen(false);
          // Prompt user to re-run auto calc to pick up the new template
          antMessage.info('Hãy nhấn "Tiến hành dự toán" → "Tự động tính" để áp dụng template mới.');
        }}
        serviceTypeId={
          estimate?.journey_input_snapshot?.service_type_id ??
          (journey as any)?.serviceTypeId ?? undefined
        }
        serviceTypeName={
          journey?.idx_serviceTypeId?.title ??
          (estimate?.journey_input_snapshot as any)?.idx_service_type_id?.title ??
          undefined
        }
        scaleType={estimate?.solution_resolution?.resolved_scale_type ?? undefined}
        policyId={estimate?.pricing_policy_id ?? undefined}
        policyName={currentPolicyLabel ?? undefined}
        seedComponents={estimate?.direct_cost_groups?.[0]?.components ?? undefined}
      />
    </div>
  );
};

export default Step04SolutionOrchestration;

































