# Tổng kết trạng thái xây dựng BA-V4

## 1. Mục tiêu của file này

Đây là file chốt nhanh để dùng khi:

- review vá»›i stakeholder
- giao việc cho team dev
- đối chiếu giữa BA-V4 và codebase hiện tại
- theo dõi các quyết định đã khóa ở vòng review mới nhất

## 2. Những gì BA-V4 đã khóa lại

### 2.1 Nghiệp vụ lõi

- CRM chạy theo `Service Request`, không theo `Customer`
- hỗ trợ cả hai hướng nhập liệu:
  - `Customer -> Service Request`
  - `Service Request -> auto-create Customer`
- `Project` chỉ sinh sau khi request/hợp đồng đủ điều kiện

### 2.2 Actor model

- `Giám sát` là actor số hiện trường ở phase hiện tại
- `Kỹ thuật` chưa có account trực tiếp
- `Kỹ thuật` được quản lý qua `kỹ thuật profile`

### 2.3 Kiến trúc vận hành

- `Module B` được đổi thành `Vận hành nội bộ`
- bổ sung `Stage Playbook`, `Task orchestration`, `Handoff Rule`
- chuẩn hóa liên kết giữa CRM, Project, Inventory, Finance, Warranty

### 2.4 File governance

- file phải có metadata tập trung
- Google Drive là cloud storage layer
- portal không lộ raw Drive link
- có sync queue, retry và audit

### 2.5 Hậu mãi gắn tài chính

- bảo hành/bảo trì không đứng riêng
- phải nhìn được `Aftersales Cost` và `Aftersales Billing`
- KPI/P&L phải phản ánh cả chi phí hậu mãi

## 3. Bộ tài liệu đã hoàn thiện trong vòng review này

| Nhóm tài liệu | File chính |
|---|---|
| BRD và gap | `BRD_v4.md`, `Gap_Register_v4.md`, `Current_State_Assessment_v4.md` |
| Mô hình dữ liệu và module | `ERD_v4.md`, `Module_Architecture_v4.md` |
| File cloud | `File_Storage_GoogleDrive_Strategy_v4.md` |
| Warranty/finance | `Warranty_Finance_Lifecycle_v4.md` |
| Kế hoạch build | `Implementation_Plan_v4.md` |
| Tổng kết coverage | `Coverage_Matrix_v4.md` |
| UAT | `UAT_Backlog_v4.md` |
| Tài liệu theo vai trò | Folder `GiamSat/` và `Kỹ thuật/` đã được làm sạch lại theo baseline má»›i |

## 4. Tỷ lệ ước lượng hiện tại

| Chỉ số | Tỷ lệ |
|---|---:|
| Độ phủ tài liệu BA sau khi clean BA-V4 | 81% |
| Độ phủ wireframe/prototype | 76% |
| Độ phủ code prototype | 69% |
| Độ sẵn sàng vận hành thật | 22% |

## 5. Những gì codebase hiện có thể tận dụng

- UI CRM và Service Request
- pipeline demo
- checklist/evidence prototype
- inventory UI cơ bản
- finance dashboard demo
- customer portal demo
- admin pages demo

## 6. Những gì chưa được xem là "đã xây xong"

- API/service/store thật
- role model `Giám sát thao tác thay kỹ thuật profile`
- task orchestration chuẩn cho Module B
- stage playbook thật
- stock ledger/reservation thật
- payment ledger/aftersales billing thật
- acceptance workflow thật
- Google Drive sync thật
- warranty/maintenance workflow thật
- audit transaction và UAT pilot hoàn chỉnh

## 7. 5 quyết định quan trọng của vòng review mới nhất

1. Không bắt buộc tạo `Customer` trước; có thể tạo `Service Request` trước.
2. `Giám sát` thao tác trên phần mềm thay `Kỹ thuật` ở phase hiện tại.
3. `Module B` phải hiểu là `Vận hành nội bộ`, không bó hẹp vào planning/task.
4. Quản lý ảnh/video/file phải có chiến lược `Google Drive` chi tiết.
5. `Warranty/Maintenance` phải gắn trực tiếp với `Finance`.

## 8. Khuyến nghị bước tiếp theo

Nếu tiếp tục triển khai sâu hơn, nên làm tiếp ngay:

1. Tách BA-V4 thành `Epic -> User Story -> Acceptance Criteria`
2. Tạo backlog kỹ thuật cho API contract theo ERD v4
3. Lập ma trận mapping `screen -> business rule -> entity -> UAT case`
