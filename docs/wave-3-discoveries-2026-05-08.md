# Wave 3 — Architecture Discoveries

**Date**: 2026-05-08  
**Context**: Wave 3 execution — wiring JourneySteps to real backend services

---

## Discovery 1: No Separate `Contract` Schema

### Finding
The backend has **no `Contract` schema**. `schema-search "Contract"` returned empty results. `schema-list` confirmed absence.

### Root Cause
"Hợp đồng" in this business domain = `Quotation` with `status='approved'`.

- `Quotation.version_no` handles contract versioning (v1 draft → sent → approved = contract)
- `Quotation.approved_at` marks the moment a quotation becomes a contract
- The UI label "Hợp đồng" = `Quotation(status=approved)` record

### Decision
Rewrote `Step06Contract.tsx` to use `quotationService`:
- Fetches quotations filtered by `journey_id`, sorted by `version_no desc`
- Maps `QuotationStatusEnum` (draft/sent/approved/rejected) to visual labels
- Approved quotation = displayed as "Hợp đồng đã ký"
- New quotation version = auto-incremented `version_no`

### Implication for Future Waves
- Do **NOT** create a `Contract` schema — it would be a duplicate concept
- Wave 4/5 referencing contracts should continue pointing to `Quotation(status=approved)`
- Status transitions: `draft → sent → approved → rejected` (no other statuses)

---

## Discovery 2: `HandoverAcceptance.acceptance_status` (not `passed_status`)

### Finding
Wave 3 plan referenced `passed_status` as the acceptance field. The actual schema uses `acceptance_status`.

### Actual Enum
```
acceptance_status: 'draft' | 'partially_accepted' | 'accepted' | 'rework_required'
```

### Decision
`Step09Acceptance.tsx` uses `acceptance_status` directly — matches the existing FE types in `handoverAcceptance.types.ts` without any adjustment needed.

---

## Discovery 3: WarrantyCard Auto-Create is FE-Driven (Wave 3)

### Finding
The Wave 3 plan suggested implementing auto-creation of WarrantyCard via a backend trigger script. Investigation found:
1. The backend trigger infrastructure exists but would require MCP schema editing
2. The FE can do an idempotent check (`queryWarrantyCardsDto` by `journey_id`) before creating

### Decision
WarrantyCard auto-creation is **FE-driven** in Wave 3:
- Called from `Step09Acceptance.handleStatusChange(next='accepted')`
- Guards with `if (warrantyCard)` to prevent duplicates
- Sets `warranty_months=12`, `expiry_date=+12months`, `issued_at=now`
- Optimistic UI: shows new card info immediately after creation

### Implication
If multiple users can simultaneously accept a handover, there's a small race window. The backend `update_if_duplicate` pattern could address this in Wave 4. For Wave 3 operational volume, FE guard is sufficient.

---

## Discovery 4: No Dedicated CRM Follow-up Schema for `after_sales`

### Finding
No `CrmActivity`, `CustomerSatisfaction`, or `NpsRecord` schema exists. The Wave 3 plan's "wire CRM follow-up using Journey aggregate fields" needed a practical interpretation.

### Decision
`Step13Care.tsx` wired to two existing schemas:
1. **`WorkTask`** with `journey_step_code='after_sales'` — for care activities (calls, visits, surveys)
2. **`WarrantyReminder`** with `journey_step_code='after_sales'` — for scheduled customer outreach (SMS/Zalo)

Hardcoded NPS score and `careData` simulation removed entirely.

### Implication for Wave 5
If NPS tracking becomes a requirement, a dedicated `CustomerSatisfactionRecord` schema is recommended with fields: `nps_score`, `feedback`, `survey_sent_at`, `survey_responded_at`. Wave 3 does not create this schema.

---

## Summary Table

| Discovery | Impact | Action |
|---|---|---|
| Contract = Quotation(approved) | Step06 rewired to `quotationService` | Do NOT create Contract schema |
| `acceptance_status` not `passed_status` | Types already correct, no change | Step09 uses correct field |
| WarrantyCard FE-driven | Step09 creates card on accept | Backend trigger deferred to Wave 4 |
| No CRM schema for after_sales | Step13 uses WorkTask + WarrantyReminder | NPS schema deferred to Wave 5 |

---

## Files Changed in Wave 3

| File | Change |
|---|---|
| `src/components/journey/RecordReceiptModal.tsx` | **NEW** — Receipt recording modal |
| `src/pages/shared/JourneySteps/Step10Payment.tsx` | Wire receipt modal + row-expand receipt history |
| `src/pages/shared/JourneySteps/Step06Contract.tsx` | **REWRITE** — Quotation-as-contract |
| `src/pages/shared/JourneySteps/Step09Acceptance.tsx` | **REWRITE** — HandoverAcceptance + HandoverIssue + WarrantyCard |
| `src/pages/shared/JourneySteps/Step11Maintain.tsx` | **REWRITE** — WarrantyCase + WarrantyVisit (maintenance) |
| `src/pages/shared/JourneySteps/Step12Warranty.tsx` | **REWRITE** — WarrantyCase + WarrantyCard info |
| `src/pages/shared/JourneySteps/Step13Care.tsx` | **REWRITE** — WorkTask + WarrantyReminder (care activities) |
| `src/pages/accountant/Warranty/WarrantyCardsList.tsx` | **NEW** — KT warranty cards management page |
| `src/pages/accountant/Warranty/WarrantySchedule.tsx` | **NEW** — KT warranty schedule (visits + reminders) |
| `src/app/App.tsx` | Wire `/admin/kt/warranty/cards` and `/admin/kt/warranty/schedule` |
