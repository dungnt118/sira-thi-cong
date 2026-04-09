# THIẾT KẾ CHỨC NĂNG (FDD) - GIAO DIỆN THIẾT LẬP WORKFLOW JOURNEY MỞ RỘNG
**Module:** PM (Project Manager)
**Đường dẫn:** `/ql/journeys/templates` & `/ql/journeys/templates/:id`
**Tác giả:** BACBA Team
**Phiên bản:** v4.0

## 1. MỤC ĐÍCH
Tài liệu này mô tả chi tiết giao diện người dùng (UI) và tính năng (UX) cho phần thiết lập cấu trúc Lõi của một Công trình Khách hàng. Đây là nền tảng để quyết định AI/System sẽ render Component nào và tự động giao task cho Role nào trong toàn bộ ứng dụng BAC.

---

## 2. DANH SÁCH TÍNH NĂNG (FEATURES LIST)

### 2.1. Quản lý danh sách Template (`/ql/journeys/templates`)
- **Hiển thị danh sách:** Liệt kê các bộ khung Công trình.
- **Tính năng Công trình Chuẩn (Set Active Standard):** 
  - Thêm một tuỳ chọn / Nút gạt (Toggle) đánh dấu 1 template là "Công trình Chuẩn Đang Áp Dụng".
  - **Quy tắc:** Chỉ 1 Công trình được Active tại 1 thời điểm. Tất cả ticket tạo mới sẽ áp dụng quy trình này (Ticket cũ giữ phiên bản công trình lúc được tạo).
- **Tạo mới / Sao chép Template:** Tái sử dụng form cũ để tăng tốc thiết lập.

### 2.2. Màn hình Chi tiết Template (`/ql/journeys/templates/:id`)
*Giao diện bên trái là Cây các Bước (Step List).*
- **Actions cho từng Bước:**
  - Ở bản trước chưa có, nay bổ sung cặp nút Action (Hover): **Chỉnh sửa** (Edit Icon) và **Xóa** (Trash Icon).
  - Có thể Kéo - Thả (Drag & Drop) để sắp xếp lại thứ tự Bước nếu cần thiết (Tính năng nâng cao Phase 2).

### 2.3. Popup: Thêm mới / Cập nhật Bước (Step Modal Config)
Đây là màn hình lõi bị thay đổi nhiều nhất, chuyển từ thiết lập tuyến tính sang thiết lập "Đa Vai Trò" (Sub-workflow).

**[PHẦN 1] THÔNG TIN CHUNG CỦA BƯỚC**
- **Tên Bước** & **Mã Step**.
- **Mục tiêu Bước**.
- *(MỚI)* **Nhóm Quy trình Chuẩn (Standard Component Group):** 
  - Select Box (Dropdown List) 14 lựa chọn: `Liên hệ/Tư vấn`, `Khảo sát`, `Xây dựng giải pháp`, v.v...
  - Tooltip: *"Lựa chọn nhóm này sẽ quyết định bộ Form Component nào tự động xuất hiện lúc người dùng vào làm việc ở bước này."*

**[PHẦN 2] SUB-WORKFLOW THEO VAI TRÒ (MULTI-ROLES CONFIGURATION)**
Thay đổi form Vai trò (Role) từ cấu hình tĩnh sang danh sách động (Dynamic Form/Field Array).
- **[Button] + Thêm Vai trò tham gia**
  - Khi click chèn thêm 1 Khối (Block) tương ứng với 1 Role.

**Chi tiết 1 Khối Role:**
- **Chọn Role:** (Tuỳ chọn: Kỹ thuật, Sale, Kế toán...).
- **Vai trò chủ chốt (Key Contact):** Nút Checkbox hoặc Radio (Chỉ 1 vai trò được làm Key cho toàn Bước, chịu trách nhiệm báo cáo cuối cùng).
- **SLA Riêng (Giờ):** TextBox/Number (Ví dụ Kỹ thuật là 24h, Sale 12h báo giá lại).
- **Trình tự / Handover:**
  - Chọn `Bắt đầu ngay lập tức`.
  - Hoặc chọn `Chờ Role [A] hoàn tất khối của họ`.
