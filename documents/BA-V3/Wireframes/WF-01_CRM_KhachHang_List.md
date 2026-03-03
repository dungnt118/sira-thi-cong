# WF-01 – Danh sách Khách hàng Gốc (Customer Hub)
**Sprint 2 | Actor: PM, Admin**

---

## Mô tả Màn hình
Màn hình quản lý danh sách **Khách hàng (Customer)**.
Khách hàng là thực thể độc lập, chứa thông tin cá nhân/doanh nghiệp. Một Khách hàng có thể tạo ra nhiều **Yêu cầu Dịch vụ (Deal)** và nhiều **Dự án thi công**.
Màn hình này KHÔNG quản lý tiến độ bán hàng (Pipeline), mà chỉ quản lý Data Khách hàng gốc.

---

## Wireframe

```text
┌────────────────────────────────────────────────────────────────────┐
│  Danh sách Khách hàng                             [+ Thêm Khách Hàng]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  🔍 [Tìm tên KH, Số điện thoại...]  [Phân loại ▼]  [Nhóm KH ▼]      │
│                                                                    │
│  ┌─ THỐNG KÊ DATA KHÁCH HÀNG ────────────────────────────────────┐   │
│  │  [👥 Tổng KH: 1,024]  [🏢 KH Doanh nghiệp: 45]               │   │
│  │  [⭐ KH VIP: 12]       [🆕 KH Mới tháng này: 30]             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  #  │ TÊN KHÁCH HÀNG    │ SĐT        │ TỔNG YÊU CẦU │ DOANH THU │
│  ├─────┼───────────────────┼────────────┼──────────────┼──────────┤
│  │  1  │ Nguyễn Văn A      │ 0901234567 │ 2 Yêu cầu    │ 250 Tr   │
│  │     │ 📍 Q1, TP.HCM     │            │              │          │
│  │     │                         [Xem hồ sơ] [Tạo YC Dịch Vụ]   │
│  ├─────┼───────────────────┼────────────┼──────────────┼──────────┤
│  │  2  │ Trần Thị B        │ 0912345678 │ 1 Yêu cầu    │ 0đ       │
│  │     │ 📍 Q2, TP.HCM     │            │              │          │
│  │     │                         [Xem hồ sơ] [Tạo YC Dịch Vụ]   │
│  ├─────┼───────────────────┼────────────┼──────────────┼──────────┤
│  │  3  │ Cty CP ABC        │ 0923456789 │ 5 Yêu cầu    │ 1.2 Tỷ   │
│  │     │ 📍 Bình Dương     │            │              │          │
│  │     │                         [Xem hồ sơ] [Tạo YC Dịch Vụ]   │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Hiển thị: 20 ▼  |  Trang 1/5  [← Trước]  [Sau →]                  │
└────────────────────────────────────────────────────────────────────┘
```

## Giải thích Flow
- Nút **[+ Thêm Khách Hàng]**: Chỉ hiển thị form nhập Tên, SĐT, Email, Nhóm KH. KHÔNG tạo Ticket Khảo sát hay Báo giá nào tại đây.
- Nút **[Xem hồ sơ]**: Chuyển sang WF-02 (Chi tiết Khách hàng).
- Nút **[Tạo YC Dịch vụ]**: Tạo một Service Request mới gắn liền với Khách hàng này và chuyển hướng thẳng vào Tab Khảo sát của YC đó.
