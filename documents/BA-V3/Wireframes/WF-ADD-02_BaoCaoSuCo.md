# WF-ADD-02 – Thợ: Báo cáo Sự cố Thi công
**Giải quyết Gap #3 (Critical) | Sprint 3 (bổ sung) | Actor: Thợ thi công (Mobile-first)**

---

## Mô tả

Thợ có thể báo cáo nhanh một sự cố hoặc vấn đề phát sinh trong quá trình thi công. PM nhận notification ngay lập tức và có thể xử lý từ xa.

---

## Quy trình nghiệp vụ

```
Actor: Thợ
Trigger: Thợ gặp vấn đề trong quá trình thi công

Flow:
  1. Thợ đang ở WF-10 (Checklist) hoặc WF-09 (Home)
  2. Thợ nhấn nút [⚠️ Báo sự cố] (nút CTA nổi bật ở góc dưới màn hình)
  3. Thợ chọn loại sự cố và mô tả
  4. Thợ có thể upload ảnh minh họa
  5. Thợ gửi → PM nhận notification ngay
  6. PM xem sự cố trong tab "Nhật ký" của dự án
  7. PM có thể phản hồi (comment) hoặc gọi điện cho thợ
  8. Thợ nhận phản hồi của PM (in-app notification)

Business Rules:
  - Thợ có thể báo sự cố bất kỳ lúc nào (không cần đang ở bước nào)
  - Sự cố KHÔNG block checklist → Thợ vẫn làm được bước tiếp theo (trừ block do vật tư)
  - PM có thể đánh dấu sự cố là "Đã xử lý" để đóng báo cáo
```

---

## Wireframe – Button Trigger (Floating)

```
┌─────────────────────────────────────────┐
│  ← DA-001: Checklist                    │
│  [Các bước checklist...]                │
│                                         │
│                                         │
│                                         │
│                          ┌───────────┐  │
│                          │ ⚠️ Báo sự │  │  ← FAB nổi góc phải
│                          │   cố      │  │     màu cam/đỏ
│                          └───────────┘  │
└─────────────────────────────────────────┘
```

---

## Wireframe – Form Báo cáo Sự cố (Bottom Sheet / Fullscreen Mobile)

```
┌─────────────────────────────────────────┐
│  ⚠️ Báo cáo Sự cố                       │
│  DA-001 | Bước 12 đang thực hiện        │
│  ─────────────────────────────────────  │
│                                         │
│  Loại sự cố *                           │
│  ┌───────────────────────────────────┐  │
│  │  ○ 📦 Thiếu / Hết vật tư         │  │
│  │  ○ 🏗️ Sự cố kỹ thuật bề mặt      │  │
│  │  ○ 🌧️ Thời tiết (mưa, ẩm cao)    │  │
│  │  ○ 🔧 Hỏng hóc dụng cụ           │  │
│  │  ○ 🚫 Sự cố an toàn lao động     │  │
│  │  ○ 📋 Khác                        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Mô tả chi tiết *                       │
│  ┌───────────────────────────────────┐  │
│  │ SIRA PU phủ đã hết, chỉ còn 1 kg,│  │
│  │ không đủ để quét hết 100m²...     │  │
│  └───────────────────────────────────┘  │
│                                         │
│  📸 Ảnh minh họa (optional):           │
│  ┌────────────┐ ┌────────────────────┐  │
│  │  [IMG1]    │ │   📷 Thêm ảnh      │  │
│  └────────────┘ └────────────────────┘  │
│                                         │
│  Mức độ khẩn cấp:                       │
│  ○ Bình thường  ● Khẩn cấp!            │
│                                         │
│  ─────────────────────────────────────  │
│  [Hủy]      [📤 Gửi báo cáo cho PM]   │
└─────────────────────────────────────────┘
```

---

## Wireframe – PM Xem Sự cố (trong Nhật ký Dự án)

```
┌────────────────────────────────────────────────────────────────────┐
│  DA-001: Nguyễn Văn A    [Checklist] [Sự cố (1⚠️)] [Nhật ký]     │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ⚠️ SỰ CỐ ĐANG MỞ                                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  📦 Thiếu vật tư – Khẩn cấp!                                 │  │
│  │  Thợ Trần C | 15/03/2026 10:50                               │  │
│  │                                                               │  │
│  │  "SIRA PU phủ đã hết, chỉ còn 1 kg, không đủ để quét        │  │
│  │   hết 100m². Cần bổ sung gấp."                               │  │
│  │                                                               │  │
│  │  [IMG1 – Ảnh thùng vật tư còn lại]                          │  │
│  │                                                               │  │
│  │  Liên quan đến: Bước 13 – SIRA PU phủ lần 1                 │  │
│  │                                                               │  │
│  │  Phản hồi của PM:                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │  [Nhập phản hồi cho thợ...]                          │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │                                          [Gửi] [✅ Đã xử lý]│  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Notification PM nhận được

```
🔔 [DA-001] Sự cố khẩn cấp!
Thợ Trần C báo: Thiếu vật tư SIRA PU phủ
Đang ở Bước 12 / 18
→ [Xem và xử lý]
```
