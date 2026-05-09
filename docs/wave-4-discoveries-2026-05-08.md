# Wave 4 — Architecture Discoveries

**Date**: 2026-05-08
**Context**: Wave 4 — Closing the financial loop (revenue → invoice → debt → reports)

---

## Discovery 1: Backend reload (`system-apply_change`) blocked by issuer mismatch

### Finding
`mcp__bac__system-apply_change` consistently fails with:
> `HTTP Unauthorized: Unknown issuer from access_token: https://api.bac.demego.vn/identity`

The host endpoint is `https://api.test.bacgroup.vn/...` but the bearer token was issued by `api.bac.demego.vn`. Cross-tenant token mismatch.

### Workaround used in Wave 4
1. **Schema field** `PaymentRequest.payment_milestone_id` added via `schema-update_nested_property` (succeeded against the correct cluster).
2. **Trigger script** `StockOrder.PostUpdate` saved via `schema-set_trigger_script` (succeeded).
3. **FE types** patched manually (3 lines in `paymentRequest.types.ts`) so the codebase compiles without waiting for backend regenerate.
4. **Cache reload** deferred to admin (single button in BAC admin panel) — runtime won't pick up trigger until then.

### Implication
- Don't block Wave 4 features on `system-apply_change`. Treat it as "will be applied by admin offline".
- For Wave 5+: ask user to fix the `BearerToken` config so MCP can reload directly.

---

## Discovery 2: PaymentRequest ↔ PaymentMilestone link was workaround until Wave 4

### Finding
Wave 2 W2-02 used `reference_code` (free-text) as a hack to associate a PaymentRequest with a PaymentMilestone, since the backend schema had no FK link.

### Decision
Wave 4 Phase 0 added the proper FK:
```
PaymentRequest.payment_milestone_id : Reference → PaymentMilestone (optional)
```
- `aggregateJourneyFinancials` uses this FK to attribute paid PaymentRequests to a journey via its milestones (`milestoneIds.has(req.payment_milestone_id)`).
- Old `reference_code` workaround left in place for backwards compat — new code should use `payment_milestone_id`.

### Implication for Wave 5+
- Migrate existing PaymentRequest records to populate `payment_milestone_id` from `reference_code` parse.
- Once migrated, deprecate `reference_code` for milestone linkage.

---

## Discovery 3: No `Contract` schema (Wave 3 finding, reaffirmed)

`IQuotation.total` (not `total_amount`/`total_value`) is the contract value field. `aggregateJourneyFinancials` reads `contract.total ?? contract.subtotal` — no `total_amount` column exists.

---

## Discovery 4: StockOrder `total_value` was untrustworthy until Wave 4

### Finding
`StockOrder.total_value` is a Number field, but FE was never auto-computing it. Every UI piece (Inventory History, Cost Ledger drill-down) had to recompute on the fly:
```ts
items.reduce((s, i) => s + (i.received_quantity ?? i.issued_quantity ?? i.requested_quantity ?? 0) * (i.unit_price ?? 0), 0)
```

### Decision
Wave 4 Phase 6 installed a **PostUpdate trigger** on `StockOrder` that auto-computes `total_value` server-side:
- Quantity priority: `received_quantity > issued_quantity > requested_quantity > quantity`
- Price: `unit_cost`
- Skipped when `status='cancelled'` (preserves snapshot of pre-cancel value)

### Note on naming
Schema uses `unit_cost` for items but FE types had drifted to `unit_price` — the aggregator in `journeyFinancialsAggregator.ts` correctly reads `unit_price` from the JS object (FE-generated). The trigger reads `unit_cost` (the actual MongoDB field name). Both work because the FE generator maps these.

### Implication
- After admin runs `apply_change`, every StockOrder save will refresh `total_value`.
- Wave 4 reports (Cost Ledger, P&L Tab, KT Reports) read `total_value` first as fast path; fall back to per-item compute if stale.

---

## Discovery 5: `aggregateJourneyFinancials` is the new "source of truth" for cross-module finance

### Pattern introduced
Single helper in `src/utils/journeyFinancialsAggregator.ts` that fetches 7 collections in parallel and computes:
- Revenue (received, invoiced, outstanding)
- Cost (planned, material actual, payment paid, total actual)
- Margin (gross, %)
- Variance (vs plan, %)

### Reused by 6 places
| File | Use case |
|---|---|
| `JourneyCostLedger.tsx` (Wave 4 W4-02a) | Cost breakdown drill-down inside Journey360 |
| `PnLTab.tsx` (Wave 4 W4-01) | P&L tab inside Journey360 |
| `PnLReport.tsx` (Wave 4 W4-03.1) | Cross-journey P&L for KT |
| `PMReports/index.tsx` (un-mocked Wave 4) | Cross-journey summary for PM |
| (Wave 5) Customer scorecard | Per-customer P&L aggregation |
| (Wave 5) Period close report | Quarter/year P&L closing |

