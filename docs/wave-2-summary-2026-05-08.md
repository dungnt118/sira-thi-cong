# Wave 2 — Summary: Đóng vòng "Đề xuất → Duyệt → Thực thi"

Ngày chốt: **2026-05-08**
Branch: `feature/detail-journey`
Theo roadmap: `docs/gap-analysis-roles-journey360-2026-05-08.md` § 5 Wave 2
Build status: `npx tsc -b --noEmit` → **EXIT 0**

---

## Mục tiêu Wave 2 (theo roadmap gốc)

> Wave 2 — Đóng vòng "Đề xuất → Duyệt → Thực thi" (tuần 3–4)
> - W2-01: Đề xuất nhập kho — schema + UI cho GS/KYT/PM tạo, KT duyệt
> - W2-02: UI Approval Pipeline cho `PaymentRequest`
> - W2-03: PM "Approval Inbox" tổng hợp
> - W2-04: Header CTAs cho KT/GS/KYT trong Journey360
> - W2-05: Tab "My Tasks" trong Journey360

**Phát hiện kiến trúc giữa wave** (đã ghi đầy đủ trong plan): Backend đã **chủ ý gộp `StockRequest` vào `StockOrder`** (hint trong field `requested_by`: *"thay thế tách schema StockRequest"*). FE còn lại file `stockRequest.types.ts` legacy. Wave 2 quyết định **KHÔNG tạo schema mới**, dùng StockOrder hiện hữu (8 status: `draft → requested → approved → dispatched → received → completed | discrepancy | cancelled`) làm trục workflow duy nhất.

→ Tiết kiệm ~1 ngày so với plan ban đầu; tránh tạo duplicate concept.

---

## Kết quả ship (8/8 tasks chính)

### Phần A — Cleanup tồn dư Wave 1

| ID | Mô tả | Trạng thái |
|---|---|---|
| C-01 | Update internal `navigate('/admin/ql/construction/...')` → `/admin/ql/journeys/...` (8 file `pm/Projects/*` + `pm/Construction/*`) | ✅ |
| C-04 | Verify unused imports trong `JourneyDetail360.tsx` sau xoá tabItems legacy | ✅ — tất cả icon còn ≥1 usage thật, không cần dọn |

### Phần B — Wave 2 chính

#### W2-04 — Header CTAs theo role trong Journey360 (visible UX win)

Restructure header conditional thành 4 branch role-specific (QL / KD / KT / GS+KYT) thay branch fallback duy nhất. CTAs:

| Role | CTA mới | Modal | Pre-fill |
|---|---|---|---|
| KT | "Đề nghị chi" | `CreatePaymentRequestModal` | `journey_id`, `request_type='supplier_payment'`, optional `payment_milestone_id` link |
| KT | "Tạo đợt thu" | `CreatePaymentMilestoneModal` | smart default `kind` theo `current_step`, auto-increment `round` |
| GS/KYT | "Đề xuất nhập kho" | `CreateStockOrderRequestModal type='in'` | `status='requested'`, items list |
| GS/KYT | "Đề xuất xuất kho" | `CreateStockOrderRequestModal type='out'` | tương tự |
| GS/KYT | "Báo cáo tiến độ" | reuse `CreateSiteReportModal` | `step_code=current_step` |

#### W2-05 — Tab "Việc của tôi" trong Journey360

- Rule mới `MY_TASKS` (alwaysVisible) trong `JOURNEY_TAB_ACCESS_RULES`.
- `MyTasksTab.tsx` filter WorkTask theo (`assignee` match user identity OR `assignee_role` match user role).
- Sort SLA: overdue → due_soon → normal → done.
- Per-card cảnh báo overdue đỏ + due_soon < 24h cam.

#### W2-02 — PaymentRequest tier-aware approval pipeline UI

- Threshold cứng **50M VND** (constant `APPROVAL_TIER_THRESHOLD_VND`).
- Tier badge "KT duyệt" / "Cần PM duyệt" trong cell amount của PaymentRequestList.
- Logic trong `PaymentRequestDetailModal.renderFooter`:
  - amount ≤ 50M: KT có thể Approve (tier 1).
  - amount > 50M: chỉ PM Approve được; KT thấy "Vượt quyền duyệt" disabled với tooltip giải thích.
- DetailModal hiện tại đã có sẵn handlers Approve/Reject/MarkAsPaid + tabs by status — chỉ thêm tier guard.

#### W2-01a — Dọn FE legacy stockRequest types

- 3 file `stockRequest.{types,service,queries}.ts` được convert thành **deprecation re-export** trỏ về StockOrder counterparts (vì OS deny `rm`).
- `stockRequestService` = `stockOrderService` (alias).
- `IStockRequest` = `IStockOrder`.
- Mọi code legacy lẻ tiếp tục compile, không có consumer mới được tạo.

#### W2-01b — StockOrder workflow UI

- `StockOrderWorkflowList.tsx` shared (~440 dòng), prop `mode: 'kt' | 'gs' | 'pm' | 'kyt'`.
- Tabs theo status (`requested / approved / dispatched / received / discrepancy / completed / cancelled / all`) với badge count.
- Mỗi mode hiển thị subset tabs phù hợp (vd. GS chỉ thấy `dispatched / received / completed`).
- Click row → navigate `/admin/{role}/inventory/order/:id` (`StockOrderDetail` 892 dòng đã có sẵn full action handlers ký signatures + status transitions).
- Routes mới:
  - `/admin/kt/inventory/stock-orders` (KT pipeline)
  - `/admin/gs/inventory/stock-orders` (GS receive queue)
  - `/admin/kyt/inventory/stock-orders` + `/admin/kyt/inventory/order/:id` (bù lại sau W1-03 trim — stock-orders là quyền nghiệp vụ KYT)
  - `/admin/ql/inventory/stock-orders` (PM oversight all-status)

