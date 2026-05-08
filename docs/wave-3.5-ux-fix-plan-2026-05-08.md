# Wave 3.5 — UX Bug Fix Plan

**Date**: 2026-05-08
**Source**: `bug_report_construction.md` (kết quả kiểm thử thực tế)
**Goal**: Đóng các gap trải nghiệm người dùng critical/high trước khi tiếp tục Wave 4 features.

---

## Bối cảnh

Sau khi hoàn tất Wave 3 (wire JourneySteps với real backend services), kết quả kiểm thử thực tế trên `localhost:5173` của tài khoản `dungnt118@gmail.com` phát hiện 13+ bug/UX issues nghiêm trọng. Wave này tập trung **chỉ fix bug, không feature mới**.

---

## Phân tích Root Cause chi tiết (đã verify code)

### 🔴 CRITICAL — Data integrity & blocking

---

### UX-01 — Step09Acceptance Validation Bypass (Bug 7.1)

**Triệu chứng**: Hệ thống cho phép set `acceptance_status='accepted'` mà không cần upload Biên bản nghiệm thu hay Ảnh thực tế.

**Root cause**:
- File `src/pages/shared/JourneySteps/Step09Acceptance.tsx` (W3-02 rewrite).
- `handleStatusChange('accepted')` gọi trực tiếp `handoverAcceptanceService.updateHandoverAcceptance({acceptance_status: 'accepted'})`.
- **Không qua** `confirmAdvanceJourneyStep` (utils/journeyStepConfirmation.tsx:54) — đây là chỗ duy nhất check WorkTask `is_required && status !== 'finished'`.
- HandoverAcceptance state machine độc lập với checklist, tạo "lỗ hổng" cho user nhảy qua step gating.

**Fix approach**:
```typescript
// Trong Step09Acceptance, trước khi set status='accepted':
const requiredTasks = workTasks.filter(
    t => t.journey_step_code === 'final_acceptance' && t.is_required && t.status !== 'finished'
);
if (requiredTasks.length > 0) {
    Modal.warning({
        title: 'Chưa thể chấp nhận nghiệm thu',
        content: <ul>{requiredTasks.map(t => <li key={t._id}>{t.title}</li>)}</ul>,
    });
    return;
}
```

- Step09Acceptance cần nhận thêm prop `workTasks` từ parent (JourneyDetail360).

**Files**: `src/pages/shared/JourneySteps/Step09Acceptance.tsx`, `src/pages/shared/JourneySteps/JourneyStepRenderer.tsx`.
**Effort**: ~2h.

---

### UX-02 — Roadmap Override không cập nhật current_step (Bug 7.2)

**Triệu chứng**: Khi click step trong header roadmap (vd. step 10), header hiển thị step 10 nhưng card ở list page vẫn step 1. Click "Xác nhận hoàn thành" → reset về bước khởi đầu.

**Root cause**:
- Trong `src/pages/shared/Journeys/JourneyDetail360.tsx`, có 2 cơ chế khác nhau thay đổi step:
    1. **Reset Modal (PM Override)**: `handleResetJourneyStep` (line 709) — đúng: cập nhật `journey.current_step` trên backend.
    2. **Header Roadmap click**: chỉ đổi `searchParams.tab` để hiển thị nội dung step, **KHÔNG đổi `journey.current_step`**.
- Trong `JourneyStepRenderer.tsx:58-60`, `handleConfirmStep` lấy `actualStep = journeyCurrentStep || tabParamFallback`.
- Khi user xem step 10 trong tab nhưng `journey.current_step` thực tế là step 1, `confirmAdvanceJourneyStep` advance từ step 1 → step 2. User cảm thấy "reset" (đáng ra ở step 10 mà giờ thành step 2).

**Fix approach (Phương án A — đề xuất)**: Disable click vào step phía sau current_step trong roadmap. Chỉ cho click step ≤ current_step để xem lịch sử.
**Phương án B**: Khi user click step phía trước, hiển thị banner "Bạn đang xem bước chưa đến" và ẩn nút "Xác nhận hoàn thành" cho các step không phải current.

Phương án B linh hoạt hơn (không bỏ navigation). Đề xuất Phương án B.

**Files**: `src/pages/shared/Journeys/JourneyDetail360.tsx`, `src/pages/shared/JourneySteps/JourneyStepRenderer.tsx`.
**Effort**: ~3h.

---

### UX-03 — PM Dashboard 404 (Bug 4.1)

**Triệu chứng**: Click vào link Dashboard PM → 404.

**Root cause cần verify**:
- Route `/admin/ql/dashboard` → `<ActionCenter />` (App.tsx:328) — định nghĩa đúng.
- PMLayout menu key `/admin/ql/dashboard` (line 33) — đúng.
- Khả năng cao: ActionCenter crash ở runtime do data fetch fail (empty filter shape, role check fail), trang trắng → user tưởng 404.
- **Hoặc**: PMLayout `useEffect` (line 177-180) bouncing role-mismatch users sang dashboard khác.

