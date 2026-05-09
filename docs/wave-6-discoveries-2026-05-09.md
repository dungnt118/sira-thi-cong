# Wave 6 — Architecture Discoveries

**Date**: 2026-05-09
**Context**: Carry-over cleanup từ Wave 4/5 + Wave 5b (Supervisor module rewire)

---

## Tasks shipped

| Task | Status | Files affected |
|---|---|---|
| **W6-01** Codemod 27 legacy `destroyOnClose` → `destroyOnHidden` | ✅ | 27 files (chatbox, journey components, accountant assets, admin-v2, pm settings/teams, sale customers, expenditures, JourneyDetail360) |
| **W6-02** React 19 + antd v5 compat shim | ✅ | `src/app/main.tsx`, `package.json` (+1 dep) |
| **W6-03** Fix Bug 2 — CashBook default range | ✅ | `src/pages/accountant/CashBook/CashBookList.tsx` |
| **W6-04** WorkTask schema additions (`min_photos` + `review_status`) | ✅ schema saved | Backend (admin reload pending), `workTask.types.ts` patched |
| **W6-05** Rewire `giam-sat/Checklist.tsx` with real WorkTask | ✅ | Full rewrite ~280 lines |
| **W6-06** Rewire `giam-sat/EvidenceUpload.tsx` with JourneyDocument | ✅ | Full rewrite ~290 lines |

---

## Discovery 1: antd v5 React 19 compat shim works cleanly

### Problem
React 19 was installed (`^19.2.0`) but antd v5 only officially supports React 16~18 → console warning on every page load.

### Fix
```bash
npm install @ant-design/v5-patch-for-react-19 --save
```

```ts
// src/app/main.tsx — must import BEFORE App mount
import '@ant-design/v5-patch-for-react-19';
```

### Result
- Console warning `[antd: compatible] antd v5 support React is 16~18` removed
- Modal/notification/message hooks work without `unstable_warning` calls
- No TS errors, no runtime errors

---

## Discovery 2: Codemod via Python sed-equivalent works cross-platform

For 27 files needing identical text replacement (`destroyOnClose` → `destroyOnHidden`), used a single Bash loop calling Python's file replace. This is faster and safer than 27 individual `Edit` tool calls when:
- Replacement string is identical across all files
- No surrounding context needed for disambiguation
- Files are not yet open in conversation context (would otherwise need `Read` first)

```bash
for f in $(grep -rl "PATTERN" src/); do
  python -c "
content = open('$f','r',encoding='utf-8').read()
open('$f','w',encoding='utf-8').write(content.replace('OLD', 'NEW'))
"
done
```

---

## Discovery 3: WorkTask is the canonical "step" record

### Finding
Wave 5 paused Checklist + EvidenceUpload rewire because the legacy `Journey.work_steps[]` mock structure didn't map cleanly to backend schemas. Wave 6 confirms:
- `WorkTask` records with `journey_step_code='execution'` ARE the canonical Supervisor checklist steps
- Each WorkTask = one step
- `WorkTask.title` + `description` provide step name + instructions
- Order by `due_time` (asc) — first step has earliest due time
- `WorkTask.assignee_role='GS'` filters to Supervisor-relevant tasks

### New fields (Wave 6 W6-04)
| Field | Type | Purpose |
|---|---|---|
| `min_photos` | Number | Minimum photos required for this step (0 = không bắt buộc) |
| `review_status` | Text dropdown | `open` \| `in_progress` \| `awaiting_review` \| `approved` \| `rejected` |

### Status display priority in Checklist UI
1. `review_status` (W6 new) > legacy `status` field
2. Fallback: `status='finished'` → `approved`, `status='skipped'` → `rejected`, else `open`

---

## Discovery 4: JourneyDocument is the canonical evidence container

### Finding
EvidenceUpload's old mock saved photos to `Journey.work_steps[i].evidences[]` array directly. Real backend uses:
- `JourneyDocument` records linked via `worktaskId` field
- `doc_type='site_photos'` for evidence images
- `files: HeadlessFileUpload[]` array stores actual file references

