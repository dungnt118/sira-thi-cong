# ESTIMATE & QUOTATION FLOW — TÀI LIỆU LIÊN KẾT TOÀN DIỆN
> Cập nhật: 2026-04-13 | Tham chiếu: SCHEMA-ANALYSIS-20260412.md, OPTION3-FRONTEND-IMPLEMENTATION-PLAN.md

---

## 1. MỤC TIÊU CỦA TÀI LIỆU NÀY

Tài liệu này giải quyết câu hỏi: **dữ liệu nào trên Journey → đi vào đâu → ảnh hưởng thế nào đến bảng Dự toán (JourneyEstimate) → rồi sinh ra Báo giá (Quotation) như thế nào?**

Bao gồm:
- Mapping field Journey ↔ trigger_key của ScenarioRule
- Luồng runtime tính giá từ đầu đến cuối
- Trách nhiệm từng màn hình UI (Step01, Step04, Step05)
- Ràng buộc nghiệp vụ và validation rules
- Các điểm gap còn tồn tại

---

## 2. SƠ ĐỒ TỔNG THỂ (POLICY-FIRST FLOW)

```
[Journey]
    ↓ 3 input bắt buộc: service_type_id, area_m2, execution_days
    ↓ + complexity_level (optional nhưng ảnh hưởng factor)
    ↓
[EstimatePricingPolicy] ← hệ thống chọn policy phù hợp theo service_type + scale_type
    ↓ quote_suggestion_rule: tính recommended_quote_value
    ↓ scenario_rules: điều chỉnh quote nếu gặp điều kiện đặc thù
    ↓ allocation_policy: phân bổ 9 bucket từ quote value
    ↓ labor_policy: chi tiết bucket 02
    ↓ profit_policy: validate bucket 09
    ↓
[JourneyEstimate] ← snapshot giao dịch, source of truth nội bộ
    ↓ standardized_buckets (9 bucket chuẩn)
    ↓ labor_breakdown (4 thành phần của bucket 02)
    ↓ direct_cost_groups (expand EstimateTemplate → direct cost)
    ↓ validation_result (is_feasible, actual_profit_pct, warning_codes)
    ↓ [khi status = approved]
    ↓
[Quotation + QuotationLineItem] ← output công bố cho khách hàng
```

---

## 3. JOURNEY FIELDS → INPUT CHO ESTIMATE ENGINE

### 3.1 Ba trường bắt buộc (Minimal Input)

| Field trên Journey | Kiểu | Vai trò trong engine | UI hiện tại |
|---|---|---|---|
| `service_type_id` | ref → MasterDataItem | Chọn EstimatePricingPolicy đúng loại dịch vụ. Chọn EstimateTemplate phù hợp. | JourneyForm → **cần Select**, hiện đang là Input thô (GAP - cần sửa theo A1) |
| `area_m2` | number (m²) | Nhân với `base_quote_rate_m2` trong quote_suggestion_rule để ra quote gốc. Nhân với `quantity_per_unit` trong template components. | JourneyForm → InputNumber (đã có theo plan A1) |
| `execution_days` | number (ngày) | Tính `internal_fixed_salary` trong bucket 02: `salary_monthly × execution_days / working_days_per_month`. Ảnh hưởng `duration_factor`. | JourneyForm → InputNumber (đã có theo plan A1) |

### 3.2 Trường bổ sung ảnh hưởng đến scenario evaluation

| Field trên Journey | trigger_key tương ứng | Ghi chú |
|---|---|---|
| `complexity_level` | → `work_complexity` trong scenario | Giá trị: simple / medium / complex / extreme |
| `address.province_code` | → `province_code` hoặc `region_type` | Backend cần resolve province_code → region_type (urban/provincial) |
| `floor_level` *(cần thêm)* | → `floor_level` | Hiện chưa có trên Journey schema — GAP |
| `time_shift` *(cần thêm)* | → `time_shift` | Ca thi công ngày/đêm — GAP |
| `access_difficulty` *(cần thêm)* | → `access_difficulty` | Mức khó tiếp cận — có thể lấy từ SurveyRecord |
| `customer.customer_type` | → `customer_type` | Lấy từ Customer linked với Journey |

