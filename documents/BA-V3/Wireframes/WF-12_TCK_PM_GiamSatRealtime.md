# WF-12 – PM: Giám sát Tiến độ Realtime
**Sprint 3 | Tuần 5-6 | Actor: PM, Admin**

---

## Mô tả Màn hình

Màn hình chi tiết dự án dành cho PM – hiển thị realtime toàn bộ tiến độ từng bước thi công, ảnh bằng chứng và cho phép PM review từ xa mà không cần có mặt tại công trình.

---

## Quy trình nghiệp vụ

```
Actor: PM
Flow:
  1. PM vào WF-08 → Click vào dự án đang thi công → WF-12
  2. PM thấy:
     - Tổng quan (%, thợ, thời gian còn lại)
     - Timeline từng bước với ảnh
     - Nhật ký hoạt động (ai làm gì lúc mấy giờ)
  3. PM thấy notification realtime khi thợ hoàn thành bước
  4. PM có thể click vào bước → Xem ảnh full size
  5. PM click [Review ảnh] → Chuyển sang WF-13 (Approve/Reject)
```

---

## Wireframe (Desktop)

```
┌───────────────────────────────────────────────────────────────────────┐
│  ← Dự án         DA-001: Nguyễn Văn A – Chống thấm tầng 3           │
│  📍 Q1, TP.HCM   |  Thợ: Trần C   |  ⏰ 15/03 – 22/03 (còn 5 ngày) │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  TIẾN ĐỘ TỔNG QUAN                                                   │
│  ──────────────────────────────────────────────────────              │
│  ████████████░░░░░░░░░  61%   Bước 11/18                             │
│  [🟢 Đúng tiến độ]    Cập nhật: 5 phút trước                        │
│                                                                       │
│  CHECKLIST TIẾN ĐỘ                          [👁️ Review tất cả ảnh]  │
│  ──────────────────────────────────────────────────────              │
│                                                                       │
│  ✅ 1. Kiểm tra bề mặt               08/03 09:15  Trần C  [📷 2]   │
│  ✅ 2. Bảo vệ khu vực                08/03 09:45  Trần C  [📷 1]   │
│  ✅ 3. Mài sàn lần 1                 08/03 11:20  Trần C  [📷 3]   │
│  ✅ 4. Vệ sinh bụi                   08/03 13:00  Trần C  [📷 1]   │
│  ✅ 5. Mài sàn lần 2                 09/03 08:30  Trần C  [📷 2]   │
│  ✅ 6. Kiểm tra độ ẩm               09/03 10:00  Trần C  [📷 1]   │
│  ✅ 7. Quét Primer lần 1            10/03 09:00  Trần C  [📷 2]   │
│  ✅ 8. Chờ Primer khô               10/03 14:00  Trần C  [📷 1]   │
│  ✅ 9. SIRA PU lót lần 1           11/03 09:30  Trần C  [📷 3]   │
│  ✅ 10. Chờ khô lần 1               12/03 09:00  Trần C  [📷 1]   │
│  ✅ 11. SIRA PU lót lần 2          13/03 08:30  Trần C  [📷 2]   │
│                                                                       │
│  🔨 12. Chờ khô – Kiểm tra         ĐANGThực hiện...  Trần C       │
│  🔒 13. SIRA PU phủ lần 1         Chưa mở                           │
│  🔒 14-18. ...                     Chưa mở                           │
│                                                                       │
│  ─────────────────────────────────────────────────────────────────   │
│  NHẬT KÝ HOẠT ĐỘNG                                                    │
│  ─────────────────                                                    │
│  [13/03 08:30]  Thợ Trần C hoàn thành Bước 11 – upload 2 ảnh       │
│  [12/03 09:15]  Thợ Trần C hoàn thành Bước 10 – upload 1 ảnh       │
│  [11/03 08:30]  Thợ Trần C bắt đầu Bước 9                          │
│                                                                       │
│  ─────────────────────────────────────────────────────────────────   │
│  [📩 Gửi nhắc nhở cho thợ]        [✅ Hoàn thành dự án]            │
│                                    ← Chỉ active khi 100% bước xong   │
└───────────────────────────────────────────────────────────────────────┘
```

### Xem ảnh theo bước (expand inline)

```
Click [📷 2] tại Bước 3:
  → Expand row:
  ┌──────────┐ ┌──────────┐
  │  [IMG1]  │ │  [IMG2]  │
  │ 11:05    │ │  11:15   │
  │ ✅Approved│ │ ✅Approved│
  └──────────┘ └──────────┘
  [👁️ Xem full] [🔍 Review tất cả]
```
