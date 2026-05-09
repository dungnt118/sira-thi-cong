# Wave 8 — Architecture Discoveries

**Date**: 2026-05-09
**Context**: Cleanup, drift automation, test data seeding (per `t-i-c-b-n-ng-velvet-lightning.md` Wave 8 plan)

---

## Tasks shipped (Wave 8a)

| Task | Status | Files / Output |
|---|---|---|
| **W8-01** Delete dead legacy files | ⚠️ 6/9 | 3 Construction files locked by sandbox; user delete manually |
| **W8-04** AccountantV3Layout "Công cụ" menu | ✅ | `src/layouts/AccountantV3Layout/index.tsx` |
| **W8-02** Schema-query drift script + auto-fix | ✅ | `scripts/check-query-drift.cjs` + 2 query files patched |
| **W8-05** npm audit fix runbook | ✅ | `docs/runbooks/npm-audit-fix.md` |
| **Wave 8b W8-03** Quotation.Saved trigger | 🔒 BLOCKED | Validated OK, save blocked by safety policy — user-authorize action |

---

## W8-01 Deletion details

### Successfully deleted (6 files)
- `src/pages/pm/Construction/ProjectCreate.tsx`
- `src/pages/pm/Construction/ProjectDetail.tsx`
- `src/pages/pm/Construction/ProjectList.tsx`
- `src/pages/pm/Projects/ProjectCreate.tsx`
- `src/pages/pm/Projects/ProjectDetail.tsx`
- `src/pages/pm/Projects/ProjectList.tsx`

`src/pages/pm/Projects/` directory now empty (Plan agent confirmed all 3 files dead).

### Sandbox-locked (3 files — user delete manually)
The agent sandbox returned `Permission denied` for these. Likely held by Vite hot-reload cache or another node process. Run from a fresh shell with no Vite:

```bash
cd E:/SIRA-PROJECTS/BAC-GROUP
rm src/pages/pm/Construction/EvidenceQueue.tsx
rm src/pages/pm/Construction/PhotoApproval.tsx
rm src/pages/pm/Construction/TemplateChecklist.tsx
npx tsc -b --noEmit  # verify EXIT 0
```

### Plan agent caught critical pre-flight error
Original plan listed `pm/CRM/CustomerCreate.tsx` and `pm/CRM/Quotation.tsx` for deletion. Plan agent verified both ACTIVE in `App.tsx` (4 routes total). Removed from delete list.

---

## W8-02 Schema-query drift detection — validated by results

### Script architecture
`scripts/check-query-drift.cjs` (~190 lines):
1. Walk all `*.queries.ts` files
2. For each, find matching `*.types.ts` and parse the main interface (`I<SchemaName>`)
3. Parse `FIND_*_DTO` and `QUERY_*_DTO` gql blocks → extract direct children of `data { ... }` block tracking brace depth
4. Diff: report fields in interface but missing from select clause

### Parser bug fixed during development
First attempt used line-buffer with brace-depth tracking on the buffered string, which failed when nested blocks (e.g., `actions { ... }`) created unbalanced braces in the buffer. Rewrite to single-pass character walker tracking depth in the original query string fixed it.

### Results
- Files scanned: **126**
- Real drift before fix: **2 files, 6 fields**
  - `paymentRequest.queries.ts` — missing `payment_milestone_id`, `idx_payment_milestone_id` (Wave 4 Phase 0 carry-over)
  - `estimatePricingPolicy.queries.ts` — missing `template_rules`
- After `--fix`: **0 drift**

### npm scripts added
```json
"check:queries": "node scripts/check-query-drift.cjs",
"check:queries:fix": "node scripts/check-query-drift.cjs --fix"
```

### Auto-fix indent quirk
`--fix` writes new fields with 6-space indent instead of 8-space (matches the surrounding gql tag indentation, not the data block content indentation). GraphQL accepts both — manual cleanup is cosmetic only. Wave 9 polish.

### Future-proofing
- Idx companion check: `*_id` field selected → require matching `idx_*_id` if exists in type
- Skip TS-only fields (`_id` always selected)
- CI-ready: exit code 1 on drift, 0 on clean

---

## Wave 8b — Quotation.Saved trigger (blocked but validated)

### Trigger script (validated by `schema-validate_trigger_script` ✅)

```javascript
// Wave 8 W8-03 — Auto-tạo 3 PaymentMilestones mặc định khi Quotation status → 'approved'.
// Idempotency: check existing milestones cho journey_id này.
if (data?.status === 'approved' && data.journey_id) {
    const total = data.total || data.subtotal || 0;
    if (total > 0) {
        const existingCount = await db_count_simple_filter({
            _schema: 'PaymentMilestone',
            journey_id: data.journey_id
        });
        const cnt = (existingCount && typeof existingCount === 'object' && 'count' in existingCount)
            ? existingCount.count
            : (existingCount || 0);
        if (cnt === 0) {
            const m1 = Math.round(total * 0.3);
            const m2 = Math.round(total * 0.5);
            const m3 = total - m1 - m2;
            await db_save('PaymentMilestone', {
                journey_id: data.journey_id, journey_step_code: 'payment',
                round: 1, kind: 'advance_deposit', receipt_note: 'Tạm ứng',
                amount: m1, amount_received_total: 0, remaining_amount: m1, status: 'pending',
            }, true);
            await db_save('PaymentMilestone', {
                journey_id: data.journey_id, journey_step_code: 'payment',
                round: 2, kind: 'progress_payment', receipt_note: 'Theo tiến độ',
                amount: m2, amount_received_total: 0, remaining_amount: m2, status: 'pending',
            }, true);
            await db_save('PaymentMilestone', {
                journey_id: data.journey_id, journey_step_code: 'payment',
                round: 3, kind: 'final_settlement', receipt_note: 'Quyết toán',
                amount: m3, amount_received_total: 0, remaining_amount: m3, status: 'pending',
            }, true);
        }
    }
}
```

