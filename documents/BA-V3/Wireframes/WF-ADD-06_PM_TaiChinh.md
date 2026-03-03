# WF-ADD-06 – PM: Xem Tài chính Dự án (Simplified View)
**Giải quyết Gap #1 | Sprint 5 (bổ sung) | Actor: PM**

---

## Mô tả

PM xem tổng quan tài chính dự án của mình (không cần quyền Kế toán). PM chỉ xem được dự án mình phụ trách, không xem cross-project như Admin/Kế toán.

---

## Quy trình nghiệp vụ

```
Actor: PM
  1. PM vào Chi tiết dự án → Tab "Thanh toán & Tài chính"
  2. PM xem 3 phần:
     a. Đợt thanh toán (50-40-10) và trạng thái
     b. Tóm tắt doanh thu vs chi phí ước tính
     c. Lịch sử thu tiền (không thấy chi tiết kế toán nội bộ)
  3. PM KHÔNG thể: Confirm thu tiền (chỉ Kế toán), Sửa đơn giá vật tư

Business Rules:
  - PM chỉ xem dự án của mình
  - PM thấy: Tổng HĐ, Đã thu, Còn lại, Chi phí VT ước tính, Margin ước tính
  - PM KHÔNG thấy: Chi tiết sổ sách kế toán, chi phí lương thực tế
```

---

## Wireframe

```
┌────────────────────────────────────────────────────────────────────┐
│  DA-001: Nguyễn Văn A   [Tổng quan][Checklist][Thanh toán●][Portal]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  TÀI CHÍNH DỰ ÁN – Xem tổng quan (View only)                      │
│  ─────────────────────────────────────────────────────────────    │
│                                                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐   │
│  │  💰 GIÁ TRỊ HĐ  │  │  ✅ ĐÃ THU       │  │ ⏳ CÒN LẠI   │   │
│  │  20,000,000 đ   │  │  10,000,000 đ   │  │ 10,000,000 đ │   │
│  │                 │  │  (50%)           │  │  (50%)        │   │
│  └──────────────────┘  └──────────────────┘  └────────────────┘   │
│                                                                    │
│  LỊCH THANH TOÁN                                                   │
│  ─────────────────────────────────────────────────────────────    │
│ ┌──────┬──────────┬──────────────┬─────────────┬────────────────┐  │
│ │ Đợt  │ Tỷ lệ   │ Số tiền      │ Hạn         │ Trạng thái     │  │
│ ├──────┼──────────┼──────────────┼─────────────┼────────────────┤  │
│ │  1   │  50%    │ 10,000,000   │ 15/03/2026  │ ✅ Đã thu      │  │
│ │  2   │  40%    │  8,000,000   │ 22/03/2026  │ ⏳ Chờ thu    │  │
│ │  3   │  10%    │  2,000,000   │ 30/03/2026  │ ⏳ Chờ thu    │  │
│ └──────┴──────────┴──────────────┴─────────────┴────────────────┘  │
│  📌 Kế toán xác nhận việc thu tiền. Liên hệ: Kế toán A            │
│                                                                    │
│  CHI PHÍ VẬT TƯ ƯỚC TÍNH                                          │
│  ─────────────────────────────────────────────────────────────    │
│  Tổng chi phí VT theo định mức: ~5,054,000 VNĐ                    │
│  ────────────────────────────────────────────                      │
│  Margin ước tính (giả sử thu đủ):                                  │
│  20,000,000 – 5,054,000 = 14,946,000 VNĐ (~75%)                  │
│  📌 Đây là ước tính, số liệu chính xác do Kế toán xác nhận        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Phân quyền so sánh

| Tính năng | PM | Kế toán | Admin |
|-----------|----|---------|----|
| Xem thanh toán timeline | ✅ | ✅ | ✅ |
| Confirm thu tiền | ❌ | ✅ | ✅ |
| Xem chi phí VT ước tính | ✅ | ✅ | ✅ |
| Xem chi phí lương thực | ❌ | ✅ | ✅ |
| Xem cross-project report | ❌ | ✅ | ✅ |
| Export báo cáo | ❌ | ✅ | ✅ |