---

## 4. TRIGGER_KEY — ĐẶC TẢ CHUẨN VÀ MAPPING RUNTIME

### 4.1 Quy tắc đánh giá ScenarioRule

Tại runtime (backend evaluate), với mỗi kịch bản:
```
IF journey_context[trigger_key] <operator> compare_value THEN
  apply effect_type với effect_value% lên recommended_quote_value
```

`journey_context` là object được backend tổng hợp từ:
- Journey fields trực tiếp
- Customer fields liên kết
- SurveyRecord fields (nếu đã có)
- Computed fields (region_type từ province_code)

### 4.2 Bảng trigger_key chuẩn — nguồn dữ liệu runtime

| trigger_key | Nguồn dữ liệu runtime | Kiểu giá trị | Toán tử hợp lệ | Ví dụ compare_value |
|---|---|---|---|---|
| `region_type` | Computed từ `journey.address.province_code` → lookup bảng tỉnh thành | enum: `urban` / `provincial` / `remote` | `==`, `!=` | `provincial` |
| `province_code` | `journey.address.province_code` | string (mã tỉnh VN) | `==`, `!=` | `HCM`, `HNI` |
| `floor_level` | `journey.floor_level` *(cần thêm vào Journey)* | number (tầng) | `==`, `>`, `<`, `>=`, `<=` | `5` |
| `time_shift` | `journey.time_shift` *(cần thêm vào Journey)* | enum: `day` / `night` / `mixed` | `==`, `!=` | `night` |
| `access_difficulty` | `survey_record.access_difficulty` hoặc `journey.access_difficulty` | enum: `easy` / `medium` / `hard` | `==`, `!=` | `hard` |
| `work_area_m2` | `journey.area_m2` | number | `>`, `<`, `>=`, `<=` | `30` |
| `project_type` | Derived từ `journey.service_type_id` → category | enum: `residential` / `commercial` / `industrial` / `maintenance` | `==`, `!=` | `commercial` |
| `contract_duration_days` | `journey.execution_days` | number | `>`, `<`, `>=`, `<=` | `90` |
| `customer_type` | `journey.customer.customer_type` | enum: `individual` / `enterprise` / `strategic_partner` | `==`, `!=` | `enterprise` |
| `material_transport_km` | `journey.address` → compute distance từ kho gần nhất | number (km) | `>`, `>=` | `50` |
| `special_material` | `journey.has_special_material` *(cần thêm)* | boolean: `true` / `false` | `==` | `true` |
| `work_complexity` | `journey.complexity_level` | enum: `simple` / `medium` / `complex` / `extreme` | `==`, `!=` | `complex` |

### 4.3 Thứ tự áp dụng scenario_rules

Khi nhiều rule cùng match:
1. Tất cả rule `increase_pct` và `decrease_pct` được cộng dồn (không nhân chồng).
2. Rule `warning_only` chỉ ghi log, không đổi giá.
3. `adjusted_quote = recommended_quote_value × (1 + Σ effect_pct / 100)`
4. `adjusted_quote` phải ≥ `final_quote_floor` từ profit validation.

---

## 5. ESTMATEPRICINGPOLICY → 9 BUCKET ALLOCATION

### 5.1 Công thức tính quote gốc

```
recommended_quote_value = area_m2
  × base_quote_rate_m2
  × scale_factor
  × complexity_factor
  × duration_factor
  [× scenario_adjustments]
```

### 5.2 Allocation 9 bucket từ recommended_quote_value (Q)

