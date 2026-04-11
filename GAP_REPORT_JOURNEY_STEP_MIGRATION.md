# Gap Report: Journey Step Setting Migration
> Date: 2026-04-11
> Scope: Migration từ kiến trúc cũ (step-name objects) sang kiến trúc mới (`steps[]` + `StepsStepCodeEnum`)

---

## Tóm tắt

**Trạng thái: 95% hoàn thành**

Phần lớn codebase đã được migrate sang contract mới. Chỉ còn **1 gap quan trọng** cần sửa.

| Hạng mục | Trạng thái | Số lượng |
|---|---|---|
| Files dùng step code mới (đúng) | ✅ | 10 |
| Files migrate chưa hoàn chỉnh | ⚠️ | 1 |
| Files import deprecated interface | ✅ Sạch | 0 |
| Hardcoded step name cũ | ⚠️ | 1 |

---

## GAPS CẦN SỬA

### GAP-01 — Hardcoded fallback dùng step code cũ
**Mức độ:** 🔴 Cao
**File:** `src/pages/shared/JourneySteps/Step01Info.tsx`
**Dòng:** ~523

**Mã hiện tại:**
```ts
const currentStep = journeyData.current_step || 'lead_intake';
```

**Vấn đề:**
Fallback default dùng giá trị `'lead_intake'` — là step code cũ, **không có trong `StepsStepCodeEnum` mới**.
Khi `journey.current_step` là `null` hoặc `undefined`, giá trị fallback này sẽ không khớp với bất kỳ entry nào trong `STEP_NAME_MAPPING`, gây lỗi render hoặc hiển thị sai.

**Cần sửa thành:**
```ts
const currentStep = journeyData.current_step || 'lead_new';
```

---

## CÁC FILE ĐÃ MIGRATE ĐÚNG (để tham khảo)

| File | Ghi chú |
|---|---|
| `src/services/core-contracts/types/customerJourneySetting.types.ts` | Contract gốc — `IStepsItem`, `StepsStepCodeEnum` đúng. Deprecated interfaces giữ lại chỉ để tương thích ngược |
| `src/services/core-contracts/types/journey.types.ts` | `JourneyCurrentStepEnum` và `JourneyCurrentStepEnum2` đúng 12 step codes |
| `src/pages/shared/Journeys/components/JourneyHistoryModal.tsx` | `HEADER_STEP_CONFIG` dùng đủ 12 step codes mới |
| `src/pages/pm/Settings/CustomerJourneySettingPage.tsx` | `FIXED_STEPS` array dùng 12 step codes mới |
| `src/pages/sale/Journeys/journeySaleMeta.ts` | `JOURNEY_STEP_OPTIONS` và `JOURNEY_STEP_META` dùng codes mới |
| `src/pages/pm/Journeys/ActionCenter.tsx` | `JOURNEY_STEPS_CONFIG` và conditional checks dùng codes mới |
| `src/pages/shared/JourneySteps/JourneyStepRenderer.tsx` | `MAP_ENUM_TO_STEP_CODE` và `JOURNEY_STEP_SEQUENCE` đúng |
| `src/pages/shared/JourneySteps/Step01Info.tsx` | `STEP_NAME_MAPPING` đúng — **chỉ còn vấn đề ở fallback dòng 523** |
| `src/components/journey/JourneyDocumentsTab.tsx` | `STEP_NAME_MAPPING` và `JOURNEY_STEP_SORT_ORDER` đúng |
| `src/pages/shared/JourneySteps/Step03Survey.tsx` | Dùng `'site_survey'` (code mới, đúng) |

---

## Kiểm tra Deprecated Interfaces

Các interface cũ được giữ lại trong `customerJourneySetting.types.ts` (dòng 60–72) chỉ là type aliases:

```ts
export interface ILeadIntakeItem extends IStepsItem {}
export interface IQualificationItem extends IStepsItem {}
// ... v.v.
```

**Kết quả rà soát:** Không có file nào trong dự án import hoặc sử dụng các interface này.
→ Có thể **xóa an toàn** sau khi xác nhận không có integration bên ngoài phụ thuộc vào chúng.

---

## Kết quả tìm kiếm string step code cũ

| Step code cũ | Số lần xuất hiện | Ghi chú |
|---|---|---|
| `lead_intake` | **1** | ⚠️ GAP-01 — `Step01Info.tsx:523` |
| `qualification` | 0 | — |
| `survey_planning` | 0 | — |
| `site_survey_step` | 0 | — |
| `survey_review` | 0 | — |
| `estimate_preparation` | 0 | — |
| `quotation_preparation` | 0 | — |
| `quotation_sent` | 0 | — |
| `quotation_approved` | 0 | — |
| `contract_signing` | 0 | — |
| `project_execution` | 0 | — |
| `handover_acceptance` | 3 | ✅ Không liên quan — là field name (`handover_acceptance_id`) trong `handoverIssue.types.ts` |
| `warranty_aftercare` | 0 | — |

---

## Checklist hoàn thiện

- [ ] **[P0 - Bắt buộc]** Sửa fallback `'lead_intake'` → `'lead_new'` tại `Step01Info.tsx:523`
- [ ] **[P2 - Tuỳ chọn]** Xóa các deprecated interface (dòng 60–72) trong `customerJourneySetting.types.ts` nếu không có external dependency
- [ ] **[P3 - Tuỳ chọn]** Bật TypeScript strict mode để kiểm tra lỗi type nếu xóa deprecated interfaces
- [ ] **[P4 - Tài liệu]** Thêm comment giải thích thứ tự 12 step codes trong `StepsStepCodeEnum` tại các nơi định nghĩa sequence

---

*Report được tạo bởi automated audit — 2026-04-11*
