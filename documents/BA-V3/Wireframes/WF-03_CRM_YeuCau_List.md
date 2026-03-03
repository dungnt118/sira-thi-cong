# WF-03 – Danh sách Yêu cầu Dịch vụ (Service Requests List)
**Sprint 2 | Actor: PM, Admin**

---

## Mô tả Màn hình
Màn hình dạng Bảng (Table List) hiển thị toàn bộ **Yêu cầu Dịch vụ (Deals)** đang chạy hoặc đã đóng trong hệ thống.
Đây là góc nhìn danh sách dành cho việc quản lý hàng loạt (bulk actions/filters) thay cho góc nhìn Kanban.

---

## Wireframe

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  Danh sách Yêu cầu Dịch vụ (Deals)                     [+ Tạo Yêu Cầu]   │
│  [Góc nhìn: 📋 Danh sách | 📊 Kanban]  ← Chuyển đổi sang WF-04          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔍 [Tìm tên Yêu cầu...]  [Pipeline ▼] [Trạng thái ▼] [PM phụ trách ▼]  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  MÃ YC   │ TÊN YÊU CẦU            │ KHÁCH HÀNG  │ PIPELINE / BƯỚC│  │
│  ├──────────┼────────────────────────┼─────────────┼────────────────┤  │
│  │ YC-001   │ Chống thấm mái nhà kho │ Cty CP ABC  │ B2B            │  │
│  │          │ Ngày tạo: 15/05/2026   │ 0923456789  │ 🟢 Đã ký HĐ    │  │
│  │          │                                          [Chi tiết YC]│  │
│  ├──────────┼────────────────────────┼─────────────┼────────────────┤  │
│  │ YC-002   │ Xử lý thấm sàn WC      │ Nguyễn A    │ Khách Lẻ       │  │
│  │          │ Ngày tạo: 16/05/2026   │ 0901234567  │ 🟡 Chờ duyệt BG│  │
│  │          │                                          [Chi tiết YC]│  │
│  ├──────────┼────────────────────────┼─────────────┼────────────────┤  │
│  │ YC-003   │ Cải tạo ban công       │ Trần B      │ Khách Lẻ       │  │
│  │          │ Ngày tạo: 17/05/2026   │ 0912345678  │ 🔵 Đang Khảo sát│  │
│  │          │                                          [Chi tiết YC]│  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Hiển thị: 20 ▼  |  Trang 1/3  [← Trước]  [Sau →]                        │
└──────────────────────────────────────────────────────────────────────────┘
```

## Form Tạo Yêu Cầu Nhanh (Modal)
Khi nhấn **[+ Tạo Yêu Cầu]**:
```text
┌──────────────────────────────────────────────┐
│  Tạo Yêu cầu Dịch vụ mới                     │
│  ────────────────────────────────────────    │
│  1. Khách hàng:                              │
│  [ Tìm/Chọn Khách hàng có sẵn (hoặc + Tạo) ▼]│
│                                              │
│  2. Tên Yêu cầu (Bắt buộc):                  │
│  [VD: Chống thấm mái nhà...]                 │
│                                              │
│  3. Hành trình (Pipeline):                   │
│  [ Khách Lẻ ▼ ]  Bước: [ Lead Mới ▼ ]        │
│                                              │
│  [Hủy]                        [Tạo Yêu Cầu]  │
└──────────────────────────────────────────────┘
```
