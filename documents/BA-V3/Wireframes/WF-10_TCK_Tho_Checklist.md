# WF-10 – Thợ: Checklist Thi công (Khóa bước – Core Feature)
**Sprint 3 | Tuần 5-6 | Actor: Thợ thi công (Mobile-first)**

---

## Mô tả Màn hình

**Đây là màn hình CORE quan trọng nhất của toàn hệ thống.**

Thợ thực hiện từng bước thi công theo checklist tiêu chuẩn. Bước sau bị KHÓA cho đến khi bước trước được hoàn thành (có ảnh + tick xác nhận). PM giám sát realtime từ xa.

---

## Business Rules tại màn hình này

- **BR-TCK-01**: Phải upload ít nhất 1 ảnh/video TRƯỚC khi tick bước hoàn thành
- **BR-TCK-02**: Bước N+1 bị KHÓA (hiển thị 🔒) nếu bước N chưa completed
- **BR-TCK-03**: Server tự gán timestamp, thợ KHÔNG thể sửa
- **BR-TCK-04**: Chỉ khi 100% bước hoàn thành → PM mới có thể "Complete" dự án

---

## Quy trình nghiệp vụ

```
Actor: Thợ
Flow một bước thi công:
  1. Thợ mở dự án → Tab "Checklist"
  2. Thợ thấy danh sách bước, bước hiện tại đang mở (các bước trước đã ✅)
  3. Thợ đọc mô tả bước → Thực hiện công việc
  4. Thợ click [📷 Chụp/Upload ảnh] → Ảnh được upload
  5. Sau khi có ảnh → Nút [✅ Xác nhận hoàn thành bước này] mới ACTIVE
  6. Thợ click [✅ Xác nhận] → Bước đánh dấu ✅
  7. Bước tiếp theo tự động MỞ KHÓA
  8. PM nhận notification: "Thợ C vừa hoàn thành Bước 11"

Actor: PM (Giám sát)
  - PM thấy realtime trong WF-12 bước nào đang được làm
  - PM thấy ảnh vừa upload ngay lập tức
```

---

## Wireframe – Mobile (Thợ)

```
┌─────────────────────────────────────────┐
│  ← DA-001: Nguyễn Văn A                │
│  📋 Checklist     ████████░░ 61% (11/18)│
├─────────────────────────────────────────┤
│                                         │
│  ✅ 1. Kiểm tra bề mặt                 │  ← Completed
│     📷 2 ảnh  |  ✅ 08/03 09:15        │
│                                         │
│  ✅ 2. Bảo vệ khu vực xung quanh      │  ← Completed
│     📷 1 ảnh  |  ✅ 08/03 09:45        │
│                                         │
│  ✅ 3. Mài sàn (lần 1)                │  ← Completed
│     📷 3 ảnh  +  🎥 1 video            │
│     ✅ 08/03 11:20                      │
│                                         │
│  ··· (các bước đã xong ẩn/collapsed)   │
│                                         │
│  ╔═══════════════════════════════════╗  │
│  ║  🔨 BƯỚC ĐANG LÀM                ║  │
│  ╠═══════════════════════════════════╣  │
│  ║  Bước 12: Chờ khô – Kiểm tra    ║  │
│  ║  bề mặt sau khi quét lớp 1       ║  │
│  ║                                   ║  │
│  ║  📋 Hướng dẫn:                   ║  │
│  ║  Sau khi quét SIRA PU lần 1,     ║  │
│  ║  chờ tối thiểu 4h trước khi      ║  │
│  ║  quét tiếp. Kiểm tra bề mặt      ║  │
│  ║  không bị phồng rộp.              ║  │
│  ║                                   ║  │
│  ║  📸 ẢNH BẰ CHỨNG (bắt buộc)     ║  │
│  ║  ┌───────┐ ┌───────┐ ┌────────┐  ║  │
│  ║  │[IMG1] │ │[IMG2] │ │  📷 +  │  ║  │
│  ║  │10:30  │ │10:45  │ │Upload  │  ║  │
│  ║  └───────┘ └───────┘ └────────┘  ║  │
│  ║  Đã có 2 ảnh ✓                   ║  │
│  ║                                   ║  │
│  ║  Ghi chú (optional):              ║  │
│  ║  [Bề mặt đều, không phồng...]    ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │   ✅ XÁC NHẬN HOÀN THÀNH   │  ║  │  ← Active vì có ảnh
│  ║  └─────────────────────────────┘  ║  │
│  ╚═══════════════════════════════════╝  │
│                                         │
│  🔒 13. Quét SIRA PU lớp phủ lần 1    │  ← LOCKED
│      Hoàn thành bước 12 để mở khóa    │
│                                         │
│  🔒 14. Chờ khô...                     │  ← LOCKED
│  🔒 15. Quét SIRA PU lớp phủ lần 2    │  ← LOCKED
│  🔒 16. Kiểm tra tổng thể – Test nước  │  ← LOCKED
│  🔒 17. Hoàn thiện & vệ sinh          │  ← LOCKED
│  🔒 18. Nghiệm thu – Chụp ảnh AFTER  │  ← LOCKED
│                                         │
└─────────────────────────────────────────┘
```

---

## States của các bước

```
✅ COMPLETED    – Có ảnh + đã tick, hiển thị màu xanh lá, có timestamp
🔨 CURRENT      – Bước đang làm, highlight nổi bật (frame vàng/cam)
🔒 LOCKED       – Chưa mở được, mờ, có icon khóa
⚠️ REJECTED     – PM đã reject ảnh, cần upload lại, hiển thị màu đỏ
```

---

## Interaction Chi tiết

| Action | Trạng thái | Mô tả |
|--------|-----------|-------|
| Click bước LOCKED | Hiển thị toast | "Hoàn thành bước {N} để mở khóa bước này" |
| Click [📷 Upload] | Mở camera/picker | Camera auto hoặc file picker |
| Upload thành công | Ảnh thumbnail xuất hiện | Nút "✅ Xác nhận" chuyển active |
| Click "✅ Xác nhận" khi chưa có ảnh | Button disabled + tooltip | "Cần upload ít nhất 1 ảnh trước" |
| Confirm thành công | Bước = ✅, bước tiếp = 🔨 | Animation unlock effect |
| Mất mạng khi upload | Retry queue | "Đang chờ kết nối để upload..." |

---

## Confirmation Dialog

```
┌─────────────────────────────────────────┐
│  Xác nhận hoàn thành bước 12?           │
│                                         │
│  Bước: "Chờ khô – Kiểm tra bề mặt"    │
│  Ảnh đã upload: 2 ảnh ✓                │
│  Thời gian: 15/03/2026 10:45           │
│  (Thời gian này do hệ thống ghi, không │
│   thể thay đổi sau khi xác nhận)       │
│                                         │
│  [Hủy]              [✅ Xác nhận]      │
└─────────────────────────────────────────┘
```
