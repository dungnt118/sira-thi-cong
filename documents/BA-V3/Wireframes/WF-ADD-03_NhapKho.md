# WF-ADD-03 – Kế toán: Tạo Phiếu Nhập Kho
**Giải quyết Gap #4 | Sprint 4 (bổ sung) | Actor: Kế toán, Admin**

---

## Mô tả

Kế toán nhập vật tư mới vào kho khi mua hàng về. Tồn kho tự động tăng sau khi phiếu nhập được lưu.

---

## Quy trình nghiệp vụ

```
Actor: Kế toán
  1. Vào Kho → Xuất/Nhập → [+ Phiếu Nhập kho]
  2. Nhập thông tin: Ngày nhập, Nhà cung cấp (optional)
  3. Thêm từng loại vật tư và số lượng nhập
  4. Upload hóa đơn/phiếu giao hàng (optional)
  5. Click [Lưu nhập kho] → Tồn kho tự động + thêm
  6. Hệ thống kiểm tra xem tồn kho mới có giải quyết được cảnh báo không → tắt cảnh báo nếu đủ
```

---

## Wireframe

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Lịch sử Kho          Tạo Phiếu Nhập Kho                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Số phiếu: PN-2026-016 (auto)    Ngày nhập: [📅 15/03/2026]       │
│  Nhà cung cấp: [____________________________] (optional)           │
│                                                                    │
│  VẬT TƯ NHẬP KHO                            [+ Thêm vật tư]      │
│  ──────────────────────────────────────────────────                │
│                                                                    │
│ ┌──────────────────────┬───────────────┬───────────┬─────────────┐ │
│ │ Vật tư               │ SL Nhập       │ Đơn giá   │ Thành tiền  │ │
│ ├──────────────────────┼───────────────┼───────────┼─────────────┤ │
│ │ SIRA PU (lót)        │ [150   ] kg   │ [45,000]  │ 6,750,000  │ │
│ │ [Chọn vật tư ▼]      │               │           │       [🗑] │ │
│ ├──────────────────────┼───────────────┼───────────┼─────────────┤ │
│ │ SIRA PU (phủ)        │ [200   ] kg   │ [48,000]  │ 9,600,000  │ │
│ │ [Chọn vật tư ▼]      │               │           │       [🗑] │ │
│ └──────────────────────┴───────────────┴───────────┴─────────────┘ │
│                                                                    │
│  Tổng giá trị nhập: 16,350,000 VNĐ                                │
│                                                                    │
│  Tồn kho sau khi nhập:                                             │
│  SIRA PU lót:  12 + 150 = 162 kg ✅                               │
│  SIRA PU phủ:   3 + 200 = 203 kg ✅ (cảnh báo được giải quyết)   │
│                                                                    │
│  Hóa đơn / Phiếu giao hàng:                                       │
│  [📎 Upload hóa đơn] (JPG, PDF – optional)                        │
│                                                                    │
│  Ghi chú: [_______________________________________________]        │
│  ──────────────────────────────────────────────────────────────   │
│  [Hủy]                              [💾 Lưu nhập kho]            │
└────────────────────────────────────────────────────────────────────┘
```

---

## States sau khi Lưu

```
✅ Toast: "Nhập kho thành công – Tồn kho đã được cập nhật"
→ Redirect về WF-20 (Dashboard Kho)
→ Cảnh báo đỏ SIRA PU phủ tự động tắt vì đã ≥ 5 kg ngưỡng
```