| Bucket | Code | Công thức | Nguồn rate |
|---|---|---|---|
| 01 | `01_materials` | Từ template expand (không dùng % của Q) | EstimateTemplate.components[type=material] |
| 02 | `02_labor_total` | outsource + internal_salary + tech_commission + supervisor_commission | labor_policy + template |
| 03 | `03_warranty_maintenance` | `warranty_rate × Q` | allocation_policy.warranty_rate |
| 04 | `04_risk` | `risk_rate × Q` | allocation_policy.risk_rate |
| 05 | `05_corporate_tax` | `tax_rate × Q` | allocation_policy.tax_rate |
| 06 | `06_sales_cost` | `sales_cost_rate × Q` | allocation_policy.sales_cost_rate |
| 07 | `07_management_cost` | `mgmt_rate × Q` | allocation_policy.mgmt_rate |
| 08 | `08_hidden_cost` | `hidden_cost_rate × Q` | allocation_policy.hidden_cost_rate |
| 09 | `09_profit` | `Q - Σ(bucket 01..08)` | profit_policy.target_profit_pct_min (validate only) |

### 5.3 Chi tiết bucket 02 — Labor Breakdown

```
outsource_labor       = Σ template.components[type=labor].quantity_expanded × unit_price
internal_fixed_salary = (internal_salary_monthly) × execution_days / working_days_per_month
technical_commission  = technical_commission_pct × Q
supervisor_commission = supervisor_commission_pct × Q
──────────────────────────────────────────────────────
labor_total           = Σ 4 thành phần trên
```

---

## 6. TRÁCH NHIỆM TỪNG MÀN HÌNH UI

### Step01 — Thông tin & Readiness

**Đọc từ:** Journey (view mode)
**Ghi vào:** Journey (edit mode)

| Nhiệm vụ | Chi tiết |
|---|---|
| Hiển thị 4 field estimate-input | service_type_id (title), area_m2, execution_days, complexity_level |
| Readiness banner | ✅ Sẵn sàng lập dự toán (đủ 3 field bắt buộc) / ⚠️ Còn thiếu: [danh sách field] |
| CTA khi thiếu | "Chỉnh sửa ngay" → mở edit mode Step01 |
| Sau khi save | JourneyDetail360 invalidate và refresh readiness → Step04 badge cập nhật |

**Validation rules:**
- `service_type_id`: required, phải là ref hợp lệ (không phải text thô)
- `area_m2`: required, > 0, số thực
- `execution_days`: required, > 0, số nguyên
- `complexity_level`: optional

### Step04 — Dự toán nội bộ (JourneyEstimate)

**Đọc từ:** JourneyEstimate (latest theo journey_id)
**Ghi/Action vào:** JourneyEstimate qua API actions

| State | UI hiển thị | Action khả dụng |
|---|---|---|
| Step01 chưa đủ input | Empty state + hướng dẫn + link về Step01 | — |
| Chưa có JourneyEstimate | CTA "Khởi tạo dự toán" | Tạo draft |
| status = `draft` | Hiển thị đầy đủ 6 block, editable | Tính lại, Lưu nháp, Trình duyệt |
| status = `reviewing` | Read-only + badge "Đang duyệt" | — (chờ PM cấp trên) |
| status = `approved` | Read-only + badge "Đã duyệt" | Tạo báo giá |
| status = `superseded` | Read-only + badge "Đã thay thế" | Xem lịch sử |

**6 block hiển thị trong Step04:**
1. **Journey Input Snapshot** — service_type_id title, area_m2, execution_days, complexity_level
2. **Pricing Policy Snapshot** — tên policy, phiên bản, các rate đã áp dụng
3. **Quote Derivation** — công thức tính, recommended_quote_value, adjusted_quote, final_quote_floor
4. **Standardized Buckets** — bảng 9 dòng bucket, highlight bucket 09_profit, màu đỏ nếu profit < min
5. **Labor Breakdown** — 4 thành phần của bucket 02 dạng detail card
6. **Direct Cost Groups** — expand từ EstimateTemplate → vật tư, nhân công theo từng hạng mục
7. **Validation Result** — is_feasible, actual_profit_pct, danh sách warning_codes

### Step05 — Báo giá (Quotation)

**Đọc từ:** Quotation + QuotationLineItem (linked với approved JourneyEstimate)
**Ghi/Action:** tạo Quotation từ approved JourneyEstimate

