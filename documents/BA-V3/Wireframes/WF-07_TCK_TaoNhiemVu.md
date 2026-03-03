# WF-07 – Tạo Dự án Thi công (từ KH)
**Sprint 3 | Tuần 5-6 | Actor: PM**

---

## Mô tả Màn hình

PM tạo dự án thi công cho KH đã ký HĐ. Hệ thống pre-fill thông tin từ hồ sơ KH (địa chỉ, diện tích). PM chọn loại thi công, template checklist và giao việc cho thợ.

---

## Quy trình nghiệp vụ

```
Actor: PM
Pre-condition: KH đã ở trạng thái "Đã ký HĐ"

Flow:
  1. PM click "Tạo dự án" từ WF-05/WF-06
  2. Form pre-fill từ dữ liệu KH:
     - Tên KH, địa chỉ, GPS, diện tích
  3. PM nhập thêm:
     - Tên dự án
     - Loại thi công (chống thấm loại nào)
     - Ngày bắt đầu / kết thúc dự kiến
     - Template checklist (mặc định: SIRA Standard)
  4. PM chọn Thợ phụ trách (assign 1 hoặc nhiều thợ)
  5. PM nhập ghi chú nội bộ (optional)
  6. PM click [Tạo dự án]
  7. Hệ thống tạo:
     - Dự án với trạng thái "Scheduled"
     - Checklist các bước từ template
     - Payment Milestones 3 đợt (50%-40%-10%) ← Linked từ Báo giá (Gap #6)
     - Notification cho thợ được giao
  8. Redirect → Chi tiết dự án (WF-12)

  ✅ [GAP #9 – ĐÃ XÁC NHẬN] Block bước nếu thiếu vật tư:
  → Checklist chỉ mở đến bước thứ N nếu Phiếu Xuất Kho đã được THỰC HIỆN
  → Nếu Kế toán CHƯA tạo phiếu xuất kho cho dự án:
     - Bước 1 checklist hiển thị thông báo: "⚠️ Chờ Kế toán xuất vật tư (PX chưa được ký)"
     - Toàn bộ checklist ở trạng thái LOCKED dạng "chờ vật tư"
  → Sau khi Thợ ký nhận phiếu xuất kho → Bước 1 UNLOCK, thi công được phép
  → Nếu kho thiếu vật tư, Kế toán tạo phiếu số lượng có thể → Thợ vẫn được làm
     với lượng vật tư hiện có, và báo sự cố (WF-ADD-02) khi hết
```

---

## Wireframe

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Chi tiết KH: Nguyễn Văn A        Tạo Dự án Thi công           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  THÔNG TIN DỰ ÁN                                                  │
│  ──────────────────────────────────────────────────                │
│                                                                    │
│  Mã dự án: DA-2026-001 (auto)          Khách hàng: Nguyễn Văn A  │
│                                                                    │
│  Tên dự án *                                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Chống thấm căn hộ tầng 3 - Nguyễn Văn A                  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Địa chỉ *                              Diện tích (m²) *           │
│  ┌─────────────────────────────────┐   ┌──────────────────────┐   │
│  │  Q1, TP.HCM (đã điền từ KH)    │   │  100                  │   │
│  └─────────────────────────────────┘   └──────────────────────┘   │
│  📍 Tọa độ GPS: 10.7769, 106.7009 (từ KH) [🔄 Cập nhật GPS]     │
│                                                                    │
│  Loại hình thi công *                                               │
│  ○ Chống thấm sàn   ○ Chống thấm tường   ○ Chống thấm mái        │
│  ○ Chống thấm nhà vệ sinh   ○ Phức hợp                            │
│                                                                    │
│  Template Checklist *                                               │
│  [SIRA Standard (18 bước)   ▼]   [👁️ Xem trước template]         │
│                                                                    │
│  Thời gian thi công:                                                │
│  Ngày bắt đầu: [📅 15/03/2026]    Ngày KT dự kiến: [📅 22/03/26] │
│                                                                    │
│  PHÂN CÔNG THỢ                                                     │
│  ──────────────────────────────────────────────────                │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🔍 Tìm thợ...                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ ☐ Thợ Nguyễn B  |  📞 091...  |  0 dự án hiện tại   │  │   │
│  │  │ ☑ Thợ Trần C    |  📞 093...  |  1 dự án hiện tại   │  │   │
│  │  │ ☐ Thợ Lê D      |  📞 094...  |  2 dự án hiện tại   │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────┘   │
│  Đã chọn: Thợ Trần C                                               │
│                                                                    │
│  VẬT TƯ DỰ KIẾN (auto-fill từ định mức 100m²)                     │
│  ──────────────────────────────────────────────────                │
│  SIRA PU lót:  150 kg    ✏️                                         │
│  SIRA PU phủ: 200 kg    ✏️                                         │
│  Primer:       50 lít   ✏️                                         │
│  [Xem thêm / Tùy chỉnh vật tư...]                                  │
│                                                                    │
│  GHI CHÚ NỘI BỘ                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  KH yêu cầu thi công cuối tuần, thợ 2 ca sáng chiều...    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ────────────────────────────────────────────────────────────     │
│  [Hủy]                                    [🔨 Tạo dự án]         │
└────────────────────────────────────────────────────────────────────┘
```

### Preview Template Checklist Modal

```
┌─────────────────────────────────────────────────────────┐
│  SIRA Standard – 18 bước thi công      [✕ Đóng]        │
├─────────────────────────────────────────────────────────┤
│  1. Kiểm tra bề mặt & lên kế hoạch                     │
│  2. Bảo vệ khu vực xung quanh                           │
│  3. Mài sàn (lần 1)                                     │
│  4. Vệ sinh bụi sau mài                                 │
│  5. Mài sàn (lần 2 nếu cần)                             │
│  6. Kiểm tra độ ẩm trước thi công                       │
│  7. Quét Primer lần 1                                   │
│  8. Chờ Primer khô (chụp ảnh xác nhận)                  │
│  9. Quét SIRA PU lớp lót lần 1                          │
│  10. Chờ khô – Kiểm tra bề mặt                          │
│  11. Quét SIRA PU lớp lót lần 2                         │
│  12. Chờ khô                                            │
│  13. Quét SIRA PU lớp phủ lần 1                         │
│  14. Chờ khô – Kiểm tra bề mặt                          │
│  15. Quét SIRA PU lớp phủ lần 2                         │
│  16. Kiểm tra tổng thể – Test nước                      │
│  17. Hoàn thiện & vệ sinh công trình                    │
│  18. Nghiệm thu – Chụp ảnh AFTER                        │
│                                                         │
│                            [Dùng template này]          │
└─────────────────────────────────────────────────────────┘
```
