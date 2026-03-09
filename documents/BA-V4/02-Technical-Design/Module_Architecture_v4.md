# Kiến trúc module v4

## 1. Nguyên tắc chia module

Module trong V4 được chia theo `ownership dữ liệu`, `actor ra quyết định nghiệp vụ` và `điểm bàn giao liên phòng ban`, không chia theo menu hay màn hình.

Nguyên tắc bắt buộc:

1. `Service Request` là điểm khởi đầu CRM, không dùng `Customer` làm Kanban entity.
2. `Supervisor` là actor số chính của hiện trường ở giai đoạn hiện tại; `Worker` được quản lý dưới dạng `worker profile`.
3. `Google Drive` là lớp lưu trữ cloud, nhưng metadata và business permission phải do hệ thống BAC Group sở hữu.
4. `Warranty/Maintenance` không tách riêng khỏi tài chính; mọi case hậu mãi đều phải nhìn được financial impact.

## 2. Bản đồ module chuẩn

| Module | Sở hữu dữ liệu | Vai trò dùng chính | Kết quả đầu ra |
|---|---|---|---|
| Module A - CRM & Sales Orchestration | Customer, Service Request, Pipeline, Survey, Quotation, Contract | Admin, PM | Deal được chuẩn hóa, có thể đi từ khách mới hoặc khách cũ và đủ điều kiện tạo dự án |
| Module B - Vận hành nội bộ | Project, Project Assignment, Worker Profile, Workforce Assignment, Project Task, Stage Playbook, Handoff Rule, SLA | PM, Supervisor | Điều phối nội bộ theo vai trò, có task, bàn giao và trách nhiệm rõ ràng |
| Module C - Field Execution | Checklist, Evidence, Incident, Acceptance Draft, Site Report | Supervisor, PM | Tiến độ và chất lượng hiện trường được cập nhật có truy vết actor thực hiện thực tế |
| Module D - Inventory & Procurement | Material, Standard, Reservation, Stock Document, Purchase Request | Accountant, PM, Supervisor | Vật tư được lập kế hoạch, xuất kho, phát cho worker profile và đối soát được |
| Module E - Finance, Acceptance, Warranty & Maintenance | Payment Schedule, Transaction, Acceptance Record, Warranty Card, Warranty Case, Maintenance Visit, Aftersales Cost, Aftersales Billing | Accountant, PM, Supervisor, Customer Portal | Dòng tiền, nghiệm thu và hậu mãi được đóng vòng đời |
| Module F - Admin, Integration & Governance | User, Role, Notification, Audit, Integration Settings, File Governance, Google Drive Sync | Admin | Hệ thống được cấu hình, tích hợp và kiểm soát thống nhất |

## 3. Luồng tích hợp chuẩn giữa các module

### 3.1 Module A -> Module B

Sự kiện đầu vào:

- `Service Request Created` từ khách mới hoặc khách cũ
- `Duplicate Suggested / Confirmed`
- `Quotation Approved`
- `Contract Signed`
- `Fast-track Approved`

Kết quả:

- tạo hoặc tái sử dụng `Customer`
- khóa `Service Request` với pipeline/stage hợp lệ
- tạo `Project`
- sinh `Project Assignment` mặc định
- nạp `Stage Playbook`, `Task Template`, `Handoff Rule`
- nạp danh sách `worker profile` sơ bộ nếu đã biết tổ đội thi công

### 3.2 Module B -> Module D

Sự kiện:

- `Project Task Planned`
- `Material Requirement Confirmed`
- `Need Procurement`

Kết quả:

- tạo reservation vật tư theo project/task
- sinh đề nghị xuất kho hoặc đề nghị mua hàng
- chặn task chưa đủ điều kiện vật tư
- mở dashboard theo dõi thiếu hụt giữa kế hoạch và tồn thực tế

### 3.3 Module D -> Module C

Sự kiện:

- `Stock Document Approved`
- `Material Issued`
- `Material Delivered To Site`

Kết quả:

- `Supervisor` ký nhận trên hệ thống
- ghi nhận phát vật tư cho từng `worker profile` nếu cần
- mở khóa checklist/task thi công tương ứng
- ghi audit trail xuất kho, phát vật tư và người chịu trách nhiệm

### 3.4 Module C -> Module F

Sự kiện:

- `Evidence Captured`
- `Site Report Submitted`
- `Incident Raised`

Kết quả:

- lưu metadata file tại hệ thống
- đẩy file vào hàng đợi đồng bộ Google Drive
- cập nhật trạng thái `PENDING_SYNC`, `SYNCED`, `FAILED`
- lưu actor số là `Supervisor` và người thực hiện thực tế là `worker profile` nếu có