| State | UI hiển thị | Action |
|---|---|---|
| Chưa có approved JourneyEstimate | Blocked state + link về Step04 | — |
| Có approved estimate, chưa tạo quote | CTA "Tạo báo giá" | Generate |
| Quote đã tạo | Quote summary + line items + subtotal/VAT/total | Xem, tải PDF |
| Estimate bị superseded sau khi quote tạo | ⚠️ Banner "Báo giá đang dùng dự toán cũ" | Xem, cập nhật |

**UI components của Step05:**
- Header: Mã báo giá, ngày tạo, trạng thái, badge nguồn (JourneyEstimate vX)
- Line items: public-facing items (không lộ breakdown nội bộ)
- Footer: Subtotal, VAT (%), Grand Total
- Ghi chú thương mại, điều khoản thanh toán

---

## 7. GATING RULES — JOURNEY DETAIL 360

| Condition | Step04 badge | Step05 badge |
|---|---|---|
| Step01 chưa đủ input | `missing_input` (đỏ) | `blocked` (xám) |
| Step01 đủ input, chưa có estimate | `ready` (xanh nhạt) | `blocked` (xám) |
| Estimate status = draft | `draft` (cam) | `blocked` (xám) |
| Estimate status = reviewing | `reviewing` (xanh nhạt) | `blocked` (xám) |
| Estimate status = approved | `approved` (xanh) | `ready_to_generate` (xanh nhạt) |
| Quote đã tạo, estimate còn valid | `approved` | `quote_created` (xanh) |
| Quote đã tạo, estimate bị superseded | `superseded` | `out_of_date` (đỏ cam) |

---

## 8. GAP PHÂN TÍCH — CÁC ĐIỂM CHƯA LIÊN KẾT

### 8.1 Gap về Journey Schema (cần bổ sung)

| Field | Tại sao cần | Ảnh hưởng nếu thiếu |
|---|---|---|
| `floor_level` | trigger_key phổ biến nhất trong xây dựng | Scenario "tầng cao" không evaluate được |
| `time_shift` | Ca đêm là phụ phí phổ biến | Scenario "ca đêm" không evaluate được |
| `access_difficulty` | Ảnh hưởng chi phí logistics | Hoặc lấy từ SurveyRecord nếu đã có |
| `has_special_material` | Vật liệu đặc chủng | Scenario "vật liệu đặc biệt" không evaluate được |

### 8.2 Gap về Backend API (cần bổ sung để Step04/Step05 hoạt động đầy đủ)

| Action | Endpoint cần có | Hiện trạng |
|---|---|---|
| Khởi tạo draft estimate | `POST /journey-estimates/create-draft` | Chưa có (chỉ có CRUD thô) |
| Tính lại estimate | `POST /journey-estimates/:id/recalculate` | Chưa có |
| Trình duyệt | `POST /journey-estimates/:id/submit-review` | Chưa có |
| Phê duyệt | `POST /journey-estimates/:id/approve` | Chưa có |
| Tạo báo giá từ estimate | `POST /journey-estimates/:id/generate-quotation` | Chưa có |
| Evaluate scenario rules | Phần của recalculate, backend đảm nhiệm | Chưa có |

### 8.3 Gap về trigger_key evaluation

Hiện tại trigger_key được lưu trên `EstimatePricingPolicy.scenario_rules` nhưng backend **chưa có engine evaluate** chúng. Cần:
1. Backend build `journey_context` object từ Journey + Customer + SurveyRecord
2. Backend iterate qua `scenario_rules`, evaluate từng rule
3. Backend compute `adjusted_quote = base_quote × (1 + Σ matched_effects)`

### 8.4 Gap về ServiceType lookup

`service_type_id` trên JourneyForm hiện nhập text thô → cần:
- Dùng `MasterDataItem` API với `category = "service_type"`
- UI dùng Select/Autocomplete thay cho Input

---

## 9. ĐỀ XUẤT THỨ TỰ XỬ LÝ ĐỂ CÓ FLOW HOẠT ĐỘNG

### Phase 1 — Dữ liệu đầu vào (tuần 1)
1. Sửa JourneyForm: `service_type_id` → Select từ MasterDataItem
2. Thêm `area_m2`, `execution_days`, `complexity_level` vào JourneyForm + Step01Info
3. Thêm readiness banner vào Step01 view mode
4. Gating Step04/Step05 badge cơ bản trên JourneyDetail360