- **Mô tả chi tiết nhiêm vụ:** Textbox hướng dẫn để hiển thị cho Role đó trên màn hình Ticket.
- **Checklist Bắt buộc (Bảng động):**
  - Liệt kê các gạch đầu dòng công việc Role này phải Check xong mới được chuyển trạng thái. 
  - *Ví dụ thêm:* (1) Ra file bản vẽ; (2) Liệt kê số thiết bị. Nút [+ Thêm công việc] bên dưới Bảng.
  - Phía góc phải trên Block này có Nút X (Xóa Role khỏi bước).

**[PHẦN 3] THIẾT LẬP KẾT THÚC BƯỚC**
- **SLA Tổng Của Bước:** (Readonly - Bằng Role có SLA Handover lớn nhất cộng dồn, hoặc bằng cảnh báo chung).
- **Điều kiện Chuyển Bước:** Textbox hoặc Checkbox (Yêu cầu tất cả Role Check xong Checklist).
- **Publish lên Portal:** Toggle (Có / Không).

---

## 3. UI MOCKUP / WIREFRAME (Mô phỏng Giao diện Component Role Config)

```wireframe
[ + Thêm bước mới ] ---------------------------------------- X
|
| Mã Bước: [ TBL-04             ] Tên: [ Xây dựng GIải Pháp    ]
| Nhóm Quy Trình: [ 4. Xây dựng Giải pháp (Kỹ thuật + Sale)  v ]
|
|----------------- CẤU HÌNH VAI TRÒ THAM GIA -------------------|
|
| [Block Vai Trò 1: Kỹ Thuật]                           [ Xoá ]
| Trách nhiệm chính: ( )  | SLA: [ 24 ] giờ
| Bắt đầu khi: [ Vào Bước ]
| Hướng dẫn: [Lên báo cáo khảo sát và dự toán chi phí     ]
| Checklist bắt buộc:
| - [x] Đưa giải pháp từng vị trí   [xoá]
| - [x] Đưa số lượng thiết bị       [xoá]
| - [x] Đưa số lượng nhân sự        [xoá]
| [+ Thêm Task]
|---------------------------------------------------------------|
|
| [Block Vai Trò 2: Sale]                               [ Xoá ]
| Trách nhiệm chính: (x)  | SLA: [ 12 ] giờ
| Bắt đầu khi: [ Chờ Vai Trò 1 (Kỹ Thuật) báo xong ]
| Hướng dẫn: [Tổng hợp báo giá và Process gửi KH          ]
| Checklist bắt buộc:
| - [x] Chốt file tổng gửi khách qua Zalo [xoá]
| [+ Thêm Task]
|---------------------------------------------------------------|
|
| [+ Thêm Vai Trò Nữa ]
|
|---------------------------------------------------------------|
| [ ] Publish lên Portal
|                                         [ Huỷ ] [ Lưu Bước ]
----------------------------------------------------------------
```

## 4. IMPACT VỚI LỚP DATA MODEL (ĐƯA VÀO BACKEND ENGINE)
**Journey Step Model cũ:** `roles: ["PM", "Sale"]`, `sla: 24`, `checklists: ["Task 1", "Task 2"]`.
**Journey Step Model mới:** 
```json
{
  "stepCode": "TBL-04",
  "name": "Xây dựng Giải pháp",
  "standardProcedureGroupCd": "GRP_04_SOLUTION",
  "isPortalPublished": false,
  "roleConfigurations": [
    {
      "roleId": "technical",
      "isKeyRole": false,
      "slaHours": 24,
      "dependencyRole": null,
      "instructions": "Lên báo cáo...",
      "checklists": ["Giài pháp vị trí", "Thiết bị", "Nhân sự"]
    },
    {
      "roleId": "sale",
      "isKeyRole": true,
      "slaHours": 12,
      "dependencyRole": "technical",
      "instructions": "Tổng hợp báo giá...",
      "checklists": ["Gửi Zalo file báo giá"]
    }
  ]
}
```
