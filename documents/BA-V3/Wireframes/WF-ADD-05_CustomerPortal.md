# WF-ADD-05 – Customer Portal (Portal Khách hàng)
**Đưa vào First Stage (theo yêu cầu PM) | Sprint 6 bổ sung | Actor: Khách hàng (Passive), PM**

---

## Phân tích so sánh BA-V2 vs BA-V3 First Stage

### Tính năng Customer Portal trong BA-V2 (đã có):
- ✅ UC-PM-11: Generate Portal Link (BASIC / FULL)
- ✅ Token-based, QR code, Copy link
- ✅ PM có thể revoke link
- ⚠️ **Nội dung KH xem được** chưa được wireframe chi tiết trong BA-V2

### Điều chỉnh cho First Stage (V3):
- Chỉ 1 access level: **VIEW-ONLY** (không cần BASIC/FULL phức tạp ở First Stage)
- KH xem được: Tiến độ checklist (%), Ảnh APPROVED, Đợt thanh toán
- KH KHÔNG thấy: Thông tin nội bộ, chi phí vật tư, lương thợ
- Link có thể hết hạn (PM tự chọn: Vĩnh viễn / 30 ngày / 90 ngày)

---

## Quy trình nghiệp vụ

```
Actor: PM
  1. PM vào Chi tiết dự án → Tab "Portal KH"
  2. PM click [Tạo link chia sẻ]
  3. PM chọn hạn sử dụng: Vĩnh viễn | 30 ngày | 90 ngày
  4. Hệ thống tạo link: https://dltech.vn/portal/{token}
  5. PM copy link → Gửi cho KH qua Zalo/SMS
  6. PM có thể Revoke link bất kỳ lúc nào

Actor: Khách hàng
  1. KH nhận link từ PM qua Zalo/SMS
  2. KH click link → Mở browser (KHÔNG cần đăng nhập)
  3. KH xem trang Portal (trình bày đẹp, dễ hiểu)
  4. KH thấy: Tiến độ thi công, ảnh evidence APPROVED, lịch thanh toán
```

---

## WF-ADD-05-A: PM Tạo Portal Link

```
┌────────────────────────────────────────────────────────────────────┐
│  DA-001  [Tổng quan] [Checklist] [Thanh toán] [Portal KH●] [Sự cố]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  PORTAL KHÁCH HÀNG                                                 │
│  ─────────────────────────────────────────────────────────────    │
│                                                                    │
│  Trạng thái: 🟢 Link đang active                                   │
│                                                                    │
│  Link active:                                                      │
│  https://dltech.vn/portal/a1b2c3d4e5f6...                         │
│  [📋 Copy link]  [📱 Hiện QR Code]  [🔗 Mở thử]                 │
│                                                                    │
│  Tạo: 10/03/2026 | Hết hạn: 10/06/2026 (90 ngày)                │
│  Lần truy cập cuối: 14/03/2026 (KH đã xem 3 lần)                │
│                                                                    │
│  [🔄 Tạo link mới]         [❌ Thu hồi link]                     │
│                                                                    │
│  ─────────────────────────────────────────────────────────────    │
│                                │                                   │
│  Modal Tạo Link Mới:           │                                   │
│  ┌─────────────────────────┐   │                                   │
│  │ Hạn sử dụng:            │   │                                   │
│  │ ○ Vĩnh viễn             │   │                                   │
│  │ ● 90 ngày               │   │                                   │
│  │ ○ 30 ngày               │   │                                   │
│  │ [Tạo link]              │   │                                   │
│  └─────────────────────────┘   │                                   │
└────────────────────────────────────────────────────────────────────┘
```

---