### Phase 2 — Policy & Scenario config (tuần 1-2)
5. Backend implement `create-draft` từ journey_id + auto-select policy
6. Backend implement `recalculate` với 9 bucket calculation
7. Backend implement scenario_rules evaluation engine
8. Frontend Step04: load và hiển thị 6 block từ JourneyEstimate thật

### Phase 3 — Approval & Quote (tuần 2-3)
9. Backend implement `submit-review`, `approve`
10. Backend implement `generate-quotation` từ approved estimate
11. Frontend Step05: load Quotation thật, hiển thị line items
12. Badge gating hoàn chỉnh (superseded, out_of_date)

### Phase 4 — Cleanup (tuần 3)
13. Xóa mock data khỏi Step04, Step05
14. Grep và loại bỏ toàn bộ usage của `JourneyEstimate.groups` legacy
15. Regression test TC01→TC10

---

## 10. TRIGGER_KEY VÀ POLICY FIELD — BẢNG THAM CHIẾU NHANH CHO DEV

```
EstimatePricingPolicy
├── quote_suggestion_rule
│   ├── pricing_strategy          # rate_factor | banded_rate | manual_formula
│   ├── base_quote_rate_m2        # đơn giá m² cơ sở
│   ├── scale_factor              # hệ số quy mô (Journey.area_m2 → scale_type)
│   ├── complexity_factor         # hệ số phức tạp (Journey.complexity_level)
│   └── duration_factor           # hệ số tiến độ (Journey.execution_days)
│
├── scenario_rules[]
│   ├── trigger_key               # xem bảng 4.2
│   ├── operator                  # ==, !=, >, <, >=, <=
│   ├── compare_value             # giá trị ngưỡng
│   ├── effect_type               # increase_pct | decrease_pct | warning_only
│   ├── effect_value              # % điều chỉnh
│   └── note                      # giải trình
│
├── allocation_policy
│   ├── warranty_rate             # bucket 03 = rate × Q
│   ├── risk_rate                 # bucket 04 = rate × Q
│   ├── tax_rate                  # bucket 05 = rate × Q
│   ├── sales_cost_rate           # bucket 06 = rate × Q
│   ├── mgmt_rate                 # bucket 07 = rate × Q
│   └── hidden_cost_rate          # bucket 08 = rate × Q
│
├── labor_policy
│   ├── internal_salary_monthly   # lương nội bộ/tháng → bucket 02
│   ├── technical_commission_pct  # % hoa hồng kỹ thuật × Q → bucket 02
│   └── supervisor_commission_pct # % hoa hồng giám sát × Q → bucket 02
│
└── profit_policy
    ├── target_profit_pct_min     # ngưỡng tối thiểu để validate bucket 09
    ├── target_profit_pct_max     # ngưỡng tối đa
    └── warning_threshold_pct     # cảnh báo khi profit < ngưỡng này
```

---

## 11. CHECKLIST TÍCH HỢP — AI/DEV TỰ KIỂM TRA

- [ ] `service_type_id` trên JourneyForm dùng Select, không phải Input text
- [ ] `area_m2` và `execution_days` có mặt trên Journey schema và JourneyForm
- [ ] Step01 view mode hiển thị readiness banner với đúng logic 3 field bắt buộc
- [ ] Step04 không import bất kỳ mock data nào
- [ ] Step04 hiển thị đúng 9 bucket (không có subtotal/tax legacy)
- [ ] Step04 disabled khi Step01 chưa đủ input
- [ ] trigger_key được evaluate bởi backend (không tính ở client)
- [ ] Sau khi scenario evaluation, `adjusted_quote` được lưu vào JourneyEstimate
- [ ] Step05 chỉ active khi có `JourneyEstimate.status = approved`
- [ ] Quote có badge truy xuất về JourneyEstimate version nguồn
- [ ] Khi estimate bị superseded, Step05 hiển thị cảnh báo `out_of_date`
