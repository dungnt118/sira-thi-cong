# WF-11 – Thợ: Upload Ảnh/Video theo Bước
**Sprint 3 | Tuần 5-6 | Actor: Thợ thi công (Mobile-first)**

---

## Mô tả Màn hình

Panel upload ảnh/video chi tiết, xuất hiện khi thợ click [📷 Upload] trong WF-10. Hỗ trợ chụp trực tiếp hoặc chọn từ thư viện. Timestamp và GPS tự động.

---

## Wireframe (Bottom Sheet – Mobile)

```
┌─────────────────────────────────────────┐
│  ▼ (kéo xuống để đóng)                  │
│  ─────────────────────────────────────  │
│  📸 Upload bằng chứng                   │
│  Bước 12: "Chờ khô – Kiểm tra bề mặt" │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  📷 Chụp ảnh ngay               │  │  ← Camera
│  │  (Nhanh nhất – dùng khi ở CT)   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🖼️ Chọn từ thư viện ảnh        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🎥 Quay video ngắn              │  │
│  │  (Tối đa 60 giây)                │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Preview ảnh đã chọn:                   │
│  ┌──────┐ ┌──────┐ ┌──────────────┐   │
│  │IMG 1 │ │IMG 2 │ │  + Thêm ảnh  │   │
│  │✓     │ │✓     │ │              │   │
│  └──────┘ └──────┘ └──────────────┘   │
│  Nhấn ảnh để xem lớn / xóa            │
│                                         │
│  📍 GPS: Tự động (10.7769, 106.7009)   │
│  ⏰ Thời gian: 15/03/2026 10:45 (auto) │
│  ⚠️ Thời gian do hệ thống ghi lại,    │
│     không thể thay đổi                 │
│                                         │
│  Ghi chú thêm (optional):              │
│  ┌───────────────────────────────────┐  │
│  │  Bề mặt đều, không phồng rộp...   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Progress upload: █████████░ 90%        │
│  "Đang upload ảnh 2/2..."               │
│                                         │
│  [Hủy]          [📤 Upload (2 ảnh)]    │
└─────────────────────────────────────────┘
```

---

## States

| State | Hiển thị |
|-------|---------|
| Đang compress ảnh | "Đang chuẩn bị ảnh..." |
| Đang upload | Progress bar % |
| Upload xong | "✅ 2 ảnh đã lưu" → Bottom sheet đóng |
| Không có mạng | "⚠️ Không có kết nối. Ảnh sẽ được gửi khi có mạng." Queue local |
| File quá lớn | "⚠️ Ảnh quá lớn, đang nén..." (auto compress) |
| Upload lỗi | "❌ Upload thất bại. Thử lại?" [Retry] |

---

## Xác nhận xóa ảnh

```
┌──────────────────────────────┐
│  Xóa ảnh này?                │
│  (Chưa upload, chưa mất)    │
│  [Giữ lại]       [Xóa]      │
└──────────────────────────────┘
```