**Fix approach**:
- Thêm `<ErrorBoundary>` bao quanh `<ActionCenter />` để capture crash.
- Audit data fetch trong ActionCenter — tránh `fetchJourneys` crash khi response empty.
- Verify role check không bouncing nhầm.

**Files**: `src/app/App.tsx`, `src/pages/pm/Journeys/ActionCenter.tsx`, có thể thêm `src/components/common/ErrorBoundary.tsx`.
**Effort**: ~1.5h.

---

### UX-04 — KT "Danh mục vật tư" 404 (Bug 6.1)

**Triệu chứng**: Click "Danh mục vật tư" trong KT menu → 404.

**Root cause**:
- KT menu `/admin/kt/inventory/materials` (AccountantV3Layout:30) → route `<InventoryDashboard />` (App.tsx:457). Route exists.
- Component `InventoryDashboard` thực chất là dashboard với group + SKU CRUD, không phải catalog table thuần.
- Confusion về label: menu nói "Danh mục vật tư" nhưng UI là dashboard.
- **Hoặc**: Component crash khi `materialService.queryMaterialsDto({})` fail (filter shape sai cho backend).

**Fix approach**:
- Verify component thực sự load.
- Nếu confusion → rename menu label hoặc tạo riêng catalog view.
- Nếu crash → fix data fetch shape (`{ fields: [], pageNumber: 1, pageSize: 100 }`).

**Files**: `src/pages/accountant/Inventory/Dashboard.tsx`, `src/layouts/AccountantV3Layout/index.tsx`.
**Effort**: ~1h.

---

### UX-05 — Nhật ký thi công không lưu (Bug 2.1) ⚠️ MẤT DỮ LIỆU

**Triệu chứng**: GS ghi nhật ký, click Lưu → message "Đã lưu nhật ký hiện trường" nhưng refresh page → mất hết.

**Root cause** — đã CONFIRM:
- `src/pages/giam-sat/ProjectDiary.tsx` line 42-56: `onFinish` chỉ làm `setEntries([newEntry, ...entries])` **client-side state only**.
- `entries` init từ hardcoded mock array (line 20-37).
- **KHÔNG có service call** — không gọi `siteReportService.createSiteReport` hay tương đương.
- Refresh trang → state reset về mock initial → user nghĩ "mất dữ liệu".

**Fix approach**:
- Component cần nhận prop `journeyId` từ parent (route).
- Wire `siteReportService.createSiteReport` cho save, `siteReportService.querySiteReportsDto` cho load.
- Filter: `journey_id=:journeyId AND step_code='execution'`.

**Files**: `src/pages/giam-sat/ProjectDiary.tsx`, có thể cần update App.tsx route để pass journeyId.
**Effort**: ~3h.

---

## 🟠 HIGH — Workflow disruption

---

### UX-06 — JourneyList Search/Filter broken (Bug 7.4)

**Triệu chứng**: Filter theo ID (HT-2026-001) hoặc theo bước thi công không có hiệu lực.

**Root cause** — đã CONFIRM:
- `src/pages/pm/Journeys/JourneyList.tsx` line 102-115: build flat object `{ keyword, sla_status, priority, current_step }`.
- `journeyService.queryJourneysDto(filter)` expect `GeneralCollectionFilter` shape: `{ fields: [{field, op, value}], group: {...}, pageNumber, pageSize }`.
- Backend nhận flat object → **không hiểu → trả về toàn bộ journeys không filter**.
- Line 124-126: `useEffect` chỉ depend `[keyword]` — đổi step/sla/priority **không refetch**.

**Fix approach**:
```typescript
const fetchJourneys = async () => {
    setIsLoading(true);
    try {
        const fields: any[] = [];
        if (filterStep !== 'ALL') fields.push({ field: 'current_step', op: 'eq', value: filterStep });
        if (filterSla !== 'ALL') fields.push({ field: 'sla_status', op: 'eq', value: filterSla });
        if (filterPriority !== 'ALL') fields.push({ field: 'priority', op: 'eq', value: filterPriority });
        if (keyword) fields.push({ field: 'journey_code', op: 'contains', value: keyword });
        
        const res = await journeyService.queryJourneysDto({
            fields,
            sortFields: [{ field: 'createdAt', sortType: 'desc' }],
            pageNumber: 1,
            pageSize: 100,
        } as any);
        setJourneys(res?.data || []);
    } finally {
        setIsLoading(false);
    }
};

// Update useEffect deps:
useEffect(() => { fetchJourneys(); }, [keyword, filterStep, filterSla, filterPriority]);
```

**Files**: `src/pages/pm/Journeys/JourneyList.tsx`.
**Effort**: ~1.5h.

