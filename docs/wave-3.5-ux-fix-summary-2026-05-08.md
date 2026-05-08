# Wave 3.5 — UX Fix Summary

**Date completed**: 2026-05-08
**Build status**: `tsc -b --noEmit` → EXIT=0
**Source**: `bug_report_construction.md` (kết quả kiểm thử thực tế trên localhost:5173)

---

## Tasks delivered

| ID | Bug | Status | Files modified |
|---|---|---|---|
| UX-01 | 7.1 — Validation Bypass nghiệm thu | ✅ | `Step09Acceptance.tsx` |
| UX-02 | 7.2 — Roadmap state sync confusion | ✅ | `JourneyDetail360.tsx` |
| UX-03 | 4.1 — PM Dashboard 404 | ✅ | `App.tsx`, `ErrorBoundary.tsx` (NEW) |
| UX-04 | 6.1 — KT inventory dashboard 404 | ✅ | `accountant/Inventory/Dashboard.tsx` |
| UX-05 | 2.1 — Nhật ký thi công mất data ⚠️ | ✅ | `giam-sat/ProjectDiary.tsx` |
| UX-06 | 7.4 — JourneyList search/filter broken | ✅ | `pm/Journeys/JourneyList.tsx` |
| UX-07 | 5.1 — GS không thấy dự án của mình | ✅ | `giam-sat/SupervisorJourneyList.tsx` |
| UX-08 | 7.3 — Layout role redirect bouncing | ✅ | `PMLayout`, `AccountantV3Layout` |
| UX-09 | 5.3/3.1 — PaymentRequest modal duplicate | ✅ | `PaymentRequestDetailModal.tsx` |
| UX-10 | 3.3 — KT PaymentDashboard 0đ | ✅ | `accountant/Finance/PaymentDashboard.tsx` |
| UX-11 | 1.2 — Missing redirect after create journey | ✅ | `pm/Journeys/JourneyList.tsx` |
| UX-12 | 5.2 — PaymentRequest thiếu journey selector | ✅ | `PaymentRequestDetailModal.tsx` |
| UX-13 | 1.1 — Form không scroll vào error | ✅ | `JourneyForm.tsx` |

13/13 tasks completed.

---

## Root cause + Fix highlights

### UX-05 (Critical — data loss)
**Trước**: `ProjectDiary.tsx` lưu nhật ký vào `setEntries` local state, refresh trang là mất sạch. Mock data hardcoded trong `useState` initial value.
**Sau**: Wire vào `siteReportService` (create/query). `journey_step_code='execution'`, encode weather/manpower/activities/notes vào `content` với prefix `[DIARY-V1]` để parse khi hiển thị (chưa có schema field riêng — sẽ migrate khi Wave 4+ thêm).

### UX-01 (Critical — validation bypass)
**Trước**: Step09Acceptance cho phép `acceptance_status='accepted'` trực tiếp qua modal, bypass cơ chế gating WorkTask của `confirmAdvanceJourneyStep`.
**Sau**: Thêm `validateAcceptedTransition()` check `WorkTask.is_required && status !== 'finished'` cho step `final_acceptance` và `HandoverIssue.severity='critical'` chưa đóng. Block với `Modal.warning` liệt kê blockers cụ thể.

### UX-06 (High — search broken)
**Trước**: `JourneyList.fetchJourneys` build flat object `{keyword, sla_status, priority, current_step}` — backend không hiểu shape này, trả full list. useEffect chỉ depend `[keyword]`, đổi step/sla/priority không refetch.
**Sau**: Build proper `GeneralCollectionFilter` với `fields: [{field, op, value}]`. useEffect depend tất cả filter states. Keyword search dùng `op: 'contains'` trên `journey_code` (bao phủ ID search HT-2026-001).

### UX-07 (High — supervisor visibility)
**Trước**: `SupervisorJourneyList` show all journeys, không filter theo user assignment. `isOwn` check `j.supervisor_users === user._id` luôn false vì array.
**Sau**: Helper `isJourneyAssignedToUser(j, userId, username)` handle array + object shapes. Toggle "Chỉ của tôi" mặc định ON. Empty state có CTA "Xem tất cả công trình" nếu user chưa được phân công.

### UX-09 (High — duplicate display)
**Trước**: `PaymentRequestDetailModal` render Steps stepper với description (people + dates) + renderReadOnlyView Descriptions cùng thông tin → user thấy lặp 2 lần.
**Sau**: Steps compact (chỉ title), người duyệt/người tạo chuyển vào Descriptions. Lý do từ chối hiển thị riêng dạng banner đỏ.

### UX-10 (Medium — KT Finance 0đ)
**Trước**: `PaymentDashboard.tsx` import `mockMilestones` cũ → toàn bộ KPI/table sai số liệu.
**Sau**: Wire `paymentMilestoneService.queryPaymentMilestonesDto` cross-journey. Status enum đúng theo backend (`pending|partially_paid|paid|overdue`). Helper `isOverdue()` compute dựa trên `due_date` + `remaining_amount`. CTA "Ghi nhận thu" mở Journey detail tab Payment để dùng `RecordReceiptModal` đã có.

