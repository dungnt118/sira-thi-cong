# Kiến trúc module v4

## 1. Nguyên tắc chia module

Module trong V4 được chia theo `ownership dữ liệu` và `điểm ra quyết định nghiệp vụ`, không chia theo màn hình.

## 2. Bản đồ module chuẩn

| Module | Sở hữu dữ liệu | Vai trò dùng chính | Kết quả đầu ra |
|---|---|---|---|
| CRM & Sales | Customer, Service Request, Pipeline, Survey, Quotation, Contract | Admin, PM | Lead được chuẩn hóa và đủ điều kiện tạo dự án |
| Delivery Planning | Project, Project Assignment, Project Task, SLA | PM, Supervisor | Dự án có WBS/task rõ ràng |
| Field Execution | Checklist, Evidence, Incident, Acceptance, Site Report | Supervisor, Worker, PM | Tiến độ và chất lượng hiện trường được kiểm soát |
| Inventory | Material, Standard, Reservation, Stock Document | Accountant, PM, Worker | Vật tư đủ và được đối soát |
| Finance & Warranty | Payment Schedule, Transaction, Warranty, Maintenance | Accountant, PM, Customer Portal | Dòng tiền và hậu mãi được đóng vòng đời |
| Admin & Governance | User, Role, Notification, Audit, Settings | Admin | Hệ thống được cấu hình và kiểm soát |

## 3. Luồng tích hợp chuẩn giữa các module

### 3.1 CRM -> Delivery

Sự kiện:

- `Quotation Approved`
- `Contract Signed`
- `Fast-track Approved`

Kết quả:

- tạo `Project`
- sinh `Project Assignment` cơ bản
- tạo `Project Task` từ `Stage Playbook`
- nạp `Checklist Template` và `Material Standard`

### 3.2 Delivery -> Inventory

Sự kiện:

- `Project Task Planned`
- `Material Plan Confirmed`

Kết quả:

- tạo reservation vật tư
- sinh đề nghị xuất kho
- khóa task thi công nếu chưa đủ điều kiện vật tư

### 3.3 Inventory -> Execution

Sự kiện:

- `Stock Document Signed`

Kết quả:

- mở khóa các task/checklist liên quan
- ghi audit trail
- cập nhật tiến độ sẵn sàng thi công

### 3.4 Execution -> Finance

Sự kiện:

- `Acceptance Record Completed`
- `Project Completed`

Kết quả:

- kích hoạt đợt thanh toán cuối
- sinh phiếu bảo hành
- mở lịch bảo dưỡng

### 3.5 Finance -> Customer Portal

Sự kiện:

- `Portal Link Generated`
- `Approved Evidence Published`
- `Payment Schedule Published`
- `Warranty Issued`

Kết quả:

- khách hàng chỉ thấy dữ liệu đã được công bố
- mọi thay đổi đều có thể revoke hoặc audit

## 4. Kiến trúc lớp ứng dụng đề xuất

### 4.1 Lớp giao diện

- Web Admin/PM/Accountant
- Mobile-first Web cho Supervisor/Worker
- Public Portal cho khách hàng

### 4.2 Lớp nghiệp vụ

- CRM service
- Project orchestration service
- Task service
- Inventory service
- Finance service
- Warranty service
- Notification service
- Audit service

### 4.3 Lớp dữ liệu và tích hợp

- Database giao dịch chính
- File/object storage
- SMS/Zalo/Email integration
- Report export

## 5. Quyết định kiến trúc bắt buộc cho codebase

### 5.1 Không để UI quyết định business rule cuối

Hiện trạng code đang có nhiều rule nằm ở component. V4 yêu cầu:

- UI chỉ hiển thị điều kiện
- API/service mới là nơi xác nhận điều kiện cuối

Ví dụ:

- không hoàn thành task nếu evidence chưa đủ
- không mở task thi công nếu phiếu xuất kho chưa ký
- không tạo project nếu service request chưa đủ điều kiện

### 5.2 Không tách hai admin shell độc lập

`admin-v2` và `admin-app` phải được quy hoạch về một hướng duy nhất:

- hoặc hợp nhất vào app chính
- hoặc tách hẳn thành control plane và app chính chỉ consume config

Nhưng không được để hai hướng cùng sống lâu dài.

### 5.3 Không để route legacy làm baseline mới

Các route V2 cũ chỉ nên tồn tại tạm để tham chiếu. BA-V4 xem baseline mới là:

- `CRM theo Service Request`
- `Project theo Task orchestration`
- `Admin theo governance settings`

## 6. Backlog kiến trúc cần khóa trước khi dev tiếp

1. API contract cho các aggregate chính
2. State machine cho `Service Request`, `Project Task`, `Stock Document`, `Payment Schedule`
3. Event log/audit model
4. Notification rule engine
5. Report data model

## 7. Kết luận

Kiến trúc V4 chuyển hệ thống từ:

- `demo nhiều màn hình`

sang:

- `nền tảng có aggregate rõ`
- `workflow rõ`
- `giao dịch rõ`
- `dễ audit`