---

### UX-07 — GS không thấy dự án của mình (Bug 5.1)

**Triệu chứng**: GS đăng nhập, vào danh sách công trình giám sát → không thấy dự án dù đã được phân quyền.

**Root cause** — đã CONFIRM:
- `src/pages/giam-sat/SupervisorJourneyList.tsx` line 118-139 `fetchJourneys`: filter chỉ theo `project_status` (ACTIVE/EXECUTING/COMPLETED), **không filter user assignment**.
- Line 151: `isOwn = j.supervisor_users === user?._id` — `supervisor_users` thường là **array**, so sánh `===` luôn false → border highlight broken.
- Nếu DB không có dự án nào ở `ACTIVE` status (default tab), list rỗng → user thấy "không có dự án".

**Fix approach**:
1. Add filter "of mine" mặc định: `supervisor_users IN [currentUserId]`.
2. Toggle "Chỉ của tôi" / "Tất cả" để xem rộng.
3. Fix `isOwn` để handle array case.

**Files**: `src/pages/giam-sat/SupervisorJourneyList.tsx`.
**Effort**: ~2h.

---

### UX-08 — PM Dashboard activity → KT Dashboard (Bug 7.3)

**Triệu chứng**: User ở `/admin/ql/dashboard`, click vào activity của project → bị redirect sang `/admin/kt/dashboard`.

**Root cause** — likely:
- `PMLayout` (line 177-180): nếu `role !== 'QL' && !isAdmin` → forcibly redirect to `/admin/{role}/dashboard`.
- `AccountantV3Layout` (line 128-132): nếu `role !== 'KT'` → redirect to `/admin/{role}/dashboard`.
- Nếu user có dual role (QL + KT) hoặc localStorage `MANUAL_ROLE_KEY` set sai, role detection có thể flip mid-flow.
- Có thể click activity → useEffect re-run trong layout → role check trigger redirect.

**Fix approach**:
- Thêm logging để track redirect chain.
- Refactor: layout chỉ redirect khi mount lần đầu (useEffect with `[]` deps cho lần đầu, không re-trigger khi navigation nội bộ).
- Audit `useAuth` hook + `MANUAL_ROLE_KEY`.

**Files**: `src/layouts/PMLayout/index.tsx`, `src/layouts/AccountantV3Layout/index.tsx`, `src/hooks/useAuth.ts`.
**Effort**: ~2h.

---

### UX-09 — PaymentRequest Detail Modal duplicate (Bug 5.3 / 3.1)

**Triệu chứng**: Mở "Chi tiết phiếu đề nghị chi" → nội dung lặp lại 2 lần.

**Root cause** — likely:
- `PaymentRequestDetailModal.tsx` line 548-587: `<Steps>` hiển thị 3 steps (Khởi tạo, Phê duyệt, Thanh toán) với mỗi step có description chứa `requested_by`, `approved_by`, `paid_by` + dates.
- `renderReadOnlyView` (line 423-528): hiển thị Descriptions với cùng các field này (header: amount/priority, "Nội dung yêu cầu", "Tài khoản thụ hưởng", "Thông tin thanh toán").
- Cả hai cùng render → user thấy thông tin trạng thái + người + ngày lặp lại.

**Fix approach**:
- Chỉ giữ Steps stepper compact (chỉ title, không description).
- Hoặc: chỉ hiện renderReadOnlyView, bỏ Steps.
- Hoặc: Steps cho status visual, Descriptions cho data — rõ ràng phân vai.

**Files**: `src/pages/shared/Expenditures/components/PaymentRequestDetailModal.tsx`.
**Effort**: ~1.5h.

---

## 🟡 MEDIUM — Logic/UX gaps

---

### UX-10 — KT PaymentDashboard hiển thị sai số liệu (Bug 3.3)

**Triệu chứng**: Dashboard tài chính KT hiển thị 0đ hoặc số liệu không khớp thực tế.

**Root cause** — đã CONFIRM:
- `src/pages/accountant/Finance/PaymentDashboard.tsx` line 10: `import { mockMilestones } from '../../../data/mockData';`
- Toàn bộ KPI/table dùng `mockMilestones` — dữ liệu mock cũ.
- Đây là **page duy nhất** trong KT layout còn dùng mock data sau Wave 2/3.

**Fix approach**:
- Replace `mockMilestones` bằng `paymentMilestoneService.queryPaymentMilestonesDto({})` (cross-journey aggregation).
- Map `MilestoneStatus` enum khớp backend (`pending/partially_paid/paid` thay vì `PENDING/PAID/OVERDUE`).
- Thêm filter `dueDate < now AND status !== 'paid'` để compute "Quá hạn".

**Files**: `src/pages/accountant/Finance/PaymentDashboard.tsx`.
**Effort**: ~3h.

---

