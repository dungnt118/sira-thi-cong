# Wave 5 — Architecture Discoveries

**Date**: 2026-05-08
**Context**: Wave 5 — Carry-over cleanup + supervisor module rewire (partial)

---

## Scope shipped (Wave 5a)

| Task | Status | Note |
|---|---|---|
| **W5-01** Add dayjs `quarterOfYear` + `isBetween` + `customParseFormat` plugins globally | ✅ | `src/app/main.tsx` |
| **W5-02** `giam-sat/Checklist.tsx` rewire | ⏭️ Wave 5b | See "Deferred" below |
| **W5-03** `giam-sat/IncidentReport.tsx` rewire | ✅ | Mock removed, wired to `incidentReportService` |
| **W5-04** `giam-sat/EvidenceUpload.tsx` rewire | ⏭️ Wave 5b | See "Deferred" below |
| **W5-05** Run dev server + build verify | ✅ | Vite serves, landing + login render |
| **W5-06** Browser capture | ⚠️ Partial | No admin credentials; verified public pages only |
| **W5-08** Final `tsc -b --noEmit` | ✅ EXIT 0 | |

---

## Discovery 1: Supervisor Checklist + EvidenceUpload are coupled to a legacy data model

### Finding
`Checklist.tsx` (268 lines) and `EvidenceUpload.tsx` (227 lines) both depend on `Journey.work_steps[]` — a legacy mock structure with fields like `step.minPhotos`, `step.evidences[]`, `step.status` (`OPEN | IN_PROGRESS | AWAITING_REVIEW | APPROVED | REJECTED`). The real backend `Journey` schema has no `work_steps` field.

### Real backend equivalent
| Mock field | Real schema | Notes |
|---|---|---|
| `Journey.work_steps[]` | `WorkTask` records (`journey_id`, `journey_step_code='execution'`) | Need ordering convention |
| `step.evidences[]` | `JourneyDocument` records (`worktaskId`) | Already linked |
| `step.status` (5 enum) | `WorkTask.status` (3 enum: pending/finished/skipped) | **Status models diverge** |
| `step.minPhotos` | No equivalent | Need new field on WorkTask or CustomerJourneySetting |
| `step.notes` (rejection feedback) | `WorkTask.note` | OK |

### Decision
Defer to **Wave 5b** as a coherent subproject because:
1. Status enum needs reconciliation (PM reject flow doesn't exist in current WorkTask model).
2. `minPhotos` per-step requirement needs a new schema field (or evidence threshold config).
3. Both files share the same data model — splitting them creates a broken intermediate state.

### Proposed Wave 5b scope
1. **Schema**: Add `WorkTask.min_photos` (number) + `WorkTask.review_status` (`open | in_progress | awaiting_review | approved | rejected`).
2. **FE**: Rewrite `Checklist.tsx` to enumerate WorkTasks by `journey_step_code='execution'` ordered by `due_time`, treat each as a checklist step.
3. **FE**: Rewrite `EvidenceUpload.tsx` to upload via `journeyDocumentService.createJourneyDocument` linked to `worktaskId`.
4. **PM-side**: Add review queue page for `awaiting_review` WorkTasks.

Estimated effort: 1-2 days for schema + 2-3 days for FE rewrite.

---

## Discovery 2: `IncidentReport` schema field discrepancies vs. legacy mock

### Found enum mismatches
The mock used uppercase enum values that didn't match the real schema:
- Mock `severity`: `NORMAL | URGENT` → Schema: `normal | urgent`
- Mock `type`: `MATERIAL_SHORTAGE | TECHNICAL | WEATHER | EQUIPMENT | SAFETY | OTHER` → Schema: lowercase + adds `warranty | maintain`

### Decision
Used schema enum values directly (lowercase). Form labels stay uppercase Vietnamese. This matches the pattern from Wave 4 `SalesInvoice` / `DebtCollectionTask`.

---

## Discovery 3: Vite cache EPERM on Windows after kill -9

### Issue observed
Killing Vite via `taskkill /F /PID` leaves a stuck file in `node_modules/.vite/deps_temp_*/`. Vite logs:
```
Error: EPERM: operation not permitted, unlink '...@apollo_client.js'
```

The next restart fails to clean up. Workaround:
- Restart Vite cleanly via the process exit, not `taskkill /F`.
- If stuck, manually delete `node_modules/.vite/deps_temp_*` before re-running.

This is a Windows-specific Vite quirk and not a Wave 5 bug per se. Documented for future restart reliability.

---

## Discovery 4: Browser-based verification limited by credentials

### What was verified
- `tsc -b --noEmit` → EXIT 0 ✅
- Vite dev server boots, serves on `:5173` ✅
- Public landing page renders fully (BAC Group marketing site) ✅
- Login page renders all expected elements (username field, password field, login button) ✅
- React app mounts without runtime errors ✅
- No console errors during initial load ✅

### What was NOT verified
- Admin pages (KT Reports, Cost Ledger, P&L Tab, Sales Invoice list, Debt Confirmation, etc.) — require authenticated session.
- Real CRUD flows (creating an invoice, recording a receipt, generating a report).

### Reason
No admin password available in the conversation context. The user mentioned the test account email (`dungnt118@gmail.com`) but not credentials.

### Recommendation
For end-to-end verification of Wave 4 financial flows, the user can either:
1. Log in manually in browser at `http://localhost:5173/login` and walk through the flows the agent built.
2. Provide a test password via secure means → agent can drive the flow programmatically.

---

## Files Changed in Wave 5

| File | Change |
|---|---|
| `src/app/main.tsx` | Added 3 dayjs plugins (quarterOfYear, isBetween, customParseFormat) |
| `src/pages/giam-sat/IncidentReport.tsx` | Full rewrite — mock removed, wired to `incidentReportService` + `journeyService` |
| `src/pages/accountant/CashBook/CashBookList.tsx` | Restored "Quý này" preset (now safe with quarterOfYear plugin) |
| `.claude/launch.json` | Created for `preview_start` tool |
| `docs/wave-5-discoveries-2026-05-08.md` | This file |

---

## Carry-over to Wave 5b+

| Item | Why deferred | Estimated effort |
|---|---|---|
| Supervisor Checklist rewire | Coupled with EvidenceUpload + needs schema additions | 2-3 days |
| Supervisor EvidenceUpload rewire | Same as above | 1 day after Checklist |
| `WorkTask.min_photos` + `WorkTask.review_status` schema | Required for Checklist rewire | 0.5 day backend |
| PM review queue for evidence | New feature post-Checklist | 1 day |
| Legacy `pm/Construction/*` cleanup | Intentionally retained per App.tsx comment; needs migration plan | 2 days |
| Legacy `pm/Projects/*` cleanup | Same as above | 1 day |
| `pm/CRM/*` real-data wiring | CRM module is standalone scope | 3-5 days |
| `PaymentRequest.reference_code → payment_milestone_id` data migration | One-time backend script | 0.5 day |
| Browser-driven E2E test of Wave 4 flows | Needs credentials | Once available |

---

## Final build status

```bash
npx tsc -b --noEmit  →  EXIT 0
npm run dev          →  Vite ready in 387ms, port 5173
```

✅ **Wave 5a closed.** All shipped changes compile clean and the dev server boots without errors.
