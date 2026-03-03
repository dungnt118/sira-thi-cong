# WF-00 – Foundation: Auth & Shell Layout
**Sprint 1 | Tuần 1-2 | Áp dụng cho: Tất cả Actor**

---

## Mô tả Màn hình

Màn hình nền tảng của toàn hệ thống bao gồm Login Page, Shell Layout (Sidebar + Header) và màn hình User Management. Đây là cơ sở để tất cả module khác hoạt động.

---

## Quy trình nghiệp vụ liên quan

```
Actor: Admin
Flow:
  1. Admin truy cập URL hệ thống
  2. Nhập email + password → Đăng nhập
  3. Hệ thống xác thực → Điều hướng theo role:
     - Admin   → /admin/dashboard
     - PM      → /pm/dashboard
     - Thợ     → /worker/projects
     - Kế toán → /accountant/dashboard
  4. Admin: Quản lý User (tạo, sửa, phân role)
  5. Admin: Đặt lại mật khẩu cho user khác
```

---

## WF-00-A: Màn hình Đăng nhập

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              🏗️ DL TECH MANAGEMENT                         │
│              Lam Bac Group                                  │
│                                                             │
│    ┌────────────────────────────────────────┐              │
│    │  📧  Email hoặc tên đăng nhập          │              │
│    └────────────────────────────────────────┘              │
│                                                             │
│    ┌────────────────────────────────────────┐              │
│    │  🔒  Mật khẩu                          │  👁          │
│    └────────────────────────────────────────┘              │
│                                                             │
│    ☐ Ghi nhớ đăng nhập                                     │
│                                                             │
│    ┌────────────────────────────────────────┐              │
│    │         ĐĂNG NHẬP                      │  ← Primary  │
│    └────────────────────────────────────────┘              │
│                                                             │
│    Quên mật khẩu?                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

States:
- Default: Form trống
- Error: "Sai email hoặc mật khẩu" (màu đỏ, shake animation)
- Loading: Button disabled, spinner
- Success: Redirect theo role
```

---

## WF-00-B: Shell Layout – Admin/PM

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER: [🏗️ DL Tech] ─────────────────── [🔔 3] [👤 Admin] [⚙️]   │
├─────────────────┬────────────────────────────────────────────────────┤
│                 │                                                      │
│  SIDEBAR        │  CONTENT AREA                                        │
│  ─────────────  │                                                      │
│  📊 Dashboard   │  (Nội dung thay đổi theo trang)                     │
│                 │                                                      │
│  👥 Khách hàng  │                                                      │
│  ├ Danh sách    │                                                      │
│  └ Pipeline     │                                                      │
│                 │                                                      │
│  🔨 Dự án      │                                                      │
│  ├ Danh sách    │                                                      │
│  └ Tạo mới      │                                                      │
│                 │                                                      │
│  📦 Kho vật tư  │                                                      │
│  ├ Danh mục     │                                                      │
│  └ Xuất/Nhập    │                                                      │
│                 │                                                      │
│  💰 Tài chính   │                                                      │
│  ├ Dòng tiền    │                                                      │
│  └ Bảo hành     │                                                      │
│                 │                                                      │
│  [Admin only]   │                                                      │
│  👤 Người dùng  │                                                      │
│  📈 Báo cáo     │                                                      │
│                 │                                                      │
└─────────────────┴────────────────────────────────────────────────────┘

Mobile (< 768px): Sidebar collapse → Bottom Navigation Bar
```

---

## WF-00-C: Shell Layout – Thợ thi công (Mobile-first)

```
┌─────────────────────────────────┐
│  [🏗️ DL Tech]       [🔔] [👤]  │  ← Header compact
├─────────────────────────────────┤
│                                 │
│  Xin chào, Anh Thợ! 👋         │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📋 DỰ ÁN ĐANG THI CÔNG  │  │  ← Nổi bật
│  │  Công trình ABC           │  │
│  │  ████████░░░░  60%        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌─────────┐  ┌─────────────┐   │
│  │ 📦 Vật  │  │ 📋 Lịch sử  │   │
│  │  tư     │  │             │   │
│  └─────────┘  └─────────────┘   │
│                                 │
├─────────────────────────────────┤
│  [🏠 Home] [📋 Việc] [📦 Kho] [👤]  │  ← Bottom Nav
└─────────────────────────────────┘
```

---

## WF-00-D: User Management (Admin only)

```
┌────────────────────────────────────────────────────────┐
│  Quản lý Người dùng                    [+ Thêm User]   │
├────────────────────────────────────────────────────────┤
│  🔍 Tìm kiếm...    [Tất cả roles ▼]   [Kích hoạt ▼]  │
├──────┬──────────────┬──────────┬────────┬──────────────┤
│  #   │  Tên         │  Email   │  Role  │  Thao tác    │
├──────┼──────────────┼──────────┼────────┼──────────────┤
│  1   │  Nguyễn PM   │  pm@...  │  PM    │ [Sửa] [🔒]  │
│  2   │  Kế toán A   │  kt@...  │  KT    │ [Sửa] [🔒]  │
│  3   │  Thợ B       │  tho@... │  Thợ   │ [Sửa] [🔒]  │
└──────┴──────────────┴──────────┴────────┴──────────────┘

Modal Thêm/Sửa User:
┌────────────────────────────────────┐
│  Thêm người dùng mới               │
│  ─────────────────────────────     │
│  Họ tên: [________________]        │
│  Email:  [________________]        │
│  SĐT:    [________________]        │
│  Role:   [PM           ▼]          │
│  Mật khẩu tạm: [_________]  🎲   │
│  ─────────────────────────────     │
│  [Hủy]                  [Lưu]      │
└────────────────────────────────────┘
```

---

## States & Interactions

| State | Mô tả |
|-------|-------|
| Loading | Skeleton loader cho content area |
| Notification | Badge đỏ trên chuông, dropdown list |
| Logout | Confirm dialog "Bạn có muốn đăng xuất?" |
| Session Expired | Auto redirect về Login, hiển thị toast |