#### W2-03 — PM Approval Inbox tổng hợp

- `pages/pm/Inbox/ApprovalInbox.tsx` (~330 dòng) với 4 section card 2x2 grid:
  - Section 1: PaymentRequest > 50M `pending_approval` (PM tier 2)
  - Section 2: StockOrder `requested` chưa có PM signatures[0]
  - Section 3: WorkTask `assignee_role='QL'` `status='pending'`
  - Section 4: ChangeOrder placeholder (Wave 5)
- SLA highlight: overdue đỏ + due_soon < 24h cam.
- Statistics: tổng pending, tổng overdue, đề nghị chi cấp 2.
- Route `/admin/ql/inbox` + menu mới "Hộp duyệt" trong PMLayout.

---

## Schema upgrades qua MCP

**Wave 2 không thay đổi schema nào.** PaymentRequest đã có đủ field (37 props với full status flow); StockRequest gộp vào StockOrder (Wave 1 phát hiện).

---

## Verification

| Step | Cách verify | Trạng thái |
|---|---|---|
| Build clean | `npx tsc -b --noEmit; echo $?` | ✅ EXIT 0 |
| Smoke flow KT (đề nghị chi) | KT → Journey360 → "Đề nghị chi" → submit → `/admin/kt/expenditures/payment-requests` thấy ở tab "Chờ duyệt" → Approve | _Manual test runtime_ |
| Smoke flow GS (đề xuất nhập) | GS → Journey360 → "Đề xuất nhập kho" → KT → `/admin/kt/inventory/stock-orders` thấy ở "Chờ duyệt" → Approve → Dispatched → GS receive | _Manual test runtime_ |
| Smoke PM Inbox | PM → `/admin/ql/inbox` thấy 3 section có count đúng | _Manual test runtime_ |
| My Tasks tab | mỗi role mở Journey360 có WorkTask gán cho mình | _Manual test runtime_ |
| Tier guard | tạo PaymentRequest amount = 100M → KT thấy "Vượt quyền duyệt" disabled | _Manual test runtime_ |

---

## Files mới tạo

| Path | LOC |
|---|---|
| `src/components/journey/CreatePaymentRequestModal.tsx` | ~165 |
| `src/components/journey/CreatePaymentMilestoneModal.tsx` | ~190 |
| `src/components/journey/CreateStockOrderRequestModal.tsx` | ~210 |
| `src/pages/shared/Journeys/components/MyTasksTab.tsx` | ~290 |
| `src/pages/shared/StockOrderWorkflowList.tsx` | ~440 |
| `src/pages/pm/Inbox/ApprovalInbox.tsx` | ~330 |

## Files chỉnh sửa chính

- `src/app/App.tsx`: 5 route mới + import lazy ApprovalInbox + ConstructionLegacyRedirect (W1-05).
- `src/layouts/PMLayout/index.tsx`: menu "Hộp duyệt" mới.
- `src/pages/shared/Journeys/JourneyDetail360.tsx`: imports + 4 state hooks mới + 4 modal mount + 4 role-branched header CTAs + MY_TASKS tab + rule trong `JOURNEY_TAB_ACCESS_RULES`.
- `src/pages/shared/Expenditures/PaymentRequestList.tsx`: tier badge.
- `src/pages/shared/Expenditures/components/PaymentRequestDetailModal.tsx`: tier-aware Approve logic + import Tooltip.
- `src/pages/pm/Projects/{ProjectList,ProjectDetail,ProjectCreate}.tsx` + `src/pages/pm/Construction/{ProjectList,ProjectDetail,ProjectCreate}.tsx`: navigate links.
- `src/services/core-contracts/{types,services,queries}/stockRequest.*`: deprecation re-export.

---

## Không hoàn tất / chuyển Wave 3

| ID | Mô tả | Lý do defer |
|---|---|---|
| C-03 | Bulk re-tag PaymentMilestone.kind tool | Step10Payment đã cho phép re-tag từng dòng inline; tool bulk chỉ cần khi ops migrate data lớn |
| C-02 | Smoke test runtime end-to-end | Cần access môi trường chạy thật, không thuộc scope code change |

---

## Rủi ro đã quản lý

1. **Permission denied khi `rm` file**: Worker/Supervisor file (Wave 1) và stockRequest legacy (Wave 2) đều bị OS deny xoá → đã chuyển sang chiến lược **deprecation re-export stub**. Không ảnh hưởng functional, chỉ tốn ~5 dòng/file.
2. **Backend `system-apply_change` 401 (Wave 1)**: Token issuer mismatch giữa `api.test` vs `api.bac.demego`. User đã apply manual sau đó. Wave 2 không cần schema change → không gặp lại.
3. **PaymentMilestone.kind backfill**: Existing rows null → render "Khác / Chưa phân loại" trong Step10Payment. User có thể inline re-tag từng dòng. C-03 bulk tool defer.
