# WF-05 – Chi tiết Yêu cầu Dịch vụ (Deal Hub)
**Sprint 2 | Actor: PM**

---

## Mô tả Màn hình
TRUNG TÂM của một Deal. Đây là nơi chứa MỌI THỨ liên quan đến một công trình chưa ký hợp đồng: Thông tin vị trí, Khảo sát đo độ ẩm, Chụp ảnh hiện trạng, Lập Báo giá. Một khi Báo giá được duyệt, Yêu cầu này sẽ sinh ra `Project`.

---

## Wireframe

```text
┌────────────────────────────────────────────────────────────────────┐
│  ← Quay lại (List / Kanban)                                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  💼 YC-2026-001: CHỐNG THẤM MÁI TÔN QUẬN 2                        │
│  Khách hàng: Nguyễn Văn A [Bấm sang K.Hàng] | Trạng thái: ĐANG KS  │
│                                                                    │
│  Hành trình (Pipeline): Khách lẻ                                   │
│  Tiến trình: (MỚI) ──(ĐANG KS●)── (BÁO GIÁ) ── (CHỐT HĐ)           │
│                                                                    │
│  [Đánh dấu Thất Bại]                                               │
├────────────────────────────────────────────────────────────────────┤
│  [Tổng quan YC] [Dữ liệu Khảo sát] [Các Báo giá]                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Tab: Dữ liệu Khảo sát]                                           │
│  (Nội dung khảo sát của riêng Yêu cầu này)                         │
│                                                                    │
│  Diện tích thực tế: 120m²  |  Độ ẩm sàn cao nhất: 85%              │
│  Vị trí định vị: 10.123, 106.456 (Q2, TP.HCM) [Bản đồ GPS]         │
│                                                                    │
│  Ảnh hiện trạng (3 ảnh):                                          │
│  [📷 Tham_Goc_Trai.jpg] [📷 Nut_Giua_San.jpg] [📷 Toan_Canh.jpg]   │
│                                                                    │
│  Ghi chú: Nứt cổ trần diện rộng.                                   │
│                                                                    │
│  [Cập nhật Khảo sát] -> (Mở form WF-06)                           │
│                                                                    │
│  ──────────────────────────────────────────────────────────────    │
│  [Tab: Các Báo giá]                                                │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 📄 BG-001 (02/05/2026) | Tổng: 15,000,000đ | 🔴 Đã Hủy     │   │
│  │ 📄 BG-002 (05/05/2026) | Tổng: 12,000,000đ | 🟡 Chờ Duyệt  │   │
│  │                                 [Tạo Báo giá mới] (WF-07) │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  [✅ Khách chốt Báo giá BG-002 -> Chuyển trạng thái Deal thành WON]│
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```
