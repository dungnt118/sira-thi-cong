# WF-15 ~ WF-17 – Inventory: Danh mục Vật tư & Định mức
**Sprint 4 | Tuần 7-8 | Actor: Admin, Kế toán, PM**

---

## WF-15 – Danh mục Vật tư (Admin/Kế toán)

### Mô tả
Quản lý toàn bộ danh mục vật tư trong kho: Tên, đơn vị tính, đơn giá, tồn kho hiện tại, mức cảnh báo.

### Quy trình nghiệp vụ
```
Actor: Kế toán / Admin
Flow:
  1. Vào menu Kho vật tư → Danh mục
  2. Xem bảng vật tư với tồn kho và cảnh báo
  3. Click [+ Thêm vật tư] → Modal nhập liệu
  4. Khi tồn kho ≤ mức cảnh báo → Hàng hiển thị màu đỏ/cam
```

### Wireframe

```
┌────────────────────────────────────────────────────────────────────┐
│  Danh mục Vật tư                              [+ Thêm vật tư]     │
│  🔍 Tìm vật tư...      [Tất cả loại ▼]       [Xuất Excel]        │
├───────┬────────────────────┬─────┬──────────┬───────────┬─────────┤
│  #    │ Tên vật tư         │ ĐVT │ Đơn giá  │ Tồn kho  │ Cảnh báo│
├───────┼────────────────────┼─────┼──────────┼───────────┼─────────┤
│  1    │ SIRA PU (lót)      │ kg  │ 45,000   │ 12 kg     │ ≤ 5 kg  │
│       │                    │     │          │  ✅ OK     │         │
├───────┼────────────────────┼─────┼──────────┼───────────┼─────────┤
│  2    │ SIRA PU (phủ)      │ kg  │ 48,000   │ 3 kg ⚠️  │ ≤ 5 kg  │
│       │                    │     │          │ 🔴 Thấp!  │         │
├───────┼────────────────────┼─────┼──────────┼───────────┼─────────┤
│  3    │ Primer             │ lít │ 85,000   │ 25 lít    │ ≤ 5 lít │
│       │                    │     │          │  ✅ OK     │         │
├───────┼────────────────────┼─────┼──────────┼───────────┼─────────┤
│  4    │ Chổi sơn           │ cái │ 15,000   │ 8 cái     │ ≤ 2 cái │
│       │                    │     │          │  ✅ OK     │         │
└───────┴────────────────────┴─────┴──────────┴───────────┴─────────┘
```

### Modal Thêm/Sửa Vật tư

```
┌──────────────────────────────────────────────┐
│  Thêm vật tư mới                             │
│  ────────────────────────────────────────    │
│  Tên vật tư: [SIRA PU (lót)            ]    │
│  Đơn vị:    [kg                         ]   │
│  Đơn giá:   [45,000                     ]  VNĐ│
│  Tồn kho:   [0                          ]   │
│  Mức cảnh báo khi tồn ≤: [5            ] kg │
│  ────────────────────────────────────────    │
│  [Hủy]                      [💾 Lưu]       │
└──────────────────────────────────────────────┘
```

---

## WF-16 – Admin: Setup Định mức m²/kg

### Mô tả
Admin cấu hình bảng định mức: cần bao nhiêu kg/lít vật tư cho 1m² thi công theo từng loại hình thi công.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│  Cấu hình Định mức Vật tư                       [Lưu tất cả]    │
│  Loại hình: [Chống thấm sàn  ▼]                                  │
├──────────────────────┬──────────────────────────┬────────────────┤
│  Vật tư              │ Định mức / 1m²            │ Đơn vị        │
├──────────────────────┼──────────────────────────┼────────────────┤
│  SIRA PU (lót)       │  [1.5          ]          │ kg/m²          │
│  SIRA PU (phủ)       │  [2.0          ]          │ kg/m²          │
│  Primer              │  [0.5          ]          │ lít/m²         │
│  Chổi sơn            │  [0.1          ]          │ cái/m²         │
├──────────────────────┴──────────────────────────┴────────────────┤
│  Ví dụ: 100m² → SIRA PU (lót) = 150 kg, SIRA PU (phủ) = 200 kg  │
└──────────────────────────────────────────────────────────────────┘
```

---

## WF-17 – PM: Nhập Định mức Dự án (Auto-calc)

### Mô tả
Khi PM tạo/xem dự án, hệ thống tự tính vật tư dựa trên diện tích và định mức. PM có thể điều chỉnh.

### Quy trình nghiệp vụ
```
Actor: PM
  1. PM nhập diện tích = 100m²
  2. Hệ thống tự tính: 100 × 1.5 = 150 kg SIRA PU lót
  3. PM có thể điều chỉnh số lượng thủ công nếu cần
  4. PM click [Xác nhận định mức] → Lưu vào dự án
  5. Kế toán xem định mức → Tạo phiếu xuất kho
```

### Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│  Định mức Vật tư – DA-001                    [✅ Xác nhận]       │
│  Diện tích: 100 m²    Loại: Chống thấm sàn                       │
├─────────────────────────┬────────────────────┬───────────────────┤
│  Vật tư                 │ Định mức tính        │ Số lượng         │
├─────────────────────────┼────────────────────┼───────────────────┤
│  SIRA PU (lót)          │ 100 × 1.5 = 150 kg  │ [150] kg  ✏️    │
│  SIRA PU (phủ)          │ 100 × 2.0 = 200 kg  │ [200] kg  ✏️    │
│  Primer                 │ 100 × 0.5 =  50 lít │ [50]  lít ✏️    │
│  Chổi sơn               │ 100 × 0.1 =  10 cái │ [10]  cái ✏️    │
├─────────────────────────┴────────────────────┴───────────────────┤
│  ✏️ Các số lượng có thể điều chỉnh thủ công nếu cần             │
│  Tình trạng kho: SIRA PU phủ chỉ còn 3 kg ⚠️ (cần 200 kg!)    │
└──────────────────────────────────────────────────────────────────┘
```