### Implication
- Don't duplicate finance math anywhere else. Always go through this aggregator.
- If new finance source emerges (e.g. `OperatingExpense` schema), extend the aggregator — UI consumers stay unchanged.

---

## Discovery 6: `quarterOfYear` dayjs plugin missing

### Finding
`dayjs().startOf('quarter')` raises TS error because the plugin isn't loaded globally.

### Decision
Avoid `quarter` in `RangePicker` presets. Use `[7 ngày qua, 30 ngày qua, Tháng này, Tháng trước, Năm nay]` instead — covers most KT use cases.

### Implication
If Wave 5 needs quarter views, add to `src/main.tsx`:
```ts
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(quarterOfYear);
```

---

## Discovery 7: `Journey` schema fields — `journey_code` not `code`, `customer_full_name` not `name`

Wave 4 found IJourney has no `code` or `name` field. Correct names:
- Code identifier: `journey_code`
- Customer name: `customer_full_name`
- Journey display name: stored as either `name` (deprecated) or `journey_name` (current) — both checked via `(j as any).name ?? (j as any).journey_name`

### Implication
- Code that does `journey.code` or `journey.name` will compile (because `as any`) but render `undefined`. Always use the correct field names.
- FE type may regenerate after schema sync — don't rely on `code` even if temp generation produces it.

---

## Files Created in Wave 4 (16 new + 5 modified)

### Phase 1 — Sales Invoice (W4-04)
- `src/pages/accountant/SalesInvoice/SalesInvoiceList.tsx` (NEW, ~330 lines)
- `src/pages/accountant/SalesInvoice/components/IssueInvoiceModal.tsx` (NEW, ~270 lines)
- `src/pages/shared/JourneySteps/Step10Payment.tsx` (MODIFIED — CTA "Xuất HĐ")
- `src/layouts/AccountantV3Layout/index.tsx` (MODIFIED — menu)
- `src/app/App.tsx` (MODIFIED — routes)

### Phase 2 — Debt Confirmation + Collection (W4-05)
- `src/pages/accountant/Debt/DebtConfirmationList.tsx` (NEW, ~290 lines)
- `src/pages/accountant/Debt/components/SendConfirmationModal.tsx` (NEW, ~280 lines)
- `src/pages/accountant/Debt/DebtCollectionBoard.tsx` (NEW, ~310 lines, kanban)
- `src/pages/accountant/Debt/components/CollectionTaskModal.tsx` (NEW, ~230 lines)
- `src/pages/shared/JourneySteps/Step10Payment.tsx` (MODIFIED — CTA "XN công nợ")

### Phase 3 — Cost Ledger + Cash Book (W4-02)
- `src/utils/journeyFinancialsAggregator.ts` (NEW, ~190 lines, shared helper)
- `src/pages/shared/Journeys/components/JourneyCostLedger.tsx` (NEW, ~270 lines)
- `src/pages/accountant/CashBook/CashBookList.tsx` (NEW, ~360 lines)

### Phase 4 — P&L Tab (W4-01)
- `src/pages/shared/Journeys/components/PnLTab.tsx` (NEW, ~290 lines)
- `src/pages/shared/Journeys/JourneyDetail360.tsx` (MODIFIED — mount tabs)

### Phase 5 — KT Reports (W4-03)
- `src/pages/accountant/Reports/ReportsLanding.tsx` (NEW, ~85 lines)
- `src/pages/accountant/Reports/PnLReport.tsx` (NEW, ~280 lines)
- `src/pages/accountant/Reports/CashFlowReport.tsx` (NEW, ~270 lines)
- `src/pages/accountant/Reports/ARAgingReport.tsx` (NEW, ~240 lines)
- `src/pages/accountant/Reports/APOutstandingReport.tsx` (NEW, ~240 lines)

### Phase 6 — Backend trigger + un-mock
- `StockOrder.PostUpdate` trigger script (saved via MCP)
- `src/pages/pm/Reports/index.tsx` (REWRITTEN — un-mocked, ~250 lines)
- `src/services/core-contracts/types/paymentRequest.types.ts` (MODIFIED — payment_milestone_id)

---

## Carry-over to Wave 5+

| Item | Why deferred |
|---|---|
| `apply_change` admin reload | Token issuer mismatch — admin to fix BearerToken config |
| `PaymentDashboard.tsx` still uses `mockMilestones` | Already covered by W4 KT Reports / Cost Ledger; Dashboard.tsx un-mock can be quick win |
| `pm/Construction/*`, `pm/Projects/*`, `pm/CRM/*` legacy mocks | These modules redirected/deprecated in Wave 1; cleanup batch in Wave 5 |
| `GiamSat/*` modules using mocks | Supervisor module is Wave 5 scope |
| Auto-deduct **inventory stock** (not just total_value) | Requires `MaterialStock` schema — not present today |
| Quarter view in CashBookList | Need dayjs plugin globally; trivial when needed |

---

## Build status

Final `tsc -b --noEmit` → **EXIT 0** ✅
