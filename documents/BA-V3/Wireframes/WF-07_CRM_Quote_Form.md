# WF-07 – Form Lập Báo giá (Quote Form)
**Sprint 2 | Actor: PM**

---

## Mô tả Màn hình
Form cho phép PM tạo và cấu hình một Báo giá (Quotation version) cho **một Yêu cầu Dịch vụ (Deal)**.

---

## Wireframe

```text
┌────────────────────────────────────────────────────────────────────┐
│  ← Quay lại Chi tiết Yêu cầu (YC-2026-001)                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  TẠO BÁO GIÁ MỚI                                                  │
│  ──────────────────────────────────────────────────                │
│                                                                    │
│  Yêu cầu Dịch vụ: YC-2026-001 - Chống thấm mái tồn Q2              │
│  Khách hàng: Nguyễn Văn A [Bấm xem hồ sơ KH]                       │
│  Diện tích thi công: 120 m² (Lấy từ dữ liệu Khảo sát)              │
│                                                                    │
│  HẠNG MỤC THI CÔNG                       [+ Thêm hạng mục]       │
│  ──────────────────────────────────────────────────                │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  #  │ Hạng mục         │ ĐVT │ SL   │ Đơn giá │ Thành tiền│   │
│  ├─────┼──────────────────┼─────┼──────┼─────────┼───────────┤   │
│  │  1  │ Mài sàn bê tông  │ m²  │ 120  │ 30,000  │ 3,600,000 │   │
│  │     │                  │     │      │         │      [🗑️] │   │
│  ├─────┼──────────────────┼─────┼──────┼─────────┼───────────┤   │
│  │  2  │ Phủ SIRA PU (lót)│ kg  │ 180  │ 45,000  │ 8,100,000 │   │
│  │     │ 120m² × 1.5kg/m² │     │(auto)│         │      [🗑️] │   │
│  ├─────┼──────────────────┼─────┼──────┼─────────┼───────────┤   │
│  │  3  │ Phủ SIRA PU (top)│ kg  │ 240  │ 48,000  │ 11,520,000│   │
│  │     │ 120m² × 2kg/m²   │     │(auto)│         │      [🗑️] │   │
│  ├─────┴──────────────────┴─────┴──────┴─────────┴───────────┤   │
│  │                                    Tạm tính: 23,220,000   │   │
│  │   Chiết khấu: [___] % hoặc [________] vnđ                 │   │
│  │                                    Chiết khấu: -220,000   │   │
│  │                              TỔNG CỘNG: 23,000,000 VNĐ    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  KẾ HOẠCH TÀI CHÍNH (ĐỢT THANH TOÁN)                              │
│  ──────────────────────────────────────────────────                │
│  Đợt 1 (50%): 11,500,000 VNĐ  – Khi ký hợp đồng                 │
│  Đợt 2 (40%):  9,200,000 VNĐ  – Khi hoàn thành thi công          │
│  Đợt 3 (10%):  2,300,000 VNĐ  – Sau nghiệm thu                    │
│                                                                    │
│  ──────────────────────────────────────────────────────────────   │
│  [Hủy]   [📄 Xem trước PDF]   [🔗 Gửi Link KH]  [💾 Lưu Báo giá]   │
└────────────────────────────────────────────────────────────────────┘
```

## Giải thích Flow
- 1 Yêu cầu Dịch vụ có thể có N phiên bản báo giá (V1, V2, V3 do thương lượng).
- Khi PM click lưu, báo giá mới được tạo ra và lưu vào Tab "Các Báo giá" của WF-05_ServiceRequest_Detail.
- Khi Khách hàng CHỐT bản báo giá nào, PM sẽ đánh dấu `Mark As Won` bản báo giá đó. Hệ thống sẽ tự động đổi Trạng thái Deal sang Mapped Won-Stage và gen ra Project.