### UX-12 (Medium — journey selector)
**Trước**: `PaymentRequestDetailModal` không có field chọn dự án — KT tạo phiếu chi từ menu trực tiếp không gắn được journey.
**Sau**: Thêm Form.Item `reference_code` (PaymentRequest schema chưa có `journey_id` riêng → dùng `reference_code` chuẩn theo `CreatePaymentRequestModal`). Select có search, hiển thị journey_code + customer + request_title. Hide khi đã có reference_code (edit mode).

---

## Patterns introduced (reusable)

### 1. ErrorBoundary
File `src/components/common/ErrorBoundary.tsx` — wrap các route component nhạy cảm để tránh crash silent (user nhầm là 404).

```tsx
<Route path="dashboard" element={
    <ErrorBoundary fallbackTitle="Không thể tải Dashboard PM">
        <ActionCenter />
    </ErrorBoundary>
} />
```

### 2. Layout redirect guard với Ref
PMLayout / AccountantV3Layout dùng `redirectedRole.current` để chỉ redirect 1 lần khi role thay đổi, tránh re-trigger khi navigate nội bộ.

### 3. User assignment matching (multi-shape)
`isJourneyAssignedToUser(journey, userId, username)` handle các shape: string ID, object `{_id}`, object `{username}`, array of any of these.

### 4. Filter shape pattern
Đảm bảo dùng đúng `GeneralCollectionFilter`:
```ts
{
    fields: [{ field: 'xxx', op: 'eq'|'contains'|..., value: ... }],
    sortFields: [{ field: 'createdAt', sortType: 'desc' }],
    pageNumber: 1,
    pageSize: 200,
}
```

---

## Verification checklist (manual)

- [ ] Login GS → vào `/admin/gs/diary/:projectId` → ghi nhật ký → refresh → data còn (UX-05).
- [ ] Login GS → list công trình → mặc định ON "Chỉ của tôi" → chỉ hiển thị journey được phân công (UX-07).
- [ ] Login QL → mở Journey detail → Step09 Acceptance → click "Đánh dấu chấp nhận" với required task chưa xong → modal cảnh báo block (UX-01).
- [ ] Login QL → click step phía sau current_step trong roadmap → banner "Bạn đang xem bước tương lai" (UX-02).
- [ ] Login QL → JourneyList → search "HT-" → filter by step → hiển thị đúng (UX-06).
- [ ] Login QL → tạo journey mới → submit → tự nhảy vào trang detail (UX-11).
- [ ] Login QL → tạo journey trống → bấm Submit → scroll lên field lỗi đầu tiên (UX-13).
- [ ] Login KT → `/admin/kt/finance/milestones` → KPI khớp với danh sách milestone thật (UX-10).
- [ ] Login KT → `/admin/kt/expenditures/payment-requests` → "Tạo phiếu" → có dropdown chọn công trình (UX-12).
- [ ] Login KT → mở chi tiết phiếu chi → không thấy nội dung lặp 2 lần (UX-09).

---

## Out of scope (defer Wave 4+)

| Bug | Lý do |
|---|---|
| 2.2 Vật tư tiêu hao trong nhật ký | Cần `MaterialConsumption` schema. |
| 4.2 Checklist thiếu cấu hình vai trò | Config Customer Journey Setting, không phải bug FE. |
| 4.3 Gantt chart | Feature mới. |
| 6.2 Auto trừ kho | StockOrder workflow Wave 2 chưa hoàn — audit Wave 4. |
| Tab switching lag | Performance — cần measure trước khi optimize. |

---

## Files changed

**New**:
- `src/components/common/ErrorBoundary.tsx`
- `docs/wave-3.5-ux-fix-plan-2026-05-08.md`
- `docs/wave-3.5-ux-fix-summary-2026-05-08.md` (this file)

**Modified**:
- `src/app/App.tsx`
- `src/components/journey/JourneyForm.tsx`
- `src/layouts/PMLayout/index.tsx`
- `src/layouts/AccountantV3Layout/index.tsx`
- `src/pages/giam-sat/ProjectDiary.tsx`
- `src/pages/giam-sat/SupervisorJourneyList.tsx`
- `src/pages/pm/Journeys/JourneyList.tsx`
- `src/pages/shared/Journeys/JourneyDetail360.tsx`
- `src/pages/shared/JourneySteps/Step09Acceptance.tsx`
- `src/pages/shared/Expenditures/components/PaymentRequestDetailModal.tsx`
- `src/pages/accountant/Inventory/Dashboard.tsx`
- `src/pages/accountant/Finance/PaymentDashboard.tsx`

Total: 12 modified + 3 created.
