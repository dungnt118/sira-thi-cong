# WF-02 – Hồ sơ Khách hàng (Customer Profile)
**Sprint 2 | Actor: PM, Admin**

---

## Mô tả Màn hình
Trung tâm thông tin GỐC của một Khách hàng. Thể hiện sự liên kết 1 nhiều: 1 Khách hàng -> N Yêu cầu dịch vụ -> N Dự án thi công.

---

## Wireframe

```text
┌────────────────────────────────────────────────────────────────────┐
│  ← Danh sách KH                                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  🏢 CÔNG TY CP ABC                          [✏️ Sửa Hồ sơ] [...]  │
│  📞 0923456789  |  📧 contact@abc.com  |  ⭐ KH Doanh Nghiệp      │
│  📍 Lô 12A, KCN ABC, Tỉnh Bình Dương                              │
│  🗓️ Ngày tạo: 01/01/2026                                         │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│  [Tổng quan] [Yêu cầu Dịch vụ (5)] [Dự án Thi công (3)]         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Tab: Yêu cầu Dịch vụ]                                           │
│  Liệt kê tất cả Cơ hội/Yêu cầu (Deals) mà KH này từng phát sinh. │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 💼 YC-2026-001: Chống thấm mái nhà kho (01/01/2026)       │   │
│  │ 📌 Pipeline: B2B | 🟢 Stage: ĐÃ CHỐT HĐ                    │   │
│  │ 💰 Giá trị chốt: 150,000,000đ                             │   │
│  │                                         [Xem Chi Tiết YC] │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 💼 YC-2026-005: Xử lý thấm nứt tường bao (15/05/2026)     │   │
│  │ 📌 Pipeline: B2B | 🟡 Stage: ĐANG THƯƠNG LƯỢNG BG          │   │
│  │ 💰 Định giá dự kiến: 45,000,000đ                          │   │
│  │                                         [Xem Chi Tiết YC] │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  [+ Thêm Yêu cầu Dịch vụ mới]                                    │
│                                                                    │
│  ──────────────────────────────────────────────────────────────    │
│  [Tab: Dự án Thi công]                                            │
│  Liệt kê các Dự án được sinh ra từ các Yêu cầu đã chốt.            │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 🔨 DA-001-2026: Chống thấm mái nhà kho                     │   │
│  │ Trạng thái: 🟢 Hoàn thành |  Từ YC: YC-2026-001             │   │
│  │                                         [Vào Quản lý DA]  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Giải thích Flow
- Không có bất kỳ tab Khảo sát hay Báo giá nào ở đây. Nếu PM muốn xem Khảo sát của YC-2026-005, PM bấm **[Xem Chi Tiết YC]** để đi đến WF-05_ServiceRequest_Detail.
- Sự bóc tách rõ ràng: Customer chỉ giữ Profile và List các YC/Dự án.