### 3.5 Module C -> Module E

Sự kiện:

- `Acceptance Draft Approved`
- `Project Completed`
- `Warranty/Maintenance Request Received`

Kết quả:

- tạo `Acceptance Record`
- kích hoạt thanh toán cuối
- phát hành `Warranty Card`
- mở `Warranty Case` hoặc `Maintenance Visit`
- ghi nhận chi phí hậu mãi và phát sinh tính phí nếu có

### 3.6 Module E -> Customer Portal

Sự kiện:

- `Portal Link Generated`
- `Approved Evidence Published`
- `Payment Milestone Published`
- `Warranty Activated`
- `Maintenance Schedule Published`

Kết quả:

- khách hàng chỉ thấy dữ liệu đã được công bố
- không lộ raw link Google Drive
- toàn bộ publish/revoke có log và token policy

## 4. Kiến trúc lớp ứng dụng đề xuất

### 4.1 Lớp giao diện

- Web Admin/PM/Accountant cho toàn bộ nghiệp vụ back-office
- Mobile-first Web cho `Supervisor`
- `Worker` chưa có tài khoản trực tiếp trong phase hiện tại; mọi tương tác số đi qua giao diện `Supervisor`
- Customer Portal chỉ đọc cho khách hàng

### 4.2 Lớp nghiệp vụ

- CRM service
- Internal operations orchestration service
- Task service
- Field execution service
- Inventory & procurement service
- Finance & receivable service
- Warranty & maintenance service
- File governance & Google Drive sync service
- Notification service
- Audit service

### 4.3 Lớp dữ liệu và tích hợp

- Database giao dịch chính
- File staging storage tạm thời
- Google Drive API qua service account/integration account
- SMS/Zalo/Email integration
- Report export và BI feed

## 5. Quyết định kiến trúc bắt buộc cho codebase

### 5.1 Không để UI quyết định business rule cuối

Hiện trạng code đang có nhiều rule nằm ở component. V4 yêu cầu:

- UI chỉ hiển thị điều kiện
- API/service mới là nơi xác nhận điều kiện cuối

Ví dụ:

- không hoàn thành task nếu checklist/evidence chưa đủ
- không mở task thi công nếu phiếu xuất kho chưa được Supervisor xác nhận
- không phát hành bảo hành nếu nghiệm thu chưa hợp lệ
- không publish file portal nếu sync Google Drive chưa thành công

### 5.2 Không coi Worker là user account trong phase hiện tại

Codebase phải phản ánh đúng mô hình:

- `Worker` là hồ sơ nguồn lực
- `Supervisor` là actor số thao tác trên phần mềm
- mọi thao tác hiện trường cần lưu cả:
  - người thao tác trên hệ thống
  - worker profile thực tế thực hiện công việc

Điều này ảnh hưởng trực tiếp tới:

- assignment
- evidence
- vật tư
- incident
- productivity report

### 5.3 Không dùng Google Drive làm nguồn sự thật nghiệp vụ

Google Drive chỉ là lớp lưu trữ file cloud. Hệ thống BAC Group phải sở hữu:

- metadata file
- phân quyền nghiệp vụ
- trạng thái sync
- version
- retention
- publish policy

### 5.4 Không tách warranty/maintenance khỏi tài chính

Mỗi case hậu mãi phải thấy được:

- nguồn phát sinh
- phân loại trong/ngoài bảo hành
- chi phí vật tư/nhân công/di chuyển
- khoản cần thu thêm
- trạng thái thanh toán

### 5.5 Không để hai admin shell độc lập cùng tồn tại dài hạn

`admin-v2` và `admin-app` phải được quy hoạch về một hướng duy nhất:

- hoặc hợp nhất vào app chính
- hoặc tách hẳn thành control plane và app chính chỉ consume config

Nhưng không được để hai hướng cùng sống lâu dài.

## 6. Backlog kiến trúc cần khóa trước khi dev tiếp

1. API contract cho các aggregate chính
2. State machine cho `Service Request`, `Project Task`, `Stock Document`, `Warranty Case`, `Aftersales Billing`
3. Actor model cho `Supervisor` và `worker profile`
4. File governance model và Google Drive sync queue
5. Financial impact model cho warranty/maintenance
6. Notification rule engine
7. Report data model

## 7. Kết luận

Kiến trúc V4 chuyển hệ thống từ:

- `nhiều page demo`

sang:

- `aggregate rõ`
- `workflow rõ`
- `actor rõ`
- `file governance rõ`
- `financial close loop rõ`
