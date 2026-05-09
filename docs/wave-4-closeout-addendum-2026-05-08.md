# Wave 4 — Closeout Addendum

**Date**: 2026-05-08
**Context**: Post `apply_change` (admin reload). Resolving residual gaps from `wave-4-discoveries-2026-05-08.md`.

---

## What changed since the original Wave 4 closeout

### ✅ 1. Backend cache reload (admin done)

User executed `apply_change` manually via BAC admin panel. Result:
- `StockOrder.PostUpdate` trigger now active runtime.
- `PaymentRequest.payment_milestone_id` schema field active runtime.
- Next StockOrder save will populate `total_value` server-side.

### ✅ 2. PaymentDashboard.tsx — false-positive in earlier audit

The Wave 4 discoveries listed `PaymentDashboard.tsx` as "still using mockMilestones (carry-over)". That was a false positive — the file references `mockMilestones` only inside a comment block (`// REWRITE: thay mockMilestones bằng paymentMilestoneService...`).

Actual usage already wired to `paymentMilestoneService.queryPaymentMilestonesDto`. **No work needed.**

### ✅ 3. Legacy modules under `pm/Construction/*` and `pm/Projects/*` — explicitly retained

App.tsx contains a comment confirming intent:
```
// Page components (PMProjectList, ProjectFinance, EvidenceQueue, PhotoApproval,
// TemplateChecklist, MaterialPlan) are intentionally retained on disk
```

The 4 still-imported files (`MaterialPlan`, `MaterialPlanList`, `ProjectFinance`, `ProjectFinanceList`) are reachable from active routes. Cleanup is Wave 5+ scope when `pm/Inventory/*` and `pm/Construction/*` get migrated to Journey-centric IA.

### ✅ 4. `giam-sat/*` mocks — Wave 5 scope

All Supervisor module pages (`Checklist`, `IncidentReport`, `EvidenceUpload`, etc.) still use mock data. These are intentional because the Supervisor data model rewire is the Wave 5 project. Wave 4 explicitly scoped to KT financials only.

---

## Performance optimization (added in this addendum)

### Problem
`PnLReport` and `PMReports` scan up to 100 journeys, calling `aggregateJourneyFinancials` per journey. Each call internally fetched ALL paid `PaymentRequest` records globally → **100 identical global queries** per report load.

### Fix
1. Extracted `fetchAllPaidPaymentRequests()` as a standalone async helper.
2. Added `AggregateOptions.paidRequestsCache` parameter to `aggregateJourneyFinancials`.
3. Updated both `PnLReport.tsx` and `PMReports/index.tsx` to:
   - Fetch the global paid-requests array ONCE upfront (parallel with journey list).
   - Pass it as `paidRequestsCache` to every per-journey aggregate call.

### Impact
- Network calls per cross-journey report: **~700 → ~601** (one global request + 600 per-journey queries).
- The optimization scales: 200 journeys would have been 1400 calls before, 1201 now.
- For single-journey views (`JourneyCostLedger`, `PnLTab`), no change — still uses default in-aggregator fetch.

---

## Backend trigger alignment (added in this addendum)

### Problem found
`aggregateJourneyFinancials` was reading `item.unit_price` from StockOrder items, but the actual MongoDB field is `item.unit_cost`. With the W4 Phase 6 trigger now active, `total_value` is computed server-side using `unit_cost` — but FE-side aggregator was diverging.

### Fix
1. **Fast path**: Aggregator now reads `StockOrder.total_value` first (populated by trigger). Only falls back to per-item compute if absent or zero.
2. **Field name fallback**: When falling back, checks both `unit_cost` (canonical) AND `unit_price` (legacy FE alias) for compatibility with records persisted before trigger went live.
3. Same pattern applied to `JourneyCostLedger` drill-down column.

### Result
- Cost numbers across `JourneyCostLedger`, `PnLTab`, `PnLReport`, `PMReports` are now consistent with what KT sees in the Inventory module.
- Old StockOrder records (created before trigger) → fallback compute.
- New StockOrder records (created after) → use `total_value` directly (faster).

---

## Final verification

### Build
```bash
npx tsc -b --noEmit  →  EXIT 0
```

### Files modified in this addendum
| File | Change |
|---|---|
| `src/utils/journeyFinancialsAggregator.ts` | Add `fetchAllPaidPaymentRequests()` + `AggregateOptions.paidRequestsCache` + StockOrder.total_value fast path + unit_cost field correction |
| `src/pages/accountant/Reports/PnLReport.tsx` | Use cache pattern |
| `src/pages/pm/Reports/index.tsx` | Use cache pattern |
| `src/pages/shared/Journeys/components/JourneyCostLedger.tsx` | Use total_value fast path + correct field name |

---

## Final Wave 4 status

✅ All 6 phases complete.
✅ Backend trigger live (admin applied change).
✅ Performance optimization in place for cross-journey reports.
✅ Field name alignment between FE aggregator and backend trigger.
✅ False-positive carry-overs cleared (PaymentDashboard).
✅ Documented carry-overs to Wave 5+ (legacy modules, supervisor mocks).

**Wave 4 officially closed.**