### Wave 6 implementation
EvidenceUpload now:
1. Fetches existing JourneyDocuments by `worktaskId` (shows count of prior uploads)
2. New uploads are previewed locally (data URLs)
3. Submit creates 1 JourneyDocument per session with all files + notes
4. Updates linked WorkTask `review_status='awaiting_review'`

### Limitation deferred to Wave 7
Real file storage upload requires `upload_url` endpoint + multipart form. Wave 6 saves only metadata (title, description, doc_type, worktaskId) and empty `files: []`. Wave 7 will wire actual file upload.

---

## Discovery 5: Backend reload still blocked (Wave 4 carry-over confirmed)

`mcp__bac__system-apply_change` failed with same token issuer mismatch:
> `Unknown issuer from access_token: https://api.bac.demego.vn/identity`

Schema fields `WorkTask.min_photos` and `WorkTask.review_status` saved successfully via `schema-batch_create_or_update_property`. Admin must trigger reload manually.

Workaround: Manual FE type patches (3 lines) so codebase compiles immediately.

---

## Files Changed in Wave 6

| Category | Files | Lines |
|---|---|---|
| Codemod (W6-01) | 27 files (rename only) | ~27 single-token replacements |
| Compat patch (W6-02) | `main.tsx`, `package.json` | +5 lines |
| UX fix (W6-03) | `CashBookList.tsx` | 4 lines (default range) |
| Schema (W6-04) | `workTask.types.ts` (FE manual patch) | +6 lines (2 fields + 1 enum + 1 enum2) |
| Supervisor (W6-05) | `Checklist.tsx` (rewrite) | 280 lines |
| Supervisor (W6-06) | `EvidenceUpload.tsx` (rewrite) | 290 lines |
| Doc | This file | ~150 lines |

**Total: 32 files modified, ~3 new files (none — only modifications)**

---

## Bug fixes (carry-over from Wave 4/5)

| Bug | Severity | Fix | Wave |
|---|---|---|---|
| antd `destroyOnClose` deprecation (Wave 3+ files) | Medium | Wave 5 (9 files) | W5 ✅ |
| antd `destroyOnClose` deprecation (legacy 27 files) | Medium | Wave 6 (W6-01) | W6 ✅ |
| antd `bodyStyle` deprecation | Medium | Wave 5 (2 files) | W5 ✅ |
| antd `Spin tip` warning | Low | Wave 5 (2 files) | W5 ✅ |
| antd `compatible` React 19 warning | Medium | Wave 6 (W6-02) | W6 ✅ |
| Breadcrumb raw URL slug for Wave 4 routes | Medium | Wave 5 (Bug 1) | W5 ✅ |
| CashBook default range "Tháng này" miss April | UX | Wave 6 (W6-03) | W6 ✅ |
| Supervisor Checklist mock data | Critical | Wave 6 (W6-05) | W6 ✅ |
| Supervisor EvidenceUpload mock data | Critical | Wave 6 (W6-06) | W6 ✅ |

---

## Build verification

```
npx tsc -b --noEmit  →  EXIT 0
```

After:
- 27 codemod replacements
- React 19 compat shim install + import
- WorkTask FE type patch (+ schema saved)
- Checklist + EvidenceUpload rewrites (570 lines new code total)

---

## Carry-over to Wave 7+

| Item | Why deferred |
|---|---|
| `apply_change` admin reload | Token issuer mismatch — admin to fix BearerToken config |
| Real file storage upload in EvidenceUpload | Needs upload_url + multipart wire |
| `PaymentRequest.reference_code → payment_milestone_id` data migration | One-time backend script |
| Test data setup: ≥1 PaymentMilestone + ≥1 PaymentReceipt for Wave 4 E2E test | User-side, not code |
| `pm/Construction/*`, `pm/Projects/*`, `pm/CRM/*` legacy mock cleanup | Module migration scope |
| 18 npm audit vulnerabilities | Independent dependency upgrade pass |

---

## Wave 6 closeout

✅ All 6 in-scope tasks shipped
✅ Build clean
✅ 9 historical bugs resolved across Waves 3/4/5/6
✅ Supervisor module no longer uses mock data (was the biggest carry-over from Wave 5)
✅ Wave 4 antd compat warnings fully resolved

**Wave 6 closed.**