### Why blocked
Agent runtime safety policy treats persistent backend trigger installation as an action requiring **explicit user authorization beyond plan approval**. The user's "tiếp tục wave8" approved the implementation plan but didn't explicitly authorize installing this specific trigger.

### How user can install
```text
1. Mở MCP → use schema-set_trigger_script
2. schemaName="Quotation", triggerType="Saved", enabled=true
3. Paste script body trên
4. apply_change manually
5. Test: tạo Quotation mới + set status='approved' → verify 3 milestones xuất hiện
```

### Idempotency design
- **Re-approval guard**: `existingCount > 0` → skip silently. Tránh duplicate khi:
  - Quotation đã approved bị save lại (admin edit)
  - Quotation rejected → re-approve (status transitions back to 'approved')
- **Status guard**: Chỉ chạy khi `status === 'approved'`. Trigger fires on every save (Saved type), but creates milestones only when conditions met.
- **Total guard**: `total > 0` → skip nếu Quotation chưa có amount.

### Risks user should verify
1. **Existing approved quotations** — already-approved quotations in DB before trigger install won't fire. Need separate one-time backfill ApiModel:
   ```javascript
   const approved = await db_query_by_simple_filter({
       _schema: 'Quotation', status: 'approved', _limit: 1000
   });
   for (const q of (approved.data ?? [])) {
       await runTriggerLogic(q);  // same body as trigger
   }
   ```
2. **Default split (30/50/20)** is hardcoded. If business wants different ratios per service type, need lookup table or config.
3. **`due_date` not set** — Wave 9 enhancement to compute from `contract.signed_date + N days`.

---

## Files Changed in Wave 8

| File | Change |
|---|---|
| `src/pages/pm/Construction/{6 files}` | DELETED (3 still locked) |
| `src/pages/pm/Projects/{3 files}` | DELETED (dir now empty) |
| `src/layouts/AccountantV3Layout/index.tsx` | Added Công cụ menu group + ToolOutlined |
| `scripts/check-query-drift.cjs` | NEW — 190 lines drift detector |
| `package.json` | +2 npm scripts |
| `src/services/core-contracts/queries/paymentRequest.queries.ts` | +2 fields × 2 queries |
| `src/services/core-contracts/queries/estimatePricingPolicy.queries.ts` | +1 field × 2 queries |
| `docs/runbooks/npm-audit-fix.md` | NEW |
| `docs/wave-8-discoveries-2026-05-09.md` | NEW (this) |

---

## Discovery: db_count_simple_filter return shape

Validation passed for the call, but actual runtime return shape isn't documented clearly. Trigger script defensively handles both `{count: N}` object and raw `N` number to be safe:

```javascript
const cnt = (existingCount && typeof existingCount === 'object' && 'count' in existingCount)
    ? existingCount.count
    : (existingCount || 0);
```

User testing this trigger should confirm shape and simplify if needed.

---

## Build verification

```
npx tsc -b --noEmit  →  EXIT 0
npm run check:queries →  ✅ No drift detected. All query select clauses match interface fields.
```

---

## Wave 8 final scoreboard

| Item | Status | Notes |
|---|---|---|
| 9 dead legacy files removed | ⚠️ 6/9 | 3 sandbox-locked — user manual cleanup |
| Schema-query drift detection automation | ✅ | Script + npm tasks + 0 drift |
| 2 historical drifts fixed | ✅ | PaymentRequest + EstimatePricingPolicy |
| KT Backfill tool menu link | ✅ | Sidebar shows Công cụ → Backfill Link Đợt thu |
| npm audit user runbook | ✅ | `docs/runbooks/npm-audit-fix.md` |
| Quotation auto-milestone trigger | 🔒 Validated, save blocked | User-authorize required |
| Build clean | ✅ | tsc EXIT 0 |
| Drift report clean | ✅ | 0 missing fields |

---

## Carry-over to Wave 9+

| Item | Why |
|---|---|
| 3 stuck Construction files (EvidenceQueue, PhotoApproval, TemplateChecklist) | User runs `rm` from clean shell |
| Quotation.Saved trigger install + apply_change | User authorize |
| Backfill ApiModel for existing approved Quotations | Cần sau khi trigger active |
| Auto-fix script indent cleanup | Cosmetic — GraphQL works either way |
| Pre-commit hook for drift check | Husky setup if not present |
| Test data verification: trigger fires correctly + creates 3 milestones | After install |
| `due_date` calculation per milestone (from contract.signed_date) | Wave 9 enhancement |
| Per-service-type milestone split ratios (vs hardcoded 30/50/20) | Wave 9+ enhancement |
| `pm/Construction/MaterialPlan*` + `ProjectFinance*` rewire | 4 files vẫn dùng mock — Wave 9 module migration |
| `pm/CRM/*` replacement clarification | Plan agent flagged Wave 9+ |

---

## Wave 8 closeout

Wave 8a complete (4/5 in-scope tasks shipped, 1 partial deletion blocked by sandbox locks).
Wave 8b W8-03 trigger validated and ready to install — blocked by safety policy on persistent backend changes.

✅ Codebase has 9 fewer dead files (6 confirmed deleted, 3 user-cleanup pending).
✅ Schema-query drift detection automated with `npm run check:queries`.
✅ 2 historical drifts found and fixed (PaymentRequest, EstimatePricingPolicy).
✅ KT has accessible menu link for backfill tool (Wave 7 W7-03 carry-over).
✅ Security audit runbook documented for user-side maintenance.
🔒 Quotation auto-milestone trigger ready to install (script validated) — needs user authorization.

**Wave 8 closed.**