### UX-11 — Không điều hướng sau khi tạo dự án (Bug 1.2)

**Triệu chứng**: Tạo dự án thành công → drawer đóng, list refresh nhưng không tự nhảy vào trang detail.

**Root cause** — đã CONFIRM:
- `src/pages/pm/Journeys/JourneyList.tsx` `handleFormSubmit` (line 173-191): sau create thành công, chỉ `setIsFormVisible(false)` + `fetchJourneys()`. **Không navigate.**

**Fix approach**:
```typescript
const created = await journeyService.createJourney(values);
if (created?._id) {
    navigate(buildJourneyDetailRoute('ql', created._id));
}
```

**Files**: `src/pages/pm/Journeys/JourneyList.tsx`.
**Effort**: ~30min.

---

### UX-12 — PaymentRequestDetailModal thiếu Journey selector (Bug 5.2)

**Triệu chứng**: Khi KT tạo payment request từ menu trực tiếp (không qua journey), form chỉ có ô text "reference_code" mà không có dropdown chọn dự án.

**Root cause** — đã CONFIRM:
- `PaymentRequestDetailModal.tsx`: form không có field `journey_id` / journey selector.
- `CreatePaymentRequestModal.tsx` (journey-context modal) đúng có `journey_id` từ prop nhưng không dùng cho menu-direct flow.

**Fix approach**:
- Trong `PaymentRequestDetailModal`, thêm Form.Item `journey_id` với Select.
- Load journey list từ `journeyService.queryJourneysDto({})` để populate options.
- Hide khi `request.journey_id` đã có (edit mode).
- Tách `journey_id` field khi submit + đồng thời gắn vào `reference_code` cho display.

**Files**: `src/pages/shared/Expenditures/components/PaymentRequestDetailModal.tsx`.
**Effort**: ~2h.

---

### UX-13 — JourneyForm không scroll vào error (Bug 1.1)

**Triệu chứng**: User submit form trống → claims "lưu được dự án trống". Thực tế validation có rule `required: true` nhưng error có thể không visible.

**Root cause** — partial:
- `JourneyForm.tsx` đã có rules `required: true` trên field chính (phone, name, address, request_title, service_type).
- Validation should work. Nhưng nếu user scroll xuống trước khi submit, error trên field phía trên không visible.

**Fix approach**:
- Add `scrollToFirstError` prop vào `<Form>`.
- Verify error messages visible với UX rõ ràng.

**Files**: `src/components/journey/JourneyForm.tsx`.
**Effort**: ~30min.

---

## Out of scope (defer Wave 4+)

| Bug | Lý do defer |
|---|---|
| 2.2 Thiếu trường Vật tư tiêu hao trong nhật ký | Cần schema mới `MaterialConsumption` — defer. |
| 4.2 Checklist thiếu cấu hình vai trò | Cấu hình Customer Journey Setting — không phải bug FE. |
| 4.3 Thiếu Gantt chart | Feature mới, không phải bug. |
| 6.2 Không tự động trừ kho | StockOrder workflow Wave 2 chưa hoàn — cần audit. |
| Tab switching lag | Performance optimization — cần measurement trước. |

---

## Thứ tự thực hiện

| Ngày | Tasks | Tổng giờ |
|---|---|---|
| **Day 1** | UX-05 (data loss) → UX-01 → UX-02 → UX-04 → UX-03 | ~10.5h |
| **Day 2** | UX-06 → UX-07 → UX-09 → UX-08 → UX-13 → UX-11 | ~8h |
| **Day 3** | UX-10 → UX-12 → final tsc verify | ~5.5h |

**Tổng**: ~24h ≈ 3 ngày làm việc.

---

## Verification end-to-end (sau Wave 3.5)

1. **Build clean**: `npx tsc -b --noEmit` → exit 0.
2. **Smoke flow GS**: Login GS → vào danh sách dự án → thấy dự án của mình (UX-07). Vào ProjectDiary → ghi nhật ký → refresh → dữ liệu vẫn còn (UX-05).
3. **Smoke flow Acceptance**: Mở Step09Acceptance → click "Đánh dấu đã chấp nhận" mà chưa upload biên bản → bị block với modal cảnh báo (UX-01).
4. **Smoke flow Roadmap**: Click step phía trước trong roadmap → banner cảnh báo, button confirm bị ẩn (UX-02).
5. **Smoke flow Search**: JourneyList → filter theo bước = 'execution' → chỉ thấy projects ở step thi công (UX-06).
6. **Smoke flow PaymentDashboard**: KT mở Finance Dashboard → số liệu khớp với danh sách payment milestones thực tế (UX-10).
7. **Smoke flow Create Journey**: Tạo dự án mới → tự navigate sang detail page (UX-11).
8. **Smoke flow PaymentRequest**: KT mở payment-requests page → tạo mới → có dropdown chọn journey (UX-12).
