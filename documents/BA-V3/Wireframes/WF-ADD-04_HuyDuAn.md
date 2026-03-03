# WF-ADD-04 – Flow Hủy Dự án Giữa chừng
**Giải quyết Gap #7 | Sprint 3 (bổ sung) | Actor: PM, Admin**

---

## Mô tả

Xử lý tình huống PM hoặc Admin cần hủy một dự án đang thi công. Hệ thống cần xử lý: lịch sử checklist, ảnh bằng chứng, và trạng thái vật tư đã xuất.

---

## Business Rules – Cancel Dự án

```
BR-CANCEL-01: Chỉ Admin và PM phụ trách mới có thể hủy dự án
BR-CANCEL-02: Dự án đã COMPLETED không thể hủy (chỉ có thể Archive)
BR-CANCEL-03: Khi hủy, toàn bộ checklist progress được GIỮ LẠI (lịch sử)
BR-CANCEL-04: Ảnh/video đã upload KHÔNG bị xóa (lưu kho lịch sử)
BR-CANCEL-05: Phiếu vật tư đã ký nhận → Xem xét hoàn kho thủ công (hệ thống KHÔNG tự hoàn)
BR-CANCEL-06: Phiếu vật tư CHƯA ký nhận → Tự động HỦY phiếu, tồn kho không bị trừ
BR-CANCEL-07: Bắt buộc nhập lý do hủy (min 20 ký tự)
BR-CANCEL-08: KH ở pipeline sẽ được chuyển về trạng thái "Đã ký HĐ" (không xóa KH)
```

---

## Quy trình nghiệp vụ

```
Actor: PM
  1. PM vào Chi tiết dự án → Click [⋮ Menu] → [🚫 Hủy dự án]
  2. Hệ thống hiển thị cảnh báo và thông tin tổng kết
  3. PM nhập lý do hủy
  4. PM tick xác nhận "Tôi hiểu rằng..."
  5. PM click [Xác nhận hủy]
  6. Hệ thống:
     a. Cập nhật trạng thái dự án = CANCELLED
     b. Tự động HỦY các phiếu vật tư chưa thợ ký
     c. GIỮ LẠI phiếu đã ký (vật tư đã xuất thực tế)
     d. Thông báo cho thợ: "DA-001 đã bị hủy"
     e. Ghi nhật ký audit
  7. KH pipeline: chuyển về "Đã ký HĐ" để PM có thể reassign dự án mới
```

---

## Wireframe – Confirm Dialog Hủy

```
┌──────────────────────────────────────────────────────────────┐
│  🚫 Hủy Dự án DA-001                              [✕ Đóng]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ⚠️ CẢNH BÁO: Hành động này KHÔNG THỂ HOÀN TÁC             │
│                                                              │
│  TÓM TẮT TRẠNG THÁI DỰ ÁN HIỆN TẠI:                        │
│  ─────────────────────────────────────                       │
│  Tiến độ:      11 / 18 bước (61%) đã hoàn thành             │
│  Thợ phụ trách: Thợ Trần C                                   │
│  Vật tư đã xuất (đã ký): SIRA PU lót 12 kg, Primer 50 lít  │
│  Vật tư chưa ký: (không có)                                  │
│  Đợt thanh toán: Đợt 1 đã thu 10,000,000 VNĐ               │
│  ─────────────────────────────────────                       │
│                                                              │
│  KẾT QUẢ KHI HỦY:                                          │
│  ✅ Lịch sử checklist & ảnh được giữ lại                    │
│  ✅ KH về pipeline: "Đã ký HĐ" (chưa xóa)                   │
│  ⚠️ Vật tư đã xuất (đã ký) KHÔNG tự hoàn – cần xử lý thủ công│
│  ℹ️ Đợt tiền đã thu cần xử lý hoàn tiền thủ công            │
│                                                              │
│  Lý do hủy * (bắt buộc, ít nhất 20 ký tự):                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ KH dừng dự án do khó khăn tài chính, thỏa thuận...    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ☐ Tôi hiểu rằng dự án sẽ bị hủy và không thể khôi phục   │
│                                                              │
│  [Quay lại]               [🚫 Xác nhận Hủy Dự án]          │  
│                           ← Chỉ active khi đã tick & nhập lý do│
└──────────────────────────────────────────────────────────────┘
```

---

## Trạng thái Dự án sau Cancel

```
┌──────────────────────────────────────────────────────────────┐
│  DA-001: Nguyễn Văn A                 ❌ ĐÃ HỦY              │
│  Lý do: KH dừng dự án do khó khăn tài chính                 │
│  Hủy bởi: PM Nguyễn | 15/03/2026 14:30                      │
│                                                              │
│  [👁 Xem lịch sử & Ảnh]  [🔄 Tạo DA mới cho KH này]        │
└──────────────────────────────────────────────────────────────┘
```