## WF-ADD-05-B: Trang Portal Khách hàng (Public – Không cần login)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🏗️ DL TECH – LẠM BẮC GROUP          [logo]                       │
│  Công trình của bạn đang được theo dõi minh bạch                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  👋 Kính chào Anh/Chị Nguyễn Văn A                                 │
│  Công trình: Chống thấm tầng 3 – 123 Đường ABC, Q1                 │
│  PM phụ trách: PM Nguyễn | 📞 0901-234-567                         │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  📊 TIẾN ĐỘ THI CÔNG                                          │  │
│  │  ████████████░░░░░░  61%                                       │  │
│  │  Bước 11 / 18 đã hoàn thành                                  │  │
│  │  Dự kiến hoàn thành: 22/03/2026 (còn 5 ngày)                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  🔄 NHẬT KÝ TIẾN ĐỘ                                                │
│  ────────────────────────────────────────────────────              │
│  ✅ 13/03  Bước 11: Quét SIRA PU lót lần 2  [📷 2 ảnh]           │
│  ✅ 12/03  Bước 10: Chờ khô – Kiểm tra      [📷 1 ảnh]           │
│  ✅ 11/03  Bước 9: Quét SIRA PU lót lần 1   [📷 3 ảnh]           │
│  [Xem thêm...]                                                     │
│                                                                     │
│  📸 ẢNH THI CÔNG (ảnh đã được PM duyệt)                           │
│  ────────────────────────────────────────────────────              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────┐            │
│  │IMG 1 │ │IMG 2 │ │IMG 3 │ │IMG 4 │ │ Xem tất cả  │            │
│  │Bước 9│ │Bước 9│ │B.10  │ │B.11  │ │  (34 ảnh)    │            │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────────────┘            │
│                                                                     │
│  💰 LỊCH THANH TOÁN                                                │
│  ────────────────────────────────────────────────────              │
│  ✅ Đợt 1 (50%): 10,000,000 VNĐ – Đã thanh toán 15/03            │
│  ⏳ Đợt 2 (40%):  8,000,000 VNĐ – Thanh toán khi hoàn thành TC   │
│  ⏳ Đợt 3 (10%):  2,000,000 VNĐ – Thanh toán sau nghiệm thu       │
│                                                                     │
│  📋 THÔNG TIN BẢO HÀNH                                            │
│  ────────────────────────────────────────────────────              │
│  Thời hạn bảo hành: 24 tháng (kể từ ngày nghiệm thu)              │
│  Vật liệu: SIRA PU – Tiêu chuẩn chống thấm SIRA                  │
│                                                                     │
│  ─────────────────────────────────────────────────────────────    │
│  📞 Liên hệ hỗ trợ: 0900-000-000 | info@dltech.vn                │
│                  🏗️ DL TECH – LẠM BẮC GROUP                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## QR Code Modal (PM share cho KH scan)

```
┌──────────────────────────────────────┐
│  QR Code – Portal DA-001            │
│  ─────────────────────────────────  │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │      [ QR CODE IMAGE ]         │  │
│  │                                │  │
│  │  dltech.vn/portal/a1b2c3...   │  │
│  └────────────────────────────────┘  │
│  KH chụp ảnh hoặc scan để truy cập │
│  [📥 Tải QR xuống] [📋 Copy link]   │
└──────────────────────────────────────┘
```

---

## So sánh với BA-V2 – Điểm cần bổ sung

| Tính năng | BA-V2 có? | BA-V3 First Stage |
|-----------|-----------|------------------|
| Generate Link (BASIC/FULL) | ✅ | Đơn giản hóa: 1 level VIEW-ONLY |
| Token/QR Code | ✅ | ✅ Giữ nguyên |
| Revoke Link | ✅ | ✅ Giữ nguyên |
| **Nội dung KH thấy – Tiến độ %** | ⚠️ Chưa có WF | ✅ WF mới này |
| **Nội dung KH thấy – Ảnh APPROVED** | ⚠️ Chưa có WF | ✅ WF mới này |
| **Nội dung KH thấy – Lịch TT** | ⚠️ Chưa có WF | ✅ WF mới này |
| **Thống kê lần truy cập** | ❌ Không có | ✅ Bổ sung thêm |
| Login KH (tài khoản) | Phức tạp | ❌ DEFER – Dùng token link |
