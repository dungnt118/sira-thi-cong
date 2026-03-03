# WF-04 – Pipeline Kanban Yêu cầu Dịch vụ
**Sprint 2 | Actor: PM, Admin**

---

## Mô tả Màn hình
Dashboard dạng Kanban phục vụ RIÊNG cho việc luân chuyển các **Yêu cầu Dịch vụ (Deals)**.
Mỗi thẻ (Card) trên cột là một Yêu cầu. Bằng cách tập trung vào Yêu cầu, 1 Khách hàng có thể xuất hiện trên 2 thẻ của 2 cột khác nhau (vì họ có 2 Yêu cầu xử lý song song).

---

## Wireframe

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  Pipeline: [Hành Trình Khách Lẻ ▼]             [Góc nhìn: 📋 List | 📊 Kanban]│
│  [PM phụ trách: Tất cả ▼]    [Tháng: 03/2026 ▼]                            │
├──────────────────┬──────────────────┬──────────────────┬───────────────────┤
│  1. MỚI (1)      │  2. ĐANG KS (2)  │  3. BÁO GIÁ (1)  │  4. CHỐT HĐ (1)   │
├──────────────────┼──────────────────┼──────────────────┼───────────────────┤
│                  │                  │                  │                   │
│  ┌────────────┐  │  ┌────────────┐  │  ┌────────────┐  │  ┌────────────┐   │
│  │ YC Cải tạo │  │  │ Xử lý mốc  │  │  │ Chống thấm │  │  │ Lót gạch   │   │
│  │ phòng tắm  │  │  │ tường hầm   │  │  │ mái (A.Dũng)│  │  │ ban công   │   │
│  │ KH: Anh A  │  │  │ KH: Chú C  │  │  │ KH: Nguyễn D│  │  │ KH: Anh A  │   │
│  │ 15/05/2026 │  │  │ 10/05/2026 │  │  │ 12/05/2026 │  │  │ 01/05/2026 │   │
│  │    [...]   │  │  │ 📸 3 Ảnh    │  │  │ 💰 10.5 Tr  │  │  │ 💰 5 Tr    │   │
│  └────────────┘  │  │    [...]   │  │  │    [...]   │  │  │ [Tạo DA]   │   │
│                  │  └────────────┘  │  └────────────┘  │  │    [...]   │   │
│  ┌────────────┐  │                  │                  │  └────────────┘   │
│  │ + Thêm YC  │  │  ┌────────────┐  │                  │                   │
│  └────────────┘  │  │ Sơn Epoxy  │  │                  │                   │
│                  │  │ KH: Cô B   │  │                  │                   │
│                  │  │ 09/05/2026 │  │                  │                   │
│                  │  │ 📸 1 Ảnh    │  │                  │                   │
│                  │  │    [...]   │  │                  │                   │
│                  │  └────────────┘  │                  │                   │
└──────────────────┴──────────────────┴──────────────────┴───────────────────┘
```

## Đặc điểm kiến trúc Kanban Deal:
- Trên Kanban Board thể hiện rõ **A.Dũng (Anh A)** có 2 thẻ ở 2 cột khác nhau (YC Cải tạo phòng tắm ở bước Mới, YC Lót gạch ban công ở bước Chốt HĐ). Kiến trúc cũ (kèm KH vào Kanban) sẽ không giải quyết được việc này.
- **Hành động trên Thẻ [...]**:
  - `Xem chi tiết Yêu cầu`
  - `Chỉnh sửa Yêu cầu`
  - `Đổi Trạng thái thất bại (LOST)`
  - `Tạo Dự Án` (Chỉ hiện khi cột được cấu hình là WON - VD Cột CHỐT HĐ).
